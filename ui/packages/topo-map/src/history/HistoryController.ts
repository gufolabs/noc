export interface HistoryEntry<TSnapshot> {
  before: TSnapshot;
  after: TSnapshot;
}

export interface HistoryControllerOptions<TSnapshot> {
  clone: (snapshot: TSnapshot) => TSnapshot;
  equals: (left: TSnapshot, right: TSnapshot) => boolean;
  limit?: number;
}

const DEFAULT_HISTORY_LIMIT = 100;

export class HistoryController<TSnapshot> {
  private readonly cloneSnapshot: (snapshot: TSnapshot) => TSnapshot;

  private readonly equalsSnapshot: (left: TSnapshot, right: TSnapshot) => boolean;

  private readonly limit: number;

  private undoStack: Array<HistoryEntry<TSnapshot>> = [];

  private redoStack: Array<HistoryEntry<TSnapshot>> = [];

  private pendingBefore: TSnapshot | null = null;

  private replayDepth = 0;

  public constructor(options: HistoryControllerOptions<TSnapshot>) {
    this.cloneSnapshot = options.clone;
    this.equalsSnapshot = options.equals;
    this.limit = Number.isFinite(options.limit) && (options.limit ?? 0) > 0
      ? Math.trunc(options.limit as number)
      : DEFAULT_HISTORY_LIMIT;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public isReplayInProgress(): boolean {
    return this.replayDepth > 0;
  }

  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.pendingBefore = null;
  }

  public begin(snapshot: TSnapshot): void {
    if (this.isReplayInProgress()) {
      return;
    }
    this.pendingBefore = this.cloneSnapshot(snapshot);
  }

  public cancel(): void {
    this.pendingBefore = null;
  }

  public commit(snapshot: TSnapshot): boolean {
    if (this.pendingBefore === null) {
      return false;
    }

    const recorded = this.record(this.pendingBefore, snapshot);
    this.pendingBefore = null;
    return recorded;
  }

  public record(before: TSnapshot, after: TSnapshot): boolean {
    if (this.isReplayInProgress()) {
      return false;
    }

    const nextEntry: HistoryEntry<TSnapshot> = {
      before: this.cloneSnapshot(before),
      after: this.cloneSnapshot(after)
    };
    if (this.equalsSnapshot(nextEntry.before, nextEntry.after)) {
      return false;
    }

    this.undoStack.push(nextEntry);
    if (this.undoStack.length > this.limit) {
      this.undoStack.splice(0, this.undoStack.length - this.limit);
    }
    this.redoStack = [];
    return true;
  }

  public undo(apply: (snapshot: TSnapshot) => void): boolean {
    const entry = this.undoStack.pop();
    if (!entry) {
      return false;
    }

    this.redoStack.push(entry);
    this.runReplay(() => {
      apply(this.cloneSnapshot(entry.before));
    });
    return true;
  }

  public redo(apply: (snapshot: TSnapshot) => void): boolean {
    const entry = this.redoStack.pop();
    if (!entry) {
      return false;
    }

    this.undoStack.push(entry);
    this.runReplay(() => {
      apply(this.cloneSnapshot(entry.after));
    });
    return true;
  }

  private runReplay(callback: () => void): void {
    this.replayDepth++;
    try {
      callback();
    } finally {
      this.replayDepth--;
    }
  }
}
