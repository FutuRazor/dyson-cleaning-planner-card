import { available, escapeHtml, isSavedMapId } from './shared.js';
import { UiError, uiMessage } from './localize.js';

export function mapSelectionState(hass, registry, vacuum) {
  const robot = registry.find(row => row.entity_id === vacuum && row.platform === 'dyson_spot_scrub' && !row.disabled_by);
  const serial = String(robot?.unique_id ?? '').replace(/_vacuum$/, '');
  const entries = robot?.device_id ? registry.filter(row => row.platform === robot.platform && row.device_id === robot.device_id
    && !row.disabled_by && row.entity_id.startsWith('select.') && row.unique_id === `${serial}_active_map`) : [];
  const entry = entries.length === 1 ? entries[0] : null, source = hass?.states?.[entry?.entity_id], attrs = source?.attributes ?? {};
  const raw = attrs.maps, options = attrs.options;
  const valid = Array.isArray(raw) && Array.isArray(options) && raw.length === options.length
    && raw.every(item => item && isSavedMapId(item.map_id) && typeof item.name === 'string' && !!item.name.trim()
      && typeof item.option === 'string' && !!item.option.trim() && options.includes(item.option))
    && new Set(raw.map(item => item.map_id)).size === raw.length && new Set(raw.map(item => item.option)).size === raw.length;
  const maps = valid ? raw.map(item => ({...item})) : [];
  const current = maps.find(item => item.map_id === attrs.map_id && item.option === source?.state);
  const live = !!entry && valid && hass?.connected !== false && available(source) && available(hass?.states?.[vacuum]);
  return {supported:!!entry,entity:entry?.entity_id,uniqueId:entry?.unique_id,deviceId:entry?.device_id,maps,
    currentId:current?.map_id ?? null,available:live,
    canChange:live && !!current && String(hass.states[vacuum].attributes?.map_id) === current.map_id
      && attrs.can_change === true && attrs.switching !== true && !!hass?.services?.select?.select_option};
}

// Visibility is local presentation. Keep the complete catalogue authoritative
// for identity, readiness and confirmation, including a hidden active map.
export function mapSelectionPresentation(state, config = {}) {
  if (!state.supported) return {current:null,visibleMaps:[],hiddenCurrent:null,showSelector:false,displayMaps:[]};
  const maps = state.maps ?? [], excluded = new Set(config.excluded_maps ?? []);
  const current = maps.find(map => map.map_id === state.currentId) ?? null;
  const visibleMaps = maps.filter(map => !excluded.has(map.map_id));
  const hiddenCurrent = current && excluded.has(current.map_id) ? current : null;
  const showSelector = !!state.supported && (visibleMaps.length > 1 || (!!hiddenCurrent && visibleMaps.length > 0));
  return {current,visibleMaps,hiddenCurrent,showSelector,
    displayMaps:showSelector ? hiddenCurrent ? [hiddenCurrent,...visibleMaps] : visibleMaps : []};
}

export function selectMap(hass, registry, vacuum, identity) {
  const state = mapSelectionState(hass, registry, vacuum), map = state.maps.find(item => item.map_id === identity);
  if (!state.canChange || !map) throw new UiError('Map switching is unavailable. Refresh the map list and check the robot.');
  if (state.currentId === identity) return Promise.resolve();
  return hass.callService('select','select_option',{entity_id:state.entity,option:map.option});
}

export function mapSelectionConfirmed(hass, registry, vacuum, request) {
  const state = mapSelectionState(hass, registry, vacuum);
  return state.available && state.entity === request.entity && state.uniqueId === request.uniqueId && state.deviceId === request.deviceId
    && state.currentId === request.mapId && String(hass?.states?.[vacuum]?.attributes?.map_id) === request.mapId;
}

