    // For performance: icon sizes are defined via CSS classes (e.g. gf-1x, gf-2x) instead of being
    // computed at runtime. After element creation, the size is validated and resized if it doesn't match.
    const GF_SIZE_MAP = {
      'gf-1x': 64,
      'gf-2x': 128,
      'gf-3x': 192,
      'gf-16px': 16,
      'gf-24px': 24,
      'gf-32px': 32,
      'gf-48px': 48,
    };

    function computeSize(iconSize) {
      const iconPadding = iconSize / 2;
      const labelHeight = Math.ceil(iconSize * 1.85 / 4);
      const labelGap = iconSize * 0.25;
      return {
        width: iconSize * 4,
        height: iconPadding + iconSize + labelHeight * 2 + labelGap / 2,
      };
    }

    const POSITION_TO_SELECTOR = {
      NW: 'badgeNw', NE: 'badgeNe',
      SW: 'badgeSw', SE: 'badgeSe',
      N: 'badgeN', E: 'badgeE',
      S: 'badgeS', W: 'badgeW',
    };

    function makeBadgeMarkup(selector, form) {
      const shape = form === 'c' ? 'circle' : 'rect';
      return {
        tagName: 'g', selector,
        children: [
          { tagName: shape, selector: `${selector}Bg` },
          { tagName: 'text', selector: `${selector}Text` },
        ]
      };
    }

    const fontNodeMarkup = [
      { tagName: 'text', selector: 'nodeName' },
      { tagName: 'text', selector: 'ipaddr' },
      { tagName: 'text', selector: 'icon' },
      { tagName: 'rect', selector: 'iconArea' }, // invisible bbox proxy for icon (text getBBox() is unreliable in Safari)
    ];

    function makeLabelAttrs(text) {
      return {
        ref: 'iconArea',
        refX: '50%',
        y: 'calc(1.7*w)',
        fontSize: 'calc(w / 4)',
        display: 'none',
        textAnchor: 'middle',
        fill: '#000000',
        stroke: 'red',
        strokeWidth: 0.5,
        paintOrder: 'stroke fill',
        fontFamily: 'monospace',
        textWrap: { width: 'calc(3*w)', ellipsis: false },
        text,
      };
    }

    function computeBadgeAttrs(iconSize, shapeOverlay) {
      const badgeSize = iconSize / 4;
      const badgeFontSize = iconSize / 4;
      // iconArea: invisible rect overlaying the icon, used as a reliable bbox proxy for ref
      const iconXY = 0.375 * iconSize * 4; // matches calc(0.375*w) attribute on icon
      const TRANSFORMS = {
        NW: `translate(${badgeSize}, ${badgeSize})`,
        NE: `translate(calc(w-${badgeSize}), ${badgeSize})`,
        SW: `translate(${badgeSize}, calc(h-${badgeSize}))`,
        SE: `translate(calc(w-${badgeSize}), calc(h-${badgeSize}))`,
        N: `translate(calc(w/2), ${badgeSize})`,
        E: `translate(calc(w-${badgeSize}), calc(h/2))`,
        S: `translate(calc(w/2), calc(h-${badgeSize}))`,
        W: `translate(${badgeSize}, calc(h/2))`,
      };
      const attrs = {
        iconArea: { x: iconXY, y: iconXY, width: iconSize, height: iconSize, fill: 'none', stroke: 'none' },
      };
      for (const { position, code, form } of shapeOverlay) {
        const selector = POSITION_TO_SELECTOR[position];
        if (!selector) continue;
        const shapeGeom = form === 'c'
          ? { cx: 0, cy: 0, r: badgeSize }
          : { x: -badgeSize, y: -badgeSize, width: badgeSize * 2, height: badgeSize * 2 };
        attrs[selector] = { transform: TRANSFORMS[position] };
        attrs[`${selector}Bg`] = { fill: '#FFFFFF', stroke: 'black', strokeWidth: 0.5, ...shapeGeom };
        attrs[`${selector}Text`] = {
          x: 0, y: badgeFontSize / 2, fontSize: badgeFontSize,
          textAnchor: 'middle', fontFamily: 'GufoFont', fill: '#000000',
          text: String.fromCodePoint(code),
        };
      }
      return attrs;
    }

    const FontIconElement = joint.dia.Element.define('noc.FontIconElement', {
      markup: fontNodeMarkup,
      attrs: {
        icon: {
          fontFamily: 'GufoFont',
          x: 'calc(0.375*w)',
          y: 'calc(0.375*w)',
          strokeWidth: 0.5,
        },
        nodeName: {
          ...makeLabelAttrs(''),
          display: 'block',
        },
        ipaddr: {
          ...makeLabelAttrs(''),
        },
      },
    }, {
      initialize: function (...args) {
        joint.dia.Element.prototype.initialize.apply(this, args);
        const data = this.get('data') ?? {};
        const cls = data.cls ?? 'gf-1x';
        const shapeOverlay = data.shapeOverlay ?? [];
        const iconSize = GF_SIZE_MAP[cls] ?? 64;
        const expected = computeSize(iconSize);
        const current = this.size();
        if (current.width !== expected.width || current.height !== expected.height) {
          this.resize(expected.width, expected.height, { silent: true });
        }
        const badgeMarkup = shapeOverlay
          .filter(({ position }) => POSITION_TO_SELECTOR[position])
          .map(({ position, form }) => makeBadgeMarkup(POSITION_TO_SELECTOR[position], form));
        this.set('markup', [...fontNodeMarkup, ...badgeMarkup]);
        this.attr({
          ...computeBadgeAttrs(iconSize, shapeOverlay),
          icon: { class: `gf ${cls}`, text: data.glyph ?? '' },
          nodeName: { text: data.name ?? '' },
          ipaddr: { text: data.address ?? '' },
        });
      },
    });

