# [gis] section

Gis service configuration

## ellipsoid

{{ config_param("gis.ellipsoid") }}

## enable_osm

Enable blank layer on maps.
{{ config_param("gis.enable_blank") }}

## enable_osm

Enable OpenStreetMap layer on maps.
{{ config_param("gis.enable_osm") }}

## enable_google_sat

{{ config_param("gis.enable_google_sat") }}

## enable_google_roadmap

{{ config_param("gis.enable_google_roadmap") }}

## enable_tile1

Enable custom layer `tile1`.

{{ config_param("gis.enable_tile1") }}

## tile1_name

Set name for layer `tile1`.
{{ config_param("gis.tile1_name") }}

## tile1_url

Set tile url for layer `tile`.

{{ config_param("gis.tile1_url") }}

The following macroses may be used in url:

| Macro | Description                                                                                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- |
| `{s}` | Expands to one of the values of `subdomains`. used sequentially to help with browser parallel requests per domain limitation |
| `{z}` | Zoom level                                                                                                                   |
| `{x}` | X coordinates                                                                                                                |
| `{y}` | Y coordinates                                                                                                                |
| `{r}` | can be used to add "@2x" to the URL to load retina tiles                                                                     |
 
{{ config_param("gis.tile1_subdomains") }}

## tile1_subdomains

Set subdomains for `tile1` layer. Subdomains are used sequentially to help with browser parallel requests per domain limitation.
Expands `{s}` option in `tile1_url`.

## enable_tile2

Enable custom layer `tile2`.

{{ config_param("gis.enable_tile2") }}

## tile2_name

Set name for layer `tile2`.
{{ config_param("gis.tile2_name") }}

## tile2_url

Set tile url for layer `tile`.

{{ config_param("gis.tile2_url") }}

The following macroses may be used in url:

| Macro | Description                                                                                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- |
| `{s}` | Expands to one of the values of `subdomains`. used sequentially to help with browser parallel requests per domain limitation |
| `{z}` | Zoom level                                                                                                                   |
| `{x}` | X coordinates                                                                                                                |
| `{y}` | Y coordinates                                                                                                                |
| `{r}` | can be used to add "@2x" to the URL to load retina tiles                                                                     |
 
{{ config_param("gis.tile2_subdomains") }}

## tile2_subdomains

Set subdomains for `tile2` layer. Subdomains are used sequentially to help with browser parallel requests per domain limitation.
Expands `{s}` option in `tile2_url`.

## enable_tile3

Enable custom layer `tile3`.

{{ config_param("gis.enable_tile3") }}

## tile3_name

Set name for layer `tile3`.
{{ config_param("gis.tile3_name") }}

## tile3_url

Set tile url for layer `tile`.

{{ config_param("gis.tile3_url") }}

The following macroses may be used in url:

| Macro | Description                                                                                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- |
| `{s}` | Expands to one of the values of `subdomains`. used sequentially to help with browser parallel requests per domain limitation |
| `{z}` | Zoom level                                                                                                                   |
| `{x}` | X coordinates                                                                                                                |
| `{y}` | Y coordinates                                                                                                                |
| `{r}` | can be used to add "@2x" to the URL to load retina tiles                                                                     |
 
{{ config_param("gis.tile3_subdomains") }}

## tile3_subdomains

Set subdomains for `tile3` layer. Subdomains are used sequentially to help with browser parallel requests per domain limitation.
Expands `{s}` option in `tile3_url`.

## tile_size

Tile size 256x256

{{ config_param("gis.tile_size") }}
