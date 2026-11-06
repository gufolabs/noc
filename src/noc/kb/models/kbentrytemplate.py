# ---------------------------------------------------------------------
# KBEntryTemplate model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import re

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.core.model.fields import AutoCompleteTagsField
from noc.main.models.language import Language
from noc.services.web.apps.kb.parsers.base import kb_parser_loader


class KBEntryTemplate(NOCModel):
    """
    KB Entry Template

    Attributes:
        name: Name
        subject: Subject
        body: Body
        markup_language: Markup Language
        tags: Tags
        language: Language
    """

    class Meta:
        app_label = "kb"
        db_table = "kb_kbentrytemplate"
        ordering = ("id",)

    name = models.CharField(max_length=128, unique=True)
    subject = models.CharField(max_length=256)
    body = models.TextField()
    language = models.ForeignKey(
        Language,
        limit_choices_to={"is_active": True},
        on_delete=models.CASCADE,
    )
    markup_language = models.CharField(max_length="16", choices=[(x, x) for x in kb_parser_loader])
    tags = AutoCompleteTagsField(null=True, blank=True)

    rx_template_var = re.compile("{{([^}]+)}}", re.MULTILINE)

    def __str__(self):
        return self.name

    @property
    def _var_list(self):
        """
        Returns template variables list
        """
        var_set = set(self.rx_template_var.findall(self.subject))
        var_set.update(self.rx_template_var.findall(self.body))
        return sorted(var_set)
