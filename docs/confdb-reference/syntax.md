# ConfDB Syntax Reference

While ConfDB is fundamentally a vendor‑neutral configuration engine designed to parse and transform arbitrary device formats, NOC ships with a comprehensive predefined syntax profile. This built‑in schema standardizes node hierarchies, tokens, and normalization pathways across heterogeneous hardware platforms. By adhering to this unified structure, network operators can deploy consistent automation rules, policy templates, and configuration transformations without vendor‑specific adaptations—significantly simplifying multi‑vendor network management and cross‑platform interoperability.

<link rel="stylesheet" href="../../assets/confdb-syntax.css">
<div id="confdb-syntax">
<!-- SYNTAX START -->
 <div class="n c x">
  <span class="t">meta</span> <i class="d" data-doc="meta"></i>
  <div class="n"><span class="t">id</span> <span class="i">id</span> <i class="d" data-doc="meta-id-id"></i></div>
  <div class="n"><span class="t">name</span> <span class="i">name</span> <i class="d" data-doc="meta-name-name"></i></div>
  <div class="n"><span class="t">description</span> <span class="i">description</span> <i class="d" data-doc="meta-description-description"></i></div>
  <div class="n"><span class="t">profile</span> <span class="i">profile</span> <i class="d" data-doc="meta-profile-profile"></i></div>
  <div class="n"><span class="t">vendor</span> <span class="i">vendor</span> <i class="d" data-doc="meta-vendor-vendor"></i></div>
  <div class="n"><span class="t">platform</span> <span class="i">platform</span> <i class="d" data-doc="meta-platform-platform"></i></div>
  <div class="n"><span class="t">version</span> <span class="i">version</span> <i class="d" data-doc="meta-version-version"></i></div>
  <div class="n c x">
   <span class="t">object-profile</span>
   <div class="n"><span class="t">id</span> <span class="i">id</span></div>
   <div class="n"><span class="t">name</span> <span class="i">name</span></div>
   <div class="n"><span class="t">level</span> <span class="i">level</span></div>
  </div>
  <div class="n c x">
   <span class="t">segment</span>
   <div class="n"><span class="t">id</span> <span class="i">id</span></div>
   <div class="n"><span class="t">name</span> <span class="i">name</span></div>
  </div>
  <div class="n c x">
   <span class="t">management</span>
   <div class="n"><span class="t">address</span> <span class="i">address</span></div>
   <div class="n"><span class="t">protocol</span> <span class="i">protocol</span></div>
   <div class="n"><span class="t">pool</span> <span class="i">pool</span></div>
   <div class="n c x">
    <span class="t">vrf</span>
    <div class="n"><span class="t">id</span> <span class="i">id</span></div>
    <div class="n"><span class="t">name</span> <span class="i">name</span></div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">administrative-domains</span> <span class="i m">name</span>
   <div class="n"><span class="t">id</span> <span class="i">id</span></div>
  </div>
  <div class="n c x">
   <span class="t">service-groups</span> <span class="i m">name</span>
   <div class="n"><span class="t">id</span> <span class="i">id</span></div>
   <div class="n"><span class="t">technology</span> <span class="i">technology</span></div>
  </div>
  <div class="n c x">
   <span class="t">client-groups</span> <span class="i m">name</span>
   <div class="n"><span class="t">id</span> <span class="i">id</span></div>
   <div class="n"><span class="t">technology</span> <span class="i">technology</span></div>
  </div>
  <div class="n"><span class="t">labels</span> <span class="i m">label</span></div>
  <div class="n c x">
   <span class="t">chassis_id</span> <span class="i m">n</span>
   <div class="n c x">
    <span class="t">range</span> <span class="i">mac1</span>
    <div class="n"><span class="i">mac2</span></div>
   </div>
  </div>
  <div class="n"><span class="t">matchers</span> <span class="i m">matcher</span></div>
 </div>
 <div class="n c x">
  <span class="t">system</span>
  <div class="n"><span class="t">hostname</span> <span class="i">hostname</span></div>
  <div class="n"><span class="t">domain-name</span> <span class="i">domain_name</span></div>
  <div class="n"><span class="t">prompt</span> <span class="i">prompt</span></div>
  <div class="n c x">
   <span class="t">clock</span>
   <div class="n c x">
    <span class="t">timezone</span> <span class="i">tz_name</span>
    <div class="n"><span class="t">offset</span> <span class="i">tz_offset</span></div>
   </div>
   <div class="n"><span class="t">source</span> <span class="i">source</span></div>
  </div>
  <div class="n c x">
   <span class="t">user</span> <span class="i m">username</span>
   <div class="n"><span class="t">uid</span> <span class="i">uid</span></div>
   <div class="n"><span class="t">full-name</span> <span class="i">full_name</span></div>
   <div class="n"><span class="t">class</span> <span class="i m">class_name</span></div>
   <div class="n c x">
    <span class="t">authentication</span>
    <div class="n"><span class="t">encrypted-password</span> <span class="i">password</span></div>
    <div class="n"><span class="t">ssh-rsa</span> <span class="i m">rsa</span></div>
    <div class="n"><span class="t">ssh-dsa</span> <span class="i m">dsa</span></div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">aaa</span> <span class="t">service</span>
   <div class="n c x">
    <span class="i m">name</span>
    <div class="n"><span class="t">type</span> <span class="i">type</span></div>
    <div class="n c x">
     <span class="t">address</span> <span class="i m">ip</span>
     <div class="n"><span class="t">port</span> <span class="i">port</span></div>
     <div class="n"><span class="t">source</span> <span class="i">source_ip</span></div>
     <div class="n c x">
      <span class="t">virtual-router</span> <span class="i">vr</span>
      <div class="n"><span class="t">forwarding-instance</span> <span class="i">fi</span></div>
     </div>
     <div class="n"><span class="t">timeout</span> <span class="i">seconds</span></div>
     <div class="n c x">
      <span class="t">radius</span>
      <div class="n"><span class="t">secret</span> <span class="i">secret</span></div>
      <div class="n c x">
       <span class="t">radsec</span> <span class="t">certificate</span>
       <div class="n"><span class="i">certificate</span></div>
      </div>
     </div>
     <div class="n c x">
      <span class="t">tacacs+</span> <span class="t">secret</span>
      <div class="n"><span class="i">secret</span></div>
     </div>
    </div>
   </div>
   <div class="n"><span class="t">order</span> <span class="i m">name</span></div>
  </div>
  <div class="n c x">
   <span class="t">security</span> <span class="t">certificate</span>
   <div class="n"><span class="i">name</span></div>
  </div>
 </div>
 <div class="n c x">
  <span class="t">interfaces</span> <span class="i m">interface</span>
  <div class="n c x">
   <span class="t">meta</span>
   <div class="n"><span class="t">mac</span> <span class="i">mac</span></div>
   <div class="n"><span class="t">ifindex</span> <span class="i">ifindex</span></div>
   <div class="n c x">
    <span class="t">profile</span>
    <div class="n"><span class="t">id</span> <span class="i">id</span></div>
    <div class="n"><span class="t">name</span> <span class="i">name</span></div>
   </div>
   <div class="n c x">
    <span class="t">link</span> <span class="i m">link</span>
    <div class="n c x">
     <span class="t">object</span>
     <div class="n"><span class="t">id</span> <span class="i">object_id</span></div>
     <div class="n"><span class="t">name</span> <span class="i">object_name</span></div>
     <div class="n c x">
      <span class="t">profile</span>
      <div class="n"><span class="t">id</span> <span class="i">id</span></div>
      <div class="n"><span class="t">name</span> <span class="i">name</span></div>
      <div class="n"><span class="t">level</span> <span class="i">level</span></div>
     </div>
    </div>
    <div class="n"><span class="t">interface</span> <span class="i m">remote_interface</span></div>
   </div>
  </div>
  <div class="n"><span class="t">type</span> <span class="i">type</span></div>
  <div class="n"><span class="t">description</span> <span class="i">description</span></div>
  <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
  <div class="n"><span class="t">mtu</span> <span class="i">mtu</span></div>
  <div class="n"><span class="t">speed</span> <span class="i">speed</span></div>
  <div class="n"><span class="t">duplex</span> <span class="i">duplex</span></div>
  <div class="n"><span class="t">flow-control</span> <span class="i">flow_control</span></div>
  <div class="n c x">
   <span class="t">ethernet</span> <span class="t">auto-negotiation</span>
   <div class="n"><span class="i m">mode</span></div>
  </div>
  <div class="n c x">
   <span class="t">storm-control</span>
   <div class="n c x">
    <span class="t">broadcast</span> <span class="t">level</span>
    <div class="n"><span class="i">level</span></div>
   </div>
   <div class="n c x">
    <span class="t">multicast</span> <span class="t">level</span>
    <div class="n"><span class="i">level</span></div>
   </div>
   <div class="n c x">
    <span class="t">unicast</span> <span class="t">level</span>
    <div class="n"><span class="i">level</span></div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">lag</span> <span class="t">members</span>
   <div class="n"><span class="i m">member_interface_name</span></div>
  </div>
 </div>
 <div class="n c x">
  <span class="t">protocols</span>
  <div class="n c x">
   <span class="t">ntp</span>
   <div class="n c x">
    <span class="i m">name</span>
    <div class="n"><span class="t">version</span> <span class="i">version</span></div>
    <div class="n"><span class="t">address</span> <span class="i">address</span></div>
    <div class="n"><span class="t">mode</span> <span class="i">mode</span></div>
    <div class="n c x">
     <span class="t">authentication</span>
     <div class="n"><span class="t">type</span> <span class="i">auth_type</span></div>
     <div class="n"><span class="t">key</span> <span class="i">key</span></div>
    </div>
    <div class="n"><span class="t">prefer</span></div>
    <div class="n c x">
     <span class="t">broadcast</span>
     <div class="n"><span class="t">version</span> <span class="i">version</span></div>
     <div class="n"><span class="t">address</span> <span class="i">address</span></div>
     <div class="n"><span class="t">ttl</span> <span class="i">ttl</span></div>
     <div class="n c x">
      <span class="t">authentication</span>
      <div class="n"><span class="t">type</span> <span class="i">auth_type</span></div>
      <div class="n"><span class="t">key</span> <span class="i">key</span></div>
     </div>
    </div>
   </div>
   <div class="n"><span class="t">boot-server</span> <span class="i">boot_server</span></div>
  </div>
  <div class="n c x">
   <span class="t">cdp</span> <span class="t">interface</span>
   <div class="n"><span class="i m">interface</span></div>
  </div>
  <div class="n c x">
   <span class="t">lldp</span> <span class="t">interface</span>
   <div class="n c x">
    <span class="i m">interface</span> <span class="t">admin-status</span>
    <div class="n"><span class="t">rx</span></div>
    <div class="n"><span class="t">tx</span></div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">udld</span> <span class="t">interface</span>
   <div class="n"><span class="i m">interface</span></div>
  </div>
  <div class="n c x">
   <span class="t">spanning-tree</span>
   <div class="n"><span class="t">mode</span> <span class="i">mode</span></div>
   <div class="n"><span class="t">priority</span> <span class="i">priority</span></div>
   <div class="n c x">
    <span class="t">instance</span> <span class="i m">instance</span>
    <div class="n"><span class="t">bridge-priority</span> <span class="i">priority</span></div>
   </div>
   <div class="n c x">
    <span class="t">interface</span> <span class="i m">interface</span>
    <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
    <div class="n"><span class="t">cost</span> <span class="i">cost</span></div>
    <div class="n"><span class="t">bpdu-filter</span> <span class="i">enabled</span></div>
    <div class="n"><span class="t">bpdu-guard</span> <span class="i">enabled</span></div>
    <div class="n"><span class="t">mode</span> <span class="i">mode</span></div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">loop-detect</span> <span class="t">interface</span>
   <div class="n"><span class="i m">interface</span></div>
  </div>
  <div class="n c x">
   <span class="t">lacp</span> <span class="t">interface</span>
   <div class="n c x">
    <span class="i m">lag_name</span>
    <div class="n"><span class="t">system-id</span> <span class="i">system_id</span></div>
    <div class="n"><span class="t">admin-key</span> <span class="i">key</span></div>
    <div class="n"><span class="t">interval</span> <span class="i">seconds</span></div>
   </div>
   <div class="n c x">
    <span class="i m">member_name</span> <span class="t">mode</span>
    <div class="n"><span class="i">mode</span></div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">dns</span>
   <div class="n"><span class="t">name-server</span> <span class="i m">ip</span></div>
   <div class="n"><span class="t">search</span> <span class="i m">suffix</span></div>
  </div>
  <div class="n c x">
   <span class="t">syslog</span> <span class="t">syslog-server</span>
   <div class="n c x">
    <span class="i m">ip</span> <span class="t">source</span>
    <div class="n"><span class="i">source_ip</span></div>
   </div>
  </div>
 </div>
 <div class="n c x">
  <span class="t">virtual-router</span> <span class="i m">vr</span>
  <div class="n c x">
   <span class="t">forwarding-instance</span> <span class="i m">instance</span>
   <div class="n"><span class="t">type</span> <span class="i">type</span></div>
   <div class="n"><span class="t">description</span> <span class="i">description</span></div>
   <div class="n"><span class="t">route-distinguisher</span> <span class="i">rd</span></div>
   <div class="n c x">
    <span class="t">vrf-target</span>
    <div class="n"><span class="t">import</span> <span class="i m">target</span></div>
    <div class="n"><span class="t">export</span> <span class="i m">target</span></div>
   </div>
   <div class="n"><span class="t">vpn-id</span> <span class="i">vpn_id</span></div>
   <div class="n c x">
    <span class="t">vlans</span> <span class="i m">vlan_id</span>
    <div class="n"><span class="t">name</span> <span class="i">name</span></div>
    <div class="n"><span class="t">description</span> <span class="i">description</span></div>
   </div>
   <div class="n c x">
    <span class="t">interfaces</span> <span class="i m">interface</span>
    <div class="n c x">
     <span class="t">unit</span> <span class="i m">unit</span>
     <div class="n"><span class="t">description</span> <span class="i">description</span></div>
     <div class="n c x">
      <span class="t">inet</span> <span class="t">address</span>
      <div class="n"><span class="i m">address</span></div>
     </div>
     <div class="n c x">
      <span class="t">inet6</span> <span class="t">address</span>
      <div class="n"><span class="i m">address</span></div>
     </div>
     <div class="n"><span class="t">iso</span></div>
     <div class="n"><span class="t">mpls</span></div>
     <div class="n"><span class="t">vlan_ids</span> <span class="i m">vlan_id</span></div>
     <div class="n c x">
      <span class="t">bridge</span>
      <div class="n c x">
       <span class="t">switchport</span>
       <div class="n"><span class="t">untagged</span> <span class="i m">vlan_filter</span></div>
       <div class="n"><span class="t">native</span> <span class="i">vlan_id</span></div>
       <div class="n"><span class="t">tagged</span> <span class="i m">vlan_filter</span></div>
      </div>
      <div class="n c x">
       <span class="t">port-security</span> <span class="t">max-mac-count</span>
       <div class="n"><span class="i">limit</span></div>
      </div>
      <div class="n c x">
       <span class="i m">num</span>
       <div class="n"><span class="t">stack</span> <span class="i">stack</span></div>
       <div class="n"><span class="t">outer_vlans</span> <span class="i m">vlan_filter</span></div>
       <div class="n"><span class="t">inner_vlans</span> <span class="i m">vlan_filter</span></div>
       <div class="n c x">
        <span class="i m">op_num</span> <span class="i">op</span>
        <div class="n"><span class="i">vlan</span></div>
       </div>
      </div>
      <div class="n c x">
       <span class="i m">num</span>
       <div class="n"><span class="t">stack</span> <span class="i">stack</span></div>
       <div class="n"><span class="t">outer_vlans</span> <span class="i m">vlan_filter</span></div>
       <div class="n"><span class="t">inner_vlans</span> <span class="i m">vlan_filter</span></div>
       <div class="n c x">
        <span class="i m">op_num</span> <span class="i">op</span>
        <div class="n"><span class="i">vlan</span></div>
       </div>
      </div>
      <div class="n c x">
       <span class="t">dynamic_vlans</span> <span class="i m">vlan_filter</span>
       <div class="n"><span class="t">service</span> <span class="i">service</span></div>
      </div>
     </div>
    </div>
   </div>
   <div class="n c x">
    <span class="t">route</span>
    <div class="n c x">
     <span class="t">inet</span> <span class="t">static</span>
     <div class="n c x">
      <span class="i">route</span>
      <div class="n"><span class="t">next-hop</span> <span class="i m">next_hop</span></div>
      <div class="n"><span class="t">discard</span></div>
     </div>
    </div>
    <div class="n c x">
     <span class="t">inet6</span> <span class="t">static</span>
     <div class="n c x">
      <span class="i">route</span> <span class="t">next-hop</span>
      <div class="n"><span class="i m">next_hop</span></div>
     </div>
    </div>
   </div>
   <div class="n c x">
    <span class="t">protocols</span>
    <div class="n"><span class="t">telnet</span></div>
    <div class="n"><span class="t">ssh</span></div>
    <div class="n"><span class="t">http</span></div>
    <div class="n"><span class="t">https</span></div>
    <div class="n c x">
     <span class="t">snmp</span>
     <div class="n c x">
      <span class="t">community</span> <span class="i m">community</span>
      <div class="n"><span class="t">level</span> <span class="i">level</span></div>
     </div>
     <div class="n c x">
      <span class="t">trap</span> <span class="t">community</span>
      <div class="n c x">
       <span class="i m">community</span> <span class="t">host</span>
       <div class="n"><span class="i m">address</span></div>
      </div>
     </div>
    </div>
    <div class="n c x">
     <span class="t">isis</span>
     <div class="n"><span class="t">area</span> <span class="i m">area</span></div>
     <div class="n c x">
      <span class="t">interface</span> <span class="i m">interface</span>
      <div class="n"><span class="t">level</span> <span class="i m">level</span></div>
     </div>
    </div>
    <div class="n c x">
     <span class="t">ospf</span> <span class="t">interface</span>
     <div class="n"><span class="i m">interface</span></div>
    </div>
    <div class="n c x">
     <span class="t">ldp</span> <span class="t">interface</span>
     <div class="n"><span class="i m">interface</span></div>
    </div>
    <div class="n c x">
     <span class="t">rsvp</span> <span class="t">interface</span>
     <div class="n"><span class="i m">interface</span></div>
    </div>
    <div class="n c x">
     <span class="t">pim</span>
     <div class="n"><span class="t">mode</span> <span class="i">mode</span></div>
     <div class="n"><span class="t">interface</span> <span class="i m">interface</span></div>
    </div>
    <div class="n c x">
     <span class="t">igmp-snooping</span> <span class="t">vlan</span>
     <div class="n c x">
      <span class="i m">vlan</span>
      <div class="n"><span class="t">version</span> <span class="i">version</span></div>
      <div class="n"><span class="t">immediate-leave</span></div>
      <div class="n c x">
       <span class="t">interface</span> <span class="i m">interface</span>
       <div class="n"><span class="t">multicast-router</span></div>
      </div>
     </div>
    </div>
    <div class="n c x">
     <span class="t">mpls</span>
     <div class="n c x">
      <span class="t">admin-groups</span> <span class="i m">name</span>
      <div class="n"><span class="i">value</span></div>
     </div>
     <div class="n c x">
      <span class="t">srlg</span> <span class="i m">name</span>
      <div class="n"><span class="t">value</span> <span class="i">value</span></div>
      <div class="n"><span class="t">cost</span> <span class="i">cost</span></div>
     </div>
     <div class="n c x">
      <span class="t">interface</span> <span class="i m">interface</span>
      <div class="n"><span class="t">admin-group</span> <span class="i m">group</span></div>
      <div class="n"><span class="t">srlg</span> <span class="i m">group</span></div>
     </div>
     <div class="n c x">
      <span class="t">label-switched-path</span>
      <div class="n c x">
       <span class="i m">name</span> <span class="t">description</span>
       <div class="n"><span class="i">description</span></div>
      </div>
      <div class="n"><span class="t">to</span> <span class="i">address</span></div>
     </div>
    </div>
    <div class="n c x">
     <span class="t">vrrp</span> <span class="t">group</span>
     <div class="n c x">
      <span class="i m">group</span>
      <div class="n"><span class="t">description</span> <span class="i">description</span></div>
      <div class="n c x">
       <span class="t">virtual-address</span>
       <div class="n"><span class="t">inet</span> <span class="i">address</span></div>
       <div class="n"><span class="t">inet6</span> <span class="i">address</span></div>
      </div>
      <div class="n"><span class="t">interface</span> <span class="i">interface</span></div>
      <div class="n"><span class="t">priority</span> <span class="i">priority</span></div>
      <div class="n c x">
       <span class="t">authentication</span>
       <div class="n c x">
        <span class="t">plain-text</span> <span class="t">key</span>
        <div class="n"><span class="i">key</span></div>
       </div>
       <div class="n c x">
        <span class="t">md5</span> <span class="t">key</span>
        <div class="n"><span class="i">key</span></div>
       </div>
      </div>
      <div class="n c x">
       <span class="t">timers</span> <span class="t">advertise-interval</span>
       <div class="n"><span class="i">interval</span></div>
      </div>
      <div class="n c x">
       <span class="t">preempt</span>
       <div class="n"><span class="t">enabled</span> <span class="i">enabled</span></div>
       <div class="n"><span class="t">timer</span> <span class="i">timer</span></div>
      </div>
     </div>
    </div>
    <div class="n c x">
     <span class="t">bgp</span>
     <div class="n"><span class="t m">networks</span> <span class="i">prefix</span></div>
     <div class="n"><span class="t m">policies</span> <span class="i">name</span></div>
     <div class="n c x">
      <span class="t">neighbors</span> <span class="i m">neighbor</span>
      <div class="n"><span class="t">type</span> <span class="i">type</span></div>
      <div class="n"><span class="t">router-id</span> <span class="i">router_id</span></div>
      <div class="n"><span class="t">remote-as</span> <span class="i">as_num</span></div>
      <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
      <div class="n"><span class="t">local-as</span> <span class="i">as_num</span></div>
      <div class="n"><span class="t">local-address</span> <span class="i">address</span></div>
      <div class="n"><span class="t">peer-group</span> <span class="i">group</span></div>
      <div class="n"><span class="t">description</span> <span class="i">description</span></div>
      <div class="n"><span class="t">import-filter</span> <span class="i">name</span></div>
      <div class="n"><span class="t">export-filter</span> <span class="i">name</span></div>
      <div class="n"><span class="t m">redistribute</span> <span class="i">type</span></div>
     </div>
    </div>
   </div>
  </div>
 </div>
 <div class="n c x">
  <span class="t">media</span>
  <div class="n c x">
   <span class="t">sources</span>
   <div class="n c x">
    <span class="t">video</span> <span class="i m">name</span>
    <div class="n c x">
     <span class="t">settings</span>
     <div class="n"><span class="t">brightness</span> <span class="i">brightness</span></div>
     <div class="n"><span class="t">saturation</span> <span class="i">saturation</span></div>
     <div class="n"><span class="t">contrast</span> <span class="i">contrast</span></div>
     <div class="n"><span class="t">sharpness</span> <span class="i">sharpness</span></div>
     <div class="n c x">
      <span class="t">white-balance</span>
      <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
      <div class="n"><span class="t">auto</span></div>
      <div class="n"><span class="t">cr-gain</span> <span class="i">cr_gain</span></div>
      <div class="n"><span class="t">gb-gain</span> <span class="i">gb_gain</span></div>
     </div>
     <div class="n c x">
      <span class="t">black-light-compensation</span> <span class="t">admin-status</span>
      <div class="n"><span class="i">admin_status</span></div>
     </div>
     <div class="n c x">
      <span class="t">wide-dynamic-range</span>
      <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
      <div class="n"><span class="t">level</span> <span class="i">level</span></div>
     </div>
    </div>
   </div>
   <div class="n c x">
    <span class="t">audio</span> <span class="i m">name</span>
    <div class="n"><span class="t">source</span> <span class="i">source</span></div>
    <div class="n c x">
     <span class="t">settings</span>
     <div class="n"><span class="t">volume</span> <span class="i">volume</span></div>
     <div class="n c x">
      <span class="t">noise-reduction</span> <span class="t">admin-status</span>
      <div class="n"><span class="i">admin_status</span></div>
     </div>
    </div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">streams</span> <span class="i m">name</span>
   <div class="n"><span class="t">rtsp-path</span> <span class="i">path</span></div>
   <div class="n c x">
    <span class="t">settings</span>
    <div class="n c x">
     <span class="t">video</span>
     <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
     <div class="n c x">
      <span class="t">resolution</span>
      <div class="n"><span class="t">width</span> <span class="i">width</span></div>
      <div class="n"><span class="t">height</span> <span class="i">height</span></div>
     </div>
     <div class="n c x">
      <span class="t">codec</span>
      <div class="n"><span class="t">mpeg4</span></div>
      <div class="n c x">
       <span class="t">h264</span> <span class="t">profile</span>
       <div class="n"><span class="t">name</span> <span class="i">profile</span></div>
       <div class="n"><span class="t">id</span> <span class="i">id</span></div>
       <div class="n"><span class="t">constraint-set</span> <span class="i">constraints</span></div>
       <div class="n"><span class="t">gov-length</span> <span class="i">gov_length</span></div>
      </div>
     </div>
     <div class="n c x">
      <span class="t">rate-control</span>
      <div class="n"><span class="t">min-framerate</span> <span class="i">min_framerate</span></div>
      <div class="n"><span class="t">max-framerate</span> <span class="i">max_framerate</span></div>
      <div class="n c x">
       <span class="t">mode</span>
       <div class="n c x">
        <span class="t">cbr</span> <span class="t">bitrate</span>
        <div class="n"><span class="i">bitrate</span></div>
       </div>
       <div class="n c x">
        <span class="t">vbr</span> <span class="t">max-bitrate</span>
        <div class="n"><span class="i">max_bitrate</span></div>
       </div>
      </div>
     </div>
    </div>
    <div class="n c x">
     <span class="t">audio</span>
     <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
     <div class="n"><span class="t">codec</span> <span class="i">codec</span></div>
     <div class="n"><span class="t">bitrate</span> <span class="i">bitrate</span></div>
     <div class="n"><span class="t">samplerate</span> <span class="i">samplerate</span></div>
    </div>
    <div class="n c x">
     <span class="t">overlays</span> <span class="i">overlay_name</span>
     <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
     <div class="n c x">
      <span class="t">position</span>
      <div class="n"><span class="t">x</span> <span class="i">x</span></div>
      <div class="n"><span class="t">y</span> <span class="i">y</span></div>
     </div>
     <div class="n"><span class="t">text</span> <span class="i">text</span></div>
    </div>
   </div>
  </div>
 </div>
 <div class="n c x">
  <span class="t">hints</span>
  <div class="n c x">
   <span class="t">interfaces</span> <span class="t">defaults</span>
   <div class="n"><span class="t">admin-status</span> <span class="i">admin_status</span></div>
  </div>
  <div class="n c x">
   <span class="t">protocols</span>
   <div class="n c x">
    <span class="t">lldp</span>
    <div class="n"><span class="t">status</span> <span class="i">status</span></div>
    <div class="n c x">
     <span class="t">interface</span> <span class="i m">interface</span>
     <div class="n"><span class="t">off</span></div>
    </div>
   </div>
   <div class="n c x">
    <span class="t">cdp</span>
    <div class="n"><span class="t">status</span> <span class="i">status</span></div>
    <div class="n c x">
     <span class="t">interface</span> <span class="i m">interface</span>
     <div class="n"><span class="t">off</span></div>
    </div>
   </div>
   <div class="n c x">
    <span class="t">spanning-tree</span>
    <div class="n"><span class="t">status</span> <span class="i">status</span></div>
    <div class="n"><span class="t">priority</span> <span class="i">priority</span></div>
    <div class="n c x">
     <span class="t">interface</span> <span class="i m">interface</span>
     <div class="n"><span class="t">off</span></div>
    </div>
   </div>
   <div class="n c x">
    <span class="t">loop-detect</span>
    <div class="n"><span class="t">status</span> <span class="i">status</span></div>
    <div class="n c x">
     <span class="t">interface</span> <span class="i m">interface</span>
     <div class="n"><span class="t">off</span></div>
    </div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">virtual-router</span> <span class="t">interfaces</span>
   <div class="n c x">
    <span class="t">untagged</span> <span class="t">default</span>
    <div class="n"><span class="i m">interface</span> <span class="t">off</span></div>
   </div>
  </div>
  <div class="n c x">
   <span class="t">system</span> <span class="t">aaa</span>
   <div class="n c x">
    <span class="t">service-type</span> <span class="i">type</span>
    <div class="n"><span class="t">default-address</span> <span class="i">ip</span></div>
    <div class="n"><span class="t">default-interface</span> <span class="i">interface</span></div>
   </div>
  </div>
 </div>
<!-- SYNTAX END -->
</div>
<script>
(function() {
  document.getElementById('confdb-syntax').addEventListener('click', function(e) {
    // Docs
    var icon = e.target.closest('.d');
    if (icon && icon.dataset.doc) {
      e.stopPropagation();
      var doc = icon.dataset.doc;
      var parts = doc.split('-');
      var path = '../syntax-' + parts[0] + '/index.html#' + doc;
      window.open(path, '_blank');
      return;
    }
    // tree toggling
    var span = e.target.closest('span');  // nearest span, including self
    if (span && span.parentElement.classList.contains('c')) {
      span.parentElement.classList.toggle('x');
    }
  });
})();
</script>