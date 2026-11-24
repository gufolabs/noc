# ----------------------------------------------------------------------
# Capabilities mixins
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

"""
Mixins that implement object capability management.

CapsMixin
    Common capability logic shared by all stores.
DjangoCapsMixin
    Persistence support for Django-backed models.
DocumentCapsMixin
    Persistence support for MongoEngine documents.
"""

# Python modules
import logging
from collections.abc import Iterable, Mapping, Sequence
from typing import TYPE_CHECKING, Any, Protocol, runtime_checkable

# NOC modules
from noc.core.change.decorator import get_applied_rules, get_datastreams, get_domains
from noc.core.change.model import ChangeField
from noc.core.change.policy import change_tracker
from noc.core.models.inputsources import InputSource
from noc.models import get_model_id

from .types import CapsConfig, CapsValue

if TYPE_CHECKING:
    # NOC modules
    from noc.inv.models.capsitem import CapsItem

caps_logger = logging.getLogger(__name__)


@runtime_checkable
class CapsHost(Protocol):
    """
    Protocol for ORM objects that store capability items.

    Objects that mix in DjangoCapsMixin or DocumentCapsMixin
    satisfy this protocol.
    """

    def iter_caps(
        self, scope: str | None = None, include_default: bool = False
    ) -> Iterable[CapsValue]: ...

    def save_caps(
        self,
        caps: list[CapsValue],
        dry_run: bool = False,
        bulk: Any | None = None,
        changed_fields: list[ChangeField] | None = None,
    ) -> None: ...

    def get_caps_config(self) -> dict[str, CapsConfig]: ...


@runtime_checkable
class CapsManager(Protocol):
    """Django manager used to persist caps changes"""

    def filter(self, **kwargs: Any) -> CapsQuerySet: ...


@runtime_checkable
class CapsQuerySet(Protocol):
    """Django queryset used to persist caps changes"""

    def update(self, **kwargs: Any) -> int: ...


@runtime_checkable
class DjangoCapsHost(CapsHost, Protocol):
    """
    Protocol for Django-backed objects with caps storage.
    """

    id: int | str | None
    caps: Sequence[Mapping[str, Any]]
    effective_labels: Sequence[str]
    objects: CapsManager

    def update_init(self) -> None: ...

    def _reset_caches(self, key: int | str, credential: bool = False) -> None: ...


@runtime_checkable
class DocumentCapsHost(CapsHost, Protocol):
    """
    Protocol for MongoEngine documents with caps storage.
    """

    pk: str
    caps: list[CapsItem]
    effective_labels: list[str]

    def update(self, **kwargs: Any) -> int: ...


