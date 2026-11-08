//---------------------------------------------------------------------
// inv.endpoint application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.endpoint.Application");

Ext.define("NOC.inv.endpoint.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.endpoint.Model",
    "NOC.inv.channel.LookupField",
    "NOC.inv.techdomain.LookupField",
    "NOC.core.label.LabelField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.endpoint.Model",
  search: true,
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-channel"),
          dataIndex: "channel",
          width: 200,
          renderer: NOC.render.Lookup("channel"),
        },
        {
          text: t("header-resource"),
          dataIndex: "resource",
          width: 100,
          renderer: NOC.render.Lookup("resource"),
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
      fields: [
        {
          name: "channel",
          xtype: "inv.channel.LookupField",
          fieldLabel: t("header-channel"),
        },
        {
          name: "resource",
          xtype: "textfield",
          fieldLabel: t("header-resource"),
        },
        {
          name: "is_root",
          xtype: "checkbox",
          fieldLabel: t("header-is-root"),
        },
        {
          name: "pair",
          xtype: "numberfield",
          fieldLabel: t("header-pair"),
          allowBlank: true,
        },
        {
          name: "used_by",
          xtype: "gridfield",
          fieldLabel: t("header-used-by"),
          columns: [
            {
              text: t("header-channel"),
              dataIndex: "channel",
              width: 200,
              renderer: NOC.render.Lookup("channel"),
            },
            {
              text: t("header-discrimiator"),
              dataIndex: "discriminator",
              width: 200,
            },
            {
              text: t("header-direction"),
              dataIndex: "direction",
              width: 100,
            },
          ],
        },
        {
          name: "constraints",
          xtype: "gridfield",
          fieldLabel: t("label-constraints"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              width: 100,
            },
            {
              text: t("label-values"),
              dataIndex: "values",
              flex: 1,
              renderer: function(v){
                return v.join(", ");
              },
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
