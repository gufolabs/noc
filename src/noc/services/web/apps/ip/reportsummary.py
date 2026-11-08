# ---------------------------------------------------------------------
# Summary Report
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python Modules
# Python modules
import math

# Third-party modules
from django import forms

# NOC modules
# Django Modules
from noc.core.i18n import t
from noc.core.ip import IP
from noc.core.validators import ValidationError, check_ipv4_prefix, check_ipv6_prefix
from noc.ip.models.prefix import Prefix
from noc.ip.models.vrf import VRF

# NOC Modules
from noc.services.web.base.simplereport import SimpleReport, TableColumn


class ReportForm(forms.Form):
    vrf = forms.ModelChoiceField(label=t("label-vrf"), queryset=VRF.objects.all().order_by("name"))
    afi = forms.ChoiceField(label=t("label-address-family"), choices=[("4", t("choice-ipv4"))])
    prefix = forms.CharField(label=t("label-prefix"))

    def clean_prefix(self):
        vrf = self.cleaned_data["vrf"]
        afi = self.cleaned_data["afi"]
        prefix = self.cleaned_data.get("prefix", "").strip()
        if afi == "4":
            check_ipv4_prefix(prefix)
        elif afi == "6":
            check_ipv6_prefix(prefix)
        try:
            return Prefix.objects.get(vrf=vrf, afi=afi, prefix=prefix)
        except Prefix.DoesNotExist:
            raise ValidationError(t("msg-prefix-not-found"))


class ReportSummary(SimpleReport):
    title = t("app-title-reportsummary")
    form = ReportForm

    def get_data(self, vrf, afi, prefix, **kwargs):
        p = IP.prefix(prefix.prefix)
        allocated = [IP.prefix(a.prefix) for a in prefix.children_set.all()]
        if afi == "4":
            allocated_30 = [a for a in allocated if a.mask == 30]
        free = list(p.iter_free(allocated))
        if afi == "4":
            allocated_size = sum([a.size for a in allocated])
            allocated_30_size = sum([a.size for a in allocated_30])
            free_size = sum([a.size for a in free])
            total = p.size
            data = [
                ("Allocated addresses", allocated_size, float(allocated_size) * 100 / float(total)),
                (".... in /30", allocated_30_size, float(allocated_30_size) * 100 / float(total)),
                ("Free addresses", free_size, float(free_size) * 100 / float(total)),
                ("Total addresses", total, 1.0),
            ]
            a_s = len(allocated)
            if a_s:
                avg_allocated_size = allocated_size / a_s
                avg_allocated_mask = 32 - math.ceil(math.log(avg_allocated_size, 2))
                data += [
                    ("Average allocated block", avg_allocated_size, ""),
                    ("Average allocated mask", avg_allocated_mask, ""),
                ]
            return self.from_dataset(
                title=t("title-summary-for-vrf", vrf=vrf.name, afi=afi, prefix=p.prefix),
                columns=[
                    "",
                    TableColumn(t("header-size"), format="numeric", align="right"),
                    TableColumn(t("header-percent"), format="percent", align="right"),
                ],
                data=data,
            )
