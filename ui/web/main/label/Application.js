//---------------------------------------------------------------------
// main.label application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.label.Application");

Ext.define("NOC.main.label.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.label.Model",
    "NOC.main.remotesystem.LookupField",
    "Ext.ux.form.ColorField",
    "Ext.ux.form.GridField",
    "NOC.main.prefixtable.LookupField",
    "NOC.vc.vlanfilter.LookupField",
    "NOC.core.JSONPreview",
  ],
  model: "NOC.main.label.Model",
  search: true,
  viewModel: {
    data: {
      is_builtin: false,
      is_noc_builtin: false,
      is_matching: false,
      is_scoped: false,
      is_wildcard: false,
    },
    formulas: {
      isEnableDisable: function(get){
        return get("is_noc_builtin");
      },
      isEnableDisableRx: function(get){
        return get("is_builtin") || get("is_wildcard");
      },
    },
  },
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/main/label/{0}/json/",
      previewName: "Label: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-label"),
          dataIndex: "name",
          width: 300,
          renderer: function(v, _x, item){
            return NOC.render.Label({
              badges: item.data.badges,
              name: item.data.name,
              description: item.data.description || "",
              bg_color1: item.data.bg_color1 || 0,
              fg_color1: item.data.fg_color1 || 0,
              bg_color2: item.data.bg_color2 || 0,
              fg_color2: item.data.fg_color2 || 0,
            });
          },
        },
        {
          text: t("header-protected"),
          dataIndex: "is_protected",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          width: 30,
          renderer: NOC.render.Bool,
          sortable: false,
        },
        {
          text: t("app-title-allow"),
          dataIndex: "enable_agent",
          flex: 1,
          renderer: function(_x, _y, item){
            let r = [];
            if(item.data.enable_agent){
              r.push(t("app-title-agent"));
            }
            if(item.data.enable_service){
              r.push(t("header-service"));
            }
            if(item.data.enable_serviceprofile){
              r.push(t("app-title-serviceprofile"));
            }
            if(item.data.enable_managedobject){
              r.push(t("header-managed-object-62561c"));
            }
            if(item.data.enable_managedobjectprofile){
              r.push(t("app-title-managedobjectprofile"));
            }
            if(item.data.enable_administrativedomain){
              r.push(t("header-administrative-domain-d113be"));
            }
            if(item.data.enable_authprofile){
              r.push(t("app-title-authprofile"));
            }
            if(item.data.enable_commandsnippet){
              r.push(t("msg-command-snippet"));
            }
            if(item.data.enable_allocationgroup){
              r.push(t("label-allocation-group"));
            }
            if(item.data.enable_networksegment){
              r.push(t("app-title-networksegment"));
            }
            if(item.data.enable_object){
              r.push(t("header-object"));
            }
            if(item.data.enable_objectmodel){
              r.push(t("msg-object-model"));
            }
            if(item.data.enable_platform){
              r.push(t("msg-platfrom"));
            }
            if(item.data.enable_resourcegroup){
              r.push(t("label-resource-group"));
            }
            if(item.data.enable_sensorprofile){
              r.push(t("msg-sensor-profile"));
            }
            if(item.data.enable_sensor){
              r.push(t("app-title-sensor"));
            }
            if(item.data.enable_interface){
              r.push(t("header-interface"));
            }
            if(item.data.enable_subscriber){
              r.push(t("header-subscriber"));
            }
            if(item.data.enable_supplier){
              r.push(t("header-supplier"));
            }
            if(item.data.enable_dnszone){
              r.push(t("app-title-dnszone"));
            }
            if(item.data.enable_dnszonerecord){
              r.push(t("msg-dns-zone-record"));
            }
            if(item.data.enable_division){
              r.push(t("msg-gis-division"));
            }
            if(item.data.enable_kbentry){
              r.push(t("msg-kb-entry"));
            }
            if(item.data.enable_ipaddress){
              r.push(t("label-ip-address"));
            }
            if(item.data.enable_addressprofile){
              r.push(t("msg-ip-address-profile"));
            }
            if(item.data.enable_ipaddressrange){
              r.push(t("msg-ip-address-range"));
            }
            if(item.data.enable_ipprefix){
              r.push(t("msg-ip-prefix"));
            }
            if(item.data.enable_prefixprofile){
              r.push(t("app-title-prefixprofile"));
            }
            if(item.data.enable_vrf){
              r.push(t("header-vrf"));
            }
            if(item.data.enable_vrfgroup){
              r.push(t("label-vrf-group"));
            }
            if(item.data.enable_asn){
              r.push(t("app-title-as"));
            }
            if(item.data.enable_assetpeer){
              r.push(t("msg-asset-peer"));
            }
            if(item.data.enable_peer){
              r.push(t("header-peer"));
            }
            if(item.data.enable_vlan){
              r.push(t("app-title-vlan"));
            }
            if(item.data.enable_vlanprofile){
              r.push(t("app-title-vlanprofile"));
            }
            if(item.data.enable_vpn){
              r.push(t("app-title-vpn"));
            }
            if(item.data.enable_vpnprofile){
              r.push(t("msg-vpn-profile"));
            }
            if(item.data.enable_slaprobe){
              r.push(t("app-title-slaprobe"));
            }
            if(item.data.enable_slaprofile){
              r.push(t("app-title-slaprofile"));
            }
            if(item.data.enable_workflowstate){
              r.push(t("msg-workflow-state"));
            }
            if(item.data.enable_firmwarepolicy){
              r.push(t("app-title-firmwarepolicy"));
            }
            return r.join(", ");
          },
        },
        {
          text: t("header-expose"),
          dataIndex: "expose_metric",
          flex: 1,
          renderer: function(_x, _y, item){
            let r = [];
            if(item.data.expose_metric){
              r.push(t("header-metric"));
            }
            if(item.data.expose_datastream){
              r.push(t("msg-datastream"));
            }
            if(item.data.expose_alarm){
              r.push(t("app-title-alarm"));
            }
            if(item.data.expose_sa_object){
              r.push(t("msg-sa-object"));
            }
            return r.join(", ");
          },
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-label"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "is_protected",
          xtype: "checkbox",
          boxLabel: t("header-protected"),
          allowBlank: true,
        },
        {
          name: "propagate",
          xtype: "checkbox",
          boxLabel: t("msg-propagate"),
          allowBlank: true,
          bind: {
            disabled: "{!is_wildcard}",
          },
        },
        {
          name: "is_wildcard",
          xtype: "checkbox",
          bind: {
            value: "{is_wildcard}",
          },
          boxLabel: t("header-wildcard"),
          hidden: true,
        },
        {
          name: "is_autogenerated",
          xtype: "checkbox",
          boxLabel: t("label-autogenerated"),
          disabled: true,
        },
        {
          name: "unique_value",
          xtype: "checkbox",
          boxLabel: t("label-unique-value"),
          disabled: true,
        },
        {
          name: "is_builtin",
          xtype: "checkbox",
          boxLabel: t("header-is-builtin"),
          disabled: true,
          bind: {
            value: "{is_builtin}",
          },
        },
        {
          name: "allow_auto_create",
          xtype: "checkbox",
          boxLabel: t("label-allow-auto-create"),
        },
        {
          name: "is_matching",
          xtype: "checkbox",
          bind: {
            value: "{is_matching}",
            disabled: "{isEnableDisableRx}",
          },
          boxLabel: t("label-is-matching-label"),
        },
        {
          name: "match_regex",
          xtype: "gridfield",
          fieldLabel: t("label-regex-label"),
          bind: {
            disabled: "{!is_matching}",
          },
          columns: [
            {
              text: t("header-regex"),
              dataIndex: "regexp",
              width: 300,
              editor: "textfield",
              allowBlank: false,
            },
            {
              text: t("header-multiline"),
              dataIndex: "flag_multiline",
              width: 50,
              checked: false,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("header-dotall"),
              dataIndex: "flag_dotall",
              width: 50,
              checked: false,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("header-regex-scope"),
              dataIndex: "scope",
              width: 200,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["managedobject_name", t("msg-managed-object-name")],
                  ["managedobject_address", t("msg-managed-object-address")],
                  ["managedobject_description", t("msg-managed-object-description")],
                  ["interface_name", t("msg-interface-name")],
                  ["interface_description", t("msg-interface-description")],
                  ["sensor_local_id", t("msg-sensor-local-id")],
                ],
              },
              renderer: NOC.render.Choices({
                "managedobject_name": t("msg-managed-object-name"),
                "managedobject_address": t("msg-managed-object-address"),
                "managedobject_description": t("msg-managed-object-description"),
                "interface_name": t("msg-interface-name"),
                "interface_description": t("msg-interface-description"),
                "sensor_local_id": t("msg-sensor-local-id"),
              }),
            },
          ],
        },
        {
          name: "match_prefixfilter",
          xtype: "gridfield",
          fieldLabel: t("label-prefix-label"),
          bind: {
            disabled: "{!is_matching}",
          },
          columns: [
            {
              text: t("header-prefix"),
              dataIndex: "prefix_table",
              editor: {
                xtype: "main.prefixtable.LookupField",
                allowBlank: false,
              },
              renderer: NOC.render.Lookup("prefix_table"),
              width: 250,
            },
            {
              text: t("label-condition"),
              dataIndex: "condition",
              width: 200,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                defaultValue: "any",
                store: [
                  ["all", t("msg-all")],
                  ["any", t("msg-any-2")],
                ],
              },
              renderer: NOC.render.Choices({
                "all": t("msg-all"),
                "any": t("msg-any-2"),
              }),
            },
            {
              text: t("header-prefix-scope"),
              dataIndex: "scope",
              width: 200,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["managedobject_address", t("msg-managed-object-address")],
                  ["subinterface_ipv4_addresses", t("msg-subinterface-ip-address")],
                ],
              },
              renderer: NOC.render.Choices({
                "managedobject_address": t("msg-managed-object-address"),
                "subinterface_ipv4_addresses": t("msg-subinterface-ip-address"),
              }),
            },
          ],
        },
        {
          name: "match_vlanfilter",
          xtype: "gridfield",
          fieldLabel: t("label-vlan-label"),
          bind: {
            disabled: "{!is_matching}",
          },
          columns: [
            {
              text: t("app-title-vlanfilter"),
              dataIndex: "vlan_filter",
              width: 200,
              editor: {
                xtype: "vc.vlanfilter.LookupField",
                allowBlank: false,
              },
              renderer: NOC.render.Lookup("vlan_filter"),
            },
            {
              text: t("label-condition"),
              dataIndex: "condition",
              width: 200,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                defaultValue: "any",
                store: [
                  ["all", t("msg-all")],
                  ["any", t("msg-any-2")],
                ],
              },
              renderer: NOC.render.Choices({
                "all": t("msg-all"),
                "any": t("msg-any-2"),
              }),
            },
            {
              text: t("header-prefix-scope"),
              dataIndex: "scope",
              width: 200,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["subinterface_tagged_vlans", t("msg-subinterface-tagged-vlans")],
                  ["subinterface_untagged_vlan", t("msg-subinterface-untagged-vlan")],
                ],
              },
              renderer: NOC.render.Choices({
                "subinterface_tagged_vlans": t("msg-subinterface-tagged-vlans"),
                "subinterface_untagged_vlan": t("msg-subinterface-untagged-vlan"),
              }),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-colors"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "bg_color1",
              xtype: "colorfield",
              fieldLabel: t("label-background"),
              allowBlank: false,
              uiStyle: "medium",
            },
            {
              name: "fg_color1",
              xtype: "colorfield",
              fieldLabel: t("label-foreground"),
              allowBlank: false,
              uiStyle: "medium",
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-scoped-value-colors"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "bg_color2",
              xtype: "colorfield",
              fieldLabel: t("label-background"),
              allowBlank: false,
              uiStyle: "medium",
            },
            {
              name: "fg_color2",
              xtype: "colorfield",
              fieldLabel: t("label-foreground"),
              allowBlank: false,
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "display_order",
          xtype: "numberfield",
          fieldLabel: t("label-display-order"),
          uiStyle: "small",
          minValue: 0,
          allowBlank: false,
        },
        {
          xtype: "fieldset",
          layout: "vbox",
          title: t("label-enable"),
          bind: {
            disabled: "{isEnableDisable}",
          },
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              xtype: "fieldset",
              layout: "hbox",
              title: t("app-title-managedobject-2"),
              defaults: {
                padding: 4,
                labelAlign: "right",
              },
              items: [
                {
                  name: "enable_managedobject",
                  xtype: "checkbox",
                  boxLabel: t("header-managed-object-62561c"),
                },
                {
                  name: "enable_managedobjectprofile",
                  xtype: "checkbox",
                  boxLabel: t("app-title-managedobjectprofile"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_agent",
                  xtype: "checkbox",
                  boxLabel: t("app-title-agent"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_firmwarepolicy",
                  xtype: "checkbox",
                  boxLabel: t("app-title-firmwarepolicy"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_service",
                  xtype: "checkbox",
                  boxLabel: t("header-service"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_serviceprofile",
                  xtype: "checkbox",
                  boxLabel: t("app-title-serviceprofile"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_slaprobe",
                  xtype: "checkbox",
                  boxLabel: t("app-title-slaprobe"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_slaprofile",
                  xtype: "checkbox",
                  boxLabel: t("app-title-slaprofile"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_interface",
                  xtype: "checkbox",
                  boxLabel: t("header-interface"),
                },
                {
                  name: "enable_alarm",
                  xtype: "checkbox",
                  boxLabel: t("app-title-alarm"),
                },
              ],
            },
            {
              xtype: "fieldset",
              layout: "hbox",
              title: t("app-title-ip-dns"),
              defaults: {
                padding: 4,
                labelAlign: "right",
              },
              bind: {
                disabled: "{is_matching}",
              },
              items: [
                {
                  name: "enable_ipaddress",
                  xtype: "checkbox",
                  boxLabel: t("label-ip-address"),
                },
                {
                  name: "enable_addressprofile",
                  xtype: "checkbox",
                  boxLabel: t("msg-ip-address-profile"),
                },
                {
                  name: "enable_ipaddressrange",
                  xtype: "checkbox",
                  boxLabel: t("msg-ip-address-range"),
                },
                {
                  name: "enable_ipprefix",
                  xtype: "checkbox",
                  boxLabel: t("msg-ip-prefix"),
                },
                {
                  name: "enable_prefixprofile",
                  xtype: "checkbox",
                  boxLabel: t("app-title-prefixprofile"),
                },
                {
                  name: "enable_vrf",
                  xtype: "checkbox",
                  boxLabel: t("header-vrf"),
                },
                {
                  name: "enable_vrfgroup",
                  xtype: "checkbox",
                  boxLabel: t("label-vrf-group"),
                },
                {
                  name: "enable_asn",
                  xtype: "checkbox",
                  boxLabel: t("app-title-as"),
                },
                {
                  name: "enable_assetpeer",
                  xtype: "checkbox",
                  boxLabel: t("msg-asset-peer"),
                },
                {
                  name: "enable_peer",
                  xtype: "checkbox",
                  boxLabel: t("header-peer"),
                },
                {
                  name: "enable_dnszone",
                  xtype: "checkbox",
                  boxLabel: t("app-title-dnszone"),
                },
                {
                  name: "enable_dnszonerecord",
                  xtype: "checkbox",
                  boxLabel: t("app-title-dnszone"),
                },
              ],
            },
            {
              xtype: "fieldset",
              layout: "hbox",
              title: t("app-title-inv"),
              defaults: {
                padding: 4,
                labelAlign: "right",
              },
              items: [
                {
                  name: "enable_allocationgroup",
                  xtype: "checkbox",
                  boxLabel: t("label-allocation-group"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_networksegment",
                  xtype: "checkbox",
                  boxLabel: t("app-title-networksegment"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_object",
                  xtype: "checkbox",
                  boxLabel: t("header-object"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_objectmodel",
                  xtype: "checkbox",
                  boxLabel: t("msg-object-model"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_platform",
                  xtype: "checkbox",
                  boxLabel: t("app-title-platform"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_resourcegroup",
                  xtype: "checkbox",
                  boxLabel: t("label-resource-group"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_sensorprofile",
                  xtype: "checkbox",
                  boxLabel: t("msg-sensor-profile"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
                {
                  name: "enable_sensor",
                  xtype: "checkbox",
                  boxLabel: t("app-title-sensor"),
                },
                {
                  name: "enable_division",
                  xtype: "checkbox",
                  boxLabel: t("msg-gis-division"),
                  bind: {
                    disabled: "{is_matching}",
                  },
                },
              ],
            },
            {
              xtype: "fieldset",
              layout: "hbox",
              title: t("app-title-vc"),
              defaults: {
                padding: 4,
                labelAlign: "right",
              },
              bind: {
                disabled: "{is_matching}",
              },
              items: [
                {
                  name: "enable_vlan",
                  xtype: "checkbox",
                  boxLabel: t("app-title-vlan"),
                },
                {
                  name: "enable_vlanprofile",
                  xtype: "checkbox",
                  boxLabel: t("app-title-vlanprofile"),
                },
                {
                  name: "enable_vpn",
                  xtype: "checkbox",
                  boxLabel: t("app-title-vpn"),
                },
                {
                  name: "enable_vpnprofile",
                  xtype: "checkbox",
                  boxLabel: t("msg-vpn-profile"),
                },
              ],
            },
            {
              xtype: "fieldset",
              layout: "hbox",
              title: t("header-other"),
              defaults: {
                padding: 4,
                labelAlign: "right",
              },
              bind: {
                disabled: "{is_matching}",
              },
              items: [
                {
                  name: "enable_administrativedomain",
                  xtype: "checkbox",
                  boxLabel: t("header-administrative-domain-d113be"),
                },
                {
                  name: "enable_authprofile",
                  xtype: "checkbox",
                  boxLabel: t("app-title-authprofile"),
                },
                {
                  name: "enable_commandsnippet",
                  xtype: "checkbox",
                  boxLabel: t("msg-command-snippet"),
                },
                {
                  name: "enable_subscriber",
                  xtype: "checkbox",
                  boxLabel: t("header-subscriber"),
                },
                {
                  name: "enable_supplier",
                  xtype: "checkbox",
                  boxLabel: t("header-supplier"),
                },
                {
                  name: "enable_kbentry",
                  xtype: "checkbox",
                  boxLabel: t("msg-kb-entry"),
                },
                {
                  name: "enable_workflowstate",
                  xtype: "checkbox",
                  boxLabel: t("msg-workflow-state"),
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("header-expose"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "expose_metric",
              xtype: "checkbox",
              boxLabel: t("label-metrics"),
            },
            {
              name: "expose_datastream",
              xtype: "checkbox",
              boxLabel: t("msg-datastream"),
            },
            {
              name: "expose_alarm",
              xtype: "checkbox",
              boxLabel: t("app-title-alarm"),
            },
            {
              name: "expose_sa_object",
              xtype: "checkbox",
              boxLabel: t("label-allowed-models"),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "remote_id",
              xtype: "textfield",
              fieldLabel: t("label-remote-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
      ],

      formToolbar: [
        {
          text: t("btn-json"),
          glyph: NOC.glyph.file,
          tooltip: t("help-show-json"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onJSON,
        },
      ],

    });
    me.callParent();
  },

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },

  filters: [
    {
      title: t("app-title-manual"),
      name: "is_builtin_labels",
      ftype: "boolean",
    },
    {
      title: t("app-title-is-matching"),
      name: "is_matching",
      ftype: "boolean",
    },
    {
      title: t("app-title-match"),
      name: "is_matched",
      ftype: "boolean",
    },
  ],
});
