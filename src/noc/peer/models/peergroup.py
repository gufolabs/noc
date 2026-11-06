# ---------------------------------------------------------------------
# PeerGroup model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.core.model.decorator import on_delete_check


@on_delete_check(check=[("peer.Peer", "peer_group")])
class PeerGroup(NOCModel):
    """
    Attributes:
        name: Name
        description: Description
        communities: Import Communities
        max_prefixes: Max. Prefixes
        local_pref: Local Pref
        import_med: Import MED
        export_med: Export MED
    """

    class Meta:
        verbose_name = "Peer Group"
        verbose_name_plural = "Peer Groups"
        db_table = "peer_peergroup"
        app_label = "peer"

    name = models.CharField(max_length=32, unique=True)
    description = models.CharField(max_length=64)
    communities = models.CharField(max_length=128, blank=True, null=True)
    max_prefixes = models.IntegerField(default=100)
    local_pref = models.IntegerField(null=True, blank=True)
    import_med = models.IntegerField(blank=True, null=True)
    export_med = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name
