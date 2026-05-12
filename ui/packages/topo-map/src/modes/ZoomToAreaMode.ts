import * as joint from '@joint/core';
import type { Point, Rect } from '../core/types';
import { rectFromPoints } from '../core/geometry';
import { DiagramService } from '../core/DiagramService';
import { ZoomManager } from '../managers/ZoomManager';
import { ViewportState } from '../core/ViewportState';
import { isPrimaryMouseButton } from '../core/events';
import type { InteractionMode } from './InteractionMode';

interface ZoomSelection {
  start: Point;
  end: Point;
}

export class ZoomToAreaMode implements InteractionMode {
  private readonly vector: typeof joint.V;

  private readonly diagramService: DiagramService;

  private readonly zoomManager: ZoomManager;

  private readonly viewportState: ViewportState;

  private readonly layer: ReturnType<typeof joint.V>;

  private readonly selectionRect: ReturnType<typeof joint.V>;

  private selection: ZoomSelection | null = null;

  private readonly minSelectionPx = 10;

  public constructor(diagramService: DiagramService, zoomManager: ZoomManager, viewportState: ViewportState) {
    this.vector = joint.V;
    this.diagramService = diagramService;
    this.zoomManager = zoomManager;
    this.viewportState = viewportState;

    this.layer = this.vector('g', { class: 'zoom-to-area' });
    this.selectionRect = this.vector('rect', {
      stroke: '#dc2626',
      'stroke-width': 1.5,
      'stroke-dasharray': '5,5',
      fill: 'rgba(220, 38, 38, 0.10)',
      'pointer-events': 'none',
      visibility: 'hidden'
    });

    this.layer.append(this.selectionRect);

    const paper = this.diagramService.getPaper();
    if (paper.svg) {
      this.layer.appendTo(paper.svg);
    }
  }

  public activate(): void {
    this.diagramService.setDrawGrid(false, 1);
    this.diagramService.setInteractive(false);
  }

  public deactivate(): void {
    this.selection = null;
    this.selectionRect.attr('visibility', 'hidden');
  }

  public onBlankPointerDown(event: joint.dia.Event, x: number, y: number): void {
    if (!isPrimaryMouseButton(event)) {
      return;
    }

    this.selection = {
      start: { x, y },
      end: { x, y }
    };

    this.renderSelectionRect({ x, y, width: 0, height: 0 });
  }

  public onBlankPointerMove(_event: joint.dia.Event, x: number, y: number): void {
    if (!this.selection) {
      return;
    }

    this.selection.end = { x, y };
    this.renderSelectionRect(rectFromPoints(this.selection.start, this.selection.end));
  }

  public onBlankPointerUp(_event: joint.dia.Event, _x: number, _y: number): void {
    if (!this.selection) {
      return;
    }

    const rect = rectFromPoints(this.selection.start, this.selection.end);
    const minSide = this.minSelectionPx / this.viewportState.getSnapshot().scale;

    this.selection = null;
    this.selectionRect.attr('visibility', 'hidden');

    if (rect.width < minSide || rect.height < minSide) {
      return;
    }

    this.zoomManager.zoomToRect(rect);
  }

  public onElementPointerDown(
    _elementView: joint.dia.ElementView,
    _event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    this.selection = null;
    this.selectionRect.attr('visibility', 'hidden');
  }

  public onElementPointerMove(
    _elementView: joint.dia.ElementView,
    _event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    return;
  }

  public onElementPointerUp(
    _elementView: joint.dia.ElementView,
    _event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    return;
  }

  private renderSelectionRect(localRect: Rect): void {
    const paperRect = this.diagramService.getPaper().localToPaperRect(localRect);
    this.selectionRect.attr({
      x: paperRect.x,
      y: paperRect.y,
      width: paperRect.width,
      height: paperRect.height,
      visibility: 'visible'
    });
  }
}
