//---------------------------------------------------------------------
// aaa.user application
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.aaa.user.Application");

Ext.define("NOC.aaa.user.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.PasswordField",
    "NOC.aaa.user.Model",
    "NOC.aaa.group.Permission",
  ],
  model: "NOC.aaa.user.Model",
  search: true,
  recordReload: true,
  initComponent: function(){
    var me = this;
    me.setPasswordBtn = Ext.create(
      {
        xtype: "button",
        itemId: "password-update",
        text: t("btn-set-password"),
        margin: "0 0 0 5",
        scope: me,
        handler: me.updatePassword,
      },
    );
    Ext.apply(me, {
      columns: [
        {
          text: t("header-username"),
          dataIndex: "username",
          width: 110,
        },
        {
          text: t("header-e-mail-address"),
          dataIndex: "email",
          width: 150,
        },
        {
          text: t("header-first-name"),
          dataIndex: "first_name",
          width: 100,
        },
        {
          text: t("header-last-name"),
          dataIndex: "last_name",
          width: 100,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          renderer: NOC.render.Bool,
          width: 50,
        },
        {
          text: t("header-superuser"),
          dataIndex: "is_superuser",
          renderer: NOC.render.Bool,
          width: 50,
        },
        {
          text: t("header-last-login"),
          dataIndex: "last_login",
          renderer: NOC.render.DateTime,
          flex: 1,
        },
      ],
      fields: [
        {
          name: "username",
          xtype: "textfield",
          fieldLabel: t("header-username"),
          autoFocus: true,
          allowBlank: false,
          uiStyle: "large",
          validator: me.usernameValidator,
        },
        {
          name: "email",
          xtype: "textfield",
          fieldLabel: t("header-e-mail-address"),
          vtype: "email",
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "first_name",
          xtype: "textfield",
          fieldLabel: t("header-first-name"),
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "last_name",
          xtype: "textfield",
          fieldLabel: t("header-last-name"),
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "is_active",
          xtype: "checkboxfield",
          fieldLabel: t("header-active"),
          allowBlank: false,
        },
        {
          name: "is_superuser",
          xtype: "checkboxfield",
          fieldLabel: t("label-superuser-status"),
          allowBlank: true,
        },
        {
          xtype: "fieldcontainer",
          itemId: "password",
          fieldLabel: t("label-password"),
          layout: "hbox",
          items: [
            {
              layout: "vbox",
              border: false,
              items: [
                {
                  xtype: "password",
                  name: "password",
                  uiStyle: "medium",
                },
                {
                  xtype: "password",
                  name: "password1",
                  uiStyle: "medium",
                },
              ],
            },
            me.setPasswordBtn,
          ],
        },
        {
          xtype: "fieldcontainer",
          fieldLabel: t("app-title-group"),
          items: [
            {
              xtype: "multiselector",
              name: "groups",
              title: t("app-title-selected-groups"),
              fieldName: "label",
              viewConfig: {
                deferEmptyText: false,
                emptyText: t("label-no-group-selected"),
              },

              search: {
                field: "label",
                store: {
                  proxy: {
                    url: "/aaa/group/lookup/",
                    type: "rest",
                    pageParam: "__page",
                    startParam: "__start",
                    limitParam: "__limit",
                    sortParam: "__sort",
                    extraParams: {
                      "__limit": 0,
                      "__format": "ext",
                    },
                    reader: {
                      type: "json",
                      rootProperty: "data",
                      totalProperty: "total",
                      successProperty: "success",
                    },
                  },
                },
              },
            },
          ],
        },
        {
          xtype: "fieldcontainer",
          fieldLabel: t("label-user-permissions"),
          allowBlank: true,
          items: [
            {
              name: "permissions",
              xtype: "noc.group.permission",
            },
          ],
        },
        {
          name: "last_login",
          xtype: "displayfield",
          fieldLabel: t("header-last-login"),
          allowBlank: true,
          renderer: NOC.render.DateTime,
        },
        {
          name: "date_joined",
          xtype: "displayfield",
          fieldLabel: t("label-date-of-joined"),
          allowBlank: true,
          renderer: NOC.render.DateTime,
        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("header-active"),
      name: "is_active",
      ftype: "boolean",
    },
    {
      title: t("header-superuser"),
      name: "is_superuser",
      ftype: "boolean",
    },
  ],
  updatePassword: function(){
    var me = this,
      errMsg = t("msg-password-mismatch"),
      passwordFieldset = me.down("[itemId=password]"),
      passwdField = me.form.findField("password"),
      passwd1Field = me.form.findField("password1");
    if(passwdField.getValue() === passwd1Field.getValue() && passwdField.getValue().length){
      passwordFieldset.unsetActiveError();
      NOC.api.requestLegacy({
        url: "/aaa/user/" + me.currentRecord.id + "/password/",
        method: "POST",
        jsonData: {password: passwdField.getValue()},
        scope: me,
        success: function(response){
          var data = Ext.decode(response.responseText);
          if(data.status){
            NOC.info(data.result);
          }
        },
        failure: function(){
          NOC.error(t("msg-failed-to-set-password"));
        },
      });
    } else if(!passwdField.getValue().length){
      errMsg = t("msg-password-empty");
      passwdField.markInvalid(errMsg);
      passwd1Field.markInvalid(errMsg);
    } else{
      passwdField.markInvalid(errMsg);
      passwd1Field.markInvalid(errMsg);
    }
  },
  editRecord: function(record){
    var groupsField = this.down("[name=groups]"),
      searchGrid = groupsField.down("[reference=searchGrid]");
    this.setPasswordBtn.show();
    if(searchGrid){
      searchGrid.getSelectionModel().deselectAll();
    }
    groupsField.getStore().loadData(record.get("groups"));
    this.callParent([record]);
  },
  newRecord: function(defaults){
    var groupsField = this.down("[name=groups]"),
      searchGrid = groupsField.down("[reference=searchGrid]");
    this.setPasswordBtn.hide();
    if(searchGrid){
      searchGrid.getSelectionModel().deselectAll();
    }
    this.callParent([defaults]);
  },
  saveRecord: function(data, goToGrid){
    var groups = [],
      groupStore = this.down("[name=groups]").getStore();
    groupStore.each(function(record){
      groups.push("" + record.id);
    });
    Ext.merge(data, {groups: groups});
    this.callParent([data, goToGrid]);
  },
  onNewRecord: function(){
    var me = this;
    me.down("[name=groups]").getStore().removeAll();
    NOC.api.requestLegacy({
      url: "/aaa/group/new_permissions/",
      method: "GET",
      scope: me,
      success: function(response){
        var me = this,
          data = Ext.decode(response.responseText).data;
        me.newRecord({permissions: data.permissions});
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
        me.down("[name=groups]").getStore().removeAll();
        me.form.findField("permissions").resetAllPermission();
        me.unmask(msg);
      },
      interval: 0,
      repeat: 1,
      scope: me,
    });
    me.callParent();
  },
  usernameValidator: function(value){
    var tn = value.match(/^[\w.@+-]+$/, ""),
      errMsg = t("msg-invalid-username");
    return tn ? true : errMsg;
  },
});
