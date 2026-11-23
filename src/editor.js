// Bundled after card.js; uses the same registry connection and identity matching.
class DysonCleaningPlannerEditor extends DysonRegistryElement {
  get selectableRegistry() {
    if (this._registryLoaded) return this.registry;
    const known = new Set(this.registry.map(entry => entry.entity_id));
    return [...this.registry, ...Object.values(this._hass?.entities ?? {}).filter(entry => !known.has(entry.entity_id))];
  }
  constructor() {
    super();
    const previewInteraction = event => {
      const el = event.target.closest('input, select, button');
      if (!el) return;
      if (el.dataset.key === 'zone_dimension_unit') { this.setSessionPreview(false, true); return; }
      if (['show_camera', 'camera_entity', 'camera_rotation'].includes(el.dataset.key)) this.setSessionPreview(true);
      else if (['unsupported_settings', 'always_show_all_settings'].includes(el.dataset.key)
        || el.dataset.include || el.dataset.order || el.dataset.action === 'refresh') this.setSessionPreview(false);
    };
    for (const type of ['pointerdown', 'click', 'change', 'keydown']) {
      this.shadowRoot.addEventListener(type, event => {
        if (type !== 'keydown' || ['Enter', ' ', 'ArrowDown', 'ArrowUp', 'F4'].includes(event.key)) previewInteraction(event);
      });
    }
    this.shadowRoot.addEventListener('input', event => {
      const el = event.target;
      if (this.config && el.dataset.key === 'title') this.commit({ ...this.config, title: el.value });
    });
    this.shadowRoot.addEventListener('change', event => {
      const el = event.target;
      if (!this.config || el.dataset.key === 'title') return;
      const next = { ...this.config };
      if (el.dataset.key) {
        next[el.dataset.key] = el.type === 'checkbox' ? el.checked : el.dataset.key === 'camera_rotation' ? Number(el.value) : el.value;
        if (el.dataset.key === 'integration' && !integrationVacuumEntries(next, this.selectableRegistry).some(e => e.entity_id === next.entity)) {
          next.entity = defaultIntegrationEntity(this._hass, next, this.registry, !!this._registryLoaded);
        }
        if (el.dataset.key === 'entity' || el.dataset.key === 'integration') {
          delete next.mode_entity; delete next.start_entity; delete next.room_entities; delete next.camera_entity;
          next.excluded_rooms = []; next.room_order = [];
        }
      } else if (el.dataset.statusItem) {
        const hidden = new Set(next.hidden_status_items ?? []);
        if (el.checked) hidden.delete(el.dataset.statusItem);
        else hidden.add(el.dataset.statusItem);
        next.hidden_status_items = [...hidden];
      } else if (el.dataset.include) {
        next.excluded_rooms = (next.excluded_rooms ?? []).filter(id => id !== el.dataset.include);
        if (!el.checked) next.excluded_rooms.push(el.dataset.include);
      } else return;
      this.commit(next);
    });
    this.shadowRoot.addEventListener('click', event => {
      const el = event.target.closest('button');
      if (el?.dataset.action === 'refresh') { this.loadRegistry(true); return; }
      if (!el?.dataset.order) return;
      const ids = this.model.rooms.filter(r => r.entity).map(r => r.entity);
      const i = ids.indexOf(el.dataset.order), j = i + Number(el.dataset.direction);
      if (i >= 0 && j >= 0 && j < ids.length) {
        [ids[i], ids[j]] = [ids[j], ids[i]];
        this.commit({ ...this.config, room_order: ids });
      }
    });
  }
  connectedCallback() {
    this._previewDialog = cardEditorDialog(this);
    super.connectedCallback();
  }
  disconnectedCallback() {
    this.setSessionPreview(false);
    this._previewDialog = null;
    super.disconnectedCallback();
  }
  setSessionPreview(active, zone = false) {
    const dialog = this._previewDialog;
    if (!dialog) return;
    if (active) sessionPreviewOwners.set(dialog, this);
    else sessionPreviewOwners.delete(dialog);
    if (zone) zonePreviewOwners.set(dialog, this);
    else zonePreviewOwners.delete(dialog);
    dialog.dispatchEvent(new Event(previewViewChanged));
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
    const vacuums = integrationVacuumEntries(this.config, this.selectableRegistry);
    const config = { ...this.config, excluded_rooms: this.config.excluded_rooms ?? [], room_order: this.config.room_order ?? [] };
    this.model = config.entity ? this.adapter.discover(this._hass, this.registry, config) : { rooms: [], issues: [] };
    const field = (key, label) => {
      const entries = this.adapter.cameraEntries(this.registry, config.entity);
      return `<label>${label}<select data-focus="${key}" data-key="${key}"><option value="">${this.ht("Auto-detect")}</option>${entries.map(e => `<option value="${h(e.entity_id)}" ${config[key] === e.entity_id ? 'selected' : ''}>${h(e.name || e.original_name || e.entity_id)}</option>`).join('')}</select></label>`;
    };
    this.paint(`<style>${styles}:host{padding:8px}label{display:grid;gap:8px;margin:0 0 16px;font-size:14px}input[type=text]{padding:12px;border:1px solid var(--dp-line);border-radius:8px;background:var(--dp-bg);color:inherit;width:100%}.entry{display:flex;gap:8px;align-items:center;margin:8px 0}.entry label{display:flex;align-items:center;flex:1;margin:0}.entry button{min-width:42px}h3{font-size:15px;margin-top:24px}.status-options{margin:12px 0 0;padding:8px 0 0 12px;border:0;border-top:1px solid var(--dp-line);min-width:0}.status-options:disabled{opacity:.5}.battery-percentage-option{padding-left:24px}.battery-percentage-option:has(input[disabled]){opacity:.5}</style>
      <label>${this.ht('Integration')}<select data-key="integration" data-focus="integration">${[['auto',this.t('Automatic')],['dyson_spot_scrub','Dyson Spot+Scrub'],['hass_dyson',this.t('hass-dyson (experimental)')]].map(([id,label]) => `<option value="${id}" ${(config.integration ?? 'auto') === id ? 'selected' : ''}>${h(label)}</option>`).join('')}</select></label>
      <label>${this.ht("Dyson device")}<select data-key="entity" data-focus="entity"><option value="">${this.ht("Select a device")}</option>${vacuums.map(e => `<option value="${h(e.entity_id)}" ${config.entity === e.entity_id ? 'selected' : ''}>${h(this._hass.states[e.entity_id]?.attributes?.friendly_name || e.entity_id)} · ${e.platform === 'hass_dyson' ? 'hass-dyson' : 'Spot+Scrub'}</option>`).join('')}</select></label>
      <label>${this.ht("Title")}<input type="text" data-key="title" data-focus="title" placeholder="${this.ht('Plan a clean')}" value="${h(config.title ?? '')}"></label>
      <label>${this.ht("Language")}<select data-key="language" data-focus="language"><option value="auto" ${!config.language || config.language === 'auto' ? 'selected' : ''}>${this.ht("Automatic")}</option><option value="en" ${config.language === 'en' ? 'selected' : ''}>English [en]</option><option value="de" ${config.language === 'de' ? 'selected' : ''}>Deutsch [de]</option><option value="nl" ${config.language === 'nl' ? 'selected' : ''}>Nederlands [nl]</option><option value="fr" ${config.language === 'fr' ? 'selected' : ''}>Français [fr]</option></select></label>
      <label>${this.ht("Theme")}<select data-key="theme" data-focus="theme"><option value="classic" ${config.theme === 'classic' ? 'selected' : ''}>${this.ht("Classic")}</option><option value="modern" ${config.theme !== 'classic' ? 'selected' : ''}>${this.ht("Modern")}</option></select></label>
      <label>${this.ht("Header icon style")}<select data-key="header_icon_style" data-focus="header-icon-style"><option value="home_assistant" ${config.header_icon_style === 'home_assistant' ? 'selected' : ''}>Home Assistant</option><option value="integration" ${(config.header_icon_style ?? 'integration') === 'integration' ? 'selected' : ''}>${this.ht("Integration")}</option></select></label>
      <div class="entry"><label><input type="checkbox" data-key="always_show_all_settings" data-focus="all-settings" ${config.always_show_all_settings === true ? 'checked' : ''}>${this.ht("Always show all settings")}</label></div>
      <p>${this.ht("Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.")}</p>
      <h3>${this.ht("Status bar")}</h3>
      <div class="entry"><label><input type="checkbox" data-key="show_status_bar" data-focus="show-status-bar" ${config.show_status_bar !== false ? 'checked' : ''}>${this.ht("Show status bar")}</label></div>
      <fieldset class="status-options" aria-label="${this.ht("Visible status indicators")}" ${config.show_status_bar === false ? 'disabled' : ''}>
        ${STATUS_BAR_ITEMS.map(([key, label]) => `<div class="entry"><label><input type="checkbox" data-status-item="${key}" data-focus="status-${key}" ${!config.hidden_status_items?.includes(key) ? 'checked' : ''}>${this.ht(label)}</label></div>`).join('')}
        <div class="entry battery-percentage-option"><label><input type="checkbox" data-key="show_battery_percentage" data-focus="show-battery-percentage" ${config.show_battery_percentage === true ? 'checked' : ''} ${config.hidden_status_items?.includes('battery') ? 'disabled' : ''}>${this.ht("Show battery percentage")}</label></div>
      </fieldset>
      <h3>${this.ht("Cleaning map")}</h3><div class="entry"><label><input type="checkbox" data-key="show_camera" data-focus="show-camera" ${config.show_camera !== false ? 'checked' : ''}>${this.ht("Show camera during a cleaning session")}</label></div>
      <p class="notice">${this.ht("Turning this off removes the map and stops image requests from this card.")}</p>
      ${field('camera_entity', this.ht(this.adapter.mapEntityLabel ?? 'Map camera'), 'camera')}
      <label>${this.ht("Map rotation")}<select data-key="camera_rotation" data-focus="camera-rotation">${[0, 90, 180, 270].map(deg => `<option value="${deg}" ${(config.camera_rotation ?? 0) === deg ? 'selected' : ''}>${deg}°</option>`).join('')}</select></label>
      <h3>${this.ht("Zone cleaning")}</h3>
      <label>${this.ht("Dimension display")}<select data-key="zone_dimension_unit" data-focus="zone-dimension-unit">${[['auto','Automatic'],['cm','Centimeters'],['inch','Inches'],['off','Off']].map(([value,label]) => `<option value="${value}" ${(config.zone_dimension_unit ?? 'auto') === value ? 'selected' : ''}>${this.ht(label)}</option>`).join('')}</select></label>
      <h3>${this.ht("Rooms in this card")}</h3><p>${this.ht("Choose which rooms to show. Arrows change the display order, not the robot cleaning order.")}</p>
      ${this.model.rooms.map((r, i) => `<div class="entry"><label><input type="checkbox" data-focus="include-${i}" data-include="${h(r.entity)}" ${!r.excluded ? 'checked' : ''} ${!r.entity ? 'disabled' : ''}>${h(r.name)}</label><button data-order="${h(r.entity)}" data-direction="-1" ${i === 0 ? 'disabled' : ''} aria-label="${this.ht('Move {name} up', { name: r.name })}">↑</button><button data-order="${h(r.entity)}" data-direction="1" ${i === this.model.rooms.length - 1 ? 'disabled' : ''} aria-label="${this.ht('Move {name} down', { name: r.name })}">↓</button></div>`).join('')}
      <button data-action="refresh" data-focus="refresh-rooms">${this.ht("Refresh rooms")}</button>
      <p class="notice">${this.ht("Rooms disabled in Home Assistant are not offered. New rooms appear automatically.")}</p><p class="notice error">${this.registryError ? this.ht(this.registryError) : this.model.issues.map(issue => this.ht(issue)).join(' ')}</p>`);
  }
}
if (!customElements.get('dyson-cleaning-planner-card-editor')) customElements.define('dyson-cleaning-planner-card-editor', DysonCleaningPlannerEditor);
