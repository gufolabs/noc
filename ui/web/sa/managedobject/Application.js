//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

const defaultColumns = [
  {
    xtype: "glyphactioncolumn",
    width: 25,
    items: [{
      glyph: NOC.glyph.cart_plus,
      handler: "onAddObject",
    }],
  },
  {
    text: t("header-s"),
    dataIndex: "oper_state",
    sortable: false,
    width: 30,
    renderer: function(value, metaData){
      var color = "grey";
      metaData.tdAttr = "data-qtip='<table style=\"font-size: 11px;\">" +
                "<tr><td style=\"padding-right: 10px;\"><div class=\"noc-object-oper-state\" style=\"background-color: grey;\"></div></td><td>" + t("msg-unmanaged-or-ping-is-disabled") + "</td></tr>" +
                "<tr><td><div class=\"noc-object-oper-state\" style=\"background-color: red;\"></div></td><td>" + t("msg-ping-fail") + "</td></tr>" +
                "<tr><td><div class=\"noc-object-oper-state\" style=\"background-color: yellow;\"></div></td><td>" + t("msg-device-has-alarm") + "</td></tr>" +
                "<tr><td><div class=\"noc-object-oper-state\" style=\"background-color: green;\"></div></td><td>" + t("msg-device-is-normal") + "</td></tr>" +
                "</table>'";
      if(value === "failed"){
        color = "red";
      } else if(value === "degraded"){
        color = "yellow";
      } else if(value === "full"){
        color = "green";
      }
      return "<div class='noc-object-oper-state' style='background-color: " + color + "'></div>";
    },
  },
  {
    text: t("header-name"),
    dataIndex: "name",
    width: 200,
  },
  {
    text: t("header-managed"),
    dataIndex: "is_managed",
    width: 30,
    renderer: NOC.render.Bool,
  },
  {
    text: t("header-state"),
    dataIndex: "state",
  },
  {
    text: t("app-title-address"),
    dataIndex: "address",
    width: 100,
  },
  {
    text: t("header-profile"),
    dataIndex: "profile",
    width: 100,
  },
  {
    text: t("app-title-platform"),
    dataIndex: "platform",
    flex: 1,
  },
  {
    text: t("header-version"),
    dataIndex: "version",
    flex: 1,
  },
  {
    text: t("header-obj-profile"),
    dataIndex: "object_profile",
    flex: 1,
  },
  {
    text: t("header-adm-domain"),
    dataIndex: "administrative_domain",
    flex: 1,
  },
  {
    text: t("app-title-authprofile"),
    dataIndex: "auth_profile",
    flex: 1,
  },
  {
    text: t("header-vrf"),
    dataIndex: "vrf",
    flex: 1,
  },
  {
    text: t("label-pool"),
    dataIndex: "pool",
    flex: 1,
  },
  {
    text: t("label-description"),
    dataIndex: "description",
    flex: 1,
  },
  {
    text: t("label-fqdn"),
    dataIndex: "fqdn",
    width: 200,
    hidden: true,
  },
  {
    text: t("header-interfaces"),
    dataIndex: "interface_count",
    width: 50,
    sortable: false,
    align: "right",
    renderer: function(value, metaData){
      metaData.tdStyle = "text-decoration-line: underline;cursor: pointer;";
      return value;
    },
  },
  {
    text: t("app-title-links"),
    dataIndex: "link_count",
    width: 50,
    sortable: true,
    align: "right",
    renderer: function(value, metaData){
      metaData.tdStyle = "text-decoration-line: underline;cursor: pointer;";
      return value;
    },
  },
  {
    text: t("header-labels"),
    dataIndex: "labels",
    renderer: NOC.render.LabelField,
    align: "right",
    width: 100,
  },
];
//
console.debug("Defining NOC.sa.managedobject.Application");
Ext.define("NOC.sa.managedobject.Application", {
  itemId: "sa-managedobject",
  extend: "NOC.core.Application",
  layout: "card",
  alias: "widget.managedobject",
  viewModel: "managedobject",
  controller: "managedobject",
  requires: [
    "Ext.layout.container.Card",
    "Ext.form.field.ComboBox",
    "NOC.sa.managedobject.ViewModel",
    "NOC.sa.managedobject.Controller",
    "NOC.core.filter.Filter",
    "NOC.sa.managedobject.form.View",
  ],
  stateMap: {
    w: t("msg-waiting"),
    r: t("msg-running"),
    s: t("msg-success"),
    f: t("msg-failed"),
  },
  defaults: {
    xtype: "panel",
    layout: "border",
    border: false,
    scrollable: false,
  },
  items: [
    {
      itemId: "managedobject-select",
      activeItem: 0,
      items: [
        { // device panel
          xtype: "panel",
          layout: "border",
          region: "center",
          border: false,
          scrollable: false,
          items: [
            {
              xtype: "grid", // selection grid
              stateful: true,
              stateId: "sa.managedobject-selection-grid",
              reference: "saManagedobjectSelectionGrid",
              region: "center",
              width: "50%",
              resizable: true,
              pageSize: 0,
              border: false,
              scrollable: true,
              emptyText: t("label-not-found"),
              columns: [{
                xtype: "glyphactioncolumn",
                width: 50,
                items: [
                  {
                    glyph: NOC.glyph.star,
                    tooltip: t("help-mark-unmark"),
                    getColor: function(cls, meta, r){
                      return r.get("fav_status") ? NOC.colors.starred : NOC.colors.unstarred;
                    },
                    handler: "onFavItem",
                  },
                  {
                    glyph: NOC.glyph.edit,
                    tooltip: t("app-title-edit"),
                    handler: "onEdit",
                  },
                ],
              }].concat(defaultColumns),
              bind: {
                store: "{selectionStore}",
                selection: "{selectionRow}",
              },
              selModel: {
                mode: "MULTI",
                selType: "checkboxmodel",
                showHeaderCheckbox: false,
              },
              listeners: {
                selectionchange: "onSelectionChange",
                itemdblclick: "onSelectionDblClick",
                afterrender: "setRowClass",
                cellclick: "onCellClick",
              },
              dockedItems: [{
                tbar: {
                  items: [
                    { // @todo: Search
                      glyph: NOC.glyph.refresh,
                      tooltip: t("help-refresh-data"),
                      style: {
                        pointerEvents: "all",
                      },
                      handler: "onSelectionRefresh",
                    },
                    {
                      xtype: "combo",
                      editable: false,
                      minWidth: 225,
                      emptyText: t("label-group-select"),
                      store: {
                        fields: ["cmd", "title"],
                        data: [
                          {"cmd": "SCREEN", "title": t("app-title-all-devices-on-screen")},
                          {"cmd": "FIRST_50", "title": t("app-title-first-50")},
                          {"cmd": "FIRST_100", "title": t("app-title-first-100")},
                          {"cmd": "N_ROWS", "title": t("app-title-first-n")},
                          {"cmd": "PERIOD", "title": t("app-title-period-start-qty")},
                        ],
                      },
                      queryMode: "local",
                      displayField: "title",
                      valueField: "cmd",
                      listeners: {
                        select: "onSelectionSelectAll",
                      },
                    },
                    {
                      text: t("btn-unselect-all"),
                      glyph: NOC.glyph.minus_circle,
                      tooltip: t("help-unselect-all-devices"),
                      style: {
                        pointerEvents: "all",
                      },
                      bind: {
                        disabled: "{!selectionGridHasSel}",
                      },
                      handler: "onSelectionUnselectAll",
                    },
                    "->",
                    {
                      text: t("btn-add"),
                      glyph: NOC.glyph.cart_plus,
                      tooltip: t("help-move-all-selected-devices-to-the-basket"),
                      style: {
                        pointerEvents: "all",
                      },
                      bind: {
                        disabled: "{!selectionGridHasSel}",
                      },
                      handler: "onSelectionAddChecked",
                    },
                    "|",
                    {
                      glyph: NOC.glyph.shopping_cart,
                      tooltip: t("help-show-hide-basket-2"),
                      style: {
                        pointerEvents: "all",
                      },
                      bind: {
                        disabled: "{!hasRecords}",
                        text: "{total.selected}",
                        style: {
                          cursor: "{cursorIcon}",
                        },
                      },
                      handler: "toggleBasket",
                    },
                    "|",
                    {
                      glyph: NOC.glyph.trash_o,
                      tooltip: t("help-clean-basket"),
                      style: {
                        pointerEvents: "all",
                      },
                      bind: {
                        disabled: "{!hasRecords}",
                        style: {
                          cursor: "{cursorIcon}",
                        },
                      },
                      handler: "onSelectedRemoveAll",
                    },
                    "|",
                    {
                      xtype: "box",
                      bind: {
                        html: '<span class="x-btn-inner x-btn-inner-default-toolbar-small">' + t("msg-selected-total-selection") + "</span",
                      },
                    },
                    "|",
                    {
                      xtype: "box",
                      bind: {
                        html: '<span class="x-btn-inner x-btn-inner-default-toolbar-small">' + t("msg-total-total-all") + "</span>",
                      },
                    }],
                },
              }],
              viewConfig: {
                enableTextSelection: true,
              },
            },
            {
              xtype: "grid", // selected grid
              stateful: true,
              stateId: "sa.managedobject-selected1-grid",
              reference: "saManagedobjectSelectedGrid1",
              bufferedRenderer: false,
              region: "east",
              width: "50%",
              collapsed: true,
              animCollapse: false,
              collapseMode: "mini",
              hideCollapseTool: true,
              resizable: true,
              pageSize: 0,
              border: false,
              scrollable: true,
              emptyText: t("label-nothing-checked"),
              columns: [{
                xtype: "glyphactioncolumn",
                width: 25,
                items: [{
                  glyph: NOC.glyph.minus_circle,
                  handler: "onRemoveObject",
                }],
              }].concat(defaultColumns),
              split: {
                xtype: "splitter",
              },
              bind: {
                store: "{selectedStore}",
                selection: "{selectedRow}",
              },
              listeners: {
                itemdblclick: "onSelectedDblClick",
                afterrender: "setRowClass",
              },
              dockedItems: [{
                tbar: {
                  items: [{
                    text: t("btn-remove-all"),
                    glyph: NOC.glyph.minus_circle,
                    tooltip: t("help-remove-all-devices-from-right-panel"),
                    style: {
                      pointerEvents: "all",
                    },
                    bind: {
                      disabled: "{!hasRecords}",
                      style: {
                        cursor: "{cursorIcon}",
                      },
                    },
                    handler: "onSelectedRemoveAll",
                  },
                          {
                            text: t("btn-export"),
                            glyph: NOC.glyph.arrow_down,
                            tooltip: t("help-save-all-from-basket"),
                            handler: "onExportBasket",

                          },
                          "->",
                          {
                            xtype: "container",
                            glyph: NOC.glyph.shopping_cart,
                            bind: {
                              html: '<span class="x-btn-button x-btn-button-default-toolbar-small x-btn-text x-btn-icon x-btn-icon-left x-btn-button-center">'
                                                + '<span class="x-btn-icon-el x-btn-icon-el-default-toolbar-small x-btn-glyph" style="font-family:FontAwesome;">&#xf07a;</span>'
                                                + '<span class="x-btn-inner x-btn-inner-default-toolbar-small">' + t("msg-total-total-selected") + "</span>"
                                                + "</span>",
                            },
                          }],
                },
              }],
              title: t("app-title-basket"),
              tools: [
                {
                  type: "right",
                  tooltip: t("help-hide-basket"),
                  callback: "toggleBasket",
                },
              ],
            },
          ],
        },
        {
          xtype: "NOC.Filter",
          reference: "filterPanel",
          region: "east",
          width: 300,
          collapsed: true,
          border: false,
          animCollapse: false,
          collapseMode: "mini",
          hideCollapseTool: true,
          split: {
            xtype: "splitter",
          },
          treeAlign: "left",
          resizable: true,
          selectionStore: "managedobject.selectionStore",
        },
      ],
      dockedItems: [
        {
          tbar: {
            items: [
              {
                xtype: "searchfield",
                itemId: "__query", // name of http request query param
                width: 400,
                emptyText: t("label-search"),
                triggers: {
                  clear: {
                    cls: "x-form-clear-trigger",
                    handler: "cleanSearchField",
                  },
                },
                listeners: {
                  specialkey: "onSearchFieldChange",
                },
              }, "|", {
                text: t("btn-filtering-list"),
                glyph: NOC.glyph.filter,
                tooltip: t("help-show-hide-filter"),
                style: {
                  pointerEvents: "all",
                },
                handler: "collapseFilter",
              }, {
                xtype: "splitbutton",
                text: t("btn-group-operation"),
                tooltip: t("help-select-action"),
                bind: {
                  disabled: "{!hasRecords}",
                },
                menu: {
                  items: [
                    {
                      text: t("nav-group-edit"),
                      glyph: NOC.glyph.edit,
                      bind: {
                        disabled: "{!hasUpdatePerm}",
                      },
                      handler: "onGroupEdit",
                    },
                    {
                      text: t("btn-run-discovery-now"),
                      glyph: NOC.glyph.play,
                      handler: "onRunDiscovery",
                    },
                    {
                      text: t("btn-set-managed"),
                      glyph: NOC.glyph.check,
                      handler: "onSetManaged",
                    },
                    {
                      text: t("btn-set-unmanaged"),
                      glyph: NOC.glyph.times,
                      handler: "onSetUnmanaged",
                    },
                    {
                      text: t("btn-new-maintenance"),
                      glyph: NOC.glyph.wrench,
                      handler: "onNewMaintenance",
                    },
                    {
                      text: t("btn-add-to-maintenance-2"),
                      glyph: NOC.glyph.plus,
                      handler: "onAddToMaintenance",
                    },
                    {
                      itemId: "runCmdBtn",
                      text: t("app-title-runcommands"),
                      glyph: NOC.glyph.play,
                      bind: {
                        disabled: "{!hasRunCmdPerm}",
                      },
                      handler: "toNext",
                    },
                  ],
                },
              }, {
                itemId: "createBtn",
                text: t("btn-add"),
                glyph: NOC.glyph.plus,
                tooltip: t("help-add-new-record"),
                bind: {
                  disabled: "{!hasCreatePerm}",
                },
                handler: "onNewRecord",
              },
            ],
          },
        },
      ],
    },
    {
      itemId: "managedobject-config",
      activeItem: 1,
      items: [
        {
          xtype: "grid",
          reference: "saManagedobjectSelectedGrid2",
          region: "center",
          width: "50%",
          border: false,
          scrollable: true,
          bind: "{selectedStore}",
          columns: defaultColumns.concat([{
            xtype: "glyphactioncolumn",
            width: 25,
            items: [{
              glyph: NOC.glyph.minus_circle,
              handler: "onRemoveObject",
            }],
          }]),
          listeners: {
            afterrender: "setRowClass",
          },
        },
        {
          xtype: "panel",
          region: "east",
          width: "50%",
          border: false,
          defaults: {
            padding: 4,
            width: "80%",
          },
          items: [
            {
              xtype: "panel",
              border: false,
              defaults: {
                padding: 10,
              },
              layout: {
                type: "hbox",
                align: "middle",
              },
              items: [
                {
                  xtype: "combo",
                  reference: "saManagedobjectMode",
                  fieldLabel: t("label-mode"),
                  labelWidth: 50,
                  queryMode: "local",
                  displayField: "name",
                  valueField: "value",
                  editable: false,
                  store: {
                    data: [
                      {value: "commands", name: t("app-title-runcommands")},
                      {value: "snippet", name: t("btn-run-snippet")},
                      {value: "action", name: t("btn-run-action")},
                    ],
                  },
                  listeners: {
                    change: "onConfigModeChange",
                    afterrender: function(field){
                      field.setValue("commands");
                    },
                  },
                },
                {
                  xtype: "checkboxfield",
                  reference: "ignoreCliErrors",
                  boxLabel: t("label-ignore-cli-errors"),
                  checked: true,
                },
                {
                  xtype: "checkboxfield",
                  reference: "dryRun",
                  boxLabel: t("label-dry-run-not-execute-command"),
                  checked: false,
                },
              ],
            },
            {
              xtype: "form",
              reference: "saManagedobjectCommandForm",
              width: "100%",
              border: false,
              defaults: {
                margin: 10,
                padding: 20,
                width: "80%",
              },
              bind: {
                disabled: "{!hasRecords}",
              },
              dockedItems: [{
                xtype: "toolbar",
                dock: "top",
                ui: "header",
                defaults: {minWidth: '<a href="#cfg-minButtonWidth">minButtonWidth</a>'},
                items: [
                  {xtype: "component", flex: 1},
                  {
                    xtype: "button", text: t("btn-run"),
                    glyph: NOC.glyph.play,
                    disabled: true,
                    formBind: true,
                    handler: "onRun",
                  },
                ],
              }],
            },
          ],
        },
      ],
      dockedItems: [{
        tbar: {
          items: [
            {
              glyph: NOC.glyph.arrow_left,
              tooltip: t("help-back"),
              style: {
                pointerEvents: "all",
              },
              handler: "toPrev",
            },
          ],
        },
      }],
    },
    {
      itemId: "run-command-progress",
      activeItem: 2,
      items: [
        {
          xtype: "grid",
          reference: "saManagedobjectSelectedGrid3",
          region: "center",
          width: "50%",
          border: false,
          scrollable: true,
          bind: "{selectedStore}",
          columns: defaultColumns.concat({
            text: t("header-status"),
            dataIndex: "status",
            width: 70,
            renderer: NOC.render.Choices({
              w: t("msg-waiting"),
              r: t("msg-running"),
              f: t("msg-failed"),
              s: t("msg-success"),
            }),
          }),
          selModel: {
            mode: "SINGLE",
            selType: "checkboxmodel",
          },
          listeners: {
            afterrender: "setStatusClass",
            select: "onShowResult",
          },
          dockedItems: [{
            xtype: "toolbar",
            dock: "top",
            items: {
              xtype: "segmentedbutton",
              height: 25,
              columns: 4,
              frame: false,
              allowMultiple: true,
              items: [
                {
                  pressed: true,
                  value: "w",
                  bind: {
                    text: "<span>" + t("msg-waiting") + '&nbsp;<span class="noc-badge noc-badge-waiting">{progressState.w}</span></span>',
                  },
                },
                {
                  pressed: true,
                  value: "r",
                  bind: {
                    text: "<span>" + t("msg-running") + '&nbsp;<span class="noc-badge noc-badge-running">{progressState.r}</span></span>',
                  },
                },
                {
                  pressed: true,
                  value: "f",
                  bind: {
                    text: "<span>" + t("msg-failed") + '&nbsp;<span class="noc-badge noc-badge-failed">{progressState.f}</span></span>',
                  },
                },
                {
                  pressed: true,
                  value: "s",
                  bind: {
                    text: "<span>" + t("msg-success") + '&nbsp;<span class="noc-badge noc-badge-success">{progressState.s}</span></span>',
                  },
                },
              ],
              listeners: {
                toggle: "onStatusToggle",
              },
            },
          }],
        },
        {
          xtype: "panel",
          region: "east",
          width: "50%",
          scrollable: true,
          padding: 4,
          items: {
            xtype: "container",
            layout: "fit",
            fieldStyle: {
              "fontFamily": "courier new",
              "fontSize": "12px",
            },
            bind: {
              html: "{resultOutput}",
            },
          },
        },
      ],
      dockedItems: [{
        tbar: {
          items: [
            {
              glyph: NOC.glyph.arrow_left,
              tooltip: t("help-back"),
              style: {
                pointerEvents: "all",
              },
              handler: "toPrev",
              bind: {
                disabled: "{isRunning}",
              },
            }, {
              glyph: NOC.glyph.print,
              tooltip: t("msg-report"),
              style: {
                pointerEvents: "all",
              },
              bind: {
                disabled: "{isRunning}",
              },
              handler: "onReportClick",
            },
          ],
        },
      }],
    },
    {
      itemId: "run-command-report",
      activeItem: 3,
      xtype: "panel",
      reference: "saRunCommandReportPanel",
      html: "",
      scrollable: true,
      bodyPadding: 4,
      dockedItems: [{
        xtype: "toolbar",
        dock: "top",
        items: [
          {
            glyph: NOC.glyph.arrow_left,
            tooltip: t("help-back"),
            style: {
              pointerEvents: "all",
            },
            handler: "toPrev",
          },
          {
            glyph: NOC.glyph.download,
            tooltip: t("help-download-results"),
            style: {
              pointerEvents: "all",
            },
            handler: "onDownload",
          },
        ],
      }],
    },
    {
      activeItem: 4,
      itemId: "managedobject-form",
      items: [
        {
          xtype: "managedobject.form",
        },
      ],
    },
  ],
  destroy: Ext.emptyFn,
  // Used inv.inv tab ManagedObject 
  loadById: function(id){
    var me = this;
    me.getController().editManagedObject(undefined, id, undefined, true);
  },
  // Apply a history token (back/forward or deep-link):
  //   []            -> selection grid
  //   [id]          -> object form
  //   [id, suffix]  -> object form sub-view (config, console, ...)
  applyHistory: function(args){
    var me = this;
    if(!args || args.length === 0){
      me.setActiveItem(0);
      me.restoreFilterFromUrl();
      return;
    }
    var id = args[0],
      suffix = args[1],
      formPanel = me.down("[itemId=managedobject-form-panel]");
    // If this object is already loaded, just switch the sub-view instead of a
    // full reload (back/forward between sub-views of the same object).
    if(formPanel && String(formPanel.recordId) === String(id)){
      var formView = formPanel.up();
      me.setActiveItem("managedobject-form");
      if(suffix){
        formView.getController().itemPreview("sa-" + suffix);
      } else{
        formView.setActiveItem("managedobject-form-panel");
      }
      return;
    }
    me.getController().editManagedObject(undefined, id, suffix);
  },
});
