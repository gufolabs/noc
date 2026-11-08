//---------------------------------------------------------------------
// wf.wfmigration application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.wf.wfmigration.Application");

Ext.define("NOC.wf.wfmigration.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.wf.wfmigration.Model",
    "NOC.wf.state.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.wf.wfmigration.Model",
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
          text: t("label-description"),
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
          name: "migrations",
          xtype: "gridfield",
          columns: [
            {
              text: t("header-active"),
              dataIndex: "is_active",
              editor: "checkbox",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-from-state"),
              dataIndex: "from_state",
              editor: "wf.state.LookupField",
              width: 150,
              renderer: NOC.render.Lookup("from_state"),
            },
            {
              text: t("header-to-state"),
              dataIndex: "to_state",
              editor: "wf.state.LookupField",
              width: 150,
              renderer: NOC.render.Lookup("to_state"),
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              editor: "textfield",
              flex: 1,
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
