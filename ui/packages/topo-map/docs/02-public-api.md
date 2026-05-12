# Публичный API

Актуальный API экспортируется из `/Users/dima/Projects/topo-map/src/index.ts`.

## Типы данных

```ts
export type TopologyMode = 'pan' | 'zoomToArea' | 'edit';

export interface TopologyConfig {
  mainContainer: HTMLElement;
  minimapContainer: HTMLElement;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  gridSize?: number;
  snapThreshold?: number;
  boundsPadding?: number;
  onReady?: () => void;
  preserveViewportOnLoad?: boolean;
  fitToPageOnLoad?: boolean;
  enableViewportCulling?: boolean;
  asyncRendering?: boolean;
  debugLogs?: boolean;
}

export interface NodeData {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  statusCode?: number;
  metricsLabel?: string;
  iconUnicode?: string;
  iconSizeClass?: string;
  iconStatusClass?: string;
  iconHref?: string;
  attrs?: Record<string, unknown>;
}

export interface LinkData {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  attrs?: Record<string, unknown>;
}
```

## Класс `Topology`

### Конструктор

```ts
new Topology(config: TopologyConfig)
```

Назначение:
- создает основной paper и minimap;
- инициализирует state/managers/modes;
- включает начальный режим `pan`.

### Методы загрузки

```ts
loadData(nodes: NodeData[], links: LinkData[]): void
saveDocument(): MapDocumentJSON
loadDocument(input: MapDocument | MapDocumentJSON): void
```

Назначение:
- очищает и заполняет граф узлами/линками;
- перестраивает spatial index;
- применяет ограничения viewport.
- `saveDocument()` возвращает текущее состояние карты в формате `MapDocumentJSON`, пригодном для сохранения через HTTP;
- `loadDocument(...)` загружает сериализованный документ целиком: `graph`, `interfaces`, `paperConfig`, `viewport`, `schemaVersion`;
- для HTTP JSON рекомендуется формат `MapDocumentJSON`, подробно описанный в `/Users/dima/Projects/topo-map/docs/06-load-document-format.md`.

### Сериализация

```ts
toJSON(): object
fromJSON(data: object): void
```

Поведение `toJSON`:
- возвращает envelope с `schemaVersion`, `viewport`, `graph`.

Поведение `fromJSON`:
- принимает envelope или raw graph JSON;
- корректно восстанавливает `noc.*` типы через `cellNamespace`;
- если `preserveViewportOnLoad !== true`, применяет viewport из JSON;
- если JSON не содержит `viewport`, он нормализуется в `{ scale: 1, tx: 0, ty: 0 }`;
- `fitToPageOnLoad` срабатывает только когда в `loadDocument(...)` передан `MapDocument` с `viewport === undefined`.

Важно:
- для `loadDocument(payload)` и `fromJSON(payload)` при JSON-вводе отсутствие `viewport` нормализуется в `{ scale: 1, tx: 0, ty: 0 }`;
- из-за этого `fitToPageOnLoad` не срабатывает для HTTP payload без `viewport`, если загрузка идет через JSON, а не через `MapDocument` с `viewport === undefined`.

### Доступ к данным

```ts
data.elements.getIdsByDataType(type: string): string[]
data.elements.getById(id: string): { id: string; data: Record<string, unknown> } | null
data.elements.getAll(): Array<{ id: string; data: Record<string, unknown> }>
data.elements.getLabelByPortId(portId: string | number): string | null
data.elements.getStatus(id: string): { status_code: number; metrics_label?: string } | null
data.elements.getStatuses(ids: string[]): Array<{ id: string; status_code: number | null; metrics_label: string | null }>
data.elements.setStatus(id: string, update: { status_code: number; metrics_label?: string }): boolean
data.elements.setStatuses(updates: Record<string, { status_code: number; metrics_label?: string }>): string[]
data.elements.setRandomStatuses(updates: Array<{ status_code: number; metrics_label?: string }>): string[]
data.links.getById(id: string): { id: string; data: Record<string, unknown> } | null
data.links.getAll(): Array<{ id: string; data: Record<string, unknown> }>
data.links.updateData(id: string, patch: Record<string, unknown>): boolean
```

