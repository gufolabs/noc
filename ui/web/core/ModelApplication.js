//---------------------------------------------------------------------
// NOC.core.ModelApplication
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.core.ModelApplication");

Ext.define("NOC.core.ModelApplication", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ModelStore",
    "NOC.core.InlineModelStore",
    "NOC.core.InlineGrid",
    "NOC.core.TreeFilterToolbar",
    "NOC.core.modelfilter.Base",
    "NOC.core.modelfilter.Boolean",
    "NOC.core.modelfilter.Choices",
    "NOC.core.modelfilter.Lookup",
    "NOC.core.modelfilter.List",
    "NOC.core.modelfilter.VCFilter",
    "NOC.core.modelfilter.AFI",
    "NOC.core.modelfilter.VC",
    "NOC.core.modelfilter.Tag",
    "NOC.core.modelfilter.Label",
    "NOC.core.modelfilter.Favorites",
    "NOC.core.modelfilter.Tree",
    "Ext.ux.grid.column.GlyphAction",
    "Ext.ux.grid.RowStyle",
  ],
  mixins: [
    "NOC.core.mixins.Export",
  ],

  layout: "card",
  search: false,
  searchPlaceholder: t("label-search"),
  searchTooltip: undefined,
  recordReload: false,
  filters: null,
  gridToolbar: [], // Additional grid toolbar buttons
  formToolbar: [], // Additional form toolbar buttons
  currentRecord: null,
  appTitle: null,
  createTitle: "app-title-create-item",
  cloneTitle: "app-title-clone-item",
  changeTitle: "app-title-edit-item",
  groupChangeTitle: "app-title-edit-items",
  rowClassField: undefined,
  actions: undefined,
  previewIcon: "icon_magnifier",
  preview: null,
  treeFilter: null,
  formLayout: "anchor",
  formMinWidth: undefined,
  formMaxWidth: undefined,
  helpId: undefined,
  listHelpId: undefined,
  formHelpId: undefined,
  canAdd: true,
  //
  navTooltipTemplate: new Ext.XTemplate(
    '<tpl if="data.name">',
    "{data.name} - ",
    "</tpl>{title}",
  ),

  initComponent: function(){
    var me = this;
    // set base_url
    var n = me.self.getName().split(".");
    me.base_url = "/" + n[1] + "/" + n[2] + "/";
    me.appName = n[1] + "." + n[2];
    // Variables
    me.currentQuery = me.currentQuery || {};
    // Create store
    var bs = Math.ceil(screen.height / 24);
    me.store = Ext.create("NOC.core.ModelStore", {
      model: me.model,
      customFields: me.noc.cust_model_fields || [],
      autoLoad: false,
      pageSize: bs,
      leadingBufferZone: bs,
      numFromEdge: Math.ceil(bs / 2),
      trailingBufferZone: bs,
    });
    me.store.on("beforeload", me.onBeforeLoad, me);
    me.store.on("load", me.onLoad, me);
    me.store.on("exception", me.onLoadError, me);

    me.idField = me.store.idProperty;
    // Generate persistent field names
    me.persistentFields = {};
    Ext.each(me.store.model.getFields(), function(f){
      if(f.persist){
        me.persistentFields[f.name] = true;
      }
    });
    //
    me.hasGroupEdit = me.checkGroupEdit();
    // Create GRID card
    me.hasEditForm = Ext.isDefined(me.fields) && me.fields.length > 0;
    me.ITEM_GRID = me.registerItem(me.createGrid());
    // Create FORM card
    me.ITEM_FORM = me.registerItem(me.createForm());
    // Create Group Edit form when necessary
    if(me.hasGroupEdit){
      me.ITEM_GROUP_FORM = me.registerItem(me.createGroupForm())
    }
    //
    Ext.apply(me, {
      items: me.getRegisteredItems(),
      activeItem: me.ITEM_GRID,
    });
    // Initialize component
    me.callParent();
    me.currentRecord = null;
    if(me.noc.cmd && me.noc.cmd.callback){
      me.noc.cmd.callback(); 
    }
    // Process commands
    switch(me.getCmd()){
      case "open":
        me.loadById(me.noc.cmd.id);
        break;
      case "history":
        if(!Ext.isEmpty(me.noc.cmd.override)){
          Ext.each(me.noc.cmd.override, function(override){
            var [method, cb] = Object.entries(override)[0];
            me[method] = cb;
          });
        }
        me.restoreHistory(me.noc.cmd.args);
        return;
      case "new":
        me.newRecord(me.noc.cmd.args);
        break;
    }
    // Finally, load the store
    if(Ext.Object.isEmpty(me.currentQuery)){
      me.loadStore();
    } else{
      Ext.each(me.filterSetters, function(set){
        set(me.currentQuery);
      });
      me.reloadStore();
    }
  },
  //
  createGrid: function(){
    var me = this;
    // Setup Grid toolbar
    var gridToolbar = [];
    var plugins = [
    ];
    if(me.rowClassField){
      plugins.push("rowstyle");
    }

    if(me.additions_plugins){
      plugins = plugins.concat(me.additions_plugins);
    }

    if(me.levelFilter){
      me.upButton = Ext.create("Ext.button.Button", {
        glyph: NOC.glyph.level_up,
        tooltip: t("help-level-up"),
        scope: me,
        handler: me.onLevelUp,
      });
      gridToolbar.push(me.upButton);
    }

    me.searchField = Ext.create("Ext.ux.form.SearchField", {
      name: "search_field",
      hideLabel: true,
      width: 400,
      typeAhead: false,
      typeAheadDelay: 500,
      emptyText: me.searchPlaceholder,
      tooltip: me.searchTooltip,
      hasAccess: function(app){
        return app.search === true;
      },
      scope: me,
      handler: me.onSearch,
      listeners: {
        render: me.addTooltip,
      },
    });

    me.refreshButton = Ext.create("Ext.button.Button", {
      glyph: NOC.glyph.refresh,
      tooltip: t("help-refresh"),
      scope: me,
      handler: me.onRefresh,
    });

    me.createButton = Ext.create("Ext.button.Button", {
      itemId: "create",
      text: t("btn-add"),
      glyph: NOC.glyph.plus,
      tooltip: t("help-add-new-record"),
      hasAccess: NOC.hasPermission("create"),
      scope: me,
      handler: me.onNewRecord,
    });

    me.exportButton = Ext.create("Ext.button.Button", {
      itemId: "export",
      text: t("btn-export"),
      glyph: NOC.glyph.arrow_down,
      tooltip: t("help-save-screen"),
      scope: me,
      handler: function(){
        var date = "_" + Ext.Date.format(new Date(), "YmdHis"),
          filename = this.appId.replace(/\./g, "_") + date + ".csv";
        this.save(this.grid, filename);
      },
    });

    gridToolbar.push(me.searchField, me.refreshButton);
    if(me.canAdd) gridToolbar.push(me.createButton);
    gridToolbar.push(me.exportButton);
    // admin actions
    if(me.actions || me.hasGroupEdit){
      gridToolbar.push(me.createActionMenu());
    }
    gridToolbar = gridToolbar.concat(me.gridToolbar);
    gridToolbar.push("->");
    me.totalField = Ext.create("Ext.button.Button", {});
    gridToolbar.push(me.totalField);
    if(NOC.settings.enableHelp && (me.helpId || me.listHelpId)){
      me.listHelpButton = Ext.create("Ext.button.Button", {
        itemId: "listHelp",
        glyph: NOC.glyph.question_circle,
        tooltip: t("help-application-help"),
        scope: me,
        handler: NOC.helpOpener(me.listHelpId || me.helpId),
      });
      gridToolbar = gridToolbar.concat("-", me.listHelpButton);
    }
    // Initialize panels
    // Filters
    var grid_rbar = null;
    me.filterGetters = [];
    me.filterSetters = [];
    if(me.filters){
      var fh = Ext.bind(me.onFilter, me),
        filters = [{
          title: t("app-title-favorites"),
          name: "fav_status",
          ftype: "favorites",
        }].concat(me.filters),
        baseField = Ext.create("NOC.core.modelfilter.Base");
      grid_rbar = {
        xtype: "form",
        autoScroll: true,
        itemId: "filters",
        width: baseField.width + Ext.getScrollbarSize().width + 10,
        title: t("app-title-reportfilter"),
        bodyPadding: 4,
        tools: [
          {
            type: "close",
            tooltip: t("help-reset-filters"),
            scope: me,
            handler: me.onResetFilters,
          },
        ],
        items: filters.map(function(f){
          // @todo: Smarter solution using Ext.Class.alias
          var ft = {
            boolean: "NOC.core.modelfilter.Boolean",
            choices: "NOC.core.modelfilter.Choices",
            lookup: "NOC.core.modelfilter.Lookup",
            list: "NOC.core.modelfilter.List",
            afi: "NOC.core.modelfilter.AFI",
            vc: "NOC.core.modelfilter.VC",
            tag: "NOC.core.modelfilter.Tag",
            label: "NOC.core.modelfilter.Label",
            favorites: "NOC.core.modelfilter.Favorites",
            tree: "NOC.core.modelfilter.Tree",
            geoaddress: "NOC.core.modelfilter.GeoAddress",
          }[f.ftype];
          var fc = Ext.Object.merge(f, {
            referrer: me.appName,
            itemId: f.name,
          });
          var fg = Ext.create(ft, fc);
          fg.handler = fh;
          me.filterGetters = me.filterGetters.concat(
            Ext.bind(fg.getFilter, fg),
          );
          me.filterSetters = me.filterSetters.concat(
            Ext.bind(fg.setFilter, fg),
          );
          return fg;
        }),
      };
    }
    // Grid
    var cust_columns = me.noc.cust_grid_columns || [];
    Ext.each(cust_columns, function(c){
      if(c.renderer && Ext.isString(c.renderer)){
        c.renderer = eval(c.renderer);
      }
    });
    var selModel = Ext.create("Ext.selection.CheckboxModel", {
      preventFocus: true,
    });
    if(me.actions){
      selModel.on("selectionchange", me.onActionSelectionChange, me);
    }

    var rowItems = [
      {
        glyph: NOC.glyph.star,
        tooltip: t("help-mark-unmark"),
        scope: me,
        getColor: function(cls, meta, r){
          return r.get("fav_status") ? NOC.colors.starred : NOC.colors.unstarred;
        },
        handler: me.onFavItem,
      },
    ];
    if(me.hasEditForm){
      rowItems.push({
        glyph: NOC.glyph.edit,
        color: NOC.colors.edit,
        tooltip: t("app-title-edit"),
        scope: me,
        isDisabled: function(){
          var me = this;
          return !me.hasPermission("read") && !me.hasPermission("update");
        },
        handler: function(grid, rowIndex){
          var me = this,
            record = me.store.getAt(rowIndex);
          me.onEditRecord(record);
        },
      });
    }
    if(me.openDashboard){
      rowItems = rowItems.concat([
        {
          glyph: me.openDashboard.icon,
          color: me.openDashboard.color,
          tooltip: me.openDashboard.tooltip,
          scope: me,
          handler: function(grid, rowIndex){
            var me = this,
              record = me.store.getAt(rowIndex);
            var url = "/ui/grafana/dashboard/script/noc.js?dashboard=" + me.openDashboard.type + "&id=" + record.get("managed_object");

            if("ipsla" === me.openDashboard.type){
              url += "&var-probe=" + record.get("bi_id")
            }
            window.open(url);
          },
        },
      ]);
    }

    if(me.levelFilter){
      rowItems = rowItems.concat([
        {
          glyph: me.levelFilter.icon,
          color: me.levelFilter.color,
          tooltip: me.levelFilter.tooltip,
          scope: me,
          handler: function(grid, rowIndex){
            var me = this,
              record = me.store.getAt(rowIndex);

            me.currentQuery[me.levelFilter.filter] = record.id;
            me.store.setFilterParams(me.currentQuery);
            Ext.each(me.filterSetters, function(set){
              set(me.currentQuery);
            });
            me.reloadStore();
          },
        },
      ]);
    }

    // @todo: Replace with preview api
    if(me.onPreview){
      rowItems = rowItems.concat([
        {
          glyph: NOC.glyph.search,
          color: NOC.colors.preview,
          tooltip: t("help-preview"),
          scope: me,
          handler: function(grid, rowIndex){
            var me = this;
            me.onPreview(me.store.getAt(rowIndex));
          },
        },
      ]);
    }
    if(me.preview){
      // @todo: Detect panel instances
      var config = {
        app: me,
        xtype: "Ext.panel.Panel",
      };
      Ext.apply(config, me.preview);
      // urlSuffix lets the preview state be reflected in / restored from the
      // URL as "<appId>/<id>/preview" (apps may override via me.preview).
      if(!config.urlSuffix){
        config.urlSuffix = "preview";
      }
      me.ITEM_PREVIEW = me.registerItem(
        Ext.create(config.xtype, config),
      );
      rowItems = rowItems.concat([
        {
          glyph: NOC.glyph.search,
          color: NOC.colors.preview,
          tooltip: t("help-preview"),
          scope: me,
          handler: function(grid, rowIndex){
            var me = this;
            me.showPreview(me.store.getAt(rowIndex));
          },
        },
      ]);
    }

    var gridColumns = me.columns.concat(cust_columns);
    // Set up tooltips
    Ext.each(gridColumns, function(c){
      if(!c.listeners){
        c.listeners = {};
      }
      c.listeners.afterrender = function(){
        if(Ext.isEmpty(this.tooltip) && !Ext.isEmpty(this.text)){ 
          Ext.create("Ext.ToolTip", {
            target: this.getEl(),
            anchor: "top",
            trackMouse: true,
            html: this.text,
          });
        }
      }
    });
    //
    var gridToolbars = [
      {
        xtype: "toolbar",
        items: me.applyPermissions(gridToolbar),
      },
    ];
    //
    if(me.treeFilter){
      var treeFilterToolbar = Ext.create("NOC.core.TreeFilterToolbar", {
        field: me.treeFilter,
        url: me.base_url + "tree_lookup/",
        listeners: {
          scope: me,
          select: me.onFilter,
        },
      });
      gridToolbars.push(treeFilterToolbar);
      me.filterGetters.push(
        Ext.bind(treeFilterToolbar.getFilter, treeFilterToolbar),
      );
    }
    //
    var gridPanel = Ext.create("Ext.grid.Panel", {
      itemId: "grid",
      store: me.store,
      emptyText: t("label-no-records"),
      columns: [
        {
          xtype: "glyphactioncolumn",
          width: 23 * rowItems.length,
          sortable: false,
          items: rowItems,
          stateId: "rowaction",
        },
        {
          text: t("header-id"),
          dataIndex: me.idField,
          hidden: true,
        },
      ].concat(gridColumns),
      border: false,
      autoScroll: true,
      stateful: true,
      stateId: me.appName + "-grid",
      plugins: plugins,
      selModel: selModel,
      dockedItems: gridToolbars,
      rbar: grid_rbar,
      viewConfig: {
        enableTextSelection: true,
        listeners: {
          scope: me,
          cellclick: me.onCellClick,
        },
      },
      listeners: {
        scope: me,
        itemdblclick: function(grid, record){
          this.onEditRecord(record);
        },
      },
    });
    // Shortcuts
    me.grid = gridPanel;
    if(me.filters){
      me.filterPanel = me.grid.getComponent("filters");
    }
    return gridPanel;
  },
  //
  createForm: function(){
    var me = this,
      focusField = null,
      autoFocusFields;
    //
    me.saveButton = Ext.create("Ext.button.Button", {
      itemId: "save",
      text: t("btn-save"),
      tooltip: t("help-save-changes"),
      glyph: NOC.glyph.save,
      formBind: true,
      disabled: true,
      scope: me,
      handler: Ext.pass(me.onSave, [true], me),
    });
    me.applyButton = Ext.create("Ext.button.Button", {
      itemId: "apply",
      text: t("btn-apply"),
      tooltip: t("help-save-changes-and-continue-editing"),
      glyph: NOC.glyph.save,
      formBind: true,
      disabled: true,
      scope: me,
      handler: Ext.pass(me.onSave, [false], me),
    });
    //
    me.closeButton = Ext.create("Ext.button.Button", {
      itemId: "close",
      text: t("btn-close"),
      tooltip: t("help-close-without-saving"),
      glyph: NOC.glyph.arrow_left,
      scope: me,
      handler: me.onClose,
    });
    //
    me.resetButton = Ext.create("Ext.button.Button", {
      itemId: "reset",
      text: t("btn-reset"),
      tooltip: t("help-reset-to-default-values"),
      glyph: NOC.glyph.undo,
      disabled: true,
      scope: me,
      handler: me.onReset,
    });
    //
    me.deleteButton = Ext.create("Ext.button.Button", {
      itemId: "delete",
      text: t("btn-delete"),
      tooltip: t("help-delete-object"),
      glyph: NOC.glyph.times,
      disabled: true,
      hasAccess: NOC.hasPermission("delete"),
      scope: me,
      handler: me.onDelete,
    });
    //
    me.cloneButton = Ext.create("Ext.button.Button", {
      itemId: "clone",
      text: t("btn-clone"),
      tooltip: t("help-copy-existing-values-to-a-new-object"),
      glyph: NOC.glyph.copy,
      disabled: true,
      hasAccess: NOC.hasPermission("create"),
      scope: me,
      handler: me.onClone,
    });
    //
    // Default toolbar items
    var formToolbar = [
      me.saveButton,
      me.applyButton,
      me.closeButton,
      "-",
      me.resetButton,
      me.deleteButton,
      "-",
      me.cloneButton,
    ];
    // Add View button
    if(me.onPreview){
      formToolbar.push({
        text: t("btn-view"),
        tooltip: t("help-preview"),
        glyph: NOC.glyph.eye,
        // hasAccess:
        scope: me,
        handler: function(){
          var me = this;
          me.onPreview(me.currentRecord)
        },
      });
    }
    if(me.formToolbar && me.formToolbar.length){
      formToolbar.push("-");
    }
    formToolbar = formToolbar.concat(me.formToolbar);
    //
    if(NOC.settings.enableHelp && (me.helpId || me.formHelpId)){
      me.formHelpButton = Ext.create("Ext.button.Button", {
        itemId: "formHelp",
        glyph: NOC.glyph.question_circle,
        tooltip: t("help-form-help"),
        scope: me,
        handler: NOC.helpOpener(me.formHelpId || me.helpId),
      },
      );
      formToolbar = formToolbar.concat("->", me.formHelpButton);
    }
    // Prepare inlines grid
    var formInlines = [];
    me.inlineStores = [];
    if(me.inlines){
      for(const inline of me.inlines){
        var istore = Ext.create("NOC.core.InlineModelStore", {
            model: inline.model,
            pageSize: 0,
          }),
          gp = {
            xtype: "inlinegrid",
            columns: inline.columns,
            store: istore,
          };
        if(Ext.isDefined(inline.plugins)){
          gp.plugins = inline.plugins;
        }
        if(Ext.isDefined(inline.bbar)){
          gp.bbar = inline.bbar;
        }
        if(Ext.isDefined(inline.readOnly)){
          gp.readOnly = inline.readOnly;
        }
        formInlines.push({
          xtype: "fieldset",
          anchor: "100%",
          minHeight: 130,
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          title: inline.title,
          collapsible: true,
          collapsed: inline.collapsed,
          items: [gp],
        });
        me.inlineStores.push(istore);
      }
    }

    me.formTitle = Ext.create("Ext.container.Container", {
      minWidth: me.formMinWidth,
      maxWidth: me.formMaxWidth,
      html: "Title",
      itemId: "form_title",
      padding: "0 0 4 0",
    });
    // Build form fields
    var formFields = [me.formTitle];
    // Append configured fields
    formFields = formFields.concat(me.fields);
    // Append custom fields
    if(me.noc.cust_form_fields){
      formFields = formFields.concat(me.noc.cust_form_fields);
    }
    formFields = formFields.concat(formInlines);
    // process protected fields
    if(Object.hasOwn(me.noc, "protected_field")){
      Ext.Object.each(me.noc.protected_field, function(fieldName, value){
        var find = function(object){
          if(Object.hasOwn(object, "name") && object.name === fieldName){
            switch(value){
              case 0:
                object.hidden = true;
                break;
              case 1:
              case 2:
                object.disabled = true;
                break;
            }
            return;
          }
          if(Object.hasOwn(object, "items")){
            Ext.Array.each(object.items, find);
          }
        };
        Ext.Array.each(formFields, find);
      });
    }
    me.formPanel = Ext.create("Ext.container.Container", {
      itemId: "form",
      layout: "fit",
      items: {
        xtype: "form",
        layout: me.formLayout,
        border: true,
        padding: 4,
        bodyPadding: me.themeBodyPadding,
        autoScroll: true,
        defaults: {
          anchor: "100%",
          enableKeyEvents: true,
          listeners: {
            specialkey: {
              scope: me,
              fn: me.onFormSpecialKey,
            },
          },
        },
        items: formFields,
        dockedItems: {
          xtype: "toolbar",
          dock: "top",
          layout: {
            overflowHandler: "Menu",
          },
          items: me.applyPermissions(formToolbar),
        },
      },
      getDefaultFocus: function(){
        return focusField;
      },
    });
    me.form = me.formPanel.items.first().getForm();
    // append copy to clipboard icon
    Ext.each(me.form.getFields().items, function(f){
      if(f && f.xtype === "displayfield" && ["uuid"].indexOf(f.name) !== -1){
        f.renderer = NOC.clipboard;
      }
    });
    // detect autofocus field
    autoFocusFields = Ext.ComponentQuery.query("[autoFocus=true]", me.formPanel);
    if(autoFocusFields && autoFocusFields.length > 0){
      focusField = autoFocusFields[0];
    } else{
      focusField = me.form.getFields().items[0];
    }
    me.restoreFilter(me.noc.filterValuesUrl);
    return me.formPanel;
  },
  // Show grid
  showGrid: function(){
    var me = this;
    me.showItem(me.ITEM_GRID);
    me.setHistoryHash();
  },
  // Show Form
  showForm: function(){
    var me = this;
    me.showItem(me.ITEM_FORM);
    if(me.formPanel && me.formPanel.getDefaultFocus){
      var df = me.formPanel.getDefaultFocus();
      if(df){
        df.focus();
      }
    }
  },
  //
  showPreview: function(record){
    var me = this,
      item = me.showItem(me.ITEM_PREVIEW);
    if(item !== undefined){
      item.preview(record, me.ITEM_GRID);
      me.reflectItemInUrl(item, record);
    }
  },
  // Save changed data
  saveRecord: function(data, goToGrid){
    var me = this,
      Model = me.store.getModel(),
      record = new Model(data),
      mv = record.validate(),
      result = {};

    if(!mv.isValid()){
      // @todo: Error report
      NOC.error(t("msg-invalid-data"));
      return;
    }
    // Normalize
    data = record.getData();
    for(var name in data){
      if(me.persistentFields[name]){
        result[name] = data[name];
      }
    }
    if(me.currentRecord){
      result[me.idField] = me.currentRecord.get(me.idField);
    }
    // Process inlines on save, when parentField is set and isLocal is true
    // add parentField to PUT payload. Save ONLY id of parent
    me.inlineStores
            .filter(function(store){
              return Ext.isDefined(store.isLocal) && store.isLocal;
            })
            .forEach(function(store){
              result[store.rootProperty] = store.getData().items.map(function(item){
                var obj = {};
                obj[store.parentField] = item.get(store.parentField);
                return obj;
              });
            });
    me.mask("Saving ...");
    // Save data
    NOC.api.requestLegacy({
      url: me.base_url + (me.currentRecord ? result[me.idField] + "/" : ""),
      method: me.currentRecord ? "PUT" : "POST",
      scope: me,
      jsonData: result,
      success: function(response){
        this.currentRecord = Ext.create("Ext.data.Model", Ext.decode(response.responseText));
        // Process result
        // @todo: Update current record with data
        if(this.currentQuery[me.idField]){
          delete this.currentQuery[this.idField];
        }
        this.reloadStore();
        if(goToGrid){
          this.showGrid();
          // clean dirty for reload browser
          this.form.reset();
        } else{
          me.setHistoryHash(me.currentRecord.get(me.idField)); 
        }
        this.query("inlinegrid").forEach(function(grid){grid.setDisabled(false)});
        Ext.each(me.inlineStores, function(store){ store.setParent(me.currentRecord.get(me.idField))});
        NOC.msg.complete(t("msg-saved-2"));
      },
      failure: function(response){
        var message = "Error saving record";
        if(response.responseText){
          try{
            message = Ext.decode(response.responseText).message;
          } catch(err){
            console.log(err, response.responseText);
          }
        }
        NOC.error(message);
      },
      callback: function(){
        this.unmask();
      },
    });
  },
  //
  saveInlines: function(parentId, stores){
    var me = this;
    if(stores.length > 0){
      var istore = stores[0];
      if(parentId){
        istore.setParent(parentId);
      }
      // Save inline
      istore.sync({
        scope: me,
        success: function(){
          // Save next
          me.saveInlines(parentId, stores.slice(1));
        },
        failure: function(response, op, status){
          me.showOpError("save", op, status);
        },
      });
    } else{
      me.showGrid();
    }
  },
  // Show Form
  onEditRecord: function(record){
    var me = this;
    // Check permissions
    if(!me.hasPermission("read") && !me.hasPermission("update"))
      return;
    if(me.recordReload){
      NOC.api.requestLegacy({
        url: me.base_url + record.get(me.idField) + "/",
        method: "GET",
        scope: me,
        success: function(response){
          var data = Ext.decode(response.responseText);
          me.editRecord(Ext.create(this.model, data));
        },
        failure: function(){
          NOC.error(t("msg-record-reload-error"));
        },
      });
    } else{
      me.editRecord(record);
    }
  },
  // New record. Hide grid and open form
  newRecord: function(defaults){
    var fv = {};
    this.form.getFields().each(function(field){
      if(["core.tagfield", "tagfield", "listform"].includes(field.xtype)){
        field.setValue([]);
      } else{
        field.setValue("");
      }
      if(["statefield"].includes(field.xtype)){
        field.setDisabled(true);
      }
      field.resetOriginalValue();
    });
    this.form.reset();
    // Calculate form field values
    Ext.merge(fv, this.store.defaultValues);
    Ext.merge(fv, defaults || {});
    this.form.setValues(fv);
    //
    this.currentRecord = null;
    this.resetInlines(defaults);
    this.setFormTitle(this.createTitle, "NEW");
    this.showForm();
    // Activate delete button
    this.deleteButton.setDisabled(true);
    this.saveButton.setDisabled(!this.hasPermission("create"));
    this.applyButton.setDisabled(!this.hasPermission("create"));
    this.resetButton.setDisabled(!this.hasPermission("create"));
    this.cloneButton.setDisabled(true);
    // Disable custom form toolbar
    this.activateCustomFormToolbar(false);
  },
  //
  onNewRecord: function(){
    var me = this;
    me.newRecord();
  },
  // Edit record. Hide grid and open form
  editRecord: function(record){
    var me = this,
      r = {},
      data;
    me.currentRecord = record;
    me.setNavTabTooltip({data: me.currentRecord.data});
    me.setFormTitle(me.changeTitle, me.currentRecord.get(me.idField));
    // Process lookup fields
    data = record.getData();
    Ext.iterate(data, function(v){
      if(v.indexOf("__") !== -1){
        return
      }
      if(!Ext.isDefined(this.fields)){
        return;
      }
      // hack to get instance of .TreeCombo class
      let field = this.fields.filter(function(e){
        return v === e.name && Ext.String.endsWith(e.xtype, ".TreeCombo")
      });
      if(field.length === 1){
        field[0].restoreById(data[v]);
      } else{
        field = me.formPanel.down(`[name=${v}]`);
        if(!field){
          return;
        }
        if(Ext.isFunction(field.cleanValue)){
          r[v] = field.cleanValue(
            me.currentRecord,
            me.store.rest_url,
          );
          field.setDisabled(false);
        } else{
          r[v] = data[v];
        }
      }
    }, me);
    // Show edit form
    me.showForm();
    me.form.reset();
    me.form.setValues(r);
    me.loadInlines();
    me.dirtyReset(this.form); 
    // Activate delete button
    me.deleteButton.setDisabled(!me.hasPermission("delete"));
    me.saveButton.setDisabled(!me.hasPermission("update"));
    me.applyButton.setDisabled(!me.hasPermission("update"));
    me.resetButton.setDisabled(!me.hasPermission("update"));
    me.cloneButton.setDisabled(!me.hasPermission("create"));
    // Enable custom form toolbar
    me.activateCustomFormToolbar(true);
    //
    me.setHistoryHash(me.currentRecord.get(me.idField));
  },
  // Delete record
  deleteRecord: function(){
    var me = this,
      pollProgress = function(url){
        NOC.api.requestLegacy({
          url: url,
          method: "GET",
          scope: me,
          success: onSuccess,
          failure: onFailure,
        });
      },
      onSuccess = function(response){
        if(response.status === 202){
        // Future in progress
          Ext.Function.defer(
            pollProgress, 1000, me,
            [response.getResponseHeader("Location")],
          );
        } else{
        // Process result
          me.currentRecord = null;
          me.reloadStore();
          me.unmask();
          me.showGrid();
        }
      },
      onFailure = function(response){
        var message;
        try{
          message = Ext.decode(response.responseText).message;
        } catch(err){
          console.error(err, response.responseText);
          message = t("msg-internal-error");
        }
        NOC.error(message);
        me.unmask();
      };
    if(me.currentRecord){
      me.mask("Deleting ...");
      NOC.api.requestLegacy({
        url: me.base_url + me.currentRecord.get(me.idField) + "/",
        method: "DELETE",
        scope: me,
        success: onSuccess,
        failure: onFailure,
      });
    }
  },
  // Reload store with current query
  reloadStore: function(){
    var query = Ext.clone(this.currentQuery);
    this.store.setFilterParams(query);
    // Reload store
    // ExtJS 5.0.0 WARNING:
    // me.store.reload() sometimes leaves empty grid
    // so we must use load() instead
    this.loadStore(query);
  },
  // Search
  onSearch: function(query){
    var me = this;
    if(query && query.length > 0){
      me.currentQuery.__query = query;
    } else{
      delete me.currentQuery.__query;
    }
    me.reloadStore();
  },
  getNextToken: function(filter, currentToken){
    var index = currentToken.indexOf("?")
      , app = index === -1 ? currentToken : currentToken.substr(0, index)
      , params = Ext.Object.toQueryString(filter, true);
    return params ? app + "?" + params : app;
  },
  isSearchOnlyChange: function(filter, currentToken){
    var index = currentToken.indexOf("?")
      , currentFilter = index === -1 ? {} : Ext.Object.fromQueryString(currentToken.substr(index + 1), true)
      , nextFilter = Ext.apply({}, filter)
      , currentSearch = currentFilter.__query
      , nextSearch = nextFilter.__query;
    delete currentFilter.__query;
    delete nextFilter.__query;
    return currentSearch !== nextSearch &&
      Ext.Object.toQueryString(currentFilter, true) === Ext.Object.toQueryString(nextFilter, true);
  },
  saveFilterToUrl: function(filter){
    var currentToken = NOC.navigation.getToken()
      , nextToken = this.getNextToken(filter, currentToken);
    if(nextToken === currentToken){
      return;
    }
    if(this.isSearchOnlyChange(filter, currentToken)){
      // Search text is transient state: update the address bar without
      // triggering navigation, which would reset focus to the document body.
      NOC.navigation.replace(nextToken);
    } else{
      NOC.navigation.navigate(nextToken);
    }
  },
  // Filter
  onFilter: function(){
    var me = this,
      fexp = {};
    Ext.each(me.filterGetters, function(g){
      fexp = Ext.Object.merge(fexp, g());
    });
    if(me.currentQuery.__query){
      fexp.__query = me.currentQuery.__query;
    }
    me.currentQuery = fexp;
    me.reloadStore();
  },
  // Returns form data
  getFormData: function(){
    var data, name, fields,
      form = this.form ||this, values = {};

    fields = form.getFields().items.filter(
      function(item){
        return !(Object.hasOwn(item, "isListForm") && item.isListForm)
      });
    fields.forEach(fieldCfg => {
      let formPanel = this.formPanel || this;
      if(Ext.isEmpty(fieldCfg.name)){
        return;
      }
      var field = formPanel.down(`[name=${fieldCfg.name}]`);
      if(Ext.isEmpty(field) || !Ext.isFunction(field.getModelData)){
        return;
      }
      if(field.inEditor){
        // Skip grid inline editors
        // WARNING: Will skip other inline editors
        return;
      }
      if(field.xtype === "radiofield"){
        field = formPanel.down(`[name=${field.name}][inputValue=${fieldCfg.inputValue}]`);
        if(!field.getValue()){
          // Skip unchecked field
          return;
        }
      }
      data = field.getModelData();
      name = field.getName();
      if(Ext.isObject(data)){
        if(Object.hasOwn(data, name)){
          values[name] = data[name];
        }
      }
      if(Ext.isArray(data)){
        values[name] = data;
      }
    });
    return values;
  },
  //
  cleanData: function(){
  },
  // Save button pressed
  // @Todo: check access
  onSave: function(goToGrid){
    var me = this;
    if(!me.form.isValid()){
      NOC.error(t("msg-error-in-data"));
      return;
    }
    var v = me.getFormData();
    if(!me.currentRecord && v[me.idField] !== undefined){
      delete v[me.idField];
    }
    //
    me.cleanData(v);
    // Fetch comboboxes labels
    me.form.getFields().each(function(field){
      if(Ext.isDefined(field.getLookupData)){
        v[field.name + "__label"] = field.getLookupData();
      }
    });
    me.saveRecord(v, goToGrid);
  },
  // reset dirty flag
  dirtyReset: function(form){
    Ext.each(form.getFields().items, function(field){
      if(Ext.isFunction(field.resetOriginalValue)){
        field.resetOriginalValue();
      }
    });
  },
  // Reset button pressed
  onReset: function(){
    this.form.getFields().each(function(field){
      field.setValue("");
      field.resetOriginalValue();
    });
    this.form.reset();
  },
  // Delete button pressed
  onDelete: function(){
    var me = this;
    Ext.Msg.show({
      title: t("app-title-delete-record"),
      msg: t("msg-do-you-wish-to-delete-record-this-operation-cannot-be-undone"),
      buttons: Ext.Msg.YESNO,
      icon: Ext.window.MessageBox.QUESTION,
      modal: true,
      fn: function(button){
        if(button == "yes")
          me.deleteRecord();
      },
    });
  },
  // Form hotkeys processing
  onFormSpecialKey: function(field, key){
    var me = this;
    if(field.xtype != "textfield")
      return;
    switch(key.getKey()){
      case Ext.EventObject.ENTER:
        key.stopEvent();
        me.onSave(true);
        break;
      case Ext.EventObject.ESC:
        key.stopEvent();
        me.onReset();
        break;
    }
  },
  // Set form title
  setFormTitle: function(tpl, itemId){
    var me = this,
      titleHtml;
    if(me.formTitle){
      titleHtml = "<b>" + t(tpl, {name: me.appTitle}) + "</b>";
      if(itemId !== "NEW" && itemId !== "CLONE"){
        itemId = "<b>ID: </b>" + itemId + NOC.clipboardIcon(itemId);
      } else{
        itemId = "<b>" + itemId + "</b>";
      }
      titleHtml += "<span style='float:right'>" + itemId + "</span>";
      me.formTitle.update(titleHtml);
    }
  },
  //
  activateCustomFormToolbar: function(status){
    var me = this,
      tb = me.saveButton.ownerCt,
      afterSep = false;
    tb.items.each(function(i){
      if(afterSep){
        if(i.setDisabled){
          i.setDisabled(!status);
        }
      } else{
        if(i.itemId === "custom_sep"){
          afterSep = true;
        }
      }
    });
  },
  //
  onResetFilters: function(){
    var me = this;
    me.filterPanel.getForm().reset();
    Ext.each(me.filterPanel.query(".button[enableToggle]"),
             function(b){
               b.toggle(false);
               b.fireHandler();
             });
    me.onFilter();
  },
  //
  showOpError: function(action, op, status){
    var text = `Failed to ${action}`;
    if(status){
      var m = status.message;
      if(status.status === 400){
        m = status.traceback;
      }
      text = `Failed to ${action}!<br>${m}`;
    }
    NOC.error(text);
  },
  // "close" button pressed
  onClose: function(){
    var me = this,
      toReload = me.idField in me.currentQuery;
    if(toReload){
      // Remove filter set by loadById
      delete me.currentQuery[me.idField];
    }
    me.clearNavTabTooltip();
    me.showGrid();
    if(toReload){
      me.reloadStore();
    }
  },
  // "clone" button pressed
  onClone: function(){
    var me = this;
    if(me.currentRecord){
      // Reset UUID
      if(me.currentRecord.get("uuid")){
        me.currentRecord.set("uuid", null);
        me.form.setValues({uuid: null});
      }
      // Reset bi_id
      if(me.currentRecord.get("bi_id")){
        me.currentRecord.set("bi_id", null);
        me.form.setValues({bi_id: null});
      }
    }
    // Reset parents of inline stores
    Ext.each(me.inlineStores, function(s){
      s.cloneData();
    });
    me.currentRecord = null; // Mark record as new
    me.setFormTitle(me.cloneTitle, "CLONE");
    me.cloneButton.setDisabled(true);
  },
  //
  onCellClick: function(view, cell, cellIndex, record, row,
    rowIndex, e){
    var me = this;
    if(e.target.tagName == "A"){
      var header = view.panel.headerCt.getHeaderAtIndex(cellIndex);
      if(header.onClick){
        header.onClick.apply(me, [record]);
      }
    }
  },
  //
  onFavItem: function(grid, rowIndex){
    var me = this,
      r = me.store.getAt(rowIndex),
      id = r.get(me.idField),
      action = r.get("fav_status") ? "reset" : "set",
      url = me.base_url + "favorites/item/" + id + "/" + action + "/";

    NOC.api.requestLegacy({
      url: url,
      method: "POST",
      scope: me,
      success: function(){
        // Invert current status
        r.set("fav_status", !r.get("fav_status"));
        grid.refresh();
      },
    });
  },
  //
  resetInlines: function(defaults){
    // preload default values
    this.query("inlinegrid").forEach(function(grid){grid.setDisabled(true)});
    Ext.each(this.inlineStores, function(istore){
      var value = [];
      if(Ext.isDefined(istore, "rootProperty") && (istore.rootProperty in this)){
        value = this[istore.rootProperty];
      }
      istore.loadData(value);
    }, defaults || {});
  },
  // Load inline stores
  loadInlines: function(){
    // Do not load store on new record
    if(!this.currentRecord || !this.inlineStores.length) return;
    var parentId = this.currentRecord.get(this.idField);
    this.query("inlinegrid").forEach(function(grid){grid.setDisabled(false)});
    Ext.each(this.inlineStores, function(istore){
      istore.setParent(parentId);
      istore.load();
    });
  },
  // Admin action selected
  onAction: function(menu, item){
    var me = this,
      records = me.grid.getSelectionModel().getSelection().map(function(o){
        return o.get(me.idField)
      });
    if(me.hasGroupEdit && item.itemId === "group_edit"){
      me.showGroupEditForm(records);
      return;
    }
    if(Ext.isFunction(item.run) || Ext.isFunction(me[item.run])){
      if(typeof item.run === "string"){
        item.run = me[item.run];
      }
      item.run(
        me.grid.getSelectionModel().getSelection()
                    .map(function(o){
                      return {object: o.get(me.idField), object__label: o.get("name")}
                    }));
      return;
    }
    if(item.form){
      me.showActionForm(item, records);
    } else{
      me.runAction(item, {ids: records});
    }
  },
  //
  runAction: function(action, params){
    var me = this;
    NOC.api.requestLegacy({
      url: me.base_url + "actions/" + action.itemId + "/",
      method: "POST",
      scope: me,
      jsonData: params,
      success: function(response){
        var r = Ext.decode(response.responseText) || "OK";
        if(action.resultTemplate){
          var d = action.resultTemplate.apply(r);
          Ext.create("Ext.Window", {
            html: d,
            width: 600,
            height: 400,
            autoScroll: true,
            layout: "fit",
            maximizable: true,
            title: `Result: ${action.text}`,
          }).show();
        } else{
          NOC.info(r);
        }
        me.reloadStore();
      },
      failure: function(){
        NOC.error(t("msg-failed"));
      },
    });
  },
  //
  showActionForm: function(action, records){
    var me = this,
      w = Ext.create("Ext.Window", {
        modal: true,
        autoShow: true,
        layout: "fit",
        items: [{
          xtype: "form",
          items: action.form,
        }],
        title: `${action.text} on ${records.length} records`,
        buttons: [{
          text: t("btn-run"),
          glyph: NOC.glyph.play,
          handler: function(){
            var form = w.items.first().getForm();
            if(!form.isValid()){
              NOC.error(t("header-error"));
              return;
            }
            var params = form.getValues();
            params.ids = records;
            w.close();
            me.runAction(action, params);
          },
        }],
      });
  },
  onActionSelectionChange: function(o, selected){
    var me = this;
    me.actionMenu.setDisabled(!selected.length);
  },
  //
  // Override with
  // onPreview: function(record)
  // to create item preview
  //
  onPreview: undefined,
  //
  // Load record by id and call callback
  // Callback is the function(record)
  //
  loadById: function(id, callback){
    var me = this,
      fp = {};
    fp[me.idField] = id;
    me.currentQuery[me.idField] = id;
    me.store.setFilterParams(fp);
    me.store.load({
      scope: me,
      callback: function(records, operation){
        if(operation.success && records.length === 1){
          Ext.callback(callback, me, [records[0]]);
        }
        me.checkStoreLoad(operation);
      },
    });
  },
  //
  // Apply a history token (back/forward or deep-link). Empty token => grid
  // (re-applying the filter from the URL query, if any).
  applyHistory: function(args){
    var me = this;
    if(!args || args.length === 0){
      me.showGrid();
      var token = NOC.navigation.getToken();
      if(token.indexOf("?") !== -1){
        // Filter state in the URL: restore it. Covers both ModelApplication's
        // native filter (filterSetters) and an optional NOC.Filter panel.
        me.restoreFilter(token);
        me.restoreFilterFromUrl();
        if(Ext.isFunction(me.reloadStore)){
          me.reloadStore();
        }
      }
      return;
    }
    me.restoreHistory(args);
  },
  //
  restoreHistory: function(args){
    var me = this;
    if(args.length === 1){
      me.loadById(args[0], function(record){
        me.onEditRecord(record);
      });
    }
    if(args.length === 2){
      var panelIndex = this.getRegisteredItemByUrl(args[1]);
      if(panelIndex !== -1){
        var panel = this.getRegisteredItem(panelIndex);
        this.currentHistoryHash = NOC.navigation.getToken();
        if(Ext.isFunction(panel.load)){
          // Panels that load themselves by id (e.g. sa.service subscription /
          // instances panels).
          this.showItem(panelIndex);
          panel.load(this.appId, args[0], "ITEM_GRID");
        } else if(Ext.isFunction(panel.preview)){
          // Generic preview-style panels: fetch the record, then preview it.
          this.loadById(args[0], function(record){
            me.showItem(panelIndex);
            panel.preview(record, me.ITEM_GRID);
          });
        } else{
          this.showItem(panelIndex);
        }
      }
    }
  },
  //
  onBeforeLoad: function(){
    var me = this;
    if(me.rendered){
      me.refreshButton.setDisabled(true);
    }
  },
  //
  onLoad: function(){
    var me = this,
      total = me.store.getTotalCount();
    me.totalField.setText(t("msg-total-value0", {value0: total}));
    if(me.rendered){
      me.refreshButton.setDisabled(false);
    }
  },
  //
  onLoadError: function(){
    var me = this;
    if(me.rendered){
      me.refreshButton.setDisabled(false);
    }
  },
  //
  onRefresh: function(){
    var me = this;
    me.reloadStore();
  },
  // Returns true if form has at least one groupEdit: true
  checkGroupEdit: function(){
    var me = this,
      check = function(seq){
        if(!seq){
          return false;
        }
        for(var i = 0; i < seq.length; i++){
          var v = seq[i];
          if(!v){
            continue;
          }
          if(v.groupEdit === true){
            return true;
          }
          if(v.items && v.items.length && check(v.items)){
            return true;
          }
        }
        return false;
      };
    return me.hasPermission("update") && check(me.fields);
  },
  //
  createGroupForm: function(){
    var me = this,
      form,
      getFormItems = function(fields){
        var items = [];
        Ext.each(fields, function(v){
          var x, xtype = v.xtype.indexOf("LookupField") !== -1 ? "combobox" : v.xtype;
          v.allowBlank = true;
          switch(xtype){
            case "fieldset":
            case "container":
              x = {
                xtype: v.xtype,
                title: v.title,
                items: getFormItems(v.items),
              };
              if(v.layout){
                x.layout = v.layout;
              }
              if(v.defaults){
                x.defaults = v.defaults;
              }
              if(v.border || v.border === false){
                x.border = v.border;
              }
              if(v.padding || v.padding === 0){
                x.padding = v.padding;
              }
              items.push(x);
              break;
            case "checkbox":
            case "checkboxfield":
              if(v.groupEdit === true){
                x = {
                  xtype: "combobox",
                  fieldLabel: v.fieldLabel,
                  name: v.name,
                  store: [
                    ["Leave unchanged", "Leave unchanged"],
                    [true, "Set"],
                    [false, "Reset"],
                  ],
                  // fix catch changeDirty
                  listeners: {
                    scope: me,
                    change: function(){
                      this.saveGroupButton.setDisabled(false);
                    },
                  },
                }
              } else{
                x = v.cloneConfig ? v.cloneConfig() : v;
                if(x.setDisabled){
                  x.setDisabled(true);
                } else{
                  x.disabled = true;
                }
              }
              items.push(x);
              me.groupCheckboxFields[v.name] = true;
              break;
            case "combobox":
              x = v.cloneConfig ? v.cloneConfig() : v;
              x.triggers = {
                clear: {
                  weight: 1,
                  cls: Ext.baseCSSPrefix + "form-clear-trigger",
                  tooltip: t("help-to-default-value"),
                  hidden: true,
                  handler: me.toDefaultValueString,
                  scope: me,
                },
                picker: {
                  weight: 2,
                  // ToDo use onTriggerClick
                  handler: function(){
                    var me = this;
                    if(!me.readOnly && !me.disabled){
                      if(me.isExpanded){
                        me.collapse();
                      } else{
                        if(me.triggerAction === "all"){
                          me.doQuery(me.allQuery, true);
                        } else if(me.triggerAction === "last"){
                          me.doQuery(me.lastQuery, true);
                        } else{
                          me.doQuery(me.getRawValue(), false, true);
                        }
                      }
                    }
                  },
                },
              };
              x.listeners = {
                focus: function(field){
                  if(field.value === "Leave unchanged"){
                    field.setValue("");
                  }
                },
                render: me.clearTriggerToolTip,
              };
              x.updateValue = function(){
                // ToDo use this.callParent(arguments)
                var self = this,
                  selectedRecords = self.valueCollection.getRange(),
                  len = selectedRecords.length,
                  valueArray = [],
                  displayTplData = self.displayTplData || (self.displayTplData = []),
                  inputEl = self.inputEl,
                  i, record;

                displayTplData.length = 0;
                for(i = 0; i < len; i++){
                  record = selectedRecords[i];
                  displayTplData.push(self.getRecordDisplayData(record));
                  if(record !== self.valueNotFoundRecord){
                    valueArray.push(record.get(self.valueField));
                  }
                }
                self.setHiddenValue(valueArray);
                self.value = self.multiSelect ? valueArray : valueArray[0];
                if(!Ext.isDefined(self.value)){
                  self.value = undefined;
                }
                self.displayTplData = displayTplData;
                if(inputEl && self.emptyText && !Ext.isEmpty(self.value)){
                  inputEl.removeCls(self.emptyCls);
                }
                self.setRawValue(self.getDisplayValue());
                self.checkChange();
                self.applyEmptyText();
                me.showClearTrigger(this);
                // this.callParent(arguments);
              };
              if(x.setDisabled){
                x.setDisabled(x.groupEdit !== true);
              } else{
                x.disabled = x.groupEdit !== true;
              }
              items.push(x);
              break;
            case "textfield":
              x = v.cloneConfig ? v.cloneConfig() : v;
              x.triggers = {
                clear: {
                  weight: 1,
                  cls: Ext.baseCSSPrefix + "form-clear-trigger",
                  hidden: true,
                  handler: me.toDefaultValueString,
                  scope: me,
                },
              };
              x.listeners = {
                focus: function(field){
                  if(field.value === "Leave unchanged"){
                    field.setValue("");
                  }
                },
                render: me.clearTriggerToolTip,
              };
              x.publishValue = function(){
                me.showClearTrigger(this);
                // this.callParent();
              };
              if(x.setDisabled){
                x.setDisabled(x.groupEdit !== true);
              } else{
                x.disabled = x.groupEdit !== true;
              }
              items.push(x);
              break;
            default:
              x = v.cloneConfig ? v.cloneConfig() : v;
              if(x.setDisabled){
                x.setDisabled(x.groupEdit !== true);
              } else{
                x.disabled = x.groupEdit !== true;
              }
              items.push(x);
              break;
          }
        });
        return items;
      };

    me.saveGroupButton = Ext.create("Ext.button.Button", {
      text: t("btn-save"),
      glyph: NOC.glyph.save,
      disabled: true,
      scope: me,
      // @todo: check access
      handler: me.onGroupSave,
    });

    me.groupCheckboxFields = {};

    me.groupFormTitle = Ext.create("Ext.container.Container", {
      html: "Title",
      padding: 4,
      style: {
        fontWeight: "bold",
      },
    });

    form = Ext.create("Ext.form.Panel", {
      padding: 4,
      bodyPadding: me.themeBodyPadding,
      autoScroll: true,
      listeners: {
        dirtychange: function(form, dirty){
          me.saveGroupButton.setDisabled(!dirty);
        },
      },
      items: [me.groupFormTitle].concat(getFormItems(me.fields)),
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.saveGroupButton,
            {
              text: t("btn-close"),
              glyph: NOC.glyph.arrow_left,
              scope: me,
              handler: me.onGroupClose,
            },
          ],
        },
      ],
    });
    me.groupForm = form.getForm();
    return form;
  },
  //
  createActionMenu: function(){
    var me = this,
      items = [];
    // Group edit
    if(me.hasGroupEdit){
      items.push({
        text: t("nav-group-edit"),
        itemId: "group_edit",
        glyph: NOC.glyph.edit,
      });
    }
    // Other items
    if(me.actions){
      items = items.concat(me.actions.map(function(o){
        return {
          text: o.title,
          itemId: o.action,
          form: o.form,
          glyph: o.glyph,
          run: o.run,
          resultTemplate: o.resultTemplate,
        }
      }));
    }

    me.actionMenu = Ext.create("Ext.button.Button", {
      glyph: NOC.glyph.download,
      text: t("btn-group-actions"),
      tooltip: t("btn-group-actions"),
      hasAccess: NOC.hasPermission("update"),
      itemId: "action_menu",
      disabled: true,
      menu: {
        xtype: "menu",
        plain: true,
        items: items,
        listeners: {
          click: {
            scope: me,
            fn: me.onAction,
          },
        },
      },
    });
    return me.actionMenu;
  },
  //
  showGroupEditForm: function(items){
    var me = this;
    me.groupEditItems = items;
    me.groupFormTitle.update(t(me.groupChangeTitle, {
      count: items.length,
      name: me.appTitle,
    }));
    var selection = me.grid.getSelectionModel().getSelection();
    var r = Ext.clone(selection[0].data);
    for(var i = 1; i < selection.length; i++){
      Ext.Object.each(selection[i].data, function(key, value){
        if(Object.hasOwn(r, key)){
          if(r[key] !== value){
            r[key] = "Leave unchanged";
          }
        } else{
          r[key] = "Leave unchanged";
        }
      });
    }
    me.groupForm.getFields().items.forEach(function(field){
      if(r && Object.hasOwn(r, field.name)){
        field.value = r[field.name];
      } else{
        field.value = "";
      }
      field.initValue();
    }, me);
    me.saveGroupButton.setDisabled(true);
    me.showItem(me.ITEM_GROUP_FORM);
  },
  //
  toDefaultValueString: function(field){
    var me = this;
    field.setValue(this.store.defaultValues[field.name]);
    me.saveGroupButton.setDisabled(false);
  },
  //
  showClearTrigger: function(field){
    var me = this, newValue = field.getValue() || "";
    if(Object.hasOwn(me.store.defaultValues, field.name)){
      var defaultValue = me.store.defaultValues[field.name] || "";
      if(field.getTrigger("clear").hidden && newValue !== defaultValue){
        field.getTrigger("clear").show();
        field.updateLayout();
      }

      if(newValue === defaultValue){
        field.getTrigger("clear").hide();
        field.updateLayout();
      }
    } else{
      if(newValue){
        field.getTrigger("clear").show();
        field.updateLayout();
      } else{
        field.getTrigger("clear").hide();
        field.updateLayout();
      }
    }
    me.saveGroupButton.setDisabled(!field.isDirty());
  },
  //
  onGroupClose: function(){
    var me = this;
    me.showGrid();
  },
  //
  onGroupSave: function(){
    var me = this,
      values = {},
      valuesTxt = "";
    // @todo: Form validation
    Ext.Array.each(me.groupForm.getFields().items, function(field){
      if(Ext.isFunction(field.isDirty) && field.isDirty()){
        valuesTxt += (field.fieldLabel || field.name) + ": '";
        if(Ext.isFunction(field.getDisplayValue)){
          valuesTxt += field.getDisplayValue();
        } else{
          valuesTxt += field.getValue();
        }
        valuesTxt += "'</br>";
        if(field.getValue() !== "Leave unchanged"){
          values[field.name] = field.getValue();
        }
      }
    });
    if(!Ext.Object.isEmpty(values)){
      values.ids = me.groupEditItems;
      var message = `Do you wish to change ${values.ids.length} record(s): <br/><br/>${valuesTxt}<br/>This operation cannot be undone!`;
      Ext.Msg.show({
        title: t("app-title-change-records"),
        msg: message,
        buttons: Ext.Msg.YESNO,
        icon: Ext.window.MessageBox.QUESTION,
        modal: true,
        fn: function(button){
          if(button === "yes"){
            NOC.api.requestLegacy({
              url: me.base_url + "actions/group_edit/",
              method: "POST",
              scope: me,
              jsonData: values,
              success: function(){
                NOC.info(t("msg-records-has-been-updated"));
                me.showGrid();
                me.reloadStore();
              },
              failure: function(){
                NOC.error(t("msg-failed"));
              },
            });
          }
        },
      });
    } else{
      me.showGrid();
    }
  },
  //
  clearTriggerToolTip: function(){
    var triggerEl = this.getTrigger("clear").el;
    triggerEl.dom.setAttribute("data-qtip", t("help-to-default-value"));
  },
  //
  onMetrics: function(record){
    var me = this;
    me.showItem(me.ITEM_METRIC_SETTINGS).preview(record);
  },
  //
  restoreFilter: function(currentHash){
    var me = this,
      filterStr,
      index,
      queryString;

    if(!currentHash){
      return;
    }

    index = currentHash.indexOf("?");
    if(index !== -1){
      queryString = currentHash.substr(index + 1);
      filterStr = Ext.Object.fromQueryString(queryString, true);
      Ext.each(me.filterSetters, function(set){
        set(filterStr);
      });
      if("__query" in filterStr){
        me.searchField.setValue(filterStr["__query"])
      }
      me.currentQuery = filterStr;
      me.store.setFilterParams(me.currentQuery);
    }
  },
  //
  onLevelUp: function(){
    var me = this,
      filter = me.grid.getComponent("filters").getComponent(me.levelFilter.filter),
      currentFilter = me.currentQuery[me.levelFilter.filter];

    if(currentFilter){
      NOC.api.requestLegacy({
        method: "GET",
        url: filter.tree.restUrl + "/" + currentFilter + "/get_path/",
        scope: me,
        success: function(response){
          var data = Ext.decode(response.responseText).data,
            newRoot;

          if(data.length <= 1){
            newRoot = "_root_"
          } else{
            newRoot = data[data.length - 2].id
          }
          filter.tree.restoreById(newRoot)
        },
      })
    }
  },
  //
  addTooltip: function(element){
    if(element.tooltip){
      Ext.create("Ext.tip.ToolTip", {
        target: element.getEl(),
        html: element.tooltip,
      });
    }
  },
  loadStore: function(query){
    var me = this,
      filter = Ext.clone(query || me.currentQuery),
      filterParams = Ext.Object.toQueryString(filter, true);
    me.store.load({
      callback: function(records, operation){
        me.checkStoreLoad(operation);
        if(operation.success && Ext.Object.toQueryString(me.currentQuery, true) === filterParams){
          me.saveFilterToUrl(filter);
        }
      },
    });
  },
  checkStoreLoad: function(operation){
    if(operation.success === false){
      var message = operation.getError() || t("msg-failed-to-load-data");
      if(Ext.isObject(message)){
        message = message.statusText;
      }
      NOC.error(message);
      return
    }
    if(operation.getResponse().status >= 300){
      NOC.error(t("msg-http-status-value0", {value0: operation.getResponse().status}));
    }
  },
});
