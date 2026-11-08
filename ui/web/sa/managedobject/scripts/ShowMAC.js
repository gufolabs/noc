//---------------------------------------------------------------------
// ShowMAC
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowMAC");

Ext.define("NOC.sa.managedobject.scripts.ShowMAC", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("header-mac"),
      dataIndex: "mac",
      width: 120,
    },
    {
      text: t("header-type"),
      dataIndex: "type",
      width: 70,
      renderer: NOC.render.Choices({
        D: "DYNAMIC",
        S: "STATIC",
        C: "CPU",
      }),
    },
    {
      text: t("app-title-vlan"),
      dataIndex: "vlan_id",
      width: 50,
    },
    {
      text: t("header-interface"),
      dataIndex: "interfaces",
      flex: 1,
      renderer: NOC.render.Join(", "),
    },
  ],
  search: true,
});
