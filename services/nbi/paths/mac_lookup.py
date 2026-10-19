# ----------------------------------------------------------------------
# mac_lookup API (NOC 25.1)
# ----------------------------------------------------------------------

# Python modules
from typing import Optional

# Third-party modules
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

# NOC modules
from ..base import NBIAPI, API_ACCESS_HEADER, FORBIDDEN_MESSAGE

router = APIRouter()

MAC_TABLE = "macdb"


class MACLookupResponse(BaseModel):
    mac: str
    ip: Optional[str] = None
    object_name: Optional[str] = None
    interface_name: Optional[str] = None
    vlan: Optional[int] = None
    last_seen: Optional[str] = None


class MACLookupAPI(NBIAPI):
    name = "mac_lookup"
    api_name = "mac_lookup"
    openapi_tags = ["mac lookup"]

    def get_routes(self):
        return [
            {
                "path": "/api/nbi/mac/{mac}",
                "method": "GET",
                "endpoint": self.handler,
                "response_model": MACLookupResponse,
                "name": "mac_lookup",
                "description": "Lookup MAC address in NOC MAC database",
            }
        ]

    async def handler(
        self,
        mac: str,
        access_header: str = Header(..., alias=API_ACCESS_HEADER),
    ):
        if not self.access_granted(access_header):
            raise HTTPException(status_code=403, detail=FORBIDDEN_MESSAGE)

        mac_int = self._mac_to_int(mac)
        result = self._query_clickhouse(mac_int)

        if not result:
            raise HTTPException(status_code=404, detail="MAC not found")

        mo_bi_id, iface, vlan, last_seen = result
        name, ip = self._get_object_by_bi_id(mo_bi_id)

        return MACLookupResponse(
            mac=mac.upper(),
            ip=ip,
            object_name=name,
            interface_name=iface,
            vlan=vlan,
            last_seen=str(last_seen) if last_seen else None,
        )


    def _mac_to_int(self, mac_str: str) -> int:
        clean = mac_str.replace(":", "").replace("-", "").replace(".", "").lower()
        if len(clean) != 12:
            raise HTTPException(status_code=400, detail="Invalid MAC format")
        return int(clean, 16)

    def _query_clickhouse(self, mac_int: int):
        sql = f"""
        SELECT
            managed_object,
            interface,
            vlan,
            last_seen
        FROM {MAC_TABLE}
        WHERE mac = {mac_int}
        ORDER BY last_seen DESC
        LIMIT 1
        """
        from noc.core.clickhouse.connect import ClickhouseClient

        client = ClickhouseClient()
        resp = client.execute(sql=sql)
        if resp and len(resp) > 0:
            return resp[0]
        return None

    def _get_object_by_bi_id(self, bi_id: int):
        """Получает имя и IP устройства по BI ID"""
        from django.db import connection

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT name, address FROM sa_managedobject WHERE bi_id = %s",
                [bi_id],
            )
            row = cursor.fetchone()
            if row:
                return row[0], str(row[1]) if row[1] else None
        return None, None


# register router
MACLookupAPI(router)