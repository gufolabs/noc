# ----------------------------------------------------------------------
# Flows Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    Float64Field,
    IPv4Field,
    # IPv6Field,
    ReferenceField,
    StringField,
    UInt8Field,
    UInt16Field,
    UInt32Field,
    UInt64Field,
)
from noc.core.clickhouse.model import Model

NETFLOW_V5 = 5
NETFLOW_V8 = 8
NETFLOW_V9 = 9


class Netflow(Model):
    """
    Netflow collector model

    Attributes:
        date: Date
        ts: Created
        managed_object: Object Name
        x: Longitude
        y: Latitude
        version: Flow version
        in_bytes: Incoming octets
        in_pkts: Incoming packets
        flows: Aggregated flows
        protocol: IP protocol type
        src_tos: Type of Service byte
        tcp_flags: TCP flags cumulative byte
        src_port: TCP/UDP src port number
        ipv4_src_addr: IPv4 source address
        src_mask: Number of mask bits in src adr
        input_snmp: Input interface index
        dst_port: TCP/UDP dst port number
        ipv4_dst_addr: IPv4 destination address
        dst_mask: Number of mask bits in dst adr
        output_snmp: Output interface index
        ipv4_next_hop: IPv4 adr of nexthop router
        src_as: Src BGP AS number
        dst_as: Dst BGP AS number
        bgp_ipv4_next_hop: Nexthop router's IP in BGP domain
        mul_dst_pkts: IP multicast outgoing packet counter
        mul_dst_bytes: IP multicast outgoing packet counter
        last_switched: System uptime when last pkt of flow was switched
        first_switched: System uptime when last pkt of flow was switched
        out_bytes: Outgoing octets
        out_pkts: Outgoing packets
        min_pkt_lngth: Min IP pkt length on inc packets of flow
        max_pkt_lngth: Max IP pkt length on inc packets of flow
        icmp_type: ICMP packet type
        mul_igmp_type: IGMP packet type
        sampling_interval: Rate of sampling of packets
        sampling_algorithm: Type of algorithm for sampled netflow: 01 deterministic or 02 random sampling
        flow_active_timeout: Timeout value in seconds for active entries in netflow cache
        flow_inactive_timeout: Timeout value in seconds for inactive entries in netflow cache
        engine_type: Type of flow switching engine: RP=0, VIP/Linecard=1
        engine_id: ID number of flow switching engine
        total_bytes_exp: Counter for bytes exported
        total_pkts_exp: Counter for pkts exported
        total_flows_exp: Counter for flows exported
        ipv4_src_prefix: IPv4 source address prefix (Catalyst architecture)
        ipv4_dst_prefix: IPv4 destination address prefix (Catalyst architecture)
        mpls_top_label_type: MPLS top label type
        mpls_top_label_ip_addr: Forwarding equivalent class corresponding to MPLS top label
        flow_sampler_id: ID from 'show flow-sampler'
        flow_sampler_mode: Type of algorithm used for sampling data
        flow_sampler_random_interval: Packet interval at which to sample
        min_ttl: Minimum TTL on incoming packets
        max_ttl: Maximum TTL on incoming packets
        ipv4_ident: IPv4 identification field
        dst_tos: Type of Service byte setting when exiting outgoing interface
        in_src_mac: Incoming source MAC address
        out_dst_mac: Outcoming destination MAC address
        src_vlan: VLAN id associated with ingress interface
        dst_vlan: VLAN id associated with egress interface
        ip_protocol_version: IP protocol version for IPv4 is 4 and 6 for IPv6. If none, assumed 4
        direction: Flow direction: 0 -- ingress, 1 -- egress flow
        mpls_label1: MPLS label at position 1 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label2: MPLS label at position 2 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label3: MPLS label at position 3 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label4: MPLS label at position 4 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label5: MPLS label at position 5 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label6: MPLS label at position 6 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label7: MPLS label at position 7 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label8: MPLS label at position 8 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label9: MPLS label at position 9 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        mpls_label10: MPLS label at position 10 in the stack. This comprises 20 bits of MPLS label, 3 EXP (experimental) bits and 1 S (end-of-stack) bit
        in_dst_mac: Incoming destination MAC address
        out_src_mac: Outcoming source MAC address
        if_name: Shortened interface name i.e.: 'FE1/0'
        if_desc: Full interface name i.e.: 'FastEthernet 1/0'
        sampler_name: Name of the flow sampler
        in_permanent_bytes: Running byte counter for a permanent flow
        in_permanent_pkts: Running packet counter for a permanent flow
        fragment_offset: The fragment-offset value from fragmented IP packets
        forwarding_status: Forwarding status is encoded on 1 byte with the 2 left bits giving the status and the 6 remaining bits giving the reason code.
        mpls_pal_rd: MPLS PAL Route Distinguisher
        mpls_prefix_len: Number of consecutive bits in the MPLS prefix length
        src_traffic_index: BGP Policy Accounting Source Traffic Index
        dst_traffic_index: BGP Policy Accounting Destination Traffic Index
        application_description: Application description
        application_tag: 8 bits of engine ID, followed by n bits of classification
        application_name: Name associated with a classification
        postipDiffServCodePoint: The value of a Differentiated Services Code Point (DSCP) encoded in the Differentiated Services Field, after modification
        replication_factor: Multicast replication factor
        src4_xlt_ip: IPv4 post NAT src address
        src_xlt_port: TCP/UDP port NAT src port number
        dst4_xlt_ip: IPv4 post NAT dst address
        dst_xlt_port: TCP/UDP port NAT dst port number
    """

    class Meta:
        db_table = "netflow"
        engine = MergeTree("date", ("date",), primary_keys=("date",))

    date = DateField()
    ts = DateTimeField()
    managed_object = ReferenceField(ManagedObject)
    # Coordinates
    x = Float64Field()
    y = Float64Field()
    version = UInt8Field()
    in_bytes = UInt64Field()
    in_pkts = UInt64Field()
    flows = UInt16Field()
    protocol = UInt8Field()
    src_tos = UInt8Field()
    tcp_flags = UInt8Field()
    src_port = UInt16Field()
    ipv4_src_addr = IPv4Field()
    src_mask = UInt8Field()
    input_snmp = UInt16Field()
    dst_port = UInt16Field()
    ipv4_dst_addr = IPv4Field()
    dst_mask = UInt8Field()
    output_snmp = UInt16Field()
    ipv4_next_hop = IPv4Field()
    src_as = UInt32Field()
    dst_as = UInt32Field()
    bgp_ipv4_next_hop = UInt32Field()
    mul_dst_pkts = UInt64Field()
    mul_dst_bytes = UInt64Field()
    last_switched = UInt32Field()
    first_switched = UInt32Field()
    out_bytes = UInt64Field()
    out_pkts = UInt64Field()
    min_pkt_lngth = UInt16Field()
    max_pkt_lngth = UInt16Field()
    # ipv6_src_addr = IPv6Field(description=_("IPv6 source address"))
    # ipv6_dst_addr = IPv6Field(description=_("IPv6 destination address"))
    # ipv6_src_mask = UInt8Field(description=_("Length of IPv6 source mask in contiguous bits"))
    # ipv6_dst_mask = UInt8Field(description=_("Length of IPv6 destination mask in contiguous bits"))
    # ipv6_flow_label = UInt32Field(description=_("IPv6 flow label as in RFC2460"))
    icmp_type = UInt16Field()
    mul_igmp_type = UInt8Field()
    sampling_interval = UInt32Field()
    sampling_algorithm = UInt8Field()
    flow_active_timeout = UInt16Field()
    flow_inactive_timeout = UInt16Field()
    engine_type = UInt8Field()
    engine_id = UInt8Field()
    total_bytes_exp = UInt32Field()
    total_pkts_exp = UInt32Field()
    total_flows_exp = UInt32Field()
    ipv4_src_prefix = UInt32Field()
    ipv4_dst_prefix = UInt32Field()
    mpls_top_label_type = UInt8Field()
    mpls_top_label_ip_addr = UInt32Field()
    flow_sampler_id = UInt8Field()
    flow_sampler_mode = UInt8Field()
    flow_sampler_random_interval = UInt32Field()
    min_ttl = UInt8Field()
    max_ttl = UInt8Field()
    ipv4_ident = UInt16Field()
    dst_tos = UInt8Field()
    in_src_mac = UInt64Field()
    out_dst_mac = UInt64Field()
    src_vlan = UInt16Field()
    dst_vlan = UInt16Field()
    ip_protocol_version = UInt8Field()
    direction = UInt8Field()
    # ipv6_next_hop = IPv6Field(description=_("IPv6 address of nexthop router"))
    # bgp_ipv6_next_hop = IPv6Field(description=_("IPv6 address of nexthop router in BGP domain"))
    # ipv6_option_headers = IPv6Field(
    #    description=_("Bit-encoded field identifying IPv6 option headers found in the flow")
    # )
    mpls_label1 = UInt32Field()
    mpls_label2 = UInt32Field()
    mpls_label3 = UInt32Field()
    mpls_label4 = UInt32Field()
    mpls_label5 = UInt32Field()
    mpls_label6 = UInt32Field()
    mpls_label7 = UInt32Field()
    mpls_label8 = UInt32Field()
    mpls_label9 = UInt32Field()
    mpls_label10 = UInt32Field()
    in_dst_mac = UInt64Field()
    out_src_mac = UInt64Field()
    if_name = StringField()
    if_desc = StringField()
    sampler_name = StringField()
    in_permanent_bytes = UInt32Field()
    in_permanent_pkts = UInt32Field()
    fragment_offset = UInt16Field()
    forwarding_status = UInt8Field()
    mpls_pal_rd = UInt64Field()
    mpls_prefix_len = UInt8Field()
    src_traffic_index = UInt32Field()
    dst_traffic_index = UInt32Field()
    application_description = StringField()
    application_tag = UInt16Field()
    application_name = StringField()
    postipDiffServCodePoint = UInt8Field()
    replication_factor = UInt32Field()

    src4_xlt_ip = IPv4Field()
    src_xlt_port = UInt16Field()
    dst4_xlt_ip = IPv4Field()
    dst_xlt_port = UInt16Field()
