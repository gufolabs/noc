import '@gufo-labs/font/gufo-font.css';
import { configuredShapeMapData, glyphSegmentMapData } from '../scripts/fixtures/configuredShapeMapData.ts';
import {
  NODE_SEARCH_REQUEST_EVENT,
  NODE_SEARCH_RESULT_EVENT,
  normalizeNodeSearchMode,
  Topology
} from '../src/index.ts';
import { bigMapData } from '../tmp/bigMapData.ts';

const mainContainer = document.getElementById('topology-main');
const minimapContainer = document.getElementById('topology-minimap');
const layoutContainer = document.querySelector('.layout');
const FIT_TO_PAGE_ON_LOAD = true;

if (
  !(mainContainer instanceof HTMLElement) ||
  !(minimapContainer instanceof HTMLElement) ||
  !(layoutContainer instanceof HTMLElement)
) {
  throw new Error('Required containers .layout, #topology-main and #topology-minimap were not found.');
}

async function waitForGufoFont() {
  const fontSet = document.fonts;
  if (!fontSet || typeof fontSet.load !== 'function') {
    return;
  }

  try {
    await fontSet.load('normal 400 1em "GufoFont"');
    await fontSet.ready;
  } catch (error) {
    console.warn('[demo] GufoFont wait failed, continue without blocking', error);
  }
}

await waitForGufoFont();

const instance = new Topology({
  mainContainer,
  minimapContainer,
  initialScale: 1,
  minScale: 0.1,
  maxScale: 5,
  gridSize: 20,
  snapThreshold: 5,
  fitToPageOnLoad: FIT_TO_PAGE_ON_LOAD,
  asyncRendering: false,
  enableViewportCulling: true,
  debugLogs: false
});
const GENERATED_MAP_KEY = 'generated-grid';
const DEFAULT_GENERATED_ROWS = 20;
const DEFAULT_GENERATED_COLS = 20;

function generateTopology(rows, cols) {
  const nodes = [];
  const links = [];
  const spacingX = 220;
  const spacingY = 120;
  const startX = 80;
  const startY = 60;
  let linkSeq = 1;
  const statusClasses = ['gf-ok', 'gf-warn', 'gf-unknown', 'gf-fail'];
  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const id = `n${index + 1}`;
      const statusClass = statusClasses[Math.floor(Math.random() * statusClasses.length)];
      const textLen = Math.floor(Math.random() * 30);
      const loremText = lorem.slice(0, textLen);

      nodes.push({
        id,
        x: startX + col * spacingX,
        y: startY + row * spacingY,
        attrs: {
          nodeName: {
            text: `Node ${index + 1} ${loremText}`
          },
          ipaddr: {
            text: `10.42.${row + 1}.${col + 1}`
          },
          icon: {
            status: statusClass
          }
        }
      });

      if (col < cols - 1) {
        links.push({
          id: `l${linkSeq}`,
          sourceId: id,
          targetId: `n${index + 2}`,
          label: '1G'
        });
        linkSeq += 1;
      }

      if (row < rows - 1) {
        links.push({
          id: `l${linkSeq}`,
          sourceId: id,
          targetId: `n${index + cols + 1}`,
          label: '10G'
        });
        linkSeq += 1;
      }
    }
  }

  return { nodes, links };
}

const MAPS = {
  'glyph-segment': {
    label: 'Glyph Segment',
    data: glyphSegmentMapData
  },
  'configured-shape': {
    label: 'Configured Shape',
    data: configuredShapeMapData
  },
  'big-map': {
    label: 'Big Map',
    data: bigMapData
  },
};

