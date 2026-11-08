//---------------------------------------------------------------------
// dns.dnszone application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.dns.dnszone.Application");

Ext.define("NOC.dns.dnszone.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.dns.dnszone.Model",
    "NOC.dns.dnszone.RecordsModel",
    "NOC.dns.dnszone.RRTypeField",
    "NOC.dns.dnszoneprofile.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.project.project.LookupField",
  ],
  model: "NOC.dns.dnszone.Model",
  search: true,
  helpId: "reference-dns-zone",

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-gen"),
          dataIndex: "is_auto_generated",
          renderer: NOC.render.Bool,
          width: 30,
        },
        {
          text: t("header-type"),
          dataIndex: "type",
          renderer: NOC.render.Choices({
            "F": t("msg-fwd"),
            "4": t("msg-rev-ipv4"),
            "6": t("msg-rev-ipv6"),
          }),
          width: 30,
        },
        {
          text: t("header-serial"),
          dataIndex: "serial",
          width: 75,
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          renderer: NOC.render.Lookup("profile"),
          width: 100,
        },
        {
          text: t("label-project"),
          dataIndex: "project",
          renderer: NOC.render.Lookup("project"),
          width: 150,
        },
        {
          text: t("header-paid-till"),
          dataIndex: "paid_till",
          width: 100,
          format: "Y-m-d",
          startDay: 1,
          renderer: NOC.render.Date,
        },
        {
          text: t("header-notification"),
          dataIndex: "notification_group",
          renderer: NOC.render.Lookup("notification_group"),
          width: 100,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          renderer: NOC.render.LabelField,
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-domain"),
          allowBlank: false,
          autoFocus: true,
        },
        {
          name: "description",
          xtype: "textfield",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "is_auto_generated",
          xtype: "checkboxfield",
          boxLabel: t("label-auto-generated"),
          allowBlank: false,
        },
        {
          name: "serial",
          xtype: "displayfield",
          fieldLabel: t("header-serial"),
          allowBlank: false,
        },
        {
          name: "profile",
          xtype: "dns.dnszoneprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
        },
        {
          name: "notification_group",
          xtype: "main.notificationgroup.LookupField",
          fieldLabel: t("app-title-notificationgroup"),
          allowBlank: true,
        },
        {
          name: "paid_till",
          xtype: "datefield",
          startDay: 1,
          fieldLabel: t("header-paid-till"),
          allowBlank: true,
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "allow_models": ["dns.DNSZone"],
          },
        },
      ],
      inlines: [
        {
          title: t("header-records"),
          model: "NOC.dns.dnszone.RecordsModel",
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              width: 150,
              editor: "textfield",
            },
            {
              text: t("header-ttl"),
              dataIndex: "ttl",
              width: 110,
              align: "right",
              editor: "numberfield",
            },
            {
              text: t("header-type"),
              dataIndex: "type",
              width: 100,
              editor: {
                xtype: "dns.dnszone.RRTypeField",
                listeners: {
                  scope: me,
                  select: me.onSelectRRType,
                },
              },
            },
            {
              text: t("header-prio"),
              dataIndex: "priority",
              width: 75,
              align: "right",
              editor: "numberfield",
            },
            {
              text: t("header-content"),
              dataIndex: "content",
              flex: 1,
              editor: {
                xtype: "textfield",
                allowBlank: false,
              },
            },
            {
              text: t("header-labels"),
              dataIndex: "labels",
              width: 150,
              editor: "labelfield",
            },
          ],
        },
      ],
      formToolbar: [
        {
          text: t("help-preview"),
          glyph: NOC.glyph.search,
          tooltip: t("help-preview-zone"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onPreviewZone,
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
      lookup: "dns.dnszoneprofile",
    },
    {
      title: t("app-title-by-type"),
      name: "type",
      ftype: "choices",
      store: [
        ["F", t("msg-forward")],
        ["4", t("msg-ipv4-reverse")],
        ["6", t("msg-ipv6-reverse")],
      ],
    },
    {
      title: t("app-title-by-project"),
      name: "project",
      ftype: "lookup",
      lookup: "project.project",
    },
    {
      title: t("app-title-by-notification"),
      name: "notification_group",
      ftype: "lookup",
      lookup: "main.notificationgroup",
    },
    {
      title: t("choice-by-labels"),
      name: "labels",
      ftype: "label",
    },
  ],
  preview: {
    previewName: "Zone: {0}",
    restUrl: "/dns/dnszone/{0}/repo/zone/",
    xtype: "NOC.core.MonacoPanel",
  },
  // Check RRType accepts priority field
  isPriorityVisible: function(rrType){
    return (
      (rrType === "MX") ||
            (rrType === "SRV")
    );
  },

  onSelectRRType: function(combo){
    var me = this,
      rrType = combo.getValue(),
      priorityCombo = combo.ownerCt.items.items[3];
    priorityCombo.setDisabled(!me.isPriorityVisible(rrType));
  },

  onInlineBeforeEdit: function(plugin, context){
    var me = this,
      priorityCombo = plugin.editor.items.items[3];
    me.callParent(arguments);
    priorityCombo.setDisabled(!me.isPriorityVisible(context.record.get("type")));
  },
  onPreviewZone: function(){
    var me = this;
    me.previewItem(me.ITEM_PREVIEW, me.currentRecord);
  },
});
