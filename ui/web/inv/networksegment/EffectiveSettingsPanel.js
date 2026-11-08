//---------------------------------------------------------------------
// sa.managedobject InterfacePanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.networksegment.EffectiveSettingsPanel");

Ext.define("NOC.inv.networksegment.EffectiveSettingsPanel", {
  extend: "NOC.core.ApplicationPanel",
  app: null,
  autoScroll: true,
  historyHashPrefix: "effectivesettings",

  initComponent: function(){
    var me = this;

    me.currentObject = null;

    me.refreshButton = Ext.create("Ext.button.Button", {
      text: t("help-refresh"),
      glyph: NOC.glyph.refresh,
      scope: me,
      handler: me.onRefresh,
    });

    me.store = Ext.create("Ext.data.Store", {
      fields: ["key", "value"],
      data: [],
    });

    me.grid = Ext.create("Ext.grid.Panel", {
      store: me.store,
      autoScroll: true,
      columns: [
        {
          dataIndex: "key",
          text: t("header-key"),
          width: 150,
        },
        {
          dataIndex: "value",
          text: t("header-value"),
          flex: 1,
        },
      ],
    });

    //
    Ext.apply(me, {
      items: [
        me.grid,
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.getCloseButton(),
            me.refreshButton,
          ],
        },
      ],
    });
    me.callParent();
  },
  //
  preview: function(record){
    var me = this;
    me.callParent(arguments);
    me.setTitle(record.get("name") + " interfaces");
    NOC.api.requestLegacy({
      url: "/inv/networksegment/" + record.get("id") + "/effective_settings/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText),
          r = [];
        for(var k in data){
          r.push({key: k, value: data[k]});
        }
        me.store.loadData(r);
        me.store.sort("key", "ASC");
      },
      failure: function(){
        NOC.error(t("msg-failed-to-load-data"));
      },
    });
  },
  //
  onRefresh: function(){
    var me = this;
    me.preview(me.currentRecord);
  },
});
