import * as joint from '@joint/core';
import { ResetViewCommand } from './commands/ResetViewCommand';
import { ZoomInCommand } from './commands/ZoomInCommand';
import { ZoomOutCommand } from './commands/ZoomOutCommand';
import { DataFacade } from './core/DataFacade';
import { Debug } from './core/Debug';
import { DiagramService } from './core/DiagramService';
import {
  InteractionEvents,
  isNodeSearchRequestDetail,
  NODE_SEARCH_REQUEST_EVENT,
  NODE_SEARCH_RESULT_EVENT,
  normalizeNodeSearchMode,
  SCALE_CHANGE_EVENT,
  TOPOLOGY_CAN_REDO_CHANGE_EVENT,
  TOPOLOGY_CAN_UNDO_CHANGE_EVENT,
  UNHIGHLIGHT_REQUEST_EVENT,
  type NodeSearchResultDetail
} from './core/events';
import { fitPaperToContent, type FitMode } from './core/fitBounds';
import { clamp } from './core/geometry';
import { createGraphFromData } from './core/graphFromData';
import { MapBoundsState } from './core/MapBoundsState';
import { MapDocument, type MapDocumentJSON } from './core/MapDocument';
import { getVisibleNodeLabelField } from './core/nodeLabels';
import type {
  Config,
  DataApi,
  Interface,
  LinkData,
  Mode,
  NodeData,
  NodeLabelField,
  NodeSearchField,
  NodeSearchResult,
  PaperConfig,
  ResizePayload,
  Size,
  ViewportStateSnapshot
} from './core/types';
import { ViewportState } from './core/ViewportState';
import type { MapConverterInput } from './decoders/MapConverter';
import { convertMapData } from './decoders/MapConverter';
import { bindHistoryShortcuts } from './history/bindHistoryShortcuts';
import { GuidesManager } from './managers/GuidesManager';
import { MinimapManager } from './managers/MinimapManager';
import { ModeManager } from './managers/ModeManager';
import { NodeSearchIndexManager } from './managers/NodeSearchIndexManager';
import { PanManager } from './managers/PanManager';
import { SnapManager } from './managers/SnapManager';
import { ViewportManager } from './managers/ViewportManager';
import { ZoomManager } from './managers/ZoomManager';
import { EditMode } from './modes/EditMode';
import { PanMode } from './modes/PanMode';
import { ZoomToAreaMode } from './modes/ZoomToAreaMode';
import { setStencilDir } from './shapes/ImageIconElement';
import {
  applyLinkUtilization,
  applyLinkStatus,
  resetLinkPresentation
} from './shapes/LinkElement';
import { TopologyMoveHistory } from './topology/TopologyMoveHistory';

const DEFAULT_INITIAL_SCALE = 1;
const DEFAULT_MIN_SCALE = 0.1;
const DEFAULT_MAX_SCALE = 5;
const DEFAULT_GRID_SIZE = 20;
const DEFAULT_GUIDE_THRESHOLD = 5;
const DEFAULT_PADDING = 10;
const DEFAULT_FOCUS_ANIMATION_MS = 650;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function cloneInterfaces(interfaces: Interface[]): Interface[] {
  return interfaces.map((item) => ({
    id: item.id,
    tags: {
      object: item.tags.object,
      interface: item.tags.interface
    }
  }));
}

function mergeClassToken(currentValue: unknown, className: string, enabled: boolean): string {
  const normalizedClassName = className.trim();
  if (normalizedClassName.length === 0) {
    return typeof currentValue === 'string' ? currentValue.trim() : '';
  }

  const tokens = new Set(
    typeof currentValue === 'string'
      ? currentValue
          .split(/\s+/)
          .map((token) => token.trim())
          .filter((token) => token.length > 0)
      : []
  );

  if (enabled) {
    tokens.add(normalizedClassName);
  } else {
    tokens.delete(normalizedClassName);
  }

  return [...tokens].join(' ');
}

