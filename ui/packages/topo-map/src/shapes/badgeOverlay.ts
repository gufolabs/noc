import type * as joint from '@joint/core';
import { readShapeOverlays } from '../core/shapeOverlay';
import type { ShapeOverlay, ShapeOverlayPosition } from '../core/types';

export const BADGE_SCALE = 0.15;

const POSITION_TO_SELECTOR: Record<ShapeOverlayPosition, string> = {
  NW: 'badgeNw',
  NE: 'badgeNe',
  SW: 'badgeSw',
  SE: 'badgeSe',
  N: 'badgeN',
  E: 'badgeE',
  S: 'badgeS',
  W: 'badgeW'
};

function buildBadgeClassName(statusCode: number): string {
  return [
    'gf',
    // getFontStatusClass(statusCode),
  ].filter(Boolean).join(' ');
}

function makeBadgeMarkup(selector: string, form: ShapeOverlay['form']): joint.dia.MarkupJSON[number] {
  const shape = form === 'c' ? 'circle' : 'rect';
  return {
    tagName: 'g',
    selector,
    children: [
      { tagName: shape, selector: `${selector}Bg` },
      { tagName: 'text', selector: `${selector}Text` }
    ]
  };
}

export function getBadgeOverlays(data: unknown): ShapeOverlay[] {
  const seenPositions = new Set<ShapeOverlayPosition>();

  return readShapeOverlays(data).filter((overlay) => {
    if (seenPositions.has(overlay.position)) {
      return false;
    }

    seenPositions.add(overlay.position);
    return true;
  });
}

export function buildBadgeMarkup(overlays: ShapeOverlay[]): joint.dia.MarkupJSON {
  return overlays.map((overlay) =>
    makeBadgeMarkup(POSITION_TO_SELECTOR[overlay.position], overlay.form)
  );
}

export function buildBadgeAttrs(
  overlays: ShapeOverlay[],
  statusCode: number,
  badgeSize: number,
  badgeFontSize: number,
  transforms: Record<ShapeOverlayPosition, string>
): joint.dia.Cell.Selectors {
  // set color based on status code of the first overlay (if any)
  const badgeClassName = buildBadgeClassName(statusCode);
  const attrs: joint.dia.Cell.Selectors = {};

  overlays.forEach(({ position, code, form }) => {
    const selector = POSITION_TO_SELECTOR[position];
    const shapeGeom = form === 'c'
      ? { cx: 0, cy: 0, r: badgeSize }
      : { x: -badgeSize, y: -badgeSize, width: badgeSize * 2, height: badgeSize * 2 };

    attrs[selector] = { transform: transforms[position] };
    attrs[`${selector}Bg`] = {
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeWidth: 0.5,
      ...shapeGeom
    };
    attrs[`${selector}Text`] = {
      x: 0,
      y: badgeFontSize / 2,
      textAnchor: 'middle',
      fontFamily: 'GufoFont',
      fill: '#000000',
      class: badgeClassName,
      style: `--gf-size: ${badgeFontSize}px;` as any,
      text: String.fromCodePoint(code)
    };
  });

  return attrs;
}
