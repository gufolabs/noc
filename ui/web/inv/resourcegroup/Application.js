//---------------------------------------------------------------------
// inv.resourcegroup application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.resourcegroup.Application");

Ext.define("NOC.inv.resourcegroup.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.inv.resourcegroup.Model",
    "NOC.core.combotree.ComboTree",
    "NOC.inv.technology.LookupField",
    "NOC.main.remotesystem.LookupField",

  ],
  model: "NOC.inv.resourcegroup.Model",
  search: true,
  helpId: "reference-resource-group",

  initComponent: function(){
    var me = this;

    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 300,
        },
        {
          text: t("header-service-expression"),
          dataIndex: "service_expression",
          width: 400,
          renderer: function(v){
            var labels = [], text;
            Ext.each(v, function(label){
              labels.push(NOC.render.Label({
                badges: label.badges,
                name: label.name,
                description: label.description || "",
                bg_color1: label.bg_color1 || 0,
                fg_color1: label.fg_color1 || 0,
                bg_color2: label.bg_color2 || 0,
                fg_color2: label.fg_color2 || 0,
              }));
            });
            text = labels.join("");
            return '<span data-qtitle="Service Expression" ' +
                            'data-qtip="' + text + '">' + text + "</span>";
          },
        },
        {
          text: t("header-parent"),
          dataIndex: "parent",
          width: 300,
          renderer: NOC.render.Lookup("parent"),
        },
        {
          text: t("header-technology"),
          dataIndex: "technology",
          width: 300,
          renderer: NOC.render.Lookup("technology"),
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          width: 300,
          flex: 1,
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
          name: "parent",
          xtype: "noc.core.combotree",
          restUrl: "/inv/resourcegroup/",
          fieldLabel: t("label-resource-group"),
          listWidth: 1,
          listAlign: "left",
          labelAlign: "left",
          width: 500,
          allowBlank: true,
        },
        {
          name: "technology",
          xtype: "inv.technology.LookupField",
          fieldLabel: t("header-technology"),
          allowBlank: false,
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
          uiStyle: "extra",
          query: {
            "allow_models": ["inv.ResourceGroup"],
          },
        },
        {
          name: "dynamic_service_labels",
          xtype: "listform",
          rows: 6,
          fieldLabel: t("label-dynamic-service-labels"),
          labelAlign: "top",
          items: [
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: false,
              isTree: true,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
            },
          ],
        },
        {
          name: "dynamic_client_labels",
          xtype: "listform",
          fieldLabel: t("label-dynamic-client-labels"),
          rows: 6,
          labelAlign: "top",
          items: [
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: false,
              isTree: true,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
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
      ],
      formToolbar: [
        me.cardButton,
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-technology"),
      name: "technology",
      ftype: "lookup",
      lookup: "inv.technology",
    },
    {
      title: t("app-title-by-resourcegroup"),
      name: "parent",
      ftype: "tree",
      lookup: "inv.resourcegroup",
    },
    {
      title: t("app-title-by-dynamic-service-labels"),
      name: "dynamic_service_labels",
      ftype: "label",
      lookup: "main.label",
      treePickerWidth: 400,
      query_filter: {
        "allow_matched": true,
      },
    },
    {
      title: t("app-title-by-dynamic-client-labels"),
      name: "dynamic_client_labels",
      ftype: "label",
      lookup: "main.label",
      treePickerWidth: 400,
      query_filter: {
        "allow_matched": true,
      },
    },
  ],
  levelFilter: {
    icon: NOC.glyph.level_down,
    color: NOC.colors.level_down,
    filter: "parent",
    tooltip: t("help-parent-filter"),
  },
  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/resourcegroup/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});
