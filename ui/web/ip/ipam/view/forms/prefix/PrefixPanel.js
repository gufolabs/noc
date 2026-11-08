//---------------------------------------------------------------------
// ip.ipam Prefix panel
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.ipam.view.forms.prefix.PrefixPanel");

Ext.define("NOC.ip.ipam.view.forms.prefix.PrefixPanel", {
  extend: "NOC.core.FormPanel",
  alias: "widget.ip.ipam.form.prefix",
  requires: [
    "NOC.ip.prefixprofile.LookupField",
    "NOC.ip.vrf.LookupField",
    "NOC.ip.addressprofile.LookupField",
    "NOC.peer.as.LookupField",
    "NOC.vc.vlan.LookupField",
    "NOC.project.project.LookupField",
    "NOC.aaa.user.LookupField",
    "NOC.aaa.group.LookupField",
  ],
  currentPrefixId: null,
  restUrl: "/ip/prefix/",
  viewModel: {
    data: {
      isNew: false,
    },
  },

  initComponent: function(){
    var me = this;

    me.app = me.up("[itemId=ip-ipam]");
    me.rebaseButton = Ext.create("Ext.button.Button", {
      text: t("btn-rebase"),
      glyph: NOC.glyph.truck,
      tooltip: t("help-rebase-prefix-to-a-new-location"),
      scope: me,
      handler: me.onRebase,
      hasAccess: NOC.hasPermission("rebase"),
      bind: {
        disabled: "{isNew}",
      },
    });

    Ext.apply(me, {
      fields: [
        {
          name: "id",
          xtype: "displayfield",
          hidden: true,
        },
        {
          name: "vrf",
          xtype: "ip.vrf.LookupField",
          fieldLabel: t("header-vrf"),
          allowBlank: true,
          readOnly: true,
        },
        {
          name: "prefix",
          xtype: "combobox",
          fieldLabel: t("header-prefix"),
          allowBlank: false,
          uiStyle: "medium",
          store: [],
          bind: {
            readOnly: "{!isNew}",
          },
        },
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "profile",
          xtype: "ip.prefixprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "afi",
          xtype: "displayfield",
          fieldLabel: t("label-address-family"),
          allowBlank: true,
        },
        {
          name: "asn",
          xtype: "peer.as.LookupField",
          fieldLabel: t("app-title-as"),
          allowBlank: true,
        },
        {
          name: "vlan",
          xtype: "vc.vlan.LookupField",
          fieldLabel: t("app-title-vlan"),
          allowBlank: true,
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "allow_models": ["ip.Prefix"],
          },
        },
        {
          name: "tt",
          xtype: "numberfield",
          fieldLabel: t("label-tt"),
          allowBlank: true,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: true,
          bind: {
            disabled: "{isNew}",
          },
        },
        {
          name: "allocated_till",
          xtype: "datefield",
          startDay: 1,
          fieldLabel: t("label-allocated-till"),
          allowBlank: true,
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
        },
        {
          name: "prefix_discovery_policy",
          xtype: "combobox",
          fieldLabel: t("label-prefix-discovery-policy"),
          allowBlank: true,
          store: [
            ["P", t("header-profile")],
            ["E", t("label-enable")],
            ["D", t("status-disable")],
          ],
          defaultValue: "P",
          labelWidth: 180,
          uiStyle: "medium",
        },
        {
          name: "address_discovery_policy",
          xtype: "combobox",
          fieldLabel: t("label-address-discovery-policy"),
          allowBlank: true,
          store: [
            ["P", t("header-profile")],
            ["E", t("label-enable")],
            ["D", t("status-disable")],
          ],
          defaultValue: "P",
          labelWidth: 180,
          uiStyle: "medium",
        },
        {
          name: "default_address_profile",
          xtype: "ip.addressprofile.LookupField",
          fieldLabel: t("label-default-address-profile"),
          allowBlank: true,
        },
        {
          name: "pools",
          xtype: "gridfield",
          fieldLabel: t("label-address-pools"),
          columns: [
            {
              text: t("label-pool"),
              dataIndex: "pool",
              width: 200,
              editor: {
                xtype: "inv.resourcepool.LookupField",
              },
              renderer: NOC.render.Lookup("pool"),
            },
            {
              dataIndex: "description",
              text: t("label-description"),
              editor: "textfield",
              width: 150,
            },
          ],
        },
        // {
        //     name: "direct_permissions",
        //     xtype: "gridfield",
        //     fieldLabel: t("Permissions"),
        //     columns: [
        //         {
        //             text: t("User"),
        //             dataIndex: "user",
        //             editor: "main.user.LookupField",
        //             renderer: NOC.render.Lookup("user"),
        //             width: 100
        //         },
        //         {
        //             text: t("Group"),
        //             dataIndex: "group",
        //             editor: "main.group.LookupField",
        //             renderer: NOC.render.Lookup("group"),
        //             width: 150
        //         },
        //         {
        //             text: t("Permission"),
        //             dataIndex: "permission",
        //             editor: {
        //                 xtype: "combobox",
        //                 store: [
        //                     ["can_view", "can_view"],
        //                     ["can_change", "can_change"],
        //                     ["can_create", "can_create"]
        //                 ]
        //             },
        //             width: 150
        //         }
        //     ]
        // }
      ],
      formToolbar: [
        me.rebaseButton,
      ],
    });
    me.callParent()
  },
  onClose: function(){
    this.close();
  },
  //
  onRebase: function(){
    var me = this,
      values = me.getFormData(),
      vrfField = me.getField("vrf"),
      app = me.up("[itemId=ip-ipam]");
    app.getViewModel().set("activeItem", "ipam-prefix-rebase");
    app.down("[itemId=ipam-prefix-rebase]").preview({
      id: me.currentPrefixId,
      to_vrf: values.vrf,
      to_vrf__label: vrfField.getRawValue(),
      to_prefix: values.prefix,
    });
  },
  //
  close: function(){
    var me = this,
      prefixId = me.getFormData().id;
    if(me.getViewModel().get("isNew")){
      prefixId = me.up("[itemId=ip-ipam]").getViewModel().get("prefix.id");
    }
    me.fireEvent("ipIPAMPrefixFormClose", {id: prefixId});
  },
  //
  save: function(data){
    var me = this;
    me.mask(t("msg-saving-3"));
    NOC.api.requestLegacy({
      url: me.restUrl + (me.currentPrefixId ? me.currentPrefixId + "/" : ""),
      method: me.currentPrefixId ? "PUT" : "POST",
      scope: me,
      jsonData: data,
      success: function(){
        me.unmask();
        NOC.msg.complete(t("msg-saved-2"));
        me.close();
      },
      failure: function(response){
        var message = "Error saving record";
        if(response.responseText){
          try{
            message = Ext.decode(response.responseText).message
          } catch(err){
            console.error(err);
            console.log(response.responseText)
          }
        }
        me.unmask();
        NOC.error(message)
      },
    });
  },
  //
  preview: function(record){
    var me = this;
    if(record.id){
      me.loadPrefix(record.id)
    } else{
      me.newPrefix(record.parentId, record.prefix)
    }
  },
  //
  // Load prefix to form
  //
  loadPrefix: function(id){
    var me = this;
    me.currentPrefixId = id;
    NOC.api.requestLegacy({
      url: me.restUrl + id + "/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        me.getViewModel().set("isNew", false);
        me.setTitle(t("msg-change-prefix-value0", {value0: data.prefix}));
        me.setValues(data)
      },
      failure: function(){
        NOC.error(t("msg-failed-to-load-data"))
      },
    })
  },
  //
  // New prefix form
  //
  newPrefix: function(parentId, prefix){
    var me = this,
      prefixField = me.getField("prefix");
    me.currentPrefixId = null;
    // Load data
    NOC.api.requestLegacy({
      url: me.restUrl + parentId + "/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText),
          values = {
            "vrf": data.vrf,
            "vrf__label": data.vrf__label,
            "afi": data.afi,
          };
        if(prefix){
          values.prefix = prefix
        } else{
          values.prefix = me.getCommonPrefixPart(data.afi, data.prefix)
        }
        me.getViewModel().set("isNew", true);
        me.setValues(values);
        me.setTitle(t("msg-create-new-prefix"))
      },
      failure: function(){
        NOC.error(t("msg-failed-to-load-data"))
      },
    });
    // Set suggestions
    NOC.api.requestLegacy({
      url: me.restUrl + parentId + "/suggest_free/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        prefixField.setStore(data.map(function(v){
          return v.prefix
        }))
      },
    })
  },
  //
  setValues: function(data){
    var me = this;
    me.callParent([data]);
    me.setAFI(data.afi)
  },
  //
  setAFI: function(afi){
    console.log("setAFI", afi)
  },
  //
  getCommonPrefixPart: function(afi, prefix){
    var parts = prefix.split("/"),
      net = parts[0],
      mask = parseInt(parts[1]);

    if(afi === "4"){
      // IPv4
      // Align to 8-bit border
      var v = net.split(".").slice(0, Math.floor(mask / 8)).join(".");
      if(v !== ""){
        v = v + "."
      }
      return v
    } else{
      // if p.mask < 16:
      //     return ""
      // # Align to 16-bit border
      // p.mask = (p.mask // 16) * 16
      // p = self.rx_ipv6_prefix_rest.sub("", p.normalized.prefix)
    }
  },
});
