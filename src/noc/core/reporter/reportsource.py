# ----------------------------------------------------------------------
# Report Source Base Class
# ----------------------------------------------------------------------
# Copyright (C) 2007-2024 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules

# Python Modules
# NOC modules
from noc.core.reporter.band import Band
from noc.core.reporter.types import BandFormat


class ReportSource:
    """
    Class for old-compatible report format when Data and Format union in one source
    """

    name = None

    def get_formats(self) -> dict[str, BandFormat]:
        """
        Report Format describe
        Returns:
            Result of report format describe.
        """

    def get_parameters(self):
        """
        Return Available report Parameters
        Returns:
            Result of return available report parameters.
        """

    def get_data(self, request, **kwargs) -> list[Band]:
        """
        Return Report Data
        Returns:
            Result of return report data.
        """
