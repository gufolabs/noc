import { describe, expect, it } from 'vitest';
import { MapDocument } from '../src/core/MapDocument';
import type { Interface } from '../src/core/types';

describe('MapDocument interfaces', () => {
  it('preserves interfaces through JSON serialization', () => {
    const interfaces: Interface[] = [
      {
        id: '101',
        tags: {
          object: 'edge-sw-1',
          interface: 'port0'
        }
      }
    ];

    const document = MapDocument.fromGraph(
      { cells: [] },
      { scale: 1.5, tx: 10, ty: 20 },
      { name: 'test-map' },
      interfaces
    );

    const json = document.toJSON();
    const restored = MapDocument.fromJSON(json);

    expect(json.interfaces).toEqual(interfaces);
    expect(restored.interfaces).toEqual(interfaces);
  });
});
