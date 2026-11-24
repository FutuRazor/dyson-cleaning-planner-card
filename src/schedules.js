import { escapeHtml, ROOM_FIELDS } from './shared.js';
import { uiMessage } from './localize.js';

const weekdays = ['mon','tue','wed','thu','fri','sat','sun'];
export const scheduleStyles = `
.actions.with-schedules{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);flex-direction:row}
.room-secondary-actions{display:flex;gap:8px;min-width:0}.actions .schedule-create{flex:0 0 38px;padding:6px;display:flex;align-items:center;justify-content:center}
.room-secondary-actions button{min-width:0}.schedule-create ha-icon{--mdc-icon-size:22px}
.schedules{padding:0 var(--dp-padding,24px) 18px}.schedule-row{display:flex;gap:10px;align-items:center;padding:14px 0;border-bottom:1px solid var(--dp-line)}
.schedule-copy{flex:1;min-width:0}.schedule-copy strong{font-size:18px}.schedule-copy p{margin:4px 0 0;font-size:13px;color:var(--dp-muted);overflow-wrap:anywhere}
.schedule-row button{padding:7px;display:flex;align-items:center;justify-content:center}.schedule-row input{flex:0 0 auto}
.schedule-controls{display:flex;align-items:center;gap:10px;flex-shrink:0}.schedule-buttons{display:flex;flex-direction:column;gap:6px}
.schedule-list{overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable}
.schedule-delete{color:var(--error-color,#b3261e)}.schedule-dialog .schedule-delete-confirm{background:var(--error-color,#b3261e);border-color:transparent;color:var(--text-primary-color,#fff)}
.schedule-row input[type=checkbox]{appearance:none;width:36px;height:22px;margin:0;position:relative;border:1px solid var(--dp-line);border-radius:20px;background:var(--dp-soft);cursor:pointer}
.schedule-row input[type=checkbox]::before{content:'';position:absolute;left:2px;top:2px;width:16px;height:16px;border-radius:50%;background:var(--dp-muted)}
.schedule-row input[type=checkbox]:checked{background:var(--dp-accent);border-color:var(--dp-accent)}.schedule-row input[type=checkbox]:checked::before{transform:translateX(14px);background:var(--text-primary-color,#fff)}
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
.schedule-room-list{list-style:none;margin:8px 0;padding:0}.schedule-plan-room{border:1px solid var(--dp-line);border-radius:10px;padding:8px;margin-top:8px;min-width:0}
.schedule-room-bar{display:flex;align-items:center;gap:4px}.schedule-room-bar button{padding:6px;min-width:32px}.schedule-room-bar .schedule-room-summary{flex:1;min-width:0;text-align:left;overflow-wrap:anywhere;background:transparent;border:0}
.schedule-room-summary strong,.schedule-room-summary small{display:block}.schedule-room-summary small{font-size:12px;font-weight:normal;color:var(--dp-muted);margin-top:4px}
.schedule-room-fields{display:grid;gap:8px;margin-top:10px}.schedule-room-fields label{display:grid;gap:4px;font-size:13px}.schedule-dialog select{box-sizing:border-box;min-width:0;width:100%;max-width:100%;padding:8px;border:1px solid var(--dp-line);border-radius:8px;background:var(--dp-bg);color:var(--dp-text);font:inherit}
.schedule-room-add{display:grid;gap:6px;font-size:13px;margin-top:12px}.schedule-room-heading{font-size:14px;margin:16px 0 8px}
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
      const mode = settings.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode;
      const values = Object.fromEntries(Object.entries(settings).filter(([key]) => this.scheduleSettingVisible(key,mode)));
      return Object.keys(values).length ? [[id,values]] : [];
    }));
    return plan;
  },
  scheduleRoomsHtml() {
    const dialog = this.scheduleDialog;
    if (!dialog.roomPlan) return '';
    const options = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule);
    const disabled = !!this.scheduleSending || !this.getScheduleState().writable || !options;
    const rows = dialog.roomPlan.roomIds.map((id,index) => {
      const room = options?.find(room => room.roomId === id);
      const name = dialog.roomNames[id] ?? room?.name ?? id;
      const settings = dialog.roomPlan.settings[id] ?? {};
      const saved = dialog.schedule.roomSettings?.[id] ?? {};
      const values = {...saved,...settings};
      const summary = Object.keys(ROOM_FIELDS).flatMap(key => values[key] && this.scheduleSettingVisible(key,values.cleaning_mode) ? [this.t(values[key])] : []).join(' · ') || this.t('Stored settings not reported');
      const open = dialog.expandedRoom === id;
      return `<li class="schedule-plan-room"><div class="schedule-room-bar"><button class="schedule-room-summary" data-schedule-room="${id}" data-schedule-room-action="expand" data-focus="schedule-room-${id}" aria-expanded="${open}" aria-controls="schedule-room-fields-${id}" ${disabled || !room ? 'disabled' : ''}><strong>${escapeHtml(name)}</strong><small>${escapeHtml(summary)}</small></button>
        ${[['up','mdi:arrow-up','Move room up',index === 0],['down','mdi:arrow-down','Move room down',index === dialog.roomPlan.roomIds.length-1],['remove','mdi:close','Remove room',false]].map(([action,icon,label,blocked]) => `<button data-schedule-room="${id}" data-schedule-room-action="${action}" data-focus="schedule-room-${id}-${action}" aria-label="${this.ht(label)}: ${escapeHtml(name)}" ${disabled || blocked ? 'disabled' : ''}><ha-icon icon="${icon}" aria-hidden="true"></ha-icon></button>`).join('')}</div>
        <div class="schedule-room-fields" id="schedule-room-fields-${id}" ${open ? '' : 'hidden'}>${Object.entries(ROOM_FIELDS).flatMap(([key,label]) => {
          const field = room?.settings?.[key];
          if (!field?.options?.length || !this.scheduleSettingVisible(key,values.cleaning_mode)) return [];
          const current = values[key] ?? '';
          return `<label><span>${this.ht(label)}</span><select data-schedule-room-setting="${key}" data-schedule-room="${id}" data-focus="schedule-room-${id}-${key}" ${disabled || !field.available ? 'disabled' : ''}><option value="" ${!current ? 'selected' : ''}>${this.ht('Keep stored setting')}</option>${current && !field.options.includes(current) ? `<option value="${escapeHtml(current)}" selected disabled>${this.ht(current)}</option>` : ''}${field.options.map(value => `<option value="${escapeHtml(value)}" ${current === value ? 'selected' : ''}>${this.ht(value)}</option>`).join('')}</select></label>`;
        }).join('')}</div></li>`;
    }).join('');
    const remaining = (options ?? []).filter(room => !dialog.roomPlan.roomIds.includes(room.roomId));
    const incomplete = dialog.roomPlan.roomIds.some(id => Object.keys(ROOM_FIELDS).some(key =>
      this.scheduleSettingVisible(key,dialog.roomPlan.settings[id]?.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode)
        && !dialog.schedule.roomSettings?.[id]?.[key]));
    return `<h4 class="schedule-room-heading">${this.ht('Rooms and cleaning settings')}</h4>${incomplete ? `<p class="schedule-note">${this.ht('Some stored settings are not reported. Unchanged settings will be preserved.')}</p>` : ''}
      ${!options ? `<p class="schedule-note schedule-warning">${this.ht('Room editing requires the schedule map to be active. You can still change weekdays and time.')}</p>` : ''}
      <ol class="schedule-room-list">${rows}</ol><label class="schedule-room-add"><span>${this.ht('Add room')}</span><select data-schedule-room-add data-focus="schedule-room-add" ${disabled || !remaining.length ? 'disabled' : ''}><option value="">${this.ht('Choose room')}</option>${remaining.map(room => `<option value="${escapeHtml(room.roomId)}">${escapeHtml(room.name)}</option>`).join('')}</select></label>`;
  },
  scheduleRoomAction(action, id) {
    const dialog = this.scheduleDialog, plan = dialog?.roomPlan;
    if (!plan || this.scheduleSending || !this.getScheduleState().writable) return;
    const options = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule);
    if (!options) return;
    const index = plan.roomIds.indexOf(id);
    if (index < 0) return;
    let focus = `schedule-room-${id}-${action}`;
    if (action === 'expand') { dialog.expandedRoom = dialog.expandedRoom === id ? null : id; focus = `schedule-room-${id}`; }
    else if (action === 'remove') {
      plan.roomIds.splice(index,1); delete plan.settings[id]; dialog.roomsChanged = true;
      focus = plan.roomIds[index] || plan.roomIds[index-1]; focus = focus ? `schedule-room-${focus}` : 'schedule-room-add';
    } else {
      const next = index + (action === 'up' ? -1 : 1);
      if (!['up','down'].includes(action) || next < 0 || next >= plan.roomIds.length) return;
      [plan.roomIds[index],plan.roomIds[next]] = [plan.roomIds[next],plan.roomIds[index]]; dialog.roomsChanged = true;
    }
    this.updateSchedulePlanChanged(); dialog.error = ''; this.render();
    (this.shadowRoot.querySelector(`[data-focus="${focus}"]:not(:disabled)`)
      ?? this.shadowRoot.querySelector(`[data-focus="schedule-room-${id}"]:not(:disabled)`)
      ?? this.shadowRoot.querySelector('[data-schedule-room-add]:not(:disabled)'))?.focus({preventScroll:true});
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
    return `<div class="schedule-overlay"><section class="schedule-dialog" role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title" tabindex="-1">
      <header><h3 id="schedule-dialog-title">${this.ht(dialog.id === undefined ? 'Create schedule' : 'Edit schedule')}</h3><button data-schedule-action="close" data-focus="schedule-close" aria-label="${this.ht('Close')}" ${this.scheduleSending ? 'disabled' : ''}><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></header>
      ${dialog.id === undefined && state.creationUsesStoredRooms ? `<p class="schedule-note schedule-warning">${this.ht("The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.")}</p>` : ''}
      ${dialog.id === undefined && state.creationUsesSelectedRooms ? `<p class="schedule-note">${this.ht('Selected rooms: {rooms}', {rooms:dialog.rooms.join(', ')})}</p>` : ''}
      <fieldset ${this.scheduleSending ? 'disabled' : ''}><legend>${this.ht('Weekdays')}</legend><div class="schedule-days">${weekdays.map(day => `<label><span>${escapeHtml(this.scheduleDaysText([day]))}</span><input type="checkbox" data-schedule-day="${day}" data-focus="schedule-${day}" ${dialog.days.includes(day) ? 'checked' : ''}></label>`).join('')}</div></fieldset>
      <div class="schedule-time"><span id="schedule-start-time-label">${this.ht('Start time')}</span><button data-schedule-time data-schedule-action="time-open" data-focus="schedule-time" aria-labelledby="schedule-start-time-label schedule-time-value" aria-expanded="${!!dialog.timePicker}" aria-controls="schedule-time-selection" ${this.scheduleSending ? 'disabled' : ''}><span id="schedule-time-value">${dialog.time ? escapeHtml(dialog.time) : this.ht('Choose time')}</span><ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon></button></div>
      <div id="schedule-time-selection">${this.scheduleTimePickerHtml()}</div>
      <p class="schedule-note">${this.ht('Times use the Home Assistant time zone: {zone}.', {zone:this._hass.config?.time_zone ?? this.t('Unavailable')})}</p>
      ${this.scheduleRoomsHtml()}
      <p class="schedule-note error schedule-dialog-message" role="status" aria-live="polite">${this.ht(dialog.error ?? '')}</p>
      <div class="actions"><button data-schedule-action="close" data-focus="schedule-cancel" ${this.scheduleSending ? 'disabled' : ''}>${this.ht('Cancel')}</button><button class="start" data-schedule-action="confirm" data-focus="schedule-confirm">${this.ht(this.scheduleSending ? 'Sending schedule …' : dialog.id === undefined ? 'Create schedule' : 'Save schedule')}</button></div>
    </section></div>`;
  },
  updateScheduleDialog() {
    this.shadowRoot.querySelector('.planner-content')?.toggleAttribute('inert', !!this.scheduleDialog || !!this.consumablesOpen);
    const confirm = this.shadowRoot.querySelector('[data-schedule-action="confirm"]');
    if (confirm) confirm.disabled = !!this._previewDialog || !!this.scheduleSending || !this.getScheduleState().writable
      || (this.scheduleDialog.mode === 'delete' ? !this.getScheduleState().deleteSupported
        : !!this.scheduleDialog.timePicker || !this.scheduleDialog.days.length || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleDialog.time)
          || (this.scheduleDialog.roomsChanged && (!this.scheduleDialog.roomPlan.roomIds.length || !this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,this.scheduleDialog.schedule))));
    this.updateScheduleTimePicker();
    const panel = this.shadowRoot.querySelector('.schedule-dialog');
    if (panel && (this.scheduleSending || !panel.contains(this.shadowRoot.activeElement))) {
      (panel.querySelector('button:not(:disabled)') ?? panel).focus({preventScroll:true});
    }
  },
  scheduleInput(event) {
    const dialog = this.scheduleDialog, el = event.target;
    if (!dialog || this.scheduleSending) return;
    if (el.dataset.scheduleDay) dialog.days = weekdays.filter(d => d === el.dataset.scheduleDay ? el.checked : dialog.days.includes(d));
    else if (el.matches('[data-schedule-room-add], [data-schedule-room-setting]')) {
      const options = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule);
      const id = el.dataset.scheduleRoom ?? el.value, room = options?.find(room => room.roomId === id);
      if (!this.getScheduleState().writable || !room || !dialog.roomPlan) return;
      if (el.hasAttribute('data-schedule-room-add')) {
        if (dialog.roomPlan.roomIds.includes(id)) return;
        dialog.roomPlan.roomIds.push(id); dialog.roomNames[id] = room.name;
      } else {
        const key = el.dataset.scheduleRoomSetting;
        if (!dialog.roomPlan.roomIds.includes(id) || !room.settings[key]?.available || (el.value && !room.settings[key].options.includes(el.value))) return;
        if (el.value && el.value !== dialog.schedule.roomSettings?.[id]?.[key]) (dialog.roomPlan.settings[id] ??= {})[key] = el.value;
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
    this.scheduleDialog = { id, mode, days:schedule ? [...schedule.days] : [], time:schedule?.time ?? '',
      selected:[...this.selected], rooms:this.selected.map(entity => this.model.rooms.find(room => room.entity === entity)?.name ?? entity),
      draft:structuredClone(this.settingDraft), context:this.adapter.roomContext(this._hass,this.config.entity,this.registry), config:this.config };
    if (schedule?.roomIds && this.adapter.scheduleRoomOptions) {
      Object.assign(this.scheduleDialog, {schedule:structuredClone(schedule), roomPlan:{roomIds:[...schedule.roomIds],settings:{}},
        roomNames:Object.fromEntries(schedule.roomIds.map((roomId,index) => [roomId,schedule.rooms[index]])), roomsChanged:false});
    }
    this.render();
    this.shadowRoot.querySelector(mode === 'delete' ? '[data-focus="schedule-cancel"]' : '[data-focus="schedule-mon"]')?.focus({preventScroll:true});
  },
  closeSchedule() {
    if (this.scheduleSending) return;
    const id = this.scheduleDialog?.id, deleting = this.scheduleDialog?.mode === 'delete';
    this.scheduleDialog = null; this.render();
    this.shadowRoot.querySelector(id === undefined ? '[data-action="schedule-create"]' : `[data-schedule-${deleting ? 'delete' : 'edit'}="${id}"]`)?.focus({preventScroll:true});
  },
  scheduleKeydown(event) {
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
    if (event.target.classList?.contains('schedule-overlay')) { this.closeSchedule(); return true; }
    const el = event.target.closest('button');
    if (el?.dataset.scheduleRoomAction) { if (!el.disabled) this.scheduleRoomAction(el.dataset.scheduleRoomAction,el.dataset.scheduleRoom); return true; }
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
  async submitSchedule(id, enabled) {
    if (this._previewDialog || this.busy || this.scheduleSending || this.view.active || !this.isConnected) return;
    const dialog = enabled === undefined ? this.scheduleDialog : null;
    if (!dialog && enabled === undefined) return;
    if (dialog?.timePicker || (dialog?.roomsChanged && !dialog.roomPlan.roomIds.length)) return;
    if (dialog && dialog.config !== this.config) return;
    const config = this.config, detach = this._detachRevision;
    const operation = {}; this.scheduleSending = operation;
    this.message = dialog?.mode === 'delete' ? 'Deleting schedule …' : 'Sending schedule …'; this.error = false;
    this._dismissedNotice = '';
    if (dialog) dialog.error = '';
    this.render();
    try {
      if (dialog?.mode === 'delete') await this.adapter.deleteSchedule({hass:this._hass, registry:this.registry, config, id:dialog.id});
      else await this.adapter.setSchedule({hass:this._hass, registry:this.registry, config,
        ...(dialog ? {id:dialog.id, days:[...dialog.days], time:dialog.time, selected:dialog.selected, draft:dialog.draft, context:dialog.context,
          ...(dialog.roomsChanged ? {roomPlan:this.scheduleRoomPlanPayload()} : {})} : {id, enabled})});
      if (this.config !== config || this._detachRevision !== detach || !this.isConnected) return;
      this.scheduleDialog = null;
      this.message = 'Schedule request sent. The list updates when Home Assistant reports the change.'; this.error = false;
    } catch (error) {
      if (this.config !== config || this._detachRevision !== detach || !this.isConnected) return;
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
              : dialog.id === undefined ? '[data-action="schedule-create"]' : `[data-schedule-edit="${dialog.id}"]`
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
    const height = rows.length > 4 ? `${Math.ceil(rows.slice(0,4).reduce((total,row) => total + row.getBoundingClientRect().height,0))}px` : '';
    if (list.style.maxHeight !== height) list.style.maxHeight = height;
  },
  renderSchedules(styles) {
    const state = this.getScheduleState();
    const disabled = this.scheduleSending || this._previewDialog || !state.writable;
    const previousList = this.shadowRoot.querySelector('.schedule-list');
    const scrollTop = previousList?.scrollTop ?? this.scheduleScrollTop ?? 0;
    const previousHeight = state.schedules.length > 4 ? previousList?.style.maxHeight ?? '' : '';
    const rows = state.schedules.slice().sort((a,b) => a.time.localeCompare(b.time) || a.id-b.id).map(schedule => `<section class="schedule-row">
      <div class="schedule-copy"><strong>${escapeHtml(schedule.time)}</strong><p>${escapeHtml(this.scheduleDaysText(schedule.days))}</p><p class="schedule-room-selection">${state.roomSelectionKnown ? escapeHtml(schedule.rooms.join(', ')) : this.ht('Selected rooms are not reported by this integration. Check them in MyDyson.')}</p></div>
      <div class="schedule-controls"><input type="checkbox" role="switch" data-schedule-toggle="${schedule.id}" data-focus="schedule-toggle-${schedule.id}" ${schedule.enabled ? 'checked' : ''} ${disabled ? 'disabled' : ''} aria-label="${this.ht('Enable schedule {time} ({days})', {time:schedule.time, days:this.scheduleDaysText(schedule.days)})}"><div class="schedule-buttons">
      <button data-schedule-edit="${schedule.id}" data-focus="schedule-edit-${schedule.id}" ${disabled ? 'disabled' : ''} aria-label="${this.ht('Edit schedule {time} ({days})', {time:schedule.time, days:this.scheduleDaysText(schedule.days)})}"><ha-icon icon="mdi:pencil-outline" aria-hidden="true"></ha-icon></button>
      ${state.deleteSupported ? `<button class="schedule-delete" data-schedule-delete="${schedule.id}" data-focus="schedule-delete-${schedule.id}" ${disabled ? 'disabled' : ''} aria-label="${this.ht('Delete schedule {time} ({days})', {time:schedule.time, days:this.scheduleDaysText(schedule.days)})}"><ha-icon icon="mdi:trash-can-outline" aria-hidden="true"></ha-icon></button>` : ''}</div></div></section>`).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}${this.planningTabsHtml()}<div id="planning-panel-rooms" role="tabpanel" aria-labelledby="planning-tab-rooms" hidden></div>${this.supportsZone ? '<div id="planning-panel-zones" role="tabpanel" aria-labelledby="planning-tab-zones" hidden></div>' : ''}<section id="planning-panel-schedules" role="tabpanel" aria-labelledby="planning-tab-schedules" class="schedules">
      ${!state.available ? `<p class="schedule-note">${this.ht('Schedules are unavailable. Check the robot connection and integration.')}</p>` : ''}
      ${state.inSync === false ? `<p class="schedule-note schedule-warning">${this.ht('The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.')}</p>` : ''}
      <div class="schedule-list" role="region" aria-label="${this.ht('Schedules')}" ${state.schedules.length > 4 ? 'tabindex="0"' : ''} style="max-height:${previousHeight}">${rows}</div>
      ${!rows && state.available ? `<p class="schedule-note">${this.ht('No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.')}</p>` : ''}
    </section></div>${this.consumablesHtml()}${this.scheduleOverlayHtml()}</ha-card>`, 'schedules');
    this.updateBattery(); this.updateConsumables(); this.updateStatus(''); this.updateScheduleDialog();
    this.updateScheduleListLayout();
    const list = this.shadowRoot.querySelector('.schedule-list');
    list.scrollTop = scrollTop;
    list.onscroll = () => { this.scheduleScrollTop = list.scrollTop; };
  },
};
