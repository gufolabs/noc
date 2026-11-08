//---------------------------------------------------------------------
// Add VLAN Form
//---------------------------------------------------------------------
// Copyright (C) 2007-2022 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.vlan.AddVLANForm");

Ext.define("NOC.vc.vlan.AddVLANForm", {
  extend: "Ext.Window",
  requires: [
    "NOC.vc.l2domain.LookupField",
    "NOC.inv.resourcepool.LookupField",
    "NOC.vc.vlan.Model",
  ],
  title: t("app-title-add-vlan"),
  autoShow: false,
  modal: true,
  app: null,
  closable: true,
  closeAction: "hide",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      items: [
        {
          xtype: "form",
          items: [
            {
              xtype: "vc.l2domain.LookupField",
              name: "vc_l2domain",
              fieldLabel: t("label-vc-l2-domain"),
              allowBlank: false,
            },
            {
              xtype: "inv.resourcepool.LookupField",
              name: "resource_pool",
              fieldLabel: t("nav-resourcepool"),
              allowBlank: false,
            },
            {
              name: "name",
              xtype: "textfield",
              fieldLabel: t("header-name"),
              allowBlank: true,
            },
          ],
        },
      ],
      buttons: [
        {
          text: t("app-title-add-vlan"),
          itemId: "add",
          glyph: NOC.glyph.plus,
          scope: me,
          /*formBind: true,
                    disabled: true,*/
          handler: me.onAddVLAN,
        },
      ],
    });
    me.callParent();
  },
  // Called when "Add button pressed"
  onAddVLAN: function(){
    var me = this;
    var r = me.down("form").getForm().getValues();
    var params = {
      l2_domain: r.vc_l2domain,
      pool: r.resource_pool,
    };
    if(r.name){
      params.name = r.name;
    }
    NOC.api.requestLegacy({
      method: "GET",
      url: "/vc/vlan/allocate/",
      params: params,
      scope: me,
      success: function(response){
        var vlan = Ext.decode(response.responseText);
        if(vlan !== 404){
          NOC.info(t("msg-valn-allocated"));
          me.hide();
          me.app.editRecord(Ext.create("NOC.vc.vlan.Model", vlan));
          return;
        } else{
          NOC.error(t("msg-free-vlan-not-found"));
        }
        me.hide();
      },
      failure: function(){
        NOC.error(t("msg-failed-to-add-vlan"));
        me.hide();
      },
    });
  },
});
