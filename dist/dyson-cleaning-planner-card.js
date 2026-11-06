/* Dyson Cleaning Planner Card v1.2.0 | MIT */
// English messages are also stable translation keys. Never use translated labels in action payloads.
const en = {
  "Plan a clean": "Plan a clean",
  "Cleaning session": "Cleaning session",
  "Cleaning session preview": "Cleaning session preview",
  "Info": "Info",
  "Settings": "Settings",
  "Station settings": "Station settings",
  "Consumables": "Consumables",
  "Robot information": "Robot information",
  "Close information": "Close information",
  "Consumables: replacement needed soon": "Consumables: replacement needed soon",
  "Cleaning mode": "Cleaning mode",
  "Vacuum Power": "Vacuum Power",
  "Water level": "Water level",
  "Clean repetitions": "Clean repetitions",
  "Vacuum": "Vacuum",
  "Mop": "Mop",
  "Vacuum and Mop": "Vacuum and Mop",
  "Vacuum then Mop": "Vacuum then Mop",
  "Auto": "Auto",
  "Boost": "Boost",
  "Quiet": "Quiet",
  "Quick": "Quick",
  "Very Low": "Very Low",
  "Low": "Low",
  "Medium": "Medium",
  "High": "High",
  "One Pass": "One Pass",
  "Two Passes": "Two Passes",
  "Hot water mopping": "Hot water mopping",
  "Hot water self-cleaning": "Hot water self-cleaning",
  "Extended roller preparation": "Extended roller preparation",
  "Cleaning solution": "Cleaning solution",
  "Self-cleaning frequency": "Self-cleaning frequency",
  "Roller drying duration": "Roller drying duration",
  "After each room": "After each room",
  "Every 15 minutes": "Every 15 minutes",
  "Every 30 minutes": "Every 30 minutes",
  "Only as needed": "Only as needed",
  "3 hours": "3 hours",
  "4 hours": "4 hours",
  "5 hours": "5 hours",
  "Empty dust bin": "Empty dust bin",
  "Wash mop roller": "Wash mop roller",
  "Dry mop roller": "Dry mop roller",
  "Press": "Press",
  "on": "on",
  "off": "off",
  "Brush bar": "Brush bar",
  "Mop roller": "Mop roller",
  "Side brushes": "Side brushes",
  "Robot filter": "Robot filter",
  "Dock filter": "Dock filter",
  "Ready to use": "Ready to use",
  "Refill required": "Refill required",
  "Enabled": "Enabled",
  "Disabled": "Disabled",
  "Status unavailable": "Status unavailable",
  "Unavailable": "Unavailable",
  "Not available": "Not available",
  "{percent}% remaining": "{percent}% remaining",
  "{name} remaining life": "{name} remaining life",
  "Save settings": "Save settings",
  "Start clean": "Start clean",
  "Saving …": "Saving …",
  "Discard draft": "Discard draft",
  "Local draft": "Local draft",
  "From Home Assistant": "From Home Assistant",
  "{selected} of {total} rooms selected": "{selected} of {total} rooms selected",
  "Select {name}": "Select {name}",
  "Settings for {name}": "Settings for {name}",
  "Room settings unavailable": "Room settings unavailable",
  "Room ID unavailable": "Room ID unavailable",
  "Room ID unavailable. Check the updated integration and refresh rooms.": "Room ID unavailable. Check the updated integration and refresh rooms.",
  "No enabled rooms found. Check the card configuration and room discovery.": "No enabled rooms found. Check the card configuration and room discovery.",
  "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.": "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.",
  "Settings changed outside this card. Your edited values remain in the local draft.": "Settings changed outside this card. Your edited values remain in the local draft.",
  "Pause": "Pause",
  "Resume": "Resume",
  "Home": "Home",
  "Cleaning map": "Cleaning map",
  "Refreshes about every 5 seconds": "Refreshes about every 5 seconds",
  "Drying time remaining": "Drying time remaining",
  "Cancel drying": "Cancel drying",
  "Remaining time: unavailable": "Remaining time: unavailable",
  "Remaining time: {time} (hh:mm)": "Remaining time: {time} (hh:mm)",
  "Drying cancellation requires a connected robot and the integration cancel_drying action.": "Drying cancellation requires a connected robot and the integration cancel_drying action.",
  "This action is not available in the current robot state.": "This action is not available in the current robot state.",
  "Robot unavailable": "Robot unavailable",
  "Robot needs attention": "Robot needs attention",
  "Paused": "Paused",
  "Cleaning mop roller": "Cleaning mop roller",
  "Drying mop roller": "Drying mop roller",
  "Emptying dust bin": "Emptying dust bin",
  "Vacuuming": "Vacuuming",
  "Mopping": "Mopping",
  "Vacuuming and mopping": "Vacuuming and mopping",
  "Cleaning": "Cleaning",
  "Returning / mapping": "Returning / mapping",
  "Robot disconnected": "Robot disconnected",
  "Mapping / navigation in progress": "Mapping / navigation in progress",
  "Returning to dock / finishing cleanup": "Returning to dock / finishing cleanup",
  "A cleaning job is still active": "A cleaning job is still active",
  "Waiting for the robot to be ready": "Waiting for the robot to be ready",
  "The integration is not ready to start a new clean": "The integration is not ready to start a new clean",
  "Wait for the dock cycle to finish before starting a clean": "Wait for the dock cycle to finish before starting a clean",
  "Waiting for a connection to the robot.": "Waiting for a connection to the robot.",
  "Cleaning session active": "Cleaning session active",
  "Cleaning session paused": "Cleaning session paused",
  "Robot returning": "Robot returning",
  "The integration is reporting a return or mapping operation.": "The integration is reporting a return or mapping operation.",
  "Check the robot or the Dyson app for details.": "Check the robot or the Dyson app for details.",
  "Starting clean": "Starting clean",
  "Waiting for the robot to report its status.": "Waiting for the robot to report its status.",
  "Waiting for robot status": "Waiting for robot status",
  "The robot is not reporting a ready state.": "The robot is not reporting a ready state.",
  "Battery and charging": "Battery and charging",
  "Battery level unavailable": "Battery level unavailable",
  "Battery: {percent}%": "Battery: {percent}%",
  "Charging": "Charging",
  "Not charging": "Not charging",
  "Charging status unavailable": "Charging status unavailable",
  "{battery}. {charging}.": "{battery}. {charging}.",
  "Live cleaning map": "Live cleaning map",
  "Loading cleaning map …": "Loading cleaning map …",
  "Waiting for an active robot status.": "Waiting for an active robot status.",
  "Camera unavailable.": "Camera unavailable.",
  "No map camera found. Select one in the card editor.": "No map camera found. Select one in the card editor.",
  "The camera image is not available yet.": "The camera image is not available yet.",
  "Map update unavailable.": "Map update unavailable.",
  "{message} Showing the last received image.": "{message} Showing the last received image.",
  "Language": "Language",
  "Automatic": "Automatic",
  "Dyson device": "Dyson device",
  "Select a device": "Select a device",
  "Title": "Title",
  "Theme": "Theme",
  "Classic": "Classic",
  "Modern": "Modern",
  "Unsupported settings": "Unsupported settings",
  "Show disabled": "Show disabled",
  "Hide": "Hide",
  "Always show all settings": "Always show all settings",
  "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.": "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.",
  "Status bar": "Status bar",
  "Show status bar": "Show status bar",
  "Visible status indicators": "Visible status indicators",
  "Show battery percentage": "Show battery percentage",
  "Show camera during a cleaning session": "Show camera during a cleaning session",
  "Turning this off removes the map and stops image requests from this card.": "Turning this off removes the map and stops image requests from this card.",
  "Map camera": "Map camera",
  "Auto-detect": "Auto-detect",
  "Map rotation": "Map rotation",
  "Rooms in this card": "Rooms in this card",
  "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.": "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.",
  "Move {name} up": "Move {name} up",
  "Move {name} down": "Move {name} down",
  "Refresh rooms": "Refresh rooms",
  "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.": "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.",
  "Could not read the entity registry. Check the connection and user permissions.": "Could not read the entity registry. Check the connection and user permissions.",
  "The Dyson device was not found in the entity registry.": "The Dyson device was not found in the entity registry.",
  "The Dyson room list is not currently available.": "The Dyson room list is not currently available.",
  "Room switch mapping is ambiguous": "Room switch mapping is ambiguous",
  "Multiple rooms map to the same switch.": "Multiple rooms map to the same switch.",
  "Select a vacuum entity.": "Select a vacuum entity.",
  "theme must be classic or modern.": "theme must be classic or modern.",
  "language must be auto, en or de.": "language must be auto, en or de.",
  "unsupported_settings must be disabled or hidden.": "unsupported_settings must be disabled or hidden.",
  "{key} must be a list of entity IDs.": "{key} must be a list of entity IDs.",
  "room_entities must map room names to switch entities.": "room_entities must map room names to switch entities.",
  "show_battery_percentage must be true or false.": "show_battery_percentage must be true or false.",
  "show_status_bar must be true or false.": "show_status_bar must be true or false.",
  "hidden_status_items must be a list of indicator keys.": "hidden_status_items must be a list of indicator keys.",
  "show_camera must be true or false.": "show_camera must be true or false.",
  "always_show_all_settings must be true or false.": "always_show_all_settings must be true or false.",
  "camera_rotation must be 0, 90, 180 or 270.": "camera_rotation must be 0, 90, 180 or 270.",
  "Select a camera entity.": "Select a camera entity.",
  "Home Assistant is not connected.": "Home Assistant is not connected.",
  "Update the Dyson integration: {action} is unavailable.": "Update the Dyson integration: {action} is unavailable.",
  "The robot is unavailable.": "The robot is unavailable.",
  "Start is only available when the Dyson is ready (docked or idle).": "Start is only available when the Dyson is ready (docked or idle).",
  "A room in your draft is unavailable or ambiguous. Review or discard the draft.": "A room in your draft is unavailable or ambiguous. Review or discard the draft.",
  "{setting} is no longer available for {room}.": "{setting} is no longer available for {room}.",
  "A selected room has no stable room ID. Refresh rooms and check the integration.": "A selected room has no stable room ID. Refresh rooms and check the integration.",
  "Select at least one room without duplicates.": "Select at least one room without duplicates.",
  "An action for this Dyson is already running in this browser.": "An action for this Dyson is already running in this browser.",
  "This action is not available for the current robot state.": "This action is not available for the current robot state.",
  "This station action is unavailable.": "This station action is unavailable.",
  "This station setting is unavailable.": "This station setting is unavailable.",
  "Invalid station switch value.": "Invalid station switch value.",
  "Invalid station option.": "Invalid station option.",
  "Sending room settings and start request …": "Sending room settings and start request …",
  "The start was sent, but the robot has not reported an active session. Check its status before trying again.": "The start was sent, but the robot has not reported an active session. Check its status before trying again.",
  "{error} No automatic retry will be made.": "{error} No automatic retry will be made.",
  "Saving room settings …": "Saving room settings …",
  "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.": "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.",
  "Settings sent. Home Assistant values updated. Room selection remains local.": "Settings sent. Home Assistant values updated. Room selection remains local."
};


