//---------------------------------------------------------------------
// inv.inv SensorPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.inv.plugins.sensor.SensorPanel");

Ext.define("NOC.inv.inv.plugins.sensor.SensorPanel", {
  extend: "Ext.panel.Panel",
  title: t("label-sensors"),
  closable: false,
  layout: "fit",
  scrollable: false,
  requires: [
    "NOC.core.StateField",
    "NOC.inv.sensorprofile.LookupField",
    "NOC.pm.measurementunits.LookupField",
    "Ext.ux.form.GridField",
  ],

  initComponent: function(){
    var me = this;

    me.gridField = Ext.create({
      xtype: "gridfield",
      columns: [
        {
          dataIndex: "local_id",
          text: t("header-name"),
        },
        {
          dataIndex: "profile",
          text: t("header-profile"),
          renderer: NOC.render.Lookup("profile"),
          editor: {
            xtype: "inv.sensorprofile.LookupField",
          },
        },
        {
          dataIndex: "units",
          text: t("btn-units"),
          renderer: NOC.render.Lookup("units"),
          editor: {
            xtype: "pm.measurementunits.LookupField",
          },
        },
        {
          dataIndex: "object__label",
          text: t("header-object"),
          width: 220,
        },
        {
          dataIndex: "state",
          text: t("header-state"),
          renderer: NOC.render.Lookup("state"),
        },
        {
          dataIndex: "modbus_register",
          text: t("header-modbus-register"),
        },
        {
          dataIndex: "modbus_format",
          text: t("header-modbus-format"),
        },
        {
          dataIndex: "protocol",
          text: t("header-protocol"),
        },
        {
          dataIndex: "snmp_oid",
          text: t("header-snmp-oid"),
          width: 200,
        },
      ],
      onCellEdit: function(editor, e){
        var data = {},
          grid = this.grid,
          ed = e.grid.columns[e.colIdx].getEditor();

        if(ed.rawValue){
          e.record.set(e.field + "__label", ed.rawValue);
        }
        data[e.field] = e.value;
        grid.mask(t("msg-saving-3"));
        NOC.api.requestLegacy({
          url: "/inv/inv/" + e.record.data.id + "/plugin/sensor/",
          method: "POST",
          scope: me,
          jsonData: data,
          success: function(){
            grid.unmask();
            e.record.commit();
            NOC.msg.complete(t("msg-saved-2"));
          },
          failure: function(response){
            var message = t("msg-not-saved");
            if(response.responseText){
              try{
                message = Ext.decode(response.responseText).message
              } catch(err){
                console.log(response.responseText);
                console.error(err);
              }
            }
            grid.unmask();
            NOC.error(message)
          },
        });
      },
    });
    Ext.override(me.gridField, {
    });
    Ext.apply(me, {
      items: [
        me.gridField,
      ],
    });
    me.callParent();
  },
  //
  preview: function(data){
    var me = this;
    me.currentId = data.id;
    me.gridField.store.loadData(data)
  },
});
