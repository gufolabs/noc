# ----------------------------------------------------------------------
# DCS utilities
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.ioloop.util import run_sync

from . import base


async def resolve_async(
    name,
    hint=None,
    wait=True,
    timeout=None,  # noqa: ASYNC109  # wait-timeout for dcs.resolve
    full_result=False,
    near=False,
    critical=False,
):
    dcs = base.dcs
    if near:
        return await dcs.resolve_near(
            name,
            hint=hint,
            wait=wait,
            full_result=full_result,
            critical=critical,
        )
    return await dcs.resolve(
        name,
        hint=hint,
        wait=wait,
        timeout=timeout,
        full_result=full_result,
        critical=critical,
        track=False,
    )


def resolve(
    name, hint=None, wait=True, timeout=None, full_result=False, near=False, critical=False
):
    """
    Returns *hint* when service is active or new service
    instance,
    Returns:
        Result of returns *hint* when service is active or new service.
    """

    async def _resolve():
        return await resolve_async(
            name=name,
            hint=hint,
            wait=wait,
            timeout=timeout,
            full_result=full_result,
            near=near,
            critical=critical,
        )

    return run_sync(_resolve())
