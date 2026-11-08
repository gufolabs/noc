//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
this.fieldSetDefaults = {
  xtype: "container",
  padding: 10,
  layout: "form",
  columnWidth: 0.5,
};

console.debug("Defining NOC.sa.managedobject.form.View");
Ext.define("NOC.sa.managedobject.form.View", {
  extend: "Ext.panel.Panel",
  mixins: [
    "NOC.core.ModelApplication",
  ],
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.label.LabelDisplay",
    "NOC.core.status.StatusField",
    "NOC.core.combotree.ComboTree",
    "NOC.core.ComboBox",
    "NOC.core.InlineGrid",
    "NOC.core.InlineModelStore",
    "NOC.core.PasswordField",
    "NOC.core.StateField",
    "NOC.core.MonacoPanel",
    "NOC.core.plugins.DynamicModalEditing",
    "NOC.main.glyph.LookupField",
    "NOC.main.ref.soposition.LookupField",
    "NOC.main.ref.soform.LookupField",
    "NOC.sa.managedobject.AttributesModel",
    "NOC.sa.managedobject.CapabilitiesModel",
    "NOC.sa.managedobject.form.FormController",
    "NOC.sa.managedobject.SchemeLookupField",
    "NOC.sa.managedobject.ConfDBPanel",
    "NOC.sa.managedobject.ConsolePanel",
    "NOC.sa.managedobject.ScriptPanel",
    "NOC.sa.managedobject.LinksPanel",
    "NOC.sa.managedobject.InterfacePanel",
    "NOC.sa.managedobject.SensorsPanel",
    "NOC.sa.managedobject.DiscoveryPanel",
    "NOC.sa.managedobject.AlarmPanel",
    "NOC.sa.managedobject.InventoryPanel",
    "NOC.sa.managedobject.InteractionsPanel",
  ],
  alias: "widget.managedobject.form",
  controller: "managedobject.form",
  region: "center",
  layout: "card",
  border: false,
  // padding: 4,
  defaults: {
    layout: "fit",
  },
  stateMargin: "0 0 5 30",
  stateLabelWidth: 83,
  items: [
    {
      activeItem: 0,
      itemId: "managedobject-form-panel",
      xtype: "form",
      layout: "anchor",
      border: false,
      padding: 4,
      defaults: {
        anchor: "100%",
        minWidth: 800,
        maxWidth: 1000,
      },
      scrollable: true,
      listeners: {
        scope: this,
        validitychange: function(me, isValid){
          var btnQuery = [
            "[itemId=saveBtn]",
            "[itemId=applyBtn]",
            "[itemId=groupSaveBtn]",
            "[itemId=groupApplyBtn]",
          ].join(",");
          Ext.each(Ext.ComponentQuery.query(btnQuery), function(button){
            button.setDisabled(!isValid);
          });
        },
      },
      items: [
        {
          xtype: "container",
          html: "Title",
          itemId: "formTitle",
          padding: 4,
          style: {
            fontWeight: "bold",
          },
        },
        {
          xtype: "fieldset",
          layout: "column",
          defaults: this.fieldSetDefaults,
          border: false,
          margin: 0,
          padding: "5 15 0 15",
          items: [
            {
              border: false,
              items: [ // first column
                {
                  name: "name",
                  xtype: "textfield",
                  fieldLabel: t("header-name"),
                  tabIndex: 10,
                  allowBlank: false,
                  autoFocus: true,
                },
                {
                  name: "description",
                  xtype: "textarea",
                  fieldLabel: t("label-description"),
                  allowBlank: true,
                  tabIndex: 20,
                  groupEdit: true,
                },
                {
                  name: "is_managed",
                  xtype: "displayfield",
                  fieldLabel: t("msg-is-managed"),
                  allowBlank: true,
                  renderer: NOC.render.Bool,
                },
              ],
            }, {
              border: false,
              items: [ // second column
                {
                  name: "diagnostics",
                  fieldLabel: t("label-diag"),
                  xtype: "statusfield",
                  allowBlank: true,
                },
                {
                  name: "labels",
                  fieldLabel: t("header-labels"),
                  tabIndex: 40,
                  xtype: "labelfield",
                  allowBlank: true,
                  minWidth: 100,
                  query: {
                    "allow_models": ["sa.ManagedObject"],
                  },
                },
                {
                  name: "bi_id",
                  xtype: "displayfield",
                  fieldLabel: t("label-bi-id"),
                  allowBlank: true,
                  renderer: NOC.clipboard,
                },
                {
                  name: "mappings",
                  xtype: "displayfield",
                  fieldLabel: t("label-mappings"),
                  allowBlank: true,
                  renderer: function(values){
                    if(values === undefined || values === null || Ext.isEmpty(values)){
                      return "-";
                    }
                    var isArray = Array.isArray(values),
                      v = isArray ? values : [values];
                    return v.map(function(value){
                      var mappingString = value.remote_system__label + ": " + value.remote_id; 
                      if(Ext.isEmpty(value.url)){
                        return mappingString + NOC.clipboardIcon(value.remote_id);
                      }
                      return "<a href='" + value.url + "' target='_blank'>" + mappingString + "</a>"
                         + NOC.clipboardIcon(value.remote_id);
                    }).join("<br/>");
                  },
                },
              ],
            },
          ],
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          tabIndex: 50,
          restUrl: "sa/managedobject/",
          allowBlank: false,
        },
        {
          xtype: "fieldset",
          title: t("app-title-effective-labels"),
          collapsible: true,
          collapsed: true,
          items: [
            {
              xtype: "container",
              items: [
                {
                  name: "effective_labels",
                  xtype: "labeldisplay",
                  fieldLabel: t("label-effective"),
                  allowBlank: true,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-role"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              items: [
                {
                  name: "object_profile",
                  xtype: "core.combo",
                  restUrl: "/sa/managedobjectprofile/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("msg-object-profile"),
                  tabIndex: 60,
                  tooltip: t("help-more-settings-for-worked-with-devices-br-place-on-service-activa"),
                  itemId: "object_profile",
                  allowBlank: false,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "glyph",
                  xtype: "main.glyph.LookupField",
                  restUrl: "/main/glyph/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("app-title-glyph"),
                  tabIndex: 70,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "shape_overlay_glyph",
                  xtype: "main.glyph.LookupField",
                  restUrl: "/main/glyph/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-overlay-glyph"),
                  tabIndex: 80,
                  allowBlank: true,
                },
              ],
            },
            {
              items: [
                {
                  name: "shape_overlay_position",
                  xtype: "main.ref.soposition.LookupField",
                  fieldLabel: t("label-position"),
                  tabIndex: 90,
                  allowBlank: true,
                },
                {
                  name: "shape_overlay_form",
                  xtype: "main.ref.soform.LookupField",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-form"),
                  tabIndex: 100,
                  allowBlank: true,
                },
                {
                  name: "shape_title_template",
                  xtype: "textfield",
                  fieldLabel: t("label-shape-name-template"),
                  tabIndex: 110,
                  allowBlank: true,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-platform"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              items: [
                {
                  name: "vendor",
                  xtype: "core.combo",
                  restUrl: "/inv/vendor/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("header-vendor"),
                  tabIndex: 120,
                  tooltip: t("help-set-after-version-discovery-not-for-manual-set"),
                  allowBlank: true,
                  listeners: {
                    render: "addTooltip",
                  },
                }, {
                  name: "platform",
                  xtype: "core.combo",
                  restUrl: "/inv/platform/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("app-title-platform"),
                  tabIndex: 130,
                  tooltip: t("help-set-after-version-discovery-not-for-manual-set"),
                  allowBlank: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
              ],
            }, {
              items: [
                {
                  name: "version",
                  xtype: "core.combo",
                  restUrl: "/inv/firmware/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("header-version"),
                  tabIndex: 140,
                  allowBlank: true,
                }, {
                  name: "software_image",
                  xtype: "displayfield",
                  fieldLabel: t("label-software-image"),
                  tabIndex: 150,
                  allowBlank: true,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("label-access"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              items: [
                {
                  name: "profile",
                  xtype: "core.combo",
                  restUrl: "/sa/profile/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("header-sa-profile"),
                  tabIndex: 160,
                  labelStyle: "font-weight:bold",
                  tooltip: t("help-profile-adapter-for-device-work-br-auto-detect-profile-by-snmp-i"),
                  allowBlank: true,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "scheme",
                  xtype: "sa.managedobject.SchemeLookupField",
                  fieldLabel: t("label-scheme"),
                  tabIndex: 170,
                  allowBlank: false,
                  groupEdit: true,
                },
                {
                  name: "address",
                  xtype: "textfield",
                  fieldLabel: t("app-title-address"),
                  tabIndex: 180,
                  allowBlank: true,
                  groupEdit: true,
                  vtype: "IPv4Group",
                },
                {
                  name: "access_preference",
                  xtype: "combobox",
                  fieldLabel: t("label-access-preference"),
                  tabIndex: 190,
                  tooltip: t("help-preference-mode-with-worked-profile-script-br-work-if-device-pro-2"),
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["S", t("msg-snmp-only")],
                    ["C", t("msg-cli-only")],
                    ["SC", t("msg-snmp-cli")],
                    ["CS", t("msg-cli-snmp")],
                  ],
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "port",
                  xtype: "numberfield",
                  fieldLabel: t("header-port"),
                  tabIndex: 200,
                  allowBlank: true,
                  minValue: 0,
                  maxValue: 65535,
                  hideTrigger: true,
                  groupEdit: true,
                },
                {
                  name: "cli_session_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-cli-session-policy"),
                  tabIndex: 210,
                  tooltip: t("help-use-one-session-worked-on-device-br-profile-default-use-object-p"),
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "cli_privilege_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-cli-privilege-policy"),
                  tabIndex: 220,
                  tooltip: t("help-do-enable-if-login-unprivileged-mode-on-device-br-raise-privileg"),
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("msg-raise-privileges")],
                    ["D", t("msg-don-t-raise")],
                  ],
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
              ],
            },
            {
              items: [
                {
                  name: "remote_path",
                  xtype: "textfield",
                  fieldLabel: t("header-path"),
                  tabIndex: 230,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "auth_profile",
                  xtype: "core.combo",
                  restUrl: "/sa/authprofile/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("app-title-authprofile"),
                  tabIndex: 240,
                  tooltip: t("help-get-credentials-user-pass-snmp-etc-from-auth-profile-br-service-"),
                  allowBlank: true,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "user",
                  xtype: "textfield",
                  fieldLabel: t("header-user"),
                  tabIndex: 250,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "password",
                  xtype: "password",
                  fieldLabel: t("label-password"),
                  tabIndex: 260,
                  allowBlank: true,
                  inputType: "password",
                  groupEdit: true,
                },
                {
                  name: "super_password",
                  xtype: "password",
                  fieldLabel: t("label-super-password"),
                  tabIndex: 270,
                  allowBlank: true,
                  inputType: "password",
                  groupEdit: true,
                },
                {
                  name: "max_scripts",
                  xtype: "numberfield",
                  fieldLabel: t("label-max-scripts"),
                  tabIndex: 280,
                  allowBlank: true,
                  hideTrigger: true,
                  minValue: 0,
                  maxValue: 99,
                  groupEdit: true,
                },
                {
                  name: "time_pattern",
                  xtype: "core.combo",
                  restUrl: "/main/timepattern/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("header-time-pattern"),
                  tabIndex: 300,
                  tooltip: t("help-use-this-field-if-you-want-disable-ping-check-on-specified-time-"),
                  allowBlank: true,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-snmp"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              items: [
                {
                  name: "snmp_security_level",
                  xtype: "combobox",
                  fieldLabel: t("label-security-level"),
                  tabIndex: 305,
                  groupEdit: true,
                  store: [
                    ["Community", "Community"],
                    ["noAuthNoPriv", "No Auth No Priv"],
                    ["authNoPriv", "Auth No Priv"],
                    ["authPriv", "Auth Priv"],
                  ],
                  queryMode: "local",
                  value: "Community",
                  listeners: {
                    change: "onChangeSNMP_SecurityLevel",
                  },
                },
                {
                  name: "snmp_ro",
                  xtype: "password",
                  fieldLabel: t("label-ro-community"),
                  tabIndex: 310,
                  readOnlyCls: "x-item-disabled",
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "snmp_rw",
                  xtype: "password",
                  fieldLabel: t("label-rw-community"),
                  tabIndex: 320,
                  readOnlyCls: "x-item-disabled",
                  allowBlank: true,
                  groupEdit: true,
                },
              ],
            },
            {
              items: [
                {
                  name: "snmp_username",
                  xtype: "textfield",
                  fieldLabel: t("header-username"),
                  tabIndex: 322,
                  readOnlyCls: "x-item-disabled",
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "snmp_ctx_name",
                  xtype: "textfield",
                  fieldLabel: t("label-context-name"),
                  tabIndex: 324,
                  readOnlyCls: "x-item-disabled",
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "snmp_rate_limit",
                  xtype: "numberfield",
                  fieldLabel: t("label-rate-limit"),
                  tabIndex: 325,
                  tooltip: t("help-limit-snmp-query-per-second"),
                  allowBlank: true,
                  hideTrigger: true,
                  minValue: 0,
                  maxValue: 99,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  xtype: "fieldcontainer",
                  itemId: "snmp_auth_proto",
                  fieldLabel: t("label-auth-proto"),
                  visible: false,
                  defaultType: "radiofield",
                  defaults: {
                    flex: 1,
                  },
                  layout: "hbox",
                  items: [
                    {
                      boxLabel: "MD5",
                      tabIndex: 325,
                      groupEdit: true,
                      name: "snmp_auth_proto",
                      padding: "0 5",
                      inputValue: "MD5",
                    },
                    {
                      boxLabel: "SHA",
                      tabIndex: 326,
                      groupEdit: true,
                      name: "snmp_auth_proto",
                      inputValue: "SHA",
                    },
                  ],
                },
                {
                  xtype: "password",
                  fieldLabel: t("label-auth-key"),
                  tabIndex: 327,
                  visible: false,
                  name: "snmp_auth_key",
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  xtype: "fieldcontainer",
                  itemId: "snmp_priv_proto",
                  fieldLabel: t("label-priv-proto"),
                  visible: false,
                  defaultType: "radiofield",
                  defaults: {
                    flex: 1,
                  },
                  layout: "hbox",
                  items: [
                    {
                      boxLabel: "DES",
                      tabIndex: 328,
                      groupEdit: true,
                      name: "snmp_priv_proto",
                      padding: "0 5",
                      inputValue: "DES",
                    },
                    {
                      boxLabel: "AES",
                      tabIndex: 329,
                      groupEdit: true,
                      name: "snmp_priv_proto",
                      inputValue: "AES",
                    },
                  ],
                },
                {
                  xtype: "password",
                  fieldLabel: t("label-priv-key"),
                  tabIndex: 330,
                  visible: false,
                  name: "snmp_priv_key",
                  allowBlank: true,
                  groupEdit: true,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-location-d219c6"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              items: [
                {
                  name: "administrative_domain",
                  xtype: "noc.core.combotree",
                  restUrl: "/sa/administrativedomain/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("header-administrative-domain-d113be"),
                  tabIndex: 335,
                  tooltip: t("help-use-for-setup-user-permission-on-object-br-place-on-service-acti"),
                  allowBlank: false,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "segment",
                  xtype: "noc.core.combotree",
                  restUrl: "/inv/networksegment/",
                  fieldLabel: t("header-segment-44986c"),
                  tabIndex: 340,
                  allowBlank: false,
                  groupEdit: true,
                },
                {
                  name: "pool",
                  xtype: "core.combo",
                  restUrl: "/main/pool/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-pool"),
                  tabIndex: 350,
                  tooltip: t("help-use-for-shard-devices-over-intersection-ip-address-spaces-br-cre"),
                  allowBlank: false,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "project",
                  xtype: "core.combo",
                  restUrl: "/project/project/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-project"),
                  tabIndex: 360,
                  allowBlank: true,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "fqdn",
                  xtype: "textfield",
                  fieldLabel: t("label-fqdn"),
                  tabIndex: 370,
                  tooltip: t("help-set-device-name-if-fqdn-suffix-is-not-set-use-dot-after-name-nam"),
                  allowBlank: true,
                  uiStyle: "medium",
                  listeners: {
                    render: "addTooltip",
                  },
                },
              ],
            }, {
              items: [
                {
                  name: "vrf",
                  xtype: "core.combo",
                  restUrl: "/ip/vrf/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("header-vrf"),
                  tabIndex: 380,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "l2_domain",
                  xtype: "core.combo",
                  restUrl: "/vc/l2domain/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("header-l2-domain"),
                  tabIndex: 390,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "autosegmentation_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-autosegmentation-policy"),
                  tabIndex: 400,
                  allowBlank: true,
                  groupEdit: true,
                  store: [
                    ["p", t("header-profile")],
                    ["d", t("msg-do-not-segmentate")],
                    ["e", t("msg-allow-autosegmentation")],
                    ["o", t("msg-segmentate-to-existing-segment")],
                    ["c", t("msg-segmentate-to-child-segment")],
                  ],
                },
                {
                  name: "address_resolution_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-address-resolution-policy"),
                  tabIndex: 410,
                  tooltip: t("help-activate-resolve-address-by-fqnd-field-or-other-handler-br-profi"),
                  store: [
                    ["P", t("header-profile")],
                    ["D", t("msg-disabled")],
                    ["O", t("msg-once")],
                    ["E", t("header-enabled")],
                  ],
                  allowBlank: false,
                  uiStyle: "medium",
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "container",
                  xtype: "noc.core.combotree",
                  restUrl: "/inv/container/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-container-2"),
                  tabIndex: 420,
                  allowBlank: true,
                  groupEdit: true,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-discovery-policy"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              name: "config_policy",
              xtype: "combobox",
              reference: "configPolicy",
              fieldLabel: t("btn-config"),
              tabIndex: 430,
              allowBlank: false,
              tooltip: t("help-select-method-of-config-gathering"),
              displayField: "label",
              valueField: "id",
              store: {
                fields: ["id", "label"],
                data: [
                  {"id": "P", "label": t("header-profile")},
                  {"id": "s", "label": t("label-script")},
                  {"id": "S", "label": t("msg-script-download")},
                  {"id": "D", "label": t("btn-download-script")},
                  {"id": "d", "label": t("btn-download")},
                ],
              },
            },
            {
              name: "config_fetch_policy",
              xtype: "combobox",
              fieldLabel: t("label-config-fetch"),
              tabIndex: 440,
              allowBlank: false,
              tooltip: t("help-select-method-of-config-fetching"),
              displayField: "label",
              valueField: "id",
              store: {
                fields: ["id", "label"],
                data: [
                  {"id": "P", "label": t("header-profile")},
                  {"id": "s", "label": t("msg-prefer-startup")},
                  {"id": "r", "label": t("msg-prefer-running")},
                ],
              },
            },
            {
              name: "caps_discovery_policy",
              xtype: "combobox",
              fieldLabel: t("header-caps"),
              tabIndex: 450,
              store: [
                ["P", t("header-profile")],
                ["s", t("label-script")],
                ["S", t("msg-script-confdb")],
                ["C", t("msg-confdb-script")],
                ["c", t("msg-confdb")],
              ],
              allowBlank: false,
              uiStyle: "medium",
            },
            {
              name: "interface_discovery_policy",
              xtype: "combobox",
              fieldLabel: t("header-interface"),
              tabIndex: 460,
              store: [
                ["P", t("header-profile")],
                ["s", t("label-script")],
                ["S", t("msg-script-confdb")],
                ["C", t("msg-confdb-script")],
                ["c", t("msg-confdb")],
              ],
              allowBlank: false,
              uiStyle: "medium",
            },
            {
              name: "vlan_discovery_policy",
              xtype: "combobox",
              fieldLabel: t("app-title-vlan"),
              tabIndex: 470,
              store: [
                ["P", t("header-profile")],
                ["s", t("label-script")],
                ["S", t("msg-script-confdb")],
                ["C", t("msg-confdb-script")],
                ["c", t("msg-confdb")],
              ],
              allowBlank: false,
              uiStyle: "medium",
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("msg-confdb"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              name: "confdb_raw_policy",
              xtype: "combobox",
              fieldLabel: t("label-raw-policy"),
              tabIndex: 480,
              store: [
                ["P", t("header-profile")],
                ["E", t("label-enable")],
                ["D", t("status-disable")],
              ],
              allowBlank: false,
              groupEdit: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-event-sources"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          items: [
            {
              items: [
                {
                  name: "fm_pool",
                  xtype: "core.combo",
                  restUrl: "/main/pool/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-fm-pool"),
                  tabIndex: 490,
                  tooltip: t("help-use-to-override-pool-for-events-processing"),
                  allowBlank: true,
                  groupEdit: true,
                  listeners: {
                    render: "addTooltip",
                  },
                },
                {
                  name: "event_processing_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-event-policy"),
                  tabIndex: 500,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  allowBlank: false,
                  groupEdit: true,
                },
                {
                  name: "trap_source_type",
                  xtype: "combobox",
                  fieldLabel: t("label-trap-source"),
                  tabIndex: 510,
                  store: [
                    ["d", t("status-disable")],
                    ["m", t("msg-management-address")],
                    ["s", t("msg-specify-address")],
                    ["l", t("msg-loopback-address")],
                    ["a", t("msg-all-interface-addresses")],
                  ],
                  listeners: {
                    scope: this,
                    change: function(combo, newValue){
                      combo.nextSibling().setHidden(newValue !== "s");
                    },
                    afterrender: function(combo){
                      combo.nextSibling().setHidden(combo.value !== "s");
                    },
                  },
                  groupEdit: true,
                },
                {
                  name: "trap_source_ip",
                  xtype: "textfield",
                  fieldLabel: t("label-trap-source-ip"),
                  tabIndex: 520,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "syslog_archive_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-syslog-archive-policy"),
                  tabIndex: 530,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  allowBlank: false,
                  groupEdit: true,
                },
              ],
            }, {
              items: [
                {
                  name: "syslog_source_type",
                  xtype: "combobox",
                  fieldLabel: t("label-syslog-source"),
                  tabIndex: 540,
                  store: [
                    ["d", t("status-disable")],
                    ["m", t("msg-management-address")],
                    ["s", t("msg-specify-address")],
                    ["l", t("msg-loopback-address")],
                    ["a", t("msg-all-interface-addresses")],
                  ],
                  listeners: {
                    scope: this,
                    change: function(combo, newValue){
                      combo.nextSibling().setHidden(newValue !== "s");
                    },
                    afterrender: function(combo){
                      combo.nextSibling().setHidden(combo.value !== "s");
                    },
                  },
                  groupEdit: true,
                },
                {
                  name: "syslog_source_ip",
                  xtype: "textfield",
                  fieldLabel: t("label-syslog-source-ip"),
                  tabIndex: 550,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "trap_community",
                  xtype: "password",
                  fieldLabel: t("label-trap-community"),
                  tabIndex: 560,
                  allowBlank: true,
                  groupEdit: true,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("nav-resourcegroup"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          collapsed: false,
          items: [
            {
              name: "static_service_groups",
              xtype: "gridfield",
              columns: [
                // {
                //     xtype: "glyphactioncolumn",
                //     width: 20,
                //     sortable: false,
                //     items: [
                //         {
                //             glyph: NOC.glyph.search,
                //             tooltip: t("Show Card"),
                //             scope: this,
                //             handler: this.onShowResourceGroup
                //         }
                //     ]
                // },
                {
                  dataIndex: "group",
                  text: t("btn-static-service-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "core.combo",
                    restUrl: "/inv/resourcegroup/lookup/",

                  },
                },
              ],
            },
            {
              name: "effective_service_groups",
              xtype: "gridfield",
              columns: [
                {
                  dataIndex: "group",
                  text: t("btn-effective-service-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "core.combo",
                    restUrl: "/inv/resourcegroup/lookup/",
                  },
                },
              ],
            },
            {
              name: "static_client_groups",
              xtype: "gridfield",
              columns: [
                {
                  dataIndex: "group",
                  text: t("btn-static-client-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "core.combo",
                    restUrl: "/inv/resourcegroup/lookup/",
                  },
                },
              ],
            },
            {
              name: "effective_client_groups",
              xtype: "gridfield",
              columns: [
                {
                  dataIndex: "group",
                  text: t("btn-effective-client-groups"),
                  width: 350,
                  renderer: NOC.render.Lookup("group"),
                  editor: {
                    xtype: "core.combo",
                    restUrl: "/inv/resourcegroup/lookup/",
                  },
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-cpe"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          items: [
            {
              items: [
                {
                  name: "controller",
                  xtype: "core.combo",
                  restUrl: "/sa/managedobject/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-controller"),
                  tabIndex: 570,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "local_cpe_id",
                  xtype: "textfield",
                  fieldLabel: t("label-local-cpe-id"),
                  tabIndex: 580,
                  allowBlank: true,
                }],
            },
            {
              items: [
                {
                  name: "global_cpe_id",
                  xtype: "textfield",
                  fieldLabel: t("label-global-cpe-id"),
                  tabIndex: 590,
                  allowBlank: true,
                },
                {
                  name: "last_seen",
                  xtype: "displayfield",
                  fieldLabel: t("header-last-seen-20c226"),
                  tabIndex: 600,
                  allowBlank: true,
                }],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-rules"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          items: [
            {
              items: [
                {
                  name: "config_filter_handler",
                  xtype: "core.combo",
                  restUrl: "/main/handler/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-config-filter-handler"),
                  tabIndex: 610,
                  allowBlank: true,
                  groupEdit: true,
                  query: {
                    allow_config_filter: true,
                  },
                },
                {
                  name: "config_diff_filter_handler",
                  xtype: "core.combo",
                  restUrl: "/main/handler/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-config-diff-filter-handler"),
                  tabIndex: 620,
                  allowBlank: true,
                  groupEdit: true,
                  query: {
                    allow_config_filter: true,
                  },
                }],
            }, {
              items: [
                {
                  name: "config_validation_handler",
                  xtype: "core.combo",
                  restUrl: "/main/handler/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("label-config-validation-handler"),
                  tabIndex: 630,
                  allowBlank: true,
                  groupEdit: true,
                  query: {
                    allow_config_validation: true,
                  },
                }],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-escalation"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          items: [
            {
              items: [
                {
                  name: "escalation_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-escalation-policy"),
                  tabIndex: 660,
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                    ["R", t("msg-as-depended")],
                  ],
                  groupEdit: true,
                },
                {
                  name: "tt_system",
                  xtype: "core.combo",
                  restUrl: "/fm/ttsystem/lookup/",
                  uiStyle: "medium-combo",
                  fieldLabel: t("app-title-ttsystem"),
                  tabIndex: 670,
                  allowBlank: true,
                  groupEdit: true,
                }],
            }, {
              items: [
                {
                  name: "tt_queue",
                  xtype: "textfield",
                  fieldLabel: t("header-tt-queue"),
                  tabIndex: 680,
                  allowBlank: true,
                  groupEdit: true,
                },
                {
                  name: "tt_system_id",
                  xtype: "textfield",
                  fieldLabel: t("label-tt-system-id"),
                  tabIndex: 690,
                  allowBlank: true,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-discovery-alarm"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          items: [
            {
              items: [
                {
                  name: "box_discovery_alarm_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-box-alarm"),
                  tabIndex: 700,
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  groupEdit: true,
                }],
            },
            {
              items: [
                {
                  name: "periodic_discovery_alarm_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-periodic-alarm"),
                  tabIndex: 710,
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  groupEdit: true,
                }],
            },
            {
              items: [
                {
                  name: "denied_firmware_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-on-denied-firmware"),
                  tabIndex: 720,
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["I", t("choice-ignore")],
                    ["s", t("msg-ignore-stop")],
                    ["A", t("msg-raise-alarm")],
                    ["S", t("msg-raise-alarm-stop")],
                  ],
                  groupEdit: true,
                }],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-telemetry"),
          layout: "column",
          defaults: this.fieldSetDefaults,
          collapsible: true,
          collapsed: true,
          items: [
            {
              items: [
                {
                  name: "box_discovery_telemetry_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-box-telemetry"),
                  tabIndex: 730,
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  groupEdit: true,
                },
                {
                  name: "box_discovery_telemetry_sample",
                  xtype: "numberfield",
                  fieldLabel: t("label-box-sample"),
                  tabIndex: 740,
                  groupEdit: true,
                }],
            }, {
              items: [
                {
                  name: "periodic_discovery_telemetry_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-periodic-telemetry"),
                  tabIndex: 750,
                  allowBlank: true,
                  store: [
                    ["P", t("header-profile")],
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  groupEdit: true,
                },
                {
                  name: "periodic_discovery_telemetry_sample",
                  xtype: "numberfield",
                  fieldLabel: t("label-periodic-sample"),
                  tabIndex: 760,
                  groupEdit: true,
                }],
            },
          ],
        },
        {
          xtype: "fieldset",
          anchor: "100%",
          minHeight: 130,
          title: t("app-title-attributes"),
          collapsible: true,
          collapsed: true,
          items: [
            {
              xtype: "inlinegrid",
              itemId: "sa-managedobject-attr-inline",
              model: "NOC.sa.managedobject.AttributesModel",
              columns: [
                {
                  text: t("header-key"),
                  dataIndex: "key",
                  width: 100,
                  editor: "textfield",
                },
                {
                  text: t("header-value"),
                  dataIndex: "value",
                  editor: "textfield",
                  flex: 1,
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          anchor: "100%",
          minHeight: 130,
          title: t("header-capabilities"),
          collapsible: true,
          collapsed: false,
          items: [
            {
              xtype: "inlinegrid",
              itemId: "sa-managedobject-caps-inline",
              model: "NOC.sa.managedobject.CapabilitiesModel",
              readOnly: true,
              bbar: {},
              plugins: [
                {
                  ptype: "dynamicmodalediting",
                  listeners: {
                    canceledit: "onCancelEdit",
                  },
                },
              ],
              columns: [
                {
                  text: t("app-title-capability"),
                  dataIndex: "capability",
                  width: 300,
                },
                {
                  text: t("header-value"),
                  dataIndex: "value",
                  useModalEditor: true,
                  width: 280,
                  urlPrefix: "/sa/managedobject",
                },
                {
                  text: t("header-scope"),
                  dataIndex: "scope",
                  width: 80,
                },
                {
                  text: t("header-source"),
                  dataIndex: "source",
                  width: 80,
                },
                {
                  text: t("label-description"),
                  dataIndex: "description",
                  flex: 1,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      activeItem: 1,
      itemId: "sa-config",
      // xtype: "sa.repopreview",
      xtype: "core.monacopanel",
      historyHashPrefix: "config", // suffix from itemId
      app: this,
      previewName: "{0} config",
      restUrl: "/sa/managedobject/{0}/repo/cfg/",
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 2,
      itemId: "sa-confdb",
      xtype: "sa.confdb",
      historyHashPrefix: "confdb", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 3,
      itemId: "sa-console",
      xtype: "sa.console",
      historyHashPrefix: "console", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 4,
      itemId: "sa-script",
      xtype: "sa.script",
      historyHashPrefix: "script", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 5,
      itemId: "sa-interface_count",
      xtype: "sa.interfacepanel",
      historyHashPrefix: "interface_count", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 6,
      itemId: "sa-sensors",
      xtype: "sa.sensors",
      historyHashPrefix: "sensors", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 7,
      itemId: "sa-link_count",
      xtype: "sa.links",
      historyHashPrefix: "link_count", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 8,
      itemId: "sa-discovery",
      xtype: "sa.discovery",
      historyHashPrefix: "discovery", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 9,
      itemId: "sa-alarms",
      xtype: "sa.alarms",
      historyHashPrefix: "alarms", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 10,
      itemId: "sa-inventory",
      xtype: "sa.inventory",
      historyHashPrefix: "inventory", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
    {
      activeItem: 11,
      itemId: "sa-interactions",
      xtype: "sa.interactions",
      historyHashPrefix: "interactions", // suffix from itemId
      app: this,
      onClose: function(){
        this.up().setActiveItem(this.backItem);
        this.up("[appId=sa.managedobject]").setHistoryHash(this.currentRecord.id);
      },
    },
  ],
  dockedItems: [{
    xtype: "toolbar",
    dock: "top",
    overflowHandler: "menu",
    items: [
      {
        itemId: "saveBtn",
        text: t("btn-save"),
        tooltip: t("help-save-changes"),
        glyph: NOC.glyph.save,
        handler: "onSaveRecord",
      },
      {
        itemId: "applyBtn",
        text: t("btn-apply"),
        tooltip: t("help-apply-changes"),
        glyph: NOC.glyph.save,
        handler: "onApplyRecord",
      },
      {
        itemId: "groupSaveBtn",
        text: t("btn-save"),
        tooltip: t("help-save-changes"),
        glyph: NOC.glyph.save,
        handler: "onSaveRecords",
      },
      {
        itemId: "groupApplyBtn",
        text: t("btn-apply"),
        tooltip: t("help-apply-changes"),
        glyph: NOC.glyph.save,
        handler: "onApplyRecords",
      },
      {
        itemId: "closeBtn",
        text: t("btn-close"),
        tooltip: t("help-close-without-saving"),
        glyph: NOC.glyph.arrow_left,
        handler: "toMain",
      },
      "-",
      {
        itemId: "resetBtn",
        text: t("btn-reset"),
        tooltip: t("help-reset-to-default-values"),
        glyph: NOC.glyph.undo,
        handler: "onResetRecord",
      },
      {
        itemId: "deleteBtn",
        text: t("btn-delete"),
        tooltip: t("help-delete-object"),
        glyph: NOC.glyph.times,
        handler: "onDeleteRecord",
      },
      "-",
      {
        itemId: "createBtn",
        text: t("btn-add"),
        glyph: NOC.glyph.plus,
        tooltip: t("help-add-new-record"),
        handler: "onNewRecord",
      },
      {
        itemId: "cloneBtn",
        text: t("btn-clone"),
        tooltip: t("help-copy-existing-values-to-a-new-object"),
        glyph: NOC.glyph.copy,
        handler: "onCloneRecord",
      },
      "-",
      {
        itemId: "showMapBtn",
        xtype: "splitbutton",
        text: t("btn-show-map"),
        glyph: NOC.glyph.globe,
        menu: [ // Dynamically add items, in showMapHandler from Controller
        ],
      },
      {
        itemId: "configBtn",
        text: t("btn-config"),
        glyph: NOC.glyph.file,
        handler: "onConfig",
      },
      {
        itemId: "confDBBtn",
        text: t("msg-confdb"),
        glyph: NOC.glyph.file_code_o,
        handler: "onConfDB",
      },
      {
        itemId: "cardBtn",
        text: t("btn-card"),
        glyph: NOC.glyph.eye,
        handler: "onCard",
      },
      {
        itemId: "dashboardBtn",
        text: t("app-title-dashboard"),
        glyph: NOC.glyph.line_chart,
        tooltip: t("btn-show-dashboard-2"),
        handler: "onDashboard",
      },
      {
        itemId: "consoleBtn",
        text: t("help-console"),
        glyph: NOC.glyph.terminal,
        handler: "onConsole",
      },
      {
        itemId: "scriptsBtn",
        text: t("btn-scripts"),
        glyph: NOC.glyph.play,
        handler: "onScripts",
      },
      {
        itemId: "interfacesBtn",
        text: t("header-interfaces"),
        glyph: NOC.glyph.reorder,
        handler: "onInterfaces",
      },
      {
        itemId: "sensorsBtn",
        text: t("label-sensors"),
        glyph: NOC.glyph.thermometer_full,
        handler: "onSensors",
      },
      // {
      //     text: t("CPE"),
      //     glyph: NOC.glyph.share_alt,
      //     handler: "onCPE"
      // },
      {
        itemId: "linksBtn",
        text: t("app-title-links"),
        glyph: NOC.glyph.link,
        handler: "onLinks",
      },
      {
        itemId: "discoverBtn",
        text: t("header-discovery"),
        glyph: NOC.glyph.search,
        handler: "onDiscovery",
      },
      {
        itemId: "alarmsBtn",
        text: t("header-alarms"),
        glyph: NOC.glyph.exclamation_triangle,
        handler: "onAlarm",
      },
      // {
      //     text: t("New Maintenance"),
      //     glyph: NOC.glyph.wrench,
      //     handler: "onMaintenance"
      // },
      {
        itemId: "inventoryBtn",
        text: t("app-title-inv"),
        glyph: NOC.glyph.list,
        handler: "onInventory",
      },
      {
        itemId: "cmdBtn",
        text: t("btn-command-log"),
        glyph: NOC.glyph.film,
        handler: "onInteractions",
      },
      {
        itemId: "mappingBtn",
        text: t("btn-mapping"),
        glyph: NOC.glyph.file,
        handler: "onMapping",
      },
      // {
      //     text: t("Validation"),
      //     glyph: NOC.glyph.file,
      //     handler: "onValidationSettings"
      // },
      // {
      //     text: t("Capabilities"),
      //     glyph: NOC.glyph.file,
      //     handler: "onCaps"
      // },
      "->",
      {
        itemId: "helpBtn",
        text: t("app-title-help"),
        glyph: NOC.glyph.question_circle,
        tooltip: t("help-form-help"),
        handler: "onHelpOpener",

      },
    ],
  }],
  initComponent: function(){
    // add custom fields
    var cust_fields = this.up("[itemId=sa-managedobject]").noc.cust_form_fields;
    this.callParent();
    if(!Ext.isEmpty(cust_fields)){
      this.down("form").add({
        xtype: "fieldset",
        anchor: "100%",
        minHeight: 130,
        title: t("app-title-customfield"),
        collapsible: true,
        collapsed: false,
        items: cust_fields,
      })
    }
  },
});