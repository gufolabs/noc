import { describe, expect, it, vi } from 'vitest';
import { Topology } from '../src/Topology';

function createTopologyResizeHarness(): any {
  const topology = Object.create(Topology.prototype) as any;

  topology.config = {
    mainContainer: {},
    minimapContainer: {}
  };
  topology.diagramService = { resize: vi.fn() };
  topology.mapBoundsState = { refreshNow: vi.fn() };
  topology.viewportState = { enforceConstraints: vi.fn() };
  topology.minimapManager = { resize: vi.fn() };
  topology.debug = { log: vi.fn() };
  topology.lastMainWidth = -1;
  topology.lastMainHeight = -1;
  topology.lastMinimapWidth = -1;
  topology.lastMinimapHeight = -1;

  return topology;
}

describe('Topology resize API', () => {
  it('applies main resize via notifyResize on first call', () => {
    const topology = createTopologyResizeHarness();

    topology.notifyResize({
      main: { width: 640, height: 480 }
    });

    expect(topology.diagramService.resize).toHaveBeenCalledWith(640, 480);
    expect(topology.mapBoundsState.refreshNow).toHaveBeenCalledTimes(1);
    expect(topology.viewportState.enforceConstraints).toHaveBeenCalledTimes(1);
  });

  it('applies changed main size on the second notifyResize call', () => {
    const topology = createTopologyResizeHarness();

    topology.notifyResize({
      main: { width: 640, height: 480 }
    });
    topology.notifyResize({
      main: { width: 800, height: 600 }
    });

    expect(topology.diagramService.resize).toHaveBeenNthCalledWith(2, 800, 600);
  });

  it('ignores repeated and invalid sizes in notifyResize', () => {
    const topology = createTopologyResizeHarness();

    topology.notifyResize({
      main: { width: 640, height: 480 }
    });
    topology.notifyResize({
      main: { width: 640, height: 480 }
    });
    topology.notifyResize({
      main: { width: 1, height: 480 }
    });

    expect(topology.diagramService.resize).toHaveBeenCalledTimes(1);
  });

  it('applies minimap resize', () => {
    const topology = createTopologyResizeHarness();

    topology.notifyResize({
      minimap: { width: 240, height: 180 }
    });

    expect(topology.minimapManager.resize).toHaveBeenCalledWith(240, 180);
  });

  it('keeps resizeMain and resizeMinimap as wrappers over the shared resize flow', () => {
    const topology = createTopologyResizeHarness();

    topology.resizeMain(320, 240);
    topology.resizeMinimap(160, 120);

    expect(topology.diagramService.resize).toHaveBeenCalledWith(320, 240);
    expect(topology.minimapManager.resize).toHaveBeenCalledWith(160, 120);
  });
});
