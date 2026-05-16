import type * as joint from '@joint/core';
import { inflateRect } from '../../core/geometry';
import type { Point, Rect } from '../../core/types';

export const GUIDE_SEARCH_PADDING = 500;

export interface GuideCandidate {
  value: number;
  axis: 'x' | 'y';
  role: 'edge' | 'center';
}

export interface GuideMatch extends GuideCandidate {
  delta: number;
}

export interface ResolvedGuides {
  xGuide: GuideMatch | null;
  yGuide: GuideMatch | null;
}

const ROLE_PRIORITY: Record<GuideCandidate['role'], number> = {
  center: 0,
  edge: 1
};

export function getElementRect(element: joint.dia.Element): Rect {
  const bbox = element.getBBox();
  return {
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height
  };
}

export function createGuideSearchRect(rect: Rect, padding = GUIDE_SEARCH_PADDING): Rect {
  return inflateRect(rect, padding);
}

export function resolveGuides(movingRect: Rect, nearbyRects: Rect[], tolerance: number): ResolvedGuides {
  const movingXValues = toGuideCandidates(movingRect, 'x');
  const movingYValues = toGuideCandidates(movingRect, 'y');

  let xGuide: GuideMatch | null = null;
  let yGuide: GuideMatch | null = null;

  nearbyRects.forEach((rect) => {
    xGuide = pickBetterMatch(xGuide, findBestMatch(movingXValues, toGuideCandidates(rect, 'x'), tolerance, 'x'));
    yGuide = pickBetterMatch(yGuide, findBestMatch(movingYValues, toGuideCandidates(rect, 'y'), tolerance, 'y'));
  });

  return {
    xGuide,
    yGuide
  };
}

export function resolvePointGuides(point: Point, nearbyRects: Rect[], tolerance: number): ResolvedGuides {
  let xGuide: GuideMatch | null = null;
  let yGuide: GuideMatch | null = null;

  nearbyRects.forEach((rect) => {
    xGuide = pickBetterMatch(xGuide, findBestPointMatch(point.x, toGuideCandidates(rect, 'x'), 'x', tolerance));
    yGuide = pickBetterMatch(yGuide, findBestPointMatch(point.y, toGuideCandidates(rect, 'y'), 'y', tolerance));
  });

  return {
    xGuide,
    yGuide
  };
}

function toGuideCandidates(rect: Rect, axis: 'x' | 'y'): GuideCandidate[] {
  if (axis === 'x') {
    return [
      { axis: 'x', role: 'edge', value: rect.x },
      { axis: 'x', role: 'center', value: rect.x + rect.width / 2 },
      { axis: 'x', role: 'edge', value: rect.x + rect.width }
    ];
  }

  return [
    { axis: 'y', role: 'edge', value: rect.y },
    { axis: 'y', role: 'center', value: rect.y + rect.height / 2 },
    { axis: 'y', role: 'edge', value: rect.y + rect.height }
  ];
}

function findBestMatch(
  moving: GuideCandidate[],
  candidates: GuideCandidate[],
  tolerance: number,
  axis: 'x' | 'y'
): GuideMatch | null {
  let best: GuideMatch | null = null;

  moving.forEach((source) => {
    candidates.forEach((candidate) => {
      if (candidate.axis !== axis) {
        return;
      }

      const delta = Math.abs(source.value - candidate.value);
      if (delta > tolerance) {
        return;
      }

      const next: GuideMatch = {
        ...candidate,
        delta
      };
      best = pickBetterMatch(best, next);
    });
  });

  return best;
}

function findBestPointMatch(
  sourceValue: number,
  candidates: GuideCandidate[],
  axis: 'x' | 'y',
  tolerance: number
): GuideMatch | null {
  let best: GuideMatch | null = null;

  candidates.forEach((candidate) => {
    if (candidate.axis !== axis) {
      return;
    }

    const delta = Math.abs(sourceValue - candidate.value);
    if (delta > tolerance) {
      return;
    }

    const next: GuideMatch = {
      ...candidate,
      delta
    };
    best = pickBetterMatch(best, next);
  });

  return best;
}

function pickBetterMatch(current: GuideMatch | null, next: GuideMatch | null): GuideMatch | null {
  if (!next) {
    return current;
  }
  if (!current) {
    return next;
  }
  if (next.delta !== current.delta) {
    return next.delta < current.delta ? next : current;
  }
  if (ROLE_PRIORITY[next.role] !== ROLE_PRIORITY[current.role]) {
    return ROLE_PRIORITY[next.role] < ROLE_PRIORITY[current.role] ? next : current;
  }
  if (next.value !== current.value) {
    return next.value < current.value ? next : current;
  }
  return current;
}
