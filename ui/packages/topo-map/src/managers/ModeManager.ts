import * as joint from '@joint/core';
import type { Mode } from '../core/types';
import { InteractionMode } from '../modes/InteractionMode';

export class ModeManager {
  private readonly paper: joint.dia.Paper;

  private readonly modes: Record<Mode, InteractionMode>;

  private activeModeKey: Mode;

  private readonly onBlankPointerDownBound = (event: joint.dia.Event, x: number, y: number): void => {
    this.getActiveMode().onBlankPointerDown(event, x, y);
  };

  private readonly onBlankPointerMoveBound = (event: joint.dia.Event, x: number, y: number): void => {
    this.getActiveMode().onBlankPointerMove(event, x, y);
  };

  private readonly onBlankPointerUpBound = (event: joint.dia.Event, x: number, y: number): void => {
    this.getActiveMode().onBlankPointerUp(event, x, y);
  };

  private readonly onElementPointerDownBound = (
    elementView: joint.dia.ElementView,
    event: joint.dia.Event,
    x: number,
    y: number
  ): void => {
    this.getActiveMode().onElementPointerDown(elementView, event, x, y);
  };

  private readonly onElementPointerMoveBound = (
    elementView: joint.dia.ElementView,
    event: joint.dia.Event,
    x: number,
    y: number
  ): void => {
    this.getActiveMode().onElementPointerMove(elementView, event, x, y);
  };

  private readonly onElementPointerUpBound = (
    elementView: joint.dia.ElementView,
    event: joint.dia.Event,
    x: number,
    y: number
  ): void => {
    this.getActiveMode().onElementPointerUp(elementView, event, x, y);
  };

  public constructor(paper: joint.dia.Paper, modes: Record<Mode, InteractionMode>, initialMode: Mode) {
    this.paper = paper;
    this.modes = modes;
    this.activeModeKey = initialMode;

    this.paper.on('blank:pointerdown', this.onBlankPointerDownBound);
    this.paper.on('blank:pointermove', this.onBlankPointerMoveBound);
    this.paper.on('blank:pointerup', this.onBlankPointerUpBound);
    this.paper.on('element:pointerdown', this.onElementPointerDownBound);
    this.paper.on('element:pointermove', this.onElementPointerMoveBound);
    this.paper.on('element:pointerup', this.onElementPointerUpBound);

    this.getActiveMode().activate();
  }

  public setMode(mode: Mode): void {
    if (mode === this.activeModeKey) {
      return;
    }

    this.getActiveMode().deactivate();
    this.activeModeKey = mode;
    this.getActiveMode().activate();
  }

  public getMode(): Mode {
    return this.activeModeKey;
  }

  public destroy(): void {
    this.getActiveMode().deactivate();

    this.paper.off('blank:pointerdown', this.onBlankPointerDownBound);
    this.paper.off('blank:pointermove', this.onBlankPointerMoveBound);
    this.paper.off('blank:pointerup', this.onBlankPointerUpBound);
    this.paper.off('element:pointerdown', this.onElementPointerDownBound);
    this.paper.off('element:pointermove', this.onElementPointerMoveBound);
    this.paper.off('element:pointerup', this.onElementPointerUpBound);
  }

  private getActiveMode(): InteractionMode {
    return this.modes[this.activeModeKey];
  }
}
