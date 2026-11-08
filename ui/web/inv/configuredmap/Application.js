//---------------------------------------------------------------------
// inv.configuredmap application
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.configuredmap.Application");

Ext.define("NOC.inv.configuredmap.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "Ext.ux.form.GridField",
    "Ext.ux.form.StringsField",
    "NOC.core.ComboBox",
    "NOC.core.label.LabelField",
    "NOC.core.tagfield.Tagfield",
    "NOC.core.JSONPreview",
    "NOC.core.ListFormField",
    "NOC.inv.configuredmap.Model",
    "NOC.inv.configuredmap.LookupField",
    "NOC.core.combotree.ComboTree",
    "NOC.sa.managedobject.LookupField",
    "NOC.main.imagestore.LookupField",
    "NOC.main.glyph.LookupField",
    "NOC.main.ref.topologygen.LookupField",
  ],
  model: "NOC.inv.configuredmap.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/configuredmap/{0}/json/",
      previewName: "Spec: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
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
          xtype: "tabpanel",
          layout: "fit",
          autoScroll: true,
          tabPosition: "left",
          tabBar: {
            tabRotation: 0,
            layout: {
              align: "stretch",
            },
          },
          anchor: "-0, -50",
          defaults: {
            autoScroll: true,
            layout: "anchor",
            textAlign: "left",
            padding: 10,
          },
          items: [
            {
              title: t("app-title-common"),
              items: [
                {
                  name: "layout",
                  xtype: "combobox",
                  fieldLabel: t("label-layout"),
                  allowBlank: false,
                  uiStyle: "medium",
                  store: [
                    ["A", "Auto"],
                    ["M", "Manual"],
                    ["FS", "Spring"],
                    ["FR", "Radial"],
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-map-settings"),
                  layout: "hbox",
                  defaults: {
                    padding: 4,
                  },
                  items: [
                    {
                      name: "width",
                      xtype: "numberfield",
                      fieldLabel: t("label-width"),
                      labelAlign: "top",
                      allowBlank: true,
                      minValue: 1,
                      width: 100,
                    },
                    {
                      name: "height",
                      xtype: "numberfield",
                      fieldLabel: t("header-height"),
                      labelAlign: "top",
                      allowBlank: true,
                      minValue: 1,
                      width: 100,
                    },
                    {
                      name: "background_opacity",
                      xtype: "numberfield",
                      fieldLabel: t("label-opacity"),
                      labelAlign: "top",
                      allowBlank: true,
                      minValue: 0,
                      maxValue: 100,
                      width: 90,
                    },
                    {
                      name: "background_image",
                      xtype: "main.imagestore.LookupField",
                      fieldLabel: t("label-background-image"),
                      labelAlign: "top",
                      allowBlank: true,
                    },
                  ],
                },
                {
                  name: "add_linked_node",
                  xtype: "checkboxfield",
                  boxLabel: t("label-add-linked-nodes"),
                  tooltip: t("help-if-check-use-credential-check-rules-service-activation-setup-cre"),
                  allowBlank: true,
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "add_topology_links",
                  xtype: "checkboxfield",
                  boxLabel: t("label-add-topology-links"),
                  tooltip: t("help-if-check-use-credential-check-rules-service-activation-setup-cre"),
                  allowBlank: true,
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "enable_node_portal",
                  xtype: "checkboxfield",
                  boxLabel: t("label-enable-node-portal"),
                  tooltip: t("help-if-check-use-credential-check-rules-service-activation-setup-cre"),
                  allowBlank: true,
                  listeners: {
                    render: me.addTooltip,
                  },
                },
              ],
            },
            {
              title: t("app-title-nodes"),
              items: [
                {
                  name: "nodes",
                  xtype: "listform",
                  labelAlign: "top",
                  rows: 10,
                  items: [
                    {
                      name: "node_id",
                      xtype: "displayfield",
                      hidden: true,
                    },
                    {
                      name: "node_type",
                      xtype: "combobox",
                      fieldLabel: t("header-type"),
                      allowBlank: false,
                      uiStyle: "medium",
                      store: [
                        ["objectgroup", "Group"],
                        ["objectsegment", "Segment"],
                        ["managedobject", "Managed Object"],
                        ["container", "Container"],
                        ["cpe", "CPE"],
                        ["other", "Other"],
                      ],
                      listeners: {
                        change: me.onChangeType,
                      },
                    },
                    {
                      xtype: "fieldset",
                      title: t("label-reference"),
                      layout: "hbox",
                      defaults: {
                        padding: 4,
                      },
                      items: [
                        {
                          name: "resource_group",
                          xtype: "noc.core.combotree",
                          restUrl: "/inv/resourcegroup/",
                          fieldLabel: t("label-resource-group"),
                          listWidth: 1,
                          listAlign: "left",
                          labelAlign: "top",
                          disabled: true,
                          width: 300,
                        },
                        {
                          xtype: "noc.core.combotree",
                          restUrl: "/inv/networksegment/",
                          name: "segment",
                          fieldLabel: t("header-segment-44986c"),
                          allowBlank: true,
                          labelAlign: "top",
                          disabled: true,
                          width: 200,
                        },
                        {
                          name: "managed_object",
                          xtype: "sa.managedobject.LookupField",
                          fieldLabel: t("header-managed-object-62561c"),
                          allowBlank: true,
                          labelAlign: "top",
                          disabled: true,
                          width: 200,
                          renderer: NOC.render.Lookup("managed_object"),
                        },
                        {
                          name: "container",
                          xtype: "noc.core.combotree",
                          restUrl: "/inv/container/",
                          uiStyle: "medium-combo",
                          fieldLabel: t("label-container-2"),
                          labelAlign: "top",
                          tabIndex: 220,
                          allowBlank: true,
                          renderer: NOC.render.Lookup("container"),
                        },
                        {
                          name: "add_nested",
                          xtype: "checkbox",
                          boxLabel: t("label-add-nested-nodes"),
                          tooltip: t("help-display-check-state-on-object-form"),
                          allowBlank: true,
                          listeners: {
                            render: me.addTooltip,
                          },
                        },
                      ],
                    },
                    {
                      xtype: "fieldset",
                      title: t("app-title-shape"),
                      layout: "hbox",
                      defaults: {
                        padding: 4,
                      },
                      items: [
                        {
                          name: "shape",
                          xtype: "combobox",
                          fieldLabel: t("header-type"),
                          labelAlign: "top",
                          allowBlank: true,
                          width: 50,
                          uiStyle: "medium",
                          store: [
                            ["stencil", "Stencil"],
                            ["rectangle", "Rectangle"],
                            ["ellipse", "Ellipse"],
                          ],
                        },
                        {
                          name: "stencil",
                          xtype: "main.glyph.LookupField",
                          fieldLabel: t("app-title-shape"),
                          labelAlign: "top",
                          width: 100,
                          allowBlank: true,
                        },
                        {
                          name: "title",
                          xtype: "textfield",
                          fieldLabel: t("label-title"),
                          labelAlign: "top",
                          allowBlank: true,
                          width: 200,
                          uiStyle: "large",
                        },
                      ],
                    },
                    {
                      xtype: "fieldset",
                      title: t("app-title-portal"),
                      layout: "hbox",
                      collapsible: true,
                      collapsed: true,
                      defaults: {
                        padding: 4,
                      },
                      items: [
                        {
                          name: "portal_generator",
                          xtype: "main.ref.topologygen.LookupField",
                          fieldLabel: t("label-generator"),
                          labelAlign: "top",
                          width: 100,
                          allowBlank: true,
                        },
                        {
                          name: "map_portal",
                          xtype: "inv.configuredmap.LookupField",
                          fieldLabel: t("app-title-configuredmap"),
                          labelAlign: "top",
                          width: 100,
                          allowBlank: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: t("app-title-links"),
              items: [
                {
                  name: "links",
                  xtype: "listform",
                  labelAlign: "top",
                  rows: 10,
                  items: [
                    {
                      fieldLabel: t("label-source-node"),
                      labelWidth: 100,
                      name: "source_node",
                      xtype: "core.combo",
                      autoLoadOnValue: true,
                      restUrl: function(){
                        return "/inv/configuredmap/" + me.currentRecord.id + "/nodes/";
                      },
                      width: 400,
                      allowBlank: true,
                    },
                    {
                      fieldLabel: t("label-target-nodes"),
                      labelWidth: 100,
                      name: "target_nodes",
                      xtype: "core.tagfield",
                      url: function(){
                        return "/inv/configuredmap/" + me.currentRecord.id + "/nodes/";
                      },
                      width: 400,
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      formToolbar: [
        {
          text: t("btn-show-map"),
          glyph: NOC.glyph.globe,
          scope: me,
          handler: me.onShowMap,
        },
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
  onShowMap: function(){
    var me = this;
    NOC.launch("inv.map", "history", {
      args: ["configured", me.currentRecord.get("id")],
    });
  },
  onChangeType: function(field, value){
    var me = this, field_name;
    Ext.Array.each(
      me.up().query('[name/="resource_group|segment|managed_object|container"]'),
      function(field){
        field.setDisabled(value !== "other");
        field.setValue(null);
      });
    switch(value){
      case "objectgroup":
        field_name = "resource_group";
        break;
      case "objectsegment":
        field_name = "segment";
        break;
      case "managedobject":
        field_name = "managed_object";
        break;
      case "container":
        field_name = "container";
        break;
    }
    if(field_name){
      me.up().query("[name=" + field_name + "]")[0].setDisabled(false);
    }
  },
});
