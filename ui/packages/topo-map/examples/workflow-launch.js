import {
  WORKFLOW_CONTEXTMENU_EVENT,
  WORKFLOW_DIRTY_CHANGE_EVENT,
  WORKFLOW_SELECTION_CHANGE_EVENT,
  WORKFLOW_VALIDATION_CHANGE_EVENT,
  WorkflowEditor
} from '../src/index.ts';

const mainContainer = document.getElementById('workflow-main');
const inspectorContainer = document.getElementById('inspector');
const issuesContainer = document.getElementById('issues');
const selectionStatus = document.getElementById('selection-status');
const dirtyStatus = document.getElementById('dirty-status');
const jsonOutput = document.getElementById('json-output');
const contextMenu = document.getElementById('context-menu');
const menuAddState = document.getElementById('menu-add-state');
const fileInput = document.getElementById('file-input');

if (
  !(mainContainer instanceof HTMLElement) ||
  !(inspectorContainer instanceof HTMLElement) ||
  !(issuesContainer instanceof HTMLElement) ||
  !(selectionStatus instanceof HTMLElement) ||
  !(dirtyStatus instanceof HTMLElement) ||
  !(jsonOutput instanceof HTMLElement) ||
  !(contextMenu instanceof HTMLElement) ||
  !(menuAddState instanceof HTMLButtonElement) ||
  !(fileInput instanceof HTMLInputElement)
) {
  throw new Error('Workflow demo containers were not found.');
}

const editor = new WorkflowEditor({
  mainContainer,
  fitToPageOnLoad: true,
  gridSize: 20
});

let lastContextPoint = { x: 120, y: 120 };
const sampleUrl = new URL('./data/workflow.json', import.meta.url);

function hideContextMenu() {
  contextMenu.style.display = 'none';
}

function normalizeStringArray(value) {
  if (typeof value !== 'string') {
    return [];
  }
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderJson() {
  jsonOutput.textContent = JSON.stringify(editor.exportForSave(), null, 2);
}

function bindFormSubmission(form, handler) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    handler(formData);
    renderJson();
  });
}

function renderWorkflowInspector(data) {
  inspectorContainer.innerHTML = `
    <form id="workflow-form" class="inspector-form">
      <label>
        Name
        <input name="name" type="text" value="${data.name ?? ''}" required />
      </label>
      <label>
        Description
        <textarea name="description">${data.description ?? ''}</textarea>
      </label>
      <div class="checkbox-grid">
        <label><input name="is_active" type="checkbox" ${data.is_active !== false ? 'checked' : ''} />Active</label>
      </div>
      <label>
        Allowed Models
        <textarea name="allowed_models" placeholder="One model id per line">${(data.allowed_models ?? [])
          .map((item) => (typeof item === 'string' ? item : item.id))
          .join('\n')}</textarea>
      </label>
      <div class="actions">
        <button class="primary" type="submit">Apply</button>
      </div>
    </form>
  `;

  const form = document.getElementById('workflow-form');
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  bindFormSubmission(form, (formData) => {
    editor.updateWorkflowMeta({
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      is_active: formData.get('is_active') !== null,
      allowed_models: normalizeStringArray(formData.get('allowed_models')).map((item) => ({
        id: item,
        label: item
      }))
    });
  });
}

function renderStateInspector(data) {
  inspectorContainer.innerHTML = `
    <form id="state-form" class="inspector-form">
      <label>
        Name
        <input name="name" type="text" value="${data.name ?? ''}" required />
      </label>
      <label>
        Description
        <textarea name="description">${data.description ?? ''}</textarea>
      </label>
      <div class="field-grid">
        <label>
          TTL
          <input name="ttl" type="number" min="0" value="${Number.isFinite(data.ttl) ? data.ttl : 0}" />
        </label>
        <label>
          Job Handler
          <input name="job_handler" type="text" value="${data.job_handler ?? ''}" />
        </label>
      </div>
      <div class="checkbox-grid">
        <label><input name="is_default" type="checkbox" ${data.is_default ? 'checked' : ''} />Default</label>
        <label><input name="is_productive" type="checkbox" ${data.is_productive ? 'checked' : ''} />Productive</label>
        <label><input name="is_wiping" type="checkbox" ${data.is_wiping ? 'checked' : ''} />Wiping</label>
        <label><input name="update_last_seen" type="checkbox" ${data.update_last_seen ? 'checked' : ''} />Update Last Seen</label>
        <label><input name="update_expired" type="checkbox" ${data.update_expired ? 'checked' : ''} />Update Expired</label>
      </div>
      <label>
        Labels
        <textarea name="labels">${(data.labels ?? []).join('\n')}</textarea>
      </label>
      <label>
        On Enter Handlers
        <textarea name="on_enter_handlers">${(data.on_enter_handlers ?? []).join('\n')}</textarea>
      </label>
      <label>
        On Leave Handlers
        <textarea name="on_leave_handlers">${(data.on_leave_handlers ?? []).join('\n')}</textarea>
      </label>
      <div class="actions">
        <button class="primary" type="submit">Apply</button>
      </div>
    </form>
  `;

  const form = document.getElementById('state-form');
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  bindFormSubmission(form, (formData) => {
    editor.updateState(data.id, {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      ttl: Number(formData.get('ttl') ?? 0),
      job_handler: String(formData.get('job_handler') ?? '') || null,
      is_default: formData.get('is_default') !== null,
      is_productive: formData.get('is_productive') !== null,
      is_wiping: formData.get('is_wiping') !== null,
      update_last_seen: formData.get('update_last_seen') !== null,
      update_expired: formData.get('update_expired') !== null,
      labels: normalizeStringArray(formData.get('labels')),
      on_enter_handlers: normalizeStringArray(formData.get('on_enter_handlers')),
      on_leave_handlers: normalizeStringArray(formData.get('on_leave_handlers'))
    });
  });
}

