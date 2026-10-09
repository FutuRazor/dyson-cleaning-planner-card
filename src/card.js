import { DOMAIN, available, escapeHtml, normalizeConfig, discover, createPlan, startLegacy, cleaningView, canControl, controlCleaning, batteryStatus } from './core.js';

const styles = `
:host{--dp-padding:24px}.header-title{flex:1;min-width:0}.header-title h2{overflow-wrap:anywhere}.robot{flex-shrink:0}.battery{display:flex;align-items:center;gap:7px;flex-shrink:0;align-self:flex-start;margin-top:4px;font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}.battery svg{width:32px;height:20px;color:var(--dp-muted)}.battery[data-level=high] svg{color:var(--success-color,#2e7d32)}.battery[data-level=medium] svg{color:var(--warning-color,#ad6800)}.battery[data-level=low] svg{color:var(--error-color,#b3261e)}
:host{display:block;color:var(--primary-text-color,#20272d);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif);--dp-bg:var(--ha-card-background,var(--card-background-color,#fff));--dp-line:var(--divider-color,#dde3e8);--dp-muted:var(--secondary-text-color,#52616e);--dp-accent:var(--primary-color,#007da5);--dp-soft:color-mix(in srgb,var(--dp-accent) 10%,var(--dp-bg))}
*{box-sizing:border-box}ha-card{display:block;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:var(--ha-card-border-radius,22px);overflow:hidden;box-shadow:var(--ha-card-box-shadow,0 3px 18px #0000000a)}
header{display:flex;gap:13px;align-items:center;padding:24px 24px 16px}.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.tag{display:inline-block;margin-left:6px;font-size:10px;padding:3px 6px;border:1px solid var(--dp-line);border-radius:6px;vertical-align:middle}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
.session{padding:4px 24px 0}.session h3{margin:0 0 8px;font-size:20px;font-weight:500}.session .detail{margin-bottom:18px}.requested-label{font-size:12px;color:var(--dp-muted);margin-bottom:8px}.requested{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0 0 10px}.requested li{background:var(--dp-soft);border:1px solid var(--dp-line);border-radius:18px;padding:7px 11px;font-size:13px;overflow-wrap:anywhere}.requested-note{margin-bottom:18px}.map-section{margin-top:20px}.map-title{font-size:13px;font-weight:500;margin:0 0 10px}.session-actions button{display:flex;align-items:center;justify-content:center;gap:8px}.session-actions ha-icon{width:20px;height:20px}.session-footer{padding-top:20px}
.map-title{padding:0 var(--dp-padding)}
@media(max-width:400px){:host{--dp-padding:15px}header{padding:18px 15px}.hint{padding:0 15px 14px}.rooms{padding:0 10px}footer{padding:18px 15px}.session{padding:4px 15px 0}.expand span{display:none}.actions{flex-direction:column}.session-actions{flex-direction:row}select{font-size:16px}.fields{gap:12px}.tag{margin-left:0}}
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
    this.controlBusy = false; this.pendingStart = false; this.requestedPlan = null;
    this.shadowRoot.addEventListener('change', event => this.onChange(event));
    this.shadowRoot.addEventListener('click', event => this.onClick(event));
  }
  static getConfigElement() { return document.createElement('dyson-cleaning-planner-card-editor'); }
  static getStubConfig(hass) {
    const entry = Object.values(hass.entities ?? {}).find(e => e.platform === DOMAIN && e.entity_id.startsWith('vacuum.'));
    return { type: 'custom:dyson-cleaning-planner-card', entity: entry?.entity_id ?? Object.keys(hass.states).find(id => id.startsWith('vacuum.') && Array.isArray(hass.states[id].attributes.rooms)) ?? '' };
  }
  setConfig(config) {
    if (this.config?.entity !== config.entity) {
      this.clearPendingStart(); this.requestedPlan = null; this.sessionObserved = false;
    }
    this.config = normalizeConfig(config);
    this.initialized = false; this.dirty = false; this.selected = []; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  disconnectedCallback() { super.disconnectedCallback(); this.clearPendingStart(); }
  clearPendingStart() { clearTimeout(this._startTimer); this.pendingStart = false; }
  get view() { return cleaningView(this._hass, this.config?.entity, this.busy || this.pendingStart); }
  getCardSize() { return this.view.active ? (this.config?.show_camera ? 9 : 5) : 3 + (this.model?.rooms.length ?? 3); }
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
    const reported = cleaningView(this._hass, this.config.entity);
    if (reported.live) {
      this.clearPendingStart(); this.sessionObserved = true;
    } else if (!reported.active && !this.busy && !this.pendingStart && this.sessionObserved) {
      // Docking can also occur between queued jobs. Do not claim the queue is finished.
      this.requestedPlan = null; this.sessionObserved = false; this.message = ''; this.error = false;
    }
    if (this.model.rooms.length) this.lastRooms = this.model.rooms;
    else if (!Array.isArray(this._hass.states[this.config.entity]?.attributes?.rooms)) this.model.rooms = (this.lastRooms ?? []).map(r => ({ ...r, available: false }));
    if ((!this.initialized || !this.dirty) && !this.view.active && this.model.modeEntity) {
      this.resetDraft(false); this.initialized = true;
    }
    this.render();
  }
  onChange(event) {
    if (this.busy || this.view.active) return;
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
    if (!el || el.disabled || this.busy || this.controlBusy) return;
    if (el.dataset.control) { this.control(el.dataset.control); return; }
    if (this.view.active) return;
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
    if (this.busy || this.view.active || !this.isConnected) return;
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
      this.requestedPlan = plan;
      this.sessionObserved = cleaningView(this._hass, config.entity).live;
      if (!this.sessionObserved) {
        this.pendingStart = true;
        this._startTimer = setTimeout(() => {
          this.pendingStart = false;
          if (!cleaningView(this._hass, config.entity).active) {
            this.requestedPlan = null; this.error = true;
            this.message = 'The start was sent, but the robot has not reported an active session. Check its status before trying again.';
          }
          this.update();
        }, 30000);
      }
      this.message = 'Start requested. The integration controls the order; the preferred order was not sent.';
      this.dirty = true;
      this.baseline = this.liveSignature();
    } catch (error) {
      this.error = true;
      this.message = `${error.message} Settings already applied may remain in Home Assistant. The start will not be retried automatically.`;
    } finally { this.busy = false; this.render(); }
  }
  async control(action) {
    if (this.busy || this.controlBusy || !this.isConnected) return;
    const entity = this.config.entity;
    this.controlBusy = true; this.message = ''; this.error = false; this.render();
    try {
      await controlCleaning(this._hass, entity, action);
      if (this.config.entity !== entity) return;
      this.message = action === 'stop' ? 'Stop requested. Waiting for the robot status.' : 'Return to dock requested. Queued rooms may still resume.';
    } catch (error) {
      if (this.config.entity === entity) { this.error = true; this.message = error.message; }
    } finally { this.controlBusy = false; this.render(); }
  }
  headerHtml() {
    return `<header><div class="robot"><ha-icon icon="mdi:robot-vacuum"></ha-icon></div><div class="header-title"><h2>${escapeHtml(this.config.title)}</h2><p>Dyson Spot+Scrub <span class="tag">v0.2.1</span></p></div><div class="battery" role="img"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="1" y="3" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="29" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect class="battery-fill" x="4" y="6" width="0" height="8" rx="1" fill="currentColor"/><path class="battery-bolt" d="M17 1 9 11h6l-2 8L23 8h-7Z" fill="var(--dp-bg)" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" hidden/></svg><span class="battery-value" aria-hidden="true">—</span></div></header>`;
  }
  updateBattery() {
    const state = batteryStatus(this._hass, this.model);
    const element = this.shadowRoot.querySelector('.battery');
    element.dataset.level = state.level;
    element.title = state.label; element.setAttribute('aria-label', state.label);
    element.querySelector('.battery-value').textContent = state.percent === null ? '—' : `${state.percent}%`;
    element.querySelector('.battery-fill').setAttribute('width', String((state.percent ?? 0) / 5));
    element.querySelector('.battery-bolt').toggleAttribute('hidden', !state.charging);
  }
  renderSession(view) {
    const h = escapeHtml;
    // Keep the map element mounted across status and message updates so polling,
    // the last good image and in-flight requests are independent of card renders.
    this.paint(`<style>${styles}</style><ha-card>${this.headerHtml()}<section class="session"><h3 class="session-title" role="status" aria-live="polite"></h3><p class="detail"></p><div class="requested-label">Requested rooms</div><ul class="requested"></ul><p class="requested-note"></p></section>${this.config.show_camera ? '<div class="map-section"><div class="map-title">Cleaning map</div><dyson-planner-map></dyson-planner-map></div>' : ''}<footer class="session-footer"><div class="actions session-actions"><button data-control="stop" data-focus="stop"><ha-icon icon="mdi:stop"></ha-icon>Stop</button><button data-control="return_to_base" data-focus="home"><ha-icon icon="mdi:home-import-outline"></ha-icon>Home</button></div><p class="notice">Stop behavior is controlled by the integration. Home returns to dock; queued rooms may still resume.</p><p class="notice action-message" role="status" aria-live="polite"></p></footer></ha-card>`);
    const root = this.shadowRoot;
    this.updateBattery();
    root.querySelector('.session-title').textContent = view.title;
    root.querySelector('.detail').textContent = view.detail;
    const known = !!this.requestedPlan;
    root.querySelector('.requested-label').hidden = !known;
    const chips = (this.requestedPlan?.rooms ?? []).map(r => `<li>${h(r.name)}</li>`).join('');
    const list = root.querySelector('.requested');
    if (list.innerHTML !== chips) list.innerHTML = chips;
    root.querySelector('.requested-note').textContent = known
      ? `${this.requestedPlan.mode} · Requested from this card. Room progress and sequence are not reported.`
      : 'The rooms for this session are not reported by the integration.';
    for (const button of root.querySelectorAll('[data-control]')) {
      const supported = canControl(this._hass, this.config.entity, button.dataset.control);
      button.disabled = this.busy || this.controlBusy || !supported;
      button.title = supported ? '' : 'This action is not available in the current robot state.';
    }
    const message = root.querySelector('.action-message');
    message.textContent = this.message;
    message.classList.toggle('error', !!this.error);
    root.querySelector('dyson-planner-map')?.setOptions(this._hass, this.model.cameraEntity, this.config.camera_rotation, view.live);
  }
  render() {
    if (!this.model) return;
    if (this.view.active) { this.renderSession(this.view); return; }
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
    this.paint(`<style>${styles}</style><ha-card>${this.headerHtml()}<p class="hint">Select rooms in preferred sequence. <span class="badge">Order is not sent to the robot yet.</span></p><div class="rooms">${roomHtml}</div>${!rooms.length ? '<p class="empty">No enabled rooms found. Check the card configuration and room discovery.</p>' : ''}<footer><div class="summary-line"><span>${this.selected.length} of ${rooms.length} rooms selected</span><span class="status">${this.dirty ? 'Local draft' : 'From Home Assistant'}</span></div><div class="actions"><button disabled title="Saving to the robot without cleaning is not supported yet">Save settings</button><button class="start" data-focus="start" data-action="start" ${this.selected.length === 0 || this.busy ? 'disabled' : ''}>${this.busy ? 'Starting …' : 'Start clean'}</button></div><p class="notice">Saving to the robot is not supported yet. Editing sends no commands.</p>${external ? '<p class="notice badge">Settings changed outside this card. Your draft remains and will be applied when you start.</p>' : ''}<p class="notice ${this.error ? 'error' : ''}" role="status" aria-live="polite">${h(this.message)}</p><button class="reset" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''}>Discard draft</button> <button class="reset" data-action="refresh" ${this.busy ? 'disabled' : ''}>Refresh rooms</button></footer></ha-card>`);
    this.updateBattery();
  }
}

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and global cleaning settings for Dyson Spot+Scrub.', preview: true });
