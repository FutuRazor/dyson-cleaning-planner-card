import { zoneDimensionText } from './zone-geometry.js';
import { resolveLanguage, translate, uiMessage, UiError } from './localize.js';
import { STATUS_BAR_ITEMS, available, escapeHtml, normalizeConfig } from './core.js';
import { roomKey, switchSettingConfirmed } from './shared.js';
import { getIntegrationAdapter, integrationVacuumEntries, defaultIntegrationEntity } from './integration.js';
import { scheduleStyles, scheduleCardMethods } from './schedules.js';
import { mapSelectionStyles, mapSelectionCardMethods } from './map-selection.js';
import { ROOM_COLORS } from './shared.js';

function stationIndicator(field, refillStatus, language = 'en') {
  const t = (key, params) => translate(language, key, params);
  const { key, label, value } = field;
  const refill = key === 'cleaning_solution' && refillStatus === 'refill_required';
  const unknown = !field.available;
  let icon = '', color = '', short = '', description = value;
  switch (key) {
    case 'hot_water_mopping':
    case 'hot_water_self_cleaning':
      icon = key === 'hot_water_mopping' ? 'mdi:waves' : 'mdi:water-boiler';
      color = value === 'on' ? 'active-red' : 'active-blue';
      break;
    case 'extended_roller_preparation':
      icon = 'mdi:roller-skate';
      color = value === 'on' ? 'active-blue with-plus' : 'inactive-muted';
      break;
    case 'cleaning_solution':

      icon = refill || value === 'on' ? 'mdi:bottle-tonic-plus' : 'mdi:bottle-tonic';
      color = refill ? 'alarm-red blink' : value === 'on' ? 'active-cyan' : 'inactive-muted';
      if (refill) description = 'Refill required';
      break;
    case 'self_cleaning_frequency':
      short = { 'After each room': '1R', 'Every 15 minutes': '15m', 'Every 30 minutes': '30m', 'Only as needed': 'Auto' }[value];
      if (!short) short = '\u2013';
      icon = short === '1R' ? 'mdi:door-open' : 'mdi:clock-outline';
      break;
    case 'roller_drying_duration': {
      const hours = /^([2345])\s*(?:h|hours)$/i.exec(value);
      short = hours ? hours[1] + 'h' : '\u2013';
      break;
    }
    default: return '';
  }
  if (unknown) { color = 'inactive-muted'; description = 'Unavailable'; }
  const text = escapeHtml(t(label) + ': ' + t(description));
  return `<span class="station-indicator ${color}" role="img" aria-label="${text}" title="${text}">${icon ? `<ha-icon icon="${icon}" class="status-icon" aria-hidden="true"></ha-icon>` : ''}${short ? `<span class="status-text-5g">${short}</span>` : ''}</span>`;
}