class CapsMixin:
    """
    Common capability logic shared by all stores.

    Methods contributed to the class:
    * update_caps: Update object capabilities
    * set_caps: Set capabilities value
    * reset_caps: Remove caps from object
    * get_caps: Getting effective capabilities
    * get_caps_config: Default (profile based) caps configuration

    Subclasses must implement iter_caps() and save_caps()
    for their specific store.
    """

    def iter_caps(
        self, scope: str | None = None, include_default: bool = False
    ) -> Iterable[CapsValue]:
        """Iterate over capability items"""
        raise NotImplementedError

    def save_caps(
        self,
        caps: list[CapsValue],
        dry_run: bool = False,
        bulk: Any | None = None,
        changed_fields: list[ChangeField] | None = None,
    ) -> None:
        """Persist capability items"""
        raise NotImplementedError

    def get_caps_config(self) -> dict[str, CapsConfig]:
        """Return dict with local capability config"""
        profile = getattr(self, "profile", None)
        if profile is not None and hasattr(profile, "get_caps_config"):
            return profile.get_caps_config()
        return {}

    def get_caps(
        self: CapsHost, scope: str | None = None, exposed_scope: str | None = None
    ) -> dict[str, Any]:
        """
        Returns a dict of effective object capabilities
        """
        caps: dict[str, Any] = {}
        for c in self.iter_caps(scope=scope):
            if c.name in caps and c.scope:
                continue
            if exposed_scope and (
                not c.config.expose_models or exposed_scope not in c.config.expose_models
            ):
                continue
            caps[c.name] = c.value
        return caps

    def set_caps(
        self: CapsHost,
        key: str,
        value: Any,
        source: str = "manual",
        scope: str | None = None,
    ) -> None:
        """
        Set capability or update
        Args:
            key: Capability name
            value: Capability value
            source: Source setting value
            scope: Capability value scope
        """
        # NOC modules
        from noc.inv.models.capability import Capability

        new_caps: list[CapsValue] = []
        caps = Capability.get_by_name(key)
        if not caps:
            return

        configs = self.get_caps_config()
        value = caps.clean_value(value)
        try:
            src = InputSource(source)
        except ValueError:
            src = InputSource.UNKNOWN
        scope = scope or None
        changed, is_new = False, True
        changed_fields: list[ChangeField] = []
        for item in self.iter_caps():
            if item.capability == caps:
                # Set found scope
                if is_new and item.scope == scope:
                    # Add Manual Source
                    is_new = False
                if item.scope == scope and item.value != value:
                    new_caps.append(item.set_value(value))
                    changed |= True
                    caps_logger.info("Change capability value: %s -> %s", item, value)
                    # Register changes
                    changed_fields = [ChangeField(field=item.name, old=item.value, new=value)]
                    continue
            new_caps.append(item)
        if is_new:
            new_caps.append(
                CapsValue(
                    capability=caps,
                    value=value,
                    source=src,
                    scope=scope or "",
                    config=configs.get(str(caps.pk), CapsConfig()),
                )
            )
            changed |= True
            changed_fields = [ChangeField(field=caps.name or key, old=None, new=value)]
            caps_logger.info("Adding capability: %s", new_caps[-1])
        if changed:
            self.save_caps(new_caps, changed_fields=changed_fields)

    def reset_caps(
        self: CapsHost,
        caps: str | None = None,
        scope: str | None = None,
        source: str | None = None,
    ) -> None:
        """
        Remove caps from object
        Args:
            caps: Caps Name
            scope: Scope name
            source: Source set
        """
        new_caps: list[CapsValue] = []
        changed_fields: list[ChangeField] = []
        src = InputSource(source) if source else None
        changed = False
        for item in self.iter_caps():
            if scope and scope == item.scope:
                changed |= True
                caps_logger.info("Removing capability by scope: %s", scope)
                changed_fields.append(ChangeField(field=item.name, old=str(item.value), new=None))
                continue
            if caps and caps == item.name and (not src or src == item.source):
                changed |= True
                caps_logger.info("Removing capability by name: %s", caps)
                changed_fields.append(ChangeField(field=item.name, old=str(item.value), new=None))
                continue
            new_caps.append(item)
        if changed:
            self.save_caps(new_caps, changed_fields=changed_fields)

    def update_caps(
        self: CapsHost,
        caps: Mapping[str, Any],
        source: str | InputSource,
        scope: str | None = None,
        dry_run: bool = False,
        bulk: Any | None = None,
        logger: logging.Logger | None = None,
    ) -> dict[str, Any]:
        """
        Update existing capabilities with a new ones.
        * if set scope - processed items over that scope
        * if not set scope - priority over if not set scope
        * For source in same scope - priority by default, Manual, Discovery
        Args:
            caps: dict of caps name -> caps value
            source: Source name
            scope: Scope name
            dry_run: Not save changes
            bulk: Changes aggregator
        """
        # NOC modules
        from noc.inv.models.capability import Capability

        o_label = f"{scope or ''}|{self}|{source}"
        if isinstance(source, str):
            try:
                source = InputSource(source)
            except ValueError:
                source = InputSource.UNKNOWN
        # Update existing capabilities
        logger = logger or caps_logger
        new_caps: list[CapsValue] = []
        seen: set[str] = set()
        changed = False
        changed_fields: list[ChangeField] = []
        for ci in self.iter_caps():
            if not scope or (scope and scope == ci.scope):
                seen.add(ci.name)
            if (scope and scope != ci.scope) or (not scope and ci.scope):
                # For Separate scope - skipping update (ETL)
                logger.debug(
                    "[%s] Not changing capability %s: from other scope '%s'",
                    o_label,
                    ci.name,
                    ci.scope or "",
                )
            elif ci.source == InputSource.MANUAL:
                # Manual Source set only for set_caps method
                logger.info(
                    "[%s] Not changing capability %s: Already set with source '%s'",
                    o_label,
                    ci.name,
                    ci.source,
                )
            elif ci.source == InputSource.DATABASE and not ci.scope:
                # Skip Database Caps without source, that set after separate discovery process
                # If not set scope - it clean.
                continue
            elif ci.name in caps:
                value = ci.capability.clean_value(caps[ci.name])
                if ci.value != value:
                    logger.info(
                        "[%s] Changing capability %s: %s -> %s",
                        o_label,
                        ci.name,
                        ci.value,
                        value,
                    )
                    changed_fields.append(
                        ChangeField(
                            field=ci.name,
                            old=ci.value,
                            new=value,
                        )
                    )
                    ci = ci.set_value(value)
                    changed |= True
                else:
                    logger.debug(
                        "[%s] Caps value is same for '%s': Set with source '%s'",
                        o_label,
                        ci.name,
                        ci.source.name,
                    )
            elif ci.name not in caps and source == ci.source:
                logger.info("[%s] Removing capability %s", o_label, ci)
                changed |= True
                changed_fields.append(
                    ChangeField(
                        field=ci.name,
                        old=ci.value,
                        new=None,
                    )
                )
                continue
            new_caps.append(ci)
        # Add new capabilities
        configs = self.get_caps_config()
        for cn in set(caps) - seen:
            c = Capability.get_by_name(cn)
            if not c:
                logger.info("[%s] Unknown capability %s, ignoring", o_label, cn)
                continue
            value = c.clean_value(caps[cn])
            logger.info("[%s] Adding capability %s = %s", o_label, cn, value)
            new_caps.append(
                CapsValue(
                    capability=c,
                    value=value,
                    source=source,
                    scope=scope or "",
                    config=configs.pop(str(c.pk), CapsConfig()),
                )
            )
            changed |= True
            changed_fields.append(
                ChangeField(
                    field=c.name or cn,
                    old=None,
                    new=value,
                )
            )

        if changed or changed_fields:
            logger.info("[%s] Saving changes", o_label)
            self.save_caps(new_caps, dry_run=dry_run, changed_fields=changed_fields)
        # get_caps
        result: dict[str, Any] = {}
        for ci in new_caps:
            result[ci.name] = ci.value
        return result


