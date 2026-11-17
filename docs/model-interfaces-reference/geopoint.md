# geopoint Model Interface

`geopoint` interface allows to position object on map. An object with the `geopoint`
interface will be shown on maps's layer named `layer` starting from `zoom` level.

`zoom` level settings can ovrerride layer's defaults.

## Variables

<!-- table start -->
| Name | Type | Description | Required | Constant |
| --- | --- | --- | --- | --- |
| `layer` | str | Map layer code | {{ yes }} | {{ yes }} |
| `zoom` | int | Default zoom level (override layer's default) | {{ no }} | {{ no }} |
| `x` | float | Longitude in WGS84 degrees | {{ yes }} | {{ no }} |
| `y` | float | Latitude in WGS84 degrees | {{ yes }} | {{ no }} |
| `z` | float | Height above ellipsoid, in meters | {{ no }} | {{ no }} |
| `angle` | float | Rotation angle, in degrees | {{ no }} | {{ no }} |

<!-- table end -->

## Examples

```json
{
  "geopoint": {
    "layer": "pop_regional"
  }
}
```
