import * as joint from '@joint/core';

interface VertexToolCallbacks {
  onVertexMoveStart?: (link: joint.dia.Link, index: number) => void;
  onVertexMoveEnd?: (link: joint.dia.Link) => void;
}

type EditableLinkView = joint.dia.LinkView & {
  getVertexIndex(x: number, y: number): number;
  checkMouseleave(event: joint.dia.Event): void;
  paper: joint.dia.Paper;
  model: joint.dia.Link;
};

type GuardedTool = {
  guard(event: joint.dia.Event): boolean;
};

type VerticesToolInstance = joint.dia.ToolView<joint.dia.LinkView> & {
  cid: string;
  paper: joint.dia.Paper;
  relatedView: EditableLinkView;
  options: joint.linkTools.Vertices.Options;
  snapVertex(vertex: joint.g.PlainPoint, index: number): void;
  update(): VerticesToolInstance;
  onHandleChanging(
    handle: { options: { index: number }; position(x: number, y: number): void },
    event: joint.dia.Event
  ): void;
  onHandleWillChange(handle: { options: { index: number } }, event: joint.dia.Event): void;
  onHandleChanged(handle: { options: { index: number } }, event: joint.dia.Event): void;
  onPathPointerDown(event: joint.dia.Event): void;
};

function normalizeGridSize(gridSize: number): number {
  return Number.isFinite(gridSize) && gridSize > 0 ? Math.round(gridSize) : 1;
}

export function snapPointToGrid(point: joint.g.PlainPoint, gridSize: number): joint.g.PlainPoint {
  const normalizedGridSize = normalizeGridSize(gridSize);

  return {
    x: Math.round(point.x / normalizedGridSize) * normalizedGridSize,
    y: Math.round(point.y / normalizedGridSize) * normalizedGridSize
  };
}

export function getWorkflowVertexToolOptions(): joint.linkTools.Vertices.Options {
  return {
    vertexAdding: true,
    vertexMoving: true,
    vertexRemoving: true
  };
}

function createVerticesTool(gridSize: number, callbacks?: VertexToolCallbacks): joint.dia.ToolView | null {
  const verticesToolCtor = (joint.linkTools as {
    Vertices?: new (options?: joint.linkTools.Vertices.Options) => joint.linkTools.Vertices;
  }).Vertices;
  if (!verticesToolCtor) {
    return null;
  }

  const tool = new verticesToolCtor(getWorkflowVertexToolOptions()) as unknown as VerticesToolInstance;

  const baseOnHandleWillChange =
    tool.onHandleWillChange?.bind(tool) ??
    ((_handle: { options: { index: number } }, _event: joint.dia.Event): void => undefined);
  const baseOnHandleChanged =
    tool.onHandleChanged?.bind(tool) ??
    ((_handle: { options: { index: number } }, _event: joint.dia.Event): void => undefined);

  tool.onHandleWillChange = function onHandleWillChange(
    handle: { options: { index: number } },
    event: joint.dia.Event
  ): void {
    baseOnHandleWillChange(handle, event);
    callbacks?.onVertexMoveStart?.(this.relatedView.model, handle.options.index);
  };

  tool.onHandleChanging = function onHandleChanging(
    handle: { options: { index: number }; position(x: number, y: number): void },
    event: joint.dia.Event
  ): void {
    const guardedTool = this as VerticesToolInstance;
    const linkView = guardedTool.relatedView;
    const index = handle.options.index;
    const [normalizedEvent, x, y] = linkView.paper.getPointerArgs(event);
    const vertex = snapPointToGrid({ x, y }, gridSize);

    guardedTool.snapVertex(vertex, index);
    linkView.model.vertex(index, vertex, { ui: true, tool: guardedTool.cid });
    handle.position(vertex.x, vertex.y);

    if (!guardedTool.options.stopPropagation) {
      (linkView as unknown as { notifyPointermove(event: joint.dia.Event, x: number, y: number): void }).notifyPointermove(
        normalizedEvent,
        x,
        y
      );
    }
  };

  tool.onHandleChanged = function onHandleChanged(
    handle: { options: { index: number } },
    event: joint.dia.Event
  ): void {
    baseOnHandleChanged(handle, event);
    callbacks?.onVertexMoveEnd?.(this.relatedView.model);
  };

  tool.onPathPointerDown = function onPathPointerDown(event: joint.dia.Event): void {
    const guardedTool = this as VerticesToolInstance & GuardedTool;
    if (guardedTool.guard(event)) {
      return;
    }

    event.stopPropagation?.();
    event.preventDefault?.();

    const relatedView = guardedTool.relatedView;
    const [normalizedEvent, x, y] = relatedView.paper.getPointerArgs(event);
    const vertex = snapPointToGrid({ x, y }, gridSize);

    relatedView.model.startBatch('vertex-add', { ui: true, tool: guardedTool.cid });
    const index = relatedView.getVertexIndex(vertex.x, vertex.y);
    guardedTool.snapVertex(vertex, index);
    relatedView.model.insertVertex(index, vertex, { ui: true, tool: guardedTool.cid });
    guardedTool.update();
    relatedView.model.stopBatch('vertex-add', { ui: true, tool: guardedTool.cid });
    relatedView.checkMouseleave(normalizedEvent);
  };

  return tool as unknown as joint.dia.ToolView;
}

export function createWorkflowLinkTools(gridSize: number, callbacks?: VertexToolCallbacks): joint.dia.ToolView[] {
  const tools: joint.dia.ToolView[] = [];

  const verticesTool = createVerticesTool(gridSize, callbacks);
  if (verticesTool) {
    tools.push(verticesTool);
  }

  const segmentsToolCtor = (joint.linkTools as {
    Segments?: new (options?: joint.linkTools.Segments.Options) => joint.linkTools.Segments;
  }).Segments;
  if (segmentsToolCtor) {
    tools.push(new segmentsToolCtor());
  }

  const removeToolCtor = (joint.linkTools as { Remove?: new () => joint.dia.ToolView }).Remove;
  if (removeToolCtor) {
    tools.push(new removeToolCtor());
  }

  return tools;
}
