import type * as joint from '@joint/core';
import { getDefaultImageIconAttrs, getImageStatusFilter } from '../core/nodePresentation';
import type { ShapeOverlay, ShapeOverlayPosition } from '../core/types';
import { BADGE_SCALE, buildBadgeAttrs, buildBadgeMarkup, getBadgeOverlays } from './badgeOverlay';
import { createIconElement, getNestedRecord, getNumber, getString, IconElementConstructor, IconElementInstance } from './iconElementFactory';
import { elementMarkup, textLabelBg } from './labeling';

let stencilDir = '/stencils';

interface ImageIconElementMethods {
  setStatus: (statusCode: number) => void;
  convertImageIdToPath: (href: string) => string;
}

type ImageIconElementInstance = IconElementInstance<ImageIconElementMethods>;

interface ImageIconState {
  overlays: ShapeOverlay[];
  statusCode: number;
}

function getShapeOverlays(data: unknown): ShapeOverlay[] {
  return getBadgeOverlays(data);
}

function deriveImageIconState(instance: ImageIconElementInstance): ImageIconState {
  const data = instance.get('data');
  const iconAttrs = getNestedRecord(instance.get('attrs'), 'icon');
  return {
    overlays: getShapeOverlays(data),
    statusCode: getNumber(iconAttrs, 'status_code', 0)
  };
}

function buildImageMarkup(state: ImageIconState): joint.dia.MarkupJSON {
  const badgeMarkup = buildBadgeMarkup(state.overlays);
  return [...elementMarkup, { tagName: 'image', selector: 'icon', className: 'scalable' }, ...badgeMarkup];
}

function computeBadgeAttrs(instance: ImageIconElementInstance, state: ImageIconState): joint.dia.Cell.Selectors {
  const { width, height } = instance.size();
  const badgeSize = Math.min(width, height) * BADGE_SCALE;
  const badgeFontSize = badgeSize;
  const transforms: Record<ShapeOverlayPosition, string> = {
    NW: `translate(${badgeSize}, ${badgeSize})`,
    NE: `translate(calc(w-${badgeSize}), ${badgeSize})`,
    SW: `translate(${badgeSize}, calc(h-${badgeSize}))`,
    SE: `translate(calc(w-${badgeSize}), calc(h-${badgeSize}))`,
    N: `translate(calc(w/2), ${badgeSize})`,
    E: `translate(calc(w-${badgeSize}), calc(h/2))`,
    S: `translate(calc(w/2), calc(h-${badgeSize}))`,
    W: `translate(${badgeSize}, calc(h/2))`
  };
  return buildBadgeAttrs(state.overlays, state.statusCode, badgeSize, badgeFontSize, transforms);
}

function syncImageHref(
  instance: ImageIconElementInstance,
  iconAttrs: Record<string, unknown>
): void {
  const currentHref = getString(iconAttrs, 'href');
  const currentXlinkHref = getString(iconAttrs, 'xlinkHref');
  const nextHref = currentXlinkHref || currentHref;
  if (nextHref.length === 0) {
    return;
  }

  const normalizedHref = instance.convertImageIdToPath(nextHref);
  if (currentHref !== normalizedHref) {
    instance.attr('icon/href', normalizedHref);
  }
  if (currentXlinkHref !== normalizedHref) {
    instance.attr('icon/xlinkHref', normalizedHref);
  }
}

function syncImagePresentation(instance: ImageIconElementInstance): void {
  const state = deriveImageIconState(instance);
  const iconAttrs = getNestedRecord(instance.get('attrs'), 'icon');
  syncImageHref(instance, iconAttrs);
  instance.setStatus(getNumber(iconAttrs, 'status_code', 0));
  instance.attr(computeBadgeAttrs(instance, state));
}

export function setStencilDir(dir: string): void {
  stencilDir = dir;
}

export function getStencilDir(): string {
  return stencilDir;
}

export const ImageIconElement: IconElementConstructor = createIconElement<ImageIconElementMethods>({
  type: 'noc.ImageIconElement',
  attrs: {
    icon: {
      ...getDefaultImageIconAttrs(),
      xlinkHref: '',
      preserveAspectRatio: 'xMidYMid meet'
    },
    nodeName: {
      text: 'New Object',
      fill: '#000000',
      ...textLabelBg,
      ref: 'icon',
      refX: '50%',
      refY: '105%',
      textAnchor: 'middle',
      lineHeight: '1em',
      display: 'block'
    },
    ipaddr: {
      text: '',
      fill: '#000000',
      ...textLabelBg,
      ref: 'icon',
      refX: '50%',
      refY: '105%',
      textAnchor: 'middle',
      lineHeight: '1em',
      display: 'none'
    }
  },
  buildMarkup: (instance) => buildImageMarkup(deriveImageIconState(instance as ImageIconElementInstance)),
  onIconInit: (instance) => {
    const element = instance as ImageIconElementInstance;
    let syncing = false;

    const sync = (rebuildMarkup: boolean): void => {
      if (syncing) {
        return;
      }
      syncing = true;
      try {
        if (rebuildMarkup) {
          element.set('markup', buildImageMarkup(deriveImageIconState(element)), { silent: true });
        }
        syncImagePresentation(element);
      } finally {
        syncing = false;
      }
    };

    sync(false);
    element.on('change:attrs', () => {
      sync(false);
    });
    element.on('change:data', () => {
      sync(true);
    });
  },
  methods: {
    setStatus: function (this: ImageIconElementInstance, statusCode: number): void {
      const filter = getImageStatusFilter(statusCode);
      this.attr('icon/filter', `url(#${filter})`);
    },

    convertImageIdToPath: function (this: ImageIconElementInstance, href: string): string {
      if (href.startsWith('#img-')) {
        const iconId = href.slice(5);
        const iconPath = iconId.replace(/-/, '/').replace(/-/g, '_');
        return `${stencilDir}/${iconPath}.svg`;
      }
      return href;
    }
  }
});
