//---------------------------------------------------------------------
// main.prefixtable application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.prefixtable.Application");

Ext.define("NOC.main.prefixtable.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.prefixtable.Model",
    "Ext.ux.form.GridField",
    "NOC.core.label.LabelField",
  ],
  model: "NOC.main.prefixtable.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
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
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
    {
      name: "match_labels",
      xtype: "gridfield",
      fieldLabel: t("label-match-labels"),
      disabled: true,
      columns: [
        {
          text: t("header-labels"),
          dataIndex: "labels",
          renderer: NOC.render.LabelField,
          editor: {
            xtype: "labelfield",
          },
          width: 200,
        },
        {
          dataIndex: "scope",
          text: t("header-scope"),
          editor: "textfield",
          width: 150,
        },
      ],
    },
  ],
  inlines: [{
    title: t("header-prefixes"),
    model: "NOC.main.prefixtable.PrefixModel",
    columns: [
      {
        text: t("header-prefix"),
        dataIndex: "prefix",
        flex: 1,
        editor: "textfield",
      },
    ],
  }],
  actions: [
    {
      title: t("app-title-test-selected-prefix-tables"),
      action: "test",
      resultTemplate: new Ext.XTemplate('<b>IP:</b> {ip}\n<table border="1">\n    <tr><th>Prefix Table</th><th>Result</th></tr>\n    <tpl foreach="result">\n    <tr><td>{name}</td><td><tpl if="result">+<tpl else>-</tpl></td></tr>\n    </tpl>\n</table>'),
      form: [
        {
          name: "ip",
          xtype: "textfield",
          fieldLabel: t("header-ip"),
          allowBlank: false,
        },
      ],
    },
  ],
});
