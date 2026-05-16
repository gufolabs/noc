import type * as joint from '@joint/core';
import { NODE_LAYER_ID } from './graphLayers';
import { buildNodePresentationAttrs, type NodePresentationModel } from './nodePresentation';

type AttrMap = Record<string, unknown>;

const DEFAULT_NODE_SIZE = 64;

interface BaseNodeCellInput {
  id: string;
  x: number;
  y: number;
  width?: number | undefined;
  height?: number | undefined;
  nodeName?: string | undefined;
  metricsLabel?: string | undefined;
  ipaddrText?: string | undefined;
  data?: AttrMap | undefined;
  attrs?: AttrMap | undefined;
}

interface FontNodeCellInput extends BaseNodeCellInput {
  kind: 'font';
  iconUnicode?: string | undefined;
  iconSizeClass?: string | undefined;
  statusCode?: number | undefined;
}

interface ImageNodeCellInput extends BaseNodeCellInput {
  kind: 'image';
  iconHref: string;
  statusCode?: number | undefined;
}

export type NodeCellInput = FontNodeCellInput | ImageNodeCellInput;

function isRecord(value: unknown): value is AttrMap {
  return typeof value === 'object' && value !== null;
}

export function createNodeCell(input: NodeCellInput): joint.dia.Cell.JSON {
  const width = input.width ?? DEFAULT_NODE_SIZE;
  const height = input.height ?? DEFAULT_NODE_SIZE;
  const customAttrs = isRecord(input.attrs) ? input.attrs : {};
  const data = {
    ...(input.data ?? {}),
    isMaintenance: false
  };
  const presentationModel: NodePresentationModel =
    input.kind === 'image'
      ? {
          kind: 'image',
          width,
          height,
          iconHref: input.iconHref,
          statusCode: input.statusCode,
          name: input.nodeName,
          metricsLabel: input.metricsLabel,
          ipaddrText: input.ipaddrText
        }
      : {
          kind: 'font',
          iconUnicode: input.iconUnicode,
          iconSizeClass: input.iconSizeClass,
          statusCode: input.statusCode,
          name: input.nodeName,
          metricsLabel: input.metricsLabel,
          ipaddrText: input.ipaddrText
        };

  if (input.kind === 'image') {
    return {
      id: input.id,
      type: 'noc.ImageIconElement',
      layer: NODE_LAYER_ID,
      position: { x: input.x, y: input.y },
      size: { width, height },
      attrs: buildNodePresentationAttrs(presentationModel, customAttrs) as joint.dia.Element.Attributes['attrs'],
      data
    } as joint.dia.Cell.JSON;
  }

  return {
    id: input.id,
    type: 'noc.FontIconElement',
    layer: NODE_LAYER_ID,
    position: { x: input.x, y: input.y },
    size: { width, height },
    attrs: buildNodePresentationAttrs(presentationModel, customAttrs) as joint.dia.Element.Attributes['attrs'],
    data
  } as joint.dia.Cell.JSON;
}
