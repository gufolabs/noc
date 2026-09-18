import * as joint from '@joint/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bindEvents } from '../src/workflow/internal/bindings';
import type { WorkflowEditorRuntime } from '../src/workflow/internal/runtime';

type PaperHandler = (...args: unknown[]) => void;

interface PaperStub {
  paper: joint.dia.Paper;
  handlers: Map<string, PaperHandler>;
}

function createPaperStub(): PaperStub {
  const handlers = new Map<string, PaperHandler>();

  return {
    paper: {
      on: vi.fn((eventName: string, handler: PaperHandler) => {
        handlers.set(eventName, handler);
      })
    } as unknown as joint.dia.Paper,
    handlers
  };
}

function createRuntime(): {
  runtime: WorkflowEditorRuntime;
  handlers: Map<string, PaperHandler>;
  graph: joint.dia.Graph;
} {
  const { paper, handlers } = createPaperStub();
  const graph = new joint.dia.Graph();

  const runtime = {
    config: {
      wheelZoom: false
    },
    state: {
      mode: 'edit',
      activeDragElementId: null,
      activeVertexDrag: null,
      panState: null,
      tx: 0,
      ty: 0,
      scale: 1,
      suspendDocumentSyncDepth: 0,
      selectedCellId: null
    },
    paper,
    graph,
    paperHost: {
      style: {},
      addEventListener: vi.fn()
    },
    history: {
      beginGesture: vi.fn(),
      commitGesture: vi.fn(),
      cancelGesture: vi.fn(),
      beginImplicitChange: vi.fn(),
      commitImplicitChange: vi.fn(),
      cancelImplicitChange: vi.fn(),
      recordChange: vi.fn(),
      reset: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn(),
      canRedo: vi.fn(),
      isReplayInProgress: vi.fn(),
      syncDirtyState: vi.fn()
    },
    selectCell: vi.fn(),
    beginLinkCreation: vi.fn(),
    endLinkCreationSoon: vi.fn(),
    prepareLinkData: vi.fn(),
    syncWorkflowFromGraph: vi.fn(),
    markDocumentChanged: vi.fn(),
    endLinkCreation: vi.fn(),
    emitContextMenu: vi.fn(),
    getSelection: vi.fn(),
    decorateState: vi.fn(),
    scheduleGraphSync: vi.fn(),
    updateGuidesForElement: vi.fn(),
    updateGuidesForPoint: vi.fn(),
    clearGuides: vi.fn(),
    setZoom: vi.fn()
  } as unknown as WorkflowEditorRuntime;

  bindEvents(runtime);

  return { runtime, handlers, graph };
}

function createState(id: string): joint.shapes.standard.Rectangle {
  return new joint.shapes.standard.Rectangle({
    id,
    type: 'workflow.State',
    position: { x: 20, y: 20 },
    size: { width: 100, height: 40 }
  });
}

function createLink(id: string): joint.shapes.standard.Link {
  return new joint.shapes.standard.Link({
    id,
    type: 'workflow.Transition',
    source: { id: 'state-a' },
    target: { id: 'state-b' }
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('workflow bindings guides integration', () => {
  it('updates guides while dragging the active element in edit mode', () => {
    const { runtime, handlers, graph } = createRuntime();
    const state = createState('state-a');
    graph.addCell(state);
    const elementView = { model: state } as unknown as joint.dia.ElementView;

    handlers.get('element:pointerdown')?.(elementView, { button: 0, which: 1 });
    state.position(120, 80);

    expect(runtime.state.activeDragElementId).toBe('state-a');
    expect(runtime.updateGuidesForElement).toHaveBeenCalledWith(state);
    expect(runtime.scheduleGraphSync).toHaveBeenCalledWith({
      selectionChange: false
    });
  });

  it('clears guides and drag state on pointerup', () => {
    const { runtime, handlers } = createRuntime();
    runtime.state.activeDragElementId = 'state-a';
    runtime.state.activeVertexDrag = {
      linkId: 'link-a',
      index: 0
    };

    handlers.get('cell:pointerup')?.();

    expect(runtime.state.activeDragElementId).toBeNull();
    expect(runtime.state.activeVertexDrag).toBeNull();
    expect(runtime.clearGuides).toHaveBeenCalledTimes(1);
    expect(runtime.endLinkCreationSoon).toHaveBeenCalledTimes(1);
  });

  it('does not update guides outside edit mode', () => {
    const { runtime, handlers, graph } = createRuntime();
    runtime.state.mode = 'pan';
    runtime.state.activeDragElementId = 'state-a';
    const state = createState('state-a');
    graph.addCell(state);
    const elementView = { model: state } as unknown as joint.dia.ElementView;

    handlers.get('element:pointerdown')?.(elementView, { button: 0, which: 1 });
    state.position(120, 80);

    expect(runtime.state.activeDragElementId).toBe('state-a');
    expect(runtime.updateGuidesForElement).not.toHaveBeenCalled();
  });

  it('updates point guides while dragging a link vertex in edit mode', () => {
    const { runtime, graph } = createRuntime();
    const link = createLink('link-a');
    graph.addCell(link);
    runtime.state.activeVertexDrag = {
      linkId: 'link-a',
      index: 0
    };

    link.vertices([{ x: 140, y: 90 }]);

    expect(runtime.updateGuidesForPoint).toHaveBeenCalledWith({
      x: 140,
      y: 90
    });
    expect(runtime.scheduleGraphSync).toHaveBeenCalledWith({
      selectionChange: false
    });
  });
});
