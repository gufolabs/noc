"""Tests for command wrappers."""

# Python modules
import subprocess

# Third-party modules
import pytest

# NOC modules
from noc.commands.ctl import Command


@pytest.mark.parametrize("args", [[], ["status"], ["status", "all"]])
def test_ctl_forwards_arguments(monkeypatch, args):
    calls = []

    def mock_call(command):
        calls.append(command)
        return 0

    monkeypatch.setattr(subprocess, "call", mock_call)
    result = Command().run_from_argv(args)

    assert result == 0
    assert calls == [["./bin/supervisorctl", *args]]
