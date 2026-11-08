//---------------------------------------------------------------------
// cm.interfacevalidationpolicy application
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.cm.interfacevalidationpolicy.Application");

Ext.define("NOC.cm.interfacevalidationpolicy.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.cm.interfacevalidationpolicy.Model",
    "NOC.cm.confdbquery.LookupField",
    "NOC.fm.alarmclass.LookupField",
    "NOC.core.ListFormField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.cm.interfacevalidationpolicy.Model",
  search: true,

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
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
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "filter_query",
          xtype: "cm.confdbquery.LookupField",
          fieldLabel: t("label-filter-query"),
          query: {
            allow_interface_filter: true,
          },
          allowBlank: true,
        },
        {
          name: "rules",
          xtype: "listform",
          fieldLabel: t("header-rules"),
          items: [
            {
              name: "query",
              xtype: "cm.confdbquery.LookupField",
              fieldLabel: t("label-query"),
              query: {
                allow_interface_validation: true,
              },
              listeners: {
                scope: me,
                select: me.onSelectQuery,
              },
            },
            {
              name: "query_params",
              xtype: "gridfield",
              fieldLabel: t("label-query-parameters"),
              columns: [
                {
                  dataIndex: "name",
                  text: t("header-name"),
                  width: 150,
                },
                {
                  dataIndex: "type",
                  text: t("header-type"),
                  width: 70,
                },
                {
                  dataIndex: "value",
                  text: t("header-value"),
                  editor: "textfield",
                  width: 200,
                },
                {
                  dataIndex: "default",
                  text: t("header-default"),
                  width: 100,
                },
                {
                  dataIndex: "description",
                  text: t("label-description"),
                  flex: 1,
                },
              ],
            },
            {
              name: "filter_query",
              xtype: "cm.confdbquery.LookupField",
              fieldLabel: t("label-filter-query"),
              allowBlank: true,
              query: {
                allow_interface_filter: true,
              },
            },
            {
              name: "is_active",
              xtype: "checkbox",
              boxLabel: t("header-active"),
            },
            {
              name: "error_code",
              xtype: "textfield",
              fieldLabel: t("label-code"),
              allowBlank: true,
            },
            {
              name: "error_text_template",
              xtype: "textfield",
              fieldLabel: t("label-error-template"),
              placeHolder: "{{error}}",
              allowBlank: true,
              uiStyle: "extra",
            },
            {
              name: "alarm_class",
              xtype: "fm.alarmclass.LookupField",
              fieldLabel: t("app-title-alarmclass"),
              allowBlank: true,
            },
            {
              name: "is_fatal",
              xtype: "checkbox",
              boxLabel: t("label-fatal"),
            },
          ],
        },
      ],
    });
    me.callParent();
  },
  //
  onSelectQuery: function(field, record){
    var me = this;
    NOC.api.requestLegacy({
      url: "/cm/confdbquery/" + record.get("id") + "/",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        field.up().getForm().findField("query_params").setValue(data.params)
      },
    })
  },
});
