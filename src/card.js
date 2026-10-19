import { DOMAIN, ROOM_FIELDS, available, escapeHtml, normalizeConfig, discover, sendRoomDraft, cleaningView, canControl, controlCleaning, batteryStatus, activityStatus, dockBusy } from './core.js';

const styles = `
:host{--dp-padding:24px}.header-title{flex:1;min-width:0}.header-title h2{overflow-wrap:anywhere}.robot{flex-shrink:0}.battery{display:flex;align-items:center;gap:7px;flex-shrink:0;align-self:flex-start;margin-top:4px;font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}.battery svg{width:32px;height:20px;color:var(--dp-muted)}.battery[data-level=high] svg{color:var(--success-color,#2e7d32)}.battery[data-level=medium] svg{color:var(--warning-color,#ad6800)}.battery[data-level=low] svg{color:var(--error-color,#b3261e)}
:host{display:block;color:var(--primary-text-color,#20272d);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif);--dp-bg:var(--ha-card-background,var(--card-background-color,#fff));--dp-line:var(--divider-color,#dde3e8);--dp-muted:var(--secondary-text-color,#52616e);--dp-accent:var(--primary-color,#007da5);--dp-soft:color-mix(in srgb,var(--dp-accent) 10%,var(--dp-bg))}
*{box-sizing:border-box}ha-card{display:block;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:var(--ha-card-border-radius,22px);overflow:hidden;box-shadow:var(--ha-card-box-shadow,0 3px 18px #0000000a)}
header{display:flex;gap:13px;align-items:center;padding:24px 24px 16px}.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.tag{display:inline-block;margin-left:6px;font-size:10px;padding:3px 6px;border:1px solid var(--dp-line);border-radius:6px;vertical-align:middle}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
.session{padding:4px 24px 0}.session h3{margin:0 0 8px;font-size:20px;font-weight:500}.session .detail{margin-bottom:18px}.requested-label{font-size:12px;color:var(--dp-muted);margin-bottom:8px}.requested{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0 0 10px}.requested li{background:var(--dp-soft);border:1px solid var(--dp-line);border-radius:18px;padding:7px 11px;font-size:13px;overflow-wrap:anywhere}.requested-note{margin-bottom:18px}.map-section{margin-top:20px}.map-title{font-size:13px;font-weight:500;margin:0 0 10px}.session-actions button{display:flex;align-items:center;justify-content:center;gap:8px}.session-actions ha-icon{width:20px;height:20px}.session-footer{padding-top:20px}
.activity-status{display:flex;align-items:center;gap:10px;margin:0 var(--dp-padding) 16px;padding:12px;border-radius:10px;background:var(--dp-soft);font-size:14px}.activity-status ha-icon{flex-shrink:0}.activity-text{flex:1}.cancel-drying{display:flex;align-items:center;justify-content:center;padding:8px;min-width:42px}.map-title{padding:0 var(--dp-padding)}
.map-title{margin-bottom:4px}.map-caption{padding:0 var(--dp-padding);margin:0 0 10px;font-size:12px}.action-message:empty{display:none}.session-actions .pause{background:#ef8c00;color:#171717;border-color:transparent}.session-actions .resume{background:#2e7d32;color:#fff;border-color:transparent}.session-actions .home{background:#c62828;color:#fff;border-color:transparent}
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
    const active = this.shadowRoot.activeElement;
    const focused = active?.dataset.focus;
    const selection = active?.tagName === 'INPUT' && active.type === 'text' ? [active.selectionStart, active.selectionEnd, active.selectionDirection] : null;
    this._html = html;
    this.shadowRoot.innerHTML = html;
    if (focused) {
      const next = Array.from(this.shadowRoot.querySelectorAll('[data-focus]')).find(e => e.dataset.focus === focused);
      next?.focus();
      if (selection) next?.setSelectionRange(...selection);
    }
  }
}

class DysonCleaningPlannerCard extends DysonRegistryElement {
  constructor() {
    super(); this.selected = []; this.settingDraft = {}; this.dirty = false; this.busy = false; this.expanded = new Set(); this.message = '';
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
    this.initialized = false; this.dirty = false; this.selected = []; this.settingDraft = {}; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  disconnectedCallback() { super.disconnectedCallback(); this.clearPendingStart(); }
  clearPendingStart() { clearTimeout(this._startTimer); this.pendingStart = false; }
  get view() { return cleaningView(this._hass, this.config?.entity, (this.busy && !this.saving) || this.pendingStart); }
  getCardSize() { return this.view.active ? (this.config?.show_camera ? 9 : 5) : 3 + (this.model?.rooms.length ?? 3); }
  getGridOptions() { return { columns: 12, min_columns: 6 }; }
  getModel() { return discover(this._hass, this.registry, this.config); }
  resetDraft(clearMessage = true) {
    this.selected = this.model.rooms.filter(r => !r.excluded && r.available && this._hass.states[r.entity]?.state === 'on').map(r => r.entity);
    this.settingDraft = {};
    this.baseline = this.liveSignature(); this.dirty = false;
    if (clearMessage) { this.message = ''; this.error = false; }
  }
  liveSignature() {
    return JSON.stringify(this.model.rooms.map(r => [r.roomId, r.entity, this._hass.states[r.entity]?.state, Object.entries(r.settings ?? {}).map(([key, field]) => [key, field.entity, field.value])]));
  }
  updateDirty() {
    const live = this.model.rooms.filter(r => !r.excluded && r.available && this._hass.states[r.entity]?.state === 'on').map(r => r.entity);
    this.dirty = Object.keys(this.settingDraft).length > 0 || JSON.stringify(this.selected) !== JSON.stringify(live);
  }
  update() {
    if (!this.config || !this._hass) return;
    const previous = this.model;
    this.model = this.getModel();
    // Preserve a local selection across entity renames using the robot's room ID.
    if (this.dirty && previous) this.selected = this.selected.map(entity => {
      const id = previous.rooms.find(r => r.entity === entity)?.roomId;
      const matches = this.model.rooms.filter(r => id && r.roomId === id);
      return matches.length === 1 ? matches[0].entity : entity;
    });
    const reported = cleaningView(this._hass, this.config.entity);
    if (reported.live) {
      this.clearPendingStart(); this.sessionObserved = true;
    } else if (!reported.active && !this.busy && !this.pendingStart && this.sessionObserved) {
      // Docking can also occur between queued jobs. Do not claim the queue is finished.
      this.requestedPlan = null; this.sessionObserved = false; this.message = ''; this.error = false;
    }
    if (this.model.rooms.length) this.lastRooms = this.model.rooms;
    else if (!Array.isArray(this._hass.states[this.config.entity]?.attributes?.rooms)) this.model.rooms = (this.lastRooms ?? []).map(r => ({ ...r, available: false }));
    if ((!this.initialized || !this.dirty) && !this.view.active && !this.busy && this.model.rooms.length) {
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
    } else if (el.dataset.setting && el.dataset.roomId) {
      const room = this.model.rooms.find(r => r.roomId === el.dataset.roomId);
      const field = room?.settings?.[el.dataset.setting];
      if (!field?.options.includes(el.value)) return;
      const values = this.settingDraft[room.roomId] ??= {};
      if (el.value === field.value) delete values[el.dataset.setting];
      else values[el.dataset.setting] = el.value;
      if (!Object.keys(values).length) delete this.settingDraft[room.roomId];
    }
    else return;
    this.updateDirty(); this.message = ''; this.error = false; this.render();
  }
  onClick(event) {
    const el = event.target.closest('button');
    if (!el || el.disabled || this.busy || this.controlBusy) return;
    if (el.dataset.control) { this.control(el.dataset.control); return; }
    if (this.view.active) return;
    if (el.dataset.expand !== undefined) {
      const id = el.dataset.expand;
      this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
    } else if (el.dataset.action === 'reset') this.resetDraft();
    else if (el.dataset.action === 'refresh') { this.loadRegistry(); return; }
    else if (el.dataset.action === 'start') { this.start(); return; }
    else if (el.dataset.action === 'save') { this.save(); return; }
    this.render();
  }
  async start() {
    if (this.busy || this.view.active || !this.isConnected) return;
    this.busy = true; this.error = false;
    const config = this.config;
    try {
      if (this.registryError) throw new Error(this.registryError);
      const model = this.getModel();
      // Keep this request visible while the integration call is pending; the
      // robot can report an active session before callService resolves.
      this.requestedPlan = { rooms: this.selected.map(entity => {
        const room = model.rooms.find(candidate => candidate.entity === entity);
        return { entity_id: entity, room_id: room?.roomId, name: room?.name ?? entity };
      }) };
      this.message = 'Sending room settings and start request …'; this.render();
      const plan = await sendRoomDraft({ hass: this._hass, model, config, selected: [...this.selected], draft: this.settingDraft, start: true });
      if (this.config !== config || !this.isConnected) return;
      this.settingDraft = {};
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
      this.message = '';
      this.dirty = true;
      this.baseline = this.liveSignature();
    } catch (error) {
      if (!cleaningView(this._hass, config.entity).active) this.requestedPlan = null;
      this.error = true;
      if (this.config === config) this.message = `${error.message} No automatic retry will be made.`;
    } finally { this.busy = false; this.render(); }
  }
  async save() {
    if (this.busy || this.view.active || !this.isConnected) return;
    const config = this.config, draft = structuredClone(this.settingDraft);
    this.busy = true; this.saving = true; this.error = false;
    this.message = 'Saving room settings …'; this.render();
    try {
      await sendRoomDraft({ hass: this._hass, model: this.getModel(), config, draft });
      const deadline = Date.now() + 6000;
      while (true) {
        if (this.config !== config || !this.isConnected) return;
        const model = this.getModel();
        if (Object.entries(draft).every(([id, fields]) => Object.entries(fields).every(([key, value]) => model.rooms.find(r => r.roomId === id)?.settings?.[key]?.value === value))) break;
        if (Date.now() >= deadline) throw new Error('Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.settingDraft = {}; this.model = this.getModel(); this.updateDirty();
      this.baseline = this.liveSignature();
      this.message = 'Settings sent. Home Assistant values updated. Room selection remains local.';
    } catch (error) {
      if (this.config === config) { this.error = true; this.message = error.message; }
    } finally { this.busy = false; this.saving = false; this.render(); }
  }
  async control(action) {
    if (this.busy || this.controlBusy || !this.isConnected) return;
    const entity = this.config.entity;
    this.controlBusy = true; this.message = ''; this.error = false; this.render();
    try {
      await controlCleaning(this._hass, entity, action);
      if (this.config.entity !== entity) return;
      this.message = '';
    } catch (error) {
      if (this.config.entity === entity) { this.error = true; this.message = error.message; }
    } finally { this.controlBusy = false; this.render(); }
  }
  headerHtml() {
    return `<header><div class="robot"><ha-icon icon="mdi:robot-vacuum"></ha-icon></div><div class="header-title"><h2>${escapeHtml(this.config.title)}</h2><p>Dyson Spot+Scrub <span class="tag">v0.2.3</span></p></div><div class="battery" role="img"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="1" y="3" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="29" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect class="battery-fill" x="4" y="6" width="0" height="8" rx="1" fill="currentColor"/><path class="battery-bolt" d="M17 1 9 11h6l-2 8L23 8h-7Z" fill="var(--dp-bg)" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" hidden/></svg><span class="battery-value" aria-hidden="true">—</span></div></header>`;
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
  statusHtml() {
    return `<div class="activity-status" role="status" aria-live="polite" hidden><ha-icon class="activity-icon" aria-hidden="true"></ha-icon><span class="activity-text"></span><span class="drying-control" title="Cancel drying is not available in the integration yet." hidden><button class="cancel-drying" disabled aria-label="Cancel drying (not available yet)"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></span></div>`;
  }
  updateStatus() {
    const status = activityStatus(this._hass, this.config.entity, (this.busy && !this.saving) || this.pendingStart);
    const row = this.shadowRoot.querySelector('.activity-status');
    row.hidden = !status;
    row.querySelector('.activity-text').textContent = status?.text ?? '';
    row.querySelector('.activity-icon').setAttribute('icon', status?.icon ?? 'mdi:robot-vacuum');
    row.querySelector('.drying-control').hidden = !status?.drying;
  }
  renderSession(view) {
    const h = escapeHtml;
    // Keep the map element mounted across status and message updates so polling,
    // the last good image and in-flight requests are independent of card renders.
    this.paint(`<style>${styles}</style><ha-card>${this.headerHtml()}${this.statusHtml()}<section class="session"><ul class="requested"></ul></section>${this.config.show_camera ? '<div class="map-section"><div class="map-title">Cleaning map</div><p class="map-caption">Refreshes about every 5 seconds</p><dyson-planner-map></dyson-planner-map></div>' : ''}<footer class="session-footer"><div class="actions session-actions"><button class="session-toggle" data-control="pause" data-focus="session-toggle"><ha-icon></ha-icon><span></span></button><button class="home" data-control="return_to_base" data-focus="home"><ha-icon icon="mdi:home-import-outline"></ha-icon>Home</button></div><p class="notice action-message" role="status" aria-live="polite"></p></footer></ha-card>`);
    const root = this.shadowRoot;
    this.updateBattery();
    this.updateStatus();
    const title = root.querySelector('.header-title h2');
    title.classList.add('session-title');
    title.textContent = 'Cleaning session';
    const chips = (this.requestedPlan?.rooms ?? []).map(r => `<li>${h(r.name)}</li>`).join('');
    const list = root.querySelector('.requested');
    if (list.innerHTML !== chips) list.innerHTML = chips;
    root.querySelector('.session').hidden = !chips;
    const paused = this._hass.states[this.config.entity]?.state === 'paused';
    const toggle = root.querySelector('.session-toggle');
    toggle.dataset.control = paused ? 'start' : 'pause';
    toggle.classList.toggle('resume', paused); toggle.classList.toggle('pause', !paused);
    toggle.querySelector('span').textContent = paused ? 'Resume' : 'Pause';
    toggle.querySelector('ha-icon').setAttribute('icon', paused ? 'mdi:play' : 'mdi:pause');
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
    const external = this.dirty && !this.busy && this.baseline !== this.liveSignature();
    const canSave = !!this._hass.services?.[DOMAIN]?.save_room_settings;
    const canStart = !!this._hass.services?.[DOMAIN]?.start_rooms_with_settings;
    const hasChanges = Object.keys(this.settingDraft).length > 0;
    const roomHtml = rooms.map((room, n) => {
      const selected = this.selected.includes(room.entity), order = this.selected.indexOf(room.entity) + 1;
      const open = this.expanded.has(room.entity || room.name);
      const disabled = this.busy || !room.available;
      const valueOf = key => this.settingDraft[room.roomId]?.[key] ?? room.settings?.[key]?.value;
      const fields = Object.entries(ROOM_FIELDS).map(([key, label]) => {
        if (!this.config.always_show_all_settings) {
          const mode = valueOf('cleaning_mode');
          if (mode === 'Vacuum' && ['water_level', 'mop_repetitions'].includes(key)) return '';
          if (mode === 'Mop' && key === 'cleaning_strategy') return '';
        }
        const field = room.settings?.[key];
        if (!field && this.config.unsupported_settings === 'hidden' && !this.config.always_show_all_settings) return '';
        const value = valueOf(key), options = field?.options ?? [];
        return `<label class="field ${key === 'cleaning_mode' ? 'mode' : ''}">${label}<select data-setting="${key}" data-room-id="${h(room.roomId)}" data-focus="${key}-${n}" aria-label="${label} ${h(room.name)}" ${disabled || !field ? 'disabled' : ''}>${!options.includes(value) ? '<option value="">Unavailable</option>' : ''}${options.map(option => `<option value="${h(option)}" ${value === option ? 'selected' : ''}>${h(option)}</option>`).join('')}</select>${!field ? '<span class="badge">Not available</span>' : ''}</label>`;
      }).join('');
      return `<section class="room ${selected ? 'selected' : ''}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(room.entity)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span><span class="name">${h(room.name)} ${selected ? `<span class="status">(${order})</span>` : ''}</span><span class="summary">${!room.available ? h(room.error || 'Unavailable') : h(valueOf('cleaning_mode') ?? 'Room settings unavailable')}${selected ? '' : ' · Not selected'}</span></span></label><button class="expand" data-focus="expand-${n}" data-expand="${h(room.entity || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="Settings for ${h(room.name)}"><span>Settings</span> ${open ? '⌃' : '⌄'}</button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${!room.roomId ? '<p class="badge mode">Room ID unavailable. Check the updated integration and refresh rooms.</p>' : ''}</div></section>`;
    }).join('');
    this.paint(`<style>${styles}</style><ha-card>${this.headerHtml()}${this.statusHtml()}<div class="rooms">${roomHtml}</div>${!rooms.length ? '<p class="empty">No enabled rooms found. Check the card configuration and room discovery.</p>' : ''}<footer><div class="summary-line"><span>${this.selected.length} of ${rooms.length} rooms selected</span><span class="status">${this.dirty ? 'Local draft' : 'From Home Assistant'}</span></div><div class="actions"><button data-action="save" data-focus="save" ${!hasChanges || this.busy || !canSave ? 'disabled' : ''}>${this.saving ? 'Saving …' : 'Save settings'}</button><button class="start" data-focus="start" data-action="start" ${this.selected.length === 0 || this.busy || dockBusy(this._hass, this.config.entity) ? 'disabled' : ''}>Start clean</button></div>${!canSave || !canStart ? '<p class="notice badge">The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.</p>' : ''}${external ? '<p class="notice badge">Settings changed outside this card. Your edited values remain in the local draft.</p>' : ''}<p class="notice ${this.error ? 'error' : ''}" role="status" aria-live="polite">${h(this.message)}</p><button class="reset" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''}>Discard draft</button> <button class="reset" data-action="refresh" ${this.busy ? 'disabled' : ''}>Refresh rooms</button></footer></ha-card>`);
    this.updateBattery();
    this.updateStatus();
  }
}

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and per-room cleaning settings for Dyson Spot+Scrub.', preview: true });
