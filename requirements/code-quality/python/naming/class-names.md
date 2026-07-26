# Python class names must use CamelCase

## Scope

Python class names.

## Requirement

Class names **MUST** use CamelCase without underscores.

Abbreviations in class names MUST preserve their conventional capitalization.

Abbreviations **MUST NOT** be converted into mixed-case words.

Examples:

Valid:

```python
class UserProfile:
    pass

class IPv4Address:
    pass

class HTTPClient:
    pass

class SNMPv3Client:
    pass
```

Invalid:
```
class user_profile:
    pass

class Ipv4Address:
    pass

class HttpClient:
    pass
```

## Why?

Consistent class naming improves readability and allows developers to quickly identify classes in the source code.

Preserving standard abbreviation capitalization keeps names aligned with established technical terminology.