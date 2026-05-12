import type { NodeSearchField, NodeSearchResult } from '../types';
export { NODE_SEARCH_REQUEST_EVENT, NODE_SEARCH_RESULT_EVENT } from './constants';

export type NodeSearchMode = 'labelAndMove' | 'idAndMove';

export interface NodeSearchRequestDetail {
  query: string;
  mode?: NodeSearchMode;
  durationMs?: number;
}

export interface NodeSearchResultDetail extends Partial<NodeSearchResult> {
  query: string;
  mode: NodeSearchMode;
  field: NodeSearchField;
  found: boolean;
}

export function isNodeSearchMode(value: unknown): value is NodeSearchMode {
  return value === 'labelAndMove' || value === 'idAndMove';
}

export function normalizeNodeSearchMode(value: unknown): NodeSearchMode {
  return isNodeSearchMode(value) ? value : 'labelAndMove';
}

export function isNodeSearchRequestDetail(value: unknown): value is NodeSearchRequestDetail {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('query' in value) || typeof (value as { query?: unknown }).query !== 'string') {
    return false;
  }

  if ('mode' in value && !isNodeSearchMode((value as { mode?: unknown }).mode)) {
    return false;
  }

  if (
    'durationMs' in value &&
    typeof (value as { durationMs?: unknown }).durationMs !== 'undefined' &&
    typeof (value as { durationMs?: unknown }).durationMs !== 'number'
  ) {
    return false;
  }

  return true;
}
