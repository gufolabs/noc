# ----------------------------------------------------------------------
# zk service
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

from noc.services.zeroconf.service import ZeroConfService


if __name__ == "__main__":
    ZeroConfService().start()
