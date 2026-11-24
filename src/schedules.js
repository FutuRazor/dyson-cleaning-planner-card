import { escapeHtml, ROOM_FIELDS, ROOM_COLORS } from './shared.js';
import { uiMessage } from './localize.js';

const weekdays = ['mon','tue','wed','thu','fri','sat','sun'];

// A resolved service call is not yet a reflected HA state. Confirm only fields
// the selected adapter exposes, and do not guess which of several new entries is ours.
export function scheduleRequestConfirmed(state, request) {
  if (!state.available) return false;
  if (request.kind === 'delete') return !state.schedules.some(schedule => schedule.id === request.id);
  const matches = schedule => {
    if (request.enabled !== undefined && schedule.enabled !== request.enabled) return false;
    if (request.time !== undefined && schedule.time !== request.time) return false;
    if (request.days && weekdays.some(day => schedule.days.includes(day) !== request.days.includes(day))) return false;
    if (request.roomIds && (JSON.stringify(schedule.roomIds) !== JSON.stringify(request.roomIds) || schedule.mapId !== request.mapId)) return false;
    return Object.entries(request.roomSettings ?? {}).every(([id,settings]) =>
      Object.entries(settings).every(([key,value]) => schedule.roomSettings?.[id]?.[key] === value));
  };
  if (request.kind === 'create') return state.schedules.filter(schedule => !request.previousIds.includes(schedule.id) && matches(schedule)).length === 1;
  const schedule = state.schedules.find(schedule => schedule.id === request.id);
  return !!schedule && matches(schedule);
}
export const scheduleStyles = `
.actions.with-schedules{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);flex-direction:row}
.room-secondary-actions{display:flex;gap:8px;min-width:0}.actions .schedule-create{flex:0 0 38px;padding:6px;display:flex;align-items:center;justify-content:center}
.room-secondary-actions button{min-width:0}.schedule-create ha-icon{--mdc-icon-size:22px}
.schedules{padding:8px var(--dp-padding,24px) 18px;container:dyson-schedules / inline-size}
.schedule-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:18px 14px 18px 20px;border:1px solid var(--dp-line);border-radius:18px;background:var(--dp-modern-surface,var(--dp-soft));flex-shrink:0;min-width:0;box-sizing:border-box;container:dyson-schedule-row / inline-size}
.schedule-copy{min-width:0;container:dyson-schedule-copy / inline-size}.schedule-main{display:flex;align-items:center;gap:16px;min-width:0}
.schedule-time-value{font-size:30px;font-weight:700;line-height:1.2;font-variant-numeric:tabular-nums;letter-spacing:-.6px;white-space:nowrap;padding-right:16px;border-right:1px solid var(--dp-line)}
.schedule-weekdays{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;flex:1;width:100%;max-width:316px;min-width:0}
.schedule-day{display:flex;align-items:center;justify-content:center;min-height:32px;min-width:0;padding:2px;border:1px solid var(--dp-line);border-radius:8px;font-size:13px;white-space:nowrap;color:var(--dp-muted);box-sizing:border-box}
.schedule-day.selected{background:color-mix(in srgb,var(--dp-muted) 38%,var(--dp-bg));color:var(--dp-text)}
.schedule-row.enabled .schedule-day.selected{background:var(--dp-accent);border-color:var(--dp-accent);color:var(--text-primary-color,#fff)}
.schedule-room-selection{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:12px 0 0;padding:0;font-size:13px;color:var(--dp-muted);overflow-wrap:anywhere}
.schedule-room-chip{display:inline-flex;align-items:center;gap:7px;max-width:100%;padding:4px 9px;border:1px solid var(--dp-line);border-radius:9px;background:color-mix(in srgb,var(--dp-muted) 8%,transparent);color:var(--dp-text);box-sizing:border-box}
.schedule-room-chip::before{content:'';width:9px;height:9px;flex:none;border-radius:50%;background:var(--room-color)}
.schedule-room-chip span{min-width:0;overflow-wrap:anywhere}
.schedule-controls{display:flex;align-items:center;gap:1px;flex-shrink:0}.schedule-toggle-target{position:relative;display:flex;align-items:center;justify-content:center;min-width:48px;min-height:44px;cursor:pointer}
.schedule-row .schedule-toggle-target.pending input[type=checkbox]{opacity:0}.schedule-toggle-spinner{position:absolute;width:19px;height:19px;border:2px solid var(--dp-line);border-top-color:var(--dp-accent);border-radius:50%;animation:schedule-spin .7s linear infinite;pointer-events:none}
@keyframes schedule-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.schedule-toggle-spinner{animation:none;border-right-color:var(--dp-accent)}}
.schedule-row .schedule-menu-trigger{display:flex;align-items:center;justify-content:center;width:36px;min-height:44px;padding:6px;border:0;background:transparent}
.schedule-menu-trigger svg{display:block;width:24px;height:24px;fill:currentColor}
.schedule-list{display:flex;flex-direction:column;gap:12px;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable}
.schedule-menu-overlay{position:absolute;inset:0;z-index:12;border-radius:inherit}
.schedule-menu-panel{position:absolute;min-width:160px;max-width:calc(100% - 16px);padding:5px;background:var(--dp-modern-surface,var(--dp-bg));border:1px solid var(--dp-line);border-radius:12px;box-shadow:0 5px 20px #0004;box-sizing:border-box}
.schedule-menu-panel button{display:flex;align-items:center;gap:10px;width:100%;min-height:44px;padding:8px 12px;border:0;border-radius:7px;background:transparent;text-align:left}
.schedule-menu-panel button:hover,.schedule-menu-panel button:focus-visible{background:var(--dp-soft)}
@container dyson-schedules (max-width:600px){.schedule-row{padding:14px 8px 14px 14px;gap:8px;border-radius:15px}.schedule-main{gap:10px}.schedule-time-value{font-size:25px;padding-right:12px}.schedule-room-selection{margin-top:10px;font-size:12px}.schedule-room-chip{padding:4px 7px}}
@container dyson-schedule-copy (max-width:296px){.schedule-main{display:grid}.schedule-time-value{padding:0;border:0}.schedule-weekdays{gap:4px}}
@container dyson-schedule-row (max-width:389px){.schedule-controls{align-self:start;margin-top:-5px}}
.schedule-delete{color:var(--error-color,#b3261e)}.schedule-dialog .schedule-delete-confirm{background:var(--error-color,#b3261e);border-color:transparent;color:var(--text-primary-color,#fff)}
.schedule-row input[type=checkbox]{appearance:none;width:42px;height:26px;margin:0;position:relative;border:1px solid var(--dp-line);border-radius:20px;background:var(--dp-soft);cursor:pointer}
.schedule-row input[type=checkbox]::before{content:'';position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:var(--dp-muted)}
.schedule-row input[type=checkbox]:checked{background:var(--dp-accent);border-color:var(--dp-accent)}.schedule-row input[type=checkbox]:checked::before{transform:translateX(16px);background:var(--text-primary-color,#fff)}
.schedule-row input[type=checkbox]:disabled{opacity:.45;cursor:default}
.schedule-note{font-size:13px;line-height:1.5;overflow-wrap:anywhere}.schedule-warning{padding:10px;border:1px solid var(--warning-color,#b87900);border-radius:10px;background:var(--dp-soft)}
.schedule-overlay{position:absolute;inset:0;z-index:20;background:#0007;padding:12px;display:flex;align-items:flex-start;justify-content:center;overflow:auto;border-radius:var(--ha-card-border-radius,12px)}
.schedule-dialog{background:var(--dp-modern-surface,var(--dp-bg));border:1px solid var(--dp-line);border-radius:14px;padding:16px;width:100%;max-width:480px;box-sizing:border-box}
.schedule-dialog header{display:flex;align-items:center;justify-content:space-between;padding:0;gap:8px}.schedule-dialog h3{margin:0;font-size:17px}.schedule-dialog header button{padding:6px;display:flex}
.schedule-dialog fieldset{border:0;padding:0;margin:16px 0}.schedule-dialog legend{font-size:13px;margin-bottom:8px}.schedule-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
.schedule-days label{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:12px;min-width:0}.schedule-time{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px}
.schedule-time button{display:flex;align-items:center;gap:8px;min-width:0;font-variant-numeric:tabular-nums}
.schedule-time-picker{box-sizing:border-box;max-width:100%;min-width:0;margin-top:12px;padding:12px;border:1px solid var(--dp-line);border-radius:10px;background:var(--dp-bg)}
.schedule-time-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.schedule-time-column{min-width:0;font-size:13px}.schedule-time-column>span{display:block;margin-bottom:6px}
.schedule-time-options{position:relative;max-height:160px;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable;border:1px solid var(--dp-line);border-radius:8px;padding:4px}
.schedule-time-options button{display:block;width:100%;min-height:36px;padding:5px;border:0;border-radius:6px;background:transparent;font-variant-numeric:tabular-nums}
.schedule-time-options button[aria-pressed=true]{background:var(--dp-accent);color:var(--text-primary-color,#fff)}
.schedule-time-picker .actions{flex-direction:row;gap:8px}.schedule-time-picker .actions button{min-height:40px;padding:7px;font-size:13px}
.schedule-dialog .actions{display:flex;margin-top:16px}.schedule-dialog .actions button{min-width:0}.schedule-dialog [role=status]:empty{display:none}
.schedule-overlay:has(>.schedule-room-editor){padding:4px}
/* Use the same card container/breakpoint as the planner, not a narrower inner container. */
.schedule-dialog.schedule-room-editor{max-width:none}
.schedule-room-heading{font-size:14px;margin:16px 0 8px}
:host .schedule-dialog .schedule-room-list{padding:0;margin:10px 0 0;list-style:none}
:host([data-theme=modern]) .schedule-dialog .schedule-room-list{padding:0}
.schedule-room-list .pick{position:relative;flex:0 0 44px;min-width:44px;min-height:44px;justify-content:center;cursor:pointer}
.schedule-room-list .pick input{position:absolute;width:1px;height:1px;opacity:0}
.schedule-room-list .room-settings-toggle{flex:1;min-width:0;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;white-space:normal;padding:0 4px;border:0;background:transparent}
.schedule-room-summary strong,.schedule-room-summary small{display:block}.schedule-room-summary small{font-size:12px;font-weight:normal;color:var(--dp-muted);margin-top:4px}
.schedule-room-list .fields{min-width:0}.schedule-room-list .field{min-width:0}
:host([data-theme]) .schedule-dialog footer.schedule-footer{margin:16px 0 0;padding:12px 0 0}
.schedule-dialog .schedule-footer .actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:0}
`;