function renderTransitionInspector(data) {
  inspectorContainer.innerHTML = `
    <form id="transition-form" class="inspector-form">
      <label>
        Label
        <input name="label" type="text" value="${data.label ?? ''}" required />
      </label>
      <label>
        Event
        <input name="event" type="text" value="${data.event ?? ''}" />
      </label>
      <label>
        Description
        <textarea name="description">${data.description ?? ''}</textarea>
      </label>
      <div class="checkbox-grid">
        <label><input name="is_active" type="checkbox" ${data.is_active !== false ? 'checked' : ''} />Active</label>
        <label><input name="enable_manual" type="checkbox" ${data.enable_manual !== false ? 'checked' : ''} />Enable Manual</label>
      </div>
      <label>
        Handlers
        <textarea name="handlers">${(data.handlers ?? []).join('\n')}</textarea>
      </label>
      <label>
        Required Rules
        <textarea name="required_rules">${(data.required_rules ?? []).join('\n')}</textarea>
      </label>
      <div class="actions">
        <button class="primary" type="submit">Apply</button>
      </div>
    </form>
  `;

  const form = document.getElementById('transition-form');
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  bindFormSubmission(form, (formData) => {
    editor.updateTransition(data.id, {
      label: String(formData.get('label') ?? ''),
      event: String(formData.get('event') ?? ''),
      description: String(formData.get('description') ?? ''),
      is_active: formData.get('is_active') !== null,
      enable_manual: formData.get('enable_manual') !== null,
      handlers: normalizeStringArray(formData.get('handlers')),
      required_rules: normalizeStringArray(formData.get('required_rules'))
    });
  });
}

function renderSelection(selection) {
  if (selection.kind === 'workflow') {
    selectionStatus.textContent = 'Selection: workflow';
    renderWorkflowInspector(selection.data);
    return;
  }

  if (selection.kind === 'state') {
    selectionStatus.textContent = `Selection: state "${selection.data.name}"`;
    renderStateInspector(selection.data);
    return;
  }

  selectionStatus.textContent = `Selection: transition "${selection.data.label || selection.data.id}"`;
  renderTransitionInspector(selection.data);
}

async function loadSample() {
  const response = await fetch(sampleUrl);
  const data = await response.json();
  editor.loadWorkflow(data);
  renderJson();
}

document.getElementById('mode-edit')?.addEventListener('click', () => editor.setMode('edit'));
document.getElementById('mode-pan')?.addEventListener('click', () => editor.setMode('pan'));
document.getElementById('zoom-in')?.addEventListener('click', () => editor.zoomIn());
document.getElementById('zoom-out')?.addEventListener('click', () => editor.zoomOut());
document.getElementById('fit-content')?.addEventListener('click', () => editor.fitToContent());
document.getElementById('auto-layout')?.addEventListener('click', () => {
  editor.autoLayout();
  renderJson();
});
document.getElementById('add-state')?.addEventListener('click', () => {
  editor.addState(lastContextPoint, {});
  renderJson();
});
document.getElementById('remove-selected')?.addEventListener('click', () => {
  editor.removeSelected();
  renderJson();
});
document.getElementById('reload-sample')?.addEventListener('click', async () => {
  await loadSample();
});
document.getElementById('export-json')?.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(editor.exportForSave(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'workflow-export.json';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) {
    return;
  }
  const text = await file.text();
  editor.loadWorkflow(JSON.parse(text));
  renderJson();
  fileInput.value = '';
});

menuAddState.addEventListener('click', () => {
  editor.addState(lastContextPoint, {});
  renderJson();
  hideContextMenu();
});

document.addEventListener('click', () => {
  hideContextMenu();
});

editor.addEventListener(WORKFLOW_SELECTION_CHANGE_EVENT, (event) => {
  const { selection } = event.detail;
  renderSelection(selection);
  renderJson();
});

editor.addEventListener(WORKFLOW_DIRTY_CHANGE_EVENT, (event) => {
  dirtyStatus.textContent = event.detail.dirty ? 'Unsaved changes' : 'Saved';
});

editor.addEventListener(WORKFLOW_VALIDATION_CHANGE_EVENT, (event) => {
  if (event.detail.isValid) {
    issuesContainer.classList.remove('is-visible');
    issuesContainer.textContent = '';
    return;
  }

  issuesContainer.classList.add('is-visible');
  issuesContainer.textContent = event.detail.issues.join('\n');
});

editor.addEventListener(WORKFLOW_CONTEXTMENU_EVENT, (event) => {
  lastContextPoint = {
    x: event.detail.localX,
    y: event.detail.localY
  };
  if (event.detail.kind !== 'blank') {
    hideContextMenu();
    return;
  }
  contextMenu.style.display = 'block';
  contextMenu.style.left = `${event.detail.clientX}px`;
  contextMenu.style.top = `${event.detail.clientY}px`;
});

await loadSample();
