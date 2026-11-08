//---------------------------------------------------------------------
// inv.unknownmodel application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.unknownmodel.Application");

Ext.define("NOC.inv.unknownmodel.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.unknownmodel.Model",
    "NOC.inv.objectmodel.LookupField",
  ],
  model: "NOC.inv.unknownmodel.Model",
  search: true,
  canAdd: false,
  actions: [
    {
      title: t("btn-remove"),
      action: "remove",
      glyph: NOC.glyph.remove,
    },
  ],
  initComponent: function(){
    var me = this;

    me.generateBtn = Ext.create("Ext.button.Button", {
      xtype: "button",
      text: t("btn-generate"),
      glyph: NOC.glyph.magic,
      disabled: true,
      height: 30,
      maxWidth: 150,
      scope: me,
      handler: me.onGenerate,
    },
    );
    Ext.apply(me, {
      columns: [
        {
          text: t("header-object"),
          dataIndex: "managed_object",
          width: 100,
        },
        {
          text: t("app-title-platform"),
          dataIndex: "platform",
          width: 100,
        },
        {
          text: t("header-vendor"),
          dataIndex: "vendor",
          width: 70,
        },
        {
          text: t("header-part-no"),
          dataIndex: "part_no",
          width: 100,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
      formToolbar: [
      ],
      fields: [
        {
          name: "managed_object",
          xtype: "displayfield",
          fieldLabel: t("header-object"),
          labelWidth: 200,
          allowBlank: true,
          uiStyle: "large",
        },
        {
          xtype: "inv.objectmodel.LookupField",
          name: "type",
          fieldLabel: t("label-use-connections-from"),
          labelWidth: 200,
          allowBlank: true,
          uiStyle: "large",
          listeners: {
            scope: me,
            select: function(){
              me.generateBtn.setDisabled(false);
            },
          },
        },
        me.generateBtn,
      ],
    });
    me.callParent();
  },
  //
  onGenerate: function(){
    var me = this,
      formData = this.form.getValues();
    new Ext.Promise(function(resolve){
      NOC.api.requestLegacy({
        url: "/inv/vendor/lookup/?__format=ext&__limit=2&__query=" + me.currentRecord.get("vendor"),
        method: "GET",
        scope: me,
        success: function(response){
          var result = Ext.decode(response.responseText);
          if(Object.hasOwn(result, "total") && result.total === 1){
            resolve(result.data[0]);
          } else if(Object.hasOwn(result, "total") && result.total === 0){
            NOC.error(t("msg-vendor-not-found"));
          } else{
            NOC.error(t("msg-too-many-vendors-found"));
          }
        },
        failure: function(){
          NOC.error(t("msg-failed-to-get-vendor-information"));
        },
      })
    }).then(function(vendor){
      NOC.api.requestLegacy({
        url: "/inv/objectmodel/" + formData.type + "/",
        method: "GET",
        scope: me,
        success: function(response){
          var result = Ext.decode(response.responseText);
          if(Object.hasOwn(result, "connections")){
            NOC.run(
              "NOC.inv.objectmodel.Application",
              t("msg-create-model"),
              {
                cmd: {
                  cmd: "new",
                  args: {
                    description: `${me.currentRecord.get("description")} generated from ${me.currentRecord.get("managed_object")}, platform: ${me.currentRecord.get("platform")}`,
                    data: {
                      asset: {
                        part_no: [me.currentRecord.get("part_no")],
                      },
                    },
                    connections: result.connections,
                    vendor: vendor.id,
                    vendor__label: vendor.label,
                  },
                },
              },
            );
          } else{
            NOC.error(t("msg-no-connection-information"));
          }
        },
        failure: function(){
          NOC.error(t("msg-failed-to-get-connection-information"));
        },
      })
    });
  },
  onEditRecord: function(record){
    var me = this;
    me.callParent([record]);
    me.generateBtn.setDisabled(true);
  },
});
