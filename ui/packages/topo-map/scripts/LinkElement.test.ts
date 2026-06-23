import { describe, expect, it } from 'vitest';
import { LinkElement } from '../src/shapes/LinkElement';

describe('LinkElement', () => {
  it('derives stroke width from data.bw during initialization', () => {
    const link = new LinkElement({
      data: {
        bw: 100_000_000_000
      }
    });

    expect(link.attr('line/strokeWidth')).toBe(5);
    expect(link.attr('line/strokeDasharray')).toBeUndefined();
  });

  it('applies dashed style for links below 100M', () => {
    const link = new LinkElement({
      data: {
        bw: 50_000_000
      }
    });

    expect(link.attr('line/strokeWidth')).toBe(1);
    expect(link.attr('line/strokeDasharray')).toBe('10 5');
  });

  it('preserves explicitly provided line attrs', () => {
    const link = new LinkElement({
      data: {
        bw: 100_000_000_000
      },
      attrs: {
        line: {
          strokeWidth: 8,
          strokeDasharray: '2 2'
        }
      }
    });

    expect(link.attr('line/strokeWidth')).toBe(8);
    expect(link.attr('line/strokeDasharray')).toBe('2 2');
  });

  it('falls back to the lowest bandwidth style when data.bw is missing', () => {
    const link = new LinkElement({
      data: {}
    });

    expect(link.attr('line/strokeWidth')).toBe(1);
    expect(link.attr('line/strokeDasharray')).toBe('10 5');
  });
});
