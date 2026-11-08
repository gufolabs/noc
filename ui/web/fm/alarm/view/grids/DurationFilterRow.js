//---------------------------------------------------------------------
// fm.alarm application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarm.view.grids.DurationFilterRow");

Ext.define("NOC.fm.alarm.view.grids.DurationFilterRow", {
  extend: "Ext.container.Container",
  alias: "widget.fm.alarm.filter.duration.row",
  controller: "fm.alarm.filter.duration.row",
  requires: [
    "NOC.fm.alarm.view.grids.DurationFilterRowController",
  ],
  viewModel: {
    data: {
      row: {
        duration: null,
        opacity: null,
      },
    },
    stores: {
      durationStore: {
        fields: ["value", "text"],
        data: [
          {"value": 1, "text": t("label-duration-minutes", {count: 1})},
          {"value": 5, "text": t("label-duration-minutes", {count: 5})},
          {"value": 10, "text": t("label-duration-minutes", {count: 10})},
          {"value": 15, "text": t("label-duration-minutes", {count: 15})},
          {"value": 30, "text": t("label-duration-minutes", {count: 30})},
          {"value": 60, "text": t("label-duration-minutes", {count: 60})},
          {"value": 1440, "text": t("label-duration-minutes", {count: 1440})},
        ],
      },
      opacityStore: {
        fields: ["value", "text"],
        data: [
          {"value": 1, "text": "0.3"},
          {"value": 2, "text": "0.5"},
          {"value": 3, "text": "0.7"},
          {"value": 4, "text": "1"},
        ],
      },
    },
  },
  config: {
    value: null,
  },
  twoWayBindable: [
    "value",
  ],
  layout: "hbox",
  padding: "5 0 5",
  defaults: {
    xtype: "combo",
    queryMode: "local",
    valueField: "value",
    width: 130,
  },
  items: [
    {
      name: "opacity",
      forceSelection: true,
      bind: {
        store: "{opacityStore}",
        value: "{row.opacity}",
      },
      editable: false,
      listeners: {
        select: "onSelect",
      },
    },
  ],
  initComponent: function(){
    if(this.lastRow){
      this.items = [
        {
          xtype: "displayfield",
          width: 137,
          padding: "0 5 0 0",
          value: t("header-other"),
        },
      ].concat(this.items);
    } else{
      this.items = [
        {
          xtype: "displayfield",
          width: 7,
          padding: "0 5 0 0",
          value: "<",
        },
        {
          name: "duration",
          bind: {
            store: "{durationStore}",
            value: "{row.duration}",
          },
          editable: false,
          validator: function(value){
            var num = Number(value.replace(t("label-min"), "").trim());
            return !isNaN(num) && num > 0;
          },
          listeners: {
            select: "onSelect",
          },
        },
      ].concat(this.items);
    }
    this.callParent();
  },
  setValue: function(value, skip){
    // console.log("DurationFilterRow setValue : ", value);
    this.callParent([value]);
    if(!skip){
      // from viewModel
      this.setWidgetValues(value);
    }
  },
  setWidgetValues: function(data){
    // console.log("DurationFilterRow setWidgetValues : ", data);
    if(Ext.Object.isEmpty(data)){
      return;
    }
    this.getViewModel().set("row", data);
    // this.down("[name=opacity]").setValue(data.opacity);
    // if(this.down("[name=duration]")) {
    //     this.down("[name=duration]").setValue(data.duration);
    // }
  },
});