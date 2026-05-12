import * as joint from '@joint/core';
import RBush from 'rbush';
import type { BBox } from 'rbush';
import type { Rect } from '../../core/types';

interface IndexedState extends BBox {
  id: joint.dia.Cell.ID;
  element: joint.dia.Element;
}

export class WorkflowSpatialIndex {
  private readonly graph: joint.dia.Graph;

  private readonly index = new RBush<IndexedState>();

  private readonly itemsById = new Map<joint.dia.Cell.ID, IndexedState>();

  private readonly onAddBound = (cell: joint.dia.Cell): void => {
    if (this.isIndexedElement(cell)) {
      this.upsertElement(cell);
    }
  };

  private readonly onRemoveBound = (cell: joint.dia.Cell): void => {
    this.removeById(cell.id);
  };

  private readonly onPositionChangeBound = (cell: joint.dia.Cell): void => {
    if (this.isIndexedElement(cell)) {
      this.upsertElement(cell);
    }
  };

  public constructor(graph: joint.dia.Graph) {
    this.graph = graph;
    this.rebuildIndex();

    this.graph.on('add', this.onAddBound);
    this.graph.on('remove', this.onRemoveBound);
    this.graph.on('change:position', this.onPositionChangeBound);
    this.graph.on('change:size', this.onPositionChangeBound);
  }

  public searchNearby(rect: Rect): joint.dia.Element[] {
    const found = this.index.search({
      minX: rect.x,
      minY: rect.y,
      maxX: rect.x + rect.width,
      maxY: rect.y + rect.height
    });

    return found.map((item: IndexedState) => item.element);
  }

  public rebuildIndex(): void {
    this.index.clear();
    this.itemsById.clear();

    const items = this.graph
      .getElements()
      .filter((element) => this.isIndexedElement(element))
      .map((element) => this.toIndexItem(element));

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

  private isIndexedElement(cell: joint.dia.Cell): cell is joint.dia.Element {
    return cell.isElement() && cell.get('type') === 'workflow.State';
  }

  private upsertElement(element: joint.dia.Element): void {
    const current = this.itemsById.get(element.id);
    if (current) {
      this.index.remove(current, (a: IndexedState, b: IndexedState) => a.id === b.id);
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

    this.index.remove(current, (a: IndexedState, b: IndexedState) => a.id === b.id);
    this.itemsById.delete(id);
  }

  private toIndexItem(element: joint.dia.Element): IndexedState {
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
}
