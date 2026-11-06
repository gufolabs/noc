# ---------------------------------------------------------------------
# NS Zone Summary Report
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.simplereport import SimpleReport, TableColumn


class Reportreportnszonesummary(SimpleReport):
    title = t("app-title-reportnszonesummary")

    def get_data(self, **kwargs):
        return self.from_query(
            title=self.title,
            columns=[
                t("header-ns"),
                TableColumn(t("header-master"), format="integer", align="right"),
                TableColumn(t("header-slave"), format="integer", align="right"),
            ],
            query="""SELECT ns.name,
                    (
                        SELECT COUNT(*)
                        FROM dns_dnszoneprofile_masters pm JOIN dns_dnszone z ON (z.profile_id=pm.dnszoneprofile_id)
                        WHERE pm.dnsserver_id=ns.id AND z.is_auto_generated
                    ) AS masters,
                    (
                        SELECT COUNT(*)
                        FROM dns_dnszoneprofile_slaves ps JOIN dns_dnszone z ON (z.profile_id=ps.dnszoneprofile_id)
                        WHERE ps.dnsserver_id=ns.id AND z.is_auto_generated
                    ) AS slaves
                FROM dns_dnsserver ns
                ORDER BY 2 DESC, 1 ASC""",
        )
