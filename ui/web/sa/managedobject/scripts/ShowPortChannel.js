//---------------------------------------------------------------------
// ShowPortChannel
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowPortChannel");

Ext.define("NOC.sa.managedobject.scripts.ShowPortChannel", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("header-interface"),
      dataIndex: "interface",
      width: 100,
    },
    {
      text: t("header-members"),
      dataIndex: "members",
      width: 200,
    },
    {
      text: t("header-type"),
      dataIndex: "type",
      flex: 1,
    },
  ],
  search: true,
});
