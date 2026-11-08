//---------------------------------------------------------------------
// inv.coverage application
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.coverage.Application");

Ext.define("NOC.inv.coverage.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.coverage.Model",
    "NOC.inv.coverage.BuildingModel",
    "NOC.inv.coverage.ObjectModel",
  ],
  model: "NOC.inv.coverage.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-name"),
      allowBlank: false,
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
    },
  ],
  inlines: [
    {
      title: t("app-title-covered-buildings"),
      model: "NOC.inv.coverage.BuildingModel",
      columns: [
        {
          text: t("header-pref-2"),
          tooltip: t("label-preference"),
          dataIndex: "preference",
          width: 50,
          textAlign: "right",
        },
        {
          text: t("app-title-building"),
          dataIndex: "building",
          renderer: NOC.render.Lookup("building"),
          flex: 1,
        },
        {
          text: t("header-entrance"),
          dataIndex: "entrance",
          width: 100,
        },
      ],
    },
    {
      title: t("app-title-covered-objects"),
      model: "NOC.inv.coverage.ObjectModel",
      columns: [
        {
          text: t("header-pref-2"),
          tooltip: t("label-preference"),
          dataIndex: "preference",
          width: 50,
          textAlign: "right",
        },
        {
          text: t("header-object"),
          dataIndex: "object",
          renderer: NOC.render.Lookup("object"),
          flex: 1,
        },
      ],
    },
  ],
});
