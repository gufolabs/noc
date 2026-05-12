import type * as joint from '@joint/core';
import type { Point } from '../core/types';
import { DiagramService } from '../core/DiagramService';
import { GuidesManager } from '../managers/GuidesManager';
import { SnapManager } from '../managers/SnapManager';
import { getEventClientPoint, isPrimaryMouseButton } from '../core/events';
import type { InteractionMode } from './InteractionMode';

interface DragState {
  element: joint.dia.Element;
  startPointer: Point;
  startPosition: Point;
}

export interface EditModeHistoryHooks {
  onNodeMoveStart?: (element: joint.dia.Element) => void;
  onNodeMoveEnd?: (element: joint.dia.Element) => void;
  onNodeMoveCancel?: () => void;
}

export class EditMode implements InteractionMode {
  private readonly diagramService: DiagramService;

  private readonly guidesManager: GuidesManager;

  private readonly snapManager: SnapManager;

  private snapEnabled = false;

  private active = false;

  private dragState: DragState | null = null;

  private readonly historyHooks: EditModeHistoryHooks;

  public constructor(
    diagramService: DiagramService,
    guidesManager: GuidesManager,
    snapManager: SnapManager,
    historyHooks: EditModeHistoryHooks = {}
  ) {
    this.diagramService = diagramService;
    this.guidesManager = guidesManager;
    this.snapManager = snapManager;
    this.historyHooks = historyHooks;
  }

  public setSnapEnabled(enabled: boolean): void {
    this.snapEnabled = enabled;
    if (this.active) {
      this.diagramService.setDrawGrid(this.snapEnabled, this.snapManager.getGridSize());
    }
  }

  public setGridSize(gridSize: number): void {
    this.snapManager.setGridSize(gridSize);
    this.diagramService.setDrawGrid(this.active && this.snapEnabled, this.snapManager.getGridSize());
  }

  public setGuidesEnabled(enabled: boolean): void {
    this.guidesManager.setEnabled(enabled);
  }

  public activate(): void {
    this.active = true;
    this.diagramService.setDrawGrid(this.snapEnabled, this.snapManager.getGridSize());
    this.diagramService.setInteractive({
      elementMove: false,
      linkMove: false,
      labelMove: false,
      addLinkFromMagnet: false
    });
  }

  public deactivate(): void {
    this.active = false;
    this.dragState = null;
    this.guidesManager.clear();
    this.historyHooks.onNodeMoveCancel?.();
  }

  public onBlankPointerDown(_event: joint.dia.Event, _x: number, _y: number): void {
    return;
  }

  public onBlankPointerMove(_event: joint.dia.Event, x: number, y: number): void {
    if (!this.dragState) {
      return;
    }
    this.applyDragPosition(_event, x, y);
  }

  public onBlankPointerUp(_event: joint.dia.Event, _x: number, _y: number): void {
    this.finalizeDrag();
  }

  public onElementPointerDown(elementView: joint.dia.ElementView, event: joint.dia.Event, x: number, y: number): void {
    if (!isPrimaryMouseButton(event)) {
      return;
    }

    const model = elementView.model;
    if (!model.isElement()) {
      return;
    }

    const position = model.position();
    const pointer = this.resolvePointerLocal(event, x, y);
    this.dragState = {
      element: model,
      startPointer: pointer,
      startPosition: { x: position.x, y: position.y }
    };
    this.historyHooks.onNodeMoveStart?.(model);
  }

  public onElementPointerMove(_elementView: joint.dia.ElementView, event: joint.dia.Event, x: number, y: number): void {
    if (!this.dragState) {
      return;
    }

    this.applyDragPosition(event, x, y);
  }

  public onElementPointerUp(
    _elementView: joint.dia.ElementView,
    _event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    this.finalizeDrag();
  }

  private applyDragPosition(event: joint.dia.Event, fallbackX: number, fallbackY: number): void {
    if (!this.dragState) {
      return;
    }

    const pointer = this.resolvePointerLocal(event, fallbackX, fallbackY);
    const dx = pointer.x - this.dragState.startPointer.x;
    const dy = pointer.y - this.dragState.startPointer.y;

    let nextPosition: Point = {
      x: this.dragState.startPosition.x + dx,
      y: this.dragState.startPosition.y + dy
    };

    if (this.snapEnabled) {
      nextPosition = this.snapManager.snapPosition(nextPosition);
    }

    nextPosition = this.diagramService.clampElementPositionToVisibleArea(this.dragState.element, nextPosition);

    this.dragState.element.position(nextPosition.x, nextPosition.y, { deep: true });
    this.guidesManager.updateForElement(this.dragState.element);
  }

  private resolvePointerLocal(event: joint.dia.Event, fallbackX: number, fallbackY: number): Point {
    const clientPoint = getEventClientPoint(event);
    if (clientPoint) {
      const local = this.diagramService.clientToLocal(clientPoint.x, clientPoint.y);
      return { x: local.x, y: local.y };
    }
    return { x: fallbackX, y: fallbackY };
  }

  private finalizeDrag(): void {
    if (!this.dragState) {
      return;
    }
    // TODO: If Topology history is expanded beyond node moves, add separate transaction
    // boundaries here for link gestures and explicit property mutations instead of trying
    // to infer them indirectly from low-level graph change events.
    this.historyHooks.onNodeMoveEnd?.(this.dragState.element);
    this.dragState = null;
    this.guidesManager.clear();
  }
}
