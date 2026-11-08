//---------------------------------------------------------------------
// gis.area application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.gis.area.Application");

Ext.define("NOC.gis.area.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.gis.area.Model",
    "Ext.ux.form.GeoField",
  ],
  model: "NOC.gis.area.Model",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },

    {
      text: t("header-active"),
      dataIndex: "is_active",
      renderer: NOC.render.Bool,
      width: 50,
    },

    {
      text: t("header-sw"),
      dataIndex: "SW",
    },

    {
      text: t("header-ne"),
      dataIndex: "NE",
    },

    {
      text: t("header-min-zoom"),
      dataIndex: "min_zoom",
    },

    {
      text: t("header-max-zoom"),
      dataIndex: "max_zoom",
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
      name: "is_active",
      xtype: "checkboxfield",
      boxLabel: t("header-active"),
    },
    {
      name: "SW",
      xtype: "geofield",
      fieldLabel: t("header-sw"),
      allowBlank: false,
    },
    {
      name: "NE",
      xtype: "geofield",
      fieldLabel: t("header-ne"),
      allowBlank: false,
    },
    {
      name: "min_zoom",
      xtype: "numberfield",
      fieldLabel: t("header-min-zoom"),
      allowBlank: false,
      defaultValue: 0,
      minValue: 0,
      maxValue: 18,
    },
    {
      name: "max_zoom",
      xtype: "numberfield",
      fieldLabel: t("header-max-zoom"),
      allowBlank: false,
      defaultValue: 18,
      minValue: 0,
      maxValue: 18,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
  ],
});
