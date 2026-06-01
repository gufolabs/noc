interface HistoryShortcutBindings {
  undo: () => boolean;
  redo: () => boolean;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (typeof Element === 'undefined' || !(target instanceof Element)) {
    return false;
  }

  const editable = target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]');
  return editable !== null;
}

function focusHost(host: HTMLElement): void {
  if (typeof host.focus !== 'function') {
    return;
  }
  host.focus({ preventScroll: true });
}

export function bindHistoryShortcuts(host: HTMLElement, bindings: HistoryShortcutBindings): () => void {
  if (host.tabIndex < 0) {
    host.tabIndex = 0;
  }

  const onPointerDown = (): void => {
    focusHost(host);
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if ((!event.metaKey && !event.ctrlKey) || event.altKey || isEditableTarget(event.target)) {
      return;
    }
    if (event.key.toLowerCase() !== 'z') {
      return;
    }

    const handled = event.shiftKey ? bindings.redo() : bindings.undo();
    if (!handled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  host.addEventListener('pointerdown', onPointerDown);
  host.addEventListener('keydown', onKeyDown);

  return () => {
    host.removeEventListener('pointerdown', onPointerDown);
    host.removeEventListener('keydown', onKeyDown);
  };
}
