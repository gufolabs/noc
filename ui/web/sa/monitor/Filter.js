//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.monitor.Filter");
Ext.define("NOC.sa.monitor.Filter", {
  extend: "NOC.core.filter.Filter",
  alias: "widget.monitor.Filter",
  controller: "monitor.filter",
  requires: [
    "NOC.core.filter.Filter",
    "NOC.sa.monitor.FilterController",
  ],
  initComponent: function(){
    Ext.apply(this, {
      items: [
        {
          xtype: "container",
          layout: "hbox",
          items: [
            {
              xtype: "button",
              toggleGroup: "status",
              text: t("msg-suspend-2"),
              value: "s",
              reference: "sbtn",
              handler: "setFilter",
            },
            {
              xtype: "button",
              toggleGroup: "status",
              text: t("btn-wait"),
              value: "W",
              reference: "wbtn",
              handler: "setFilter",
            },
            {
              xtype: "button",
              toggleGroup: "status",
              text: t("btn-run"),
              value: "R",
              reference: "rbtn",
              handler: "setFilter",
            },
            {
              xtype: "button",
              toggleGroup: "status",
              text: t("msg-disabled"),
              value: "D",
              reference: "dbtn",
              handler: "setFilter",
            },
          ],
        },
        {
          xtype: "numberfield",
          itemId: "ldur",
          isLookupField: true,
          fieldLabel: t("label-min-duration-2"),
          minValue: 0,
          triggers: {
            clear: {
              cls: "x-form-clear-trigger",
              handler: "cleanFilter",
            },
          },
          listeners: {
            change: "setFilter",
          },
        },
      ].concat(this.items),
    });
    this.callParent(arguments);
  },
});
