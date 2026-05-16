import * as joint from '@joint/core';
import { CELL_HIGHLIGHT_EVENT, CELL_UNHIGHLIGHT_EVENT } from '../core/events/constants';
import { centerOfRect, containsPoint } from '../core/geometry';
import { MapBoundsState } from '../core/MapBoundsState';
import type { Point, Rect } from '../core/types';
import { ViewportState } from '../core/ViewportState';
import { cellNamespace } from '../shapes/cellNamespace';

const MINIMAP_ELEMENT_HIGHLIGHT_ID = 'topology-minimap-element-highlight';

interface MinimapRect {
  rect: Rect;
}

export class MinimapManager {
  private readonly mapBoundsState: MapBoundsState;

  private readonly container: HTMLElement;

  private readonly selectionEventTarget: HTMLElement;

  private readonly graph: joint.dia.Graph;

  private readonly paperHost: HTMLDivElement;

  private readonly paper: joint.dia.Paper;

  private readonly mainPaper: joint.dia.Paper;

  private readonly viewportState: ViewportState;

  private readonly unsubscribeViewport: () => void;

  private readonly unsubscribeMapBounds: () => void;

  private readonly viewportRectElement: HTMLDivElement;

  private readonly asyncRendering: boolean;

  private readonly padding: number;

  private highlightedCellId: string | null = null;

  private refreshRafId = 0;

  private dragging = false;

  private dragOffset: Point = { x: 0, y: 0 };

  private minimapViewportRect: MinimapRect = {
    rect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  };

  private readonly onPointerDownBound = (event: PointerEvent): void => {
    this.onPointerDown(event);
  };

  private readonly onPointerMoveBound = (event: PointerEvent): void => {
    this.onPointerMove(event);
  };

  private readonly onPointerUpBound = (): void => {
    this.dragging = false;
    this.viewportRectElement.style.cursor = 'grab';
  };

  private readonly onCellHighlightBound = (event: Event): void => {
    this.handleCellHighlight(event);
  };

  private readonly onCellUnhighlightBound = (): void => {
    this.clearSelectionHighlight();
  };

  private refreshDelayFrames = 0;

  public constructor(
    container: HTMLElement,
    selectionEventTarget: HTMLElement,
    graph: joint.dia.Graph,
    mainPaper: joint.dia.Paper,
    viewportState: ViewportState,
    mapBoundsState: MapBoundsState,
    asyncRendering: boolean,
    padding: number
  ) {
    this.container = container;
    this.selectionEventTarget = selectionEventTarget;
    this.graph = graph;
    this.mainPaper = mainPaper;
    this.viewportState = viewportState;
    this.mapBoundsState = mapBoundsState;
    this.asyncRendering = asyncRendering;
    this.padding = Number.isFinite(padding) && padding > 0 ? padding : 0;
    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    this.paperHost = this.createPaperHost(container, 'topology-minimap-paper-host');

    this.paper = new joint.dia.Paper({
      el: this.paperHost,
      model: graph,
      cellViewNamespace: cellNamespace,
      width: this.paperHost.clientWidth,
      height: this.paperHost.clientHeight,
      async: asyncRendering,
      frozen: asyncRendering,
      interactive: false,
      gridSize: 1,
      drawGrid: false,
      background: { color: '#ffffff' }
    });
    this.viewportRectElement = this.createViewportRectElement();
    this.container.append(this.viewportRectElement);

    if (this.asyncRendering) {
      this.paper.unfreeze();
    }

    this.unsubscribeViewport = this.viewportState.subscribe(() => {
      this.updateViewportRect();
    });
    this.unsubscribeMapBounds = this.mapBoundsState.subscribe(() => {
      this.scheduleGraphRefresh();
    });

    this.selectionEventTarget.addEventListener(CELL_HIGHLIGHT_EVENT, this.onCellHighlightBound);
    this.selectionEventTarget.addEventListener(CELL_UNHIGHLIGHT_EVENT, this.onCellUnhighlightBound);
    this.container.addEventListener('pointerdown', this.onPointerDownBound);
    window.addEventListener('pointermove', this.onPointerMoveBound);
    window.addEventListener('pointerup', this.onPointerUpBound);

    this.syncPaperTransform();
    this.updateViewportRect();
    this.syncSelectionHighlight();
  }

  public resize(width: number, height: number): void {
    this.paper.setDimensions(width, height);
    this.refresh();
  }

  public refresh(): void {
    this.syncPaperTransform();
    this.updateViewportRect();
    this.syncSelectionHighlight();
  }