const styles = `
${scheduleStyles}
${mapSelectionStyles}
.planning-tabs{display:flex;margin:0 var(--dp-padding) 14px;border-bottom:1px solid var(--dp-line)}.planning-tabs button{flex:1;min-width:0;border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;color:var(--dp-muted);padding:9px 8px;min-height:42px;white-space:nowrap}.planning-tabs button[aria-selected=true]{color:var(--primary-text-color);border-bottom-color:var(--dp-accent)}
.planning-tab-label{position:relative;display:inline-block;white-space:nowrap}
#planning-tab-schedules .planning-tab-label:has(.schedule-count){transform:translateX(-8px)}
#planning-tab-schedules .planning-tab-label:has(.schedule-count.capped){transform:translateX(-13px)}
.schedule-count{position:absolute;inset-inline-start:calc(100% + 1px);top:-8px;display:flex;align-items:center;justify-content:center;min-width:15px;height:15px;padding:0 3px;border-radius:999px;background:var(--success-color,#2e7d32);color:#fff;font-size:10px;line-height:15px;font-weight:650;font-variant-numeric:tabular-nums;box-shadow:0 0 0 2px var(--dp-bg);pointer-events:none}
.schedule-count.is-zero{background:var(--dp-line);color:var(--dp-muted)}

.header-buttons{grid-area:1/3/3/4;display:flex;flex-direction:column;gap:5px;align-self:center}.header-buttons .zone-open{min-height:32px;padding:3px 10px;font-size:12px;background:var(--dp-modern-surface,var(--dp-bg));color:var(--dp-muted)}
/* Only constrain the content when the dashboard assigns an explicit row count. */
:host([fixed-height]){height:100%;min-height:0}
:host([fixed-height]) ha-card{height:100%;min-height:0}
:host([fixed-height]) .planner-content{height:100%;overflow-y:auto;overscroll-behavior:contain}

ha-card{position:relative}.consumables-info{min-height:32px;width:100%;padding:3px 10px;background:transparent;color:var(--dp-muted);display:flex;justify-content:center;align-items:center;font-size:12px}.consumables-info.attention{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 10%,var(--dp-bg));border-color:color-mix(in srgb,var(--error-color,#b3261e) 30%,var(--dp-line))}
.robot-group+.robot-group{border-top:1px solid var(--dp-line);padding-top:18px;margin-top:18px}.robot-group .station-row:last-child{margin-bottom:0}.robot-disabled{opacity:.5}.robot-volume{display:flex;align-items:center;gap:10px;width:55%;min-width:0}.robot-volume input{width:100%;min-width:0;accent-color:var(--dp-accent)}.robot-volume output{min-width:38px;text-align:right}.robot-row input[type=time]{color:var(--primary-text-color);background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:8px;padding:8px;font:inherit;min-width:0}.setting-switch{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:48px;min-height:40px}
.robot-disabled:has(.setting-switch.pending){opacity:1}.setting-switch.pending ha-switch{visibility:hidden}.setting-switch-spinner{position:absolute;width:19px;height:19px;border:2px solid var(--dp-line);border-top-color:var(--dp-accent);border-radius:50%;animation:schedule-spin .7s linear infinite;pointer-events:none}
@media(prefers-reduced-motion:reduce){.setting-switch-spinner{animation:none;border-right-color:var(--dp-accent)}}
.info-toolbar{display:flex;align-items:stretch;gap:8px;margin-bottom:20px}.info-tabs{display:flex;flex:1;min-width:0;gap:0;border-bottom:1px solid var(--dp-line)}.info-tabs button{flex:1;min-width:0;min-height:42px;padding:9px 8px;border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;color:var(--dp-muted);font-size:13px;overflow-wrap:anywhere}@media(max-width:350px){.info-tabs{gap:0}.info-tabs button{font-size:12px;padding:9px 4px}}.info-tabs [aria-selected=true]{color:var(--primary-text-color);border-bottom-color:var(--dp-accent);background:transparent}.info-tabs .attention{color:var(--error-color,#b3261e)}.info-tabs .attention[aria-selected=true]{border-bottom-color:var(--error-color,#b3261e)}.station-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:18px;font-size:13px}.station-row.station-action:not(:last-child){margin-bottom:8px}.station-row small{display:block;color:var(--dp-muted);margin-top:4px}.station-row>span{min-width:0;overflow-wrap:anywhere}.station-label{display:flex;align-items:center;gap:8px}.station-label>span:last-child{min-width:0}.station-row select{flex:0 1 190px;width:55%;min-width:140px;margin-left:auto;font-size:14px}.station-row ha-switch,.station-row ha-button{flex:0 0 auto;margin-left:auto}@media(max-width:400px){.station-row select{font-size:16px}}.consumables-overlay{position:absolute;inset:0;z-index:5;background:#0005;padding:4px;display:flex;align-items:flex-start}.consumables-panel{width:100%;max-height:min(100%,75vh);overflow-y:auto;overscroll-behavior:contain;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:14px;padding:18px;box-shadow:0 8px 30px #0003}.consumables-close{display:flex;align-items:center;justify-content:center;flex:0 0 42px;padding:8px;min-width:42px}.consumables-close ha-icon{width:20px;height:20px;--mdc-icon-size:20px;flex-shrink:0}.consumable-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);align-items:center;gap:20px;margin:0 0 24px;min-height:42px}.consumable-row:last-child{margin-bottom:0}.consumable-label{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-width:0;font-size:13px;line-height:1.4;overflow-wrap:anywhere}.consumable-value{color:var(--dp-muted);font-size:12px}.consumable-track{height:12px;border-radius:999px;background:color-mix(in srgb,var(--dp-accent) 14%,var(--dp-bg));overflow:hidden}.consumable-fill{display:block;height:100%;border-radius:inherit;background:var(--dp-accent)}.consumable-fill.medium{background:var(--warning-color,#ad6800)}.consumable-fill.low{background:var(--error-color,#b3261e)}.consumable-solution{padding-top:18px;border-top:1px solid var(--dp-line)}.consumable-chip{justify-self:end;display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:7px 10px;border-radius:12px;font-size:12px;line-height:1.4;color:var(--dp-muted);background:var(--dp-line)}.consumable-chip.ready{color:var(--dp-accent);background:var(--dp-soft)}.consumable-chip.refill{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 12%,var(--dp-bg))}.consumable-chip ha-icon{width:16px;height:16px;--mdc-icon-size:16px;flex-shrink:0}@media(max-width:400px){.consumable-row{gap:12px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.consumable-chip{padding:6px 8px}}

:host{--dp-padding:24px}.header-title{flex:1;min-width:0}.header-title h2{overflow-wrap:anywhere}.robot{flex-shrink:0}.battery{display:flex;align-items:center;gap:4px;flex:none}.battery-value{font-size:12px;font-variant-numeric:tabular-nums}.battery svg{width:32px;height:20px;color:var(--dp-muted)}.battery[data-level=high] svg{color:var(--success-color,#2e7d32)}.battery[data-level=medium] svg{color:var(--warning-color,#ad6800)}.battery[data-level=low] svg{color:var(--error-color,#b3261e)}
:host{display:block;color:var(--primary-text-color,#20272d);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif);--dp-bg:var(--ha-card-background,var(--card-background-color,#fff));--dp-line:var(--divider-color,#dde3e8);--dp-muted:var(--secondary-text-color,#52616e);--dp-accent:var(--primary-color,#007da5);--dp-soft:color-mix(in srgb,var(--dp-accent) 10%,var(--dp-bg))}
*{box-sizing:border-box}ha-card{display:block;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:var(--ha-card-border-radius,22px);overflow:hidden;box-shadow:var(--ha-card-box-shadow,0 3px 18px #0000000a)}
.station-status-bar,.station-indicators{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.station-status-bar{padding:6px 24px 0}.station-indicators:empty{display:none}
header,.station-rows{--hud-red:var(--error-color,#db4437);--hud-blue:var(--blue-color,#438bc7);--hud-cyan:var(--dp-accent)}
.station-indicator{display:inline-flex;align-items:center;gap:2px;position:relative;flex:none;color:var(--dp-muted);white-space:nowrap}
.station-indicator .status-icon{display:inline-flex;align-items:center;justify-content:center;line-height:0;width:16px;height:16px;--mdc-icon-size:16px}
.active-red,.alarm-red{color:var(--hud-red)}.active-blue{color:var(--hud-blue)}.active-cyan{color:var(--hud-cyan)}.inactive-muted{color:var(--dp-muted)}
.with-plus::after{content:"+";position:absolute;right:-3px;top:-5px;font:bold 11px/1 monospace;color:currentColor}
.status-text-5g{display:inline-flex;align-items:center;justify-content:center;height:16px;box-sizing:border-box;font:bold 11px/1 ui-monospace,monospace;padding:0 3px;border-radius:3px;background:var(--dp-soft)}
.robot-bumper[data-state=paused]{stroke:#ef8c00}:host([data-theme=modern]) .robot-bumper[data-state=paused]{stroke:var(--warning-color,#c47700)}
.robot-bumper[data-state=fault]{stroke:#e11d2a}.robot-bumper.pulsing{animation:bumper-pulse 2.4s ease-in-out infinite}
@keyframes bumper-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media(prefers-reduced-motion:reduce){.robot-bumper.pulsing{animation:none}}
@keyframes status-blink{50%{opacity:.4}}.blink{animation:status-blink 1.6s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.blink{animation:none}}
.header-main{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto;align-items:center;column-gap:13px;padding:4px var(--dp-padding) 10px}
.header-main .robot{grid-row:1/3}.header-title{display:contents}.header-title h2{grid-area:1/2;margin:0}.header-title p{grid-area:2/2}.header-main .header-buttons .consumables-info{align-self:stretch;width:100%}
.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}.robot.robot-integration{width:50px;height:50px;padding:0;background:transparent;border-radius:0;align-items:center;justify-content:center}.robot-illustration{display:block;width:48px;height:48px;flex:none;pointer-events:none;overflow:visible}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.draft-status{position:relative;padding-left:28px}.discard-draft{position:absolute;right:calc(100% - 24px);top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:24px;height:24px;min-height:0;padding:0;border:0;background:transparent;color:var(--dp-muted)}.discard-draft ha-icon{width:20px;height:20px;--mdc-icon-size:20px;pointer-events:none}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
.session{padding:4px 24px 0}.session h3{margin:0 0 8px;font-size:20px;font-weight:500}.session .detail{margin-bottom:18px}.requested-label{font-size:12px;color:var(--dp-muted);margin-bottom:8px}.requested{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0 0 10px}.requested li{background:var(--dp-soft);border:1px solid var(--dp-line);border-radius:18px;padding:7px 11px;font-size:13px;overflow-wrap:anywhere}.requested-note{margin-bottom:18px}.map-section{margin-top:20px}.map-title{font-size:13px;font-weight:500;margin:0 0 10px}.session-actions button{display:flex;align-items:center;justify-content:center;gap:8px}.session-actions ha-icon{width:20px;height:20px}.session-footer{padding-top:20px}
.activity-status{display:flex;align-items:center;gap:10px;margin:0 var(--dp-padding) 16px;padding:12px;border-radius:10px;background:var(--dp-soft);font-size:14px}.activity-status ha-icon{flex-shrink:0}.activity-copy{flex:1;min-width:0}.activity-remaining,.activity-start-block,.activity-fault{display:block;margin-top:4px;font-size:12px;line-height:1.5;color:var(--dp-muted);font-variant-numeric:tabular-nums}.drying-progress{display:block;width:100%;height:7px;margin-top:8px;border-radius:999px;background:var(--dp-line);overflow:hidden}.drying-progress-fill{display:block;height:100%;width:0;border-radius:inherit;background:var(--dp-accent)}.drying-control{flex-shrink:0}.cancel-drying{display:flex;align-items:center;justify-content:center;padding:8px;min-width:42px}.map-title{padding:0 var(--dp-padding)}
.map-title{margin-bottom:4px}.map-caption{padding:0 var(--dp-padding);margin:0 0 10px;font-size:12px}.action-message:empty{display:none}.session-actions .pause{background:#ef8c00;color:#171717;border-color:transparent}.session-actions .resume{background:#2e7d32;color:#fff;border-color:transparent}.session-actions .home{background:#c62828;color:#fff;border-color:transparent}
@media(max-width:400px){:host{--dp-padding:15px}.hint{padding:0 15px 14px}.rooms{padding:0 10px}footer{padding:18px 15px}.session{padding:4px 15px 0}.expand span{display:none}.actions{flex-direction:column}.session-actions{flex-direction:row}select{font-size:16px}.fields{gap:12px}}


:host([data-theme=modern]) .header-main{position:relative}
:host([data-theme=modern]) .robot{position:relative}
.robot-warning{position:absolute;inset:0;width:100%;height:100%;padding:0;min-height:0;border:0;border-radius:inherit;background:transparent}
.robot-warning ha-icon{position:absolute;right:-3px;bottom:-3px;width:17px;height:17px;--mdc-icon-size:17px;color:var(--warning-color,#e6ac00);background:var(--dp-bg);border-radius:4px}
.header-notice{position:absolute;inset:2px var(--dp-padding) 6px;z-index:2;display:flex;align-items:center;gap:10px;padding:5px 10px;border-radius:10px;background:var(--dp-soft);border:1px solid var(--dp-line);color:var(--dp-text)}.header-notice-copy{flex:1;min-width:0;max-height:100%;overflow:auto;font-size:14px;overflow-wrap:anywhere}.header-notice.error{color:var(--error-color,#db4437)}
.header-fault{position:absolute;inset:2px var(--dp-padding) 6px;z-index:2;display:flex;align-items:center;gap:10px;padding:5px 10px;border-radius:10px;background:var(--dp-soft);border:1px solid var(--dp-line)}
.header-fault-copy{flex:1;min-width:0;max-height:100%;overflow-y:auto;overscroll-behavior:contain;font-size:14px;overflow-wrap:anywhere}
.header-fault-detail{margin-top:2px;font-size:12px;line-height:1.35}
.header-fault-close{display:flex;align-items:center;justify-content:center;flex:none;min-width:36px;min-height:36px;padding:6px;background:transparent}

/* Normal Modern statuses share one fixed slot; faults retain their existing presentation. */
:host([data-theme=modern]) header{margin-bottom:0}
:host([data-theme=modern]) .activity-status:not(.compact-status){margin-top:12px}
:host([data-theme=modern]) .compact-status{height:44px;margin:0 var(--dp-padding);padding:0;border-radius:0;background:transparent;gap:8px;position:relative;font-size:13px}
:host([data-theme=modern]) .compact-status .activity-icon{display:flex;align-items:center;justify-content:center;width:18px;height:18px;--mdc-icon-size:18px}
:host([data-theme=modern]) .compact-status .activity-copy{flex:0 1 auto;align-self:stretch;position:relative;display:flex;flex-direction:column;justify-content:center;white-space:nowrap;overflow:hidden;line-height:20px}
:host([data-theme=modern]) .compact-status .activity-heading{display:flex;align-items:baseline;min-width:0}
:host([data-theme=modern]) .compact-status .activity-text{min-width:0;overflow:hidden;text-overflow:ellipsis}
:host([data-theme=modern]) .compact-status .activity-remaining{display:inline;flex:none;white-space:pre;margin:0;font-size:12px}
:host([data-theme=modern]) .compact-status .activity-start-block{display:none}
:host([data-theme=modern]) .compact-status.has-drying .activity-start-block:not([hidden]){display:block}
:host([data-theme=modern]) .compact-status .drying-progress{position:absolute;left:0;right:0;bottom:2px;width:auto;height:3px;margin:0}
:host([data-theme=modern]) .compact-status .cancel-drying{min-width:36px;min-height:36px;width:36px;height:36px;padding:7px;background:transparent;border-color:transparent}
:host([data-theme=modern]) .compact-status .cancel-drying ha-icon{width:18px;height:18px;--mdc-icon-size:18px}
:host([data-theme=modern]) .session{height:43px;min-height:43px;margin:0 var(--dp-padding) 14px;padding:0;display:flex;align-items:center}
:host([data-theme=modern]) .requested{width:100%;margin:0;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;align-items:center}
:host([data-theme=modern]) .requested li{flex:none;white-space:nowrap;padding:5px 10px}
:host([data-theme=modern]) .map-section{margin:0;padding:20px}
:host([data-theme=modern]) .session-footer{margin:14px var(--dp-padding) 0;padding:12px 0 14px;border-top:1px solid var(--dp-line)}
:host([data-theme=modern]) .session-actions button{min-height:38px;padding:6px 12px;border-radius:13px;border:1px solid color-mix(in srgb,var(--session-color) 45%,var(--dp-line));background:color-mix(in srgb,var(--session-color) 12%,var(--dp-modern-surface));color:var(--session-color)}
:host([data-theme=modern]) .session-actions .pause{--session-color:var(--warning-color,#c47700)}
:host([data-theme=modern]) .session-actions .resume{--session-color:var(--success-color,#2e7d32)}
:host([data-theme=modern]) .session-actions .home{--session-color:var(--error-color,#c62828)}

/* Cool neutral surfaces keep cyan reserved for active controls. */
:host([data-theme=modern]){--dp-modern-surface:color-mix(in srgb,#506773 14%,var(--dp-bg));--dp-modern-control:color-mix(in srgb,#8099a5 18%,var(--dp-modern-surface));--dp-modern-control-border:color-mix(in srgb,var(--primary-text-color,#20272d) 24%,var(--dp-modern-control))}
:host([data-theme=modern]) .mode select,:host([data-theme=modern]) .segments{background:var(--dp-modern-control);border-color:var(--dp-modern-control-border)}
:host([data-theme=modern]) ha-card{container-type:inline-size}
:host([data-theme=modern]) .rooms{padding:0 var(--dp-padding);gap:10px}
:host([data-theme=modern]) .room{border-radius:16px;border-color:var(--dp-line);background:var(--dp-modern-surface)}
:host([data-theme=modern]) .room.selected{background:color-mix(in srgb,var(--room-color) 10%,var(--dp-bg));border-color:color-mix(in srgb,var(--room-color) 55%,var(--dp-line))}
:host([data-theme=modern]) .room.open{border-color:#18c5d9;box-shadow:0 0 0 1px #18c5d9,0 0 12px #18c5d91a}
:host([data-theme=modern]) .room-head{padding:10px 12px;min-height:72px}
:host([data-theme=modern]) .pick{position:relative;flex:0 0 15%;min-width:44px;min-height:44px;justify-content:center;align-self:stretch;cursor:pointer}
:host([data-theme=modern]) .room-settings-toggle{flex:1;min-width:0;align-self:stretch;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;white-space:normal;padding:0 4px}
:host([data-theme=modern]) .room-settings-toggle span{display:block}
:host([data-theme=modern]) .room-plain .pick{flex:1;justify-content:flex-start;gap:12px}.room-settings-copy{min-width:0}
.planning-settings:empty{display:none}.planning-settings{margin:16px var(--dp-padding,24px) 0}.planning-setting{border:1px solid var(--dp-line);border-radius:13px;padding:14px 16px;background:var(--dp-bg)}.planning-setting-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;font-size:13px}.planning-setting-head>span{min-width:0;line-height:1.4}.planning-setting-head output{flex-shrink:0;border-radius:8px;padding:4px 8px;background:var(--dp-soft);color:var(--primary-text-color);font-size:12px;overflow-wrap:anywhere;max-width:40%}.planning-setting-hint{font-size:11px;line-height:1.4;margin-top:8px}.planning-setting .slider-options{display:flex;justify-content:space-between;gap:6px;margin:2px 0 0;min-height:28px}.planning-settings .planning-setting .slider-options button{position:static;left:auto;transform:none;width:auto;flex:1;font-size:12px;text-align:center;padding:2px;overflow-wrap:anywhere}.planning-setting .slider-options button:first-child{text-align:left}.planning-setting .slider-options button:last-child{text-align:right}

.mode-spacer{display:none}
:host([data-theme=modern]) .pick input{position:absolute;width:1px;height:1px;opacity:0}
.selection-circle{display:flex;align-items:center;justify-content:center;width:32px;height:32px;flex:none;border:2px solid var(--dp-muted);border-radius:50%;font-weight:650;color:var(--primary-text-color)}
.selected .selection-circle{background:var(--room-color);border-color:var(--room-color);color:#102026}
.pick input:focus-visible+.selection-circle{outline:2px solid var(--dp-accent);outline-offset:4px}
.pick input:disabled~span{opacity:.5}
:host([data-theme=modern]) .fields{display:flex;flex-direction:column;gap:8px;padding:10px 14px;background:var(--dp-modern-surface)}
.modern-control{min-width:0}
.field-label{display:block;font-size:13px;margin-bottom:2px;color:var(--primary-text-color)}
/* Tick centers share the native thumb's travel area (half its width at each end). */
.stepped-slider{position:relative;height:24px}
.slider-ticks{position:absolute;inset:0 10px;pointer-events:none;color:var(--dp-muted)}
.slider-ticks::before{content:"";position:absolute;left:0;right:0;top:10.5px;height:3px;border-radius:2px;background:currentColor;opacity:.65}
.slider-tick{position:absolute;left:calc(var(--stop)*100%);top:12px;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:currentColor}
.modern-control .stepped-slider input[type=range]{position:relative;z-index:1;display:block;appearance:none;-webkit-appearance:none;width:100%;height:24px;margin:0;padding:0;border:0;background:transparent;cursor:pointer}
.stepped-slider input::-webkit-slider-runnable-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-progress{background:transparent}
.stepped-slider input::-webkit-slider-thumb{-webkit-appearance:none;box-sizing:border-box;width:20px;height:20px;margin-top:-8.5px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider input::-moz-range-thumb{box-sizing:border-box;width:20px;height:20px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider.disabled{opacity:.45}
.modern-control .stepped-slider input:disabled{cursor:default}
.slider-options{position:relative;min-height:28px;margin:0 10px}.slider-options button{position:absolute;left:calc(var(--stop)*100%);transform:translateX(-50%);width:30%}.slider-options button:first-child{left:-10px;transform:none;text-align:left;padding-left:0}.slider-options button:last-child{left:calc(100% + 10px);transform:translateX(-100%);text-align:right;padding-right:0}
.slider-options button{border:0;background:transparent;padding:2px 2px;min-height:28px;font-size:12px;color:var(--dp-muted);overflow-wrap:anywhere}
.slider-options button[aria-pressed=true]{color:var(--dp-accent);font-weight:650}
.segments{display:flex;gap:3px;padding:3px;border:1px solid var(--dp-line);border-radius:12px}
.segments button{flex:1;min-width:0;min-height:32px;border:0;background:transparent;padding:3px 8px;position:relative}
.segments button::after{content:"";position:absolute;inset:-6px 0}
.segments button[aria-pressed=true]{background:var(--dp-accent);color:var(--text-primary-color,#fff)}
:host([data-theme=modern]) .actions button{border-radius:13px}
/* Compact Modern planner framing. */
:host([data-theme=modern]){--dp-padding:20px}
:host([data-theme=modern]) .station-status-bar{padding-inline:var(--dp-padding)}
:host([data-theme=modern]) header{border-bottom:1px solid var(--dp-line);margin-bottom:0}
:host([data-theme=modern]) .consumables-info:not(.attention),:host([data-theme=modern]) button[data-action=save]{background:var(--dp-modern-surface)}
:host([data-theme=modern]) footer:not(.session-footer){margin:14px var(--dp-padding) 0;padding:12px 0 14px;border-top:1px solid var(--dp-line)}
:host([data-theme=modern]) footer:not(.session-footer) .actions button{min-height:38px;padding-block:6px}
:host([data-theme=modern]) footer:not(.session-footer) .notice:empty{display:none}
:host([data-theme=modern]) .field.mode{font-size:13px;color:var(--primary-text-color,#20272d)}
:host([data-theme=modern]) .mode select:not(:disabled){color:var(--dp-accent)}
:host([data-theme=modern]) .mode select option{color:var(--primary-text-color,#20272d);background:var(--dp-modern-control)}
@media(max-width:400px){:host([data-theme=modern]){--dp-padding:12px}}
:host([data-theme=modern]) .fields .field{gap:4px}
:host([data-theme=modern]) .mode select{min-height:35px;padding:5px 10px;font-size:13px}
@media(max-width:400px){:host([data-theme=modern]) .mode select{font-size:16px}}
/* Keep room rows content-sized; the final flexible row absorbs panel height. */
@container (min-width:480px) and (max-width:620px){
  :host([data-theme=modern]) .room-head{padding:8px;gap:4px}
  :host([data-theme=modern]) .pick{gap:8px}
  :host([data-theme=modern]) .selection-circle{width:28px;height:28px}
  :host([data-theme=modern]) .room-settings-toggle{padding:0;min-height:44px}
}
@container(min-width:480px){
  :host([data-theme=modern]) .modern-rooms{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);column-gap:18px;row-gap:0;grid-template-rows:repeat(var(--room-count),max-content) minmax(0,1fr);align-items:start}
  :host([data-theme=modern]) .modern-rooms:not(:has(.room.open)){grid-template-columns:1fr}
  :host([data-theme=modern]) .modern-rooms .room{display:contents}
  :host([data-theme=modern]) .modern-rooms .room-head{grid-column:1;grid-row:var(--room-row);margin-bottom:10px;border:1px solid var(--dp-line);border-radius:16px;background:var(--dp-modern-surface)}
  :host([data-theme=modern]) .modern-rooms .room:last-child .room-head{margin-bottom:0}
  :host([data-theme=modern]) .modern-rooms .fields:not(:has(>.mode-spacer)){justify-content:space-between}
  :host([data-theme=modern]) .modern-rooms .selected .room-head{border-color:color-mix(in srgb,var(--room-color) 55%,var(--dp-line));background:color-mix(in srgb,var(--room-color) 10%,var(--dp-bg))}
  :host([data-theme=modern]) .modern-rooms .open .room-head{border-color:#18c5d9;box-shadow:0 0 0 1px #18c5d9,0 0 12px #18c5d91a}
  :host([data-theme=modern]) .modern-rooms .fields{grid-column:2;grid-row:1 / span calc(var(--room-count) + 1);align-self:stretch;position:relative;border:1px solid var(--dp-line);border-radius:16px;background:var(--dp-modern-surface);overflow:visible}
  /* Reserve the omitted control at the bottom, only in split view. */
  :host([data-theme=modern]) .mode-spacer{display:block;visibility:hidden;order:1}
  :host([data-theme=modern]) .fields:has(>.mode-spacer)>:not(.mode-spacer){translate:0 var(--field-shift,0px)}
  :host([data-theme=modern]) .modern-rooms .fields::before{content:"";position:absolute;left:-8px;top:calc(var(--pointer-y,38px) - 8px);width:14px;height:14px;background:var(--dp-modern-surface);border-left:1px solid var(--dp-line);border-bottom:1px solid var(--dp-line);transform:rotate(45deg)}
}

/* Compact only the tiles, not their 10px gaps, when five or more rooms are shown. */
:host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)) .room-head{min-height:52px;padding-block:3px}
:host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)) .name{margin-bottom:2px;line-height:1.2}
:host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)) .summary{line-height:1.25}

@container(min-width:480px){
  /* With exactly five rooms, share the settings height equally between tiles. */
  :host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)):not(:has(>.room:nth-child(6))):has(.room.open){grid-template-rows:repeat(5,minmax(52px,1fr));row-gap:10px}
  :host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)):not(:has(>.room:nth-child(6))):has(.room.open) .room-head{margin-bottom:0;align-self:stretch}
  :host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)):not(:has(>.room:nth-child(6))):has(.room.open) .fields{grid-row:1 / span 5}
}

`;

