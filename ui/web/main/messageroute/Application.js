//---------------------------------------------------------------------
// main.messageroute application
//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.messageroute.Application");

Ext.define("NOC.main.messageroute.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.ListFormField",
    "NOC.main.messageroute.Model",
    "NOC.main.ref.messagetype.LookupField",
    "NOC.main.ref.messageheader.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.sa.administrativedomain.LookupField",
    "NOC.core.tagfield.Tagfield",
    "NOC.core.label.LabelField",
    "NOC.main.template.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.main.handler.LookupField",
  ],
  model: "NOC.main.messageroute.Model",
  search: true,
  formMinWidth: 800,
  formMaxWidth: 1000,

  initComponent: function(){
    var me = this,
      fieldSetDefaults = {
        xtype: "container",
        padding: 5,
        layout: "form",
        columnWidth: 0.5,
      };
    ;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          renderer: NOC.render.Bool,
          width: 50,
        },
        {
          text: t("header-type"),
          dataIndex: "type",
          width: 150,
        },
        {
          text: t("header-order"),
          dataIndex: "order",
          width: 50,
        },
        {
          text: t("app-title-action"),
          dataIndex: "action",
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
          xtype: "fieldset",
          layout: "column",
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          border: false,
          items: [
            {
              name: "name",
              xtype: "textfield",
              fieldLabel: t("header-name"),
              uiStyle: "medium",
              allowBlank: false,
            },
            {
              name: "is_active",
              xtype: "checkbox",
              boxLabel: t("header-active"),
            },
            {
              name: "description",
              xtype: "textarea",
              fieldLabel: t("label-description"),
              uiStyle: "extra",
              allowBlank: true,
            },
            {
              name: "order",
              xtype: "numberfield",
              fieldLabel: t("header-order"),
              uiStyle: "small",
              allowBlank: false,
            },
            {
              name: "type",
              xtype: "main.ref.messagetype.LookupField",
              fieldLabel: t("header-type"),
              labelAlign: "left",
              allowBlank: false,
            },
            {
              name: "telemetry_sample",
              xtype: "numberfield",
              fieldLabel: t("label-telemetry-sample"),
              uiStyle: "small",
              allowBlank: true,
            },
            {
              name: "register_notification_method",
              xtype: "checkbox",
              boxLabel: t("label-register-as-notification"),
            }],
        },
        {
          xtype: "fieldset",
          layout: "column",
          title: t("app-title-transmute"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          collapsible: true,
          items: [
            {
              name: "transmute_template",
              xtype: "main.template.LookupField",
              fieldLabel: t("header-template"),
            },
            {
              name: "transmute_handler",
              xtype: "main.handler.LookupField",
              fieldLabel: t("label-hanlder"),
              query: {
                allow_mx_transmutation: true,
              },
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "column",
          title: t("app-title-action"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          collapsible: true,
          items: [
            {
              name: "action",
              xtype: "combobox",
              store: [
                ["drop", "Drop"],
                ["dump", "Dump"],
                ["stream", "Stream"],
                ["notification", "Notificaiton"],
                ["job", "Job"],
              ],
              fieldLabel: t("app-title-action"),
              uiStyle: "medium",
              allowBlank: false,
            },
            {
              name: "stream",
              xtype: "textfield",
              fieldLabel: t("label-stream"),
              uiStyle: "medium",
            },
            {
              name: "notification_group",
              xtype: "main.notificationgroup.LookupField",
              fieldLabel: t("app-title-notificationgroup"),
            },
            {
              name: "render_template",
              xtype: "main.template.LookupField",
              fieldLabel: t("label-render-template"),
            },
          ],
        },
        {
          name: "headers",
          xtype: "gridfield",
          fieldLabel: t("label-set-headers"),
          columns: [
            {
              text: t("label-header"),
              dataIndex: "header",
              width: 200,
              editor: "main.ref.messageheader.LookupField",
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              flex: 1,
              editor: {
                xtype: "textfield",
                allowBlank: false, // Это запретит изменение поля "value" на пустое значение
              },
            },
          ],
        },
        {
          name: "match",
          xtype: "listform",
          fieldLabel: t("label-match-rules"),
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
              name: "exclude_labels",
              xtype: "labelfield",
              fieldLabel: t("label-exclude-match-labels"),
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
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "headers_match",
              xtype: "gridfield",
              fieldLabel: t("label-headers-match"),
              columns: [
                {
                  text: t("label-header"),
                  dataIndex: "header",
                  editor: "main.ref.messageheader.LookupField",
                  width: 250,
                },
                {
                  text: t("btn-operation"),
                  dataIndex: "op",
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["==", "=="],
                      ["!=", "!="],
                      ["regex", "regex"],
                    ],
                  },
                  width: 100,
                },
                {
                  text: t("header-value"),
                  dataIndex: "value",
                  editor: "textfield",
                  flex: 1,
                },
              ],
            },
          ],
        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("header-type"),
      name: "type",
      ftype: "lookup",
      lookup: "main.ref.messagetype",
    },
  ],
});
