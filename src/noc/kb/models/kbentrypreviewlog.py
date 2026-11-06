# ---------------------------------------------------------------------
# KBEntryPreviewLog
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.aaa.models.user import User
from noc.core.model.base import NOCModel
from noc.kb.models.kbentry import KBEntry


class KBEntryPreviewLog(NOCModel):
    """
    Preview Log

    Attributes:
        timestamp: Timestamp
        kb_entry: KB Entry
        user: User
    """

    class Meta:
        app_label = "kb"
        db_table = "kb_kbentrypreviewlog"

    kb_entry = models.ForeignKey(KBEntry, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
