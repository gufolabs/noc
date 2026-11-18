# ----------------------------------------------------------------------
# Various IOLoop utilities
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import asyncio
from collections.abc import Callable


class IOLoopContext:
    def __init__(self, suppress_trace=False) -> None:
        self.prev_loop = None
        self.new_loop = None
        self.suppress_trace = suppress_trace

    def get_context(self):
        self.prev_loop = asyncio._get_running_loop()
        self.new_loop = asyncio.EventLoop()
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
        self.prev_loop = None

    def get_loop(self) -> asyncio.AbstractEventLoop | None:
        return self.new_loop

    def __enter__(self):
        return self.get_context()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.drop_context()
        if self.suppress_trace:
            return True


def run_sync[T](cb: Callable[[], T]) -> T:
    """
    Run callable on dedicated IOLoop in safe manner
    and return result or raise error

    Args:
        cb: Callable to be runned on IOLoop

    Returns:
        Callable result
    """
    with IOLoopContext() as loop:
        return loop.run_until_complete(cb())
