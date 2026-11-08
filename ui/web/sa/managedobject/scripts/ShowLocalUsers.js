//---------------------------------------------------------------------
// ShowLocalUsers
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowLocalUsers");

Ext.define("NOC.sa.managedobject.scripts.ShowLocalUsers", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("header-user-name"),
      dataIndex: "username",
      width: 120,
    },
    {
      text: t("header-class"),
      dataIndex: "class",
      width: 70,
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
      renderer: NOC.render.Bool,
      flex: 1,
    },
  ],
  search: true,
});
