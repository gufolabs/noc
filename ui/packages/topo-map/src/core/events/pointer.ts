import type * as joint from '@joint/core';
import type { Point } from '../types';

interface EventWithOriginal {
  originalEvent?: MouseEvent | PointerEvent;
}

interface EventWithClient {
  clientX: number;
  clientY: number;
}

function hasClientCoordinates(value: unknown): value is EventWithClient {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('clientX' in value) || !('clientY' in value)) {
    return false;
  }
  const maybe = value as EventWithClient;
  return typeof maybe.clientX === 'number' && typeof maybe.clientY === 'number';
}

function hasOriginalEvent(value: unknown): value is EventWithOriginal {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'originalEvent' in value;
}

export function getEventClientPoint(event: joint.dia.Event): Point | null {
  if (hasClientCoordinates(event)) {
    return { x: event.clientX, y: event.clientY };
  }
  if (hasOriginalEvent(event) && event.originalEvent && hasClientCoordinates(event.originalEvent)) {
    return { x: event.originalEvent.clientX, y: event.originalEvent.clientY };
  }
  return null;
}

export function isPrimaryMouseButton(event: joint.dia.Event): boolean {
  if (typeof event !== 'object' || event === null) {
    return false;
  }
  if ('button' in event && typeof (event as { button?: number }).button === 'number') {
    return (event as { button: number }).button === 0;
  }
  return true;
}
