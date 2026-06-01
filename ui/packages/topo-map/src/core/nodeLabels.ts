import type * as joint from '@joint/core';
import { buildNodeLabelText } from './nodePresentation';
import type { NodeLabelField } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getDataString(data: unknown, key: string): string | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const value = data[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getAttrString(element: joint.dia.Element, path: string): string | undefined {
  const value = element.attr(path);
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function hasLabelDisplayAttr(element: joint.dia.Element): boolean {
  const nodeNameDisplay = element.attr('nodeName/display');
  const ipaddrDisplay = element.attr('ipaddr/display');
  return typeof nodeNameDisplay === 'string' || typeof ipaddrDisplay === 'string';
}

export function getVisibleNodeLabelFieldForElement(element: joint.dia.Element): NodeLabelField {
  const nodeNameVisible = element.attr('nodeName/display') !== 'none';
  const ipaddrVisible = element.attr('ipaddr/display') !== 'none';

  if (!nodeNameVisible && ipaddrVisible) {
    return 'ipaddr';
  }

  return 'nodeName';
}

export function getVisibleNodeLabelField(elements: joint.dia.Element[]): NodeLabelField {
  const active = elements.find((element) => hasLabelDisplayAttr(element));
  if (!active) {
    return 'nodeName';
  }

  return getVisibleNodeLabelFieldForElement(active);
}

export function readDisplayedLabel(element: joint.dia.Element): string | null {
  const data = element.get('data');
  const metricsLabel = getDataString(data, 'metrics_label');
  const nodeNameText =
    getAttrString(element, 'nodeName/text')
    ?? buildNodeLabelText(getDataString(data, 'name') ?? getDataString(data, 'label'), metricsLabel);
  const ipaddrText =
    getAttrString(element, 'ipaddr/text')
    ?? buildNodeLabelText(getDataString(data, 'address') ?? getDataString(data, 'ipaddr'), metricsLabel);

  const visibleField = getVisibleNodeLabelFieldForElement(element);
  if (visibleField === 'nodeName' && nodeNameText) {
    return nodeNameText;
  }

  if (visibleField === 'ipaddr' && ipaddrText) {
    return ipaddrText;
  }

  return nodeNameText ?? ipaddrText ?? null;
}
