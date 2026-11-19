# ----------------------------------------------------------------------
# Various IOLoop utilities
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import asyncio
import logging
from collections.abc import Callable

logger = logging.getLogger(__name__)


class IOLoopContext:
    def __init__(self) -> None:
        self.prev_loop = None
        self.new_loop = None

    def get_context(self):
        self.prev_loop = asyncio._get_running_loop()
        self.new_loop = asyncio.new_event_loop()
        if self.prev_loop:
            # Reset running loop
            asyncio._set_running_loop(None)
        return self.new_loop

    def drop_context(self):
        # Cancel all tasks
        to_cancel = asyncio.all_tasks(self.new_loop)
        for task in to_cancel:
            task.cancel()
        asyncio.gather(*to_cancel, return_exceptions=True)
        self.new_loop.run_until_complete(self.new_loop.shutdown_asyncgens())
        self.new_loop.close()
        self.new_loop = None
        asyncio._set_running_loop(self.prev_loop)
        if not self.prev_loop:
            asyncio.get_event_loop_policy().reset_called()
        self.prev_loop = None

    def get_loop(self) -> asyncio.AbstractEventLoop | None:
        return self.new_loop

    def __enter__(self):
        return self.get_context()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.drop_context()


def run_sync[T](cb: Callable[[], T]) -> T:
    """
    Run callable on dedicated IOLoop in safe manner
    and return result or raise error

    Args:
        cb: Callable to be runned on IOLoop

    Returns:
        Callable result
    """
    if not _setup_completed:
        setup_asyncio()

    with IOLoopContext() as loop:
        return loop.run_until_complete(cb())


_setup_completed = False


def setup_asyncio() -> None:
    """
    Initial setup of asyncio

    Returns:
        Result of initial setup of asyncio.
    """
    global _setup_completed

    if _setup_completed:
        return
    logger.debug("Setting up asyncio event loop policy")
    logger.debug("Setting up default event loop")
    asyncio.set_event_loop_policy(NOCEventLoopPolicy())
    _setup_completed = True


class NOCEventLoopPolicy(asyncio.DefaultEventLoopPolicy):
    def get_event_loop(self) -> asyncio.AbstractEventLoop:
        try:
            return super().get_event_loop()
        except RuntimeError:
            loop = self.new_event_loop()
            self.set_event_loop(loop)
            return loop

    def reset_called(self) -> None:
        """
        Reset called status
        Returns:
            Result of reset called status.
        """
        setattr(getattr(self, "_local"), "_set_called", False)
