//---------------------------------------------------------------------
// inv.capability application
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.capability.Application");

Ext.define("NOC.inv.capability.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.inv.capability.Model",
  ],
  model: "NOC.inv.capability.Model",
  search: true,
  treeFilter: "category",

  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/capability/{0}/json/",
      previewName: "Capability: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 50,
          sortable: false,
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
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          store: [
            ["bool", "Boolean"],
            ["str", "String"],
            ["int", "Integer"],
            ["float", "Float"],
            ["mac", "MAC Address"],
            ["ip_address", "IP Address"],
            ["snmp_oid", "SNMP OID"],
            ["http_url", "HTTP URL"],
            ["serial_num", "Serial Number"],
            ["vlan", "Vlan Number"],
            ["hostname", "HostName"],
          ],
        },
        {
          name: "allow_manual",
          xtype: "checkbox",
          boxLabel: t("label-allowing-manual-editor"),
        },
        {
          name: "multi",
          xtype: "checkbox",
          boxLabel: t("label-allow-multiple-values-list"),
        },
        {
          name: "values",
          xtype: "dictfield",
          fieldLabel: t("label-values"),
        },
        {
          name: "card_template",
          xtype: "textfield",
          fieldLabel: t("label-card-template"),
          allowBlank: true,
        },
        {
          xtype: "container",
          layout: "hbox",
          defaults: {
            padding: "0 8 0 0",
          },
          items: [
            {
              name: "agent_collector",
              xtype: "combobox",
              uiStyle: "medium",
              fieldLabel: t("label-agent-collector"),
              store: [
                ["cpu", "CPU"],
                ["memory", "Memory"],
                ["dns", "DNS"],
                ["fs", "FS"],
                ["http", "HTTP"],
                ["network", "Network"],
                ["twamp_reflector", "TWAMP Reflector"],
                ["twamp_sender", "TWAMP Sender"],
                ["block_io", "Block IO"],
              ],
            },
            {
              name: "agent_param",
              xtype: "textfield",
              uiStyle: "medium",
              fieldLabel: t("label-agent-param"),
              allowBlank: true,
            },
          ],
        },
      ],

      formToolbar: [
        {
          text: t("btn-json"),
          glyph: NOC.glyph.file,
          tooltip: t("help-show-json"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onJSON,
        },
      ],
    });
    me.callParent();
  },
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
