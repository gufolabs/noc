//---------------------------------------------------------------------
// main.search application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.search.Application");

Ext.define("NOC.main.search.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.main.search.SearchStore",
    "Ext.ux.form.SearchField",
  ],
  initComponent: function(){
    var me = this;
    me.store = Ext.create("NOC.main.search.SearchStore");
    me.searchField = Ext.create("Ext.ux.form.SearchField", {
      fieldLabel: t("app-title-search"),
      labelWidth: 40,
      width: "500",
      explicitSubmit: true,
      scope: me,
      handler: me.doSearch,
    });
    me.totalField = Ext.create("Ext.form.field.Display");
    me.grid = Ext.create("Ext.grid.Panel", {
      store: me.store,
      columns: [
        {
          text: t("header-result"),
          xtype: "templatecolumn",
          flex: 1,
          tpl: "<div class='noc-search-title'>{title}</div>" +
                        "<div class='noc-search-card'>{card}</div>" +
                        "<tpl for='tags'><span class='x-display-tag'>{.}</span></tpl>",
        },
      ],
      listeners: {
        scope: me,
        select: me.onSelect,
      },
    });
    Ext.apply(me, {
      items: [
        me.grid,
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.searchField,
            "->",
            me.totalField,
          ],
        },
      ],
    });
    me.callParent();
    // Process commands
    if(me.noc.cmd){
      switch(me.noc.cmd.cmd){
        case "search":
          me.searchField.setValue(me.noc.cmd.query);
          break;
      }
    }

  },
  //
  afterRender: function(){
    var me = this;
    me.callParent();
    me.searchField.focus();
    var v = me.searchField.getValue();
    if(v !== ""){
      me.doSearch(v);
    }
  },
  //
  doSearch: function(query){
    var me = this;
    NOC.msg.started(t("msg-starting-search"));
    me.mask();
    NOC.api.requestLegacy({
      url: "/main/search/",
      method: "POST",
      jsonData: {
        query: query,
      },
      scope: me,
      success: function(response){
        me.unmask();
        NOC.msg.complete(t("msg-search-complete"));
        me.showResult(Ext.decode(response.responseText));
      },
      failure: function(){
        me.unmask();
        NOC.msg.failed(t("msg-failed-to-search"));
      },
    });
  },
  //
  showResult: function(result){
    var me = this;
    me.searchField.focus();
    me.store.loadData(result);
    me.totalField.setValue(t("msg-total-value0", {value0: result.length}));
  },
  //
  onSelect: function(model, record){
    var w;
    w = window.open(record.get("url"), "_blank");
    w.focus()
  },
});
