import type { WorkflowPoint } from '../types';
import type { WorkflowEditorRuntime } from './runtime';

export function resize(runtime: WorkflowEditorRuntime): void {
  const width = runtime.config.mainContainer.clientWidth || 800;
  const height = runtime.config.mainContainer.clientHeight || 600;
  runtime.paper.setDimensions(width, height);
  applyViewport(runtime);
}

export function getPaperSize(runtime: WorkflowEditorRuntime): { width: number; height: number } {
  return {
    width: runtime.config.mainContainer.clientWidth || 800,
    height: runtime.config.mainContainer.clientHeight || 600
  };
}

export function applyViewport(runtime: WorkflowEditorRuntime): void {
  runtime.paper.scale(runtime.state.scale, runtime.state.scale);
  runtime.paper.translate(runtime.state.tx, runtime.state.ty);
}

export function setZoom(runtime: WorkflowEditorRuntime, nextScale: number, focus?: WorkflowPoint): void {
  const clampedScale = Math.min(runtime.config.maxScale, Math.max(runtime.config.minScale, nextScale));
  if (Math.abs(clampedScale - runtime.state.scale) < 0.0001) {
    return;
  }

  const size = getPaperSize(runtime);
  const focusX = focus?.x ?? size.width / 2;
  const focusY = focus?.y ?? size.height / 2;
  const localX = (focusX - runtime.state.tx) / runtime.state.scale;
  const localY = (focusY - runtime.state.ty) / runtime.state.scale;

  runtime.state.scale = clampedScale;
  runtime.state.tx = focusX - localX * runtime.state.scale;
  runtime.state.ty = focusY - localY * runtime.state.scale;
  applyViewport(runtime);
}

export function zoomIn(runtime: WorkflowEditorRuntime): void {
  setZoom(runtime, runtime.state.scale * 1.15);
}

export function zoomOut(runtime: WorkflowEditorRuntime): void {
  setZoom(runtime, runtime.state.scale / 1.15);
}

export function fitToContent(runtime: WorkflowEditorRuntime, padding = 48): void {
  const cells = runtime.graph.getCells();
  if (cells.length === 0) {
    runtime.state.scale = runtime.config.initialScale;
    runtime.state.tx = 0;
    runtime.state.ty = 0;
    applyViewport(runtime);
    return;
  }

  const bbox = runtime.graph.getBBox();
  if (!bbox) {
    return;
  }
  const size = getPaperSize(runtime);
  const targetWidth = Math.max(bbox.width, 1);
  const targetHeight = Math.max(bbox.height, 1);
  const scaleX = (size.width - padding * 2) / targetWidth;
  const scaleY = (size.height - padding * 2) / targetHeight;
  runtime.state.scale = Math.min(
    runtime.config.maxScale,
    Math.max(runtime.config.minScale, Math.min(scaleX, scaleY))
  );
  runtime.state.tx = size.width / 2 - (bbox.x + bbox.width / 2) * runtime.state.scale;
  runtime.state.ty = size.height / 2 - (bbox.y + bbox.height / 2) * runtime.state.scale;
  applyViewport(runtime);
}

export function clientToLocalPoint(runtime: WorkflowEditorRuntime, clientX: number, clientY: number): WorkflowPoint {
  const local = runtime.paper.clientToLocalPoint({ x: clientX, y: clientY });
  return {
    x: local.x,
    y: local.y
  };
}
