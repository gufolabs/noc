# Config Fetching

`Fetching` is the process of retrieving device configuration.
Performed by [config check](../discovery-reference/box/config.md) of [box discovery](../discovery-reference/box/index.md).
According to the `Config Policy` setting in [Managed Object Profile](../concepts/managed-object-profile/index.md) two methods can be used:

- Script
- Download from external storage

## Fetching via script

The [get_config](../scripts-reference/get_config.md) script for the target platform is necessary. It is usually implemented as a complementary script alongside [get_version](../scripts-reference/get_version.md).

## Fetching from external storage

`Discovery` can download configuration from [External Storage](../concepts/external-storage/index.md). This assumes the configuration supplied to storage via external process: device uploads config by itself or some third-party system (like RANCID), handles all complex logic on its own. Fetching from external storage is the integrated feature of `Discovery` and provided out-of-the box.
