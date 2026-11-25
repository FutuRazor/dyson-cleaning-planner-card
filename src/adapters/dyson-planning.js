import { ROOM_FIELDS } from '../shared.js';

// Shared Dyson presentation policy. Native modes and field identities belong
// here; the card only renders the resulting descriptors.
export function dysonRoomPresentation(room, draft = {}, config = {}) {
  const mode = draft.cleaning_mode ?? room.settings?.cleaning_mode?.value;
  return {
    summary: mode ?? 'Room settings unavailable',
    issue: room.roomId ? null : 'Room ID unavailable. Check the updated integration and refresh rooms.',
    fields: Object.entries(ROOM_FIELDS).filter(([key]) => room.settings?.[key]).map(([key, label]) => ({
      key, label, wide: key === 'cleaning_mode',
      control: key === 'cleaning_mode' ? 'select' : key === 'mop_repetitions' ? 'segments' : 'slider',
      optionLabels: key === 'mop_repetitions' ? { 'One Pass':'1×', 'Two Passes':'2×' } : {},
      omitted: !config.always_show_all_settings &&
        ((mode === 'Vacuum' && key === 'water_level') || (mode === 'Mop' && key === 'cleaning_strategy')),
    })),
  };
}
