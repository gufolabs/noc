//---------------------------------------------------------------------
// main.desktop application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.desktop.Application");
Ext.define("NOC.main.desktop.Application", {
  extend: "Ext.Viewport",
  layout: "border",
  requires: [
    "NOC.core.Navigation",
    "NOC.core.InactivityLogout",
    "NOC.core.PasswordField",
    "NOC.core.ObservableModel",
    "NOC.core.Observable",
    "NOC.core.TagsField",
    "NOC.core.StringListField",
    "NOC.core.StateField",
    "NOC.core.StateProvider",
    "NOC.main.desktop.WorkplacePanel",
    "NOC.main.desktop.HeaderPanel",
    "NOC.main.desktop.NavPanel",
    "NOC.main.desktop.Breadcrumbs",
    "Ext.ux.form.SearchField",
    "Ext.ux.form.GridField",
    "Ext.ux.form.DictField",
    "Ext.ux.form.ColorField",
    "Ext.ux.grid.column.GlyphAction",
  ],

  initComponent: function(){
    var me = this;
    // initial permissions cache

    NOC.permissions$ = new NOC.core.Observable({model: new NOC.core.ObservableModel});
    NOC.restartReason = null;
    me.templates = NOC.templates["main_desktop"];
    // Setup helpers
    NOC.run = Ext.bind(me.launchTab, me);
    NOC.launch = Ext.bind(me.launchApp, me);
    //
    me.launchedTabs = {};
    //
    me.navStore = Ext.create("Ext.data.TreeStore", {
      root: {
        id: "root",
        text: __("All"),
        expanded: true,
        children: [{
          text: "[HIDDEN] Row height measurement node",
          leaf: true, 
          measurementNode: true,
        }],
      },
    });
    // Create panels
    me.headerPanel = Ext.create("NOC.main.desktop.HeaderPanel", {app: me});
    me.navPanel = Ext.create("NOC.main.desktop.NavPanel", {
      app: me,
      store: me.navStore,
    });
    me.breadcrumbs = Ext.create("NOC.main.desktop.Breadcrumbs", {
      app: me,
      store: me.navStore,
    });
    me.workplacePanel = Ext.create("NOC.main.desktop.WorkplacePanel", {app: me});
    //
    Ext.apply(me, {
      items: [
        me.headerPanel,
        me.breadcrumbs,
        me.navPanel,
        me.workplacePanel,
      ],
    });
    me.callParent();
    // Set unload handler
    me.boundOnUnload = me.onUnload.bind(me);
    window.addEventListener("beforeunload", me.boundOnUnload);
  },
  //
  afterRender: function(){
    this.callParent();
    // React to browser back/forward: sync the active app to the URL.
    NOC.navigation.subscribe(this.onNavigate.bind(this));
    this.onLogin();
    this.fireEvent("applicationReady");
    console.log("NOC application ready");
  },
  // Called by NOC.navigation on every route change. We only act on user
  // back/forward ("traverse"); our own push/replace navigations are ignored.
  onNavigate: function(token, type){
    if(type !== "traverse"){
      return;
    }
    this.routeHistory(token);
  },
  // Route a back/forward token to the matching open app tab and let the app
  // restore the sub-state. Wrapped in navigation.silent() so re-asserting the
  // state does not push new history entries and fight the traversal. We do not
  // launch a new tab here (to avoid duplicates) — only re-target open ones.
  routeHistory: function(token){
    var me = this;
    token = token || "";
    // appId is the segment before the first "/" or "?"; the rest (path
    // segments, query stripped) is passed to the app. Apps that need the query
    // string read NOC.navigation.getToken() directly.
    var appId = token.split(/[/?]/)[0];
    if(!appId){
      return;
    }
    var tab = me.findAppTab(appId);
    if(!tab){
      return;
    }
    var app = tab.items.first(),
      pathPart = token.slice(appId.length).split("?")[0],
      paths = pathPart.split("/").filter(Boolean);
    NOC.navigation.silent(function(){
      me.workplacePanel.setActiveTab(tab);
      if(app && Ext.isFunction(app.applyHistory)){
        app.applyHistory(paths);
      }
    });
  },
  // Find the open workplace tab hosting the app with the given appId.
  findAppTab: function(appId){
    var found = null;
    this.workplacePanel.items.each(function(tab){
      var app = tab.items && tab.items.first && tab.items.first();
      if(app && app.appId === appId){
        found = tab;
        return false;
      }
    });
    return found;
  },
  // Launch applications from URL or home
  launchApps: function(){
    var hash = NOC.navigation.getToken();
    if(hash){ // Open application tab
      // The browser already loaded this deep-link URL; while we relaunch the
      // app and restore its state, replace history entries instead of pushing
      // so the back button is not left pointing at half-built intermediate
      // states. Replace mode ends once the restore reconstructs this URL.
      NOC.navigation.beginReplaceMode();
      var paths = hash.split("/").filter(Boolean),
        app = paths.shift();
      if(paths.length > 0){
        NOC.launch(app, "history", {args: paths});
      } else{
        NOC.launch(app);
      }
    } else{ // Launch home application
      this.launchTab("NOC.main.home.Application", __("Home"), {});
    }
  },
  // Show About screen
  onAbout: function(){
    var me = this;
    NOC.api.requestLegacy({
      url: "/main/desktop/about/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        Ext.create("NOC.main.desktop.About", {
          app: me,
          aboutCfg: data,
        });
      },
      failure: function(){
        NOC.error(__("Failed to get data"));
      },
    });
  },
  // Launch application from navigation record
  launchRecord: function(record, reuse){
    var li;
    if(!record.isLeaf()){
      return;
    }
    li = record.get("launch_info");
    if(li.params && li.params.link){
      window.open(li.params.link);
    } else{
      this.launchTab(
        li.class, li.title, li.params, record.get("id"), reuse,
      );
    }
  },
  // Launch application in tab
  launchTab: function(panel_class, title, params, node, reuse){
    var paths;
    if(reuse && node && this.launchedTabs[node]){
      // Open tab
      this.workplacePanel.setActiveTab(this.launchedTabs[node]);
    } else{
      if(title !== __("Home")){
        NOC.msg.started(__("Starting \"{0}\""), title);
      }
      // Launch new tab
      if(!params.app_id){
        paths = panel_class.split(".");
        params.app_id = [paths[1], paths[2]].join(".");
      }
      this.workplacePanel.launchTab(panel_class, title, params, node);
    }
  },
  launchApp: function(app, cmd, data){
    var me = this;
    // iframe shortcut
    if(app === "iframe"){
      me.launchTab(
        "NOC.main.desktop.IFramePanel",
        data.title,
        {url: data.url},
      );
      return;
    }
    //
    // skip saved hash
    var index = app.indexOf("?"),
      _app = index === -1 ? app : app.substr(0, index),
      url = "/" + _app.replace(".", "/") + "/launch_info/";
    NOC.api.requestLegacy({
      url: url,
      method: "GET",
      scope: me,
      success: function(response){
        var li = Ext.decode(response.responseText),
          params = {filterValuesUrl: app};
        if(cmd){
          params.cmd = Ext.merge({}, data);
          params.cmd.cmd = cmd;
        }
        Ext.merge(params, li.params);
        me.launchTab(
          li.class,
          li.title,
          params,
        );
        // restore saved hash
        if(index !== -1){
          NOC.navigation.navigate(app);
        }
      },
      failure: function(){
        NOC.error(__("Failed to launch application ") + " " + app);
      },
    });
  },
  // Called when application tab closed
  onCloseApp: function(menuId){
    var me = this;
    if(me.launchedTabs[menuId]){
      delete me.launchedTabs[menuId];
    }
  },
  // Search text entered
  onSearch: function(value){
    NOC.launch("main.search", "search", {query: value});
  },
  // Toggle all panels except workplace
  onPanelsToggle: function(){
    var me = this;
    if(me.headerPanel.isHidden()){
      me.headerPanel.show();
      me.navPanel.show();
      me.workplacePanel.setCollapsed();
    } else{
      me.headerPanel.hide();
      me.navPanel.hide();
      me.workplacePanel.setExpanded();
    }
  },
  // Show user profile panel
  onUserProfile: function(){
    NOC.run(
      "NOC.main.userprofile.Application",
      "User Profile",
      {},
    );
  },
  // Show change credentials form
  onChangeCredentials: function(){
    var me = this;
    Ext.create("NOC.main.desktop.ChangeCredentials", {
      app: me,
      fields: [
        {
          xtype: "textfield",
          name: "old_password",
          fieldLabel: __("Old Password"),
          allowBlank: false,
          inputType: "password",
        },

        {
          xtype: "textfield",
          name: "new_password",
          fieldLabel: __("New Password"),
          allowBlank: false,
          inputType: "password",
        },

        {
          xtype: "textfield",
          name: "retype_password",
          fieldLabel: __("Retype New Password"),
          allowBlank: false,
          inputType: "password",
          vtype: "password",
          peerField: "new_password",
        },
      ],
    });
  },
  // Called when session is authenticated or user logged in
  onLogin: async function(){
    // Initialize state provider
    const provider = new NOC.core.StateProvider();
    await provider.loadState();
    Ext.state.Manager.setProvider(provider);
    console.log("User preferences state: ", provider.state);
    this.launchApps();
    // Apply user settings
    NOC.api.requestLegacy({
      method: "GET",
      url: "/main/desktop/user_settings/",
      scope: this,
      success: function(response){
        var settings = Ext.decode(response.responseText),
          displayName = [];
        // Save settings
        NOC.username = settings.username;
        NOC.email = settings.email;
        // Build display name
        if(settings.first_name){
          displayName.push(settings.first_name);
        }
        if(settings.last_name){
          displayName.push(settings.last_name);
        }
        if(displayName.length === 0){
          displayName.push(settings.username);
        }
        this.headerPanel.setUserName(displayName.join(" "));
        // Display username button
        this.headerPanel.showUserMenu(settings.can_change_credentials);
        // Reset opened tabs
        this.launchedTabs = {};
        // Set menu
        this.navStore.setRoot(settings.navigation);
        this.breadcrumbs.updateSelection("root");
        // Setup idle timer
        NOC.core.InactivityLogout.init(settings.idle_timeout);
        // permissions cache
        NOC.permissions$.next(this.getPermissions(settings.navigation.children));
        NOC.info_icon("fa-sign-in", __("Logged in as ") + settings.username);
      },
      failure: function(){
        NOC.error(__("Failed to get user settings"));
      },
    });
  },
  //
  getPermissions: function(tree){
    var result = [],
      children = function(leaf){
        if(Object.hasOwn(leaf, "launch_info")
          && Object.hasOwn(leaf.launch_info, "params")
          && Object.hasOwn(leaf.launch_info.params, "app_id")){
          result.push(
            new NOC.core.ObservableModel({
              key: leaf.launch_info.params.app_id,
              value: leaf.launch_info.params.permissions,
            }),
          );
        }
        if(Object.hasOwn(leaf, "children") && leaf.children){
          Ext.Array.map(leaf.children, children);
        }
      };
    Ext.Array.map(tree, children);
    return result;
  },
  // Start logout sequence
  onLogout: function(msg){
    const url = "/api/login/logout/";
    if(msg === "Autologout"){
      window.removeEventListener("beforeunload", this.boundOnUnload);
      localStorage.setItem("NOC.restartReason", msg);
    }
    document.location = url;
  },
  //
  onUnload: function(e){
    if(NOC.restartReason){
      return;
    }
    if(this.hasUnsavedChanges()){
      // modern browsers no longer support custom messages in the unload dialog for security reasons 
      e.preventDefault();
      e.returnValue = "";
    }
  },
  //
  hasUnsavedChanges: function(){
    var forms = Ext.ComponentQuery.query("form"),
      isDirty = forms.some(function(form){
        return form.isDirty();
      });
    return isDirty;
  },
  //
  restartApplication: function(reason){
    NOC.restartReason = reason;
    window.location.reload();
  },
  //
  toggleNav: function(){
    var me = this;
    if(me.breadcrumbs.isVisible()){
      me.breadcrumbs.hide();
      me.navPanel.show();
    } else{
      me.breadcrumbs.show();
      me.navPanel.hide();
    }
  },
  //
  setActiveNavTabTooltip: function(text){
    var me = this;
    Ext.each(me.workplacePanel.tabBar.getRefItems(), function(btn){
      if(btn.active === true){
        btn.setTooltip(text);
        return false;
      }
    });
  },
  //
  clearActiveNavTabTooltip: function(){
    var me = this;
    Ext.each(me.workplacePanel.tabBar.getRefItems(), function(btn){
      if(btn.active === true){
        btn.setTooltip(undefined);
        return false;
      }
    });
  },
});
