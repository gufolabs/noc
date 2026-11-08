//---------------------------------------------------------------------
// inv.interface application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.interface.Application");

Ext.define("NOC.inv.interface.Application", {
  extend: "NOC.core.ModelApplication",
  reference: "invInterface",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.StateField",
    "NOC.inv.interface.LinkForm",
    "NOC.inv.interface.MACForm",
    "NOC.inv.interface.Model",
    "NOC.inv.interface.type.LookupField",
    "NOC.inv.interfaceprofile.LookupField",
    "NOC.project.project.LookupField",
    "NOC.sa.service.LookupField",
    "NOC.sa.managedobject.LookupField",
    "NOC.vc.l2domain.LookupField",
    "Ext.ux.grid.SubTable",
  ],
  model: "NOC.inv.interface.Model",
  search: true,

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          xtype: "glyphactioncolumn",
          itemId: "show_MAC_action",
          width: 25,
          items: [
            {
              scope: me,
              tooltip: t("help-show-macs"),
              glyph: NOC.glyph.play,
              handler: me.showMAC,
              disabled: !me.permissions.get_mac,
            },
          ],
        },
        {
          xtype: "glyphactioncolumn",
          width: 25,
          renderer: function(val, metadata, record){
            if(record.get("link")){
              this.items[0].glyph = NOC.glyph.unlink;
              this.items[0].tooltip = t("msg-unlink");
            } else{
              this.items[0].glyph = NOC.glyph.link;
              this.items[0].tooltip = t("msg-link");
            }
            metadata.style = "cursor: pointer;";
            return val;
          },
          items: [
            {
              scope: me,
              handler: me.onLink,
              disabled: !me.permissions.link,
            },
          ],
        },
        {
          text: t("header-name"),
          dataIndex: "name",
        },
        {
          text: t("header-mac"),
          dataIndex: "mac",
        },
        {
          text: t("header-lag"),
          dataIndex: "lag",
        },
        {
          text: t("msg-link"),
          dataIndex: "link",
          renderer: NOC.render.Lookup("link"),
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          renderer: NOC.render.Lookup("profile"),
          editor: "inv.interfaceprofile.LookupField",
        },
        {
          text: t("label-project"),
          dataIndex: "project",
          renderer: NOC.render.Lookup("project"),
          editor: "project.project.LookupField",
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          editor: {
            xtype: "statefield",
            restUrl: "/inv/interface/",
          },
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-service"),
          dataIndex: "service",
          renderer: NOC.render.Lookup("service"),
          editor: "sa.service.LookupField",
        },
        {
          text: t("nav-protocol"),
          dataIndex: "enabled_protocols",
        },
        {
          text: t("header-caps"),
          dataIndex: "caps",
          onClick: me.onCapsClick,
          renderer: function(value){
            var app = this.up("[reference=invInterface]"),
              v = value ? app.renderArrayValue(value, "label") : "...";
            return "<a href='javascript:void(0)' class='noc-clickable-cell' title='Click to change...'>"
                  + v
                  + "</a>";
          },
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 200,
        },
        {
          text: t("header-ifindex"),
          dataIndex: "ifindex",
          hidden: false,
        },
      ],
      additions_plugins: [
        {
          ptype: "subtable",
          association: "subinterfaces",
          headerWidth: 32,
          emptyText: t("label-no-subinterfaces"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
            },
            {
              text: t("header-untagged"),
              dataIndex: "untagged_vlan",
            },
            {
              text: t("header-tagged"),
              dataIndex: "tagged_vlans",
            },
            {
              text: t("header-l2-domain"),
              dataIndex: "l2_domain",
              renderer: NOC.render.ObjectLookup("l2_domain"),
            },
            {
              text: t("header-vfr"),
              dataIndex: "vrf",
            },
            {
              text: t("choice-ipv4"),
              dataIndex: "ipv4_addresses",
              renderer: NOC.render.Join(","),
            },
            {
              text: t("choice-ipv6"),
              dataIndex: "ipv6_addresses",
              renderer: NOC.render.Join(","),
            },
            {
              text: t("label-project"),
              dataIndex: "project",
              renderer: NOC.render.ObjectLookup("project"),
              editor: "project.project.LookupField",
            },
            {
              text: t("header-service"),
              dataIndex: "service",
              renderer: NOC.render.ObjectLookup("service"),
              editor: "sa.service.LookupField",
            },
            {
              text: t("label-description"),
              dataIndex: "description",
            },
          ],
        },
      ],
    });
    me.callParent();
    if(NOC.hasPermission("change_interface")){
      me.grid.addPlugin(
        Ext.create("Ext.grid.plugin.RowEditing", {
          clicksToEdit: 2,
          listeners: {
            scope: me,
            edit: me.onEdit,
            canceledit: me.onCancelEdit,
          },
        }),
      );
    }
  },
  filters: [
    {
      title: t("app-title-by-object"),
      name: "managed_object",
      ftype: "lookup",
      lookup: "sa.managedobject",
    },
    {
      title: t("choice-by-labels"),
      name: "labels",
      ftype: "label",
      filterProtected: false,
    },
    {
      title: t("app-title-by-type"),
      name: "type",
      ftype: "lookup",
      lookup: "inv.interface.type",
    },
  ],
  renderArrayValue: function(value, label){
    if(Ext.isEmpty(value)) return "..."
    if(Ext.isArray(value)) return value.map(el => el[label]).join(", ");
    return value[label];

  },
  //
  onEdit: function(editor, e){
    var me = this,
      r = e.record,
      data = {
        profile: r.get("profile"),
        project: r.get("project"),
        state: r.get("state"),
        l2_domain: r.get("l2_domain"),
      },
      isNewRecord = Ext.isEmpty(e.originalValues.name);
    if(isNewRecord){
      data["name"] = r.get("name");
    } else{
      data["id"] = r.get("id");
    }
    NOC.api.requestLegacy({
      url: "/inv/interface/" + r.get("id") + "/",
      method: "POST",
      jsonData: data,
      scope: me,
      success: function(){
        me.app.onRefresh();
        if(isNewRecord){
          NOC.info(t("msg-created-interface-value0", {value0: r.get("name")}));
        } else{
          NOC.info(t("msg-saved-2"));
        }
      },
      failure: function(){
        NOC.error(t("msg-failed-to-set-data"));
      },
    });
  },
  //
  onCancelEdit: function(editor, context){
    if(context.record.phantom){
      context.grid.store.removeAt(context.rowIdx);
    }
  },
  //
  onLink: function(grid, rowIndex){
    var me = this,
      r = me.store.getAt(rowIndex),
      link = r.get("link");
    me.currentRecord = r;
    if(link){
      me.unlinkInterface(r.get("id"), r.get("name"));
    } else{
      me.linkInterface(r.get("id"), r.get("name"));
    }
  },
  //
  unlinkInterface: function(ifaceId, ifaceName){
    var me = this;
    Ext.Msg.show({
      title: t("app-title-unlink-interface"),
      msg: `Do you wish to unlink interface ${ifaceName}?`,
      buttons: Ext.Msg.YESNO,
      icon: Ext.window.MessageBox.QUESTION,
      modal: true,
      fn: function(button){
        if(button === "yes"){
          NOC.api.requestLegacy({
            url: "/inv/interface/unlink/" + ifaceId + "/",
            method: "POST",
            scope: me,
            success: function(response){
              var me = this,
                data = Ext.decode(response.responseText);
              if(data.status){
                me.currentRecord.set("link", null);
                me.currentRecord.set("link_label", null);
                me.grid.getStore().reload();
              } else{
                NOC.error(data.message);
              }
            },
          });
        }
      },
    });
  },
  //
  linkInterface: function(ifaceId, ifaceName){
    var me = this;
    Ext.create("NOC.inv.interface.LinkForm", {
      title: t("msg-link-interface-with", {name: ifaceName}),
      app: me,
      ifaceId: ifaceId,
    });
  },
  toggleLinkIcon: function(data){
    var me = this;

    if(data){ // link
      me.currentRecord.set("link", data.link);
      me.grid.getStore().getById(me.currentRecord.id).set("link", data.link);
      me.currentRecord.set("link_label", data.link__label);
      me.grid.getStore().getById(me.currentRecord.id).set("link__label", data.link__label);
      // me.grid.getStore().reload();
      me.grid.getStore().sync();
    } else{ // unlink
    }
  },
  //
  showMAC: function(grid, rowIndex, colIndex, item, event, record){
    var me = this;

    me.currentRecord = record;
    NOC.mrt({
      scope: me,
      params: [
        {
          id: me.currentRecord.get("managed_object"),
          script: "get_mac_address_table",
          args: {
            interface: record.get("name"),
          },
        },
      ],
      errorMsg: t("msg-failed-to-get-macs"),
      cb: me.showMACForm,
    });
  },
  //
  showMACForm: function(data, scope){
    if(data){
      Ext.create("NOC.inv.interface.MACForm", {
        objectId: scope.currentRecord.get("managed_object"),
        data: data,
        name: scope.currentRecord.get("name"),
        title: `MACs on ${scope.currentRecord.get("name")}`,
      });
    } else{
      NOC.error(t("msg-failed-to-get-data"));
    }
  },
  //
  onCapsClick: function(record){
    Ext.create("NOC.sa.managedobject.CapsForm", {
      title: t("msg-capabilities-of", {name: record.get("name")}),
      app: this,
      rowId: record.get("id"),
      dataCaps: record.get("caps"),
    });
  },
});
