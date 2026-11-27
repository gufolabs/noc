# ----------------------------------------------------------------------
# Test snmp_metrics directory
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import os

# Third-party modules
import orjson
import pytest

# NOC modules
from noc.config import config
from noc.core.profile.names import mangle_profile_name


def get_json_paths():
    """
    Get all JSON paths from snmp_metrics
    :return:
    """
    r = []
    metrics_dirs = []
    profiles_root = config.noc_base / "sa" / "profiles"
    for root, dirs, files in os.walk(str(profiles_root)):
        if "snmp_metrics" in dirs:
            metrics_dirs += [os.path.join(root, "snmp_metrics")]
    for root in metrics_dirs:
        for f in os.listdir(root):
            if f.endswith(".json"):
                r += [os.path.join(root, f)]
    return r


@pytest.mark.parametrize("path", get_json_paths())
def test_snmp_metrics_json(path) -> None:
    # Test loading
    try:
        with open(path) as f:
            data = orjson.loads(f.read())
    except ValueError as e:
        pytest.fail(f"Invalid JSON: {e}")
    assert isinstance(data, dict), "Must be dict"


@pytest.mark.parametrize(
    "profile",
    [
        "Alcatel.7302",
        "Alcatel.7324RU",
        "Alstec.24xx",
        "HP.1910",
    ],
)
def test_snmp_metrics_loaded_for_digit_led_profile(profile: str) -> None:
    """
    Ensure JSON metrics from digit-led profile directories (stored with an
    underscore prefix) are applied to the profile get_metrics script.
    """
    # NOC modules
    from noc.adapters.generic__host.get_metrics import Script as GetMetricsScript
    from noc.core.script.loader import loader

    script = loader.get_script(f"{profile}.get_metrics")
    assert script is not None
    resource = config.noc_base.joinpath("adapters", mangle_profile_name(profile), "snmp_metrics")
    json_files = list(resource.rglob("*.json"))
    assert json_files, f"No snmp_metrics JSON files found for {profile}"
    for json_file in json_files:
        metric = orjson.loads(json_file.read_text())["$metric"]
        handler = GetMetricsScript.get_snmp_handler_name(metric)
        assert handler in vars(script), f"Handler {handler} for metric '{metric}' is missing"
