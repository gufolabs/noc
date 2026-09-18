import * as joint from '@joint/core';
import { describe, expect, it, vi } from 'vitest';
import { DataFacade } from '../src/core/DataFacade';

function createGraph() {
  return new joint.dia.Graph({}, { cellNamespace: {} });
}

describe('DataFacade', () => {
  it('returns element ids filtered by data.type', () => {
    const graph = createGraph();
    graph.addCells([
      new joint.dia.Element({
        id: 'node-1',
        type: 'standard.Rectangle',
        data: { type: 'managedobject', name: 'alpha' }
      }),
      new joint.dia.Element({
        id: 'node-2',
        type: 'standard.Rectangle',
        data: { type: 'segment', name: 'beta' }
      }),
      new joint.dia.Link({
        id: 'link-1',
        type: 'standard.Link',
        source: { x: 0, y: 0 },
        target: { x: 100, y: 100 },
        data: { type: 'managedobject' }
      })
    ]);

    const api = new DataFacade(graph);

    expect(api.elements.getIdsByDataType('managedobject')).toEqual(['node-1']);
  });

  it('returns cloned records for elements and links', () => {
    const graph = createGraph();
    graph.addCells([
      new joint.dia.Element({
        id: 'node-1',
        type: 'standard.Rectangle',
        data: { type: 'managedobject', nested: { name: 'alpha' } }
      }),
      new joint.dia.Link({
        id: 'link-1',
        type: 'standard.Link',
        source: { x: 0, y: 0 },
        target: { x: 100, y: 100 },
        data: { type: 'uplink', nested: { weight: 10 } }
      })
    ]);

    const api = new DataFacade(graph);
    const elementRecord = api.elements.getById<{ type: string; nested: { name: string } }>('node-1');
    const linkRecord = api.links.getById<{ type: string; nested: { weight: number } }>('link-1');

    expect(elementRecord).toEqual({
      id: 'node-1',
      data: { type: 'managedobject', nested: { name: 'alpha' } }
    });
    expect(linkRecord).toEqual({
      id: 'link-1',
      data: { type: 'uplink', nested: { weight: 10 } }
    });

    if (!elementRecord || !linkRecord) {
      return;
    }

    elementRecord.data.nested.name = 'changed';
    linkRecord.data.nested.weight = 99;

    expect(api.elements.getById<{ type: string; nested: { name: string } }>('node-1')?.data.nested.name).toBe('alpha');
    expect(api.links.getById<{ type: string; nested: { weight: number } }>('link-1')?.data.nested.weight).toBe(10);
  });

  it('returns label by port id from element data', () => {
    const graph = createGraph();
    graph.addCells([
      new joint.dia.Element({
        id: 'node-1',
        type: 'noc.FontIconElement',
        attrs: {
          nodeName: {
            text: 'alpha'
          }
        },
        data: {
          name: 'alpha',
          ports: [
            { id: 'port-1' },
            { id: 22 },
            { id: null },
            {}
          ]
        }
      }),
      new joint.dia.Element({
        id: 'node-2',
        type: 'noc.FontIconElement',
        attrs: {
          nodeName: {
            text: 'beta'
          }
        },
        data: {
          name: 'beta',
          ports: [
            { id: 'port-2' }
          ]
        }
      })
    ]);

    const api = new DataFacade(graph);

    expect(api.elements.getLabelByPortId('port-1')).toBe('alpha');
    expect(api.elements.getLabelByPortId(22)).toBe('alpha');
    expect(api.elements.getLabelByPortId('port-2')).toBe('beta');
    expect(api.elements.getLabelByPortId('missing')).toBeNull();
    expect(api.elements.getLabelByPortId(Number.NaN)).toBeNull();
  });

  it('returns displayed label by port id using link source and target endpoints', () => {
    const graph = createGraph();
    graph.addCells([
      new joint.dia.Element({
        id: 'node-1',
        type: 'noc.FontIconElement',
        attrs: {
          nodeName: {
            text: 'Core'
          },
          ipaddr: {
            text: '10.0.0.1',
            display: 'none'
          }
        },
        data: {
          name: 'Core',
          address: '10.0.0.1'
        }
      }),
      new joint.dia.Element({
        id: 'node-2',
        type: 'noc.FontIconElement',
        attrs: {
          nodeName: {
            text: 'Edge',
            display: 'none'
          },
          ipaddr: {
            text: '10.0.0.2',
            display: 'block'
          }
        },
        data: {
          name: 'Edge',
          address: '10.0.0.2'
        }
      }),
      new joint.dia.Link({
        id: 'link-1',
        type: 'standard.Link',
        source: { id: 'node-1' },
        target: { id: 'node-2' },
        data: {
          ports: [101, 202]
        }
      })
    ]);

    const api = new DataFacade(graph);

    expect(api.elements.getLabelByPortId(101)).toBe('Core');
    expect(api.elements.getLabelByPortId(202)).toBe('10.0.0.2');
  });

  it('returns visible label text with metrics fallback by port id', () => {
    const graph = createGraph();
    graph.addCell(new joint.dia.Element({
      id: 'node-1',
      type: 'noc.FontIconElement',
      attrs: {
        nodeName: {
          display: 'block'
        },
        ipaddr: {
          display: 'none'
        }
      },
      data: {
        ports: [{ id: 77 }],
        name: 'Router',
        address: '10.0.0.77',
        metrics_label: 'CPU<br/>85%'
      }
    }));

    const api = new DataFacade(graph);

    expect(api.elements.getLabelByPortId(77)).toBe('Router\nCPU\n85%');
  });

  it('rebuilds port id index after element data changes', () => {
    const graph = createGraph();
    const element = new joint.dia.Element({
      id: 'node-1',
      type: 'standard.Rectangle',
      data: {
        ports: [{ id: 'port-1' }]
      }
    });

    graph.addCell(element);

    const api = new DataFacade(graph);

    expect(api.elements.getLabelByPortId('port-1')).toBeNull();

    element.set('data', {
      name: 'node-1',
      ports: [{ id: 'port-2' }]
    });

    expect(api.elements.getLabelByPortId('port-1')).toBeNull();
    expect(api.elements.getLabelByPortId('port-2')).toBe('node-1');
  });

  it('rebuilds port id index after link endpoint changes', () => {
    const graph = createGraph();
    graph.addCells([
      new joint.dia.Element({
        id: 'node-1',
        type: 'noc.FontIconElement',
        attrs: {
          nodeName: {
            text: 'Source'
          }
        },
        data: {
          name: 'Source'
        }
      }),
      new joint.dia.Element({
        id: 'node-2',
        type: 'noc.FontIconElement',
        attrs: {
          nodeName: {
            text: 'Target'
          }
        },
        data: {
          name: 'Target'
        }
      })
    ]);

    const link = new joint.dia.Link({
      id: 'link-1',
      type: 'standard.Link',
      source: { id: 'node-1' },
      target: { id: 'node-2' },
      data: {
        ports: [1, 2]
      }
    });
    graph.addCell(link);

    const api = new DataFacade(graph);

    expect(api.elements.getLabelByPortId(1)).toBe('Source');
    expect(api.elements.getLabelByPortId(2)).toBe('Target');

    link.source({ id: 'node-2' });
    link.target({ id: 'node-1' });

    expect(api.elements.getLabelByPortId(1)).toBe('Target');
    expect(api.elements.getLabelByPortId(2)).toBe('Source');
  });

  it('rebuilds port id index after graph reset', () => {
    const graph = createGraph();
    graph.addCell(new joint.dia.Element({
      id: 'node-1',
      type: 'standard.Rectangle',
      data: {
        ports: [{ id: 'port-1' }]
      }
    }));

    const api = new DataFacade(graph);

    expect(api.elements.getLabelByPortId('port-1')).toBeNull();

    graph.resetCells([
      new joint.dia.Element({
        id: 'node-2',
        type: 'noc.FontIconElement',
        attrs: {
          nodeName: {
            text: 'node-2'
          }
        },
        data: {
          ports: [{ id: 'port-2' }]
        }
      })
    ]);

    expect(api.elements.getLabelByPortId('port-1')).toBeNull();
    expect(api.elements.getLabelByPortId('port-2')).toBe('node-2');
  });

  it('returns link bandwidth by link id', () => {
    const graph = createGraph();
    graph.addCells([
      new joint.dia.Link({
        id: 'link-1',
        type: 'standard.Link',
        source: { x: 0, y: 0 },
        target: { x: 100, y: 100 },
        data: {
          id: 'link-1',
          in_bw: 1000,
          out_bw: 2000
        }
      }),
      new joint.dia.Link({
        id: 'link-2',
        type: 'standard.Link',
        source: { x: 0, y: 0 },
        target: { x: 100, y: 100 },
        data: {
          id: 'link-2',
          out_bw: 3000
        }
      }),
      new joint.dia.Link({
        id: 'link-3',
        type: 'standard.Link',
        source: { x: 0, y: 0 },
        target: { x: 100, y: 100 },
        data: {
          id: 'link-3'
        }
      }),
      new joint.dia.Element({
        id: 'node-1',
        type: 'standard.Rectangle',
        data: {
          id: 'node-1',
          in_bw: 10,
          out_bw: 20
        }
      })
    ]);

    const api = new DataFacade(graph);

    expect(api.links.getLinkBw('link-1')).toEqual({ in: 1000, out: 2000 });
    expect(api.links.getLinkBw('link-2')).toEqual({ in: 0, out: 3000 });
    expect(api.links.getLinkBw('link-3')).toEqual({ in: 0, out: 0 });
    expect(api.links.getLinkBw('node-1')).toBeNull();
    expect(api.links.getLinkBw('missing')).toBeNull();
  });

  it('updates link data with full value replacement and nullish key removal without emitting change events', () => {
    const graph = createGraph();
    const link = new joint.dia.Link({
      id: 'link-1',
      type: 'standard.Link',
      source: { x: 0, y: 0 },
      target: { x: 100, y: 100 },
      data: {
        method: 'lldp',
        metrics: [{ name: 'in', value: 10 }],
        meta: { a: 1, b: 2 },
        flag: true
      }
    });

    graph.addCells([
      link,
      new joint.dia.Element({
        id: 'node-1',
        type: 'standard.Rectangle',
        data: { name: 'node-1' }
      })
    ]);

    const api = new DataFacade(graph);
    const linkChangeSpy = vi.fn();
    const graphChangeSpy = vi.fn();
    const metrics = [{ name: 'out', value: 20 }];
    const meta = { a: 3 };

    link.on('change:data', linkChangeSpy);
    graph.on('change:data', graphChangeSpy);

    expect(api.links.updateData('link-1', {
      metrics,
      meta,
      method: undefined,
      flag: null
    })).toBe(true);

    expect(api.links.getById<{
      metrics: Array<{ name: string; value: number }>;
      meta: { a: number };
    }>('link-1')).toEqual({
      id: 'link-1',
      data: {
        metrics: [{ name: 'out', value: 20 }],
        meta: { a: 3 }
      }
    });
    expect(link.get('data')).toEqual({
      metrics: [{ name: 'out', value: 20 }],
      meta: { a: 3 }
    });
    expect(linkChangeSpy).not.toHaveBeenCalled();
    expect(graphChangeSpy).not.toHaveBeenCalled();

    metrics[0]!.value = 99;
    meta.a = 42;

    expect(api.links.getById<{
      metrics: Array<{ name: string; value: number }>;
      meta: { a: number };
    }>('link-1')).toEqual({
      id: 'link-1',
      data: {
        metrics: [{ name: 'out', value: 20 }],
        meta: { a: 3 }
      }
    });
  });

  it('returns false when link data update targets a missing cell or a non-link cell', () => {
    const graph = createGraph();
    graph.addCell(new joint.dia.Element({
      id: 'node-1',
      type: 'standard.Rectangle',
      data: { name: 'node-1' }
    }));

    const api = new DataFacade(graph);

    expect(api.links.updateData('missing', { metrics: [] })).toBe(false);
    expect(api.links.updateData('node-1', { metrics: [] })).toBe(false);
  });

  it('gets and sets status for one or many supported elements', () => {
    const graph = createGraph();
    graph.addCells([
      new joint.dia.Element({
        id: 'node-1',
        type: 'noc.FontIconElement',
        size: { width: 64, height: 64 },
        attrs: {
          icon: {
            text: '\uF20A',
            size: 'gf-1x',
            status_code: 1
          },
          title: {
            text: 'alpha'
          }
        },
        data: {
          id: 'node-1',
          name: 'alpha',
          status_code: 1
        }
      }),
      new joint.dia.Element({
        id: 'node-2',
        type: 'noc.ImageIconElement',
        size: { width: 64, height: 64 },
        attrs: {
          icon: {
            href: '#img-Cisco-router',
            width: '64',
            height: '64',
            status_code: 2
          },
          title: {
            text: 'beta'
          }
        },
        data: {
          id: 'node-2',
          name: 'beta',
          status_code: 2
        }
      })
    ]);

    const api = new DataFacade(graph);

    expect(api.elements.getStatus('node-1')).toEqual({ status_code: 1 });
    expect(api.elements.getStatuses(['node-1', 'node-2', 'missing'])).toEqual([
      { id: 'node-1', status_code: 1, metrics_label: null },
      { id: 'node-2', status_code: 2, metrics_label: null },
      { id: 'missing', status_code: null, metrics_label: null }
    ]);

    expect(api.elements.setStatus('node-1', {
      status_code: 4,
      metrics_label: 'single<br/>metric'
    })).toBe(true);
    expect(api.elements.getStatus('node-1')).toEqual({
      status_code: 4,
      metrics_label: 'single<br/>metric'
    });
    expect(api.elements.setStatuses({
      'node-1': {
        status_code: 2,
        metrics_label: 'ignored-1'
      },
      missing: {
        status_code: 4,
        metrics_label: 'ignored-2'
      },
      'node-2': {
        status_code: 4,
        metrics_label: 'ignored-3'
      }
    })).toEqual(['node-1', 'node-2']);
    expect(api.elements.getStatuses(['node-1', 'node-2'])).toEqual([
      { id: 'node-1', status_code: 2, metrics_label: 'ignored-1' },
      { id: 'node-2', status_code: 4, metrics_label: 'ignored-3' }
    ]);
  });

  it('sets random statuses for all supported elements from the provided pool', () => {
    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0.1).mockReturnValueOnce(0.9);

    const graph = createGraph();
    graph.addCells([
      new joint.dia.Element({
        id: 'node-1',
        type: 'noc.FontIconElement',
        size: { width: 64, height: 64 },
        attrs: {
          icon: {
            text: '\uF20A',
            size: 'gf-1x',
            status_code: 1
          }
        },
        data: {
          id: 'node-1',
          name: 'node-1',
          status_code: 1
        }
      }),
      new joint.dia.Element({
        id: 'node-2',
        type: 'noc.ImageIconElement',
        size: { width: 64, height: 64 },
        attrs: {
          icon: {
            href: '#img-Cisco-router',
            width: '64',
            height: '64',
            status_code: 2
          }
        },
        data: {
          id: 'node-2',
          name: 'node-2',
          status_code: 2
        }
      }),
      new joint.dia.Element({
        id: 'node-3',
        type: 'standard.Rectangle',
        data: {
          id: 'node-3'
        }
      })
    ]);

    const api = new DataFacade(graph);

    expect(api.elements.setRandomStatuses([
      { status_code: 2, metrics_label: 'm1' },
      { status_code: 4, metrics_label: 'm2' }
    ])).toEqual(['node-1', 'node-2']);
    expect(api.elements.getStatuses(['node-1', 'node-2', 'node-3'])).toEqual([
      { id: 'node-1', status_code: 2, metrics_label: 'm1' },
      { id: 'node-2', status_code: 4, metrics_label: 'm2' },
      { id: 'node-3', status_code: null, metrics_label: null }
    ]);

    randomSpy.mockRestore();
  });
});
