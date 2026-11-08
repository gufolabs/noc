//---------------------------------------------------------------------
// inv.objectconfigurationrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2023 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.objectconfigurationrule.Application");

Ext.define("NOC.inv.objectconfigurationrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.StringListField",
    "NOC.core.tagfield.Tagfield",
    "NOC.inv.objectconfigurationrule.Model",
    "NOC.inv.objectconfigurationrule.ComboEditor",
    "NOC.inv.connectiontype.LookupField",
    "NOC.inv.protocol.LookupField",
    "NOC.cm.configurationscope.LookupField",
    "NOC.cm.configurationparam.LookupField",
    "NOC.core.label.LabelField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.objectconfigurationrule.Model",
  search: true,

  actions: [
    {
      title: t("app-title-get-json"),
      action: "json",
      glyph: NOC.glyph.file,
      resultTemplate: "JSON",
    },
  ],

  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/objectconfigurationrule/{0}/json/",
      previewName: "Configuration Rule: {0}",
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
          width: 50,
          renderer: NOC.render.Bool,
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
          fieldLabel: t("header-name"),
          xtype: "textfield",
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
        },
        {
          name: "connection_rules",
          xtype: "gridfield",
          fieldLabel: t("app-title-connectionrule"),
          columns: [
            {
              text: t("header-scope"),
              dataIndex: "scope",
              editor: "cm.configurationscope.LookupField",
              width: 200,
              renderer: NOC.render.Lookup("scope"),
            },
            {
              text: t("header-match-slot-ctx"),
              dataIndex: "match_context",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-connection-type"),
              dataIndex: "match_connection_type",
              editor: "inv.connectiontype.LookupField",
              width: 200,
              renderer: NOC.render.Lookup("match_connection_type"),
            },
            {
              text: t("nav-protocol"),
              dataIndex: "match_protocols",
              width: 200,
              editor: {
                xtype: "inv.objectconfigurationrule.comboEditor",
                url: "/inv/protocol/lookup/",
              },
              renderer: me.comboBoxRenderer,
            },
            {
              text: t("header-allow-params"),
              dataIndex: "allowed_params",
              width: 200,
              editor: {
                xtype: "inv.objectconfigurationrule.comboEditor",
                url: "/cm/configurationparam/lookup/",
              },
              renderer: me.comboBoxRenderer,
            },
            {
              text: t("header-deny-params"),
              dataIndex: "deny_params",
              width: 200,
              editor: {
                xtype: "inv.objectconfigurationrule.comboEditor",
                url: "/cm/configurationparam/lookup/",
              },
              renderer: me.comboBoxRenderer,
            },
          ],
        },
        {
          name: "param_rules",
          xtype: "gridfield",
          fieldLabel: t("label-param-rules"),
          columns: [
            {
              text: t("btn-param"),
              dataIndex: "param",
              editor: "cm.configurationparam.LookupField",
              width: 200,
              renderer: NOC.render.Lookup("param"),
              sortable: false,
            },
            {
              text: t("header-scope"),
              dataIndex: "scope",
              editor: "cm.configurationscope.LookupField",
              width: 200,
              renderer: NOC.render.Lookup("scope"),
              sortable: false,
            },
            {
              text: t("label-hide"),
              dataIndex: "is_hide",
              width: 30,
              renderer: NOC.render.Bool,
              sortable: false,
            },
            {
              text: t("header-read-only"),
              dataIndex: "is_readonly",
              width: 30,
              renderer: NOC.render.Bool,
              sortable: false,
            },
            {
              text: t("header-dependency-param"),
              dataIndex: "dependency_param",
              editor: "cm.configurationparam.LookupField",
              width: 200,
              renderer: NOC.render.Lookup("dependency_param"),
              sortable: false,
            },
            {
              text: t("header-dependency-param-values"),
              dataIndex: "dependency_param_values",
              width: 100,
              editor: "textfield",
              sortable: false,
            },
            {
              text: t("header-choices"),
              dataIndex: "choices",
              width: 150,
              editor: "textfield",
              sortable: false,
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
      title: t("app-title-by-is-builtin"),
      name: "is_builtin",
      ftype: "boolean",
    },
  ],

  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
  //
  comboBoxRenderer: function(value, metaData, record){
    if(Ext.isArray(value)){
      var flag = false,
        store = metaData.column.getEditor().getStore(),
        labels = Ext.Array.map(value, function(item){
          if(Ext.isObject(item) && !item.isModel){
            flag = true;
            return item.label;
          }
          return store.findRecord("id", item).get("label");
        });
      if(flag){ // Array of object from backend transfer to array of id
        var ids = Ext.Array.map(value, function(item){
          return item.id;
        })
        record.set(metaData.column.dataIndex, ids, {dirty: false});
      }
      return labels.join(", ");
    }
    return value;
  },
});
