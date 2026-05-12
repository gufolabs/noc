import * as joint from '@joint/core';
import type { NodeLabelField, NodeSearchField, NodeSearchResult } from '../core/types';

interface SearchEntry {
  id: string;
  normalizedId: string;
  nodeName: string;
  normalizedNodeName: string;
  ipaddr: string;
  normalizedIpaddr: string;
  order: number;
}

interface SortedEntry {
  id: string;
  text: string;
  normalizedText: string;
  order: number;
}

interface FieldIndex {
  exact: Map<string, SortedEntry[]>;
  sorted: SortedEntry[];
  trigrams: Map<string, Set<string>>;
}

const SEARCH_FIELDS: NodeSearchField[] = ['id', 'nodeName', 'ipaddr'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class NodeSearchIndexManager {
  private readonly graph: joint.dia.Graph;

  private entriesById = new Map<string, SearchEntry>();

  private indexes: Record<NodeSearchField, FieldIndex> = {
    id: this.createEmptyFieldIndex(),
    nodeName: this.createEmptyFieldIndex(),
    ipaddr: this.createEmptyFieldIndex()
  };

  private readonly onAddOrRemoveBound = (): void => {
    this.rebuildIndex();
  };

  private readonly onDataChangeBound = (cell: joint.dia.Cell): void => {
    if (!cell.isElement()) {
      return;
    }

    const id = String(cell.id);
    const current = this.entriesById.get(id);
    const nextNormalizedId = this.normalizeSearchText(id);
    const nextNodeName = this.readSearchText(cell, 'nodeName');
    const nextIpaddr = this.readSearchText(cell, 'ipaddr');
    const nextNormalizedNodeName = this.normalizeSearchText(nextNodeName);
    const nextNormalizedIpaddr = this.normalizeSearchText(nextIpaddr);

    if (!current) {
      this.rebuildIndex();
      return;
    }

    if (
      current.normalizedId !== nextNormalizedId ||
      current.normalizedNodeName !== nextNormalizedNodeName ||
      current.normalizedIpaddr !== nextNormalizedIpaddr
    ) {
      this.rebuildIndex();
    }
  };

  public constructor(graph: joint.dia.Graph) {
    this.graph = graph;
    this.rebuildIndex();

    this.graph.on('add', this.onAddOrRemoveBound);
    this.graph.on('remove', this.onAddOrRemoveBound);
    this.graph.on('change:data', this.onDataChangeBound);
  }

  public rebuildIndex(): void {
    this.entriesById = new Map();
    this.indexes.id = this.createEmptyFieldIndex();
    this.indexes.nodeName = this.createEmptyFieldIndex();
    this.indexes.ipaddr = this.createEmptyFieldIndex();

    this.graph.getElements().forEach((element, order) => {
      const entry: SearchEntry = {
        id: String(element.id),
        normalizedId: '',
        nodeName: this.readSearchText(element, 'nodeName'),
        normalizedNodeName: '',
        ipaddr: this.readSearchText(element, 'ipaddr'),
        normalizedIpaddr: '',
        order
      };
      entry.normalizedId = this.normalizeSearchText(entry.id);
      entry.normalizedNodeName = this.normalizeSearchText(entry.nodeName);
      entry.normalizedIpaddr = this.normalizeSearchText(entry.ipaddr);
      this.entriesById.set(entry.id, entry);

      SEARCH_FIELDS.forEach((field) => {
        const text = this.getFieldText(entry, field);
        const normalizedText = this.getNormalizedFieldText(entry, field);
        if (normalizedText.length === 0) {
          return;
        }

        const sortedEntry: SortedEntry = {
          id: entry.id,
          text,
          normalizedText,
          order: entry.order
        };
        this.addExactEntry(field, sortedEntry);
        this.getIndex(field).sorted.push(sortedEntry);
        this.addTrigrams(field, sortedEntry);
      });
    });

    SEARCH_FIELDS.forEach((field) => {
      this.getIndex(field).sorted.sort((left, right) => {
        if (left.normalizedText === right.normalizedText) {
          return left.order - right.order;
        }
        return left.normalizedText.localeCompare(right.normalizedText);
      });
    });
  }

  public search(field: NodeSearchField, query: string): NodeSearchResult | null {
    const normalizedQuery = this.normalizeSearchText(query);
    if (normalizedQuery.length === 0) {
      return null;
    }

    const exactMatch = this.findExact(field, normalizedQuery);
    if (exactMatch) {
      return { id: exactMatch.id, text: exactMatch.text, field };
    }

    const prefixMatch = this.findPrefix(field, normalizedQuery);
    if (prefixMatch) {
      return { id: prefixMatch.id, text: prefixMatch.text, field };
    }

    const containsMatch = this.findContains(field, normalizedQuery);
    if (containsMatch) {
      return { id: containsMatch.id, text: containsMatch.text, field };
    }

    return null;
  }

  public destroy(): void {
    this.graph.off('add', this.onAddOrRemoveBound);
    this.graph.off('remove', this.onAddOrRemoveBound);
    this.graph.off('change:data', this.onDataChangeBound);
    this.entriesById.clear();
    this.indexes.id = this.createEmptyFieldIndex();
    this.indexes.nodeName = this.createEmptyFieldIndex();
    this.indexes.ipaddr = this.createEmptyFieldIndex();
  }

  private createEmptyFieldIndex(): FieldIndex {
    return {
      exact: new Map(),
      sorted: [],
      trigrams: new Map()
    };
  }

  private getIndex(field: NodeSearchField): FieldIndex {
    return this.indexes[field];
  }

  private readSearchText(element: joint.dia.Element, field: NodeLabelField): string {
    const data = element.get('data');
    if (!isRecord(data)) {
      return '';
    }

    const key = field === 'nodeName' ? 'name' : 'address';
    const value = data[key];
    return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  }

  private normalizeSearchText(value: string): string {
    return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  }

  private addExactEntry(field: NodeSearchField, entry: SortedEntry): void {
    const bucket = this.getIndex(field).exact.get(entry.normalizedText) ?? [];
    bucket.push(entry);
    this.getIndex(field).exact.set(entry.normalizedText, bucket);
  }

  private addTrigrams(field: NodeSearchField, entry: SortedEntry): void {
    const grams = this.buildTrigrams(entry.normalizedText);
    if (grams.length === 0) {
      return;
    }

    grams.forEach((gram) => {
      const bucket = this.getIndex(field).trigrams.get(gram) ?? new Set<string>();
      bucket.add(entry.id);
      this.getIndex(field).trigrams.set(gram, bucket);
    });
  }

  private findExact(field: NodeSearchField, normalizedQuery: string): SortedEntry | null {
    const bucket = this.getIndex(field).exact.get(normalizedQuery);
    if (!bucket || bucket.length === 0) {
      return null;
    }

    return this.pickBestCandidate(bucket);
  }

  private findPrefix(field: NodeSearchField, normalizedQuery: string): SortedEntry | null {
    const sorted = this.getIndex(field).sorted;
    if (sorted.length === 0) {
      return null;
    }

    let left = 0;
    let right = sorted.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const midEntry = sorted[mid];
      if (!midEntry) {
        break;
      }
      if (midEntry.normalizedText.localeCompare(normalizedQuery) < 0) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    let best: SortedEntry | null = null;
    for (let index = left; index < sorted.length; index += 1) {
      const candidate = sorted[index];
      if (!candidate) {
        break;
      }
      if (!candidate.normalizedText.startsWith(normalizedQuery)) {
        break;
      }
      if (!best || candidate.order < best.order) {
        best = candidate;
      }
    }

    return best;
  }

  private findContains(field: NodeSearchField, normalizedQuery: string): SortedEntry | null {
    const candidates = normalizedQuery.length >= 3
      ? this.collectTrigramCandidates(field, normalizedQuery)
      : this.getIndex(field).sorted;
    if (candidates.length === 0) {
      return null;
    }

    let best: SortedEntry | null = null;
    for (const candidate of candidates) {
      if (!candidate.normalizedText.includes(normalizedQuery)) {
        continue;
      }
      if (!best || candidate.order < best.order) {
        best = candidate;
      }
    }

    return best;
  }

  private collectTrigramCandidates(field: NodeSearchField, normalizedQuery: string): SortedEntry[] {
    const grams = this.buildTrigrams(normalizedQuery);
    if (grams.length === 0) {
      return this.getIndex(field).sorted;
    }

    const buckets = grams
      .map((gram) => this.getIndex(field).trigrams.get(gram))
      .filter((bucket): bucket is Set<string> => Boolean(bucket))
      .sort((left, right) => left.size - right.size);
    if (buckets.length !== grams.length || buckets.length === 0) {
      return [];
    }

    const [seed, ...rest] = buckets;
    if (!seed) {
      return [];
    }
    const candidateIds = Array.from(seed).filter((id) => rest.every((bucket) => bucket.has(id)));

    return candidateIds
      .map((id) => this.entriesById.get(id))
      .filter((entry): entry is SearchEntry => Boolean(entry))
      .map((entry) => ({
        id: entry.id,
        text: this.getFieldText(entry, field),
        normalizedText: this.getNormalizedFieldText(entry, field),
        order: entry.order
      }));
  }

  private getFieldText(entry: SearchEntry, field: NodeSearchField): string {
    if (field === 'id') {
      return entry.id;
    }
    return entry[field];
  }

  private getNormalizedFieldText(entry: SearchEntry, field: NodeSearchField): string {
    if (field === 'id') {
      return entry.normalizedId;
    }
    return field === 'nodeName' ? entry.normalizedNodeName : entry.normalizedIpaddr;
  }

  private buildTrigrams(value: string): string[] {
    if (value.length < 3) {
      return [];
    }

    const grams = new Set<string>();
    for (let index = 0; index <= value.length - 3; index += 1) {
      grams.add(value.slice(index, index + 3));
    }
    return Array.from(grams);
  }

  private pickBestCandidate(entries: SortedEntry[]): SortedEntry | null {
    const first = entries[0];
    if (!first) {
      return null;
    }

    let best = first;
    for (let index = 1; index < entries.length; index += 1) {
      const candidate = entries[index];
      if (candidate && candidate.order < best.order) {
        best = candidate;
      }
    }
    return best;
  }
}
