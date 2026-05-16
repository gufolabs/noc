import * as joint from '@joint/core';
import type { Config } from '../types';
import {
  BLANK_CONTEXTMENU_EVENT,
  BLANK_POINTERDOWN_EVENT,
  CELL_CONTEXTMENU_EVENT,
  CELL_HIGHLIGHT_EVENT,
  CELL_POINTERCLICK_EVENT,
  CELL_UNHIGHLIGHT_EVENT,
  ELEMENT_POINTERDBLCLICK_EVENT,
  LINK_HOVER_EVENT,
  LINK_MOUSEOUT_EVENT
} from './constants';
import { getEventClientPoint, isPrimaryMouseButton } from './pointer';

const LINK_HOVER_STROKE = '#3498db';
const LINK_HOVER_STROKE_WIDTH = 3;
const LINK_HOVER_OPACITY = 0.6;
const LINK_HOVER_HIGHLIGHT_ID = 'topo:link-hover-highlight';
const ELEMENT_HIGHLIGHT_ID = 'topo:element-highlight';
const CELL_POINTERCLICK_DELAY_MS = 250;

export class InteractionEvents {
  private readonly mainContainer: Config['mainContainer'];

  private readonly paper: joint.dia.Paper;

  private highlightedElementView: joint.dia.ElementView | null = null;

  private pendingCellPointerClickTimer: ReturnType<typeof globalThis.setTimeout> | null = null;

  private readonly pendingContextMenuTimers = new Set<number>();

  private readonly onLinkMouseEnterBound = (linkView: joint.dia.LinkView, event: joint.dia.Event): void => {
    this.applyLinkHoverStyle(linkView);
    this.emitBubbledEvent(LINK_HOVER_EVENT, this.getLinkHoverEventDetail(linkView, event));
  };

  private readonly onLinkMouseLeaveBound = (linkView: joint.dia.LinkView, event: joint.dia.Event): void => {
    this.restoreLinkHoverStyle(linkView);
    this.emitBubbledEvent(LINK_MOUSEOUT_EVENT, this.getPointerCoordinateDetail(event));
  };

  private readonly onCellPointerClickBound = (
    cellView: joint.dia.CellView,
    event: joint.dia.Event,
    x: number,
    y: number
  ): void => {
    this.handleCellPointerClick(cellView, event, x, y);
  };

  private readonly onElementPointerDblClickBound = (
    cellView: joint.dia.CellView,
    event: joint.dia.Event,
    x: number,
    y: number
  ): void => {
    this.handleElementPointerDblClick(cellView, event, x, y);
  };

  private readonly onBlankPointerDownBound = (event: joint.dia.Event, x: number, y: number): void => {
    this.handleBlankPointerDown(event, x, y);
  };

  private readonly onCellContextMenuBound = (
    cellView: joint.dia.CellView,
    event: joint.dia.Event,
    x: number,
    y: number
  ): void => {
    this.handleCellContextMenu(cellView, event, x, y);
  };

  private readonly onBlankContextMenuBound = (event: joint.dia.Event, x: number, y: number): void => {
    this.handleBlankContextMenu(event, x, y);
  };

  public constructor(mainContainer: Config['mainContainer'], paper: joint.dia.Paper) {
    this.mainContainer = mainContainer;
    this.paper = paper;
  }

  public setup(): void {
    this.paper.on('link:mouseenter', this.onLinkMouseEnterBound);
    this.paper.on('link:mouseleave', this.onLinkMouseLeaveBound);

    this.paper.on('element:pointerdblclick', this.onElementPointerDblClickBound);

    this.paper.on('cell:pointerclick', this.onCellPointerClickBound);
    this.paper.on('cell:contextmenu', this.onCellContextMenuBound);

    this.paper.on('blank:pointerdown', this.onBlankPointerDownBound);
    this.paper.on('blank:contextmenu', this.onBlankContextMenuBound);
  }

