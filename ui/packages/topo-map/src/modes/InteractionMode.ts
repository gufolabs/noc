import type * as joint from '@joint/core';

export interface InteractionMode {
  activate(): void;
  deactivate(): void;
  onBlankPointerDown(event: joint.dia.Event, x: number, y: number): void;
  onBlankPointerMove(event: joint.dia.Event, x: number, y: number): void;
  onBlankPointerUp(event: joint.dia.Event, x: number, y: number): void;
  onElementPointerDown(elementView: joint.dia.ElementView, event: joint.dia.Event, x: number, y: number): void;
  onElementPointerMove(elementView: joint.dia.ElementView, event: joint.dia.Event, x: number, y: number): void;
  onElementPointerUp(elementView: joint.dia.ElementView, event: joint.dia.Event, x: number, y: number): void;
}
