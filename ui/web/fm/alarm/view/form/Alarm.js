//---------------------------------------------------------------------
// fm.alarm application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarm.view.form.Alarm");

Ext.define("NOC.fm.alarm.view.form.Alarm", {
  extend: "Ext.panel.Panel",
  alias: "widget.fm.alarm.form",
  controller: "fm.alarm.form",
  viewModel: {
    type: "fm.alarm.form",
  },
  requires: [
    "NOC.fm.alarm.view.form.AlarmModel",
    "NOC.fm.alarm.view.form.AlarmController",
    "Ext.ux.grid.RowStyle",
  ],
  layout: "border",
  reference: "fm-alarm-form",
  items: [
    {
      xtype: "panel",
      region: "north",
      resizable: true,
      layout: "fit",
      hideCollapseTool: true,
      hideHeaders: true,
      split: true,
      items: [
        {
          xtype: "displayfield",
          bind: {
            value: "{header}",
          },
        },
      ],
    },
    {
      xtype: "tabpanel",
      reference: "fm-alarm-form-tab-panel",
      region: "center",
      items: [
        {
          xtype: "container",
          title: t("app-title-reportoverview"),
          scrollable: true,
          bind: {
            html: "{overviewPanel}",
          },
        },
        {
          xtype: "container",
          title: t("app-title-help"),
          scrollable: true,
          bind: {
            html: "{helpPanel}",
            disabled: "{!selected.symptoms}",
          },
        },
        {
          xtype: "container",
          title: t("app-title-data"),
          scrollable: true,
          bind: {
            html: "{dataPanel}",
            disabled: "{!hasVars}",
          },
        },
        {
          xtype: "grid",
          reference: "fm-alarm-log",
          title: t("header-log"),
          scrollable: true,
          bind: {
            store: "{selectedLog}",
          },
          columns: [
            {
              dataIndex: "timestamp",
              text: t("header-time"),
              renderer: NOC.render.DateTime,
              width: 120,
            },
            {
              dataIndex: "from_status",
              text: t("btn-from"),
              renderer: "onRenderStatus",
              width: 50,
            },
            {
              dataIndex: "to_status",
              text: t("btn-to"),
              renderer: "onRenderStatus",
              width: 50,
            },
            {
              dataIndex: "message",
              text: t("btn-message"),
              flex: 1,
            },
          ],
          dockedItems: [
            {
              xtype: "toolbar",
              dock: "bottom",
              items: [
                {
                  xtype: "textfield",
                  fieldLabel: t("label-new-message"),
                  labelStyle: "white-space: nowrap;",
                  labelPad: 10,
                  fieldStyle: "margin: 0 4px;",
                  labelAlign: "right",
                  width: "100%",
                  listeners: {
                    specialkey: {
                      fn: "onMessageKey",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          xtype: "grid",
          reference: "fm-alarm-events",
          title: t("app-title-event"),
          scrollable: true,
          bind: {
            store: "{selectedEvents}",
          },
          columns: [
            {
              dataIndex: "id",
              text: t("header-id"),
              width: 150,
            },
            {
              dataIndex: "timestamp",
              text: t("header-time"),
              renderer: NOC.render.DateTime,
              width: 120,
            },
            {
              dataIndex: "event_class",
              text: t("header-class"),
              renderer: NOC.render.Lookup("event_class"),
              width: 200,
            },
            {
              dataIndex: "subject",
              text: t("header-subject"),
              flex: 1,
            },
          ],
        },
        {
          xtype: "treepanel",
          title: t("header-alarms"),
          bind: {
            store: "{selectedAlarms}",
            disabled: "{!hasAlarms}",
          },
          rootVisible: false,
          useArrows: true,
          columns: [
            {
              xtype: "treecolumn",
              dataIndex: "id",
              text: t("header-id"),
              width: 200,
            },
            {
              dataIndex: "timestamp",
              text: t("header-time"),
              width: 120,
              renderer: NOC.render.DateTime,
            },
            {
              dataIndex: "managed_object",
              text: t("header-managed-object-62561c"),
              width: 200,
              renderer: NOC.render.Lookup("managed_object"),
            },
            {
              dataIndex: "alarm_class",
              text: t("header-class"),
              renderer: NOC.render.Lookup("alarm_class"),
            },
            {
              dataIndex: "subject",
              text: t("header-subject"),
              flex: 1,
            },
          ],
          listeners: {
            itemdblclick: "onRowDblClickTreePanel",
          },
          plugins: ["rowstyle"],
        },
        {
          xtype: "grid",
          reference: "fm-alarm-groups",
          title: t("app-title-group"),
          scrollable: true,
          bind: {
            store: "{selectedGroups}",
          },
          columns: [
            {
              dataIndex: "id",
              text: t("header-id"),
              width: 150,
            },
            {
              dataIndex: "timestamp",
              text: t("header-time"),
              renderer: NOC.render.DateTime,
              width: 120,
            },
            {
              dataIndex: "alarm_class",
              text: t("header-class"),
              renderer: NOC.render.Lookup("alarm_class"),
              width: 200,
            },
            {
              dataIndex: "subject",
              text: t("header-subject"),
              flex: 1,
            },
          ],
        },
      ],
    },
  ],
  tbar: [
    {
      text: t("btn-close"),
      tooltip: t("help-close-without-saving"),
      glyph: NOC.glyph.arrow_left,
      handler: "onClose",
    },
    {
      glyph: NOC.glyph.refresh,
      handler: "onRefreshForm",
    },
    "-",
    {
      text: t("btn-escalate"),
      glyph: NOC.glyph.ambulance,
      tooltip: t("btn-escalate"),
      bind: {
        disabled: "{isClosed}",
      },
      handler: "onEscalateObject",
    },
    {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      handler: "onShowCard",
    },
    {
      itemId: "showMapBtn",
      xtype: "splitbutton",
      text: t("btn-show-map"),
      glyph: NOC.glyph.globe,
      menu: [ // Dynamically add items, in showMapHandler from Controller
      ],
    },
    {
      text: t("btn-show-object"),
      glyph: NOC.glyph.pencil,
      handler: "onShowObject",
    },
    "-",
    {
      text: t("btn-clear"),
      glyph: NOC.glyph.eraser,
      handler: "onClear",
      bind: {
        disabled: "{isNotActive}",
      },
    },
    {
      enableToggle: true,
      glyph: NOC.glyph.star,
      bind: {
        text: "{favoriteText}",
        pressed: "{isFavorite}",
        disabled: "{isNotActive}",
        iconCls: "{favIconCls}",
      },
      handler: "onAddRemoveFav",
    },
    {
      text: t("btn-watch"),
      enableToggle: true,
      bind: {
        pressed: "{isSubscribe}",
        disabled: "{isNotActive}",
      },
      glyph: NOC.glyph.eye,
      handler: "onWatch",
    },
    {
      text: t("btn-set-root"),
      glyph: NOC.glyph.paperclip,
      handler: "onSetRoot",
      bind: {
        disabled: "{isNotActive}",
      },
    },
    {
      enableToggle: true,
      bind: {
        pressed: "{isAcknowledge}",
        disabled: "{isAcknowledgeDisabled}",
        text: "{acknowledgeText}",
      },
      handler: "onAcknowledge",
    },
    "->",
    {
      xtype: "displayfield",
      fieldLabel: t("header-id"),
      labelWidth: 20,
      labelClsExtra: "noc-label-required",
      bind: {
        value: "{selected.id}",
      },
    },
  ],
});
