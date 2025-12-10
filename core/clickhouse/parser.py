# ----------------------------------------------------------------------
# Clickhouse DDL Parser
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from dataclasses import dataclass
from typing import Optional
import re

# NOC modules
from noc.core.text import find_balanced


@dataclass
class TableInfo(object):
    """
    Parsed DDL info.

    Attributes:
        ttl: Table-level TTL in seconds.
    """

    table_ttl: Optional[int] = None

    @classmethod
    def default(cls) -> "TableInfo":
        return TableInfo()


rx_ttl = re.compile(
    r"\s*TTL\s+(\S+)\s*\+\s*toInterval([^\(]+)\(\s*(\d+)\s*\)", re.MULTILINE | re.DOTALL
)


def parse(sql: str) -> TableInfo:
    """
    Parse ClickHouse DDL SQL.

    Args:
        sql: CREATE TABLE query,
            as is in system.tables create_table_query

    Returns:
        Parsed TableInfo.

    Raises:
        ValueError: if failed to parse.
    """
    fields_def_start = sql.find("(")
    if fields_def_start == -1:
        msg = "no starting bracket"
        raise ValueError(msg)
    fields_def_end = find_balanced(sql, start=fields_def_start)
    if fields_def_end == -1:
        msg = "no closing bracket"
        raise ValueError(msg)
    # Parse TTL
    table_ttl = None
    ttl_match = rx_ttl.search(sql, fields_def_end + 1)
    if ttl_match:
        match ttl_match.group(2):
            case "Day":
                table_ttl = int(ttl_match.group(3)) * 24 * 3600
            case _ as x:
                msg = f"invalid ttl measure: {x}"
                raise ValueError(msg)
    return TableInfo(table_ttl=table_ttl)
