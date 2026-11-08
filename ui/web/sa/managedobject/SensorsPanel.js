//---------------------------------------------------------------------
// sa.managedobject SensorsPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.SensorsPanel");

Ext.define("NOC.sa.managedobject.SensorsPanel", {
  extend: "NOC.core.ApplicationPanel",
  alias: "widget.sa.sensors",
  requires: [
    "NOC.core.ComboBox",
    "NOC.sa.managedobject.SensorsStore",
    "NOC.core.label.LabelField",
  ],
  app: null,
  autoScroll: true,
  historyHashPrefix: "sensors",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    me.gridPlugins = [];
    me.currentObject = null;

    me.refreshButton = Ext.create("Ext.button.Button", {
      text: t("help-refresh"),
      glyph: NOC.glyph.refresh,
      scope: me,
      handler: me.onRefresh,
    });

    if(NOC.hasPermission("inv:sensor:update")){
      me.gridPlugins.push(
        Ext.create("Ext.grid.plugin.RowEditing", {
          clicksToEdit: 2,
          listeners: {
            scope: me,
            edit: me.onEdit,
            canceledit: me.onCancelEdit,
          },
        }),
      );
    }
    // Create stores
    me.sensorsStore = Ext.create("NOC.sa.managedobject.SensorsStore");
    Ext.apply(me, {
      items: [
        {
          xtype: "gridpanel",
          border: false,
          autoScroll: true,
          stateful: true,
          stateId: "sa.managedobject-sensors-grid",
          store: me.sensorsStore,
          columns: [
            {
              text: t("header-local-id-2"),
              dataIndex: "local_id",
            },
            {
              text: t("label-description"),
              dataIndex: "label",
              width: 250,
            },
            {
              text: t("header-profile"),
              dataIndex: "profile",
              renderer: NOC.render.Lookup("profile"),
              editor: {
                xtype: "core.combo",
                restUrl: "/inv/sensorprofile/lookup/",
                uiStyle: "medium-combo",
              },
            },
            {
              text: t("header-labels"),
              dataIndex: "labels",
              renderer: NOC.render.LabelField,
              editor: "labelfield",
              width: 200,
            },
            {
              text: t("btn-units"),
              dataIndex: "units",
              renderer: NOC.render.Lookup("units"),
            },
            {
              text: t("header-state"),
              dataIndex: "state",
              renderer: NOC.render.Lookup("state"),
              width: 200,
            },
            {
              text: t("header-last-seen-20c226"),
              dataIndex: "last_seen",
              renderer: NOC.render.DateTime,
              width: 200,
            },
            {
              text: t("header-snmp-oid"),
              dataIndex: "snmp_oid",
              width: 200,
            },
            {
              text: t("btn-ipmi-id"),
              dataIndex: "ipmi_id",
            },
            {
              text: t("header-modbus-register"),
              dataIndex: "modbus_register",
            },
          ],
          viewConfig: {
            getRowClass: Ext.bind(me.getRowClass, me),
            listeners: {
              scope: me,
              cellclick: me.onCellClick,
            },
          },
          plugins: me.gridPlugins,
        },
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.getCloseButton(),
            me.refreshButton,
          ],
        },
      ],
    });
    me.callParent();
  },
  //
  preview: function(record){
    var me = this;
    me.callParent(arguments);
    me.setTitle(`${record.get("name")} ${t("label-sensors")}`);
    NOC.api.requestLegacy({
      url: "/inv/sensor/?managed_object=" + record.get("id"),
      method: "GET",
      scope: me,
      success: function(response){
        var me = this,
          data = Ext.decode(response.responseText);
        // Load data
        me.sensorsStore.loadData(data || []);
      },
      failure: function(request){
        NOC.error(t("msg-failed-to-load-data-value0", {value0: request.statusText}));
      },
    });
  },
  //
  onRefresh: function(){
    var me = this;
    me.preview(me.currentRecord);
  },
  // Return Grid's row classes
  getRowClass: function(record){
    var me = this;
    if(me.rowClassField){
      var c = record.get(me.rowClassField);
      if(c){
        return c;
      } else{
        return "";
      }
    } else{
      return "";
    }
  },
  //
  onEdit: function(editor, e){
    var me = this,
      r = e.record,
      data = {
        profile: r.get("profile"),
        labels: r.get("labels"),
      };
    NOC.api.requestLegacy({
      url: "/inv/sensor/" + r.get("id") + "/",
      method: "PUT",
      jsonData: data,
      scope: me,
      success: function(){
        me.onRefresh();
        NOC.info(t("msg-saved-2"));
      },
      failure: function(){
        NOC.error(t("msg-failed-to-set-data"));
      },
    });
  },
  //
  onCancelEdit: function(editor, context){
    if(context.record.phantom){
      context.grid.store.removeAt(context.rowIdx);
    }
  },
  //
  onCellClick: function(view, cell, cellIndex, record, row,
    rowIndex, e){
    var me = this;
    if(e.target.tagName === "A"){
      var header = view.panel.headerCt.getHeaderAtIndex(cellIndex);
      if(header.onClick){
        header.onClick.apply(me, [record]);
      }
    }
  },
});