// German display text. Entity names and protocol values are never rewritten.
const de = {
  "Plan a clean": "Reinigung planen",
  "Cleaning session": "Reinigung",
  "Cleaning session preview": "Reinigungsvorschau",
  "Info": "Info",
  "Settings": "Einstellungen",
  "Station settings": "Stationseinstellungen",
  "Consumables": "Verbrauchsmaterialien",
  "Robot information": "Roboterinformationen",
  "Close information": "Informationen schließen",
  "Consumables: replacement needed soon": "Verbrauchsmaterialien: baldiger Austausch erforderlich",
  "Cleaning mode": "Reinigungsmodus",
  "Vacuum Power": "Saugstufe",
  "Water level": "Wassermenge",
  "Clean repetitions": "Durchgänge",
  "Vacuum": "Saugen",
  "Mop": "Wischen",
  "Vacuum and Mop": "Saugen und Wischen",
  "Vacuum then Mop": "Erst saugen, dann wischen",
  "Auto": "Auto",
  "Boost": "Boost",
  "Quiet": "Leise",
  "Quick": "Schnell",
  "Very Low": "Sehr niedrig",
  "Low": "Niedrig",
  "Medium": "Mittel",
  "High": "Hoch",
  "One Pass": "Ein Durchgang",
  "Two Passes": "Zwei Durchgänge",
  "Hot water mopping": "Heißwasser-Wischen",
  "Hot water self-cleaning": "Heißwasser-Selbstreinigung",
  "Extended roller preparation": "Erweiterte Walzenvorbereitung",
  "Cleaning solution": "Reinigungsmittel",
  "Self-cleaning frequency": "Selbstreinigungsintervall",
  "Roller drying duration": "Walzentrocknungsdauer",
  "After each room": "Nach jedem Raum",
  "Every 15 minutes": "Alle 15 Minuten",
  "Every 30 minutes": "Alle 30 Minuten",
  "Only as needed": "Nur bei Bedarf",
  "3 hours": "3 Stunden",
  "4 hours": "4 Stunden",
  "5 hours": "5 Stunden",
  "Empty dust bin": "Staubbehälter leeren",
  "Wash mop roller": "Wischwalze reinigen",
  "Dry mop roller": "Wischwalze trocknen",
  "Press": "Ausführen",
  "on": "Ein",
  "off": "Aus",
  "Brush bar": "Bürstenwalze",
  "Mop roller": "Wischwalze",
  "Side brushes": "Seitenbürsten",
  "Robot filter": "Roboterfilter",
  "Dock filter": "Stationsfilter",
  "Ready to use": "Einsatzbereit",
  "Refill required": "Nachfüllen erforderlich",
  "Enabled": "Aktiviert",
  "Disabled": "Deaktiviert",
  "Status unavailable": "Status nicht verfügbar",
  "Unavailable": "Nicht verfügbar",
  "Not available": "Noch nicht verfügbar",
  "{percent}% remaining": "{percent}% verbleibend",
  "{name} remaining life": "Restlebensdauer: {name}",
  "Save settings": "Speichern",
  "Start clean": "Reinigung starten",
  "Saving …": "Speichern …",
  "Discard draft": "Entwurf verwerfen",
  "Local draft": "Lokaler Entwurf",
  "From Home Assistant": "Aus Home Assistant",
  "{selected} of {total} rooms selected": "{selected} von {total} Räumen ausgewählt",
  "Select {name}": "{name} auswählen",
  "Settings for {name}": "Einstellungen für {name}",
  "Room settings unavailable": "Raumeinstellungen nicht verfügbar",
  "Room ID unavailable": "Raum-ID nicht verfügbar",
  "Room ID unavailable. Check the updated integration and refresh rooms.": "Raum-ID nicht verfügbar. Integration prüfen und Räume aktualisieren.",
  "No enabled rooms found. Check the card configuration and room discovery.": "Keine aktivierten Räume gefunden. Kartenkonfiguration und Raumerkennung prüfen.",
  "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.": "Die benötigten Dyson-Aktionen sind nicht verfügbar. Integration neu laden und Dashboard aktualisieren.",
  "Settings changed outside this card. Your edited values remain in the local draft.": "Einstellungen wurden außerhalb dieser Karte geändert. Deine Änderungen bleiben im lokalen Entwurf.",
  "Pause": "Pausieren",
  "Resume": "Fortsetzen",
  "Home": "Zur Station",
  "Cleaning map": "Reinigungskarte",
  "Refreshes about every 5 seconds": "Aktualisierung etwa alle 5 Sekunden",
  "Drying time remaining": "Verbleibende Trocknungszeit",
  "Cancel drying": "Trocknung abbrechen",
  "Remaining time: unavailable": "Restzeit: nicht verfügbar",
  "Remaining time: {time} (hh:mm)": "Restzeit: {time} (hh:mm)",
  "Drying cancellation requires a connected robot and the integration cancel_drying action.": "Zum Abbrechen der Trocknung werden ein verbundener Roboter und die Integrationsaktion cancel_drying benötigt.",
  "This action is not available in the current robot state.": "Diese Aktion ist im aktuellen Roboterzustand nicht verfügbar.",
  "Robot unavailable": "Roboter nicht verfügbar",
  "Robot needs attention": "Roboter benötigt Hilfe",
  "Paused": "Pausiert",
  "Cleaning mop roller": "Wischwalze wird gereinigt",
  "Drying mop roller": "Wischwalze wird getrocknet",
  "Emptying dust bin": "Staubbehälter wird geleert",
  "Vacuuming": "Saugen aktiv",
  "Mopping": "Wischen aktiv",
  "Vacuuming and mopping": "Saugen und Wischen aktiv",
  "Cleaning": "Reinigung aktiv",
  "Returning / mapping": "Rückfahrt / Kartierung",
  "Robot disconnected": "Roboter nicht verbunden",
  "Mapping / navigation in progress": "Kartierung / Navigation läuft",
  "Returning to dock / finishing cleanup": "Rückfahrt zur Station / Reinigung wird abgeschlossen",
  "A cleaning job is still active": "Ein Reinigungsauftrag ist noch aktiv",
  "Waiting for the robot to be ready": "Warten auf Bereitschaft des Roboters",
  "The integration is not ready to start a new clean": "Die Integration ist noch nicht für eine neue Reinigung bereit",
  "Wait for the dock cycle to finish before starting a clean": "Vor einer neuen Reinigung das Ende des Stationsvorgangs abwarten",
  "Waiting for a connection to the robot.": "Warten auf die Verbindung zum Roboter.",
  "Cleaning session active": "Reinigung aktiv",
  "Cleaning session paused": "Reinigung pausiert",
  "Robot returning": "Roboter kehrt zurück",
  "The integration is reporting a return or mapping operation.": "Die Integration meldet eine Rückfahrt oder Kartierung.",
  "Check the robot or the Dyson app for details.": "Details am Roboter oder in der Dyson-App prüfen.",
  "Starting clean": "Reinigung wird gestartet",
  "Waiting for the robot to report its status.": "Warten auf die Statusmeldung des Roboters.",
  "Waiting for robot status": "Warten auf Roboterstatus",
  "The robot is not reporting a ready state.": "Der Roboter meldet noch keine Bereitschaft.",
  "Battery and charging": "Akku und Ladestatus",
  "Battery level unavailable": "Akkustand nicht verfügbar",
  "Battery: {percent}%": "Akku: {percent}%",
  "Charging": "Wird geladen",
  "Not charging": "Wird nicht geladen",
  "Charging status unavailable": "Ladestatus nicht verfügbar",
  "{battery}. {charging}.": "{battery}. {charging}.",
  "Live cleaning map": "Live-Reinigungskarte",
  "Loading cleaning map …": "Reinigungskarte wird geladen …",
  "Waiting for an active robot status.": "Warten auf einen aktiven Roboterstatus.",
  "Camera unavailable.": "Kamera nicht verfügbar.",
  "No map camera found. Select one in the card editor.": "Keine Kartenkamera gefunden. Bitte im Karteneditor auswählen.",
  "The camera image is not available yet.": "Das Kamerabild ist noch nicht verfügbar.",
  "Map update unavailable.": "Kartenaktualisierung nicht verfügbar.",
  "{message} Showing the last received image.": "{message} Das zuletzt empfangene Bild wird angezeigt.",
  "Language": "Sprache",
  "Automatic": "Automatisch",
  "Dyson device": "Dyson-Gerät",
  "Select a device": "Gerät auswählen",
  "Title": "Titel",
  "Theme": "Design",
  "Classic": "Classic",
  "Modern": "Modern",
  "Unsupported settings": "Nicht unterstützte Einstellungen",
  "Show disabled": "Deaktiviert anzeigen",
  "Hide": "Ausblenden",
  "Always show all settings": "Immer alle Einstellungen anzeigen",
  "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.": "Raumeinstellungen werden automatisch erkannt. Speichern und Starten verwenden die Sammelaktionen der Dyson-Integration.",
  "Status bar": "Statusleiste",
  "Show status bar": "Statusleiste anzeigen",
  "Visible status indicators": "Sichtbare Statusanzeigen",
  "Show battery percentage": "Akkustand in Prozent anzeigen",
  "Show camera during a cleaning session": "Kamera während der Reinigung anzeigen",
  "Turning this off removes the map and stops image requests from this card.": "Ausgeschaltet wird die Karte ausgeblendet und es werden keine Bilder mehr abgerufen.",
  "Map camera": "Kartenkamera",
  "Auto-detect": "Automatisch erkennen",
  "Map rotation": "Kartendrehung",
  "Rooms in this card": "Räume auf dieser Karte",
  "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.": "Anzuzeigende Räume auswählen. Die Pfeile ändern die Anzeigereihenfolge, nicht die Reinigungsreihenfolge.",
  "Move {name} up": "{name} nach oben verschieben",
  "Move {name} down": "{name} nach unten verschieben",
  "Refresh rooms": "Räume aktualisieren",
  "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.": "In Home Assistant deaktivierte Räume werden nicht angeboten. Neue Räume erscheinen automatisch.",
  "Could not read the entity registry. Check the connection and user permissions.": "Die Entitätsregistrierung konnte nicht gelesen werden. Verbindung und Benutzerrechte prüfen.",
  "The Dyson device was not found in the entity registry.": "Das Dyson-Gerät wurde nicht in der Entitätsregistrierung gefunden.",
  "The Dyson room list is not currently available.": "Die Dyson-Raumliste ist derzeit nicht verfügbar.",
  "Room switch mapping is ambiguous": "Zuordnung des Raumschalters ist nicht eindeutig",
  "Multiple rooms map to the same switch.": "Mehrere Räume sind demselben Schalter zugeordnet.",
  "Select a vacuum entity.": "Bitte eine Staubsauger-Entität auswählen.",
  "theme must be classic or modern.": "theme muss classic oder modern sein.",
  "language must be auto, en or de.": "language muss auto, en oder de sein.",
  "unsupported_settings must be disabled or hidden.": "unsupported_settings muss disabled oder hidden sein.",
  "{key} must be a list of entity IDs.": "{key} muss eine Liste von Entitäts-IDs sein.",
  "room_entities must map room names to switch entities.": "room_entities muss Raumnamen Schalter-Entitäten zuordnen.",
  "show_battery_percentage must be true or false.": "show_battery_percentage muss true oder false sein.",
  "show_status_bar must be true or false.": "show_status_bar muss true oder false sein.",
  "hidden_status_items must be a list of indicator keys.": "hidden_status_items muss eine Liste von Anzeigeschlüsseln sein.",
  "show_camera must be true or false.": "show_camera muss true oder false sein.",
  "always_show_all_settings must be true or false.": "always_show_all_settings muss true oder false sein.",
  "camera_rotation must be 0, 90, 180 or 270.": "camera_rotation muss 0, 90, 180 oder 270 sein.",
  "Select a camera entity.": "Bitte eine Kamera-Entität auswählen.",
  "Home Assistant is not connected.": "Keine Verbindung zu Home Assistant.",
  "Update the Dyson integration: {action} is unavailable.": "Dyson-Integration aktualisieren: {action} ist nicht verfügbar.",
  "The robot is unavailable.": "Der Roboter ist nicht verfügbar.",
  "Start is only available when the Dyson is ready (docked or idle).": "Starten ist nur möglich, wenn der Dyson bereit ist (an der Station oder im Leerlauf).",
  "A room in your draft is unavailable or ambiguous. Review or discard the draft.": "Ein Raum im Entwurf ist nicht verfügbar oder nicht eindeutig. Entwurf prüfen oder verwerfen.",
  "{setting} is no longer available for {room}.": "{setting} ist für {room} nicht mehr verfügbar.",
  "A selected room has no stable room ID. Refresh rooms and check the integration.": "Ein ausgewählter Raum hat keine stabile Raum-ID. Räume aktualisieren und Integration prüfen.",
  "Select at least one room without duplicates.": "Mindestens einen Raum ohne Duplikate auswählen.",
  "An action for this Dyson is already running in this browser.": "In diesem Browser läuft bereits eine Aktion für diesen Dyson.",
  "This action is not available for the current robot state.": "Diese Aktion ist im aktuellen Roboterzustand nicht verfügbar.",
  "This station action is unavailable.": "Diese Stationsaktion ist nicht verfügbar.",
  "This station setting is unavailable.": "Diese Stationseinstellung ist nicht verfügbar.",
  "Invalid station switch value.": "Ungültiger Wert für den Stationsschalter.",
  "Invalid station option.": "Ungültige Stationsoption.",
  "Sending room settings and start request …": "Raumeinstellungen und Startanforderung werden gesendet …",
  "The start was sent, but the robot has not reported an active session. Check its status before trying again.": "Die Startanforderung wurde gesendet, aber der Roboter meldet keine aktive Reinigung. Vor einem erneuten Versuch seinen Status prüfen.",
  "{error} No automatic retry will be made.": "{error} Es erfolgt kein automatischer Wiederholungsversuch.",
  "Saving room settings …": "Raumeinstellungen werden gespeichert …",
  "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.": "Speichern wurde gesendet, aber Home Assistant zeigt noch nicht alle Werte. Der Entwurf bleibt erhalten; vor einem erneuten Versuch den Roboter prüfen.",
  "Settings sent. Home Assistant values updated. Room selection remains local.": "Einstellungen gesendet und Werte in Home Assistant aktualisiert. Die Raumauswahl bleibt lokal."
};



