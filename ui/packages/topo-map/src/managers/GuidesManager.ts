import * as joint from '@joint/core';
import type { Rect } from '../core/types';
import { ViewportState } from '../core/ViewportState';

const GUIDE_STROKE = '#0ea5e9';
const GUIDE_SECONDARY_STROKE = '#22c55e';

interface GuideCandidate {
  value: number;
  axis: 'x' | 'y';
  role: 'edge' | 'center';
}

export class GuidesManager {
  private readonly vector: typeof joint.V;

  private readonly paper: joint.dia.Paper;

  private readonly viewportState: ViewportState;

  private readonly tolerancePx: number;

  private readonly findNearby: (bbox: Rect) => joint.dia.Element[];

  private enabled = true;

  private readonly layer: ReturnType<typeof joint.V>;

  private readonly xGuide: ReturnType<typeof joint.V>;

  private readonly yGuide: ReturnType<typeof joint.V>;

  public constructor(
    paper: joint.dia.Paper,
    viewportState: ViewportState,
    tolerancePx: number,
    findNearby: (bbox: Rect) => joint.dia.Element[]
  ) {
    this.vector = joint.V;
    this.paper = paper;
    this.viewportState = viewportState;
    this.tolerancePx = tolerancePx;
    this.findNearby = findNearby;

    this.layer = this.vector('g', { class: 'topology-guides' });
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

    const movingBox = element.getBBox();
    const tolerance = this.tolerancePx / this.viewportState.getSnapshot().scale;

    const candidateSearchRect: Rect = {
      x: movingBox.x - 500,
      y: movingBox.y - 500,
      width: movingBox.width + 1000,
      height: movingBox.height + 1000
    };

    const others = this.findNearby(candidateSearchRect).filter((other) => other.id !== element.id);

    const movingXValues: GuideCandidate[] = [
      { axis: 'x', role: 'edge', value: movingBox.x },
      { axis: 'x', role: 'center', value: movingBox.x + movingBox.width / 2 },
      { axis: 'x', role: 'edge', value: movingBox.x + movingBox.width }
    ];

    const movingYValues: GuideCandidate[] = [
      { axis: 'y', role: 'edge', value: movingBox.y },
      { axis: 'y', role: 'center', value: movingBox.y + movingBox.height / 2 },
      { axis: 'y', role: 'edge', value: movingBox.y + movingBox.height }
    ];

    let xMatch: GuideCandidate | null = null;
    let yMatch: GuideCandidate | null = null;

    for (const other of others) {
      const box = other.getBBox();
      const xValues: GuideCandidate[] = [
        { axis: 'x', role: 'edge', value: box.x },
        { axis: 'x', role: 'center', value: box.x + box.width / 2 },
        { axis: 'x', role: 'edge', value: box.x + box.width }
      ];
      const yValues: GuideCandidate[] = [
        { axis: 'y', role: 'edge', value: box.y },
        { axis: 'y', role: 'center', value: box.y + box.height / 2 },
        { axis: 'y', role: 'edge', value: box.y + box.height }
      ];

      if (!xMatch) {
        xMatch = this.findBestMatch(movingXValues, xValues, tolerance, 'x');
      }
      if (!yMatch) {
        yMatch = this.findBestMatch(movingYValues, yValues, tolerance, 'y');
      }
      if (xMatch && yMatch) {
        break;
      }
    }

    this.renderGuides(xMatch, yMatch);
  }

  public clear(): void {
    this.xGuide.attr('visibility', 'hidden');
    this.yGuide.attr('visibility', 'hidden');
  }

  public destroy(): void {
    this.clear();
    this.layer.remove();
  }

  private findBestMatch(
    moving: GuideCandidate[],
    candidates: GuideCandidate[],
    tolerance: number,
    axis: 'x' | 'y'
  ): GuideCandidate | null {
    for (const source of moving) {
      for (const candidate of candidates) {
        if (candidate.axis !== axis) {
          continue;
        }
        if (Math.abs(source.value - candidate.value) <= tolerance) {
          return candidate;
        }
      }
    }
    return null;
  }

  private renderGuides(xGuide: GuideCandidate | null, yGuide: GuideCandidate | null): void {
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
    const snapshot = this.viewportState.getSnapshot();
    return {
      x: -snapshot.tx / snapshot.scale,
      y: -snapshot.ty / snapshot.scale,
      width: this.paper.el.clientWidth / snapshot.scale,
      height: this.paper.el.clientHeight / snapshot.scale
    };
  }
}
