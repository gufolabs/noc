//---------------------------------------------------------------------
// fm.eventclass application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.eventclass.Application");

Ext.define("NOC.fm.eventclass.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.fm.eventclass.Model",
    "NOC.fm.eventclass.LookupField",
    "NOC.fm.alarmclass.LookupField",
    "Ext.ux.form.JSONField",
    "Ext.ux.form.StringsField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.fm.eventclass.Model",
  search: true,
  treeFilter: "category",
  //
  initComponent: function(){
    var me = this;

    me.actionStore = Ext.create("Ext.data.Store", {
      fields: ["id", "label"],
      data: [
        {id: "D", label: "Drop"},
        {id: "L", label: "Log"},
        {id: "A", label: "Archive"},
      ],
    });
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 250,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 30,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
      fields: [
        {
          xtype: "container",
          layout: "hbox",
          items: [
            {
              name: "name",
              xtype: "textfield",
              fieldLabel: t("header-name"),
              allowBlank: false,
              uiStyle: "large",
            },
            {
              name: "uuid",
              xtype: "displayfield",
              fieldLabel: t("label-uuid"),
            },
          ],
        },
        {
          xtype: "tabpanel",
          layout: "fit",
          autoScroll: true,
          anchor: "-0, -50",
          defaults: {
            autoScroll: true,
            layout: "anchor",
          },
          items: [
            {
              title: t("app-title-text"),
              items: [
                {
                  name: "description",
                  xtype: "textarea",
                  fieldLabel: t("label-description"),
                  uiStyle: "extra",
                },
                {
                  name: "subject_template",
                  xtype: "textfield",
                  fieldLabel: t("label-subject-template"),
                  uiStyle: "extra",
                  allowBlank: false,
                },
                {
                  name: "body_template",
                  xtype: "textarea",
                  fieldLabel: t("label-body-template"),
                  uiStyle: "extra",
                  allowBlank: false,
                },
                {
                  name: "symptoms",
                  xtype: "textarea",
                  fieldLabel: t("header-symptoms"),
                  uiStyle: "extra",
                  allowBlank: true,
                },
                {
                  name: "probable_causes",
                  xtype: "textarea",
                  fieldLabel: t("header-probable-causes"),
                  uiStyle: "extra",
                  allowBlank: true,
                },
                {
                  name: "recommended_actions",
                  xtype: "textarea",
                  fieldLabel: t("header-recommended-actions"),
                  uiStyle: "extra",
                  allowBlank: true,
                },
              ],
            },
            {
              title: t("app-title-action"),
              items: [
                {
                  name: "action",
                  xtype: "combobox",
                  fieldLabel: t("app-title-action"),
                  allowBlank: false,
                  store: me.actionStore,
                  queryMode: "local",
                  displayField: "label",
                  valueField: "id",
                },
                {
                  name: "link_event",
                  xtype: "checkboxfield",
                  boxLabel: t("label-link-event"),
                },
              ],
            },
            {
              title: t("app-title-variables"),
              items: [
                {
                  name: "vars",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("header-type"),
                      dataIndex: "type",
                      width: 100,
                      editor: {
                        xtype: "combobox",
                        store: [
                          "str",
                          "int", "float",
                          "ipv4_address", "ipv6_address", "ip_address",
                          "ipv4_prefix", "ipv6_prefix", "ip_prefix",
                          "mac", "interface_name", "oid",
                        ],
                      },
                    },
                    {
                      text: t("header-required"),
                      dataIndex: "required",
                      width: 50,
                      editor: "checkboxfield",
                      renderer: NOC.render.Bool,
                    },
                    {
                      text: t("btn-suppression"),
                      dataIndex: "match_suppress",
                      width: 50,
                      editor: "checkboxfield",
                      renderer: NOC.render.Bool,
                    },
                    {
                      text: t("label-description"),
                      dataIndex: "description",
                      flex: 1,
                      editor: "textfield",
                    },
                  ],
                },
              ],
            },
            {
              title: t("header-disposition"),
              items: [
                {
                  name: "disposition",
                  xtype: "gridfield",
                  fieldLabel: t("header-disposition"),
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("label-condition"),
                      dataIndex: "condition",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("app-title-action"),
                      dataIndex: "action",
                      width: 70,
                      editor: {
                        xtype: "combobox",
                        store: ["drop", "ignore", "raise", "clear"],
                      },
                    },
                    {
                      text: t("app-title-alarm"),
                      dataIndex: "alarm_class",
                      renderer: NOC.render.Lookup("alarm_class"),
                      width: 200,
                      editor: "fm.alarmclass.LookupField",
                    },
                    {
                      text: t("header-stop"),
                      dataIndex: "stop_disposition",
                      renderer: NOC.render.Bool,
                      width: 50,
                      editor: "checkbox",
                    },
                    {
                      text: t("header-managed-object-62561c"),
                      dataIndex: "managed_object",
                      editor: "textfield",
                      width: 100,
                    },
                    {
                      text: t("btn-var-map"),
                      dataIndex: "var_mapping",
                      renderer: NOC.render.JSON,
                      editor: "jsonfield",
                      flex: 1,
                    },
                  ],
                },
              ],
            },
            {
              title: t("btn-suppression"),
              items: [
                {
                  name: "deduplication_window",
                  xtype: "numberfield",
                  uiStyle: "small",
                  fieldLabel: t("label-deduplication-window"),
                  allowBlank: false,
                },
                {
                  name: "suppression_window",
                  xtype: "numberfield",
                  uiStyle: "small",
                  fieldLabel: t("label-suppression-window"),
                  allowBlank: false,
                },
                {
                  name: "ttl",
                  xtype: "numberfield",
                  uiStyle: "small",
                  fieldLabel: t("label-event-ttl"),
                  allowBlank: false,
                },
              ],
            },
            {
              title: t("nav-handler"),
              items: [
                {
                  xtype: "stringsfield",
                  name: "handlers",
                  fieldLabel: t("nav-handler"),
                },
              ],
            },
            {
              title: t("app-title-plugins"),
              items: [
                {
                  xtype: "gridfield",
                  name: "plugins",
                  fieldLabel: t("app-title-plugins"),
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      editor: "textfield",
                      width: 150,
                    },
                    {
                      text: t("btn-config"),
                      dataIndex: "config",
                      editor: "jsonfield",
                      flex: 1,
                      renderer: NOC.render.JSON,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      formToolbar: [
        {
          text: t("btn-json"),
          glyph: NOC.glyph.file,
          tooltip: t("help-view-as-json"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onJSON,
        },
      ],
    });
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/fm/eventclass/{0}/json/",
      previewName: "Event Class: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-link-event"),
      name: "link_event",
      ftype: "boolean",
    },
  ],
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
