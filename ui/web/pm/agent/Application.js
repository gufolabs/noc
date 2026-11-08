//---------------------------------------------------------------------
// pm.agent application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.pm.agent.Application");

Ext.define("NOC.pm.agent.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.StateField",
    "NOC.core.JSONPreview",
    "NOC.pm.agent.Model",
    "NOC.pm.agentprofile.LookupField",
  ],
  model: "NOC.pm.agent.Model",
  search: true,
  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/pm/agent/{0}/config/",
      previewName: "Agent Config: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 150,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 150,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-labels"),
          dataIndex: "effective_labels",
          renderer: NOC.render.LabelField,
          width: 300,
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
          name: "profile",
          xtype: "pm.agentprofile.LookupField",
          fieldLabel: t("header-profile"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "zk_check_interval",
          xtype: "numberfield",
          fieldLabel: t("label-check-interval"),
          uiStyle: "medium",
          allowBlank: true,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: true,
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "enable_agent": true,
          },
        },
        {
          name: "bi_id",
          xtype: "displayfield",
          fieldLabel: t("label-bi-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "key",
          xtype: "displayfield",
          fieldLabel: t("header-key"),
          allowBlank: true,
        },
        {
          name: "serial",
          xtype: "textfield",
          fieldLabel: t("header-serial"),
          allowBlank: true,
        },
        {
          name: "ip",
          xtype: "gridfield",
          fieldLabel: t("header-ip"),
          columns: [
            {
              name: t("header-ip"),
              dataIndex: "ip",
              editor: "textfield",
              flex: 1,
            },
          ],
        },
        {
          name: "mac",
          xtype: "gridfield",
          fieldLabel: t("header-mac"),
          columns: [
            {
              name: t("header-mac"),
              dataIndex: "mac",
              editor: "textfield",
              flex: 1,
            },
          ],
        },
      ],
      formToolbar: [
        {
          text: t("btn-config"),
          glyph: NOC.glyph.file,
          tooltip: t("help-show-config"),
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