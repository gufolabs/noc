import * as joint from '@joint/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InteractionEvents } from '../src/core/events';

type PaperHandler = (...args: unknown[]) => void;

interface PaperStub {
  paper: joint.dia.Paper;
  handlers: Map<string, PaperHandler>;
}

interface ContainerStub {
  element: HTMLElement;
  events: CustomEvent<Record<string, unknown>>[];
}

function mockHighlighterAdd() {
  return vi
    .spyOn(joint.highlighters.mask, 'add')
    .mockImplementation(() => ({}) as ReturnType<typeof joint.highlighters.mask.add>);
}

function createPaperStub(): PaperStub {
  const handlers = new Map<string, PaperHandler>();

  return {
    paper: {
      on: vi.fn((eventName: string, handler: PaperHandler) => {
        handlers.set(eventName, handler);
      }),
      off: vi.fn((eventName: string, handler: PaperHandler) => {
        if (handlers.get(eventName) === handler) {
          handlers.delete(eventName);
        }
      }),
      el: {
        style: {},
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }
    } as unknown as joint.dia.Paper,
    handlers
  };
}

function createContainerStub(): ContainerStub {
  const events: CustomEvent<Record<string, unknown>>[] = [];

  return {
    element: {
      dispatchEvent: vi.fn((event: Event) => {
        events.push(event as CustomEvent<Record<string, unknown>>);
        return true;
      })
    } as unknown as HTMLElement,
    events
  };
}

function createCellView(
  id: string,
  isElement: boolean,
  data: Record<string, unknown>
): joint.dia.CellView | joint.dia.ElementView {
  return {
    model: {
      id,
      isElement: () => isElement,
      get: (key: string) => {
        if (key === 'data') {
          return data;
        }
        return undefined;
      }
    }
  } as unknown as joint.dia.CellView;
}

