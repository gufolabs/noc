import * as joint from '@joint/core';
import { describe, expect, it } from 'vitest';
import { TopologyMoveHistory } from '../src/topology/TopologyMoveHistory';

describe('TopologyMoveHistory', () => {
  it('undoes and redoes element moves', () => {
    const graph = new joint.dia.Graph();
    const element = new joint.shapes.standard.Rectangle({
      id: 'node-a',
      position: { x: 20, y: 30 }
    });
    graph.addCell(element);
    const history = new TopologyMoveHistory(graph);

    history.begin(element);
    element.position(140, 160);
    history.commit(element);

    expect(history.canUndo()).toBe(true);
    expect(element.position()).toEqual({ x: 140, y: 160 });

    history.undo();
    expect(element.position()).toEqual({ x: 20, y: 30 });

    history.redo();
    expect(element.position()).toEqual({ x: 140, y: 160 });
  });

  it('skips no-op moves', () => {
    const graph = new joint.dia.Graph();
    const element = new joint.shapes.standard.Rectangle({
      id: 'node-a',
      position: { x: 20, y: 30 }
    });
    graph.addCell(element);
    const history = new TopologyMoveHistory(graph);

    history.begin(element);
    history.commit(element);

    expect(history.canUndo()).toBe(false);
  });
});
