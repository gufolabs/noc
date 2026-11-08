//---------------------------------------------------------------------
// vc.vlanfilter application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.vlanfilter.Application");

Ext.define("NOC.vc.vlanfilter.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.vc.vlanfilter.Model",
    "Ext.ux.form.GridField",
    "NOC.core.label.LabelField",
  ],
  model: "NOC.vc.vlanfilter.Model",
  search: true,
  helpId: "reference-vlanfilter-filter",

  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-include-expression"),
      dataIndex: "include_expression",
      flex: 1,
    },
    {
      text: t("header-exclude-expression"),
      dataIndex: "exclude_expression",
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
      name: "include_expression",
      xtype: "textfield",
      fieldLabel: t("header-include-expression"),
      allowBlank: false,
      regex: /^\s*\d+\s*(-\d+\s*)?(,\s*\d+\s*(-\d+)?)*$/,
    },
    {
      name: "exclude_expression",
      xtype: "textfield",
      fieldLabel: t("header-exclude-expression"),
      allowBlank: true,
      regex: /^\s*\d+\s*(-\d+\s*)?(,\s*\d+\s*(-\d+)?)*$/,
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
    {
      name: "match_labels",
      xtype: "gridfield",
      fieldLabel: t("label-match-labels"),
      disabled: true,
      columns: [
        {
          text: t("header-labels"),
          dataIndex: "labels",
          renderer: NOC.render.LabelField,
          editor: {
            xtype: "labelfield",
          },
          width: 200,
        },
        {
          dataIndex: "scope",
          text: t("header-scope"),
          editor: "textfield",
          width: 150,
        },
      ],
    },
  ],
  filters: [
    {
      title: t("app-title-by-vlan"),
      name: "include_expression",
      ftype: "vc",
    },
  ],
});
