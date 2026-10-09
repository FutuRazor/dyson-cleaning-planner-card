/* Dyson Cleaning Planner Card v0.1.1 | MIT */
const DOMAIN = 'dyson_spot_scrub';
const available = state => !!state && !['unavailable', 'unknown'].includes(state.state) && !state.attributes?.restored;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function normalizeConfig(config) {
  if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('vacuum.')) throw new Error('Select a vacuum entity.');
  if (config.unsupported_settings && !['disabled', 'hidden'].includes(config.unsupported_settings)) throw new Error('unsupported_settings must be disabled or hidden.');
  for (const key of ['excluded_rooms', 'room_order']) {
    if (config[key] !== undefined && (!Array.isArray(config[key]) || config[key].some(x => typeof x !== 'string'))) throw new Error(`${key} must be a list of entity IDs.`);
  }
  if (config.room_entities !== undefined && (!config.room_entities || typeof config.room_entities !== 'object' || Array.isArray(config.room_entities) || Object.values(config.room_entities).some(x => typeof x !== 'string' || !x.startsWith('switch.')))) throw new Error('room_entities must map room names to switch entities.');
  return { ...config, title: config.title ?? 'Plan a clean', unsupported_settings: config.unsupported_settings ?? 'disabled', excluded_rooms: config.excluded_rooms ?? [], room_order: config.room_order ?? [] };
}

// Entity IDs are user-editable. Match registry identity within ONE integration device.
function discover(hass, registry, config) {
  const issues = [];
  const vacuum = registry.find(e => e.entity_id === config.entity && e.platform === DOMAIN && !e.disabled_by);
  if (!vacuum?.device_id) return { rooms: [], managed: [], issues: ['The Dyson device was not found in the entity registry.'] };
  const entries = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum.unique_id ?? '').replace(/_vacuum$/, '');
  const pick = (explicit, suffix, domain) => {
    const candidates = entries.filter(e => e.entity_id.startsWith(`${domain}.`) && (explicit ? e.entity_id === explicit : e.unique_id === `${serial}_${suffix}`));
    return candidates.length === 1 ? candidates[0].entity_id : undefined;
  };
  const modeEntity = pick(config.mode_entity, 'cleaning_mode', 'select');
  const startEntity = pick(config.start_entity, 'start_button', 'button');
  if (!modeEntity) issues.push('The cleaning mode entity could not be identified. Check the editor mapping.');
  if (!startEntity) issues.push('The start button could not be identified. Check the editor mapping.');
  const managed = entries.filter(e => e.entity_id.startsWith('switch.') && String(e.unique_id).startsWith(`${serial}_room_`));
  const names = hass.states[config.entity]?.attributes?.rooms;
  if (!Array.isArray(names) || !names.length || names.some(n => typeof n !== 'string')) issues.push('The Dyson room list is not currently available.');
  const rooms = (Array.isArray(names) ? names.filter(n => typeof n === 'string') : []).flatMap(name => {
    const explicit = config.room_entities?.[name];
    const uid = `${serial}_room_${name.toLowerCase().replaceAll(' ', '_')}`;
    const allMatches = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && e.entity_id.startsWith('switch.') && (explicit ? e.entity_id === explicit : e.unique_id === uid));
    if (allMatches.length === 1 && allMatches[0].disabled_by) return [];
    const matches = allMatches.filter(e => !e.disabled_by);
    if (matches.length !== 1) return [{ name, entity: '', available: false, error: 'Room switch mapping is ambiguous' }];
    const entry = matches[0];
    if (!managed.some(e => e.entity_id === entry.entity_id)) managed.push(entry);
    return [{ name, entity: entry.entity_id, available: available(hass.states[entry.entity_id]), excluded: config.excluded_rooms.includes(entry.entity_id) }];
  });
  const ids = rooms.map(r => r.entity).filter(Boolean);
  if (new Set(ids).size !== ids.length) issues.push('Multiple rooms map to the same switch.');
  const rank = id => { const i = config.room_order.indexOf(id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a, b) => rank(a.entity) - rank(b.entity));
  return { rooms, managed: managed.map(e => e.entity_id), modeEntity, startEntity, issues };
}

