//---------------------------------------------------------------------
// inv.protocol application
//---------------------------------------------------------------------
// Copyright (C) 2007-2023 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.protocol.Application");

Ext.define("NOC.inv.protocol.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.label.LabelField",
    "NOC.inv.protocol.Model",
    "NOC.inv.technology.LookupField",
    "NOC.inv.modelinterface.LookupField",
    "NOC.main.ref.protocoldiscriminatorsource.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.protocol.Model",
  search: true,

  initComponent: function(){
    var me = this;

    // me.cardButton = Ext.create("Ext.button.Button", {
    //     text: t("Card"),
    //     glyph: NOC.glyph.eye,
    //     scope: me,
    //     handler: me.onCard
    // });

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/protocol/{0}/json/",
      previewName: "Protocol: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-technology"),
          dataIndex: "technology",
          width: 150,
          renderer: NOC.render.Lookup("technology"),
        },
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
          width: 30,
          renderer: NOC.render.Bool,
          sortable: false,
        },
        {
          text: t("header-connection-schema"),
          dataIndex: "connection_schema",
          width: 100,
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
          name: "connection_schema",
          xtype: "combobox",
          fieldLabel: t("header-connection-schema"),
          allowBlank: true,
          labelWidth: 200,
          defaultValue: "BD",
          store: [
            ["U", t("msg-unidirectional")],
            ["BO", t("msg-bidirectional-over-one-connection")],
            ["BD", t("msg-bidirectional-over-differ-connection")],
          ],
          uiStyle: "medium",
        },
        {
          name: "data",
          fieldLabel: t("app-title-data"),
          xtype: "gridfield",
          allowBlank: true,
          columns: [
            {
              text: t("header-interface"),
              dataIndex: "interface",
              editor: {
                xtype: "inv.modelinterface.LookupField",
                forceSelection: true,
                valueField: "label",
              },
            },
            {
              text: t("header-key"),
              dataIndex: "attr",
              editor: "textfield",
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              editor: "textfield",
            },

          ],
        },
        {
          name: "discriminator",
          xtype: "combobox",
          fieldLabel: t("label-discriminator"),
          allowBlank: true,
          store: [
            ["loader", t("msg-from-loader")],
            ["lambda", t("msg-optical-lambda")],
            ["odu", t("msg-otn-odu")],
            ["vlan", t("app-title-vlan")],
          ],
          uiStyle: "medium",
        },
        {
          name: "discriminator_loader",
          xtype: "main.ref.protocoldiscriminatorsource.LookupField",
          fieldLabel: t("label-discriminator-source"),
          allowBlank: true,
        },
        {
          name: "discriminator_default",
          xtype: "textfield",
          fieldLabel: t("label-discriminator-default"),
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

      filters: [
        {
          title: t("app-title-by-technology"),
          name: "technology",
          ftype: "lookup",
          lookup: "inv.technology",
        },
      ],
    });
    me.callParent();
  },

  //
  // onCard: function() {
  //     var me = this;
  //     if(me.currentRecord) {
  //         window.open(
  //             "/api/card/view/technology/" + me.currentRecord.get("id") + "/"
  //         );
  //     }
  // },

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
