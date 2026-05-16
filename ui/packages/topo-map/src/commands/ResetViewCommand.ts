import type { Command } from '../core/types';
import { ZoomManager } from '../managers/ZoomManager';

export class ResetViewCommand implements Command {
  private readonly zoomManager: ZoomManager;

  public constructor(zoomManager: ZoomManager) {
    this.zoomManager = zoomManager;
  }

  public execute(): void {
    this.zoomManager.reset();
  }
}
