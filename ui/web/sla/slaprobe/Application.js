//---------------------------------------------------------------------
// sla.slaprobe application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sla.slaprobe.Application");

Ext.define("NOC.sla.slaprobe.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.StateField",
    "NOC.core.label.LabelField",
    "NOC.sla.slaprobe.Model",
    "NOC.sa.managedobject.LookupField",
    "NOC.pm.agent.LookupField",
    "NOC.sla.slaprofile.LookupField",
  ],
  model: "NOC.sla.slaprobe.Model",
  search: true,
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-group"),
          dataIndex: "group",
          width: 200,
        },
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 150,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-type"),
          dataIndex: "type",
          width: 75,
        },
        {
          text: t("header-target"),
          dataIndex: "target",
          width: 200,
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 150,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-managed-object-62561c"),
          dataIndex: "managed_object",
          width: 200,
          renderer: NOC.render.Lookup("managed_object"),
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          renderer: NOC.render.LabelField,
          width: 100,
        },
      ],

      fields: [
        {
          name: "managed_object",
          xtype: "sa.managedobject.LookupField",
          fieldLabel: t("header-managed-object-62561c"),
          allowBlank: true,
        },
        {
          name: "agent",
          xtype: "pm.agent.LookupField",
          fieldLabel: t("app-title-agent"),
          allowBlank: true,
        },
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: true,
        },
        {
          name: "group",
          xtype: "textfield",
          fieldLabel: t("header-group"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          allowBlank: false,
          uiStyle: "medium",
          store: [
            ["icmp-echo", "icmp-echo"],
            ["path-jitter", "path-jitter"],
            ["udp-echo", "udp-echo"],
            ["udp-jitter", "udp-jitter"],
            ["http-get", "http-get"],
            ["dns", "dns"],
            ["ftp", "ftp"],
            ["dhcp", "dhcp"],
            ["owamp", "OWAMP"],
            ["twamp", "TWAMP"],
          ],
        },
        {
          name: "tos",
          fieldLabel: t("label-tos"),
          xtype: "numberfield",
          allowBlank: true,
          defaultValue: 0,
          uiStyle: "small",
        },
        {
          name: "target",
          xtype: "textfield",
          fieldLabel: t("header-target"),
          allowBlank: false,
        },
        {
          name: "profile",
          xtype: "sla.slaprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "hw_timestamps",
          xtype: "checkbox",
          boxLabel: t("label-hw-timestamps"),
          allowBlank: true,
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          uiStyle: "extra",
          query: {
            "allow_models": ["sla.SLAProbe"],
          },
        },
        {
          name: "bi_id",
          xtype: "displayfield",
          fieldLabel: t("label-bi-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
      ],
      openDashboard: {
        icon: NOC.glyph.line_chart,
        color: NOC.colors.line_chart,
        type: "ipsla",
        tooltip: t("help-show-ipsla-dashboard"),
      },
    });
    me.callParent();
  },

  onPreview: function(record){
    window.open(
      "/api/card/view/path/"
            + record.get("managed_object")
            + "-"
            + record.get("target_id")
            + "/",
    )
  },
});
