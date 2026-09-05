# Global service configuration

Global settings applicable to all services

## host

Hostname.

!!! note

    This parameter is read-only and cannot be modified

## loglevel

{{ config_param("loglevel") }}

## global_n_instances

{{ config_param("global_n_instances") }}

## installation_name

{{ config_param("installation_name") }}

## installation_id

{{ config_param("installation_id") }}

## instance

{{ config_param("instance") }}

## language

{{ config_param("language") }}

## language_code

{{ config_param("language_code") }}

## listen

API listen address in form `<address>:<port>`, where `<address>` is one of:

* `auto` - use hostname to detect address.
* interface name, like `eth0`
* IP address.

{{ config_param("listen") }}

## log_format

{{ config_param("log_format") }}

## thread_stack_size

{{ config_param("thread_stack_size") }}

## version_format

{{ config_param("version_format") }}

## pool

{{ config_param("pool") }}

## secret_key

{{ config_param("secret_key") }}

## timezone

{{ config_param("timezone") }}
