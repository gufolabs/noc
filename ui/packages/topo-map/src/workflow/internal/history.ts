import { HistoryController } from '../../history/HistoryController';
import { clonePlain } from '../clonePlain';
import type { WorkflowDocument } from '../types';
import type { WorkflowEditorRuntime } from './runtime';

export type WorkflowHistoryGesture = 'state-move' | 'link-change';

export interface WorkflowHistoryController {
  beginGesture: (kind: WorkflowHistoryGesture) => void;
  commitGesture: (kind: WorkflowHistoryGesture) => boolean;
  cancelGesture: (kind?: WorkflowHistoryGesture) => void;
  beginImplicitChange: () => void;
  commitImplicitChange: () => boolean;
  cancelImplicitChange: () => void;
  recordChange: (before: WorkflowDocument, after: WorkflowDocument) => boolean;
  reset: (snapshot?: WorkflowDocument) => void;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  isReplayInProgress: () => boolean;
  syncDirtyState: () => void;
}

function equalsWorkflowDocument(left: WorkflowDocument, right: WorkflowDocument): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function captureWorkflowSnapshot(runtime: WorkflowEditorRuntime): WorkflowDocument {
  runtime.flushScheduledGraphSync();
  return clonePlain(runtime.state.workflow);
}

export function createWorkflowHistoryController(
  runtime: WorkflowEditorRuntime,
  applySnapshot: (snapshot: WorkflowDocument) => void
): WorkflowHistoryController {
  const history = new HistoryController<WorkflowDocument>({
    clone: clonePlain,
    equals: equalsWorkflowDocument
  });
  let baseline = captureWorkflowSnapshot(runtime);
  let activeGesture: WorkflowHistoryGesture | null = null;
  let implicitChangeActive = false;
  let lastCanUndo = history.canUndo();
  let lastCanRedo = history.canRedo();

  const emitAvailabilityChanges = (): void => {
    const nextCanUndo = history.canUndo();
    const nextCanRedo = history.canRedo();

    if (nextCanUndo !== lastCanUndo) {
      lastCanUndo = nextCanUndo;
      runtime.emitCanUndoChange(nextCanUndo);
    }

    if (nextCanRedo !== lastCanRedo) {
      lastCanRedo = nextCanRedo;
      runtime.emitCanRedoChange(nextCanRedo);
    }
  };

  const syncDirtyState = (): void => {
    runtime.setDirty(!equalsWorkflowDocument(captureWorkflowSnapshot(runtime), baseline));
  };

  return {
    beginGesture: (kind: WorkflowHistoryGesture): void => {
      if (history.isReplayInProgress() || activeGesture !== null || implicitChangeActive) {
        return;
      }
      activeGesture = kind;
      history.begin(captureWorkflowSnapshot(runtime));
    },
    commitGesture: (kind: WorkflowHistoryGesture): boolean => {
      if (activeGesture !== kind) {
        return false;
      }
      activeGesture = null;
      const recorded = history.commit(captureWorkflowSnapshot(runtime));
      syncDirtyState();
      emitAvailabilityChanges();
      return recorded;
    },
    cancelGesture: (kind?: WorkflowHistoryGesture): void => {
      if (kind && activeGesture !== kind) {
        return;
      }
      activeGesture = null;
      history.cancel();
    },
    beginImplicitChange: (): void => {
      if (history.isReplayInProgress() || activeGesture !== null || implicitChangeActive) {
        return;
      }
      implicitChangeActive = true;
      history.begin(captureWorkflowSnapshot(runtime));
    },
    commitImplicitChange: (): boolean => {
      if (!implicitChangeActive) {
        return false;
      }
      implicitChangeActive = false;
      const recorded = history.commit(captureWorkflowSnapshot(runtime));
      syncDirtyState();
      emitAvailabilityChanges();
      return recorded;
    },
    cancelImplicitChange: (): void => {
      implicitChangeActive = false;
      history.cancel();
    },
    recordChange: (before: WorkflowDocument, after: WorkflowDocument): boolean => {
      const recorded = history.record(before, after);
      runtime.setDirty(!equalsWorkflowDocument(after, baseline));
      emitAvailabilityChanges();
      return recorded;
    },
    reset: (snapshot?: WorkflowDocument): void => {
      baseline = clonePlain(snapshot ?? captureWorkflowSnapshot(runtime));
      activeGesture = null;
      implicitChangeActive = false;
      history.clear();
      runtime.setDirty(false);
      emitAvailabilityChanges();
    },
    undo: (): boolean => {
      const changed = history.undo((snapshot) => {
        applySnapshot(snapshot);
      });
      if (changed) {
        syncDirtyState();
        emitAvailabilityChanges();
      }
      return changed;
    },
    redo: (): boolean => {
      const changed = history.redo((snapshot) => {
        applySnapshot(snapshot);
      });
      if (changed) {
        syncDirtyState();
        emitAvailabilityChanges();
      }
      return changed;
    },
    canUndo: (): boolean => history.canUndo(),
    canRedo: (): boolean => history.canRedo(),
    isReplayInProgress: (): boolean => history.isReplayInProgress(),
    syncDirtyState
  };
}
