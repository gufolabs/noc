import * as joint from '@joint/core';
import type { LinkBwValue } from '../core/types';

interface LinkStrokeStyle {
  strokeWidth: number;
  strokeDasharray?: string;
}

export interface LinkUtilizationStyle {
  stroke: string;
}

export const LINK_OK = 0;
export const LINK_ADMIN_DOWN = 1;
export const LINK_OPER_DOWN = 2;
export const LINK_STP_BLOCKED = 3;

export interface LinkStatusStyle {
  stroke?: string;
  glyph?: string;
  fontSize?: number;
}

interface LinkDataPayload {
  bw?: unknown;
}

interface LinkAttributes {
  attrs?: {
    line?: LinkStrokeStyle;
  };
  data?: LinkDataPayload;
}

const bwStyle: Array<{ threshold: number; style: LinkStrokeStyle }> = [
  { threshold: 99_500_000_000, style: { strokeWidth: 5 } },
  { threshold: 39_500_000_000, style: { strokeWidth: 4 } },
  { threshold: 9_500_000_000, style: { strokeWidth: 3 } },
  { threshold: 1_000_000_000, style: { strokeWidth: 2 } },
  { threshold: 100_000_000, style: { strokeWidth: 1 } },
  { threshold: 0, style: { strokeWidth: 1, strokeDasharray: '10 5' } }
];
const defaultStrokeStyle = bwStyle[bwStyle.length - 1]!.style;
export const LINK_DEFAULT_STROKE = '#000000';
export const LINK_UTILIZATION_STYLES: Array<{ threshold: number; style: LinkUtilizationStyle }> = [
  { threshold: 0.95, style: { stroke: '#ff0000' } },
  { threshold: 0.8, style: { stroke: '#990000' } },
  { threshold: 0.5, style: { stroke: '#ff9933' } },
  { threshold: 0.0, style: { stroke: '#006600' } }
];
const LINK_UTILIZATION_BALANCE_TEXT = '●';
const LINK_UTILIZATION_FILTER = {
  name: 'dropShadow',
  args: { dx: 1, dy: 1, blur: 2 }
} as const;
const LINK_STATUS_STYLES: Record<number, LinkStatusStyle> = {
  [LINK_OK]: {},
  [LINK_ADMIN_DOWN]: {
    stroke: '#7f8c8d',
    glyph: '\uf00d',
    fontSize: 10
  },
  [LINK_OPER_DOWN]: {
    stroke: '#c0392b',
    glyph: '\uf071',
    fontSize: 10
  },
  [LINK_STP_BLOCKED]: {
    stroke: '#8e44ad',
    glyph: '\uf05e',
    fontSize: 12
  }
};

function normalizeBw(bw: unknown): number {
  if (typeof bw !== 'number' || !Number.isFinite(bw) || bw < 0) {
    return 0;
  }

  return bw;
}

function getStrokeStyle(bw: unknown): LinkStrokeStyle {
  const normalizedBw = normalizeBw(bw);
  const match = bwStyle.find(({ threshold }) => threshold <= normalizedBw);

  return match?.style ?? defaultStrokeStyle;
}

export function normalizeLinkUtilization(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function getLinkUtilizationStyle(value: number): LinkUtilizationStyle {
  const normalizedValue = normalizeLinkUtilization(value);
  const match = LINK_UTILIZATION_STYLES.find(({ threshold }) => normalizedValue >= threshold);

  return match?.style ?? LINK_UTILIZATION_STYLES[LINK_UTILIZATION_STYLES.length - 1]!.style;
}

export function applyLinkUtilization(
  link: joint.dia.Link,
  value: number,
  linkBw: LinkBwValue
): void {
  const style = getLinkUtilizationStyle(value);
  const totalBw = linkBw.in + linkBw.out;
  const balancePosition = totalBw > 0 ? linkBw.in / totalBw : 0.5;
  const balanceVisibility = totalBw > 0 ? 'visible' : 'hidden';

  link.attr('line/stroke', style.stroke);
  link.attr('line/filter', LINK_UTILIZATION_FILTER);
  link.label(0, {
    position: balancePosition,
    attrs: {
      text: {
        text: LINK_UTILIZATION_BALANCE_TEXT,
        fill: style.stroke,
        visibility: balanceVisibility,
        'font-size': 5
      }
    }
  });
}

export function applyLinkStatus(link: joint.dia.Link, status: number): void {
  const style = LINK_STATUS_STYLES[status];
  if (!style || status === LINK_OK) {
    resetLinkPresentation(link);
    return;
  }

  link.attr('line/stroke', style.stroke ?? LINK_DEFAULT_STROKE);
  link.removeAttr('line/filter');
  link.label(0, {
    position: 0.5,
    attrs: {
      text: {
        text: style.glyph ?? '',
        fontFamily: 'FontAwesome',
        fontWeight: 900,
        fill: style.stroke ?? LINK_DEFAULT_STROKE,
        visibility: 'visible',
        'font-size': style.fontSize ?? 10
      }
    }
  });
}

export function resetLinkPresentation(link: joint.dia.Link): void {
  link.attr('line/stroke', LINK_DEFAULT_STROKE);
  link.removeAttr('line/filter');
  link.set('labels', []);
}

export const LinkElement = joint.shapes.standard.Link.define('noc.LinkElement', {
  z: 10,
  markup: [
    {
      tagName: 'path',
      selector: 'outline',
      attributes: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        'stroke-linecap': 'round'
      }
    },
    {
      tagName: 'path',
      selector: 'line'
    }
  ],
  attrs: {
    line: {
      stroke: LINK_DEFAULT_STROKE,
      strokeWidth: 1,
      strokeLinecap: 'round',
      targetMarker: { type: 'none' }
    },
    outline: {
      connection: true,
      strokeWidth: 10
    },
    connector: 'normal'
  }
}, {
  initialize(this: joint.shapes.standard.Link, attributes?: LinkAttributes, options?: unknown) {
    joint.shapes.standard.Link.prototype.initialize.call(this, attributes, options);

    const lineAttrs = attributes?.attrs?.line;
    const style = getStrokeStyle(attributes?.data?.bw ?? this.get('data')?.bw);

    if (lineAttrs?.strokeWidth === undefined) {
      this.attr('line/strokeWidth', style.strokeWidth, { silent: true });
    }

    if (lineAttrs?.strokeDasharray === undefined) {
      if (style.strokeDasharray) {
        this.attr('line/strokeDasharray', style.strokeDasharray, { silent: true });
      } else {
        this.removeAttr('line/strokeDasharray', { silent: true });
      }
    }
  }
});
