# Async timeout parameter

## Scope

Python async functions that accept a `timeout` parameter.

## Requirements

A process API is a function that handles a request arriving from a different process, whether the request originates from another NOC service or from an external source.

An async function **MAY** accept a `timeout` parameter only when:

- the function is a process API; and
- the parameter value is forwarded to an outgoing API call or a third-party library function.

When an async function accepts a `timeout` parameter, the value **MUST** be forwarded unchanged to the outgoing call and **MUST NOT** be split, extended, or otherwise reinterpreted.

In all other cases, an async function **MUST NOT** accept a `timeout` parameter.

Examples (illustrative):

Valid:

```python
async def send_to_api(payload: bytes, timeout: float) -> int:
    # Pass-through to an outgoing third-party API call.
    return await external_client.send(payload, timeout=timeout)
```

Invalid:

```python
async def fetch(url: str, timeout: float) -> bytes:
    # Propagating a timeout through the internal call chain.
    return await client.get(url, timeout=timeout)
```

## Why?

A `timeout` parameter passed down through internal call chains shifts the responsibility for deadline management to every caller, making it harder to reason about overall request latency and to change a timeout in one place.

Limiting the parameter to pass-through boundaries preserves a single owner for each deadline and keeps internal code free of timeout propagation.
