import type * as joint from '@joint/core';
import { PanManager } from '../managers/PanManager';
import { getEventClientPoint, isPrimaryMouseButton } from '../core/events';
import { DiagramService } from '../core/DiagramService';
import type { InteractionMode } from './InteractionMode';

export class PanMode implements InteractionMode {
  private readonly panManager: PanManager;

  private readonly diagramService: DiagramService;

  private readonly onWindowPointerMoveBound = (event: PointerEvent): void => {
    if (!this.panManager.isPanning()) {
      return;
    }
    this.panManager.move(event.clientX, event.clientY);
  };

  private readonly onWindowPointerUpBound = (): void => {
    this.stopWindowTracking();
    this.panManager.end();
  };

  private windowTracking = false;

  public constructor(panManager: PanManager, diagramService: DiagramService) {
    this.panManager = panManager;
    this.diagramService = diagramService;
  }

  public activate(): void {
    this.diagramService.setDrawGrid(false, 1);
    this.diagramService.setInteractive(false);
  }

  public deactivate(): void {
    this.stopWindowTracking();
    this.panManager.end();
  }

  public onBlankPointerDown(event: joint.dia.Event, _x: number, _y: number): void {
    this.startPanFromEvent(event);
  }

  public onBlankPointerMove(event: joint.dia.Event, _x: number, _y: number): void {
    if (!this.panManager.isPanning()) {
      return;
    }
    const clientPoint = getEventClientPoint(event);
    if (!clientPoint) {
      return;
    }
    this.panManager.move(clientPoint.x, clientPoint.y);
  }

  public onBlankPointerUp(_event: joint.dia.Event, _x: number, _y: number): void {
    this.stopWindowTracking();
    this.panManager.end();
  }

  public onElementPointerDown(
    _elementView: joint.dia.ElementView,
    event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    this.startPanFromEvent(event);
  }

  public onElementPointerMove(
    _elementView: joint.dia.ElementView,
    event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    if (!this.panManager.isPanning()) {
      return;
    }
    const clientPoint = getEventClientPoint(event);
    if (!clientPoint) {
      return;
    }
    this.panManager.move(clientPoint.x, clientPoint.y);
  }

  public onElementPointerUp(
    _elementView: joint.dia.ElementView,
    _event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    this.stopWindowTracking();
    this.panManager.end();
  }

  private startPanFromEvent(event: joint.dia.Event): void {
    if (!isPrimaryMouseButton(event)) {
      return;
    }
    const clientPoint = getEventClientPoint(event);
    if (!clientPoint) {
      return;
    }
    this.panManager.start(clientPoint.x, clientPoint.y);
    this.startWindowTracking();
  }

  private startWindowTracking(): void {
    if (this.windowTracking) {
      return;
    }
    window.addEventListener('pointermove', this.onWindowPointerMoveBound);
    window.addEventListener('pointerup', this.onWindowPointerUpBound);
    window.addEventListener('pointercancel', this.onWindowPointerUpBound);
    this.windowTracking = true;
  }

  private stopWindowTracking(): void {
    if (!this.windowTracking) {
      return;
    }
    window.removeEventListener('pointermove', this.onWindowPointerMoveBound);
    window.removeEventListener('pointerup', this.onWindowPointerUpBound);
    window.removeEventListener('pointercancel', this.onWindowPointerUpBound);
    this.windowTracking = false;
  }
}
