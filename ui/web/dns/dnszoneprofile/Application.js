//---------------------------------------------------------------------
// dns.dnszoneprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.dns.dnszoneprofile.Application");

Ext.define("NOC.dns.dnszoneprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.dns.dnszoneprofile.Model",
    "NOC.dns.dnsserver.LookupField",
    "NOC.dns.dnsserver.M2MField",
    "NOC.main.notificationgroup.LookupField",
  ],
  model: "NOC.dns.dnszoneprofile.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      flex: 1,
    },
    {
      text: t("header-ttl"),
      dataIndex: "zone_ttl",
      flex: 1,
    },
    {
      text: t("app-title-notificationgroup"),
      dataIndex: "notification_group",
      renderer: NOC.render.Lookup("notification_group"),
      flex: 1,
    },
    {
      text: t("header-masters"),
      dataIndex: "masterslabel",
      flex: 1,
    },
    {
      text: t("header-slaves"),
      dataIndex: "slaveslabel",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-name"),
      allowBlank: false,
    },
    {
      xtype: "dns.dnsserver.M2MField",
      name: "masters",
      fieldLabel: t("header-masters"),
      allowBlank: true,
    },
    {
      xtype: "dns.dnsserver.M2MField",
      name: "slaves",
      fieldLabel: t("header-slaves"),
      allowBlank: true,
    },
    {
      name: "zone_soa",
      xtype: "textfield",
      fieldLabel: t("label-soa"),
      width: 300,
      allowBlank: false,
    },
    {
      name: "zone_contact",   
      xtype: "textfield",
      fieldLabel: t("label-contact"),
      width: 300,
      allowBlank: false,
    },
    {
      name: "zone_refresh",
      xtype: "numberfield",
      fieldLabel: t("help-refresh"),
      hideTrigger: true,
      width: 160,
      keyNavEnabled: false,
      mouseWheelEnabled: false,
      allowBlank: false,
    },
    {
      name: "zone_retry",
      xtype: "numberfield",
      fieldLabel: t("label-retry"),
      hideTrigger: true,
      width: 160,                    
      keyNavEnabled: false,        
      mouseWheelEnabled: false,        
      allowBlank: false,
    },
    {
      name: "zone_expire",
      xtype: "numberfield",
      fieldLabel: t("label-expire"),
      hideTrigger: true,
      width: 160,                    
      keyNavEnabled: false,        
      mouseWheelEnabled: false,        
      allowBlank: false,
    },
    {
      name: "zone_ttl",
      xtype: "numberfield",
      fieldLabel: t("header-ttl"),
      hideTrigger: true,
      width: 160,                    
      keyNavEnabled: false,        
      mouseWheelEnabled: false,        
      allowBlank: false,
    },
    {
      name: "notification_group",
      xtype: "main.notificationgroup.LookupField",
      fieldLabel: t("app-title-notificationgroup"),
      allowBlank: true,
    },
    {
      name: "description",
      xtype: "textareafield",
      fieldLabel: t("label-description"),
      allowBlank: true,      
      width: 600, 
      height: 100,
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
  ],
});
