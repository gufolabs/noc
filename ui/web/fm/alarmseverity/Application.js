//---------------------------------------------------------------------
// fm.alarmseverity application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarmseverity.Application");

Ext.define("NOC.fm.alarmseverity.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.fm.alarmseverity.Model",
    "NOC.main.style.LookupField",
    "NOC.main.ref.sound.LookupField",
  ],
  model: "NOC.fm.alarmseverity.Model",
  rowClassField: "row_class",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-builtin"),
      dataIndex: "is_builtin",
      renderer: NOC.render.Bool,
      sortable: false,
      width: 50,
    },
    {
      text: t("header-severity"),
      dataIndex: "severity",
      width: 50,
      align: "right",
    },
    {
      text: t("header-min-weight"),
      dataIndex: "min_weight",
      width: 50,
      align: "right",
    },
    {
      text: t("label-description"),
      dataIndex: "description",
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
      name: "uuid",
      xtype: "displayfield",
      fieldLabel: t("label-uuid"),
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
    {
      name: "severity",
      xtype: "numberfield",
      fieldLabel: t("header-severity"),
      allowBlank: false,
    },
    {
      name: "min_weight",
      xtype: "numberfield",
      fieldLabel: t("header-min-weight"),
      allowBlank: false,
    },
    {
      name: "code",
      xtype: "textfield",
      fieldLabel: t("label-code"),
      allowBlank: true,
    },
    {
      name: "style",
      xtype: "main.style.LookupField",
      fieldLabel: t("app-title-style"),
      allowBlank: false,
    },
    {
      name: "sound",
      xtype: "main.ref.sound.LookupField",
      fieldLabel: t("label-sound"),
      allowBlank: false,
    },
    {
      name: "volume",
      xtype: "numberfield",
      fieldLabel: t("label-volume"),
      minValue: 0,
      maxValue: 100,
      allowBlank: true,
    },
  ],

  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/fm/alarmseverity/{0}/json/",
      previewName: "Alarm Severity: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);
    Ext.apply(me, {
      formToolbar: [
        {
          text: t("btn-json"),
          glyph: NOC.glyph.file,
          tooltip: t("help-show-json"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onJSON,
        },
        {
          text: t("btn-test-sound"),
          glyph: NOC.glyph.volume,
          tooltip: t("btn-test-sound"),
          scope: me,
          handler: me.onTestSound,
        },
      ],
    });
    me.callParent();
  },
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
  //
  onTestSound: function(){
    var me = this,
      snd;
    if(!me.currentRecord.get("sound")){
      return;
    }
    snd = new Audio(`/ui/pkg/nocsound/${me.currentRecord.get("sound")}.mp3`);
    snd.volume = (me.currentRecord.get("volume") || 100) / 100;
    snd.play();
  },
});
