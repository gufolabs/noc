import * as joint from '@joint/core';

const OUT_PORT_MARKUP = [
  {
    tagName: 'path',
    selector: 'portBody'
  },
  {
    tagName: 'path',
    selector: 'portCore'
  }
];

const PORT_DIAMOND_PATH = 'M 0 -7 L 7 0 L 0 7 L -7 0 Z';
const PORT_CORE_PATH = 'M 0 -3 L 3 0 L 0 3 L -3 0 Z';
const IN_PORT_MARKUP = [
  {
    tagName: 'circle',
    selector: 'portBody'
  },
  {
    tagName: 'circle',
    selector: 'portCore'
  }
];

export const WorkflowStateElement = joint.shapes.standard.Rectangle.define('workflow.State', {
  z: 2,
  size: {
    width: 100,
    height: 40
  },
  attrs: {
    body: {
      rx: 12,
      ry: 12,
      fill: '#ffffff',
      stroke: '#0f172a',
      strokeWidth: 2
    },
    label: {
      text: 'State',
      fill: '#333333',
      fontSize: 14
    }
  },
  ports: {
    groups: {
      in: {
        position: {
          name: 'left'
        },
        markup: IN_PORT_MARKUP,
        attrs: {
          portBody: {
            magnet: 'passive',
            r: 6,
            stroke: '#0f172a',
            strokeWidth: 2,
            fill: '#ffffff',
            display: 'none'
          },
          portCore: {
            r: 2.5,
            fill: '#475569',
            display: 'none',
            pointerEvents: 'none'
          }
        }
      },
      out: {
        position: {
          name: 'right'
        },
        markup: OUT_PORT_MARKUP,
        attrs: {
          portBody: {
            magnet: true,
            d: PORT_DIAMOND_PATH,
            stroke: '#0f172a',
            strokeWidth: 2,
            fill: '#ffffff',
            display: 'none'
          },
          portCore: {
            d: PORT_CORE_PATH,
            fill: '#0f766e',
            display: 'none',
            pointerEvents: 'none'
          }
        }
      }
    },
    items: [
      { id: 'in', group: 'in' },
      { id: 'out', group: 'out' }
    ]
  }
});
