# [performance] section

Metrics service configuration

## default_hist

{{ config_param("metrics.default_hist") }}

## enable_mongo_hist

{{ config_param("metrics.enable_mongo_hist") }}

## mongo_hist

{{ config_param("metrics.mongo_hist") }}

## enable_postgres_hist

{{ config_param("metrics.enable_postgres_hist") }}

## postgres_hist

{{ config_param("metrics.postgres_hist") }}

## default_quantiles

{{ config_param("metrics.default_quantiles") }}

## default_quantiles_epsilon

Acceptable ranking error for approximate quantiles calculation.

Consider we have 1000 measurements and calculating 2-nd quartile (50% or 0.5).
Exact quantile calculation must return `1000 * 0.5 = 500` item
of ordered list of measurement but we need to keep all 1000 measurements
in memory.

Approximate quantiles calculation guaranted to return an item between
`1000 * (0,5 - Epsilon)` and `1000 * (0.5 + Epsilon). So for default value of 0.01 value between`490`and`510` position will be returned,
greatly relaxing memory requirements.

Lesser values means greater precision and greater memory and cpu requirements,
while greater values means lesser precision but lesser memory and cpu penalty.

{{ config_param("metrics.default_quantiles_epsilon") }}

## default_quantiles_window

Quantiles window size in seconds. NOC maintains 2 quantile windows -
temporary and active one, purging active and swapping windows
every `default_quantiles_window` seconds.

{{ config_param("metrics.default_quantiles_window") }}

## default_quantiles_buffer

{{ config_param("metrics.default_quantiles_buffer") }}

## enable_mongo_quantiles

Enable quantiles collection for mongo transactions

{{ config_param("metrics.enable_mongo_quantiles") }}

## enable_postgres_quantiles

Enable quantiles collection for postgresql transactions

{{ config_param("metrics.enable_postgres_quantiles") }}