const LANGUAGES = { en, de };
function resolveLanguage(config = {}, hass) {
  config ??= {};
  const requested = config.language && config.language !== 'auto' ? config.language : hass?.locale?.language ?? hass?.language ?? 'en';
  const base = String(requested).toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(LANGUAGES, base) ? base : 'en';
}
// Structured messages preserve parameters until rendering, including a language change.
function uiMessage(key, params = {}) { return { key, params }; }
class UiError extends Error {
  constructor(key, params = {}) { super(translate('en', key, params)); this.key = key; this.params = params; }
}
function translate(language, key, params = {}) {
  if (key instanceof UiError || (key && typeof key === 'object' && typeof key.key === 'string')) {
    return translate(language, key.key, key.params);
  }
  // Integration/backend errors are external prose, not translation keys.
  if (key instanceof Error) return key.message;
  if (key == null) return '';
  const dictionary = LANGUAGES[language] ?? en;
  const text = Object.hasOwn(dictionary, key) ? dictionary[key] : Object.hasOwn(en, key) ? en[key] : String(key);
  return text.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name] instanceof Error || typeof params[name] === 'object' ? translate(language, params[name]) : params[name]) : match);
}


const DOMAIN = 'dyson_spot_scrub';
const ROOM_FIELDS = { cleaning_mode: 'Cleaning mode', cleaning_strategy: 'Vacuum Power', water_level: 'Water level', mop_repetitions: 'Clean repetitions' };
const available = state => !!state && !['unavailable', 'unknown'].includes(state.state) && !state.attributes?.restored;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const STATUS_BAR_ITEMS = [
  ['hot_water_mopping', 'Hot water mopping'],
  ['hot_water_self_cleaning', 'Hot water self-cleaning'],
  ['extended_roller_preparation', 'Extended roller preparation'],
  ['cleaning_solution', 'Cleaning solution'],
  ['self_cleaning_frequency', 'Self-cleaning frequency'],
  ['roller_drying_duration', 'Roller drying duration'],
  ['battery', 'Battery and charging'],
];

function normalizeConfig(config) {
  if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('vacuum.')) throw new UiError('Select a vacuum entity.');
  if (config.language !== undefined && !['auto', 'en', 'de'].includes(config.language)) throw new UiError('language must be auto, en or de.');
  if (config.theme !== undefined && !['classic', 'modern'].includes(config.theme)) throw new UiError('theme must be classic or modern.');
  if (config.unsupported_settings && !['disabled', 'hidden'].includes(config.unsupported_settings)) throw new UiError('unsupported_settings must be disabled or hidden.');
  for (const key of ['excluded_rooms', 'room_order']) {
    if (config[key] !== undefined && (!Array.isArray(config[key]) || config[key].some(x => typeof x !== 'string'))) throw new UiError('{key} must be a list of entity IDs.', { key });
  }
  if (config.room_entities !== undefined && (!config.room_entities || typeof config.room_entities !== 'object' || Array.isArray(config.room_entities) || Object.values(config.room_entities).some(x => typeof x !== 'string' || !x.startsWith('switch.')))) throw new UiError('room_entities must map room names to switch entities.');
  if (config.show_battery_percentage !== undefined && typeof config.show_battery_percentage !== 'boolean') throw new UiError('show_battery_percentage must be true or false.');
  if (config.show_status_bar !== undefined && typeof config.show_status_bar !== 'boolean') throw new UiError('show_status_bar must be true or false.');
  if (config.hidden_status_items !== undefined && (!Array.isArray(config.hidden_status_items) || config.hidden_status_items.some(item => typeof item !== 'string'))) throw new UiError('hidden_status_items must be a list of indicator keys.');
  if (config.show_camera !== undefined && typeof config.show_camera !== 'boolean') throw new UiError('show_camera must be true or false.');
  if (config.always_show_all_settings !== undefined && typeof config.always_show_all_settings !== 'boolean') throw new UiError('always_show_all_settings must be true or false.');
  if (config.camera_rotation !== undefined && ![0, 90, 180, 270].includes(config.camera_rotation)) throw new UiError('camera_rotation must be 0, 90, 180 or 270.');
  if (config.camera_entity && (typeof config.camera_entity !== 'string' || !config.camera_entity.startsWith('camera.'))) throw new UiError('Select a camera entity.');
  return { ...config, language: config.language ?? 'auto', theme: config.theme ?? 'modern', show_battery_percentage: config.show_battery_percentage ?? false, show_status_bar: config.show_status_bar ?? true, hidden_status_items: config.hidden_status_items ?? [], title: config.title ?? '', always_show_all_settings: config.always_show_all_settings ?? false, unsupported_settings: config.unsupported_settings ?? 'disabled', excluded_rooms: config.excluded_rooms ?? [], room_order: config.room_order ?? [], show_camera: config.show_camera ?? true, camera_rotation: config.camera_rotation ?? 0 };
}

// Entity IDs are user-editable. Match registry identity within ONE integration device.
function discover(hass, registry, config) {
  const issues = [];
  const vacuum = registry.find(e => e.entity_id === config.entity && e.platform === DOMAIN && !e.disabled_by);
  if (!vacuum?.device_id) return { rooms: [], issues: ['The Dyson device was not found in the entity registry.'] };
  const entries = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum.unique_id ?? '').replace(/_vacuum$/, '');
  const pick = (explicit, suffix, domain) => {
    const candidates = entries.filter(e => e.entity_id.startsWith(`${domain}.`) && (explicit ? e.entity_id === explicit : e.unique_id === `${serial}_${suffix}`));
    return candidates.length === 1 ? candidates[0].entity_id : undefined;
  };
  const cameraEntity = pick(config.camera_entity, 'floor_map', 'camera');
  const batteryEntity = pick(undefined, 'battery', 'sensor');
  const chargingEntity = pick(undefined, 'charging', 'binary_sensor');
  const names = hass.states[config.entity]?.attributes?.rooms;
  if (!Array.isArray(names) || !names.length || names.some(n => typeof n !== 'string')) issues.push('The Dyson room list is not currently available.');
  const rooms = (Array.isArray(names) ? names.filter(n => typeof n === 'string') : []).flatMap(name => {
    const explicit = config.room_entities?.[name];
    const uid = `${serial}_room_${name.toLowerCase().replaceAll(' ', '_')}`;
    const allMatches = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && e.entity_id.startsWith('switch.') && (explicit ? e.entity_id === explicit : e.unique_id === uid));
    if (allMatches.length === 1 && allMatches[0].disabled_by) return [];
    const matches = allMatches.filter(e => !e.disabled_by);
    if (matches.length !== 1) return [{ name, entity: '', available: false, error: 'Room switch mapping is ambiguous' }];
    const entry = matches[0];
    const settings = {};
    const roomIds = new Set();
    for (const key of Object.keys(ROOM_FIELDS)) {
      const candidates = entries.filter(e => e.entity_id.startsWith('select.') && e.unique_id === `${entry.unique_id}_${key}` && available(hass.states[e.entity_id]));
      if (candidates.length !== 1) continue;
      const entity = candidates[0].entity_id, state = hass.states[entity];
      const nativeId = state.attributes?.room_id;
      if (nativeId === undefined || nativeId === null || String(nativeId) === '') continue;
      const options = state.attributes?.options;
      if (!Array.isArray(options) || !options.every(o => typeof o === 'string')) continue;
      roomIds.add(String(nativeId));
      settings[key] = { entity, value: state.state, options };
    }
    const roomId = roomIds.size === 1 ? [...roomIds][0] : undefined;
    return [{ name, entity: entry.entity_id, roomId, settings: roomId ? settings : {}, available: available(hass.states[entry.entity_id]), excluded: config.excluded_rooms.includes(entry.entity_id) }];
  });
  const ids = rooms.map(r => r.entity).filter(Boolean);
  if (new Set(ids).size !== ids.length) issues.push('Multiple rooms map to the same switch.');
  const rank = id => { const i = config.room_order.indexOf(id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a, b) => rank(a.entity) - rank(b.entity));
  return { rooms, cameraEntity, batteryEntity, chargingEntity, issues };
}

function batteryStatus(hass, model) {
  const battery = hass?.states?.[model?.batteryEntity];
  const charging = hass?.states?.[model?.chargingEntity];
  const connected = hass?.connected !== false;
  const raw = battery?.state;
  const value = (typeof raw === 'string' && raw.trim() !== '') || typeof raw === 'number' ? Number(raw) : NaN;
  const percent = connected && available(battery) && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
  const chargeState = connected && available(charging) && ['on', 'off'].includes(charging.state) ? charging.state : null;
  const level = percent === null ? 'unknown' : percent < 20 ? 'low' : percent < 50 ? 'medium' : 'high';
  const label = `${percent === null ? 'Battery level unavailable' : `Battery: ${percent}%`}. ${chargeState === 'on' ? 'Charging' : chargeState === 'off' ? 'Not charging' : 'Charging status unavailable'}.`;
  return { percent, charging: chargeState === 'on', level, label };
}

