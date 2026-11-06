# ---------------------------------------------------------------------
# inv.reportpartnumbers
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.objectmodel import ObjectModel
from noc.inv.models.vendor import Vendor
from noc.services.web.base.simplereport import SectionRow, SimpleReport


class ReportPartnumbersApplication(SimpleReport):
    title = t("app-title-reportpartnumbers")

    def get_data(self, **kwargs):
        data = []
        for v in Vendor.objects.order_by("name"):
            data.append(SectionRow(name=v.name))
            for m in ObjectModel.objects.filter(vendor=v.id):
                data.append(
                    [
                        m.get_data("asset", "part_no0"),
                        m.get_data("asset", "part_no1"),
                        m.get_data("asset", "part_no2"),
                        m.get_data("asset", "part_no3"),
                        m.get_data("asset", "asset_part_no0"),
                        m.get_data("asset", "asset_part_no1"),
                        m.get_data("asset", "asset_part_no2"),
                        m.get_data("asset", "asset_part_no3"),
                        m.name,
                        m.description,
                    ]
                )

        return self.from_dataset(
            title=self.title,
            columns=[
                t("header-part-number-0"),
                t("header-part-number-1"),
                t("header-part-number-2"),
                t("header-part-number-3"),
                t("header-part-number-0"),
                t("header-part-number-1"),
                t("header-part-number-2"),
                t("header-part-number-3"),
                t("header-name"),
                t("header-description"),
            ],
            data=data,
            enumerate=True,
        )
