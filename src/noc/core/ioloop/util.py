# ----------------------------------------------------------------------
# Various IOLoop utilities
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import asyncio
import logging
import threading
from collections.abc import Awaitable

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
        loop = self.new_loop
        try:
            # Cancel all tasks
            to_cancel = asyncio.all_tasks(loop)
            for task in to_cancel:
                task.cancel()
            if to_cancel:
                loop.run_until_complete(asyncio.gather(*to_cancel, return_exceptions=True))
            loop.run_until_complete(loop.shutdown_asyncgens())
            loop.run_until_complete(loop.shutdown_default_executor())
        finally:
            loop.close()
            self.new_loop = None
            asyncio._set_running_loop(self.prev_loop)
            self.prev_loop = None

    def get_loop(self) -> asyncio.AbstractEventLoop | None:
        return self.new_loop

    def __enter__(self):
        return self.get_context()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.drop_context()


_loops = threading.local()


def get_loop() -> asyncio.AbstractEventLoop:
    """
    Get the event loop for the current context.

    Returns the running event loop if there is one, otherwise the
    persistent event loop for the current thread, created on first use.

    Returns:
        The event loop for the current context.
    """
    try:
        return asyncio.get_running_loop()
    except RuntimeError:
        pass
    loop = getattr(_loops, "_loop", None)
    if loop is None or loop.is_closed():
        loop = asyncio.new_event_loop()
        _loops._loop = loop
    return loop


def run_sync[T](awaitable: Awaitable[T]) -> T:
    """
    Run an awaitable synchronously.

    If no event loop is running, create one using asyncio.run().
    Otherwise, execute the awaitable on the existing event loop.

    Args:
        awaitable: Awaitable to run on the event loop.

    Returns:
        Result of the awaitable.
    """

    async def run_awaitable() -> T:
        return await awaitable

    if asyncio._get_running_loop() is None:
        return asyncio.run(run_awaitable())

    with IOLoopContext() as loop:
        return loop.run_until_complete(run_awaitable())
