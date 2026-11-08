//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.core.InlineGrid");

Ext.define("NOC.core.InlineGrid", {
  extend: "Ext.grid.Panel",
  alias: "widget.inlinegrid",
  selType: "rowmodel",
  readOnly: false,
  disabledTooltip: t("help-this-grid-is-currently-disabled-fill-all-required-fields-and-pre"),
  defaultListenerScope: true,
  plugins: [
    {
      ptype: "rowediting",
      clicksToEdit: 2,
      listeners: {
        canceledit: "onCancelEdit",
        validateedit: "validator",
        edit: "onEdit",
      },
    },
  ],
  tbar: [
    {
      text: t("btn-add"),
      glyph: NOC.glyph.plus,
      handler: "addHandler",
    },
    {
      text: t("btn-append"),
      glyph: NOC.glyph.sign_in,
      handler: "appendHandler",
    },
    {
      text: t("btn-delete"),
      glyph: NOC.glyph.times,
      handler: "deleteHandler",
    },
  ],
  initComponent: function(){
    var me = this;
    this.columns = me.columns;
    this.store = me.store;
    // scope: me pins these string handlers to this grid. Without it ExtJS
    // resolves them (with skipThis) up to the nearest ancestor view controller
    // (e.g. sa.managedobject.form.FormController), which has no onDisable /
    // onEnable — throwing "No method named onDisable on ...Controller" whenever
    // the grid fires a disable/enable event.
    me.on({
      afterrender: "setupDisabledTooltip",
      disable: "onDisable",
      enable: "onEnable",
      scope: me,
    });
    this.callParent();
    if(this.readOnly){
      this.down("[dock=top][xtype=toolbar]").hide(true)
    }
  },
  //
  onCancelEdit: function(editor, context){
    if(context.record.phantom){
      context.grid.store.removeAt(context.rowIdx);
    }
  },
  //
  appendHandler: function(){
    var store = this.getStore(),
      position = store.data.length,
      rowEditing = this.plugins[0];
    rowEditing.cancelEdit();
    store.insert(position, {});
    rowEditing.startEdit(position, 0);
  },
  //
  addHandler: function(){
    var rowEditing = this.plugins[0];
    rowEditing.cancelEdit();
    this.getStore().insert(0, {});
    rowEditing.startEdit(0, 0);
  },
  //
  deleteHandler: function(){
    var store = this.getStore(),
      sm = this.getSelectionModel(),
      rowEditing = this.plugins[0];
    rowEditing.cancelEdit();
    store.remove(sm.getSelection());
    if(store.getCount() > 0){
      sm.select(0);
    }
    this.storeSync(store, t("msg-deleted"), t("msg-deleting"));
  },
  //
  validator: function(editor, context){
    var form = editor.editor.getForm();
    // Process comboboxes
    form.getFields().each(function(field){
      context.record.set(field.name, field.getValue());
      if(Ext.isDefined(field.getLookupData))
        context.record.set(field.name + "__label",
                           field.getLookupData());
    });
  },
  //
  onEdit: function(editor, context){
    this.storeSync(context.grid.getStore(), t("msg-saved"), t("msg-saving"));
  },
  //
  storeSync: function(store, success, failure){
    store.sync({
      success: function(){
        NOC.info(t("msg-changes-value0", {value0: success}));
      },
      failure: function(){
        NOC.error(t("msg-error-saving-changes", {failure}));
      },
    });
  },
  //
  setupDisabledTooltip: function(){
    if(this.disabled){
      this.addDisabledTooltip();
    }
  },
  //
  addDisabledTooltip: function(){
    var me = this;
    if(me.disabledTip){
      me.disabledTip.destroy();
      me.disabledTip = null;
    }
    //
    me.disabledTip = Ext.create("Ext.tip.ToolTip", {
      target: me.el,
      html: me.disabledTooltip,
      showDelay: 100,
      hideDelay: 200,
      dismissDelay: 10000, // 10 sec
      trackMouse: true,
    });
  },
  //
  removeDisabledTooltip: function(){
    if(this.disabledTip){
      this.disabledTip.destroy();
      this.disabledTip = null;
    }
  },
  //
  onDisable: function(){
    this.addDisabledTooltip();
  },  
  //
  onEnable: function(){
    this.removeDisabledTooltip();
  },
});