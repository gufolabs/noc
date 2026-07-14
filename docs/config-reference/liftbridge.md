# [liftbridge] section

Liftbridge service configuration

## addresses

{{ config_param("liftbridge.addresses") }}

## max_message_size

Max message size for GRPC client

{{ config_param("liftbridge.max_message_size") }}

## publish_async_ack_timeout

{{ config_param("liftbridge.publish_async_ack_timeout") }}

## metrics_send_delay

Buffer collected metrics up to `metrics_send_delay` seconds.
Buffering reduces amount of liftbridge messages sent and
decreases overall system load by the price of increased
end-to-end delay between metric collection and persistent
storage in database.

{{ config_param("liftbridge.metrics_send_delay") }}
