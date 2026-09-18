# Формат входных данных для `loadDocument`

Для HTTP-запросов:

- `Topology.loadDocument(input)` должен получать JSON формата `MapDocumentJSON`;
- `Topology.saveDocument()` возвращает текущее состояние карты в том же формате.

## Рекомендуемый JSON-контракт

```ts
type PaperType =
  | 'segment'
  | 'configured'
  | 'l2domain'
  | 'objectcontainer'
  | 'objectgroup'
  | 'objectlevelneighbor';

interface InterfaceTags {
  object: string;
  interface: string;
}

interface Interface {
  id: string;
  tags: InterfaceTags;
}

interface ViewportSnapshot {
  scale: number;
  tx: number;
  ty: number;
}

interface PaperConfig {
  id?: string;
  type?: PaperType;
  gridSize?: number;
  normalizePosition?: boolean;
  objectStatusRefreshInterval?: number;
  backgroundImage?: string;
  backgroundOpacity?: number;
  name?: string;
  width?: number;
  height?: number;
  stencilDir?: string;
}

interface MapDocumentJSON {
  graph: joint.dia.Graph.JSON;
  interfaces: Interface[];
  viewport?: ViewportSnapshot;
  paperConfig?: PaperConfig;
  schemaVersion?: string;
}
```

## Минимально допустимый payload

Если дополнительных метаданных нет, достаточно передать пустой граф и пустой список интерфейсов:

```json
{
  "graph": {
    "cells": []
  },
  "interfaces": []
}
```

## Рекомендуемый payload для HTTP

```json
{
  "graph": {
    "cells": [
      {
        "id": "node-1",
        "type": "noc.FontIconElement",
        "position": { "x": 120, "y": 80 },
        "size": { "width": 64, "height": 64 },
        "attrs": {
          "nodeName": { "text": "core-sw-1" },
          "ipaddr": { "text": "10.0.0.1" },
          "icon": { "text": "\uf20a", "status_code": 1 }
        },
        "data": {
          "id": "101",
          "name": "core-sw-1",
          "address": "10.0.0.1",
          "status_code": 1
        }
      }
    ]
  },
  "interfaces": [
    {
      "id": "22",
      "tags": {
        "object": "core-sw-1",
        "interface": "xe-0/0/0"
      }
    }
  ],
  "viewport": {
    "scale": 1.25,
    "tx": 40,
    "ty": 30
  },
  "paperConfig": {
    "name": "Datacenter",
    "type": "configured",
    "width": 1920,
    "height": 1080,
    "backgroundImage": "/images/map-bg.png"
  },
  "schemaVersion": "1.0.0"
}
```

## Описание полей

### `graph`

Обязательное поле. Это сериализованный `JointJS graph`, совместимый с `graph.toJSON()` / `graph.fromJSON()`.

Практически это объект вида:

```json
{
  "cells": [
    { "...": "element or link JSON" }
  ]
}
```

Что важно:

- `loadDocument()` не строит граф сам, а передает `graph` в `diagramService.fromJSON(...)`;
- каждая `cell` должна содержать корректный `type` для используемых shapes, например `noc.FontIconElement` или `noc.LinkElement`;
- глубокая валидация `graph` не выполняется: если `graph` не объект, библиотека подменит его на `{ "cells": [] }`.

### `interfaces`

Список интерфейсов, который потом доступен через `topology.getInterfaces()`.

Формат элемента:

```json
{
  "id": "22",
  "tags": {
    "object": "core-sw-1",
    "interface": "xe-0/0/0"
  }
}
```

Что важно:

- если поле отсутствует или не является массивом, будет использован пустой список;
- элементы без `id`, `tags.object` или `tags.interface` типа `string` будут отброшены при нормализации.

### `viewport`

Снимок viewport:

```json
{
  "scale": 1,
  "tx": 0,
  "ty": 0
}
```

Что важно:

- если `preserveViewportOnLoad === true`, сохраненный viewport игнорируется и текущий viewport сохраняется;
- для JSON из HTTP отсутствие `viewport` не вызывает `fitToPage`;
- если `viewport` отсутствует или невалиден, библиотека подставляет значение по умолчанию:

```json
{
  "scale": 1,
  "tx": 0,
  "ty": 0
}
```

### `paperConfig`

Необязательные метаданные карты. Поле копируется поверхностно и применяется через `applyMapPaperConfig(...)`.

Если значение не объект, библиотека использует пустой объект `{}`.

### `schemaVersion`

Необязательная версия схемы документа.

Что важно:

- если передана непустая строка, она сохраняется как есть;
- если поле отсутствует, пустое или не строка, используется `"1.0.0"`.

## Нормализация входных данных

При загрузке JSON библиотека ведет себя так:

| Поле | Если поле корректно | Если поле отсутствует или невалидно |
| --- | --- | --- |
| `graph` | используется как есть | подставляется `{ cells: [] }` |
| `interfaces` | используется после фильтрации элементов | подставляется `[]` |
| `viewport` | используется как есть | подставляется `{ scale: 1, tx: 0, ty: 0 }` |
| `paperConfig` | копируется как объект | подставляется `{}` |
| `schemaVersion` | сохраняется, если это непустая строка | подставляется `"1.0.0"` |

## Использование с HTTP

```ts
import type { MapDocumentJSON, Topology } from '../src';

async function saveMap(topology: Topology): Promise<void> {
  const payload = topology.saveDocument();

  await fetch('/api/topology', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

async function loadMap(topology: Topology): Promise<void> {
  const response = await fetch('/api/topology');
  const payload = (await response.json()) as MapDocumentJSON;
  topology.loadDocument(payload);
}
```

Рекомендации для backend:

- возвращать `Content-Type: application/json`;
- отправлять именно envelope формата `MapDocumentJSON`, а не raw `graph`;
- если интерфейсов нет, явно передавать `"interfaces": []`;
- если нужно восстановить позицию пользователя, передавать `viewport`;
- если нужна совместимость версий, заполнять `schemaVersion`.
