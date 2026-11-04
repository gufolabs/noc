# ----------------------------------------------------------------------
# i18n utilities
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime as dt
import json
import yaml
from decimal import Decimal
from pathlib import Path
from threading import Lock

# Third-party modules
from icu4py.locale import Locale
from icu4py.messageformat import MessageFormat

# NOC modules
from noc.config import config

__all__ = ["t"]


MessageArg = str | int | float | dt.datetime | dt.date | Decimal
_SENTINEL = object()


class MessageCatalog:
    """Thread-safe, lazy-loaded catalog of ICU MessageFormat messages.

    Loads translations for the requested language with fallback to English.
    Message patterns are compiled lazily and cached on first access.

    Args:
        language: Language identifier used to select the translation catalog.
        locale_base: Directory containing translation catalogs. Defaults to
            the project's i18n directory.
    """

    FALLBACK_LANGUAGE = "en"

    def __init__(self, language: str, locale_base: Path | None = None) -> None:
        self._language = language
        self._base = locale_base or config.noc_base / "i18n"
        self._locale = Locale(language)
        self._loaded = False
        self._patterns: dict[str, str] = {}
        self._msg_formats: dict[str, MessageFormat | None] = {}
        self._lock = Lock()

    def __getitem__(self, key: str) -> MessageFormat:
        """Get a compiled message format by key.

        The message is compiled and cached on first access.

        Args:
            key: Message key.

        Returns:
            Compiled ICU MessageFormat.

        Raises:
            KeyError: If the message key is not found.
        """
        v = self._msg_formats.get(key, _SENTINEL)
        if v is None:
            raise KeyError(f"{key} is not found")
        if v is _SENTINEL:
            with self._lock:
                v = self._msg_formats.get(key, _SENTINEL)
                if v is not _SENTINEL:
                    if v is None:
                        raise KeyError(f"{key} is not found")
                    return v
                if not self._loaded:
                    self._load_patterns()
                pattern = self._patterns.get(key, _SENTINEL)
                if pattern is _SENTINEL:
                    self._msg_formats[key] = None
                    raise KeyError(f"{key} is not found")
                v = MessageFormat(pattern, locale=self._locale)
                self._msg_formats[key] = v
        return v

    def _load_patterns(self) -> None:
        """Load message patterns with fallback to the default language.

        Patterns from the requested language override patterns from the
        fallback language.
        """
        if self._language != self.FALLBACK_LANGUAGE:
            patterns = self._get_patterns(self.FALLBACK_LANGUAGE)
        else:
            patterns = {}
        patterns.update(self._get_patterns(self._language))
        self._patterns = patterns
        self._loaded = True

    def _get_patterns(self, language: str) -> dict[str, str]:
        """Load message patterns for a language.

        Looks for a JSON catalog first, then falls back to YAML.

        Args:
            language: Language identifier.

        Returns:
            Mapping of message keys to ICU MessageFormat patterns.

        Raises:
            RuntimeError: If no supported catalog file is found.
        """
        path = self._base / language
        json_path = path.with_suffix(".json")
        if json_path.exists():
            return self._get_json_patterns(json_path)
        yaml_path = path.with_suffix(".yml")
        if yaml_path.exists():
            return self._get_yaml_patterns(yaml_path)
        raise RuntimeError(f"Unsupported language {language}")

    @staticmethod
    def _get_json_patterns(path: Path) -> dict[str, str]:
        """Load a translation catalog from a JSON file.

        Args:
            path: Path to the JSON catalog.

        Returns:
            Mapping of message keys to ICU MessageFormat patterns.
        """
        with path.open() as fp:
            return json.load(fp)

    @staticmethod
    def _get_yaml_patterns(path: Path) -> dict[str, str]:
        """Load a translation catalog from a YAML file.

        Args:
            path: Path to the YAML catalog.

        Returns:
            Mapping of message keys to ICU MessageFormat patterns.
        """
        with path.open() as fp:
            return yaml.safe_load(fp)


def t(key: str, **kwargs: MessageArg) -> str:
    """Translate and format a message.

    Args:
        key: Stable message key in the translation catalog.
        **kwargs: Named arguments used for message formatting.
            Missing arguments are left uninterpolated.

    Returns:
        Formatted message in the current locale.

    Raises:
        KeyError: If the message key is not found in the catalog.
    """
    fmt = catalog[key]
    return fmt.format(kwargs)


catalog = MessageCatalog(config.language)
