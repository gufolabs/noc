# ---------------------------------------------------------------------
# Fix: convert custom adapters
# ---------------------------------------------------------------------

# Python modules
import shutil
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


def _profile_py(body: str = '    """Equipment profile."""\n    pattern_more = []\n') -> str:
    return (
        '"""Profile."""\n'
        "from noc.core.profile.base import BaseProfile\n"
        "\n"
        "\n"
        "class Profile(BaseProfile):\n" + body
    )


def test_convert_and_idempotency(tmp_path, capsys):
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
    assert "unmapped" not in capsys.readouterr().out
    # Idempotency: a second run is a no-op
    snapshot = {p: p.read_text() for p in (tmp_path / "adapters").rglob("*.py")}
    convert_base(tmp_path)
    assert {p: p.read_text() for p in (tmp_path / "adapters").rglob("*.py")} == snapshot
    assert "Nothing to convert" in capsys.readouterr().out


def test_builtin_cross_reference(tmp_path, capsys):
    # A custom script importing a built-in profile module: the reference
    # is left in place and reported for a manual fix
    _make_legacy_base(tmp_path)
    (tmp_path / "adapters" / "acme__router").mkdir(parents=True)
    (tmp_path / "adapters" / "acme__router" / "profile.py").write_text(
        _profile_py('    name = "Acme.Router"\n')
    )
    (tmp_path / "adapters" / "acme__router" / "get_version.py").write_text(
        "from noc.sa.profiles.Cisco.IOS.get_version import Script  # noqa: F401\n"
    )
    convert_base(tmp_path)
    text = (tmp_path / "adapters" / "acme__router" / "get_version.py").read_text()
    assert "noc.sa.profiles.Cisco.IOS" in text  # left in place, not broken
    out = capsys.readouterr().out
    assert "unmapped legacy reference" in out
    assert "./noc adapter mangle" in out


def test_generic_built_in_reference(tmp_path, capsys):
    # The documented generic-extension idiom is rewritten unconditionally
    _make_legacy_base(tmp_path)
    (tmp_path / "adapters" / "acme__router").mkdir(parents=True)
    (tmp_path / "adapters" / "acme__router" / "profile.py").write_text(
        _profile_py('    name = "Acme.Router"\n')
    )
    for i, ref in enumerate(
        (
            "from noc.sa.profiles.Generic.Host.get_interfaces import Script  # noqa: F401\n",
            "from noc.sa.profiles.Generic.get_metrics import Script  # noqa: F401\n",
        ),
        1,
    ):
        (tmp_path / "adapters" / "acme__router" / f"gen{i}.py").write_text(ref)
    convert_base(tmp_path)
    for f in (tmp_path / "adapters" / "acme__router").glob("gen*.py"):
        text = f.read_text()
        assert "noc.sa.profiles" not in text
        assert "noc.adapters.generic__host." in text
    assert "unmapped" not in capsys.readouterr().out


def test_collision_skips_duplicate(tmp_path, capsys):
    # Two legacy profiles mangling to the same flat name (- and _ are
    # indistinguishable after mangling): only the first is converted,
    # the second is skipped with a warning and kept in place for manual
    # resolution
    _make_legacy_base(tmp_path)
    legacy = tmp_path / "sa" / "profiles"
    (legacy / "CERION" / "CER_ADV").mkdir()
    (legacy / "CERION" / "CER_ADV" / "__init__.py").touch()
    (legacy / "CERION" / "CER_ADV" / "profile.py").write_text(_profile_py())
    convert_base(tmp_path)
    out = capsys.readouterr().out
    adv = tmp_path / "adapters" / "cerion__cer_adv" / "profile.py"
    assert adv.is_file()
    assert 'name = "CERION.CER-ADV"' in adv.read_text()  # First one wins
    assert (legacy / "CERION" / "CER_ADV" / "profile.py").is_file()  # Conflicting one kept
    assert "WARNING: duplicate flat name, skip CERION.CER_ADV" in out


def test_name_inserted_without_docstring(tmp_path, capsys):
    legacy = tmp_path / "sa" / "profiles"
    (legacy / "ACME" / "Router").mkdir(parents=True)
    (legacy / "ACME" / "__init__.py").touch()
    (legacy / "ACME" / "Router" / "__init__.py").touch()
    (legacy / "ACME" / "Router" / "profile.py").write_text(
        "from noc.core.profile.base import BaseProfile\n"
        "\n"
        "\n"
        "class Profile(BaseProfile):\n"
        "    pattern_more = []\n"
    )
    convert_base(tmp_path)
    text = (tmp_path / "adapters" / "acme__router" / "profile.py").read_text()
    assert 'name = "ACME.Router"' in text
    assert text.index("name = ") < text.index("pattern_more = ")


def test_existing_name_not_touched(tmp_path, capsys):
    legacy = tmp_path / "sa" / "profiles"
    (legacy / "ACME" / "Router").mkdir(parents=True)
    (legacy / "ACME" / "__init__.py").touch()
    (legacy / "ACME" / "Router" / "__init__.py").touch()
    (legacy / "ACME" / "Router" / "profile.py").write_text(
        _profile_py('    name = "ACME.Router"\n    pattern_more = []\n')
    )
    convert_base(tmp_path)
    text = (tmp_path / "adapters" / "acme__router" / "profile.py").read_text()
    assert text.count('name = "ACME.Router"') == 1


def test_interrupted_run_converges(tmp_path, capsys):
    # A run interrupted after the move: the legacy vendor directory is
    # gone, the name attribute and import rewrite are still missing.
    # Re-running must repair what is derivable: the name attribute is
    # inserted (falling back to the flat directory name, since the
    # logical name is no longer derivable) and the unmapped legacy
    # reference is reported for a manual fix.
    _make_legacy_base(tmp_path)
    legacy = tmp_path / "sa" / "profiles"
    dst = tmp_path / "adapters" / "cerion__cer_adv"
    dst.mkdir(parents=True)
    for p in (legacy / "CERION" / "CER-ADV").iterdir():
        shutil.move(str(p), str(dst / p.name))
    (legacy / "CERION" / "CER-ADV").rmdir()
    (legacy / "CERION" / "__init__.py").unlink()
    (legacy / "CERION").rmdir()
    convert_base(tmp_path)
    out = capsys.readouterr().out
    text = (dst / "profile.py").read_text()
    assert 'name = "cerion__cer_adv"' in text  # Logical name not derivable anymore
    # The reference to the already-moved profile is reported, not silently broken
    assert "unmapped legacy reference" in out
    assert "CERION.CER_ADV" in out
    # The still-legacy profile is converted normally and the legacy tree is cleaned
    assert (tmp_path / "adapters" / "_3com__4500" / "profile.py").is_file()
    assert not (legacy / "CERION").exists()


def test_no_legacy(tmp_path, capsys):
    (tmp_path / "adapters" / "acme__router").mkdir(parents=True)
    (tmp_path / "adapters" / "acme__router" / "profile.py").write_text(
        _profile_py('    name = "Acme.Router"\n')
    )
    convert_base(tmp_path)
    assert not (tmp_path / "sa").exists()
    assert "unmapped" not in capsys.readouterr().out


def test_sa_interfaces_survives(tmp_path, capsys):
    _make_legacy_base(tmp_path)
    (tmp_path / "sa" / "interfaces").mkdir()
    (tmp_path / "sa" / "interfaces" / "icustom.py").write_text("x = 1\n")
    convert_base(tmp_path)
    assert (tmp_path / "sa" / "interfaces" / "icustom.py").is_file()
    assert not (tmp_path / "sa" / "profiles").exists()
