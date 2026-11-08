//---------------------------------------------------------------------
// inv.firmwarepolicy application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.firmwarepolicy.Application");

Ext.define("NOC.inv.firmwarepolicy.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.inv.firmwarepolicy.Model",
    "NOC.inv.firmware.LookupField",
    "NOC.inv.platform.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.firmwarepolicy.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("app-title-platform"),
          dataIndex: "platform",
          renderer: NOC.render.Lookup("platform"),
          width: 200,
        },
        {
          text: t("app-title-firmware"),
          dataIndex: "firmware",
          renderer: NOC.render.Lookup("firmware"),
          width: 200,
        },
        {
          text: t("label-condition"),
          dataIndex: "condition",
          width: 50,
        },
        {
          text: t("header-status"),
          dataIndex: "status",
          width: 100,
          renderer: NOC.render.Choices({
            r: "Recommended",
            a: "Acceptable",
            n: "Not recommended",
            d: "Denied",
          }),
        },
        {
          text: t("header-management"),
          dataIndex: "management",
          flex: 1,
          renderer: function(v){
            return (v || []).map(function(x){ return x.protocol; }).join(", ");
          },
        },
      ],

      fields: [
        {
          name: "platform",
          xtype: "inv.platform.LookupField",
          fieldLabel: t("app-title-platform"),
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "firmware",
          xtype: "inv.firmware.LookupField",
          fieldLabel: t("app-title-firmware"),
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "condition",
          xtype: "combobox",
          fieldLabel: t("label-condition"),
          store: [
            ["<", "<"],
            ["<=", "<="],
            [">=", ">="],
            [">", ">"],
            ["=", "="],
          ],
          value: "=",
          allowBlank: false,
          uiStyle: "small",
        },
        {
          name: "status",
          xtype: "combobox",
          fieldLabel: t("header-status"),
          allowBlank: false,
          store: [
            ["r", "Recommended"],
            ["a", "Acceptable"],
            ["n", "Not recommended"],
            ["d", "Denied"],
          ],
          value: "a",
          uiStyle: "medium",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          uiStyle: "large",
          allowBlank: true,
        },
        {
          name: "access_preference",
          xtype: "combobox",
          fieldLabel: t("label-access-preference"),
          tooltip: t("help-preference-mode-with-worked-profile-script-br-work-if-device-pro"),
          allowBlank: true,
          uiStyle: "medium",
          store: [
            ["S", t("msg-snmp-only")],
            ["C", t("msg-cli-only")],
            ["SC", t("msg-snmp-cli")],
            ["CS", t("msg-cli-snmp")],
          ],
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "snmp_rate_limit",
          xtype: "numberfield",
          fieldLabel: t("label-snmp-rate-limit"),
          tooltip: t("help-limit-snmp-query-per-second"),
          allowBlank: true,
          hideTrigger: true,
          uiStyle: "medium",
          minValue: 0,
          maxValue: 99,
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          uiStyle: "large",
          query: {
            "allow_models": ["inv.FirmwarePolicy"],
          },
        },
        {
          name: "management",
          xtype: "gridfield",
          uiStyle: "medium",
          fieldLabel: t("header-management"),
          columns: [
            {
              text: t("header-protocol"),
              dataIndex: "protocol",
              flex: 1,
              editor: {
                xtype: "combobox",
                store: [
                  ["cli", "CLI"],
                  ["snmp", "SNMP"],
                  ["http", "HTTP"],
                ],
              },
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
