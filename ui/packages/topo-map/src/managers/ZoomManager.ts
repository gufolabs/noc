import type { Rect } from '../core/types';
import { ViewportState } from '../core/ViewportState';
import { clamp } from '../core/geometry';
import { DiagramService } from '../core/DiagramService';

export class ZoomManager {
  private readonly viewportState: ViewportState;

  private readonly diagramService: DiagramService;

  private readonly zoomStep: number;

  private readonly resetScale: number;

  private readonly wheelHandler = (event: WheelEvent): void => {
    this.handleWheel(event);
  };

  public constructor(
    viewportState: ViewportState,
    diagramService: DiagramService,
    zoomStep = 1.15,
    resetScale = 1
  ) {
    this.viewportState = viewportState;
    this.diagramService = diagramService;
    this.zoomStep = zoomStep;
    this.resetScale = resetScale;

    this.diagramService.getPaper().el.addEventListener('wheel', this.wheelHandler, { passive: false });
  }

  public zoomIn(): void {
    const paperRect = this.diagramService.getPaper().el.getBoundingClientRect();
    this.zoomByFactor(this.zoomStep, paperRect.width / 2, paperRect.height / 2);
  }

  public zoomOut(): void {
    const paperRect = this.diagramService.getPaper().el.getBoundingClientRect();
    this.zoomByFactor(1 / this.zoomStep, paperRect.width / 2, paperRect.height / 2);
  }

  public reset(): void {
    this.viewportState.setViewport(this.resetScale, 0, 0);
  }

  public getScale(): number {
    return this.viewportState.getSnapshot().scale;
  }

  public zoomToRect(rect: Rect, padding = 24): void {
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const snapshot = this.viewportState.getSnapshot();
    const size = this.diagramService.getSize();
    const scaleX = (size.width - padding * 2) / rect.width;
    const scaleY = (size.height - padding * 2) / rect.height;
    const nextScale = clamp(Math.min(scaleX, scaleY), snapshot.minScale, snapshot.maxScale);
    const tx = size.width / 2 - (rect.x + rect.width / 2) * nextScale;
    const ty = size.height / 2 - (rect.y + rect.height / 2) * nextScale;

    this.viewportState.setViewport(nextScale, tx, ty);
  }

  public destroy(): void {
    this.diagramService.getPaper().el.removeEventListener('wheel', this.wheelHandler);
  }

  private handleWheel(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const normalizedDelta = this.normalizeWheelDelta(event);
    if (normalizedDelta === 0) {
      return;
    }

    const factor = this.zoomStep ** normalizedDelta;
    this.zoomByClientPoint(factor, event.clientX, event.clientY);
  }

  private normalizeWheelDelta(event: WheelEvent): number {
    const pixelDelta = this.toPixelDelta(event);
    if (pixelDelta === 0) {
      return 0;
    }

    const sign = Math.sign(pixelDelta);
    const magnitude = Math.abs(pixelDelta);

    if (this.isTrackpadWheelEvent(event, pixelDelta)) {
      return sign * Math.min(Math.log1p(magnitude) / Math.log(2), 1.5);
    }

    return sign * Math.min(Math.max(Math.round(magnitude / 40), 1), 3);
  }

  private toPixelDelta(event: WheelEvent): number {
    const rawDelta =
      event.deltaMode === WheelEvent.DOM_DELTA_PIXEL
        ? -event.deltaY
        : event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? -event.deltaY * 16
          : -event.deltaY * window.innerHeight;

    return rawDelta / Math.max(window.devicePixelRatio || 1, 1);
  }

  private isTrackpadWheelEvent(event: WheelEvent, pixelDelta: number): boolean {
    return (
      event.deltaMode === WheelEvent.DOM_DELTA_PIXEL &&
      (Math.abs(pixelDelta) < 12 || !Number.isInteger(event.deltaY) || Math.abs(event.deltaX) > 0)
    );
  }

  private zoomByFactor(factor: number, centerX: number, centerY: number): void {
    const snapshot = this.viewportState.getSnapshot();
    const nextScale = clamp(snapshot.scale * factor, snapshot.minScale, snapshot.maxScale);
    if (nextScale === snapshot.scale) {
      return;
    }

    const localX = (centerX - snapshot.tx) / snapshot.scale;
    const localY = (centerY - snapshot.ty) / snapshot.scale;
    const nextTx = centerX - localX * nextScale;
    const nextTy = centerY - localY * nextScale;

    this.viewportState.setViewport(nextScale, nextTx, nextTy);
  }

  private zoomByClientPoint(factor: number, clientX: number, clientY: number): void {
    const snapshot = this.viewportState.getSnapshot();
    const nextScale = clamp(snapshot.scale * factor, snapshot.minScale, snapshot.maxScale);
    if (nextScale === snapshot.scale) {
      return;
    }

    const paper = this.diagramService.getPaper();
    const paperRect = paper.el.getBoundingClientRect();
    const pointInPaperX = clientX - paperRect.left;
    const pointInPaperY = clientY - paperRect.top;
    const localPoint = paper.clientToLocalPoint({ x: clientX, y: clientY });
    const nextTx = pointInPaperX - localPoint.x * nextScale;
    const nextTy = pointInPaperY - localPoint.y * nextScale;

    this.viewportState.setViewport(nextScale, nextTx, nextTy);
  }
}
