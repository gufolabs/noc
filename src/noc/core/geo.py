# ---------------------------------------------------------------------
# Gis-related utilities
# ---------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import math
from typing import Any

# Third-party modules
import geojson
from geopy.distance import ELLIPSOIDS
from geopy.distance import distance as _distance
from geopy.point import Point as GPoint

# NOC modules
# NOC settings
from noc.config import config

# Additional ellipsoids
# major, minor, flattening=(major-minor)/major
ELLIPSOIDS["Krass"] = (6378.245, 6356.863019, 1 / 298.3000031662238)
ELLIPSOIDS["PZ-90"] = (6378.1365, 6356.751758, 1 / 298.2564151)

ELLIPSOID = config.gis.ellipsoid

Coordinate = int | float
PointLike = (
    list[Coordinate]
    | tuple[Coordinate, Coordinate]
    | geojson.Point
    | dict[str, Any]
)


def _get_point(p: PointLike) -> GPoint:
    """
    Convert to geopy Point
    """
    match p:
        case [x, y] | (x, y):
            return GPoint(y, x)
        case {"coordinates": [x, y] | (x, y)}:
            return GPoint(y, x)
        case _:
            raise TypeError(f"Unsupported point type: {type(p).__name__}")


def distance(p1: PointLike, p2: PointLike, ellipsoid: str = ELLIPSOID) -> float:
    """
    Distance between two points in meters
    """

    return _distance(_get_point(p1), _get_point(p2), ellipsoid=ellipsoid).meters


def bearing(p1: PointLike, p2: PointLike) -> float:
    """
    Bearing from p1 to p2, in degrees, clockwise from north
    """
    p1 = _get_point(p1)
    p2 = _get_point(p2)
    sin = math.sin
    cos = math.cos
    lat1 = math.radians(p1.latitude)
    lat2 = math.radians(p2.latitude)
    dlon = math.radians(p2.longitude - p1.longitude)
    y = sin(dlon) * cos(lat2)
    x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dlon)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


BEARINGS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
L_BEARINGS = len(BEARINGS)
BS = 360.0 / L_BEARINGS


def bearing_sym(p1: PointLike, p2: PointLike) -> str:
    """
    Compass-line symbolic bearing
    """
    b = bearing(p1, p2)
    ob = (b + 360 + BS / 2) % 360
    return BEARINGS[math.floor(ob / BS)]


def get_bbox(x0: float, x1: float, y0: float, y1: float) -> geojson.Polygon:
    """
    Get normalized bounding box
    Returns:
        Result of get normalized bounding box.
    """

    def bound_x(x: float) -> float:
        return max(min(x, 180), -180)

    def bound_y(y: float) -> float:
        return max(min(y, 90), -90)

    x0 = bound_x(x0)
    x1 = bound_x(x1)
    y0 = bound_y(y0)
    y1 = bound_y(y1)

    if x1 == x0 and y1 == y0:
        raise ValueError("Coordinates are equal. Not build poligon")
    if x1 < x0:
        x0, x1 = x1, x0
    if y1 < y0:
        y0, y1 = y1, y0

    return geojson.Polygon([[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]])
