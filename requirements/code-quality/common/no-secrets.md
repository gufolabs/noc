# No Secrets in Source Code

## Scope

All source code, configuration files and other text files stored in the project repository.

## Requirements

Source code and project files **MUST NOT** contain passwords, private keys, access tokens, credentials or other confidential information.

Secrets **MUST** be stored outside the source repository using appropriate secret management mechanisms.

## Why?

Embedding secrets into the source repository creates security risks and complicates credential rotation.

Separating secrets from source code improves the security of both development and production environments.