# ---------------------------------------------------------------------
# Stale Discovery Job Report
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import datetime as dt

# NOC modules
from noc.core.dateutils import humanize_distance
from noc.core.i18n import t
from noc.core.scheduler.scheduler import Scheduler
from noc.main.models.pool import Pool
from noc.sa.models.managedobject import ManagedObject
from noc.services.web.base.simplereport import SimpleReport


class ReportStaleDiscoveryJob(SimpleReport):
    title = t("app-title-reportstalediscovery")

    # Minutes
    STALE_INTERVAL = 24 * 60 * 2

    def get_data(self, **kwargs):
        old = dt.datetime.now() - dt.timedelta(minutes=self.STALE_INTERVAL)
        data = []
        for pool in Pool._get_collection().find({}, {"_id": 0, "name": 1}):
            scheduler = Scheduler("discovery", pool=pool["name"])
            for r in scheduler.get_collection().find(
                {"runs": {"$gt": 1}, "jcls": {"$regex": "_discovery$"}, "st": {"$lte": old}}
            ):
                mo = ManagedObject.get_by_id(r["key"])
                if not mo or not mo.is_managed:
                    continue
                msg = ""
                if r["tb"]:
                    tb = r["tb"]
                    if "text" in tb and "code" in tb:
                        if tb["text"].endswith("END OF TRACEBACK"):
                            tb["text"] = "Job crashed"
                        msg = f"({tb['text']}) {tb['code']}"
                data.append(
                    [
                        mo.administrative_domain.name,
                        mo.name,
                        mo.profile.name,
                        mo.platform.name,
                        mo.version.name,
                        mo.address,
                        mo.segment.name,
                        r["jcls"],
                        humanize_distance(r["st"]),
                        msg,
                    ]
                )
        return self.from_dataset(
            title=self.title,
            columns=[
                t("header-admin-domain-610498"),
                t("header-object"),
                t("header-profile"),
                t("header-platform"),
                t("header-version"),
                t("header-address"),
                t("header-segment-44986c"),
                t("header-job"),
                t("header-last-success"),
                t("header-reason"),
            ],
            data=sorted(data),
            enumerate=True,
        )
