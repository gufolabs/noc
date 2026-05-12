import * as joint from '@joint/core';
import { elementMarkup } from './labeling';

export type IconElementInstance<TMethods extends object> = joint.dia.Element &
  TMethods & {
    toggleLabel: () => void;
  };

export interface IconElementFactoryConfig<TMethods extends object> {
  type: string;
  attrs: joint.dia.Element.Attributes;
  iconMarkup?: {
    tagName: string;
    selector: string;
    className?: string;
  };
  buildMarkup?: (instance: joint.dia.Element & TMethods) => joint.dia.MarkupJSON;
  methods: TMethods;
  onIconInit?: (instance: joint.dia.Element & TMethods, iconAttrs: Record<string, unknown>) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getNestedRecord(parent: unknown, key: string): Record<string, unknown> {
  if (!isRecord(parent)) {
    return {};
  }
  const value = parent[key];
  if (!isRecord(value)) {
    return {};
  }
  return value;
}

export function getString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

export function getNumber(record: Record<string, unknown>, key: string, fallback: number): number {
  const value = record[key];
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function toggleLabel(this: joint.dia.Element): void {
  const nodeNameDisplay = this.attr('nodeName/display');
  const ipaddrDisplay = this.attr('ipaddr/display');
  const newNodeNameDisplay = nodeNameDisplay === 'none' ? 'block' : 'none';
  const newIpaddrDisplay = ipaddrDisplay === 'none' ? 'block' : 'none';
  this.attr('nodeName/display', newNodeNameDisplay);
  this.attr('ipaddr/display', newIpaddrDisplay);
}

export type IconElementConstructor = joint.dia.Cell.Constructor<
  joint.dia.Element<joint.dia.Element.Attributes, joint.dia.ModelSetOptions>
>;

export function createIconElement<TMethods extends object>(
  config: IconElementFactoryConfig<TMethods>
): IconElementConstructor {
  type Instance = IconElementInstance<TMethods>;

  return joint.dia.Element.define(
    config.type,
    {
      type: config.type,
      z: 100,
      attrs: config.attrs
    },
    {
      initialize: function (this: Instance, ...args: joint.dia.Element.Attributes[]) {
        joint.dia.Element.prototype.initialize.apply(this, args as [joint.dia.Element.Attributes]);
        const markup = config.buildMarkup?.(this as joint.dia.Element & TMethods)
          ?? [...elementMarkup, ...(config.iconMarkup ? [config.iconMarkup] : [])];
        this.set('markup', markup, { silent: true });

        const attrs = this.get('attrs');
        const iconAttrs = getNestedRecord(attrs, 'icon');

        config.onIconInit?.(this as joint.dia.Element & TMethods, iconAttrs);
      },

      toggleLabel,
      ...config.methods
    }
  );
}
