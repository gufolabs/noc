# ---------------------------------------------------------------------
# KBGlobalBookmark
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.kb.models.kbentry import KBEntry


class KBGlobalBookmark(NOCModel):
    """
    Global Bookmarks
    @todo: Replace with boolean flag in KBEntry

    Attributes:
        kb_entry: KBEntry
    """

    class Meta:
        app_label = "kb"
        db_table = "kb_kbglobalbookmark"

    kb_entry = models.ForeignKey(KBEntry, unique=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.kb_entry)
