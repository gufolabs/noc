# ----------------------------------------------------------------------
# Distributed coordinated storage
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Future imports
from __future__ import annotations

# Python modules
import asyncio
import logging
import os
import random
import signal
import threading
from abc import ABC, abstractmethod
from time import perf_counter
from typing import TYPE_CHECKING

# Third-party modules
from gufo.loader import Loader

# NOC modules
from noc.config import config
from noc.core.ioloop.timers import PeriodicCallback
from noc.core.ioloop.util import run_sync
from noc.core.perf import metrics

if TYPE_CHECKING:
    from .loader import DCSRunner


class ResolutionError(Exception):
    pass


class DCSBase(ABC):
    # Resolver class
    resolver_cls: type[ResolverBase] = None  # type: ignore[assignment]
    # HTTP code to be returned by /health endpoint when service is healthy
    HEALTH_OK_HTTP_CODE = 200
    # HTTP code to be returned by /health endpoint when service is unhealthy
    # and must be temporary removed from resolver
    HEALTH_FAILED_HTTP_CODE = 429

    def __init__(self, runner: DCSRunner) -> None:
        self.runner = runner
        self.logger = logging.getLogger(__name__)
        # service -> resolver instances
        self.resolvers: dict[tuple[str, bool, bool], ResolverBase] = {}
        self.resolvers_lock = threading.Lock()
        self.resolver_expiration_task: PeriodicCallback | None = None
        self.health_check_service_id: str | None = None
        self.status: bool = True
        self.status_message: str = ""

    async def start(self) -> None:
        """
        Start all pending tasks
        Returns:
            Result of start all pending tasks.
        """
        self.resolver_expiration_task = PeriodicCallback(self.expire_resolvers, 10000)
        self.resolver_expiration_task.start()

    def stop(self) -> None:
        """
        Stop all pending tasks
        Returns:
            Result of stop all pending tasks.
        """
        if self.resolver_expiration_task:
            self.resolver_expiration_task.stop()
            self.resolver_expiration_task = None
        # Stop all resolvers
        with self.resolvers_lock:
            for svc in self.resolvers:
                r = self.resolvers[svc]
                self.logger.info("Stopping resolver for service %s", svc)
                r.stop()
            self.resolvers = {}

    @abstractmethod
    async def register(
        self,
        name: str,
        address: str,
        port: int,
        pool: str | None = None,
        lock: str | None = None,
        tags: list[str] | None = None,
        check_interval: int | None = None,
        check_timeout: int | None = None,
    ):
        """
        Register service
        Args:
            tags: List of extra tags
            check_interval: DCS Check Interval
            check_timeout: DCS Check Timeout
        Returns:
            Result of register service.
        """
        ...

    def kill(self) -> None:
        self.logger.info("Shooting self with SIGTERM")
        os.kill(os.getpid(), signal.SIGTERM)

    @abstractmethod
    async def get_slot_limit(self, name: str) -> int | None:
        """
        Return the current limit for given slot
        Returns:
            Result of return the current limit for given slot.
        """
        ...

    @abstractmethod
    async def set_slot_limit(self, name: str, limit: int) -> None:
        """
        Set limits for given slot.

        Remove slot if limit is zero.

        Args:
            name: Slot name.
            limit: New limit.
        """
        ...

    @abstractmethod
    async def acquire_slot(self, name: str, limit: int) -> tuple[int, int]:
        """
        Acquire shard slot
        Args:
            name: <service name>-<pool>
            limit: Configured limit
        Returns:
            (slot number, number of instances)
        """
        ...

    async def get_resolver(
        self, name: str, critical: bool = False, near: bool = False, track: bool = True
    ) -> ResolverBase:
        def run_resolver(res: ResolverBase) -> None:
            loop = asyncio.get_running_loop()
            loop.call_soon(loop.create_task, res.start())

        if track:
            with self.resolvers_lock:
                resolver = self.resolvers.get((name, critical, near))
                if not resolver:
                    self.logger.info("Running resolver for service %s", name)
                    resolver = self.resolver_cls(self, name, critical=critical, near=near)
                    self.resolvers[name, critical, near] = resolver
                    run_resolver(resolver)
        else:
            # One-time resolver
            resolver = self.resolver_cls(self, name, critical=critical, near=near, track=False)
            run_resolver(resolver)
        return resolver

    async def resolve(
        self,
        name: str,
        hint: str | None = None,
        wait: bool = True,
        timeout: float | None = None,
        full_result: bool = False,
        critical: bool = False,
        near: bool = False,
        track: bool = True,
    ) -> str | list[str]:
        async def wrap() -> str | list[str]:
            resolver = await self.get_resolver(name, critical=critical, near=near, track=track)
            return await resolver.resolve(
                hint=hint, wait=wait, timeout=timeout, full_result=full_result
            )

        aw = wrap()
        if self.is_same_thread():
            return await aw
        # Trampoline to the dedicated runner loop
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        runner_loop = self.runner.loop
        if runner_loop is None:
            raise RuntimeError("DCS runner event loop is not initialized")

        async def thunk() -> None:
            try:
                r = await aw
                loop.call_soon_threadsafe(future.set_result, r)
            except Exception as e:
                loop.call_soon_threadsafe(future.set_exception, e)

        runner_loop.call_soon_threadsafe(runner_loop.create_task, thunk())
        return await future

    def is_same_thread(self) -> bool:
        """
        Determine whether the current thread owns the DCS runner event loop.

        Returns:
            True when running on the DCS runner thread.
        """
        return not self.runner.thread or self.runner.thread.ident == threading.get_ident()

    async def expire_resolvers(self) -> None:
        with self.resolvers_lock:
            for svc in list(self.resolvers):
                r = self.resolvers[svc]
                if r.is_expired():
                    self.logger.info("Stopping expired resolver for service %s", svc)
                    r.stop()
                    del self.resolvers[svc]

    def resolve_sync(
        self,
        name: str,
        hint: str | None = None,
        wait: bool = True,
        timeout: float | None = None,
        full_result: bool = False,
    ) -> str | list[str]:
        """
        Returns *hint* when service is active or new service
        instance,
        Returns:
            Result of returns *hint* when service is active or new service.
        """

        async def _resolve():
            return await self.resolve(
                name, hint=hint, wait=wait, timeout=timeout, full_result=full_result
            )

        return run_sync(_resolve())

    @abstractmethod
    async def resolve_near(
        self,
        name: str,
        hint: str | None = None,
        wait: bool = True,
        timeout: float | None = None,
        full_result: bool = False,
        critical: bool = False,
    ) -> list[str]:
        """
        Synchronous call to resolve nearby service
        Commonly used for external services like databases
        Args:
            name: Service name
        Returns:
            address:port
        """
        ...

    def get_status(self) -> tuple[int, str]:
        if self.status:
            return self.HEALTH_OK_HTTP_CODE, "OK"
        return self.HEALTH_FAILED_HTTP_CODE, self.status_message

    def set_faulty_status(self, message: str) -> None:
        if self.status or self.status_message != message:
            self.logger.info("Set faulty status to: %s", message)
            self.status = False
            self.status_message = message

    def clear_faulty_status(self) -> None:
        if not self.status:
            self.logger.info("Clearing faulty status")
            self.status = True
            self.status_message = ""


