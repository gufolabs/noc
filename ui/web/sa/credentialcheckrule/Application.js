//---------------------------------------------------------------------
// sa.credentialcheckrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2023 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.credentialcheckrule.Application");

Ext.define("NOC.sa.credentialcheckrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.PasswordField",
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.sa.credentialcheckrule.Model",
    "Ext.ux.form.GridField",
    "NOC.sa.authprofile.LookupField",
  ],
  model: "NOC.sa.credentialcheckrule.Model",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 200,
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
      renderer: NOC.render.Bool,
      width: 40,
      align: "left",
    },
    {
      text: t("header-pref-2"),
      // tooltip: "Preference", - broken in ExtJS 5.1
      dataIndex: "preference",
      width: 40,
      align: "right",
    },
    {
      text: t("header-match-expression"),
      dataIndex: "match_expression",
      width: 400,
      renderer: function(v){
        var labels = [], text;
        Ext.each(v, function(label){
          labels.push(NOC.render.Label({
            badges: label.badges,
            name: label.name,
            description: label.description || "",
            bg_color1: label.bg_color1 || 0,
            fg_color1: label.fg_color1 || 0,
            bg_color2: label.bg_color2 || 0,
            fg_color2: label.fg_color2 || 0,
          }));
        });
        text = labels.join("");
        return '<span data-qtitle="Match Expression" ' +
                    'data-qtip="' + text + '">' + text + "</span>";
      },
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      width: 200,
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
      name: "is_active",
      xtype: "checkbox",
      boxLabel: t("header-active"),
    },
    {
      name: "preference",
      xtype: "numberfield",
      fieldLabel: t("label-preference"),
      allowBlank: true,
      uiStyle: "small",
    },
    {
      name: "suggest_snmp",
      fieldLabel: t("label-suggest-snmp"),
      xtype: "gridfield",
      allowBlank: true,
      columns: [
        {
          text: t("header-snmp-ro"),
          dataIndex: "snmp_ro",
          width: 200,
          editor: "textfield",
        },
        {
          text: t("header-snmp-rw"),
          dataIndex: "snmp_rw",
          editor: "textfield",
          flex: 200,
        },
      ],
    },
    {
      name: "suggest_credential",
      fieldLabel: t("label-suggest-cli"),
      xtype: "gridfield",
      allowBlank: true,
      columns: [
        {
          text: t("header-user"),
          dataIndex: "user",
          width: 200,
          editor: "textfield",
        },
        {
          text: t("label-password"),
          dataIndex: "password",
          width: 200,
          editor: "textfield",
        },
        {
          text: t("label-super-password"),
          dataIndex: "super_password",
          flex: 200,
          editor: "textfield",
        },
      ],
    },
    {
      name: "suggest_auth_profile",
      fieldLabel: t("label-suggest-auth-profile"),
      xtype: "gridfield",
      allowBlank: true,
      columns: [
        {
          text: t("app-title-authprofile"),
          dataIndex: "auth_profile",
          width: 200,
          editor: {
            xtype: "sa.authprofile.LookupField",
          },
          renderer: NOC.render.Lookup("auth_profile"),
        },
      ],
    },
    {
      name: "suggest_protocols",
      xtype: "gridfield",
      fieldLabel: t("label-topology-methods"),
      columns: [
        {
          text: t("header-protocol"),
          dataIndex: "protocol",
          width: 100,
          sortable: false,
          editor: {
            xtype: "combobox",
            store: [
              ["TELNET", "TELNET"],
              ["SSH", "SSH"],
              ["HTTP", "HTTP"],
              ["HTTPS", "HTTPS"],
              ["SNMPv1", "SNMPv1"],
              ["SNMPv2c", "SNMPv2c"],

            ],
          },
        },
      ],
    },
    {
      name: "suggest_snmp_oids",
      xtype: "gridfield",
      fieldLabel: t("label-suggest-snmp-oids"),
      columns: [
        {
          text: t("header-oid-2"),
          dataIndex: "oid",
          width: 300,
          sortable: false,
          editor: {
            xtype: "textfield",
          },
        },
      ],
    },
    {
      name: "match",
      xtype: "listform",
      fieldLabel: t("label-match-rules"),
      rows: 2,
      items: [
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("label-match-labels"),
          allowBlank: true,
          isTree: true,
          filterProtected: false,
          pickerPosition: "down",
          uiStyle: "extra",
          query: {
            "allow_matched": true,
          },
        },
        {
          name: "exclude_labels",
          xtype: "labelfield",
          fieldLabel: t("label-exclude-match-labels"),
          allowBlank: true,
          isTree: true,
          filterProtected: false,
          pickerPosition: "down",
          uiStyle: "extra",
          query: {
            "allow_matched": true,
          },
        },
      ],
    },
  ],
  filters: [
    {
      title: t("app-title-by-match-rules-labels"),
      name: "match",
      ftype: "label",
      lookup: "main.handler.LookupField",
      pickerPosition: "left",
      isTree: true,
      filterProtected: false,
      treePickerWidth: 400,
      query_filter: {
        "allow_matched": true,
      },
    },
    {
      title: t("app-title-by-object"),
      name: "managed_object",
      ftype: "lookup",
      lookup: "sa.managedobject",
    },
  ],
});
