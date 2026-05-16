import type * as joint from '@joint/core';

interface PositionSnapshot {
  x: number;
  y: number;
}

interface MoveEntry {
  cellId: string;
  before: PositionSnapshot;
  after: PositionSnapshot;
}

interface ActiveMove {
  cellId: string;
  before: PositionSnapshot;
}

const DEFAULT_HISTORY_LIMIT = 100;

function samePosition(left: PositionSnapshot, right: PositionSnapshot): boolean {
  return left.x === right.x && left.y === right.y;
}

export class TopologyMoveHistory {
  private readonly graph: joint.dia.Graph;

  private readonly limit: number;

  private undoStack: MoveEntry[] = [];

  private redoStack: MoveEntry[] = [];

  private activeMove: ActiveMove | null = null;

  public constructor(graph: joint.dia.Graph, limit = DEFAULT_HISTORY_LIMIT) {
    this.graph = graph;
    this.limit = Number.isFinite(limit) && limit > 0 ? Math.trunc(limit) : DEFAULT_HISTORY_LIMIT;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.activeMove = null;
  }

  public begin(cell: joint.dia.Cell | null | undefined): void {
    if (!cell?.isElement()) {
      this.activeMove = null;
      return;
    }

    const position = cell.position();
    this.activeMove = {
      cellId: String(cell.id),
      before: {
        x: position.x,
        y: position.y
      }
    };
  }

  public commit(cell: joint.dia.Cell | null | undefined): boolean {
    if (!cell?.isElement() || this.activeMove === null || this.activeMove.cellId !== String(cell.id)) {
      this.activeMove = null;
      return false;
    }

    const after = cell.position();
    const entry: MoveEntry = {
      cellId: this.activeMove.cellId,
      before: this.activeMove.before,
      after: {
        x: after.x,
        y: after.y
      }
    };
    this.activeMove = null;

    if (samePosition(entry.before, entry.after)) {
      return false;
    }

    this.undoStack.push(entry);
    if (this.undoStack.length > this.limit) {
      this.undoStack.splice(0, this.undoStack.length - this.limit);
    }
    this.redoStack = [];
    return true;
  }

  public cancel(): void {
    this.activeMove = null;
  }

  public undo(): boolean {
    const entry = this.undoStack.pop();
    if (!entry) {
      return false;
    }
    this.redoStack.push(entry);
    this.applyPosition(entry.cellId, entry.before);
    return true;
  }

  public redo(): boolean {
    const entry = this.redoStack.pop();
    if (!entry) {
      return false;
    }
    this.undoStack.push(entry);
    this.applyPosition(entry.cellId, entry.after);
    return true;
  }

  private applyPosition(cellId: string, position: PositionSnapshot): void {
    const cell = this.graph.getCell(cellId);
    if (!cell?.isElement()) {
      return;
    }
    cell.position(position.x, position.y, { deep: true });
  }
}
