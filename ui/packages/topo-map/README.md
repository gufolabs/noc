# Topology Map (JointJS 4.2.4)

TypeScript module for an interactive network topology map with:
- zoom (wheel + API), pan, zoom-to-area,
- custom minimap,
- edit mode with node-only move,
- snap-to-grid and dynamic alignment guides,
- JSON serialization/deserialization.

The repository also contains `WorkflowEditor`, a workflow-specific editor with pan/edit modes, state transitions, wheel zoom, and alignment guides for dragged states.

## Install

```bash
pnpm install
```

## Build

```bash
pnpm run typecheck
pnpm run build
```

`build` now uses Vite library mode and generates:
- `dist/index.js` (ES module),
- `dist/index.umd.js` (UMD bundle),
- `dist/**/*.d.ts` (TypeScript declarations).

## Run Demo (Vite dev server)

```bash
pnpm run demo
```

Open: `http://localhost:5173/vanilla-index.html`

## Build Demo (static)

```bash
pnpm run demo:build
```

Output: `dist/demo`

### Optional: serve built demo in Docker

```bash
pnpm run demo:build
docker compose up -d
```

Open: `http://localhost:8080`

## Public API

- `new Topology(config)`
- `loadData(nodes, links)`
- `saveDocument()`
- `toJSON()`
- `fromJSON(data)`
- `data.elements.getIdsByDataType(type)`
- `data.links.updateData(id, patch)`
- `setMode('pan' | 'zoomToArea' | 'edit')`
- `getMode()`
- `setSnapToGrid(enabled)`
- `setGuidesEnabled(enabled)`
- `notifyResize({ main?, minimap? })`
- `resizeMain(width, height)`
- `resizeMinimap(width, height)`
- `destroy()`

### DOM events

- `topo:cell:pointerclick`
- `topo:cell:highlight`
- `topo:cell:unhighlight`
- `topo:cell:contextmenu`
- `topo:element:pointerdblclick`
- `topo:link:hover` with `detail` containing `link.data` plus `position: [x, y]`
- `topo:link:mouseout` with `detail` containing `position: [x, y]`

### Viewport restore behavior

`fromJSON(data)` reads `data.viewport` and restores it by default. Set `preserveViewportOnLoad: true` in config to keep current viewport on load.
Set `fitToPageOnLoad: true` to auto-fit the graph on `loadData()` and on `fromJSON()` when saved viewport is absent.

### Data access

```ts
const managedObjectIds = map.data.elements.getIdsByDataType('managedobject');
```

### Resize integration

Recommended host integration:

```ts
map.notifyResize({
  main: { width: mainWidth, height: mainHeight },
  minimap: { width: minimapWidth, height: minimapHeight }
});
```

## Launch examples

- ExtJS: `/Users/dima/Projects/topo-map/examples/extjs-launch.js`
- Vanilla JS (no ExtJS): `/Users/dima/Projects/topo-map/examples/vanilla-index.html` + `/Users/dima/Projects/topo-map/examples/vanilla-launch.js`
