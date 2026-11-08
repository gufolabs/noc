//---------------------------------------------------------------------
// inv.inv CrossingPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.inv.plugins.crossing.CrossingPanel");

Ext.define("NOC.inv.inv.plugins.crossing.CrossingPanel", {
  extend: "NOC.inv.inv.plugins.VizSchemePluginAbstract",
  title: t("app-title-crossing"),
  itemId: "crossingPanel",
  scrollable: false,
  viewModel: {
    data: {
      showDetails: false,
    },
  },
  gridColumns: [
    {
      dataIndex: "input",
      text: t("header-input"),
      width: 150,
    },
    {
      dataIndex: "input_discriminator",
      text: t("header-input-discriminator"),
      flex: 1,
    },
    {
      dataIndex: "output",
      text: t("header-output"),
      width: 150,
    },
    {
      dataIndex: "output_discriminator",
      text: t("header-output-discriminator"),
      flex: 1,
    },
    {
      dataIndex: "gain_db",
      text: t("header-gain-db"),
      width: 75,
    },
  ],
  initComponent: function(){
    var grid = this.items[0];
    //
    grid.stateful = true; 
    grid.stateId = "inv.inv-crossing-grid";
    grid.itemId = "invCrossingGrid";
    grid.columns = this.gridColumns;
    this.callParent(arguments);
  },
});
