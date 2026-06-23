import { describe, expect, it, vi } from 'vitest';
import { clonePlain } from '../src/workflow/clonePlain';
import { createWorkflowHistoryController } from '../src/workflow/internal/history';
import type { WorkflowEditorRuntime } from '../src/workflow/internal/runtime';
import type { WorkflowDocument } from '../src/workflow/types';

function createWorkflow(name = 'Workflow'): WorkflowDocument {
  return {
    name,
    states: [],
    transitions: []
  };
}

function createRuntime(initialWorkflow: WorkflowDocument): WorkflowEditorRuntime {
  const runtime = {
    state: {
      workflow: clonePlain(initialWorkflow)
    },
    flushScheduledGraphSync: vi.fn(),
    setDirty: vi.fn(),
    emitCanUndoChange: vi.fn(),
    emitCanRedoChange: vi.fn()
  } as unknown as WorkflowEditorRuntime;

  runtime.history = createWorkflowHistoryController(runtime, (snapshot) => {
    runtime.state.workflow = clonePlain(snapshot);
  });
  runtime.history.reset(clonePlain(initialWorkflow));
  return runtime;
}

describe('workflow history controller', () => {
  it('records explicit changes and replays undo/redo', () => {
    const before = createWorkflow('Initial');
    const after = createWorkflow('Renamed');
    const runtime = createRuntime(before);

    runtime.state.workflow = clonePlain(after);
    runtime.history.recordChange(before, after);

    expect(runtime.emitCanUndoChange).toHaveBeenCalledWith(true);

    expect(runtime.history.canUndo()).toBe(true);

    runtime.history.undo();
    expect(runtime.state.workflow).toEqual(before);
    expect(runtime.emitCanRedoChange).toHaveBeenCalledWith(true);

    runtime.history.redo();
    expect(runtime.state.workflow).toEqual(after);
  });

  it('captures gesture transactions as a single history step', () => {
    const before = createWorkflow('Initial');
    const after = {
      ...createWorkflow('Initial'),
      states: [{ id: 'state-a', name: 'A', x: 120, y: 80 }]
    };
    const runtime = createRuntime(before);

    runtime.history.beginGesture('state-move');
    runtime.state.workflow = clonePlain(after);
    runtime.history.commitGesture('state-move');

    expect(runtime.history.canUndo()).toBe(true);

    runtime.history.undo();
    expect(runtime.state.workflow).toEqual(before);
  });
});
