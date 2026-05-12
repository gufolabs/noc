import type { Command } from '../core/types';
import { ZoomManager } from '../managers/ZoomManager';

export class ZoomInCommand implements Command {
  private readonly zoomManager: ZoomManager;

  public constructor(zoomManager: ZoomManager) {
    this.zoomManager = zoomManager;
  }

  public execute(): void {
    this.zoomManager.zoomIn();
  }
}