class DjangoCapsMixin(CapsMixin):
    """
    Capabilities support for Django-backed models.
    """

    def iter_caps(
        self: DjangoCapsHost, scope: str | None = None, include_default: bool = False
    ) -> Iterable[CapsValue]:
        """Iterate over model capabilities"""
        # NOC modules
        from noc.inv.models.capability import Capability

        configs = self.get_caps_config()

        for ci in self.caps or []:
            c = Capability.get_by_id(ci["capability"])
            if not c:
                caps_logger.info("Removing unknown capability id %s", ci["capability"])
                continue
            cs = ci.get("scope") or None
            if scope and scope != cs:
                continue
            try:
                source = InputSource(ci.get("source", "manual"))
            except ValueError:
                caps_logger.info(
                    "[%s] Unknown InputSource '%s'. Skipping...", c.name, ci.get("source")
                )
                continue
            value: Any = ci.get("value")
            value = c.clean_value(value)
            yield CapsValue(
                capability=c,
                value=value,
                source=source,
                scope=cs,
                config=configs.pop(str(c.pk), CapsConfig()),
            )
        if not include_default:
            return
        for cid, cfg in configs.items():
            c = Capability.get_by_id(cid)
            if not c:
                continue
            yield CapsValue(
                capability=c,
                value=c.clean_value(cfg.default_value) if cfg.default_value else None,
                source=InputSource.CONFIG,
                config=cfg,
            )

    def save_caps(
        self: DjangoCapsHost,
        caps: list[CapsValue],
        dry_run: bool = False,
        bulk: Any | None = None,
        changed_fields: list[ChangeField] | None = None,
    ) -> None:
        """Persist capability items to the Django database"""
        prev_labels: set[str] = set()
        caps_labels: set[str] = set()
        new_caps: list[Mapping[str, Any]] = []
        for c in caps:
            new_caps.append(
                {
                    "capability": str(c.capability.pk),
                    "value": c.value,
                    "source": c.source.value,
                    "scope": c.scope or "",
                }
            )
            if c.config.set_label:
                caps_labels |= set(c.get_labels() or ()) | {c.config.set_label}
        for c in self.iter_caps():
            if c.config.set_label and frozenset(c.get_labels() or ()) - caps_labels:
                prev_labels |= set(c.get_labels() or ()) | {c.config.set_label}
        self.caps = new_caps
        if dry_run or not self.id:
            return
        id_ = self.id
        set_op: dict[str, Any] = {"caps": self.caps}
        changed_fields = changed_fields or []
        # Update database include effective labels directly
        # to avoid full save
        if hasattr(self, "effective_labels") and (caps_labels or prev_labels):
            obj_labels = set(self.effective_labels)
            if obj_labels and prev_labels:
                obj_labels -= set(prev_labels)
            if caps_labels:
                obj_labels.update(caps_labels)
            changed_fields.append(ChangeField(field="effective_labels", new=sorted(obj_labels)))
            set_op["effective_labels"] = sorted(obj_labels)
        # Register changes
        change_tracker.register(
            "update",
            get_model_id(self),
            str(id_),
            fields=changed_fields,
            audit=True,
            datastreams=get_datastreams(self),
            domains=get_domains(self, changed_fields),
            reactions_rules=get_applied_rules(self, "update", changed_fields=changed_fields),
            caps=[cf.field for cf in changed_fields or []],
        )
        self.objects.filter(id=id_).update(**set_op)
        self.update_init()
        self._reset_caches(id_, credential=True)


