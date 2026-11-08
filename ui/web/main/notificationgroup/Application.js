//---------------------------------------------------------------------
// main.notificationgroup application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.notificationgroup.Application");

Ext.define("NOC.main.notificationgroup.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.ListFormField",
    "NOC.core.tagfield.Tagfield",
    "NOC.core.label.LabelField",
    "NOC.main.notificationgroup.Model",
    "NOC.main.timepattern.LookupField",
    "NOC.main.template.LookupField",
    "NOC.main.ref.messagetype.LookupField",
    "NOC.main.ref.unotificationmethod.LookupField",
    "NOC.aaa.user.LookupField",
    "NOC.aaa.group.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "NOC.sa.administrativedomain.LookupField",
  ],
  model: "NOC.main.notificationgroup.Model",
  search: true,
  helpId: "reference-notification-group",
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/main/notificationgroup/{0}/json/",
      previewName: "Notification Group: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 250,
        },
        {
          text: t("header-blt"),
          // tooltip: "Built-in", - broken in ExtJS 5.1
          dataIndex: "is_builtin",
          width: 40,
          renderer: NOC.render.Bool,
          align: "center",
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          width: 350,
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
          xtype: "displayfield",
          name: "uuid",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "message_register_policy",
          xtype: "combobox",
          fieldLabel: t("label-message-registry-policy"),
          allowBlank: true,
          store: [
            ["d", t("msg-disabled")],
            ["a", t("msg-any")],
            ["t", t("msg-by-types")],
          ],
        },
        {
          name: "message_types",
          fieldLabel: t("label-message-types"),
          xtype: "gridfield",
          columns: [
            {
              text: t("header-message-type"),
              dataIndex: "message_type",
              width: 150,
              renderer: NOC.render.Lookup("message_type"),
              editor: "main.ref.messagetype.LookupField",
            },
            {
              text: t("header-template"),
              dataIndex: "template",
              width: 350,
              renderer: NOC.render.Lookup("template"),
              editor: "main.template.LookupField",
            },
          ],
        },
        {
          name: "static_members",
          fieldLabel: t("label-static-members"),
          xtype: "gridfield",
          columns: [
            {
              text: t("header-time-pattern"),
              dataIndex: "time_pattern",
              width: 350,
              renderer: NOC.render.Lookup("time_pattern"),
              editor: "main.timepattern.LookupField",
            },
            {
              text: t("header-method"),
              dataIndex: "notification_method",
              width: 75,
              renderer: NOC.render.Lookup("notification_method"),
              editor: "main.ref.unotificationmethod.LookupField",
            },
            {
              text: t("label-contact"),
              dataIndex: "contact",
              width: 300,
              editor: "textfield",
            },
          ],
        },
        {
          name: "subscription_settings",
          xtype: "gridfield",
          fieldLabel: t("label-subscription-settings"),
          columns: [
            {
              text: t("header-user"),
              dataIndex: "user",
              editor: "aaa.user.LookupField",
              renderer: NOC.render.Lookup("user"),
              width: 250,
            },
            {
              text: t("header-group"),
              dataIndex: "group",
              editor: "aaa.group.LookupField",
              renderer: NOC.render.Lookup("group"),
              width: 250,
            },
            {
              text: t("header-allow-subscribe"),
              dataIndex: "allow_subscribe",
              editor: "checkboxfield",
              width: 100,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-add-to-subscription"),
              dataIndex: "auto_subscription",
              editor: "checkboxfield",
              width: 100,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-notify-changed"),
              dataIndex: "notify_if_subscribed",
              editor: "checkboxfield",
              width: 100,
              renderer: NOC.render.Bool,
            },
          ],
        },
        {
          name: "conditions",
          xtype: "listform",
          fieldLabel: t("label-match-conditions"),
          rows: 5,
          items: [
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: true,
              isTree: true,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
            },
            {
              xtype: "core.tagfield",
              url: "/inv/resourcegroup/lookup/",
              fieldLabel: t("label-object-groups"),
              name: "resource_groups",
            },
            {
              name: "administrative_domain",
              xtype: "sa.administrativedomain.LookupField",
              fieldLabel: t("header-adm-domain"),
              allowBlank: true,
            },
          ],
        },
      ],
      actions: [
        {
          title: t("app-title-test-selected-groups"),
          action: "test",
          form: [
            {
              name: "subject",
              xtype: "textfield",
              fieldLabel: t("header-subject"),
              allowBlank: false,
              width: 600,
            },
            {
              name: "body",
              xtype: "textarea",
              fieldLabel: t("header-body"),
              allowBlank: false,
              width: 600,
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

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
