# Demo и рабочий цикл разработки

Документ описывает актуальный запуск demo и повседневный workflow после миграции на Vite.

## Требования

- Node.js + pnpm.
- Docker и Docker Compose только если нужно отдать собранный demo через nginx.

## Установка

```bash
pnpm install
```

## Проверка и сборка библиотеки

```bash
pnpm run typecheck
pnpm run build
```

Что делает `build`:
- собирает библиотеку через Vite (library mode);
- пишет JS-бандлы в `dist/index.js` и `dist/index.umd.js`;
- генерирует `*.d.ts` через TypeScript в `dist/**`.

## Локальный запуск demo (Vite)

```bash
pnpm run demo
```

Открыть:
- `http://localhost:5173/vanilla-index.html`

Поведение:
- hot reload и обновление страницы обеспечиваются Vite;
- ручной `dist/__reload.txt` и importmap/vendor-копирование больше не используются.

## Сборка demo (static)

```bash
pnpm run demo:build
```

Результат:
- статический demo в `dist/demo`.

## Запуск собранного demo через nginx (опционально)

```bash
docker compose up -d
```

Проверка:
- открыть `http://localhost:8080`.

Остановить:

```bash
docker compose down
```

## Что редактировать в первую очередь

- Источник библиотеки: `src/**`.
- Vanilla demo: `examples/vanilla-index.html`, `examples/vanilla-launch.js`.
- Vite-конфиги: `vite.config.mjs`, `vite.demo.config.mjs`.

## Быстрая диагностика

- Если demo не стартует, проверить `pnpm run demo` и порт 5173.
- Если не генерируются типы, проверить `pnpm run build:types`.
- Если не открывается docker demo, убедиться что был `pnpm run demo:build` и в `dist/demo` есть `vanilla-index.html`.
- Если ломается восстановление графа из JSON, проверить `cellNamespace` и типы `noc.FontIconElement`/`noc.LinkElement`.
