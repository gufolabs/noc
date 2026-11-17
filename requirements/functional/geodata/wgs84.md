# WGS84 Geographic Coordinates

## Scope

Geographic coordinates stored, processed, and exchanged by the NOC server.

## Requirements

All geographic coordinates stored, processed, or exchanged by the NOC server **MUST** use WGS84 (EPSG:4326).

Geographic point coordinates **MUST** be represented as longitude (x) and latitude (y), in decimal degrees.

The NOC server **MUST NOT** store coordinate reference system metadata per geographic point or reproject coordinates between coordinate reference systems.

## Why?

Using one coordinate reference system across server-side storage and interfaces keeps geographic data consistent and removes the need for server-side coordinate transformations.
