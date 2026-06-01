import * as joint from '@joint/core';

type DebugHandler = (eventName: string, ...args: unknown[]) => void;

interface EventEmitterLike {
  on(eventName: string, callback: DebugHandler): void;
  off(eventName: string, callback: DebugHandler): void;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export class Debug {
  private readonly enabled: boolean;

  private readonly debugDisposers: Array<() => void> = [];

  private graphDebugHandler: DebugHandler | null = null;

  private paperDebugHandler: DebugHandler | null = null;

  public constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  public setup(
    graph: joint.dia.Graph,
    paper: joint.dia.Paper,
    subscribeToViewport: (listener: (snapshot: unknown) => void) => () => void
  ): void {
    if (!this.enabled) {
      return;
    }

    const viewportDisposer = subscribeToViewport((snapshot) => {
      this.log('viewport', snapshot);
    });
    this.debugDisposers.push(viewportDisposer);

    const graphEmitter = graph as unknown as EventEmitterLike;
    this.graphDebugHandler = (eventName: string, ...args: unknown[]) => {
      this.log(`graph:${eventName}`, ...args.map((arg) => this.summarizeArg(arg)));
    };
    graphEmitter.on('all', this.graphDebugHandler);

    const paperEmitter = paper as unknown as EventEmitterLike;
    this.paperDebugHandler = (eventName: string, ...args: unknown[]) => {
      this.log(`paper:${eventName}`, ...args.map((arg) => this.summarizeArg(arg)));
    };
    paperEmitter.on('all', this.paperDebugHandler);
  }

  public teardown(graph: joint.dia.Graph, paper: joint.dia.Paper): void {
    if (!this.enabled) {
      return;
    }

    while (this.debugDisposers.length > 0) {
      const disposer = this.debugDisposers.pop();
      disposer?.();
    }

    const graphEmitter = graph as unknown as EventEmitterLike;
    if (this.graphDebugHandler) {
      graphEmitter.off('all', this.graphDebugHandler);
      this.graphDebugHandler = null;
    }

    const paperEmitter = paper as unknown as EventEmitterLike;
    if (this.paperDebugHandler) {
      paperEmitter.off('all', this.paperDebugHandler);
      this.paperDebugHandler = null;
    }
  }

  public log(message: string, ...payload: unknown[]): void {
    if (!this.enabled) {
      return;
    }

    console.log('[Topology]', message, ...payload);
  }

  private summarizeArg(value: unknown): unknown {
    if (value instanceof joint.dia.Cell) {
      const type = value.get('type');
      return {
        id: String(value.id),
        type: typeof type === 'string' ? type : 'unknown',
        isLink: value.isLink()
      };
    }

    if (value instanceof joint.dia.CellView) {
      return {
        view: value.cid,
        modelId: String(value.model.id),
        modelType: value.model.get('type')
      };
    }

    if (isObject(value) && 'width' in value && 'height' in value) {
      const width = value.width;
      const height = value.height;
      if (typeof width === 'number' && typeof height === 'number') {
        return { width, height };
      }
    }

    return value;
  }
}
