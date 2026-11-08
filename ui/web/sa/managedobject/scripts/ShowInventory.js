//---------------------------------------------------------------------
// ShowInventory
//---------------------------------------------------------------------
// Copyright (C) 2007-2015 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowInventory");

Ext.define("NOC.sa.managedobject.scripts.ShowInventory", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("header-type"),
      dataIndex: "type",
      width: 90,
    },
    {
      text: t("header-number"),
      dataIndex: "number",
      width: 50,
    },
    {
      text: t("header-builtin"),
      dataIndex: "builtin",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-vendor"),
      dataIndex: "vendor",
      width: 90,
    },
    {
      text: t("header-part-no"),
      dataIndex: "part_no",
      width: 230,
    },
    {
      text: t("header-revision"),
      dataIndex: "revision",
      width: 70,
    },
    {
      text: t("header-serial-no"),
      dataIndex: "serial",
      width: 120,
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
  ],
  search: true,
});
