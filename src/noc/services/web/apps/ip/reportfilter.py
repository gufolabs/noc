# ---------------------------------------------------------------------
# ip.reportfilter
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django import forms
from django.http import HttpRequest

# NOC modules
from noc.core.comp import smart_text
from noc.core.i18n import t
from noc.ip.models.prefix import Prefix
from noc.ip.models.vrf import VRF
from noc.main.models.customfield import CustomField
from noc.peer.models.asn import AS
from noc.services.web.base.simplereport import SimpleReport, TableColumn
from noc.vc.models.vlan import VLAN


class ReportFilterApplication(SimpleReport):
    title = t("app-title-reportfilter")

    def get_form(self):
        class RForm(forms.Form):
            vrf = forms.ModelChoiceField(
                label=t("label-vrf"), required=False, queryset=VRF.objects.order_by("name")
            )
            afi = forms.ChoiceField(
                label=t("label-address-family"),
                required=False,
                choices=[("", t("choice-all")), ("4", t("choice-ipv4")), ("6", t("choice-ipv6"))],
            )
            asn = forms.ModelChoiceField(
                label=t("label-as-number"), required=False, queryset=AS.objects.order_by("asn")
            )
            description = forms.CharField(label=t("label-description"), required=False)

        self.customize_form(RForm, "ip_prefix", search=True)
        return RForm

    def get_data(self, request: HttpRequest, **kwargs):
        def get_row(p):
            vlan = VLAN.get_by_id(p.vlan.id) if p.vlan else None
            r = [
                p.vrf.name,
                p.prefix,
                p.state.name,
                smart_text(p.asn),
                vlan.name if vlan else "",
            ]
            for f in cf:
                v = getattr(p, f.name)
                r.append(v if v is not None else "")
            r += [p.description, ";".join(p.labels)]
            return r

        q = {}
        for k in kwargs:
            v = kwargs[k]
            if v:
                if k == "description":
                    q[k + "__icontains"] = v
                else:
                    q[k] = v
        columns = [
            t("header-vrf"),
            t("header-prefix"),
            t("header-state"),
            t("header-as"),
            t("header-vlan-560367"),
        ]
        cf = CustomField.table_fields("ip_prefix")
        for f in cf:
            if f.type == "bool":
                columns.append(TableColumn(f.label, format="bool"))
            else:
                columns.append(f.label)
        columns += [t("header-description"), t("header-labels")]

        data = [
            get_row(p)
            for p in Prefix.objects.filter(**q)
            .exclude(prefix="0.0.0.0/0")
            .exclude(prefix="::/0")
            .order_by("vrf__name", "prefix")
            .select_related()
        ]
        return self.from_dataset(title=self.title, columns=columns, data=data)
