import type * as joint from '@joint/core';

export const NODE_LAYER_ID = 'nodes';
export const LINK_LAYER_ID = 'links';

export function createGraphLayers(): joint.dia.GraphLayer.Attributes[] {
  return [{ id: LINK_LAYER_ID }, { id: NODE_LAYER_ID }];
}
