//---------------------------------------------------------------------
// inv.inv.plugins.inventory InventoryPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.inv.plugins.inventory.InventoryPanel");

Ext.define("NOC.inv.inv.plugins.inventory.InventoryPanel", {
  extend: "NOC.core.ApplicationPanel",
  requires: [
    "NOC.inv.inv.plugins.inventory.InventoryModel",
  ],
  layout: "fit",
  app: null,
  scrollable: false,
  title: t("app-title-inv"),

  initComponent: function(){
    var me = this;

    me.currentObject = null;

    //
    me.defaultRoot = {
      text: t("header-text"),
      children: [],
    };

    me.store = Ext.create("Ext.data.TreeStore", {
      model: "NOC.inv.inv.plugins.inventory.InventoryModel",
      root: me.defaultRoot,
    });

    me.inventoryPanel = Ext.create("Ext.tree.Panel", {
      store: me.store,
      rootVisible: false,
      useArrows: true,
      stateful: true,
      stateId: "inv.inv-inventory-inventory",
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
      ],
    });
    //
    Ext.apply(me, {
      items: [
        me.inventoryPanel,
      ],
    });
    me.callParent();
  },
  //
  preview: function(data){
    var me = this;
    me.store.setRootNode(data || me.defaultRoot)
  },
});
