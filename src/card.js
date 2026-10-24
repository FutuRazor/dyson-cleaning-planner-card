import { DOMAIN, ROOM_FIELDS, available, escapeHtml, normalizeConfig, discover, sendRoomDraft, cleaningView, canControl, controlCleaning, batteryStatus, activityStatus, dryingRemainingTime, dryingRemainingPercent, dockBlocksStart, startBlockReason, consumableStatus, stationSettings, changeStationSetting } from './core.js';

const styles = `
/* Only constrain the content when the dashboard assigns an explicit row count. */
:host([fixed-height]){height:100%;min-height:0}
:host([fixed-height]) ha-card{height:100%;min-height:0}
:host([fixed-height]) .planner-content{height:100%;overflow-y:auto;overscroll-behavior:contain}

ha-card{position:relative}.header-tools{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex-shrink:0}.consumables-info{min-height:32px;width:100%;padding:3px 10px;background:transparent;color:var(--dp-muted);display:flex;justify-content:center;align-items:center;font-size:12px}.consumables-info.attention{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 10%,var(--dp-bg));border-color:color-mix(in srgb,var(--error-color,#b3261e) 30%,var(--dp-line))}
.info-tabs{display:flex;gap:8px;margin-bottom:20px}.info-tabs button{flex:1;font-size:13px}.info-tabs [aria-selected=true]{color:var(--dp-accent);border-color:var(--dp-accent);background:var(--dp-soft)}.station-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;font-size:13px}.station-row small{display:block;color:var(--dp-muted);margin-top:4px}.station-row>span{min-width:0;overflow-wrap:anywhere}.station-row.select{gap:12px}.station-row select{flex:0 1 190px;width:55%;min-width:140px;margin-left:auto;font-size:14px}.station-row ha-switch{flex:0 0 auto;margin-left:auto}@media(max-width:400px){.station-row select{font-size:16px}}.consumables-overlay{position:absolute;inset:0;z-index:5;background:#0005;padding:12px;display:flex;align-items:flex-start}.consumables-panel{width:100%;max-height:min(100%,75vh);overflow-y:auto;overscroll-behavior:contain;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:14px;padding:18px;box-shadow:0 8px 30px #0003}.consumables-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:18px}.consumables-heading h3{margin:0;font-size:20px;font-weight:500}.consumables-close{display:flex;padding:8px;min-width:42px}.consumable-row{margin:0 0 20px}.consumable-row:last-child{margin-bottom:0}.consumable-label{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:13px;margin-bottom:8px}.consumable-value{color:var(--dp-muted)}.consumable-track{height:8px;border-radius:8px;background:var(--divider-color,#dde3e8);overflow:hidden}.consumable-fill{display:block;height:100%;background:var(--success-color,#2e7d32)}.consumable-fill.medium{background:var(--warning-color,#ad6800)}.consumable-fill.low{background:var(--error-color,#b3261e)}

:host{--dp-padding:24px}.header-title{flex:1;min-width:0}.header-title h2{overflow-wrap:anywhere}.robot{flex-shrink:0}.battery{display:flex;align-items:center;gap:7px;flex-shrink:0;align-self:flex-start;margin-top:4px;font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}.battery svg{width:32px;height:20px;color:var(--dp-muted)}.battery[data-level=high] svg{color:var(--success-color,#2e7d32)}.battery[data-level=medium] svg{color:var(--warning-color,#ad6800)}.battery[data-level=low] svg{color:var(--error-color,#b3261e)}
:host{display:block;color:var(--primary-text-color,#20272d);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif);--dp-bg:var(--ha-card-background,var(--card-background-color,#fff));--dp-line:var(--divider-color,#dde3e8);--dp-muted:var(--secondary-text-color,#52616e);--dp-accent:var(--primary-color,#007da5);--dp-soft:color-mix(in srgb,var(--dp-accent) 10%,var(--dp-bg))}
*{box-sizing:border-box}ha-card{display:block;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:var(--ha-card-border-radius,22px);overflow:hidden;box-shadow:var(--ha-card-box-shadow,0 3px 18px #0000000a)}
header{display:flex;gap:13px;align-items:center;padding:24px 24px 16px}.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.tag{display:inline-block;margin-left:6px;font-size:10px;padding:3px 6px;border:1px solid var(--dp-line);border-radius:6px;vertical-align:middle}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.draft-status{position:relative;padding-left:28px}.discard-draft{position:absolute;right:calc(100% - 24px);top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:24px;height:24px;min-height:0;padding:0;border:0;background:transparent;color:var(--dp-muted)}.discard-draft ha-icon{width:20px;height:20px;--mdc-icon-size:20px;pointer-events:none}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
.session{padding:4px 24px 0}.session h3{margin:0 0 8px;font-size:20px;font-weight:500}.session .detail{margin-bottom:18px}.requested-label{font-size:12px;color:var(--dp-muted);margin-bottom:8px}.requested{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0 0 10px}.requested li{background:var(--dp-soft);border:1px solid var(--dp-line);border-radius:18px;padding:7px 11px;font-size:13px;overflow-wrap:anywhere}.requested-note{margin-bottom:18px}.map-section{margin-top:20px}.map-title{font-size:13px;font-weight:500;margin:0 0 10px}.session-actions button{display:flex;align-items:center;justify-content:center;gap:8px}.session-actions ha-icon{width:20px;height:20px}.session-footer{padding-top:20px}
.activity-status{display:flex;align-items:center;gap:10px;margin:0 var(--dp-padding) 16px;padding:12px;border-radius:10px;background:var(--dp-soft);font-size:14px}.activity-status ha-icon{flex-shrink:0}.activity-copy{flex:1;min-width:0}.activity-remaining,.activity-start-block,.activity-fault{display:block;margin-top:4px;font-size:12px;line-height:1.5;color:var(--dp-muted);font-variant-numeric:tabular-nums}.drying-progress{display:block;width:100%;height:7px;margin-top:8px;border-radius:999px;background:var(--dp-line);overflow:hidden}.drying-progress-fill{display:block;height:100%;width:0;border-radius:inherit;background:var(--dp-accent)}.drying-control{flex-shrink:0}.cancel-drying{display:flex;align-items:center;justify-content:center;padding:8px;min-width:42px}.map-title{padding:0 var(--dp-padding)}
.map-title{margin-bottom:4px}.map-caption{padding:0 var(--dp-padding);margin:0 0 10px;font-size:12px}.action-message:empty{display:none}.session-actions .pause{background:#ef8c00;color:#171717;border-color:transparent}.session-actions .resume{background:#2e7d32;color:#fff;border-color:transparent}.session-actions .home{background:#c62828;color:#fff;border-color:transparent}
@media(max-width:400px){:host{--dp-padding:15px}header{padding:18px 15px}.hint{padding:0 15px 14px}.rooms{padding:0 10px}footer{padding:18px 15px}.session{padding:4px 15px 0}.expand span{display:none}.actions{flex-direction:column}.session-actions{flex-direction:row}select{font-size:16px}.fields{gap:12px}.tag{margin-left:0}}
`;

