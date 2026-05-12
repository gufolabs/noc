import * as joint from '@joint/core';

const LINK_ICON_SELECTOR = 'icon';
const LINK_ICON_CENTER_ANCHOR: joint.anchors.AnchorJSON = { name: 'iconCenter' };
const LINK_BOUNDARY_CONNECTION_POINT: joint.connectionPoints.ConnectionPointJSON = { name: 'boundary' };

export function ensureIconCenterAnchorRegistered(): void {
  const anchorsRegistry = joint.anchors as typeof joint.anchors & Record<string, joint.anchors.Anchor>;
  if ('iconCenter' in anchorsRegistry) {
    return;
  }

  anchorsRegistry.iconCenter = (view, _magnet, ref, opt, endType, linkView) => {
    const iconNode = view.findNode('icon');
    if (iconNode instanceof SVGElement) {
      const iconBBox = view.getNodeBBox(iconNode);
      return iconBBox.center();
    }
    return view.model.getBBox().center();
  };
}

export function createIconLinkEnd(id: joint.dia.Cell.ID): joint.dia.Link.EndJSON {
  return {
    id,
    selector: LINK_ICON_SELECTOR,
    anchor: { ...LINK_ICON_CENTER_ANCHOR },
    connectionPoint: { ...LINK_BOUNDARY_CONNECTION_POINT }
  };
}
