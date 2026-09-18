# Архитектура

Документ описывает текущую архитектуру модуля и связи компонентов.

## Слои и ответственность

### Core

- `DiagramService`: фасад над `joint.dia.Graph` и `joint.dia.Paper`.
- `ViewportState`: единый источник состояния `scale/tx/ty`, подписки, clamp ограничений.
- `types.ts`, `geometry.ts`, `events.ts`: типы, геометрия, утилиты событий.

### Managers

- `ModeManager`: стратегия взаимодействия и роутинг pointer событий.
- `ZoomManager`: wheel-zoom, zoomIn/zoomOut/reset, zoomToRect.
- `PanManager`: вычисление pan-смещения.
- `ViewportManager`: viewport culling + spatial index (`rbush`).
- `MinimapManager`: minimap paper, viewport-рамка, click/drag навигация.
- `GuidesManager`: динамические направляющие выравнивания.
- `SnapManager`: привязка координат к сетке.

### Workflow editor internals

- `WorkflowSpatialIndex`: RBush-индекс только для `workflow.State`, используется для nearby search во время drag.
- `WorkflowGuidesManager`: рендерит вертикальные и горизонтальные guides в `WorkflowEditor`.
- `workflow/internal/guides.ts`: pure helper для выбора лучшего совпадения по `left/center/right` и `top/middle/bottom`.

### Modes

- `PanMode`.
- `ZoomToAreaMode`.
- `EditMode`.

### Commands

- `ZoomInCommand`, `ZoomOutCommand`, `ResetViewCommand`, `ZoomToAreaCommand`.

### Shapes

- `FontIconElement`, `ImageIconElement`, `LinkElement`, `cellNamespace`.

## Ключевые принципы

- Interaction реализован через Strategy (`InteractionMode`).
- Состояние viewport централизовано в `ViewportState`.
- Graph/Paper скрыты за фасадом `DiagramService`.
- Производительность обеспечивается RBush-индексом и опциональным culling.
- `WorkflowEditor` использует отдельный RBush-индекс для guides без viewport culling.
- Координатные преобразования local/paper/client выполняются явно в проблемных режимах.

## Поток инициализации

1. `Topology` создает `ViewportState`.
2. `Topology` создает `DiagramService` с основным paper.
3. Регистрируется `translateBoundsResolver` для ограничения pan.
4. Поднимаются `ViewportManager`, `ZoomManager`, `PanManager`, `GuidesManager`, `SnapManager`, `MinimapManager`.
5. Создаются режимы и передаются в `ModeManager`.
6. Активируется стартовый режим `pan`.

## Поток данных

### Загрузка данных

1. `loadData` формирует `cells` с типами `noc.FontIconElement`/`noc.LinkElement` по умолчанию.
2. `DiagramService.fromJSON` загружает граф с `cellNamespace`.
3. `ViewportManager.rebuildIndex` перестраивает RBush.
4. `ViewportState.enforceConstraints` применяет границы pan.

### Перемещение в edit режиме

1. `EditMode` получает pointer событие.
2. Координаты приводятся в local space через `clientToLocal`.
3. При включенном snap применяется `SnapManager`.
4. Позиция ограничивается в viewport через `DiagramService`.
5. Обновляются guides через `GuidesManager`.

### Панорамирование

1. `PanMode` стартует с client координат.
2. `PanManager` вычисляет новое `tx/ty`.
3. `ViewportState` клампит translate через resolver.
4. `DiagramService` получает снапшот и применяет `paper.scale/translate`.

## Особенности текущей реализации

- `paper` монтируется во внутренний host внутри контейнера, чтобы `setDimensions()` не схлопывал layout внешнего блока.
- Ограничения перемещения и pan учитывают `boundsPadding`.
- Для minimap/zoom-to-area/guides исправлены ошибки смешения систем координат.
