# [metrics] section

[metrics](../services-reference/metrics.md) service configuration

## compact_on_start

Run log compaction on service start

{{ config_param("metrics.compact_on_start") }}

## compact_on_stop

Run log compaction on service stop

{{ config_param("metrics.compact_on_stop") }}

## flush_interval

Flushing is the process on moving collected changes from memory to persistent storage.
You may loose up to `flush_interval` seconds of changes on unexpected crash.

To disable runtime flushing set parameter to `0`. Changes will be flushed on
graceful shutdown anyway.

{{ config_param("metrics.flush_interval") }}

## compact_interval

Compacting is the process on aggregating the incremental changes to a larger chunks.
Compacting allows to reduce disk space used by change log.

To disable runtime compacting set parameter to `0`. Compacting still may be performed
on service startup or shutdown when setting `compact_on_start` or `compact_on_stop`
parameters.

!!! warning

    Disabling of runtime compaction may lead to unlimited disk usages and may
    greatly increase the service startup time.

{{ config_param("metrics.flush_interval") }}
