import { describe, expect, it } from 'vitest';
import { convertMapData, MapConverterInput } from '../src/decoders/MapConverter';
import { configuredShapeMapData, glyphSegmentMapData } from './fixtures/configuredShapeMapData';

describe('convertMapData', () => {
  it('converts segment payload with glyph nodes and port-based links', () => {
    const result = convertMapData(glyphSegmentMapData);

    expect(result.viewport).toBeUndefined();
    expect(result.graph.layers).toEqual([{ id: 'links' }, { id: 'nodes' }]);
    expect(result.graph.defaultLayer).toBe('nodes');
    expect(result.interfaces).toEqual([
      {
        id: '1',
        tags: {
          object: 'chr-1',
          interface: 'ether1'
        }
      },
      {
        id: '0',
        tags: {
          object: 'chr-2',
          interface: 'ether2'
        }
      }
    ]);
    expect(result.paperConfig).toEqual({
      id: '694f2320f73e86f3d01e51c2',
      type: 'segment',
      gridSize: 25,
      normalizePosition: true,
      objectStatusRefreshInterval: 60,
      name: 'ALL',
      width: 156.25,
      height: 123.75
    });
    expect(result.graph.cells).toHaveLength(4);

    const sae = result.graph.cells.find((cell) => cell.id === '1');
    expect(sae).toBeDefined();
    expect(sae?.type).toBe('noc.FontIconElement');
    expect((sae as Record<string, any>)?.layer).toBe('nodes');
    expect(sae?.position).toEqual({ x: 56.25, y: 23.75 });
    expect((sae as Record<string, any>)?.attrs.icon.text).toBe(String.fromCodePoint(61996));
    expect((sae as Record<string, any>)?.attrs.icon.size).toBe('gf-1x');
    expect((sae as Record<string, any>)?.attrs.nodeName.text).toBe('SAE lllllllll xxx');
    expect((sae as Record<string, any>)?.attrs.ipaddr.text).toBe('1.1.1.1');
    expect((sae as Record<string, any>)?.data).toMatchObject({
      id: '1',
      name: 'SAE lllllllll xxx',
      address: '1.1.1.1'
    });

    const link = result.graph.cells.find((cell) => cell.id === '69676d2cfa1bc463f16465e2');
    expect(link).toBeDefined();
    expect(link?.type).toBe('noc.LinkElement');
    expect((link as Record<string, any>)?.layer).toBe('links');
    expect(link?.source).toEqual({
      id: '3',
      selector: 'icon',
      anchor: { name: 'iconCenter' },
      connectionPoint: { name: 'boundary' }
    });
    expect(link?.target).toEqual({
      id: '2',
      selector: 'icon',
      anchor: { name: 'iconCenter' },
      connectionPoint: { name: 'boundary' }
    });
    expect((link as Record<string, any>)?.data.connector).toBe('normal');
    expect((link as Record<string, any>)?.data.method).toBe('lldp');
    expect((link as Record<string, any>)?.data.bw).toBe(10000000000);
    expect((link as Record<string, any>)?.data.in_bw).toBe(10000000000);
    expect((link as Record<string, any>)?.data.out_bw).toBe(10000000000);
  });

  it('converts shape-based payload into image nodes and preserves port link mapping', () => {
    const input: MapConverterInput = {
      ...configuredShapeMapData,
      stencil_dir: '/stencils/custom',
    };
    const result = convertMapData(input);

    expect(result.viewport).toBeUndefined();
    expect(result.graph.layers).toEqual([{ id: 'links' }, { id: 'nodes' }]);
    expect(result.graph.defaultLayer).toBe('nodes');
    expect(result.paperConfig).toEqual({
      id: '6972456b3819bc893f2ab6c5',
      type: 'configured',
      gridSize: 25,
      normalizePosition: false,
      objectStatusRefreshInterval: 60,
      backgroundImage: '/bg/demo.png',
      backgroundOpacity: 0.3,
      name: 'configured',
      width: 3200,
      height: 1800,
      stencilDir: '/stencils/custom'
    });
    expect((result.graph as Record<string, unknown>).mapBounds).toBeUndefined();
    expect(result.graph.cells).toHaveLength(
      (configuredShapeMapData.nodes?.length ?? 0) + (configuredShapeMapData.links?.length ?? 0)
    );

    const groupNode = result.graph.cells.find((cell) => cell.id === '6973ffeb8ce3e3bca2229017');
    expect(groupNode).toBeDefined();
    expect(groupNode?.type).toBe('noc.ImageIconElement');
    expect((groupNode as Record<string, any>)?.layer).toBe('nodes');
    expect(groupNode?.position).toEqual({ x: 1300, y: 100 });
    expect((groupNode as Record<string, any>)?.attrs.icon.href).toBe('#img-Cisco-router');
    expect((groupNode as Record<string, any>)?.attrs.icon.width).toBe('47.5');
    expect((groupNode as Record<string, any>)?.attrs.icon.height).toBe('32.5');
    expect((groupNode as Record<string, any>)?.attrs.nodeName.text).toBe('Атмосфера+ZIAX');
    expect((groupNode as Record<string, any>)?.data).toMatchObject({
      id: '6973ffeb8ce3e3bca2229017',
      name: 'Атмосфера+ZIAX'
    });

    const workstationNode = result.graph.cells.find((cell) => cell.id === '31');
    expect(workstationNode).toBeDefined();
    expect(workstationNode?.type).toBe('noc.ImageIconElement');
    expect((workstationNode as Record<string, any>)?.attrs.icon.href).toBe('#img-Cisco-workstation');
    expect((workstationNode as Record<string, any>)?.attrs.ipaddr.text).toBe('10.100.16.162');

    const mappedLink = result.graph.cells.find((cell) => cell.id === '697baec7d58805e96c998c11');
    expect(mappedLink).toBeDefined();
    expect(mappedLink?.type).toBe('noc.LinkElement');
    expect((mappedLink as Record<string, any>)?.layer).toBe('links');
    expect(mappedLink?.source).toEqual({
      id: '32',
      selector: 'icon',
      anchor: { name: 'iconCenter' },
      connectionPoint: { name: 'boundary' }
    });
    expect(mappedLink?.target).toEqual({
      id: '31',
      selector: 'icon',
      anchor: { name: 'iconCenter' },
      connectionPoint: { name: 'boundary' }
    });
    expect((mappedLink as Record<string, any>)?.data.method).toBe('xmac');
    expect((mappedLink as Record<string, any>)?.data.bw).toBe(1000000000);

    const cloudLink = result.graph.cells.find((cell) => cell.id === '697ba229d58805e96c998be6-22-23');
    expect(cloudLink).toBeDefined();
    expect(cloudLink?.source).toEqual({
      id: '697ba229d58805e96c998be6',
      selector: 'icon',
      anchor: { name: 'iconCenter' },
      connectionPoint: { name: 'boundary' }
    });
    expect(cloudLink?.target).toEqual({
      id: '39',
      selector: 'icon',
      anchor: { name: 'iconCenter' },
      connectionPoint: { name: 'boundary' }
    });
    expect((cloudLink as Record<string, any>)?.data.bw).toBe(1000000000);
  });
});
