//---------------------------------------------------------------------
// inv.reportmetrics application
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.reportmetrics.Application");

Ext.define("NOC.inv.reportmetrics.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ReportControl",
    "NOC.inv.networksegment.TreeCombo",
    "NOC.inv.interfaceprofile.LookupField",
    "NOC.inv.resourcegroup.TreeCombo",
    "NOC.sa.administrativedomain.TreeCombo",
  ],
  interfaceData: [
    ["id", t("header-id"), false],
    ["object_name", t("label-object-name"), true],
    ["object_address", t("header-ip"), true],
    ["object_platform", t("msg-object-platform"), true],
    ["object_adm_domain", t("msg-object-administrative-domain"), true],
    ["object_segment", t("msg-object-segment"), false],
    ["object_container", t("msg-object-geo-address"), false],
    ["iface_name", t("msg-interface-name"), true],
    ["iface_description", t("msg-interface-description"), true],
    ["iface_speed", t("msg-interface-speed"), false],
    ["load_in_perc", t("msg-load-in-90-percentile"), false],
    ["load_in_avg", t("msg-load-in-average"), true],
    ["load_in_p", t("msg-load-in-bandwith"), false],
    ["load_out_perc", t("msg-load-out-90-percentile"), false],
    ["load_out_avg", t("msg-load-out-average"), true],
    ["load_out_p", t("msg-load-out-bandwith"), false],
    ["octets_in_sum", t("msg-traffic-in-sum-by-period-in-mb"), false],
    ["octets_out_sum", t("msg-traffic-out-sum-by-period-in-mb"), false],
    ["errors_in", t("msg-errors-in-packets-s"), true],
    ["errors_out", t("msg-errors-out-packets-s"), true],
    ["errors_in_sum", t("msg-errors-in-summary"), false],
    ["errors_out_sum", t("msg-errors-out-summary"), false],
    ["discards_in", t("msg-discards-in-packets-s"), false],
    ["discards_out", t("msg-discards-out-packets-s"), false],
    ["interface_flap", t("msg-interface-flap-count"), false],
    ["interface_load_url", t("msg-interface-load-url"), false],
    ["lastchange", t("msg-interface-last-change-days"), false],
    ["status_oper_last", t("msg-operational-status-last"), false],
    ["mac_counter", t("msg-mac-counter"), false],
  ],
  objectData: [
    ["id", t("header-id"), false],
    ["object_name", t("label-object-name"), true],
    ["object_address", t("header-ip"), true],
    ["object_platform", t("msg-object-platform"), true],
    ["object_adm_domain", t("msg-object-administrative-domain"), true],
    ["object_segment", t("msg-object-segment"), false],
    ["object_container", t("msg-object-geo-address"), false],
    ["slot", t("msg-slot"), false],
    ["cpu_usage", t("msg-cpu-usage"), true],
    ["memory_usage", t("msg-memory-usage"), true],
  ],
  availabilityData: [
    ["id", t("header-id"), false],
    ["object_name", t("label-object-name"), true],
    ["object_address", t("header-ip"), true],
    ["object_platform", t("msg-object-platform"), true],
    ["object_adm_domain", t("msg-object-administrative-domain"), true],
    ["object_segment", t("msg-object-segment"), false],
    ["object_container", t("msg-object-geo-address"), false],
    ["ping_rtt", t("msg-ping-rtt"), true],
    ["ping_attempts", t("msg-ping-attempts"), true],
  ],
  otherData: [
    ["id", t("header-id"), false],
    ["object_name", t("msg-other-data"), true],
  ],
  
  viewModel: {
    data: {
      reporttype: {reporttype: "load_interfaces"},
    },
    formulas: {
      gridData: {
        bind: "{reporttype}",
        get: function(reporttype){
          var me = this.getView(),
            reporttypeValue = reporttype && reporttype.reporttype ? reporttype.reporttype : "load_interfaces";
          switch(reporttypeValue){
            case "load_interfaces":
              return me.interfaceData;
            case "load_cpu":
              return me.objectData;
            case "ping":
              return me.availabilityData;
            default:
              return me.otherData;
          }
        },
      },
      gridDataType: {
        bind: "{reporttype}",
        get: function(reporttype){
          return reporttype || "load_interfaces";
        },
      },
    },
  },

  defaultListenerScope: true,
  
  listeners: {
    afterrender: function(){
      var vm = this.getViewModel();
      vm.bind("{gridData}", this.onGridDataChange, this);
      // var grid = this.down("[xtype=grid]");
      // if(grid){
      //   var store = Ext.create("Ext.data.Store", {
      //     fields: ["id", "label", {
      //       name: "is_active",
      //       type: "boolean",
      //     }],
      //     proxy: {
      //       url: "/inv/reportmetrics/fields/",
      //       type: "rest",
      //       pageParam: "__page",
      //       startParam: "__start",
      //       limitParam: "__limit",
      //       sortParam: "__sort",
      //       extraParams: {
      //         "__format": "ext",
      //         "reporttype": vm.get("reporttype").reporttype,
      //       },
      //       reader: {
      //         type: "json",
      //         rootProperty: "data",
      //         totalProperty: "total",
      //         successProperty: "success",
      //       },
      //     },
      //   });
      //   grid.setStore(store);
      //   vm.bind("{reporttype}", function(reporttype){
      //     var reporttypeValue = reporttype && reporttype.reporttype ? reporttype.reporttype : "load_interfaces";
      //     grid.getStore().load({
      //       params: {
      //         reporttype: reporttypeValue,
      //       },
      //       callback: function(records, operation, success){
      //         if(!success){
      //           NOC.error(t("Failed to load data"));
      //         }
      //       },
      //     });
      //   }, this);
      // }
    },
  },

  onGridDataChange: function(data){
    var grid = this.down("[xtype=grid]");
    if(grid && data){
      grid.getStore().loadData(data);
    }
  },

  // listeners: {
  //   afterrender: function(){
  //     var vm = this.getViewModel();
  //     vm.bind("{gridDataType}", this.onGridDataChange, this);
  //   },
  // },

  // onGridDataChange: function(reporttype){
  //   var grid = this.down("[xtype=grid]");
  //   if(grid && reporttype){
  //     grid.getStore().load({
  //       params: {
  //         reporttype: reporttype,
  //       },
  //       callback: function(records, operation, success){
  //         if(!success){
  //           NOC.error(t("Failed to load data"));
  //         }
  //       },
  //     });
  //   }
  // },

  items: {
    xtype: "report.control",
    url: "/inv/reportmetrics",
    controls: [
      {
        name: "reporttype",
        xtype: "radiogroup",
        columns: 4,
        vertical: false,
        fieldLabel: t("label-metric-source"),
        allowBlank: false,
        margin: 0,
        defaults: {
          padding: "0 5",
        },
        items: [
          {boxLabel: "Interfaces", name: "reporttype", inputValue: "load_interfaces"},
          {boxLabel: "Objects", name: "reporttype", inputValue: "load_cpu"},
          {boxLabel: "Ping", name: "reporttype", inputValue: "ping"},
        ],
        bind: {
          value: "{reporttype}",
        },
      },
      {
        name: "from_date",
        xtype: "datefield",
        startDay: 1,
        fieldLabel: t("btn-from"),
        allowBlank: false,
        format: "d.m.Y",
        margin: 0,
      },
      {
        name: "to_date",
        xtype: "datefield",
        startDay: 1,
        fieldLabel: t("btn-to"),
        allowBlank: false,
        format: "d.m.Y",
        margin: 0,
      },
      {
        name: "segment",
        xtype: "inv.networksegment.TreeCombo",
        fieldLabel: t("header-segment-44986c"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 691,
      },
      {
        name: "administrative_domain",
        xtype: "sa.administrativedomain.TreeCombo",
        fieldLabel: t("label-by-adm-domain-2"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 691,
        allowBlank: true,
      },
      {
        name: "resource_group",
        xtype: "inv.resourcegroup.TreeCombo",
        fieldLabel: t("label-by-resource-group-selector"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 691,
        allowBlank: true,
      },
      {
        name: "interface_profile",
        xtype: "inv.interfaceprofile.LookupField",
        fieldLabel: t("label-by-interface-profile"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 680,
        allowBlank: true,
      },
      {
        name: "exclude_zero",
        xtype: "checkboxfield",
        boxLabel: t("label-filter-interface-has-zero-load"),
        allowBlank: false,
        defaultValue: false,
      },
      {
        name: "use_aggregated_source",
        xtype: "checkboxfield",
        boxLabel: t("label-use-aggregated-datasource"),
        allowBlank: false,
        defaultValue: false,
      },
    ],
  },
});
