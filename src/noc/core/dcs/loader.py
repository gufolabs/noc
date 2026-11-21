# ----------------------------------------------------------------------
# Service loader
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import asyncio
import logging
from threading import Event, Lock, Thread

# NOC modules
from noc.core.ioloop.util import setup_asyncio

from .base import DCSBase, dcs_loader


class DCSRunner:
    DCS_NAME = "consul"

    def __init__(self) -> None:
        self.lock = Lock()
        self.thread: Thread | None = None
        self.loop: asyncio.BaseEventLoop | None = None
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
                self.logger.debug("Starting DCS %s", self.DCS_NAME)
                try:
                    dcs_cls = dcs_loader[self.DCS_NAME]
                except KeyError as e:
                    raise ValueError(f"Unknown DCS handler: {self.DCS_NAME}") from e
                self.dcs = dcs_cls(self)
                self.loop.call_soon_threadsafe(self.loop.create_task, self.dcs.start())
            return self.dcs

    def _runner(self):
        self.logger.debug("Starting DCS runner thread")
        setup_asyncio()
        self.loop = asyncio.get_event_loop()
        self.ready_event.set()
        self.loop.run_forever()
        self.logger.debug("Stopping DCS runner thread")


runner = DCSRunner()


def get_dcs() -> DCSBase:
    return runner.get_dcs()
