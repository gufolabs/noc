//---------------------------------------------------------------------
// sa.managedobject LAG Panel
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.LAGPanel");

Ext.define("NOC.sa.managedobject.LAGPanel", {
  extend: "Ext.panel.Panel",
  title: "LAG",
  closable: false,
  layout: "fit",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      items: [
        {
          xtype: "gridpanel",
          border: false,
          autoScroll: true,
          stateful: true,
          stateId: "sa.managedobject-LAG-grid",
          store: me.store,
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
            },
            {
              text: t("header-status"),
              dataIndex: "status",
              width: 100,
            },
            {
              text: t("header-count"),
              dataIndex: "count",
            },
            {
              text: t("header-members"),
              dataIndex: "members",
            },
            {
              text: t("header-profile"),
              dataIndex: "profile",
              renderer: NOC.render.Lookup("profile"),
              editor: "inv.interfaceprofile.LookupField",
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
            },
          ],
          viewConfig: {
            getRowClass: Ext.bind(me.getRowClass, me),
          },
        },
      ],
    });
    me.callParent();
  },
  // Return Grid's row classes
  getRowClass: function(record){
    var me = this;
    if(me.rowClassField){
      var c = record.get(me.rowClassField);
      if(c){
        return c;
      } else{
        return "";
      }
    } else{
      return "";
    }
  },
});
