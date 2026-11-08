//---------------------------------------------------------------------
// ShowInterfaceStatus
//---------------------------------------------------------------------
// Copyright (C) 2007-2015 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowInterfaceStatusEx");

Ext.define("NOC.sa.managedobject.scripts.ShowInterfaceStatusEx", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("header-interface"),
      dataIndex: "interface",
      width: 120,
    },
    {
      text: t("header-oper"),
      dataIndex: "oper_status",
      renderer: NOC.render.Bool,
      width: 50,
    },
    {
      text: t("header-admin"),
      dataIndex: "admin_status",
      renderer: NOC.render.Bool,
      width: 50,
    },
    {
      text: t("header-in-kbit-s"),
      dataIndex: "in_speed",
      width: 70,
      align: "right",
    },
    {
      text: t("header-out-kbit-s"),
      dataIndex: "out_speed",
      width: 70,
      align: "right",
    },
    {
      text: t("header-full-duplex"),
      dataIndex: "full_duplex",
      width: 70,
      renderer: NOC.render.Bool,
    },
  ],
  search: true,
});