function createPlan(model, selected, mode) {
  if (!selected.length) throw new Error('Select at least one room.');
  if (new Set(selected).size !== selected.length) throw new Error('Duplicate room selection.');
  const rooms = selected.map(entity => {
    const room = model.rooms.find(r => r.entity === entity && !r.excluded);
    if (!room?.available) throw new Error('A selected room is no longer available. Check the selection.');
    return { entity_id: entity, name: room.name };
  });
  // Internal versioned contract, NOT a currently supported Dyson service payload.
  return { version: 1, rooms, mode };
}

function assertReady(hass, model, config, plan) {
  if (!hass || hass.connected === false) throw new Error('Home Assistant is not connected.');
  const vacuum = hass.states[config.entity];
  if (!available(vacuum) || !['docked', 'idle'].includes(vacuum.state)) throw new Error('Start is only available when the Dyson is ready (docked or idle).');
  // button.* carries a last-press timestamp, not a readiness status.
  // Do not inspect the start entity's state; button.press reports action errors.
  const mode = hass.states[model.modeEntity];
  if (!available(mode) || !mode.attributes?.options?.includes(plan.mode)) throw new Error('The selected cleaning mode is not available.');
  // Only selected room switches are relevant to this run. Unrelated or obsolete
  // switches in the registry must never block a cleaning session.
  for (const { entity_id: id } of plan.rooms) {
    const state = hass.states[id];
    if (!available(state) || !['on', 'off'].includes(state.state)) throw new Error('A selected room switch is not available.');
  }
  createPlan(model, plan.rooms.map(r => r.entity_id), plan.mode);
  for (const [domain, service] of [['select', 'select_option'], ['switch', 'turn_on'], ['switch', 'turn_off'], ['button', 'press']]) {
    if (!hass.services?.[domain]?.[service]) throw new Error(`Home Assistant action ${domain}.${service} is unavailable.`);
  }
}

