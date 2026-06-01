import * as joint from '@joint/core';

export const WorkflowTransitionLink = joint.shapes.standard.Link.define('workflow.Transition', {
  z: 1,
  attrs: {
    line: {
      stroke: '#334155',
      strokeWidth: 2,
      targetMarker: {
        type: 'path',
        d: 'M 10 -5 0 0 10 5 z'
      }
    }
  },
  router: {
    name: 'orthogonal'
  },
  connector: {
    name: 'rounded'
  }
});
