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
from noc.ip.models.address import Address
from noc.ip.models.prefix import Prefix
from noc.ip.models.vrf import VRF
from noc.main.models.customfield import CustomField
from noc.sa.models.managedobject import ManagedObject
from noc.services.web.base.simplereport import SimpleReport, TableColumn


class ReportFilterApplication(SimpleReport):
    title = t("app-title-reportaddressfilter")

    def get_form(self):
        class RForm(forms.Form):
            vrf = forms.ModelChoiceField(
                label=t("label-vrf"), required=False, queryset=VRF.objects.order_by("name")
            )
            afi = forms.ChoiceField(
                label=t("label-address-family"),
                required=False,
                choices=[("", t("label-all")), ("4", t("label-ipv4")), ("6", t("label-ipv6"))],
            )
            managed_object = forms.CharField(label=t("label-managed-object"), required=False)
            description = forms.CharField(label=t("label-description"), required=False)
            fqdn = forms.CharField(label=t("label-fqdn"), required=False)
            name = forms.CharField(label=t("label-name"), required=False)
            prefix = forms.CharField(label=t("label-prefix"), required=False)

        self.customize_form(RForm, "ip_address", search=True)
        return RForm

    def get_data(self, request: HttpRequest, **kwargs):
        def get_row(a):
            r = [
                a.vrf.name,
                a.prefix.prefix,
                a.address,
                a.state.name,
                smart_text(a.fqdn) if a.fqdn else "",
            ]
            for f in cf:
                v = getattr(a, f.name)
                r.append(v if v is not None else "")
            r += [a.description, a]
            return r

        def get_or_none(classmodel, **kwargs):
            try:
                return classmodel.objects.filter(**kwargs)
            except classmodel.DoesNotExist:
                return None

        q = {}
        for k in kwargs:
            v = kwargs[k]
            if v:
                if k in ["description", "fqdn", "name"]:
                    q[k + "__icontains"] = v
                elif k == "prefix":
                    q[k + "__in"] = get_or_none(Prefix, prefix=v)
                elif k == "managed_object":
                    q[k + "__in"] = get_or_none(ManagedObject, name=v)
                else:
                    q[k] = v
        columns = [
            t("header-vrf"),
            t("header-prefix"),
            t("header-address"),
            t("header-state"),
            t("header-fqdn"),
        ]
        cf = CustomField.table_fields("ip_address")
        for f in cf:
            if f.type == "bool":
                columns.append(TableColumn(f.label, format="bool"))
            else:
                columns.append(f.label)
        columns += [t("header-description"), TableColumn(t("header-tags"), format="tags")]

        data = [
            get_row(a)
            for a in Address.objects.filter(**q).order_by("vrf__name", "address").select_related()
        ]
        return self.from_dataset(title=self.title, columns=columns, data=data)
