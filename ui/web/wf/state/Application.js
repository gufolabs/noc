//---------------------------------------------------------------------
// wf.state application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.wf.state.Application");

Ext.define("NOC.wf.state.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.wf.state.Model",
    "NOC.core.JSONPreview",
    "NOC.core.label.LabelField",
    "NOC.wf.workflow.LookupField",
    "NOC.main.remotesystem.LookupField",
    "Ext.ux.form.StringsField",
  ],
  model: "NOC.wf.state.Model",
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/wf/state/{0}/json/",
      previewName: "Workflow State: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("app-group-wf"),
          dataIndex: "workflow",
          renderer: NOC.render.Lookup("workflow"),
          width: 150,
        },
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-default"),
          dataIndex: "is_default",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-productive"),
          dataIndex: "is_productive",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-wiping"),
          dataIndex: "is_wiping",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-hide-records"),
          dataIndex: "hide_with_state",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-update-last-seen"),
          dataIndex: "update_last_seen",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-update-expired"),
          dataIndex: "update_expired",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-ttl"),
          dataIndex: "ttl",
          width: 50,
          align: "right",
          renderer: NOC.render.Duration,
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          width: 200,
          renderer: NOC.render.LabelField,
        },
      ],

      fields: [
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("app-group-wf"),
          allowBlank: false,
        },
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
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
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "allow_models": ["wf.WorkflowState"],
          },
        },
        {
          name: "is_default",
          xtype: "checkbox",
          boxLabel: t("header-default"),
        },
        {
          name: "is_productive",
          xtype: "checkbox",
          boxLabel: t("header-productive"),
        },
        {
          name: "is_wiping",
          xtype: "checkbox",
          boxLabel: t("header-wiping"),
        },
        {
          name: "hide_with_state",
          xtype: "checkbox",
          boxLabel: t("header-hide-records"),
        },
        {
          name: "update_last_seen",
          xtype: "checkbox",
          boxLabel: t("header-update-last-seen"),
        },
        {
          name: "ttl",
          xtype: "numberfield",
          fieldLabel: t("header-ttl"),
          allowBlank: true,
          minValue: 0,
          emptyText: t("label-not-limited"),
          uiStyle: "medium",
        },
        {
          name: "update_expired",
          xtype: "checkbox",
          boxLabel: t("label-update-expiration"),
        },
        {
          name: "disable_all_interaction",
          xtype: "checkbox",
          boxLabel: t("label-disable-all-interaction"),
        },
        {
          name: "interaction_settings",
          xtype: "gridfield",
          fieldLabel: t("label-interaction-settings"),
          columns: [
            {
              text: t("header-interaction"),
              dataIndex: "interaction",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["SA", "ServiceActivation"],
                  ["ALARM", "Alarm"],
                  ["EVENT", "Event"],
                  ["TT", "Escalation"],
                  ["BOX", "Box Discovery"],
                  ["PERIODIC", "Periodic Discovery"],
                ],
              },
              renderer: NOC.render.Choices({
                "SA": t("msg-serviceactivation"),
                "ALARM": t("app-title-alarm"),
                "EVENT": t("msg-event"),
                "TT": t("header-escalation"),
                "BOX": t("app-title-box-discovery"),
                "PERIODIC": t("app-title-periodic-discovery"),
              }),
            },
            {
              text: t("label-enable"),
              dataIndex: "enable",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "remote_id",
              xtype: "textfield",
              fieldLabel: t("label-remote-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "bi_id",
              xtype: "displayfield",
              fieldLabel: t("label-bi-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "on_enter_handlers",
          xtype: "stringsfield",
          fieldLabel: t("label-on-enter-handlers"),
          allowBlank: true,
        },
        {
          name: "on_leave_handlers",
          xtype: "stringsfield",
          fieldLabel: t("label-on-leave-handlers"),
          allowBlank: true,
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

  filters: [
    {
      title: t("app-title-by-workflow"),
      name: "workflow",
      ftype: "lookup",
      lookup: "wf.workflow",
    },
    {
      title: t("app-title-by-default"),
      name: "is_default",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-productive"),
      name: "is_productive",
      ftype: "boolean",
    },
  ],
});