// Shared schedule UI. Only the selected integration adapter knows entity/service identities.
export const scheduleCardMethods = {
  getScheduleState() {
    return this.adapter.scheduleState?.(this._hass, this.registry, this.config.entity) ?? { supported:false, schedules:[] };
  },
  canOfferScheduleCreation() {
    const state = this.getScheduleState();
    return state.supported && state.createSupported !== false;
  },
  scheduleCreationReady() {
    const state = this.getScheduleState();
    return state.writable && (state.creationUsesSelectedRooms ? state.createReady && this.selected.length > 0 : !!this.model?.mapId);
  },
  scheduleDaysText(days) {
    const format = new Intl.DateTimeFormat(this.language, { weekday:'short', timeZone:'UTC' });
    return weekdays.filter(d => days.includes(d)).map(d => format.format(new Date(Date.UTC(2024,0,1 + weekdays.indexOf(d))))).join(', ');
  },
  scheduleWeekdaysHtml(schedule) {
    const short = new Intl.DateTimeFormat(this.language,{weekday:'short',timeZone:'UTC'});
    const long = new Intl.DateTimeFormat(this.language,{weekday:'long',timeZone:'UTC'});
    return `<div class="schedule-weekdays" role="img" aria-label="${escapeHtml(this.scheduleDaysText(schedule.days))}">${weekdays.map((day,index) => {
      const date = new Date(Date.UTC(2024,0,1+index));
      return `<span class="schedule-day ${schedule.days.includes(day) ? 'selected' : ''}" aria-hidden="true" title="${escapeHtml(long.format(date))}">${escapeHtml(short.format(date).replace(/\.$/,'').slice(0,2))}</span>`;
    }).join('')}</div>`;
  },
  scheduleRoomChipsHtml(schedule, state) {
    if (!state.roomSelectionKnown) return `<p class="schedule-room-selection">${this.ht('Selected rooms are not reported by this integration. Check them in MyDyson.')}</p>`;
    const rooms = this.model.rooms.filter(room => !room.excluded);
    return `<ul class="schedule-room-selection">${schedule.rooms.map((name,index) => {
      const match = rooms.findIndex(room => schedule.roomIds?.[index] ? room.roomId === schedule.roomIds[index] : room.name === name);
      const rank = match >= 0 ? match : [...name].reduce((sum,char) => sum + char.codePointAt(0),0);
      return `<li class="schedule-room-chip" style="--room-color:${ROOM_COLORS[rank % ROOM_COLORS.length]}"><span>${escapeHtml(name)}</span></li>`;
    }).join('')}</ul>`;
  },
  scheduleMenuHtml(state) {
    if (this.scheduleMenu == null || this.scheduleDialog || this.consumablesOpen || !state.writable
        || !state.schedules.some(schedule => schedule.id === this.scheduleMenu)) { this.scheduleMenu = null; return ''; }
    const id = this.scheduleMenu;
    return `<div class="schedule-menu-overlay"><div class="schedule-menu-panel" id="schedule-actions-${id}" role="menu" aria-labelledby="schedule-menu-${id}">
      <button role="menuitem" data-schedule-edit="${id}" data-focus="schedule-edit-${id}"><ha-icon icon="mdi:pencil-outline" aria-hidden="true"></ha-icon>${this.ht('Edit schedule')}</button>
      ${state.deleteSupported ? `<button role="menuitem" class="schedule-delete" data-schedule-delete="${id}" data-focus="schedule-delete-${id}"><ha-icon icon="mdi:trash-can-outline" aria-hidden="true"></ha-icon>${this.ht('Delete schedule')}</button>` : ''}
    </div></div>`;
  },
  closeScheduleMenu(focus = false) {
    const id = this.scheduleMenu; this.scheduleMenu = null;
    const overlay = this.shadowRoot.querySelector('.schedule-menu-overlay');
    if (overlay) { overlay.remove(); this._html = null; }
    const trigger = this.shadowRoot.querySelector(`[data-schedule-menu="${id}"]`);
    trigger?.setAttribute('aria-expanded','false');
    if (focus) trigger?.focus({preventScroll:true});
  },
  updateScheduleMenu() {
    const panel = this.shadowRoot.querySelector('.schedule-menu-panel');
    if (!panel) return;
    const trigger = this.shadowRoot.querySelector(`[data-schedule-menu="${this.scheduleMenu}"]`);
    if (!trigger || trigger.disabled) { this.closeScheduleMenu(); return; }
    const card = this.shadowRoot.querySelector('ha-card').getBoundingClientRect(), anchor = trigger.getBoundingClientRect();
    const list = this.shadowRoot.querySelector('.schedule-list').getBoundingClientRect();
    if (anchor.bottom <= list.top || anchor.top >= list.bottom) { this.closeScheduleMenu(); return; }
    const width = panel.offsetWidth, height = panel.offsetHeight;
    panel.style.left = `${Math.max(8,Math.min(anchor.right-card.left-width,card.width-width-8))}px`;
    const below = anchor.bottom-card.top+4;
    panel.style.top = `${Math.max(8,Math.min(below+height <= card.height-8 ? below : anchor.top-card.top-height-4,card.height-height-8))}px`;
  },
  scheduleTimePickerHtml() {
    const picker = this.scheduleDialog?.timePicker;
    if (!picker) return '';
    return `<section class="schedule-time-picker" role="group" aria-label="${this.ht('Choose time')}"><div class="schedule-time-columns">${[['hour','Hour',24],['minute','Minute',60]].map(([part,label,count]) => `<div class="schedule-time-column"><span id="schedule-time-${part}-label">${this.ht(label)}</span><div class="schedule-time-options" role="group" aria-labelledby="schedule-time-${part}-label">${Array.from({length:count},(_,value) => `<button data-schedule-time-part="${part}" data-schedule-time-value="${value}" data-focus="schedule-time-${part}-${value}" aria-pressed="${picker[part] === value}" tabindex="${picker[part] === value ? 0 : -1}">${String(value).padStart(2,'0')}</button>`).join('')}</div></div>`).join('')}</div><div class="actions"><button data-schedule-action="time-cancel" data-focus="schedule-time-cancel">${this.ht('Cancel')}</button><button class="start" data-schedule-action="time-apply" data-focus="schedule-time-apply">${this.ht('Apply time')}</button></div></section>`;
  },
  updateScheduleTimePicker() {
    const picker = this.scheduleDialog?.timePicker;
    if (!picker) return;
    for (const list of this.shadowRoot.querySelectorAll('.schedule-time-options')) {
      for (const option of list.querySelectorAll('[data-schedule-time-part]')) {
        const selected = Number(option.dataset.scheduleTimeValue) === picker[option.dataset.scheduleTimePart];
        option.setAttribute('aria-pressed', String(selected)); option.tabIndex = selected ? 0 : -1;
        option.disabled = !!this.scheduleSending;
      }
      if (!list.dataset.positioned) {
        const selected = list.querySelector('[aria-pressed="true"]');
        list.scrollTop = selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2;
        list.dataset.positioned = 'true';
      }
    }
  },
  chooseScheduleTime(part, value) {
    const picker = this.scheduleDialog?.timePicker;
    if (!picker || this.scheduleSending || !['hour','minute'].includes(part)
        || !Number.isInteger(value) || value < 0 || value >= (part === 'hour' ? 24 : 60)) return;
    picker[part] = value; this.updateScheduleTimePicker();
  },
  scheduleTimeAction(action) {
    const dialog = this.scheduleDialog;
    if (!dialog || this.scheduleSending) return;
    if (action === 'time-open') {
      const [hour,minute] = (dialog.time || '09:00').split(':').map(Number);
      dialog.timePicker = {hour,minute}; this.render();
      this.shadowRoot.querySelector(`[data-schedule-time-part="hour"][aria-pressed="true"]`)?.focus({preventScroll:true});
      this.shadowRoot.querySelector('.schedule-time-picker')?.scrollIntoView({block:'nearest'});
      return;
    }
    if (!dialog.timePicker) return;
    if (action === 'time-apply') {
      dialog.time = [dialog.timePicker.hour,dialog.timePicker.minute].map(value => String(value).padStart(2,'0')).join(':');
      dialog.error = '';
    }
    dialog.timePicker = null; this.render();
    this.shadowRoot.querySelector('[data-schedule-time]')?.focus({preventScroll:true});
  },
  scheduleDeleteOverlayHtml(dialog) {
    return `<div class="schedule-overlay"><section class="schedule-dialog" role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title" aria-describedby="schedule-delete-description" tabindex="-1">
      <header><h3 id="schedule-dialog-title">${this.ht('Delete schedule')}</h3><button data-schedule-action="close" data-focus="schedule-close" aria-label="${this.ht('Close')}" ${this.scheduleSending ? 'disabled' : ''}><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></header>
      <p class="schedule-note">${this.ht('Delete schedule {time} ({days})?', {time:dialog.time, days:this.scheduleDaysText(dialog.days)})}</p>
      <p class="schedule-note" id="schedule-delete-description">${this.ht('This removes the schedule from the robot and MyDyson.')}</p>
      <p class="schedule-note error schedule-dialog-message" role="status" aria-live="polite">${this.ht(dialog.error ?? '')}</p>
      <div class="actions"><button data-schedule-action="close" data-focus="schedule-cancel" ${this.scheduleSending ? 'disabled' : ''}>${this.ht('Cancel')}</button><button class="schedule-delete-confirm" data-schedule-action="confirm" data-focus="schedule-confirm">${this.ht(this.scheduleSending ? 'Deleting schedule …' : 'Delete schedule')}</button></div>
    </section></div>`;
  },
  scheduleSettingVisible(key, mode) {
    return this.config.always_show_all_settings || !((mode === 'Vacuum' && key === 'water_level')
      || (mode === 'Mop' && key === 'cleaning_strategy'));
  },
  scheduleRoomPlanPayload() {
    const dialog = this.scheduleDialog, plan = structuredClone(dialog.roomPlan);
    plan.settings = Object.fromEntries(Object.entries(plan.settings).flatMap(([id,settings]) => {
      if (!plan.roomIds.includes(id)) return [];
      const mode = settings.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode;
      const values = Object.fromEntries(Object.entries(settings).filter(([key]) => this.scheduleSettingVisible(key,mode)));
      return Object.keys(values).length ? [[id,values]] : [];
    }));
    return plan;
  },
  scheduleEditorRooms() {
    const dialog = this.scheduleDialog;
    const options = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule);
    const rooms = (options ?? []).filter(room => /^\d+$/.test(room.roomId)).map(room => ({...room,editable:true}));
    for (const id of dialog.schedule.roomIds) if (!rooms.some(room => room.roomId === id)) {
      rooms.push({roomId:id,name:dialog.roomNames[id] ?? id,settings:{},editable:false});
    }
    return {options,rooms};
  },
  scheduleRoomsHtml() {
    const dialog = this.scheduleDialog;
    if (!dialog.roomPlan) return '';
    const {options,rooms} = this.scheduleEditorRooms();
    const disabled = !!this.scheduleSending || !this.getScheduleState().writable || !options;
    const modern = this.config.theme === 'modern';
    const rows = rooms.map((room,index) => {
      const id = room.roomId, selected = dialog.roomPlan.roomIds.includes(id);
      const values = {...dialog.schedule.roomSettings?.[id],...dialog.roomPlan.settings[id]};
      const open = dialog.expandedRoom === id;
      const fields = Object.entries(ROOM_FIELDS).flatMap(([key,label]) => {
        const field = room.settings[key];
        const omitted = !this.scheduleSettingVisible(key,values.cleaning_mode);
        if (!field?.options?.length || (omitted && !modern)) return [];
        const current = values[key] ?? '';
        if (modern && key !== 'cleaning_mode') {
          const control = this.modernControl(key,this.t(label),room,field,current,disabled || !field.available,`schedule-${id}`,'schedule');
          return omitted ? `<div class="mode-spacer" inert aria-hidden="true">${control}</div>` : control;
        }
        return `<label class="field ${key === 'cleaning_mode' ? 'mode' : ''}"><span>${this.ht(label)}</span><select data-schedule-room-setting="${key}" data-schedule-room="${id}" data-focus="schedule-room-${id}-${key}" ${disabled || !field.available ? 'disabled' : ''}><option value="" ${!current ? 'selected' : ''}>${this.ht('Keep stored setting')}</option>${current && !field.options.includes(current) ? `<option value="${escapeHtml(current)}" selected disabled>${this.ht(current)}</option>` : ''}${field.options.map(value => `<option value="${escapeHtml(value)}" ${current === value ? 'selected' : ''}>${this.ht(value)}</option>`).join('')}</select></label>`;
      }).join('');
      const color = ROOM_COLORS[index % ROOM_COLORS.length];
      return `<section class="room ${selected ? 'selected' : ''} ${open ? 'open' : ''}" role="listitem" data-schedule-plan-room="${id}" style="--room-color:${color};--room-row:${index+1}"><div class="room-head">
        <label class="pick"><input type="checkbox" data-schedule-room-toggle="${id}" data-focus="schedule-room-select-${id}" aria-label="${this.ht('Select {name}',{name:room.name})}" ${selected ? 'checked' : ''} ${disabled || (!room.editable && !selected) ? 'disabled' : ''}><span class="selection-circle" aria-hidden="true">${selected ? dialog.roomPlan.roomIds.indexOf(id)+1 : ''}</span></label>
        <button class="room-settings-toggle schedule-room-summary" data-schedule-room="${id}" data-schedule-room-action="expand" data-focus="schedule-room-${id}" aria-expanded="${open}" aria-controls="schedule-room-fields-${id}" ${disabled || !room.editable ? 'disabled' : ''}><span class="room-settings-copy"><strong class="name">${escapeHtml(room.name)}</strong><small class="summary">${this.ht(values.cleaning_mode || 'Stored settings not reported')}</small></span><span aria-hidden="true">${open ? '&#8963;' : '&#8250;'}</span></button>
        </div><div class="fields schedule-room-fields" id="schedule-room-fields-${id}" ${open ? '' : 'hidden'}>${fields}</div></section>`;
    }).join('');
    const incomplete = dialog.roomPlan.roomIds.some(id => Object.keys(ROOM_FIELDS).some(key =>
      this.scheduleSettingVisible(key,dialog.roomPlan.settings[id]?.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode)
        && !dialog.schedule.roomSettings?.[id]?.[key]));
    return `<div class="schedule-room-area"><h4 class="schedule-room-heading">${this.ht('Rooms and cleaning settings')}</h4>${incomplete ? `<p class="schedule-note">${this.ht('Some stored settings are not reported. Unchanged settings will be preserved.')}</p>` : ''}
      ${!options ? `<p class="schedule-note schedule-warning">${this.ht('Room editing requires the schedule map to be active. You can still change weekdays and time.')}</p>` : ''}
      <div class="rooms ${modern ? 'modern-rooms' : ''} schedule-room-list" role="list" style="--room-count:${rooms.length}">${rows}</div></div>`;
  },
  scheduleRoomAction(action, id) {
    const dialog = this.scheduleDialog;
    if (!dialog?.roomPlan || this.scheduleSending || !this.getScheduleState().writable || action !== 'expand') return;
    const room = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule)?.find(room => room.roomId === id);
    if (!room) return;
    dialog.expandedRoom = dialog.expandedRoom === id ? null : id;
    this.render();
    this.shadowRoot.querySelector(`[data-focus="schedule-room-${id}"]`)?.focus({preventScroll:true});
  },
  updateSchedulePlanChanged() {
    const dialog = this.scheduleDialog;
    dialog.roomsChanged = JSON.stringify(dialog.roomPlan.roomIds) !== JSON.stringify(dialog.schedule.roomIds)
      || Object.keys(this.scheduleRoomPlanPayload().settings).length > 0;
  },
  scheduleOverlayHtml() {
    const dialog = this.scheduleDialog;
    if (!dialog) return '';
    if (dialog.mode === 'delete') return this.scheduleDeleteOverlayHtml(dialog);
    const state = this.getScheduleState();
    return `<div class="schedule-overlay"><section class="schedule-dialog ${dialog.roomPlan ? 'schedule-room-editor' : ''}" role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title" tabindex="-1">
      <header><h3 id="schedule-dialog-title">${this.ht(dialog.id === undefined ? 'Create schedule' : 'Edit schedule')}</h3><button data-schedule-action="close" data-focus="schedule-close" aria-label="${this.ht('Close')}" ${this.scheduleSending ? 'disabled' : ''}><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></header>
      ${dialog.id === undefined && state.creationUsesStoredRooms ? `<p class="schedule-note schedule-warning">${this.ht("The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.")}</p>` : ''}
      ${dialog.id === undefined && state.creationUsesSelectedRooms && !dialog.roomPlan ? `<p class="schedule-note">${this.ht('Selected rooms: {rooms}', {rooms:dialog.rooms.join(', ')})}</p>` : ''}
      <fieldset aria-label="${this.ht('Weekdays')}" ${this.scheduleSending ? 'disabled' : ''}><div class="schedule-days">${weekdays.map(day => `<label><span>${escapeHtml(this.scheduleDaysText([day]))}</span><input type="checkbox" data-schedule-day="${day}" data-focus="schedule-${day}" ${dialog.days.includes(day) ? 'checked' : ''}></label>`).join('')}</div></fieldset>
      <div class="schedule-time"><span id="schedule-start-time-label">${this.ht('Start time')}</span><button data-schedule-time data-schedule-action="time-open" data-focus="schedule-time" aria-labelledby="schedule-start-time-label schedule-time-value" aria-expanded="${!!dialog.timePicker}" aria-controls="schedule-time-selection" ${this.scheduleSending ? 'disabled' : ''}><span id="schedule-time-value">${dialog.time ? escapeHtml(dialog.time) : this.ht('Choose time')}</span><ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon></button></div>
      <div id="schedule-time-selection">${this.scheduleTimePickerHtml()}</div>
      <p class="schedule-note">${this.ht('Times use the Home Assistant time zone: {zone}.', {zone:this._hass.config?.time_zone ?? this.t('Unavailable')})}</p>
      ${this.scheduleRoomsHtml()}
      <p class="schedule-note error schedule-dialog-message" role="status" aria-live="polite">${this.ht(dialog.error ?? '')}</p>
      <footer class="schedule-footer"><div class="actions"><button data-schedule-action="close" data-focus="schedule-cancel" ${this.scheduleSending ? 'disabled' : ''}>${this.ht('Discard')}</button><button class="start" data-schedule-action="confirm" data-focus="schedule-confirm">${this.ht(this.scheduleSending ? 'Sending schedule …' : dialog.id === undefined ? 'Create schedule' : 'Save schedule')}</button></div></footer>
    </section></div>`;
  },
  updateScheduleDialog() {
    this.shadowRoot.querySelector('.planner-content')?.toggleAttribute('inert', !!this.scheduleDialog || !!this.consumablesOpen);
    const confirm = this.shadowRoot.querySelector('[data-schedule-action="confirm"]');
    if (confirm) confirm.disabled = !!this._previewDialog || !!this.scheduleSending || !this.getScheduleState().writable
      || (this.scheduleDialog.mode === 'delete' ? !this.getScheduleState().deleteSupported
        : !!this.scheduleDialog.timePicker || !this.scheduleDialog.days.length || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleDialog.time)
          || (this.scheduleDialog.roomPlan && !this.scheduleDialog.roomPlan.roomIds.length)
          || ((this.scheduleDialog.roomsChanged || this.scheduleDialog.id === undefined) && this.scheduleDialog.roomPlan && !this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,this.scheduleDialog.schedule)));
    this.updateScheduleTimePicker();
    if (this.scheduleDialog?.roomPlan) this.positionModernPointer();
    const panel = this.shadowRoot.querySelector('.schedule-dialog');
    if (panel && (this.scheduleSending || !panel.contains(this.shadowRoot.activeElement))) {
      (panel.querySelector('button:not(:disabled)') ?? panel).focus({preventScroll:true});
    }
  },
  scheduleInput(event) {
    const dialog = this.scheduleDialog, el = event.target;
    if (!dialog || this.scheduleSending) return;
    // Keep the native slider mounted until the drag is committed, as in the planner.
    if (event.type === 'input' && el.type === 'range') return;
    if (el.dataset.scheduleDay) dialog.days = weekdays.filter(d => d === el.dataset.scheduleDay ? el.checked : dialog.days.includes(d));
    else if (el.matches('[data-schedule-room-toggle], [data-schedule-room-setting]')) {
      const options = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule);
      const id = el.dataset.scheduleRoomToggle ?? el.dataset.scheduleRoom, room = options?.find(room => room.roomId === id);
      if (!this.getScheduleState().writable || !options || !dialog.roomPlan) return;
      if (el.hasAttribute('data-schedule-room-toggle')) {
        if (el.checked && (!room || dialog.roomPlan.roomIds.includes(id))) return;
        dialog.roomPlan.roomIds = dialog.roomPlan.roomIds.filter(roomId => roomId !== id);
        if (el.checked) { dialog.roomPlan.roomIds.push(id); dialog.roomNames[id] = room.name; }
      } else {
        const key = el.dataset.scheduleRoomSetting;
        const field = room?.settings[key];
        const value = el.dataset.option ?? (el.type === 'range' ? field?.options[Number(el.value)] : el.value);
        if (!field?.available || !this.scheduleSettingVisible(key,dialog.roomPlan.settings[id]?.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode) || (value && !field.options.includes(value))) return;
        if (value && value !== dialog.schedule.roomSettings?.[id]?.[key]) (dialog.roomPlan.settings[id] ??= {})[key] = value;
        else { delete dialog.roomPlan.settings[id]?.[key]; if (!Object.keys(dialog.roomPlan.settings[id] ?? {}).length) delete dialog.roomPlan.settings[id]; }
      }
      this.updateSchedulePlanChanged(); dialog.error = ''; this.render(); return;
    } else return;
    dialog.error = '';
    const message = this.shadowRoot.querySelector('.schedule-dialog-message');
    if (message) message.textContent = '';
    this.updateScheduleDialog();
  },
  openSchedule(id, mode = 'edit') {
    if (this._previewDialog || this.busy || this.scheduleSending || this.view.active || !this.isConnected) return;
    const state = this.getScheduleState(), schedule = state.schedules.find(s => s.id === id);
    if (!state.writable || (id !== undefined && !schedule) || (mode === 'delete' && (!schedule || !state.deleteSupported))) return;
    if (id === undefined && !this.scheduleCreationReady()) return;
    this.closeScheduleMenu();
    this.scheduleDialog = { id, mode, days:schedule ? [...schedule.days] : [], time:schedule?.time ?? '',
      selected:[...this.selected], rooms:this.selected.map(entity => this.model.rooms.find(room => room.entity === entity)?.name ?? entity),
      draft:structuredClone(this.settingDraft), context:this.adapter.roomContext(this._hass,this.config.entity,this.registry), config:this.config };
    if (schedule?.roomIds && this.adapter.scheduleRoomOptions) {
      Object.assign(this.scheduleDialog, {schedule:structuredClone(schedule), roomPlan:{roomIds:[...schedule.roomIds],settings:{}},
        roomNames:Object.fromEntries(schedule.roomIds.map((roomId,index) => [roomId,schedule.rooms[index]])), roomsChanged:false});
    } else if (id === undefined && state.creationUsesSelectedRooms && this.adapter.scheduleRoomOptions) {
      const rooms = this.model.rooms.filter(room => room.roomId);
      const roomIds = this.selected.map(entity => rooms.find(room => room.entity === entity)?.roomId).filter(Boolean);
      Object.assign(this.scheduleDialog, {schedule:{roomIds:[...roomIds],mapId:String(this.adapter.mapId(this._hass,this.config.entity)),
        roomSettings:Object.fromEntries(rooms.map(room => [room.roomId,Object.fromEntries(Object.entries(room.settings).flatMap(([key,field]) => field.options.includes(field.value) ? [[key,field.value]] : []))]))},
        roomPlan:{roomIds,settings:structuredClone(this.settingDraft)},roomNames:Object.fromEntries(rooms.map(room => [room.roomId,room.name])),
        roomEntities:Object.fromEntries(rooms.map(room => [room.roomId,room.entity])),roomsChanged:false});
    }
    this.render();
    this.shadowRoot.querySelector(mode === 'delete' ? '[data-focus="schedule-cancel"]' : '[data-focus="schedule-mon"]')?.focus({preventScroll:true});
  },
  closeSchedule() {
    if (this.scheduleSending) return;
    const id = this.scheduleDialog?.id;
    this.scheduleDialog = null; this.render();
    this.shadowRoot.querySelector(id === undefined ? '[data-action="schedule-create"]' : `[data-schedule-menu="${id}"]`)?.focus({preventScroll:true});
  },
  scheduleKeydown(event) {
    const menuTrigger = event.target.closest('[data-schedule-menu]');
    if (menuTrigger && !menuTrigger.disabled && ['ArrowDown','ArrowUp'].includes(event.key)) {
      event.preventDefault();
      if (this.scheduleMenu == null) menuTrigger.click();
      const items = this.shadowRoot.querySelectorAll('.schedule-menu-panel button');
      (event.key === 'ArrowUp' ? items[items.length-1] : items[0])?.focus({preventScroll:true});
      return true;
    }
    if (this.scheduleMenu != null) {
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); }
        this.closeScheduleMenu(true); return true;
      }
      if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        const items = [...this.shadowRoot.querySelectorAll('.schedule-menu-panel button')];
        const index = items.indexOf(this.shadowRoot.activeElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length-1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus(); return true;
      }
    }
    if (!this.scheduleDialog) return false;
    const option = event.target.closest('[data-schedule-time-part]');
    if (option && ['ArrowUp','ArrowDown','Home','End'].includes(event.key)) {
      event.preventDefault();
      const part = option.dataset.scheduleTimePart, count = part === 'hour' ? 24 : 60;
      const value = event.key === 'Home' ? 0 : event.key === 'End' ? count-1
        : (Number(option.dataset.scheduleTimeValue) + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
      this.chooseScheduleTime(part,value);
      const next = this.shadowRoot.querySelector(`[data-schedule-time-part="${part}"][data-schedule-time-value="${value}"]`);
      next.focus({preventScroll:true}); next.scrollIntoView({block:'nearest'});
    }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.scheduleDialog.timePicker ? this.scheduleTimeAction('time-cancel') : this.closeSchedule(); }
    if (event.key === 'Tab') {
      const items = [...this.shadowRoot.querySelectorAll('.schedule-dialog button:not(:disabled), .schedule-dialog input:not(:disabled), .schedule-dialog select:not(:disabled)')].filter(el => el.tabIndex >= 0 && !el.closest('fieldset:disabled') && el.getClientRects().length);
      const active = this.shadowRoot.activeElement;
      if (!items.length) { event.preventDefault(); this.shadowRoot.querySelector('.schedule-dialog')?.focus(); }
      else if (event.shiftKey && active === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && active === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
    }
    return true;
  },
  scheduleClick(event) {
    if (event.target.classList?.contains('schedule-menu-overlay')) { this.closeScheduleMenu(true); return true; }
    if (event.target.classList?.contains('schedule-overlay')) { this.closeSchedule(); return true; }
    const el = event.target.closest('button');
    if (el?.dataset.scheduleMenu !== undefined) {
      if (!el.disabled) {
        const id = Number(el.dataset.scheduleMenu);
        if (this.scheduleMenu === id) this.closeScheduleMenu(true);
        else { this.scheduleMenu = id; this.render(); this.shadowRoot.querySelector('.schedule-menu-panel button')?.focus({preventScroll:true}); }
      }
      return true;
    }
    if (el?.dataset.scheduleRoomAction) { if (!el.disabled) this.scheduleRoomAction(el.dataset.scheduleRoomAction,el.dataset.scheduleRoom); return true; }
    if (el?.dataset.scheduleRoomSetting && el.dataset.option !== undefined) { if (!el.disabled) this.scheduleInput({target:el}); return true; }
    if (el?.dataset.scheduleTimePart) {
      if (!el.disabled) this.chooseScheduleTime(el.dataset.scheduleTimePart, Number(el.dataset.scheduleTimeValue));
      return true;
    }
    if (el?.dataset.scheduleAction) {
      if (!el.disabled) {
        if (el.dataset.scheduleAction.startsWith('time-')) this.scheduleTimeAction(el.dataset.scheduleAction);
        else el.dataset.scheduleAction === 'confirm' ? this.submitSchedule() : this.closeSchedule();
      }
      return true;
    }
    if (this.scheduleDialog) return true;
    if (el?.dataset.action === 'schedule-create') { if (!el.disabled) this.openSchedule(); return true; }
    if (el?.dataset.scheduleEdit !== undefined) { if (!el.disabled) this.openSchedule(Number(el.dataset.scheduleEdit)); return true; }
    if (el?.dataset.scheduleDelete !== undefined) { if (!el.disabled) this.openSchedule(Number(el.dataset.scheduleDelete),'delete'); return true; }
    return false;
  },
  clearScheduleNotice(clearMessage = false) {
    clearTimeout(this._scheduleNoticeTimer); this._scheduleNoticeTimer = null;
    if (clearMessage && this.message === this._scheduleNotice) this.message = '';
    this._scheduleNotice = null;
  },
  showScheduleSuccess(kind) {
    if (kind === 'toggle') return;
    this.clearScheduleNotice();
    const notice = uiMessage(kind === 'create' ? 'Schedule created.' : kind === 'delete' ? 'Schedule deleted.' : 'Schedule saved.');
    this._scheduleNotice = notice; this.message = notice; this.error = false; this._dismissedNotice = '';
    this._scheduleNoticeTimer = setTimeout(() => {
      if (this._scheduleNotice !== notice) return;
      this._scheduleNoticeTimer = null; this._scheduleNotice = null;
      if (this.message === notice) { this.message = ''; if (this.isConnected) this.updateHeaderNotice(); }
    },3000);
    this.updateHeaderNotice();
  },
  cancelScheduleFeedback() {
    this.clearScheduleNotice(true);
    const operation = this.scheduleSending;
    if (operation) { operation.cancelled = true; operation.confirm?.('cancelled'); }
    this._scheduleConfirmation = null; this._scheduleUnconfirmed = null;
  },
  reconcileScheduleConfirmation() {
    const operation = this._scheduleConfirmation;
    if (operation && !operation.cancelled && scheduleRequestConfirmed(this.getScheduleState(),operation.request)) operation.confirm?.('confirmed');
    const late = this._scheduleUnconfirmed;
    if (late && this.config === late.config && this._detachRevision === late.detach
        && this.message === late.notice && scheduleRequestConfirmed(this.getScheduleState(),late.request)) {
      this._scheduleUnconfirmed = null; this.message = ''; this.error = false;
      this.showScheduleSuccess(late.request.kind);
    }
  },
  waitForScheduleConfirmation(operation) {
    if (scheduleRequestConfirmed(this.getScheduleState(),operation.request)) return Promise.resolve('confirmed');
    return new Promise(resolve => {
      this._scheduleConfirmation = operation;
      operation.confirm = result => {
        clearTimeout(operation.confirmTimer); operation.confirm = null;
        if (this._scheduleConfirmation === operation) this._scheduleConfirmation = null;
        resolve(result);
      };
      operation.confirmTimer = setTimeout(() => operation.confirm?.('timeout'),10000);
    });
  },
  async submitSchedule(id, enabled) {
    if (this._previewDialog || this.busy || this.scheduleSending || this.view.active || !this.isConnected) return;
    const dialog = enabled === undefined ? this.scheduleDialog : null;
    if (!dialog && enabled === undefined) return;
    if (dialog?.mode !== 'delete' && (dialog?.timePicker || (dialog?.roomPlan && !dialog.roomPlan.roomIds.length))) return;
    if (dialog && dialog.config !== this.config) return;
    const config = this.config, detach = this._detachRevision, state = this.getScheduleState();
    const request = {kind:!dialog ? 'toggle' : dialog.mode === 'delete' ? 'delete' : dialog.id === undefined ? 'create' : 'edit',id:dialog?.id ?? id};
    if (!dialog) request.enabled = enabled;
    else if (request.kind !== 'delete') {
      request.days = [...dialog.days]; request.time = dialog.time;
      if (request.kind === 'create') { request.previousIds = state.schedules.map(schedule => schedule.id); request.enabled = true; }
      if (dialog.roomPlan && (dialog.roomsChanged || request.kind === 'create') && state.roomSelectionKnown) {
        const plan = this.scheduleRoomPlanPayload();
        request.roomIds = plan.roomIds; request.roomSettings = plan.settings; request.mapId = dialog.schedule.mapId;
      }
    }
    this.clearScheduleNotice(); this._scheduleUnconfirmed = null;
    const operation = {request,config,detach}; this.scheduleSending = operation;
    const current = () => this.config === config && this._detachRevision === detach && this.isConnected && !operation.cancelled;
    this.message = dialog ? uiMessage(request.kind === 'delete' ? 'Deleting schedule …' : 'Saving schedule …') : ''; this.error = false;
    this._dismissedNotice = '';
    if (dialog) dialog.error = '';
    this.render();
    try {
      if (dialog?.mode === 'delete') await this.adapter.deleteSchedule({hass:this._hass, registry:this.registry, config, id:dialog.id});
      else await this.adapter.setSchedule({hass:this._hass, registry:this.registry, config,
        ...(dialog ? {id:dialog.id, days:[...dialog.days], time:dialog.time,
          selected:dialog.id === undefined && dialog.roomPlan ? dialog.roomPlan.roomIds.map(roomId => dialog.roomEntities[roomId]) : dialog.selected,
          draft:dialog.id === undefined && dialog.roomPlan ? this.scheduleRoomPlanPayload().settings : dialog.draft, context:dialog.context,
          ...(dialog.roomsChanged ? {roomPlan:this.scheduleRoomPlanPayload()} : {})} : {id, enabled})});
      if (!current()) return;
      this.scheduleDialog = null;
      this.render();
      const result = await this.waitForScheduleConfirmation(operation);
      if (!current() || result === 'cancelled') return;
      if (result === 'confirmed') this.showScheduleSuccess(request.kind);
      else {
        const notice = uiMessage('The change has not been confirmed by Home Assistant. Check the schedule in MyDyson before trying again.');
        this._scheduleUnconfirmed = {request,config,detach,notice};
        this.message = notice; this.error = true;
      }
    } catch (error) {
      if (!current()) return;
      const message = uiMessage('Schedule request failed. Check the schedule in MyDyson before trying again. {error}', {error});
      if (dialog) dialog.error = message;
      this.message = message; this.error = true;
    } finally {
      if (this.scheduleSending === operation) {
        this.scheduleSending = null;
        if (this.isConnected && this.config === config && this._detachRevision === detach) {
          this.render();
          if (!this.scheduleDialog) {
            const target = dialog ? dialog.mode === 'delete' ? '.planning-tabs [aria-selected="true"]'
              : dialog.id === undefined ? '[data-action="schedule-create"]' : `[data-schedule-menu="${dialog.id}"]`
              : `[data-schedule-toggle="${id}"]`;
            this.shadowRoot.querySelector(target)?.focus({preventScroll:true});
          }
        }
      }
    }
  },
  updateScheduleListLayout() {
    const list = this.shadowRoot.querySelector('.schedule-list');
    if (!list) return;
    const rows = [...list.querySelectorAll('.schedule-row')];
    const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
    const height = rows.length > 4 ? `${Math.ceil(rows.slice(0,4).reduce((total,row) => total + row.getBoundingClientRect().height,0) + 3*gap)}px` : '';
    if (list.style.maxHeight !== height) list.style.maxHeight = height;
    this.updateScheduleMenu();
  },
  renderSchedules(styles) {
    const state = this.getScheduleState();
    const pendingToggle = this.scheduleSending?.request?.kind === 'toggle' ? this.scheduleSending.request.id : null;
    const disabled = this.scheduleSending || this._previewDialog || !state.writable;
    const previousList = this.shadowRoot.querySelector('.schedule-list');
    const scrollTop = previousList?.scrollTop ?? this.scheduleScrollTop ?? 0;
    const previousHeight = state.schedules.length > 4 ? previousList?.style.maxHeight ?? '' : '';
    const menu = this.scheduleMenuHtml(state);
    const rows = state.schedules.slice().sort((a,b) => a.time.localeCompare(b.time) || a.id-b.id).map(schedule => `<section class="schedule-row ${schedule.enabled ? 'enabled' : ''}" data-schedule-id="${schedule.id}">
      <div class="schedule-copy"><div class="schedule-main"><time class="schedule-time-value" datetime="${escapeHtml(schedule.time)}">${escapeHtml(schedule.time)}</time>${this.scheduleWeekdaysHtml(schedule)}</div>${this.scheduleRoomChipsHtml(schedule,state)}</div>
      <div class="schedule-controls"><label class="schedule-toggle-target ${pendingToggle === schedule.id ? 'pending' : ''}"><input type="checkbox" role="switch" data-schedule-toggle="${schedule.id}" data-focus="schedule-toggle-${schedule.id}" ${schedule.enabled ? 'checked' : ''} ${disabled ? 'disabled' : ''} aria-busy="${pendingToggle === schedule.id}" aria-label="${this.ht('Enable schedule {time} ({days})', {time:schedule.time, days:this.scheduleDaysText(schedule.days)})}">${pendingToggle === schedule.id ? `<span class="schedule-toggle-spinner" role="status" aria-label="${this.ht('Updating schedule …')}"></span>` : ''}</label>
      <button class="schedule-menu-trigger" id="schedule-menu-${schedule.id}" data-schedule-menu="${schedule.id}" data-focus="schedule-menu-${schedule.id}" aria-haspopup="menu" aria-expanded="${this.scheduleMenu === schedule.id}" aria-controls="schedule-actions-${schedule.id}" ${disabled ? 'disabled' : ''} aria-label="${this.ht('Schedule actions {time} ({days})', {time:schedule.time, days:this.scheduleDaysText(schedule.days)})}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg></button></div></section>`).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}${this.planningTabsHtml()}<div id="planning-panel-rooms" role="tabpanel" aria-labelledby="planning-tab-rooms" hidden></div>${this.supportsZone ? '<div id="planning-panel-zones" role="tabpanel" aria-labelledby="planning-tab-zones" hidden></div>' : ''}<section id="planning-panel-schedules" role="tabpanel" aria-labelledby="planning-tab-schedules" class="schedules">
      ${!state.available ? `<p class="schedule-note">${this.ht('Schedules are unavailable. Check the robot connection and integration.')}</p>` : ''}
      ${state.inSync === false ? `<p class="schedule-note schedule-warning">${this.ht('The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.')}</p>` : ''}
      <div class="schedule-list" role="region" aria-label="${this.ht('Schedules')}" ${state.schedules.length > 4 ? 'tabindex="0"' : ''} style="max-height:${previousHeight}">${rows}</div>
      ${!rows && state.available ? `<p class="schedule-note">${this.ht('No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.')}</p>` : ''}
    </section></div>${this.consumablesHtml()}${menu}${this.scheduleOverlayHtml()}</ha-card>`, 'schedules');
    this.updateBattery(); this.updateConsumables(); this.updateStatus(''); this.updateScheduleDialog();
    const list = this.shadowRoot.querySelector('.schedule-list');
    list.scrollTop = scrollTop;
    this.updateScheduleListLayout();
    list.onscroll = () => { this.scheduleScrollTop = list.scrollTop; this.updateScheduleMenu(); };
  },
};