const registryRefreshEvents = new EventTarget();

// Each instance owns its draft. Registry refresh also catches disabled or renamed entities.
// HA mounts the visual editor and its preview in separate shadow trees in one dialog.
const sessionPreviewOwners = new WeakMap();
const zonePreviewOwners = new WeakMap();
const previewViewChanged = 'dyson-planner-preview-view';

function cardEditorDialog(element, previewOnly = false) {
  let preview = false;
  for (let node = element; node; node = node.assignedSlot || node.parentElement || node.getRootNode()?.host) {
    if (node.matches?.('hui-card[preview], hui-section[preview]')) preview = true;
    if (node.localName === 'hui-dialog-edit-card') return !previewOnly || preview ? node : null;
  }
  return null;
}

class DysonRegistryElement extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this.registry = []; this.devices = []; this.registryError = ''; }
  connectedCallback() {
    this._onRegistryRefresh = event => {
      if (event.detail.source === this || event.detail.connection !== this._hass?.connection) return;
      this.registry = event.detail.rows;
      this.devices = event.detail.devices ?? this.devices;
      this.registryError = '';
      this._registryLoaded = true;
      this.update?.();
    };
    registryRefreshEvents.addEventListener('refresh', this._onRegistryRefresh);
    this.loadRegistry();
    this._registryTimer = setInterval(() => this.loadRegistry(), 30000);
  }
  disconnectedCallback() { clearInterval(this._registryTimer); registryRefreshEvents.removeEventListener('refresh', this._onRegistryRefresh); }
  get adapter() { return getIntegrationAdapter(this.config, this.registry, this._hass); }
  get language() { return resolveLanguage(this.config, this._hass); }
  t(key, params) { return translate(this.language, key, params); }
  ht(key, params) { return escapeHtml(this.t(key, params)); }
  set hass(value) {
    const changed = this._hass?.connection !== value?.connection;
    this._hass = value;
    if (changed) { this.registry = []; this.devices = []; this._registryLoaded = false; }
    if (this.isConnected && !this._registryLoaded && !this._loadingRegistry) this.loadRegistry();
    this.update?.();
  }
  get hass() { return this._hass; }
  async loadRegistry(notifyPeers = false) {
    if (!this._hass || this._loadingRegistry) return;
    this._loadingRegistry = true;
    const connection = this._hass.connection;
    try {
      const [rows, devices] = await Promise.all([
        this._hass.callWS({ type: 'config/entity_registry/list' }),
        this._hass.callWS({ type: 'config/device_registry/list' }).catch(() => null),
      ]);
      if (this._hass.connection !== connection) return;
      this.registry = rows;
      if (devices) this.devices = devices;
      this.registryError = '';
      this._registryLoaded = true;
      if (notifyPeers) registryRefreshEvents.dispatchEvent(new CustomEvent('refresh', { detail: { source: this, connection, rows, devices: this.devices } }));
    } catch {
      this.registryError = 'Could not read the entity registry. Check the connection and user permissions.';
      this._registryLoaded = true;
    } finally { this._loadingRegistry = false; this.update?.(); }
  }
  paint(html, view = null) {
    if (html === this._html) return;
    cancelAnimationFrame(this._plannerScrollFrame);
    cancelAnimationFrame(this._scheduleScrollFrame);
    const dialog = this.scheduleDialog;
    const dialogScrollTop = dialog && this._paintedScheduleDialog === dialog
      ? this.shadowRoot.querySelector('.schedule-overlay')?.scrollTop : null;
    const previous = this.shadowRoot.querySelector('.planner-content');
    const keepPlanner = view === 'planner' && this._paintedView === 'planner' && previous;
    const keepSchedules = view === 'schedules' && this._paintedView === 'schedules' && previous;
    const scrollTop = keepPlanner ? previous.scrollTop : 0;
    const active = this.shadowRoot.activeElement;
    const focused = active?.dataset.focus;
    const selection = active?.tagName === 'INPUT' && active.type === 'text' ? [active.selectionStart, active.selectionEnd, active.selectionDirection] : null;
    this._html = html;
    this._paintedView = view;
    this._paintedScheduleDialog = dialog;
    if (keepPlanner || keepSchedules) {
      // Retain HA's mounted card/slot for local planner and schedule updates.
      // Recreating its asynchronous Lit slot briefly removes all measurable
      // content and makes schedule menu positioning close a just-opened menu.
      const template = document.createElement('template');
      template.innerHTML = html;
      const incoming = template.content.querySelector('.planner-content');
      previous.replaceChildren(...incoming.childNodes);
      const overlay = this.shadowRoot.querySelector('.consumables-overlay');
      const incomingOverlay = template.content.querySelector('.consumables-overlay');
      if (overlay && incomingOverlay) overlay.replaceWith(incomingOverlay);
      const scheduleOverlay = this.shadowRoot.querySelector('.schedule-overlay');
      const incomingSchedule = template.content.querySelector('.schedule-overlay');
      if (scheduleOverlay && incomingSchedule) scheduleOverlay.replaceWith(incomingSchedule);
      else if (incomingSchedule) this.shadowRoot.querySelector('ha-card').append(incomingSchedule);
      else scheduleOverlay?.remove();
      const menuOverlay = this.shadowRoot.querySelector('.schedule-menu-overlay');
      const incomingMenu = template.content.querySelector('.schedule-menu-overlay');
      if (menuOverlay && incomingMenu) menuOverlay.replaceWith(incomingMenu);
      else if (incomingMenu) this.shadowRoot.querySelector('ha-card').append(incomingMenu);
      else menuOverlay?.remove();
    } else {
      // Keep the original rendering path for the session, editor and view transitions.
      this.shadowRoot.innerHTML = html;
    }
    if (focused) {
      const next = Array.from(this.shadowRoot.querySelectorAll('[data-focus]')).find(e => e.dataset.focus === focused);
      if (keepPlanner || view === 'schedules') next?.focus({ preventScroll: true });
      else next?.focus();
      if (selection) next?.setSelectionRange(...selection);
    }
    if (keepPlanner) {
      previous.scrollTop = scrollTop;
      this._plannerScrollFrame = requestAnimationFrame(() => {
        if (previous.isConnected && this._paintedView === 'planner') previous.scrollTop = scrollTop;
      });
    }
    this.updateScheduleDialog?.();
    if (dialogScrollTop != null) {
      const overlay = this.shadowRoot.querySelector('.schedule-overlay');
      const restore = () => {
        if (overlay?.isConnected && this.scheduleDialog === dialog) overlay.scrollTop = dialogScrollTop;
      };
      restore();
      this._scheduleScrollFrame = requestAnimationFrame(restore);
    }
  }
}

