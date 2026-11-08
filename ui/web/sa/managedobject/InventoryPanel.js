//---------------------------------------------------------------------
// sa.managedobject InventoryPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.InventoryPanel");

Ext.define("NOC.sa.managedobject.InventoryPanel", {
  extend: "NOC.core.ApplicationPanel",
  alias: "widget.sa.inventory",
  requires: [
    "NOC.sa.managedobject.InventoryModel",
  ],
  mixins: [
    "NOC.core.mixins.Export",
  ],
  app: null,
  autoScroll: true,

  initComponent: function(){
    var me = this;

    me.currentObject = null;

    me.refreshButton = Ext.create("Ext.button.Button", {
      text: t("help-refresh"),
      glyph: NOC.glyph.refresh,
      scope: me,
      handler: me.onRefresh,
    });
    //
    me.exportButton = Ext.create("Ext.button.Button", {
      text: t("btn-export"),
      glyph: NOC.glyph.arrow_down,
      scope: me,
      handler: me.onExport,
    });
    //
    me.defaultRoot = {
      text: t("header-text"),
      children: [],
    };

    me.store = Ext.create("Ext.data.TreeStore", {
      model: "NOC.sa.managedobject.InventoryModel",
      root: me.defaultRoot,
    });

    me.inventoryPanel = Ext.create("Ext.tree.Panel", {
      store: me.store,
      rootVisible: false,
      useArrows: true,
      stateful: true,
      stateId: "sa.managedobject-inventory",
      emptyText: t("label-no-data"),
      columns: [
        {
          xtype: "treecolumn",
          dataIndex: "name",
          text: t("header-name"),
          width: 200,
        },
        {
          text: t("header-model"),
          dataIndex: "model",
          width: 300,
        },
        {
          text: t("header-revision"),
          dataIndex: "revision",
          width: 100,
        },
        {
          text: t("header-serial"),
          dataIndex: "serial",
          width: 150,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
        {
          text: t("header-interface"),
          dataIndex: "interface",
          width: 150,
        },
      ],
    });
    //
    Ext.apply(me, {
      items: [
        me.inventoryPanel,
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.getCloseButton(),
            me.refreshButton,
            me.exportButton,
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
    me.setTitle(record.get("name") + " inventory");
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + record.get("id") + "/inventory/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        me.store.setRootNode(data || me.defaultRoot)
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
  //
  onExport: function(){
    var me = this;
    me.save(me.inventoryPanel, "inventory.csv");
  },
});
