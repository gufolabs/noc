//---------------------------------------------------------------------
// ShowDomStatus
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowDomStatus");

Ext.define("NOC.sa.managedobject.scripts.ShowDomStatus", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("header-interface"),
      dataIndex: "interface",
      width: 120,
    },
    {
      text: t("header-temp-c"),
      dataIndex: "temp_c",
      xtype: "numbercolumn",
      format: "0.0000",
      width: 100,
      align: "right",
    },
    {
      text: t("header-voltage-v"),
      dataIndex: "voltage_v",
      xtype: "numbercolumn",
      format: "0.0000",
      width: 100,
      align: "right",
    },
    {
      text: t("header-current-ma"),
      dataIndex: "current_ma",
      xtype: "numbercolumn",
      format: "0.0000",
      width: 100,
      align: "right",
    },
    {
      text: t("header-optical-tx-dbm"),
      dataIndex: "optical_tx_dbm",
      xtype: "numbercolumn",
      format: "0.0000",
      width: 110,
      align: "right",
    },
    {
      text: t("header-optical-rx-dbm"),
      dataIndex: "optical_rx_dbm",
      xtype: "numbercolumn",
      format: "0.0000",
      width: 110,
      align: "right",
    },
    {
      text: "",
      flex: 1,
    },
  ],
  search: true,
});
