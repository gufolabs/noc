//---------------------------------------------------------------------
// wf.transition application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.wf.transition.Application");

Ext.define("NOC.wf.transition.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.wf.transition.Model",
    "NOC.core.JSONPreview",
    "NOC.wf.workflow.LookupField",
    "NOC.wf.state.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "Ext.ux.form.StringsField",
  ],
  model: "NOC.wf.transition.Model",
  initComponent: function(){
    var me = this;
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/wf/transition/{0}/json/",
      previewName: "Workflow Transition: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("app-group-wf"),
          dataIndex: "workflow",
          width: 200,
          renderer: NOC.render.Lookup("workflow"),
        },
        {
          text: t("header-from-state"),
          dataIndex: "from_state",
          width: 200,
          renderer: NOC.render.Lookup("from_state"),
        },
        {
          text: t("header-to-state"),
          dataIndex: "to_state",
          width: 200,
          renderer: NOC.render.Lookup("to_state"),
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("app-title-manual"),
          dataIndex: "enable_manual",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("msg-event"),
          dataIndex: "event",
          width: 100,
        },
        {
          text: t("header-label"),
          dataIndex: "label",
          flex: 1,
        },
      ],

      fields: [
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("app-group-wf"),
          allowBlank: true,
        },
        {
          name: "from_state",
          xtype: "wf.state.LookupField",
          fieldLabel: t("header-from-state"),
          allowBlank: false,
        },
        {
          name: "to_state",
          xtype: "wf.state.LookupField",
          fieldLabel: t("header-to-state"),
          allowBlank: false,
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "label",
          xtype: "textfield",
          fieldLabel: t("header-label"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "event",
          xtype: "textfield",
          fieldLabel: t("msg-event"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          name: "enable_manual",
          xtype: "checkbox",
          boxLabel: t("label-enable-manual"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
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
          name: "handlers",
          xtype: "stringsfield",
          fieldLabel: t("nav-handler"),
          allowBlank: true,
        },
        {
          name: "required_rules",
          xtype: "listform",
          fieldLabel: t("label-required-rules"),
          rows: 3,
          items: [
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: true,
              isTree: true,
              filterProtected: false,
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
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
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
  filters: [
    {
      title: t("app-title-by-workflow"),
      name: "workflow",
      ftype: "lookup",
      lookup: "wf.workflow",
    },
    {
      title: t("app-title-by-from"),
      name: "from_state",
      ftype: "lookup",
      lookup: "wf.state",
    },
    {
      title: t("app-title-by-to"),
      name: "to_state",
      ftype: "lookup",
      lookup: "wf.state",
    },
  ],
  //
  onJSON: function(){
    var me = this,
      record = new Ext.data.Model({
        id: me.currentRecord.id,
        name: me.currentRecord.get("workflow__label"),
      });
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(record, me.ITEM_FORM);
  },
});
