import type * as joint from '@joint/core';
import { MapDocument } from '../core/MapDocument';
import { createGraphLayers, LINK_LAYER_ID, NODE_LAYER_ID } from '../core/graphLayers';
import { createNodeCell } from '../core/nodeCellFactory';
import { DEFAULT_STATUS_CODE } from '../core/nodePresentation';
import {
  type Interface,
  PAPER_TYPES,
  type PaperConfig,
  type PaperType,
  type ShapeOverlay,
  type ViewportSnapshot
} from '../core/types';
import { createIconLinkEnd } from '../shapes/linkEndpoints';

type ScalarId = string | number;

interface MapConverterPort {
  id?: ScalarId | null;
  ports?: Array<string> | null;
}

interface MapConverterPortal {
  generator?: string | null;
  id?: ScalarId | null;
  settings?: object | null;
}

interface MapConverterNode {
  id?: ScalarId | null;
  x?: number | null;
  y?: number | null;
  shape?: string | null;
  shape_width?: number | string | null;
  shape_height?: number | string | null;
  name?: string | null;
  address?: string | null;
  glyph?: number | string | null;
  cls?: string | null;
  ports?: Array<MapConverterPort> | null;
  level?: number | string | null;
  external?: boolean | null;
  caps?: [] | null;
  metrics_label?: string | null;
  metrics_template?: string | null;
  node_id?: ScalarId | null;
  object_filter?: object | null;
  shape_overlay?: Array<ShapeOverlay> | null;
  type?: string | null;
  role?: string | null;
  portal?: MapConverterPortal | null;
}

interface MapConverterLink {
  id?: ScalarId | null;
  ports?: Array<ScalarId> | null;
  connector?: string | null;
  bw?: number | null;
  in_bw?: number | null;
  out_bw?: number | null;
  method?: string | null;
  type?: string | null;
}

export interface MapConverterInput {
  id?: ScalarId | null;
  type?: string | null;
  grid_size?: number | null;
  normalize_position?: boolean | null;
  object_status_refresh_interval?: number | null;
  background_image?: string | null;
  background_opacity?: number | null;
  name?: string | null;
  nodes?: MapConverterNode[] | null;
  links?: MapConverterLink[] | null;
  viewport?: Partial<ViewportSnapshot> | null;
  width?: number | null;
  height?: number | null;
  stencil_dir?: string | null;
  max_links?: number | null;
  caps?: [] | null;
}

function isPaperType(value: unknown): value is PaperType {
  return typeof value === 'string' && PAPER_TYPES.includes(value as PaperType);
}

function toFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toPositiveFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  return fallback;
}

function toId(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function toText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toOptionalText(value: unknown): string | undefined {
  const text = toText(value);
  return text.length > 0 ? text : undefined;
}

function toOptionalFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function toOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function normalizeOpacity(value: unknown): number | undefined {
  const opacity = toOptionalFiniteNumber(value);
  if (opacity === undefined) {
    return undefined;
  }

  const normalized = opacity > 1 ? opacity / 100 : opacity;
  return Math.min(1, Math.max(0, normalized));
}

function toGlyphText(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String.fromCodePoint(value);
  }

  if (typeof value === 'string' && value.length > 0) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return String.fromCodePoint(numeric);
    }
    return value;
  }

  return null;
}

function normalizeViewport(viewport: MapConverterInput['viewport']): ViewportSnapshot | undefined {
  if (!viewport) {
    return undefined;
  }

  const scale = toFiniteNumber(viewport.scale, Number.NaN);
  const tx = toFiniteNumber(viewport.tx, Number.NaN);
  const ty = toFiniteNumber(viewport.ty, Number.NaN);
  if (!Number.isFinite(scale) || !Number.isFinite(tx) || !Number.isFinite(ty)) {
    return undefined;
  }

  return { scale, tx, ty };
}

function normalizePaperConfig(input: MapConverterInput): PaperConfig {
  const paperConfig: PaperConfig = {};
  const id = toId(input.id);
  const type = toOptionalText(input.type);
  const gridSize = toOptionalFiniteNumber(input.grid_size);
  const normalizePosition = toOptionalBoolean(input.normalize_position);
  const objectStatusRefreshInterval = toOptionalFiniteNumber(input.object_status_refresh_interval);
  const backgroundImage = toOptionalText(input.background_image);
  const backgroundOpacity = normalizeOpacity(input.background_opacity);
  const name = toOptionalText(input.name);
  const width = toOptionalFiniteNumber(input.width);
  const height = toOptionalFiniteNumber(input.height);
  const stencilDir = toOptionalText(input.stencil_dir);

  if (id) {
    paperConfig.id = id;
  }
  if (isPaperType(type)) {
    paperConfig.type = type;
  }
  if (gridSize !== undefined) {
    paperConfig.gridSize = gridSize;
  }
  if (normalizePosition !== undefined) {
    paperConfig.normalizePosition = normalizePosition;
  }
  if (objectStatusRefreshInterval !== undefined) {
    paperConfig.objectStatusRefreshInterval = objectStatusRefreshInterval;
  }
  if (backgroundImage) {
    paperConfig.backgroundImage = backgroundImage;
  }
  if (backgroundOpacity !== undefined) {
    paperConfig.backgroundOpacity = backgroundOpacity;
  }
  if (name) {
    paperConfig.name = name;
  }
  if (width !== undefined) {
    paperConfig.width = width;
  }
  if (height !== undefined) {
    paperConfig.height = height;
  }
  if (stencilDir) {
    paperConfig.stencilDir = stencilDir;
  }

  return paperConfig;
}

