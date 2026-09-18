import { describe, expect, it } from 'vitest';
import { ImageIconElement } from '../src/shapes/ImageIconElement';

describe('ImageIconElement', () => {
  it('normalizes image references into matching href and xlinkHref values', () => {
    const element = new ImageIconElement({
      attrs: {
        nodeName: {
          text: ''
        },
        ipaddr: {
          text: ''
        },
        icon: {
          href: '#img-Cisco-workstation',
          status_code: 4
        }
      }
    });

    expect(element.attr('icon/href')).toBe('/stencils/Cisco/workstation.svg');
    expect(element.attr('icon/xlinkHref')).toBe('/stencils/Cisco/workstation.svg');
    expect(element.attr('icon/filter')).toBe('url(#osDown)');
  });

  it('keeps href in sync when only xlinkHref is updated', () => {
    const element = new ImageIconElement({
      attrs: {
        nodeName: {
          text: ''
        },
        ipaddr: {
          text: ''
        },
        icon: {
          href: '#img-Cisco-router',
          status_code: 2
        }
      }
    });

    element.attr('icon/xlinkHref', '#img-Cisco-workstation');

    expect(element.attr('icon/href')).toBe('/stencils/Cisco/workstation.svg');
    expect(element.attr('icon/xlinkHref')).toBe('/stencils/Cisco/workstation.svg');
    expect(element.attr('icon/filter')).toBe('url(#osAlarm)');
  });

  it('keeps filter in sync when attrs are replaced later', () => {
    const element = new ImageIconElement({
      size: {
        width: 64,
        height: 64
      },
      attrs: {
        nodeName: {
          text: ''
        },
        ipaddr: {
          text: ''
        },
        icon: {
          href: '#img-Cisco-router',
          status_code: 4
        }
      }
    });

    element.set('attrs', {
      ...element.get('attrs'),
      icon: {
        href: '#img-Cisco-router',
        status_code: 1
      }
    });

    expect(element.attr('icon/filter')).toBe('url(#osOk)');
    expect(element.attr('icon/href')).toBe('/stencils/Cisco/router.svg');
    expect(element.attr('icon/xlinkHref')).toBe('/stencils/Cisco/router.svg');
  });
});