const registryRefreshEvents = new EventTarget();

// Each instance owns its draft. Registry refresh also catches disabled or renamed entities.
class DysonRegistryElement extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this.registry = []; this.registryError = ''; }
  connectedCallback() {
    this._onRegistryRefresh = event => {
      if (event.detail.source === this || event.detail.connection !== this._hass?.connection) return;
      this.registry = event.detail.rows;
      this.registryError = '';
      this._registryLoaded = true;
      this.update?.();
    };
    registryRefreshEvents.addEventListener('refresh', this._onRegistryRefresh);
    this.loadRegistry();
    this._registryTimer = setInterval(() => this.loadRegistry(), 30000);
  }
  disconnectedCallback() { clearInterval(this._registryTimer); registryRefreshEvents.removeEventListener('refresh', this._onRegistryRefresh); }
  set hass(value) {
    const changed = this._hass?.connection !== value?.connection;
    this._hass = value;
    if (changed) { this.registry = []; this._registryLoaded = false; }
    if (this.isConnected && !this._registryLoaded && !this._loadingRegistry) this.loadRegistry();
    this.update?.();
  }
  get hass() { return this._hass; }
  async loadRegistry(notifyPeers = false) {
    if (!this._hass || this._loadingRegistry) return;
    this._loadingRegistry = true;
    const connection = this._hass.connection;
    try {
      const rows = await this._hass.callWS({ type: 'config/entity_registry/list' });
      if (this._hass.connection !== connection) return;
      this.registry = rows;
      this.registryError = '';
      this._registryLoaded = true;
      if (notifyPeers) registryRefreshEvents.dispatchEvent(new CustomEvent('refresh', { detail: { source: this, connection, rows } }));
    } catch {
      this.registryError = 'Could not read the entity registry. Check the connection and user permissions.';
      this._registryLoaded = true;
    } finally { this._loadingRegistry = false; this.update?.(); }
  }
  paint(html, view = null) {
    if (html === this._html) return;
    cancelAnimationFrame(this._plannerScrollFrame);
    const previous = this.shadowRoot.querySelector('.planner-content');
    const keepPlanner = view === 'planner' && this._paintedView === 'planner' && previous;
    const scrollTop = keepPlanner ? previous.scrollTop : 0;
    const active = this.shadowRoot.activeElement;
    const focused = active?.dataset.focus;
    const selection = active?.tagName === 'INPUT' && active.type === 'text' ? [active.selectionStart, active.selectionEnd, active.selectionDirection] : null;
    this._html = html;
    this._paintedView = view;
    if (keepPlanner) {
      // Only planner edits retain the mounted HA frame and scroll viewport.
      const template = document.createElement('template');
      template.innerHTML = html;
      const incoming = template.content.querySelector('.planner-content');
      previous.replaceChildren(...incoming.childNodes);
      const overlay = this.shadowRoot.querySelector('.consumables-overlay');
      const incomingOverlay = template.content.querySelector('.consumables-overlay');
      if (overlay && incomingOverlay) overlay.replaceWith(incomingOverlay);
    } else {
      // Keep the original rendering path for the session, editor and view transitions.
      this.shadowRoot.innerHTML = html;
    }
    if (focused) {
      const next = Array.from(this.shadowRoot.querySelectorAll('[data-focus]')).find(e => e.dataset.focus === focused);
      if (keepPlanner) next?.focus({ preventScroll: true });
      else next?.focus();
      if (selection) next?.setSelectionRange(...selection);
    }
    if (keepPlanner) {
      previous.scrollTop = scrollTop;
      this._plannerScrollFrame = requestAnimationFrame(() => {
        if (previous.isConnected && this._paintedView === 'planner') previous.scrollTop = scrollTop;
      });
    }
  }
}

