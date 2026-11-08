//---------------------------------------------------------------------
// inv.interfaceprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.interfaceprofile.Application");

Ext.define("NOC.inv.interfaceprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.core.combotree.ComboTree",
    "NOC.core.tagfield.Tagfield",
    "NOC.inv.interfaceprofile.Model",
    "NOC.main.style.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "Ext.ux.form.MultiIntervalField",
    "Ext.ux.form.GridField",
    "NOC.pm.metrictype.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.cm.interfacevalidationpolicy.LookupField",
    "NOC.inv.ifdescpatterns.LookupField",
    "NOC.inv.capability.LookupField",
    "NOC.main.handler.LookupField",
    "NOC.wf.workflow.LookupField",
  ],
  model: "NOC.inv.interfaceprofile.Model",
  search: true,
  rowClassField: "row_class",
  validationModelId: "inv.InterfaceProfile",
  formMinWidth: 800,
  formMaxWidth: 1000,

  initComponent: function(){
    var me = this,
      fieldSetDefaults = {
        xtype: "container",
        padding: 5,
        layout: "form",
        columnWidth: 0.5,
      };
    ;

    me.validationSettingsButton = Ext.create("Ext.button.Button", {
      text: t("app-title-validation"),
      glyph: NOC.glyph.file,
      scope: me,
      handler: me.onValidationSettings,
    });

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
        },
        {
          text: t("header-match-expression"),
          dataIndex: "match_expression",
          width: 400,
          renderer: function(v){
            var labels = [], text;
            Ext.each(v, function(label){
              labels.push(NOC.render.Label({
                badges: label.badges,
                name: label.name,
                description: label.description || "",
                bg_color1: label.bg_color1 || 0,
                fg_color1: label.fg_color1 || 0,
                bg_color2: label.bg_color2 || 0,
                fg_color2: label.fg_color2 || 0,
              }));
            });
            text = labels.join("");
            return '<span data-qtitle="Match Expression" ' +
                                'data-qtip="' + text + '">' + text + "</span>";
          },
        },
        {
          text: t("header-link-events"),
          dataIndex: "link_events",
          renderer: function(value){
            return {
              "I": "Ignore",
              "L": "Log",
              "A": "Raise",
            }[value];
          },
        },
        {
          text: t("app-title-style"),
          dataIndex: "style",
          renderer: NOC.render.Lookup("style"),
        },
        {
          text: t("header-policy"),
          dataIndex: "discovery_policy",
          renderer: NOC.render.Choices({
            I: "Ignore",
            O: "Create new",
            R: "Replace",
            C: "Cloud",
          }),
        },
        {
          text: t("header-mac"),
          dataIndex: "mac_discovery_policy",
          renderer: NOC.render.Choices({
            e: t("msg-transit"),
            d: t("status-disable"),
            m: t("msg-management-vlan"),
            i: t("msg-direct-downlink"),
            c: t("msg-chained-downlink"),
            u: t("msg-direct-uplink"),
            C: t("msg-cloud-downlink"),
          }),
          width: 50,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
      fields: [
        {
          xtype: "fieldset",
          layout: "column",
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          border: false,
          items: [
            {
              name: "name",
              xtype: "textfield",
              fieldLabel: t("header-name"),
              width: 200,
              allowBlank: false,
            },
            {
              name: "bi_id",
              xtype: "displayfield",
              fieldLabel: t("label-bi-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("header-labels"),
              allowBlank: true,
              query: {
                "allow_models": ["inv.Interface"],
              },
            },
            {
              name: "description",
              xtype: "textarea",
              fieldLabel: t("label-description"),
              allowBlank: true,
            },
            {
              name: "style",
              xtype: "main.style.LookupField",
              fieldLabel: t("app-title-style"),
              allowBlank: true,
            },
            {
              name: "is_uni",
              xtype: "checkbox",
              boxLabel: t("label-user-interface"),
              allowBlank: true,
            },
            {
              name: "workflow",
              xtype: "wf.workflow.LookupField",
              fieldLabel: t("app-group-wf"),
              allowBlank: false,
            },
            {
              name: "dynamic_classification_policy",
              xtype: "combobox",
              fieldLabel: t("label-dynamic-classification-policy"),
              labelWidth: 200,
              allowBlank: false,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "D", label: "Disable"},
                  {id: "R", label: "By Rule"},
                ],
              },
              defaultValue: "R",
              uiStyle: "medium",
            },
            {
              name: "subinterface_apply_policy",
              xtype: "combobox",
              fieldLabel: t("label-subinterface-apply-policy"),
              labelWidth: 200,
              allowBlank: false,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "D", label: "Disable (Interface Only)"},
                  {id: "R", label: "By Rule"},
                  {id: "I", label: "Inherit From Interface"},
                ],
              },
              defaultValue: "D",
              uiStyle: "medium",
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "column",
          title: t("app-title-fm"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          collapsible: true,
          items: [
            {
              name: "link_events",
              xtype: "combobox",
              fieldLabel: t("header-link-events"),
              labelWidth: 200,
              allowBlank: false,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "I", label: "Ignore Link Events"},
                  {
                    id: "L",
                    label: "Log events, do not raise alarms",
                  },
                  {id: "A", label: "Raise alarms"},
                ],
              },
              uiStyle: "medium",
            },
            {
              name: "interface_validation_policy",
              xtype: "cm.interfacevalidationpolicy.LookupField",
              fieldLabel: t("label-validation-policy"),
              labelWidth: 200,
              allowBlank: true,
            },
            {
              name: "weight",
              xtype: "numberfield",
              labelWidth: 200,
              width: 50,
              fieldLabel: t("label-alarm-weight-2"),
              allowBlank: false,
              uiStyle: "small",
            },
            {
              name: "status_change_notification",
              xtype: "combobox",
              fieldLabel: t("label-status-change-notification"),
              allowBlank: true,
              labelWidth: 200,
              defaultValue: "d",
              store: [
                ["d", t("msg-disabled")],
                ["e", t("btn-enable-message")],
              ],
              uiStyle: "medium",
            },
            {
              name: "default_notification_group",
              xtype: "main.notificationgroup.LookupField",
              fieldLabel: t("label-status-change-notification"),
              labelWidth: 200,
              allowBlank: true,
            },
            {
              xtype: "checkbox",
              name: "enable_abduct_detection",
              boxLabel: t("label-enable-abduct-detection"),
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "column",
          title: t("header-discovery"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          collapsible: true,
          items: [
            {
              name: "discovery_policy",
              xtype: "combobox",
              fieldLabel: t("label-link-discovery-policy"),
              allowBlank: false,
              labelWidth: 200,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              defaultValue: "R",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "I", label: "Ignore"},
                  {id: "O", label: "Create new"},
                  {id: "R", label: "Replace"},
                  {id: "C", label: "Cloud"},
                ],
              },
              uiStyle: "medium",
            },
            {
              name: "status_discovery",
              xtype: "combobox",
              fieldLabel: t("label-status-discovery"),
              allowBlank: true,
              labelWidth: 200,
              defaultValue: "d",
              store: [
                ["d", t("msg-disabled")],
                ["e", t("label-enable")],
                ["c", t("btn-clear-alarm-2")],
                ["ca", t("btn-clear-alarm-if-admin-down")],
                ["rc", t("msg-raise-clear-alarm")],
              ],
              uiStyle: "medium",
            },
            {
              name: "mac_discovery_policy",
              xtype: "combobox",
              fieldLabel: t("label-mac-discovery-policy"),
              allowBlank: false,
              labelWidth: 200,
              defaultValue: "e",
              store: [
                ["e", t("msg-transit")],
                ["d", t("status-disable")],
                ["m", t("msg-management-vlan")],
                ["i", t("msg-direct-downlink")],
                ["c", t("msg-chained-downlink")],
                ["u", t("msg-direct-uplink")],
                ["C", t("msg-cloud-downlink")],
              ],
              uiStyle: "medium",
            },
            {
              name: "metric_collected_policy",
              xtype: "combobox",
              fieldLabel: t("label-metric-collected-policy"),
              allowBlank: true,
              labelWidth: 200,
              defaultValue: "e",
              store: [
                ["e", t("header-enabled")],
                ["da", t("btn-disable-if-admin-down")],
                ["do", t("btn-disable-if-oper-down")],
              ],
              uiStyle: "medium",
            },
            {
              name: "allow_lag_mismatch",
              xtype: "checkbox",
              boxLabel: t("label-allow-lag-mismatch"),
              allowBlank: true,
            },
            {
              name: "allow_subinterface_metrics",
              xtype: "checkbox",
              boxLabel: t("label-apply-metrics-to-subinterfaces"),
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "column",
          title: t("header-segment-44986c"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          items: [
            {
              name: "allow_autosegmentation",
              xtype: "checkbox",
              boxLabel: t("label-allow-autosegmentation"),
              allowBlank: true,
            },
            {
              name: "allow_vacuum_bulling",
              xtype: "checkbox",
              boxLabel: t("label-allow-vacuum-bulling"),
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "column",
          title: t("app-title-ifdesc-settings"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          items: [
            {
              name: "ifdesc_patterns",
              xtype: "inv.ifdescpatterns.LookupField",
              fieldLabel: t("label-patterns"),
              allowBlank: true,
            },
            {
              name: "ifdesc_handler",
              xtype: "main.handler.LookupField",
              fieldLabel: t("app-title-handler"),
              allowBlank: true,
              query: {
                allow_ifdesc: true,
              },
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "column",
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          defaults: fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          title: t("app-title-integration"),
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
              text: t("header-default-value"),
              dataIndex: "default_value",
              width: 150,
              editor: "textfield",
            },
            {
              text: t("header-allow-manual"),
              dataIndex: "allow_manual",
              width: 150,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
          ],
        },
        {
          xtype: "container",
          layout: "hbox",
          defaults: {
            padding: "0 8 0 0",
          },
          items: [
            {
              name: "metrics_default_interval",
              xtype: "numberfield",
              fieldLabel: t("label-default-interval-sec"),
              labelWidth: 200,
              allowBlank: false,
              uiStyle: "small",
              minValue: 0,
              listeners: {
                scope: me,
                change: function(_item, newValue){
                  me.form.findField("metrics_default_interval_calculated").setValue(newValue);
                },
              },
            },
            {
              name: "metrics_default_interval_calculated",
              xtype: "displayfield",
              renderer: NOC.render.Duration,
            },
          ],
        },
        {
          name: "metrics",
          xtype: "gridfield",
          fieldLabel: t("label-metrics"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          columns: [
            {
              text: t("app-title-metrictype"),
              dataIndex: "metric_type",
              width: 250,
              editor: {
                xtype: "pm.metrictype.LookupField",
              },
              renderer: NOC.render.Lookup("metric_type"),
            },
            {
              text: t("header-stored"),
              dataIndex: "is_stored",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("label-interval"),
              dataIndex: "interval",
              editor: {
                xtype: "numberfield",
                minValue: 0,
                defaultValue: 300,
              },
            },
          ],
        },
        {
          name: "match_rules",
          xtype: "listform",
          fieldLabel: t("label-match-rules"),
          rows: 5,
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          items: [
            {
              name: "dynamic_order",
              xtype: "numberfield",
              fieldLabel: t("label-dynamic-order"),
              allowBlank: false,
              defaultValue: 0,
              validator: function(value){
                let matchRulesField = this.up("[name=match_rules]");
                if(Ext.isEmpty(matchRulesField)){
                  return true;
                }
                let val = Number.parseInt(value, 10),
                  values = matchRulesField.getValue().map(r => r.dynamic_order),
                  withoutCurrent = values.filter(r => r !== val);
                if(values.length > 1 && values.length !== (withoutCurrent.length + 1)){
                  return t("msg-dynamic-order-must-be-unique");
                }
                return true;
              },
              listeners: {
                validitychange: this.onValidityChange,
              },
              uiStyle: "small",
            },
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: false,
              isTree: true,
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
              listeners: {
                validitychange: this.onValidityChange,
              },
            },
            {
              xtype: "core.tagfield",
              url: "/inv/resourcegroup/lookup/",
              fieldLabel: t("label-object-groups"),
              name: "resource_groups",
              allowBlank: true,
              uiStyle: "extra",
            },
          ],
          isValid: function(){
            let dynamicValues = this.getValue().map(r => r.dynamic_order),
              uniqueValues = new Set(dynamicValues),
              hasDynamicDuplicates = dynamicValues.length !== uniqueValues.size,
              isDynamicEmpty = dynamicValues.some(v => Ext.isEmpty(v)),
              hasEmptyLabels = this.getValue().some(r => Ext.isEmpty(r.labels) || !r.labels.length);
            return !hasDynamicDuplicates && !isDynamicEmpty && !hasEmptyLabels;
          },
        },
      ],
      formToolbar: [
        me.validationSettingsButton,
      ],
    },
    );
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-match-rules-labels"),
      name: "match_rules",
      ftype: "label",
      lookup: "main.handler.LookupField",
      pickerPosition: "left",
      isTree: true,
      filterProtected: false,
      treePickerWidth: 400,
      query_filter: {
        "allow_matched": true,
      },
    },
  ],
  //
  onValidationSettings: function(){
    var me = this;
    me.showItem(me.ITEM_VALIDATION_SETTINGS).preview(me.currentRecord);
  },
  //
  cleanData: function(v){
    Ext.each(v.metrics, function(m){
      if(m.low_error === ""){
        m.low_error = null;
      }
      if(m.low_warn === ""){
        m.low_warn = null;
      }
      if(m.high_warn === ""){
        m.high_warn = null;
      }
      if(m.high_error === ""){
        m.high_error = null;
      }
    });
  },
  //
  onValidityChange: function(field){
    var form = field.up("form"),
      listField = field.up("listform");

    if(!form || !listField){
      return;
    }
    var basicForm = form.getForm();

    if(listField.validate) listField.validate();
    if(basicForm.checkValidity){
      basicForm.checkValidity(listField);
    } else{
      var valid = basicForm.isValid();
      basicForm.fireEvent("validitychange", basicForm, valid);
    }
  },
});
