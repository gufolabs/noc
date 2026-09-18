import * as joint from '@joint/core';
import { afterEach, describe, expect, it } from 'vitest';
import { WorkflowSpatialIndex } from '../src/workflow/internal/spatialIndex';

function createState(id: string, x: number, y: number, width = 100, height = 40): joint.shapes.standard.Rectangle {
  return new joint.shapes.standard.Rectangle({
    id,
    type: 'workflow.State',
    position: { x, y },
    size: { width, height }
  });
}

function createTransition(id: string, sourceId: string, targetId: string): joint.shapes.standard.Link {
  return new joint.shapes.standard.Link({
    id,
    type: 'workflow.Transition',
    source: { id: sourceId },
    target: { id: targetId }
  });
}

const indexes: WorkflowSpatialIndex[] = [];

afterEach(() => {
  while (indexes.length > 0) {
    indexes.pop()?.destroy();
  }
});

describe('WorkflowSpatialIndex', () => {
  it('indexes only workflow states for nearby search', () => {
    const graph = new joint.dia.Graph();
    const stateA = createState('state-a', 20, 20);
    const stateB = createState('state-b', 320, 20);
    const transition = createTransition('transition-a', 'state-a', 'state-b');
    graph.addCells([stateA, stateB, transition]);

    const index = new WorkflowSpatialIndex(graph);
    indexes.push(index);

    const found = index.searchNearby({ x: 0, y: 0, width: 160, height: 120 }).map((item) => String(item.id));

    expect(found).toEqual(['state-a']);
  });

  it('updates the index when a state position changes', () => {
    const graph = new joint.dia.Graph();
    const state = createState('state-a', 20, 20);
    graph.addCell(state);

    const index = new WorkflowSpatialIndex(graph);
    indexes.push(index);

    expect(index.searchNearby({ x: 0, y: 0, width: 160, height: 120 }).map((item) => String(item.id))).toEqual([
      'state-a'
    ]);

    state.position(400, 240);

    expect(index.searchNearby({ x: 0, y: 0, width: 160, height: 120 })).toEqual([]);
    expect(index.searchNearby({ x: 360, y: 200, width: 200, height: 120 }).map((item) => String(item.id))).toEqual([
      'state-a'
    ]);
  });

  it('updates the index when a state is resized or removed', () => {
    const graph = new joint.dia.Graph();
    const state = createState('state-a', 20, 20, 80, 40);
    graph.addCell(state);

    const index = new WorkflowSpatialIndex(graph);
    indexes.push(index);

    expect(index.searchNearby({ x: 101, y: 20, width: 20, height: 40 })).toEqual([]);

    state.resize(140, 40);

    expect(index.searchNearby({ x: 101, y: 20, width: 20, height: 40 }).map((item) => String(item.id))).toEqual([
      'state-a'
    ]);

    state.remove();

    expect(index.searchNearby({ x: 0, y: 0, width: 200, height: 120 })).toEqual([]);
  });
});
