# ----------------------------------------------------------------------
# noc.core.i18n catalog tests
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from pathlib import Path

# Third-party modules
import pytest
import yaml

# NOC modules
from noc.config import Language
from noc.core.i18n import MessageCatalog

I18N_PATH = Path(__file__).parents[2] / "src" / "noc" / "i18n"


@pytest.fixture(scope="module")
def en_catalog() -> MessageCatalog:
    catalog = MessageCatalog(Language.EN, I18N_PATH)
    catalog._load_patterns()
    return catalog


@pytest.mark.parametrize("language", list(Language))
def test_catalog_loads_all_messages(language: Language) -> None:
    """Every configured language catalog loads and compiles its messages."""
    catalog = MessageCatalog(language, I18N_PATH)
    n = 0
    for key in catalog:
        catalog[key]
        n += 1
    assert n > 0, "Catalog must not be empty"


@pytest.mark.parametrize("language", [lang for lang in Language if lang != Language.EN])
def test_catalog_equality(language: Language, en_catalog: MessageCatalog) -> None:
    en_keys = set(en_catalog)
    assert en_keys
    catalog = MessageCatalog(language, I18N_PATH)
    lang_keys = set(catalog)
    assert lang_keys
    assert en_keys == lang_keys


@pytest.mark.parametrize("language", list(Language))
def test_catalog_keys_are_sorted_alphabetically(language: Language) -> None:
    """Every YAML message catalog keeps its keys in alphabetical order."""
    path = I18N_PATH / f"{language.value}.yml"
    with path.open(encoding="utf-8") as fp:
        catalog = yaml.safe_load(fp)
    source_keys = [line.partition(":")[0] for line in path.read_text().splitlines() if line]

    assert source_keys == sorted(source_keys), f"Keys in {path} must be sorted alphabetically"
    assert len(source_keys) == len(catalog), f"Keys in {path} must be unique"
