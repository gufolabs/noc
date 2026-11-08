//---------------------------------------------------------------------
// main.prefixtable application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.regexplabel.Application");

Ext.define("NOC.main.regexplabel.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.main.regexplabel.Model",
  ],
  model: "NOC.main.regexplabel.Model",
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
      name: "regexp",
      xtype: "textfield",
      fieldLabel: t("header-regex"),
      allowBlank: false,
    },
    {
      name: "flag_multiline",
      xtype: "checkbox",
      boxLabel: t("header-multiline"),
      allowBlank: true,
    },
    {
      name: "flag_dotall",
      xtype: "checkbox",
      boxLabel: t("header-dotall"),
      allowBlank: true,
    },
    {
      name: "labels",
      xtype: "labelfield",
      fieldLabel: t("header-labels"),
      allowBlank: true,
      query: {
        "enable_managedobject": true,
      },
    },
    {
      xtype: "fieldset",
      layout: "vbox",
      title: t("label-enable"),
      defaults: {
        padding: 4,
        labelAlign: "right",
      },
      items: [
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-managedobject-2"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "enable_managedobject_name",
              xtype: "checkbox",
              boxLabel: t("msg-managed-object-name"),
            },
            {
              name: "enable_managedobject_address",
              xtype: "checkbox",
              boxLabel: t("msg-managed-object-address"),
            },
            {
              name: "enable_managedobject_description",
              xtype: "checkbox",
              boxLabel: t("msg-managed-object-description"),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("header-interface"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "enable_interface_name",
              xtype: "checkbox",
              boxLabel: t("msg-interface-name"),
            },
            {
              name: "enable_interface_description",
              xtype: "checkbox",
              boxLabel: t("msg-interface-description"),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-sensor"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "enable_sensor_local_id",
              xtype: "checkbox",
              boxLabel: t("msg-sensor-local-id"),
            },
          ],
        },
      ]},
  ],
});