Назначение:
- синхронный доступ к `data` из уже загруженного графа;
- для элементов, созданных через `loadData()` и `convertAndLoad()`, `data` заполняется на этапе построения cell;
- `getStatus`/`getStatuses` возвращают данные статуса из `data` (`status_code`, `metrics_label`);
- `setStatus`/`setStatuses` сохраняют raw `status_code` в `data`; effective status для rendering вычисляется как `status_code & 0x1f`;
- `FontIconElement` маппит effective status code в CSS-класс: `0 -> gf-unknown`, `1 -> gf-ok`, `2 -> gf-warn`, `3 -> gf-unknown`, `4 -> gf-fail`;
- `ImageIconElement` маппит effective status code в filter id: `0 -> osUnknown`, `1 -> osOk`, `2 -> osAlarm`, `3 -> osUnreach`, `4 -> osDown`;
- `metrics_label` сохраняется в `data` и, если не пустой, добавляется к `name` в заголовке элемента с заменой `<br/>` на перевод строки;
- `setRandomStatuses` выбирает случайный `ElementStatusUpdate` из переданного массива и возвращает обновленные `id`;
- `getLabelByPortId(portId)` использует lazy index `portId -> nodeId`; индекс наполняется из `element.data.ports`, а при отсутствии прямого соответствия использует link endpoints: `link.data.ports[0] -> source.id`, `link.data.ports[1] -> target.id`; затем метод возвращает текст label для найденного элемента с учетом текущей видимости `nodeName`/`ipaddr`; если текст в attrs отсутствует, используется fallback из `data.name`/`data.address` и `metrics_label`;
- `elements` читает только `graph.getElements()`;
- `links` читает только `graph.getLinks()`;
- `links.updateData(id, patch)` обновляет `link.data` по ключам из `patch`;
- каждое значение из `patch` заменяет значение целиком, без deep merge;
- если значение в `patch` равно `null` или `undefined`, соответствующий ключ удаляется из `link.data`;
- `links.updateData(...)` не пишет изменения в history и не форсит обычные UI update events;
- методы возвращают обычные JS-объекты, без утечки `joint.dia.Cell`.

### Режимы и взаимодействие

```ts
setMode(mode: TopologyMode): void
getMode(): string
setSnapToGrid(enabled: boolean): void
setGuidesEnabled(enabled: boolean): void
setElementTextClass(id: string | number, className: string, enabled: boolean): boolean
setBoundsPadding(padding: number): void
```

Назначение:
- `setMode`: переключает `pan | zoomToArea | edit`;
- `setSnapToGrid`: включает/выключает snap и визуальную сетку в edit режиме;
- `setGuidesEnabled`: включает/выключает dynamic guides;
- `setElementTextClass`: добавляет или удаляет CSS-класс у `nodeName` и `ipaddr` для элемента, найденного по `element.data.id`; `id` может быть `string` или `number`;
- `setBoundsPadding`: задает отступ ограничений перемещения/панорамирования.

### Zoom API

```ts
zoomIn(): void
zoomOut(): void
resetView(): void
```

### Resize API

```ts
notifyResize(payload: {
  main?: { width: number; height: number };
  minimap?: { width: number; height: number };
}): void
resizeMain(width: number, height: number): void
resizeMinimap(width: number, height: number): void
```

Важно:
- рекомендуемый путь: хост вычисляет размеры и вызывает `notifyResize(...)`;
- `resizeMain(...)` и `resizeMinimap(...)` остаются для точечных обновлений;
- значения `<= 1` игнорируются защитой.

### Освобождение ресурсов

```ts
destroy(): void
```

Назначение:
- отписка от событий;
- удаление paper/layers;
- очистка графа и индексов.

## DOM events

`mainContainer` получает `CustomEvent` с `bubbles: true` и `composed: true`.

- `topo:cell:pointerclick`
- `topo:cell:highlight`
- `topo:cell:unhighlight`
- `topo:cell:contextmenu`
- `topo:element:pointerdblclick`
- `topo:link:hover`
- `topo:link:mouseout`

Для `topo:link:hover` в `event.detail` передаются поля из `link.data`, дополненные `position: [x, y]`.
Для `topo:link:mouseout` в `event.detail` передается `position: [x, y]`.

## Минимальный пример

```ts
import { Topology } from '../dist/index.js';

const map = new Topology({
  mainContainer: document.getElementById('topology-main')!,
  minimapContainer: document.getElementById('topology-minimap')!,
  minScale: 0.1,
  maxScale: 5,
  gridSize: 20,
  boundsPadding: 12
});

map.loadData(nodes, links);
map.setMode('edit');
map.setSnapToGrid(true);
map.setGuidesEnabled(true);

const managedObjectIds = map.data.elements.getIdsByDataType('managedobject');
```
