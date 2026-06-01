import * as joint from '@joint/core';
import { clonePlain } from '../clonePlain';
import type { WorkflowSelection } from '../types';
import { createWorkflowLinkTools } from './linkTools';
import type { WorkflowEditorRuntime } from './runtime';

const STATE_HIGHLIGHT_ID = 'workflow:state-highlight';
const LINK_HIGHLIGHT_ID = 'workflow:link-highlight';

export function getSelection(runtime: WorkflowEditorRuntime): WorkflowSelection {
  if (!runtime.state.selectedCellId) {
    return {
      kind: 'workflow',
      data: clonePlain(runtime.state.workflow)
    };
  }

  const cell = runtime.graph.getCell(runtime.state.selectedCellId);
  if (cell?.isElement()) {
    const state = runtime.state.workflow.states.find((item) => item.id === runtime.state.selectedCellId);
    if (state) {
      return {
        kind: 'state',
        id: state.id,
        data: clonePlain(state)
      };
    }
  }

  if (cell?.isLink()) {
    const transition = runtime.state.workflow.transitions.find((item) => item.id === runtime.state.selectedCellId);
    if (transition) {
      return {
        kind: 'transition',
        id: transition.id,
        data: clonePlain(transition)
      };
    }
  }

  return {
    kind: 'workflow',
    data: clonePlain(runtime.state.workflow)
  };
}

export function clearSelectionHighlight(runtime: WorkflowEditorRuntime): void {
  runtime.graph.getCells().forEach((cell) => {
    const view = cell.findView(runtime.paper);
    if (!view) {
      return;
    }
    if (cell.isElement()) {
      runtime.setElementPortsVisible(cell, false);
      joint.highlighters.mask.remove(view, STATE_HIGHLIGHT_ID);
    } else {
      joint.highlighters.mask.remove(view, LINK_HIGHLIGHT_ID);
    }
    view.removeTools();
  });
}

export function applySelectionHighlight(runtime: WorkflowEditorRuntime, view: joint.dia.CellView): void {
  if (view.model.isElement()) {
    runtime.setElementPortsVisible(view.model as joint.dia.Element, true);
    joint.highlighters.mask.add(view, 'root', STATE_HIGHLIGHT_ID, {
      padding: 6,
      attrs: {
        stroke: '#f59e0b',
        strokeWidth: 2
      }
    });
    return;
  }

  joint.highlighters.mask.add(view, 'line', LINK_HIGHLIGHT_ID, {
    padding: 4,
    attrs: {
      stroke: '#f59e0b',
      strokeWidth: 3
    }
  });
}

export function updateTools(runtime: WorkflowEditorRuntime): void {
  if (!runtime.state.selectedCellId || runtime.state.mode !== 'edit') {
    return;
  }
  const cell = runtime.graph.getCell(runtime.state.selectedCellId);
  const view = cell?.findView(runtime.paper);
  if (!view) {
    return;
  }

  const tools: joint.dia.ToolView[] = [];
  if (cell.isElement()) {
    const removeToolCtor = (joint.elementTools as { Remove?: new (options?: object) => joint.dia.ToolView }).Remove;
    if (removeToolCtor) {
      tools.push(new removeToolCtor({ x: '100%', y: 0, offset: { x: -12, y: 12 } }));
    }
  } else if (cell.isLink()) {
    tools.push(
      ...createWorkflowLinkTools(runtime.config.gridSize, {
        onVertexMoveStart: (link, index) => {
          runtime.state.activeDragElementId = null;
          runtime.state.activeVertexDrag = {
            linkId: String(link.id),
            index
          };
        },
        onVertexMoveEnd: () => {
          runtime.state.activeVertexDrag = null;
          runtime.clearGuides();
        }
      })
    );
  }

  if (tools.length > 0) {
    view.addTools(
      new joint.dia.ToolsView({
        tools
      })
    );
  }
}

export function selectCell(runtime: WorkflowEditorRuntime, cellId: string | null): void {
  clearSelectionHighlight(runtime);
  runtime.state.selectedCellId = cellId;

  if (cellId) {
    const cell = runtime.graph.getCell(cellId);
    const view = cell?.findView(runtime.paper);
    if (view) {
      applySelectionHighlight(runtime, view);
    }
  }

  updateTools(runtime);
  runtime.emitSelectionChange();
}

export function clearSelection(runtime: WorkflowEditorRuntime): void {
  selectCell(runtime, null);
}