class DysonCleaningPlannerCard extends DysonRegistryElement {
  constructor() {
    super(); this.selected = []; this.settingDraft = {}; this.planningDraft = {}; this.dirty = false; this.busy = false; this.expanded = new Set(); this.message = '';
    this._headerFaultKey = ''; this._headerFaultDismissed = false;
    this.controlBusy = false; this.pendingStart = false; this.requestedPlan = null; this.zoneView = false;
    this._mapOutside = event => {
      if (this.mapMenuOpen && !event.composedPath().includes(this)) { this.mapMenuOpen = false; this.render(); }
    };

    this.shadowRoot.addEventListener('planner-notice', () => this.updateHeaderNotice());
    this.shadowRoot.addEventListener('zone-started', event => this.zoneStarted(event.detail));
    this.shadowRoot.addEventListener('change', event => this.onChange(event));
    this.shadowRoot.addEventListener('input', event => this.scheduleInput(event));
    this.shadowRoot.addEventListener('click', event => this.onClick(event));
    this.shadowRoot.addEventListener('keydown', event => {
      if (this.mapKeydown(event)) return;
      if (this.scheduleKeydown(event)) return;
      if (!this.consumablesOpen && event.target.matches('.planning-tabs [role="tab"]')
          && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const tabs = [...this.shadowRoot.querySelectorAll('.planning-tabs [role="tab"]')].map(tab => tab.dataset.action);
        const index = tabs.indexOf(event.target.dataset.action);
        const action = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1)
          : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        this.shadowRoot.querySelector(`.planning-tabs [data-action="${action}"]`)?.click();
        this.shadowRoot.querySelector('.planning-tabs [aria-selected="true"]')?.focus({ preventScroll: true });
        return;
      }
      if (!this.consumablesOpen) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.toggleConsumables(false); }
      if (event.key === 'Tab') {
        const panel = this.shadowRoot.querySelector('.consumables-panel');
        const items = [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), ha-switch:not([disabled]), ha-button:not([disabled])')].filter(el => (['ha-switch', 'ha-button'].includes(el.localName) || el.tabIndex >= 0) && el.getClientRects().length);
        const first = items[0], last = items.at(-1), active = this.shadowRoot.activeElement;
        if (event.shiftKey && active === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && active === last) { event.preventDefault(); first?.focus(); }
      }
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) && event.target.dataset.infoTab) {
        event.preventDefault();
        const tabs = this.adapter.infoTabs ?? ['station', 'robot', 'consumables'];
        const index = tabs.indexOf(event.target.dataset.infoTab);
        this.infoTab = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1)
          : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        this.updateConsumables(); this.shadowRoot.querySelector(`[data-info-tab="${this.infoTab}"]`).focus();
      }
    });
  }
  static getConfigElement() { return document.createElement('dyson-cleaning-planner-card-editor'); }
  static getStubConfig(hass) {
    return { type: 'custom:dyson-cleaning-planner-card', entity: defaultIntegrationEntity(hass) };
  }
  setConfig(config) {
    let normalized;
    try { normalized = normalizeConfig(config); }
    catch (error) { throw new Error(translate(resolveLanguage(config, this._hass), error)); }
    const withoutLanguage = value => JSON.stringify({ ...value, language: undefined });
    if (this.config && withoutLanguage(this.config) === withoutLanguage(normalized)) {
      // Keep the configuration identity used by in-flight save/start requests.
      this.config.language = normalized.language; this.update(); return;
    }
    if (this.config?.entity !== config.entity || (this.config?.integration ?? 'auto') !== (config.integration ?? 'auto')) {
      this.clearSessionEnd();
      this.clearPendingStart(); this.requestedPlan = null; this.sessionObserved = false;
    }
    this.consumablesOpen = false; this.stationMessage = ''; this.stationError = false;
    this.cancelSettingSwitch();
    this.cancelMapSwitch();
    this.robotMessage = ''; this._robotMessageContext = {};
    this.zoneView = false; this.zoneDraft = null;
    this.cancelScheduleFeedback();
    this._scheduleCountdown = null;
    this.schedulesView = false; this.scheduleDialog = null; this.scheduleMenu = null; this.scheduleSending = null;
    this.scheduleScrollTop = 0;
    this.config = normalized;
    this.setAttribute('data-theme', this.config.theme);
    const rows = config.grid_options?.rows ?? config.layout_options?.grid_rows;
    this.toggleAttribute('fixed-height', typeof rows === 'number' && Number.isFinite(rows) && rows > 0);
    this.initialized = false; this.dirty = false; this.selected = []; this.settingDraft = {}; this.planningDraft = {}; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  connectedCallback() {
    this._previewDialog = cardEditorDialog(this, true);
    document.addEventListener('pointerdown',this._mapOutside);
    this._previewChanged ??= () => this.update();
    this._previewDialog?.addEventListener(previewViewChanged, this._previewChanged);
    super.connectedCallback();
    this._modernObserver ??= new ResizeObserver(() => { this.positionModernPointer(); this.updateScheduleListLayout(); });
    this._modernObserver.observe(this);
    this.update();
    clearInterval(this._dockTimer);
    this._dockTimer = setInterval(() => {
      if (!this.isConnected || document.hidden) return;
      if (this.adapter.usesDockTimer && this.model
          && this.shadowRoot.querySelector('.activity-remaining:not([hidden])')) this.updateStatus();
      if (this.schedulesView) this.updateScheduleCountdown();
    }, 1000);
  }
  disconnectedCallback() {
    this._detachRevision = (this._detachRevision ?? 0) + 1;
    document.removeEventListener('pointerdown',this._mapOutside);
    this.cancelMapSwitch();
    this.cancelSettingSwitch();
    this.cancelScheduleFeedback();
    this.scheduleDialog = null;
    this._previewDialog?.removeEventListener(previewViewChanged, this._previewChanged);
    this._previewDialog = null;
    this._modernObserver?.disconnect();
    clearInterval(this._dockTimer);
    super.disconnectedCallback(); this.clearPendingStart(); this.clearSessionEnd();
  }
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
  get view() {
    const view = this.adapter.cleaningView(this._hass, this.config?.entity, (this.busy && !this.saving) || this.pendingStart, this.registry);
    if (!view.active && this._previewDialog && sessionPreviewOwners.has(this._previewDialog)) {
      return { active: true, live: true, simulated: true };
    }
    return view;
  }
  get showSessionMap() { return this.config?.show_camera && this.adapter.supportsSessionMap !== false; }
  getCardSize() { return this.view.active ? (this.showSessionMap ? 9 : 5) : 3 + (this.model?.rooms.length ?? 3); }
  getGridOptions() { return { columns: 12, min_columns: 9, rows: 'auto', min_rows: 1 }; }
  getModel() { return this.adapter.discover(this._hass, this.registry, this.config, this.lastRooms); }
  getRoomPlanningState(model = this.model) {
    return this.adapter.roomPlanningState(this._hass, this.registry, this.config, model, this.settingDraft, this.planningDraft);
  }
  planningSettings() { return this.adapter.planningSettings?.(this._hass, this.registry, this.config) ?? []; }
  resetDraft(clearMessage = true) {
    this.draftContext = this.adapter.roomContext(this._hass, this.config.entity, this.registry);
    this.selected = this.model.rooms.filter(r => !r.excluded && r.available && roomKey(r) && this.adapter.roomSelectionState(this._hass, r.entity, r) === 'on').map(roomKey);
    this.settingDraft = {}; this.planningDraft = {};
    this.baseline = this.liveSignature(); this.dirty = false;
    if (clearMessage) { this.message = ''; this.error = false; }
  }
  liveSignature() {
    return JSON.stringify([...this.model.rooms.map(r => [r.roomId, roomKey(r), this.adapter.roomSelectionState(this._hass, r.entity, r), Object.entries(r.settings ?? {}).map(([key, field]) => [key, field.entity, field.value])]),
      ...this.planningSettings().map(field => ['planning',field.key,field.value,field.options])]);
  }
  updateDirty() {
    const live = this.model.rooms.filter(r => !r.excluded && r.available && roomKey(r) && this.adapter.roomSelectionState(this._hass, r.entity, r) === 'on').map(roomKey);
    this.dirty = Object.keys(this.settingDraft).length > 0 || Object.keys(this.planningDraft ?? {}).length > 0 || JSON.stringify(this.selected) !== JSON.stringify(live);
  }
  update() {
    if (!this.config || !this._hass) return;
    const previous = this.model;
    this.model = this.getModel();
    // Preserve a local selection across entity renames using the robot's room ID.
    if (this.dirty && previous && this.draftContext === this.adapter.roomContext(this._hass, this.config.entity, this.registry)) this.selected = this.selected.map(entity => {
      const id = previous.rooms.find(r => roomKey(r) === entity)?.roomId;
      const matches = this.model.rooms.filter(r => id && r.roomId === id);
      return matches.length === 1 ? roomKey(matches[0]) : entity;
    });
    const reported = this.adapter.cleaningView(this._hass, this.config.entity, false, this.registry);
    if (reported.active || this.busy || this.pendingStart) this.clearSessionEnd();
    if (reported.live) {
      this.clearPendingStart(); this.sessionObserved = true;
    } else if (!reported.active && !this.busy && !this.pendingStart && this.sessionObserved) {
      this.deferSessionEnd();
      this.message = ''; this.error = false;
    }
    if (this.model.rooms.length) this.lastRooms = this.model.rooms;
    else if (!this.adapter.hasRoomList(this._hass, this.config.entity)) this.model.rooms = (this.lastRooms ?? []).map(r => ({ ...r, available: false }));
    if ((!this.initialized || !this.dirty) && !this.view.active && !this.busy && this.model.rooms.length) {
      this.resetDraft(false); this.initialized = true;
    }
    this.reconcileScheduleConfirmation();
    this.reconcileSettingSwitch();
    this.reconcileMapSwitch();
    this.render();
  }
  onChange(event) {
    if (this._mapRequest) return;
    if (event.target.dataset.scheduleToggle !== undefined) {
      this.submitSchedule(Number(event.target.dataset.scheduleToggle), event.target.checked); return;
    }
    if (this.scheduleDialog) { this.scheduleInput(event); return; }
    if (event.target.dataset.robotSetting) {
      const el = event.target;
      const value = el.localName === 'ha-switch' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
      el.blur(); this.setRobotSetting(el.dataset.robotSetting, value); return;
    }
    if (event.target.dataset.station) {
      const el = event.target;
      const value = el.localName === 'ha-switch' || el.type === 'checkbox' ? el.checked : el.value;
      el.blur(); this.setStationSetting(el.dataset.station, value); return;
    }
    if (this.busy || this.view.active) return;
    const el = event.target;
    if (el.dataset.planningSetting) {
      const field = this.planningSettings().find(field => field.key === el.dataset.planningSetting);
      const index = Number(el.value);
      const value = el.type === 'range' ? Number.isInteger(index) ? field?.options[index] : undefined : el.value;
      if (!field?.available || !field.options.includes(value)) return;
      this.planningDraft ??= {};
      if (value === field.value) delete this.planningDraft[field.key];
      else this.planningDraft[field.key] = value;
      if (el.type !== 'range') el.blur();
    } else if (el.dataset.room) {
      this.selected = this.selected.filter(id => id !== el.dataset.room);
      if (el.checked) this.selected.push(el.dataset.room);
    } else if (el.dataset.setting && el.dataset.roomId) {
      const room = this.model.rooms.find(r => r.roomId === el.dataset.roomId);
      const field = room?.settings?.[el.dataset.setting];
      const value = el.type === 'range' ? field?.options[Number(el.value)] : el.value;
      if (!field?.options.includes(value)) return;
      const values = this.settingDraft[room.roomId] ??= {};
      if (value === field.value) delete values[el.dataset.setting];
      else values[el.dataset.setting] = value;
      if (!Object.keys(values).length) delete this.settingDraft[room.roomId];
      // Release the native select before rendering to avoid restoring its picker focus.
      el.blur();
    }
    else return;
    this.updateDirty(); this.message = ''; this.error = false; this.render();
  }
  onClick(event) {
    if (this.mapClick(event) || this._mapRequest) return;
    if (this.scheduleClick(event)) return;
    if (event.target.classList?.contains("consumables-overlay")) { this.toggleConsumables(false); return; }
    const el = event.target.closest('button, ha-button');
    if (el?.dataset.action === 'dismiss-notice') {
      this._dismissedNotice = this._noticeText;
      this.updateHeaderNotice();
      const target = ['.robot-warning', '.consumables-info'].map(selector => this.shadowRoot.querySelector(selector))
        .find(control => control && !control.disabled && !control.closest('[hidden], [inert]')
          && control.getClientRects().length && getComputedStyle(control).visibility === 'visible');
      target?.focus({ preventScroll: true });
      return;
    }
    if (['dismiss-fault', 'open-fault'].includes(el?.dataset.action)) {
      this._headerFaultDismissed = el.dataset.action === 'dismiss-fault';
      this.updateStatus();
      const focusTarget = !this._headerFaultDismissed ? '.header-fault .header-fault-close'
        : this.shadowRoot.querySelector('.header-notice')?.hidden === false
          ? '[data-action="dismiss-notice"]' : '.robot-warning';
      this.shadowRoot.querySelector(focusTarget)?.focus({ preventScroll: true });
      return;
    }
    if (el?.dataset.stationAction) {
      if (!el.disabled && !el.hasAttribute('disabled')) this.setStationSetting(el.dataset.stationAction, undefined, true);
      return;
    }
    if (el?.dataset.action === 'consumables') { this.toggleConsumables(true); return; }
    if (el?.dataset.action === 'close-consumables') { this.toggleConsumables(false); return; }
    if (el?.dataset.infoTab) { this.infoTab = el.dataset.infoTab; this.updateConsumables(); return; }
    if (this.consumablesOpen) return;
    if (!el || el.disabled || this.busy || this.controlBusy) return;
    if (this.scheduleSending && !(this.view.active && ['pause','start','return_to_base'].includes(el.dataset.control))) return;
    if (el.dataset.option !== undefined) {
      this.onChange({ target: { dataset: el.dataset, value: el.dataset.option, blur() {} } });
      return;
    }
    if (['zones','rooms','schedules'].includes(el.dataset.action) && !this.view.active) {
      if (el.dataset.action === 'zones' && !this.supportsZone) return;
      if (el.dataset.action === 'schedules' && !this.getScheduleState().supported) return;
      const zone = this.shadowRoot.querySelector('dyson-planner-zone');
      if (zone?.sending) return;
      if (zone) this.zoneDraft = zone.snapshot();
      this.zoneView = el.dataset.action === 'zones'; this.schedulesView = el.dataset.action === 'schedules'; this.requestedPlan = null; this.render(); return;
    }
    if (el.dataset.control) { this.control(el.dataset.control); return; }
    if (this.view.active) return;
    if (el.dataset.expand !== undefined) {
      const id = el.dataset.expand;
      if (this.expanded.has(id)) this.expanded.delete(id);
      else {
        if (this.config.theme === 'modern') this.expanded.clear();
        this.expanded.add(id);
      }
    } else if (el.dataset.action === 'reset') this.resetDraft();
    else if (el.dataset.action === 'start') { this.start(); return; }
    else if (el.dataset.action === 'save') { this.save(); return; }
    this.render();
  }
  async start() {
    if (this._mapRequest) return;
    if (this._previewDialog || this.busy || this.view.active || !this.isConnected) return;
    this.clearSessionEnd();
    this.busy = true; this.error = false;
    const config = this.config, context = this.draftContext;
    const detachRevision = this._detachRevision ?? 0;
    try {
      if (this.registryError) throw new UiError(this.registryError);
      const model = this.getModel();
      const planning = this.getRoomPlanningState(model);
      if (!planning.supportsStart || !planning.canStart) throw new UiError(planning.notice || model.startBlockReason || this.adapter.startBlockReason(this._hass, config.entity, this.registry) || 'This action is not available for the current robot state.');
      // Keep this request visible while the integration call is pending; the
      // robot can report an active session before callService resolves.
      this.requestedPlan = { rooms: this.selected.map(entity => {
        const room = model.rooms.find(candidate => roomKey(candidate) === entity);
        return { entity_id: room?.entity, room_id: room?.roomId, name: room?.name ?? entity };
      }) };
      this.message = this.adapter.roomStartMessage ?? 'Start clean'; this.render();
      const plan = await this.adapter.sendRoomDraft({ hass: this._hass, model, config, selected: [...this.selected], draft: this.settingDraft,
        planningDraft:structuredClone(this.planningDraft ?? {}), start: true, context, registry:this.registry,
        getCurrent:() => ({ hass:this._hass, registry:this.registry, config:this.config,
          active:this.isConnected && !this._previewDialog && (this._detachRevision ?? 0) === detachRevision }) });
      if (this.config !== config || !this.isConnected) return;
      if (context !== this.adapter.roomContext(this._hass, config.entity, this.registry)) {
        // The command may already be accepted; clear only its stale presentation.
        this.message = '';
        this.clearPendingStart(); this.clearSessionEnd();
        this.requestedPlan = null; this.sessionObserved = false;
        return;
      }
      this.settingDraft = {}; this.planningDraft = {};
      this.requestedPlan = plan;
      this.sessionObserved = this.adapter.cleaningView(this._hass, config.entity, false, this.registry).live;
      if (!this.sessionObserved) {
        this.pendingStart = true;
        this._startTimer = setTimeout(() => {
          this.pendingStart = false;
          if (!this.adapter.cleaningView(this._hass, config.entity, false, this.registry).active) {
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
      if (!this.adapter.cleaningView(this._hass, config.entity, false, this.registry).active) this.requestedPlan = null;
      this.error = true;
      if (this.config === config) this.message = uiMessage('{error} No automatic retry will be made.', { error });
    } finally { this.busy = false; this.render(); }
  }
  async save() {
    if (this._mapRequest) return;
    if (this._previewDialog || this.busy || this.view.active || !this.isConnected) return;
    const config = this.config, context = this.draftContext, draft = structuredClone(this.settingDraft);
    this.busy = true; this.saving = true; this.error = false;
    this.message = 'Saving room settings …'; this.render();
    try {
      const model = this.getModel(), planning = this.getRoomPlanningState(model);
      if (!planning.supportsSave || !planning.canSave) throw new UiError(planning.notice || 'This action is not available for the current robot state.');
      await this.adapter.sendRoomDraft({ hass: this._hass, model, config, draft, context, registry:this.registry });
      const deadline = Date.now() + 6000;
      while (true) {
        if (this.config !== config || !this.isConnected) return;
        if (context !== this.adapter.roomContext(this._hass, config.entity, this.registry)) {
          this.message = '';
          return;
        }
        const model = this.getModel();
        if (Object.entries(draft).every(([id, fields]) => Object.entries(fields).every(([key, value]) => model.rooms.find(r => r.roomId === id)?.settings?.[key]?.value === value))) break;
        if (Date.now() >= deadline) throw new UiError('Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.settingDraft = {}; this.model = this.getModel(); this.updateDirty();
      this.baseline = this.liveSignature();
      this.message = 'Settings sent. Home Assistant values updated. Room selection remains local.';
    } catch (error) {
      if (this.config === config) { this.error = true; this.message = error; }
    } finally { this.busy = false; this.saving = false; this.render(); }
  }
  canControl(action) {
    return this.adapter.vacuumEntries(this.registry ?? [], this._hass).some(entry => entry.entity_id === this.config.entity)
      && this.adapter.canControl(this._hass, this.config.entity, action, this.registry);
  }
  async control(action) {
    if (this._previewDialog || this.busy || this.controlBusy || !this.isConnected || !this.canControl(action)) return;
    const entity = this.config.entity;
    this.controlBusy = true; this.message = ''; this.error = false; this.render();
    try {
      await this.adapter.controlCleaning(this._hass, entity, action, this.registry);
      if (this.config.entity !== entity) return;
      this.message = '';
    } catch (error) {
      if (this.config.entity === entity) { this.error = true; this.message = error; }
    } finally { this.controlBusy = false; this.render(); }
  }
  consumablesHtml() {
    return `<div class="consumables-overlay" hidden><section class="consumables-panel" role="dialog" aria-modal="true" aria-label="${this.ht("Robot information")}"><div class="info-toolbar"><div class="info-tabs" role="tablist" aria-label="${this.ht("Robot information")}"><button id="tab-station" role="tab" data-info-tab="station" aria-controls="panel-station">${this.ht("Station")}</button><button id="tab-robot" role="tab" data-info-tab="robot" aria-controls="panel-robot">${this.ht("Robot")}</button><button id="tab-consumables" role="tab" data-info-tab="consumables" aria-controls="panel-consumables" title="${this.ht("Consumables")}">${this.ht("Supplies")}</button></div><button class="consumables-close" data-action="close-consumables" data-focus="consumables-close" aria-label="${this.ht("Close information")}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></div><div id="panel-station" role="tabpanel" aria-labelledby="tab-station"><div class="station-rows"></div><p class="station-message notice" role="status" aria-live="polite"></p></div><div id="panel-robot" role="tabpanel" aria-labelledby="tab-robot" hidden><div class="robot-settings"></div><p class="robot-message notice error" role="status" hidden></p></div><div id="panel-consumables" role="tabpanel" aria-labelledby="tab-consumables" hidden><div class="consumables-rows"></div></div></section></div>`;
  }
  toggleConsumables(open) {
    this.consumablesOpen = open;
    if (open) { this.infoTab = this.adapter.infoTabs?.[0] ?? 'station'; this.robotMessage = ''; this._robotMessageContext = {}; }
    this.updateConsumables();
    this.shadowRoot.querySelector(open ? '.consumables-close' : '.consumables-info')?.focus();
  }
  updateConsumables() {
    const root = this.shadowRoot;

    const rows = this.adapter.consumableStatus(this._hass, this.registry, this.config.entity).filter(row => row.supported);
    const settings = this.adapter.stationSettings(this._hass, this.registry, this.config.entity).filter(field => field.supported);
    const solution = rows.find(row => row.type === 'cleaningSolution');
    this.updateStationSettings(settings, solution?.refillStatus);
    this.updateRobotSettings();
    const warning = rows.some(row => row.level === 'low');
    const button = root.querySelector('.consumables-info');
    button.hidden = this.adapter.infoTabs?.length === 0;
    button.classList.toggle('attention', warning);
    root.querySelector('#tab-consumables').classList.toggle('attention', warning);
    button.setAttribute('aria-label', this.t(warning ? 'Consumables: replacement needed soon' : 'Robot information'));
    button.title = this.t(warning ? 'Consumables: replacement needed soon' : 'Robot information');
    button.setAttribute('aria-expanded', String(!!this.consumablesOpen));
    root.querySelector('.consumables-overlay').hidden = !this.consumablesOpen;
    root.querySelector('.planner-content').inert = !!this.consumablesOpen || !!this.scheduleDialog;
    const content = rows.map(row => {
      if (row.type === 'cleaningSolution') {
        const ready = row.text === 'Ready to use', refill = row.text === 'Refill required';
        const setting = settings.find(field => field.key === 'cleaning_solution');
        const usage = setting?.available ? (setting.value === 'on' ? 'Enabled' : 'Disabled') : 'Status unavailable';
        const icon = ready ? 'mdi:check' : refill ? 'mdi:water-alert-outline' : 'mdi:help-circle-outline';
        return `<div class="consumable-row consumable-solution"><div class="consumable-label"><span>${this.ht(row.name)}</span><span class="consumable-value">${this.ht(usage)}</span></div><span class="consumable-chip ${ready ? 'ready' : refill ? 'refill' : 'unknown'}"><ha-icon icon="${icon}" aria-hidden="true"></ha-icon><span>${row.remaining === null ? this.ht(row.text) : this.ht('{percent}% remaining', { percent: row.remaining })}</span></span></div>`;
      }
      return `<div class="consumable-row"><div class="consumable-label"><span>${this.ht(row.name)}</span><span class="consumable-value">${row.remaining === null ? this.ht(row.text) : this.ht('{percent}% remaining', { percent: row.remaining })}</span></div>${row.remaining === null ? '' : `<div class="consumable-track" role="meter" aria-label="${this.ht('{name} remaining life', { name: this.t(row.name) })}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.remaining}"><span class="consumable-fill ${row.level}" style="width:${row.remaining}%"></span></div>`}</div>`;
    }).join('');
    const host = root.querySelector('.consumables-rows');
    if (host.innerHTML !== content) host.innerHTML = content;
    if (this.consumablesOpen && !root.querySelector('.consumables-panel').contains(root.activeElement)) root.querySelector('.consumables-close').focus();
  }
  settingSwitchHtml(group, field, attrs) {
    const request = this._settingSwitchRequest;
    const pending = request?.group === group && request.key === field.key;
    return `<span class="setting-switch ${pending ? 'pending' : ''}" aria-busy="${pending}"><ha-switch ${attrs} ${field.value === 'on' ? 'checked' : ''}></ha-switch>${pending ? `<span class="setting-switch-spinner" role="status" aria-label="${this.ht('Updating setting …')}"></span>` : ''}</span>`;
  }
  settingSwitchCurrent(request) {
    return this.isConnected && !request.cancelled && this.config === request.config && this._detachRevision === request.detach;
  }
  settingSwitchConfirmed(request) {
    const fields = request.group === 'robot' ? this.adapter.robotSettings(this._hass,this.registry,this.config.entity)
      : this.adapter.stationSettings(this._hass,this.registry,this.config.entity);
    return switchSettingConfirmed(this._hass,this.registry,fields.find(field => field.key === request.key),request);
  }
  settingSwitchMessage(request, message, error = false) {
    if (request.group === 'robot') {
      if (request.messageContext !== this._robotMessageContext) return false;
      this.robotMessage = message;
    } else { this.stationMessage = message; this.stationError = error; }
    return true;
  }
  cancelSettingSwitch() {
    const request = this._settingSwitchRequest;
    if (request) {
      request.cancelled = true; request.confirm?.('cancelled'); clearTimeout(request.timer);
      this._settingSwitchRequest = null; this.stationBusy = false;
    }
    this._settingSwitchUnconfirmed = {};
  }
  reconcileSettingSwitch() {
    const request = this._settingSwitchRequest;
    if (request?.confirm && this.settingSwitchCurrent(request) && this.settingSwitchConfirmed(request)) request.confirm('confirmed');
    for (const [group,late] of Object.entries(this._settingSwitchUnconfirmed ?? {})) {
      const message = group === 'robot' ? this.robotMessage : this.stationMessage;
      if (!this.settingSwitchCurrent(late.request) || message !== late.notice) { delete this._settingSwitchUnconfirmed[group]; continue; }
      if (this.settingSwitchConfirmed(late.request)) {
        this.settingSwitchMessage(late.request,''); delete this._settingSwitchUnconfirmed[group];
      }
    }
  }
  waitForSettingSwitch(request) {
    if (this.settingSwitchConfirmed(request)) return Promise.resolve('confirmed');
    return new Promise(resolve => {
      request.confirm = result => { clearTimeout(request.timer); request.confirm = null; resolve(result); };
      request.timer = setTimeout(() => request.confirm?.('timeout'),10000);
    });
  }
  async sendSettingSwitch(group, field, value, send) {
    const entry = this.registry.find(row => row.entity_id === field.entity);
    const request = {group,key:field.key,entity:field.entity,value:value ? 'on' : 'off',
      uniqueId:entry?.unique_id,deviceId:entry?.device_id,platform:entry?.platform,
      config:this.config,detach:this._detachRevision,messageContext:this._robotMessageContext};
    this._settingSwitchRequest = request; this.stationBusy = true;
    this._settingSwitchUnconfirmed ??= {}; delete this._settingSwitchUnconfirmed[group];
    this.settingSwitchMessage(request,''); this.updateConsumables();
    try {
      await send();
      if (!this.settingSwitchCurrent(request)) return;
      const result = await this.waitForSettingSwitch(request);
      if (!this.settingSwitchCurrent(request) || result === 'cancelled') return;
      if (result === 'timeout' && !this.settingSwitchConfirmed(request)) {
        const notice = uiMessage('The setting change has not been confirmed by Home Assistant. Check the robot before trying again.');
        if (this.settingSwitchMessage(request,notice,true)) this._settingSwitchUnconfirmed[group] = {request,notice};
      }
    } catch (error) {
      if (this.settingSwitchCurrent(request)) this.settingSwitchMessage(request,error,true);
    } finally {
      if (this._settingSwitchRequest === request) {
        this._settingSwitchRequest = null; this.stationBusy = false;
        if (this.settingSwitchCurrent(request)) {
          this.updateConsumables();
          if (this.consumablesOpen && this.infoTab === group && this.shadowRoot.activeElement?.classList.contains('consumables-close')) {
            const attr = group === 'robot' ? 'data-robot-setting' : 'data-station';
            this.shadowRoot.querySelector(`ha-switch[${attr}="${request.key}"]:not([disabled])`)?.focus({preventScroll:true});
          }
        }
      }
    }
  }
  async setRobotSetting(key, value) {
    if (this._mapRequest) return;
    if (this._previewDialog || this.stationBusy || this.busy || this.controlBusy || !this.consumablesOpen) return;
    const field = this.adapter.robotSettings(this._hass, this.registry, this.config.entity).find(field => field.key === key);
    if (field?.domain === 'switch' && field.available && field.enabled !== false && typeof value === 'boolean') {
      return this.sendSettingSwitch('robot',field,value,() => this.adapter.changeRobotSetting(this._hass,this.registry,this.config.entity,key,value));
    }
    this.stationBusy = true; this.robotMessage = ''; this.updateConsumables();
    const context = this._robotMessageContext;
    try { await this.adapter.changeRobotSetting(this._hass, this.registry, this.config.entity, key, value); }
    catch (error) { if (context === this._robotMessageContext) this.robotMessage = error; }
    finally { this.stationBusy = false; this.updateConsumables(); }
  }
  updateRobotSettings() {
    const fields = this.adapter.robotSettings(this._hass, this.registry, this.config.entity);
    const html = [['voice_prompts','volume'], ['child_lock'], ['do_not_disturb','do_not_disturb_start','do_not_disturb_end']].map(keys => {
      const rows = fields.filter(f => keys.includes(f.key) && f.supported).map(f => {
        const disabled = this._previewDialog || this.stationBusy || this.busy || this.controlBusy || !f.available || !f.enabled;
        const attrs = `data-robot-setting="${f.key}" aria-label="${this.ht(f.label)}" ${disabled ? 'disabled' : ''}`;
        const control = f.domain === 'switch' ? this.settingSwitchHtml('robot',f,attrs)
          : f.domain === 'number' ? `<div class="robot-volume"><input type="range" min="0" max="100" step="10" value="${f.available ? Number(f.value) : 0}" ${attrs}><output>${f.available ? `${Number(f.value)}%` : '?'}</output></div>`
          : `<input type="time" step="60" value="${f.available ? escapeHtml(f.value.slice(0,5)) : ''}" ${attrs}>`;
        return `<label class="station-row robot-row ${disabled ? 'robot-disabled' : ''}"><span>${this.ht(f.label)}</span>${control}</label>`;
      }).join('');
      return rows ? `<div class="robot-group">${rows}</div>` : '';
    }).join('');
    const host = this.shadowRoot.querySelector('.robot-settings');
    if (host._html !== html) { host.innerHTML = html; host._html = html; }
    const message = this.shadowRoot.querySelector('.robot-message');
    message.textContent = this.t(this.robotMessage || ''); message.hidden = !this.robotMessage;
  }
  async setStationSetting(key, value, action = false) {
    if (this._mapRequest) return;
    if (this._previewDialog || this.stationBusy || this.busy || this.controlBusy || !this.consumablesOpen) return;
    const field = !action && this.adapter.stationSettings(this._hass, this.registry, this.config.entity).find(field => field.key === key);
    if (field?.domain === 'switch' && field.available && typeof value === 'boolean') {
      return this.sendSettingSwitch('station',field,value,() => this.adapter.changeStationSetting(this._hass,this.registry,this.config.entity,key,value));
    }
    const entity = this.config.entity;
    this.stationBusy = true; this.stationMessage = ''; this.stationError = false;
    this.updateConsumables();
    try {
      if (action) await this.adapter.pressStationAction(this._hass, this.registry, entity, key);
      else await this.adapter.changeStationSetting(this._hass, this.registry, entity, key, value);
    } catch (error) {
      if (this.config.entity === entity) { this.stationMessage = error; this.stationError = true; }
    } finally { this.stationBusy = false; this.updateConsumables(); }
  }
  updateStationSettings(settings, refillStatus) {
    const root = this.shadowRoot;
    const allowedTabs = this.adapter.infoTabs ?? ['station', 'robot', 'consumables'];
    const tab = allowedTabs.includes(this.infoTab) ? this.infoTab : allowedTabs[0];
    this.infoTab = tab;
    for (const name of ['station', 'robot', 'consumables']) {
      const button = root.querySelector(`[data-info-tab="${name}"]`);
      button.hidden = !allowedTabs.includes(name);
      button.setAttribute('aria-selected', String(tab === name));
      button.tabIndex = tab === name ? 0 : -1;
      root.querySelector(`#panel-${name}`).hidden = tab !== name;
    }
    const indicators = Object.fromEntries(settings.map(field => [field.key, stationIndicator(field, refillStatus, this.language)]));
    const bar = root.querySelector('.station-indicators');
    const hidden = this.config.hidden_status_items;
    const barHtml = STATUS_BAR_ITEMS.filter(([key]) => !hidden.includes(key)).map(([key]) => indicators[key] || '').join('');
    const batteryVisible = !hidden.includes('battery');
    root.querySelector('.battery').hidden = !batteryVisible;
    root.querySelector('.station-status-bar').hidden = !this.config.show_status_bar || (!barHtml && !batteryVisible);
    if (bar._html !== barHtml) { bar.innerHTML = barHtml; bar._html = barHtml; }
    const html = settings.map(field => {
      const disabled = !!this._previewDialog || !field.available || this.stationBusy || this.busy || this.controlBusy;
      const attrs = `data-station="${field.key}" aria-label="${this.ht(field.label)}" ${disabled ? 'disabled' : ''}`;
      const control = field.domain === 'switch'
        ? this.settingSwitchHtml('station',field,attrs)
        : `<select ${attrs}>${!field.options.includes(field.value) ? `<option value="">${this.ht("Unavailable")}</option>` : ''}${field.options.map(v => `<option value="${escapeHtml(v)}" ${v === field.value ? 'selected' : ''}>${this.ht(v)}</option>`).join('')}</select>`;
      return `<label class="station-row ${field.domain}"><span class="station-label">${indicators[field.key]}<span>${this.ht(field.label)}${!field.available ? `<small>${this.ht("Unavailable")}</small>` : ''}</span></span>${control}</label>`;
    }).join('');
    const actions = this.adapter.stationActions(this._hass, this.registry, this.config.entity).filter(action => action.supported).map(action => {
      const disabled = !!this._previewDialog || !action.available || this.stationBusy || this.busy || this.controlBusy;
      return `<div class="station-row station-action"><span>${this.ht(action.label)}${!action.available ? `<small>${this.ht("Unavailable")}</small>` : ''}</span><ha-button appearance="plain" size="s" data-station-action="${action.key}" aria-label="${this.ht(action.label)}" ${disabled ? 'disabled' : ''}>${this.ht("Press")}</ha-button></div>`;
    }).join('');
    const content = html + actions;
    const host = root.querySelector('.station-rows');
    if (host._stationHtml !== content) { host.innerHTML = content; host._stationHtml = content; }
    const message = root.querySelector('.station-message');
    message.textContent = this.t(this.stationMessage);
    message.hidden = !this.stationMessage;
    message.classList.toggle('error', !!this.stationError);
  }
  headerHtml() {
    const name = this.adapter.robotTelemetry(this._hass, this.config.entity, undefined, this.registry).name;
    const subtitle = typeof name === 'string' && name.trim() ? name : this.config.entity;
    const illustrated = this.config.header_icon_style === 'integration' && this.adapter.supportsIntegrationIcon !== false;
    return `<header><div class="station-status-bar"><div class="station-indicators"></div><div class="battery" role="img"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="1" y="3" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="29" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect class="battery-fill" x="4" y="6" width="0" height="8" rx="1" fill="currentColor"/><path class="battery-bolt" d="M17 1 9 11h6l-2 8L23 8h-7Z" fill="var(--dp-bg)" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" hidden/></svg><span class="battery-value" aria-hidden="true" hidden></span></div></div><div class="header-main"><div class="robot ${illustrated ? 'robot-integration' : ''}">${illustrated ? `<svg class="robot-illustration" viewBox="0 0 50 50" aria-hidden="true"><defs><radialGradient id="robot-beam-gradient" gradientUnits="userSpaceOnUse" cx="25" cy="25" r="46"><stop offset=".40" stop-color="#39ff14" stop-opacity=".75"/><stop offset=".62" stop-color="#65ff39" stop-opacity=".42"/><stop offset=".85" stop-color="#65ff39" stop-opacity=".12"/><stop offset="1" stop-color="#65ff39" stop-opacity="0"/></radialGradient><filter id="robot-beam-soft" x="-35%" y="-20%" width="170%" height="150%"><feGaussianBlur stdDeviation="1.2"/></filter></defs><path class="robot-beam" d="M25 25 L2 -15 Q25 -27 48 -15 Z" fill="url(#robot-beam-gradient)" filter="url(#robot-beam-soft)" hidden/><circle cx="25" cy="26" r="22" fill="#000" opacity=".18"/><circle cx="25" cy="25" r="21" fill="#3a3a40" stroke="#e7e9ed" stroke-width="1.5"/><circle cx="25" cy="25" r="18" fill="#45454e"/><path class="robot-bumper" d="M6.8 14.5 A21 21 0 0 1 43.2 14.5" fill="none" stroke="#64646d" stroke-width="4"/><circle cx="25" cy="17" r="6" fill="#c8c8cd"/><circle cx="25" cy="17" r="2.6" fill="#39ff14"/><rect class="robot-dock" x="9" y="44" width="32" height="7" rx="2.5" fill="#3a3a40" stroke="#c8c8cd" stroke-width="1.2" hidden/></svg>` : '<ha-icon icon="mdi:robot-vacuum"></ha-icon>'}${this.config.theme === 'modern' ? `<button class="robot-warning" data-action="open-fault" aria-label="${this.ht('Show robot error')}" hidden><ha-icon icon="mdi:alert" aria-hidden="true"></ha-icon></button>` : ''}</div><div class="header-title"><h2>${escapeHtml(this.config.title || this.t('Plan a clean'))}</h2><p>${escapeHtml(subtitle)}</p></div><div class="header-buttons">${this.mapPickerHtml()}<button class="consumables-info" data-action="consumables" data-focus="consumables-info" aria-label="${this.ht("Consumables")}" aria-haspopup="dialog" aria-expanded="false" title="${this.ht("Consumables")}">${this.ht("Info")}</button></div>${this.config.theme === 'modern' ? `<section class="header-fault" aria-label="${this.ht('Robot needs attention')}" hidden><div class="header-fault-copy" tabindex="0" role="status"><strong>${this.ht('Robot needs attention')}</strong><p class="header-fault-detail"></p></div><button class="header-fault-close" data-action="dismiss-fault" aria-label="${this.ht('Dismiss error message')}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></section>` : ''}<section class="header-notice" hidden><div class="header-notice-copy" role="status" aria-live="polite"></div><button class="header-fault-close" data-action="dismiss-notice" aria-label="${this.ht('Close')}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></section></div></header>`;
  }
  updateBattery() {
    const vacuum = this.adapter.robotTelemetry(this._hass, this.config.entity, this.model.cameraEntity, this.registry);
    const cleaning = vacuum.cleaning;
    const bumper = this.shadowRoot.querySelector('.robot-bumper');
    if (bumper) {
      const connected = this._hass?.connected !== false && vacuum.available;
      const color = vacuum.bumperColor;
      const validColor = typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color);
      // HA's error state already excludes informational robot fault codes.
      const phase = !connected ? 'unavailable' : vacuum.state === 'error' ? 'fault'
        : vacuum.state === 'paused' ? 'paused' : cleaning ? 'cleaning' : 'idle';
      bumper.dataset.state = phase;
      bumper.classList.toggle('pulsing', phase === 'fault' || phase === 'paused');
      bumper.setAttribute('stroke', phase === 'cleaning' && validColor ? color
        : phase === 'unavailable' || phase === 'cleaning' ? '#cdcdd4' : '#64646d');
    }
    this.shadowRoot.querySelector('.robot-beam')?.toggleAttribute('hidden', !cleaning);
    this.shadowRoot.querySelector('.robot-dock')?.toggleAttribute('hidden', this._hass?.states?.[this.config.entity]?.state !== 'docked');
    const state = this.adapter.batteryStatus(this._hass, this.model);
    const element = this.shadowRoot.querySelector('.battery');
    element.dataset.level = state.level;
    const battery = state.percent === null ? this.t('Battery level unavailable') : this.t('Battery: {percent}%', { percent: state.percent });
    const charge = this._hass?.states?.[this.model.chargingEntity];
    const charging = this._hass?.connected !== false && available(charge) && ['on', 'off'].includes(charge.state) ? this.t(charge.state === 'on' ? 'Charging' : 'Not charging') : this.t('Charging status unavailable');
    const label = this.t('{battery}. {charging}.', { battery, charging });
    element.title = label; element.setAttribute('aria-label', label);
    const percentage = element.querySelector('.battery-value');
    percentage.hidden = !this.config.show_battery_percentage || state.percent === null;
    percentage.textContent = percentage.hidden ? '' : `${state.percent}%`;
    element.querySelector('.battery-fill').setAttribute('width', String((state.percent ?? 0) / 5));
    element.querySelector('.battery-bolt').toggleAttribute('hidden', !state.charging);
  }
  statusHtml() {
    return `<div class="activity-status" role="status" aria-live="polite" hidden><ha-icon class="activity-icon" aria-hidden="true"></ha-icon><div class="activity-copy"><span class="activity-heading"><span class="activity-text"></span><span class="activity-remaining" hidden></span></span><span class="activity-fault" hidden></span><span class="activity-start-block" hidden></span><div class="drying-progress" role="progressbar" aria-label="${this.ht("Drying time remaining")}" aria-valuemin="0" aria-valuemax="100" hidden><span class="drying-progress-fill"></span></div></div><span class="drying-control" hidden><button class="cancel-drying" data-control="cancel_drying" data-focus="cancel-drying" disabled aria-label="${this.ht("Cancel drying")}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></span></div>`;
  }
  updateHeaderNotice() {
    const root = this.shadowRoot;
    const overlay = root.querySelector('.header-notice');
    if (!overlay) return;
    const child = root.querySelector('dyson-planner-zone, dyson-planner-map');
    const text = this.t(this.message) || child?.headerMessage || this._plannerNotice || '';
    if (text !== this._noticeText) { this._noticeText = text; this._dismissedNotice = ''; }
    const faultOpen = root.querySelector('.header-fault')?.hidden === false;
    const open = !!text && text !== this._dismissedNotice && !faultOpen;
    overlay.hidden = !open;
    overlay.classList.toggle('error', !!this.message && !!this.error);
    overlay.querySelector('.header-notice-copy').textContent = text;
    for (const selector of ['.robot', '.header-title h2', '.header-title p', '.header-buttons']) {
      const item = root.querySelector(selector);
      if (item) { item.inert = open || faultOpen; item.style.visibility = open || faultOpen ? 'hidden' : ''; }
    }
  }
  updateStatus(plannerNotice = this._plannerNotice ?? '') {
    this.applyMapLock();
    this._plannerNotice = plannerNotice;
    let status = this.adapter.activityStatus(this._hass, this.config.entity, (this.busy && !this.saving) || this.pendingStart, this.registry);
    const modern = this.config.theme === 'modern';
    const state = this._hass?.states?.[this.config.entity]?.state;
    if (modern && !status) {
      if (state === 'docked') status = { text: 'Docked', icon: 'mdi:home-import-outline' };
      else if (state === 'idle') status = { text: 'Idle', icon: 'mdi:robot-vacuum' };
    }
    if (modern) {
      const vacuum = this.adapter.robotTelemetry(this._hass, this.config.entity, this.model.cameraEntity, this.registry);
      const activeFault = state === 'error' && this._hass?.connected !== false;
      const description = typeof vacuum.fault === 'string' ? vacuum.fault.trim() : '';
      const key = activeFault ? JSON.stringify([this.config.entity, vacuum.faultCode ?? null, description]) : '';
      if (key !== this._headerFaultKey) { this._headerFaultKey = key; this._headerFaultDismissed = false; }
      const overlay = this.shadowRoot.querySelector('.header-fault');
      const open = !!key && !this._headerFaultDismissed;
      overlay.hidden = !open;
      overlay.querySelector('.header-fault-detail').textContent = description || this.t('Check the robot or the Dyson app for details.');
      const warning = this.shadowRoot.querySelector('.robot-warning');
      warning.hidden = !key;
      warning.setAttribute('aria-expanded', String(open));
      // Leave the measured header layout intact, but prevent keyboard access behind the overlay.
      for (const selector of ['.robot', '.header-title h2', '.header-title p', '.header-buttons']) {
        const item = this.shadowRoot.querySelector(selector);
        item.inert = open;
        item.style.visibility = open ? 'hidden' : '';
      }
      if (activeFault) {
        // The generic error state does not prove docking or a live cleaning phase.
        status = this.adapter.dockActivity(this._hass, this.config.entity, this.registry)
          ?? { text: 'Status unavailable', icon: 'mdi:help-circle-outline' };
      }
    }
    const row = this.shadowRoot.querySelector('.activity-status');
    row.hidden = !status;
    const compact = modern;
    row.classList.toggle('compact-status', compact);
    row.classList.toggle('has-drying', !!status?.drying);
    row.querySelector('.activity-text').textContent = this.t(status?.text);
    // Display the integration's current explanation without retaining or inferring faults.
    const fault = this.adapter.robotTelemetry(this._hass, this.config.entity, undefined, this.registry).fault;
    const detail = status?.text === 'Robot needs attention' && typeof fault === 'string' ? fault.trim() : '';
    const faultText = row.querySelector('.activity-fault');
    faultText.textContent = detail;
    faultText.hidden = modern || !detail;

    const blockNote = row.querySelector('.activity-start-block');
    const block = this.adapter.startBlockReason(this._hass, this.config.entity, this.registry);
    blockNote.hidden = this.view.active || !block || block === status?.text || this.adapter.dockBlocksStart(this._hass, this.config.entity, this.registry);
    blockNote.textContent = this.t(block);
    row.querySelector('.activity-icon').setAttribute('icon', status?.icon ?? 'mdi:robot-vacuum');
    row.querySelector('.drying-control').hidden = !status?.drying || this.adapter.supportsDryingCancellation === false;
    const remaining = row.querySelector('.activity-remaining');
    const wantsRemaining = status?.remaining ?? status?.drying;
    const time = wantsRemaining ? this.adapter.dryingRemainingTime(this._hass, this.config.entity, this.registry) : null;
    const showRemaining = wantsRemaining && (status?.drying || time !== null);
    remaining.hidden = !showRemaining;
    remaining.textContent = compact ? ` · ${time ?? this.t('Unavailable')}` : time === null ? this.t('Remaining time: unavailable') : this.t('Remaining time: {time} (hh:mm)', { time });
    row.querySelector('.activity-copy').title = [this.t(status?.text), showRemaining ? remaining.textContent : '', blockNote.hidden ? '' : blockNote.textContent].filter(Boolean).join(' ');
    const progress = row.querySelector('.drying-progress');
    const percent = status?.drying ? this.adapter.dryingRemainingPercent(this._hass, this.config.entity, this.registry) : null;
    progress.hidden = percent === null;
    if (percent !== null) {
      progress.setAttribute('aria-valuenow', String(Math.round(percent)));
      progress.setAttribute('aria-valuetext', this.t('Remaining time: {time} (hh:mm)', { time }));
      progress.querySelector('.drying-progress-fill').style.width = `${percent}%`;
    } else {
      progress.removeAttribute('aria-valuenow');
      progress.removeAttribute('aria-valuetext');
    }
    const cancel = row.querySelector('.cancel-drying');
    const supported = this.canControl('cancel_drying');
    cancel.disabled = !!this._previewDialog || this.busy || this.controlBusy || !supported;
    this.updateHeaderNotice();
    cancel.title = this.t(supported ? 'Cancel drying' : 'Drying cancellation requires a connected robot and the integration cancel_drying action.');
  }
  renderSession(view) {
    const h = escapeHtml;
    // Keep the map element mounted across status and message updates so polling,
    // the last good image and in-flight requests are independent of card renders.
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<section class="session"><ul class="requested"></ul></section>${this.showSessionMap ? `<div class="map-section">${this.config.theme !== 'modern' ? `<div class="map-title">${this.ht("Cleaning map")}</div><p class="map-caption">${this.ht("Refreshes about every 5 seconds")}</p>` : ''}<dyson-planner-map></dyson-planner-map></div>` : ''}<footer class="session-footer"><div class="actions session-actions"><button class="session-toggle" data-control="pause" data-focus="session-toggle"><ha-icon></ha-icon><span></span></button><button class="home" data-control="return_to_base" data-focus="home"><ha-icon icon="mdi:home-import-outline"></ha-icon>${this.ht("Home")}</button></div></footer></div>${this.consumablesHtml()}${this.scheduleOverlayHtml()}</ha-card>`, 'session');
    const root = this.shadowRoot;
    this.updateBattery();
    this.updateConsumables();
    this.updateStatus('');
    if (view.simulated && this.config.theme !== 'modern') root.querySelector('.activity-status').hidden = true;
    const title = root.querySelector('.header-title h2');
    title.classList.add('session-title');
    title.textContent = this.t(view.simulated ? 'Cleaning session preview' : 'Cleaning session');
    const zone = this.requestedPlan?.zone;
    const unit = this.config.zone_dimension_unit === 'inch' ? 'in' : this.config.zone_dimension_unit === 'cm' ? 'cm' : this._hass?.config?.unit_system?.length;
    const chips = zone ? `<li>${this.ht('Zone')}: ${h(zoneDimensionText(zone.widthCm,zone.heightCm,unit))}</li>`
      : (this.requestedPlan?.rooms ?? []).map(r => `<li>${h(r.name)}</li>`).join('');
    const list = root.querySelector('.requested');
    if (list.innerHTML !== chips) list.innerHTML = chips;
    root.querySelector('.session').hidden = this.config.theme !== 'modern' && !chips;
    const paused = this._hass.states[this.config.entity]?.state === 'paused';
    const toggle = root.querySelector('.session-toggle');
    toggle.dataset.control = paused ? 'start' : 'pause';
    toggle.classList.toggle('resume', paused); toggle.classList.toggle('pause', !paused);
    toggle.querySelector('span').textContent = this.t(paused ? 'Resume' : 'Pause');
    toggle.querySelector('ha-icon').setAttribute('icon', paused ? 'mdi:play' : 'mdi:pause');
    for (const button of root.querySelectorAll('[data-control]')) {
      const supported = this.canControl(button.dataset.control);
      button.disabled = !!this._previewDialog || this.busy || this.controlBusy || !supported;
      button.title = supported ? '' : this.t('This action is not available in the current robot state.');
    }
    root.querySelector('dyson-planner-map')?.setOptions(this._hass, this.model.cameraEntity, this.config.camera_rotation, view.live, this.language, this.adapter);
  }
  positionModernPointer() {
    if (this.config?.theme !== 'modern') return;
    const scope = this.scheduleDialog ? this.shadowRoot.querySelector('.schedule-room-list') : this.shadowRoot.querySelector('.modern-rooms');
    const panel = scope?.querySelector('.fields:not([hidden])');
    const head = scope?.querySelector('.room.open .room-head');
    if (!panel || !head) return;
    const target = head.getBoundingClientRect(), bounds = panel.getBoundingClientRect();
    panel.style.setProperty('--pointer-y', `${target.top + target.height / 2 - bounds.top}px`);
    const fields = [...panel.children].filter(el => !el.classList.contains('mode-spacer'));
    fields.forEach(el => el.style.removeProperty('--field-shift'));
    const spacer = panel.querySelector('.mode-spacer');
    if (!spacer || fields.length !== 3 || getComputedStyle(spacer).display === 'none') return;
    // Keep half the spare space below three controls; distribute the rest between them.
    const css = getComputedStyle(panel);
    const gap = parseFloat(css.rowGap) || 0;
    const available = panel.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    const used = fields.reduce((sum, el) => sum + el.getBoundingClientRect().height, 0);
    const extra = Math.max(0, available - used - gap * 2);
    fields.forEach((el, i) => el.style.setProperty('--field-shift', `${extra * i / 4}px`));
  }
  planningSettingsHtml() {
    return this.planningSettings().map(field => {
      const value = this.planningDraft?.[field.key] ?? field.value;
      return `<section class="planning-setting" aria-label="${this.ht(field.label)}"><div class="planning-setting-head"><span>${this.ht(field.label)}</span><output>${this.ht(field.options.includes(value) ? value : 'Unavailable')}</output></div>${this.modernControl(field.key, this.t(field.label), {}, field, value, this.busy || !field.available, 'global', 'planning')}<p class="planning-setting-hint">${this.ht(field.hint)}</p></section>`;
    }).join('');
  }
  modernControl(key, label, room, field, value, disabled, n, scope = 'planner') {
    const h = escapeHtml, options = field.options;
    const attrs = scope === 'schedule' ? `data-schedule-room-setting="${key}" data-schedule-room="${h(room.roomId)}"`
      : scope === 'planning' ? `data-planning-setting="${h(key)}"` : `data-setting="${key}" data-room-id="${h(room.roomId)}"`;
    const focus = scope === 'schedule' ? `schedule-room-${room.roomId}-${key}` : `${key}-${n}`;
    const slider = scope === 'schedule' ? `schedule-slider-${key}-${room.roomId}` : `slider-${key}-${n}`;
    const unknown = scope === 'schedule' ? value || 'Stored settings not reported' : 'Unavailable';
    const name = scope === 'planning' ? label : `${label} ${room.name}`;
    const valid = options.includes(value);
    const blocked = disabled || !valid;
    const presentation = scope === 'planning' ? null : this.adapter.roomPresentation(room, {}, this.config).fields.find(field => field.key === key);
    if (presentation?.control === 'segments') {
      return `<div class="modern-control"><span class="field-label">${label}</span><div class="segments" role="group" aria-label="${h(name)}">${options.map((option, i) => `<button ${attrs} data-option="${h(option)}" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}" data-focus="${focus}-${i}" aria-pressed="${value === option}" ${disabled ? 'disabled' : ''}>${h(presentation.optionLabels?.[option] ?? this.t(option))}</button>`).join('')}</div></div>`;
    }
    const index = options.indexOf(value);
    return `<div class="modern-control">${scope === 'planning' ? '' : `<label class="field-label" for="${slider}">${label}</label>`}<div class="stepped-slider ${blocked ? 'disabled' : ''}"><div class="slider-ticks" aria-hidden="true">${options.map((_, i) => `<span class="slider-tick" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}"></span>`).join('')}</div><input id="${slider}" type="range" min="0" max="${options.length - 1}" step="1" value="${Math.max(0, index)}" aria-label="${h(name)}" aria-valuetext="${this.ht(valid ? value : unknown)}" ${attrs} data-focus="${focus}" ${blocked || options.length < 2 ? 'disabled' : ''}></div><div class="slider-options" style="--options:${options.length}">${options.map((option, i) => `<button ${attrs} data-option="${h(option)}" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}" data-focus="${focus}-${i}" aria-pressed="${value === option}" ${disabled ? 'disabled' : ''}>${this.ht(option)}</button>`).join('')}</div>${!valid ? `<span class="badge">${this.ht(unknown)}</span>` : ''}</div>`;
  }
  zoneStarted(dimensions) {
    const valid = dimensions && ['widthCm','heightCm'].every(key => Number.isFinite(dimensions[key]) && dimensions[key] > 0);
    this.zoneView = false; this.zoneDraft = null; this.requestedPlan = valid ? { zone: { ...dimensions } } : null; this.message = ''; this.error = false;
    this.clearPendingStart();
    if (!this.adapter.cleaningView(this._hass, this.config.entity, false, this.registry).live) {
      this.pendingStart = true;
      this._startTimer = setTimeout(() => {
        this.pendingStart = false;
        if (!this.adapter.cleaningView(this._hass, this.config.entity, false, this.registry).live) {
          this.error = true;
          this.message = 'The start was sent, but the robot has not reported an active session. Check its status before trying again.';
        }
        this.update();
      }, 30000);
    }
    this.update();
  }
  get supportsZone() { return this.adapter.supportsZoneDevice(this.registry, this.devices, this.config.entity); }
  planningTabsHtml() {
    const schedules = this.getScheduleState();
    const tabs = [['rooms','Rooms'], ...(this.supportsZone ? [['zones','Zone']] : []), ...(schedules.supported ? [['schedules','Schedules']] : [])];
    if (tabs.length === 1) return '';
    const current = this.schedulesView ? 'schedules' : this.zoneView ? 'zones' : 'rooms';
    return `<nav class="planning-tabs" role="tablist" aria-label="${this.ht('Cleaning selection')}">${tabs.map(([key,label]) => {
      const count = key === 'schedules' ? schedules.enabledCount : null;
      const counted = Number.isSafeInteger(count) && count >= 0;
      return `<button id="planning-tab-${key}" role="tab" data-action="${key}" aria-selected="${current === key}" aria-controls="planning-panel-${key}" tabindex="${current === key ? 0 : -1}" ${counted ? `aria-label="${this.ht('Schedules, active: {count}',{count})}" title="${this.ht('Active schedules: {count}',{count})}"` : ''}><span class="planning-tab-label">${this.ht(label)}${counted ? `<span class="schedule-count ${count === 0 ? 'is-zero' : ''} ${count > 99 ? 'capped' : ''}" aria-hidden="true">${count > 99 ? '99+' : count}</span>` : ''}</span></button>`;
    }).join('')}</nav>`;
  }
  renderZone() {
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}${this.planningTabsHtml()}${this.getScheduleState().supported ? '<div id="planning-panel-schedules" role="tabpanel" aria-labelledby="planning-tab-schedules" hidden></div>' : ''}<div id="planning-panel-rooms" role="tabpanel" aria-labelledby="planning-tab-rooms" hidden></div><dyson-planner-zone id="planning-panel-zones" role="tabpanel" aria-labelledby="planning-tab-zones"></dyson-planner-zone></div>${this.consumablesHtml()}${this.scheduleOverlayHtml()}</ha-card>`, 'zone');
    const title = this.shadowRoot.querySelector('.header-title h2');
    if (title.textContent !== this.t('Zone cleaning')) title.textContent = this.t('Zone cleaning');
    this.updateBattery(); this.updateConsumables(); this.updateStatus('');
    const camera = this.model.cameraEntity;
    const trusted = this.adapter.trustedCamera(this.registry, this.config.entity, camera);
    this.shadowRoot.querySelector('dyson-planner-zone').setOptions({ hass:this._hass, vacuum:this.config.entity,
      adapter:this.adapter, camera, trusted, dimensionUnit:this.config.zone_dimension_unit, supported:this.supportsZone, capabilities:this.adapter.zoneDeviceOptions(this.model.rooms), draft:this.zoneDraft, theme:this.config.theme, rotation:this.config.camera_rotation, language:this.language, preview:!!this._previewDialog });
  }
  render() {
    if (!this.model) return;
    const view = this.view;
    if (this._previewDialog && zonePreviewOwners.has(this._previewDialog) && this.supportsZone) { this.renderZone(); return; }
    if (view.active && ((!this.zoneView && !this.schedulesView) || view.live)) {
      if (view.live) { this.zoneView = false; this.zoneDraft = null; }
      this.renderSession(view); return;
    }
    if (this.zoneView) { this.renderZone(); return; }
    if (this.schedulesView && this.getScheduleState().supported) { this.renderSchedules(styles); return; }
    this.schedulesView = false;
    const h = escapeHtml, model = this.model;
    const rooms = model.rooms.filter(r => !r.excluded);
    const external = this.dirty && !this.busy && this.baseline !== this.liveSignature();
    const planning = this.getRoomPlanningState();
    const hasChanges = Object.keys(this.settingDraft).length > 0;
    const modern = this.config.theme === 'modern';
    const roomHtml = rooms.map((room, n) => {
      const key = roomKey(room);
      const selected = this.selected.includes(key), order = this.selected.indexOf(key) + 1;
      const open = this.expanded.has(key || room.name);
      const disabled = this.busy || !room.available || !key;
      const valueOf = key => this.settingDraft[room.roomId]?.[key] ?? room.settings?.[key]?.value;
      const presentation = this.adapter.roomPresentation(room, this.settingDraft[room.roomId] ?? {}, this.config);
      const fields = presentation.fields.map(({ key, label:originalLabel, wide, control, omitted }) => {
        const label = this.t(originalLabel);
        if (omitted && !modern) return '';
        const reserve = html => omitted ? `<div class="mode-spacer" inert aria-hidden="true">${html}</div>` : html;
        const field = room.settings?.[key];
        if (!field) return '';
        const fieldDisabled = disabled || !field.available;
        const value = valueOf(key), options = field?.options ?? [];
        if (modern && control !== 'select' && options.length) return reserve(this.modernControl(key, label, room, field, value, fieldDisabled, n));
        return reserve(`<label class="field ${wide ? 'mode' : ''}">${label}<select data-setting="${h(key)}" data-room-id="${h(room.roomId)}" data-focus="${h(key)}-${n}" aria-label="${label} ${h(room.name)}" ${fieldDisabled ? 'disabled' : ''}>${!options.includes(value) ? `<option value="">${this.ht("Unavailable")}</option>` : ''}${options.map(option => `<option value="${h(option)}" ${value === option ? 'selected' : ''}>${this.ht(option)}</option>`).join('')}</select></label>`);
      }).join('');
      const summary = !room.available ? this.ht(room.error || 'Unavailable') : presentation.summary ? this.ht(presentation.summary) : '';
      const issue = presentation.issue ? `<p class="badge mode">${this.ht(presentation.issue)}</p>` : '';
      const marker = selected ? planning.ordered ? order : '✓' : '';
      if (!fields && !issue) return `<section class="room room-plain ${selected ? 'selected' : ''}" style="--room-color:${ROOM_COLORS[n % ROOM_COLORS.length]}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(key)}" aria-label="${this.ht('Select {name}', {name:room.name})}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}>${modern ? `<span class="selection-circle" aria-hidden="true">${marker}</span>` : ''}<span class="room-settings-copy"><span class="name">${h(room.name)} ${!modern && selected && planning.ordered ? `<span class="status">(${order})</span>` : ''}</span>${summary ? `<span class="summary">${summary}</span>` : ''}</span></label></div></section>`;
      if (modern) {
        const colors = ROOM_COLORS;
        return `<section class="room ${selected ? 'selected' : ''} ${open ? 'open' : ''}" style="--room-color:${colors[n % colors.length]};--room-row:${n + 1}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(key)}" aria-label="${this.ht('Select {name}', { name: room.name })}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span class="selection-circle" aria-hidden="true">${marker}</span></label><button class="expand room-settings-toggle" data-focus="expand-${n}" data-expand="${h(key || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="${this.ht('Settings for {name}', { name: room.name })}"><span class="room-settings-copy"><span class="name">${h(room.name)}</span><span class="summary">${summary}</span></span><span aria-hidden="true">${open ? '⌃' : '›'}</span></button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${issue}</div></section>`;
      }
      return `<section class="room ${selected ? 'selected' : ''}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(key)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span><span class="name">${h(room.name)} ${selected && planning.ordered ? `<span class="status">(${order})</span>` : ''}</span><span class="summary">${summary}</span></span></label><button class="expand" data-focus="expand-${n}" data-expand="${h(key || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="${this.ht('Settings for {name}', { name: room.name })}"><span>${this.ht("Settings")}</span> ${open ? '⌃' : '⌄'}</button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${issue}</div></section>`;
    }).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}${this.planningTabsHtml()}${this.supportsZone ? '<div id="planning-panel-zones" role="tabpanel" aria-labelledby="planning-tab-zones" hidden></div>' : ''}${this.getScheduleState().supported ? '<div id="planning-panel-schedules" role="tabpanel" aria-labelledby="planning-tab-schedules" hidden></div>' : ''}<div ${this.supportsZone || this.getScheduleState().supported ? 'id="planning-panel-rooms" role="tabpanel" aria-labelledby="planning-tab-rooms"' : ''} class="rooms ${modern ? 'modern-rooms' : ''}" style="--room-count:${rooms.length}">${roomHtml}</div><div class="planning-settings">${this.planningSettingsHtml()}</div>${!rooms.length ? `<p class="empty">${this.ht("No enabled rooms found. Check the card configuration and room discovery.")}</p>` : ''}<footer>${this.adapter.planningHint ? `<p class="integration-hint notice">${this.ht(this.adapter.planningHint)}</p>` : ''}<div class="summary-line"><span>${this.ht('{selected} of {total} rooms selected', { selected: this.selected.length, total: rooms.length })}</span><span class="status ${this.dirty ? 'draft-status' : ''}">${this.dirty ? `<button class="discard-draft" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''} title="${this.ht("Discard draft")}" aria-label="${this.ht("Discard draft")}"><ha-icon icon="mdi:trash-can-outline" aria-hidden="true"></ha-icon></button>${this.ht('Local draft')}` : this.ht('From Home Assistant')}</span></div><div class="actions ${this.canOfferScheduleCreation() ? 'with-schedules' : ''}">${this.canOfferScheduleCreation() ? `<div class="room-secondary-actions"><button class="schedule-create" data-action="schedule-create" data-focus="schedule-create" aria-label="${this.ht('Create schedule')}" title="${this.ht('Create schedule')}" ${this._previewDialog || this.busy || !this.scheduleCreationReady() ? 'disabled' : ''}><ha-icon icon="mdi:calendar-plus" aria-hidden="true"></ha-icon></button>` : ''}${planning.supportsSave ? `<button data-action="save" data-focus="save" ${this._previewDialog || !hasChanges || this.busy || !planning.canSave ? 'disabled' : ''}>${this.ht(this.saving ? 'Saving …' : 'Save settings')}</button>` : ''}${this.canOfferScheduleCreation() ? '</div>' : ''}${planning.supportsStart ? `<button class="start" data-focus="start" data-action="start" ${this._previewDialog || this.selected.length === 0 || this.busy || !planning.canStart ? 'disabled' : ''}>${this.ht("Start clean")}</button>` : ''}</div></footer></div>${this.consumablesHtml()}${this.scheduleOverlayHtml()}</ha-card>`, 'planner');
    this.updateBattery();
    this.updateConsumables();
    const plannerNotice = planning.notice ? this.t(planning.notice)
      : external ? this.t('Settings changed outside this card. Your edited values remain in the local draft.') : '';
    this.updateStatus(plannerNotice);
    this.positionModernPointer();
  }
}

Object.assign(DysonCleaningPlannerCard.prototype, scheduleCardMethods, mapSelectionCardMethods);

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and per-room cleaning settings for Dyson Spot+Scrub.', preview: true });
