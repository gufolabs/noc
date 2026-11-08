// fm.reportalarmdetail application
//---------------------------------------------------------------------
// Copyright (C) 2007-2022 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.reportalarmdetail.Application");

Ext.define("NOC.fm.reportalarmdetail.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ReportControl",
    "NOC.inv.networksegment.TreeCombo",
    "NOC.sa.administrativedomain.TreeCombo",
    "NOC.inv.resourcegroup.TreeCombo",
    "NOC.core.tagfield.Tagfield",
  ],

  initComponent: function(){
    var me = this;
    if(me.noc && me.noc.cmd && me.noc.cmd.ids){
      me.items.controls = [
        {
          name: "ids",
          xtype: "displayfield",
          fieldLabel: t("header-alarms"),
          value: me.noc.cmd.ids.join(" "),
        },
      ];
    } else{
      me.items.controls = [
        // {
        //     name: "source",
        //     xtype: "segmentedbutton",
        //     allowBlank: false,
        //     width: 300,
        //     items: [
        //         {text: t("Active Alarms"), value: 'active', pressed: true},
        //         {text: t("Archived Alarms"), value: 'archived'},
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
            {boxLabel: t("label-active-alarms"), inputValue: "active", checked: true},
            {boxLabel: t("label-archived-alarms"), inputValue: "archived"},
            {boxLabel: t("label-both"), inputValue: "both"},
            {boxLabel: t("label-long-alarm-archive-more-3-months"), inputValue: "long_archive"}],
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
          name: "segment",
          xtype: "inv.networksegment.TreeCombo",
          fieldLabel: t("header-segment-44986c"),
          listWidth: 1,
          listAlign: "left",
          labelAlign: "left",
          width: 500,
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
          name: "resource_group",
          xtype: "inv.resourcegroup.TreeCombo",
          fieldLabel: t("label-by-resource-group-selector"),
          listWidth: 1,
          listAlign: "left",
          labelAlign: "left",
          width: 500,
          allowBlank: true,
        },
        {
          name: "ex_resource_group",
          xtype: "inv.resourcegroup.TreeCombo",
          fieldLabel: t("label-exclude-mo-by-resource-group-selector"),
          listWidth: 1,
          listAlign: "left",
          labelAlign: "left",
          width: 500,
          allowBlank: true,
        },
        {
          name: "min_duration",
          xtype: "numberfield",
          fieldLabel: t("label-min-duration"),
          allowBlank: false,
          value: 300,
          uiStyle: "small",
        },
        {
          name: "max_duration",
          xtype: "numberfield",
          fieldLabel: t("label-max-duration"),
          allowBlank: false,
          value: 0,
          uiStyle: "small",
        },
        {
          name: "min_objects",
          xtype: "numberfield",
          fieldLabel: t("label-min-objects"),
          allowBlank: true,
          value: 0,
          uiStyle: "small",
        },
        {
          name: "min_subscribers",
          xtype: "numberfield",
          fieldLabel: t("label-min-subscribers"),
          allowBlank: true,
          value: 0,
          uiStyle: "small",
        },
        {
          name: "enable_autowidth",
          xtype: "checkboxfield",
          boxLabel: t("label-enable-excel-column-autowidth"),
          allowBlank: false,
        },
        {
          name: "subscribers",
          xtype: "core.tagfield",
          url: "/crm/subscriberprofile/lookup/",
          fieldLabel: t("label-subscribers-that-sum"),
          allowBlank: true,
          uiStyle: undefined,
          width: "45%",
        },
      ];
    }
    me.callParent();
  },
  items: {
    xtype: "report.control",
    url: "/fm/reportalarmdetail",
    storeData: [
      ["alarm_id", t("header-id"), true],
      ["root_id", t("msg-root-id"), true],
      ["from_ts", t("btn-from"), true],
      ["to_ts", t("btn-to"), true],
      ["duration_sec", t("header-duration"), true],
      ["object_name", t("label-object-name"), true],
      ["object_address", t("header-ip"), true],
      ["object_hostname", t("header-hostname"), true],
      ["object_profile", t("header-profile"), true],
      ["object_object_profile", t("msg-object-profile"), true],
      ["object_admdomain", t("header-administrative-domain-d113be"), true],
      ["object_platform", t("app-title-platform"), true],
      ["object_version", t("header-version"), true],
      ["object_project", t("label-project"), true],
      ["alarm_class", t("app-title-alarmclass"), true],
      ["alarm_subject", t("msg-alarm-subject"), false],
      ["maintenance", t("label-maintenance"), true],
      ["objects", t("msg-affected-objects"), true],
      ["subscribers", t("msg-affected-subscriber"), true],
      ["tt", t("label-tt"), true],
      ["escalation_ts", t("msg-escalation-time"), true],
      ["location", t("header-location-d219c6"), true],
      ["container_0", t("msg-container-level-1"), false],
      ["container_1", t("msg-container-level-2"), false],
      ["container_2", t("msg-container-level-3"), false],
      ["container_3", t("msg-container-level-4"), false],
      ["container_4", t("msg-container-level-5"), false],
      ["container_5", t("msg-container-level-6"), false],
      ["container_6", t("msg-container-level-7"), false],
      ["segment_0", t("msg-segment-level-1"), false],
      ["segment_1", t("msg-segment-level-2"), false],
      ["segment_2", t("msg-segment-level-3"), false],
      ["segment_3", t("msg-segment-level-4"), false],
      ["segment_4", t("msg-segment-level-5"), false],
      ["segment_5", t("msg-segment-level-6"), false],
      ["segment_6", t("msg-segment-level-7"), false],
    ],
  },
});
