import * as joint from '@joint/core';

export interface ApplyWorkflowLayoutOptions {
  rankDir?: 'TB' | 'BT' | 'LR' | 'RL';
  marginX?: number;
  marginY?: number;
  nodeSep?: number;
  edgeSep?: number;
}

export function applyWorkflowLayout(
  graph: joint.dia.Graph,
  options: ApplyWorkflowLayoutOptions = {}
): void {
  const directedGraph = (joint.layout as { DirectedGraph?: { layout?: (graph: joint.dia.Graph, options: object) => void } })
    .DirectedGraph;
  if (!directedGraph?.layout) {
    console.warn('[applyWorkflowLayout] joint.layout.DirectedGraph is not available. Auto-layout skipped.');
    return;
  }

  graph.getLinks().forEach((link) => {
    link.vertices([]);
  });

  directedGraph.layout(graph, {
    marginX: options.marginX ?? 50,
    marginY: options.marginY ?? 50,
    nodeSep: options.nodeSep ?? 100,
    edgeSep: options.edgeSep ?? 80,
    rankDir: options.rankDir ?? 'TB'
  });
}
