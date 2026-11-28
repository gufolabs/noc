# Async timeout mechanism

## Scope

Python async code that must enforce a timeout on an awaited operation.

## Requirements

When a timeout must be enforced in async code, the `asyncio.timeout()` pattern **MUST** be used.

Manual deadline management, such as computing a deadline and comparing it against the event loop clock or scheduling a separate cancellation timer, **MUST NOT** be used.

Example:

```python
async def fetch(url: str) -> bytes:
    async with asyncio.timeout(5):
        return await client.get(url)
```

## Why?

The `asyncio.timeout()` pattern is the established structured-concurrency mechanism for deadlines in NOC Python code.

It keeps the deadline local to the function that owns the operation, ties cancellation to the surrounding task structure, and ensures deterministic cleanup without manual timer management.
