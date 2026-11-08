//---------------------------------------------------------------------
// sa.administrativedomain application
//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.administrativedomain.Application");

Ext.define("NOC.sa.administrativedomain.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.combotree.ComboTree",
    "NOC.sa.administrativedomain.Model",
    "NOC.main.pool.LookupField",
    "NOC.main.template.LookupField",
    "NOC.main.remotesystem.LookupField",
  ],
  model: "NOC.sa.administrativedomain.Model",
  search: true,
  helpId: "reference-administrative-domain",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 150,
    },
    {
      text: t("header-parent"),
      dataIndex: "parent",
      renderer: NOC.render.Lookup("parent"),
      width: 150,
      hidden: true,
    },
    {
      text: t("label-pool"),
      dataIndex: "default_pool",
      renderer: NOC.render.Lookup("default_pool"),
      width: 150,
    },
    {
      text: t("header-objects-72a83a"),
      dataIndex: "object_count",
      width: 50,
      align: "right",
      sortable: false,
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: true,
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
      xtype: "noc.core.combotree",
      restUrl: "/sa/administrativedomain/",
      name: "parent",
      fieldLabel: t("header-parent"),
      allowBlank: true,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
    {
      name: "default_pool",
      xtype: "main.pool.LookupField",
      fieldLabel: t("label-pool"),
      allowBlank: true,
    },
    {
      xtype: "fieldset",
      layout: "hbox",
      title: t("app-title-biosegmentation"),
      defaults: {
        padding: 4,
        labelAlign: "right",
      },
      items: [
        {
          name: "bioseg_floating_name_template",
          xtype: "main.template.LookupField",
          fieldLabel: t("label-floating-name-template"),
          allowBlank: true,
        },
        {
          xtype: "noc.core.combotree",
          restUrl: "/inv/networksegment/",
          name: "bioseg_floating_parent_segment",
          fieldLabel: t("label-floating-parent-segment"),
          allowBlank: true,
        },
      ],
    },
    {
      xtype: "fieldset",
      layout: "hbox",
      title: t("app-title-integration"),
      defaults: {
        padding: 4,
        labelAlign: "right",
      },
      items: [
        {
          name: "remote_system",
          xtype: "main.remotesystem.LookupField",
          fieldLabel: t("app-title-remotesystem"),
          allowBlank: true,
        },
        {
          name: "remote_id",
          xtype: "textfield",
          fieldLabel: t("label-remote-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "bi_id",
          xtype: "displayfield",
          fieldLabel: t("label-bi-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
      ],
    },
    {
      name: "labels",
      xtype: "labelfield",
      fieldLabel: t("header-labels"),
      allowBlank: true,
      uiStyle: "extra",
      query: {
        "allow_models": ["sa.AdministrativeDomain"],
      },
    },
  ],

  filters: [
    {
      title: t("app-title-by-adm-domain"),
      name: "parent",
      ftype: "tree",
      lookup: "sa.administrativedomain",
    },
  ],
  levelFilter: {
    icon: NOC.glyph.level_down,
    color: NOC.colors.level_down,
    filter: "parent",
    tooltip: t("help-parent-filter"),
  },
});
