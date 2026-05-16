import * as joint from '@joint/core';
import type { Rect, ViewportStateSnapshot } from './types';

export type FitMode = 'page' | 'width' | 'height';

type ContentArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function normalizeRect(rect: ContentArea | null): Rect | null {
  if (!rect) {
    return null;
  }
  if (
    !Number.isFinite(rect.x) ||
    !Number.isFinite(rect.y) ||
    !Number.isFinite(rect.width) ||
    !Number.isFinite(rect.height) ||
    rect.width <= 0 ||
    rect.height <= 0
  ) {
    return null;
  }
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  };
}

export function fitPaperToContent(
  paper: joint.dia.Paper,
  contentArea: Rect | null,
  size: { width: number; height: number },
  snapshot: ViewportStateSnapshot,
  mode: FitMode,
  padding: number
): { scale: number; tx: number; ty: number } | null {
  const safePadding = Number.isFinite(padding) ? Math.max(0, padding) : 0;
  const fittingBoxWidth = Math.max(1, size.width);
  const fittingBoxHeight = Math.max(1, size.height);
  const normalizedContentArea = normalizeRect(contentArea);
  if (
    !normalizedContentArea ||
    normalizedContentArea.width <= 0 ||
    normalizedContentArea.height <= 0 ||
    !paper.transformToFitContent
  ) {
    return null;
  }

  let fittingWidth = fittingBoxWidth;
  let fittingHeight = fittingBoxHeight;

  if (mode === 'width') {
    const targetScale = Math.min(
      snapshot.maxScale,
      Math.max(snapshot.minScale, fittingBoxWidth / normalizedContentArea.width)
    );
    fittingHeight = Math.max(fittingBoxHeight, normalizedContentArea.height * targetScale);
  } else if (mode === 'height') {
    const targetScale = Math.min(
      snapshot.maxScale,
      Math.max(snapshot.minScale, fittingBoxHeight / normalizedContentArea.height)
    );
    fittingWidth = Math.max(fittingBoxWidth, normalizedContentArea.width * targetScale);
  }

  paper.transformToFitContent({
    contentArea: normalizedContentArea,
    padding: safePadding,
    preserveAspectRatio: true,
    minScale: snapshot.minScale,
    maxScale: snapshot.maxScale,
    horizontalAlign: 'middle',
    verticalAlign: 'middle',
    fittingBBox: {
      x: 0,
      y: 0,
      width: fittingWidth,
      height: fittingHeight
    }
  });

  const matrix = paper.matrix();
  return {
    scale: matrix.a,
    tx: matrix.e,
    ty: matrix.f
  };
}