const modePan = document.getElementById('mode-pan');
const modeZoomArea = document.getElementById('mode-zoom-area');
const modeEdit = document.getElementById('mode-edit');
const toggleNodeLabelsBtn = document.getElementById('toggle-node-labels');
const mapSelect = document.getElementById('map-select');
const snapToggle = document.getElementById('snap-toggle');
const guidesToggle = document.getElementById('guides-toggle');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const resetViewBtn = document.getElementById('reset-view');
const zoomSelect = document.getElementById('zoom-select');
const nodeSearchInput = document.getElementById('node-search');
const nodeSearchModeSelect = document.getElementById('node-search-mode');
const nodeSearchSubmitBtn = document.getElementById('node-search-submit');
const nodeSearchStatus = document.getElementById('node-search-status');
const renderStats = document.getElementById('render-stats');
const TOPOLOGY_CELL_POINTERCLICK_EVENT = 'topo:cell:pointerclick';
const SCALE_CHANGE_EVENT = 'topo:scale-change';
const ZOOM_CUSTOM_OPTION_VALUE = '__custom__';
const ZOOM_PRESET_TOLERANCE = 0.001;
const FIT_SETTLE_MAX_PASSES = 4;
const FIT_SETTLE_TOLERANCE = 0.0005;
let lastInteractionText = '';
let currentNodeCount = 0;
let currentLinkCount = 0;
let currentMapKey = 'glyph-segment';
let statsRafId = 0;
let fitRafId = 0;

function updateSearchUi() {
  const mode =
    nodeSearchModeSelect instanceof HTMLSelectElement
      ? normalizeNodeSearchMode(nodeSearchModeSelect.value)
      : 'labelAndMove';
  const field = mode === 'idAndMove' ? 'id' : instance.getVisibleNodeLabelField();
  const humanField = field === 'id' ? 'node id' : field === 'ipaddr' ? 'IP' : 'node name';
  if (nodeSearchInput instanceof HTMLInputElement) {
    nodeSearchInput.placeholder =
      field === 'id' ? 'Find by node id' : field === 'ipaddr' ? 'Find by IP' : 'Find by node name';
  }
  if (nodeSearchStatus instanceof HTMLElement) {
    nodeSearchStatus.textContent = `Search by ${humanField}`;
    nodeSearchStatus.dataset.state = 'idle';
  }
}

function setSearchStatus(message, state = 'idle') {
  if (!(nodeSearchStatus instanceof HTMLElement)) {
    return;
  }
  nodeSearchStatus.textContent = message;
  nodeSearchStatus.dataset.state = state;
}

function runNodeSearch() {
  if (!(nodeSearchInput instanceof HTMLInputElement)) {
    return;
  }

  const query = nodeSearchInput.value.trim();
  if (query.length === 0) {
    updateSearchUi();
    return;
  }

  const mode =
    nodeSearchModeSelect instanceof HTMLSelectElement
      ? normalizeNodeSearchMode(nodeSearchModeSelect.value)
      : 'labelAndMove';

  mainContainer.dispatchEvent(
    new CustomEvent(NODE_SEARCH_REQUEST_EVENT, {
      bubbles: true,
      composed: true,
      detail: {
        query,
        mode
      }
    })
  );
}

// toolbar buttons
modePan?.addEventListener('click', () => instance.setMode('pan'));
modeZoomArea?.addEventListener('click', () => instance.setMode('zoomToArea'));
modeEdit?.addEventListener('click', () => instance.setMode('edit'));
toggleNodeLabelsBtn?.addEventListener('click', () => {
  instance.toggleNodeLabelMode();
  updateSearchUi();
});

function applyToggleState() {
  if (snapToggle instanceof HTMLInputElement) {
    instance.setSnapToGrid(snapToggle.checked);
  }
  if (guidesToggle instanceof HTMLInputElement) {
    instance.setGuidesEnabled(guidesToggle.checked);
  }
}

snapToggle?.addEventListener('change', applyToggleState);
guidesToggle?.addEventListener('change', applyToggleState);
applyToggleState();

let zoomSelectRafId = 0;

function getCurrentScale() {
  if (typeof instance.getViewportSnapshot === 'function') {
    const snapshot = instance.getViewportSnapshot();
    if (snapshot && typeof snapshot.scale === 'number') {
      return snapshot.scale;
    }
  }
  return 1;
}

function toPercentText(scale) {
  return `${Math.round(scale * 100)}%`;
}

