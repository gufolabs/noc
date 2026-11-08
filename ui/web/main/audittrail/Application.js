//---------------------------------------------------------------------
// main.audittrail application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.audittrail.Application");

Ext.define("NOC.main.audittrail.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.audittrail.Model",
    "NOC.main.ref.model.LookupField",
    "NOC.aaa.user.LookupField",
  ],
  model: "NOC.main.audittrail.Model",
  search: true,
  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-timestamp"),
          dataIndex: "timestamp",
          width: 160,
        },
        {
          text: t("header-user"),
          dataIndex: "user",
          width: 100,
        },
        {
          text: t("header-model"),
          dataIndex: "model_id",
          width: 150,
        },
        {
          text: t("header-object"),
          dataIndex: "object_name",
          width: 250,
        },
        {
          text: t("btn-operation"),
          dataIndex: "op",
          flex: 1,
          renderer: NOC.render.Choices({
            "C": "Create",
            "U": "Update",
            "D": "Delete",
          }),
        },
      ],
      fields: [
        {
          name: "timestamp",
          xtype: "displayfield",
          fieldLabel: t("header-timestamp"),
        },
        {
          name: "user",
          xtype: "displayfield",
          fieldLabel: t("header-user"),
        },
        {
          name: "model_id",
          xtype: "displayfield",
          fieldLabel: t("header-model"),
        },
        {
          name: "object_name",
          xtype: "displayfield",
          fieldLabel: t("header-object"),
        },
        {
          name: "op",
          xtype: "displayfield",
          fieldLabel: t("btn-operation"),
        },
        {
          name: "changes",
          xtype: "displayfield",
          fieldLabel: t("msg-changes"),
          renderer: NOC.render.Table({
            columns: [
              {
                text: t("btn-field"),
                dataIndex: "field",
              },
              {
                text: t("header-old"),
                dataIndex: "old",
              },
              {
                text: t("header-new"),
                dataIndex: "new",
              },
            ],
          }),
        },
      ],
    });
    me.callParent();
    me.saveButton.hide();
  },
  //
  filters: [
    {
      title: t("btn-operation"),
      ftype: "lookup",
      name: "op",
      lookup: "local",
      valuesStore: {
        sorters: "label",
        data: [
          {value: "C", label: t("app-title-create")},
          {value: "M", label: t("msg-modify")},
          {value: "U", label: t("status-update")},
          {value: "D", label: t("btn-delete")},
        ],
      },
      // },{
      //     title: t("By User"),
      //     name: "user",
      //     ftype: "lookup",
      //     lookup: "main.user",
      //     valueName: "label",
      //     addQuery: false
    },
  ],
});
