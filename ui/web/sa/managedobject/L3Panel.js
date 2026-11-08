//---------------------------------------------------------------------
// sa.managedobject L3 Panel
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.L3Panel");

Ext.define("NOC.sa.managedobject.L3Panel", {
  extend: "Ext.panel.Panel",
  title: "L3",
  closable: false,
  layout: "fit",

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      items: [
        {
          xtype: "gridpanel",
          border: false,
          autoScroll: true,
          stateful: true,
          stateId: "sa.managedobject-L3-grid",
          store: me.store,
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
            },
            {
              text: t("header-vrf"),
              dataIndex: "vrf",
            },
            {
              text: t("header-ip"),
              dataIndex: "ip",
            },
            {
              text: t("choice-ipv4"),
              dataIndex: "ipv4_addresses",
              hidden: true,
            },
            {
              text: t("choice-ipv6"),
              dataIndex: "ipv6_addresses",
              hidden: true,
            },
            {
              text: t("nav-protocol"),
              dataIndex: "enabled_protocols",
            },
            {
              text: t("app-title-vlan"),
              dataIndex: "vlan",
            },
            {
              text: t("header-mac"),
              dataIndex: "mac",
              width: 120,
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
