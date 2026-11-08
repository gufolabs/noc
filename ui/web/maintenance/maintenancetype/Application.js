//---------------------------------------------------------------------
// maintenance.maintenancetype application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.maintenance.maintenancetype.Application");

Ext.define("NOC.maintenance.maintenancetype.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.maintenance.maintenancetype.Model",
  ],
  model: "NOC.maintenance.maintenancetype.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("btn-suppress"),
          dataIndex: "suppress_alarms",
          width: 75,
          renderer: NOC.render.Bool,
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
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          uiStyle: "extra",
          allowBlank: true,
        },
        {
          name: "suppress_alarms",
          xtype: "checkbox",
          boxLabel: t("label-suppress-alarms-2"),
        },
        {
          name: "card_template",
          xtype: "textfield",
          fieldLabel: t("label-card-template"),
          allowBlank: true,
        },
      ],
    });
    me.callParent();
  },
});
