# ----------------------------------------------------------------------
# GridVCS test
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
import bsdiff4
import pytest

# NOC modules
from noc.core.comp import smart_text
from noc.core.gridvcs.base import GridVCS

SRC_F0 = """interface Gi0/1
    description test
"""

DELTA_F0 = b"""interface Gi1/0/1
    description Changed
"""

RESULT_F0 = smart_text(DELTA_F0)


SRC_b1 = """interface Gi0/1
    description 1st

interface Gi0/2
    description 2nd
"""

DELTA_b1 = (
    b"\x00\x00\x00\x10\x00\x00\x00$\x00\x00\x00\x1e    description 1st interface\n"
    b"\x00\x00\x005\x00\x00\x00I\x00\x00\x00\x1b    description 2nd uplink\n"
)

RESULT_b1 = """interface Gi0/1
    description 1st interface

interface Gi0/2
    description 2nd uplink
"""

SRC_B2 = """interface Gi0/1
    description 1st

interface Gi0/2
    description 2nd
"""

DELTA_B2 = (
    b"BSDIFF40;\x00\x00\x00\x00\x00\x00\x00'\x00\x00\x00\x00\x00\x00\x00Z"
    b"\x00\x00\x00\x00\x00\x00\x00BZh91AY&SY^P%R\x00\x00\x14p@xh\x00\x10\n\x00"
    b"@\x00 \x00!\x8adm5\x08\x06\x9ahck[\xf1\x044B\x9c\x12\x92\x9f\x17rE8P"
    b"\x90^P%RBZh91AY&SY\x1b\xd1\xa7\xd9\x00\x00\x00D\x00@\x00\x00\x02 \x00!"
    b"\x00\x82\x83\x17rE8P\x90\x1b\xd1\xa7\xd9BZh91AY&SYSjp"
    b"\x12\x00\x00\x00\xd1\x80\x00\x10@\x00\x00-B"
    b"\x00 \x00!\x88\xc4\x10\xc0\x8dX\xe5\xbd<]\xc9\x14\xe1BAM\xa9\xc0H"
)

RESULT_B2 = """interface Gi0/1
    description 1st interface

interface Gi0/2
    description 2nd uplink
"""


@pytest.mark.parametrize(
    ("dtype", "src", "delta", "result"),
    [
        ("F", SRC_F0, DELTA_F0, RESULT_F0),
        ("b", SRC_b1, DELTA_b1, RESULT_b1),
        ("B", SRC_B2, DELTA_B2, RESULT_B2),
    ],
)
def test_apply_delta(dtype, src, delta, result) -> None:
    assert GridVCS.apply_delta(dtype, src, delta) == result


SRC_z0 = b"""interface Gi0/1
    description 1st

interface Gi0/2
    description 2nd
"""

RESULT_z0 = (
    b"x\x9c\xcb\xcc+I-JKLNUp\xcf4\xd07\xe4R\x00\x82\x94\xd4\xe2\xe4\xa2\xcc\x82\x92\xcc\xfc<"
    b"\x05\xc3\xe2\x12.\xaeL\x14EF\x18\x8a\x8c\xf2R\xb8\x00\\\xd2\x16\xfa"
)

BSDIFF4_SOURCE = b"""\
# NOC configuration
name: router-01
profile: default
enabled: true
description: Legacy router
location: Rome
timeout: 30
retries: 3
"""

BSDIFF4_TARGET = b"""\
# NOC configuration
name: router-01
profile: production
enabled: true
description: Production router
location: Milan
timeout: 60
new_option: enabled
"""

BSDIFF4_PATCHES = [
    pytest.param(
        b"BSDIFF407\x00\x00\x00\x00\x00\x00\x00*\x00\x00\x00\x00\x00\x00\x00\x95\x00\x00\x00\x00\x00\x00\x00BZh91AY&SY\xdc2\x88y\x00\x00#\xf0\x00O\x92\x14\x04\x00\x02 \x001\x03@\xd0\x12\x90\x197\xaaj\xa4\xb5\xaf,\xd8\x04!\x1f\x17rE8P\x90\xdc2\x88yBZh91AY&SY\xf6)\rb\x00\x00\x01A\x00H\x00 \x00 \x000\xcc\x0c\xf5\x05\x99\xc5\xdc\x91N\x14$=\x8aCX\x80BZh91AY&SY2\x13wK\x00\x00\x11\xdf\x80\x00\x10@\x00\x00\x10\x00\x02@\x00\xbe%\xd6\x80 \x001L&\x9a\x03LA\xa5\x0c\xcal\xa3\xd4\xf2z\xa6\xba\xf5\x0f\x12\xe4M\x0c:\xc1K\xa6N\xd5\xc8T\xbak \x82#\xf1w$S\x85\t\x03!7t\xb0",
        id="1.3.1",
    ),
    pytest.param(
        b"BSDIFF409\x00\x00\x00\x00\x00\x00\x00*\x00\x00\x00\x00\x00\x00\x00\x95\x00\x00\x00\x00\x00\x00\x00BZh91AY&SY\xbf\xfd\xec\xd3\x00\x00 \xf0\x00O\x9a\x14\x04\x00\x02 \x00!$\x81\xa3i\x08\x06\x803\xe9\x1d\xcf]]$!\x8a /\xe2\xeeH\xa7\n\x12\x17\xff\xbd\x9a`BZh91AY&SY\xf6)\rb\x00\x00\x01A\x00H\x00 \x00 \x000\xcc\x0c\xf5\x05\x99\xc5\xdc\x91N\x14$=\x8aCX\x80BZh91AY&SY2\x13wK\x00\x00\x11\xdf\x80\x00\x10@\x00\x00\x10\x00\x02@\x00\xbe%\xd6\x80 \x001L&\x9a\x03LA\xa5\x0c\xcal\xa3\xd4\xf2z\xa6\xba\xf5\x0f\x12\xe4M\x0c:\xc1K\xa6N\xd5\xc8T\xbak \x82#\xf1w$S\x85\t\x03!7t\xb0",
        id="1.4.3",
    ),
]


@pytest.mark.parametrize(("ctype", "src", "result"), [("z", SRC_z0, RESULT_z0)])
def test_compress(ctype: str, src: bytes, result: bytes) -> None:
    assert GridVCS.compress(src, method=ctype) == result


@pytest.mark.parametrize(("ctype", "src", "result"), [("z", SRC_z0, RESULT_z0)])
def test_decompress(ctype: str, src: bytes, result: bytes) -> None:
    assert GridVCS.decompress(result, method=ctype) == src


@pytest.mark.parametrize("patch", BSDIFF4_PATCHES)
def test_bsdiff4_backward_compatibility(patch: bytes) -> None:
    assert bsdiff4.patch(BSDIFF4_SOURCE, patch) == BSDIFF4_TARGET
