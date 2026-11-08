//---------------------------------------------------------------------
// inv.inv AddGroupForm
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.inv.plugins.map.AddObjectForm");

Ext.define("NOC.inv.inv.plugins.map.AddObjectForm", {
  extend: "Ext.window.Window",
  modal: true,
  autoShow: true,
  closeable: true,
  objectModelId: null,
  objectModelName: null,
  newPosition: null,
  positionSRID: null,
  app: null,
  width: 400,
  layout: "fit",

  initComponent: function(){
    var me = this;

    me.form = Ext.create("Ext.form.Panel", {
      bodyPadding: 4,
      layout: "anchor",
      defaults: {
        anchor: "100%",
        labelWidth: 40,
      },
      items: [
        {
          xtype: "displayfield",
          name: "display_position",
        },
        {
          xtype: "textfield",
          name: "name",
          fieldLabel: t("header-name"),
          allowBlank: false,
        },
      ],
      buttons: [
        {
          text: t("btn-close"),
          scope: me,
          handler: me.onPressClose,
        },
        {
          text: t("btn-add"),
          glyph: NOC.glyph.plus,
          scope: me,
          handler: me.onPressAdd,
          formBind: true,
        },
      ],
    });

    Ext.apply(me, {
      title: t("msg-create-new-value0", {value0: me.objectModelName}),
      items: [me.form],
    });
    me.callParent();
    me.form.getForm().setValues({
      objectmodel: "Zhopa",
      display_position: "lon=" + me.newPosition.lon + ",lat=" + me.newPosition.lat,
    });
  },
  //
  onPressClose: function(){
    var me = this;
    me.close();
  },
  onPressAdd: function(){
    var me = this,
      values = me.form.getValues();
    NOC.api.requestLegacy({
      url: "/inv/inv/plugin/map/",
      method: "POST",
      jsonData: {
        model: me.objectModelId,
        name: values.name,
        srid: me.positionSRID,
        x: me.newPosition.lon,
        y: me.newPosition.lat,
      },
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        me.close();
        me.app.app.showObject(data.id, true);
      },
      failure: function(){
        NOC.error(t("msg-failed-to-save"));
      },
    });
  },
});
