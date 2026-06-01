declare module 'rbush' {
  export interface BBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }

  export default class RBush<T extends BBox> {
    constructor(maxEntries?: number);
    all(): T[];
    search(bbox: BBox): T[];
    collides(bbox: BBox): boolean;
    load(data: T[]): this;
    insert(item: T): this;
    clear(): this;
    remove(item: T, equalsFn?: (a: T, b: T) => boolean): this;
  }
}
