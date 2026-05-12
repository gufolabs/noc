import type { ShapeOverlay, ShapeOverlayPosition } from './types';

type AttrMap = Record<string, unknown>;

const VALID_POSITIONS: ShapeOverlayPosition[] = ['NW', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W'];

export const MAINTENANCE_STATUS_BIT = 0x20;
export const MAINTENANCE_SHAPE_OVERLAY: ShapeOverlay = {
  code: 0xE30B,
  position: 'NE',
  form: 'c'
};

function isRecord(value: unknown): value is AttrMap {
  return typeof value === 'object' && value !== null;
}

function isShapeOverlayPosition(value: unknown): value is ShapeOverlayPosition {
  return typeof value === 'string' && VALID_POSITIONS.includes(value as ShapeOverlayPosition);
}

function isShapeOverlay(value: unknown): value is ShapeOverlay {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.code === 'number' &&
    Number.isFinite(value.code) &&
    isShapeOverlayPosition(value.position) &&
    (value.form === 'c' || value.form === 's')
  );
}

function isMaintenanceShapeOverlay(overlay: ShapeOverlay): boolean {
  return (
    overlay.code === MAINTENANCE_SHAPE_OVERLAY.code &&
    overlay.position === MAINTENANCE_SHAPE_OVERLAY.position &&
    overlay.form === MAINTENANCE_SHAPE_OVERLAY.form
  );
}

export function readShapeOverlays(data: unknown): ShapeOverlay[] {
  if (!isRecord(data) || !Array.isArray(data.shapeOverlay)) {
    return [];
  }

  return data.shapeOverlay.filter(isShapeOverlay);
}

export function syncMaintenanceShapeOverlay(overlays: ShapeOverlay[], isMaintenance: boolean): ShapeOverlay[] {
  const nextOverlays = overlays.filter((overlay) => !isMaintenanceShapeOverlay(overlay));
  return isMaintenance ? [MAINTENANCE_SHAPE_OVERLAY, ...nextOverlays] : nextOverlays;
}
