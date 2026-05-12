import { bindHistoryShortcuts } from '../history/bindHistoryShortcuts';
import * as joint from '@joint/core';
import { workflowCellNamespace } from './shapes/workflowCellNamespace';
import type {
  WorkflowContextMenuDetail,
  WorkflowDocument,
  WorkflowEditorConfig,
  WorkflowMode,
  WorkflowPoint,
  WorkflowSelection,
  WorkflowState,
  WorkflowTransition
} from './types';
import { emitCanRedoChange, emitCanUndoChange, emitContextMenu, emitDirtyChange, emitDocumentChange, emitSelectionChange, emitValidationChange } from './internal/events';
import { resolveInteractivity, bindEvents } from './internal/bindings';
import { createDefaultWorkflow as createInitialWorkflow } from './internal/helpers';
import { createWorkflowHistoryController } from './internal/history';
import { clearPendingEndLinkCreationTimeout, beginLinkCreation, endLinkCreation, endLinkCreationSoon, setElementPortsVisible, shouldShowPortsForElement, syncPortsVisibility, validateConnection, validateMagnet } from './internal/ports';
import { createWorkflowEditorState, resolveWorkflowEditorConfig } from './internal/editorState';
import { clearSelection, getSelection, selectCell } from './internal/selection';
import { cancelScheduledGraphSync, flushScheduledGraphSync, markDocumentChanged, performGraphSync, scheduleGraphSync, setDirty, syncWorkflowFromGraph, withDocumentSyncSuspended } from './internal/sync';
import { decorateState, decorateStateById, decorateStates, refreshAllLinks, refreshLink } from './internal/styling';
import { WorkflowGuidesManager } from './internal/GuidesManager';
import { applyWorkflowDocument, autoLayout, createDefaultLink, exportForSave, loadWorkflow, prepareLinkData, toJSON, addState, removeSelected, updateState, updateTransition, updateWorkflowMeta } from './internal/mutations';
import type { WorkflowEditorRuntime } from './internal/runtime';
import { WorkflowSpatialIndex } from './internal/spatialIndex';
import { applyViewport, clientToLocalPoint, fitToContent, resize, setZoom, zoomIn, zoomOut } from './internal/viewport';

const PAPER_BACKGROUND = '#f8fafc';

export class WorkflowEditor extends EventTarget {
  private readonly runtime: WorkflowEditorRuntime;

  private readonly resizeObserver: ResizeObserver | null;

  private readonly unbindHistoryShortcuts: () => void;

  private focusPaperHost(): void {
    this.runtime.paperHost.focus({ preventScroll: true });
  }

