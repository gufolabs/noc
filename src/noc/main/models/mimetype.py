# ---------------------------------------------------------------------
# Database models for main module
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import os

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.core.validators import check_extension, check_mimetype


class MIMEType(NOCModel):
    """
    MIME Type mapping

    Attributes:
        extension: Extension
        mime_type: MIME Type
    """

    class Meta:
        app_label = "main"
        db_table = "main_mimetype"
        ordering = ["extension"]

    extension = models.CharField(max_length=32, unique=True, validators=[check_extension])
    mime_type = models.CharField(max_length=63, validators=[check_mimetype])

    def __str__(self):
        return f"{self.extension} -> {self.mime_type}"

    @classmethod
    def get_mime_type(cls, filename):
        """
        Determine MIME type from filename
        """
        _r, ext = os.path.splitext(filename)
        try:
            m = MIMEType.objects.get(extension=ext.lower())
            return m.mime_type
        except MIMEType.DoesNotExist:
            return "application/octet-stream"
