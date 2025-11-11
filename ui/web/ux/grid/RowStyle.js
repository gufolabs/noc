Ext.define("Ext.ux.grid.RowStyle", {
  extend: "Ext.plugin.Abstract",
  alias: "plugin.rowstyle",

  init: function(grid){
    var view = grid.getView();
    // hook into the view's refreshNode to inject style per row
    view.on("refresh", function(){
      view.getNodes().forEach(function(rowEl){
        var record = view.getRecord(rowEl);
        if(!record) return;
        var style=record.get("row_class")||"";
        if(!style) return;
        if(rowEl.style.cssText){
          // Preserve existing style
          rowEl.style.cssText = rowEl.style.cssText + ";" + style;
        } else{
          rowEl.style.cssText=style;
        }
      });
    });
  },
});
