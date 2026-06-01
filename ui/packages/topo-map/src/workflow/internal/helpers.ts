import * as joint from '@joint/core';
import type { WorkflowDocument, WorkflowPoint } from '../types';
import { normalizeWorkflowDocument } from '../workflowAdapter';

export function isPrimaryMouseButton(event: joint.dia.Event): boolean {
  const mouseEvent = event as unknown as MouseEvent;
  return mouseEvent.button === 0 || mouseEvent.which === 1;
}

export function resolveClientPoint(event: joint.dia.Event): WorkflowPoint | null {
  const mouseEvent = event as unknown as MouseEvent;
  if (typeof mouseEvent.clientX !== 'number' || typeof mouseEvent.clientY !== 'number') {
    return null;
  }
  return {
    x: mouseEvent.clientX,
    y: mouseEvent.clientY
  };
}

export function resolvePortGroup(magnet: Element | null | undefined): string {
  if (!magnet) {
    return '';
  }
  const ownGroup = magnet.getAttribute('port-group');
  if (typeof ownGroup === 'string' && ownGroup.length > 0) {
    return ownGroup;
  }
  const container = typeof magnet.closest === 'function' ? magnet.closest('[port-group]') : magnet.parentElement;
  return container?.getAttribute('port-group') ?? '';
}

export function isOutPortGroup(group: string): boolean {
  return group.startsWith('out');
}

export function isInPortGroup(group: string): boolean {
  return group.startsWith('in');
}

export function createDefaultWorkflow(): WorkflowDocument {
  return normalizeWorkflowDocument({
    name: 'New Workflow',
    description: '',
    is_active: true,
    allowed_models: [],
    states: [],
    transitions: []
  });
}

export function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
