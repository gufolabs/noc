# ---------------------------------------------------------------------
# inv.reportdiscovery
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django import forms
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.core.mac import MAC
from noc.inv.models.discoveryid import DiscoveryID
from noc.inv.models.macblacklist import MACBlacklist
from noc.main.models.pool import Pool
from noc.sa.models.managedobject import ManagedObject
from noc.services.web.base.simplereport import SectionRow, SimpleReport


class ReportForm(forms.Form):
    pool = forms.ChoiceField(
        label=t("label-pool"),
        required=False,
        initial=None,
        choices=[(x, x) for x in Pool.objects.order_by("name").scalar("name")] + [(None, "-")],
    )
    filter_dup_macs = forms.BooleanField(label=t("label-exclude-on-mac-black-list"), required=False)


class ReportDiscoveryIDPoisonApplication(SimpleReport):
    title = t("app-title-reportdiscoverypoison")
    form = ReportForm

    def get_data(self, request: HttpRequest, pool=None, filter_dup_macs=False, **kwargs):
        data = []
        # Find object with equal ID
        find = DiscoveryID._get_collection().aggregate(
            [
                {"$unwind": "$macs"},
                {"$group": {"_id": "$macs", "count": {"$sum": 1}, "mo": {"$push": "$object"}}},
                {"$match": {"count": {"$gt": 1}}},
                {"$group": {"_id": "$mo", "macs": {"$push": "$_id"}}},
                {"$project": {"macs": 1, "smacs": {"$arrayElemAt": ["$macs", 0]}}},
                {"$sort": {"smacs": 1}},
            ],
            allowDiskUse=True,
        )

        for f in find:
            # DiscoveryID.objects.filter(chassis_mac=f["_id"])
            if not f["_id"]:
                # Empty DiscoveryID
                continue
            data_c = []
            pool_c = set()
            reason = "Other"
            for mo in sorted(ManagedObject.objects.filter(id__in=f["_id"]), key=lambda x: x.name):
                pool_c.add(mo.pool.name)
                data_c.append((mo.name, mo.address, mo.profile.name, mo.pool.name, mo.is_managed))
            if len(data_c) > 0:
                if data_c[0][1] == data_c[1][1]:
                    reason = t("msg-duplicate-managed-object")
                elif data_c[0][4] != data_c[1][4]:
                    reason = t("msg-managed-object-was-moved")
            if pool and pool not in pool_c:
                continue
            if reason == "Other" and MACBlacklist.is_banned_mac(f["macs"][0], is_duplicated=True):
                if filter_dup_macs:
                    continue
                data.append(SectionRow(name=f"{MAC(f['macs'][0])} {reason} ({'On duplicated'})"))
            else:
                data.append(SectionRow(name=f"{MAC(f['macs'][0])} {reason}"))
            data += data_c

        return self.from_dataset(
            title=self.title,
            columns=[
                t("header-managed-object-62561c"),
                t("header-address"),
                t("header-profile"),
                t("header-pool"),
                t("header-is-managed"),
            ],
            data=data,
        )
