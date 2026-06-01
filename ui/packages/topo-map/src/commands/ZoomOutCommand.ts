import type { Command } from '../core/types';
import { ZoomManager } from '../managers/ZoomManager';

export class ZoomOutCommand implements Command {
  private readonly zoomManager: ZoomManager;

  public constructor(zoomManager: ZoomManager) {
    this.zoomManager = zoomManager;
  }

  public execute(): void {
    this.zoomManager.zoomOut();
  }
}
