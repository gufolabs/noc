export const textLabelBg = {
  stroke: '#FFFFFF',
  strokeWidth: 3,
  paintOrder: 'stroke fill'
} as const;

export const elementMarkup = [
  { tagName: 'text', selector: 'nodeName', className: 'rotatable' },
  { tagName: 'text', selector: 'ipaddr', className: 'rotatable' }
] as const;
