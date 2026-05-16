import { describe, expect, it, vi } from 'vitest';
import * as joint from '@joint/core';
import { applyElementStatus } from '../src/core/elementStatus';
import { MapDocument } from '../src/core/MapDocument';
import { Topology } from '../src/Topology';
import type { Interface, PaperConfig } from '../src/core/types';

function createTopologyInterfacesHarness(): any {
  const topology = Object.create(Topology.prototype) as any;

  topology.config = {
    preserveViewportOnLoad: true,
    gridSize: 20,
    mainContainer: {
      dispatchEvent: vi.fn()
    }
  };
  topology.currentPaperConfig = {};
  topology.interfaces = [];
  topology.events = { clearInteractionState: vi.fn() };
  topology.moveHistory = { clear: vi.fn() };
  topology.emitHistoryAvailabilityChanges = vi.fn();
  topology.applyMapPaperConfig = vi.fn((paperConfig: PaperConfig) => {
    topology.currentPaperConfig = { ...paperConfig };
  });
  topology.diagramService = {
    fromJSON: vi.fn(),
    toJSON: vi.fn(() => ({ cells: [] }))
  };
  topology.mapBoundsState = { refreshNow: vi.fn() };
  topology.viewportManager = { rebuildIndex: vi.fn() };
  topology.nodeSearchIndexManager = { rebuildIndex: vi.fn() };
  topology.viewportState = {
    enforceConstraints: vi.fn(),
    getSnapshot: vi.fn(() => ({ scale: 2, tx: 30, ty: 40 }))
  };
  topology.minimapManager = { refresh: vi.fn() };
  topology.debug = { log: vi.fn() };

  return topology;
}

