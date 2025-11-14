//---------------------------------------------------
// ColorField:
// Color picker field based on HTML5 color input
//---------------------------------------------------
console.debug("Defining Ext.ux.form.ColorField");

Ext.define("Ext.ux.form.ColorField", {
  extend: "Ext.form.field.Text",
  alias: "widget.colorfield",
  
  triggers: {
    color: {
      scope: "this",
      handler: "onTriggerClick",
    },
  },
  
  width: 190,
  regex: /^(#|0x)?[0-9A-Fa-f]+$/,
  regexText: __("Enter hex value starting with # or 0x"),

  afterRender: function(){
    this.callParent(arguments);
    
    this.colorInput = Ext.DomHelper.append(this.bodyEl, {
      tag: "input",
      type: "color",
      style: "position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;",
    }, true);
    
    this.colorInput.on("input", () => {
      this.onColorSelected(this.colorInput.dom.value);
    });

    if(this.value){
      this.updateColorDisplay(this.value);
    }
  },

  onTriggerClick: function(){
    if(this.colorInput){
      this.colorInput.dom.click();
    }
  },

  onColorSelected: function(hexColor){
    this.setValue(hexColor);
  },

  updateColorDisplay: function(decimalValue){
    var hexColor = this.toHexColor(decimalValue);
    
    this.setFieldStyle({
      color: this.getContrastColor(decimalValue),
      backgroundColor: hexColor,
      backgroundImage: "none",
    });
    
    if(this.colorInput){
      this.colorInput.dom.value = hexColor;
    }
  },

  setValue: function(value){
    var decimalValue = this.toDecimalColor(value);
        
    this.value = this.toHexColor(decimalValue);
    this.updateColorDisplay(decimalValue);
    this.callParent([this.value]);
  },

  toDecimalColor: function(value){
    var decimalValue;
    if(typeof value === "string"){
      if(value.indexOf("#") === 0){
        decimalValue = parseInt(value.substring(1), 16);
      } else if(value.indexOf("0x") === 0){
        decimalValue = parseInt(value.substring(2), 16);
      } else{
        decimalValue = parseInt(value, 10);
      }
    } else{
      decimalValue = value;
    }
    return decimalValue;
  },
  
  toHexColor: function(decimalValue){
    var hex = Number(decimalValue).toString(16);
    while(hex.length < 6){
      hex = "0" + hex;
    }
    return "#" + hex.toLowerCase();
  },

  rawToValue: function(){
    return this.toDecimalColor(this.rawValue) || 0;
  },

  getContrastColor: function(decimalValue){
    var avgBrightness = ((decimalValue >> 16) & 255) * 0.299 + 
                       ((decimalValue >> 8) & 255) * 0.587 + 
                       (decimalValue & 255) * 0.114;
    return (avgBrightness > 130) ? "#000000" : "#FFFFFF";
  },

  onDestroy: function(){
    if(this.colorInput){
      this.colorInput.destroy();
    }
    this.callParent(arguments);
  },
});