// Only the integration converts labels to Dyson protocol values. One HA action
// receives the complete draft; never fan out to select.select_option here.
const draftRequests = new Set();
async function sendRoomDraft({ hass, model, config, selected = [], draft = {}, start = false }) {
  const service = start ? 'start_rooms_with_settings' : 'save_room_settings';
  if (hass?.connected === false) throw new UiError('Home Assistant is not connected.');
  if (!hass.services?.[DOMAIN]?.[service]) throw new UiError('Update the Dyson integration: {action} is unavailable.', { action: `${DOMAIN}.${service}` });
  const vacuum = hass.states[config.entity];
  if (!available(vacuum)) throw new UiError('The robot is unavailable.');
  if (start && !['docked', 'idle'].includes(vacuum.state)) throw new UiError('Start is only available when the Dyson is ready (docked or idle).');
  if (start && startBlockReason(hass, config.entity)) throw new UiError(startBlockReason(hass, config.entity));
  const byId = new Map();
  for (const room of model.rooms) {
    if (!room.roomId) continue;
    const list = byId.get(room.roomId) ?? [];
    list.push(room); byId.set(room.roomId, list);
  }
  const resolve = id => {
    const rooms = byId.get(id);
    if (rooms?.length !== 1 || !rooms[0].available || rooms[0].excluded) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
    return rooms[0];
  };
  const settings = {};
  for (const [id, values] of Object.entries(draft)) {
    const room = resolve(id);
    for (const [key, value] of Object.entries(values)) {
      const field = room.settings?.[key];
      if (!field || !available(hass.states[field.entity]) || !field.options.includes(value)) throw new UiError('{setting} is no longer available for {room}.', { setting: { key: ROOM_FIELDS[key] ?? key }, room: room.name });
      if (hass.states[field.entity].state !== value) (settings[id] ??= {})[key] = value;
    }
  }
  const rooms = start ? selected.map(entity => {
    const room = model.rooms.find(r => r.entity === entity);
    if (!room?.roomId) throw new UiError('A selected room has no stable room ID. Refresh rooms and check the integration.');
    return resolve(room.roomId);
  }) : [];
  if (start && (!rooms.length || new Set(rooms.map(r => r.roomId)).size !== rooms.length)) throw new UiError('Select at least one room without duplicates.');
  if (draftRequests.has(config.entity)) throw new UiError('An action for this Dyson is already running in this browser.');
  if (!start && !Object.keys(settings).length) return { rooms: [], settings, sent: false };
  const data = { entity_id: config.entity, room_settings: settings };
  if (start) data.room_ids = rooms.map(r => r.roomId);
  draftRequests.add(config.entity);
  try { await hass.callService(DOMAIN, service, data); }
  finally { draftRequests.delete(config.entity); }
  return { rooms: rooms.map(r => ({ entity_id: r.entity, room_id: r.roomId, name: r.name })), settings, sent: true };
}

const DOCK_PHASES = {
  WASHING_MOP: ['Cleaning mop roller', 'mdi:waves'],
  DRYING_MOP: ['Drying mop roller', 'mdi:weather-windy'],
  COLLECTING_DUST: ['Emptying dust bin', 'mdi:delete-empty-outline']
};

function dockBusy(hass, entity) {
  const state = hass?.states?.[entity];
  return hass?.connected !== false && available(state) && Object.hasOwn(DOCK_PHASES, state.attributes?.dock_state);
}

// A new cleaning request lets the integration cancel roller drying automatically.
function dockBlocksStart(hass, entity) {
  return dockBusy(hass, entity) && hass.states[entity].attributes.dock_state !== 'DRYING_MOP';
}

// Prefer the integration's explicit veto; keep legacy dock checks as fallback.
function startBlockReason(hass, entity) {
  const attrs = hass?.states?.[entity]?.attributes ?? {};
  if (attrs.ready_to_start === false) {
    return {
      disconnected: 'Robot disconnected',
      robot_fault: 'Robot needs attention',
      washing_mop: 'Cleaning mop roller',
      emptying_bin: 'Emptying dust bin',
      mapping_or_navigation: 'Mapping / navigation in progress',
      returning_or_finishing: 'Returning to dock / finishing cleanup',
      cleaning_job_active: 'A cleaning job is still active',
      waiting_for_ready_state: 'Waiting for the robot to be ready'
    }[attrs.start_block_reason] ?? 'The integration is not ready to start a new clean';
  }
  return dockBlocksStart(hass, entity) ? 'Wait for the dock cycle to finish before starting a clean' : null;
}

// Report live telemetry, never the selected mode or the colours of old map paths.
function activityStatus(hass, entity, pendingStart = false) {
  const state = hass?.states?.[entity];
  const view = cleaningView(hass, entity, pendingStart);
  const result = (text, icon = 'mdi:robot-vacuum', drying = false) => ({ text, icon, drying });
  if (!available(state) || hass?.connected === false) return result('Robot unavailable', 'mdi:alert-circle-outline');
  if (state.state === 'error') return result('Robot needs attention', 'mdi:alert-circle-outline');
  if (state.state === 'paused') return result('Paused', 'mdi:pause');
  if (dockBusy(hass, entity)) {
    const phase = state.attributes.dock_state;
    return result(...DOCK_PHASES[phase], phase === 'DRYING_MOP');
  }
  if (state.state === 'cleaning') {
    const modes = { VACUUMING: 'Vacuuming', MOPPING: 'Mopping', VACUUMING_AND_MOPPING: 'Vacuuming and mopping' };
    return result(modes[state.attributes?.full_clean_action] ?? 'Cleaning');
  }
  if (state.state === 'returning') return result('Returning / mapping', 'mdi:home-import-outline');
  const blocked = startBlockReason(hass, entity);
  if (blocked) return result(blocked, 'mdi:timer-sand');
  return view.active ? result(view.title) : null;
}

function cleaningView(hass, entity, pendingStart = false) {
  const state = hass?.states?.[entity];
  if (!available(state) || hass?.connected === false) return { active: true, title: 'Robot unavailable', detail: 'Waiting for a connection to the robot.', live: false };
  const states = {
    cleaning: ['Cleaning session active', ''],
    paused: ['Cleaning session paused', ''],
    returning: ['Robot returning', 'The integration is reporting a return or mapping operation.'],
    error: ['Robot needs attention', 'Check the robot or the Dyson app for details.']
  };
  if (states[state.state]) return { active: true, title: states[state.state][0], detail: states[state.state][1], live: true };
  if (pendingStart) return { active: true, title: 'Starting clean', detail: 'Waiting for the robot to report its status.', live: false };
  if (['docked', 'idle'].includes(state.state)) return { active: false, live: false };
  return { active: true, title: 'Waiting for robot status', detail: 'The robot is not reporting a ready state.', live: false };
}

// Display the integration's last confirmed sample; do not invent elapsed time.
function dryingTelemetry(hass, entity, registry = []) {
  const state = hass?.states?.[entity];
  if (hass?.connected === false || !available(state) || state.attributes?.dock_state !== 'DRYING_MOP') return null;
  // A registered but disabled, ambiguous or unavailable sensor must not revive stale legacy data.
  const matches = deviceEntities(registry, entity, 'sensor', 'drying_remaining');
  if (matches.length) {
    if (matches.length !== 1 || matches[0].disabled_by) return null;
    const sensor = hass.states[matches[0].entity_id];
    if (!available(sensor) || typeof sensor.state !== 'string' || !sensor.state.trim()) return null;
    return { remaining: Number(sensor.state), total: sensor.attributes?.total_seconds };
  }
  return { remaining: state.attributes.drying_remaining_seconds, total: state.attributes.drying_total_seconds };
}

function dryingRemainingTime(hass, entity, registry = []) {
  const seconds = dryingTelemetry(hass, entity, registry)?.remaining;
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  const minutes = Math.ceil(seconds / 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

// Fraction of the configured drying duration still remaining, from confirmed telemetry.
function dryingRemainingPercent(hass, entity, registry = []) {
  if (dryingRemainingTime(hass, entity, registry) === null) return null;
  const { total, remaining } = dryingTelemetry(hass, entity, registry);
  if (!Number.isFinite(total) || total <= 0 || remaining > total) return null;
  return remaining / total * 100;
}

function canControl(hass, entity, action) {
  const state = hass?.states?.[entity];
  if (action === 'cancel_drying') return !!(hass?.connected !== false && available(state) &&
    state.attributes?.dock_state === 'DRYING_MOP' && hass.services?.[DOMAIN]?.cancel_drying);
  const feature = { pause: 4, start: 8192, return_to_base: 16 }[action];
  const allowedStates = { pause: ['cleaning'], start: ['paused'], return_to_base: ['cleaning', 'paused', 'returning', 'error'] }[action] ?? [];
  return !!(feature && hass?.connected !== false && available(state) &&
    !dockBusy(hass, entity) &&
    allowedStates.includes(state.state) &&
    (Number(state.attributes?.supported_features) & feature) && hass.services?.vacuum?.[action]);
}

async function controlCleaning(hass, entity, action) {
  if (!canControl(hass, entity, action)) throw new UiError('This action is not available for the current robot state.');
  // Queue cancellation belongs to the integration. Do not toggle room switches here.
  await hass.callService(action === 'cancel_drying' ? DOMAIN : 'vacuum', action, { entity_id: entity });
}

function fitMap(width, height, boxWidth, rotation) {
  if (![width, height, boxWidth].every(n => Number.isFinite(n) && n > 0)) return { width: 0, height: 0, frameHeight: 0 };
  const sideways = rotation === 90 || rotation === 270;
  const scale = boxWidth / (sideways ? height : width);
  return { width: width * scale, height: height * scale, frameHeight: (sideways ? width : height) * scale };
}

const CONSUMABLES = [
  ['brushBar', 'Brush bar'], ['mopRoller', 'Mop roller'],
  ['sideBrushes', 'Side brushes'], ['robotFilter', 'Robot filter'],
  ['dockFilter', 'Dock filter'], ['cleaningSolution', 'Cleaning solution']
];

function consumableStatus(hass, registry, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  return CONSUMABLES.map(([type, name]) => {
    const candidates = vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && !e.disabled_by && e.entity_id.startsWith('sensor.') && hass?.states?.[e.entity_id]?.attributes?.consumable_type === type) : [];
    const state = candidates.length === 1 ? hass?.states?.[candidates[0].entity_id] : null;
    const live = hass?.connected !== false && available(state);
    if (type === 'cleaningSolution') {
      const value = live && state.attributes?.value_kind === 'refill_status' ? state.state : null;
      return { type, name, remaining: null, level: 'unknown', refillStatus: value, text: value === 'ok' ? 'Ready to use' : value === 'refill_required' ? 'Refill required' : 'Unavailable' };
    }
    const raw = state?.state;
    const usage = typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== '') ? Number(raw) : NaN;
    const remaining = live && state.attributes?.value_kind === 'usage_percent' && Number.isFinite(usage) && usage >= 0 && usage <= 100 ? Math.round((100 - usage) * 10) / 10 : null;
    return { type, name, remaining, level: remaining === null ? 'unknown' : remaining <= 10 ? 'low' : remaining <= 25 ? 'medium' : 'high', text: remaining === null ? 'Unavailable' : `${remaining}% remaining` };
  });
}


