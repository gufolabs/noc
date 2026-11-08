//---------------------------------------------------------------------
// sa.commandsnippet application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.commandsnippet.Application");

Ext.define("NOC.sa.commandsnippet.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.sa.commandsnippet.Model",
    "NOC.core.combotree.ComboTree",
  ],
  model: "NOC.sa.commandsnippet.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      dataIndex: "is_enabled",
      text: t("header-enabled"),
      renderer: NOC.render.Bool,
    },
    {
      text: t("label-resource-group"),
      dataIndex: "resource_group",
      renderer: NOC.render.Lookup("resource_group"),
      width: 200,
    },
    {
      text: t("label-description"),
      dataIndex: "description",
    },
    {
      dataIndex: "require_confirmation",
      text: t("header-require-confirmation"),
      renderer: NOC.render.Bool,
    },
    {
      dataIndex: "ignore_cli_errors",
      text: t("header-ignore-cli-errors"),
      renderer: NOC.render.Bool, 
    },
    {
      text: t("header-permission"),
      dataIndex: "permission_name",
    },
    {   
      dataIndex: "display_in_menu",   
      text: t("header-show-in-menu"),
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-tags"),
      dataIndex: "tags",
      renderer: NOC.render.Tags,
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
      xtype: "textareafield",
      fieldLabel: t("label-description"),
      allowBlank: false,
      anchor: "100%",
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
    {
      name: "snippet",
      xtype: "textareafield",
      fieldLabel: t("label-snippet"),
      allowBlank: false,
      anchor: "100%",
      height: 200,
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
    {
      name: "change_configuration",
      xtype: "checkboxfield",
      boxLabel: t("label-change-configuration"),
    },
    {
      name: "resource_group",
      xtype: "noc.core.combotree",
      restUrl: "/inv/resourcegroup/",
      fieldLabel: t("label-resource-group"),
      listWidth: 1,
      listAlign: "left",
      labelAlign: "left",
      width: 500,
    },
    {
      name: "is_enabled",
      xtype: "checkboxfield",
      boxLabel: t("label-is-enabled"),
    },
    {
      name: "timeout",
      xtype: "numberfield",
      fieldLabel: t("label-timeout-sec"),
      allowBlank: false,
    },
    {
      name: "require_confirmation",
      xtype: "checkboxfield",
      boxLabel: t("header-require-confirmation"),
    },
    {
      name: "ignore_cli_errors",
      xtype: "checkboxfield",
      boxLabel: t("header-ignore-cli-errors"),
    },
    {
      name: "permission_name",
      xtype: "textfield",
      fieldLabel: t("label-permission-name-2"),
    },
    {
      name: "display_in_menu",
      xtype: "checkboxfield",
      boxLabel: t("header-show-in-menu"),
    },
    {
      name: "labels",
      xtype: "labelfield",
      fieldLabel: t("header-labels"),
      allowBlank: true,
      query: {
        "enable_commandsnippet": true,
      },
    },
  ],
  filters: [
    {
      title: t("app-title-by-is-enabled"),
      name: "is_enabled",
      ftype: "boolean",
      // },
      // {
      //     title: t("By Require Confirmation"),
      //     name: "require_confirmation",
      //     ftype: "boolean"
      // },
      // {
      //     title: t("By Ignore CLI Errors"),
      //     name: "ignore_cli_errors",
      //     ftype: "boolean"
    }, 
  ],
});
