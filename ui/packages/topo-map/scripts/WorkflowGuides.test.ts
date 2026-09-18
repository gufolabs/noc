import { describe, expect, it } from 'vitest';
import { createGuideSearchRect, resolveGuides, resolvePointGuides } from '../src/workflow/internal/guides';

describe('workflow guides helpers', () => {
  it('returns x and y guides for aligned nearby rectangles', () => {
    const movingRect = { x: 100, y: 200, width: 120, height: 60 };
    const nearbyRects = [
      { x: 220, y: 200, width: 120, height: 60 },
      { x: 105, y: 260, width: 120, height: 60 }
    ];

    const guides = resolveGuides(movingRect, nearbyRects, 5);

    expect(guides.xGuide).toMatchObject({
      axis: 'x',
      value: 220,
      delta: 0
    });
    expect(guides.yGuide).toMatchObject({
      axis: 'y',
      value: 230,
      delta: 0
    });
  });

  it('picks the closest guide within tolerance', () => {
    const movingRect = { x: 100, y: 100, width: 100, height: 40 };
    const nearbyRects = [
      { x: 103, y: 300, width: 100, height: 40 },
      { x: 101, y: 500, width: 100, height: 40 }
    ];

    const guides = resolveGuides(movingRect, nearbyRects, 5);

    expect(guides.xGuide).toMatchObject({
      axis: 'x',
      value: 151,
      delta: 1
    });
  });

  it('returns no guides when every candidate is outside tolerance', () => {
    const movingRect = { x: 100, y: 100, width: 100, height: 40 };
    const nearbyRects = [{ x: 120, y: 200, width: 100, height: 40 }];

    const guides = resolveGuides(movingRect, nearbyRects, 5);

    expect(guides).toEqual({
      xGuide: null,
      yGuide: null
    });
  });

  it('returns guides for a dragged vertex point aligned to state bounds', () => {
    const point = { x: 150, y: 120 };
    const nearbyRects = [
      { x: 100, y: 100, width: 100, height: 40 },
      { x: 300, y: 200, width: 100, height: 40 }
    ];

    const guides = resolvePointGuides(point, nearbyRects, 5);

    expect(guides.xGuide).toMatchObject({
      axis: 'x',
      value: 150,
      delta: 0,
      role: 'center'
    });
    expect(guides.yGuide).toMatchObject({
      axis: 'y',
      value: 120,
      delta: 0,
      role: 'center'
    });
  });

  it('expands the guide search rect by the configured padding', () => {
    expect(createGuideSearchRect({ x: 10, y: 20, width: 30, height: 40 }, 50)).toEqual({
      x: -40,
      y: -30,
      width: 130,
      height: 140
    });
  });
});
