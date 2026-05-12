export interface WorkflowModelRef {
  id: string;
  label?: string;
}

export interface WorkflowPoint {
  x: number;
  y: number;
}

export interface WorkflowState {
  id: string;
  name: string;
  description?: string | null;
  is_default?: boolean;
  is_productive?: boolean;
  is_wiping?: boolean;
  update_last_seen?: boolean;
  ttl?: number | null;
  update_expired?: boolean;
  on_enter_handlers?: string[];
  job_handler?: string | null;
  on_leave_handlers?: string[];
  labels?: string[];
  x?: number;
  y?: number;
  [key: string]: unknown;
}

export interface WorkflowTransition {
  id: string;
  label: string;
  event?: string | null;
  is_active?: boolean;
  enable_manual?: boolean;
  description?: string | null;
  handlers?: string[];
  required_rules?: string[];
  vertices?: WorkflowPoint[];
  sourceStateId: string;
  targetStateId: string;
  from_state?: string;
  to_state?: string;
  [key: string]: unknown;
}

export interface WorkflowDocument {
  id?: string;
  name: string;
  is_active?: boolean;
  description?: string | null;
  allowed_models?: Array<string | WorkflowModelRef>;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  [key: string]: unknown;
}

export interface WorkflowStateCellData extends WorkflowState {
  kind: 'state';
}

export interface WorkflowTransitionCellData extends WorkflowTransition {
  kind: 'transition';
}

export type WorkflowCellData = WorkflowStateCellData | WorkflowTransitionCellData;

export type WorkflowSelection =
  | {
      kind: 'workflow';
      data: WorkflowDocument;
    }
  | {
      kind: 'state';
      id: string;
      data: WorkflowState;
    }
  | {
      kind: 'transition';
      id: string;
      data: WorkflowTransition;
    };

export type WorkflowMode = 'pan' | 'edit';

export interface WorkflowEditorConfig {
  mainContainer: HTMLElement;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  gridSize?: number;
  guidesEnabled?: boolean;
  guideThreshold?: number;
  fitToPageOnLoad?: boolean;
  wheelZoom?: boolean;
}

export interface WorkflowSelectionChangeDetail {
  selection: WorkflowSelection;
}

export interface WorkflowDocumentChangeDetail {
  workflow: WorkflowDocument;
}

export interface WorkflowDirtyChangeDetail {
  dirty: boolean;
}

export interface WorkflowContextMenuDetail {
  kind: 'blank' | 'cell';
  clientX: number;
  clientY: number;
  localX: number;
  localY: number;
  selection: WorkflowSelection;
}

export interface WorkflowValidationChangeDetail {
  isValid: boolean;
  issues: string[];
}

export type WorkflowHistoryAvailabilityChangeDetail = boolean;

export const WORKFLOW_SELECTION_CHANGE_EVENT = 'workflow:selection-change';
export const WORKFLOW_DOCUMENT_CHANGE_EVENT = 'workflow:document-change';
export const WORKFLOW_DIRTY_CHANGE_EVENT = 'workflow:dirty-change';
export const WORKFLOW_CONTEXTMENU_EVENT = 'workflow:contextmenu';
export const WORKFLOW_VALIDATION_CHANGE_EVENT = 'workflow:validation-change';
export const WORKFLOW_CAN_UNDO_CHANGE_EVENT = 'workflow:can-undo-change';
export const WORKFLOW_CAN_REDO_CHANGE_EVENT = 'workflow:can-redo-change';
