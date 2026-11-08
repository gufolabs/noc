//---------------------------------------------------------------------
// pm.agentprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.pm.agentprofile.Application");

Ext.define("NOC.pm.agentprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.pm.agentprofile.Model",
    "NOC.wf.workflow.LookupField",
  ],
  model: "NOC.pm.agentprofile.Model",
  search: true,
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
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
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("btn-config"),
          defaults: {
            padding: 4,
          },
          items: [
            {
              name: "zk_check_interval",
              xtype: "numberfield",
              fieldLabel: t("label-check-interval"),
              allowBlank: false,
            },
            {
              name: "update_addresses",
              xtype: "checkbox",
              boxLabel: t("label-update-addresses"),
            },
          ],
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("app-group-wf"),
          allowBlank: true,
        },
      ],
    });
    me.callParent();
  },
});