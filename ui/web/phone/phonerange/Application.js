//---------------------------------------------------------------------
// phone.phonerange application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.phone.phonerange.Application");

Ext.define("NOC.phone.phonerange.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.StateField",
    "NOC.phone.phonerange.Model",
    "NOC.phone.dialplan.LookupField",
    "NOC.phone.phonerangeprofile.LookupField",
    "NOC.project.project.LookupField",
    "NOC.crm.supplier.LookupField",
    "NOC.sa.administrativedomain.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.phone.phonerange.Model",
  search: true,
  helpId: "reference-phonerange",
  rowClassField: "row_class",

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
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("header-from-number"),
          dataIndex: "from_number",
          width: 100,
        },
        {
          text: t("header-to-number"),
          dataIndex: "to_number",
          width: 100,
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 200,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-allocated-c249df"),
          dataIndex: "to_allocate_numbers",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-total"),
          dataIndex: "total_numbers",
          align: "right",
          width: 50,
        },
        {
          text: t("header-supplier"),
          dataIndex: "supplier",
          width: 100,
          renderer: NOC.render.Lookup("supplier"),
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
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "from_number",
          xtype: "textfield",
          regex: /^\d+$/,
          fieldLabel: t("header-from-number"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "to_number",
          xtype: "textfield",
          regex: /^\d+$/,
          fieldLabel: t("header-to-number"),
          allowBlank: false,
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
          xtype: "phone.phonerangeprofile.LookupField",
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
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
        },
        {
          name: "supplier",
          xtype: "crm.supplier.LookupField",
          fieldLabel: t("header-supplier"),
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
        {
          name: "to_allocate_numbers",
          xtype: "checkbox",
          boxLabel: t("label-allocate-numbers"),
        },
      ],

      formToolbar: [
        me.cardButton,
      ],
    });

    me.currentQuery = {
      "parent__exists": false,
    };

    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-dialplan"),
      name: "dialplan",
      ftype: "lookup",
      lookup: "phone.dialplan",
    },
    {
      title: t("app-title-by-range"),
      name: "parent",
      ftype: "tree",
      lookup: "phone.phonerange",
    },
    {
      title: t("app-title-by-supplier"),
      name: "supplier",
      ftype: "lookup",
      lookup: "crm.supplier",
    },
    {
      title: t("app-title-by-project"),
      name: "project",
      ftype: "lookup",
      lookup: "project.project",
    },
  ],
  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/phonerange/" + me.currentRecord.get("id") + "/",
      );
    }
  },
  levelFilter: {
    icon: NOC.glyph.level_down,
    color: NOC.colors.level_down,
    filter: "parent",
    tooltip: t("help-parent-filter"),
  },
});
