//---------------------------------------------------------------------
// peer.peerprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.peerprofile.Application");

Ext.define("NOC.peer.peerprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.peer.peerprofile.Model",
    "NOC.wf.workflow.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.peer.peerprofile.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      flex: 1,
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
      labelWidth: 200,
      width: 300,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      allowBlank: false,
      width: 300,
      labelWidth: 200,
      uiStyle: "medium",
    },
    {
      name: "workflow",
      xtype: "wf.workflow.LookupField",
      fieldLabel: t("label-workflow"),
      allowBlank: true,
      labelWidth: 200,
      uiStyle: "medium",
    },
    {
      name: "max_prefixes",
      xtype: "textfield",
      maskRe: /\d/i,
      fieldLabel: t("label-max-prefixes"),
      allowBlank: false,
      labelWidth: 200,
      uiStyle: "medium",
    },
    {
      name: "status_discovery",
      xtype: "combobox",
      fieldLabel: t("label-status-discovery"),
      allowBlank: true,
      labelWidth: 200,
      defaultValue: "d",
      store: [
        ["d", t("msg-disabled")],
        ["e", t("label-enable")],
        ["c", t("btn-clear-alarm-2")],
        ["ca", t("btn-clear-alarm-if-admin-down")],
        ["rc", t("msg-raise-clear-alarm")],
      ],
      uiStyle: "medium",
    },
    {
      name: "status_change_notification",
      xtype: "combobox",
      fieldLabel: t("label-status-change-notification"),
      allowBlank: true,
      labelWidth: 200,
      defaultValue: "d",
      store: [
        ["d", t("msg-disabled")],
        ["c", t("msg-only-changed")],
        ["a", t("msg-all-message")],
      ],
      uiStyle: "medium",
    },
    {
      name: "data",
      xtype: "gridfield",
      fieldLabel: t("label-peer-data"),
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
          editor: "textfield",
        },
        {
          text: t("header-value"),
          dataIndex: "value",
          width: 150,
          editor: "textfield",
        },
      ],
    },
  ],
  filters: [
  ],
});