  public constructor(config: WorkflowEditorConfig) {
    super();

    const resolvedConfig = resolveWorkflowEditorConfig(config);
    const state = createWorkflowEditorState(resolvedConfig, createInitialWorkflow());
    const paperHost = document.createElement('div');
    paperHost.className = 'workflow-editor-paper-host';
    paperHost.style.width = '100%';
    paperHost.style.height = '100%';
    paperHost.style.cursor = 'default';
    resolvedConfig.mainContainer.replaceChildren(paperHost);

    const graph = new joint.dia.Graph({}, { cellNamespace: workflowCellNamespace });
    const runtime = {} as WorkflowEditorRuntime;
    const paper = new joint.dia.Paper({
      el: paperHost,
      model: graph,
      cellViewNamespace: workflowCellNamespace,
      width: paperHost.clientWidth || 800,
      height: paperHost.clientHeight || 600,
      gridSize: resolvedConfig.gridSize,
      drawGrid: { name: 'dot', args: { color: '#cbd5e1', thickness: 1 } },
      background: { color: PAPER_BACKGROUND },
      async: false,
      linkPinning: false,
      defaultRouter: { name: 'orthogonal' },
      defaultConnector: { name: 'rounded' },
      defaultLink: () => createDefaultLink(),
      interactive: (cellView, eventName) => resolveInteractivity(runtime, cellView, eventName),
      validateMagnet: (_cellView, magnet) => validateMagnet(runtime, magnet),
      validateConnection: (sourceView, sourceMagnet, targetView, targetMagnet) =>
        validateConnection(runtime, sourceView, sourceMagnet, targetView, targetMagnet)
    });
    const spatialIndex = new WorkflowSpatialIndex(graph);
    const guidesManager = new WorkflowGuidesManager(
      paper,
      () => ({
        scale: runtime.state.scale,
        tx: runtime.state.tx,
        ty: runtime.state.ty
      }),
      resolvedConfig.guideThreshold,
      (rect) => spatialIndex.searchNearby(rect)
    );
    guidesManager.setEnabled(resolvedConfig.guidesEnabled);

    Object.assign(runtime, {
      host: this,
      config: resolvedConfig,
      state,
      graph,
      paper,
      paperHost,
      spatialIndex,
      guidesManager,
      history: undefined as unknown as WorkflowEditorRuntime['history'],
      emitDirtyChange: (dirty: boolean) => {
        emitDirtyChange(this, dirty);
      },
      emitCanUndoChange: (target: boolean) => {
        emitCanUndoChange(this, target);
      },
      emitCanRedoChange: (target: boolean) => {
        emitCanRedoChange(this, target);
      },
      emitSelectionChange: () => {
        emitSelectionChange(this, getSelection(runtime));
      },
      emitDocumentChange: () => {
        emitDocumentChange(this, runtime.state.workflow);
      },
      emitContextMenu: (detail: WorkflowContextMenuDetail) => {
        emitContextMenu(this, detail);
      },
      emitValidationChange: () => {
        runtime.state.validationIssues = emitValidationChange(this, runtime.state.workflow);
      },
      getSelection: () => getSelection(runtime),
      selectCell: (cellId: string | null) => {
        selectCell(runtime, cellId);
      },
      beginLinkCreation: () => {
        beginLinkCreation(runtime);
      },
      endLinkCreation: () => {
        endLinkCreation(runtime);
      },
      endLinkCreationSoon: () => {
        endLinkCreationSoon(runtime);
      },
      setElementPortsVisible: (element: joint.dia.Element, visible: boolean) => {
        setElementPortsVisible(runtime, element, visible);
      },
      shouldShowPortsForElement: (element: joint.dia.Element) => shouldShowPortsForElement(runtime, element),
      syncPortsVisibility: () => {
        syncPortsVisibility(runtime);
      },
      decorateState: (element: joint.dia.Element) => {
        decorateState(runtime, element);
      },
      decorateStateById: (id: string) => {
        decorateStateById(runtime, id);
      },
      decorateStates: () => {
        decorateStates(runtime);
      },
      refreshLink: (link: joint.dia.Link) => {
        refreshLink(runtime, link);
      },
      refreshAllLinks: () => {
        refreshAllLinks(runtime);
      },
      applyViewport: () => {
        applyViewport(runtime);
      },
      resize: () => {
        resize(runtime);
      },
      fitToContent: (padding?: number) => {
        fitToContent(runtime, padding);
      },
      setZoom: (nextScale: number, focus?: WorkflowPoint) => {
        setZoom(runtime, nextScale, focus);
      },
      rebuildSpatialIndex: () => {
        spatialIndex.rebuildIndex();
      },
      updateGuidesForElement: (element: joint.dia.Element) => {
        guidesManager.updateForElement(element);
      },
      updateGuidesForPoint: (point: WorkflowPoint) => {
        guidesManager.updateForPoint(point);
      },
      clearGuides: () => {
        guidesManager.clear();
      },
      setGuidesEnabled: (enabled: boolean) => {
        guidesManager.setEnabled(enabled);
      },
      withDocumentSyncSuspended: (callback: () => void) => {
        withDocumentSyncSuspended(runtime, callback);
      },
      syncWorkflowFromGraph: () => {
        syncWorkflowFromGraph(runtime);
      },
      performGraphSync: () => {
        performGraphSync(runtime);
      },
      markDocumentChanged: () => {
        markDocumentChanged(runtime);
      },
      scheduleGraphSync: (options?: { selectionChange?: boolean }) => {
        scheduleGraphSync(runtime, options);
      },
      flushScheduledGraphSync: () => {
        flushScheduledGraphSync(runtime);
      },
      cancelScheduledGraphSync: () => {
        cancelScheduledGraphSync(runtime);
      },
      setDirty: (nextDirty: boolean) => {
        setDirty(runtime, nextDirty);
      },
      prepareLinkData: (link: joint.dia.Link) => {
        prepareLinkData(runtime, link);
      }
    } satisfies WorkflowEditorRuntime);
    runtime.history = createWorkflowHistoryController(runtime, (snapshot) => {
      applyWorkflowDocument(runtime, snapshot, {
        dirty: runtime.state.dirty,
        viewportMode: 'preserve'
      });
    });

    this.runtime = runtime;
    applyViewport(this.runtime);
    bindEvents(this.runtime);
    this.runtime.history.reset();
    this.unbindHistoryShortcuts = bindHistoryShortcuts(paperHost, {
      undo: () => this.undo(),
      redo: () => this.redo()
    });

    this.resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => {
            resize(this.runtime);
          })
        : null;
    this.resizeObserver?.observe(this.runtime.config.mainContainer);
    this.runtime.emitSelectionChange();
    this.runtime.emitValidationChange();
  }

  public loadWorkflow(input: unknown): void {
    loadWorkflow(this.runtime, input);
    this.focusPaperHost();
  }

  public toJSON() {
    return toJSON(this.runtime);
  }

  public exportForSave(): Record<string, unknown> {
    return exportForSave(this.runtime);
  }

  public addState(position: WorkflowPoint, partial: Partial<WorkflowState> = {}): string {
    const stateId = addState(this.runtime, position, partial);
    this.focusPaperHost();
    return stateId;
  }

  public updateWorkflowMeta(patch: Partial<WorkflowDocument>): void {
    updateWorkflowMeta(this.runtime, patch);
    this.focusPaperHost();
  }

  public updateState(id: string, patch: Partial<WorkflowState>): boolean {
    const updated = updateState(this.runtime, id, patch);
    if (updated) {
      this.focusPaperHost();
    }
    return updated;
  }

  public updateTransition(id: string, patch: Partial<WorkflowTransition>): boolean {
    const updated = updateTransition(this.runtime, id, patch);
    if (updated) {
      this.focusPaperHost();
    }
    return updated;
  }

  public removeSelected(): boolean {
    const removed = removeSelected(this.runtime);
    if (removed) {
      this.focusPaperHost();
    }
    return removed;
  }

  public selectCell(cellId: string | null): void {
    selectCell(this.runtime, cellId);
  }

  public clearSelection(): void {
    clearSelection(this.runtime);
  }

  public getSelection(): WorkflowSelection {
    return getSelection(this.runtime);
  }

  public setMode(mode: WorkflowMode): void {
    if (this.runtime.state.mode === mode) {
      return;
    }
    this.runtime.clearGuides();
    this.runtime.state.activeDragElementId = null;
    this.runtime.state.activeVertexDrag = null;
    this.runtime.state.mode = mode;
    this.runtime.state.panState = null;
    this.runtime.paperHost.style.cursor = mode === 'pan' ? 'grab' : 'default';
    this.runtime.selectCell(this.runtime.state.selectedCellId);
  }

  public getMode(): WorkflowMode {
    return this.runtime.state.mode;
  }

  public autoLayout(): void {
    autoLayout(this.runtime);
    this.focusPaperHost();
  }

  public zoomIn(): void {
    zoomIn(this.runtime);
  }

  public zoomOut(): void {
    zoomOut(this.runtime);
  }

  public setZoom(nextScale: number, focus?: WorkflowPoint): void {
    setZoom(this.runtime, nextScale, focus);
  }

  public fitToContent(padding = 48): void {
    fitToContent(this.runtime, padding);
  }

  public undo(): boolean {
    return this.runtime.history.undo();
  }

  public redo(): boolean {
    return this.runtime.history.redo();
  }

  public canUndo(): boolean {
    return this.runtime.history.canUndo();
  }

  public canRedo(): boolean {
    return this.runtime.history.canRedo();
  }

  public setGuidesEnabled(enabled: boolean): void {
    this.runtime.setGuidesEnabled(enabled);
    if (!enabled) {
      this.runtime.clearGuides();
    }
  }

  public notifyResize(): void {
    this.runtime.clearGuides();
    resize(this.runtime);
  }

  public clientToLocalPoint(clientX: number, clientY: number): WorkflowPoint {
    return clientToLocalPoint(this.runtime, clientX, clientY);
  }

  public destroy(): void {
    cancelScheduledGraphSync(this.runtime);
    clearPendingEndLinkCreationTimeout(this.runtime);
    this.resizeObserver?.disconnect();
    this.unbindHistoryShortcuts();
    this.runtime.clearGuides();
    this.runtime.guidesManager.destroy();
    this.runtime.spatialIndex.destroy();
    this.runtime.paper.remove();
    this.runtime.config.mainContainer.replaceChildren();
  }
}
