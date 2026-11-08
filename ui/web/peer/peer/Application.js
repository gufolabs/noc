//---------------------------------------------------------------------
// peer.peer application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.peer.Application");

Ext.define("NOC.peer.peer.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.StateField",
    "NOC.core.MonacoPanel",
    "NOC.core.label.LabelField",
    "NOC.peer.peer.Model",
    "NOC.peer.peeringpoint.LookupField",
    "NOC.peer.peerprofile.LookupField",
    "NOC.project.project.LookupField",
    "NOC.peer.as.LookupField",
  ],
  model: "NOC.peer.peer.Model",
  search: true,
  columns: [
    {
      text: t("header-s"),
      dataIndex: "oper_status",
      sortable: false,
      width: 30,
      renderer: function(value, metaData, record){
        var color;

        metaData.tdAttr = "data-qtip='<table style=\"font-size: 11px;\">" +
                            "<tr><td style=\"padding-right: 10px;\"><div class=\"noc-object-oper-state\" style=\"background: grey;\"></div></td><td>" + t("msg-idle") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: " + NOC.colors.emerald + ";\"></div></td><td>" + t("msg-established") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: " + NOC.colors.amethyst + ";\"></div></td><td>" + t("msg-openconfirm") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: orange;\"></div></td><td>" + t("msg-opensent") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: " + NOC.colors.pumpkin + ";\"></div></td><td>" + t("msg-connect") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: turquoise;\"></div></td><td>" + t("msg-active") + "</td></tr>" +
                            "<tr><td><div class=\"noc-object-oper-state\" style=\"background: linear-gradient(to right, green 50%, brown 50%);\"></div></td><td>" + t("msg-in-maintenance") + "</td></tr>" +
                "</table>'";
        switch(value){
          case "1":
            color = "grey";
            if(record.get("in_maintenance")){
              color = "linear-gradient(to right, grey 50%, brown 50%)";
            }
            break;
          case "2":
            color = NOC.colors.pumpkin;
            if(record.get("in_maintenance")){
              color = "linear-gradient(to right, pumpkin 50%, brown 50%)";
            }
            break;
          case "3":
            color = "turquoise";
            if(record.get("in_maintenance")){
              color = "linear-gradient(to right, turquoise 50%, brown 50%)";
            }
            break;
          case "4":
            color = "orange";
            if(record.get("in_maintenance")){
              color = "linear-gradient(to right, orange 50%, brown 50%)";
            }
            break;
          case "5":
            color = NOC.colors.amethyst;
            if(record.get("in_maintenance")){
              color = "linear-gradient(to right, amethyst 50%, brown 50%)";
            }
            break;
          case "6":
            color = NOC.colors.emerald;
            if(record.get("in_maintenance")){
              color = "linear-gradient(to right, emerald 50%, brown 50%)";
            }
            break;
        }

        return "<div class='noc-object-oper-state' style='background: " + color + "'></div>";
      },
    },
    {
      text: t("header-peering-point"),
      flex: 1,
      dataIndex: "peering_point",
      renderer: NOC.render.Lookup("peering_point"),
    },
    {
      text: t("app-title-peerprofile"),
      flex: 1,
      dataIndex: "profile",
      renderer: NOC.render.Lookup("profile"),
    },
    {
      text: t("label-project"),
      dataIndex: "project",
      renderer: NOC.render.Lookup("project"),
    },
    {
      text: t("header-local-as"),
      flex: 1,
      dataIndex: "local_asn",
      renderer: NOC.render.Lookup("local_asn"),
    },
    {
      text: t("header-remote-as"),
      flex: 1,
      dataIndex: "remote_asn",
    },
    {
      text: t("header-state"),
      dataIndex: "state",
      width: 150,
      renderer: NOC.render.Lookup("state"),
    },
    {
      text: t("header-import-filter"),
      flex: 1,
      dataIndex: "import_filter",
    },
    {
      text: t("header-export-filter"),
      flex: 1,
      dataIndex: "export_filter",
    },
    {
      text: t("header-local-address"),
      flex: 1,
      dataIndex: "local_ip",
    },
    {
      text: t("header-remote-address"),
      flex: 1,
      dataIndex: "remote_ip",
    },
    {
      text: t("label-tt"),
      flex: 1,
      dataIndex: "tt",
    },
    {
      text: t("label-description"),
      flex: 1,
      dataIndex: "description",
    },
    {
      text: t("header-import-communities"),
      flex: 1,
      dataIndex: "communities",
    },
    {
      text: t("header-labels"),
      flex: 1,
      dataIndex: "labels",
      renderer: NOC.render.LabelField,
    },
  ],
  fields: [
    {
      xtype: "fieldset",
      title: "Peering",
      collapsible: false,
      defaults: {
        labelWidth: 100,
        layout: {
          type: "hbox",
          defaultMargins: {top: 0, right: 5, bottom: 0, left: 0},
        },
      },
      items: [
        {
          name: "peering_point",
          xtype: "peer.peeringpoint.LookupField",
          fieldLabel: t("header-peering-point"),
          width: 400,
          allowBlank: false,
        },
        {
          name: "profile",
          xtype: "peer.peerprofile.LookupField",
          fieldLabel: t("app-title-peerprofile"),
          width: 400,
          allowBlank: false,
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          width: 400,
          allowBlank: true,
        },
        {
          name: "local_asn",
          xtype: "peer.as.LookupField",
          fieldLabel: t("header-local-as"),
          width: 400,
          allowBlank: false,
        },
        {
          name: "remote_asn",
          xtype: "numberfield",
          fieldLabel: t("header-remote-as"),
          hideTrigger: true,
          keyNavEnabled: false,
          mouseWheelEnabled: false,
          allowBlank: false,
          vtype: "ASN",
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: true,
        },

      ],
    },
    {
      xtype: "fieldset",
      title: "Link Addresses",
      collapsible: false,
      defaults: {
        labelWidth: 100,
        layout: {
          type: "hbox",
          defaultMargins: {top: 0, right: 5, bottom: 0, left: 0},
        },
      },
      items: [
        {
          name: "local_ip",
          xtype: "textfield",
          allowBlank: false,
          fieldLabel: t("label-local-ip"),
        },
        {
          name: "local_backup_ip",
          xtype: "textfield",
          fieldLabel: t("label-local-backup-ip"),
          allowBlank: true,
        },
        {
          name: "remote_ip",
          xtype: "textfield",
          allowBlank: false,
          fieldLabel: t("label-remote-ip"),
        },
        {
          name: "remote_backup_ip",
          xtype: "textfield",
          fieldLabel: t("label-remote-backup-ip"),
          allowBlank: true,
        },
      ],
    },
    {
      xtype: "fieldset",
      title: "Description",
      collapsible: false,
      defaults: {
        labelWidth: 100,
        layout: {
          type: "hbox",
          defaultMargins: {top: 0, right: 5, bottom: 0, left: 0},
        },
      },
      items: [
        {
          name: "description",
          xtype: "textfield",
          width: 400,
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "rpsl_remark",
          xtype: "textfield",
          width: 400,
          fieldLabel: t("label-rpsl-remark"),
          allowBlank: true,
        },
      ],
    },
    {
      xtype: "fieldset",
      title: "Filters and Limits",
      collapsible: false,
      defaults: {
        labelWidth: 100,
        layout: {
          type: "hbox",
          defaultMargins: {top: 0, right: 5, bottom: 0, left: 0},
        },
      },
      items: [
        {
          name: "import_filter",
          xtype: "textfield",
          width: 400,
          allowBlank: false,
          fieldLabel: t("header-import-filter"),
          emptytext: t("msg-any-2"),
        },
        {
          name: "export_filter",
          xtype: "textfield",
          width: 400,
          allowBlank: false,
          fieldLabel: t("header-export-filter"),
          emptytext: t("msg-any-2"),
        },
        {
          name: "import_filter_name",
          xtype: "textfield",
          width: 400,
          fieldLabel: t("label-import-filter-name"),
          allowBlank: true,
        },
        {
          name: "export_filter_name",
          xtype: "textfield",
          width: 400,
          fieldLabel: t("label-export-filter-name"),
          allowBlank: true,
        },
        {
          name: "max_prefixes",
          xtype: "numberfield",
          allowBlank: false,
          fieldLabel: t("label-max-prefixes"),
        },
        {
          name: "communities",
          xtype: "textfield",
          width: 400,
          fieldLabel: t("header-import-communities"),
          allowBlank: true,
        },
      ],
    },
    {
      xtype: "fieldset",
      title: "Preferences",
      collapsible: false,
      defaults: {
        labelWidth: 100,
        layout: {
          type: "hbox",
          defaultMargins: {top: 0, right: 5, bottom: 0, left: 0},
        },
      },
      items: [
        {
          name: "local_pref",
          xtype: "numberfield",
          fieldLabel: t("label-local-pref"),
          allowBlank: true,
        },
        {
          name: "import_med",
          xtype: "numberfield",
          fieldLabel: t("label-import-med"),
          allowBlank: true,
        },
        {
          name: "export_med",
          xtype: "numberfield",
          fieldLabel: t("label-export-med"),
          allowBlank: true,
        },
      ],
    },
    {
      xtype: "fieldset",
      title: "Labels",
      collapsible: false,
      defaults: {
        labelWidth: 100,
        layout: {
          type: "hbox",
          defaultMargins: {top: 0, right: 5, bottom: 0, left: 0},
        },
      },
      items: [
        {
          name: "tt",
          xtype: "numberfield",
          fieldLabel: t("label-tt"),
          allowBlank: true,
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          width: 400,
          query: {
            "enable_peer": true,
          },
        },
      ],
    },

  ],
  filters: [
    {
      title: t("choice-by-profile"),
      name: "profile",
      ftype: "lookup",
      lookup: "peer.peerprofile",
    },
    {
      title: t("app-title-by-state"),
      name: "state",
      ftype: "lookup",
      lookup: "wf.state",
    },
    {
      title: t("app-title-by-object"),
      name: "managed_object",
      ftype: "lookup",
      lookup: "sa.managedobject",
    },
  ],
  actions: [
    {
      title: "Mark as planned",
      action: "planned",
    },
    {
      title: "Mark as active",
      action: "active",
    },
    {
      title: "Mark as shutdown",
      action: "shutdown",
    },
  ],
  showOpError: function(action, op, status){
    var me = this;
    // Detect Syntax Errors
    if(status.traceback){
      NOC.error(status.traceback);
      return;
    }
    me.callParent([action, op, status]);
  },
  preview: {
    xtype: "NOC.core.MonacoPanel",
    syntax: "rpsl",
    previewName: "Peer RPSL: {0}",
    restUrl: "/peer/peer/{0}/repo/rpsl/",
  },
});
