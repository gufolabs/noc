//---------------------------------------------------------------------
// project.project application
//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.project.project.Application");

Ext.define("NOC.project.project.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.project.project.Model",
    "NOC.main.glyph.LookupField",
    "NOC.main.ref.soposition.LookupField",
    "NOC.main.ref.soform.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.core.IntegrationField",
  ],
  model: "NOC.project.project.Model",
  search: true,
  initComponent: function(){
    var me = this;
    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    Ext.apply(me, {
      formToolbar: [
        me.cardButton,
      ],
      columns: [
        {
          text: t("label-code"),
          dataIndex: "code",
          width: 150,
        },
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 300,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
      fields: [
        {
          name: "code",
          xtype: "textfield",
          fieldLabel: t("label-code"),
          allowBlank: false,
        },
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-title-shape-overlay"),
          layout: "hbox",
          defaults: {
            padding: 4,
          },
          items: [
            {
              name: "shape_overlay_glyph",
              xtype: "main.glyph.LookupField",
              fieldLabel: t("app-title-glyph"),
              labelWidth: 150,
              allowBlank: true,
            },
            {
              name: "shape_overlay_position",
              xtype: "main.ref.soposition.LookupField",
              fieldLabel: t("label-position"),
              labelWidth: 175,
              width: 330,
              listConfig: {
                minWidth: 155,
              },
              uiStyle: undefined,
              allowBlank: true,
            },
            {
              name: "shape_overlay_form",
              xtype: "main.ref.soform.LookupField",
              fieldLabel: t("label-form"),
              labelWidth: 50,
              width: 200,
              listConfig: {
                minWidth: 150,
              },
              uiStyle: undefined,
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "noc.integrationfield",
        },
      ],
    });
    me.callParent();
  },
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/project/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});
