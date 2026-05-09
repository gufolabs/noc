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
    ["id", __("ID"), false],
    ["object_name", __("Object Name"), true],
    ["object_address", __("IP"), true],
    ["object_platform", __("Object Platform"), true],
    ["object_adm_domain", __("Object Administrative domain"), true],
    ["object_segment", __("Object Segment"), false],
    ["object_container", __("Object Geo Address"), false],
    ["iface_name", __("Interface Name"), true],
    ["iface_description", __("Interface Description"), true],
    ["iface_speed", __("Interface Speed"), false],
    ["load_in_perc", __("Load In (90% percentile)"), false],
    ["load_in_avg", __("Load In (Average)"), true],
    ["load_in_p", __("Load In (% Bandwith)"), false],
    ["load_out_perc", __("Load Out (90% percentile)"), false],
    ["load_out_avg", __("Load Out (Average)"), true],
    ["load_out_p", __("Load Out (% Bandwith)"), false],
    ["octets_in_sum", __("Traffic In (Sum by period in MB)"), false],
    ["octets_out_sum", __("Traffic Out (Sum by period in MB)"), false],
    ["errors_in", __("Errors In (packets/s)"), true],
    ["errors_out", __("Errors Out (packets/s)"), true],
    ["errors_in_sum", __("Errors In (Summary)"), false],
    ["errors_out_sum", __("Errors Out (Summary)"), false],
    ["discards_in", __("Discards In (packets/s)"), false],
    ["discards_out", __("Discards Out (packets/s)"), false],
    ["interface_flap", __("Interface Flap count"), false],
    ["interface_load_url", __("Interface Load URL"), false],
    ["lastchange", __("Interface Last Change (days)"), false],
    ["status_oper_last", __("Operational status (Last)"), false],
    ["mac_counter", __("Mac counter"), false],
  ],
  objectData: [
    ["id", __("ID"), false],
    ["object_name", __("Object Name"), true],
    ["object_address", __("IP"), true],
    ["object_platform", __("Object Platform"), true],
    ["object_adm_domain", __("Object Administrative domain"), true],
    ["object_segment", __("Object Segment"), false],
    ["object_container", __("Object Geo Address"), false],
    ["slot", __("Slot"), false],
    ["cpu_usage", __("CPU Usage"), true],
    ["memory_usage", __("Memory Usage"), true],
  ],
  availabilityData: [
    ["id", __("ID"), false],
    ["object_name", __("Object Name"), true],
    ["object_address", __("IP"), true],
    ["object_platform", __("Object Platform"), true],
    ["object_adm_domain", __("Object Administrative domain"), true],
    ["object_segment", __("Object Segment"), false],
    ["object_container", __("Object Geo Address"), false],
    ["ping_rtt", __("Ping RTT"), true],
    ["ping_attempts", __("Ping Attempts"), true],
  ],
  otherData: [
    ["id", __("ID"), false],
    ["object_name", __("Other Data"), true],
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
      //           NOC.error(__("Failed to load data"));
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
  //           NOC.error(__("Failed to load data"));
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
        fieldLabel: __("Metric source"),
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
        fieldLabel: __("From"),
        allowBlank: false,
        format: "d.m.Y",
        margin: 0,
      },
      {
        name: "to_date",
        xtype: "datefield",
        startDay: 1,
        fieldLabel: __("To"),
        allowBlank: false,
        format: "d.m.Y",
        margin: 0,
      },
      {
        name: "segment",
        xtype: "inv.networksegment.TreeCombo",
        fieldLabel: __("Segment"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 691,
      },
      {
        name: "administrative_domain",
        xtype: "sa.administrativedomain.TreeCombo",
        fieldLabel: __("By Adm. domain"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 691,
        allowBlank: true,
      },
      {
        name: "resource_group",
        xtype: "inv.resourcegroup.TreeCombo",
        fieldLabel: __("By Resource Group (Selector)"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 691,
        allowBlank: true,
      },
      {
        name: "interface_profile",
        xtype: "inv.interfaceprofile.LookupField",
        fieldLabel: __("By Interface Profile"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 680,
        allowBlank: true,
      },
      {
        name: "exclude_zero",
        xtype: "checkboxfield",
        boxLabel: __("Filter interface has zero load"),
        allowBlank: false,
        defaultValue: false,
      },
      {
        name: "use_aggregated_source",
        xtype: "checkboxfield",
        boxLabel: __("Use aggregated Datasource"),
        allowBlank: false,
        defaultValue: false,
      },
    ],
  },
});
