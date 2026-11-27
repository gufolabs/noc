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
import contextlib
import logging
import os
import random
import signal
import threading
from abc import ABC, abstractmethod
from collections.abc import Iterator
from time import perf_counter
from typing import Any

# Third-party modules
from gufo.loader import Loader

# NOC modules
from noc.config import config
from noc.core.ioloop.timers import PeriodicCallback
from noc.core.ioloop.util import get_loop, run_sync
from noc.core.perf import metrics


class ResolutionError(Exception):
    pass


class DCSTripwireError(RuntimeError):
    """Raised when a DCS operation is attempted while the tripwire is active."""


class DCSBase(ABC):
    """
    Base class for distributed coordinated storage implementations.

    Owns the process-wide set of service resolvers. A dedicated runner
    thread and event loop are started lazily, on the first request that
    needs a long-lived (tracked) resolver. Every other operation is a
    plain coroutine expected to run on the caller's event loop, or on a
    temporary loop created by :func:`noc.core.ioloop.util.run_sync`.
    """

    # Resolver class
    resolver_cls: type[ResolverBase] = None  # type: ignore[assignment]
    # HTTP code to be returned by /health endpoint when service is healthy
    HEALTH_OK_HTTP_CODE = 200
    # HTTP code to be returned by /health endpoint when service is unhealthy
    # and must be temporary removed from resolver
    HEALTH_FAILED_HTTP_CODE = 429
    # Active tripwire message, None when the tripwire is disabled
    _tripwire: str | None = None

    @classmethod
    def enter_tripwire(cls, message: str = "DCS access is forbidden in this context") -> None:
        """
        Enter tripwire mode.

        All DCS operations performed while the tripwire is active raise
        :class:`DCSTripwireError`. Used to enforce invariants such as
        "module imports must not perform service resolution".

        Args:
            message: Error message describing the forbidden context.
        """
        if DCSBase._tripwire is not None:
            raise RuntimeError("DCS tripwire is already active")
        DCSBase._tripwire = message

    @classmethod
    def exit_tripwire(cls) -> None:
        """
        Exit tripwire mode.
        """
        DCSBase._tripwire = None

    @classmethod
    def in_tripwire(cls) -> bool:
        """
        Check whether the tripwire is currently active.

        Returns:
            True when the tripwire is active.
        """
        return DCSBase._tripwire is not None

    @classmethod
    @contextlib.contextmanager
    def tripwire(cls, message: str = "DCS access is forbidden in this context") -> Iterator[None]:
        """
        Context manager for tripwire mode.

        Any DCS operation attempted within the context raises
        :class:`DCSTripwireError`. The tripwire is guaranteed to be
        released even when the context body raises.

        Args:
            message: Error message describing the forbidden context.

        Yields:
            Nothing.
        """
        cls.enter_tripwire(message)
        try:
            yield
        finally:
            cls.exit_tripwire()

    def _assert_not_blocked(self) -> None:
        """
        Raise :class:`DCSTripwireError` when the tripwire is active.
        """
        if self._tripwire is not None:
            raise DCSTripwireError(self._tripwire)

    def __init__(self) -> None:
        self.logger = logging.getLogger(__name__)
        # Dedicated runner thread and event loop for tracked resolvers.
        # Started lazily on first use (see :meth:`_ensure_runner_thread`).
        self.thread: threading.Thread | None = None
        self.loop: asyncio.AbstractEventLoop | None = None
        self._thread_lock = threading.Lock()
        # service -> resolver instances
        self.resolvers: dict[tuple[str, bool, bool], ResolverBase] = {}
        self.resolvers_lock = threading.Lock()
        self.resolver_expiration_task: PeriodicCallback | None = None
        self.health_check_service_id: str | None = None
        self.status: bool = True
        self.status_message: str = ""

    # ------------------------------------------------------------------
    # Runner thread management
    # ------------------------------------------------------------------
    def _ensure_runner_thread(self) -> asyncio.AbstractEventLoop:
        """
        Start the dedicated runner thread and event loop on first use.

        Returns:
            The runner event loop.
        """
        with self._thread_lock:
            if self.loop is None:
                self.logger.debug("Starting DCS runner thread")
                ready = threading.Event()
                self.thread = threading.Thread(
                    name="dcs", target=self._runner, args=(ready,), daemon=True
                )
                self.thread.start()
                ready.wait()
                assert self.loop is not None
                # Start background tasks on the runner loop
                self.loop.call_soon_threadsafe(self.loop.create_task, self.start())
        assert self.loop is not None
        return self.loop

    def _runner(self, ready: threading.Event) -> None:
        """
        Entry point of the dedicated runner thread.
        """
        self.loop = get_loop()
        ready.set()
        self.loop.run_forever()
        self.logger.debug("Stopping DCS runner thread")

    def _is_runner_thread(self) -> bool:
        """
        Determine whether the current thread owns the DCS runner event loop.

        Returns:
            True when running on the DCS runner thread.
        """
        return self.thread is None or self.thread.ident == threading.get_ident()

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------
    async def start(self) -> None:
        """
        Start all pending background tasks on the runner loop.
        """
        self.resolver_expiration_task = PeriodicCallback(self.expire_resolvers, 10000)
        self.resolver_expiration_task.start()

    # ------------------------------------------------------------------
    # Service registration
    # ------------------------------------------------------------------
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
    ) -> bool:
        """
        Register service.

        Args:
            name: Service name.
            address: Service address.
            port: Service port.
            pool: Service pool. Appended to the service name.
            lock: Leader lock to acquire before registration.
            tags: List of extra tags.
            check_interval: DCS check interval, seconds.
            check_timeout: DCS check timeout, seconds.

        Returns:
            True if the service was registered successfully, False otherwise.
        """
        ...

    def kill(self) -> None:
        self.logger.info("Shooting self with SIGTERM")
        os.kill(os.getpid(), signal.SIGTERM)

    # ------------------------------------------------------------------
    # Slot management
    # ------------------------------------------------------------------
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

    # ------------------------------------------------------------------
    # Resolution
    # ------------------------------------------------------------------
    def get_resolver(
        self, name: str, critical: bool = False, near: bool = False, track: bool = True
    ) -> ResolverBase:
        """
        Get or create a resolver for the given service.

        For tracked resolvers a single long-lived instance is cached and
        started on the running loop. For one-time (track=False) resolvers
        a fresh instance is created on every call.

        Args:
            name: Service name.
            critical: Mark resolver as critical.
            near: Resolve nearby instances.
            track: Keep a long-lived resolver that tracks changes.

        Returns:
            The resolver instance.
        """

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

    def iter_resolver_services(
        self, name: str, critical: bool = False, near: bool = False
    ) -> Iterator[tuple[str, str]]:
        """
        Iterate the instance catalog of the tracked resolver.

        Args:
            name: Service name.
            critical: Resolver critical flag.
            near: Resolver near flag.

        Yields:
            Tuple of instance ID and address. Nothing when no tracked
            resolver is running for the service.
        """
        with self.resolvers_lock:
            resolver = self.resolvers.get((name, critical, near))
        if resolver is None:
            return
        yield from resolver.services.items()

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
        """
        Resolve a service to an address (or a list of addresses).

        Tracked resolutions (track=True) always run on the dedicated
        runner loop, so the resolver can keep tracking changes in the
        background. When called from another loop the call is trampolined
        there. One-time resolutions (track=False) simply run on the
        caller's current loop.

        Args:
            name: Service name.
            hint: Preferred address, returned as-is when it is active.
            wait: Wait until the service catalog is populated.
            timeout: Resolution timeout in seconds.
            full_result: Return all addresses instead of a single one.
            critical: Mark resolution as critical for health reporting.
            near: Resolve nearby instances.
            track: Keep a long-lived resolver that tracks changes.

        Returns:
            Resolved address or list of addresses.
        """
        self._assert_not_blocked()

        async def wrap() -> str | list[str]:
            resolver = self.get_resolver(name, critical=critical, near=near, track=track)
            return await resolver.resolve(
                hint=hint, wait=wait, timeout=timeout, full_result=full_result
            )

        if not track:
            return await wrap()

        runner_loop = self._ensure_runner_thread()
        if self._is_runner_thread():
            return await wrap()

        # Trampoline to the dedicated runner loop
        caller_loop = asyncio.get_running_loop()
        future = caller_loop.create_future()

        async def thunk() -> None:
            try:
                r = await wrap()
                caller_loop.call_soon_threadsafe(future.set_result, r)
            except Exception as e:
                caller_loop.call_soon_threadsafe(future.set_exception, e)

        runner_loop.call_soon_threadsafe(runner_loop.create_task, thunk())
        return await future

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
        Resolve a service from a synchronous context.

        Args:
            name: Service name.
            hint: Preferred address, returned as-is when it is active.
            wait: Wait until the service catalog is populated.
            timeout: Resolution timeout in seconds.
            full_result: Return all addresses instead of a single one.

        Returns:
            Resolved address or list of addresses.
        """
        self._assert_not_blocked()
        return run_sync(
            self.resolve(name, hint=hint, wait=wait, timeout=timeout, full_result=full_result)
        )

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


DCS_NAME = "consul"

dcs_loader = Loader[type[DCSBase]](
    bases=config.iter_customized_bases("noc.core.dcs"), exclude=("base",)
)

# Process-wide DCS instance. The concrete implementation is chosen by
# name (see DCS_NAME) and the instance is created lazily on first access,
# exposed through the module-level ``dcs`` attribute (see __getattr__).
dcs: DCSBase
_dcs_instance: DCSBase | None = None
_dcs_lock = threading.Lock()


def _init_dcs() -> DCSBase:
    """
    Create and cache the process-wide DCS instance.

    Returns:
        The shared DCSBase instance.
    """
    global _dcs_instance
    with _dcs_lock:
        if _dcs_instance is None:
            try:
                dcs_cls = dcs_loader[DCS_NAME]
            except KeyError as e:
                raise ValueError(f"Unknown DCS handler: {DCS_NAME}") from e
            _dcs_instance = dcs_cls()
        return _dcs_instance


def __getattr__(name: str) -> Any:
    """
    Lazily expose the process-wide ``dcs`` singleton.
    """
    if name == "dcs":
        return _init_dcs()
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
