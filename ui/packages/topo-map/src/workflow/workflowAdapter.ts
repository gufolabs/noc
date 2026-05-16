import * as joint from '@joint/core';
import { clonePlain } from './clonePlain';
import type {
  WorkflowDocument,
  WorkflowModelRef,
  WorkflowPoint,
  WorkflowState,
  WorkflowStateCellData,
  WorkflowTransition,
  WorkflowTransitionCellData
} from './types';

export const DEFAULT_STATE_WIDTH = 100;
export const DEFAULT_STATE_HEIGHT = 40;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function toAllowedModels(value: unknown): Array<string | WorkflowModelRef> {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: Array<string | WorkflowModelRef> = [];
  value.forEach((item) => {
    if (typeof item === 'string') {
      result.push(item);
      return;
    }
    if (isRecord(item) && typeof item.id === 'string') {
      const modelRef: WorkflowModelRef = { id: item.id };
      if (typeof item.label === 'string') {
        modelRef.label = item.label;
      }
      result.push(modelRef);
    }
  });
  return result;
}

function toPointArray(value: unknown): WorkflowPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!isRecord(item) || typeof item.x !== 'number' || typeof item.y !== 'number') {
        return null;
      }
      return { x: item.x, y: item.y };
    })
    .filter((item): item is WorkflowPoint => item !== null);
}

function normalizeState(input: unknown): WorkflowState | null {
  if (!isRecord(input) || typeof input.id !== 'string' || typeof input.name !== 'string') {
    return null;
  }

  const state: WorkflowState = {
    ...clonePlain(input),
    id: input.id,
    name: input.name,
    description: typeof input.description === 'string' || input.description === null ? input.description : '',
    is_default: Boolean(input.is_default),
    is_productive: Boolean(input.is_productive),
    is_wiping: Boolean(input.is_wiping),
    update_last_seen: Boolean(input.update_last_seen),
    ttl: typeof input.ttl === 'number' ? input.ttl : input.ttl === null ? null : 0,
    update_expired: Boolean(input.update_expired),
    on_enter_handlers: toStringArray(input.on_enter_handlers),
    job_handler: typeof input.job_handler === 'string' || input.job_handler === null ? input.job_handler : null,
    on_leave_handlers: toStringArray(input.on_leave_handlers),
    labels: toStringArray(input.labels)
  };
  if (typeof input.x === 'number') {
    state.x = input.x;
  }
  if (typeof input.y === 'number') {
    state.y = input.y;
  }

  return state;
}

function normalizeTransition(input: unknown, statesByName: Map<string, WorkflowState>): WorkflowTransition | null {
  if (!isRecord(input) || typeof input.id !== 'string') {
    console.warn('[WorkflowAdapter] normalizeTransition: dropping transition with invalid structure', input);
    return null;
  }

  const sourceStateId =
    typeof input.sourceStateId === 'string'
      ? input.sourceStateId
      : typeof input.from_state === 'string'
        ? statesByName.get(input.from_state)?.id ?? ''
        : '';
  const targetStateId =
    typeof input.targetStateId === 'string'
      ? input.targetStateId
      : typeof input.to_state === 'string'
        ? statesByName.get(input.to_state)?.id ?? ''
        : '';

  if (sourceStateId.length === 0 || targetStateId.length === 0) {
    console.warn(
      '[WorkflowAdapter] normalizeTransition: dropping transition because source or target state was not resolved',
      { id: isRecord(input) ? input.id : input, from_state: isRecord(input) ? input.from_state : undefined, to_state: isRecord(input) ? input.to_state : undefined, sourceStateId, targetStateId }
    );
    return null;
  }

  const transition: WorkflowTransition = {
    ...clonePlain(input),
    id: input.id,
    label: typeof input.label === 'string' ? input.label : '',
    event: typeof input.event === 'string' || input.event === null ? input.event : '',
    is_active: input.is_active === undefined ? true : Boolean(input.is_active),
    enable_manual: input.enable_manual === undefined ? true : Boolean(input.enable_manual),
    description: typeof input.description === 'string' || input.description === null ? input.description : '',
    handlers: toStringArray(input.handlers),
    required_rules: toStringArray(input.required_rules),
    vertices: toPointArray(input.vertices),
    sourceStateId,
    targetStateId
  };
  if (typeof input.from_state === 'string') {
    transition.from_state = input.from_state;
  }
  if (typeof input.to_state === 'string') {
    transition.to_state = input.to_state;
  }

  return transition;
}

export function normalizeWorkflowDocument(input: unknown): WorkflowDocument {
  const source = isRecord(input) ? clonePlain(input) : {};
  const states = Array.isArray(source.states) ? source.states.map(normalizeState).filter((item): item is WorkflowState => item !== null) : [];
  const statesByName = new Map(states.map((state) => [state.name, state] as const));
  const transitions = Array.isArray(source.transitions)
    ? source.transitions
        .map((item) => normalizeTransition(item, statesByName))
        .filter((item): item is WorkflowTransition => item !== null)
    : [];

  const workflow: WorkflowDocument = {
    ...source,
    name: typeof source.name === 'string' ? source.name : 'New Workflow',
    is_active: source.is_active === undefined ? true : Boolean(source.is_active),
    description: typeof source.description === 'string' || source.description === null ? source.description : '',
    allowed_models: toAllowedModels(source.allowed_models),
    states,
    transitions
  };
  if (typeof source.id === 'string') {
    workflow.id = source.id;
  }
  return workflow;
}

