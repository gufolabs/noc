//---------------------------------------------------------------------
// inv.macdb application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.macdb.Application");

Ext.define("NOC.inv.macdb.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.macdb.MACLogForm",
    "NOC.inv.macdb.Model",
    "NOC.main.pool.LookupField",
    "NOC.inv.interfaceprofile.LookupField",
    "NOC.sa.managedobject.LookupField",
  ],
  model: "NOC.inv.macdb.Model",
  search: true,
  searchPlaceholder: t("label-insert-mac-address-to-search"),
  requirePlaceholder: t("msg-type-mac-address-to-search"),
  searchTooltip: t("help-insert-mac-address-to-this-field-one-of-format-li-full-aa-aa-aa-"),
  canCreate: false,
  rowClassField: "row_class",
  //
  columns: [
    {
      text: t("header-mac-address"),
      dataIndex: "mac",
      width: 110,
    },
    {
      text: t("header-l2-domain"),
      dataIndex: "l2_domain",
      renderer: NOC.render.Lookup("l2_domain"),
      flex: 1,
    },
    {
      text: t("label-pool"),
      dataIndex: "pool",
      renderer: NOC.render.Lookup("pool"),
      flex: 1,
    },
    {
      text: t("msg-object-profile"),
      dataIndex: "object_profile",
      renderer: NOC.render.Lookup("object_profile"),
      flex: 1,
    },
    {
      text: t("header-vlan-6c174b"),
      dataIndex: "vlan",
      width: 40,
    },
    {
      flex: 1,
      text: t("header-managed-object-62561c"),
      renderer: NOC.render.Lookup("managed_object"),
      dataIndex: "managed_object",
    },
    {
      flex: 1,
      text: t("header-interface"),
      dataIndex: "interface",
    },
    {
      flex: 1,
      text: t("label-description"),
      dataIndex: "description",
    },
    {
      text: t("header-last-changed"),
      dataIndex: "last_changed",
      width: 150,
    },
  ],
  //
  filters: [
    {
      title: t("choice-by-profile"),
      name: "interface_profile",
      ftype: "lookup",
      lookup: "inv.interfaceprofile",
    },
    {
      title: t("app-title-by-object"),
      name: "managed_object",
      ftype: "lookup",
      lookup: "sa.managedobject",
    },
  ],
  gridToolbar: [
    {
      xtype: "radiogroup",
      width: 250,
      items: [
        {
          checked: true,
          xtype: "radio",
          boxLabel: t("label-mac-db"),
          name: "source",
          inputValue: "macdb",
        },
        {
          xtype: "radio",
          boxLabel: t("label-mac-history"),
          name: "source",
          inputValue: "history",
        },
      ],
      listeners: {
        change: function(field, newValue){
          var searchField = this.up("toolbar").down("[name=search_field]"),
            app = this.up("[appId=inv.macdb]"),
            query = searchField.getValue();
          if(newValue.source === "macdb"){
            searchField.clearInvalid();
            searchField.setEmptyText(app.searchPlaceholder);
            if(Ext.isEmpty(query)){
              app.onSearch(query);
            }
          }
          if(newValue.source === "history"){
            searchField.markInvalid(t("msg-required-field"));
            searchField.setEmptyText(app.requirePlaceholder);
          }
          if(!Ext.isEmpty(query)){
            app.onSearch(query);
          }
        },
      },
    },
  ],
  //
  initComponent: function(){
    this.callParent();
    var favFilter = this.down("[name=fav_status]"),
      query = NOC.navigation.getToken().split("?")[1] || "",
      queryObj = Ext.Object.fromQueryString(query);
    this.searchField.onChange = Ext.emptyFn;
    this.searchField.setTriggers({
      clear: {
        cls: "x-form-clear-trigger",
        hidden: true,
        handler: function(field){
          var app = field.up("[appId=inv.macdb]");
          field.setValue("");
          app.onSearch("");
        },
      },
    });
    this.searchField.on("change", function(field, value){
      var trigger = field.getTrigger("clear");
      if(trigger){
        trigger.setVisible(!!value);
      }
    });
    if(Ext.isDefined(queryObj.source)){
      this.down("radiogroup").setValue({source: queryObj.source});
    }
    if(Ext.isDefined(queryObj.__query)){
      this.searchField.setValue(queryObj.__query);
    }
    Ext.each(this.filterSetters, function(set){
      set(queryObj);
    });
    if(!Ext.isEmpty(queryObj)){
      this.onFilter();
    }
    favFilter.up().remove(favFilter);
  },
  //
  createForm: function(){
    this.form = Ext.create("NOC.inv.macdb.MACLogForm", {app: this});
    return this.form;
  },
  //
  onEditRecord: function(record){
    this.showItem(this.ITEM_FORM).preview(record);
  },
  //
  onSearch: function(query){
    Ext.apply(this.currentQuery, this.down("radiogroup").getValue());
    if(query && query.length > 0){
      this.currentQuery.__query = query;
    } else{
      delete this.currentQuery.__query;
    }
    this.reloadStore();
  },
  onFilter: function(){
    var fexp = {};
    Ext.each(this.filterGetters, function(g){
      fexp = Ext.Object.merge(fexp, g());
    });
    if(Ext.isDefined(this.currentQuery.__query)){
      fexp.__query = this.currentQuery.__query;
    }
    if(Ext.isDefined(this.currentQuery.source)){
      fexp.source = this.currentQuery.source;
    }
    this.currentQuery = fexp;
    this.reloadStore();
  },
});