# ---------------------------------------------------------------------
# Common document category
# ---------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import logging

# Third-party modules
from mongoengine import signals
from mongoengine.document import Document
from mongoengine.fields import ObjectIdField, StringField

logger = logging.getLogger(__name__)


class DocCategory(Document):
    meta = {
        "collection": "noc.doccategories",
        "strict": False,
        "auto_create_index": False,
        "indexes": [("type", "name")],
    }

    name = StringField()
    type = StringField()
    parent = ObjectIdField()

    def __str__(self):
        return self.name

    @classmethod
    def refresh_category(cls, sender, document):
        """
        Update document category when necessary
        """
        type = sender._meta["collection"]
        c_name = " | ".join(document.name.split(" | ")[:-1])
        c = DocCategory.objects.filter(type=type, name=c_name).first()
        if not c:
            logger.debug("Creating category %s (%s)", c_name, type)
            c = DocCategory(type=type, name=c_name)
            c.save()
        document.category = c.id

    @classmethod
    def update_parent(cls, sender, document):
        if "|" in document.name:
            p_name = " | ".join(document.name.split(" | ")[:-1])
            p = DocCategory.objects.filter(type=document.type, name=p_name).first()
            if not p:
                # Create parent
                logger.debug("Creating category %s (%s)", p_name, document.type)
                p = DocCategory(type=document.type, name=p_name)
                p.save()
            document.parent = p.id
        else:
            document.parent = None


class CategoryMixin:
    """
    Document mixin adding ``category`` field,
    auto-maintained by :class:`DocCategory`
    """

    category = ObjectIdField()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        assert hasattr(cls, "name"), "CategoryMixin requires 'name' field"
        logger.debug("Registering %s", cls.__name__)
        signals.pre_save.connect(DocCategory.refresh_category, sender=cls)


# Set up signals
signals.pre_save.connect(DocCategory.update_parent, sender=DocCategory)
