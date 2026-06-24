# ----------------------------------------------------------------------
# managedobject datastream model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from __future__ import annotations
import datetime
from typing import Optional, List, Dict, Union, Any

# Third-party modules
from pydantic import BaseModel

# NOC modules
from .utils import RemoteSystemItem


class CapabilitiesItem(BaseModel):
    name: str
    value: str


class SegmentItem(BaseModel):
    id: str
    name: str
    remote_system: Optional[RemoteSystemItem]
    remote_id: Optional[str]


class ProjectItem(BaseModel):
    code: str
    name: str
    remote_system: Optional[RemoteSystemItem]
    remote_id: Optional[str]


class AdministrativeDomainItem(BaseModel):
    id: str
    name: str
    remote_system: Optional[RemoteSystemItem]
    remote_id: Optional[str]


class ObjectProfileItem(BaseModel):
    id: str
    name: str
    level: int
    enable_ping: bool
    enable_box: bool
    enable_periodic: bool
    labels: Optional[list[str]]
    tags: Optional[list[str]]
    remote_system: Optional[RemoteSystemItem]
    remote_id: Optional[str]


class ChassisMACItem(BaseModel):
    first: str
    last: str


class ChassisIDItem(BaseModel):
    hostname: Optional[str]
    macs: Optional[list[ChassisMACItem]]
    router_id: Optional[str]
    udld_id: Optional[str]


class ForwardingInstanceItem(BaseModel):
    name: str
    type: str
    subinterfaces: list[str]
    rd: Optional[str]
    vpn_id: Optional[str]
    rt_export: Optional[str]
    rt_import: Optional[str]


class ResourceGroupItem(BaseModel):
    id: str
    name: str
    technology: str
    static: bool


class InterfaceProfileItem(BaseModel):
    id: str
    name: str


class SubinterfaceItem(BaseModel):
    name: str
    description: str
    enabled_afi: list[str]
    enabled_protocols: list[str]
    snmp_ifindex: Optional[int]
    mac: Optional[str]
    ipv4_addresses: Optional[list[str]]
    ipv6_addresses: Optional[list[str]]
    iso_addresses: Optional[list[str]]
    vlan_ids: Optional[list[str]]
    vpi: Optional[str]
    vci: Optional[str]
    untagged_vlan: Optional[int]
    tagged_vlans: Optional[list[int]]


class LinkItem(BaseModel):
    object: str
    interface: str
    method: str
    is_uplink: bool


class InterfaceItem(BaseModel):
    name: str
    type: str
    description: str
    enabled_protocols: list[str]
    admin_status: bool
    hints: list[str]
    snmp_ifindex: Optional[int]
    mac: Optional[str]
    aggregated_interface: Optional[str]
    profile: Optional[InterfaceProfileItem]
    subinterfaces: list[SubinterfaceItem]
    link: list[LinkItem]


class VendorItem(BaseModel):
    id: str
    name: str


class ModelItem(BaseModel):
    id: str
    name: str
    description: Optional[str]
    vendor: VendorItem
    labels: Optional[list[str]]
    tags: Optional[list[str]]


class SlotItem(BaseModel):
    name: str
    direction: str
    protocols: list[str]
    asset: Optional[Any]
    interface: Optional[str]


class AssetItem(BaseModel):
    id: str
    model: ModelItem
    serial: str
    revision: str
    data: dict[str, dict[str, Union[str, int, bool]]]
    slots: list[SlotItem]


class ConfigItem(BaseModel):
    revision: str
    size: str
    updated: datetime.datetime


class ManagedObjectDataStreamItem(BaseModel):
    id: str
    change_id: str
    name: str
    bi_id: int
    profile: str
    is_managed: bool
    address: Optional[str]
    description: Optional[str]
    labels: Optional[list[str]]
    tags: Optional[list[str]]
    project: Optional[ProjectItem]
    remote_system: Optional[RemoteSystemItem]
    remote_id: Optional[str]
    pool: Optional[str]
    vendor: Optional[str]
    platform: Optional[str]
    version: Optional[str]
    capabilities: Optional[list[CapabilitiesItem]]
    segment: Optional[SegmentItem]
    administrative_domain: Optional[AdministrativeDomainItem]
    object_profile: ObjectProfileItem
    chassis_id: Optional[ChassisIDItem]
    forwarding_instances: Optional[list[ForwardingInstanceItem]]
    interfaces: list[InterfaceItem]
    service_groups: Optional[list[ResourceGroupItem]]
    client_groups: Optional[list[ResourceGroupItem]]
    asset: Optional[list[AssetItem]]
    config: Optional[list[ConfigItem]]