  public destroy(): void {
    this.unsubscribeViewport();
    this.unsubscribeMapBounds();

    this.selectionEventTarget.removeEventListener(CELL_HIGHLIGHT_EVENT, this.onCellHighlightBound);
    this.selectionEventTarget.removeEventListener(CELL_UNHIGHLIGHT_EVENT, this.onCellUnhighlightBound);
    this.container.removeEventListener('pointerdown', this.onPointerDownBound);
    window.removeEventListener('pointermove', this.onPointerMoveBound);
    window.removeEventListener('pointerup', this.onPointerUpBound);
    if (this.refreshRafId !== 0) {
      window.cancelAnimationFrame(this.refreshRafId);
      this.refreshRafId = 0;
    }

    this.removeRenderedSelectionHighlight();
    this.viewportRectElement.remove();
    this.paper.remove();
  }

  private syncPaperTransform(): void {
    const contentArea = this.getMainContentRect();
    const options: joint.dia.Paper.TransformToFitContentOptions = {
      useModelGeometry: true,
      padding: this.padding,
      preserveAspectRatio: true
    };
    if (contentArea) {
      options.contentArea = contentArea;
    }

    this.paper.transformToFitContent(options);
  }

  private updateViewportRect(): void {
    const mainSnapshot = this.viewportState.getSnapshot();
    const mainWidth = this.mainPaper.el.clientWidth;
    const mainHeight = this.mainPaper.el.clientHeight;

    const mainRectLocal = this.clampViewportRectToContent({
      x: -mainSnapshot.tx / mainSnapshot.scale,
      y: -mainSnapshot.ty / mainSnapshot.scale,
      width: mainWidth / mainSnapshot.scale,
      height: mainHeight / mainSnapshot.scale
    });

    this.minimapViewportRect.rect = mainRectLocal;
    const minimapRect = this.clampRectToMinimapBounds(this.mainLocalRectToMinimapPaper(mainRectLocal));

    const style = this.viewportRectElement.style;
    style.left = `${minimapRect.x}px`;
    style.top = `${minimapRect.y}px`;
    style.width = `${Math.max(0, minimapRect.width)}px`;
    style.height = `${Math.max(0, minimapRect.height)}px`;
  }

  private onPointerDown(event: PointerEvent): void {
    const local = this.clientToLocalPoint(event.clientX, event.clientY);
    const currentRect = this.minimapViewportRect.rect;

    if (containsPoint(currentRect, local)) {
      this.dragging = true;
      this.viewportRectElement.style.cursor = 'grabbing';
      this.dragOffset = {
        x: local.x - currentRect.x,
        y: local.y - currentRect.y
      };
      return;
    }

    const targetRect = this.clampViewportRectToContent({
      x: local.x - currentRect.width / 2,
      y: local.y - currentRect.height / 2,
      width: currentRect.width,
      height: currentRect.height
    });
    this.centerMainViewportAt(centerOfRect(targetRect));
  }

