# [web] section

[Web](../services-reference/web.md) service configuration

## theme

{{ config_param("web.theme") }}

## api_row_limit

{{ config_param("web.api_row_limit") }}

## api_unlimited_row_limit

{{ config_param("web.api_unlimited_row_limit") }}

## api_arch_alarm_limit

{{ config_param("web.api_arch_alarm_limit") }}

## max_upload_size

The maximum size in bytes that a request body may be
before a RequestDataTooBig is raised.

{{ config_param("web.max_upload_size") }}

## language

{{ config_param("web.language") }}

## install_collection

{{ config_param("web.install_collection") }}

## max_threads

{{ config_param("web.max_threads") }}

## macdb_window

{{ config_param("web.macdb_window") }}


## enable_remote_system_last_extract_info

{{ config_param("web.enable_remote_system_last_extract_info") }}

## UI API

### max_avatar_size

Maximum allowed avatar image size, in bytes.

{{ config_param("web.max_avatar_size") }}

### max_rest_limit

Maximum number of records returned by the UI REST API.

{{ config_param("web.max_rest_limit") }}

The former `ui.max_avatar_size` and `ui.max_rest_limit` parameters are deprecated
and will be removed in NOC 27. Use `web.max_avatar_size` and
`web.max_rest_limit` in YAML configuration, and `NOC_WEB_MAX_AVATAR_SIZE` and
`NOC_WEB_MAX_REST_LIMIT` in environment configuration. The old YAML keys and
`NOC_UI_MAX_AVATAR_SIZE` / `NOC_UI_MAX_REST_LIMIT` environment variables remain
available during the deprecation period.
