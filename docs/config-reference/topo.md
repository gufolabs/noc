# [topo] section

[Topo](../services-reference/topo.md) service configuration

## dry_run

Do not write topology to database when set.

{{ config_param("topo.dry_run") }}

## check

Additionally check if uplinks are valid
(Lead to adjanced nodes)

{{ config_param("topo.check") }}

## ds_limit

Batch size for datastream client.

{{ config_param("topo.ds_limit") }}

## interval

Topology recalculation interval in seconds.

{{ config_param("topo.interval") }}
