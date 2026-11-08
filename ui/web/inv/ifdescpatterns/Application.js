//---------------------------------------------------------------------
// inv.ifdescpatterns application
//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.ifdescpatterns.Application");

Ext.define("NOC.inv.ifdescpatterns.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.ifdescpatterns.Model",
  ],
  model: "NOC.inv.ifdescpatterns.Model",
  search: true,

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
          name: "resolve_remote_port_by_object",
          xtype: "checkbox",
          fieldLabel: t("label-use-object-as-port-token"),
          allowBlank: true,
          renderer: NOC.render.Bool,
          tooltip: t("help-if-checked-discovery-try-find-port-by-object-id-hostname-address"),
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "patterns",
          xtype: "gridfield",
          fieldLabel: t("label-patterns"),
          columns: [
            {
              text: t("header-active"),
              dataIndex: "is_active",
              editor: "checkbox",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-pattern"),
              dataIndex: "pattern",
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