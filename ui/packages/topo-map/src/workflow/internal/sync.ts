import { graphToWorkflow } from '../workflowAdapter';
import { GRAPH_SYNC_DEBOUNCE_MS } from './editorState';
import type { WorkflowEditorRuntime } from './runtime';

export function withDocumentSyncSuspended(runtime: WorkflowEditorRuntime, callback: () => void): void {
  runtime.state.suspendDocumentSyncDepth++;
  try {
    callback();
  } finally {
    runtime.state.suspendDocumentSyncDepth--;
  }
}

export function performGraphSync(runtime: WorkflowEditorRuntime): void {
  runtime.state.workflow = graphToWorkflow(runtime.graph, runtime.state.workflow);
  runtime.emitValidationChange();
}

export function cancelScheduledGraphSync(runtime: WorkflowEditorRuntime): void {
  if (runtime.state.pendingGraphSyncTimeout !== null) {
    globalThis.clearTimeout(runtime.state.pendingGraphSyncTimeout);
    runtime.state.pendingGraphSyncTimeout = null;
  }
  runtime.state.pendingGraphSyncSelectionChange = false;
  runtime.history.cancelImplicitChange();
}

export function syncWorkflowFromGraph(runtime: WorkflowEditorRuntime): void {
  cancelScheduledGraphSync(runtime);
  performGraphSync(runtime);
}

export function setDirty(runtime: WorkflowEditorRuntime, nextDirty: boolean): void {
  if (runtime.state.dirty === nextDirty) {
    return;
  }
  runtime.state.dirty = nextDirty;
  runtime.emitDirtyChange(nextDirty);
}

export function markDocumentChanged(runtime: WorkflowEditorRuntime): void {
  setDirty(runtime, true);
  runtime.emitDocumentChange();
}

export function flushScheduledGraphSync(runtime: WorkflowEditorRuntime): void {
  if (runtime.state.pendingGraphSyncTimeout === null) {
    return;
  }
  globalThis.clearTimeout(runtime.state.pendingGraphSyncTimeout);
  runtime.state.pendingGraphSyncTimeout = null;
  const shouldEmitSelectionChange = runtime.state.pendingGraphSyncSelectionChange;
  runtime.state.pendingGraphSyncSelectionChange = false;
  performGraphSync(runtime);
  runtime.emitDocumentChange();
  runtime.history.commitImplicitChange();
  if (!shouldEmitSelectionChange) {
    return;
  }
  if (runtime.state.selectedCellId && !runtime.graph.getCell(runtime.state.selectedCellId)) {
    runtime.selectCell(null);
    return;
  }
  if (runtime.state.selectedCellId) {
    runtime.emitSelectionChange();
  }
}

export function scheduleGraphSync(
  runtime: WorkflowEditorRuntime,
  options: { selectionChange?: boolean } = {}
): void {
  runtime.history.beginImplicitChange();
  runtime.state.pendingGraphSyncSelectionChange ||= options.selectionChange ?? false;
  setDirty(runtime, true);
  if (runtime.state.pendingGraphSyncTimeout !== null) {
    globalThis.clearTimeout(runtime.state.pendingGraphSyncTimeout);
  }
  runtime.state.pendingGraphSyncTimeout = globalThis.setTimeout(() => {
    flushScheduledGraphSync(runtime);
  }, GRAPH_SYNC_DEBOUNCE_MS);
}
