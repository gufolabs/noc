//---------------------------------------------------------------------
// aaa.group application
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.aaa.group.Application");

Ext.define("NOC.aaa.group.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.aaa.group.Model",
    "NOC.aaa.group.Permission",
  ],
  model: "NOC.aaa.group.Model",
  search: true,
  recordReload: true,
  maskElement: "el",
  // actions: [
  //     {
  //         title: t("Delete selected groups"),
  //         run: "groupDelete",
  //         glyph: NOC.glyph.trash
  //     }
  // ],
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 130,
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          autoFocus: true,
          tabIndex: 10,
          uiStyle: "large",
        },
        {
          name: "permissions",
          xtype: "noc.group.permission",
          fieldLabel: t("label-permissions"),
          allowBlank: true,
        },
      ],
    });
    me.callParent();
  },
  onNewRecord: function(){
    var me = this;
    NOC.api.requestLegacy({
      url: "/aaa/group/new_permissions/",
      method: "GET",
      scope: me,
      success: function(response){
        var me = this,
          data = Ext.decode(response.responseText).data;
        me.newRecord(data);
      },
      failure: function(){
        NOC.error(t("msg-failed-to-get-data"));
      },
    });
  },
  onReset: function(){
    var me = this, msg = t("btn-reset");
    me.mask(msg);
    Ext.TaskManager.start({
      run: function(){
        me.form.findField("permissions").resetAllPermission();
        me.unmask(msg);
      },
      interval: 0,
      repeat: 1,
      scope: me,
    });
    me.callParent();
  },
  // groupDelete: function() {
  //     console.log("not implemented");
  // }
});
