//---------------------------------------------------------------------
// crm.subscriberprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.crm.subscriberprofile.Application");

Ext.define("NOC.crm.subscriberprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.crm.subscriberprofile.Model",
    "NOC.main.style.LookupField",
    "NOC.main.glyph.LookupField",
    "NOC.wf.workflow.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.core.IntegrationField",
  ],
  model: "NOC.crm.subscriberprofile.Model",
  search: true,
  helpId: "reference-subscriber-profile",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("app-title-glyph"),
          dataIndex: "glyph",
          width: 25,
          renderer: function(v){
            if(v !== undefined && v !== "")
            {
              return "<i class='" + v + "'></i>";
            } else{
              return "";
            }
          },
        },
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
          name: "glyph",
          xtype: "main.glyph.LookupField",
          fieldLabel: t("label-icon"),
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "display_order",
          xtype: "numberfield",
          fieldLabel: t("label-display-order"),
          uiStyle: "small",
          minValue: 0,
          allowBlank: false,
        },
        {
          name: "show_in_summary",
          xtype: "checkbox",
          boxLabel: t("label-show-in-summary"),
          allowBlank: true,
        },
        {
          name: "weight",
          xtype: "numberfield",
          fieldLabel: t("label-alarm-weight"),
          allowBlank: true,
          uiStyle: "small",
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
            "allow_models": ["crm.SubscriberProfile", "crl.Subscriber"],
          },
        },
      ],
    });
    me.callParent();
  },
});
