import * as joint from '@joint/core';
import type { Disposer, Rect } from './types';

type Listener = (bounds: Rect | null) => void;

type RectLike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const EPSILON = 0.0001;

export class MapBoundsState {
  private readonly listeners = new Set<Listener>();

  private bounds: Rect | null = null;

  private dirty = true;

  private refreshRafId = 0;

  private readonly onGraphChangeBound = (): void => {
    this.invalidate();
    this.scheduleRefresh();
  };

  public constructor(
    private readonly graph: joint.dia.Graph,
    private readonly paper: joint.dia.Paper,
    private readonly boundsPadding: number) {
    this.graph.on('add', this.onGraphChangeBound);
    this.graph.on('remove', this.onGraphChangeBound);
    this.graph.on('reset', this.onGraphChangeBound);
    this.graph.on('change:position', this.onGraphChangeBound);
    this.graph.on('change:size', this.onGraphChangeBound);
    this.graph.on('change:vertices', this.onGraphChangeBound);
    this.graph.on('change:source', this.onGraphChangeBound);
    this.graph.on('change:target', this.onGraphChangeBound);
    this.graph.on('change:attrs', this.onGraphChangeBound);

    this.refreshNow();
  }

  public get(): Rect | null {
    if (this.dirty) {
      this.refreshNow();
    }
    return this.cloneRect(this.bounds);
  }

  public set(bounds: Rect | null): Rect | null {
    const nextBounds = this.normalizeRect(bounds);
    const changed = !this.areRectsEqual(this.bounds, nextBounds);
    this.bounds = nextBounds;
    this.dirty = false;
    if (changed) {
      this.emit();
    }
    return this.cloneRect(this.bounds);
  }

  public refreshNow(): Rect | null {
    return this.set(this.computeBounds());
  }

  public invalidate(): void {
    this.dirty = true;
  }

  public subscribe(listener: Listener): Disposer {
    this.listeners.add(listener);
    listener(this.get());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public destroy(): void {
    this.graph.off('add', this.onGraphChangeBound);
    this.graph.off('remove', this.onGraphChangeBound);
    this.graph.off('reset', this.onGraphChangeBound);
    this.graph.off('change:position', this.onGraphChangeBound);
    this.graph.off('change:size', this.onGraphChangeBound);
    this.graph.off('change:vertices', this.onGraphChangeBound);
    this.graph.off('change:source', this.onGraphChangeBound);
    this.graph.off('change:target', this.onGraphChangeBound);
    this.graph.off('change:attrs', this.onGraphChangeBound);

    if (this.refreshRafId !== 0) {
      window.cancelAnimationFrame(this.refreshRafId);
      this.refreshRafId = 0;
    }
    this.listeners.clear();
  }

  private scheduleRefresh(): void {
    if (this.refreshRafId !== 0) {
      return;
    }
    this.refreshRafId = window.requestAnimationFrame(() => {
      this.refreshRafId = 0;
      if (!this.dirty) {
        return;
      }
      this.refreshNow();
    });
  }

  private computeBounds(): Rect | null {
    const modelRect = this.normalizeRect(this.paper.getContentArea?.({ useModelGeometry: true }) ?? null);
    const visualRect = this.normalizeRect(this.paper.getContentArea?.() ?? null);
    const mergedRect = this.unionRects(modelRect, visualRect);
    if (mergedRect) {
      return mergedRect;
    }
    return this.normalizeRect(this.graph.getBBox() ?? null);
  }

  private normalizeRect(rect: RectLike | null): Rect | null {
    if (!rect) {
      return null;
    }
    if (
      !Number.isFinite(rect.x) ||
      !Number.isFinite(rect.y) ||
      !Number.isFinite(rect.width) ||
      !Number.isFinite(rect.height) ||
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return null;
    }
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width + this.boundsPadding,
      height: rect.height + this.boundsPadding,
    };
  }

  private areRectsEqual(a: Rect | null, b: Rect | null): boolean {
    if (!a && !b) {
      return true;
    }
    if (!a || !b) {
      return false;
    }
    return (
      Math.abs(a.x - b.x) <= EPSILON &&
      Math.abs(a.y - b.y) <= EPSILON &&
      Math.abs(a.width - b.width) <= EPSILON &&
      Math.abs(a.height - b.height) <= EPSILON
    );
  }

  private unionRects(a: Rect | null, b: Rect | null): Rect | null {
    if (!a) {
      return b;
    }
    if (!b) {
      return a;
    }

    const left = Math.min(a.x, b.x);
    const top = Math.min(a.y, b.y);
    const right = Math.max(a.x + a.width, b.x + b.width);
    const bottom = Math.max(a.y + a.height, b.y + b.height);

    return {
      x: left,
      y: top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top)
    };
  }

  private cloneRect(rect: Rect | null): Rect | null {
    if (!rect) {
      return null;
    }
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    };
  }

  private emit(): void {
    const snapshot = this.cloneRect(this.bounds);
    this.listeners.forEach((listener) => {
      listener(snapshot);
    });
  }
}
