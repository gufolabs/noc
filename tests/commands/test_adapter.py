# ----------------------------------------------------------------------
# adapter command test
# ----------------------------------------------------------------------

# Python modules
from io import StringIO

# Third-party modules
import pytest

# NOC modules
from noc.commands.adapter import Command


def run(argv):
    out = StringIO()
    cmd = Command(stdout=out)
    return cmd.run_from_argv(argv), out.getvalue()


@pytest.mark.parametrize(
    ("name", "expected"),
    [
        ("Cisco.IOS", "cisco__ios"),
        ("3Com.4500", "_3com__4500"),
        ("IRE-Polus.Horizon", "ire_polus__horizon"),
        ("Brocade.CER-ADV", "brocade__cer_adv"),
        ("DLink.DxS_Cisco_CLI", "dlink__dxs_cisco_cli"),
        ("Generic.Host", "generic__host"),
        ("Cisco.ROS.XR", "cisco__ros__xr"),
        ("_Foo.Bar", "__foo__bar"),
    ],
)
def test_mangle(name: str, expected: str) -> None:
    rc, out = run(["mangle", name])
    assert rc == 0
    assert out == f"{expected}\n"


def test_mangle_requires_subcommand() -> None:
    with pytest.raises(SystemExit) as e:
        run([])
    assert e.value.code == 2
