# ----------------------------------------------------------------------
# noc.core.i18n catalog tests
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import re
import yaml
from pathlib import Path

# Third-party modules
import pytest

# NOC modules
from noc.config import Language
from noc.core.i18n import MessageCatalog

I18N_PATH = Path(__file__).parents[2] / "src" / "noc" / "i18n"
ALL_LANGUAGES = list(Language)
NON_EN_LANGUAGES = [l for l in ALL_LANGUAGES if l is not Language.EN]
PROSE_TOKEN_PATTERNS = [
    (re.compile(r"\{\{.*?\}\}['\"]?\.\w+|\{\{.*?\}\}|\{[^{}]*\}"), "TOKEN"),
    (re.compile(r"<[^>]*>"), " TAG "),
    (re.compile(r"&[A-Za-z]+;"), " ENTITY "),
    (re.compile(r"\b(?:e\.g|i\.e)\.", re.IGNORECASE), "ABBREVIATION"),
    (re.compile(r"\bЗ\.О\."), "ABBREVIATION"),
    (re.compile(r"\bFirmwarePolice\.Inventory\b"), "TOKEN"),
    (re.compile(r"\bdd\.mm\.yyyy\b", re.IGNORECASE), "DATE"),
    (re.compile(r"(?<!\w)\.?\d+(?:[.,]\d+)+(?:/\d+)?"), "NUMBER"),
    (re.compile(r"\b\d{1,2}:\d{2}(?::\d{2})?\b"), "TIME"),
    (re.compile(r"\b\d+:\d+\b"), "NUMBER"),
    (
        re.compile(
            r"(?<![A-F0-9])(?:[A-F0-9]{2}:){1,5}(?:[A-F0-9]{2})?(?![A-F0-9])"
            r"|(?<![A-F0-9])(?::[A-F0-9]{2}){1,6}",
            re.IGNORECASE,
        ),
        "ADDRESS",
    ),
]
ELLIPSIS_RE = re.compile(r"\.{3,}")
SPACE_BEFORE_ELLIPSIS_RE = re.compile(r"\s+\.\.\.")
SPACE_BEFORE_PUNCTUATION_RE = re.compile(r"\S\s+[:;,.]")
SPACE_AFTER_PUNCTUATION_RE = re.compile(r"[:;,.](?=[^\W_])")
LEADING_PUNCTUATION_RE = re.compile(r"^[^\w\s%]")
TEXT_CHARACTER_RE = re.compile(r"\w")


def _prose_text(value: str, *, mask_ellipsis: bool = True) -> str:
    """Remove markup and technical tokens before checking prose punctuation."""
    if mask_ellipsis:
        value = ELLIPSIS_RE.sub("ELLIPSIS", value)
    for pattern, replacement in PROSE_TOKEN_PATTERNS:
        value = pattern.sub(replacement, value)
    return value


def _catalog_values(language: Language) -> dict[str, str]:
    """Load raw translation values for a language."""
    path = I18N_PATH / f"{language.value}.yml"
    with path.open(encoding="utf-8") as fp:
        return yaml.safe_load(fp)


@pytest.fixture(scope="module")
def en_catalog() -> MessageCatalog:
    catalog = MessageCatalog(Language.EN, I18N_PATH)
    catalog._load_patterns()
    return catalog


@pytest.mark.parametrize("language", ALL_LANGUAGES)
def test_catalog_loads_all_messages(language: Language) -> None:
    """Every configured language catalog loads and compiles its messages."""
    catalog = MessageCatalog(language, I18N_PATH)
    n = 0
    for key in catalog:
        catalog[key]
        n += 1
    assert n > 0, "Catalog must not be empty"


@pytest.mark.parametrize("language", NON_EN_LANGUAGES)
def test_catalog_contains_only_english_keys(language: Language, en_catalog: MessageCatalog) -> None:
    """Localized catalogs cannot introduce keys missing from English."""
    en_keys = set(en_catalog)
    assert en_keys
    catalog = MessageCatalog(language, I18N_PATH)
    lang_keys = set(catalog)
    assert lang_keys <= en_keys


@pytest.mark.parametrize("language", ALL_LANGUAGES)
def test_catalog_keys_are_sorted_alphabetically(language: Language) -> None:
    """Every YAML message catalog keeps its keys in alphabetical order."""
    path = I18N_PATH / f"{language.value}.yml"
    source_keys = [
        line.partition(":")[0] for line in path.read_text(encoding="utf-8").splitlines() if line
    ]

    assert source_keys == sorted(source_keys), f"Keys in {path} must be sorted alphabetically"


@pytest.mark.parametrize("language", ALL_LANGUAGES)
def test_catalog_keys_are_unique(language: Language) -> None:
    """Every YAML message catalog contains each key exactly once."""
    path = I18N_PATH / f"{language.value}.yml"
    source_keys = [
        line.partition(":")[0] for line in path.read_text(encoding="utf-8").splitlines() if line
    ]
    assert len(source_keys) == len(set(source_keys)), f"Duplicate keys in {path}"


@pytest.mark.parametrize("language", ALL_LANGUAGES)
def test_catalog_values_have_no_leading_or_trailing_whitespace(language: Language) -> None:
    """Translation values cannot start or end with whitespace."""
    for key, value in _catalog_values(language).items():
        assert isinstance(value, str), f"{language.value}:{key} must be a string"
        assert value == value.strip(), f"{language.value}:{key} has edge whitespace: {value!r}"


@pytest.mark.parametrize("language", ALL_LANGUAGES)
def test_catalog_ellipsis_has_no_preceding_space(language: Language) -> None:
    """An ellipsis is attached to the preceding word."""
    for key, value in _catalog_values(language).items():
        assert not SPACE_BEFORE_ELLIPSIS_RE.search(value), f"{language.value}:{key}: {value!r}"


@pytest.mark.parametrize("language", ALL_LANGUAGES)
def test_catalog_prose_punctuation_spacing(language: Language) -> None:
    """Prose punctuation is attached on the left and spaced on the right."""
    for key, value in _catalog_values(language).items():
        text = _prose_text(value)
        assert not SPACE_BEFORE_PUNCTUATION_RE.search(text), f"{language.value}:{key}: {value!r}"
        assert not SPACE_AFTER_PUNCTUATION_RE.search(text), f"{language.value}:{key}: {value!r}"


@pytest.mark.parametrize("language", ALL_LANGUAGES)
def test_catalog_text_does_not_start_with_punctuation(language: Language) -> None:
    """Text values cannot begin with punctuation; symbol-only labels are allowed."""
    for key, value in _catalog_values(language).items():
        if value.lstrip().startswith("{"):
            continue  # ICU arguments or plural patterns are not visible text.
        text = _prose_text(value, mask_ellipsis=False).lstrip()
        if TEXT_CHARACTER_RE.search(text):
            assert not LEADING_PUNCTUATION_RE.search(text), f"{language.value}:{key}: {value!r}"
