//---------------------------------------------------------------------
// sa.authprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.authprofile.Application");

Ext.define("NOC.sa.authprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.PasswordField",
    "NOC.core.label.LabelField",
    "NOC.sa.authprofile.Model",
    "NOC.main.handler.LookupField",
    "NOC.core.ListFormField",
    "NOC.main.remotesystem.LookupField",
  ],
  model: "NOC.sa.authprofile.Model",
  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-type"),
          dataIndex: "type",
          width: 100,
          renderer: NOC.render.Choices({
            G: "Local Group",
            R: "RADIUS",
            T: "TACACS+",
            L: "LDAP",
            S: "Suggest",
          }),
        },
        {
          text: t("header-user"),
          dataIndex: "user",
          width: 100,
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
          allowBlank: false,
          store: [
            ["G", "Local Group"],
            ["R", "RADIUS"],
            ["T", "TACACS+"],
            ["L", "LDAP"],
          ],
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          uiStyle: "extra",
          query: {
            "enable_authprofile": true,
          },
        },
        {
          name: "user",
          xtype: "textfield",
          fieldLabel: t("header-user"),
          allowBlank: true,
        },
        {
          name: "password",
          xtype: "password",
          fieldLabel: t("label-password"),
          uiStyle: "large",
          allowBlank: true,
        },
        {
          name: "super_password",
          xtype: "password",
          fieldLabel: t("label-super-password"),
          uiStyle: "large",
          allowBlank: true,
        },
        {
          name: "snmp_security_level",
          xtype: "combobox",
          fieldLabel: t("label-snmp-security-level"),
          uiStyle: "large",
          store: [
            ["Community", "Community"],
            ["noAuthNoPriv", "No Auth No Priv"],
            ["authNoPriv", "Auth No Priv"],
            ["authPriv", "Auth Priv"],
          ],
          queryMode: "local",
          listeners: {
            change: me.onChangeSNMP_SecurityLevel,
          },
        },
        {
          name: "snmp_ro",
          xtype: "password",
          fieldLabel: t("label-snmp-ro-community"),
          uiStyle: "large",
          readOnlyCls: "x-item-disabled",
          allowBlank: true,
        },
        {
          name: "snmp_rw",
          xtype: "password",
          fieldLabel: t("label-snmp-rw-community"),
          uiStyle: "large",
          readOnlyCls: "x-item-disabled",
          allowBlank: true,
        },
        {
          name: "snmp_username",
          xtype: "textfield",
          fieldLabel: t("label-snmp-username"),
          uiStyle: "large",
          readOnlyCls: "x-item-disabled",
          allowBlank: true,
          groupEdit: true,
        },
        {
          name: "snmp_ctx_name",
          xtype: "textfield",
          fieldLabel: t("label-snmp-context-name"),
          allowBlank: true,
          uiStyle: "large",
          readOnlyCls: "x-item-disabled",
          groupEdit: true,
        },
        {
          xtype: "fieldcontainer",
          itemId: "snmp_auth_proto",
          fieldLabel: t("label-snmp-auth-proto"),
          visible: false,
          maxWidth: 200,
          defaultType: "radiofield",
          defaults: {
            flex: 1,
          },
          layout: "hbox",
          items: [
            {
              boxLabel: "MD5",
              name: "snmp_auth_proto",
              padding: "0 5",
              inputValue: "MD5",
            },
            {
              boxLabel: "SHA",
              name: "snmp_auth_proto",
              inputValue: "SHA",
            },
          ],
        },
        {
          xtype: "password",
          fieldLabel: t("label-snmp-auth-key"),
          visible: false,
          uiStyle: "large",
          name: "snmp_auth_key",
          allowBlank: true,
          groupEdit: true,
        },
        {
          xtype: "fieldcontainer",
          itemId: "snmp_priv_proto",
          fieldLabel: t("label-snmp-priv-proto"),
          visible: false,
          maxWidth: 200,
          defaultType: "radiofield",
          defaults: {
            flex: 1,
          },
          layout: "hbox",
          items: [
            {
              boxLabel: "DES",
              name: "snmp_priv_proto",
              padding: "0 5",
              inputValue: "DES",
            },
            {
              boxLabel: "AES",
              name: "snmp_priv_proto",
              inputValue: "AES",
            },
          ],
        },
        {
          xtype: "password",
          fieldLabel: t("label-snmp-priv-key"),
          visible: false,
          uiStyle: "large",
          name: "snmp_priv_key",
          allowBlank: true,
          groupEdit: true,
        },
        {
          name: "enable_suggest_by_rule",
          xtype: "checkboxfield",
          boxLabel: t("label-enable-suggets-by-rule"),
          tooltip: t("help-if-check-use-credential-check-rules-service-activation-setup-cre"),
          allowBlank: true,
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "preferred_profile_credential",
          xtype: "checkboxfield",
          boxLabel: t("label-preferred-profile-credential"),
          tooltip: t("help-if-set-credential-on-profile-will-replace-credential-on-device"),
          allowBlank: true,
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "remote_id",
              xtype: "textfield",
              fieldLabel: t("label-remote-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "bi_id",
              xtype: "displayfield",
              fieldLabel: t("label-bi-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "dynamic_classification_policy",
          xtype: "combobox",
          fieldLabel: t("label-dynamic-classification-policy"),
          store: [
            ["D", t("msg-disabled")],
            ["R", t("msg-by-rule")],
            ["U", t("msg-by-username-snmp-ro")],
          ],
          allowBlank: false,
          labelWidth: 200,
          value: "R",
          uiStyle: "medium",
        },
        {
          name: "match_rules",
          xtype: "listform",
          rows: 5,
          labelAlign: "top",
          uiStyle: "large",
          fieldLabel: t("label-match-rules"),
          items: [
            {
              name: "dynamic_order",
              xtype: "numberfield",
              fieldLabel: t("label-dynamic-order"),
              allowBlank: true,
              defaultValue: 0,
              uiStyle: "small",
            },
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: false,
              isTree: true,
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
            },
            {
              name: "handler",
              xtype: "main.handler.LookupField",
              fieldLabel: t("label-match-handler"),
              allowBlank: true,
              uiStyle: "medium",
              query: {
                "allow_match_rule": true,
              },
            },
          ],
        },
      ],
    });
    me.callParent();
  },
  onChangeSNMP_SecurityLevel: function(field, value){
    var form = this.up();
    form.down("[name=snmp_ro]").setReadOnly(!["Community"].includes(value));
    form.down("[name=snmp_rw]").setReadOnly(!["Community"].includes(value));
    form.down("[name=snmp_username]").setReadOnly(!["noAuthNoPriv", "authNoPriv", "authPriv"].includes(value));
    form.down("[name=snmp_ctx_name]").setReadOnly(!["noAuthNoPriv", "authNoPriv", "authPriv"].includes(value));
    form.down("[itemId=snmp_auth_proto]").setHidden(["Community", "noAuthNoPriv"].includes(value));
    form.down("[name=snmp_auth_key]").setHidden(["Community", "noAuthNoPriv"].includes(value));
    form.down("[itemId=snmp_priv_proto]").setHidden(["Community", "noAuthNoPriv", "authNoPriv"].includes(value));
    form.down("[name=snmp_priv_key]").setHidden(["Community", "noAuthNoPriv", "authNoPriv"].includes(value));
  },
});
