import * as joint from '@joint/core';
import { describe, expect, it } from 'vitest';
import { applyElementStatus, readElementStatus } from '../src/core/elementStatus';
import { FontIconElement } from '../src/shapes/FontIconElement';
import { ImageIconElement } from '../src/shapes/ImageIconElement';

const MAINTENANCE_BADGE_TEXT = String.fromCodePoint(0xE30B);

function getMarkupSelectors(element: joint.dia.Element): string[] {
  const markup = element.get('markup');
  if (!Array.isArray(markup)) {
    return [];
  }

  return markup.flatMap((item) => {
    if (typeof item !== 'object' || item === null || !('selector' in item)) {
      return [];
    }

    return typeof item.selector === 'string' ? [item.selector] : [];
  });
}

describe('elementStatus', () => {
  it('reads and updates status for font elements', () => {
    const element = new joint.dia.Element({
      id: 'node-1',
      type: 'noc.FontIconElement',
      size: { width: 64, height: 64 },
        attrs: {
          icon: {
            text: '\uF20A',
            size: 'gf-1x',
            status_code: 1
          },
          nodeName: {
            text: 'Core'
          },
          ipaddr: {
            text: '10.0.0.1'
          }
      },
      data: {
        id: 'node-1',
        address: '10.0.0.1',
        name: 'Core',
        status_code: 1
      }
    });

    expect(readElementStatus(element)).toEqual({ status_code: 1 });
    expect(applyElementStatus(element, {
      status_code: 36,
      metrics_label: 'CPU<br/>85%'
    })).toBe(true);
    expect(readElementStatus(element)).toEqual({
      status_code: 36,
      metrics_label: 'CPU<br/>85%'
    });
    expect(element.get('data')).toMatchObject({
      name: 'Core',
      isMaintenance: true,
      status_code: 36,
      metrics_label: 'CPU<br/>85%'
    });
    expect(element.attr('icon/status_code')).toBe(36);
    expect(element.attr('nodeName/text')).toBe('Core\nCPU\n85%');
    expect(element.attr('ipaddr/text')).toBe('10.0.0.1\nCPU\n85%');
  });

  it('reads and updates status for image elements', () => {
    const element = new joint.dia.Element({
      id: 'node-2',
      type: 'noc.ImageIconElement',
      size: { width: 64, height: 64 },
        attrs: {
          icon: {
            href: '#img-Cisco-router',
            width: '64',
            height: '64',
            status_code: 2
          },
          nodeName: {
            text: 'Router'
          },
          ipaddr: {
            text: '10.0.0.2'
          }
      },
      data: {
        id: 'node-2',
        address: '10.0.0.2',
        name: 'Router',
        status_code: 2
      }
    });

    expect(readElementStatus(element)).toEqual({ status_code: 2 });
    expect(applyElementStatus(element, {
      status_code: 4,
      metrics_label: ''
    })).toBe(true);
    expect(readElementStatus(element)).toEqual({ status_code: 4 });
    expect(element.get('data')).toMatchObject({
      name: 'Router',
      isMaintenance: false,
      status_code: 4,
      metrics_label: ''
    });
    expect(element.attr('icon/status_code')).toBe(4);
    expect(element.attr('nodeName/text')).toBe('Router');
    expect(element.attr('ipaddr/text')).toBe('10.0.0.2');
  });

  it('does not duplicate metrics in ipaddr on repeated updates', () => {
    const element = new joint.dia.Element({
      id: 'node-3',
      type: 'noc.FontIconElement',
      size: { width: 64, height: 64 },
        attrs: {
          icon: {
            text: '\uF20A',
            size: 'gf-1x',
            status_code: 1
          },
          nodeName: {
            text: 'Edge'
          },
          ipaddr: {
            text: '10.0.0.3'
          }
      },
      data: {
        id: 'node-3',
        address: '10.0.0.3',
        name: 'Edge',
        status_code: 1
      }
    });

    expect(applyElementStatus(element, {
      status_code: 2,
      metrics_label: 'CPU<br/>85%'
    })).toBe(true);
    expect(applyElementStatus(element, {
      status_code: 4,
      metrics_label: 'MEM<br/>90%'
    })).toBe(true);

    expect(element.get('data')).toMatchObject({
      isMaintenance: false
    });
    expect(element.attr('nodeName/text')).toBe('Edge\nMEM\n90%');
    expect(element.attr('ipaddr/text')).toBe('10.0.0.3\nMEM\n90%');
  });

  it('adds and removes maintenance badge for font elements without losing other overlays', () => {
    const userBadge = { code: 61972, position: 'SW' as const, form: 'c' as const };
    const element = new FontIconElement({
      data: {
        id: 'node-4',
        address: '10.0.0.4',
        name: 'Access',
        shapeOverlay: [userBadge]
      },
      attrs: {
        icon: {
          text: '\uF20A',
          size: 'gf-1x',
          status_code: 1
        },
        nodeName: {
          text: 'Access'
        },
        ipaddr: {
          text: '10.0.0.4'
        }
      }
    });

    expect(getMarkupSelectors(element)).not.toContain('badgeNe');
    expect(getMarkupSelectors(element)).toContain('badgeSw');

    expect(applyElementStatus(element, { status_code: 36 })).toBe(true);
    expect((element.get('data') as Record<string, unknown>).shapeOverlay).toEqual([
      { code: 0xE30B, position: 'NE', form: 'c' },
      userBadge
    ]);
    expect(getMarkupSelectors(element)).toContain('badgeNe');
    expect(getMarkupSelectors(element)).toContain('badgeSw');
    expect(element.attr('badgeNeText/text')).toBe(MAINTENANCE_BADGE_TEXT);
    expect(element.attr('badgeSwText/text')).toBe(String.fromCodePoint(userBadge.code));

    expect(applyElementStatus(element, { status_code: 4 })).toBe(true);
    expect((element.get('data') as Record<string, unknown>).shapeOverlay).toEqual([userBadge]);
    expect(getMarkupSelectors(element)).not.toContain('badgeNe');
    expect(getMarkupSelectors(element)).toContain('badgeSw');
  });

  it('adds and removes maintenance badge for image elements', () => {
    const element = new ImageIconElement({
      size: { width: 64, height: 64 },
      data: {
        id: 'node-5',
        address: '10.0.0.5',
        name: 'Router'
      },
      attrs: {
        icon: {
          href: '#img-Cisco-router',
          width: '64',
          height: '64',
          status_code: 1
        },
        nodeName: {
          text: 'Router'
        },
        ipaddr: {
          text: '10.0.0.5'
        }
      }
    });

    expect(getMarkupSelectors(element)).not.toContain('badgeNe');

    expect(applyElementStatus(element, { status_code: 36 })).toBe(true);
    expect(getMarkupSelectors(element)).toContain('badgeNe');
    expect(element.attr('badgeNeText/text')).toBe(MAINTENANCE_BADGE_TEXT);

    expect(applyElementStatus(element, { status_code: 4 })).toBe(true);
    expect(getMarkupSelectors(element)).not.toContain('badgeNe');
  });
});
