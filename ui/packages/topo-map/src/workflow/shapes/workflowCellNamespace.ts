import * as joint from '@joint/core';
import { WorkflowStateElement } from './WorkflowStateElement';
import { WorkflowTransitionLink } from './WorkflowTransitionLink';

const shapesRecord = joint.shapes as Record<string, unknown>;

export const workflowCellNamespace: Record<string, unknown> = {
  workflow: {
    State: WorkflowStateElement,
    Transition: WorkflowTransitionLink
  },
  ...shapesRecord
};
