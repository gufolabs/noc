import type { Point } from '../core/types';

export class SnapManager {
  private gridSize: number;

  public constructor(gridSize: number) {
    this.gridSize = Math.max(1, gridSize);
  }

  public setGridSize(gridSize: number): void {
    this.gridSize = Math.max(1, gridSize);
  }

  public snapPosition(position: Point): Point {
    return {
      x: Math.round(position.x / this.gridSize) * this.gridSize,
      y: Math.round(position.y / this.gridSize) * this.gridSize
    };
  }

  public getGridSize(): number {
    return this.gridSize;
  }
}
