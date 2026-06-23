import { describe, expect, it } from 'vitest';
import { FontIconElement } from '../src/shapes/FontIconElement';

describe('FontIconElement', () => {
  it('builds script-style markup, badges and size from shapeOverlay', () => {
    const element = new FontIconElement({
      size: {
        width: 64,
        height: 64
      },
      data: {
        shapeOverlay: [{ code: 61972, position: 'NE', form: 'c' }]
      },
      attrs: {
        nodeName: {
          text: ''
        },
        ipaddr: {
          text: ''
        },
        icon: {
          text: String.fromCodePoint(61996),
          size: 'gf-1x',
          status_code: 1
        }
      }
    });

    expect(element.get('markup')).toEqual(expect.arrayContaining([
      expect.objectContaining({ selector: 'iconArea' }),
      expect.objectContaining({ selector: 'badgeNe' })
    ]));
    expect(element.size()).toEqual({
      width: 256,
      height: 164
    });
    expect(element.attr('badgeNeText/text')).toBe(String.fromCodePoint(61972));
    expect(element.attr('badgeNeText/class')).toBe('gf');
    expect(element.attr('badgeNeText/class')).toContain('gf');
    expect(element.attr('badgeNeText/style')).toBe('--gf-size: 9.6px;');
    expect(element.attr('iconArea/width')).toBe(64);
    expect(element.attr('icon/class')).toContain('gf-1x');
  });

  it('rebuilds font presentation when attrs are updated later', () => {
    const element = new FontIconElement({
      data: {
        shapeOverlay: [{ code: 61972, position: 'NE', form: 'c' }]
      },
      attrs: {
        nodeName: {
          text: ''
        },
        ipaddr: {
          text: ''
        },
        icon: {
          text: String.fromCodePoint(61996),
          size: 'gf-1x',
          status_code: 1
        }
      }
    });

    element.set('attrs', {
      ...element.get('attrs'),
      icon: {
        text: String.fromCodePoint(61996),
        size: 'gf-2x',
        status_code: 4
      }
    });

    expect(element.size()).toEqual({
      width: 512,
      height: 328
    });
    expect(element.attr('icon/class')).toContain('gf-2x');
    expect(element.attr('icon/class')).toContain('gf-fail');
    expect(element.attr('badgeNeText/class')).toBe('gf');
    expect(element.attr('badgeNeText/style')).toBe('--gf-size: 19.2px;');
  });
});
