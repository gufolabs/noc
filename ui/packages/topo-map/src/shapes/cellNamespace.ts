import * as joint from '@joint/core';
import { FontIconElement } from './FontIconElement';
import { ImageIconElement } from './ImageIconElement';
import { LinkElement } from './LinkElement';

const shapesRecord = joint.shapes as Record<string, unknown>;

export const cellNamespace: Record<string, unknown> = {
  noc: {
    FontIconElement,
    ImageIconElement,
    LinkElement
  },
  ...shapesRecord,
};