const STATION_FIELDS = [
  ['hot_water_mopping', 'Hot water mopping', 'switch'],
  ['cleaning_solution', 'Cleaning solution', 'switch'],
  ['extended_roller_preparation', 'Extended roller preparation', 'switch'],
  ['hot_water_self_cleaning', 'Hot water self-cleaning', 'switch'],
  ['self_cleaning_frequency', 'Self-cleaning frequency', 'select'],
  ['roller_drying_duration', 'Roller drying duration', 'select']
];

const STATION_ACTIONS = [
  ['empty_bin', 'Empty dust bin'],
  ['wash_mop', 'Wash mop roller'],
  ['dry_mop', 'Dry mop roller']
];

function deviceEntities(registry, entity, domain, suffix) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  return vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_${suffix}`) : [];
}

function stationActions(hass, registry, entity) {
  return STATION_ACTIONS.map(([key, label]) => {
    const matches = deviceEntities(registry, entity, 'button', key);
    const id = matches.length === 1 && !matches[0].disabled_by ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id];
    // Button states are timestamps, or unknown before the first press.
    return { key, label, entity: id, available: hass?.connected !== false && !!state && state.state !== 'unavailable' && !state.attributes?.restored && !!hass?.services?.button?.press };
  });
}

async function pressStationAction(hass, registry, entity, key) {
  const action = stationActions(hass, registry, entity).find(item => item.key === key);
  if (!action?.available) throw new UiError('This station action is unavailable.');
  await hass.callService('button', 'press', { entity_id: action.entity });
}

function stationSettings(hass, registry, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  return STATION_FIELDS.map(([key, label, domain]) => {
    const matches = vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && !e.disabled_by && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_station_${key}`) : [];
    const id = matches.length === 1 ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id];
    const options = Array.isArray(state?.attributes?.options) ? state.attributes.options.filter(v => typeof v === 'string') : [];
    const valid = domain === 'switch' ? ['on', 'off'].includes(state?.state) : options.includes(state?.state);
    const service = domain === 'switch' ? hass?.services?.switch?.turn_on && hass?.services?.switch?.turn_off : hass?.services?.select?.select_option;
    return { key, label, domain, entity: id, value: state?.state, options, available: hass?.connected !== false && available(state) && valid && !!service };
  });
}

async function changeStationSetting(hass, registry, entity, key, value) {
  const field = stationSettings(hass, registry, entity).find(f => f.key === key);
  if (!field?.available) throw new UiError('This station setting is unavailable.');
  if (field.domain === 'switch') {
    if (typeof value !== 'boolean') throw new UiError('Invalid station switch value.');
    await hass.callService('switch', value ? 'turn_on' : 'turn_off', { entity_id: field.entity });
  } else {
    if (!field.options.includes(value)) throw new UiError('Invalid station option.');
    await hass.callService('select', 'select_option', { entity_id: field.entity, option: value });
  }
}


