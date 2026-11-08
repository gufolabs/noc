//---------------------------------------------------------------------
// phone.phonenumber application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.phone.phonenumber.Application");

Ext.define("NOC.phone.phonenumber.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.StateField",
    "NOC.phone.phonenumber.Model",
    "NOC.phone.dialplan.LookupField",
    "NOC.phone.phonenumberprofile.LookupField",
    "NOC.phone.numbercategory.LookupField",
    "NOC.phone.phonerange.TreeCombo",
    "NOC.phone.phonerange.LookupField",
    "NOC.project.project.LookupField",
    "NOC.phone.phonenumber.LookupField",
    "NOC.sa.administrativedomain.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "NOC.wf.state.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.phone.phonenumber.Model",
  rowClassField: "row_class",
  search: true,
  helpId: "reference-phone-number",

  protocolStore: [
    ["SIP", "SIP"],
    ["H323", "H.323"],
    ["SS7", "SS7"],
    ["MGCP", "MGCP"],
    ["H247", "H.247"],
    ["ISDN", "ISDN"],
    ["Skinny", "Skinny"],
  ],

  initComponent: function(){
    var me = this;

    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    Ext.apply(me, {
      columns: [
        {
          text: t("header-dialplan"),
          dataIndex: "dialplan",
          width: 150,
          renderer: NOC.render.Lookup("dialplan"),
        },
        {
          text: t("header-number"),
          dataIndex: "number",
          width: 100,
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 200,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-protocol"),
          dataIndex: "protocol",
          width: 50,
        },
        {
          text: t("header-range"),
          dataIndex: "phone_range",
          width: 150,
          renderer: NOC.render.Lookup("phone_range"),
        },
        {
          text: t("header-category"),
          dataIndex: "category",
          width: 150,
          renderer: NOC.render.Lookup("category"),
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 150,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-administrative-domain-d113be"),
          dataIndex: "administrative_domain",
          width: 100,
          renderer: NOC.render.Lookup("administrative_domain"),
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],

      fields: [
        {
          name: "dialplan",
          xtype: "phone.dialplan.LookupField",
          fieldLabel: t("header-dialplan"),
          allowBlank: false,
        },
        {
          name: "number",
          xtype: "textfield",
          fieldLabel: t("header-number"),
          regex: /^\d+$/,
          regexText: t("msg-must-contain-only-numbers"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "profile",
          xtype: "phone.phonenumberprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: true,
        },
        {
          name: "phone_range",
          xtype: "phone.phonerange.LookupField",
          fieldLabel: t("header-range"),
          allowBlank: true,
          disabled: true,
        },
        {
          name: "category",
          xtype: "phone.numbercategory.LookupField",
          fieldLabel: t("header-category"),
          allowBlank: true,
        },
        {
          name: "protocol",
          xtype: "combobox",
          fieldLabel: t("header-protocol"),
          allowBlank: false,
          store: me.protocolStore,
          uiStyle: "medium",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
        },
        {
          name: "administrative_domain",
          xtype: "sa.administrativedomain.LookupField",
          fieldLabel: t("header-adm-domain"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("nav-resourcegroup"),
          layout: "column",
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: {
            columnWidth: 0.5,
            padding: 10,
          },
          collapsible: true,
          collapsed: false,
          items: [
            {
              name: "static_service_groups",
              xtype: "gridfield",
              columns: [
                // {
                //     xtype: "glyphactioncolumn",
                //     width: 20,
                //     sortable: false,
                //     items: [
                //         {
                //             glyph: NOC.glyph.search,
                //             tooltip: t("Show Card"),
                //             scope: me,
                //             handler: me.onShowResourceGroup
                //         }
                //     ]
                // },
                {
                  dataIndex: "group",
                  text: t("btn-static-service-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "inv.resourcegroup.LookupField",
                  },
                },
              ],
            },
            {
              name: "effective_service_groups",
              xtype: "gridfield",
              columns: [
                {
                  dataIndex: "group",
                  text: t("btn-effective-service-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "inv.resourcegroup.LookupField",
                  },
                },
              ],
            },
            {
              name: "static_client_groups",
              xtype: "gridfield",
              columns: [
                {
                  dataIndex: "group",
                  text: t("btn-static-client-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "inv.resourcegroup.LookupField",
                  },
                },
              ],
            },
            {
              name: "effective_client_groups",
              xtype: "gridfield",
              columns: [
                {
                  dataIndex: "group",
                  text: t("btn-effective-client-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "inv.resourcegroup.LookupField",
                  },
                },
              ],
            },
          ],
        },
      ],

      formToolbar: [
        me.cardButton,
      ],

      filters: [
        {
          title: t("app-title-by-dialplan"),
          name: "dialplan",
          ftype: "lookup",
          lookup: "phone.dialplan",
        },
        {
          title: t("app-title-by-range"),
          name: "phone_range",
          ftype: "tree",
          lookup: "phone.phonerange",
        },
        {
          title: t("app-title-by-category"),
          name: "category",
          ftype: "lookup",
          lookup: "phone.numbercategory",
        },
        {
          title: t("choice-by-profile"),
          name: "profile",
          ftype: "lookup",
          lookup: "phone.phonenumberprofile",
        },
        {
          title: t("app-title-by-state"),
          name: "state",
          ftype: "lookup",
          lookup: "wf.state",
        },
        {
          title: t("app-title-by-protocol"),
          name: "protocol",
          ftype: "choices",
          store: me.protocolStore,
        },
      ],
    });
    me.callParent();
  },

  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/phonenumber/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});
