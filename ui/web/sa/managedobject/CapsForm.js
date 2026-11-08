//---------------------------------------------------------------------
// Capabilities window
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.CapsForm");

Ext.define("NOC.sa.managedobject.CapsForm", {
  extend: "Ext.Window",
  requires: [
    "NOC.core.plugins.DynamicModalEditing",
    "NOC.core.InlineModelStore",
    "NOC.inv.interface.CapabilitiesModel",
    "NOC.core.InlineGrid",
  ],
  autoShow: true,
  closable: true,
  maximizable: true,
  modal: true,
  scrollable: true,
  width: "50%",
  height: "30%",
  layout: "fit",

  initComponent: function(){
    Ext.apply(this, {
      items: [
        {
          xtype: "inlinegrid",
          title: t("header-capabilities"),
          collapsible: false,
          collapsed: false,
          itemId: "sa-mo-caps-inline",
          store: Ext.create("NOC.core.InlineModelStore", {
            model: "NOC.inv.interface.CapabilitiesModel",
          }),
          readOnly: true,
          bbar: {},
          plugins: [
            {
              ptype: "dynamicmodalediting",
              listeners: {
                canceledit: "onCancelEdit",
              },
            },
          ],
          columns: [
            {
              text: t("app-title-capability"),
              dataIndex: "capability",
              width: 200,
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              useModalEditor: true,
              urlPrefix: "/inv/interface",
            },
            {
              text: t("header-scope"),
              dataIndex: "scope",
              width: 80,
            },
            {
              text: t("header-source"),
              dataIndex: "source",
              width: 70,
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
            },
          ],
        },
      ],
    });
    this.callParent();
    this.loadStore(this.rowId);
  },
  
  loadStore: function(id){
    let store = this.down("[itemId=sa-mo-caps-inline]").getStore();
    store.setParent(id);
    this.app.mask(t("msg-loading-capabilities"));
    store.load({
      scope: this.app,
      callback: function(records, operation, success){
        this.unmask();
        if(!success){
          NOC.error(t("msg-failed-to-load-capabilities"));
        }
      },
    });
  },
});