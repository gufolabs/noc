//---------------------------------------------------------------------
// gis.building application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.gis.building.Application");

Ext.define("NOC.gis.building.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.ComboBox",
    "NOC.gis.building.Model",
    "NOC.gis.building.AddressesModel",
    "NOC.gis.building.FillEntrancesForm",
    "NOC.gis.division.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.gis.building.Model",
  search: true,
  treeFilter: "adm_division",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("app-title-address"),
          dataIndex: "full_path",
          flex: 1,
        },
        {
          text: t("header-floors"),
          dataIndex: "floors",
          width: 75,
          align: "right",
        },
        {
          text: t("header-homes"),
          dataIndex: "homes",
          width: 75,
          align: "right",
        },
        {
          text: t("app-title-remotesystem"),
          dataIndex: "remote_system",
          flex: 1,
          sort: false,
        },
        {
          text: t("header-remote-id"),
          dataIndex: "remote_id",
          flex: 1,
          sort: false,
        },
      ],
      fields: [
        {
          name: "full_path",
          xtype: "displayfield",
          fieldLabel: t("app-title-address"),
        },
        {
          name: "adm_division",
          xtype: "gis.division.LookupField",
          fieldLabel: t("label-administrative-division"),
          allowBlank: false,
        },
        {
          name: "status",
          xtype: "combobox",
          fieldLabel: t("header-status"),
          allowBlank: false,
          store: [
            ["P", "PROJECT"],
            ["B", "BUILDING"],
            ["R", "READY"],
            ["E", "EVICTED"],
            ["D", "DEMOLISHED"],
          ],
          defaultValue: "R",
        },
        {
          name: "postal_code",
          xtype: "textfield",
          fieldLabel: t("label-postal-code"),
          allowBlank: true,
        },
        {
          name: "floors",
          xtype: "numberfield",
          fieldLabel: t("header-floors"),
          allowBlank: true,
        },
        {
          name: "homes",
          xtype: "numberfield",
          fieldLabel: t("header-homes"),
          allowBlank: true,
        },
        {
          xtype: "fieldcontainer",
          layout: "hbox",
          items: [
            {
              name: "has_cellar",
              xtype: "checkboxfield",
              boxLabel: t("label-cellar"),
            },
            {
              name: "has_attric",
              xtype: "checkboxfield",
              boxLabel: t("label-attic"),
            },
            {
              name: "is_administrative",
              xtype: "checkboxfield",
              boxLabel: t("label-administrative"),
            },
            {
              name: "is_habitated",
              xtype: "checkboxfield",
              boxLabel: t("label-habitated"),
            },
          ],
        },
        {
          xtype: "dictfield",
          name: "data",
          fieldLabel: t("app-title-data"),
          allowBlank: true,
        },
        {
          xtype: "gridfield",
          name: "entrances",
          fieldLabel: t("label-entrances"),
          allowBlank: true,
          columns: [
            {
              text: t("header-number"),
              dataIndex: "number",
              width: 75,
              editor: "textfield",
            },
            {
              text: t("header-first-floor"),
              dataIndex: "first_floor",
              width: 75,
              editor: "textfield",
            },
            {
              text: t("header-last-floor"),
              dataIndex: "last_floor",
              width: 75,
              editor: "textfield",
            },
            {
              text: t("header-first-home"),
              dataIndex: "first_home",
              width: 75,
              editor: "textfield",
            },
            {
              text: t("header-last-home"),
              dataIndex: "last_home",
              width: 75,
              editor: "textfield",
            },
          ],
          toolbar: [
            {
              text: t("btn-fill-entrances"),
              glyph: NOC.glyph.plus_square,
              scope: me,
              handler: me.onFillEntrances,
            },
          ],
        },
      ],
      inlines: [
        {
          title: t("header-addresses"),
          model: "NOC.gis.building.AddressesModel",
          columns: [
            {
              text: t("header-primary"),
              dataIndex: "is_primary",
              width: 50,
              renderer: NOC.render.Bool,
              editor: {
                xtype: "checkboxfield",
                listeners: {
                  scope: me,
                  change: me.onPrimaryAddressChange,
                },
              },
            },
            {
              text: t("app-title-street"),
              dataIndex: "street",
              width: 150,
              renderer: NOC.render.Lookup("street"),
              editor: {
                xtype: "core.combo",
                restUrl: "/gis/street/",
                displayField: "name",
              },
            },
            {
              text: t("header-num"),
              dataIndex: "num",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-num2"),
              dataIndex: "num2",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-num-letter"),
              dataIndex: "num_letter",
              width: 50,
              editor: "textfield",
            },
            {
              text: t("header-build"),
              dataIndex: "build",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-build-letter"),
              dataIndex: "build_letter",
              width: 50,
              editor: "textfield",
            },
            {
              text: t("header-struct"),
              dataIndex: "struct",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-struct2"),
              dataIndex: "struct2",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-struct-letter"),
              dataIndex: "struct_letter",
              width: 50,
              editor: "textfield",
            },
            {
              text: t("header-estate"),
              dataIndex: "estate",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-estate2"),
              dataIndex: "estate2",
              width: 50,
              editor: "numberfield",
            },
            {
              text: t("header-est-letter"),
              dataIndex: "estate_letter",
              width: 50,
              editor: "textfield",
            },
            {
              text: t("header-full-number"),
              dataIndex: "text_address",
              flex: 1,
            },
          ],
        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-parent"),
      name: "adm_division",
      ftype: "lookup",
      lookup: "gis.division",
    },
  ],
  //
  onPrimaryAddressChange: function(checkbox, newValue){
    var grid = checkbox.column.up("gridpanel"),
      store = grid.getStore(),
      sLen = store.getCount();
    if(sLen === 1){
      // Only one value
      if(!newValue){
        // Restore primary address
        store.getAt(0).set("is_primary", true);
      }
    } else{
      if(!newValue){
        // Resetting primary address
        checkbox.setValue(true);
      } else{
        // Resetting all other values
        var currentId = grid.getSelectionModel().getSelection()[0].get("id");
        store.each(function(r){
          if(r.get("id") !== currentId){
            r.set("is_primary", false);
          }
        });
      }
    }
  },
  //
  onFillEntrances: function(){
    var me = this;
    Ext.create("NOC.gis.building.FillEntrancesForm", {app: me});
  },
  //
  fillEntrances: function(cfg){
    var me = this,
      entrance = parseInt(cfg.first_entrance),
      firstHome = parseInt(cfg.first_home),
      nEntrances = parseInt(cfg.n_entrances),
      firstFloor = cfg.first_floor,
      lastFloor = cfg.last_floor,
      homesPerEntrance = parseInt(cfg.homes_per_entrance),
      result = me.currentRecord.get("entrances") || [],
      i;
    for(i = 0; i < nEntrances; i++){
      result.push({
        number: String(entrance),
        first_floor: firstFloor,
        last_floor: lastFloor,
        first_home: String(firstHome),
        last_home: String(firstHome + homesPerEntrance - 1),
      });
      entrance += 1;
      firstHome += homesPerEntrance;

    }
    me.currentRecord.set("entrances", result);
    me.form.setValues({entrances: result});
    // Update floors
    if(!parseInt(me.form.getValues().floors)){
      me.form.setValues({floors: lastFloor});
    }
    // Update homes
    if(!parseInt(me.form.getValues().homes)){
      var homes = 0;
      for(i = 0; i < result.length; i++){
        var r = result[i],
          f = parseInt(r.first_home),
          l = parseInt(r.last_home);
        if(f && l && f <= l){
          homes += l - f + 1;
        }
      }
      if(homes){
        me.form.setValues({homes: String(homes)});
      }
    }
  },
});
