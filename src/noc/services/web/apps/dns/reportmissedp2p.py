# ---------------------------------------------------------------------
# reportmissedp2p Report
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC Modules
# NOC modules
from noc.core.i18n import t
from noc.ip.models.vrf import VRF
from noc.services.web.base.simplereport import SimpleReport


class Reportreportmissedp2p(SimpleReport):
    title = t("app-title-reportmissedp2p")

    def get_data(self, **kwargs):
        vrf_id = VRF.get_global().id
        return self.from_query(
            title=self.title,
            columns=[t("header-prefix")],
            query="""
            SELECT prefix
            FROM   ip_prefix p
            WHERE
                vrf_id=%s
                AND afi='4'
                AND masklen(prefix)=30
                AND NOT EXISTS (SELECT * FROM ip_address WHERE vrf_id=%s AND afi='4' AND prefix=p.prefix)
            ORDER BY prefix
            """,
            params=[vrf_id, vrf_id],
            enumerate=True,
        )
