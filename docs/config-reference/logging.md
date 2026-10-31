# [logging] section

Logging service configuration

## format

Format string used for log records.

{{ config_param("logging.format") }}

The former `log_format` parameter is deprecated and will be removed in NOC 27.
Use `logging.format` in YAML configuration and `NOC_LOGGING_FORMAT` in
environment configuration. `log_format` and `NOC_LOG_FORMAT` remain available
during the deprecation period.

## log_api_calls

{{ config_param("logging.log_api_calls") }}

## log_sql_statements

{{ config_param("logging.log_sql_statements") }}
