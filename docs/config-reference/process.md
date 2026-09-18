# [process] section

Process-specific settings.

## cpu_affinity

CPU affinity of the process.

{{ config_param("process.cpu_affinity") }}

The following values are supported:

- `auto` — automatically select one CPU from the CPUs available to the process.
- `none` — do not set CPU affinity.
- Comma-separated list of CPU numbers, e.g. `0,2,4` — restrict the process to the specified CPUs. Only CPUs available to the process are used.

The affinity is applied once during process startup.