class DocumentCapsMixin(CapsMixin):
    """
    Capabilities support for MongoEngine documents.
    """

    def iter_caps(
        self: DocumentCapsHost, scope: str | None = None, include_default: bool = False
    ) -> Iterable[CapsValue]:
        """Iterate over document capabilities"""
        # NOC modules
        from noc.inv.models.capability import Capability

        configs = self.get_caps_config()
        processed: set[str] = set()
        for ci in self.caps or []:
            if scope and scope != ci.scope:
                continue
            try:
                cs = InputSource(ci.source or "manual")
            except ValueError:
                cs = InputSource.UNKNOWN
            cv = ci.value
            cv = ci.capability.clean_value(cv)
            yield CapsValue(
                capability=ci.capability,
                value=cv,
                source=cs,
                scope=ci.scope or None,
                config=configs.get(str(ci.capability.pk), CapsConfig()),
            )
            processed.add(str(ci.capability.pk))
        if not include_default:
            return
        for cid, cfg in configs.items():
            c = Capability.get_by_id(cid)
            if not c or str(c.pk) in processed:
                continue
            yield CapsValue(
                capability=c,
                value=c.clean_value(cfg.default_value) if cfg.default_value else None,
                source=InputSource.CONFIG,
                config=cfg,
            )

    def save_caps(
        self: DocumentCapsHost,
        caps: list[CapsValue],
        dry_run: bool = False,
        bulk: Any | None = None,
        changed_fields: list[ChangeField] | None = None,
    ) -> None:
        """Persist capability items to the MongoDB database"""
        # NOC modules
        from noc.inv.models.capsitem import CapsItem

        prev_labels: set[str] = set()
        caps_labels: set[str] = set()
        new_caps: list[CapsItem] = []
        for c in caps:
            new_caps.append(
                CapsItem(
                    capability=c.capability,
                    value=c.value,
                    source=c.source.value,
                    scope=c.scope or "",
                )
            )
            if c.config.set_label:
                caps_labels |= set(c.get_labels() or ()) | {c.config.set_label}
        for c in self.iter_caps():
            if c.config.set_label and frozenset(c.get_labels() or ()) - caps_labels:
                prev_labels |= set(c.get_labels() or ()) | {c.config.set_label}
        self.caps = new_caps
        if dry_run or getattr(self, "_created", False):
            return
        set_op: dict[str, Any] = {"caps": self.caps}
        changed_fields = changed_fields or []
        # Update database include effective labels directly
        # to avoid full save
        if hasattr(self, "effective_labels") and (caps_labels or prev_labels):
            obj_labels = set(self.effective_labels)
            if obj_labels and prev_labels:
                obj_labels -= set(prev_labels)
            if caps_labels:
                obj_labels.update(caps_labels)
            changed_fields.append(ChangeField(field="effective_labels", new=sorted(obj_labels)))
            set_op["effective_labels"] = sorted(obj_labels)
        # Register changes
        change_tracker.register(
            "update",
            get_model_id(self),
            str(self.pk),
            fields=changed_fields,
            audit=True,
            datastreams=get_datastreams(self),
            domains=get_domains(self, changed_fields),
            reactions_rules=get_applied_rules(self, "update", changed_fields=changed_fields),
            caps=[cf.field for cf in changed_fields or []],
        )
        self.update(**set_op)
        on_save_caps = getattr(self, "on_save_caps", None)
        if on_save_caps is not None:
            on_save_caps(changed_fields, dry_run=dry_run)