describe('InteractionEvents', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('highlights an unselected element and emits its data in the highlight event', () => {
    const { paper, handlers } = createPaperStub();
    const { element, events } = createContainerStub();
    const addSpy = mockHighlighterAdd();
    vi.spyOn(joint.highlighters.mask, 'remove').mockImplementation(() => undefined);

    const topologyEvents = new InteractionEvents(element, paper);

    topologyEvents.setup();

    const data = { type: 'managedobject', name: 'node-1' };
    const elementView = createCellView('node-1', true, data) as joint.dia.ElementView;
    const pointerClick = handlers.get('cell:pointerclick');

    expect(pointerClick).toBeTypeOf('function');
    pointerClick?.(elementView, { button: 0 }, 10, 20);
    vi.runAllTimers();

    expect(addSpy).toHaveBeenCalledWith(elementView, 'root', 'topo:element-highlight', expect.any(Object));

    const highlightEvent = events.find((event) => event.type === 'topo:cell:highlight');

    expect(highlightEvent?.detail).toMatchObject({
      id: 'node-1',
      data
    });
  });

  it('unhighlights the currently selected element when it is clicked again', () => {
    const { paper, handlers } = createPaperStub();
    const { element, events } = createContainerStub();
    mockHighlighterAdd();
    const removeSpy = vi.spyOn(joint.highlighters.mask, 'remove').mockImplementation(() => undefined);

    const topologyEvents = new InteractionEvents(element, paper);

    topologyEvents.setup();

    const data = { type: 'managedobject', name: 'node-1' };
    const elementView = createCellView('node-1', true, data) as joint.dia.ElementView;
    const pointerClick = handlers.get('cell:pointerclick');

    pointerClick?.(elementView, { button: 0 }, 10, 20);
    vi.runAllTimers();
    events.length = 0;
    removeSpy.mockClear();

    pointerClick?.(elementView, { button: 0 }, 15, 25);
    vi.runAllTimers();

    expect(removeSpy).toHaveBeenCalledWith(elementView, 'topo:element-highlight');
    expect(events.map((event) => event.type)).toEqual(['topo:cell:unhighlight', 'topo:cell:pointerclick']);
    expect(events[0]?.detail).toMatchObject({
      id: 'node-1',
      data
    });
  });

  it('unhighlights the selected element when a link is clicked', () => {
    const { paper, handlers } = createPaperStub();
    const { element, events } = createContainerStub();
    mockHighlighterAdd();
    const removeSpy = vi.spyOn(joint.highlighters.mask, 'remove').mockImplementation(() => undefined);

    const topologyEvents = new InteractionEvents(element, paper);

    topologyEvents.setup();

    const selectedData = { type: 'managedobject', name: 'node-1' };
    const elementView = createCellView('node-1', true, selectedData) as joint.dia.ElementView;
    const linkData = { type: 'link', method: 'lldp' };
    const linkView = createCellView('link-1', false, linkData);
    const pointerClick = handlers.get('cell:pointerclick');

    pointerClick?.(elementView, { button: 0 }, 10, 20);
    vi.runAllTimers();
    events.length = 0;
    removeSpy.mockClear();

    pointerClick?.(linkView, { button: 0 }, 15, 25);
    vi.runAllTimers();

    expect(removeSpy).toHaveBeenCalledWith(elementView, 'topo:element-highlight');
    expect(events.map((event) => event.type)).toEqual([
      'topo:cell:unhighlight',
      'topo:cell:highlight',
      'topo:cell:pointerclick'
    ]);
    expect(events[0]?.detail).toMatchObject({
      id: 'node-1',
      data: selectedData
    });
    expect(events[1]?.detail).toMatchObject({
      id: 'link-1',
      data: linkData
    });
    expect(events[2]?.detail).toMatchObject({
      id: 'link-1',
      data: linkData
    });
  });

  it('unhighlights the selected element when the blank area is clicked', () => {
    const { paper, handlers } = createPaperStub();
    const { element, events } = createContainerStub();
    mockHighlighterAdd();
    const removeSpy = vi.spyOn(joint.highlighters.mask, 'remove').mockImplementation(() => undefined);

    const topologyEvents = new InteractionEvents(element, paper);

    topologyEvents.setup();

    const data = { type: 'managedobject', name: 'node-1' };
    const elementView = createCellView('node-1', true, data) as joint.dia.ElementView;
    const cellPointerClick = handlers.get('cell:pointerclick');
    const blankPointerDown = handlers.get('blank:pointerdown');

    cellPointerClick?.(elementView, { button: 0 }, 10, 20);
    vi.runAllTimers();
    events.length = 0;
    removeSpy.mockClear();

    blankPointerDown?.({ button: 0 }, 15, 25);

    expect(removeSpy).toHaveBeenCalledWith(elementView, 'topo:element-highlight');
    expect(events.map((event) => event.type)).toEqual(['topo:cell:unhighlight', 'topo:blank:pointerdown']);
    expect(events[0]?.detail).toMatchObject({
      id: 'node-1',
      data
    });
  });

  it('cancels the delayed cell click when a double click is fired', () => {
    const { paper, handlers } = createPaperStub();
    const { element, events } = createContainerStub();
    const addSpy = mockHighlighterAdd();
    vi.spyOn(joint.highlighters.mask, 'remove').mockImplementation(() => undefined);

    const topologyEvents = new InteractionEvents(element, paper);

    topologyEvents.setup();

    const data = { type: 'managedobject', name: 'node-1' };
    const elementView = createCellView('node-1', true, data) as joint.dia.ElementView;
    const pointerClick = handlers.get('cell:pointerclick');
    const elementPointerDblClick = handlers.get('element:pointerdblclick');

    pointerClick?.(elementView, { button: 0 }, 10, 20);
    elementPointerDblClick?.(elementView, { button: 0 }, 10, 20);
    vi.runAllTimers();

    expect(events.map((event) => event.type)).toEqual(['topo:element:pointerdblclick']);
    expect(addSpy).toHaveBeenCalledTimes(0);
  });

  it('emits link hover with data and client coordinates', () => {
    const { paper, handlers } = createPaperStub();
    const { element, events } = createContainerStub();
    const addSpy = mockHighlighterAdd();

    const topologyEvents = new InteractionEvents(element, paper);

    topologyEvents.setup();

    const linkData = { type: 'link', method: 'lldp', in_bw: 100, out_bw: 200 };
    const linkView = createCellView('link-1', false, linkData) as joint.dia.LinkView;
    const mouseEnter = handlers.get('link:mouseenter');

    mouseEnter?.(linkView, { clientX: 150, clientY: 250 });

    expect(addSpy).toHaveBeenCalledWith(linkView, 'line', 'topo:link-hover-highlight', expect.any(Object));

    const hoverEvent = events.find((event) => event.type === 'topo:link:hover');

    expect(hoverEvent?.detail).toEqual({
      ...linkData,
      position: [150, 250]
    });
  });

  it('emits link mouseout with pointer coordinates', () => {
    const { paper, handlers } = createPaperStub();
    const { element, events } = createContainerStub();
    const removeSpy = vi.spyOn(joint.highlighters.mask, 'remove').mockImplementation(() => undefined);

    const topologyEvents = new InteractionEvents(element, paper);

    topologyEvents.setup();

    const linkData = { type: 'link', method: 'lldp' };
    const linkView = createCellView('link-1', false, linkData) as joint.dia.LinkView;
    const mouseLeave = handlers.get('link:mouseleave');

    mouseLeave?.(linkView, { clientX: 170, clientY: 270 });

    expect(removeSpy).toHaveBeenCalledWith(linkView, 'topo:link-hover-highlight');

    const mouseOutEvent = events.find((event) => event.type === 'topo:link:mouseout');

    expect(mouseOutEvent?.detail).toEqual({
      position: [170, 270]
    });
  });
});
