export const DEFAULT_FONT_ICON_UNICODE = '\uF20A';
export const DEFAULT_FONT_ICON_SIZE_CLASS = 'gf-1x';
export const DEFAULT_STATUS_CODE = 0;

export const FONT_STATUS_CLASS_BY_CODE: Record<number, string> = {
  0: 'gf-unknown',
  1: 'gf-ok',
  2: 'gf-warn',
  3: 'gf-unknown',
  4: 'gf-fail'
};

export const IMAGE_STATUS_FILTER_BY_CODE: Record<number, string> = {
  0: 'osUnknown',
  1: 'osOk',
  2: 'osAlarm',
  3: 'osUnreach',
  4: 'osDown'
};

const DEFAULT_IMAGE_ICON_WIDTH = 64;
const DEFAULT_IMAGE_ICON_HEIGHT = 64;

type AttrMap = Record<string, unknown>;

interface BaseNodePresentationModel {
  name?: string | undefined;
  metricsLabel?: string | undefined;
  ipaddrText?: string | undefined;
  statusCode?: number | undefined;
}

export interface FontNodePresentationModel extends BaseNodePresentationModel {
  kind: 'font';
  iconUnicode?: string | undefined;
  iconSizeClass?: string | undefined;
}

export interface ImageNodePresentationModel extends BaseNodePresentationModel {
  kind: 'image';
  width: number;
  height: number;
  iconHref: string;
}

export type NodePresentationModel = FontNodePresentationModel | ImageNodePresentationModel;

function isRecord(value: unknown): value is AttrMap {
  return typeof value === 'object' && value !== null;
}

function getNonEmptyText(value: string | undefined): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function getEffectiveStatusCode(statusCode: number | undefined): number {
  const normalized = typeof statusCode === 'number' && Number.isFinite(statusCode) ? Math.trunc(statusCode) : DEFAULT_STATUS_CODE;
  return normalized & 0x1f;
}

export function getFontStatusClass(statusCode: number | undefined): string {
  return FONT_STATUS_CLASS_BY_CODE[getEffectiveStatusCode(statusCode)] ?? 'gf-unknown';
}

export function getImageStatusFilter(statusCode: number | undefined): string {
  return IMAGE_STATUS_FILTER_BY_CODE[getEffectiveStatusCode(statusCode)] ?? 'osUnknown';
}

function getNestedRecord(parent: AttrMap, key: string): AttrMap {
  const value = parent[key];
  return isRecord(value) ? value : {};
}

function omitKeys(record: AttrMap, keys: string[]): AttrMap {
  const nextRecord = { ...record };
  keys.forEach((key) => {
    delete nextRecord[key];
  });
  return nextRecord;
}

function buildLabelAttrs(text: string | undefined, customAttrs: AttrMap): AttrMap | undefined {
  if (text === undefined && Object.keys(customAttrs).length === 0) {
    return undefined;
  }

  const nextAttrs = { ...customAttrs };
  if (text !== undefined) {
    nextAttrs.text = text;
  }
  return nextAttrs;
}

function mergeNodeAttrs(
  customAttrs: AttrMap,
  iconAttrs: AttrMap,
  nodeNameText: string | undefined,
  ipaddrText: string | undefined
): AttrMap {
  const nextAttrs: AttrMap = {
    ...customAttrs,
    icon: {
      ...iconAttrs,
      ...getNestedRecord(customAttrs, 'icon')
    }
  };

  const nodeNameAttrs = buildLabelAttrs(nodeNameText, getNestedRecord(customAttrs, 'nodeName'));
  if (nodeNameAttrs) {
    nextAttrs.nodeName = nodeNameAttrs;
  }

  const ipaddrAttrs = buildLabelAttrs(ipaddrText, getNestedRecord(customAttrs, 'ipaddr'));
  if (ipaddrAttrs) {
    nextAttrs.ipaddr = ipaddrAttrs;
  }

  return nextAttrs;
}

