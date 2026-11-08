//---------------------------------------------------------------------
// sa.discoveredobject application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.discoveredobject.controller.Container");

Ext.define("NOC.sa.discoveredobject.controller.Container", {
  extend: "Ext.app.ViewController",
  alias: "controller.sa.discoveredobject.container",

  onClearSearchField: function(searchField){
    searchField.setValue("");
    this.lookup("sa-discovered-sidebar").down("[name=__query]").setValue("");
    searchField.getTrigger("clear").hide();
  },
  onChangeSearchField: function(searchField, event){
    var sidebarHiddenSearchField = this.lookup("sa-discovered-sidebar").down("[name=__query]");
    if(searchField.getValue()){
      searchField.getTrigger("clear").show();
      if(event.keyCode === event.ENTER){
        sidebarHiddenSearchField.setValue(searchField.getValue());
      }
    } else{
      searchField.getTrigger("clear").hide();
      sidebarHiddenSearchField.setValue(searchField.getValue());
    }

  },
  onToggleFilter: function(_, pressed){
    this.getViewModel().set("isFilterOpen", pressed);
  },
  onBeforeRenderGroupAction: function(button){
    this.fillMenu(button, "/sa/discoveredobject/action_lookup/", "/sa/discoveredobject/actions/send_event/");
  },
  onBeforeRenderSyncRecord: function(button){
    this.fillMenu(button, "/sa/discoveredobject/template_lookup/", "/sa/discoveredobject/actions/sync_records/");
  },
  fillMenu: function(button, url, actionUrl){
    var me = this,
      actionFn = function(args, actionUrl){
        var filterPanel = button.up("[appId=sa.discoveredobject]").lookup("sa-discoveredobject-list").lookup("sa-discovered-sidebar"),
          grid = button.up("[appId=sa.discoveredobject]").lookup("sa-discoveredobject-list").lookup("sa-discoveredobject-grid"),
          ids = Ext.Array.map(grid.getSelection(), function(item){return item.get("id")}),
          filterObject = filterPanel.getController().notEmptyValues(),
          params = Ext.apply(filterObject, {ids: ids}, {args: args});

        NOC.api.requestLegacy({
          url: actionUrl,
          method: "POST",
          jsonData: params,
          scope: me,
          success: function(response){
            var data = Ext.decode(response.responseText),
              grid = this.lookup("sa-discoveredobject-grid");

            if(data.status){
              grid.mask(t("msg-reloading"));
              grid.getStore().load({
                callback: function(){
                  grid.unmask();
                },
              });
              NOC.info(t("msg-value0-success", {value0: button.text}));
            } else{
              NOC.error(t("msg-value0-failed-value1", {value0: button.text, value1: data.error}));
            }
          },
          failure: function(){
            NOC.error(t("msg-value0-failed", {value0: button.text}));
          },
        });
      };

    NOC.api.requestLegacy({
      url: url,
      success: function(response){
        var me = this,
          defaultHandler, menuItems,
          data = Ext.decode(response.responseText);

        defaultHandler = data.filter(function(el){
          return el.is_default
        })[0];
        button.setHandler(function(){
          actionFn(defaultHandler.args, actionUrl);
        }, me);
        button.getMenu().removeAll();
        menuItems = data.filter(function(el){
          return !el.is_default
        }).map(function(el){
          return {
            text: el.label,
            handler: function(){
              actionFn(el.args, actionUrl);
            },
          }
        });
        Ext.Array.each(menuItems, function(item){
          button.getMenu().add(item);
        });
      },
      failure: function(){
        NOC.error(t("msg-value0-failed-to-get-data-for-menu-items", {value0: button.text}));
      },
    });
  },
  onScan: function(){
    var me = this;

    Ext.create("Ext.window.Window", {
      autoShow: true,
      modal: true,
      width: 400,
      reference: "scanFrm",
      title: t("app-title-manual-scan"),
      items: {
        xtype: "form",
        layout: "form",
        bodyPadding: 5,
        items: [
          {
            xtype: "textarea",
            name: "addresses",
            allowBlank: false,
            emptyText: t("label-by-ip-list-max-2000-2"),
          },
          {
            xtype: "checkfield",
            name: "checks",
            listeners: {
              updateLayout: function(){
                Ext.defer(function(){
                  this.updateLayout();
                }, 25, this);
              },
            },
          },
          {
            xtype: "textarea",
            name: "credentials",
            allowBlank: true,
            emptyText: t("label-snmp-credentials"),
          },
        ],
        buttons: [
          {
            text: t("btn-send"),
            reference: "sendBtn",
            handler: function(button){
              var form = button.up("form").getForm();

              if(!form.isValid()){
                return;
              }
              var params = Ext.clone(form.getValues());

              Ext.Object.each(params, function(key, value){
                if(Ext.isEmpty(value)){
                  delete params[key];
                }
              });

              NOC.api.requestLegacy({
                url: "/sa/discoveredobject/scan_run/",
                method: "POST",
                jsonData: params,
                scope: me,
                success: function(response){
                  var data = Ext.decode(response.responseText);

                  if(data.status){
                    NOC.info(t("msg-success"));
                    this.lookup("sa-discovered-sidebar").getController().reload();
                  } else{
                    NOC.error(t("msg-failed-value0", {value0: data.error_description}));
                  }
                },
                failure: function(response){
                  var data = Ext.decode(response.responseText);

                  NOC.error(t("msg-manual-scan-failed-value0", {value0: data.error_description}));
                },
              });
              button.up("window").close();
            },
          },
          {
            text: t("btn-cancel"),
            handler: function(){
              this.up("window").close();
            },
          },
        ],
      },
    });
  },
  onFilterChanged: function(_, value){
    var v = "";

    if(Object.hasOwn(value, "__query")){
      v = value.__query;
    }
    if(!Ext.isEmpty(v)){
      this.getView().down("[xtype=searchfield]").getTrigger("clear").show();
    } else{
      this.getView().down("[xtype=searchfield]").getTrigger("clear").hide();
    }
    this.getView().down("[xtype=searchfield]").setValue(v);
  },
});
