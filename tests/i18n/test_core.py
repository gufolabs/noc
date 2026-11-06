# ----------------------------------------------------------------------
# noc.core.i18n unittests
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import json
from pathlib import Path
from types import SimpleNamespace

# Third-party modules
import pytest

# NOC modules
from noc.config import Language
from noc.core import i18n


def write_json_catalog(base: Path, language: str, messages: dict[str, str]) -> Path:
    """Write a JSON catalog and return its path."""
    path = base / f"{language}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(messages, ensure_ascii=False), encoding="utf-8")
    return path


def write_yaml_catalog(base: Path, language: str, contents: str) -> Path:
    """Write a YAML catalog and return its path."""
    path = base / f"{language}.yml"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(contents, encoding="utf-8")
    return path


def test_catalog_uses_default_location(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """The default catalog location is noc_base/i18n."""
    base = tmp_path / "project"
    write_json_catalog(base / "i18n", "en", {"hello": "Hello"})
    monkeypatch.setattr(i18n, "config", SimpleNamespace(noc_base=base))

    catalog = i18n.MessageCatalog(Language.EN)

    assert catalog["hello"].format({}) == "Hello"
    assert catalog._base == base / "i18n"


def test_catalog_loads_json_and_caches_compiled_message(tmp_path: Path) -> None:
    """JSON catalogs load lazily and compiled messages are reused."""
    write_json_catalog(tmp_path, "en", {"hello": "Hello, {name}!"})
    catalog = i18n.MessageCatalog(Language.EN, tmp_path)

    assert catalog._loaded is False
    message = catalog["hello"]

    assert catalog._loaded is True
    assert message.format({"name": "NOC"}) == "Hello, NOC!"
    assert catalog["hello"] is message


def test_catalog_loads_yaml(tmp_path: Path) -> None:
    """YAML is used when a JSON catalog is absent."""
    write_yaml_catalog(tmp_path, "en", 'hello: "Hello from YAML"\n')
    catalog = i18n.MessageCatalog(Language.EN, tmp_path)

    assert catalog["hello"].format({}) == "Hello from YAML"


def test_json_catalog_takes_precedence_over_yaml(tmp_path: Path) -> None:
    """A JSON catalog wins when both supported formats are present."""
    write_json_catalog(tmp_path, "en", {"hello": "JSON"})
    write_yaml_catalog(tmp_path, "en", 'hello: "YAML"\n')
    catalog = i18n.MessageCatalog(Language.EN, tmp_path)

    assert catalog["hello"].format({}) == "JSON"


def test_catalog_uses_english_fallback_and_local_translation(tmp_path: Path) -> None:
    """Localized patterns override English while absent keys fall back."""
    write_json_catalog(
        tmp_path,
        "en",
        {
            "greeting": "Hello",
            "farewell": "Goodbye",
            "items": "{count, plural, one {# item} other {# items}}",
        },
    )
    write_yaml_catalog(
        tmp_path,
        "ru",
        'greeting: "Привет"\n'
        'items: "{count, plural, one {# предмет} few {# предмета} '
        'many {# предметов} other {# предмета}}"\n',
    )
    catalog = i18n.MessageCatalog(Language.RU, tmp_path)

    assert catalog["greeting"].format({}) == "Привет"
    assert catalog["farewell"].format({}) == "Goodbye"


def test_catalog_accepts_language_enum(tmp_path: Path) -> None:
    """MessageCatalog accepts the configured language enum directly."""
    write_json_catalog(tmp_path, "en", {"hello": "Hello"})
    write_json_catalog(tmp_path, "pt_BR", {"hello": "Olá"})
    catalog = i18n.MessageCatalog(Language.PT_BR, tmp_path)

    assert catalog._language is Language.PT_BR
    assert catalog["hello"].format({}) == "Olá"


@pytest.mark.parametrize(
    ("language", "pattern", "values"),
    [
        (
            Language.EN,
            "{count, plural, one {# item} other {# items}}",
            [(1, "1 item"), (2, "2 items")],
        ),
        (
            Language.RU,
            (
                "{count, plural, one {# предмет} few {# предмета} "
                "many {# предметов} other {# предмета}}"
            ),
            [
                (1, "1 предмет"),
                (2, "2 предмета"),
                (5, "5 предметов"),
                (21, "21 предмет"),
            ],
        ),
    ],
)
def test_plural_categories(
    tmp_path: Path, language: Language, pattern: str, values: list[tuple[int, str]]
) -> None:
    """ICU plural rules select the expected forms for English and Russian."""
    if language != Language.EN:
        write_json_catalog(
            tmp_path,
            "en",
            {"items": "{count, plural, one {# item} other {# items}}"},
        )
    write_json_catalog(tmp_path, language.value, {"items": pattern})
    catalog = i18n.MessageCatalog(language, tmp_path)

    for count, expected in values:
        assert catalog["items"].format({"count": count}) == expected


def test_catalog_missing_key_error(tmp_path: Path) -> None:
    """Missing keys raise KeyError on both the first and later lookups."""
    write_json_catalog(tmp_path, "en", {"present": "Here"})
    catalog = i18n.MessageCatalog(Language.EN, tmp_path)
    with pytest.raises(KeyError, match="'absent'"):
        catalog["absent"]


@pytest.mark.parametrize("language", [Language.EN, Language.RU])
def test_catalog_raises_for_unsupported_language(tmp_path: Path, language: Language) -> None:
    """A missing requested catalog or missing fallback catalog is reported."""
    if language == Language.RU:
        write_json_catalog(tmp_path, "ru", {"hello": "Привет"})
    catalog = i18n.MessageCatalog(language, tmp_path)

    with pytest.raises(RuntimeError, match="Unsupported language"):
        catalog["hello"]


def test_translation_helper_uses_current_catalog(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    """The public t helper formats through the current module catalog."""
    write_json_catalog(tmp_path, "en", {"hello": "Hello, {name}!"})
    monkeypatch.setattr(i18n, "catalog", i18n.MessageCatalog(Language.EN, tmp_path))

    assert i18n.t("hello", name="NOC") == "Hello, NOC!"


def test_translation_helper_preserves_missing_arguments(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    """Arguments absent from kwargs remain as placeholders in the output."""
    write_json_catalog(tmp_path, "en", {"hello": "Hello, {name}! {missing}"})
    monkeypatch.setattr(i18n, "catalog", i18n.MessageCatalog(Language.EN, tmp_path))

    assert i18n.t("hello", name="NOC") == "Hello, NOC! {missing}"
