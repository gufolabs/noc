# [chwriter] section

[chwriter](../services-reference/chwriter.md) service configuration

## shard_id

Shard identifier served by [chwriter](../services-reference/chwriter.md) instance.
Use default value for unsharded configurations.

{{ config_param("chwriter.shard_id") }}

## replica_id

Shard's replica identifier served by [chwriter](../services-reference/chwriter.md) instance.
Use default value for unreplicated configurations.

{{ config_param("chwriter.replica_id") }}

## batch_size

Desired size of the write batch, in records

{{ config_param("chwriter.batch_size") }}

## batch_delay_ms

Send every period time

{{ config_param("chwriter.batch_delay_ms") }}

## write_to

{{ config_param("chwriter.write_to") }}
