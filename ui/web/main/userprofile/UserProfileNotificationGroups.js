//---------------------------------------------------------------------
// main.userprofile notification groups grid
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.userprofile.UserProfileNotificationGroups");

Ext.define("NOC.main.userprofile.UserProfileNotificationGroups", {
  extend: "Ext.grid.Panel",
  alias: "widget.userprofilenotification",
  requires: [
    "NOC.main.ref.unotificationmethod.LookupField",
    "NOC.main.timepattern.LookupField",
  ],
  selModel: "rowmodel",
  forceFit: true,
  plugins: {
    ptype: "rowediting",
    clicksToEdit: 1,
    listeners: {
      edit: function(editor, context){
        var record = context.record;
        NOC.api.requestLegacy({
          url: "/main/notificationgroup/" + record.get("notification_group") + "/change_user_subscription/",
          method: "POST",
          jsonData: {
            user_policy: record.get("user_policy"),
            time_pattern: record.get("time_pattern") || null,
            expired_at: record.get("expired_at"),
            title_tag: record.get("title_tag") || null,
            preferred_method: record.get("preferred_method") || null,
          },
          success: function(response){
            var result = Ext.decode(response.responseText);
            if(result.success){
              Ext.Object.each(result.data, function(key, value){record.set(key,value)});
              record.commit();
              NOC.info(t("msg-changes-saved-successfully"));
            } else{
              NOC.error(result.message || t("msg-failed-to-save-changes"));
            }
          },
          failure: function(response){
            var text = Ext.decode(response.responseText); 
            NOC.error(text.message || t("msg-failed-to-save-changes"));
          },
        });
      },
    },
  },
  store: {
    fields: [
      {name: "notification_group", type: "string"},
      {name: "user_policy", type: "string"},
      {name: "preferred_method", type: "string"},
      {name: "time_pattern", type: "number"},
      {name: "expired_at", type: "date"},
      {name: "title_tag", type: "string"},
      {name: "tag", type: "auto"},
    ],
    data: [],
  },
  columns: [
    {
      text: t("app-title-notificationgroup"),
      dataIndex: "notification_group",
      renderer: NOC.render.Lookup("notification_group"),
    },
    {
      text: t("header-policy"),
      dataIndex: "user_policy",
      editor: {
        xtype: "combobox",
        store: {
          fields: ["id", "name"],
          data: [
            {id: "A", name: t("choice-all")},
            {id: "W", name: t("msg-only-watch")},
            {id: "F", name: t("msg-only-favorites")},
            {id: "D", name: t("status-disable")},
          ],
        },
        displayField: "name",
        valueField: "id",
        queryMode: "local",
        editable: false,
      },
      renderer: function(v){
        var m = {
          A: t("choice-all"),
          W: t("msg-only-watch"),
          F: t("msg-only-favorites"),
          D: t("status-disable"),
        };
        return m[v];
      },
    },
    {
      text: t("header-preferred-method"),
      dataIndex: "preferred_method",
      editor: "main.ref.unotificationmethod.LookupField",
      renderer: NOC.render.Lookup("preferred_method"),
    },
    {
      text: t("header-time-pattern"),
      dataIndex: "time_pattern",
      editor: "main.timepattern.LookupField",
      renderer: NOC.render.Lookup("time_pattern"),
    },
    {
      text: t("header-title-tag"),
      dataIndex: "title_tag",
      editor: "textfield",
    },
    {
      text: t("header-expired-at"),
      dataIndex: "expired_at",
      editor: {
        xtype: "datefield",
        startDay: 1,
        format: "Y-m-d H:i:s",
        submitFormat: "Y-m-d H:i:s",
      },
      renderer: function(value){
        if(!value){
          return "";
        }
        return Ext.Date.format(new Date(value), "Y-m-d H:i:s");
      },
    },
    {
      text: t("label-message-types"),
      dataIndex: "tag",
      renderer: function(v){
        if(Ext.isEmpty(v)){
          return "-";
        }
        if(Ext.isArray(v) && v.length > 0){
          return v.join(", ");
        }
        return v;
      },
    },
  ],
});