function normalizeNodeLookupId(value: string | number): string | null {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  if (Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

export class Topology {
  public readonly data: DataApi;

  private readonly config: Required<Omit<Config, 'onReady'>> & { onReady: (() => void) | undefined };

  private readonly viewportState: ViewportState;

  private readonly diagramService: DiagramService;

  private readonly viewportManager: ViewportManager;

  private readonly mapBoundsState: MapBoundsState;

  private readonly zoomManager: ZoomManager;

  private readonly panManager: PanManager;

  private readonly guidesManager: GuidesManager;

  private readonly snapManager: SnapManager;

  private readonly minimapManager: MinimapManager;

  private readonly nodeSearchIndexManager: NodeSearchIndexManager;

  private readonly editMode: EditMode;

  private readonly modeManager: ModeManager;

  private readonly zoomInCommand: ZoomInCommand;

  private readonly zoomOutCommand: ZoomOutCommand;

  private readonly resetViewCommand: ResetViewCommand;

  private readonly moveHistory: TopologyMoveHistory;

  private readonly debug: Debug;

  private readonly events: InteractionEvents;

  private currentPaperConfig: PaperConfig = {};

  private interfaces: Interface[] = [];

  private lastMainWidth = -1;

  private lastMainHeight = -1;

  private lastMinimapWidth = -1;

  private lastMinimapHeight = -1;

  private viewportAnimationFrameId = 0;

  private previousViewportSnapshot: ViewportStateSnapshot | null = null;

  private readonly unsubscribeViewportEvents: () => void;

  private readonly unbindHistoryShortcuts: () => void;

  private previousCanUndo = false;

  private previousCanRedo = false;

  private readonly onNodeSearchRequestBound = (event: Event): void => {
    this.handleNodeSearchRequest(event);
  };

  private readonly onUnhighlightRequestBound = (): void => {
    this.events.clearHighlightedElement();
  };

  public constructor(config: Config) {
    this.config = {
      mainContainer: config.mainContainer,
      minimapContainer: config.minimapContainer,
      initialScale: config.initialScale ?? DEFAULT_INITIAL_SCALE,
      minScale: config.minScale ?? DEFAULT_MIN_SCALE,
      maxScale: config.maxScale ?? DEFAULT_MAX_SCALE,
      gridSize: config.gridSize ?? DEFAULT_GRID_SIZE,
      padding: config.padding ?? DEFAULT_PADDING,
      snapThreshold: config.snapThreshold ?? DEFAULT_GUIDE_THRESHOLD,
      preserveViewportOnLoad: config.preserveViewportOnLoad ?? false,
      fitToPageOnLoad: config.fitToPageOnLoad ?? false,
      enableViewportCulling: config.enableViewportCulling ?? false,
      asyncRendering: config.asyncRendering ?? false,
      debugLogs: config.debugLogs ?? false,
      onReady: config.onReady
    };

    this.debug = new Debug(this.config.debugLogs);
    this.viewportState = new ViewportState(this.config.initialScale, this.config.minScale, this.config.maxScale);
    this.diagramService = new DiagramService(
      this.config.mainContainer,
      this.viewportState,
      this.config.gridSize,
      this.config.asyncRendering,
      DEFAULT_PADDING
    );
    this.data = new DataFacade(this.diagramService.getGraph());
    this.mapBoundsState = new MapBoundsState(
      this.diagramService.getGraph(),
      this.diagramService.getPaper(),
      this.config.padding);
    this.diagramService.setMapBoundsProvider(() => this.mapBoundsState.get());
    this.viewportState.setTranslateBoundsResolver((snapshot) => this.diagramService.getTranslateBounds(snapshot.scale));

    this.viewportManager = new ViewportManager(
      this.diagramService.getGraph(),
      this.diagramService.getPaper(),
      this.viewportState
    );
    if (this.config.enableViewportCulling) {
      this.diagramService.setViewportPredicate((view) => this.viewportManager.isCellVisible(view));
    } else {
      this.diagramService.setViewportPredicate(null);
    }

    this.zoomManager = new ZoomManager(this.viewportState, this.diagramService, 1.15, this.config.initialScale);
    this.panManager = new PanManager(this.viewportState);
    this.snapManager = new SnapManager(this.config.gridSize);
    this.guidesManager = new GuidesManager(
      this.diagramService.getPaper(),
      this.viewportState,
      this.config.snapThreshold,
      (rect) => this.viewportManager.searchNearby(rect)
    );
    this.minimapManager = new MinimapManager(
      this.config.minimapContainer,
      this.config.mainContainer,
      this.diagramService.getGraph(),
      this.diagramService.getPaper(),
      this.viewportState,
      this.mapBoundsState,
      this.config.asyncRendering,
      DEFAULT_PADDING
    );
    this.nodeSearchIndexManager = new NodeSearchIndexManager(this.diagramService.getGraph());
    this.moveHistory = new TopologyMoveHistory(this.diagramService.getGraph());

    const panMode = new PanMode(this.panManager, this.diagramService);
    const zoomToAreaMode = new ZoomToAreaMode(this.diagramService, this.zoomManager, this.viewportState);
    this.editMode = new EditMode(this.diagramService, this.guidesManager, this.snapManager, {
      onNodeMoveStart: (element) => {
        this.moveHistory.begin(element);
      },
      onNodeMoveEnd: (element) => {
        this.moveHistory.commit(element);
        this.emitHistoryAvailabilityChanges();
      },
      onNodeMoveCancel: () => {
        this.moveHistory.cancel();
      }
    });
    this.editMode.setGuidesEnabled(true);

    this.modeManager = new ModeManager(
      this.diagramService.getPaper(),
      {
        pan: panMode,
        zoomToArea: zoomToAreaMode,
        edit: this.editMode
      },
      'pan'
    );

    this.zoomInCommand = new ZoomInCommand(this.zoomManager);
    this.zoomOutCommand = new ZoomOutCommand(this.zoomManager);
    this.resetViewCommand = new ResetViewCommand(this.zoomManager);
    this.events = new InteractionEvents(this.config.mainContainer, this.diagramService.getPaper());

    this.events.setup();
    this.unsubscribeViewportEvents = this.viewportState.subscribe((snapshot) => {
      this.handleViewportStateChange(snapshot);
    });
    this.config.mainContainer.addEventListener(NODE_SEARCH_REQUEST_EVENT, this.onNodeSearchRequestBound as EventListener);
    this.config.mainContainer.addEventListener(UNHIGHLIGHT_REQUEST_EVENT, this.onUnhighlightRequestBound as EventListener);
    this.debug.setup(this.diagramService.getGraph(), this.diagramService.getPaper(), (listener) =>
      this.viewportState.subscribe(listener)
    );
    this.unbindHistoryShortcuts = bindHistoryShortcuts(this.diagramService.getPaperHost(), {
      undo: () => this.undo(),
      redo: () => this.redo()
    });
    this.emitHistoryAvailabilityChanges();
    this.config.onReady?.();
    this.logDebug('initialized', this.config);
  }

  public loadData(nodes: NodeData[], links: LinkData[]): void {
    this.logDebug('loadData:start', { nodes: nodes.length, links: links.length });
    this.loadDocument(MapDocument.fromGraph(createGraphFromData(nodes, links)));
    this.logDebug('loadData:done');
  }

  public toDocument(): MapDocument {
    return MapDocument.fromGraph(
      this.diagramService.toJSON(),
      this.viewportState.getSnapshot(),
      this.currentPaperConfig,
      this.interfaces
    );
  }

  public toJSON(): MapDocumentJSON {
    return this.saveDocument();
  }

  public toDocumentJSON(): MapDocumentJSON {
    return this.saveDocument();
  }

  public saveDocument(): MapDocumentJSON {
    return this.toDocument().toJSON();
  }

  public loadDocument(input: MapDocument | MapDocumentJSON): void {
    this.logDebug('loadDocument:start');
    this.events.clearInteractionState();
    this.moveHistory.clear();
    this.emitHistoryAvailabilityChanges();
    const document = input instanceof MapDocument ? input : MapDocument.fromJSON(input);

    this.applyMapPaperConfig(document.paperConfig);
    this.interfaces = cloneInterfaces(document.interfaces);

    this.diagramService.fromJSON(document.graph);
    this.mapBoundsState.refreshNow();
    this.viewportManager.rebuildIndex();
    this.nodeSearchIndexManager.rebuildIndex();
    this.viewportState.enforceConstraints();
    this.minimapManager.refresh();

    if (this.config.preserveViewportOnLoad) {
      return;
    }

    if (document.viewport) {
      this.viewportState.setViewport(document.viewport.scale, document.viewport.tx, document.viewport.ty);
      this.logDebug('loadDocument:applied-viewport', document.viewport);
      return;
    }

    if (this.config.fitToPageOnLoad) {
      this.fitToPage();
      this.logDebug('loadDocument:fit-to-page');
      return;
    }

    this.viewportState.setViewport(this.config.initialScale, 0, 0);
    this.logDebug('loadDocument:reset-viewport');
  }

  public fromJSON(data: object): void {
    this.loadDocument(MapDocument.fromJSON(data));
  }

  public convertAndLoad(data: MapConverterInput): void {
    this.logDebug('fromMapData:start');
    this.loadDocument(convertMapData(data));
  }

  public convertMapData(data: MapConverterInput): MapDocument {
    return convertMapData(data);
  }

  public getInterfaces(): Interface[] {
    return cloneInterfaces(this.interfaces);
  }

  public setLinkUtilization(linkId: string, value: number): boolean {
    const link = this.diagramService.getGraph().getCell(linkId);
    if (!link?.isLink()) {
      return false;
    }

    applyLinkUtilization(link, value, this.data.links.getLinkBw(linkId) ?? { in: 0, out: 0 });

    return true;
  }

  public setLinkStatus(linkId: string, status: number): boolean {
    const link = this.diagramService.getGraph().getCell(linkId);
    if (!link?.isLink()) {
      return false;
    }

    applyLinkStatus(link, status);

    return true;
  }

  public resetAllLinkPresentation(): void {
    this.diagramService.getGraph().getLinks().forEach((link) => {
      resetLinkPresentation(link);
    });
  }

  public setMode(mode: Mode): void {
    this.logDebug('setMode', { from: this.modeManager.getMode(), to: mode });
    this.modeManager.setMode(mode);
  }

  public getMode(): string {
    return this.modeManager.getMode();
  }

  public setSnapToGrid(enabled: boolean): void {
    this.logDebug('setSnapToGrid', enabled);
    this.editMode.setSnapEnabled(enabled);
  }

  public setGuidesEnabled(enabled: boolean): void {
    this.logDebug('setGuidesEnabled', enabled);
    this.editMode.setGuidesEnabled(enabled);
  }

  public toggleNodeLabelMode(): void {
    this.logDebug('toggleNodeLabelMode');
    this.diagramService
      .getGraph()
      .getElements()
      .forEach((element) => {
        const toggleable = element as joint.dia.Element & { toggleLabel?: () => void };
        toggleable.toggleLabel?.();
      });
  }

  public getVisibleNodeLabelField(): NodeLabelField {
    return getVisibleNodeLabelField(this.diagramService.getGraph().getElements());
  }

  public findNodeByVisibleLabel(query: string): NodeSearchResult | null {
    const field = this.getVisibleNodeLabelField();
    return this.nodeSearchIndexManager.search(field, query);
  }

  public findNodeById(query: string): NodeSearchResult | null {
    return this.nodeSearchIndexManager.search('id', query);
  }

  public focusNodeByVisibleLabel(query: string, durationMs = DEFAULT_FOCUS_ANIMATION_MS): NodeSearchResult | null {
    const field = this.getVisibleNodeLabelField();
    const matched = this.nodeSearchIndexManager.search(field, query);
    if (!matched) {
      return null;
    }

    const element = this.diagramService.getGraph().getCell(matched.id);
    if (!element?.isElement()) {
      return null;
    }

    this.animateViewportToElement(element, durationMs, () => {
      this.events.highlightElementById(element.id);
    });
    return matched;
  }

  public focusNodeById(query: string, durationMs = DEFAULT_FOCUS_ANIMATION_MS): NodeSearchResult | null {
    const matched = this.nodeSearchIndexManager.search('id', query);
    if (!matched) {
      return null;
    }

    const element = this.diagramService.getGraph().getCell(matched.id);
    if (!element?.isElement()) {
      return null;
    }

    this.animateViewportToElement(element, durationMs, () => {
      this.events.highlightElementById(element.id);
    });
    return matched;
  }

  public setElementTextClass(nodeId: string | number, className: string, enabled: boolean): boolean {
    const normalizedClassName = className.trim();
    if (normalizedClassName.length === 0) {
      return false;
    }

    const element = this.findElementByNodeId(nodeId);
    if (!element) {
      return false;
    }

    const nextNodeNameClass = mergeClassToken(element.attr('nodeName/class'), normalizedClassName, enabled);
    const nextIpaddrClass = mergeClassToken(element.attr('ipaddr/class'), normalizedClassName, enabled);

    element.attr('nodeName/class', nextNodeNameClass);
    element.attr('ipaddr/class', nextIpaddrClass);
    return true;
  }

  public setZoom(scale: number): void {
    if (!Number.isFinite(scale) || scale <= 0) {
      return;
    }

    const snapshot = this.viewportState.getSnapshot();
    const size = this.diagramService.getSize();
    if (size.width <= 1 || size.height <= 1) {
      this.viewportState.setScale(scale);
      return;
    }

    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const localX = (centerX - snapshot.tx) / snapshot.scale;
    const localY = (centerY - snapshot.ty) / snapshot.scale;
    const nextTx = centerX - localX * scale;
    const nextTy = centerY - localY * scale;

    this.logDebug('setZoom', { scale });
    this.viewportState.setViewport(scale, nextTx, nextTy);
  }

  public fitToPage(): void {
    this.fitToContent('page');
  }

  public fitToWidth(): void {
    this.fitToContent('width');
  }

  public fitToHeight(): void {
    this.fitToContent('height');
  }

  public getViewportSnapshot(): ViewportStateSnapshot {
    return this.viewportState.getSnapshot();
  }

  public getScale(): number {
    return this.zoomManager.getScale();
  }

  public zoomIn(): void {
    this.logDebug('zoomIn');
    this.zoomInCommand.execute();
  }

  public zoomOut(): void {
    this.logDebug('zoomOut');
    this.zoomOutCommand.execute();
  }

  public resetView(): void {
    this.logDebug('resetView');
    this.resetViewCommand.execute();
  }

  public undo(): boolean {
    const changed = this.moveHistory.undo();
    if (changed) {
      this.emitHistoryAvailabilityChanges();
    }
    return changed;
  }

  public redo(): boolean {
    const changed = this.moveHistory.redo();
    if (changed) {
      this.emitHistoryAvailabilityChanges();
    }
    return changed;
  }

  public canUndo(): boolean {
    return this.moveHistory.canUndo();
  }

  public canRedo(): boolean {
    return this.moveHistory.canRedo();
  }

  public notifyResize(payload: ResizePayload): void {
    if (payload.main) {
      this.applyResize('main', payload.main);
    }
    if (payload.minimap) {
      this.applyResize('minimap', payload.minimap);
    }
  }

  public resizeMain(width: number, height: number): void {
    this.applyResize('main', { width, height });
  }

  public resizeMinimap(width: number, height: number): void {
    this.applyResize('minimap', { width, height });
  }

  public destroy(): void {
    this.logDebug('destroy:start');
    this.cancelViewportAnimation();
    this.unsubscribeViewportEvents();
    this.config.mainContainer.removeEventListener(NODE_SEARCH_REQUEST_EVENT, this.onNodeSearchRequestBound as EventListener);
    this.config.mainContainer.removeEventListener(UNHIGHLIGHT_REQUEST_EVENT, this.onUnhighlightRequestBound as EventListener);
    this.events.teardown();
    this.events.clearInteractionState();
    this.unbindHistoryShortcuts();
    this.debug.teardown(this.diagramService.getGraph(), this.diagramService.getPaper());
    this.modeManager.destroy();
    this.zoomManager.destroy();
    this.guidesManager.destroy();
    this.minimapManager.destroy();
    this.nodeSearchIndexManager.destroy();
    this.viewportManager.destroy();
    this.mapBoundsState.destroy();
    this.diagramService.destroy();
    this.logDebug('destroy:done');
  }

  private logDebug(message: string, ...payload: unknown[]): void {
    this.debug.log(message, ...payload);
  }

  private emitHistoryAvailabilityChanges(): void {
    const canUndo = this.moveHistory.canUndo();
    const canRedo = this.moveHistory.canRedo();

    if (canUndo !== this.previousCanUndo) {
      this.previousCanUndo = canUndo;
      this.config.mainContainer.dispatchEvent(
        new CustomEvent(TOPOLOGY_CAN_UNDO_CHANGE_EVENT, {
          detail: canUndo
        })
      );
    }

    if (canRedo !== this.previousCanRedo) {
      this.previousCanRedo = canRedo;
      this.config.mainContainer.dispatchEvent(
        new CustomEvent(TOPOLOGY_CAN_REDO_CHANGE_EVENT, {
          detail: canRedo
        })
      );
    }
  }

  private applyResize(target: 'main' | 'minimap', newSize: Size): void {
    if (newSize.width <= 1 || newSize.height <= 1) {
      this.logDebug(`${target}:resize:skip-invalid`, newSize);
      return;
    }

    const oldSize = this.getLastResizeSize(target);
    if (oldSize && oldSize.width === newSize.width && oldSize.height === newSize.height) {
      this.logDebug(`${target}:resize:skip`, newSize);
      return;
    }

    this.setLastResizeSize(target, newSize);
    this.logDebug(`${target}:resize:apply`, { newSize, oldSize });

    if (target === 'main') {
      this.diagramService.resize(newSize.width, newSize.height);
      this.mapBoundsState.refreshNow();
      this.viewportState.enforceConstraints();
    } else {
      this.minimapManager.resize(newSize.width, newSize.height);
    }
  }

  private getLastResizeSize(target: 'main' | 'minimap'): Size | undefined {
    if (target === 'main') {
      if (this.lastMainWidth > 1 && this.lastMainHeight > 1) {
        return { width: this.lastMainWidth, height: this.lastMainHeight };
      }
      return undefined;
    }

    if (this.lastMinimapWidth > 1 && this.lastMinimapHeight > 1) {
      return { width: this.lastMinimapWidth, height: this.lastMinimapHeight };
    }

    return undefined;
  }

  private setLastResizeSize(target: 'main' | 'minimap', size: Size): void {
    if (target === 'main') {
      this.lastMainWidth = size.width;
      this.lastMainHeight = size.height;
      return;
    }

    this.lastMinimapWidth = size.width;
    this.lastMinimapHeight = size.height;
  }

  private handleViewportStateChange(snapshot: ViewportStateSnapshot): void {
    const previousSnapshot = this.previousViewportSnapshot;
    this.previousViewportSnapshot = snapshot;

    if (!previousSnapshot || previousSnapshot.scale === snapshot.scale) {
      return;
    }

    this.config.mainContainer.dispatchEvent(
      new CustomEvent(SCALE_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          scale: snapshot.scale
        }
      })
    );
  }

  private handleNodeSearchRequest(event: Event): void {
    if (!(event instanceof CustomEvent) || !isNodeSearchRequestDetail(event.detail)) {
      return;
    }

    const { query } = event.detail;
    const mode = normalizeNodeSearchMode(event.detail.mode);
    const field: NodeSearchField = mode === 'idAndMove' ? 'id' : this.getVisibleNodeLabelField();
    const result =
      mode === 'idAndMove'
        ? this.focusNodeById(query, event.detail.durationMs ?? DEFAULT_FOCUS_ANIMATION_MS)
        : this.focusNodeByVisibleLabel(query, event.detail.durationMs ?? DEFAULT_FOCUS_ANIMATION_MS);

    const detail: NodeSearchResultDetail = result
      ? {
          ...result,
          query,
          mode,
          field,
          found: true
        }
      : {
          query,
          mode,
          field,
          found: false
        };

    this.config.mainContainer.dispatchEvent(
      new CustomEvent(NODE_SEARCH_RESULT_EVENT, {
        bubbles: true,
        composed: true,
        detail
      })
    );
  }

  private findElementByNodeId(nodeId: string | number): joint.dia.Element | null {
    const expectedNodeId = normalizeNodeLookupId(nodeId);
    if (!expectedNodeId) {
      return null;
    }

    return (
      this.diagramService
        .getGraph()
        .getElements()
        .find((element) => {
          const data = element.get('data');
          return isRecord(data) && String(data.id ?? '') === expectedNodeId;
        }) ?? null
    );
  }

  private animateViewportToElement(element: joint.dia.Element, durationMs: number, onComplete?: () => void): void {
    const bbox = element.getBBox();
    const size = this.diagramService.getSize();
    const snapshot = this.viewportState.getSnapshot();
    if (size.width <= 1 || size.height <= 1 || bbox.width <= 0 || bbox.height <= 0) {
      return;
    }

    const targetCenterX = bbox.x + bbox.width / 2;
    const targetCenterY = bbox.y + bbox.height / 2;
    const rawTargetTx = size.width / 2 - targetCenterX * snapshot.scale;
    const rawTargetTy = size.height / 2 - targetCenterY * snapshot.scale;
    const bounds = this.diagramService.getTranslateBounds(snapshot.scale);
    const minTx = Math.min(bounds.minTx, bounds.maxTx);
    const maxTx = Math.max(bounds.minTx, bounds.maxTx);
    const minTy = Math.min(bounds.minTy, bounds.maxTy);
    const maxTy = Math.max(bounds.minTy, bounds.maxTy);
    const targetTx = clamp(rawTargetTx, minTx, maxTx);
    const targetTy = clamp(rawTargetTy, minTy, maxTy);
    const duration = Math.max(0, Math.round(durationMs));

    this.cancelViewportAnimation();

    if (duration === 0) {
      this.viewportState.setTranslate(targetTx, targetTy);
      onComplete?.();
      return;
    }

    const startTx = snapshot.tx;
    const startTy = snapshot.ty;
    const startTime = performance.now();
    const step = (now: number): void => {
      const elapsed = now - startTime;
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = 1 - (1 - progress) ** 3;
      const nextTx = startTx + (targetTx - startTx) * eased;
      const nextTy = startTy + (targetTy - startTy) * eased;

      this.viewportState.setTranslate(nextTx, nextTy);
      if (progress >= 1) {
        this.viewportAnimationFrameId = 0;
        onComplete?.();
        return;
      }

      this.viewportAnimationFrameId = window.requestAnimationFrame(step);
    };

    this.viewportAnimationFrameId = window.requestAnimationFrame(step);
  }

  private cancelViewportAnimation(): void {
    if (this.viewportAnimationFrameId === 0) {
      return;
    }

    window.cancelAnimationFrame(this.viewportAnimationFrameId);
    this.viewportAnimationFrameId = 0;
  }

  private fitToContent(mode: FitMode): void {
    const fittedViewport = fitPaperToContent(
      this.diagramService.getPaper(),
      this.mapBoundsState.get(),
      this.diagramService.getSize(),
      this.viewportState.getSnapshot(),
      mode,
      DEFAULT_PADDING
    );
    if (!fittedViewport) {
      return;
    }

    const fitModeName = mode === 'page' ? 'Page' : mode === 'width' ? 'Width' : 'Height';
    this.logDebug(`fitTo${fitModeName}`, { padding: DEFAULT_PADDING, scale: fittedViewport.scale });
    this.viewportState.setViewport(fittedViewport.scale, fittedViewport.tx, fittedViewport.ty);
  }

  private applyMapPaperConfig(paperConfig: PaperConfig): void {
    this.currentPaperConfig = { ...paperConfig };
    setStencilDir(paperConfig.stencilDir ?? '/stencils');
    this.editMode.setGridSize(paperConfig.gridSize ?? this.config.gridSize);
    this.diagramService.applyPaperConfig(paperConfig);
    this.logDebug('applyPaperConfig', paperConfig);
  }
}
