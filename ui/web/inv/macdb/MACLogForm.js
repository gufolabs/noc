//---------------------------------------------------------------------
// MAC Log window
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.macdb.MACLogForm");

Ext.define("NOC.inv.macdb.MACLogForm", {
  extend: "Ext.panel.Panel",
  autoScroll: true,
  layout: "fit",
  app: null,

  initComponent: function(){
    var me = this;

    me.store = Ext.create("NOC.inv.macdb.MACLogStore");

    me.closeButton = Ext.create("Ext.button.Button", {
      itemId: "close",
      text: t("btn-close"),
      glyph: NOC.glyph.arrow_left,
      scope: me,
      handler: me.onClose,
    });

    me.grid = Ext.create("Ext.grid.Panel", {
      store: me.store,
      autoScroll: true,
      layout: "fit",
      columns: [
        {
          text: t("header-timestamp"),
          dataIndex: "timestamp",
          width: 160,
        },
        {
          text: t("header-mac-2"),
          dataIndex: "mac",
          width: 110,
        },
        {
          text: t("header-l2-domain"),
          dataIndex: "l2_domain",
          flex: 1,
        },
        {
          text: t("header-vlan-6c174b"),
          dataIndex: "vlan",
          width: 40,
        },
        {
          text: t("header-managed-object-62561c"),
          dataIndex: "managed_object_name",
          flex: 2,
        },
        {
          text: t("header-interface"),
          dataIndex: "interface_name",
          flex: 1,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
    });

    Ext.apply(me, {
      items: [
        me.grid,
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.closeButton,
          ],
        },
      ],
    });
    me.callParent();
  },

  preview: function(record){
    var me = this;
    me.currentMAC = record.get("mac");
    NOC.api.requestLegacy({
      url: "/inv/macdb/" + record.get("mac") + "/",
      method: "GET",
      scope: me,
      success: function(response){
        var r = Ext.decode(response.responseText);
        //me.store.clear();
        if(!r || !r.length){
          NOC.info(t("msg-no-mac-history-found"));
        } else{
          me.grid.setTitle(` MAC ${me.currentMAC} history`);
          me.store.loadData(r);
        }
      },
      failure: function(){
        NOC.error(t("msg-failed-to-get-mac-history"));
      },
    });
  },

  onClose: function(){
    var me = this;
    me.app.showGrid();
  },
});
