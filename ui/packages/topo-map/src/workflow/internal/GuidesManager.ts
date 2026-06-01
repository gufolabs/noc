import * as joint from '@joint/core';
import type { Point, Rect } from '../../core/types';
import { createGuideSearchRect, getElementRect, resolveGuides, resolvePointGuides, type GuideMatch } from './guides';

const GUIDE_STROKE = '#0ea5e9';
const GUIDE_SECONDARY_STROKE = '#22c55e';

interface WorkflowViewportSnapshot {
  scale: number;
  tx: number;
  ty: number;
}

export class WorkflowGuidesManager {
  private readonly vector: typeof joint.V;

  private readonly paper: joint.dia.Paper;

  private readonly getViewportSnapshot: () => WorkflowViewportSnapshot;

  private readonly tolerancePx: number;

  private readonly findNearby: (bbox: Rect) => joint.dia.Element[];

  private enabled = true;

  private readonly layer: ReturnType<typeof joint.V>;

  private readonly xGuide: ReturnType<typeof joint.V>;

  private readonly yGuide: ReturnType<typeof joint.V>;

  public constructor(
    paper: joint.dia.Paper,
    getViewportSnapshot: () => WorkflowViewportSnapshot,
    tolerancePx: number,
    findNearby: (bbox: Rect) => joint.dia.Element[]
  ) {
    this.vector = joint.V;
    this.paper = paper;
    this.getViewportSnapshot = getViewportSnapshot;
    this.tolerancePx = tolerancePx;
    this.findNearby = findNearby;

    this.layer = this.vector('g', { class: 'workflow-guides' });
    this.xGuide = this.vector('line', {
      stroke: GUIDE_STROKE,
      'stroke-width': 1,
      'stroke-dasharray': '4 4',
      visibility: 'hidden'
    });
    this.yGuide = this.vector('line', {
      stroke: GUIDE_SECONDARY_STROKE,
      'stroke-width': 1,
      'stroke-dasharray': '4 4',
      visibility: 'hidden'
    });

    this.layer.append(this.xGuide);
    this.layer.append(this.yGuide);

    if (this.paper.svg) {
      this.layer.appendTo(this.paper.svg);
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.clear();
    }
  }

  public updateForElement(element: joint.dia.Element): void {
    if (!this.enabled) {
      this.clear();
      return;
    }

    const movingRect = getElementRect(element);
    const scale = Math.max(this.getViewportSnapshot().scale, 0.0001);
    const tolerance = this.tolerancePx / scale;
    const searchRect = createGuideSearchRect(movingRect);
    const nearbyRects = this.findNearby(searchRect)
      .filter((other) => other.id !== element.id)
      .map((other) => getElementRect(other));
    const { xGuide, yGuide } = resolveGuides(movingRect, nearbyRects, tolerance);

    this.renderGuides(xGuide, yGuide);
  }

  public updateForPoint(point: Point): void {
    if (!this.enabled) {
      this.clear();
      return;
    }

    const scale = Math.max(this.getViewportSnapshot().scale, 0.0001);
    const tolerance = this.tolerancePx / scale;
    const searchRect = createGuideSearchRect({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0
    });
    const nearbyRects = this.findNearby(searchRect).map((other) => getElementRect(other));
    const { xGuide, yGuide } = resolvePointGuides(point, nearbyRects, tolerance);

    this.renderGuides(xGuide, yGuide);
  }

  public clear(): void {
    this.xGuide.attr('visibility', 'hidden');
    this.yGuide.attr('visibility', 'hidden');
  }

  public destroy(): void {
    this.clear();
    this.layer.remove();
  }

  private renderGuides(xGuide: GuideMatch | null, yGuide: GuideMatch | null): void {
    const viewport = this.getViewportRect();

    if (xGuide) {
      const start = this.paper.localToPaperPoint({ x: xGuide.value, y: viewport.y });
      const end = this.paper.localToPaperPoint({ x: xGuide.value, y: viewport.y + viewport.height });
      this.xGuide.attr({
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        visibility: 'visible'
      });
    } else {
      this.xGuide.attr('visibility', 'hidden');
    }

    if (yGuide) {
      const start = this.paper.localToPaperPoint({ x: viewport.x, y: yGuide.value });
      const end = this.paper.localToPaperPoint({ x: viewport.x + viewport.width, y: yGuide.value });
      this.yGuide.attr({
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        visibility: 'visible'
      });
    } else {
      this.yGuide.attr('visibility', 'hidden');
    }
  }

  private getViewportRect(): Rect {
    const snapshot = this.getViewportSnapshot();
    return {
      x: -snapshot.tx / snapshot.scale,
      y: -snapshot.ty / snapshot.scale,
      width: this.paper.el.clientWidth / snapshot.scale,
      height: this.paper.el.clientHeight / snapshot.scale
    };
  }
}
