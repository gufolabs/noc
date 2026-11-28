# Async timeout handling

## Scope

Python async functions that accept a timeout parameter.

## Requirement

An async function **MAY** accept a `timeout` parameter only in the following cases:

- the function is a public or external API method;
- the parameter value **MUST** be forwarded unchanged to an outgoing API call or to a third-party library function.

In all other cases, a `timeout` parameter **MUST NOT** be used.

A timeout **MUST** be enforced inside the function by wrapping the awaited operation in `asyncio.timeout()`.

Examples:

Valid:

```python
import asyncio


async def fetch(url: str) -> bytes:
    async with asyncio.timeout(5):
        return await client.get(url)


async def send_to_api(payload: bytes, timeout: float) -> int:
    # Pass-through to an outgoing third-party API call.
    return await external_client.send(payload, timeout=timeout)
```

Invalid:

```python
import asyncio


async def fetch(url: str, timeout: float) -> bytes:
    # Propagating a timeout through the internal call chain.
    return await client.get(url, timeout=timeout)


async def process(item: Item, timeout: float) -> None:
    # Manual deadline management instead of asyncio.timeout().
    deadline = asyncio.get_running_loop().time() + timeout
    ...
```

## Why?

A `timeout` parameter passed down through internal call chains shifts the responsibility for deadline management to every caller, making it harder to reason about overall request latency and to change a timeout in one place.

`asyncio.timeout()` keeps the deadline local to the function that owns the operation, integrates cancellation with the task structure, and prevents timeouts from being silently dropped or forgotten by intermediate layers.

The accepted exception is a public API that forwards the parameter unchanged to an outgoing API call or third-party library, where the caller legitimately controls the deadline.
