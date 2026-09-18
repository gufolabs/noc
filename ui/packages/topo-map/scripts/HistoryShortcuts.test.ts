import { describe, expect, it, vi } from 'vitest';
import { bindHistoryShortcuts } from '../src/history/bindHistoryShortcuts';

type EventHandler = (event?: Record<string, unknown>) => void;

function createHost(): {
  host: HTMLElement;
  handlers: Map<string, EventHandler>;
  focus: ReturnType<typeof vi.fn>;
} {
  const handlers = new Map<string, EventHandler>();
  const focus = vi.fn();

  return {
    host: {
      tabIndex: -1,
      focus,
      addEventListener: vi.fn((name: string, handler: EventHandler) => {
        handlers.set(name, handler);
      }),
      removeEventListener: vi.fn((name: string) => {
        handlers.delete(name);
      })
    } as unknown as HTMLElement,
    handlers,
    focus
  };
}

describe('bindHistoryShortcuts', () => {
  it('focuses the host on pointerdown and handles undo/redo shortcuts', () => {
    const { host, handlers, focus } = createHost();
    const undo = vi.fn(() => true);
    const redo = vi.fn(() => true);
    const dispose = bindHistoryShortcuts(host, { undo, redo });

    handlers.get('pointerdown')?.();
    expect(focus).toHaveBeenCalledTimes(1);
    expect(host.tabIndex).toBe(0);

    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();
    handlers.get('keydown')?.({
      key: 'z',
      ctrlKey: true,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      target: null,
      preventDefault,
      stopPropagation
    });
    expect(undo).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);

    handlers.get('keydown')?.({
      key: 'Z',
      ctrlKey: false,
      metaKey: true,
      altKey: false,
      shiftKey: true,
      target: null,
      preventDefault,
      stopPropagation
    });
    expect(redo).toHaveBeenCalledTimes(1);

    dispose();
    expect(handlers.size).toBe(0);
  });
});
