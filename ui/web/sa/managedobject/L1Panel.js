//---------------------------------------------------------------------
// sa.managedobject L1 Panel
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.L1Panel");

Ext.define("NOC.sa.managedobject.L1Panel", {
  extend: "Ext.panel.Panel",
  reference: "saL1Panel",
  requires: [
    "NOC.core.StateField",
    "NOC.core.ComboBox",
  ],
  title: t("msg-physical"),
  closable: false,
  layout: "fit",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    me.gridPlugins = [];

    if(NOC.hasPermission("change_interface")){
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

    me.addInterfaceButton = Ext.create("Ext.button.Button", {
      text: t("btn-add-interface"),
      glyph: NOC.glyph.plus,
      scope: me,
      disabled: !NOC.hasPermission("sa:managedobject:change_interface"),
      handler: me.onAddInterface,
    });

    Ext.apply(me, {
      items: [
        {
          xtype: "gridpanel",
          border: false,
          autoScroll: true,
          stateful: true,
          stateId: "sa.managedobject-l1-grid",
          store: me.store,
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              editor: {
                xtype: "textfield",
                allowBlank: false,
              },
            },
            {
              text: t("header-status"),
              dataIndex: "status",
              width: 100,
            },
            {
              text: t("label-metrics"),
              dataIndex: "metrics",
              width: 100,
            },
            {
              text: t("header-mac"),
              dataIndex: "mac",
              width: 120,
            },
            {
              text: t("header-lag"),
              dataIndex: "lag",
            },
            {
              text: t("header-caps"),
              dataIndex: "caps",
              onClick: me.onCapsClick,
              renderer: function(value){
                var app = this.up("[reference=saL1Panel]"),
                  v = value ? app.renderArrayValue(value, "label") : "...";
                return "<a href='javascript:void(0)' class='noc-clickable-cell' title='Click to change...'>"
                  + v
                  + "</a>";
              },
            },
            {
              text: t("msg-link"),
              dataIndex: "link",
              renderer: function(value){
                var v = value ? value.label : "...";
                return "<a href='javascript:void(0)' class='noc-clickable-cell' title='Click to change...'>" + v + "</a>";
              },
              onClick: me.onLinkClick,
            },
            {
              text: t("header-profile"),
              dataIndex: "profile",
              renderer: NOC.render.Lookup("profile"),
              editor: {
                xtype: "core.combo",
                restUrl: "/inv/interfaceprofile/lookup/",
              },
            },
            {
              text: t("label-project"),
              dataIndex: "project",
              renderer: NOC.render.Lookup("project"),
              editor: {
                xtype: "core.combo",
                restUrl: "/project/project/lookup/",
              },
            },
            {
              text: t("header-state"),
              dataIndex: "state",
              editor: {
                xtype: "statefield",
                restUrl: "/inv/interface/",
              },
              renderer: NOC.render.Lookup("state"),
            },
            {
              text: t("nav-protocol"),
              dataIndex: "enabled_protocols",
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
              editor: {
                xtype: "textfield",
              },
            },
            {
              text: t("header-ifindex"),
              dataIndex: "ifindex",
              hidden: true,
              width: 50,
            },
            {
              xtype: "glyphactioncolumn",
              items: [{
                disabled: !NOC.hasPermission("sa:managedobject:change_interface"),
                glyph: NOC.glyph.minus_circle,
                scope: me,
                handler: me.onRemoveInterface,
              }],
            },
          ],
          dockedItems: [
            {
              xtype: "toolbar",
              dock: "top",
              items: [
                me.addInterfaceButton,
              ],
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
    });
    me.callParent();
  },
  renderArrayValue: function(value, label){
    if(Ext.isEmpty(value)) return "..."
    if(Ext.isArray(value)) return value.map(el => el[label]).join(", ");
    return value[label];

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
        project: r.get("project"),
        state: r.get("state"),
        description: r.get("description"),
      },
      isNewRecord = Ext.isEmpty(e.originalValues.name);
    if(isNewRecord){
      data["name"] = r.get("name");
    } else{
      data["id"] = r.get("id");
    }
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + me.app.currentRecord.get("id") + "/interface/",
      method: "POST",
      jsonData: data,
      scope: me,
      success: function(){
        me.app.onRefresh();
        if(isNewRecord){
          NOC.info(t("msg-created-interface-value0", {value0: r.get("name")}));
        } else{
          NOC.info(t("msg-saved-2"));
        }
        // @todo: Set tab
      },
      failure: function(){
        NOC.error(t("msg-failed-to-set-data"));
      },
    });
  },

  onLinkClick: function(record){
    var me = this;
    Ext.create("NOC.sa.managedobject.LinkForm", {
      title: t("msg-link-interface-with", {name: record.get("name")}),
      app: me.app,
      ifaceId: record.get("id"),
      ifName: record.get("name"),
      isLinked: !!record.get("link"),
      linkId: record.get("link") ? record.get("link").id : null,
    });
  },

  onCapsClick: function(record){
    Ext.create("NOC.sa.managedobject.CapsForm", {
      title: t("msg-capabilities-of", {name: record.get("name")}),
      app: this.app,
      rowId: record.get("id"),
      dataCaps: record.get("caps"),
    });
  },

  onCellClick: function(view, cell, cellIndex, record, row, rowIndex, e){
    var me = this;
    if(e.target.tagName === "A"){
      var header = view.panel.headerCt.getHeaderAtIndex(cellIndex);
      if(header.onClick){
        header.onClick.apply(me, [record]);
      }
    }
  },

  onRemoveInterface: function(grid, rowIndex){
    var me = this,
      rec = grid.getStore().getAt(rowIndex);
    console.log(me.app.currentRecord.get("id"));
    Ext.Msg.show({
      title: t("app-title-remove-interface"),
      msg: t("msg-would-you-like-remove-interface-value0", {value0: rec.get("name")}),
      buttons: Ext.Msg.YESNO,
      modal: true,
      fn: function(button){
        if(button === "yes"){
          me.removeInterface(me.app.currentRecord.get("id"), rec.get("id"));
        }
      },
    })
  },

  onAddInterface: function(){
    var me = this,
      editPlugin = me.gridPlugins[0];
    editPlugin.cancelEdit();
    me.store.insert(0, {});
    editPlugin.startEdit(0, 0);
  },

  onCancelEdit: function(editor, context){
    if(context.record.phantom){
      context.grid.store.removeAt(context.rowIdx);
    }
  },

  removeInterface: function(objectId, interfaceId){
    var me = this;
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + objectId + "/interface/" + interfaceId + "/",
      method: "DELETE",
      success: function(){
        me.app.onRefresh();
        NOC.info(t("msg-deleted-2"));
      },
      failure: function(){
        NOC.error(t("msg-failed-to-remove-interface"));
      },
    });
  },
});