function getImageId(shape: string): string {
  return `img-${shape.replace(/\//g, '-').replace(/ /g, '-').replace(/_/g, '-')}`;
}

class MapConverter {
  private readonly mapData: MapConverterInput;

  private readonly portToNode: Record<string, string>;

  public constructor(mapData: MapConverterInput) {
    this.mapData = mapData;
    this.portToNode = this.buildPortMap();
  }

  public convert(): MapDocument {
    const cells: Array<joint.dia.Cell.JSON> = [];

    for (const node of this.mapData.nodes ?? []) {
      const cell = this.convertNode(node);
      if (cell) {
        cells.push(cell);
      }
    }

    for (const link of this.mapData.links ?? []) {
      const cell = this.convertLink(link);
      if (cell) {
        cells.push(cell);
      }
    }

    const graphJson: joint.dia.Graph.JSON = {
      cells,
      layers: createGraphLayers(),
      defaultLayer: NODE_LAYER_ID
    };

    const viewport = normalizeViewport(this.mapData.viewport);
    const interfaces = this.collectInterfaces();

    return MapDocument.fromGraph(graphJson, viewport, normalizePaperConfig(this.mapData), interfaces);
  }

  private buildPortMap(): Record<string, string> {
    const map: Record<string, string> = {};

    for (const node of this.mapData.nodes ?? []) {
      const nodeId = toId(node.id);
      if (!nodeId) {
        continue;
      }

      for (const port of node.ports ?? []) {
        const portId = toId(port.id);
        if (portId) {
          map[portId] = nodeId;
        }
      }
    }

    return map;
  }

  private convertNode(node: MapConverterNode): joint.dia.Cell.JSON | null {
    const nodeId = toId(node.id);
    const shape = toText(node.shape);
    const nodeWidth = toPositiveFiniteNumber(node.shape_width, 64);
    const nodeHeight = toPositiveFiniteNumber(node.shape_height, 64);
    if (!nodeId) {
      return null;
    }
    const data = {
      id: node.id,
      address: node.address,
      name: node.name,
      level: node.level,
      external: node.external,
      caps: node.caps,
      metrics_label: node.metrics_label,
      metrics_template: node.metrics_template,
      node_id: node.node_id,
      object_filter: node.object_filter,
      ports: node.ports,
      shapeOverlay: node.shape_overlay,
      type: node.type,
    };
    if (shape.length === 0) {
      const glyphText = toGlyphText(node.glyph);
      if (!glyphText) {
        return null;
      }

      return createNodeCell({
        kind: 'font',
        id: nodeId,
        x: toFiniteNumber(node.x, 0),
        y: toFiniteNumber(node.y, 0),
        width: nodeWidth,
        height: nodeHeight,
        nodeName: toText(node.name),
        metricsLabel: toText(node.metrics_label),
        ipaddrText: toText(node.address),
        iconUnicode: glyphText,
        iconSizeClass: toOptionalText(node.cls),
        statusCode: DEFAULT_STATUS_CODE,
        data: {
          ...data,
          glyph: glyphText,
        },
      });
    }

    return createNodeCell({
      kind: 'image',
      id: nodeId,
      x: toFiniteNumber(node.x, 0),
      y: toFiniteNumber(node.y, 0),
      width: nodeWidth,
      height: nodeHeight,
      nodeName: toText(node.name),
      metricsLabel: toText(node.metrics_label),
      ipaddrText: toText(node.address),
      iconHref: `#${getImageId(shape)}`,
      statusCode: DEFAULT_STATUS_CODE,
      data
    });
  }

  private convertLink(link: MapConverterLink): joint.dia.Cell.JSON | null {
    const sourcePortId = toId(link.ports?.[0]);
    const targetPortId = toId(link.ports?.[1]);
    if (!sourcePortId || !targetPortId) {
      return null;
    }

    const srcId = this.portToNode[sourcePortId];
    const dstId = this.portToNode[targetPortId];
    if (srcId === undefined || dstId === undefined) {
      return null;
    }
    const data = {
      id: link.id,
      bw: link.bw,
      in_bw: link.in_bw,
      out_bw: link.out_bw,
      method: link.method,
      connector: link.connector,
      ports: link.ports,
      type: link.type,
    };

    return {
      type: 'noc.LinkElement',
      id: toId(link.id) ?? `${srcId}:${dstId}`,
      layer: LINK_LAYER_ID,
      source: createIconLinkEnd(srcId),
      target: createIconLinkEnd(dstId),
      data,
    };
  }

  private collectInterfaces(): Interface[] {
    const interfaces: Interface[] = [];

    for (const node of this.mapData.nodes ?? []) {
      const objectName = toText(node.name);
      for (const port of node.ports ?? []) {
        const portId = toId(port.id);
        if (!portId) {
          continue;
        }

        for (const interfaceName of port.ports ?? []) {
          const normalizedInterfaceName = toOptionalText(interfaceName);
          if (!normalizedInterfaceName) {
            continue;
          }

          interfaces.push({
            id: portId,
            tags: {
              object: objectName,
              interface: normalizedInterfaceName
            }
          });
        }
      }
    }

    return interfaces;
  }
}

export function convertMapData(input: MapConverterInput): MapDocument {
  return new MapConverter(input).convert();
}