export const mapSelectionStyles = `
.map-picker{position:relative}.map-toggle{display:flex;align-items:center;justify-content:center;min-height:32px;padding:3px 10px;background:transparent;color:var(--dp-muted)}.map-toggle ha-icon{--mdc-icon-size:20px}.map-toggle.pending ha-icon{visibility:hidden}
.map-toggle.pending:after{content:"";position:absolute;width:18px;height:18px;border:2px solid var(--dp-line);border-top-color:var(--dp-accent);border-radius:50%;animation:schedule-spin .7s linear infinite}
.map-menu{position:absolute;z-index:4;inset-inline-end:0;top:calc(100% + 6px);width:min(260px,calc(100vw - 64px));max-height:320px;overflow-y:auto;padding:8px;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:12px;box-shadow:0 6px 24px #0003}
.map-menu-label{margin:4px 8px 8px;color:var(--dp-muted);font-size:12px}.map-menu button{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:42px;padding:9px 10px;border:0;border-radius:8px;background:transparent;color:var(--primary-text-color);text-align:start;overflow-wrap:anywhere;font-size:14px}
.map-menu button[aria-checked=true]{background:var(--dp-soft);color:var(--dp-accent)}.map-menu button span{min-width:0}.map-menu-note{font-size:12px;line-height:1.5;margin:6px 8px;color:var(--dp-muted)}
.map-hidden-label{display:block;font-size:11px;font-weight:400;line-height:1.4;color:var(--dp-muted)}
.map-editor-id{display:block;font-size:11px;color:var(--dp-muted);overflow-wrap:anywhere}
.map-options .entry label,.map-options .entry label>span{min-width:0;overflow-wrap:anywhere}
.map-visibility-note{margin:0 var(--dp-padding,20px) 12px;font-size:12px;line-height:1.5;color:var(--dp-muted);overflow-wrap:anywhere}
.map-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 var(--dp-padding,20px) 14px;min-width:0}
.map-chip{display:flex;align-items:center;gap:6px;min-width:0;max-width:100%;min-height:36px;padding:7px 11px;border:1px solid var(--dp-line);border-radius:18px;background:var(--dp-modern-surface,var(--dp-bg));color:var(--primary-text-color);font:inherit;font-size:13px;line-height:1.35;text-align:start;white-space:normal}
.map-chip[aria-pressed=true]{border-color:var(--dp-accent);background:var(--dp-soft);color:var(--dp-accent)}
.map-chip-copy{min-width:0;overflow-wrap:anywhere}.map-chip-icon{display:flex;align-items:center;justify-content:center;flex:0 0 16px;width:16px;min-height:16px}.map-chip-icon ha-icon{width:16px;height:16px;--mdc-icon-size:16px}
.map-chip-spinner{width:14px;height:14px;border:2px solid var(--dp-line);border-top-color:var(--dp-accent);border-radius:50%;animation:schedule-spin .7s linear infinite}.map-chip[aria-busy=true]{opacity:1}
:host([map-switching]) :is(.rooms,.planning-settings,.planning-tabs,footer,dyson-planner-zone){opacity:.55}
@media(prefers-reduced-motion:reduce){.map-toggle.pending:after,.map-chip-spinner{animation:none}}
`;

