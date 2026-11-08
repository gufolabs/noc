//---------------------------------------------------------------------
// main.timepattern application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.timepattern.Application");

Ext.define("NOC.main.timepattern.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.timepattern.Model",
    "NOC.main.timepattern.TermModel",
  ],
  model: "NOC.main.timepattern.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
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
  ],
  inlines: [
    {
      title: t("nav-timepattern"),
      model: "NOC.main.timepattern.TermModel",
      columns: [
        {
          text: t("header-pattern"),
          dataIndex: "term",
          flex: 1,
          editor: "textfield",
        },
      ],
    },
  ],
  "actions": [
    {
      title: t("app-title-test-selected-patterns"),
      action: "test",
      resultTemplate: new Ext.XTemplate('<b>Date:</b> {ts}\n<table border="1">\n    <tr><th>TimePattern</th><th>Result</th></tr>\n    <tpl foreach="result">\n    <tr><td>{name}</td><td><tpl if="result">+<tpl else>-</tpl></td></tr>\n    </tpl>\n</table>'),
      form: [
        {
          name: "date",
          xtype: "datefield",
          startDay: 1,
          fieldLabel: t("header-date"),
          allowBlank: false,
          format: "Y-m-d",
        },
        {
          name: "time",
          xtype: "timefield",
          fieldLabel: t("header-time"),
          allowBlank: true,
          format: "H:i",
        },
      ],
    },
  ],
});
