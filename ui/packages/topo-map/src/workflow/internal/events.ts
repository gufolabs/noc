import { clonePlain } from '../clonePlain';
import {
  WORKFLOW_CAN_REDO_CHANGE_EVENT,
  WORKFLOW_CAN_UNDO_CHANGE_EVENT,
  WORKFLOW_CONTEXTMENU_EVENT,
  WORKFLOW_DIRTY_CHANGE_EVENT,
  WORKFLOW_DOCUMENT_CHANGE_EVENT,
  WORKFLOW_SELECTION_CHANGE_EVENT,
  WORKFLOW_VALIDATION_CHANGE_EVENT,
  type WorkflowHistoryAvailabilityChangeDetail,
  type WorkflowContextMenuDetail,
  type WorkflowDirtyChangeDetail,
  type WorkflowDocument,
  type WorkflowDocumentChangeDetail,
  type WorkflowSelection,
  type WorkflowSelectionChangeDetail,
  type WorkflowValidationChangeDetail
} from '../types';

function dispatchTypedEvent<T>(host: EventTarget, name: string, detail: T): void {
  host.dispatchEvent(
    new CustomEvent(name, {
      detail
    })
  );
}

export function emitDirtyChange(host: EventTarget, dirty: boolean): void {
  dispatchTypedEvent<WorkflowDirtyChangeDetail>(host, WORKFLOW_DIRTY_CHANGE_EVENT, {
    dirty
  });
}

export function emitCanUndoChange(host: EventTarget, target: boolean): void {
  dispatchTypedEvent<WorkflowHistoryAvailabilityChangeDetail>(host, WORKFLOW_CAN_UNDO_CHANGE_EVENT, target);
}

export function emitCanRedoChange(host: EventTarget, target: boolean): void {
  dispatchTypedEvent<WorkflowHistoryAvailabilityChangeDetail>(host, WORKFLOW_CAN_REDO_CHANGE_EVENT, target);
}

export function emitSelectionChange(host: EventTarget, selection: WorkflowSelection): void {
  dispatchTypedEvent<WorkflowSelectionChangeDetail>(host, WORKFLOW_SELECTION_CHANGE_EVENT, {
    selection
  });
}

export function emitDocumentChange(host: EventTarget, workflow: WorkflowDocument): void {
  dispatchTypedEvent<WorkflowDocumentChangeDetail>(host, WORKFLOW_DOCUMENT_CHANGE_EVENT, {
    workflow: clonePlain(workflow)
  });
}

export function emitContextMenu(host: EventTarget, detail: WorkflowContextMenuDetail): void {
  dispatchTypedEvent<WorkflowContextMenuDetail>(host, WORKFLOW_CONTEXTMENU_EVENT, detail);
}

export function validateWorkflow(workflow: WorkflowDocument): string[] {
  const issues: string[] = [];
  const seenStateNames = new Set<string>();
  const stateIds = new Set(workflow.states.map((state) => state.id));

  workflow.states.forEach((state) => {
    if (state.name.trim().length === 0) {
      issues.push(`State ${state.id} has an empty name.`);
    }
    if (seenStateNames.has(state.name)) {
      issues.push(`Duplicate state name: ${state.name}.`);
    }
    seenStateNames.add(state.name);
  });

  workflow.transitions.forEach((transition) => {
    if (!stateIds.has(transition.sourceStateId) || !stateIds.has(transition.targetStateId)) {
      issues.push(`Transition ${transition.id} references a missing state.`);
    }
  });

  return issues;
}

export function emitValidationChange(host: EventTarget, workflow: WorkflowDocument): string[] {
  const issues = validateWorkflow(workflow);
  dispatchTypedEvent<WorkflowValidationChangeDetail>(host, WORKFLOW_VALIDATION_CHANGE_EVENT, {
    isValid: issues.length === 0,
    issues: [...issues]
  });
  return issues;
}
