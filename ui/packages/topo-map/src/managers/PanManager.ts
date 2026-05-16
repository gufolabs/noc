import { ViewportState } from '../core/ViewportState';

interface PanSession {
  startClientX: number;
  startClientY: number;
  startTx: number;
  startTy: number;
}

export class PanManager {
  private readonly viewportState: ViewportState;

  private session: PanSession | null = null;

  public constructor(viewportState: ViewportState) {
    this.viewportState = viewportState;
  }

  public start(clientX: number, clientY: number): void {
    const snapshot = this.viewportState.getSnapshot();
    this.session = {
      startClientX: clientX,
      startClientY: clientY,
      startTx: snapshot.tx,
      startTy: snapshot.ty
    };
  }

  public move(clientX: number, clientY: number): void {
    if (!this.session) {
      return;
    }

    const dx = clientX - this.session.startClientX;
    const dy = clientY - this.session.startClientY;

    this.viewportState.setTranslate(this.session.startTx + dx, this.session.startTy + dy);
  }

  public end(): void {
    this.session = null;
  }

  public isPanning(): boolean {
    return this.session !== null;
  }
}
