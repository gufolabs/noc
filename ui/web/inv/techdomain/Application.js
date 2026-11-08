//---------------------------------------------------------------------
// inv.techdomain application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.techdomain.Application");

Ext.define("NOC.inv.techdomain.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.inv.techdomain.Model",
  ],
  model: "NOC.inv.techdomain.Model",
  search: true,
  initComponent: function(){
    var me = this;
    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/techdomain/{0}/json/",
      previewName: "Object Model: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);
    //
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
          width: 200,
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
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
          allowBlank: true,
        },
        {
          name: "code",
          xtype: "textfield",
          fieldLabel: t("label-code"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "kind",
          xtype: "combobox",
          fieldLabel: t("header-kind"),
          uiStyle: "medium",
          store: [
            ["l1", "Level 1"],
            ["l2", "Level 2"],
            ["l3", "Level 3"],
            ["internet", "Internet"],
          ],
          allowBlank: false,
        },
        {
          name: "max_endpoints",
          xtype: "numberfield",
          fieldLabel: t("label-max-endpoints"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-hierarchy"),
          items: [
            {
              name: "allow_parent",
              xtype: "checkbox",
              boxLabel: t("label-allow-parent"),
            },
            {
              name: "allow_children",
              xtype: "checkbox",
              boxLabel: t("header-allow-children"),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-topology"),
          items: [
            {
              name: "allow_p2p",
              xtype: "checkbox",
              boxLabel: t("label-allow-p2p"),
            },
            {
              name: "allow_up2p",
              xtype: "checkbox",
              boxLabel: t("label-allow-unidirectional-p2p"),
            },
            {
              name: "allow_bunch",
              xtype: "checkbox",
              boxLabel: t("label-allow-bunch"),
            },
            {
              name: "allow_p2mp",
              xtype: "checkbox",
              boxLabel: t("label-allow-p2mp"),
            },
            {
              name: "allow_up2pm",
              xtype: "checkbox",
              boxLabel: t("label-allow-unidirectional-p2mp"),
            },
            {
              name: "allow_star",
              xtype: "checkbox",
              boxLabel: t("label-allow-star"),
            },
          ],
        },
        {
          name: "channel_discriminators",
          xtype: "gridfield",
          fieldLabel: t("label-channel-discriminators"),
          allowBlank: true,
          columns: [
            {
              text: t("label-discriminator"),
              dataIndex: "discriminator",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-required"),
              dataIndex: "is_required",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
              editor: "textfield",
            },
          ],
        },
        {
          name: "endpoint_discriminators",
          xtype: "gridfield",
          fieldLabel: t("label-endpoint-discriminators"),
          allowBlank: true,
          columns: [
            {
              text: t("label-discriminator"),
              dataIndex: "discriminator",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-required"),
              dataIndex: "is_required",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
              editor: "textfield",
            },
          ],
        },
        {
          name: "bi_id",
          xtype: "displayfield",
          fieldLabel: t("label-bi-id"),
          allowBlank: true,
          uiStyle: "medium",
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