function isViewportStable(previous, next) {
  if (!previous || !next) {
    return false;
  }

  return (
    Math.abs(previous.scale - next.scale) <= FIT_SETTLE_TOLERANCE &&
    Math.abs(previous.tx - next.tx) <= FIT_SETTLE_TOLERANCE &&
    Math.abs(previous.ty - next.ty) <= FIT_SETTLE_TOLERANCE
  );
}

function runStableFit(fitAction, maxPasses = FIT_SETTLE_MAX_PASSES) {
  if (fitRafId !== 0) {
    window.cancelAnimationFrame(fitRafId);
    fitRafId = 0;
  }

  let pass = 0;
  let previousSnapshot = null;

  const step = () => {
    fitRafId = 0;
    fitAction();
    scheduleRenderStatsUpdate();

    const nextSnapshot = instance.getViewportSnapshot();
    pass += 1;
    if (pass >= maxPasses || isViewportStable(previousSnapshot, nextSnapshot)) {
      return;
    }

    previousSnapshot = nextSnapshot;
    fitRafId = window.requestAnimationFrame(step);
  };

  fitRafId = window.requestAnimationFrame(step);
}

function clearCurrentMap() {
  instance.fromJSON({
    graph: {
      cells: []
    },
    viewport: {
      scale: 1,
      tx: 0,
      ty: 0
    },
    paperConfig: {},
  });
}

function parseGridInput(value) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function requestGeneratedMapConfig() {
  const input = window.prompt(
    'Rows, Columns',
    `${DEFAULT_GENERATED_ROWS},${DEFAULT_GENERATED_COLS}`
  );
  if (input === null) {
    return null;
  }

  const [rowsValue = '', colsValue = ''] = input.split(',').map((part) => part.trim());
  const rows = parseGridInput(rowsValue);
  const cols = parseGridInput(colsValue);
  if (rows === null || cols === null) {
    window.alert('Enter two positive integers in the format "rows,cols".');
    return null;
  }

  return { rows, cols };
}

function loadSelectedMap(mapKey) {
  clearCurrentMap();
  if (mapKey === GENERATED_MAP_KEY) {
    const config = requestGeneratedMapConfig();
    if (!config) {
      if (mapSelect instanceof HTMLSelectElement) {
        mapSelect.value = currentMapKey;
      }
      return;
    }

    const generated = generateTopology(config.rows, config.cols);
    instance.loadData(generated.nodes, generated.links);
    runStableFit(() => {
      instance.fitToPage();
    });
    currentMapKey = GENERATED_MAP_KEY;
    currentNodeCount = generated.nodes.length;
    currentLinkCount = generated.links.length;
    lastInteractionText = `Loaded: Generated Grid ${config.rows}x${config.cols}`;
    console.log('[demo] loaded map', {
      map: 'Generated Grid',
      rows: config.rows,
      cols: config.cols,
      nodes: currentNodeCount,
      links: currentLinkCount
    });
    scheduleRenderStatsUpdate();
    updateSearchUi();
    return;
  }

  const selected = MAPS[mapKey];
  if (!selected) {
    if (mapSelect instanceof HTMLSelectElement) {
      mapSelect.value = currentMapKey;
    }
    return;
  }

  instance.convertAndLoad(selected.data);
  runStableFit(() => {
    instance.fitToPage();
  });
  currentMapKey = mapKey;
  currentNodeCount = selected.data.nodes?.length ?? 0;
  currentLinkCount = selected.data.links?.length ?? 0;
  lastInteractionText = `Loaded: ${selected.label}`;
  console.log('[demo] loaded map', {
    map: selected.label,
    nodes: currentNodeCount,
    links: currentLinkCount
  });
  scheduleRenderStatsUpdate();
  updateSearchUi();
}

