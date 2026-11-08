//---------------------------------------------------------------------
// gis.layer application
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.gis.layer.Application");

Ext.define("NOC.gis.layer.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.gis.layer.Model",
    "Ext.ux.form.ColorField",
  ],
  model: "NOC.gis.layer.Model",
  search: true,
  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/gis/layer/{0}/json/",
      previewName: "Layer: {0}",
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
          text: t("label-code"),
          dataIndex: "code",
          width: 100,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 50,
        },
        {
          text: t("header-zindex"),
          dataIndex: "zindex",
          width: 50,
          align: "right",
        },
        {
          text: t("header-min-zoom-2"),
          dataIndex: "min_zoom",
          width: 50,
          align: "right",
        },
        {
          text: t("header-max-zoom-2"),
          dataIndex: "max_zoom",
          width: 50,
          align: "right",
        },
        {
          text: t("header-def-zoom"),
          dataIndex: "default_zoom",
          width: 50,
          align: "right",
        },
        {
          text: t("header-color"),
          dataIndex: "stroke_color",
          width: 50,
          renderer: me.renderStyle,
        },
      ],
      fields: [
        {
          xtype: "textfield",
          name: "name",
          fieldLabel: t("header-name"),
          allowBlank: false,
        },
        {
          xtype: "textfield",
          name: "code",
          fieldLabel: t("label-code"),
          allowBlank: false,
        },
        {
          xtype: "displayfield",
          name: "uuid",
          fieldLabel: t("label-uuid"),
        },
        {
          xtype: "textarea",
          name: "description",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          xtype: "numberfield",
          name: "zindex",
          fieldLabel: t("header-zindex"),
          minValue: 0,
        },
        {
          xtype: "fieldset",
          title: t("app-title-zoom"),
          layout: "hbox",
          items: [
            {
              xtype: "numberfield",
              name: "min_zoom",
              fieldLabel: t("label-min-2"),
              minValue: 0,
              maxValue: 19,
            },
            {
              xtype: "numberfield",
              name: "max_zoom",
              fieldLabel: t("label-max"),
              minValue: 0,
              maxValue: 19,
            },
            {
              xtype: "numberfield",
              name: "default_zoom",
              fieldLabel: t("header-default"),
              minValue: 0,
              maxValue: 19,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-style"),
          items: [
            {
              name: "stroke_color",
              xtype: "colorfield",
              fieldLabel: t("label-stroke-color"),
              allowBlank: false,
            },
            {
              name: "fill_color",
              xtype: "colorfield",
              fieldLabel: t("label-fill-color"),
              allowBlank: false,
            },
            {
              name: "stroke_width",
              xtype: "numberfield",
              fieldLabel: t("label-stroke-width"),
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-point-style"),
          items: [
            {
              name: "point_radius",
              xtype: "numberfield",
              fieldLabel: t("label-point-radius"),
              minValue: 0,
              allowBlank: true,
            },
            {
              name: "point_graphic",
              xtype: "combobox",
              fieldLabel: t("label-graphic"),
              allowBlank: true,
              store: [
                ["circle", "circle"],
                ["triangle", "triangle"],
                ["cross", "cross"],
                ["x", "x"],
                ["square", "square"],
                ["star", "star"],
                ["diamond", "diamond"],
                ["antenna", "antenna"],
                ["flag", "flag"],
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-line-style"),
          items: [
            {
              name: "stroke_dashstyle",
              xtype: "combobox",
              fieldLabel: t("app-title-line-style"),
              allowBlank: true,
              store: [
                ["solid", "solid"],
                ["dash", "dash"],
                ["dashdot", "dashdot"],
                ["longdash", "longdash"],
                ["longdashdot", "longdashdot"],
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-text-style"),
          items: [
            {
              name: "show_labels",
              xtype: "checkboxfield",
              boxLabel: t("label-show-labels"),
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
  //
  renderStyle: function(value, meta, record){
    return "<span style='padding: 2px; border: 1px solid #" + record.get("stroke_color") + "; background-color: #" + record.get("fill_color") + "'>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
  },
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
