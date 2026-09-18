# [nbi] section

[Nbi](../services-reference/nbi.md) service configuration

## max_threads

NBI process' threadpool size. Roughly - amount of concurrent
requests can be served by single `nbi<services-nbi>` instance.

{{ config_param("nbi.max_threads") }}

## objectmetrics_max_interval

Maximal time span (in seconds) which can be requested via
`NBI objectmetrics API<api-nbi-objectmetrics>`.

{{ config_param("nbi.objectmetrics_max_interval") }}