  public teardown(): void {
    this.paper.off('link:mouseenter', this.onLinkMouseEnterBound);
    this.paper.off('link:mouseleave', this.onLinkMouseLeaveBound);

    this.paper.off('element:pointerdblclick', this.onElementPointerDblClickBound);

    this.paper.off('cell:pointerclick', this.onCellPointerClickBound);
    this.paper.off('cell:contextmenu', this.onCellContextMenuBound);

    this.paper.off('blank:pointerdown', this.onBlankPointerDownBound);
    this.paper.off('blank:contextmenu', this.onBlankContextMenuBound);
    this.cancelPendingCellPointerClick();
    this.clearPendingContextMenuTimers();
  }

  public clearInteractionState(): void {
    this.cancelPendingCellPointerClick();
    this.clearElementHighlight();
    this.clearLinkHoverStyles();
  }

  public clearHighlightedElement(): void {
    this.clearElementHighlight();
  }

  public highlightElementById(cellId: joint.dia.Cell.ID): boolean {
    const cell = this.paper.model.getCell(cellId);
    if (!cell?.isElement()) {
      return false;
    }

    const elementView = this.resolveElementView(cell);
    if (!elementView) {
      return false;
    }

    this.highlightElement(elementView);
    return true;
  }

  private applyLinkHoverStyle(linkView: joint.dia.LinkView): void {
    joint.highlighters.mask.add(linkView, 'line', LINK_HOVER_HIGHLIGHT_ID, {
      padding: 1,
      attrs: {
        stroke: LINK_HOVER_STROKE,
        strokeWidth: LINK_HOVER_STROKE_WIDTH,
        opacity: LINK_HOVER_OPACITY
      }
    });
    this.paper.el.style.cursor = 'pointer';
  }

  private restoreLinkHoverStyle(linkView: joint.dia.LinkView): void {
    joint.highlighters.mask.remove(linkView, LINK_HOVER_HIGHLIGHT_ID);
    this.paper.el.style.cursor = 'grab';
  }

  private handleCellPointerClick(cellView: joint.dia.CellView, event: joint.dia.Event, x: number, y: number): void {
    if (!isPrimaryMouseButton(event)) {
      return;
    }

    this.scheduleCellPointerClick(cellView, x, y);
  }

  private handleElementPointerDblClick(cellView: joint.dia.CellView, event: joint.dia.Event, x: number, y: number): void {
    if (!isPrimaryMouseButton(event)) {
      return;
    }

    this.cancelPendingCellPointerClick();
    this.emitBubbledEvent(ELEMENT_POINTERDBLCLICK_EVENT, {
      ...this.getCellEventDetail(cellView),
      x,
      y
    });
  }

  private handleBlankPointerDown(event: joint.dia.Event, x: number, y: number): void {
    if (!isPrimaryMouseButton(event)) {
      return;
    }

    this.cancelPendingCellPointerClick();
    this.clearElementHighlight();
    this.emitBubbledEvent(BLANK_POINTERDOWN_EVENT, { x, y });
  }

  private scheduleCellPointerClick(cellView: joint.dia.CellView, x: number, y: number): void {
    this.cancelPendingCellPointerClick();
    const detail = {
      ...this.getCellEventDetail(cellView),
      x,
      y
    };

    this.pendingCellPointerClickTimer = globalThis.setTimeout(() => {
      this.pendingCellPointerClickTimer = null;
      this.updateElementHighlight(cellView);
      this.emitBubbledEvent(CELL_POINTERCLICK_EVENT, detail);
    }, CELL_POINTERCLICK_DELAY_MS);
  }

  private handleCellContextMenu(
    cellView: joint.dia.CellView,
    event: joint.dia.Event,
    _x: number,
    _y: number
  ): void {
    this.preventDefaultEvent(event);
    const clientPoint = getEventClientPoint(event);
    this.emitBubbledContextMenuEvent(CELL_CONTEXTMENU_EVENT, {
      ...this.getCellEventDetail(cellView),
      clientX: clientPoint?.x ?? 0,
      clientY: clientPoint?.y ?? 0
    });
  }

  private handleBlankContextMenu(event: joint.dia.Event, _x: number, _y: number): void {
    this.preventDefaultEvent(event);
    const clientPoint = getEventClientPoint(event);
    this.emitBubbledContextMenuEvent(BLANK_CONTEXTMENU_EVENT, {
      clientX: clientPoint?.x ?? 0,
      clientY: clientPoint?.y ?? 0
    });
  }

