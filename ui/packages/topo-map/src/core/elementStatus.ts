import type * as joint from '@joint/core';
import {
  buildNodeLabelText,
  buildNodePresentationAttrs,
  getNodePresentationOverrides,
  normalizeMetricsLabel,
  type NodePresentationModel
} from './nodePresentation';
import { MAINTENANCE_STATUS_BIT, readShapeOverlays, syncMaintenanceShapeOverlay } from './shapeOverlay';
import type { ElementStatusUpdate } from './types';

type AttrMap = Record<string, unknown>;

function isRecord(value: unknown): value is AttrMap {
  return typeof value === 'object' && value !== null;
}

function getString(record: AttrMap, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getNumber(record: AttrMap, key: string): number | undefined {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : undefined;
}

export function isStatusSupportedElement(cell: joint.dia.Cell | null | undefined): cell is joint.dia.Element {
  if (!cell?.isElement()) {
    return false;
  }

  const type = String(cell.get('type') ?? '');
  return type === 'noc.FontIconElement' || type === 'noc.ImageIconElement';
}

export function readElementStatus(element: joint.dia.Element): ElementStatusUpdate | null {
  const data = isRecord(element.get('data')) ? element.get('data') : {};
  const statusCode = getNumber(data, 'status_code');
  if (typeof statusCode === 'number') {
    const metricsLabel = getString(data, 'metrics_label');
    return metricsLabel ? { status_code: statusCode, metrics_label: metricsLabel } : { status_code: statusCode };
  }

  const fallbackStatusCode = element.attr('icon/status_code');
  if (typeof fallbackStatusCode === 'number' && Number.isFinite(fallbackStatusCode)) {
    return { status_code: Math.trunc(fallbackStatusCode) };
  }

  return null;
}

export function applyElementStatus(element: joint.dia.Element, update: ElementStatusUpdate): boolean {
  if (!isStatusSupportedElement(element) || !Number.isFinite(update.status_code)) {
    return false;
  }

  const rawStatusCode = Math.trunc(update.status_code);
  const currentData = isRecord(element.get('data')) ? element.get('data') : {};
  const currentName = getString(currentData, 'name') ?? getString(currentData, 'label') ?? String(element.attr('nodeName/text') ?? '');
  const currentIpaddr = getBaseIpaddrText(element, currentData);
  const nextMetricsLabel =
    Object.prototype.hasOwnProperty.call(update, 'metrics_label')
      ? update.metrics_label
      : getString(currentData, 'metrics_label');
  const isMaintenance = (rawStatusCode & MAINTENANCE_STATUS_BIT) !== 0;
  const nextShapeOverlay = syncMaintenanceShapeOverlay(readShapeOverlays(currentData), isMaintenance);
  const nextData: AttrMap = {
    ...currentData,
    name: currentName,
    address: currentIpaddr,
    isMaintenance,
    status_code: rawStatusCode,
    metrics_label: nextMetricsLabel
  };
  if (nextShapeOverlay.length > 0) {
    nextData.shapeOverlay = nextShapeOverlay;
  } else {
    delete nextData.shapeOverlay;
  }
  delete nextData.status;
  delete nextData.iconStatusClass;
  delete nextData.label;

  const nextPresentationModel = buildPresentationModelForElement(
    element,
    currentName,
    currentIpaddr,
    nextMetricsLabel,
    rawStatusCode
  );
  const nextAttrs = buildNodePresentationAttrs(
    nextPresentationModel,
    getNodePresentationOverrides(element.get('attrs'))
  );

  element.set('data', nextData);
  element.set('attrs', nextAttrs);
  return true;
}

function buildPresentationModelForElement(
  element: joint.dia.Element,
  name: string | undefined,
  ipaddrText: string | undefined,
  metricsLabel: string | undefined,
  statusCode: number
): NodePresentationModel {
  const type = String(element.get('type') ?? '');
  const iconText = String(element.attr('icon/text') ?? '');
  const iconSize = String(element.attr('icon/size') ?? '');
  const iconHref = String(element.attr('icon/href') ?? element.attr('icon/xlinkHref') ?? '');
  const nextIpaddrText = buildNodeLabelText(ipaddrText, metricsLabel);

  if (type === 'noc.ImageIconElement') {
    const size = element.size();
    return {
      kind: 'image',
      width: size.width,
      height: size.height,
      iconHref,
      statusCode,
      name,
      metricsLabel,
      ipaddrText: nextIpaddrText
    };
  }

  return {
    kind: 'font',
    iconUnicode: iconText,
    iconSizeClass: iconSize,
    statusCode,
    name,
    metricsLabel,
    ipaddrText: nextIpaddrText
  };
}

function getBaseIpaddrText(element: joint.dia.Element, currentData: AttrMap): string | undefined {
  const storedAddress = getString(currentData, 'address') ?? getString(currentData, 'ipaddr');
  if (storedAddress !== undefined) {
    return storedAddress;
  }

  const currentIpaddrText = getString({ value: element.attr('ipaddr/text') }, 'value');
  if (currentIpaddrText === undefined) {
    return undefined;
  }

  const currentMetricsLabel = getString(currentData, 'metrics_label');
  const normalizedMetricsLabel = normalizeMetricsLabel(currentMetricsLabel);
  if (!normalizedMetricsLabel) {
    return currentIpaddrText;
  }
  if (currentIpaddrText === normalizedMetricsLabel) {
    return undefined;
  }

  const suffix = `\n${normalizedMetricsLabel}`;
  if (currentIpaddrText.endsWith(suffix)) {
    const nextText = currentIpaddrText.slice(0, -suffix.length);
    return nextText.length > 0 ? nextText : undefined;
  }

  return currentIpaddrText;
}
