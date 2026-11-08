//---------------------------------------------------------------------
// main.customfield application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.customfield.Application");

Ext.define("NOC.main.customfield.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.customfield.Model",
    "NOC.main.ref.modcol.LookupField",
    "NOC.main.customfieldenumgroup.LookupField",
  ],
  model: "NOC.main.customfield.Model",
  search: true,
  columns: [
    {
      text: t("header-table"),
      dataIndex: "table",
    },
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-label"),
      dataIndex: "label",
    },
    {
      text: t("header-type"),
      dataIndex: "type",
    },
    {
      text: t("header-enum-group"),
      dataIndex: "enum_group",
      renderer: NOC.render.Lookup("enum_group"),
    },
    {
      text: t("header-indexed"),
      dataIndex: "is_indexed",
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-searchable"),
      dataIndex: "is_searchable",
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-filtered"),
      dataIndex: "is_filtered",
      renderer: NOC.render.Bool,
    },
    {
      text: t("msg-hidden"),
      dataIndex: "is_hidden",
      renderer: NOC.render.Bool,
    },
  ],
  fields: [
    {
      name: "table",
      xtype: "main.ref.modcol.LookupField",
      fieldLabel: t("header-table"),
      allowBlank: false,
    },
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-name"),
      allowBlank: false,
      regex: /^[a-zA-Z0-9_]+$/,
    },
    {
      name: "is_active",
      xtype: "checkboxfield",
      boxLabel: t("header-is-active"),
      allowBlank: false,
    },
    {
      name: "label",
      xtype: "textfield",
      fieldLabel: t("header-label"),
      allowBlank: false,
    },
    {
      name: "type",
      xtype: "combobox",
      fieldLabel: t("header-type"),
      allowBlank: false,
      queryMode: "local",
      displayField: "label",
      valueField: "id",
      store: {
        fields: ["id", "label"],
        data: [
          {id: "str", label: "String"},
          {id: "int", label: "Integer"},
          {id: "bool", label: "Boolean"},
          {id: "date", label: "Date"},
          {id: "datetime", label: "Date&Time"},
        ],
      },
    },
    {
      name: "enum_group",
      xtype: "main.customfieldenumgroup.LookupField",
      fieldLabel: t("header-enum-group"),
      allowBlank: true,
      query: {
        is_active: true,
      },
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
    {
      name: "max_length",
      xtype: "numberfield",
      fieldLabel: t("label-max-length"),
      allowBlank: true,
    },
    {
      name: "regexp",
      xtype: "textfield",
      fieldLabel: t("label-regexp"),
      allowBlank: true,
    },
    {
      name: "is_indexed",
      xtype: "checkboxfield",
      boxLabel: t("label-is-indexed"),
      allowBlank: false,
    },
    {
      name: "is_searchable",
      xtype: "checkboxfield",
      boxLabel: t("label-is-searchable"),
      allowBlank: false,
    },
    {
      name: "is_filtered",
      xtype: "checkboxfield",
      boxLabel: t("label-is-filtered"),
      allowBlank: false,
    },
    {
      name: "is_hidden",
      xtype: "checkboxfield",
      boxLabel: t("label-is-hidden"),
      allowBlank: false,
    },
  ],
  filters: [
    {
      title: t("app-title-by-active"),
      name: "is_active",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-searchable"),
      name: "is_searchable",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-filtered"),
      name: "is_filtered",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-hidden"),
      name: "is_hidden",
      ftype: "boolean",
    },
  ],
});
