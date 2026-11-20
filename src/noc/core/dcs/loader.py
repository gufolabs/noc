# ----------------------------------------------------------------------
# Service loader
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import asyncio
import logging
from collections.abc import Awaitable
from threading import Event, Lock, Thread, get_ident
from typing import Any

# NOC modules
from noc.config import config
from noc.core.ioloop.util import setup_asyncio

from .base import DCSBase, dcs_loader


class DCSRunner:
    def __init__(self) -> None:
        self.lock = Lock()
        self.thread: Thread | None = None
        self.loop: asyncio.BaseEventLoop | None = None
        self.url = f"consul://{config.consul.host}:{config.consul.port}/{config.consul.base}"
        self.dcs: DCSBase | None = None
        self.ready_event = Event()
        self.logger = logging.getLogger()

    def get_dcs(self) -> DCSBase:
        with self.lock:
            if self.dcs is None:
                if not self.thread:
                    # Run separate DCS thread
                    self.thread = Thread(name="dcs", target=self._runner)
                    self.thread.daemon = True
                    self.thread.start()
                    self.ready_event.wait()
                    self.logger.debug("DCS runner thread is ready")
                if self.loop is None:
                    raise RuntimeError("DCS runner event loop is not initialized")
                self.logger.debug("Starting DCS %s", self.url)
                scheme = self.url.split(":", 1)[0]
                try:
                    dcs_cls = dcs_loader[scheme]
                except KeyError as e:
                    raise ValueError(f"Unknown DCS handler: {scheme}") from e
                self.dcs = dcs_cls(self, self.url)
                self.loop.call_soon_threadsafe(self.loop.create_task, self.dcs.start())
            return self.dcs

    def _runner(self):
        self.logger.debug("Starting DCS runner thread")
        setup_asyncio()
        self.loop = asyncio.get_event_loop()
        self.ready_event.set()
        self.loop.run_forever()
        self.logger.debug("Stopping DCS runner thread")

    async def trampoline(self, aw: Awaitable) -> Any:
        """
        Trampoline awaitable to dedicated loop
        Returns:
            Result of trampoline awaitable to dedicated loop.
        """

        async def thunk():
            try:
                r = await aw
                loop.call_soon_threadsafe(future.set_result, r)
            except Exception as e:
                loop.call_soon_threadsafe(future.set_exception, e)

        is_same_thread = not self.thread or self.thread.ident == get_ident()
        if is_same_thread:
            return await aw
        # Trampoline to proper thread
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        runner_loop = self.loop
        if runner_loop is None:
            raise RuntimeError("DCS runner event loop is not initialized")
        runner_loop.call_soon_threadsafe(runner_loop.create_task, thunk())
        return await future


runner = DCSRunner()


def get_dcs() -> DCSBase:
    return runner.get_dcs()
