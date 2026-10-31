# [api] section

API configuration.

## listen

API listen address in form `<address>:<port>`, where `<address>` is one of:

* `auto` - use hostname to detect address.
* interface name, like `eth0`
* IP address.

{{ config_param("api.listen") }}

The former `listen` parameter is deprecated and will be removed in NOC 27.
Use `api.listen` in YAML configuration and `NOC_API_LISTEN` in environment
configuration. `listen` and `NOC_LISTEN` remain available during the
deprecation period.

## backlog

Maximum number of pending connections in the listener queue.

{{ config_param("api.backlog") }}
