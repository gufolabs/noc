//---------------------------------------------------------------------
// ShowObjectStatus
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowObjectStatus");

Ext.define("NOC.sa.managedobject.scripts.ShowObjectStatus", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("label-object-name"),
      dataIndex: "name",
      width: 120,
    },
    {
      text: t("header-status"),
      dataIndex: "status",
      renderer: NOC.render.Bool,
      flex: 1,
    },
  ],
  search: true,
});
