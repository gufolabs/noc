//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.runcommands.Application");
Ext.define("NOC.sa.runcommands.Application", {
  extend: "NOC.core.Application",
  xtype: "layout-card",
  layout: "card",
  alias: "widget.runcommands",
  viewModel: "runcommands",
  controller: "runcommands",

  requires: [
    "Ext.layout.container.Card",
    "Ext.form.field.ComboBox",
    "NOC.sa.runcommands.ViewModel",
    "NOC.sa.runcommands.Controller",
    "NOC.core.filter.Filter",
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
      id: "run-command-select",
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
              reference: "sa-run-commands-selection-grid",
              // stateId: 'sa-run-commands-selection-grid',
              // stateful: true,
              region: "center",
              width: "50%",
              resizable: true,
              pageSize: 0,
              border: false,
              scrollable: true,
              emptyText: t("label-not-found"),
              bind: {
                store: "{selectionStore}",
                selection: "{selectionRow}",
              },
              selModel: {
                mode: "MULTI",
                selType: "checkboxmodel",
              },
              listeners: {
                selectionchange: "onSelectionChange",
                itemdblclick: "onSelectionDblClick",
                afterrender: "setRowClass",
              },
              dockedItems: [{
                tbar: {
                  items: [{ // @todo: Search
                    glyph: NOC.glyph.refresh,
                    tooltip: t("help-refresh-data"),
                    style: {
                      pointerEvents: "all",
                    },
                    handler: "onSelectionRefresh",
                  }, {
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
                  }, {
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
                  }, "->", {
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
                  }, "|", {
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
                  }, "|", {
                    xtype: "box",
                    bind: {
                      html: t("msg-selected-total-selection"),
                    },
                  }],
                },
              }],
              viewConfig: {
                enableTextSelection: true,
              },
            }, {
              xtype: "grid", // selected grid
              reference: "sa-run-commands-selected-grid-1",
              // stateId: 'sa-run-commands-selected-grid-1',
              // stateful: true,
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
                  }, "->", {
                    glyph: NOC.glyph.shopping_cart,
                    style: {
                      pointerEvents: "all",
                    },
                    bind: {
                      text: t("msg-total-total-selected"),
                      tooltip: t("help-hide-basket"),
                      style: {
                        cursor: "{cursorIcon}",
                      },
                    },
                    handler: "toggleBasket",
                  },
                  ],
                },
              }],
            },
          ],
        }, {
          xtype: "NOC.Filter",
          reference: "filterPanel",
          region: "west",
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
          selectionStore: "runcommands.selectionStore",
        },
      ],
      dockedItems: [{
        tbar: {
          items: [
            {
              text: t("btn-filtering-list"),
              glyph: NOC.glyph.filter,
              tooltip: t("help-show-hide-filter"),
              style: {
                pointerEvents: "all",
              },
              handler: "collapseFilter",
            }, {
              text: t("btn-do-checked"),
              tooltip: t("help-go-to-next-step"),
              style: {
                pointerEvents: "all",
              },
              glyph: NOC.glyph.play,
              bind: {
                disabled: "{!hasRecords}",
              },
              handler: "toNext",
            },
          ],
        },
      }],
    },
    {
      id: "run-command-config",
      activeItem: 1,
      items: [
        {
          xtype: "grid",
          reference: "sa-run-commands-selected-grid-2",
          region: "center",
          width: "50%",
          border: false,
          scrollable: true,
          bind: "{selectedStore}",
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
                {
                  xtype: "combo",
                  reference: "saRunCommandsMode",
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
              ],
            },
            {
              xtype: "form",
              reference: "sa-run-commands-command-form",
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
      id: "run-command-progress",
      activeItem: 2,
      items: [
        {
          xtype: "grid",
          reference: "sa-run-commands-selected-grid-3",
          region: "center",
          width: "50%",
          border: false,
          scrollable: true,
          bind: "{selectedStore}",
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
      id: "run-command-report",
      activeItem: 3,
      xtype: "panel",
      reference: "sa-run-commands-report-panel",
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
  ],
});