describe('Topology interfaces API', () => {
  it('loads interfaces from MapDocument and returns them via getter', () => {
    const topology = createTopologyInterfacesHarness();
    const interfaces: Interface[] = [
      {
        id: '22',
        tags: {
          object: 'T-16@10018',
          interface: 'port0'
        }
      }
    ];

    topology.loadDocument(MapDocument.fromGraph({ cells: [] }, undefined, { name: 'test' }, interfaces));

    expect(topology.getInterfaces()).toEqual(interfaces);
  });

  it('includes interfaces in toDocumentJSON()', () => {
    const topology = createTopologyInterfacesHarness();
    const interfaces: Interface[] = [
      {
        id: '33',
        tags: {
          object: 'core-sw-1',
          interface: 'xe-0/0/0'
        }
      }
    ];

    topology.interfaces = interfaces;
    topology.currentPaperConfig = { name: 'serialized' };

    expect(topology.toDocumentJSON()).toMatchObject({
      interfaces,
      paperConfig: { name: 'serialized' },
      viewport: { scale: 2, tx: 30, ty: 40 }
    });
  });

  it('returns HTTP-ready MapDocumentJSON via saveDocument()', () => {
    const topology = createTopologyInterfacesHarness();
    const interfaces: Interface[] = [
      {
        id: '44',
        tags: {
          object: 'dist-sw-1',
          interface: 'ge-0/0/1'
        }
      }
    ];

    topology.interfaces = interfaces;
    topology.currentPaperConfig = { name: 'saved-map' };

    expect(topology.saveDocument()).toMatchObject({
      interfaces,
      paperConfig: { name: 'saved-map' },
      viewport: { scale: 2, tx: 30, ty: 40 }
    });
  });

  it('detects the globally visible node label field from graph elements', () => {
    const topology = createTopologyInterfacesHarness();
    topology.diagramService = {
      getGraph: vi.fn(() => ({
        getElements: vi.fn(() => [
          new joint.dia.Element({
            id: 'node-1',
            attrs: {
              nodeName: {
                display: 'none'
              },
              ipaddr: {
                display: 'block'
              }
            }
          })
        ])
      }))
    };

    expect(topology.getVisibleNodeLabelField()).toBe('ipaddr');
  });

  it('sets text class by node data id rather than joint cell id', () => {
    const topology = createTopologyInterfacesHarness();
    const element = new joint.dia.Element({
      id: 'joint-1',
      type: 'noc.FontIconElement',
      attrs: {
        nodeName: {
          class: 'existing'
        },
        ipaddr: {}
      },
      data: {
        id: 'node-1',
        name: 'alpha'
      }
    });
    const otherElement = new joint.dia.Element({
      id: 'node-1',
      type: 'noc.FontIconElement',
      attrs: {
        nodeName: {
          class: 'other'
        },
        ipaddr: {}
      },
      data: {
        id: 'node-2',
        name: 'beta'
      }
    });
    const graph = new joint.dia.Graph();
    graph.addCells([element, otherElement]);

    topology.diagramService = {
      getGraph: vi.fn(() => graph)
    };

    expect(topology.setElementTextClass('node-1', 'stp-root', true)).toBe(true);
    expect(topology.setElementTextClass('node-1', 'stp-root', true)).toBe(true);

    expect(element.attr('nodeName/class')).toBe('existing stp-root');
    expect(element.attr('ipaddr/class')).toBe('stp-root');
    expect(otherElement.attr('nodeName/class')).toBe('other');
  });

  it('removes text class from both labels and returns false for invalid input', () => {
    const topology = createTopologyInterfacesHarness();
    const element = new joint.dia.Element({
      id: 'joint-1',
      type: 'noc.FontIconElement',
      attrs: {
        nodeName: {
          class: 'existing stp-root'
        },
        ipaddr: {
          class: 'stp-root extra'
        }
      },
      data: {
        id: 'node-1'
      }
    });
    const graph = new joint.dia.Graph();
    graph.addCell(element);

    topology.diagramService = {
      getGraph: vi.fn(() => graph)
    };

    expect(topology.setElementTextClass('node-1', 'stp-root', false)).toBe(true);

    expect(element.attr('nodeName/class')).toBe('existing');
    expect(element.attr('ipaddr/class')).toBe('extra');
    expect(topology.setElementTextClass('missing', 'stp-root', true)).toBe(false);
    expect(topology.setElementTextClass('node-1', '   ', true)).toBe(false);
  });

  it('preserves text classes when node presentation is rebuilt', () => {
    const topology = createTopologyInterfacesHarness();
    const element = new joint.dia.Element({
      id: 'joint-1',
      type: 'noc.FontIconElement',
      size: { width: 64, height: 64 },
      attrs: {
        icon: {
          text: '\uF20A',
          size: 'gf-1x',
          status_code: 1
        },
        nodeName: {
          text: 'alpha'
        },
        ipaddr: {
          text: '10.0.0.1'
        }
      },
      data: {
        id: 'node-1',
        name: 'alpha',
        address: '10.0.0.1',
        status_code: 1
      }
    });
    const graph = new joint.dia.Graph();
    graph.addCell(element);

    topology.diagramService = {
      getGraph: vi.fn(() => graph)
    };

    expect(topology.setElementTextClass('node-1', 'stp-root', true)).toBe(true);
    expect(applyElementStatus(element, { status_code: 4, metrics_label: 'cpu<br/>95%' })).toBe(true);

    expect(element.attr('nodeName/class')).toBe('stp-root');
    expect(element.attr('ipaddr/class')).toBe('stp-root');
  });

  it('accepts numeric node data id values', () => {
    const topology = createTopologyInterfacesHarness();
    const element = new joint.dia.Element({
      id: 'joint-1',
      type: 'noc.FontIconElement',
      attrs: {
        nodeName: {},
        ipaddr: {}
      },
      data: {
        id: 101,
        name: 'numeric-node'
      }
    });
    const graph = new joint.dia.Graph();
    graph.addCell(element);

    topology.diagramService = {
      getGraph: vi.fn(() => graph)
    };

    expect(topology.setElementTextClass(101, 'stp-root', true)).toBe(true);

    expect(element.attr('nodeName/class')).toBe('stp-root');
    expect(element.attr('ipaddr/class')).toBe('stp-root');
  });
});
