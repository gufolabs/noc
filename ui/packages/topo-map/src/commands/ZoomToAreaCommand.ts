import type { Command, Rect } from '../core/types';
import { ZoomManager } from '../managers/ZoomManager';

export class ZoomToAreaCommand implements Command {
  private readonly zoomManager: ZoomManager;

  private readonly rect: Rect;

  public constructor(zoomManager: ZoomManager, rect: Rect) {
    this.zoomManager = zoomManager;
    this.rect = rect;
  }

  public execute(): void {
    this.zoomManager.zoomToRect(this.rect);
  }
}
