//---------------------------------------------------------------------
// ShowMPLSVPN
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.scripts.ShowMPLSVPN");

Ext.define("NOC.sa.managedobject.scripts.ShowMPLSVPN", {
  extend: "NOC.sa.managedobject.scripts.TablePreview",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 120,
    },
    {
      text: t("header-status"),
      dataIndex: "status",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-type"),
      dataIndex: "type",
      width: 70,
    },
    {
      text: t("header-rd"),
      dataIndex: "rd",
      width: 100,
    },
    {
      text: t("header-rt-export"),
      dataIndex: "rt_export",
      width: 200,
    },
    {
      text: t("header-rt-import"),
      dataIndex: "rt_import",
      width: 200,
    },
    {
      text: t("header-interfaces"),
      dataIndex: "interfaces",
      flex: 1,
      renderer: NOC.render.Join(", "),
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
  ],
  search: true,
});
