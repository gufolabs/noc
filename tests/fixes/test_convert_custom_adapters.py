# ---------------------------------------------------------------------
# Fix: convert custom adapters
# ---------------------------------------------------------------------

# Python modules
from pathlib import Path

# NOC modules
from noc.fixes.convert_custom_adapters import convert_base


def _make_legacy_base(root: Path) -> None:
    (root / "sa" / "profiles" / "CERION" / "CER-ADV").mkdir(parents=True)
    (root / "sa" / "profiles" / "_3Com" / "_4500").mkdir(parents=True)
    for d in (root / "sa" / "profiles" / "CERION", root / "sa" / "profiles" / "_3Com"):
        (d / "__init__.py").touch()
    for sw in ("CER-ADV", "_4500"):
        v = "CERION" if sw == "CER-ADV" else "_3Com"
        d = root / "sa" / "profiles" / v / sw
        (d / "__init__.py").touch()
        (d / "profile.py").write_text(
            '"""Profile."""\n'
            "from noc.core.profile.base import BaseProfile\n"
            "\n"
            "\n"
            "class Profile(BaseProfile):\n"
            '    """Equipment profile."""\n'
            "    pattern_more = []\n"
        )
        (d / "get_version.py").write_text(
            "from noc.sa.interfaces.iversion import IVersion\n"
            "from noc.sa.profiles.CERION.CER_ADV.profile import Profile  # noqa: F401\n"
        )
    (root / "sa" / "__init__.py").touch()
    (root / "sa" / "profiles" / "__init__.py").touch()


def test_convert_and_idempotency(tmp_path):
    _make_legacy_base(tmp_path)
    convert_base(tmp_path)
    # Directories converted
    adv = tmp_path / "adapters" / "cerion__cer_adv"
    c4500 = tmp_path / "adapters" / "_3com__4500"
    assert (adv / "profile.py").is_file()
    assert (adv / "get_version.py").is_file()
    assert (c4500 / "profile.py").is_file()
    # name attribute added
    for name, d in (("CERION.CER-ADV", adv), ("3Com.4500", c4500)):
        text = (d / "profile.py").read_text()
        assert f'name = "{name}"' in text
        assert text.count("class Profile(BaseProfile):") == 1
        # The class body keeps the rest of the attributes
        assert "pattern_more = []" in text
    # Imports rewritten
    vtext = (adv / "get_version.py").read_text()
    assert "noc.sa.profiles" not in vtext
    assert "noc.adapters.cerion__cer_adv.profile" in vtext
    # Legacy layout gone
    assert not (tmp_path / "sa").exists()
    # Idempotency: a second run is a no-op
    snapshot = {p: p.read_text() for p in (tmp_path / "adapters").rglob("*.py")}
    convert_base(tmp_path)
    assert {p: p.read_text() for p in (tmp_path / "adapters").rglob("*.py")} == snapshot


def test_no_legacy(tmp_path):
    (tmp_path / "adapters").mkdir()
    convert_base(tmp_path)
    assert not (tmp_path / "sa").exists()


def test_generic_vendor_level(tmp_path):
    # Generic.Host lived at the vendor level in the legacy layout
    (tmp_path / "sa" / "profiles" / "Generic" / "Host").mkdir(parents=True)
    (tmp_path / "sa" / "profiles" / "Generic" / "__init__.py").touch()
    (tmp_path / "sa" / "profiles" / "Generic" / "Host" / "__init__.py").touch()
    (tmp_path / "sa" / "profiles" / "Generic" / "Host" / "profile.py").write_text(
        "from noc.core.profile.base import BaseProfile\n\n\nclass Profile(BaseProfile):\n    pass\n"
    )
    (tmp_path / "adapters" / "cisco__ios").mkdir(parents=True)
    (tmp_path / "adapters" / "cisco__ios" / "get_version.py").write_text(
        "from noc.sa.profiles.Generic.get_version import Script\n"
    )
    convert_base(tmp_path)
    assert (tmp_path / "adapters" / "generic__host" / "profile.py").is_file()
    text = (tmp_path / "adapters" / "cisco__ios" / "get_version.py").read_text()
    assert "noc.adapters.generic__host.get_version" in text


def test_sa_interfaces_survives(tmp_path):
    _make_legacy_base(tmp_path)
    (tmp_path / "sa" / "interfaces").mkdir()
    (tmp_path / "sa" / "interfaces" / "icustom.py").write_text("x = 1\n")
    convert_base(tmp_path)
    assert (tmp_path / "sa" / "interfaces" / "icustom.py").is_file()
    assert not (tmp_path / "sa" / "profiles").exists()
