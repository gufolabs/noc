# ---------------------------------------------------------------------
# VRF model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Future imports
from __future__ import annotations

# Python modules
import operator
from threading import Lock

# Third-party modules
import cachetools
from django.contrib.postgres.fields import ArrayField
from django.db import models

# NOC modules
from noc.config import config
from noc.core.bi.decorator import bi_sync
from noc.core.change.decorator import change
from noc.core.model.base import NOCModel
from noc.core.model.decorator import on_delete_check, on_init
from noc.core.model.fields import DocumentReferenceField
from noc.core.validators import check_rd
from noc.core.vpn import get_vpn_id
from noc.core.wf.decorator import workflow
from noc.main.models.label import Label
from noc.main.models.remotesystem import RemoteSystem
from noc.main.models.textindex import full_text_search
from noc.project.models.project import Project
from noc.vc.models.vpnprofile import VPNProfile
from noc.wf.models.state import State

from .vrfgroup import VRFGroup

id_lock = Lock()


@Label.match_labels("ipvrf", allowed_op={"="})
@Label.model
@full_text_search
@on_init
@workflow
@bi_sync
@change
@on_delete_check(
    check=[
        ("ip.Address", "vrf"),
        ("ip.AddressRange", "vrf"),
        ("ip.PrefixAccess", "vrf"),
        ("ip.Prefix", "vrf"),
        # ("ip.DynamicIPPoolUsage", "vrf"),
        ("sa.ManagedObject", "vrf"),
    ],
    clean_lazy_labels="ipvrf",
)
class VRF(NOCModel):
    """
    VRF

    Attributes:
        name: Unique VRF Name
        rd: Route Distinguisher in form of ASN:N or IP:N
        vpn_id: RFC2685 compatible VPN ID
        afi_ipv4: Enable IPv4 Address Family
        afi_ipv6: Enable IPv6 Address Family
        tt: Ticket #
        allocated_till: VRF temporary allocated till the date
        description: Description
        source: Source
        state_changed: State Changed
        expired: Expired
        last_seen: Last Seen
        first_discovered: First Discovered
        vrf_group: VRF Group
        project: Project
    """

    class Meta:
        db_table = "ip_vrf"
        app_label = "ip"
        ordering = ["name"]

    name = models.CharField(unique=True, max_length=64)
    profile: VPNProfile = DocumentReferenceField(VPNProfile)
    vrf_group = models.ForeignKey(VRFGroup, null=True, blank=True, on_delete=models.CASCADE)
    rd = models.CharField(
        max_length=21,
        validators=[check_rd],
        null=True,
        blank=True,
    )
    # RFC2685-compatible VPN id
    vpn_id = models.CharField(max_length=15, unique=True)
    afi_ipv4 = models.BooleanField(default=True)
    afi_ipv6 = models.BooleanField(default=False)
    project = models.ForeignKey(
        Project,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="vrf_set",
    )
    description = models.TextField(blank=True, null=True)
    tt = models.IntegerField(blank=True, null=True)
    # Labels
    labels = ArrayField(models.CharField(max_length=250), blank=True, null=True, default=list)
    effective_labels = ArrayField(
        models.CharField(max_length=250), blank=True, null=True, default=list
    )
    state = DocumentReferenceField(State, null=True, blank=True)
    allocated_till = models.DateField(
        null=True,
        blank=True,
    )
    source = models.CharField(
        max_length=1,
        choices=[("M", "Manual"), ("i", "Interface"), ("m", "MPLS"), ("c", "ConfDB")],
        null=False,
        blank=False,
        default="M",
    )
    # Last state change
    state_changed = models.DateTimeField(null=True, blank=True)
    # Timestamp expired
    expired = models.DateTimeField(null=True, blank=True)
    # Timestamp of last seen
    last_seen = models.DateTimeField(null=True, blank=True)
    # Timestamp of first discovery
    first_discovered = models.DateTimeField(null=True, blank=True)
    # Reference to remote system object has been imported from
    remote_system = DocumentReferenceField(RemoteSystem, null=True, blank=True)
    # Object id in remote system
    remote_id = models.CharField(max_length=64, null=True, blank=True)
    # Object id in BI
    bi_id = models.BigIntegerField(unique=True)

    GLOBAL_RD = "0:0"
    IPv4_ROOT = "0.0.0.0/0"
    IPv6_ROOT = "::/0"

    def __str__(self):
        if self.rd == self.GLOBAL_RD:
            return "global"
        return self.name

    _id_cache = cachetools.TTLCache(maxsize=1000, ttl=60)
    _vpn_id_cache = cachetools.TTLCache(maxsize=1000, ttl=60)

    @classmethod
    @cachetools.cachedmethod(operator.attrgetter("_id_cache"), lock=lambda _: id_lock)
    def get_by_id(cls, oid: int) -> VRF | None:
        return VRF.objects.filter(id=oid).first()

    @classmethod
    @cachetools.cachedmethod(operator.attrgetter("_vpn_id_cache"), lock=lambda _: id_lock)
    def get_by_vpn_id(cls, vpn_id: str) -> VRF | None:
        return VRF.objects.filter(vpn_id=vpn_id).first()

    def iter_changed_datastream(self, changed_fields=None):
        if config.datastream.enable_vrf:
            yield "vrf", self.id

    @classmethod
    def get_global(cls):
        """
        Returns VRF 0:0
        """
        return VRF.get_by_vpn_id(cls.GLOBAL_RD)

    def save(self, *args, **kwargs):
        """
        Create root entries for all enabled AFIs
        """
        from .prefix import Prefix

        # Generate unique rd, if empty
        if not self.vpn_id:
            vdata = {"type": "VRF", "name": self.name, "rd": self.rd}
            self.vpn_id = get_vpn_id(vdata)
        if self.initial_data["id"]:
            # Delete empty ipv4 root if AFI changed
            if self.initial_data.get("afi_ipv4") != self.afi_ipv4 and not self.afi_ipv4:
                root = Prefix.objects.filter(vrf=self, afi="4", prefix=self.IPv4_ROOT)[:1]
                if root:
                    root = root[0]
                    if root.is_empty():
                        root.disable_delete_protection()
                        root.delete()
                    else:
                        # Cannot change until emptied
                        self.afi_ipv4 = True
            # Delete empty ipv4 root if AFI changed
            if self.initial_data.get("afi_ipv6") != self.afi_ipv6 and not self.afi_ipv6:
                root = Prefix.objects.filter(vrf=self, afi="6", prefix=self.IPv6_ROOT)[:1]
                if root:
                    root = root[0]
                    if root.is_empty():
                        root.disable_delete_protection()
                        root.delete()
                    else:
                        # Cannot change until emptied
                        self.afi_ipv6 = True
        # Save VRF
        super().save(*args, **kwargs)
        if self.afi_ipv4:
            # Create IPv4 root, if not exists
            Prefix.objects.get_or_create(
                vrf=self,
                afi="4",
                prefix=self.IPv4_ROOT,
                defaults={
                    "description": "IPv4 Root",
                    "profile": self.profile.default_prefix_profile,
                },
            )
        if self.afi_ipv6:
            # Create IPv6 root, if not exists
            Prefix.objects.get_or_create(
                vrf=self,
                afi="6",
                prefix=self.IPv6_ROOT,
                defaults={
                    "description": "IPv6 Root",
                    "profile": self.profile.default_prefix_profile,
                },
            )

    def get_index(self):
        """
        Full-text search
        """
        content = [self.name, str(self.rd)]
        card = f"VRF {self.name}. RD {self.rd}"
        if self.description:
            content.append(self.description)
            card += f" ({self.description})"
        r = {
            "id": f"ip.vrf:{self.id}",
            "title": self.name,
            "content": "\n".join(content),
            "card": card,
        }
        if self.labels:
            r["tags"] = self.labels
        return r

    @classmethod
    def get_search_result_url(cls, obj_id):
        return f"/api/card/view/vrf/{obj_id}/"

    def delete(self, *args, **kwargs):
        # Cleanup prefixes
        self.afi_ipv4 = False
        self.afi_ipv6 = False
        self.save()
        # Delete
        super().delete(*args, **kwargs)

    @property
    def is_global(self):
        return self.vpn_id == self.GLOBAL_RD

    @classmethod
    def can_set_label(cls, label):
        return Label.get_effective_setting(label, setting="enable_vrf")

    @classmethod
    def iter_lazy_labels(cls, vrf: VRF):
        yield f"noc::ipvrf::{vrf.name}::="

    def get_css_class(self) -> str | None:
        return self.profile.get_css_class() if self.profile else None
