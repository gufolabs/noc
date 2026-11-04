# ---------------------------------------------------------------------
# DB Summary Report
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.simplereport import SimpleReport, TableColumn


class ReportreportDBSummary(SimpleReport):
    title = t("app-title-reportdbsummary")

    def get_data(self, **kwargs):
        return self.from_query(
            title=self.title,
            columns=[
                t("header-table"),
                t("header-tablespace"),
                TableColumn(t("header-pages"), align="right", format="integer", total="sum"),
                TableColumn(t("header-records"), align="right", format="integer", total="sum"),
                TableColumn(t("header-size"), align="right", format="size", total="sum"),
            ],
            query="""
            SELECT c.relname,t.spcname,c.relpages,c.reltuples,c.relpages*8192
            FROM pg_class c LEFT JOIN pg_tablespace t ON (t.oid=c.reltablespace)
            WHERE c.relkind='r' AND c.relname NOT LIKE 'pg_%%' AND c.relname NOT LIKE 'sql_%%'
            ORDER BY c.relpages DESC,c.reltuples DESC
            """,
        )