  private updateElementHighlight(cellView: joint.dia.CellView): void {
    if (!cellView.model.isElement()) {
      this.clearElementHighlight();
      this.emitBubbledEvent(CELL_HIGHLIGHT_EVENT, this.getCellEventDetail(cellView));
      return;
    }

    const elementView = cellView as joint.dia.ElementView;
    if (this.isHighlightedElement(elementView)) {
      this.clearElementHighlight();
      return;
    }

    this.highlightElement(elementView);
  }

  private highlightElement(elementView: joint.dia.ElementView): void {
    if (this.highlightedElementView && this.highlightedElementView !== elementView) {
      this.emitBubbledEvent(CELL_UNHIGHLIGHT_EVENT, this.getCellEventDetail(this.highlightedElementView));
      joint.highlighters.mask.remove(this.highlightedElementView, ELEMENT_HIGHLIGHT_ID);
    }

    joint.highlighters.mask.add(elementView, 'root', ELEMENT_HIGHLIGHT_ID, {
      padding: 8,
      attrs: {
        stroke: '#f59e0b',
        strokeWidth: 2,
        fill: 'none',
        pointerEvents: 'none'
      }
    });
    this.highlightedElementView = elementView;
    this.emitBubbledEvent(CELL_HIGHLIGHT_EVENT, this.getCellEventDetail(elementView));
  }

  private clearElementHighlight(): void {
    if (!this.highlightedElementView) {
      return;
    }
    this.emitBubbledEvent(CELL_UNHIGHLIGHT_EVENT, this.getCellEventDetail(this.highlightedElementView));
    joint.highlighters.mask.remove(this.highlightedElementView, ELEMENT_HIGHLIGHT_ID);
    this.highlightedElementView = null;
  }

  private clearLinkHoverStyles(): void {
    joint.highlighters.mask.removeAll(this.paper, LINK_HOVER_HIGHLIGHT_ID);
  }

  private resolveElementView(element: joint.dia.Element): joint.dia.ElementView | null {
    const existingView = this.paper.findViewByModel<joint.dia.ElementView>(element);
    if (existingView) {
      return existingView;
    }

    try {
      return this.paper.requireView<joint.dia.ElementView>(element);
    } catch {
      return null;
    }
  }

  private getCellEventDetail(cellView: joint.dia.CellView): Record<string, unknown> {
    const model = cellView.model;
    return {
      id: String(model.id),
      data: model.get('data') || {}
    };
  }

  private getLinkHoverEventDetail(linkView: joint.dia.LinkView, event: joint.dia.Event): Record<string, unknown> {
    const data = linkView.model.get('data');

    return {
      ...(data && typeof data === 'object' ? (data as Record<string, unknown>) : {}),
      ...this.getPointerCoordinateDetail(event)
    };
  }

  private getPointerCoordinateDetail(event: joint.dia.Event): Record<string, unknown> {
    const clientPoint = getEventClientPoint(event);

    return {
      position: [clientPoint?.x ?? 0, clientPoint?.y ?? 0]
    };
  }

  private isHighlightedElement(elementView: joint.dia.ElementView): boolean {
    return this.highlightedElementView?.model.id === elementView.model.id;
  }

  private preventDefaultEvent(event: joint.dia.Event): void {
    if ('preventDefault' in event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  }

  private emitBubbledContextMenuEvent(eventName: string, detail: Record<string, unknown>): void {
    const timerId = window.setTimeout(() => {
      this.pendingContextMenuTimers.delete(timerId);
      this.emitBubbledEvent(eventName, detail);
    }, 0);

    this.pendingContextMenuTimers.add(timerId);
  }

  private clearPendingContextMenuTimers(): void {
    this.pendingContextMenuTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    this.pendingContextMenuTimers.clear();
  }

  private cancelPendingCellPointerClick(): void {
    if (this.pendingCellPointerClickTimer === null) {
      return;
    }
    globalThis.clearTimeout(this.pendingCellPointerClickTimer);
    this.pendingCellPointerClickTimer = null;
  }

  private emitBubbledEvent(eventName: string, detail: Record<string, unknown>): void {
    this.mainContainer.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail
      })
    );
  }
}
