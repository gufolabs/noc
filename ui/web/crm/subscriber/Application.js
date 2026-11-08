//---------------------------------------------------------------------
// crm.subscriber application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.crm.subscriber.Application");

Ext.define("NOC.crm.subscriber.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.StateField",
    "NOC.crm.subscriber.Model",
    "NOC.crm.subscriberprofile.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.project.project.LookupField",
    "NOC.core.IntegrationField",
  ],
  model: "NOC.crm.subscriber.Model",
  search: true,
  rowClassField: "row_class",
  helpId: "reference-subscriber",

  initComponent: function(){
    Ext.apply(this, {
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
          text: t("header-tags"),
          dataIndex: "tags",
          width: 150,
          render: NOC.render.Tags,
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
          xtype: "crm.subscriberprofile.LookupField",
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
          name: "address",
          xtype: "textfield",
          fieldLabel: t("app-title-address"),
          allowBlank: true,
          uiStyle: "extra",
        },
        {
          name: "tech_contact_person",
          xtype: "textfield",
          fieldLabel: t("label-contact"),
          allowBlank: true,
          uiStyle: "extra",
        },
        {
          name: "tech_contact_phone",
          xtype: "textfield",
          fieldLabel: t("app-group-phone"),
          allowBlank: true,
          uiStyle: "extra",
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
            "allow_models": ["crm.Subscriber"],
          },
        },
      ],
    });
    this.callParent();
  },
});
