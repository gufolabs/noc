# ---------------------------------------------------------------------
# Map
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules

# Third-party modules
import geojson

# NOC modules
from noc.core.geo import distance, get_bbox
from noc.gis.models.layer import Layer
from noc.inv.models.object import Object
from noc.inv.models.objectconnection import ObjectConnection


class Map:
    CONDUITS_LAYERS = ["manholes", "cableentries"]
    GEOJSON_CRS = "EPSG:4326"

    def __init__(self) -> None:
        self.layers = {}

    def get_db_point(self, x: float, y: float) -> geojson.Point:
        """
        Return a GeoJSON Point in WGS84 coordinates.
        """
        return geojson.Point(coordinates=[x, y])

    def get_layer(self, name):
        if name in self.layers:
            return self.layers[name]
        layer = Layer.objects.filter(code=name).first()
        if layer:
            self.layers[name] = layer.id
            return self.layers[name]
        raise Exception(f"Layer not found: {name}")

    @staticmethod
    def get_default_zoom(layer: str, object=None):
        layer = Layer.objects.filter(code=layer).first()
        if not layer:
            return None
        if object is not None:
            zl = object.get_data("geopoint", "zoom")
            if zl:
                return zl
        return layer.default_zoom

    def get_bbox(self, x0: float, y0: float, x1: float, y1: float):
        return get_bbox(x0, x1, y0, y1)

    def get_layer_objects(self, layer: str, x0: float, y0: float, x1: float, y1: float):
        """
        Extract GeoJSON from bounding box
        """
        lr = Layer.get_by_code(layer)
        if not lr:
            return {}
        try:
            bbox = self.get_bbox(x0, y0, x1, y1)
        except ValueError:
            return {}
        features = [
            geojson.Feature(
                id=str(d["_id"]),
                geometry=d["point"],
                properties={
                    "object": str(d["_id"]),
                    "label": d.get("name", ""),
                    "resource": f"o:{d['_id']}",
                },
            )
            for d in Object._get_collection().find(
                {"layer": lr.id, "point": {"$geoWithin": {"$geometry": bbox}}},
                {"_id": 1, "point": 1, "name": 1},
            )
        ]
        return geojson.FeatureCollection(features=features, crs=self.GEOJSON_CRS)

    def get_conduits_layers(self):
        """
        Returns a list of ids of conduits-related layers
        manholes/cableentries/etc
        """
        if not hasattr(self, "_conduit_layers_ids"):
            self._conduit_layers_ids = Layer.objects.filter(
                code__in=self.CONDUITS_LAYERS
            ).values_list("id")
        return self._conduit_layers_ids

    def get_connection_layer(self, layer: Layer, x0: float, y0: float, x1: float, y1: float):
        """
        Build line connections
        """
        try:
            bbox = self.get_bbox(x0, y0, x1, y1)
        except ValueError:
            return {}
        features = [
            geojson.Feature(
                id="-".join(str(c["object"]) for c in d["connection"]),
                geometry=d["line"],
            )
            for d in ObjectConnection._get_collection().find(
                {
                    "layer": layer.id,
                    "$or": [
                        {"line": {"$geoWithin": {"$geometry": bbox}}},
                        {"line": {"$geoIntersects": {"$geometry": bbox}}},
                    ],
                },
                {"_id": 1, "connection": 1, "line": 1},
            )
        ]
        return geojson.FeatureCollection(features=features, crs=self.GEOJSON_CRS)

    def find_nearest(self, point, layers):
        """
        Find and return nearest object
        :param point: GeoJSON Point or tuple of (longitude, latitude)
        :param layers: List of layer instances or layer names
        """
        # Normalize point
        if isinstance(point, tuple):
            point = geojson.Point(coordinates=[point[0], point[1]])
        q = {"point__near": point}
        if isinstance(layers, list):
            q["layer__in"] = layers
        else:
            q["layer"] = layers
        for o in Object.objects.filter(**q)[:1]:
            return o
        return None

    def find_nearest_d(self, point, layers):
        """
        Like find_nearest but return a tuple of (Object, distance)
        """
        if isinstance(point, tuple):
            point = geojson.Point(coordinates=[point[0], point[1]])
        o = self.find_nearest(point, layers)
        if o:
            return o, distance(point, o.point)
        return None, None


map = Map()
