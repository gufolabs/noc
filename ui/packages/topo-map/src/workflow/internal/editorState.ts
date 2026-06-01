import type { WorkflowDocument, WorkflowEditorConfig, WorkflowMode } from '../types';

export const DEFAULT_INITIAL_SCALE = 1;
export const DEFAULT_MIN_SCALE = 0.2;
export const DEFAULT_MAX_SCALE = 3;
export const DEFAULT_GRID_SIZE = 20;
export const DEFAULT_GUIDES_ENABLED = true;
export const DEFAULT_GUIDE_THRESHOLD = 5;
export const GRAPH_SYNC_DEBOUNCE_MS = 16;

export interface PanState {
  clientX: number;
  clientY: number;
  tx: number;
  ty: number;
}

export interface ActiveVertexDragState {
  linkId: string;
  index: number;
}

export type WorkflowEditorConfigResolved = Required<Omit<WorkflowEditorConfig, 'mainContainer'>> &
  Pick<WorkflowEditorConfig, 'mainContainer'>;

export interface WorkflowEditorState {
  workflow: WorkflowDocument;
  selectedCellId: string | null;
  mode: WorkflowMode;
  scale: number;
  tx: number;
  ty: number;
  panState: PanState | null;
  activeDragElementId: string | null;
  activeVertexDrag: ActiveVertexDragState | null;
  linkCreationInProgress: boolean;
  pendingGraphSyncTimeout: ReturnType<typeof globalThis.setTimeout> | null;
  pendingEndLinkCreationTimeout: ReturnType<typeof globalThis.setTimeout> | null;
  pendingGraphSyncSelectionChange: boolean;
  dirty: boolean;
  suspendDocumentSyncDepth: number;
  validationIssues: string[];
}

export function resolveWorkflowEditorConfig(config: WorkflowEditorConfig): WorkflowEditorConfigResolved {
  return {
    mainContainer: config.mainContainer,
    initialScale: config.initialScale ?? DEFAULT_INITIAL_SCALE,
    minScale: config.minScale ?? DEFAULT_MIN_SCALE,
    maxScale: config.maxScale ?? DEFAULT_MAX_SCALE,
    gridSize: config.gridSize ?? DEFAULT_GRID_SIZE,
    guidesEnabled: config.guidesEnabled ?? DEFAULT_GUIDES_ENABLED,
    guideThreshold: config.guideThreshold ?? DEFAULT_GUIDE_THRESHOLD,
    fitToPageOnLoad: config.fitToPageOnLoad ?? true,
    wheelZoom: config.wheelZoom ?? true
  };
}

export function createWorkflowEditorState(
  config: WorkflowEditorConfigResolved,
  workflow: WorkflowDocument
): WorkflowEditorState {
  return {
    workflow,
    selectedCellId: null,
    mode: 'edit' satisfies WorkflowMode,
    scale: config.initialScale,
    tx: 0,
    ty: 0,
    panState: null,
    activeDragElementId: null,
    activeVertexDrag: null,
    linkCreationInProgress: false,
    pendingGraphSyncTimeout: null,
    pendingEndLinkCreationTimeout: null,
    pendingGraphSyncSelectionChange: false,
    dirty: false,
    suspendDocumentSyncDepth: 0,
    validationIssues: []
  };
}