function syncZoomSelector() {
  if (!(zoomSelect instanceof HTMLSelectElement)) {
    return;
  }

  const scale = getCurrentScale();
  if (!Number.isFinite(scale) || scale <= 0) {
    return;
  }

  const options = Array.from(zoomSelect.options);
  const preset = options.find((option) => {
    const parsed = Number.parseFloat(option.value);
    return Number.isFinite(parsed) && Math.abs(parsed - scale) <= ZOOM_PRESET_TOLERANCE;
  });
  if (preset) {
    zoomSelect.value = preset.value;
    return;
  }

  let customOption = options.find((option) => option.value === ZOOM_CUSTOM_OPTION_VALUE);
  if (!customOption) {
    customOption = document.createElement('option');
    customOption.value = ZOOM_CUSTOM_OPTION_VALUE;
    zoomSelect.append(customOption);
  }
  customOption.textContent = toPercentText(scale);
  zoomSelect.value = ZOOM_CUSTOM_OPTION_VALUE;
}

function scheduleZoomSelectorSync() {
  if (!(zoomSelect instanceof HTMLSelectElement)) {
    return;
  }
  if (zoomSelectRafId !== 0) {
    return;
  }
  zoomSelectRafId = window.requestAnimationFrame(() => {
    zoomSelectRafId = 0;
    syncZoomSelector();
  });
}

function applyZoomSelection(value) {
  if (value === 'fit-page') {
    runStableFit(() => {
      instance.fitToPage();
    });
    return;
  }
  if (value === 'fit-width') {
    runStableFit(() => {
      instance.fitToWidth();
    });
    return;
  }
  if (value === 'fit-height') {
    runStableFit(() => {
      instance.fitToHeight();
    });
    return;
  }
  if (value === ZOOM_CUSTOM_OPTION_VALUE) {
    return;
  }

  const scale = Number.parseFloat(value);
  if (!Number.isFinite(scale) || scale <= 0) {
    return;
  }

  instance.setZoom(scale);
}

const onZoomInClick = () => {
  instance.zoomIn();
};
const onZoomOutClick = () => {
  instance.zoomOut();
};
const onResetViewClick = () => {
  instance.resetView();
};
const onZoomSelectChange = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }
  applyZoomSelection(target.value);
};
const onScaleChange = () => {
  scheduleZoomSelectorSync();
};
const onMapSelectChange = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }
  loadSelectedMap(target.value);
};
const onNodeSearchKeydown = (event) => {
  if (!(event instanceof KeyboardEvent) || event.key !== 'Enter') {
    return;
  }
  event.preventDefault();
  runNodeSearch();
};
const onNodeSearchResult = (event) => {
  if (!(event instanceof CustomEvent)) {
    return;
  }

  const detail = event.detail ?? {};
  const fieldName = detail.field === 'id' ? 'id' : detail.field === 'ipaddr' ? 'IP' : 'name';
  const modeText = detail.mode === 'idAndMove' ? 'search and move by id' : 'search and move';

  if (!detail.found) {
    setSearchStatus(`No match in current ${fieldName} view`, 'miss');
    lastInteractionText = `Search miss: ${detail.query ?? 'unknown'}`;
    scheduleRenderStatsUpdate();
    return;
  }

  setSearchStatus(`Found by ${fieldName}: ${detail.text} (${modeText})`, 'hit');
  lastInteractionText = `Found: ${detail.id}`;
  scheduleRenderStatsUpdate();
};

zoomInBtn?.addEventListener('click', onZoomInClick);
zoomOutBtn?.addEventListener('click', onZoomOutClick);
resetViewBtn?.addEventListener('click', onResetViewClick);
mapSelect?.addEventListener('change', onMapSelectChange);
zoomSelect?.addEventListener('change', onZoomSelectChange);
nodeSearchSubmitBtn?.addEventListener('click', runNodeSearch);
nodeSearchInput?.addEventListener('keydown', onNodeSearchKeydown);
nodeSearchModeSelect?.addEventListener('change', updateSearchUi);
mainContainer.addEventListener(SCALE_CHANGE_EVENT, onScaleChange);
mainContainer.addEventListener(NODE_SEARCH_RESULT_EVENT, onNodeSearchResult);
if (mapSelect instanceof HTMLSelectElement) {
  loadSelectedMap(mapSelect.value);
} else {
  loadSelectedMap('glyph-segment');
}
syncZoomSelector();
updateSearchUi();