class DysonCleaningPlannerCard extends DysonRegistryElement {
  constructor() {
    super(); this.selected = []; this.settingDraft = {}; this.dirty = false; this.busy = false; this.expanded = new Set(); this.message = '';
    this.controlBusy = false; this.pendingStart = false; this.requestedPlan = null;
    this.shadowRoot.addEventListener('change', event => this.onChange(event));
    this.shadowRoot.addEventListener('click', event => this.onClick(event));
    this.shadowRoot.addEventListener('keydown', event => {
      if (!this.consumablesOpen) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.toggleConsumables(false); }
      if (event.key === 'Tab') {
        const panel = this.shadowRoot.querySelector('.consumables-panel');
        const items = [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), ha-switch:not([disabled])')].filter(el => (el.localName === 'ha-switch' || el.tabIndex >= 0) && el.getClientRects().length);
        const first = items[0], last = items.at(-1), active = this.shadowRoot.activeElement;
        if (event.shiftKey && active === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && active === last) { event.preventDefault(); first?.focus(); }
      }
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) && event.target.dataset.infoTab) {
        event.preventDefault();
        this.infoTab = event.key === 'Home' ? 'consumables' : event.key === 'End' ? 'station' : this.infoTab === 'station' ? 'consumables' : 'station';
        this.updateConsumables(); this.shadowRoot.querySelector(`[data-info-tab="${this.infoTab}"]`).focus();
      }
    });
  }
  static getConfigElement() { return document.createElement('dyson-cleaning-planner-card-editor'); }
  static getStubConfig(hass) {
    const entry = Object.values(hass.entities ?? {}).find(e => e.platform === DOMAIN && e.entity_id.startsWith('vacuum.'));
    return { type: 'custom:dyson-cleaning-planner-card', entity: entry?.entity_id ?? Object.keys(hass.states).find(id => id.startsWith('vacuum.') && Array.isArray(hass.states[id].attributes.rooms)) ?? '' };
  }
  setConfig(config) {
    if (this.config?.entity !== config.entity) {
      this.clearSessionEnd();
      this.clearPendingStart(); this.requestedPlan = null; this.sessionObserved = false;
    }
    this.consumablesOpen = false; this.stationMessage = ''; this.stationError = false;
    this.config = normalizeConfig(config);
    const rows = config.grid_options?.rows ?? config.layout_options?.grid_rows;
    this.toggleAttribute('fixed-height', typeof rows === 'number' && Number.isFinite(rows) && rows > 0);
    this.initialized = false; this.dirty = false; this.selected = []; this.settingDraft = {}; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  disconnectedCallback() { super.disconnectedCallback(); this.clearPendingStart(); this.clearSessionEnd(); }
  clearPendingStart() { clearTimeout(this._startTimer); this.pendingStart = false; }
  clearSessionEnd() { clearTimeout(this._sessionEndTimer); this._sessionEndTimer = null; }
  deferSessionEnd() {
    if (this._sessionEndTimer) return;
    const entity = this.config.entity;
    // Keep the request briefly across idle/docked telemetry between active states.
    // The planner still returns immediately; badges are only shown in session view.
    this._sessionEndTimer = setTimeout(() => {
      this._sessionEndTimer = null;
      if (!this.isConnected || this.config.entity !== entity || this.busy || this.pendingStart || this.view.active) return;
      this.requestedPlan = null; this.sessionObserved = false;
      this.render();
    }, 5000);
  }
  get view() { return cleaningView(this._hass, this.config?.entity, (this.busy && !this.saving) || this.pendingStart); }
  getCardSize() { return this.view.active ? (this.config?.show_camera ? 9 : 5) : 3 + (this.model?.rooms.length ?? 3); }
  getGridOptions() { return { columns: 12, min_columns: 9, rows: 'auto', min_rows: 1 }; }
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
    if (reported.active || this.busy || this.pendingStart) this.clearSessionEnd();
    if (reported.live) {
      this.clearPendingStart(); this.sessionObserved = true;
    } else if (!reported.active && !this.busy && !this.pendingStart && this.sessionObserved) {
      this.deferSessionEnd();
      this.message = ''; this.error = false;
    }
    if (this.model.rooms.length) this.lastRooms = this.model.rooms;
    else if (!Array.isArray(this._hass.states[this.config.entity]?.attributes?.rooms)) this.model.rooms = (this.lastRooms ?? []).map(r => ({ ...r, available: false }));
    if ((!this.initialized || !this.dirty) && !this.view.active && !this.busy && this.model.rooms.length) {
      this.resetDraft(false); this.initialized = true;
    }
    this.render();
  }
  onChange(event) {
    if (event.target.dataset.station) {
      const el = event.target;
      const value = el.localName === 'ha-switch' || el.type === 'checkbox' ? el.checked : el.value;
      el.blur(); this.setStationSetting(el.dataset.station, value); return;
    }
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
      // Release the native select before rendering to avoid restoring its picker focus.
      el.blur();
    }
    else return;
    this.updateDirty(); this.message = ''; this.error = false; this.render();
  }
  onClick(event) {
    const el = event.target.closest('button');
    if (el?.dataset.action === 'consumables') { this.toggleConsumables(true); return; }
    if (el?.dataset.action === 'close-consumables') { this.toggleConsumables(false); return; }
    if (el?.dataset.infoTab) { this.infoTab = el.dataset.infoTab; this.updateConsumables(); return; }
    if (this.consumablesOpen) return;
    if (!el || el.disabled || this.busy || this.controlBusy) return;
    if (el.dataset.control) { this.control(el.dataset.control); return; }
    if (this.view.active) return;
    if (el.dataset.expand !== undefined) {
      const id = el.dataset.expand;
      this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
    } else if (el.dataset.action === 'reset') this.resetDraft();
    else if (el.dataset.action === 'start') { this.start(); return; }
    else if (el.dataset.action === 'save') { this.save(); return; }
    this.render();
  }
  async start() {
    if (this.busy || this.view.active || !this.isConnected) return;
    this.clearSessionEnd();
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
  consumablesHtml() {
    return `<div class="consumables-overlay" hidden><section class="consumables-panel" role="dialog" aria-modal="true" aria-label="Robot information"><div class="consumables-heading"><h3>Info</h3><button class="consumables-close" data-action="close-consumables" data-focus="consumables-close" aria-label="Close information"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></div><div class="info-tabs" role="tablist" aria-label="Robot information"><button id="tab-consumables" role="tab" data-info-tab="consumables" aria-controls="panel-consumables">Consumables</button><button id="tab-station" role="tab" data-info-tab="station" aria-controls="panel-station">Station settings</button></div><div id="panel-consumables" role="tabpanel" aria-labelledby="tab-consumables"><div class="consumables-rows"></div></div><div id="panel-station" role="tabpanel" aria-labelledby="tab-station" hidden><div class="station-rows"></div><p class="station-message notice" role="status" aria-live="polite"></p></div></section></div>`;
  }
  toggleConsumables(open) {
    this.consumablesOpen = open;
    if (open) this.infoTab = 'consumables';
    this.updateConsumables();
    this.shadowRoot.querySelector(open ? '.consumables-close' : '.consumables-info')?.focus();
  }
  updateConsumables() {
    const root = this.shadowRoot;
    this.updateStationSettings();
    const rows = consumableStatus(this._hass, this.registry, this.config.entity);
    const warning = rows.some(row => row.level === 'low');
    const button = root.querySelector('.consumables-info');
    button.classList.toggle('attention', warning);
    button.setAttribute('aria-label', warning ? 'Consumables: replacement needed soon' : 'Robot information');
    button.title = warning ? 'Consumables: replacement needed soon' : 'Robot information';
    button.setAttribute('aria-expanded', String(!!this.consumablesOpen));
    root.querySelector('.consumables-overlay').hidden = !this.consumablesOpen;
    root.querySelector('.planner-content').inert = !!this.consumablesOpen;
    const content = rows.map(row => `<div class="consumable-row"><div class="consumable-label"><span>${escapeHtml(row.name)}</span><span class="consumable-value">${escapeHtml(row.text)}</span></div>${row.remaining === null ? '' : `<div class="consumable-track" role="meter" aria-label="${escapeHtml(row.name)} remaining life" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.remaining}"><span class="consumable-fill ${row.level}" style="width:${row.remaining}%"></span></div>`}</div>`).join('');
    const host = root.querySelector('.consumables-rows');
    if (host.innerHTML !== content) host.innerHTML = content;
    if (this.consumablesOpen && !root.querySelector('.consumables-panel').contains(root.activeElement)) root.querySelector('.consumables-close').focus();
  }
  async setStationSetting(key, value) {
    if (this.stationBusy || this.busy || this.controlBusy || !this.consumablesOpen) return;
    const entity = this.config.entity;
    this.stationBusy = true; this.stationMessage = ''; this.stationError = false;
    this.updateConsumables();
    try {
      await changeStationSetting(this._hass, this.registry, entity, key, value);
      if (this.config.entity === entity) this.stationMessage = 'Setting sent. The displayed value follows Home Assistant.';
    } catch (error) {
      if (this.config.entity === entity) { this.stationMessage = error.message; this.stationError = true; }
    } finally { this.stationBusy = false; this.updateConsumables(); }
  }
  updateStationSettings() {
    const root = this.shadowRoot;
    const tab = this.infoTab || 'consumables';
    for (const name of ['consumables', 'station']) {
      const button = root.querySelector(`[data-info-tab="${name}"]`);
      button.setAttribute('aria-selected', String(tab === name));
      button.tabIndex = tab === name ? 0 : -1;
      root.querySelector(`#panel-${name}`).hidden = tab !== name;
    }
    const html = stationSettings(this._hass, this.registry, this.config.entity).map(field => {
      const disabled = !field.available || this.stationBusy || this.busy || this.controlBusy;
      const attrs = `data-station="${field.key}" aria-label="${escapeHtml(field.label)}" ${disabled ? 'disabled' : ''}`;
      const control = field.domain === 'switch'
        ? `<ha-switch ${attrs} ${field.value === 'on' ? 'checked' : ''}></ha-switch>`
        : `<select ${attrs}>${!field.options.includes(field.value) ? '<option value="">Unavailable</option>' : ''}${field.options.map(v => `<option value="${escapeHtml(v)}" ${v === field.value ? 'selected' : ''}>${escapeHtml(v)}</option>`).join('')}</select>`;
      return `<label class="station-row ${field.domain}"><span>${field.label}${!field.available ? '<small>Unavailable</small>' : ''}</span>${control}</label>`;
    }).join('');
    const host = root.querySelector('.station-rows');
    if (host._stationHtml !== html) { host.innerHTML = html; host._stationHtml = html; }
    const message = root.querySelector('.station-message');
    message.textContent = this.stationMessage || '';
    message.classList.toggle('error', !!this.stationError);
  }
  headerHtml() {
    return `<header><div class="robot"><ha-icon icon="mdi:robot-vacuum"></ha-icon></div><div class="header-title"><h2>${escapeHtml(this.config.title)}</h2><p>Dyson Spot+Scrub <span class="tag">v0.3.6a</span></p></div><div class="header-tools"><div class="battery" role="img"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="1" y="3" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="29" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect class="battery-fill" x="4" y="6" width="0" height="8" rx="1" fill="currentColor"/><path class="battery-bolt" d="M17 1 9 11h6l-2 8L23 8h-7Z" fill="var(--dp-bg)" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" hidden/></svg><span class="battery-value" aria-hidden="true">—</span></div><button class="consumables-info" data-action="consumables" data-focus="consumables-info" aria-label="Consumables" aria-haspopup="dialog" aria-expanded="false" title="Consumables">Info</button></div></header>`;
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
    return `<div class="activity-status" role="status" aria-live="polite" hidden><ha-icon class="activity-icon" aria-hidden="true"></ha-icon><div class="activity-copy"><span class="activity-text"></span><span class="activity-fault" hidden></span><span class="activity-start-block" hidden></span><span class="activity-remaining" hidden></span><div class="drying-progress" role="progressbar" aria-label="Drying time remaining" aria-valuemin="0" aria-valuemax="100" hidden><span class="drying-progress-fill"></span></div></div><span class="drying-control" hidden><button class="cancel-drying" data-control="cancel_drying" data-focus="cancel-drying" disabled aria-label="Cancel drying"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></span></div>`;
  }
  updateStatus() {
    const status = activityStatus(this._hass, this.config.entity, (this.busy && !this.saving) || this.pendingStart);
    const row = this.shadowRoot.querySelector('.activity-status');
    row.hidden = !status;
    row.querySelector('.activity-text').textContent = status?.text ?? '';
    // Display the integration's current explanation without retaining or inferring faults.
    const fault = this._hass?.states?.[this.config.entity]?.attributes?.fault;
    const detail = status?.text === 'Robot needs attention' && typeof fault === 'string' ? fault.trim() : '';
    const faultText = row.querySelector('.activity-fault');
    faultText.textContent = detail;
    faultText.hidden = !detail;

    const blockNote = row.querySelector('.activity-start-block');
    const block = startBlockReason(this._hass, this.config.entity);
    blockNote.hidden = this.view.active || !block || block === status?.text || dockBlocksStart(this._hass, this.config.entity);
    blockNote.textContent = block ?? '';
    row.querySelector('.activity-icon').setAttribute('icon', status?.icon ?? 'mdi:robot-vacuum');
    row.querySelector('.drying-control').hidden = !status?.drying;
    const remaining = row.querySelector('.activity-remaining');
    const time = status?.drying ? dryingRemainingTime(this._hass, this.config.entity) : null;
    remaining.hidden = !status?.drying;
    remaining.textContent = time === null ? 'Remaining time: unavailable' : `Remaining time: ${time} (hh:mm)`;
    const progress = row.querySelector('.drying-progress');
    const percent = status?.drying ? dryingRemainingPercent(this._hass, this.config.entity) : null;
    progress.hidden = percent === null;
    if (percent !== null) {
      progress.setAttribute('aria-valuenow', String(Math.round(percent)));
      progress.setAttribute('aria-valuetext', `Remaining time: ${time} (hh:mm)`);
      progress.querySelector('.drying-progress-fill').style.width = `${percent}%`;
    } else {
      progress.removeAttribute('aria-valuenow');
      progress.removeAttribute('aria-valuetext');
    }
    const cancel = row.querySelector('.cancel-drying');
    const supported = canControl(this._hass, this.config.entity, 'cancel_drying');
    cancel.disabled = this.busy || this.controlBusy || !supported;
    cancel.title = supported ? 'Cancel drying' : 'Drying cancellation requires a connected robot and the integration cancel_drying action.';
  }
  renderSession(view) {
    const h = escapeHtml;
    // Keep the map element mounted across status and message updates so polling,
    // the last good image and in-flight requests are independent of card renders.
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<section class="session"><ul class="requested"></ul></section>${this.config.show_camera ? '<div class="map-section"><div class="map-title">Cleaning map</div><p class="map-caption">Refreshes about every 5 seconds</p><dyson-planner-map></dyson-planner-map></div>' : ''}<footer class="session-footer"><div class="actions session-actions"><button class="session-toggle" data-control="pause" data-focus="session-toggle"><ha-icon></ha-icon><span></span></button><button class="home" data-control="return_to_base" data-focus="home"><ha-icon icon="mdi:home-import-outline"></ha-icon>Home</button></div><p class="notice action-message" role="status" aria-live="polite"></p></footer></div>${this.consumablesHtml()}</ha-card>`, 'session');
    const root = this.shadowRoot;
    this.updateBattery();
    this.updateConsumables();
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
          if (mode === 'Vacuum' && key === 'water_level') return '';
          if (mode === 'Mop' && key === 'cleaning_strategy') return '';
        }
        const field = room.settings?.[key];
        if (!field && this.config.unsupported_settings === 'hidden' && !this.config.always_show_all_settings) return '';
        const value = valueOf(key), options = field?.options ?? [];
        return `<label class="field ${key === 'cleaning_mode' ? 'mode' : ''}">${label}<select data-setting="${key}" data-room-id="${h(room.roomId)}" data-focus="${key}-${n}" aria-label="${label} ${h(room.name)}" ${disabled || !field ? 'disabled' : ''}>${!options.includes(value) ? '<option value="">Unavailable</option>' : ''}${options.map(option => `<option value="${h(option)}" ${value === option ? 'selected' : ''}>${h(option)}</option>`).join('')}</select>${!field ? '<span class="badge">Not available</span>' : ''}</label>`;
      }).join('');
      return `<section class="room ${selected ? 'selected' : ''}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(room.entity)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span><span class="name">${h(room.name)} ${selected ? `<span class="status">(${order})</span>` : ''}</span><span class="summary">${!room.available ? h(room.error || 'Unavailable') : h(valueOf('cleaning_mode') ?? 'Room settings unavailable')}</span></span></label><button class="expand" data-focus="expand-${n}" data-expand="${h(room.entity || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="Settings for ${h(room.name)}"><span>Settings</span> ${open ? '⌃' : '⌄'}</button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${!room.roomId ? '<p class="badge mode">Room ID unavailable. Check the updated integration and refresh rooms.</p>' : ''}</div></section>`;
    }).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<div class="rooms">${roomHtml}</div>${!rooms.length ? '<p class="empty">No enabled rooms found. Check the card configuration and room discovery.</p>' : ''}<footer><div class="summary-line"><span>${this.selected.length} of ${rooms.length} rooms selected</span><span class="status ${this.dirty ? 'draft-status' : ''}">${this.dirty ? `<button class="discard-draft" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''} title="Discard draft" aria-label="Discard draft"><ha-icon icon="mdi:trash-can-outline" aria-hidden="true"></ha-icon></button>Local draft` : 'From Home Assistant'}</span></div><div class="actions"><button data-action="save" data-focus="save" ${!hasChanges || this.busy || !canSave ? 'disabled' : ''}>${this.saving ? 'Saving …' : 'Save settings'}</button><button class="start" data-focus="start" data-action="start" ${this.selected.length === 0 || this.busy || startBlockReason(this._hass, this.config.entity) ? 'disabled' : ''}>Start clean</button></div>${!canSave || !canStart ? '<p class="notice badge">The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.</p>' : ''}${external ? '<p class="notice badge">Settings changed outside this card. Your edited values remain in the local draft.</p>' : ''}<p class="notice ${this.error ? 'error' : ''}" role="status" aria-live="polite">${h(this.message)}</p></footer></div>${this.consumablesHtml()}</ha-card>`, 'planner');
    this.updateBattery();
    this.updateConsumables();
    this.updateStatus();
  }
}

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and per-room cleaning settings for Dyson Spot+Scrub.', preview: true });
