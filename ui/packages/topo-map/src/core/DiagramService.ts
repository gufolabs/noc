import * as joint from '@joint/core';
import { cellNamespace } from '../shapes/cellNamespace';
import { ensureIconCenterAnchorRegistered } from '../shapes/linkEndpoints';
import { clamp } from './geometry';
import type { PaperConfig, Point, Rect, Size, TranslateBounds, ViewportSnapshot } from './types';
import { ViewportState } from './ViewportState';

const DEFAULT_BACKGROUND_COLOR = '#f8fafc';

export class DiagramService {
  private readonly container: HTMLElement;

  private readonly graph: joint.dia.Graph;

  private readonly paper: joint.dia.Paper;

  private readonly paperHost: HTMLDivElement;

  private readonly viewportState: ViewportState;

  private readonly asyncRendering: boolean;

  private boundsPadding: number;

  private mapBoundsProvider: (() => Rect | null) | null = null;

  private viewportPredicate: ((view: joint.mvc.View<joint.mvc.Model, SVGElement>) => boolean) | null = null;

  private readonly unsubscribeViewport: () => void;

  public constructor(
    container: HTMLElement,
    viewportState: ViewportState,
    gridSize: number,
    asyncRendering: boolean,
    boundsPadding: number
  ) {
    this.container = container;
    this.viewportState = viewportState;
    this.asyncRendering = asyncRendering;
    this.boundsPadding = this.normalizePadding(boundsPadding);
    this.graph = new joint.dia.Graph({}, { cellNamespace });
    ensureIconCenterAnchorRegistered();
    const paperHost = this.createPaperHost(container, 'topology-main-paper-host');
    this.paperHost = paperHost;

    this.paper = new joint.dia.Paper({
      el: paperHost,
      model: this.graph,
      cellViewNamespace: cellNamespace,
      width: paperHost.clientWidth,
      height: paperHost.clientHeight,
      async: asyncRendering,
      frozen: asyncRendering,
      gridSize,
      drawGrid: false,
      background: { color: DEFAULT_BACKGROUND_COLOR },
      interactive: false,
      restrictTranslate: true,
      viewport: (view) => {
        if (this.viewportPredicate) {
          return this.viewportPredicate(view);
        }
        return true;
      },
      // restrictTranslate: (elementView) => {
      //   const element = elementView.model;
      //   const iconAttrs = element.attr('icon') || {};
      //   const iconWidth = Number(iconAttrs.width) || 64;
      //   const iconHeight = Number(iconAttrs.height) || 64;

      //   // Calculate label height (label is below icon)
      //   // Label uses fontSize 12, can be multi-line
      //   // const titleText = element.attr('title/text') || '';
      //   // const lineCount = titleText ? titleText.split('\n').length : 1;
      //   // const labelHeight = lineCount * 12 + 4; // fontSize * lines + padding

      //   const elWidth = iconWidth;
      //   // const elHeight = iconHeight + labelHeight;
      //   const elHeight = iconHeight;

      //   // Get current viewport bounds in world coordinates
      //   // This is called dynamically, so it updates as viewport changes
      //   if (this.viewportState) {
      //     const bounds = this.viewportState.getState().bounds;
      //     // Add padding to prevent element from touching screen edge
      //     const padding = 5;
      //     return {
      //       x: bounds.x + padding,
      //       y: bounds.y + padding,
      //       width: bounds.width - elWidth - padding * 2,
      //       height: bounds.height + elHeight + padding * 2,
      //     };
      //   }

      //   // Fallback to paper bounds if viewport not initialized yet
      //   return {
      //     x: 0,
      //     y: 0,
      //     width: this.paperConfig.width - elWidth,
      //     height: this.paperConfig.height + elHeight,
      //   };
      // },
    });

    this.unsubscribeViewport = viewportState.subscribe((snapshot) => {
      this.applyViewport(snapshot);
    });

    if (this.asyncRendering) {
      this.paper.unfreeze();
    }
  }

  public getGraph(): joint.dia.Graph {
    return this.graph;
  }

  public getPaper(): joint.dia.Paper {
    return this.paper;
  }

  public getPaperHost(): HTMLDivElement {
    return this.paperHost;
  }

  public setViewportPredicate(predicate: ((view: joint.mvc.View<joint.mvc.Model, SVGElement>) => boolean) | null): void {
    this.viewportPredicate = predicate;
    this.refreshVisibility();
  }

  public setDrawGrid(enabled: boolean, size: number): void {
    this.paper.setGridSize(size);
    if (enabled) {
      this.paper.setGrid({ name: 'dot', args: { color: '#94a3b8', thickness: 1 } });
      return;
    }
    this.paper.setGrid(false);
  }

  public setInteractive(interactive: joint.dia.Paper.Options['interactive']): void {
    this.paper.setInteractivity(interactive);
  }

  public setMapBoundsProvider(provider: (() => Rect | null) | null): void {
    this.mapBoundsProvider = provider;
  }

