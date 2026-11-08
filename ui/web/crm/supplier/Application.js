//---------------------------------------------------------------------
// crm.supplier application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.crm.supplier.Application");

Ext.define("NOC.crm.supplier.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.StateField",
    "NOC.crm.supplier.Model",
    "NOC.crm.supplierprofile.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.project.project.LookupField",
    "NOC.core.IntegrationField",
  ],
  model: "NOC.crm.supplier.Model",
  search: true,
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 200,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 200,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          width: 150,
          render: NOC.render.LabelField,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "profile",
          xtype: "crm.supplierprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
          uiStyle: "expand",
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
        },
        {
          xtype: "noc.integrationfield",
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "allow_models": ["crm.Supplier"],
          },
        },
      ],
    });
    me.callParent();
  },
});
