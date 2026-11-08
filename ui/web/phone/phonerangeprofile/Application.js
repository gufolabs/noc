//---------------------------------------------------------------------
// phone.phonerangeprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.phone.phonerangeprofile.Application");

Ext.define("NOC.phone.phonerangeprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.phone.phonerangeprofile.Model",
    "NOC.main.style.LookupField",
    "NOC.wf.workflow.LookupField",
    "NOC.phone.phonenumberprofile.LookupField",
  ],
  model: "NOC.phone.phonerangeprofile.Model",
  search: true,
  helpId: "reference-phonerange-profile",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: "Name",
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("app-group-wf"),
          dataIndex: "workflow",
          width: 150,
          renderer: NOC.render.Lookup("workflow"),
        },
        {
          text: "Description",
          dataIndex: "description",
          flex: 1,
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
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("app-group-wf"),
          allowBlank: false,
        },
        {
          name: "default_number_profile",
          xtype: "phone.phonenumberprofile.LookupField",
          fieldLabel: t("label-default-number-profile"),
          allowBlank: false,
        },
        // {
        //     name: "cooldown",
        //     xtype: "numberfield",
        //     fieldLabel: t("Cooldown"),
        //     uiStyle: "small",
        //     minValue: 0,
        //     maxValue: 9999,
        //     allowBlank: false
        // },
        {
          name: "style",
          xtype: "main.style.LookupField",
          fieldLabel: t("app-title-style"),
          allowBlank: true,
        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-workflow"),
      name: "workflow",
      ftype: "lookup",
      lookup: "wf.workflow",
    },
  ],
});
