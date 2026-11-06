# ---------------------------------------------------------------------
# ip.reportipamsummary
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.simplereport import SimpleReport, TableColumn


class ReportIPAMSummaryApplication(SimpleReport):
    title = t("app-title-reportipamsummary")

    def get_data(self, **kwargs):
        return self.from_query(
            title="IPAM Summary",
            columns=[
                t("header-vrf"),
                t("header-rd"),
                TableColumn(t("header-prefixes"), align="right", format="integer", total="sum"),
                TableColumn(t("header-addresses"), align="right", format="integer", total="sum"),
            ],
            query="""
                SELECT vrf.name, vrf.rd,
                       (SELECT COUNT(*) FROM ip_prefix
                        WHERE vrf_id=vrf.id) AS prefixes,
                       (SELECT COUNT(*) FROM ip_address
                        WHERE vrf_id=vrf.id) AS addresses
                FROM ip_vrf vrf
                ORDER BY 1
            """,
            enumerate=True,
        )
