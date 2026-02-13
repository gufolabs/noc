//---------------------------------------------------------------------
// JointJS shape registry
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.map.ShapeRegistry");

Ext.define("NOC.inv.map.ShapeRegistry", {
  singleton: true,
  shapes: {},
 
  iconShape: (function(){
    return joint.shapes.basic.Generic.extend({
      markup: [
        {tagName: "text", selector: "text", className: "rotatable"},
        {tagName: "text", selector: "icon", className: "scalable"},
      ],
      defaults: joint.util.deepSupplement({
        type: "noc.icon",
        attrs: {
          icon: { },
          text: {
            text: "New Object",
            fill: "#000000",
            ref: "icon",
            refX: "50%",
            refY: "100%",
            textAnchor: "middle",
            display: "block",
          },
        },
      }, joint.shapes.basic.Generic.prototype.defaults),
      initialize: function(options){
        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        const icon = options.attrs.icon || {};
        this.attr("icon/class", `gf ${icon.iconSize} ${icon.status}`);
      },
      setFilter: function(filter){
        const iconSize = this.attr("icon/iconSize") || "gf-2x";
        console.log("Setting filter", filter, iconSize);
        this.attr("icon/class", `gf ${iconSize} ${filter}`);
      },
    });
  })(),
  // Generate stencil id from name
  getId: function(name){
    return "img-" + name.replace("/", "-").replace(" ", "-").replace("_", "-")
  },
  // Generate <image> defs
  getImage: function(name){
    var me = this,
      id = me.getId(name);
    return "<image id='" + id + "' xlink:href='/ui/pkg/stencils/" + name + ".svg' width='50' height='50'></image>"
  },

  getShape: function(name){
    var me = this,
      sc, sv,
      n = name.replace("/", ".").replace(" ", "_"),
      typeName = "noc." + n,
      registerClass = function(name, cls){
        var sr = joint.shapes,
          tns = name.split(".").reverse(),
          v;
        for(; ;){
          v = tns.pop();
          if(tns.length){
            if(sr[v] === undefined){
              sr[v] = {};
            }
            sr = sr[v];
          } else{
            sr[v] = cls;
            break;
          }
        }
      };

    sc = me.shapes[name];
    if(sc){
      return sc;
    }
    // Shape class
    sc = joint.shapes.basic.Generic.extend({
      markup: '<g class="scalable"><use/></g><g class="rotatable"><text/></g>',
      defaults: joint.util.deepSupplement({
        type: typeName,
        size: {
          width: 50,
          height: 50,
        },
        attrs: {
          use: {
            "width": 50,
            "height": 50,
            "xlink:href": "#" + me.getId(name),
          },
          text: {
            text: "New Object",
            fill: "#000000",
            ref: "use",
            "ref-x": "50%",
            "ref-dy": 3,
            "text-anchor": "middle",
          },
        },
      }, joint.shapes.basic.Generic.prototype.defaults),
      setFilter: function(filter){
        var me = this;
        me.attr("use/filter", "url(#" + filter + ")");
        Ext.each(me.getEmbeddedCells(), function(badge){
          badge.attr("body/filter", "url(#" + filter + ")");
          badge.attr("text/filter", "url(#" + filter + ")");
        });
      },
    });
    me.shapes[name] = sc;
    registerClass(typeName, sc);
    // Shape view
    sv = joint.dia.ElementView.extend({
      getStrokeBBox: function(el){
        el = el || V(this.el).find("use")[0].node;
        return joint.dia.ElementView.prototype.getStrokeBBox.apply(this, [el]);
      },
    });
    registerClass(typeName + "View", sv);
    return sc;
  },

  getIconNode: function(data, name){
    return new this.iconShape({
      id: data.type + ":" + data.id,
      z: 9999,
      external: data.external,
      name: name,
      address: data.address,
      position: {
        x: data.x,
        y: data.y,
      },
      attrs: {
        text: {
          text: name,
        },
        icon: {
          text: String.fromCharCode(data.glyph),
          iconSize: data.cls || "gf-1x",
          status: "gf-unknown",
        },
      },
      data: {
        type: data.type,
        id: data.id,
        node_id: data.node_id,
        caps: data.caps,
        isMaintenance: false,
        portal: data.portal,
        object_filter: data.object_filter,
        metrics_template: data.metrics_template,
        shape_width: data.shape_width,
        metrics_label: data.metrics_label,
      },
    });
  },
});
