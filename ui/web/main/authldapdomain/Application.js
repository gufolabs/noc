//---------------------------------------------------------------------
// main.authldapdomain application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.authldapdomain.Application");

Ext.define("NOC.main.authldapdomain.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.PasswordField",
    "NOC.main.authldapdomain.Model",
    "NOC.aaa.group.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.main.authldapdomain.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-default"),
          dataIndex: "is_default",
          width: 50,
          renderer: NOC.render.Bool,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          name: "is_default",
          xtype: "checkbox",
          boxLabel: t("label-default-domain"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          store: [
            ["ldap", "LDAP"],
            ["ad", "Active Directory"],
          ],
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "root",
          xtype: "textfield",
          fieldLabel: t("msg-root"),
          allowBlank: false,
        },
        {
          name: "user_search_dn",
          xtype: "textfield",
          fieldLabel: t("label-user-dn"),
          allowBlank: true,
        },
        {
          name: "group_search_dn",
          xtype: "textfield",
          fieldLabel: t("label-group-dn"),
          allowBlank: true,
        },
        {
          name: "user_search_filter",
          xtype: "textfield",
          fieldLabel: t("label-user-search-filter"),
          allowBlank: true,
        },
        {
          name: "group_search_filter",
          xtype: "textfield",
          fieldLabel: t("label-group-search-filter"),
          allowBlank: true,
        },
        {
          name: "bind_user",
          xtype: "textfield",
          fieldLabel: t("label-bind-user"),
          allowBlank: true,
        },
        {
          name: "bind_password",
          xtype: "password",
          fieldLabel: t("label-bind-password"),
          allowBlank: true,
        },
        {
          name: "require_group",
          xtype: "textfield",
          fieldLabel: t("label-require-group"),
          allowBlank: true,
        },
        {
          name: "deny_group",
          xtype: "textfield",
          fieldLabel: t("label-deny-group"),
          allowBlank: true,
        },
        {
          name: "servers",
          xtype: "gridfield",
          fieldLabel: t("label-servers"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-active"),
              dataIndex: "is_active",
              width: 50,
              editor: "checkbox",
            },
            {
              text: t("app-title-address"),
              dataIndex: "address",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-port"),
              dataIndex: "port",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-use-tls"),
              dataIndex: "use_tls",
              width: 50,
              editor: "checkbox",
            },
            {
              text: t("header-connect-timeout"),
              dataIndex: "connect_timeout",
              width: 50,
              editor: "numberfield",
              uiStyle: "small",
              defaultValue: 10,
              minValue: 1,
              maxValue: 120,
            },
          ],
        },
        {
          name: "ha_policy",
          xtype: "combobox",
          fieldLabel: t("label-pool-strategy"),
          store: [
            ["f", t("msg-first")],
            ["rr", t("msg-round-robin")],
            ["r", t("msg-random")],
          ],
          uiStyle: "medium",
          allowBlank: true,
        },
        {
          name: "pool_active",
          xtype: "numberfield",
          fieldLabel: t("label-pool-active"),
          uiStyle: "small",
          allowBlank: true,
          tooltip: t("help-if-empty-active-true"),
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "pool_exhaust",
          xtype: "numberfield",
          fieldLabel: t("label-pool-exhaust"),
          uiStyle: "small",
          allowBlank: true,
          tooltip: t("help-if-empty-exhaus-true"),
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "convert_username",
          xtype: "combobox",
          fieldLabel: t("label-convert-username"),
          store: [
            ["0", t("msg-do-not-convert")],
            ["l", t("msg-lowercase")],
            ["u", t("msg-uppercase")],
          ],
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "sync_name",
          xtype: "checkbox",
          boxLabel: t("label-synchronize-name"),
        },
        {
          name: "sync_mail",
          xtype: "checkbox",
          boxLabel: t("label-synchronize-mail"),
        },
        {
          name: "require_any_group",
          xtype: "checkbox",
          boxLabel: t("label-require-any-group"),
        },
        {
          name: "groups",
          xtype: "gridfield",
          fieldLabel: t("app-title-group"),
          columns: [
            {
              text: t("header-ldap-group-dn"),
              dataIndex: "group_dn",
              width: 200,
              editor: "textfield",
            },
            {
              text: t("header-active"),
              dataIndex: "is_active",
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-local-group"),
              dataIndex: "group",
              flex: 1,
              editor: "aaa.group.LookupField",
              renderer: NOC.render.Lookup("group"),
            },
          ],
        },
      ],
    });
    me.callParent();
  },
  //
  addTooltip: function(element){
    Ext.create("Ext.tip.ToolTip", {
      target: element.getEl(),
      html: element.tooltip,
    });
  },
});