// Owns image refresh independently from card rendering. No direct Dyson calls.
class DysonPlannerMap extends HTMLElement {
  constructor() {
    super(); this.language = 'en'; this.messageKey = 'Loading cleaning map …'; this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;min-width:0}.viewport{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:var(--secondary-background-color,#f5f7f9);isolation:isolate}
      img{position:absolute;left:50%;top:50%;max-width:none;max-height:none;transform-origin:center;visibility:hidden}.placeholder{position:absolute;inset:0;display:grid;place-items:center;padding:16px;text-align:center;color:var(--secondary-text-color,#52616e);font:13px/1.5 Arial,sans-serif}
      .caption{margin:8px 0 0;padding:0 var(--dp-padding,24px);color:var(--secondary-text-color,#52616e);font:12px/1.5 Arial,sans-serif}.caption:empty{display:none}[hidden]{display:none}
      </style><div class="viewport"><img alt="Live cleaning map"><div class="placeholder">Loading cleaning map …</div></div><p class="caption" role="status" aria-live="polite"></p>`;
    this.img = this.shadowRoot.querySelector('img');
    this.viewport = this.shadowRoot.querySelector('.viewport');
    this.placeholder = this.shadowRoot.querySelector('.placeholder');
    this.caption = this.shadowRoot.querySelector('.caption');
    this.inView = false;
    this.visibilityChanged = () => this.schedule();
  }
  connectedCallback() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.viewport);
    this.intersectionObserver = new IntersectionObserver(entries => {
      this.inView = entries.some(e => e.isIntersecting);
      this.schedule();
    });
    this.intersectionObserver.observe(this);
    document.addEventListener('visibilitychange', this.visibilityChanged);
  }
  disconnectedCallback() {
    this.cancel(); this.resizeObserver?.disconnect(); this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.visibilityChanged);
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
  }
  setOptions(hass, entity, rotation, live, language = 'en') {
    this.language = language;
    this.img.alt = translate(language, 'Live cleaning map');
    if (this.messageKey) this.showMessage(this.messageKey);
    if (this.entity !== entity || this.hass?.connection !== hass.connection) {
      this.cancel();
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
      this.imageWidth = undefined; this.imageHeight = undefined;
      this.lastAttempt = 0; this.placeholder.hidden = false;
    }
    this.hass = hass; this.entity = entity; this.rotation = rotation; this.live = live;
    this.resize(); this.schedule();
  }
  cancel() {
    clearTimeout(this.timer); this.timer = undefined;
    this.abortController?.abort(); this.abortController = undefined;
  }
  schedule() {
    clearTimeout(this.timer); this.timer = undefined;
    if (!this.isConnected || !this.inView || document.hidden) { this.cancel(); return; }
    if (!this.live) { this.cancel(); this.showMessage('Waiting for an active robot status.'); return; }
    if (!this.entity || !available(this.hass?.states?.[this.entity])) {
      this.cancel();
      this.showMessage(this.entity ? 'Camera unavailable.' : 'No map camera found. Select one in the card editor.');
      return;
    }
    if (this.abortController) return;
    const delay = Math.max(0, 5000 - (Date.now() - (this.lastAttempt ?? 0)));
    this.timer = setTimeout(() => this.refresh(), delay);
  }
  showMessage(key) {
    this.messageKey = key;
    const message = translate(this.language, key);
    this.placeholder.hidden = !!this.objectUrl;
    this.placeholder.textContent = message;
    this.caption.textContent = this.objectUrl ? translate(this.language, '{message} Showing the last received image.', { message }) : message;
  }
  async refresh() {
    if (!this.isConnected || !this.inView || document.hidden || !this.live) return;
    const picture = this.hass.states[this.entity]?.attributes?.entity_picture;
    this.lastAttempt = Date.now();
    // Use the HA-provided proxy path/token; never save or log tokens in config.
    if (typeof picture !== 'string' || !picture.startsWith('/api/camera_proxy/')) {
      this.showMessage('The camera image is not available yet.'); this.schedule(); return;
    }
    const url = new URL(this.hass.hassUrl ? this.hass.hassUrl(picture) : picture, location.href);
    url.searchParams.set('_planner', String(this.lastAttempt));
    const controller = new AbortController(); this.abortController = controller;
    const timeout = setTimeout(() => controller.abort(), 10000);
    let objectUrl;
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Image request failed');
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) throw new Error('Invalid camera image');
      objectUrl = URL.createObjectURL(blob);
      const image = new Image(); image.src = objectUrl; await image.decode();
      if (controller !== this.abortController || controller.signal.aborted || !this.isConnected) return;
      const previous = this.objectUrl;
      this.objectUrl = objectUrl; objectUrl = undefined;
      this.imageWidth = image.naturalWidth; this.imageHeight = image.naturalHeight;
      this.img.src = this.objectUrl; this.img.style.visibility = 'visible';
      this.placeholder.hidden = true; this.resize();
      this.caption.textContent = ''; this.messageKey = null;
      if (previous) URL.revokeObjectURL(previous);
    } catch {
      if (controller === this.abortController) this.showMessage('Map update unavailable.');
    } finally {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (controller === this.abortController) { this.abortController = undefined; this.schedule(); }
    }
  }
  resize() {
    const size = fitMap(this.imageWidth, this.imageHeight, this.viewport.getBoundingClientRect().width, this.rotation);
    // The card sets the width; the complete rotated image determines the height.
    // The CSS aspect ratio is only a placeholder until the first image arrives.
    this.viewport.style.height = size.frameHeight > 0 ? `${size.frameHeight}px` : '';
    this.img.style.width = `${size.width}px`; this.img.style.height = `${size.height}px`;
    this.img.style.transform = `translate(-50%, -50%) rotate(${this.rotation ?? 0}deg)`;
  }
}
if (!customElements.get('dyson-planner-map')) customElements.define('dyson-planner-map', DysonPlannerMap);


function stationIndicator(field, refillStatus, language = 'en') {
  const t = (key, params) => translate(language, key, params);
  const { key, label, value } = field;
  const refill = key === 'cleaning_solution' && refillStatus === 'refill_required';
  if (!field.available && !refill) return '';
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
      if (!refill && value !== 'off' && refillStatus !== 'ok') return '';
      icon = refill || value === 'on' ? 'mdi:bottle-tonic-plus' : 'mdi:bottle-tonic';
      color = refill ? 'alarm-red blink' : value === 'on' ? 'active-cyan' : 'inactive-muted';
      if (refill) description = 'Refill required';
      break;
    case 'self_cleaning_frequency':
      short = { 'After each room': '1R', 'Every 15 minutes': '15m', 'Every 30 minutes': '30m', 'Only as needed': 'Auto' }[value];
      if (!short) return '';
      icon = short === '1R' ? 'mdi:door-open' : 'mdi:clock-outline';
      break;
    case 'roller_drying_duration': {
      const hours = /^([345])\s*(?:h|hours)$/i.exec(value);
      if (!hours) return '';
      short = hours[1] + 'h';
      break;
    }
    default: return '';
  }
  const text = escapeHtml(t(label) + ': ' + t(description));
  return `<span class="station-indicator ${color}" role="img" aria-label="${text}" title="${text}">${icon ? `<ha-icon icon="${icon}" class="status-icon" aria-hidden="true"></ha-icon>` : ''}${short ? `<span class="status-text-5g">${short}</span>` : ''}</span>`;
}

const styles = `
/* Only constrain the content when the dashboard assigns an explicit row count. */
:host([fixed-height]){height:100%;min-height:0}
:host([fixed-height]) ha-card{height:100%;min-height:0}
:host([fixed-height]) .planner-content{height:100%;overflow-y:auto;overscroll-behavior:contain}

ha-card{position:relative}.consumables-info{min-height:32px;width:100%;padding:3px 10px;background:transparent;color:var(--dp-muted);display:flex;justify-content:center;align-items:center;font-size:12px}.consumables-info.attention{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 10%,var(--dp-bg));border-color:color-mix(in srgb,var(--error-color,#b3261e) 30%,var(--dp-line))}
.info-toolbar{display:flex;align-items:stretch;gap:8px;margin-bottom:20px}.info-tabs{display:flex;flex:1;min-width:0;gap:8px}.info-tabs button{flex:1;min-width:0;padding:9px 8px;font-size:13px;overflow-wrap:anywhere}@media(max-width:350px){.info-tabs{gap:4px}.info-tabs button{font-size:12px;padding:9px 4px}}.info-tabs [aria-selected=true]{color:var(--dp-accent);border-color:var(--dp-accent);background:var(--dp-soft)}.station-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:18px;font-size:13px}.station-row.station-action:not(:last-child){margin-bottom:8px}.station-row small{display:block;color:var(--dp-muted);margin-top:4px}.station-row>span{min-width:0;overflow-wrap:anywhere}.station-label{display:flex;align-items:center;gap:8px}.station-label>span:last-child{min-width:0}.station-row select{flex:0 1 190px;width:55%;min-width:140px;margin-left:auto;font-size:14px}.station-row ha-switch,.station-row ha-button{flex:0 0 auto;margin-left:auto}@media(max-width:400px){.station-row select{font-size:16px}}.consumables-overlay{position:absolute;inset:0;z-index:5;background:#0005;padding:12px;display:flex;align-items:flex-start}.consumables-panel{width:100%;max-height:min(100%,75vh);overflow-y:auto;overscroll-behavior:contain;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:14px;padding:18px;box-shadow:0 8px 30px #0003}.consumables-close{display:flex;align-items:center;justify-content:center;flex:0 0 42px;padding:8px;min-width:42px}.consumable-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);align-items:center;gap:20px;margin:0 0 24px;min-height:42px}.consumable-row:last-child{margin-bottom:0}.consumable-label{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-width:0;font-size:13px;line-height:1.4;overflow-wrap:anywhere}.consumable-value{color:var(--dp-muted);font-size:12px}.consumable-track{height:12px;border-radius:999px;background:color-mix(in srgb,var(--dp-accent) 14%,var(--dp-bg));overflow:hidden}.consumable-fill{display:block;height:100%;border-radius:inherit;background:var(--dp-accent)}.consumable-fill.medium{background:var(--warning-color,#ad6800)}.consumable-fill.low{background:var(--error-color,#b3261e)}.consumable-solution{padding-top:18px;border-top:1px solid var(--dp-line)}.consumable-chip{justify-self:end;display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:7px 10px;border-radius:12px;font-size:12px;line-height:1.4;color:var(--dp-muted);background:var(--dp-line)}.consumable-chip.ready{color:var(--dp-accent);background:var(--dp-soft)}.consumable-chip.refill{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 12%,var(--dp-bg))}.consumable-chip ha-icon{width:16px;height:16px;--mdc-icon-size:16px;flex-shrink:0}@media(max-width:400px){.consumable-row{gap:12px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.consumable-chip{padding:6px 8px}}

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
@keyframes status-blink{50%{opacity:.4}}.blink{animation:status-blink 1.6s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.blink{animation:none}}
.header-main{display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto;align-items:center;column-gap:13px;padding:4px var(--dp-padding) 10px}
.header-main .robot{grid-row:1/3}.header-title{display:contents}.header-title h2{grid-area:1/2;margin:0}.header-title p{grid-area:2/2}.header-main .consumables-info{grid-area:1/3/3/4;align-self:center;width:auto}
.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.draft-status{position:relative;padding-left:28px}.discard-draft{position:absolute;right:calc(100% - 24px);top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:24px;height:24px;min-height:0;padding:0;border:0;background:transparent;color:var(--dp-muted)}.discard-draft ha-icon{width:20px;height:20px;--mdc-icon-size:20px;pointer-events:none}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
.session{padding:4px 24px 0}.session h3{margin:0 0 8px;font-size:20px;font-weight:500}.session .detail{margin-bottom:18px}.requested-label{font-size:12px;color:var(--dp-muted);margin-bottom:8px}.requested{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0 0 10px}.requested li{background:var(--dp-soft);border:1px solid var(--dp-line);border-radius:18px;padding:7px 11px;font-size:13px;overflow-wrap:anywhere}.requested-note{margin-bottom:18px}.map-section{margin-top:20px}.map-title{font-size:13px;font-weight:500;margin:0 0 10px}.session-actions button{display:flex;align-items:center;justify-content:center;gap:8px}.session-actions ha-icon{width:20px;height:20px}.session-footer{padding-top:20px}
.activity-status{display:flex;align-items:center;gap:10px;margin:0 var(--dp-padding) 16px;padding:12px;border-radius:10px;background:var(--dp-soft);font-size:14px}.activity-status ha-icon{flex-shrink:0}.activity-copy{flex:1;min-width:0}.activity-remaining,.activity-start-block,.activity-fault{display:block;margin-top:4px;font-size:12px;line-height:1.5;color:var(--dp-muted);font-variant-numeric:tabular-nums}.drying-progress{display:block;width:100%;height:7px;margin-top:8px;border-radius:999px;background:var(--dp-line);overflow:hidden}.drying-progress-fill{display:block;height:100%;width:0;border-radius:inherit;background:var(--dp-accent)}.drying-control{flex-shrink:0}.cancel-drying{display:flex;align-items:center;justify-content:center;padding:8px;min-width:42px}.map-title{padding:0 var(--dp-padding)}
.map-title{margin-bottom:4px}.map-caption{padding:0 var(--dp-padding);margin:0 0 10px;font-size:12px}.action-message:empty{display:none}.session-actions .pause{background:#ef8c00;color:#171717;border-color:transparent}.session-actions .resume{background:#2e7d32;color:#fff;border-color:transparent}.session-actions .home{background:#c62828;color:#fff;border-color:transparent}
@media(max-width:400px){:host{--dp-padding:15px}.hint{padding:0 15px 14px}.rooms{padding:0 10px}footer{padding:18px 15px}.session{padding:4px 15px 0}.expand span{display:none}.actions{flex-direction:column}.session-actions{flex-direction:row}select{font-size:16px}.fields{gap:12px}}
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
.room-settings-copy{min-width:0}
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
/* Compact planner framing; session controls retain their existing touch targets. */
:host([data-theme=modern]){--dp-padding:20px}
:host([data-theme=modern]) .station-status-bar{padding-inline:var(--dp-padding)}
:host([data-theme=modern]) header{border-bottom:1px solid var(--dp-line);margin-bottom:12px}
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
  get language() { return resolveLanguage(this.config, this._hass); }
  t(key, params) { return translate(this.language, key, params); }
  ht(key, params) { return escapeHtml(this.t(key, params)); }
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
        const items = [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), ha-switch:not([disabled]), ha-button:not([disabled])')].filter(el => (['ha-switch', 'ha-button'].includes(el.localName) || el.tabIndex >= 0) && el.getClientRects().length);
        const first = items[0], last = items.at(-1), active = this.shadowRoot.activeElement;
        if (event.shiftKey && active === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && active === last) { event.preventDefault(); first?.focus(); }
      }
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) && event.target.dataset.infoTab) {
        event.preventDefault();
        this.infoTab = event.key === 'Home' ? 'station' : event.key === 'End' ? 'consumables' : this.infoTab === 'station' ? 'consumables' : 'station';
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
    let normalized;
    try { normalized = normalizeConfig(config); }
    catch (error) { throw new Error(translate(resolveLanguage(config, this._hass), error)); }
    const withoutLanguage = value => JSON.stringify({ ...value, language: undefined });
    if (this.config && withoutLanguage(this.config) === withoutLanguage(normalized)) {
      // Keep the configuration identity used by in-flight save/start requests.
      this.config.language = normalized.language; this.update(); return;
    }
    if (this.config?.entity !== config.entity) {
      this.clearSessionEnd();
      this.clearPendingStart(); this.requestedPlan = null; this.sessionObserved = false;
    }
    this.consumablesOpen = false; this.stationMessage = ''; this.stationError = false;
    this.config = normalized;
    this.setAttribute('data-theme', this.config.theme);
    const rows = config.grid_options?.rows ?? config.layout_options?.grid_rows;
    this.toggleAttribute('fixed-height', typeof rows === 'number' && Number.isFinite(rows) && rows > 0);
    this.initialized = false; this.dirty = false; this.selected = []; this.settingDraft = {}; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  connectedCallback() {
    this._previewDialog = cardEditorDialog(this, true);
    this._previewChanged ??= () => this.update();
    this._previewDialog?.addEventListener(previewViewChanged, this._previewChanged);
    super.connectedCallback();
    this._modernObserver ??= new ResizeObserver(() => this.positionModernPointer());
    this._modernObserver.observe(this);
    this.update();
  }
  disconnectedCallback() {
    this._previewDialog?.removeEventListener(previewViewChanged, this._previewChanged);
    this._previewDialog = null;
    this._modernObserver?.disconnect();
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
    const view = cleaningView(this._hass, this.config?.entity, (this.busy && !this.saving) || this.pendingStart);
    if (!view.active && this._previewDialog && sessionPreviewOwners.has(this._previewDialog)) {
      return { active: true, live: true, simulated: true };
    }
    return view;
  }
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
    const el = event.target.closest('button, ha-button');
    if (el?.dataset.stationAction) {
      if (!el.disabled && !el.hasAttribute('disabled')) this.setStationSetting(el.dataset.stationAction, undefined, true);
      return;
    }
    if (el?.dataset.action === 'consumables') { this.toggleConsumables(true); return; }
    if (el?.dataset.action === 'close-consumables') { this.toggleConsumables(false); return; }
    if (el?.dataset.infoTab) { this.infoTab = el.dataset.infoTab; this.updateConsumables(); return; }
    if (this.consumablesOpen) return;
    if (!el || el.disabled || this.busy || this.controlBusy) return;
    if (el.dataset.option !== undefined) {
      this.onChange({ target: { dataset: el.dataset, value: el.dataset.option, blur() {} } });
      return;
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
    if (this._previewDialog || this.busy || this.view.active || !this.isConnected) return;
    this.clearSessionEnd();
    this.busy = true; this.error = false;
    const config = this.config;
    try {
      if (this.registryError) throw new UiError(this.registryError);
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
      if (this.config === config) this.message = uiMessage('{error} No automatic retry will be made.', { error });
    } finally { this.busy = false; this.render(); }
  }
  async save() {
    if (this._previewDialog || this.busy || this.view.active || !this.isConnected) return;
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
  async control(action) {
    if (this._previewDialog || this.busy || this.controlBusy || !this.isConnected) return;
    const entity = this.config.entity;
    this.controlBusy = true; this.message = ''; this.error = false; this.render();
    try {
      await controlCleaning(this._hass, entity, action);
      if (this.config.entity !== entity) return;
      this.message = '';
    } catch (error) {
      if (this.config.entity === entity) { this.error = true; this.message = error; }
    } finally { this.controlBusy = false; this.render(); }
  }
  consumablesHtml() {
    return `<div class="consumables-overlay" hidden><section class="consumables-panel" role="dialog" aria-modal="true" aria-label="${this.ht("Robot information")}"><div class="info-toolbar"><div class="info-tabs" role="tablist" aria-label="${this.ht("Robot information")}"><button id="tab-station" role="tab" data-info-tab="station" aria-controls="panel-station">${this.ht("Station settings")}</button><button id="tab-consumables" role="tab" data-info-tab="consumables" aria-controls="panel-consumables">${this.ht("Consumables")}</button></div><button class="consumables-close" data-action="close-consumables" data-focus="consumables-close" aria-label="${this.ht("Close information")}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></div><div id="panel-station" role="tabpanel" aria-labelledby="tab-station"><div class="station-rows"></div><p class="station-message notice" role="status" aria-live="polite"></p></div><div id="panel-consumables" role="tabpanel" aria-labelledby="tab-consumables" hidden><div class="consumables-rows"></div></div></section></div>`;
  }
  toggleConsumables(open) {
    this.consumablesOpen = open;
    if (open) this.infoTab = 'station';
    this.updateConsumables();
    this.shadowRoot.querySelector(open ? '.consumables-close' : '.consumables-info')?.focus();
  }
  updateConsumables() {
    const root = this.shadowRoot;

    const rows = consumableStatus(this._hass, this.registry, this.config.entity);
    const settings = stationSettings(this._hass, this.registry, this.config.entity);
    const solution = rows.find(row => row.type === 'cleaningSolution');
    this.updateStationSettings(settings, solution?.refillStatus);
    const warning = rows.some(row => row.level === 'low');
    const button = root.querySelector('.consumables-info');
    button.classList.toggle('attention', warning);
    button.setAttribute('aria-label', this.t(warning ? 'Consumables: replacement needed soon' : 'Robot information'));
    button.title = this.t(warning ? 'Consumables: replacement needed soon' : 'Robot information');
    button.setAttribute('aria-expanded', String(!!this.consumablesOpen));
    root.querySelector('.consumables-overlay').hidden = !this.consumablesOpen;
    root.querySelector('.planner-content').inert = !!this.consumablesOpen;
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
  async setStationSetting(key, value, action = false) {
    if (this._previewDialog || this.stationBusy || this.busy || this.controlBusy || !this.consumablesOpen) return;
    const entity = this.config.entity;
    this.stationBusy = true; this.stationMessage = ''; this.stationError = false;
    this.updateConsumables();
    try {
      if (action) await pressStationAction(this._hass, this.registry, entity, key);
      else await changeStationSetting(this._hass, this.registry, entity, key, value);
    } catch (error) {
      if (this.config.entity === entity) { this.stationMessage = error; this.stationError = true; }
    } finally { this.stationBusy = false; this.updateConsumables(); }
  }
  updateStationSettings(settings, refillStatus) {
    const root = this.shadowRoot;
    const tab = this.infoTab || 'station';
    for (const name of ['station', 'consumables']) {
      const button = root.querySelector(`[data-info-tab="${name}"]`);
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
        ? `<ha-switch ${attrs} ${field.value === 'on' ? 'checked' : ''}></ha-switch>`
        : `<select ${attrs}>${!field.options.includes(field.value) ? `<option value="">${this.ht("Unavailable")}</option>` : ''}${field.options.map(v => `<option value="${escapeHtml(v)}" ${v === field.value ? 'selected' : ''}>${this.ht(v)}</option>`).join('')}</select>`;
      return `<label class="station-row ${field.domain}"><span class="station-label">${indicators[field.key]}<span>${this.ht(field.label)}${!field.available ? `<small>${this.ht("Unavailable")}</small>` : ''}</span></span>${control}</label>`;
    }).join('');
    const actions = stationActions(this._hass, this.registry, this.config.entity).map(action => {
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
    const name = this._hass?.states?.[this.config.entity]?.attributes?.friendly_name;
    const subtitle = typeof name === 'string' && name.trim() ? name : this.config.entity;
    return `<header><div class="station-status-bar"><div class="station-indicators"></div><div class="battery" role="img"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="1" y="3" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="29" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect class="battery-fill" x="4" y="6" width="0" height="8" rx="1" fill="currentColor"/><path class="battery-bolt" d="M17 1 9 11h6l-2 8L23 8h-7Z" fill="var(--dp-bg)" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" hidden/></svg><span class="battery-value" aria-hidden="true" hidden></span></div></div><div class="header-main"><div class="robot"><ha-icon icon="mdi:robot-vacuum"></ha-icon></div><div class="header-title"><h2>${escapeHtml(this.config.title || this.t('Plan a clean'))}</h2><p>${escapeHtml(subtitle)}</p></div><button class="consumables-info" data-action="consumables" data-focus="consumables-info" aria-label="${this.ht("Consumables")}" aria-haspopup="dialog" aria-expanded="false" title="${this.ht("Consumables")}">${this.ht("Info")}</button></div></header>`;
  }
  updateBattery() {
    const state = batteryStatus(this._hass, this.model);
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
    return `<div class="activity-status" role="status" aria-live="polite" hidden><ha-icon class="activity-icon" aria-hidden="true"></ha-icon><div class="activity-copy"><span class="activity-text"></span><span class="activity-fault" hidden></span><span class="activity-start-block" hidden></span><span class="activity-remaining" hidden></span><div class="drying-progress" role="progressbar" aria-label="${this.ht("Drying time remaining")}" aria-valuemin="0" aria-valuemax="100" hidden><span class="drying-progress-fill"></span></div></div><span class="drying-control" hidden><button class="cancel-drying" data-control="cancel_drying" data-focus="cancel-drying" disabled aria-label="${this.ht("Cancel drying")}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></span></div>`;
  }
  updateStatus() {
    const status = activityStatus(this._hass, this.config.entity, (this.busy && !this.saving) || this.pendingStart);
    const row = this.shadowRoot.querySelector('.activity-status');
    row.hidden = !status;
    row.querySelector('.activity-text').textContent = this.t(status?.text);
    // Display the integration's current explanation without retaining or inferring faults.
    const fault = this._hass?.states?.[this.config.entity]?.attributes?.fault;
    const detail = status?.text === 'Robot needs attention' && typeof fault === 'string' ? fault.trim() : '';
    const faultText = row.querySelector('.activity-fault');
    faultText.textContent = detail;
    faultText.hidden = !detail;

    const blockNote = row.querySelector('.activity-start-block');
    const block = startBlockReason(this._hass, this.config.entity);
    blockNote.hidden = this.view.active || !block || block === status?.text || dockBlocksStart(this._hass, this.config.entity);
    blockNote.textContent = this.t(block);
    row.querySelector('.activity-icon').setAttribute('icon', status?.icon ?? 'mdi:robot-vacuum');
    row.querySelector('.drying-control').hidden = !status?.drying;
    const remaining = row.querySelector('.activity-remaining');
    const time = status?.drying ? dryingRemainingTime(this._hass, this.config.entity, this.registry) : null;
    remaining.hidden = !status?.drying;
    remaining.textContent = time === null ? this.t('Remaining time: unavailable') : this.t('Remaining time: {time} (hh:mm)', { time });
    const progress = row.querySelector('.drying-progress');
    const percent = status?.drying ? dryingRemainingPercent(this._hass, this.config.entity, this.registry) : null;
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
    const supported = canControl(this._hass, this.config.entity, 'cancel_drying');
    cancel.disabled = !!this._previewDialog || this.busy || this.controlBusy || !supported;
    cancel.title = this.t(supported ? 'Cancel drying' : 'Drying cancellation requires a connected robot and the integration cancel_drying action.');
  }
  renderSession(view) {
    const h = escapeHtml;
    // Keep the map element mounted across status and message updates so polling,
    // the last good image and in-flight requests are independent of card renders.
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<section class="session"><ul class="requested"></ul></section>${this.config.show_camera ? `<div class="map-section"><div class="map-title">${this.ht("Cleaning map")}</div><p class="map-caption">${this.ht("Refreshes about every 5 seconds")}</p><dyson-planner-map></dyson-planner-map></div>` : ''}<footer class="session-footer"><div class="actions session-actions"><button class="session-toggle" data-control="pause" data-focus="session-toggle"><ha-icon></ha-icon><span></span></button><button class="home" data-control="return_to_base" data-focus="home"><ha-icon icon="mdi:home-import-outline"></ha-icon>${this.ht("Home")}</button></div><p class="notice action-message" role="status" aria-live="polite"></p></footer></div>${this.consumablesHtml()}</ha-card>`, 'session');
    const root = this.shadowRoot;
    this.updateBattery();
    this.updateConsumables();
    this.updateStatus();
    if (view.simulated) root.querySelector('.activity-status').hidden = true;
    const title = root.querySelector('.header-title h2');
    title.classList.add('session-title');
    title.textContent = this.t(view.simulated ? 'Cleaning session preview' : 'Cleaning session');
    const chips = (this.requestedPlan?.rooms ?? []).map(r => `<li>${h(r.name)}</li>`).join('');
    const list = root.querySelector('.requested');
    if (list.innerHTML !== chips) list.innerHTML = chips;
    root.querySelector('.session').hidden = !chips;
    const paused = this._hass.states[this.config.entity]?.state === 'paused';
    const toggle = root.querySelector('.session-toggle');
    toggle.dataset.control = paused ? 'start' : 'pause';
    toggle.classList.toggle('resume', paused); toggle.classList.toggle('pause', !paused);
    toggle.querySelector('span').textContent = this.t(paused ? 'Resume' : 'Pause');
    toggle.querySelector('ha-icon').setAttribute('icon', paused ? 'mdi:play' : 'mdi:pause');
    for (const button of root.querySelectorAll('[data-control]')) {
      const supported = canControl(this._hass, this.config.entity, button.dataset.control);
      button.disabled = !!this._previewDialog || this.busy || this.controlBusy || !supported;
      button.title = supported ? '' : this.t('This action is not available in the current robot state.');
    }
    const message = root.querySelector('.action-message');
    message.textContent = this.t(this.message);
    message.classList.toggle('error', !!this.error);
    root.querySelector('dyson-planner-map')?.setOptions(this._hass, this.model.cameraEntity, this.config.camera_rotation, view.live, this.language);
  }
  positionModernPointer() {
    if (this.config?.theme !== 'modern') return;
    const panel = this.shadowRoot.querySelector('.modern-rooms .fields:not([hidden])');
    const head = this.shadowRoot.querySelector('.modern-rooms .room.open .room-head');
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
  modernControl(key, label, room, field, value, disabled, n) {
    const h = escapeHtml, options = field.options;
    const attrs = `data-setting="${key}" data-room-id="${h(room.roomId)}"`;
    const name = `${label} ${room.name}`;
    const valid = options.includes(value);
    const blocked = disabled || !valid;
    if (key === 'mop_repetitions') {
      return `<div class="modern-control"><span class="field-label">${label}</span><div class="segments" role="group" aria-label="${h(name)}">${options.map((option, i) => `<button ${attrs} data-option="${h(option)}" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}" data-focus="${key}-${n}-${i}" aria-pressed="${value === option}" ${disabled ? 'disabled' : ''}>${h(option === 'One Pass' ? '1×' : option === 'Two Passes' ? '2×' : this.t(option))}</button>`).join('')}</div></div>`;
    }
    const index = options.indexOf(value);
    return `<div class="modern-control"><label class="field-label" for="slider-${key}-${n}">${label}</label><div class="stepped-slider ${blocked ? 'disabled' : ''}"><div class="slider-ticks" aria-hidden="true">${options.map((_, i) => `<span class="slider-tick" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}"></span>`).join('')}</div><input id="slider-${key}-${n}" type="range" min="0" max="${options.length - 1}" step="1" value="${Math.max(0, index)}" aria-label="${h(name)}" aria-valuetext="${this.ht(valid ? value : 'Unavailable')}" ${attrs} data-focus="${key}-${n}" ${blocked || options.length < 2 ? 'disabled' : ''}></div><div class="slider-options" style="--options:${options.length}">${options.map((option, i) => `<button ${attrs} data-option="${h(option)}" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}" data-focus="${key}-${n}-${i}" aria-pressed="${value === option}" ${disabled ? 'disabled' : ''}>${this.ht(option)}</button>`).join('')}</div>${!valid ? `<span class="badge">${this.ht("Unavailable")}</span>` : ''}</div>`;
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
    const modern = this.config.theme === 'modern';
    const roomHtml = rooms.map((room, n) => {
      const selected = this.selected.includes(room.entity), order = this.selected.indexOf(room.entity) + 1;
      const open = this.expanded.has(room.entity || room.name);
      const disabled = this.busy || !room.available;
      const valueOf = key => this.settingDraft[room.roomId]?.[key] ?? room.settings?.[key]?.value;
      const fields = Object.entries(ROOM_FIELDS).map(([key, originalLabel]) => {
        const label = this.t(originalLabel);
        const mode = valueOf('cleaning_mode');
        const omitted = !this.config.always_show_all_settings &&
          ((mode === 'Vacuum' && key === 'water_level') || (mode === 'Mop' && key === 'cleaning_strategy'));
        if (omitted && !modern) return '';
        const reserve = html => omitted ? `<div class="mode-spacer" inert aria-hidden="true">${html}</div>` : html;
        const field = room.settings?.[key];
        if (!field && this.config.unsupported_settings === 'hidden' && !this.config.always_show_all_settings) return '';
        const value = valueOf(key), options = field?.options ?? [];
        if (modern && key !== 'cleaning_mode' && options.length) return reserve(this.modernControl(key, label, room, field, value, disabled, n));
        return reserve(`<label class="field ${key === 'cleaning_mode' ? 'mode' : ''}">${label}<select data-setting="${key}" data-room-id="${h(room.roomId)}" data-focus="${key}-${n}" aria-label="${label} ${h(room.name)}" ${disabled || !field ? 'disabled' : ''}>${!options.includes(value) ? `<option value="">${this.ht("Unavailable")}</option>` : ''}${options.map(option => `<option value="${h(option)}" ${value === option ? 'selected' : ''}>${this.ht(option)}</option>`).join('')}</select>${!field ? `<span class="badge">${this.ht("Not available")}</span>` : ''}</label>`);
      }).join('');
      if (modern) {
        const colors = ['#18c5d9', '#e9b85b', '#b99ae4', '#79b9a5', '#e49baf'];
        return `<section class="room ${selected ? 'selected' : ''} ${open ? 'open' : ''}" style="--room-color:${colors[n % colors.length]};--room-row:${n + 1}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(room.entity)}" aria-label="${this.ht('Select {name}', { name: room.name })}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span class="selection-circle" aria-hidden="true">${selected ? order : ''}</span></label><button class="expand room-settings-toggle" data-focus="expand-${n}" data-expand="${h(room.entity || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="${this.ht('Settings for {name}', { name: room.name })}"><span class="room-settings-copy"><span class="name">${h(room.name)}</span><span class="summary">${!room.available ? this.ht(room.error || 'Unavailable') : this.ht(valueOf('cleaning_mode') ?? 'Room settings unavailable')}</span></span><span aria-hidden="true">${open ? '⌃' : '›'}</span></button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${!room.roomId ? `<p class="badge">${this.ht("Room ID unavailable")}</p>` : ''}</div></section>`;
      }
      return `<section class="room ${selected ? 'selected' : ''}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(room.entity)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span><span class="name">${h(room.name)} ${selected ? `<span class="status">(${order})</span>` : ''}</span><span class="summary">${!room.available ? this.ht(room.error || 'Unavailable') : this.ht(valueOf('cleaning_mode') ?? 'Room settings unavailable')}</span></span></label><button class="expand" data-focus="expand-${n}" data-expand="${h(room.entity || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="${this.ht('Settings for {name}', { name: room.name })}"><span>${this.ht("Settings")}</span> ${open ? '⌃' : '⌄'}</button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${!room.roomId ? `<p class="badge mode">${this.ht("Room ID unavailable. Check the updated integration and refresh rooms.")}</p>` : ''}</div></section>`;
    }).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<div class="rooms ${modern ? 'modern-rooms' : ''}" style="--room-count:${rooms.length}">${roomHtml}</div>${!rooms.length ? `<p class="empty">${this.ht("No enabled rooms found. Check the card configuration and room discovery.")}</p>` : ''}<footer><div class="summary-line"><span>${this.ht('{selected} of {total} rooms selected', { selected: this.selected.length, total: rooms.length })}</span><span class="status ${this.dirty ? 'draft-status' : ''}">${this.dirty ? `<button class="discard-draft" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''} title="${this.ht("Discard draft")}" aria-label="${this.ht("Discard draft")}"><ha-icon icon="mdi:trash-can-outline" aria-hidden="true"></ha-icon></button>${this.ht('Local draft')}` : this.ht('From Home Assistant')}</span></div><div class="actions"><button data-action="save" data-focus="save" ${this._previewDialog || !hasChanges || this.busy || !canSave ? 'disabled' : ''}>${this.ht(this.saving ? 'Saving …' : 'Save settings')}</button><button class="start" data-focus="start" data-action="start" ${this._previewDialog || this.selected.length === 0 || this.busy || startBlockReason(this._hass, this.config.entity) ? 'disabled' : ''}>${this.ht("Start clean")}</button></div>${!canSave || !canStart ? `<p class="notice badge">${this.ht("The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.")}</p>` : ''}${external ? `<p class="notice badge">${this.ht("Settings changed outside this card. Your edited values remain in the local draft.")}</p>` : ''}<p class="notice ${this.error ? 'error' : ''}" role="status" aria-live="polite">${this.ht(this.message)}</p></footer></div>${this.consumablesHtml()}</ha-card>`, 'planner');
    this.updateBattery();
    this.updateConsumables();
    this.updateStatus();
    this.positionModernPointer();
  }
}

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and per-room cleaning settings for Dyson Spot+Scrub.', preview: true });

// Bundled after card.js; uses the same registry connection and identity matching.
class DysonCleaningPlannerEditor extends DysonRegistryElement {
  constructor() {
    super();
    const previewInteraction = event => {
      const el = event.target.closest('input, select, button');
      if (!el) return;
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
        if (el.dataset.key === 'entity') {
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
  setSessionPreview(active) {
    const dialog = this._previewDialog;
    if (!dialog || (sessionPreviewOwners.get(dialog) === this) === active) return;
    if (active) sessionPreviewOwners.set(dialog, this);
    else sessionPreviewOwners.delete(dialog);
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
    const vacuums = this.registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.entity_id.startsWith('vacuum.'));
    const config = { ...this.config, excluded_rooms: this.config.excluded_rooms ?? [], room_order: this.config.room_order ?? [] };
    this.model = config.entity ? discover(this._hass, this.registry, config) : { rooms: [], issues: [] };
    const device = this.registry.find(e => e.entity_id === config.entity)?.device_id;
    const field = (key, label, domain) => {
      const entries = this.registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.device_id === device && e.entity_id.startsWith(`${domain}.`));
      return `<label>${label}<select data-focus="${key}" data-key="${key}"><option value="">${this.ht("Auto-detect")}</option>${entries.map(e => `<option value="${h(e.entity_id)}" ${config[key] === e.entity_id ? 'selected' : ''}>${h(e.name || e.original_name || e.entity_id)}</option>`).join('')}</select></label>`;
    };
    this.paint(`<style>${styles}:host{padding:8px}label{display:grid;gap:8px;margin:0 0 16px;font-size:14px}input[type=text]{padding:12px;border:1px solid var(--dp-line);border-radius:8px;background:var(--dp-bg);color:inherit;width:100%}.entry{display:flex;gap:8px;align-items:center;margin:8px 0}.entry label{display:flex;align-items:center;flex:1;margin:0}.entry button{min-width:42px}h3{font-size:15px;margin-top:24px}.status-options{margin:12px 0 0;padding:8px 0 0 12px;border:0;border-top:1px solid var(--dp-line);min-width:0}.status-options:disabled{opacity:.5}.battery-percentage-option{padding-left:24px}.battery-percentage-option:has(input[disabled]){opacity:.5}</style>
      <label>${this.ht("Dyson device")}<select data-key="entity" data-focus="entity"><option value="">${this.ht("Select a device")}</option>${vacuums.map(e => `<option value="${h(e.entity_id)}" ${config.entity === e.entity_id ? 'selected' : ''}>${h(this._hass.states[e.entity_id]?.attributes?.friendly_name || e.entity_id)}</option>`).join('')}</select></label>
      <label>${this.ht("Title")}<input type="text" data-key="title" data-focus="title" placeholder="${this.ht('Plan a clean')}" value="${h(config.title ?? '')}"></label>
      <label>${this.ht("Language")}<select data-key="language" data-focus="language"><option value="auto" ${!config.language || config.language === 'auto' ? 'selected' : ''}>${this.ht("Automatic")}</option><option value="en" ${config.language === 'en' ? 'selected' : ''}>English</option><option value="de" ${config.language === 'de' ? 'selected' : ''}>Deutsch</option></select></label>
      <label>${this.ht("Theme")}<select data-key="theme" data-focus="theme"><option value="classic" ${config.theme === 'classic' ? 'selected' : ''}>${this.ht("Classic")}</option><option value="modern" ${config.theme !== 'classic' ? 'selected' : ''}>${this.ht("Modern")}</option></select></label>
      <label>${this.ht("Unsupported settings")}<select data-key="unsupported_settings" data-focus="unsupported"><option value="disabled" ${config.unsupported_settings !== 'hidden' ? 'selected' : ''}>${this.ht("Show disabled")}</option><option value="hidden" ${config.unsupported_settings === 'hidden' ? 'selected' : ''}>${this.ht("Hide")}</option></select></label>
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
      ${field('camera_entity', this.ht('Map camera'), 'camera')}
      <label>${this.ht("Map rotation")}<select data-key="camera_rotation" data-focus="camera-rotation">${[0, 90, 180, 270].map(deg => `<option value="${deg}" ${(config.camera_rotation ?? 0) === deg ? 'selected' : ''}>${deg}°</option>`).join('')}</select></label>
      <h3>${this.ht("Rooms in this card")}</h3><p>${this.ht("Choose which rooms to show. Arrows change the display order, not the robot cleaning order.")}</p>
      ${this.model.rooms.map((r, i) => `<div class="entry"><label><input type="checkbox" data-focus="include-${i}" data-include="${h(r.entity)}" ${!r.excluded ? 'checked' : ''} ${!r.entity ? 'disabled' : ''}>${h(r.name)}</label><button data-order="${h(r.entity)}" data-direction="-1" ${i === 0 ? 'disabled' : ''} aria-label="${this.ht('Move {name} up', { name: r.name })}">↑</button><button data-order="${h(r.entity)}" data-direction="1" ${i === this.model.rooms.length - 1 ? 'disabled' : ''} aria-label="${this.ht('Move {name} down', { name: r.name })}">↓</button></div>`).join('')}
      <button data-action="refresh" data-focus="refresh-rooms">${this.ht("Refresh rooms")}</button>
      <p class="notice">${this.ht("Rooms disabled in Home Assistant are not offered. New rooms appear automatically.")}</p><p class="notice error">${this.registryError ? this.ht(this.registryError) : this.model.issues.map(issue => this.ht(issue)).join(' ')}</p>`);
  }
}
if (!customElements.get('dyson-cleaning-planner-card-editor')) customElements.define('dyson-cleaning-planner-card-editor', DysonCleaningPlannerEditor);

