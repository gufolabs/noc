import * as joint from '@joint/core';
import { createIconLinkEnd } from '../shapes/linkEndpoints';
import { createGraphLayers, LINK_LAYER_ID, NODE_LAYER_ID } from './graphLayers';
import { createNodeCell } from './nodeCellFactory';
import { DEFAULT_STATUS_CODE, FONT_STATUS_CLASS_BY_CODE } from './nodePresentation';
import type { LinkData, NodeData } from './types';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStatusCodeFromFontClass(value: unknown): number | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const entry = Object.entries(FONT_STATUS_CLASS_BY_CODE).find(([, className]) => className === value);
  return entry ? Number(entry[0]) : undefined;
}

function resolveNodeStatusCode(node: NodeData, customIconAttrs: Record<string, unknown>): number {
  if (typeof node.statusCode === 'number' && Number.isFinite(node.statusCode)) {
    return Math.trunc(node.statusCode);
  }
  if (typeof customIconAttrs.status_code === 'number' && Number.isFinite(customIconAttrs.status_code)) {
    return Math.trunc(customIconAttrs.status_code);
  }

  const statusCodeFromClass = getStatusCodeFromFontClass(node.iconStatusClass) ?? getStatusCodeFromFontClass(node.status);
  if (typeof statusCodeFromClass === 'number') {
    return statusCodeFromClass;
  }

  return DEFAULT_STATUS_CODE;
}

export function createGraphFromData(nodes: NodeData[], links: LinkData[]): joint.dia.Graph.JSON {
  const cells: Array<Record<string, unknown>> = [
    ...nodes.map((node) => {
      const customAttrs = node.attrs ?? {};
      const customIconAttrs = isObject(customAttrs.icon) ? customAttrs.icon : {};
      const statusCode = resolveNodeStatusCode(node, customIconAttrs);
      const iconHref =
        typeof node.iconHref === 'string' && node.iconHref.length > 0
          ? node.iconHref
          : typeof customIconAttrs.href === 'string' && customIconAttrs.href.length > 0
            ? customIconAttrs.href
            : typeof customIconAttrs.xlinkHref === 'string' && customIconAttrs.xlinkHref.length > 0
              ? customIconAttrs.xlinkHref
              : undefined;

      return createNodeCell(
        iconHref
          ? {
              kind: 'image',
              id: node.id,
              x: node.x,
              y: node.y,
              width: node.width,
              height: node.height,
              nodeName: node.label,
              metricsLabel: node.metricsLabel,
              iconHref,
              statusCode,
              attrs: customAttrs,
              data: {
                id: node.id,
                name: node.label,
                status_code: statusCode,
                metrics_label: node.metricsLabel,
                iconUnicode: node.iconUnicode,
                iconSizeClass: node.iconSizeClass,
                iconHref: node.iconHref,
                shapeOverlay: node.shapeOverlay
              }
            }
          : {
              kind: 'font',
              id: node.id,
              x: node.x,
              y: node.y,
              width: node.width,
              height: node.height,
              nodeName: node.label,
              metricsLabel: node.metricsLabel,
              iconUnicode: node.iconUnicode,
              iconSizeClass: node.iconSizeClass,
              statusCode,
              attrs: customAttrs,
              data: {
                id: node.id,
                name: node.label,
                status_code: statusCode,
                metrics_label: node.metricsLabel,
                iconUnicode: node.iconUnicode,
                iconSizeClass: node.iconSizeClass,
                iconHref: node.iconHref,
                shapeOverlay: node.shapeOverlay
              }
            }
      ) as Record<string, unknown>;
    }),
    ...links.map((link) => {
      const labels =
        link.label && link.label.length > 0
          ? [
              {
                position: 0.5,
                attrs: {
                  text: {
                    text: link.label
                  }
                }
              }
            ]
          : [];

      return {
        id: link.id,
        type: 'noc.LinkElement',
        layer: LINK_LAYER_ID,
        source: createIconLinkEnd(link.sourceId),
        target: createIconLinkEnd(link.targetId),
        labels,
        data: link.data ?? {},
        attrs: link.attrs ?? {}
      };
    })
  ];

  return {
    cells,
    layers: createGraphLayers(),
    defaultLayer: NODE_LAYER_ID
  } as joint.dia.Graph.JSON;
}
