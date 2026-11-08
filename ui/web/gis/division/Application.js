//---------------------------------------------------------------------
// gis.division application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.gis.division.Application");

Ext.define("NOC.gis.division.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.gis.division.Model",
    "NOC.gis.division.LookupField",
  ],
  model: "NOC.gis.division.Model",
  search: true,
  treeFilter: "parent",
  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-type"),
          dataIndex: "type",
          width: 100,
          renderer: NOC.render.Choices({
            A: "Administrative",
          }),
        },
        {
          text: t("header-short"),
          dataIndex: "short_name",
          width: 50,
        },
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 300,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          renderer: NOC.render.Bool,
          width: 25,
        },
        {
          text: t("header-parent"),
          dataIndex: "full_parent",
          flex: 1,
          sort: false,
        },
        {
          text: t("app-title-remotesystem"),
          dataIndex: "remote_system",
          flex: 1,
          sort: false,
        },
        {
          text: t("header-remote-id"),
          dataIndex: "remote_id",
          flex: 1,
          sort: false,
        },
      ],
      fields: [
        {
          name: "full_path",
          xtype: "displayfield",
          fieldLabel: t("label-full-path"),
        },
        {
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          allowBlank: false,
          store: [
            ["A", "Administrative"],
          ],
          defaultValue: "A",
        },
        {
          name: "parent",
          xtype: "gis.division.LookupField",
          fieldLabel: t("header-parent"),
        },
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
        },
        {
          name: "short_name",
          xtype: "textfield",
          fieldLabel: t("label-short-name"),
          allowBlank: true,
        },
        {
          name: "is_active",
          xtype: "checkboxfield",
          boxLabel: t("header-active"),
        },
        {
          xtype: "dictfield",
          name: "data",
          fieldLabel: t("app-title-data"),
          allowBlank: true,
        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-parent"),
      name: "parent",
      ftype: "lookup",
      lookup: "gis.division",
    },
  ],
});
