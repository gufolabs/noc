//---------------------------------------------------------------------
// main.modeltemplate application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.modeltemplate.Application");

Ext.define("NOC.main.modeltemplate.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.main.modeltemplate.Model",
    "NOC.sa.profile.LookupField",
    "NOC.inv.capability.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "NOC.core.label.LabelField",
    "NOC.main.ref.modelid.LookupField",
    "NOC.wf.state.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.main.modeltemplate.Model",
  search: true,
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/main/modeltemplate/{0}/json/",
      previewName: "Model Template: {0}",
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
          text: t("header-blt"),
          // tooltip: "Built-in", - broken in ExtJS 5.1
          dataIndex: "is_builtin",
          width: 40,
          renderer: NOC.render.Bool,
          align: "center",
        },
        {
          text: t("header-resource"),
          dataIndex: "resource_model",
          width: 70,
        },
        {
          text: t("header-type"),
          dataIndex: "type",
          width: 70,
        },
        {
          text: t("header-allow-manual"),
          dataIndex: "allow_manual",
          width: 50,
          renderer: NOC.render.Bool,
          align: "center",
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "large",
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
        },
        {
          name: "type",
          xtype: "combobox",
          itemId: "templateType",
          fieldLabel: t("header-type"),
          uiStyle: "medium",
          allowBlank: true,
          valueField: "id",
          triggers: {
            clear: {
              cls: "x-form-clear-trigger",
              hidden: true,
              weight: -1,
              handler: function(field){
                field.setValue(null);
                field.fireEvent("select", field);
              },
            },
          },
          store: {
            fields: ["id", "text"],
            data: [
              {id: "host", text: t("header-managed-object-62561c")},
            ],
          },
          listeners: {
            select: function(field){
              var form = field.up("form"),
                params = form.down("#fieldsGrid");
              params.store.removeAll();
            },
            change: function(field, newValue){
              if(newValue){
                field.getTrigger("clear").show();
              } else{
                field.getTrigger("clear").hide();
              }
            },
          },
        },
        {
          name: "default_state",
          xtype: "wf.state.LookupField",
          uiStyle: "large",
          fieldLabel: t("label-default-state"),
          allowBlank: true,
        },
        {
          name: "params",
          xtype: "gridfield",
          itemId: "fieldsGrid",
          fieldLabel: t("label-fields"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              width: 200,
              sortable: false,
              renderer: NOC.render.Lookup("name"), 
              editor: {
                xtype: "textfield",
              },
            },
            {
              text: t("choice-ignore"),
              dataIndex: "ignore",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
            {
              text: t("header-required"),
              dataIndex: "required",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
            {
              text: t("header-preferred"),
              dataIndex: "preferred_template_value",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
            {
              text: t("header-overr-existing"),
              dataIndex: "override_existing",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
            {
              text: t("btn-param"),
              dataIndex: "param",
              width: 200,
              sortable: false,
              editor: {
                xtype: "textfield",
              },
            },
            {
              text: t("header-dictionary"),
              dataIndex: "default_dictionary",
              itemId: "paramDictionary",
              renderer: function(value, metaData, record){
                if(value === t("btn-select-dictionary")){
                  return value;
                }
                if(record && record.get("default_dictionary__label")){
                  return record.get("default_dictionary__label");
                }
                var field = this.down("#paramDictionary"),
                  editor = field.getEditor();
                if(editor.xtype === "combo"){
                  var store = editor.getStore(),
                    r = store.getById(value);
                  return r ? r.get("label") : "-";
                }
                return "-";
              },
              editor: {
                xtype: "textfield",
              },
            },
            {
              text: t("header-default-expression"),
              dataIndex: "default_expression",
              itemId: "paramExpression",
              width: 200,
              sortable: false,
              editor: {
                xtype: "textfield",
              },
            },
            {
              text: t("app-title-capability"),
              dataIndex: "set_capability",
              renderer: NOC.render.Lookup("set_capability"),
              width: 250,
              editor: "inv.capability.LookupField",
            },
          ],
          onBeforeEdit: function(editor, context){
            if(context.field === "default_dictionary"){
              var form = context.view.up("form"), 
                templateType = form.down("#templateType"),
                params = form.down("#fieldsGrid"),
                selection = params.grid.getSelectionModel().getSelection()[0],
                value = templateType.getValue();
              NOC.api.requestLegacy({
                url: `/main/modeltemplate/directory/${value}/fields/${context.record.get("name")}/`,
                method: "GET",
                async: false,
                success: function(response){
                  var data = Ext.decode(response.responseText);
                  if(Ext.isEmpty(data)){
                    NOC.error(t("msg-dictionary-not-found"));
                    return;
                  }
                  if(data.type === "lookup"){
                    context.column.setEditor({
                      xtype: "combo",
                      displayField: "label",
                      valueField: "id",
                      queryParam: null,
                      store: {
                        fields: ["id", "label"],
                        proxy: {
                          type: "rest",
                          url: data.rest_url,
                          pageParam: null,
                          startParam: null,
                          limitParam: null,
                          reader: {
                            type: "json",
                          },
                        },
                      },

                      listeners: {
                        select: function(field, record){
                          selection.set("default_expression", record.id);
                        },
                      },  
                    });
                    context.column.getEditor().setDisabled(false);
                  } else{
                    context.column.setEditor({
                      xtype: "textfield",
                    });
                    context.column.getEditor().setDisabled(true);
                    selection.set("default_dictionary", "-");
                  }
                },
                failure: function(response){
                  NOC.error(t("msg-server-side-failed-to-get-default-dictionary-value0", {value0: response.status}));
                },
              });
            } else if(context.field === "name"){
              context.column.setEditor({
                xtype: "combobox",
                displayField: "label",
                valueField: "id",
                listeners: {
                  beforequery: function(queryPlan){
                    var field = queryPlan.combo,
                      form = field.up("form"),
                      templateType = form.down("#templateType"),
                      value = templateType.getValue();
                    NOC.api.requestLegacy({
                      url: `/main/modeltemplate/directory/${value}/fields`,
                      method: "GET",
                      success: function(response){
                        field.getStore().loadData(Ext.decode(response.responseText));
                      },
                      failure: function(response){
                        NOC.error(t("msg-server-side-failed-to-get-fields-value0", {value0: response.status}));
                      },
                    });
                  },
                  select: function(field, record){
                    var form = field.up("form"),
                      params = form.down("#fieldsGrid"),
                      selection = params.grid.getSelectionModel().getSelection()[0];
                    if(record && record.get("type") === "lookup"){
                      selection.set("default_dictionary", t("btn-select-dictionary"));
                      selection.set("default_dictionary__label", t("btn-select-dictionary"));
                    } else{
                      selection.set("default_dictionary", "-");
                      selection.set("default_dictionary__label", "-");
                    }
                    selection.set("default_expression", "");
                  },
                },
              });
            }
          },
        },
        {
          name: "groups",
          xtype: "gridfield",
          fieldLabel: t("app-title-group"),
          columns: [
            {
              dataIndex: "group",
              text: t("label-resource-group"),
              width: 350,
              renderer: NOC.render.Lookup("group"),
              editor: {
                xtype: "inv.resourcegroup.LookupField",
              },
            },
            {
              text: t("app-title-action"),
              dataIndex: "action",
              width: 150,
              editor: {
                xtype: "combobox",
                store: [
                  ["set", t("btn-set")],
                  ["allow", t("app-title-allow")],
                  ["deny", t("msg-deny")],
                ],
                queryMode: "local",
              },
              renderer: NOC.render.Lookup("action"),
            },
            {
              text: t("header-client"),
              dataIndex: "as_client",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
            {
              text: t("header-service"),
              dataIndex: "as_service",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
          ],
        },
        {
          name: "params_form",
          xtype: "gridfield",
          fieldLabel: t("label-params-form"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              width: 100,
              sortable: false,
              editor: {
                xtype: "textfield",
              },
            },
            {
              text: t("header-hint"),
              dataIndex: "hint",
              width: 100,
              sortable: false,
              editor: {
                xtype: "textfield",
              },
            },
            {
              text: t("header-is-hide"),
              dataIndex: "hide",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("header-modelid"),
              dataIndex: "model_id",
              renderer: NOC.render.Lookup("model_id"),
              editor: "main.ref.modelid.LookupField",
              width: 150,
            },
            {
              text: t("app-title-validation"),
              dataIndex: "validation_method",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["regex", "Regex"],
                  ["eq", "Equal"],
                  ["range", "Range"],
                  ["choices", "Choices"],
                ],
              },
            },
            {
              text: t("header-validataion-expr"),
              dataIndex: "validation_expression",
              width: 100,
              sortable: false,
              editor: {
                xtype: "textfield",
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
      filters: [
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
