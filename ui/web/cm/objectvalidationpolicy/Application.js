//---------------------------------------------------------------------
// cm.objectvalidationpolicy application
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.cm.objectvalidationpolicy.Application");

Ext.define("NOC.cm.objectvalidationpolicy.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.cm.objectvalidationpolicy.Model",
    "NOC.cm.confdbquery.LookupField",
    "NOC.fm.alarmclass.LookupField",
    "NOC.core.ListFormField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.cm.objectvalidationpolicy.Model",
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
          labelAlign: "top",
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          labelAlign: "top",
          allowBlank: true,
        },
        {
          name: "filter_query",
          xtype: "cm.confdbquery.LookupField",
          fieldLabel: t("label-filter-query"),
          labelAlign: "top",
          query: {
            allow_object_filter: true,
          },
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "rules",
          xtype: "listform",
          fieldLabel: t("header-rules"),
          labelAlign: "top",
          items: [
            {
              name: "query",
              xtype: "cm.confdbquery.LookupField",
              fieldLabel: t("label-query"),
              query: {
                allow_object_validation: true,
              },
              listeners: {
                scope: me,
                select: me.onSelectQuery,
              },
              uiStyle: "large",
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
                allow_object_filter: true,
              },
              uiStyle: "large",
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
              uiStyle: "large",
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
        var data = Ext.decode(response.responseText),
          queryParamsField = field.up().getForm().findField("query_params"),
          rulesForm = field.up().up(),
          scrollPos = rulesForm.scroll;
        queryParamsField.setValue(data.params);
        rulesForm.scrollTo(scrollPos.x, scrollPos.y);
      },
    })
  },
});
