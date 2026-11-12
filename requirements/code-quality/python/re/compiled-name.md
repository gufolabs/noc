# Compiled regular expressions must use the `rx_` prefix

## Scope

Compiled regular expression objects.

## Requirement

Variable names storing compiled regular expression objects **MUST** start with the rx_ prefix and **MUST** use lowercase snake_case.

Compiled regular expression names **MUST** be written in lowercase.

Examples:

Valid:

```python
rx_mac = re.compile(...)
rx_ipv4 = re.compile(...)
rx_interface_name = re.compile(...)
```

Invalid:

```python
MAC_RE = re.compile(...)
mac_re = re.compile(...)
re_mac = re.compile(...)
RxMac = re.compile(...)
```

## Why?
The rx_ prefix makes compiled regular expression objects immediately recognizable during code review.

A consistent naming convention improves readability, simplifies code navigation, and distinguishes compiled regular expressions from pattern strings and other variables.