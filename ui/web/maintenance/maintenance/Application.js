//---------------------------------------------------------------------
// maintenance.maintenance application
//---------------------------------------------------------------------
// Copyright (C) 2007-2022 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.maintenance.maintenance.Application");

Ext.define("NOC.maintenance.maintenance.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.maintenance.maintenance.Model",
    "NOC.maintenance.maintenance.ObjectsPanel",
    "NOC.maintenance.maintenancetype.LookupField",
    "NOC.sa.managedobject.LookupField",
    "NOC.sa.service.LookupField",
    "NOC.inv.networksegment.ComboTree",
    "NOC.main.timepattern.LookupField",
    "NOC.main.template.LookupField",
    "NOC.maintenance.maintenance.DirectObjectsModel",
    "NOC.maintenance.maintenance.DirectSegmentsModel",
    "NOC.maintenance.maintenance.DirectServicesModel",
    "NOC.core.filter.Filter",
  ],
  model: "NOC.maintenance.maintenance.Model",
  search: true,
  initComponent: function(){
    var me = this;

    me.ITEM_OBJECTS = me.registerItem(
      "NOC.maintenance.maintenance.ObjectsPanel",
    );

    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    me.affectedButton = Ext.create("Ext.button.Button", {
      text: t("msg-affected-objects"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onObjects,
    });

    Ext.apply(me, {
      columns: [
        {
          text: t("header-type"),
          dataIndex: "type",
          width: 150,
          renderer: NOC.render.Lookup("type"),
        },
        {
          text: t("header-start"),
          dataIndex: "start",
          width: 120,
        },
        {
          text: t("header-stop"),
          dataIndex: "stop",
          width: 120,
        },
        {
          text: t("msg-completed"),
          dataIndex: "is_completed",
          width: 25,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-auto-confirm"),
          dataIndex: "auto_confirm",
          width: 25,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-time-pattern"),
          dataIndex: "time_pattern",
          width: 150,
          renderer: NOC.render.Lookup("time_pattern"),
        },
        {
          text: t("label-tt"),
          dataIndex: "escalation_tt",
          width: 150,
          sortable: false,
          renderer: function(v, _, record){
            var r = [],
              tt = record.get("escalation_tt") || false,
              ee = record.get("escalation_error") || false;
            if(tt){
              r.push('<a href="/api/card/view/tt/' + tt + '/" target="_blank">' + tt + "</a>");
            } else{
              if(ee){
                r.push('<i class="fa fa-exclamation-triangle"></i> Error')
              }
            }
            return r;
          },
        },
        {
          text: t("header-subject"),
          dataIndex: "subject",
          flex: 1,
        },
      ],
      fields: [
        {
          name: "subject",
          xtype: "textfield",
          fieldLabel: t("header-subject"),
          allowBlank: false,
        },
        {
          name: "type",
          xtype: "maintenance.maintenancetype.LookupField",
          fieldLabel: t("header-type"),
          allowBlank: false,
        },
        {
          xtype: "container",
          layout: "hbox",
          items: [
            {
              name: "start_date",
              xtype: "datefield",
              startDay: 1,
              fieldLabel: t("header-start"),
              allowBlank: false,
              format: "d.m.Y",
            },
            {
              name: "start_time",
              xtype: "timefield",
              allowBlank: false,
              labelWidth: 0,
              format: "H:i",
            },
          ],
        },
        {
          xtype: "container",
          layout: "hbox",
          items: [
            {
              name: "stop_date",
              xtype: "datefield",
              startDay: 1,
              fieldLabel: t("header-stop"),
              allowBlank: false,
              format: "d.m.Y",
            },
            {
              name: "stop_time",
              xtype: "timefield",
              allowBlank: false,
              labelWidth: 0,
              format: "H:i",
            },
          ],
        },
        {
          name: "is_completed",
          xtype: "checkbox",
          boxLabel: t("msg-completed"),
        },
        {
          name: "auto_confirm",
          xtype: "checkbox",
          boxLabel: t("header-auto-confirm"),
        },
        {
          name: "template",
          xtype: "main.template.LookupField",
          fieldLabel: t("header-close-template"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "contacts",
          xtype: "textarea",
          fieldLabel: t("header-contacts"),
          allowBlank: false,
        },
        {
          name: "time_pattern",
          xtype: "main.timepattern.LookupField",
          fieldLabel: t("header-time-pattern"),
          allowBlank: true,
        },
        {
          name: "suppress_alarms",
          xtype: "checkbox",
          boxLabel: t("label-suppress-alarms"),
        },
        {
          name: "escalation_policy",
          xtype: "combobox",
          fieldLabel: t("label-escalation-policy"),
          allowBlank: true,
          store: [
            ["E", t("label-enable")],
            ["D", t("status-disable")],
            ["S", t("msg-suspend-2")],
            ["M", t("label-maintenance")],
          ],
          uiStyle: "medium",
          listeners: {
            change: function(field, value){
              this.nextSibling().setDisabled(value !== "M");
            },
          },
        },
        {
          name: "escalate_managed_object",
          xtype: "sa.managedobject.LookupField",
          fieldLabel: t("label-escalate-to"),
          allowBlank: true,
          disabled: true,
        },
      ],
      gridToolbar: [
        {
          xtype: "combo",
          fieldLabel: t("header-status"),
          store: [
            ["false", t("header-active")],
            ["true", t("msg-completed")],
          ],
          triggerAction: "all",
          editable: false,
          queryMode: "local",
          // ToDo need check
          hasAccess: function(app){
            return app.search === true;
          },
          triggers: {
            clear: {
              cls: "x-form-clear-trigger",
              hidden: true,
              weight: -1,
              handler: function(field){
                field.setValue(null);
                field.fireEvent("select", field);
              },
            },
          },
          listeners: {
            scope: me,
            select: function(field){
              var me = this,
                value = field.getValue();
              if(value){
                me.currentQuery.is_completed = value;
              } else{
                delete me.currentQuery.is_completed;
              }
              me.reloadStore();
            },
            change: function(field, value){
              if(value == null || value === ""){
                field.getTrigger("clear").hide();
                return;
              }
              field.getTrigger("clear").show();
            },
          },
        },
      ],
      formToolbar: [
        me.cardButton,
        me.affectedButton,
      ],
    });
    me.callParent();
  },
  inlines: [
    {
      title: t("header-objects-72a83a"),
      collapsed: false,
      model: "NOC.maintenance.maintenance.DirectObjectsModel",
      columns: [
        {
          text: t("header-object"),
          dataIndex: "object",
          editor: "sa.managedobject.LookupField",
          flex: 1,
          renderer: NOC.render.Lookup("object"),
        },
      ],
    },
    {
      title: t("app-title-segments"),
      collapsed: false,
      model: "NOC.maintenance.maintenance.DirectSegmentsModel",
      columns: [
        {
          text: t("header-segment-44986c"),
          dataIndex: "segment",
          editor: "inv.networksegment.ComboTree",
          flex: 1,
          renderer: NOC.render.Lookup("segment"),
        },
      ],
    },
    {
      title: t("app-title-service"),
      collapsed: false,
      model: "NOC.maintenance.maintenance.DirectServicesModel",
      columns: [
        {
          text: t("header-service"),
          dataIndex: "service",
          editor: "sa.service.LookupField",
          flex: 1,
          renderer: NOC.render.Lookup("service"),
        },
      ],
    },
  ],
  ePolicy: function(){
    return true
  },

  editRecord: function(record){
    var me = this,
      start = Ext.Date.parse(record.get("start"), "Y-m-d H:i:s"),
      stop = Ext.Date.parse(record.get("stop"), "Y-m-d H:i:s");
    record.set("start_date", start);
    record.set("start_time", start);
    record.set("stop_date", stop);
    record.set("stop_time", stop);
    me.callParent([record]);
    me.cardButton.setDisabled(false);
    me.affectedButton.setDisabled(false);
  },

  cleanData: function(v){
    var me = this;
    me.callParent([v]);
    v.start = me.mergeDate(v.start_date, v.start_time);
    delete v.start_date;
    delete v.start_time;
    v.stop = me.mergeDate(v.stop_date, v.stop_time);
    delete v.stop_date;
    delete v.stop_time;
  },

  mergeDate: function(d, t){
    var year = d.getFullYear(),
      month = d.getMonth(),
      day = d.getDate(),
      hour = t.getHours(),
      min = t.getMinutes(),
      sec = t.getSeconds(),
      q = function(v){
        if(v < 10){
          return "0" + v;
        } else{
          return "" + v;
        }
      };
    return "" + year + "-" + q(month + 1) + "-" + q(day) + "T" +
            q(hour) + ":" + q(min) + ":" + q(sec);
  },

  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/maintenance/" + me.currentRecord.get("id") + "/",
      );
    }
  },

  onObjects: function(){
    var me = this;
    me.previewItem(me.ITEM_OBJECTS, me.currentRecord);
  },

  newRecord: function(defaults){
    var me = this;

    me.callParent([defaults]);
    me.cardButton.setDisabled(true);
    me.affectedButton.setDisabled(true);
  },
});
