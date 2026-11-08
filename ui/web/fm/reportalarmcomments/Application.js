// fm.reportalarmcomments application
//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.reportalarmcomments.Application");

Ext.define("NOC.fm.reportalarmcomments.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ReportControl",
    "NOC.sa.administrativedomain.TreeCombo",
    "NOC.core.tagfield.Tagfield",
  ],

  items: {
    xtype: "report.control",
    url: "/fm/reportalarmcomments",
    controls: [
      // {
      //     name: "source",
      //     xtype: "segmentedbutton",
      //     allowBlank: false,
      //     width: 300,
      //     items: [
      //         {text: t("Active Alarms"), value: 'active', pressed: true},
      //         {text: t("Archived Alarms"), value: 'archive'},
      //         {text: t("Both"), value: 'both'}
      //     ]
      // },
      {
        name: "source",
        xtype: "radiogroup",
        columns: 4,
        vertical: false,
        fieldLabel: t("label-alarms-source"),
        allowBlank: false,
        width: 600,
        items: [
          {boxLabel: t("label-both"), inputValue: "both", checked: true}],
        // {boxLabel: t("Long Alarm Archive (more 3 months)"), inputValue: 'long_archive'}]
      },
      {
        name: "from_date",
        xtype: "datefield",
        startDay: 1,
        fieldLabel: t("btn-from"),
        allowBlank: false,
        format: "d.m.Y",
        submitFormat: "d.m.Y",
      },
      {
        name: "to_date",
        xtype: "datefield",
        startDay: 1,
        fieldLabel: t("btn-to"),
        allowBlank: false,
        format: "d.m.Y",
        submitFormat: "d.m.Y",
      },
      {
        name: "administrative_domain",
        xtype: "sa.administrativedomain.TreeCombo",
        fieldLabel: t("label-by-adm-domain-2"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 500,
        allowBlank: true,
      },
      {
        name: "enable_autowidth",
        xtype: "checkboxfield",
        boxLabel: t("label-enable-excel-column-autowidth"),
        allowBlank: false,
      },
    ],
    storeData: [
      ["alarm_class", t("app-title-alarmclass"), true],
      ["id", t("header-id"), false],
      ["alarm_from_ts", t("btn-from"), true],
      ["alarm_to_ts", t("btn-to"), true],
      ["alarm_tt", t("msg-alarm-tt"), true],
      ["object_name", t("label-object-name"), true],
      ["object_address", t("header-ip"), true],
      ["object_admdomain", t("header-administrative-domain-d113be"), true],
      ["log_timestamp", t("msg-comment-time"), true],
      ["log_source", t("msg-comment-source"), true],
      ["log_message", t("msg-comment-message"), true],
      // ["escalation_ts", t("Escalation Time"), true],
    ],
  },
});