  public applyPaperConfig(config: PaperConfig): void {
    const background: joint.dia.Paper.BackgroundOptions = {
      color: DEFAULT_BACKGROUND_COLOR
    };

    if (typeof config.backgroundImage === 'string' && config.backgroundImage.length > 0) {
      background.image = config.backgroundImage;
      background.opacity = clamp(config.backgroundOpacity ?? 1, 0, 1);
      background.repeat = 'no-repeat';

      const hasSize =
        Number.isFinite(config.width) &&
        Number.isFinite(config.height) &&
        (config.width ?? 0) > 0 &&
        (config.height ?? 0) > 0;
      if (hasSize) {
        background.position = { x: 0, y: 0 };
        background.size = {
          width: config.width as number,
          height: config.height as number
        };
      }
    }

    this.paper.drawBackground(background);
  }

  public resize(width: number, height: number): void {
    this.paper.setDimensions(width, height);
    this.refreshVisibility();
  }

  public getSize(): Size {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
  }

  public toJSON(): joint.dia.Graph.JSON {
    return this.graph.toJSON();
  }

  public fromJSON(data: joint.dia.Graph.JSON): void {
    this.graph.fromJSON(data, { cellNamespace });
    this.refreshVisibility();
  }

  public fitRect(rect: Rect, minScale: number, maxScale: number, padding = 24): void {
    const { width, height } = this.getSize();
    const targetWidth = Math.max(rect.width, 1);
    const targetHeight = Math.max(rect.height, 1);
    const scaleX = (width - padding * 2) / targetWidth;
    const scaleY = (height - padding * 2) / targetHeight;
    const scale = Math.min(maxScale, Math.max(minScale, Math.min(scaleX, scaleY)));
    const tx = width / 2 - (rect.x + rect.width / 2) * scale;
    const ty = height / 2 - (rect.y + rect.height / 2) * scale;
    this.applyViewport({ scale, tx, ty });
  }

  public clientToLocal(clientX: number, clientY: number): joint.g.Point {
    return this.paper.clientToLocalPoint({ x: clientX, y: clientY });
  }

  public getVisibleLocalRect(snapshot: ViewportSnapshot): Rect {
    const size = this.getSize();
    return {
      x: -snapshot.tx / snapshot.scale,
      y: -snapshot.ty / snapshot.scale,
      width: size.width / snapshot.scale,
      height: size.height / snapshot.scale
    };
  }

  public clampElementPositionToVisibleArea(element: joint.dia.Element, position: Point): Point {
    const snapshot = this.viewportState.getSnapshot();
    const area = this.getVisibleLocalRect(snapshot);
    const size = element.size();
    const paddingLocal = snapshot.scale > 0 ? this.boundsPadding / snapshot.scale : this.boundsPadding;

    const minX = area.x + paddingLocal;
    const minY = area.y + paddingLocal;
    const maxX = area.x + area.width - size.width - paddingLocal;
    const maxY = area.y + area.height - size.height - paddingLocal;

    return {
      x: clamp(position.x, minX, Math.max(minX, maxX)),
      y: clamp(position.y, minY, Math.max(minY, maxY))
    };
  }

  public getTranslateBounds(scale: number): TranslateBounds {
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    const paddingViewport = this.boundsPadding;
    const size = this.getSize();
    if (size.width <= 1 || size.height <= 1 || this.graph.getCells().length === 0) {
      return { minTx: 0, maxTx: 0, minTy: 0, maxTy: 0 };
    }

    const contentRect = this.getPanContentRect();
    if (!contentRect) {
      return { minTx: 0, maxTx: 0, minTy: 0, maxTy: 0 };
    }
    const minX = contentRect.x * safeScale;
    const minY = contentRect.y * safeScale;
    const contentWidth = Math.max(0, contentRect.width * safeScale);
    const contentHeight = Math.max(0, contentRect.height * safeScale);

    let minTx = size.width - (minX + contentWidth) - paddingViewport;
    let maxTx = -minX + paddingViewport;
    if (contentWidth <= size.width) {
      const centeredTx = (size.width - contentWidth) / 2 - minX;
      minTx = centeredTx;
      maxTx = centeredTx;
    }

    let minTy = size.height - (minY + contentHeight) - paddingViewport;
    let maxTy = -minY + paddingViewport;
    if (contentHeight <= size.height) {
      const centeredTy = (size.height - contentHeight) / 2 - minY;
      minTy = centeredTy;
      maxTy = centeredTy;
    }

    return { minTx, maxTx, minTy, maxTy };
  }

  public destroy(): void {
    this.unsubscribeViewport();
    this.paper.remove();
    this.graph.clear();
  }

  private applyViewport(snapshot: ViewportSnapshot): void {
    this.paper.scale(snapshot.scale, snapshot.scale);
    this.paper.translate(snapshot.tx, snapshot.ty);
    this.refreshVisibility();
  }

  private normalizePadding(value: number): number {
    if (!Number.isFinite(value) || value < 0) {
      return 0;
    }
    return value;
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

  private refreshVisibility(): void {
    if (this.asyncRendering) {
      this.paper.unfreeze();
      return;
    }

    if (this.viewportPredicate) {
      this.paper.updateCellsVisibility();
    }
  }

  private getPanContentRect(): Rect | null {
    if (this.mapBoundsProvider) {
      return this.mapBoundsProvider();
    }
    return null;
  }
}
