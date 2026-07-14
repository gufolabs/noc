# [clickhouse] section

Clickhouse service configuration

## rw_addresses

{{ config_param("clickhouse.rw_addresses") }}

## db

{{ config_param("clickhouse.db") }}

## rw_user

{{ config_param("clickhouse.rw_user") }}

## rw_password

{{ config_param("clickhouse.rw_password") }}

## ro_addresses

{{ config_param("clickhouse.ro_addresses") }}

## ro_user

{{ config_param("clickhouse.ro_user") }}

## ro_password

{{ config_param("clickhouse.ro_password") }}

## request_timeout

{{ config_param("clickhouse.request_timeout") }}

## connect_timeout

{{ config_param("clickhouse.connect_timeout") }}

## default_merge_tree_granularity

{{ config_param("clickhouse.default_merge_tree_granularity") }}

## encoding

{{ config_param("clickhouse.encoding") }}

## enable_low_cardinality

{{ config_param("clickhouse.enable_low_cardinality") }}

## cluster

{{ config_param("clickhouse.cluster") }}

## cluster_topology

{{ config_param("clickhouse.cluster_topology") }}

Examples:

| Value | Description                                                                      |
| ----- | -------------------------------------------------------------------------------- |
| 1     | non-replicated, non-sharded configuration                                        |
| 1,1   | 2 shards, non-replicated                                                         |
| 2,2   | 2 shards, 2 replicas in each                                                     |
| 3:2,2 | first shard has 2 replicas an weight 3, second shard has 2 replicas and weight 1 |
