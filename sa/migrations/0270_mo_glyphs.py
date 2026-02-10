# ----------------------------------------------------------------------
# Reset .shape_overlay_glyph
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------


# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.model.fields import DocumentReferenceField
from noc.core.collection.base import Collection


DEFAULT_GLYPH = 0xF22C
MISSED_GLYPH = DEFAULT_GLYPH
SHAPE_MAP: dict[str, int] = {
    "Cisco/ata": 0xF203,
    "Cisco/broadband_router_d": 0xF207,
    "Cisco/cable_modem": 0xF208,
    "Cisco/cloud": 0xF004,
    "Cisco/content_engine": 0xF201,
    "Cisco/crs": 0xF209,
    "Cisco/dslam": 0xF211,
    "Cisco/fax": 0xF213,
    "Cisco/file_server": MISSED_GLYPH,
    "Cisco/firewall": 0xF214,
    "Cisco/generic_gateway": MISSED_GLYPH,
    "Cisco/generic_softswitch": 0xF215,
    "Cisco/intelliswitch_stack": MISSED_GLYPH,
    "Cisco/ip_phone": 0xF218,
    "Cisco/ip_telephony_router": 0xF219,
    "Cisco/iptv_broadcast_server": 0xF21A,
    "Cisco/layer_3_switch": 0xF21C,
    "Cisco/microphone": 0xF220,
    "Cisco/pbx": 0xF226,
    "Cisco/phone": 0xF227,
    "Cisco/pix": 0xF228,
    "Cisco/radio_tower": 0xF22A,
    "Cisco/rf_modem": MISSED_GLYPH,
    "Cisco/router": 0xF22C,
    "Cisco/satellite_dish": 0xF22D,
    "Cisco/set_top_box": 0xF22F,
    "Cisco/sip_proxy_server": 0xF230,
    "Cisco/small_hub": MISSED_GLYPH,
    "Cisco/softswitch_pgw_mgc": MISSED_GLYPH,
    "Cisco/space_router": MISSED_GLYPH,
    "Cisco/standard_host": 0xF217,
    "Cisco/unversal_gateway": MISSED_GLYPH,
    "Cisco/ups": 0xF239,
    "Cisco/video_camera": 0xF23A,
    "Cisco/voice_gateway": MISSED_GLYPH,
    "Cisco/voice_router": 0xF23B,
    "Cisco/vss": MISSED_GLYPH,
    "Cisco/wireless_router": 0xF23E,
    "Cisco/workgroup_switch": 0xF23F,
    "Cisco/workstation": MISSED_GLYPH,
    "Juniper/cloud": 0xF004,
    "Juniper/database": MISSED_GLYPH,
    "Juniper/fcoe": 0xF403,
    "Juniper/firewall": MISSED_GLYPH,
    "Juniper/generic_router": 0xF400,
    "Juniper/l2_l3_switch": 0xF401,
    "Juniper/l2_l3_switch3": 0xF402,
}


class Migration(BaseMigration):
    def migrate(self):
        # Ensure glyph collection is synched
        Collection("main.glyphs").sync()
        # code to id mappings
        code_map = {
            doc["code"]: str(doc["id"])
            for doc in self.mongo_db["glyphs"].find({}, {"_id": 1, "code": 1})
        }
        default_glyph_id = code_map[DEFAULT_GLYPH]
        # Update tables
        for table in ("sa_managedobjectprofile", "sa_managedobject"):
            # Create `glyph` field
            self.db.add_column(
                table, "glyph", DocumentReferenceField("main.Glyph", null=True, blank=True)
            )
            # Migrate values
            for (shape,) in self.db.execute(f"SELECT DISTINCT shape FROM {table}"):
                if shape:
                    glyph_code = SHAPE_MAP.get(shape, DEFAULT_GLYPH)
                    glyph = code_map.get(glyph_code, default_glyph_id)
                    self.db.execute(f"UPDATE {table} SET glyph=%s WHERE shape=%s", [glyph, shape])
            # Remove `shape` field
            self.db.delete_column(table, "shape")
