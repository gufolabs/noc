Ext.application({
  name: 'TopoMapApp',
  launch: function () {
    var Topology = null;

    Ext.create('Ext.container.Viewport', {
      layout: 'border',
      items: [
        {
          region: 'center',
          xtype: 'panel',
          title: 'Topology',
          html: '<div id="topology-main" style="width:100%;height:100%"></div>',
          listeners: {
            afterrender: function (panel) {
              var mainEl = panel.getEl().down('#topology-main') || panel.getEl().down('div');
              var minimapPanel = panel.up('viewport').down('#topology-minimap-panel');
              var minimapEl = minimapPanel.getEl().down('#topology-minimap') || minimapPanel.getEl().down('div');

              Topology = new Topology({
                mainContainer: mainEl.dom,
                minimapContainer: minimapEl.dom
              });
            },
            resize: function (_panel, width, height) {
              if (Topology) {
                Topology.resizeMain(width, height);
              }
            },
            beforedestroy: function () {
              if (Topology) {
                Topology.destroy();
                Topology = null;
              }
            }
          }
        },
        {
          region: 'east',
          itemId: 'topology-minimap-panel',
          xtype: 'panel',
          width: 280,
          title: 'Minimap',
          html: '<div id="topology-minimap" style="width:100%;height:100%"></div>',
          listeners: {
            resize: function (_panel, width, height) {
              if (Topology) {
                Topology.resizeMinimap(width, height);
              }
            }
          }
        }
      ]
    });
  }
});