async function waitForState(getHass, predicate, { timeout = 6000, interval = 100 } = {}) {
  const deadline = Date.now() + timeout;
  while (!predicate(getHass())) {
    if (Date.now() >= deadline) throw new Error('Home Assistant did not confirm the setting in time. No start command was sent.');
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Legacy adapter. Never infer order from switch toggling, never use vacuum.start.
const activeStarts = new Set();
async function startLegacy(args) {
  const key = args.config.entity;
  if (activeStarts.has(key)) throw new Error('A start request for this Dyson is already running in this browser.');
  activeStarts.add(key);
  try { return await executeLegacy(args); }
  finally { activeStarts.delete(key); }
}

async function executeLegacy({ getHass, getModel, config, plan, wait = waitForState, onProgress = () => {} }) {
  const initial = getModel();
  const signature = JSON.stringify([initial.modeEntity, initial.startEntity]);
  const check = () => {
    const model = getModel();
    if (JSON.stringify([model.modeEntity, model.startEntity]) !== signature) throw new Error('The entity mapping changed. Please review it and try again.');
    assertReady(getHass(), model, config, plan);
    return model;
  };
  check();
  const call = async (domain, service, data) => {
    check();
    await getHass().callService(domain, service, data);
  };
  onProgress('Applying cleaning mode …');
  if (getHass().states[initial.modeEntity].state !== plan.mode) {
    await call('select', 'select_option', { entity_id: initial.modeEntity, option: plan.mode });
    await wait(getHass, h => h.states[initial.modeEntity]?.state === plan.mode);
  }
  const selected = new Set(plan.rooms.map(r => r.entity_id));
  onProgress('Applying room selection …');
  // Also clear ON switches for rooms excluded from this card or no longer on the map.
  for (const id of initial.managed) {
    const desired = selected.has(id) ? 'on' : 'off';
    const state = getHass().states[id];
    if (!state || !available(state) || !['on', 'off'].includes(state.state)) continue;
    if (state.state !== desired) {
      await call('switch', desired === 'on' ? 'turn_on' : 'turn_off', { entity_id: id });
      await wait(getHass, h => h.states[id]?.state === desired);
    }
  }
  check();
  if (getHass().states[initial.modeEntity].state !== plan.mode || [...selected].some(id => getHass().states[id]?.state !== 'on')) throw new Error('The settings changed during preparation. No start command was sent.');
  onProgress('Sending start command …');
  await call('button', 'press', { entity_id: initial.startEntity });
}


const styles = `
:host{display:block;color:var(--primary-text-color,#20272d);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif);--dp-bg:var(--ha-card-background,var(--card-background-color,#fff));--dp-line:var(--divider-color,#dde3e8);--dp-muted:var(--secondary-text-color,#52616e);--dp-accent:var(--primary-color,#007da5);--dp-soft:color-mix(in srgb,var(--dp-accent) 10%,var(--dp-bg))}
*{box-sizing:border-box}ha-card{display:block;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:var(--ha-card-border-radius,22px);overflow:hidden;box-shadow:var(--ha-card-box-shadow,0 3px 18px #0000000a)}
header{display:flex;gap:13px;align-items:center;padding:24px 24px 16px}.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.tag{display:inline-block;margin-left:6px;font-size:10px;padding:3px 6px;border:1px solid var(--dp-line);border-radius:6px;vertical-align:middle}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
@media(max-width:400px){header{padding:18px 15px}.hint{padding:0 15px 14px}.rooms{padding:0 10px}footer{padding:18px 15px}.expand span{display:none}.actions{flex-direction:column}select{font-size:16px}.fields{gap:12px}.tag{margin-left:0}}
`;

// Each instance owns its draft. Registry refresh also catches disabled or renamed entities.
class DysonRegistryElement extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this.registry = []; this.registryError = ''; }
  connectedCallback() {
    this.loadRegistry();
    this._registryTimer = setInterval(() => this.loadRegistry(), 30000);
  }
  disconnectedCallback() { clearInterval(this._registryTimer); }
  set hass(value) {
    const changed = this._hass?.connection !== value?.connection;
    this._hass = value;
    if (changed) { this.registry = []; this._registryLoaded = false; }
    if (this.isConnected && !this._registryLoaded && !this._loadingRegistry) this.loadRegistry();
    this.update?.();
  }
  get hass() { return this._hass; }
  async loadRegistry() {
    if (!this._hass || this._loadingRegistry) return;
    this._loadingRegistry = true;
    const connection = this._hass.connection;
    try {
      const rows = await this._hass.callWS({ type: 'config/entity_registry/list' });
      if (this._hass.connection !== connection) return;
      this.registry = rows;
      this.registryError = '';
      this._registryLoaded = true;
    } catch {
      this.registryError = 'Could not read the entity registry. Check the connection and user permissions.';
      this._registryLoaded = true;
    } finally { this._loadingRegistry = false; this.update?.(); }
  }
  paint(html) {
    if (html === this._html) return;
    const focused = this.shadowRoot.activeElement?.dataset.focus;
    this._html = html;
    this.shadowRoot.innerHTML = html;
    if (focused) Array.from(this.shadowRoot.querySelectorAll('[data-focus]')).find(e => e.dataset.focus === focused)?.focus();
  }
}

