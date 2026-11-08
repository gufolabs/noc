//---------------------------------------------------------------------
// fm.alarm application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarm.view.grids.Sidebar");

Ext.define("NOC.fm.alarm.view.grids.Sidebar", {
  extend: "Ext.form.Panel",
  alias: "widget.fm.alarm.sidebar",
  controller: "fm.alarm.sidebar",
  viewModel: {
    type: "fm.alarm.sidebar",
  },
  requires: [
    "NOC.core.combotree.ComboTree",
    "NOC.core.ComboBox",
    "NOC.core.tagfield.Tagfield",
    "NOC.fm.alarm.view.grids.FavoriteStatusGroup",
    "NOC.fm.alarm.view.grids.SidebarModel",
    "NOC.fm.alarm.view.grids.SidebarController",
    "NOC.fm.alarm.view.grids.ProfileFilter",
    "NOC.fm.alarm.view.grids.DisplayFilter",
    "Ext.ux.form.SearchField",
  ],
  reference: "fm-alarm-filter",
  title: t("app-title-reportfilter"),
  minWidth: 350,
  scrollable: {
    indicators: false,
    x: false,
    y: true,
  },
  suspendLayout: true,
  defaults: {
    xtype: "fieldset",
    margin: 5,
    collapsible: true,
  },
  items: [
    {
      xtype: "button",
      text: t("btn-reset-filter"),
      iconAlign: "right",
      listeners: {
        click: "onResetFilter",
      },
    },
    {
      title: t("header-summary"),
      bind: {hidden: "{isActiveAlarmsSelected}"},
      items: [
        {
          layout: "column",
          border: false,
          items: [
            {xtype: "displayfield", columnWidth: 1, bind: {value: "{summaryTotal}"} },
            {xtype: "displayfield", width: 30, bind: {value: "{total.objects}"} },
            {xtype: "displayfield", columnWidth: 1, bind: {value: "{summaryFiltered}"} },
            {xtype: "displayfield", width: 30, bind: {value: "{total.objectsFiltered}"} },
          ],
        },
        {xtype: "button", text: t("btn-reset"), margin: "0 0 5 0", handler: "onResetStatuses"},
      ],
    },
    {
      title: t("app-title-alarms-type"),
      collapsed: false,
      defaults: {
        xtype: "radiogroup",
        columns: 2,
      },
      items: [
        {
          name: "status",
          bind: {value: "{status}"},
          items: [
            {
              boxLabel: t("header-active"),
              inputValue: "A",
              // ToDo make all tooltip
              // tooltip: t("Show active alarms"),
            },
            {
              boxLabel: t("label-closed"),
              inputValue: "C",
              // tooltip: t("Show archived alarms")
            },
          ],
        },
        {
          xtype: "fieldcontainer",
          layout: "column",
          defaults: {
            xtype: "radiogroup",
            columns: 2,
            labelAlign: "top",
            columnWidth: .5,
          },
          items: [
            {
              fieldLabel: t("msg-root"),
              name: "collapse",
              bind: {value: "{collapse}"},
              items: [
                {
                  boxLabel: t("label-only"),
                  inputValue: 1,
                  // tooltip: t("Show only root causes"),
                },
                {
                  boxLabel: t("choice-all"),
                  inputValue: 0,
                  // tooltip: t("Show all alarms")
                },
              ],
            },
            {
              name: "wait_tt",
              bind: {value: "{wait_tt}"},
              fieldLabel: "TT",
              items: [
                {
                  boxLabel: t("label-wait-tt"),
                  inputValue: 1,
                  // tooltip: t("Show only waiting confirmation"),
                },
                {
                  boxLabel: t("choice-all"),
                  inputValue: 0,
                  // tooltip: t("Show all alarms")
                },
              ],
            },
          ],
        },
        {
          fieldLabel: t("label-maintenance"),
          name: "maintenance",
          bind: {value: "{maintenance}"},
          labelAlign: "top",
          columns: 3,
          items: [
            {
              boxLabel: t("label-hide"),
              // tooltip: t("Hide alarms covered by maintenance"),
              inputValue: "hide",
            },
            {
              boxLabel: t("label-only"),
              // tooltip: t("Show only alarms covered by maintenance"),
              inputValue: "only",
            },
            {
              boxLabel: t("choice-all"),
              // tooltip: t("Show all alarms"),
              inputValue: "show",
            },
          ],
        },
        {
          xtype: "fieldcontainer",
          layout: "column",
          defaults: {
            xtype: "radiogroup",
            columns: 2,
            labelAlign: "top",
            columnWidth: .5,
          },
          items: [
            {
              fieldLabel: t("label-alarm-group"),
              name: "alarm_group",
              bind: {value: "{alarm_group}"},
              items: [
                {
                  boxLabel: t("label-only"),
                  inputValue: "only",
                  // tooltip: t("Show only alarm causes"),
                },
                {
                  boxLabel: t("choice-all"),
                  inputValue: "show",
                  // tooltip: t("Show all alarms")
                },
              ],
            },
            {
              name: "ephemeral",
              bind: {value: "{ephemeral}"},
              fieldLabel: "Ephemeral",
              items: [
                {
                  boxLabel: t("label-show"),
                  inputValue: 1,
                  // tooltip: t("Show only waiting confirmation"),
                },
                {
                  boxLabel: t("label-hide"),
                  inputValue: 0,
                  // tooltip: t("Show all alarms")
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: t("app-title-filters"),
      collapsed: false,
      defaults: {
        labelAlign: "top",
        width: "100%",
      },
      items: [
        {
          xtype: "fm.alarm.fav.status",
          name: "fav_status",
          bind: {
            value: "{activeFilter.fav_status}",
          },
        },
        {
          xtype: "core.combo",
          restUrl: "/sa/managedobject/lookup/",
          fieldLabel: t("header-object"),
          name: "managed_object",
          bind: {
            selection: "{activeFilter.managed_object}",
          },
        },
        {
          xtype: "noc.core.combotree",
          restUrl: "/inv/networksegment/",
          fieldLabel: t("header-segment-44986c"),
          name: "segment",
          bind: {
            selection: "{activeFilter.segment}",
          },
        },
        {
          xtype: "core.tagfield",
          url: "/sa/administrativedomain/lookup/",
          lazyLoadTree: true,
          fieldLabel: t("header-adm-domain"),
          name: "administrative_domain",
          bind: {
            selected: "{activeFilter.administrative_domain}",
          },
        },
        {
          name: "resource_group",
          xtype: "noc.core.combotree",
          restUrl: "/inv/resourcegroup/",
          fieldLabel: t("label-by-resource-group-selector"),
          listWidth: 1,
          listAlign: "left",
          labelAlign: "top",
          allowBlank: true,
          bind: {
            selection: "{activeFilter.resource_group}",
          },
        },
        {
          xtype: "core.tagfield",
          url: "/fm/alarmclass/lookup/",
          fieldLabel: t("header-class"),
          name: "alarm_class",
          bind: {
            selected: "{activeFilter.alarm_class}",
          },
        },
        {
          xtype: "searchfield",
          fieldLabel: t("label-tt"),
          name: "escalation_tt__contains",
          triggers: {
            clear: {
              cls: "x-form-clear-trigger",
              hidden: true,
              handler: function(field){
                field.setValue(null);
                field.fireEvent("select", field);
              },
            },
          },
          listeners: {
            change: function(field, value){
              if(value == null || value === ""){
                this.getTrigger("clear").hide();
                return;
              }
              this.getTrigger("clear").show();
            },
          },
          bind: {value: "{activeFilter.escalation_tt__contains}"},
        },
        {
          xtype: "fieldcontainer",
          fieldLabel: t("label-by-date"),
          layout: "column",
          padding: "5 0 5",
          defaults: {
            xtype: "datefield",
            format: "d.m.Y",
            submitFormat: "Y-m-d\\TH:i:s",
            startDay: 1,
            width: "50%",
            hideLabel: true,
          },
          items: [ // format 2018-11-16T00:00:00
            {
              name: "timestamp__gte",
              bind: {value: "{activeFilter.timestamp__gte}"},
            },
            {
              name: "timestamp__lte",
              bind: {value: "{activeFilter.timestamp__lte}"},
            },
          ],
        },
        {
          xtype: "fm.alarm.filter.profile",
          name: "profile",
          fieldLabel: t("nav-serviceprofile"),
          bind: {value: "{activeFilter.profiles}"},
        },
      ],
    },
    {
      title: t("app-title-display-filters"),
      collapsed: false,
      reference: "fm-alarm-display-filters",
      items: [
        {
          xtype: "fm.alarm.display",
        },
      ],
    },
    {
      title: t("app-title-show-recently-closed"),
      collapsed: true,
      reference: "fm-alarm-recent-switcher",
      items: [
        {
          xtype: "combo",
          queryMode: "local",
          valueField: "value",
          bind: {value: "{recentFilter.cleared_after}"},
          width: "100%",
          editable: false,
          store: {
            fields: ["value", "text"],
            data: [
              {"value": 0, "text": t("label-don-t-show")},
              {"value": 300, "text": t("label-5-min")},
              {"value": 900, "text": t("label-15-min")},
              {"value": 1800, "text": t("label-30-min")},
              {"value": 3600, "text": t("label-60-min")},
              {"value": 10800, "text": t("label-3-h")},
            ],
          },
        },
      ],
    },
  ],
  initComponent: function(){
    var addListeter = function(field){
      field.getPicker().on({
        beforeshow: this.onBeforePickerShow,
      })
    };
    this.callParent();
    this.enableBubble("fmAlarmResetFilter");
    Ext.each(this.query("[xtype=datefield]"), addListeter, this);
  },
  onBeforePickerShow: function(picker){
    picker.setPosition(picker.getRefOwner().getPosition());
  },
  isDirty: function(){
    return false;
  },
});
