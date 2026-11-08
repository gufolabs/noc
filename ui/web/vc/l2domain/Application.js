//---------------------------------------------------------------------
// vc.l2domain application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.l2domain.Application");

Ext.define("NOC.vc.l2domain.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.vc.l2domain.Model",
    "NOC.core.StateField",
    "NOC.inv.resourcepool.LookupField",
    "NOC.vc.vlanfilter.LookupField",
    "NOC.vc.vlantemplate.LookupField",
    "NOC.vc.vlanprofile.LookupField",
    "NOC.vc.l2domainprofile.LookupField",
    "NOC.main.remotesystem.LookupField",
  ],
  model: "NOC.vc.l2domain.Model",
  search: true,
  helpId: "l2domain-profile",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;

    me.showMapButton = Ext.create("Ext.button.Button", {
      text: t("btn-show-map"),
      glyph: NOC.glyph.globe,
      scope: me,
      handler: me.onShowMap,
    });

    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 150,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-obj"),
          dataIndex: "count",
          width: 30,
          align: "right",
          sortable: false,
          renderer: NOC.render.Badge,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "profile",
          xtype: "vc.l2domainprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: false,
        },
        {
          name: "vlan_template",
          xtype: "vc.vlantemplate.LookupField",
          fieldLabel: t("app-title-vlantemplate"),
          allowBlank: true,
        },
        {
          name: "default_vlan_profile",
          xtype: "vc.vlanprofile.LookupField",
          fieldLabel: t("label-default-vlan-profile"),
          allowBlank: true,
        },
        {
          name: "vlan_discovery_policy",
          xtype: "combobox",
          fieldLabel: t("label-vlan-discovery-policy"),
          allowBlank: false,
          uiStyle: "medium",
          value: "P",
          store: [
            ["P", "Profile"],
            ["D", "Disable"],
            ["E", "Enable"],
            ["S", "Status Only"],
          ],
        },
        {
          name: "vlan_discovery_filter",
          xtype: "vc.vlanfilter.LookupField",
          fieldLabel: t("label-vlan-discovery-filter"),
          allowBlank: true,
        },
        {
          name: "pools",
          xtype: "gridfield",
          fieldLabel: t("label-vlan-pools"),
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
            {
              text: t("app-title-vlanfilter"),
              dataIndex: "vlan_filter",
              width: 200,
              editor: {
                xtype: "vc.vlanfilter.LookupField",
              },
              renderer: NOC.render.Lookup("vlan_filter"),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "remote_id",
              xtype: "textfield",
              fieldLabel: t("label-remote-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "bi_id",
              xtype: "displayfield",
              fieldLabel: t("label-bi-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "allow_models": ["vc.L2Domain"],
          },
        },
      ],

      formToolbar: [
        me.showMapButton,
        me.cardButton,
      ],
    });
    me.callParent();
  },
  //
  onShowMap: function(){
    var me = this;
    NOC.launch("inv.map", "history", {
      args: ["l2domain", me.currentRecord.get("id")],
    });
  },
  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/l2domain/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});