export const mapSelectionCardMethods = {
  getMapSelection() { return this.adapter.mapSelectionState?.(this._hass,this.registry,this.config.entity) ?? {supported:false,maps:[]}; },
  getMapPresentation() {
    const state = this.getMapSelection(), request = this._mapRequest;
    const currentId = request && !mapSelectionConfirmed(this._hass,this.registry,this.config.entity,request) ? request.currentId : state.currentId;
    return mapSelectionPresentation({...state,currentId},this.config);
  },
  mapControlsLocked() {
    return !!(this._previewDialog || this.busy || this.controlBusy || this.stationBusy || this.scheduleSending || this.scheduleDialog
      || this.view.active || this._mapRequest || this.shadowRoot.querySelector('dyson-planner-zone')?.sending);
  },
  mapPickerHtml() {
    const state = this.getMapSelection(), presentation = this.getMapPresentation();
    if (this.config.map_selector_style === 'chips' || !presentation.showSelector) return '';
    const {current,displayMaps,hiddenCurrent} = presentation, pending = !!this._mapRequest;
    const locked = this.mapControlsLocked();
    const label = current ? this.t('Switch map: {name}',{name:current.option}) : this.t('Switch map');
    const note = this.dirty ? 'Discard local room changes before switching maps.' : !state.canChange
      ? 'Map switching is unavailable. Refresh the map list and check the robot.' : null;
    return `<div class="map-picker"><button class="map-toggle ${pending ? 'pending' : ''}" data-action="maps" data-focus="maps" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" aria-haspopup="menu" aria-controls="saved-map-menu" aria-expanded="${!!this.mapMenuOpen}" ${pending ? 'aria-busy="true"' : ''} ${locked ? 'disabled' : ''}><ha-icon icon="mdi:map-marker-path" aria-hidden="true"></ha-icon></button>${this.mapMenuOpen ? `<div class="map-menu" id="saved-map-menu" role="menu" aria-label="${this.ht('Saved maps')}"><p class="map-menu-label">${this.ht('Saved maps')}</p>${displayMaps.map(map => `<button role="menuitemradio" aria-checked="${map.map_id === current?.map_id}" data-map-id="${map.map_id}" data-focus="map-${map.map_id}" ${locked || !state.canChange || this.dirty || map.map_id === current?.map_id ? 'disabled' : ''}><span>${escapeHtml(map.option)}${map.map_id === hiddenCurrent?.map_id ? `<small class="map-hidden-label">${this.ht('Hidden in this card')}</small>` : ''}</span>${map.map_id === current?.map_id ? '<ha-icon icon="mdi:check" aria-hidden="true"></ha-icon>' : ''}</button>`).join('')}${note ? `<p class="map-menu-note">${this.ht(note)}</p>` : ''}</div>` : ''}</div>`;
  },
  mapSelectorHtml() {
    const state = this.getMapSelection(), {current,displayMaps,hiddenCurrent,showSelector} = this.getMapPresentation();
    if (this.config.map_selector_style === 'chips' && showSelector) {
      const locked = this.mapControlsLocked() || !state.canChange || this.dirty;
      return `<div class="map-chips" role="group" aria-label="${this.ht('Saved maps')}">${displayMaps.map(map => {
        const active = map.map_id === current?.map_id, pending = map.map_id === this._mapRequest?.mapId;
        return `<button class="map-chip" data-map-id="${map.map_id}" data-focus="map-chip-${map.map_id}" aria-pressed="${active}" ${pending ? 'aria-busy="true"' : ''} aria-label="${this.ht(pending ? 'Switching map: {name}' : 'Switch map: {name}',{name:map.option})}${map.map_id === hiddenCurrent?.map_id ? ` · ${this.ht('Hidden in this card')}` : ''}" ${locked ? 'disabled' : ''}><span class="map-chip-icon" aria-hidden="true">${pending ? '<span class="map-chip-spinner"></span>' : active ? '<ha-icon icon="mdi:check"></ha-icon>' : ''}</span><span class="map-chip-copy">${escapeHtml(map.option)}${map.map_id === hiddenCurrent?.map_id ? `<small class="map-hidden-label">${this.ht('Hidden in this card')}</small>` : ''}</span></button>`;
      }).join('')}</div>${this.dirty ? `<p class="map-visibility-note">${this.ht('Discard local room changes before switching maps.')}</p>` : ''}`;
    }
    return hiddenCurrent ? `<p class="map-visibility-note" role="status">${this.ht('Active map: {name} (hidden in this card).',{name:hiddenCurrent.option})}</p>` : '';
  },
  closeMapMenu() {
    this.mapMenuOpen = false;
    this.shadowRoot.querySelector('.map-menu')?.remove();
    this.shadowRoot.querySelector('.map-toggle')?.setAttribute('aria-expanded','false');
    // Invalidate the paint cache without replacing native controls mid-click.
    this._html = null;
  },
  mapClick(event) {
    if (this.mapMenuOpen && !event.target.closest('.map-picker')) this.closeMapMenu();
    const button = event.target.closest('button');
    if (button?.dataset.action === 'maps') {
      if (!button.disabled) {
        this.mapMenuOpen = !this.mapMenuOpen; this.render();
        if (this.mapMenuOpen) this.shadowRoot.querySelector('.map-menu button:not(:disabled)')?.focus({preventScroll:true});
      }
      return true;
    }
    if (button?.dataset.mapId !== undefined) {
      if (!button.disabled) this.switchSavedMap(button.dataset.mapId);
      return true;
    }
    return false;
  },
  mapKeydown(event) {
    if (!this.mapMenuOpen) return false;
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); this.closeMapMenu();
      this.shadowRoot.querySelector('.map-toggle')?.focus({preventScroll:true}); return true;
    }
    if (event.target.closest('.map-menu') && ['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      const buttons = [...this.shadowRoot.querySelectorAll('.map-menu button:not(:disabled)')], index = buttons.indexOf(event.target);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus({preventScroll:true}); return true;
    }
    return false;
  },
  mapRequestCurrent(request) { return this.config === request.config && this.isConnected && this._detachRevision === request.detach; },
  cancelMapSwitch() {
    this._mapRequest?.complete?.('cancelled'); this._mapRequest = null; this._unconfirmedMapSwitch = null; this.mapMenuOpen = false;
  },
  reconcileMapSwitch() {
    const request = this._mapRequest;
    if (request && this.mapRequestCurrent(request)
        && mapSelectionConfirmed(this._hass,this.registry,this.config.entity,request)) request.complete?.('confirmed');
    const late = this._unconfirmedMapSwitch;
    if (late && this.message === late.notice && this.mapRequestCurrent(late.request)
        && mapSelectionConfirmed(this._hass,this.registry,this.config.entity,late.request)) {
      this.message = ''; this.error = false; this._unconfirmedMapSwitch = null;
    }
    if (this.config.map_selector_style === 'chips' || !this.getMapPresentation().showSelector) this.mapMenuOpen = false;
  },
  applyMapLock() {
    const locked = !!this._mapRequest;
    this.toggleAttribute('map-switching',locked);
    this.shadowRoot.querySelectorAll('.rooms,.schedules,.planning-settings,.planning-tabs,.planner-content>footer,dyson-planner-zone')
      .forEach(element => { element.inert = locked; });
  },
  async switchSavedMap(identity) {
    if (this._previewDialog || !this.isConnected || this._mapRequest || this.busy || this.controlBusy || this.stationBusy
        || this.scheduleSending || this.scheduleDialog || this.view.active || this.shadowRoot.querySelector('dyson-planner-zone')?.sending) return;
    if (this.dirty) { this.error = true; this.message = 'Discard local room changes before switching maps.'; this.render(); return; }
    const state = this.getMapSelection();
    if (!state.canChange || !mapSelectionPresentation(state,this.config).visibleMaps.some(item => item.map_id === identity) || state.currentId === identity) return;
    const request = {...state,mapId:identity,config:this.config,detach:this._detachRevision};
    this._mapRequest = request; this.mapMenuOpen = false; this._unconfirmedMapSwitch = null; this.message = ''; this.error = false; this.render();
    try {
      await this.adapter.selectMap(this._hass,this.registry,this.config.entity,identity);
      if (!this.mapRequestCurrent(request)) return;
      let result = 'confirmed';
      if (!mapSelectionConfirmed(this._hass,this.registry,this.config.entity,request)) {
        result = await new Promise(resolve => {
          const timer = setTimeout(() => request.complete?.('timeout'),10000);
          request.complete = value => { clearTimeout(timer); request.complete = null; resolve(value); };
        });
      }
      if (!this.mapRequestCurrent(request) || result === 'cancelled') return;
      if (result !== 'confirmed') {
        const notice = uiMessage('The map switch has not been confirmed. Check the selected map before trying again.');
        this.message = notice; this.error = true; this._unconfirmedMapSwitch = {request,notice};
      } else { this.zoneDraft = null; this.expanded.clear(); }
    } catch (error) {
      if (this.mapRequestCurrent(request)
          && !mapSelectionConfirmed(this._hass,this.registry,this.config.entity,request)) {
        this.error = true; this.message = error;
        this._unconfirmedMapSwitch = {request,notice:error};
      }
    } finally {
      if (this._mapRequest === request) {
        this._mapRequest = null;
        if (this.mapRequestCurrent(request)) {
          this.update();
          const focus = this.config.map_selector_style === 'chips' ? `.map-chip[data-map-id="${identity}"]:not(:disabled)` : '.map-toggle';
          (this.shadowRoot.querySelector(focus) ?? this.shadowRoot.querySelector('.planning-tabs [aria-selected="true"]')
            ?? this.shadowRoot.querySelector('.consumables-info'))?.focus({preventScroll:true});
        }
      }
    }
  }
};
