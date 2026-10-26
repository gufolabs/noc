# ----------------------------------------------------------------------
# failed log expire
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime as dt

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    def migrate(self) -> None:
        expires = dt.datetime.now() + dt.timedelta(days=7)
        c = self.mongo_db["noc.log.sa.failed_scripts"]
        c.update_many({}, {"$set": {"expires": expires}})
