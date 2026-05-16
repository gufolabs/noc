import * as joint from '@joint/core';
import RBush from 'rbush';
import type { BBox } from 'rbush';
import type { Rect } from '../core/types';
import { ViewportState } from '../core/ViewportState';
import { inflateRect, intersects } from '../core/geometry';

interface IndexedElement extends BBox {
  id: joint.dia.Cell.ID;
  element: joint.dia.Element;
}

export class ViewportManager {
  private readonly graph: joint.dia.Graph;

  private readonly paper: joint.dia.Paper;

  private readonly viewportState: ViewportState;

  private readonly index = new RBush<IndexedElement>();

  private readonly itemsById = new Map<joint.dia.Cell.ID, IndexedElement>();

  private readonly bufferPx: number;

  private readonly onAddBound = (cell: joint.dia.Cell): void => {
    if (cell.isElement()) {
      this.upsertElement(cell);
    }
  };

  private readonly onRemoveBound = (cell: joint.dia.Cell): void => {
    this.removeById(cell.id);
  };

  private readonly onPositionChangeBound = (cell: joint.dia.Cell): void => {
    if (cell.isElement()) {
      this.upsertElement(cell);
    }
  };

  public constructor(graph: joint.dia.Graph, paper: joint.dia.Paper, viewportState: ViewportState, bufferPx = 200) {
    this.graph = graph;
    this.paper = paper;
    this.viewportState = viewportState;
    this.bufferPx = bufferPx;

    this.rebuildIndex();

    this.graph.on('add', this.onAddBound);
    this.graph.on('remove', this.onRemoveBound);
    this.graph.on('change:position', this.onPositionChangeBound);
    this.graph.on('change:size', this.onPositionChangeBound);
  }

  public isCellVisible(view: joint.mvc.View<joint.mvc.Model, SVGElement>): boolean {
    const modelCandidate = (view as unknown as { model?: joint.mvc.Model }).model;
    if (!(modelCandidate instanceof joint.dia.Cell)) {
      return true;
    }

    const cell = modelCandidate;
    if (cell.isLink()) {
      return this.isLinkVisible(cell);
    }
    if (!cell.isElement()) {
      return true;
    }
    const bbox = cell.getBBox();
    const viewportRect = this.getBufferedViewportRect();
    const elementRect: Rect = {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height
    };
    return intersects(elementRect, viewportRect);
  }

  public searchNearby(rect: Rect): joint.dia.Element[] {
    const found = this.index.search({
      minX: rect.x,
      minY: rect.y,
      maxX: rect.x + rect.width,
      maxY: rect.y + rect.height
    });
    return found.map((item: IndexedElement) => item.element);
  }

  public rebuildIndex(): void {
    this.index.clear();
    this.itemsById.clear();

    const items = this.graph.getElements().map((element) => this.toIndexItem(element));
    this.index.load(items);
    items.forEach((item) => {
      this.itemsById.set(item.id, item);
    });
  }

  public destroy(): void {
    this.graph.off('add', this.onAddBound);
    this.graph.off('remove', this.onRemoveBound);
    this.graph.off('change:position', this.onPositionChangeBound);
    this.graph.off('change:size', this.onPositionChangeBound);
    this.index.clear();
    this.itemsById.clear();
  }

  private upsertElement(element: joint.dia.Element): void {
    const current = this.itemsById.get(element.id);
    if (current) {
      this.index.remove(current, (a: IndexedElement, b: IndexedElement) => a.id === b.id);
    }
    const next = this.toIndexItem(element);
    this.itemsById.set(next.id, next);
    this.index.insert(next);
  }

  private removeById(id: joint.dia.Cell.ID): void {
    const current = this.itemsById.get(id);
    if (!current) {
      return;
    }
    this.index.remove(current, (a: IndexedElement, b: IndexedElement) => a.id === b.id);
    this.itemsById.delete(id);
  }

  private toIndexItem(element: joint.dia.Element): IndexedElement {
    const bbox = element.getBBox();
    return {
      id: element.id,
      element,
      minX: bbox.x,
      minY: bbox.y,
      maxX: bbox.x + bbox.width,
      maxY: bbox.y + bbox.height
    };
  }

  private getBufferedViewportRect(): Rect {
    const snapshot = this.viewportState.getSnapshot();
    const width = this.paper.el.clientWidth;
    const height = this.paper.el.clientHeight;
    const viewport: Rect = {
      x: -snapshot.tx / snapshot.scale,
      y: -snapshot.ty / snapshot.scale,
      width: width / snapshot.scale,
      height: height / snapshot.scale
    };
    return inflateRect(viewport, this.bufferPx / snapshot.scale);
  }

  private isLinkVisible(link: joint.dia.Link): boolean {
    const viewportRect = this.getBufferedViewportRect();
    const bbox = link.getBBox();

    const linkRect: Rect = {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height
    };

    const snapshot = this.viewportState.getSnapshot();
    const edgeMargin = 8 / Math.max(snapshot.scale, 0.0001);
    return intersects(inflateRect(linkRect, edgeMargin), viewportRect);
  }
}
