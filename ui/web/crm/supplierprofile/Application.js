//---------------------------------------------------------------------
// crm.supplierprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.crm.supplierprofile.Application");

Ext.define("NOC.crm.supplierprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.crm.supplierprofile.Model",
    "NOC.main.style.LookupField",
    "NOC.wf.workflow.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.core.IntegrationField",
  ],
  model: "NOC.crm.supplierprofile.Model",
  search: true,
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          flex: 1,
        },
        {
          text: t("app-group-wf"),
          dataIndex: "workflow",
          width: 150,
          renderer: NOC.render.Lookup("workflow"),
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
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
          uiStyle: "expand",
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("app-group-wf"),
          allowBlank: false,
        },
        {
          name: "style",
          xtype: "main.style.LookupField",
          fieldLabel: t("app-title-style"),
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
            "allow_models": ["crm.SupplierProfile"],
          },
        },
      ],
    });
    me.callParent();
  },
});