  private onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    const local = this.clientToLocalPoint(event.clientX, event.clientY);
    const currentRect = this.minimapViewportRect.rect;
    const targetRect = this.clampViewportRectToContent({
      x: local.x - this.dragOffset.x,
      y: local.y - this.dragOffset.y,
      width: currentRect.width,
      height: currentRect.height
    });
    this.centerMainViewportAt(centerOfRect(targetRect));
  }

  private centerMainViewportAt(minimapPoint: Point): void {
    const snapshot = this.viewportState.getSnapshot();
    const width = this.mainPaper.el.clientWidth;
    const height = this.mainPaper.el.clientHeight;

    const tx = width / 2 - minimapPoint.x * snapshot.scale;
    const ty = height / 2 - minimapPoint.y * snapshot.scale;

    this.viewportState.setTranslate(tx, ty);
  }

  private handleCellHighlight(event: Event): void {
    const cellId = this.getCellIdFromEvent(event);
    if (!cellId) {
      return;
    }

    this.highlightedCellId = cellId;
    this.syncSelectionHighlight();
  }

  private mainLocalRectToMinimapPaper(mainRect: Rect): Rect {
    const paperRect = this.paper.localToPaperRect(mainRect);
    return {
      x: paperRect.x,
      y: paperRect.y,
      width: paperRect.width,
      height: paperRect.height
    };
  }

  private clampRectToMinimapBounds(rect: Rect): Rect {
    const bounds = this.getMinimapContentPaperRect();
    if (!bounds) {
      const computedSize = this.paper.getComputedSize();
      const maxWidth = Math.max(0, computedSize.width || this.container.clientWidth);
      const maxHeight = Math.max(0, computedSize.height || this.container.clientHeight);
      const width = Math.min(Math.max(0, rect.width), maxWidth);
      const height = Math.min(Math.max(0, rect.height), maxHeight);
      const left = Math.max(0, Math.min(maxWidth - width, rect.x));
      const top = Math.max(0, Math.min(maxHeight - height, rect.y));

      return {
        x: left,
        y: top,
        width,
        height
      };
    }

    const width = Math.min(Math.max(0, rect.width), bounds.width);
    const height = Math.min(Math.max(0, rect.height), bounds.height);
    const left = Math.max(bounds.x, Math.min(bounds.x + bounds.width - width, rect.x));
    const top = Math.max(bounds.y, Math.min(bounds.y + bounds.height - height, rect.y));

    return {
      x: left,
      y: top,
      width,
      height
    };
  }

  private clientToLocalPoint(clientX: number, clientY: number): Point {
    const {x, y} = this.paper.clientToLocalPoint({
      x: clientX,
      y: clientY
    });
    return { x, y };
  }

  private syncSelectionHighlight(): void {
    this.removeRenderedSelectionHighlight();

    if (!this.highlightedCellId) {
      return;
    }

    const cell = this.graph.getCell(this.highlightedCellId);
    if (!cell?.isElement()) {
      this.highlightedCellId = null;
      return;
    }

    const elementView = this.resolveElementView(cell);
    if (!elementView) {
      return;
    }

    joint.highlighters.mask.add(elementView, 'root', MINIMAP_ELEMENT_HIGHLIGHT_ID, {
      padding: 4,
      attrs: {
        stroke: '#f59e0b',
        strokeWidth: 1.5,
        fill: 'none',
        opacity: 0.95,
        pointerEvents: 'none'
      }
    });
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

  private clearSelectionHighlight(): void {
    this.highlightedCellId = null;
    this.removeRenderedSelectionHighlight();
  }

  private removeRenderedSelectionHighlight(): void {
    joint.highlighters.mask.removeAll(this.paper, MINIMAP_ELEMENT_HIGHLIGHT_ID);
  }

  private getCellIdFromEvent(event: Event): string | null {
    if (!(event instanceof CustomEvent)) {
      return null;
    }

    const detail = event.detail;
    if (typeof detail !== 'object' || detail === null || !('id' in detail)) {
      return null;
    }

    const { id } = detail as { id?: unknown };
    return typeof id === 'string' && id.length > 0 ? id : null;
  }

  private createPaperHost(container: HTMLElement, className: string): HTMLDivElement {
    const host = document.createElement('div');
    host.className = className;
    host.style.width = '100%';
    host.style.height = '100%';
    host.style.position = 'relative';
    container.append(host);
    return host;
  }

  private createViewportRectElement(): HTMLDivElement {
    const rect = document.createElement('div');
    rect.className = 'topology-minimap-viewport-rect';
    rect.style.position = 'absolute';
    rect.style.left = '0';
    rect.style.top = '0';
    rect.style.width = '0';
    rect.style.height = '0';
    rect.style.background = 'rgba(14, 165, 233, 0.14)';
    rect.style.border = '1px dashed #0284c7';
    rect.style.borderRadius = '2px';
    rect.style.cursor = 'grab';
    rect.style.zIndex = '2';
    rect.style.boxSizing = 'border-box';
    return rect;
  }

  private getMainContentRect(): Rect | null {
    return this.mapBoundsState.get();
  }

  /**
   * Transforms the main content rectangle to the minimap's local coordinate space.
   * 
   * @returns The minimap content rectangle in minimap coordinates, or null if no content
   */
  private getMinimapContentPaperRect(): Rect | null {
    const contentRect = this.getMainContentRect();
    if (!contentRect) {
      return null;
    }

    const paperRect = this.paper.localToPaperRect(contentRect);
    return {
      x: paperRect.x,
      y: paperRect.y,
      width: Math.max(0, paperRect.width),
      height: Math.max(0, paperRect.height)
    };
  }
  
  /**
   * Constrains the viewport rectangle within the bounds of the main content.
   * Prevents the viewport from panning outside content boundaries and ensures
   * the viewport size does not exceed the content size.
   * 
   * @param rect - The viewport rectangle to constrain
   * @returns The constrained viewport rectangle within content bounds
   */
  private clampViewportRectToContent(rect: Rect): Rect {
    const bounds = this.getMainContentRect();
    if (!bounds) {
      return rect;
    }

    const width = Math.min(Math.max(0, rect.width), bounds.width);
    const height = Math.min(Math.max(0, rect.height), bounds.height);
    const x = Math.max(bounds.x, Math.min(bounds.x + bounds.width - width, rect.x));
    const y = Math.max(bounds.y, Math.min(bounds.y + bounds.height - height, rect.y));

    return {
      x,
      y,
      width,
      height
    };
  }

  /**
   * Schedules a deferred graph refresh using requestAnimationFrame.
   * Ensures multiple refresh requests are batched into a single update.
   * Applies a one-frame delay before syncing transforms and updating the viewport.
   */
  private scheduleGraphRefresh(): void {
    this.refreshDelayFrames = 1;
    if (this.refreshRafId !== 0) {
      return;
    }

    const runRefresh = (): void => {
      this.refreshRafId = window.requestAnimationFrame(() => {
        this.refreshRafId = 0;
        if (this.refreshDelayFrames > 0) {
        this.refreshDelayFrames -= 1;
        runRefresh();
        return;
      }

        this.refresh();
      });
    };

    runRefresh();
  }
}
