//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.monitor.JobLogPanel");
Ext.define("NOC.sa.monitor.JobLogPanel", {
  extend: "Ext.panel.Panel",
  alias: "widget.monitor.JobLogPanel",
  objectId: undefined,
  scrollable: "y",
  items: [
    {
      xtype: "displayfield",
      itemId: "log",
      htmlEncode: true,
    },
  ],
  tools: [
    {
      type: "down",
      tooltip: t("help-collapse"),

      callback: function(panel){
        panel.collapse();
      },
    },
  ],
  load: function(record){
    var panel = this,
      id = record ? record.id : panel.objectId;
    if(id){
      panel.objectId = id;
      NOC.api.requestLegacy({
        url: "/sa/monitor/" + id + "/discovery_job_log/",
        method: "GET",
        success: function(response){
          panel.down("[itemId=log]").setHtml(response.responseText.replace(/\n/g, "<br>"));
          panel.expand();
        },
        failure: function(){
          NOC.error(t("msg-failed-to-get-data"));
        },
      });
    }
  },
});