export function getDefaultFontIconAttrs(): AttrMap {
  return {
    text: DEFAULT_FONT_ICON_UNICODE,
    size: DEFAULT_FONT_ICON_SIZE_CLASS,
    status_code: DEFAULT_STATUS_CODE
  };
}

export function getDefaultImageIconAttrs(
  width = DEFAULT_IMAGE_ICON_WIDTH,
  height = DEFAULT_IMAGE_ICON_HEIGHT
): AttrMap {
  return {
    width: String(width),
    height: String(height),
    status_code: DEFAULT_STATUS_CODE
  };
}

export function normalizeMetricsLabel(metricsLabel: string | undefined): string | undefined {
  const normalized = getNonEmptyText(metricsLabel)?.replace(/<br\s*\/?>/gi, '\n');
  return normalized && normalized.length > 0 ? normalized : undefined;
}

export function buildNodeLabelText(text: string | undefined, metricsLabel: string | undefined): string | undefined {
  const normalizedText = getNonEmptyText(text);
  const normalizedMetricsLabel = normalizeMetricsLabel(metricsLabel);

  if (!normalizedText) {
    return normalizedMetricsLabel;
  }
  if (!normalizedMetricsLabel) {
    return normalizedText;
  }
  return `${normalizedText}\n${normalizedMetricsLabel}`;
}

export function buildNodeNameText(name: string | undefined, metricsLabel: string | undefined): string | undefined {
  return buildNodeLabelText(name, metricsLabel);
}

export function buildNodePresentationAttrs(model: NodePresentationModel, customAttrs: AttrMap = {}): AttrMap {
  if (model.kind === 'image') {
    return mergeNodeAttrs(
      customAttrs,
      {
        href: model.iconHref,
        ...getDefaultImageIconAttrs(model.width, model.height),
        status_code: typeof model.statusCode === 'number' ? Math.trunc(model.statusCode) : DEFAULT_STATUS_CODE
      },
      buildNodeNameText(model.name, model.metricsLabel),
      model.ipaddrText
    );
  }

  const iconUnicode = getNonEmptyText(model.iconUnicode) ?? DEFAULT_FONT_ICON_UNICODE;
  const iconSizeClass = getNonEmptyText(model.iconSizeClass) ?? DEFAULT_FONT_ICON_SIZE_CLASS;

  return mergeNodeAttrs(
    customAttrs,
    {
      ...getDefaultFontIconAttrs(),
      text: iconUnicode,
      size: iconSizeClass,
      status_code: typeof model.statusCode === 'number' ? Math.trunc(model.statusCode) : DEFAULT_STATUS_CODE
    },
    buildNodeNameText(model.name, model.metricsLabel),
    model.ipaddrText
  );
}

export function getNodePresentationOverrides(attrs: unknown): AttrMap {
  if (!isRecord(attrs)) {
    return {};
  }

  const nextAttrs: AttrMap = { ...attrs };
  const iconOverrides = omitKeys(getNestedRecord(nextAttrs, 'icon'), [
    'text',
    'size',
    'status',
    'status_code',
    'href',
    'width',
    'height',
    'class',
    'filter'
  ]);
  const nodeNameOverrides = omitKeys(getNestedRecord(nextAttrs, 'nodeName'), ['text']);
  const ipaddrOverrides = omitKeys(getNestedRecord(nextAttrs, 'ipaddr'), ['text']);

  if (Object.keys(iconOverrides).length > 0) {
    nextAttrs.icon = iconOverrides;
  } else {
    delete nextAttrs.icon;
  }

  if (Object.keys(nodeNameOverrides).length > 0) {
    nextAttrs.nodeName = nodeNameOverrides;
  } else {
    delete nextAttrs.nodeName;
  }

  if (Object.keys(ipaddrOverrides).length > 0) {
    nextAttrs.ipaddr = ipaddrOverrides;
  } else {
    delete nextAttrs.ipaddr;
  }

  return nextAttrs;
}
