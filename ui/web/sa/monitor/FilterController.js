//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.monitor.FilterController");
Ext.define("NOC.sa.monitor.FilterController", {
  extend: "NOC.core.filter.FilterController",
  alias: "controller.monitor.filter",
  requires: [
    "NOC.core.filter.FilterController",
  ],

  restoreFilter: function(){
    var queryStr = Ext.util.History.getToken().split("?")[1],
      obj;

    if(queryStr){
      obj = Ext.Object.fromQueryString(queryStr, true);
      if(Object.hasOwn(obj, "status")){
        this.lookupReference(obj.status + "-btn").setPressed(true);
      }
    }
    this.callParent();
  },

  setFilter: function(btn){
    var field = Ext.create("Ext.form.field.Text", {
      itemId: "status",
    });
    if(Object.hasOwn(btn, "itemId")){
      this.callParent(arguments);
    } else{
      if(btn.pressed){
        field.setValue(btn.value);
      }
      this.callParent([field, undefined], {callee: arguments.callee});
    }
  },

  cleanAllFilters: function(){
    this.lookupReference("sbtn").setPressed(false);
    this.lookupReference("wbtn").setPressed(false);
    this.callParent();
  },
});