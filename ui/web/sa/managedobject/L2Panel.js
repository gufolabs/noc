//---------------------------------------------------------------------
// sa.managedobject L2 Panel
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.L2Panel");

Ext.define("NOC.sa.managedobject.L2Panel", {
  extend: "Ext.panel.Panel",
  title: t("app-title-switchports"),
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
          stateId: "sa.managedobject-L2-grid",
          store: me.store,
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
            },
            {
              text: t("btn-untag"),
              dataIndex: "untagged_vlan",
              width: 50,
            },
            {
              text: t("header-tagged"),
              dataIndex: "tagged_vlans",
              hidden: true,
            },
            {
              text: t("btn-tagged-ranges"),
              dataIndex: "tagged_range",
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
