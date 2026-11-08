//---------------------------------------------------------------------
// NOC.core.plugins DynamicModalEditing for grid cell editing
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// ToDo modify for general use when used a second time
console.debug("Defining NOC.core.plugins.DynamicModalEditing");

Ext.define("NOC.core.plugins.DynamicModalEditing", {
  extend: "Ext.AbstractPlugin",
  alias: "plugin.dynamicmodalediting",
  requires: [
    "Ext.window.Window",
    "Ext.form.Panel",
  ],
  dataIndex: "value", // Field name to edit
  //
  init: function(grid){
    this.grid = grid;
    grid.on("cellclick", function(view, cell, cellIndex, record, tr, rowIndex, e){
      var column = e.position.column,
        action = e.target.getAttribute("data-action");
      
      if(action === "copy"){
        NOC.toClipboard(record.get(this.dataIndex));
        return;
      }
      if(column && column.useModalEditor){
        this.urlPrefix = column.urlPrefix || "urlPrefix_not_set";
        this.showEditor(record, column, view, cell);
      }
    }, this);
    Ext.each(grid.columns
      .filter(column => column.useModalEditor),
             function(column){
               column.renderer = function(v, _, record){
                 var value = v,
                   iconName = Ext.isEmpty(record.get("editor")) ? "lock" : "pencil",
                   cursorStyle = iconName === "pencil" ? "cursor: pointer;" : "",
                   icon = `<i class='fa fa-${iconName}' style='padding-right: 4px;${cursorStyle}' title='` + t(iconName === "pencil" ? "btn-edit" : "label-read-only") + "'></i>",
                   copyIcon = NOC.clipboardIcon("").replace(/onclick='NOC\.toClipboard\(""\)'/, "data-action='copy'");
                 if((v === true) || (v === false)){
                   value = NOC.render.Bool(v);
                   // Don't show copy icon for boolean values
                   copyIcon = "";
                 }
                 value = Ext.isEmpty(value) ? "-" : value;
                 return icon + value + copyIcon;
               }
             },
    );
  },
  //
  addRowButtonHandler: function(button){
    var newRow = this.getMultiRowConfig(this.record, this.formType, undefined, true),
      scroller = this.formPanel.getScrollable();      
      
    button.setGlyph(NOC.glyph.minus);
    button.setTooltip(t("btn-remove-mapping"));
    button.setHandler(this.removeRow);
    
    this.formPanel.suspendLayouts();
    this.formPanel.autoScroll = false;
    this.formPanel.add(newRow);
  
    Ext.defer(function(){
      this.formPanel.resumeLayouts(true);
      this.formPanel.autoScroll = true;
      if(scroller){
        scroller.scrollBy(0, this.formPanel.body ? this.formPanel.body.getHeight() : 10000); 
      }
    }, 100, this);
  },
  //
  formatResult: function(value){
    if(Ext.isEmpty(value)) return "";
      
    if(Ext.isArray(value)){
      return Ext.Array.filter(value, function(val){ return !Ext.isEmpty(val); });
    }
    return value;
  },
  //
  getButtonConfig: function(type){
    var tooltip = type === "add" ? t("btn-add-mapping") : t("btn-remove-mapping"),
      glyph = type === "add" ? NOC.glyph.plus : NOC.glyph.minus,
      config = {
        xtype: "button",
        glyph: glyph,
        tooltip: tooltip,
        disabled: false,
        scope: this,
      };
      
    if(type === "add"){
      config.handler = this.addRowButtonHandler;
    } else{
      config.handler = this.removeRow;
    }
    return config;
  },
  // 
  getDefaultField: function(formType, value, choices){
    var field = {
      fieldLabel: t("header-value"),
      name: this.dataIndex,          
    };
    switch(formType){
      case "bool":
        return Ext.apply(field, {
          xtype: "checkboxfield",
          checked: value === true,
        });
      case "int":
      case "float":
        return Ext.apply(field, {
          xtype: "numberfield",
          value: value,
        });
      case "choices":
        return Ext.apply(field, {
          xtype: "combobox",
          editable: false,
          queryMode: "local",
          value: value,
          store: choices,
        });
      default:
        return Ext.apply(field, {
          xtype: "textfield",
          value: value,
        });
    }
  },
  // 
  getEditorWidth: function(){
    return 400;
  },
  //
  getEditorHeight: function(){
    return 250;
  },
  // 
  getFormItems: function(record, formType){
    var value = record.get(this.dataIndex),
      isMultiple = record.get("editor").multiple || false;
    
    if(isMultiple){
      var values = Ext.isArray(value) ? value : [value],
        rows = [];
      if(values.length === 0){
        return [this.getMultiRowConfig(record, formType, values[0], true)];
      }
      Ext.Array.each(values, function(val, index, array){
        var isLast = index === array.length - 1;
        rows.push(this.getMultiRowConfig(record, formType, val, isLast));
      }, this);
      return rows;
    }
    return [this.getDefaultField(formType, value, record.get("editor").choices)];
  },
  //
  getFormType: function(record){
    if(Ext.isEmpty(record.get("editor"))){
      return;
    }
    if(!Ext.isEmpty(record.get("editor"))){
      return record.get("editor").type;
    }
    return "str";
  },
  //
  getMultiRowConfig: function(record, formType, value, isLast){
    var formField = this.getDefaultField(formType, value, record.get("editor").choices),
      formWidth = this.getEditorWidth();
      
    formField.width = formWidth - 80;
    delete formField.fieldLabel;
    return {
      xtype: "container",
      layout: {
        type: "hbox",
        align: "end",
      },
      items: [
        this.getButtonConfig(isLast ? "add" : "remove"),
        formField,
      ],
    };
  },
  //
  removeRow: function(button){
    var row = button.up(),
      scroller = this.formPanel.getScrollable(),
      formEl = this.formPanel.getEl(),
      scrollTop = formEl ? formEl.dom.scrollTop : 0;
    this.formPanel.suspendLayouts();
    this.formPanel.autoScroll = false;
    this.formPanel.remove(row);
    Ext.defer(function(){
      this.formPanel.resumeLayouts(true);
      this.formPanel.autoScroll = true;
      if(formEl && formEl.dom){
        scroller.scrollBy(0, scrollTop);
      }
    }, 100, this);
  },
  //
  request: function(method, button){
    var record = this.record,
      url = `${this.urlPrefix}/${record.get("object")}/capabilities/${record.get("id")}/`,
      data = this.formatResult(this.formPanel.getForm().getValues()[this.dataIndex]);
    NOC.api.requestLegacy({
      url: url,
      method: method,
      jsonData: method === "PUT" ? {value: data} : undefined,
      scope: this,
      success: function(response){
        var result = Ext.decode(response.responseText);
        if(result.status){
          var value = Ext.isDefined(result.data) ? result.data[this.dataIndex] : "";
          record.set(this.dataIndex, this.formatResult(value));
          button.up("window").close();
          NOC.info(method === "PUT" ? t("msg-value-saved") : t("msg-value-deleted"));
        } else{
          NOC.error(result.message);
        }
      },
      failure: function(response){
        try{
          var result = Ext.decode(response.responseText),
            message = Ext.isDefined(result.errors) ? result.errors : t("msg-request-failure");
        } catch(e){
          console.error(e);
          message = t("msg-invalid-server-response");
        }
        NOC.error(message);
      },
    });
  },
  //
  resetForm: function(button){
    Ext.Msg.show({
      title: t("app-title-confirm-reset"),
      message: t("msg-are-you-sure-you-want-to-reset-all-values"),
      buttons: Ext.Msg.YESNO,
      icon: Ext.Msg.QUESTION,
      scope: this,
      fn: function(btn){
        if(btn === "yes"){
          this.formPanel.removeAll();
          this.record.set(this.dataIndex, "");
          this.formPanel.add(this.getFormItems(this.record, this.formType));
          this.request("DELETE", button);
        }
      },
    });
  },
  //  
  showEditor: function(record){
    var formType = this.getFormType(record);
    
    if(Ext.isEmpty(formType)) return;
        
    var formItems = this.getFormItems(record, formType);
    if(!formItems || formItems.length === 0) return;
    
    this.record = record;
    this.formType = formType;
    this.formPanel = Ext.create("Ext.form.Panel", {
      bodyPadding: 10,
      border: false,
      layout: "anchor",
      scrollable: true,
      defaults: {
        anchor: "100%",
      },
      items: formItems,
    });
        
    Ext.create("Ext.window.Window", {
      title: t("app-title-edit-value"),
      modal: true,
      width: this.getEditorWidth(),
      height: this.getEditorHeight(),
      layout: "fit",
      autoShow: true,
      items: this.formPanel,
      buttons: [{
        text: t("btn-cancel"),
        handler: function(){
          this.up("window").close();
        },
      }, {
        text: t("btn-reset"),
        scope: this,
        handler: this.resetForm,
      }, {
        text: t("btn-save"),
        scope: this,
        handler: function(button){
          this.request("PUT", button);
        },
      }],
    });
  },
});