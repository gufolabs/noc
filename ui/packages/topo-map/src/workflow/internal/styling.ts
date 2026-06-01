import * as joint from '@joint/core';
import type { WorkflowState, WorkflowTransition } from '../types';
import type { WorkflowEditorRuntime } from './runtime';

export function decorateStates(runtime: WorkflowEditorRuntime): void {
  runtime.graph.getElements().forEach((element) => {
    decorateState(runtime, element);
  });
}

export function decorateStateById(runtime: WorkflowEditorRuntime, id: string): void {
  const cell = runtime.graph.getCell(id);
  if (cell?.isElement()) {
    decorateState(runtime, cell);
  }
}

export function decorateState(runtime: WorkflowEditorRuntime, element: joint.dia.Element): void {
  const data = (element.get('data') ?? {}) as WorkflowState;
  let fill = '#ffffff';
  let stroke = '#334155';
  let portCore = '#0f766e';

  if (data.is_default && data.is_productive) {
    fill = '#ccfbf1';
    stroke = '#0f766e';
    portCore = '#0f766e';
  } else if (data.is_default) {
    fill = '#dbeafe';
    stroke = '#2563eb';
    portCore = '#2563eb';
  } else if (data.is_productive) {
    fill = '#dcfce7';
    stroke = '#15803d';
    portCore = '#15803d';
  } else if (data.is_wiping) {
    fill = '#fee2e2';
    stroke = '#b91c1c';
    portCore = '#b91c1c';
  }

  element.attr('body/fill', fill);
  element.attr('body/stroke', stroke);
  element.attr('body/strokeWidth', data.is_default || data.is_productive || data.is_wiping ? 2.5 : 2);
  element.attr('body/strokeDasharray', '');
  element.attr('label/fill', '#0f172a');
  element.getPorts().forEach((port) => {
    if (typeof port.id !== 'string') {
      return;
    }
    element.portProp(port.id, 'attrs/portBody/stroke', stroke);
    element.portProp(port.id, 'attrs/portBody/fill', '#ffffff');
    element.portProp(port.id, 'attrs/portCore/fill', portCore);
  });
  runtime.setElementPortsVisible(element, runtime.shouldShowPortsForElement(element));
}

export function refreshAllLinks(runtime: WorkflowEditorRuntime): void {
  runtime.graph.getLinks().forEach((link) => {
    refreshLink(runtime, link);
  });
}

export function refreshLink(_runtime: WorkflowEditorRuntime, link: joint.dia.Link): void {
  const data = (link.get('data') ?? {}) as WorkflowTransition;
  const isActive = data.is_active !== false;
  link.attr('line/stroke', isActive ? '#334155' : '#94a3b8');
  link.attr('line/strokeDasharray', isActive ? '' : '8 6');
}
