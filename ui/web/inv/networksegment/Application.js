//---------------------------------------------------------------------
// inv.networksegment application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.networksegment.Application");

Ext.define("NOC.inv.networksegment.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.inv.allocationgroup.LookupField",
    "NOC.inv.networksegment.Model",
    "NOC.inv.networksegment.TreeCombo",
    "NOC.inv.networksegment.EffectiveSettingsPanel",
    "NOC.inv.networksegmentprofile.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.vc.vlanfilter.LookupField",
    "NOC.vc.l2domain.LookupField",
    "NOC.vc.vlan.LookupField",
    "Ext.ux.form.DictField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.networksegment.Model",
  rowClassField: "row_class",
  search: true,
  helpId: "reference-network-segment",

  initComponent: function(){
    var me = this;

    me.ITEM_EFFECTIVE_SETTINGS = me.registerItem(
      "NOC.inv.networksegment.EffectiveSettingsPanel",
    );

    me.settingsButton = Ext.create("Ext.button.Button", {
      text: t("btn-effective-settings"),
      glyph: NOC.glyph.file,
      scope: me,
      handler: me.onEffectiveSettings,
    });

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
          text: t("header-parent"),
          dataIndex: "parent",
          width: 200,
          renderer: NOC.render.Lookup("parent"),
          hidden: true,
        },
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          width: 100,
          renderer: NOC.render.LabelField,
        },
        {
          text: t("status-redundant"),
          dataIndex: "is_redundant",
          width: 50,
          renderer: NOC.render.Lookup("is_redundant"),
        },
        {
          text: t("header-obj"),
          dataIndex: "count",
          width: 30,
          align: "right",
          sortable: false,
          renderer: NOC.render.Badge,
        },
        {
          text: t("header-max-links"),
          dataIndex: "max_shown_downlinks",
          width: 70,
        },
        {
          text: t("header-max-objects"),
          dataIndex: "max_objects",
          width: 70,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          uiStyle: "large",
          allowBlank: false,
        },
        Ext.create("NOC.inv.networksegment.TreeCombo", {
          name: "parent",
          emptyText: t("label-select-parent"),
          fieldLabel: t("header-parent"),
          listWidth: 0.6,
          labelAlign: "left",
          labelWidth: 100,
          margin: "0 0 5",
          allowBlank: true,
        }),
        {
          name: "profile",
          xtype: "inv.networksegmentprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          uiStyle: "extra",
          allowBlank: true,
        },
        Ext.create("NOC.inv.networksegment.TreeCombo", {
          name: "sibling",
          emptyText: t("label-select-sibling"),
          fieldLabel: t("label-sibling"),
          listWidth: 0.6,
          labelAlign: "left",
          labelWidth: 100,
          margin: "0 0 5",
          allowBlank: true,
        }),
        {
          name: "settings",
          xtype: "dictfield",
          fieldLabel: t("help-settings"),
        },
        {
          name: "max_shown_downlinks",
          xtype: "numberfield",
          fieldLabel: t("header-max-links"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "max_objects",
          xtype: "numberfield",
          fieldLabel: t("header-max-objects"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "horizontal_transit_policy",
          xtype: "combobox",
          fieldLabel: t("label-horizontal-transit-policy"),
          allowBlank: false,
          store: [
            ["E", t("msg-always-enable")],
            ["C", t("msg-calculate")],
            ["D", t("status-disable")],
            ["P", t("header-profile")],
          ],
          uiStyle: "medium",
        },
        {
          name: "enable_horizontal_transit",
          xtype: "checkbox",
          boxLabel: t("label-enable-horizontal-transit"),
        },
        {
          name: "vlan_border",
          xtype: "checkbox",
          boxLabel: t("label-vlan-border"),
        },
        {
          name: "allocation_group",
          xtype: "inv.allocationgroup.LookupField",
          fieldLabel: t("label-allocation-group"),
          allowBlank: true,
        },
        {
          name: "l2_domain",
          xtype: "vc.l2domain.LookupField",
          fieldLabel: t("header-l2-domain"),
          allowBlank: true,
        },
        {
          name: "vlan_translation",
          fieldLabel: t("header-vlan-translation"),
          xtype: "gridfield",
          allowBlank: true,
          columns: [
            {
              text: t("app-title-reportfilter"),
              dataIndex: "filter",
              width: 300,
              renderer: NOC.render.Lookup("filter"),
              editor: "vc.vlanfilter.LookupField",
            },
            {
              text: t("header-rule"),
              dataIndex: "rule",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["map", "map"],
                  ["push", "push"],
                ],
              },
            },
            {
              text: t("header-parent-vlan"),
              dataIndex: "parent_vlan",
              flex: 1,
              editor: "vc.vlan.LookupField",
              renderer: NOC.render.Lookup("parent_vlan"),
            },
          ],
        },
        {
          name: "l2_mtu",
          xtype: "numberfield",
          fieldLabel: t("label-l2-mtu"),
          allowBlank: true,
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
            "enable_networksegment": true,
          },
        },
      ],

      formToolbar: [
        me.settingsButton,
        me.showMapButton,
        me.cardButton,
      ],
    });
    me.callParent();
  },
  //
  onEffectiveSettings: function(){
    var me = this;
    me.previewItem(me.ITEM_EFFECTIVE_SETTINGS, me.currentRecord);
  },
  //
  onShowMap: function(){
    var me = this;
    NOC.launch("inv.map", "history", {
      args: ["segment", me.currentRecord.get("id")],
    });
  },
  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/segment/" + me.currentRecord.get("id") + "/",
      );
    }
  },
  filters: [
    {
      title: t("app-title-by-segment"),
      name: "parent",
      ftype: "tree",
      lookup: "inv.networksegment",
    },
    {
      title: t("choice-by-profile"),
      name: "profile",
      ftype: "lookup",
      lookup: "inv.networksegmentprofile",
    },
  ],
  levelFilter: {
    icon: NOC.glyph.level_down,
    color: NOC.colors.level_down,
    filter: "parent",
    tooltip: t("help-parent-filter"),
  },
});