function updateRenderStats() {
  if (!(renderStats instanceof HTMLElement)) {
    return;
  }
  const visibleElements = mainContainer.querySelectorAll('.joint-element').length;
  const visibleLinks = mainContainer.querySelectorAll('.joint-link').length;
  const interactionSuffix = lastInteractionText.length > 0 ? ` | ${lastInteractionText}` : '';
  renderStats.textContent =
    `Visible E: ${visibleElements} L: ${visibleLinks} | ` +
    `Total E: ${currentNodeCount} L: ${currentLinkCount}${interactionSuffix}`;
}

function scheduleRenderStatsUpdate() {
  if (statsRafId !== 0) {
    return;
  }
  statsRafId = window.requestAnimationFrame(() => {
    statsRafId = 0;
    updateRenderStats();
  });
}

const renderObserver = new MutationObserver(() => {
  scheduleRenderStatsUpdate();
});

renderObserver.observe(mainContainer, {
  childList: true,
  subtree: true
});
scheduleRenderStatsUpdate();

function onCellPointerClick(event) {
  if (!(event instanceof CustomEvent)) {
    return;
  }
  const detail = event.detail ?? {};
  lastInteractionText = `Cell click: ${detail.id ?? 'unknown'} [${detail.kind ?? 'unknown'}]`;
  console.log('[demo] cell pointerclick', detail);
  scheduleRenderStatsUpdate();
}

mainContainer.addEventListener(TOPOLOGY_CELL_POINTERCLICK_EVENT, onCellPointerClick);

let rafResizeId = 0;
let prevMainWidth = -1;
let prevMainHeight = -1;
let prevMiniWidth = -1;
let prevMiniHeight = -1;

function applyResize() {
  rafResizeId = 0;

  const mainWidth = mainContainer.clientWidth;
  const mainHeight = mainContainer.clientHeight;
  const miniWidth = minimapContainer.clientWidth;
  const miniHeight = minimapContainer.clientHeight;

  if (mainWidth !== prevMainWidth || mainHeight !== prevMainHeight) {
    prevMainWidth = mainWidth;
    prevMainHeight = mainHeight;
    instance.resizeMain(mainWidth, mainHeight);
  }

  if (miniWidth !== prevMiniWidth || miniHeight !== prevMiniHeight) {
    prevMiniWidth = miniWidth;
    prevMiniHeight = miniHeight;
    instance.resizeMinimap(miniWidth, miniHeight);
  }

  scheduleRenderStatsUpdate();
}

function scheduleResize() {
  if (rafResizeId !== 0) {
    return;
  }
  rafResizeId = window.requestAnimationFrame(applyResize);
}

const resizeObserver = new ResizeObserver(() => {
  scheduleResize();
});

resizeObserver.observe(layoutContainer);
window.addEventListener('resize', scheduleResize, { passive: true });
scheduleResize();

window.addEventListener('beforeunload', () => {
  renderObserver.disconnect();
  resizeObserver.disconnect();
  window.removeEventListener('resize', scheduleResize);
  zoomInBtn?.removeEventListener('click', onZoomInClick);
  zoomOutBtn?.removeEventListener('click', onZoomOutClick);
  resetViewBtn?.removeEventListener('click', onResetViewClick);
  mapSelect?.removeEventListener('change', onMapSelectChange);
  zoomSelect?.removeEventListener('change', onZoomSelectChange);
  mainContainer.removeEventListener(SCALE_CHANGE_EVENT, onScaleChange);
  mainContainer.removeEventListener(TOPOLOGY_CELL_POINTERCLICK_EVENT, onCellPointerClick);
  if (rafResizeId !== 0) {
    window.cancelAnimationFrame(rafResizeId);
  }
  if (zoomSelectRafId !== 0) {
    window.cancelAnimationFrame(zoomSelectRafId);
  }
  if (statsRafId !== 0) {
    window.cancelAnimationFrame(statsRafId);
  }
  if (fitRafId !== 0) {
    window.cancelAnimationFrame(fitRafId);
  }
  instance.destroy();
});
