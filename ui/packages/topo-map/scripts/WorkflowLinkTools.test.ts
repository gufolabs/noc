import * as joint from '@joint/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWorkflowLinkTools } from '../src/workflow/internal/linkTools';

class FakeVerticesTool {
  public readonly cid = 'fake-vertices';

  public readonly options: joint.linkTools.Vertices.Options;

  public relatedView!: joint.dia.LinkView & { model: joint.dia.Link };

  public constructor(options?: joint.linkTools.Vertices.Options) {
    this.options = options ?? {};
  }

  public guard(): boolean {
    return false;
  }

  public onHandleWillChange(): void {
    return;
  }

  public onHandleChanged(): void {
    return;
  }
}

const originalVertices = joint.linkTools.Vertices;
const originalSegments = joint.linkTools.Segments;
const originalRemove = joint.linkTools.Remove;

afterEach(() => {
  joint.linkTools.Vertices = originalVertices;
  joint.linkTools.Segments = originalSegments;
  joint.linkTools.Remove = originalRemove;
  vi.restoreAllMocks();
});

describe('workflow link tools', () => {
  it('invokes vertex drag callbacks on start and end', () => {
    joint.linkTools.Vertices = FakeVerticesTool as unknown as typeof joint.linkTools.Vertices;
    joint.linkTools.Segments = undefined as unknown as typeof joint.linkTools.Segments;
    joint.linkTools.Remove = undefined as unknown as typeof joint.linkTools.Remove;

    const onVertexMoveStart = vi.fn();
    const onVertexMoveEnd = vi.fn();
    const link = new joint.shapes.standard.Link({
      id: 'link-a',
      type: 'workflow.Transition'
    });

    const [verticesTool] = createWorkflowLinkTools(20, {
      onVertexMoveStart,
      onVertexMoveEnd
    }) as unknown as Array<
      FakeVerticesTool & {
        onHandleWillChange(handle: { options: { index: number } }, event: joint.dia.Event): void;
        onHandleChanged(handle: { options: { index: number } }, event: joint.dia.Event): void;
      }
    >;

    expect(verticesTool).toBeDefined();
    if (!verticesTool) {
      return;
    }

    verticesTool.relatedView = { model: link } as joint.dia.LinkView & { model: joint.dia.Link };

    verticesTool.onHandleWillChange({ options: { index: 1 } }, {} as joint.dia.Event);
    verticesTool.onHandleChanged({ options: { index: 1 } }, {} as joint.dia.Event);

    expect(onVertexMoveStart).toHaveBeenCalledWith(link, 1);
    expect(onVertexMoveEnd).toHaveBeenCalledWith(link);
  });
});