class DysonCleaningPlannerCard extends DysonRegistryElement {
  constructor() {
    super(); this.selected = []; this.dirty = false; this.busy = false; this.expanded = new Set(); this.message = '';
    this.shadowRoot.addEventListener('change', event => this.onChange(event));
    this.shadowRoot.addEventListener('click', event => this.onClick(event));
  }
  static getConfigElement() { return document.createElement('dyson-cleaning-planner-card-editor'); }
  static getStubConfig(hass) {
    const entry = Object.values(hass.entities ?? {}).find(e => e.platform === DOMAIN && e.entity_id.startsWith('vacuum.'));
    return { type: 'custom:dyson-cleaning-planner-card', entity: entry?.entity_id ?? Object.keys(hass.states).find(id => id.startsWith('vacuum.') && Array.isArray(hass.states[id].attributes.rooms)) ?? '' };
  }
  setConfig(config) {
    this.config = normalizeConfig(config);
    this.initialized = false; this.dirty = false; this.selected = []; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  getCardSize() { return 3 + (this.model?.rooms.length ?? 3); }
  getGridOptions() { return { columns: 12, min_columns: 6 }; }
  getModel() { return discover(this._hass, this.registry, this.config); }
  resetDraft(clearMessage = true) {
    this.selected = this.model.rooms.filter(r => !r.excluded && r.available && this._hass.states[r.entity]?.state === 'on').map(r => r.entity);
    this.mode = this._hass.states[this.model.modeEntity]?.state ?? '';
    this.baseline = this.liveSignature(); this.dirty = false;
    if (clearMessage) { this.message = ''; this.error = false; }
  }
  liveSignature() {
    return JSON.stringify([this._hass.states[this.model.modeEntity]?.state, this.model.managed.map(id => [id, this._hass.states[id]?.state])]);
  }
  update() {
    if (!this.config || !this._hass) return;
    this.model = this.getModel();
    if (this.model.rooms.length) this.lastRooms = this.model.rooms;
    else if (!Array.isArray(this._hass.states[this.config.entity]?.attributes?.rooms)) this.model.rooms = (this.lastRooms ?? []).map(r => ({ ...r, available: false }));
    if ((!this.initialized || !this.dirty) && !this.busy && this.model.modeEntity) {
      this.resetDraft(false); this.initialized = true;
    }
    this.render();
  }
  onChange(event) {
    if (this.busy) return;
    const el = event.target;
    if (el.dataset.room) {
      this.selected = this.selected.filter(id => id !== el.dataset.room);
      if (el.checked) this.selected.push(el.dataset.room);
    } else if (el.dataset.mode !== undefined) this.mode = el.value;
    else return;
    this.dirty = true; this.message = ''; this.error = false; this.render();
  }
  onClick(event) {
    const el = event.target.closest('button');
    if (!el || el.disabled || this.busy) return;
    if (el.dataset.expand !== undefined) {
      const id = el.dataset.expand;
      this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
    } else if (el.dataset.move) {
      const i = this.selected.indexOf(el.dataset.move), j = i + Number(el.dataset.direction);
      if (i >= 0 && j >= 0 && j < this.selected.length) [this.selected[i], this.selected[j]] = [this.selected[j], this.selected[i]];
      this.dirty = true;
    } else if (el.dataset.action === 'reset') this.resetDraft();
    else if (el.dataset.action === 'refresh') { this.loadRegistry(); return; }
    else if (el.dataset.action === 'start') { this.start(); return; }
    this.render();
  }
  async start() {
    if (this.busy || !this.isConnected) return;
    this.busy = true; this.error = false;
    const config = this.config;
    try {
      if (this.registryError) throw new Error(this.registryError);
      const plan = createPlan(this.getModel(), this.selected, this.mode);
      await startLegacy({
        config, plan,
        getHass: () => this._hass,
        getModel: () => {
          if (!this.isConnected || this.config !== config) throw new Error('The card was closed or its configuration changed. The start was cancelled.');
          return this.getModel();
        },
        onProgress: message => { this.message = message; this.render(); }
      });
      this.message = 'Start requested. The integration controls the order; the preferred order was not sent.';
      this.dirty = true;
      this.baseline = this.liveSignature();
    } catch (error) {
      this.error = true;
      this.message = `${error.message} Settings already applied may remain in Home Assistant. The start will not be retried automatically.`;
    } finally { this.busy = false; this.render(); }
  }
  render() {
    if (!this.model) return;
    const h = escapeHtml, model = this.model;
    const rooms = model.rooms.filter(r => !r.excluded);
    const options = this._hass.states[model.modeEntity]?.attributes?.options ?? [];
    // Enable from the local draft only; live entity states are checked on execution.
    const external = this.dirty && !this.busy && this.baseline !== this.liveSignature();
    const roomHtml = rooms.map((room, n) => {
      const selected = this.selected.includes(room.entity), order = this.selected.indexOf(room.entity) + 1;
      const open = this.expanded.has(room.entity || room.name);
      const disabled = this.busy || !room.available;
      return `<section class="room ${selected ? 'selected' : ''}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(room.entity)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span><span class="name">${h(room.name)} ${selected ? `<span class="status">(${order})</span>` : ''}</span><span class="summary">${!room.available ? h(room.error || 'Unavailable') : selected ? h(this.mode) + ' · Global' : 'Not selected'}</span></span></label><button class="expand" data-focus="expand-${n}" data-expand="${h(room.entity || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="Settings for ${h(room.name)}"><span>Settings</span> ${open ? '⌃' : '⌄'}</button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}><label class="field mode">Cleaning mode <span class="badge">Global · applies to all rooms</span><select data-mode data-focus="mode-${n}" aria-label="Cleaning mode ${h(room.name)}" ${disabled || !selected || !available(this._hass.states[model.modeEntity]) ? 'disabled' : ''}>${!options.includes(this.mode) ? '<option value="">Unavailable</option>' : ''}${options.map(option => `<option value="${h(option)}" ${this.mode === option ? 'selected' : ''}>${h(option)}</option>`).join('')}</select></label>${this.config.unsupported_settings === 'hidden' ? '' : `<p class="fine">Additional settings</p>${['Cleaning strategy', 'Water level', 'Mop passes'].map(label => `<label class="field">${label}<select disabled aria-label="${label} ${h(room.name)}"><option>—</option></select><span class="badge">Not available yet</span></label>`).join('')}`}${selected ? `<div class="mode"><p>Planned position: ${order}</p><div class="order"><button data-focus="up-${n}" data-move="${h(room.entity)}" data-direction="-1" aria-label="Move ${h(room.name)} earlier" ${this.busy || order <= 1 ? 'disabled' : ''}>↑</button><button data-focus="down-${n}" data-move="${h(room.entity)}" data-direction="1" aria-label="Move ${h(room.name)} later" ${this.busy || order >= this.selected.length ? 'disabled' : ''}>↓</button></div></div>` : ''}</div></section>`;
    }).join('');
    this.paint(`<style>${styles}</style><ha-card><header><div class="robot"><ha-icon icon="mdi:robot-vacuum"></ha-icon></div><div><h2>${h(this.config.title)}</h2><p>Dyson Spot+Scrub <span class="tag">v0.1.1</span></p></div></header><p class="hint">Select rooms in preferred sequence. <span class="badge">Order is not sent to the robot yet.</span></p><div class="rooms">${roomHtml}</div>${!rooms.length ? '<p class="empty">No enabled rooms found. Check the card configuration and room discovery.</p>' : ''}<footer><div class="summary-line"><span>${this.selected.length} of ${rooms.length} rooms selected</span><span class="status">${this.dirty ? 'Local draft' : 'From Home Assistant'}</span></div><div class="actions"><button disabled title="Saving to the robot without cleaning is not supported yet">Save settings</button><button class="start" data-focus="start" data-action="start" ${this.selected.length === 0 || this.busy ? 'disabled' : ''}>${this.busy ? 'Starting …' : 'Start clean'}</button></div><p class="notice">Saving to the robot is not supported yet. Editing sends no commands.</p>${external ? '<p class="notice badge">Settings changed outside this card. Your draft remains and will be applied when you start.</p>' : ''}<p class="notice ${this.error ? 'error' : ''}" role="status" aria-live="polite">${h(this.message)}</p><button class="reset" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''}>Discard draft</button> <button class="reset" data-action="refresh" ${this.busy ? 'disabled' : ''}>Refresh rooms</button></footer></ha-card>`);
  }
}

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and global cleaning settings for Dyson Spot+Scrub.', preview: true });

// Bundled after card.js; uses the same registry connection and identity matching.
class DysonCleaningPlannerEditor extends DysonRegistryElement {
  constructor() {
    super();
    this.shadowRoot.addEventListener('change', event => {
      const el = event.target;
      if (!this.config) return;
      const next = { ...this.config };
      if (el.dataset.key) {
        next[el.dataset.key] = el.value;
        if (el.dataset.key === 'entity') {
          delete next.mode_entity; delete next.start_entity; delete next.room_entities;
          next.excluded_rooms = []; next.room_order = [];
        }
      } else if (el.dataset.include) {
        next.excluded_rooms = (next.excluded_rooms ?? []).filter(id => id !== el.dataset.include);
        if (!el.checked) next.excluded_rooms.push(el.dataset.include);
      } else return;
      this.commit(next);
    });
    this.shadowRoot.addEventListener('click', event => {
      const el = event.target.closest('button');
      if (!el?.dataset.order) return;
      const ids = this.model.rooms.filter(r => r.entity).map(r => r.entity);
      const i = ids.indexOf(el.dataset.order), j = i + Number(el.dataset.direction);
      if (i >= 0 && j >= 0 && j < ids.length) {
        [ids[i], ids[j]] = [ids[j], ids[i]];
        this.commit({ ...this.config, room_order: ids });
      }
    });
  }
  setConfig(config) { this.config = { ...config }; this.update(); }
  commit(config) {
    this.config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
    this.update();
  }
  update() {
    if (!this.config || !this._hass) return;
    const h = escapeHtml;
    const vacuums = this.registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.entity_id.startsWith('vacuum.'));
    const config = { ...this.config, excluded_rooms: this.config.excluded_rooms ?? [], room_order: this.config.room_order ?? [] };
    this.model = config.entity ? discover(this._hass, this.registry, config) : { rooms: [], issues: [], managed: [] };
    const device = this.registry.find(e => e.entity_id === config.entity)?.device_id;
    const field = (key, label, domain) => {
      const entries = this.registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.device_id === device && e.entity_id.startsWith(`${domain}.`));
      return `<label>${label}<select data-focus="${key}" data-key="${key}"><option value="">Auto-detect</option>${entries.map(e => `<option value="${h(e.entity_id)}" ${config[key] === e.entity_id ? 'selected' : ''}>${h(e.name || e.original_name || e.entity_id)}</option>`).join('')}</select></label>`;
    };
    this.paint(`<style>${styles}:host{padding:8px}label{display:grid;gap:8px;margin:0 0 16px;font-size:14px}input[type=text]{padding:12px;border:1px solid var(--dp-line);border-radius:8px;background:var(--dp-bg);color:inherit;width:100%}.entry{display:flex;gap:8px;align-items:center;margin:8px 0}.entry label{display:flex;align-items:center;flex:1;margin:0}.entry button{min-width:42px}h3{font-size:15px;margin-top:24px}</style><label>Dyson device<select data-key="entity" data-focus="entity"><option value="">Select a device</option>${vacuums.map(e => `<option value="${h(e.entity_id)}" ${config.entity === e.entity_id ? 'selected' : ''}>${h(this._hass.states[e.entity_id]?.attributes?.friendly_name || e.entity_id)}</option>`).join('')}</select></label><label>Title<input type="text" data-key="title" data-focus="title" value="${h(config.title ?? 'Plan a clean')} "></label><label>Unsupported settings<select data-key="unsupported_settings" data-focus="unsupported"><option value="disabled" ${config.unsupported_settings !== 'hidden' ? 'selected' : ''}>Show disabled</option><option value="hidden" ${config.unsupported_settings === 'hidden' ? 'selected' : ''}>Hide</option></select></label>${field('mode_entity', 'Cleaning mode', 'select')}${field('start_entity', 'Start button', 'button')}<h3>Rooms in this card</h3><p>Choose which rooms to show. Arrows change the display order, not the robot cleaning order.</p>${this.model.rooms.map((r, i) => `<div class="entry"><label><input type="checkbox" data-focus="include-${i}" data-include="${h(r.entity)}" ${!r.excluded ? 'checked' : ''} ${!r.entity ? 'disabled' : ''}>${h(r.name)}</label><button data-order="${h(r.entity)}" data-direction="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move ${h(r.name)} up">↑</button><button data-order="${h(r.entity)}" data-direction="1" ${i === this.model.rooms.length - 1 ? 'disabled' : ''} aria-label="Move ${h(r.name)} down">↓</button></div>`).join('')}<p class="notice">Rooms disabled in Home Assistant are not offered. New rooms appear automatically.</p><p class="notice error">${h(this.registryError || this.model.issues.join(' '))}</p>`);
  }
}
if (!customElements.get('dyson-cleaning-planner-card-editor')) customElements.define('dyson-cleaning-planner-card-editor', DysonCleaningPlannerEditor);

