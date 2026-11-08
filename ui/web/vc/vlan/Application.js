//---------------------------------------------------------------------
// vc.vlan application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.vlan.Application");

Ext.define("NOC.vc.vlan.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.vc.vlan.Model",
    "NOC.vc.vlanprofile.LookupField",
    "NOC.core.combotree.ComboTree",
    "NOC.core.label.LabelField",
    "NOC.core.TemplatePreview",
    "NOC.core.StateField",
    "NOC.project.project.LookupField",
    "NOC.vc.l2domain.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.vc.vlan.AddVLANForm",
  ],
  model: "NOC.vc.vlan.Model",
  search: true,
  helpId: "reference-vlan",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;

    me.addVLANForm = Ext.create("NOC.vc.vlan.AddVLANForm", {app: me});

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
          text: t("header-l2-domain"),
          dataIndex: "l2_domain",
          width: 150,
          renderer: NOC.render.Lookup("l2_domain"),
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 150,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 150,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("app-title-vlan"),
          dataIndex: "vlan",
          width: 75,
        },
        {
          text: t("header-int"),
          dataIndex: "interfaces_count",
          width: 50,
          sortable: false,
          align: "right",
          renderer: NOC.render.Clickable,
          onClick: me.onInterfacesCellClick,
        },
        {
          text: t("header-prefixes"),
          dataIndex: "prefixes",
          width: 100,
          sortable: false,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "profile",
          xtype: "vc.vlanprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "vlan",
          xtype: "numberfield",
          fieldLabel: t("app-title-vlan"),
          allowBlank: false,
          uiStyle: "small",
          minValue: 1,
          maxValue: 4095,
        },
        {
          name: "l2_domain",
          xtype: "vc.l2domain.LookupField",
          fieldLabel: t("header-l2-domain"),
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: false,
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "right",
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
          xtype: "fieldset",
          layout: "hbox",
          title: t("header-discovery"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "first_discovered",
              xtype: "displayfield",
              fieldLabel: t("label-discovered"),
              allowBlank: true,
            },
            {
              name: "last_seen",
              xtype: "displayfield",
              fieldLabel: t("header-last-seen-20c226"),
              allowBlank: true,
            },
            {
              name: "expired",
              xtype: "displayfield",
              fieldLabel: t("header-expired"),
              allowBlank: true,
            },
          ],
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "allow_models": "vc.VLAN",
          },
        },
      ],

      gridToolbar: [
        {
          itemId: "allocate_vlan",
          text: t("btn-allocate-vlan"),
          glyph: NOC.glyph.plus_circle,
          tooltip: t("btn-allocate-vlan"),
          hasAccess: NOC.hasPermission("create"),
          scope: me,
          handler: me.onAllocateVLAN,
        },
      ],

      formToolbar: [
        {
          itemId: "interfaces",
          text: t("btn-vlan-interfaces"),
          glyph: NOC.glyph.list,
          tooltip: t("help-show-vlan-interfaces"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onVLANInterfaces,
        },
        me.cardButton,
      ],
    });

    me.ITEM_VLAN_INTERFACES = me.registerItem(
      Ext.create("NOC.core.TemplatePreview", {
        app: me,
        previewName: new Ext.XTemplate("Interfaces in VLAN {name} ({segment__label} VLAN {vlan})"),
        template: new Ext.XTemplate(
          '<div class="noc-tp">\n' +
                    '    <table class="noc-report">\n' +
                    "        <!-- Untagged interfaces -->\n" +
                    '        <tpl if="interfaces.untagged.length">\n' +
                    '        <tr><th colspan="2">Untagged interfaces</th>\n' +
                    '            <tpl foreach="interfaces.untagged">\n' +
                    "        <tr>\n" +
                    '            <td style="width: 200px">{managed_object_name}</td>\n' +
                    "            <td>\n" +
                    '                <tpl foreach="interfaces">{name}, </tpl>\n' +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "        </tpl>\n" +
                    "        </tpl>\n" +
                    "        <!-- Tagged interfaces -->\n" +
                    '        <tpl if="interfaces.tagged.length">\n' +
                    '        <tr><th colspan="2">Tagged interfaces</th>\n' +
                    '            <tpl foreach="interfaces.tagged">\n' +
                    "        <tr>\n" +
                    '            <td style="width: 200px">{managed_object_name}</td>\n' +
                    "            <td>\n" +
                    '                <tpl foreach="interfaces">{name}, </tpl>\n' +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "        </tpl>\n" +
                    "        </tpl>\n" +
                    "        <!-- L3 interfaces -->\n" +
                    '        <tpl if="interfaces.l3.length">\n' +
                    '        <tr><th colspan="2">L3 interfaces</th>\n' +
                    '            <tpl foreach="interfaces.l3">\n' +
                    "        <tr>\n" +
                    '            <td style="width: 200px">{managed_object_name}</td>\n' +
                    "            <td>\n" +
                    '                <tpl foreach="interfaces">\n' +
                    "                {name}: " +
                    "                {ipv4_addresses}\n" +
                    "                {ipv6_addresses}\n" +
                    "                </tpl>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "        </tpl>\n" +
                    "        </tpl>\n" +
                    "    </table>\n" +
                    "</div>"),
      }),
    );
    me.callParent();
  },
    
  // Show interfaces window
  showVLANInterfaces: function(record){
    var me = this;
    NOC.api.requestLegacy({
      url: "/vc/vlan/" + record.get("id") + "/interfaces/",
      method: "GET",
      scope: me,
      success: function(response){
        var r = Ext.decode(response.responseText);
        if(!r.tagged && !r.untagged && !r.l3){
          NOC.info(t("msg-no-interfaces-found"));
        } else{
          var item = me.showItem(me.ITEM_VLAN_INTERFACES);
          item.preview(record, {interfaces: r});
        }
      },
      failure: function(){
        NOC.error(t("msg-failed-to-get-interfaces"));
      },
    });
  },

  onAllocateVLAN: function(){
    var me = this;

    me.addVLANForm.show();
  },

  onVLANInterfaces: function(){
    var me = this;
    me.showVLANInterfaces(me.currentRecord);
  },
  //
  onInterfacesCellClick: function(record){
    var me = this;
    me.showVLANInterfaces(record);
  },
  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/vlan/" + me.currentRecord.get("id") + "/",
      );
    }
  },
  filters: [
    {
      title: t("app-title-by-l2-domain"),
      name: "l2_domain",
      ftype: "lookup",
      lookup: "vc.l2domain",
    },
    {
      title: t("app-title-by-state"),
      name: "state",
      ftype: "lookup",
      lookup: "main.resourcestate",
    },
  ],
});
