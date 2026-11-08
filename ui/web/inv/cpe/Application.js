//---------------------------------------------------------------------
// inv.cpe application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.cpe.Application");

Ext.define("NOC.inv.cpe.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.StateField",
    "NOC.inv.cpe.Model",
    "NOC.inv.cpeprofile.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.sa.managedobject.LookupField",
    "NOC.inv.capability.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "NOC.core.label.LabelField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.cpe.Model",
  search: true,
  helpId: "reference-cpe",

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-global-id"),
          dataIndex: "global_id",
          width: 160,
        },
        {
          text: t("header-label"),
          dataIndex: "label",
          width: 160,
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
          width: 200,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("label-controller"),
          dataIndex: "controller",
          renderer: NOC.render.Lookup("controller"),
          width: 160,
        },
        {
          text: t("header-local-id-2"),
          dataIndex: "local_id",
          width: 160,
        },
        {
          text: t("header-oper-status"),
          dataIndex: "oper_status",
          width: 60,
          renderer: NOC.render.Bool,
          sortable: false,
        },
      ],

      fields: [
        {
          name: "profile",
          xtype: "inv.cpeprofile.LookupField",
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
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          query: {
            "allow_models": ["inv.CPE"],
          },
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "global_id",
          xtype: "textfield",
          fieldLabel: t("label-global-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "address",
          xtype: "textfield",
          fieldLabel: t("app-title-address"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-network-resources"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "controller",
              xtype: "sa.managedobject.LookupField",
              fieldLabel: t("header-managed-object-62561c"),
              allowBlank: true,
            },
            {
              name: "local_id",
              xtype: "textfield",
              fieldLabel: t("header-local-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "bi_id",
          xtype: "displayfield",
          fieldLabel: t("label-bi-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
        //{
        //    xtype: "fieldset",
        //    title: t("Resource Groups"),
        //    layout: "column",
        //    minWidth: me.formMinWidth,
        //    maxWidth: me.formMaxWidth,
        //    defaults: {
        //        columnWidth: 0.5,
        //        padding: 10
        //    },
        //    collapsible: true,
        //    collapsed: false,
        //    items: [
        //        {
        //            name: "static_service_groups",
        //            xtype: "gridfield",
        //            columns: [
        //                {
        //                    dataIndex: "group",
        //                    text: t("Static Service Groups"),
        //                    width: 350,
        //                    renderer: NOC.render.Lookup("group"),
        //                    editor: {
        //                        xtype: "inv.resourcegroup.LookupField"
        //                    }
        //                }
        //            ]
        //        },
        //        {
        //            name: "effective_service_groups",
        //            xtype: "gridfield",
        //            columns: [
        //                {
        //                    dataIndex: "group",
        //                    text: t("Effective Service Groups"),
        //                    width: 350,
        //                    renderer: NOC.render.Lookup("group"),
        //                    editor: {
        //                        xtype: "inv.resourcegroup.LookupField"
        //                    }
        //                }
        //            ]
        //        },
        //        {
        //            name: "static_client_groups",
        //            xtype: "gridfield",
        //            columns: [
        //                {
        //                    dataIndex: "group",
        //                    text: t("Static Client Groups"),
        //                    width: 350,
        //                    renderer: NOC.render.Lookup("group"),
        //                    editor: {
        //                        xtype: "inv.resourcegroup.LookupField"
        //                    }
        //                }
        //            ]
        //        },
        //        {
        //            name: "effective_client_groups",
        //            xtype: "gridfield",
        //            columns: [
        //                {
        //                    dataIndex: "group",
        //                    text: t("Effective Client Groups"),
        //                    width: 350,
        //                    renderer: NOC.render.Lookup("group"),
        //                    editor: {
        //                        xtype: "inv.resourcegroup.LookupField"
        //                    }
        //                }
        //            ]
        //        }
        //    ]
        //},
        {
          name: "controllers",
          xtype: "gridfield",
          fieldLabel: t("label-controllers"),
          allowBlank: true,
          columns: [
            {
              text: t("header-name"),
              dataIndex: "managed_object",
              renderer: NOC.render.Lookup("managed_object"),
              width: 250,
              editor: "sa.managed_object.LookupField",
            },
            {
              text: t("header-localid"),
              dataIndex: "local_id",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-active"),
              dataIndex: "is_active",
              width: 25,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-interface"),
              dataIndex: "interface",
              width: 100,
              editor: "textfield",
            },
          ],
        },
        {
          name: "caps",
          xtype: "gridfield",
          fieldLabel: t("header-capabilities"),
          allowBlank: true,
          columns: [
            {
              text: t("header-name"),
              dataIndex: "capability",
              renderer: NOC.render.Lookup("capability"),
              width: 250,
              editor: "inv.capability.LookupField",
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              flex: 1,
              editor: "textfield",
            },
            {
              text: t("header-source"),
              dataIndex: "source",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-scope"),
              dataIndex: "scope",
              width: 50,
              editor: "textfield",
            },
          ],
        },
      ],
    });
    me.callParent();
  },

  filters: [
    {
      title: t("choice-by-profile"),
      name: "profile",
      ftype: "lookup",
      lookup: "inv.cpeprofile",
    },
    {
      title: t("app-title-by-state"),
      name: "state",
      ftype: "lookup",
      lookup: "wf.state",
    },
    {
      title: t("app-title-by-object"),
      name: "controller",
      ftype: "lookup",
      lookup: "sa.managedobject",
    },
  ],

  onPreview: function(record){
    window.open(
      "/api/card/view/cpe/"
            + record.get("id")
            + "/",
    )
  },
});
