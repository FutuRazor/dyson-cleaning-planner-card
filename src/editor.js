// Bundled after card.js; uses the same registry connection and identity matching.
class DysonCleaningPlannerEditor extends DysonRegistryElement {
  constructor() {
    super();
    this.shadowRoot.addEventListener('change', event => {
      const el = event.target;
      if (!this.config) return;
      const next = { ...this.config };
      if (el.dataset.key) {
        next[el.dataset.key] = el.type === 'checkbox' ? el.checked : el.dataset.key === 'camera_rotation' ? Number(el.value) : el.value;
        if (el.dataset.key === 'entity') {
          delete next.mode_entity; delete next.start_entity; delete next.room_entities; delete next.camera_entity;
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
    this.paint(`<style>${styles}:host{padding:8px}label{display:grid;gap:8px;margin:0 0 16px;font-size:14px}input[type=text]{padding:12px;border:1px solid var(--dp-line);border-radius:8px;background:var(--dp-bg);color:inherit;width:100%}.entry{display:flex;gap:8px;align-items:center;margin:8px 0}.entry label{display:flex;align-items:center;flex:1;margin:0}.entry button{min-width:42px}h3{font-size:15px;margin-top:24px}</style>
      <label>Dyson device<select data-key="entity" data-focus="entity"><option value="">Select a device</option>${vacuums.map(e => `<option value="${h(e.entity_id)}" ${config.entity === e.entity_id ? 'selected' : ''}>${h(this._hass.states[e.entity_id]?.attributes?.friendly_name || e.entity_id)}</option>`).join('')}</select></label>
      <label>Title<input type="text" data-key="title" data-focus="title" value="${h(config.title ?? 'Plan a clean')}"></label>
      <label>Unsupported settings<select data-key="unsupported_settings" data-focus="unsupported"><option value="disabled" ${config.unsupported_settings !== 'hidden' ? 'selected' : ''}>Show disabled</option><option value="hidden" ${config.unsupported_settings === 'hidden' ? 'selected' : ''}>Hide</option></select></label>
      <p>Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.</p>
      <h3>Cleaning map</h3><div class="entry"><label><input type="checkbox" data-key="show_camera" data-focus="show-camera" ${config.show_camera !== false ? 'checked' : ''}>Show camera during a cleaning session</label></div>
      <p class="notice">Turning this off removes the map and stops image requests from this card.</p>
      ${field('camera_entity', 'Map camera', 'camera')}
      <label>Map rotation<select data-key="camera_rotation" data-focus="camera-rotation">${[0, 90, 180, 270].map(deg => `<option value="${deg}" ${(config.camera_rotation ?? 0) === deg ? 'selected' : ''}>${deg}°</option>`).join('')}</select></label>
      <h3>Rooms in this card</h3><p>Choose which rooms to show. Arrows change the display order, not the robot cleaning order.</p>
      ${this.model.rooms.map((r, i) => `<div class="entry"><label><input type="checkbox" data-focus="include-${i}" data-include="${h(r.entity)}" ${!r.excluded ? 'checked' : ''} ${!r.entity ? 'disabled' : ''}>${h(r.name)}</label><button data-order="${h(r.entity)}" data-direction="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move ${h(r.name)} up">↑</button><button data-order="${h(r.entity)}" data-direction="1" ${i === this.model.rooms.length - 1 ? 'disabled' : ''} aria-label="Move ${h(r.name)} down">↓</button></div>`).join('')}
      <p class="notice">Rooms disabled in Home Assistant are not offered. New rooms appear automatically.</p><p class="notice error">${h(this.registryError || this.model.issues.join(' '))}</p>`);
  }
}
if (!customElements.get('dyson-cleaning-planner-card-editor')) customElements.define('dyson-cleaning-planner-card-editor', DysonCleaningPlannerEditor);
