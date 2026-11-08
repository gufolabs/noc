//---------------------------------------------------------------------
// sa.service application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.service.Application");

Ext.define("NOC.sa.service.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.StateField",
    "NOC.core.status.StatusField",
    "NOC.core.InlineGrid",
    "NOC.core.label.LabelField",
    "NOC.core.combotree.ComboTree",
    "NOC.core.plugins.DynamicModalEditing",
    "NOC.sa.service.Model",
    "NOC.sa.service.LookupField",
    "NOC.sa.service.TreeCombo",
    "NOC.sa.serviceprofile.LookupField",
    "NOC.crm.subscriber.LookupField",
    "NOC.crm.supplier.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.sa.managedobject.LookupField",
    "NOC.inv.capability.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "NOC.sa.service.InstancesPanel",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.sa.service.Model",
  search: true,
  helpId: "reference-service",

  initComponent: function(){
    let labelWidth = 125;
    this.instancesPanel = Ext.create("NOC.sa.service.InstancesPanel");
    this.subscriptionPanel = Ext.create("NOC.core.SubscriptionPanel");
    this.ITEM_INSTANCES = this.registerItem(this.instancesPanel);
    this.ITEM_SUBSCRIPTION = this.registerItem(this.subscriptionPanel);
    Ext.apply(this, {
      columns: [
        {
          text: t("header-s"),
          dataIndex: "oper_status",
          sortable: false,
          width: 30,
          renderer: function(value, metaData, record){
            var color;
            metaData.tdAttr = "data-qtip='<table style=\"font-size: 11px;\">" +
                            "<tr><td style=\"padding-right: 10px;\"><div class=\"noc-object-oper-state\" style=\"background: grey;\"></div></td><td>" + t("status-unknown") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: green;\"></div></td><td>" + t("msg-up") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: yellow;\"></div></td><td>" + t("msg-slightly-degraded") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: orange;\"></div></td><td>" + t("msg-degraded") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: red;\"></div></td><td>" + t("msg-down") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: linear-gradient(to right, green 50%, brown 50%);\"></div></td><td>" + t("msg-in-maintenance") + "</td></tr>" +
                "</table>'";
            switch(value){
              case "0":
                color = "grey";
                if(record.get("in_maintenance")){
                  color = "linear-gradient(to right, grey 50%, brown 50%)";
                }
                break;
              case "1":
                color = "green";
                if(record.get("in_maintenance")){
                  color = "linear-gradient(to right, green 50%, brown 50%)";
                }
                break;
              case "2":
                color = "yellow";
                if(record.get("in_maintenance")){
                  color = "linear-gradient(to right, yellow 50%, brown 50%)";
                }
                break;
              case "3":
                color = "orange";
                if(record.get("in_maintenance")){
                  color = "linear-gradient(to right, orange 50%, brown 50%)";
                }
                break;
              case "4":
                color = "red";
                if(record.get("in_maintenance")){
                  color = "linear-gradient(to right, red 50%, brown 50%)";
                }
                break;
            }

            return "<div class='noc-object-oper-state' style='background: " + color + "'></div>";
          },
        },
        {
          text: "<i class='fa fa-bell'></i>",
          tooltip: t("help-subscription"),
          dataIndex: "allow_subscribe",
          renderer: NOC.render.Subscribe,
        },
        {
          text: t("header-instances"),
          dataIndex: "instance_count",
          renderer: function(value, metaData){
            metaData.tdStyle = "text-decoration-line: underline;cursor: pointer;";
            return value;
          },
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 200,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-label"),
          dataIndex: "label",
          width: 260,
        },
        {
          text: t("header-subscriber"),
          dataIndex: "subscriber",
          width: 250,
          renderer: NOC.render.Lookup("subscriber"),
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 200,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-parent"),
          dataIndex: "parent",
          flex: 1,
        },
      ],
      fields: [
        {
          xtype: "fieldset",
          layout: "column",
          minWidth: this.formMinWidth,
          maxWidth: this.formMaxWidth,
          defaults: {
            xtype: "container",
            columnWidth: 0.5,
            layout: "form",
            padding: 10,
          },
          border: false,
          // margin: 0,
          padding: "5 15 0 15",
          items: [
            {
              border: false,
              items: [
                {
                  name: "name_template",
                  xtype: "textfield",
                  fieldLabel: t("label-name-template"),
                  tabIndex: 10,
                  minWidth: 200,
                  labelWidth: labelWidth,
                  allowBlank: true,
                },
                {
                  name: "profile",
                  xtype: "sa.serviceprofile.LookupField",
                  fieldLabel: t("header-profile"),
                  tabIndex: 20,
                  minWidth: 200,
                  labelWidth: labelWidth,
                  allowBlank: false,
                  autoFocus: true,
                },
                {
                  name: "description",
                  xtype: "textarea",
                  fieldLabel: t("label-description"),
                  labelWidth: labelWidth,
                  allowBlank: true,
                  tabIndex: 30,
                },
              ],
            },
            {
              border: false,
              items: [ // second column
                {
                  name: "diagnostics",
                  fieldLabel: t("label-diag"),
                  xtype: "statusfield",
                  allowBlank: true,
                },
                {
                  name: "labels",
                  fieldLabel: t("header-labels"),
                  tabIndex: 40,
                  xtype: "labelfield",
                  allowBlank: true,
                  minWidth: 100,
                  query: {
                    "allow_models": ["sa.Service"],
                  },
                },
                {
                  name: "bi_id",
                  xtype: "displayfield",
                  fieldLabel: t("label-bi-id"),
                  allowBlank: true,
                  renderer: NOC.clipboard,
                },
                {
                  name: "mappings",
                  xtype: "displayfield",
                  fieldLabel: t("label-mappings"),
                  allowBlank: true,
                  renderer: function(values){
                    if(values === undefined || values === null || Ext.isEmpty(values)){
                      return "-";
                    }
                    var isArray = Array.isArray(values),
                      v = isArray ? values : [values];
                    return v.map(function(value){
                      var mappingString = value.remote_system__label + ": " + value.remote_id;
                      if(Ext.isEmpty(value.url)){
                        return mappingString + NOC.clipboardIcon(value.remote_id);
                      }
                      return "<a href='" + value.url + "' target='_blank'>" + mappingString + "</a>"
                         + NOC.clipboardIcon(value.remote_id);
                    }).join("<br/>");
                  },
                },
              ],
            },
          ],
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          labelWidth: labelWidth,
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-referenced"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "parent",
              xtype: "sa.service.LookupField",
              fieldLabel: t("header-parent"),
              allowBlank: true,
            },
            {
              name: "subscriber",
              xtype: "crm.subscriber.LookupField",
              fieldLabel: t("header-subscriber"),
              allowBlank: true,
            },
            {
              name: "supplier",
              xtype: "crm.supplier.LookupField",
              fieldLabel: t("header-supplier"),
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-agreement"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "agreement_id",
              xtype: "textfield",
              fieldLabel: t("label-agreement-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "account_id",
              xtype: "textfield",
              fieldLabel: t("label-account-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "address",
              xtype: "textfield",
              fieldLabel: t("app-title-address"),
              allowBlank: true,
              uiStyle: "large",
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("header-cpe"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "cpe_serial",
              xtype: "textfield",
              fieldLabel: t("header-serial"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "cpe_mac",
              xtype: "textfield",
              fieldLabel: t("header-mac"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("nav-resourcegroup"),
          layout: "column",
          minWidth: this.formMinWidth,
          maxWidth: this.formMaxWidth,
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
          xtype: "fieldset",
          title: t("app-title-oper-status-transfer"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "status_transfer_policy",
              xtype: "combobox",
              fieldLabel: t("label-status-transfer-policy"),
              tooltip: t("help-transfer-oper-statuses-to-adjacent-services-br-d-disable-status-"),
              store: [
                ["D", t("status-disable")],
                ["P", t("choice-by-profile")],
                ["T", t("msg-transparent")],
                ["R", t("msg-by-rule")],
              ],
              allowBlank: true,
              value: "P",
              uiStyle: "medium",
              listeners: {
                render: this.addTooltip,
              },
            },
            {
              name: "dependency_services",
              fieldLabel: t("label-service-dependencies"),
              xtype: "gridfield",
              allowBlank: true,
              columns: [
                {
                  text: t("header-service"),
                  dataIndex: "service",
                  width: 200,
                  editor: "sa.service.LookupField",
                  allowBlank: true,
                  renderer: NOC.render.Lookup("service"),
                },
                {
                  text: t("header-group"),
                  dataIndex: "group",
                  renderer: NOC.render.Lookup("group"),
                  width: 200,
                  editor: {
                    xtype: "inv.resourcegroup.LookupField",
                  },
                },
                {
                  text: t("header-type"),
                  dataIndex: "type",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["S", "Service (Using)"],
                      ["C", "Client (Using)"],
                      ["T", "Parent (UP)"],
                      ["D", "Children (Down)"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "S": "Service (Using)",
                    "C": "Client (Using)",
                    "T": "Parent (UP)",
                    "D": "Children (Down)",
                  }),
                },
                {
                  text: t("btn-status-transfer"),
                  dataIndex: "oper_status_transfer",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["D", "Disable"],
                      ["S", "Send"],
                      ["R", "Received"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "D": "Disable",
                    "S": "Send",
                    "R": "Received",
                  }),
                },
                {
                  text: t("btn-min-status"),
                  dataIndex: "min_status",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
                {
                  text: t("btn-max-status"),
                  dataIndex: "max_status",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
                {
                  text: t("btn-set-status"),
                  dataIndex: "set_status",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
                {
                  text: t("btn-reg-instance"),
                  dataIndex: "register_instance",
                  width: 75,
                  renderer: NOC.render.Bool,
                  editor: "checkbox",
                },
                {
                  text: t("btn-include-res"),
                  dataIndex: "include_resources",
                  width: 75,
                  renderer: NOC.render.Bool,
                  editor: "checkbox",
                },
                {
                  text: t("header-instances"),
                  dataIndex: "active_instances",
                  width: 75,
                  editor: {
                    xtype: "numberfield",
                  },
                },
                {
                  text: t("btn-reserved"),
                  dataIndex: "reserve_instances",
                  width: 75,
                  editor: {
                    xtype: "numberfield",
                  },
                },
                {
                  text: t("header-name"),
                  dataIndex: "textfield",
                  width: 200,
                  editor: "textfield",
                },
                {
                  text: t("btn-port-range"),
                  dataIndex: "port_range",
                  width: 75,
                  editor: "textfield",
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-calculate-oper-status"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "calculate_status_function",
              xtype: "combobox",
              fieldLabel: t("label-calculate-oper-status-policy"),
              tooltip: t("help-calculate-oper-status-br-d-disable-status-transfer-br-r-transfer"),
              store: [
                ["D", t("status-disable")],
                ["P", t("choice-by-profile")],
                ["MX", t("msg-by-max-status")],
                ["MN", t("msg-by-min-status")],
                ["R", t("msg-by-rule")],
              ],
              allowBlank: true,
              value: "P",
              uiStyle: "medium",
              listeners: {
                render: this.addTooltip,
              },
            },
            {
              name: "calculate_status_rules",
              fieldLabel: t("label-calculate-status-rules"),
              xtype: "gridfield",
              allowBlank: true,
              columns: [
                {
                  text: t("btn-function"),
                  dataIndex: "weight_function",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["C", "Count"],
                      ["CP", "By Percent"],
                      ["MIN", "Minimal"],
                      ["MAX", "Maximum"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "C": "C",
                    "CP": "CP",
                    "MIN": "MIN",
                    "MAX": "MAX",
                  }),
                },
                {
                  text: t("btn-op"),
                  dataIndex: "op",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["<=", "<="],
                      ["=", "="],
                      [">=", ">="],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "<=": "<=",
                    "=": "=",
                    ">=": ">=",
                  }),
                },
                {
                  text: t("btn-weight"),
                  dataIndex: "weight",
                  editor: {
                    xtype: "numberfield",
                  },
                },
                {
                  text: t("btn-min-status"),
                  dataIndex: "min_status",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
                {
                  text: t("btn-max-status"),
                  dataIndex: "max_status",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
                {
                  text: t("btn-to-status"),
                  dataIndex: "set_status",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
              ],
            },
          ],
        },
      ],
      inlines: [
        {
          xtype: "inlinegrid",
          title: t("header-capabilities"),
          collapsible: true,
          collapsed: false,
          itemId: "sa-service-caps-inline",
          model: "NOC.sa.service.CapabilitiesModel",
          readOnly: true,
          bbar: {},
          plugins: [
            {
              ptype: "dynamicmodalediting",
              listeners: {
                canceledit: "onCancelEdit",
              },
            },
          ],
          columns: [
            {
              text: t("app-title-capability"),
              dataIndex: "capability",
              width: 200,
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              useModalEditor: true,
              urlPrefix: "/sa/service",
            },
            {
              text: t("header-scope"),
              dataIndex: "scope",
              width: 80,
            },
            {
              text: t("header-source"),
              dataIndex: "source",
              width: 70,
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
            },
          ],
        },
      ],
      formToolbar: [
        {
          text: t("header-instances"),
          scope: this,
          handler: this.onInstances,
        },
      ],
    });
    this.callParent();
    this.getRegisteredItem(this.ITEM_GRID).addListener("beforecellclick", this.onCellClick, this); 
  },
  //
  filters: [
    {
      title: t("app-title-by-service"),
      name: "parent",
      ftype: "tree",
      lookup: "sa.service",
    },
    {
      title: t("choice-by-profile"),
      name: "profile",
      ftype: "lookup",
      lookup: "sa.serviceprofile",
    },
    {
      title: t("label-by-service-group"),
      name: "effective_service_groups",
      ftype: "tree",
      lookup: "inv.resourcegroup",
    },
    {
      title: t("app-title-by-subscriber"),
      name: "subscriber",
      ftype: "lookup",
      lookup: "crm.subscriber",
    },
    {
      title: t("app-title-by-supplier"),
      name: "supplier",
      ftype: "lookup",
      lookup: "crm.supplier",
    },
    {
      title: t("app-title-by-state"),
      name: "state",
      ftype: "lookup",
      lookup: "wf.state",
    },
  ],
  //
  levelFilter: {
    icon: NOC.glyph.level_down,
    color: NOC.colors.level_down,
    filter: "parent",
    tooltip: t("help-parent-filter-2"),
  },
  //
  onPreview: function(record){
    window.open(
      "/api/card/view/service/"
            + record.get("id")
            + "/",
    )
  },
  //
  onInstances: function(){
    this.getRegisteredItem(this.ITEM_INSTANCES).load(this.currentRecord, "ITEM_FORM");
    this.showItem(this.ITEM_INSTANCES);
  },
  onCellClick: function(self, td, cellIndex, record, tr, rowIndex, e){
    var cellName = e.position.column.dataIndex;
    if(["instance_count", "allow_subscribe"].includes(cellName)){
      if(cellName === "allow_subscribe"){
        var subscriptionPanel = this.getRegisteredItem(this.ITEM_SUBSCRIPTION),
          subscriptionUrl = `sa.service/${record.id}/${subscriptionPanel.urlSuffix}/`;
        NOC.navigation.navigate(subscriptionUrl);
        subscriptionPanel.load(this.appId, record.get("id"), "ITEM_GRID");
        this.showItem(this.ITEM_SUBSCRIPTION);
        return false;
      }
      if(cellName === "instance_count"){
        var instancesPanel = this.getRegisteredItem(this.ITEM_INSTANCES),
          instancesUrl = `sa.service/${record.id}/${instancesPanel.urlSuffix}/`;
        NOC.navigation.navigate(instancesUrl);
        instancesPanel.load(this.appId, record.get("id"), "ITEM_GRID");
        this.showItem(this.ITEM_INSTANCES);
        return false;
      }
    }
    return true;
  },
});