function buildStateCellData(state: WorkflowState): WorkflowStateCellData {
  return {
    ...clonePlain(state),
    kind: 'state'
  };
}

function buildTransitionCellData(transition: WorkflowTransition): WorkflowTransitionCellData {
  return {
    ...clonePlain(transition),
    kind: 'transition'
  };
}

export function workflowToGraph(workflow: WorkflowDocument): joint.dia.Graph.JSON {
  const cells: joint.dia.Cell.JSON[] = [];

  workflow.states.forEach((state, index) => {
    const x = typeof state.x === 'number' ? state.x : 80 + (index % 4) * 220;
    const y = typeof state.y === 'number' ? state.y : 80 + Math.floor(index / 4) * 120;
    cells.push({
      id: state.id,
      type: 'workflow.State',
      position: { x, y },
      size: { width: DEFAULT_STATE_WIDTH, height: DEFAULT_STATE_HEIGHT },
      attrs: {
        label: {
          text: state.name
        }
      },
      data: buildStateCellData(state)
    } as joint.dia.Cell.JSON);
  });

  workflow.transitions.forEach((transition) => {
    cells.push({
      id: transition.id,
      type: 'workflow.Transition',
      source: {
        id: transition.sourceStateId,
        port: 'out'
      },
      target: {
        id: transition.targetStateId,
        port: 'in'
      },
      labels: transition.label.length > 0
        ? [
            {
              position: 0.5,
              attrs: {
                text: {
                  text: transition.label
                }
              }
            }
          ]
        : [],
      vertices: transition.vertices ?? [],
      data: buildTransitionCellData(transition)
    } as joint.dia.Cell.JSON);
  });

  return {
    cells
  } as joint.dia.Graph.JSON;
}

function getLinkStateId(endpoint: joint.dia.Link.EndJSON | joint.g.PlainPoint | null | undefined): string {
  if (!endpoint || !('id' in endpoint) || typeof endpoint.id !== 'string') {
    return '';
  }
  return endpoint.id;
}

function getStateLabel(data: WorkflowStateCellData, fallback: string): string {
  return typeof data.name === 'string' && data.name.length > 0 ? data.name : fallback;
}

export function graphToWorkflow(graph: joint.dia.Graph, base: WorkflowDocument): WorkflowDocument {
  const baseClone = clonePlain(base);
  const stateNameById = new Map<string, string>();

  const states = graph
    .getElements()
    .filter((element) => element.get('type') === 'workflow.State')
    .map((element) => {
      const data = clonePlain((element.get('data') ?? {}) as WorkflowStateCellData);
      const position = element.position();
      const label = String(element.attr('label/text') ?? data.name ?? '');
      const state: WorkflowState = {
        ...data,
        id: String(element.id),
        name: getStateLabel(data, label),
        x: position.x,
        y: position.y
      };
      stateNameById.set(state.id, state.name);
      return state;
    });

  const transitions = graph
    .getLinks()
    .filter((link) => link.get('type') === 'workflow.Transition')
    .map((link) => {
      const data = clonePlain((link.get('data') ?? {}) as WorkflowTransitionCellData);
      const sourceStateId = getLinkStateId(link.source());
      const targetStateId = getLinkStateId(link.target());
      const transition: WorkflowTransition = {
        ...data,
        id: String(link.id),
        label: String(link.label(0)?.attrs?.text?.text ?? data.label ?? ''),
        sourceStateId,
        targetStateId,
        from_state: stateNameById.get(sourceStateId) ?? '',
        to_state: stateNameById.get(targetStateId) ?? '',
        vertices: link.vertices().map((vertex) => ({ x: vertex.x, y: vertex.y }))
      };
      return transition;
    });

  return {
    ...baseClone,
    states,
    transitions
  };
}

export function exportWorkflowForSave(workflow: WorkflowDocument): Record<string, unknown> {
  const nameById = new Map(workflow.states.map((state) => [state.id, state.name] as const));

  return {
    ...clonePlain(workflow),
    allowed_models: (workflow.allowed_models ?? []).map((item) => (typeof item === 'string' ? item : item.id)),
    states: clonePlain(workflow.states),
    transitions: workflow.transitions.map((transition) => {
      const output = clonePlain(transition) as Record<string, unknown>;
      output.from_state = nameById.get(transition.sourceStateId) ?? transition.from_state ?? '';
      output.to_state = nameById.get(transition.targetStateId) ?? transition.to_state ?? '';
      delete output.sourceStateId;
      delete output.targetStateId;
      return output;
    })
  };
}

export function hasExplicitStatePositions(workflow: WorkflowDocument): boolean {
  if (workflow.states.length === 0) {
    return true;
  }
  return workflow.states.every((state) => typeof state.x === 'number' && typeof state.y === 'number');
}
