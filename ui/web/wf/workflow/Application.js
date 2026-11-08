//---------------------------------------------------------------------
// wf.workflow application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.wf.workflow.Application");

Ext.define("NOC.wf.workflow.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.wf.workflow.Model",
    "NOC.wf.workflow.WFEditor",
    "NOC.core.JSONPreview",
    "NOC.core.tagfield.Tagfield",
    "NOC.main.remotesystem.LookupField",
    "NOC.main.ref.modelid.LookupField",
  ],
  model: "NOC.wf.workflow.Model",
  search: true,
  helpId: "reference-workflow",

  initComponent: function(){
    var me = this;
    me.WF_EDITOR = me.registerItem("NOC.wf.workflow.WFEditor");

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: new Ext.XTemplate("/wf/workflow/{0}/json/"),
      previewName: new Ext.XTemplate("Workflow: {0}"),
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          flex: 1,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 25,
          renderer: NOC.render.Bool,
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
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
        },
        {
          xtype: "core.tagfield",
          url: "/main/ref/modelid/lookup/",
          fieldLabel: t("label-allowed-models-2"),
          tooltip: t("help-models-allowed-set-workflow"),
          name: "allowed_models",
          listeners: {
            render: me.addTooltip,
          },
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
    console.log(me.getRegisteredItems());
    me.getRegisteredItems()[me.WF_EDITOR].on("scriptsLoaded", function(){
      var me = this;
      if(me.openPreview){
        me.openDiagram(me.currentRecord);
      }
    }, me);
    me.callParent();
  },
  onClone: function(){
    var me = this;
    if(me.currentRecord){
      NOC.api.requestLegacy({
        url: "/wf/workflow/" + me.currentRecord.get("id") + "/clone/",
        method: "POST",
        scope: me,
        success: function(response){
          var data = Ext.decode(response.responseText);
          me.restoreHistory([data.id]);
          NOC.info(t("msg-cloned"));
        },
        failure: function(){
          NOC.error(t("msg-failed-to-clone"))
        },
      });
    }
  },
  //
  newRecord: function(){
    var me = this;
    me.openDiagram(null);
  },
  // Show Form
  onEditRecord: function(record){
    var me = this;
    // Check permissions
    if(!me.hasPermission("read") && !me.hasPermission("update"))
      return;
    me.currentRecord = record;
    if(me.getRegisteredItems()[me.WF_EDITOR].getScriptsLoaded()){
      me.openDiagram(me.currentRecord);
    } else{
      me.openPreview = true;
    }
  },
  //
  openDiagram: function(record){
    var me = this;
    me.previewItem(me.WF_EDITOR, record);
    if(record){
      me.setHistoryHash(record.get("id"));
    }
  },
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