class ResolverBase(ABC):
    def __init__(
        self,
        dcs: DCSBase,
        name: str,
        critical: bool = False,
        near: bool = False,
        track: bool = True,
    ) -> None:
        self.dcs = dcs
        self.name = name
        self.to_shutdown = False
        self.logger = self.dcs.logger
        self.services: dict[str, str] = {}
        self.service_ids: list[str] = []
        self.service_addresses: set[str] = set()
        self.lock = threading.Lock()
        self.policy = self.policy_random
        self.rr_index = -1
        self.critical = critical
        self.near = near
        self.is_ready = False
        self.thread_id = threading.get_ident()
        self.ready_event_async = asyncio.Event()
        self.ready_event_sync = threading.Event()
        self.track = track
        self.last_used = perf_counter()

    def stop(self) -> None:
        self.to_shutdown = True
        metrics["dcs_resolver_activeservices", ("name", self.name)] = 0

    @abstractmethod
    async def start(self) -> None:
        """
        Start the resolver background loop.
        """
        ...

    def set_services(self, services: dict[str, str]) -> None:
        """
        Update actual list of services
        Args:
            services: dict of service_id -> <address>:<port>
        Returns:
            Result of update actual list of services.
        """
        if self.to_shutdown:
            return
        with self.lock:
            if self.critical:
                if services:
                    self.dcs.clear_faulty_status()
                else:
                    self.dcs.set_faulty_status(f"No active services {self.name}")
            self.services = services
            self.service_ids = sorted(services.keys())
            self.service_addresses = set(services.values())
            if self.services:
                self.logger.info(
                    "[%s] Set active services to: %s",
                    self.name,
                    ", ".join(f"{i}: {self.services[i]}" for i in self.services),
                )
                self.set_ready()
            else:
                self.logger.info("[%s] No active services", self.name)
                self.clear_ready()
            metrics["dcs_resolver_activeservices", ("name", self.name)] = len(self.services)

    def set_ready(self) -> None:
        self.is_ready = True
        self.ready_event_async.set()
        self.ready_event_sync.set()

    def clear_ready(self) -> None:
        self.is_ready = False
        self.ready_event_async.clear()
        self.ready_event_sync.clear()

    def is_same_thread(self) -> bool:
        return self.thread_id == threading.get_ident()

    async def _wait_for_services_async(self, timeout: float | None) -> None:
        try:
            await asyncio.wait_for(
                self.ready_event_async.wait(), timeout or config.dcs.resolution_timeout
            )
        except TimeoutError:
            metrics["errors", ("type", "dcs_resolver_timeout")] += 1
            if self.critical:
                self.dcs.set_faulty_status(f"Failed to resolve {self.name}: Timeout")
            raise ResolutionError()

    def _wait_for_services_sync(self, timeout: float | None) -> None:
        if not self.ready_event_sync.wait(timeout):
            metrics["errors", ("type", "dcs_resolver_timeout")] += 1
            if self.critical:
                self.dcs.set_faulty_status(f"Failed to resolve {self.name}: Timeout")
            raise ResolutionError()

    async def _wait_for_services(self, timeout: float | None = None) -> None:
        if self.is_same_thread():
            await self._wait_for_services_async(timeout)
        else:
            self._wait_for_services_sync(timeout)

    async def resolve(
        self,
        hint: str | None = None,
        wait: bool = True,
        timeout: float | None = None,
        full_result: bool = False,
    ) -> str | list[str]:
        self.last_used = perf_counter()
        metrics["dcs_resolver_requests"] += 1
        if not self.services and wait:
            # Wait until service catalog populated
            await self._wait_for_services(timeout)
        if not wait and not self.is_ready:
            if self.critical:
                self.dcs.set_faulty_status(f"Failed to resolve {self.name}: No active services")
            raise ResolutionError()
        with self.lock:
            if hint and hint in self.service_addresses:
                location: str | list[str] = hint
                metrics["dcs_resolver_hints"] += 1
            elif full_result:
                location = list(self.services.values())
            else:
                location = self.services[self.policy()]
        metrics["dcs_resolver_success"] += 1
        if self.critical:
            self.dcs.clear_faulty_status()
        return location

    def policy_random(self) -> str:
        """
        Randomly select service
        Returns:
            Result of randomly select service.
        """
        return random.choice(self.service_ids)

    def policy_rr(self) -> str:
        """
        Round-robin selection of service
        Returns:
            Result of round-robin selection of service.
        """
        self.rr_index = min(self.rr_index + 1, len(self.service_ids) - 1)
        return self.service_ids[self.rr_index]

    def is_expired(self) -> bool:
        """
        Check if resolver is no longer used and may be expired
        Returns:
            Result of check if resolver is no longer used and may be expired.
        """
        return perf_counter() - self.last_used > config.dcs.resolver_expiration_timeout


dcs_loader = Loader[type[DCSBase]](
    bases=config.iter_customized_bases("noc.core.dcs"), exclude=("base", "loader")
)
