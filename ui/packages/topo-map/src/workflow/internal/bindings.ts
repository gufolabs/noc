import * as joint from '@joint/core';
import type { WorkflowEditorRuntime } from './runtime';
import { isOutPortGroup, isPrimaryMouseButton, resolveClientPoint, resolvePortGroup } from './helpers';

export function resolveInteractivity(
  runtime: WorkflowEditorRuntime,
  cellView: joint.dia.CellView,
  _eventName: string
): Record<string, unknown> | boolean {
  if (runtime.state.mode === 'pan') {
    return false;
  }

  if (cellView.model.isElement()) {
    return {
      elementMove: true,
      addLinkFromMagnet: true,
      linkMove: false,
      labelMove: false,
      stopDelegation: false
    };
  }

  return {
    linkMove: false,
    labelMove: false,
    vertexMove: true,
    vertexAdd: true,
    vertexRemove: true,
    arrowheadMove: true
  };
}

export function bindEvents(runtime: WorkflowEditorRuntime): void {
  runtime.paper.on('cell:pointerclick', (cellView, event) => {
    if (!isPrimaryMouseButton(event)) {
      return;
    }
    runtime.selectCell(String(cellView.model.id));
  });

  runtime.paper.on('element:magnet:pointerdown', (elementView, event, magnetNode) => {
    if (!isPrimaryMouseButton(event) || runtime.state.mode !== 'edit') {
      return;
    }
    if (!isOutPortGroup(resolvePortGroup(magnetNode))) {
      return;
    }
    runtime.history.beginGesture('link-change');
    runtime.state.activeDragElementId = null;
    runtime.state.activeVertexDrag = null;
    runtime.clearGuides();
    runtime.selectCell(String(elementView.model.id));
    runtime.beginLinkCreation();
  });

  runtime.paper.on('element:pointerdown', (elementView, event) => {
    if (!isPrimaryMouseButton(event) || runtime.state.mode !== 'edit') {
      return;
    }
    runtime.history.beginGesture('state-move');
    runtime.state.activeVertexDrag = null;
    runtime.state.activeDragElementId = String(elementView.model.id);
  });

  runtime.paper.on('link:pointerdown', (_linkView, event) => {
    if (!isPrimaryMouseButton(event) || runtime.state.mode !== 'edit') {
      return;
    }
    runtime.history.beginGesture('link-change');
    runtime.state.activeDragElementId = null;
  });

  runtime.paper.on('blank:pointerclick', () => {
    runtime.selectCell(null);
  });

  runtime.paper.on('blank:pointerdown', (event) => {
    if (!isPrimaryMouseButton(event)) {
      return;
    }
    runtime.state.activeDragElementId = null;
    runtime.state.activeVertexDrag = null;
    runtime.clearGuides();
    const clientPoint = resolveClientPoint(event);
    if (!clientPoint) {
      return;
    }
    runtime.state.panState = {
      clientX: clientPoint.x,
      clientY: clientPoint.y,
      tx: runtime.state.tx,
      ty: runtime.state.ty
    };
    runtime.paperHost.style.cursor = 'grabbing';
  });

  runtime.paper.on('blank:pointermove', (event) => {
    if (!runtime.state.panState) {
      return;
    }
    const clientPoint = resolveClientPoint(event);
    if (!clientPoint) {
      return;
    }
    runtime.state.tx = runtime.state.panState.tx + clientPoint.x - runtime.state.panState.clientX;
    runtime.state.ty = runtime.state.panState.ty + clientPoint.y - runtime.state.panState.clientY;
    runtime.applyViewport();
  });

  runtime.paper.on('blank:pointerup', () => {
    runtime.state.panState = null;
    runtime.state.activeDragElementId = null;
    runtime.state.activeVertexDrag = null;
    runtime.clearGuides();
    runtime.history.commitGesture('state-move');
    runtime.history.commitGesture('link-change');
    runtime.paperHost.style.cursor = runtime.state.mode === 'pan' ? 'grab' : 'default';
    runtime.endLinkCreationSoon();
  });

  runtime.paper.on('blank:contextmenu', (event, x, y) => {
    const clientPoint = resolveClientPoint(event);
    event.preventDefault();
    runtime.emitContextMenu({
      kind: 'blank',
      clientX: clientPoint?.x ?? 0,
      clientY: clientPoint?.y ?? 0,
      localX: x,
      localY: y,
      selection: runtime.getSelection()
    });
  });

  runtime.paper.on('cell:contextmenu', (cellView, event, x, y) => {
    const clientPoint = resolveClientPoint(event);
    event.preventDefault();
    runtime.selectCell(String(cellView.model.id));
    runtime.emitContextMenu({
      kind: 'cell',
      clientX: clientPoint?.x ?? 0,
      clientY: clientPoint?.y ?? 0,
      localX: x,
      localY: y,
      selection: runtime.getSelection()
    });
  });

  runtime.paper.on('cell:pointerup', () => {
    runtime.state.activeDragElementId = null;
    runtime.state.activeVertexDrag = null;
    runtime.clearGuides();
    runtime.history.commitGesture('state-move');
    runtime.history.commitGesture('link-change');
    runtime.endLinkCreationSoon();
  });

  runtime.paper.on('link:connect', (linkView) => {
    runtime.state.activeVertexDrag = null;
    runtime.clearGuides();
    runtime.prepareLinkData(linkView.model);
    runtime.syncWorkflowFromGraph();
    runtime.markDocumentChanged();
    runtime.endLinkCreation();
    runtime.selectCell(String(linkView.model.id));
    runtime.history.commitGesture('link-change');
  });

  runtime.paper.on('cell:mouseenter', (cellView) => {
    if (cellView.model.isElement()) {
      cellView.model.attr(['body', 'stroke'], '#2563eb');
    }
  });

  runtime.paper.on('cell:mouseleave', (cellView) => {
    if (cellView.model.isElement()) {
      runtime.decorateState(cellView.model as joint.dia.Element);
    }
  });

  runtime.graph.on('change:position', (cell) => {
    if (!cell.isElement() || runtime.state.suspendDocumentSyncDepth > 0) {
      return;
    }
    if (runtime.state.mode === 'edit' && runtime.state.activeDragElementId === String(cell.id)) {
      runtime.updateGuidesForElement(cell);
    }
    runtime.scheduleGraphSync({
      selectionChange: runtime.state.selectedCellId === String(cell.id)
    });
  });

  runtime.graph.on('change:vertices', (cell) => {
    if (!cell.isLink() || runtime.state.suspendDocumentSyncDepth > 0) {
      return;
    }
    const activeVertexDrag = runtime.state.activeVertexDrag;
    if (runtime.state.mode === 'edit' && activeVertexDrag && activeVertexDrag.linkId === String(cell.id)) {
      const vertex = cell.vertices()[activeVertexDrag.index];
      if (vertex) {
        runtime.updateGuidesForPoint({
          x: vertex.x,
          y: vertex.y
        });
      } else {
        runtime.clearGuides();
      }
    }
    runtime.scheduleGraphSync({
      selectionChange: runtime.state.selectedCellId === String(cell.id)
    });
  });

  runtime.graph.on('change:source', (cell) => {
    if (!cell.isLink() || runtime.state.suspendDocumentSyncDepth > 0) {
      return;
    }
    runtime.scheduleGraphSync({
      selectionChange: runtime.state.selectedCellId === String(cell.id)
    });
  });

  runtime.graph.on('change:target', (cell) => {
    if (!cell.isLink() || runtime.state.suspendDocumentSyncDepth > 0) {
      return;
    }
    runtime.scheduleGraphSync({
      selectionChange: runtime.state.selectedCellId === String(cell.id)
    });
  });

  runtime.graph.on('add', (cell) => {
    if (runtime.state.suspendDocumentSyncDepth === 0 && cell.isLink()) {
      runtime.prepareLinkData(cell);
      runtime.scheduleGraphSync();
    }
  });

  runtime.graph.on('remove', (cell) => {
    if (runtime.state.suspendDocumentSyncDepth > 0) {
      return;
    }
    runtime.scheduleGraphSync({
      selectionChange: runtime.state.selectedCellId === String(cell.id)
    });
  });

  if (runtime.config.wheelZoom) {
    runtime.paperHost.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        const rect = runtime.paperHost.getBoundingClientRect();
        runtime.setZoom(runtime.state.scale * (event.deltaY < 0 ? 1.1 : 0.9), {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      },
      { passive: false }
    );
  }
}
