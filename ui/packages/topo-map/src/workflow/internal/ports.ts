import * as joint from '@joint/core';
import { isInPortGroup, isOutPortGroup, resolvePortGroup } from './helpers';
import type { WorkflowEditorRuntime } from './runtime';

export function validateMagnet(_runtime: WorkflowEditorRuntime, magnet: Element | null): boolean {
  return isOutPortGroup(resolvePortGroup(magnet));
}

export function validateConnection(
  runtime: WorkflowEditorRuntime,
  sourceView: joint.dia.CellView | null,
  sourceMagnet: Element | null,
  targetView: joint.dia.CellView | null,
  targetMagnet: Element | null
): boolean {
  if (runtime.state.mode !== 'edit') {
    return false;
  }
  if (!sourceView?.model.isElement() || !targetView?.model.isElement()) {
    return false;
  }
  const sourceGroup = resolvePortGroup(sourceMagnet);
  const targetGroup = resolvePortGroup(targetMagnet);
  return isOutPortGroup(sourceGroup) && isInPortGroup(targetGroup);
}

export function shouldShowInPorts(runtime: WorkflowEditorRuntime): boolean {
  return runtime.state.linkCreationInProgress;
}

export function shouldShowOutPortsForElement(runtime: WorkflowEditorRuntime, element: joint.dia.Element): boolean {
  if (runtime.state.linkCreationInProgress) {
    return false;
  }
  const selectedCell = runtime.state.selectedCellId ? runtime.graph.getCell(runtime.state.selectedCellId) : null;
  if (!selectedCell?.isElement()) {
    return false;
  }
  return String(element.id) === runtime.state.selectedCellId;
}

export function shouldShowPortsForElement(runtime: WorkflowEditorRuntime, element: joint.dia.Element): boolean {
  return shouldShowInPorts(runtime) || shouldShowOutPortsForElement(runtime, element);
}

export function setElementPortsVisible(
  runtime: WorkflowEditorRuntime,
  element: joint.dia.Element,
  visible: boolean
): void {
  const showOut = shouldShowOutPortsForElement(runtime, element) && visible;
  const showIn = shouldShowInPorts(runtime) && visible;

  element.getPorts().forEach((port) => {
    if (typeof port.id !== 'string' || typeof port.group !== 'string') {
      return;
    }
    const isVisible = isOutPortGroup(port.group) ? showOut : isInPortGroup(port.group) ? showIn : false;
    const display = isVisible ? 'block' : 'none';
    element.portProp(port.id, 'attrs/portBody/display', display);
    element.portProp(port.id, 'attrs/portCore/display', display);
  });
}

export function syncPortsVisibility(runtime: WorkflowEditorRuntime): void {
  runtime.graph.getElements().forEach((element) => {
    setElementPortsVisible(runtime, element, shouldShowPortsForElement(runtime, element));
  });
}

export function beginLinkCreation(runtime: WorkflowEditorRuntime): void {
  clearPendingEndLinkCreationTimeout(runtime);
  if (runtime.state.linkCreationInProgress) {
    return;
  }
  runtime.state.linkCreationInProgress = true;
  syncPortsVisibility(runtime);
}

export function endLinkCreation(runtime: WorkflowEditorRuntime): void {
  clearPendingEndLinkCreationTimeout(runtime);
  if (!runtime.state.linkCreationInProgress) {
    return;
  }
  runtime.state.linkCreationInProgress = false;
  syncPortsVisibility(runtime);
}

export function endLinkCreationSoon(runtime: WorkflowEditorRuntime): void {
  if (!runtime.state.linkCreationInProgress || runtime.state.pendingEndLinkCreationTimeout !== null) {
    return;
  }
  runtime.state.pendingEndLinkCreationTimeout = globalThis.setTimeout(() => {
    runtime.state.pendingEndLinkCreationTimeout = null;
    endLinkCreation(runtime);
  }, 0);
}

export function clearPendingEndLinkCreationTimeout(runtime: WorkflowEditorRuntime): void {
  if (runtime.state.pendingEndLinkCreationTimeout === null) {
    return;
  }
  globalThis.clearTimeout(runtime.state.pendingEndLinkCreationTimeout);
  runtime.state.pendingEndLinkCreationTimeout = null;
}
