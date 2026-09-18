# [login] section

[Login](../services-reference/login.md) service configuration

## methods

{{ config_param("login.methods") }}

## session_ttl

{{ config_param("login.session_ttl") }}

## language

{{ config_param("login.language") }}

## restrict_to_group

{{ config_param("login.restrict_to_group") }}

## single_session_group

{{ config_param("login.single_session_group") }}

## mutual_exclusive_group

{{ config_param("login.mutual_exclusive_group") }}

## idle_timeout

{{ config_param("login.idle_timeout") }}

## pam_service

{{ config_param("login.pam_service") }}

## radius_secret

{{ config_param("login.radius_secret") }}

## radius_server

{{ config_param("login.radius_server") }}

## register_last_login

{{ config_param("login.register_last_login") }}

## jwt_cookie_name

{{ config_param("login.jwt_cookie_name") }}

## jwt_algorithm

{{ config_param("login.jwt_algorithm") }}

## max_failed_attempts

Block account after `max_failed_attempts` failed attempts in
`failed_attempts_window`. If `0`, do not block on failed attemps.

{{ config_param("login.max_failed_attempts") }}

## failed_attempts_window

Failed attempts check window for [max_failed_attempts](#max_failed_attempts).

{{ config_param("login.failed_attempts_window") }}

## failed_attempts_cooldown

Account blocking time if [max_failed_attempts](#max_failed_attempts)
is enabled and exceeded.

{{ config_param("login.failed_attempts_cooldown") }}
