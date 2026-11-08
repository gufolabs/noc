//---------------------------------------------------------------------
// ip.vrfgroup application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.vrfgroup.Application");

Ext.define("NOC.ip.vrfgroup.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.ip.vrfgroup.Model",
  ],
  model: "NOC.ip.vrfgroup.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 150,
    },
    {
      text: t("header-constraint"),
      dataIndex: "address_constraint",
      width: 100,
      renderer: function(value){
        if(value == "V")
          return "Unique per VRF";
        else
          return "Unique per Group";
      },
    },
    {
      text: t("header-vrfs"),
      dataIndex: "vrf_count",
      sortable: false,
      width: 50,
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
    {
      text: t("header-tags"),
      dataIndex: "tags",
      renderer: "NOC.render.Tags",
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("label-vrf-group"),
      allowBlank: false,
      uiStyle: "medium",
    },
    {
      name: "address_constraint",
      xtype: "combobox",
      fieldLabel: t("label-address-constraint"),
      allowBlank: false,
      queryMode: "local",
      displayField: "label",
      valueField: "id",
      store: {
        fields: ["id", "label"],
        data: [
          {id: "V", label: "Unique per VRF"},
          {id: "G", label: "Unique per Group"},
        ],
      },
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
    {
      name: "labels",
      xtype: "labelfield",
      fieldLabel: t("header-labels"),
      allowBlank: true,
      query: {
        "enable_vrfgroup": true,
      },
    },
  ],
});
