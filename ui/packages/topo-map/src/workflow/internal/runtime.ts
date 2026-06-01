import * as joint from '@joint/core';
import type {
  WorkflowContextMenuDetail,
  WorkflowPoint,
  WorkflowSelection
} from '../types';
import type { WorkflowEditorConfigResolved, WorkflowEditorState } from './editorState';
import type { WorkflowGuidesManager } from './GuidesManager';
import type { WorkflowHistoryController } from './history';
import type { WorkflowSpatialIndex } from './spatialIndex';

export interface WorkflowEditorRuntime {
  host: EventTarget;
  config: WorkflowEditorConfigResolved;
  state: WorkflowEditorState;
  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  paperHost: HTMLDivElement;
  spatialIndex: WorkflowSpatialIndex;
  guidesManager: WorkflowGuidesManager;
  history: WorkflowHistoryController;
  emitDirtyChange: (dirty: boolean) => void;
  emitCanUndoChange: (target: boolean) => void;
  emitCanRedoChange: (target: boolean) => void;
  emitSelectionChange: () => void;
  emitDocumentChange: () => void;
  emitContextMenu: (detail: WorkflowContextMenuDetail) => void;
  emitValidationChange: () => void;
  getSelection: () => WorkflowSelection;
  selectCell: (cellId: string | null) => void;
  beginLinkCreation: () => void;
  endLinkCreation: () => void;
  endLinkCreationSoon: () => void;
  setElementPortsVisible: (element: joint.dia.Element, visible: boolean) => void;
  shouldShowPortsForElement: (element: joint.dia.Element) => boolean;
  syncPortsVisibility: () => void;
  decorateState: (element: joint.dia.Element) => void;
  decorateStateById: (id: string) => void;
  decorateStates: () => void;
  refreshLink: (link: joint.dia.Link) => void;
  refreshAllLinks: () => void;
  applyViewport: () => void;
  resize: () => void;
  fitToContent: (padding?: number) => void;
  setZoom: (nextScale: number, focus?: WorkflowPoint) => void;
  rebuildSpatialIndex: () => void;
  updateGuidesForElement: (element: joint.dia.Element) => void;
  updateGuidesForPoint: (point: WorkflowPoint) => void;
  clearGuides: () => void;
  setGuidesEnabled: (enabled: boolean) => void;
  withDocumentSyncSuspended: (callback: () => void) => void;
  syncWorkflowFromGraph: () => void;
  performGraphSync: () => void;
  markDocumentChanged: () => void;
  scheduleGraphSync: (options?: { selectionChange?: boolean }) => void;
  flushScheduledGraphSync: () => void;
  cancelScheduledGraphSync: () => void;
  setDirty: (nextDirty: boolean) => void;
  prepareLinkData: (link: joint.dia.Link) => void;
}
