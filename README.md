# Dyson Cleaning Planner Card

Eine native Home-Assistant-Lovelace-Karte für [Dyson Spot+Scrub AI](https://github.com/UNsync3D/ha-dyson-spot-scrub), angelehnt an das [Cleaning-Planner-Mockup](https://github.com/FutuRazor/dyson-cleaning-planner).

**Version 0.2.1 – Prototyp.** Neu sind die Akkuanzeige mit Ladeblitz im Kartenkopf und ein Kamerabild über die volle Kartenbreite mit proportionaler Höhe, auch nach einer Drehung. Während einer aktiven Reinigung ersetzt weiterhin die Statusansicht die Raumauswahl. Die Änderungen sind mit simulierten Home-Assistant-Entitäten getestet.

## Funktionsumfang

- Automatische Raumerkennung aus `vacuum.attributes.rooms` und dem Entitätsregister desselben Dyson-Geräts.
- Umbenannte Entity-IDs werden über die internen Kennungen zugeordnet; keine Ableitung von Entity-IDs aus Anzeigenamen.
- In Home Assistant deaktivierte Räume werden ausgeschlossen. Nicht erreichbare Räume bleiben sichtbar, aber gesperrt.
- Visueller Karteneditor: Gerät, Titel, Räume anzeigen/ausblenden, Standardsortierung, nicht unterstützte Felder ausgrauen/ausblenden, Modus- und Startbutton-Zuordnung.
- Cleaning mode verwendet genau die Optionen der vorhandenen Select-Entität. Alle Raumansichten teilen denselben globalen Entwurfswert.
- Cleaning strategy, Water level und Mop passes: „Noch nicht verfügbar“, ohne erfundene Werte.
- Auswahlreihenfolge und Pfeile bereiten einen geordneten Reinigungsplan vor. **Diese Reihenfolge wird im Prototyp nicht übertragen.** Der aktuelle Startbutton bestimmt den tatsächlichen Ablauf.
- Hell-/Dunkeldarstellung über Home-Assistant-Themen, schmale/mobile Ansichten, getrennte Entwürfe pro Karteninstanz.
- Statusansicht bei Reinigung, Pause, Rückkehr, Fehler und fehlender Verbindung; kein Startbutton in dieser Ansicht.
- Akkuanzeige oben rechts in Planungs- und Statusansicht: farbiges Symbol, Prozentwert und Ladeblitz. Sensoren werden automatisch am gewählten Dyson-Gerät erkannt.
- Optionales Kamerabild des Dyson-Geräts, im Editor vollständig abschaltbar und in 90°-Schritten drehbar. Das vollständige Bild nutzt die Kartenbreite; die Höhe passt sich proportional an das gedrehte Bild an.
- Stop und Home verwenden die vorhandenen HA-Aktionen und die gemeldeten Fähigkeiten der gewählten vacuum-Entität.

## Bedienung

**Akkuanzeige:** Prozentwert aus der Sensorentität mit Registerkennung `…_battery`, Ladezustand aus `…_charging`. Entity-IDs dürfen umbenannt sein; beide Entitäten müssen zum gewählten Dyson-Gerät gehören und aktiviert sein. Das Symbol ist unter 20 % rot, von 20 bis 49 % gelb/orange und ab 50 % grün; die Farben verwenden die entsprechenden Home-Assistant-Themenfarben. Der Ladeblitz erscheint ausschließlich bei bestätigtem `on` des Ladesensors. Fehlende oder ungültige Akkuwerte erscheinen neutral als „—“, bei fehlender HA-Verbindung ebenso. Diese Anzeige löst keine Roboteraktionen aus und beeinflusst die Startfreigabe nicht.

**Bearbeiten** ändert nur den lokalen Entwurf. Es werden keine Aktionen aufgerufen. Globale Einstellungen erscheinen synchron in allen Raumansichten. Der Entwurf wird nicht dauerhaft gespeichert und geht beim Neuladen verloren.

**Speichern** ist deaktiviert. Geplant ist die Speicherung der Einstellungen am Roboter ohne Reinigungsstart. Eine passende Integrationsaktion existiert noch nicht.

**Reinigung starten** setzt bei Bedarf `select.select_option`, gleicht alle erkannten Raumschalter dieses Geräts über `switch.turn_on` / `switch.turn_off` ab und wartet jeweils auf die Zustandsbestätigung. Erst danach wird `button.press` für den vorhandenen „Vacuum Start“-Button aufgerufen. **`vacuum.start` wird nicht verwendet.** Ausgeblendete, noch eingeschaltete Räume werden dabei ausgeschaltet. Ohne Raumauswahl wird kein Start angeboten, da die Integration sonst eine Gesamtreinigung beginnen könnte.

Die Startschaltfläche wird allein durch mindestens einen ausgewählten Raum im lokalen Entwurf freigegeben; während einer laufenden Übertragung bleibt sie gegen Doppelklicks gesperrt. Der Zustand der `button.*`-Startentität wird niemals geprüft. Erst bei Ausführung prüft die Karte die übrigen Voraussetzungen, darunter den vacuum-Zustand `docked` oder `idle`. Bei Fehlern erfolgt kein automatischer Wiederholungsversuch. Bereits übernommene Einstellungen können bestehen bleiben; es gibt im aktuellen Integrationsadapter keine atomare Transaktion und keinen Rollback. Andere Browser, Automationen oder die Dyson-App können gleichzeitig Einstellungen ändern. Nach „Start angefordert“ bestätigt erst der tatsächliche Roboterstatus, dass die Reinigung läuft.

### Während einer Reinigung

Bei `cleaning`, `paused` und `returning` zeigt die Karte den gemeldeten Status, darunter das optionale Kamerabild und die Aktionen Stop/Home. Bei `error`, `unknown`, `unavailable` oder fehlender Verbindung erscheint ebenfalls eine Statusansicht. Die Planung erscheint wieder, sobald die Integration `docked` oder `idle` meldet. Der Startbutton bleibt innerhalb der Planungsansicht ausschließlich an die lokale Auswahl und eine laufende Übertragung gebunden. Nicht ausgewählte, unerreichbare Raumschalter verhindern weiterhin keinen Start.

Nach einem Start über diese Karteninstanz werden die angeforderten Räume als **Requested rooms** angezeigt. Das ist ein lokaler Schnappschuss, keine bestätigte Auftragsliste, Reihenfolge oder Fortschrittsanzeige. Bei einem externen Start, nach Neuladen oder nach Rückkehr zur Planungsansicht wird keine Auftragsliste aus eingeschalteten Raumschaltern abgeleitet. Eine Startanforderung ohne Statusbestätigung zeigt zunächst **Starting clean**; nach 30 Sekunden ohne aktiven Status wird auf die fehlende Bestätigung hingewiesen. Es gibt keinen automatischen Wiederholungsversuch.

- **Stop** ruft `vacuum.stop` auf. Ob dies pausiert oder abbricht, bestimmt die Integration. Die aktuelle Anbindung kann eine Pause weiterhin als `cleaning` melden; deshalb heißt die Ansicht **Cleaning session active**. Ein Fortsetzen-Button wird noch nicht angeboten.
- **Home** ruft ausschließlich `vacuum.return_to_base` auf. Die Karte schaltet dabei keine Räume aus und löscht keine Aufträge. **Bei einer Mehrraumreinigung können noch ausstehende Räume anschließend wieder anlaufen.** Das zuverlässige Abbrechen und Löschen der Warteschlange muss die Integration bereitstellen.
- Die Aktionen sind nur bei gemeldeter Unterstützung, vorhandener HA-Aktion und erreichbarem Roboter bedienbar. Die Karte setzt den Roboterstatus nicht selbst auf „pausiert“, „zurückgekehrt“ oder „abgeschlossen“.

Auch `docked` kann eine Zwischenstation einer Mehrraumreinigung sein. Derzeit fehlt eine verlässliche Kennung für die gesamte Sitzung samt Warteschlange. Die Karte kann deren Abschluss daher nicht erkennen. Bei `returning` kann die aktuelle Integration außerdem einen Kartierungsvorgang melden.

Das Kamerabild wird aus dem aktuellen HA-Kameraproxy geladen, ungefähr alle fünf Sekunden, solange die Statusansicht sichtbar ist und der Roboter einen aktiven Status meldet. Das Aktualisierungsintervall der Integration begrenzt die tatsächliche Bildaktualität. Ausgeblendete Browserseiten und Karten pausieren die Abfragen. Bei Bildfehlern bleiben Status und Aktionen nutzbar; ein vorhandenes letztes Bild wird entsprechend gekennzeichnet. Kamera-Abschaltung betrifft nur diese Karte, nicht die Kameraentität in Home Assistant.

Das Bild reicht bis an die Innenkanten der Lovelace-Karte. Es wird vollständig und ohne Verzerrung skaliert; bei einer Drehung um 90° oder 270° werden Breite und Höhe für die Berechnung getauscht. Die Karte fügt keine seitlichen Leerflächen hinzu. Ränder, die bereits Bestandteil des gelieferten Kamerabildes sind, werden nicht entfernt.

## Installation zum ersten Test

1. `dist/dyson-cleaning-planner-card.js` nach `/config/www/dyson-cleaning-planner-card.js` kopieren. Falls `www` neu angelegt wurde, Home Assistant neu starten.
2. Unter **Einstellungen → Dashboards → Ressourcen** folgende Ressource hinzufügen (gegebenenfalls erweiterten Benutzermodus einschalten):
   - URL: `/local/dyson-cleaning-planner-card.js?v=0.2.1`
   - Typ: **JavaScript-Modul**
3. Dashboard neu laden und eine Karte hinzufügen. Im Kartenkatalog nach **Dyson Cleaning Planner** suchen oder die folgende manuelle Konfiguration verwenden.

### Deine erste Kartenkonfiguration

```yaml
type: custom:dyson-cleaning-planner-card
entity: vacuum.kuche_dyson_spot_scrub
mode_entity: select.kuche_dyson_spot_scrub_vacuum_mode
start_entity: button.kuche_dyson_spot_scrub_vacuum_start
unsupported_settings: disabled
show_camera: true
camera_entity: camera.kuche_dyson_spot_scrub_floor_map
camera_rotation: 0
```

Normalerweise genügt `entity`; Modus, Startbutton, Kamera, Akku und Ladezustand werden automatisch erkannt. Die explizite Zuordnung macht den ersten Test leichter nachvollziehbar. Es sind keine Dyson-Zugangsdaten erforderlich. Der angemeldete Benutzer benötigt Zugriff auf das Entitätsregister und die verwendeten Home-Assistant-Aktionen. Beim manuellen Update die Ressourcenversion ändern und das Dashboard vollständig neu laden.

## HACS

Vorgesehener Repository-Name: **`dyson-cleaning-planner-card`**. Die fertige, eingecheckte Datei liegt unter `dist/dyson-cleaning-planner-card.js`, `hacs.json` im Hauptverzeichnis. Das entspricht den [HACS-Anforderungen für Dashboard-Repositories](https://www.hacs.xyz/docs/publish/plugin/).

Sobald dieses Verzeichnis als öffentliches GitHub-Repository veröffentlicht ist:

1. Repository in HACS als **benutzerdefiniertes Repository**, Kategorie **Dashboard**, hinzufügen.
2. Karte installieren und die erzeugte Dashboard-Ressource prüfen.
3. Falls die Ressource nicht automatisch angelegt wurde: `/hacsfiles/dyson-cleaning-planner-card/dyson-cleaning-planner-card.js` als JavaScript-Modul hinzufügen.

Nicht parallel die manuelle `/local/`- und die HACS-Ressource laden. Dieses Projekt ist noch nicht in den allgemeinen HACS-Katalog aufgenommen. Repository-Beschreibung und GitHub-Themen müssen bei der Veröffentlichung gesetzt werden, etwa `home-assistant`, `hacs`, `lovelace`, `dyson`.

## Konfiguration

| Option | Bedeutung |
|---|---|
| `entity` | Erforderliche Dyson-vacuum-Entität |
| `title` | Überschrift, Standard `Plan a clean` |
| `mode_entity` | Optionale explizite Select-Entität desselben Dyson-Geräts |
| `start_entity` | Optionaler expliziter Startbutton desselben Dyson-Geräts |
| `show_camera` | Kamerabild in der Statusansicht anzeigen, Standard `true`; `false` entfernt Bild und Bildabfragen |
| `camera_entity` | Optionale Kameraentität desselben Dyson-Geräts; automatisch über die Registerkennung `…_floor_map` erkannt |
| `camera_rotation` | Drehung im Uhrzeigersinn: `0` (Standard), `90`, `180` oder `270` Grad |
| `unsupported_settings` | `disabled` (Standard) oder `hidden` |
| `excluded_rooms` | Liste von Raumschalter-Entity-IDs, die diese Karte nicht anbietet |
| `room_order` | Liste von Raumschalter-Entity-IDs für die Darstellungsreihenfolge; neue Räume folgen dahinter |
| `room_entities` | Optionale YAML-Zuordnung von Dyson-Raumnamen zu Schaltern bei uneindeutiger automatischer Erkennung |

```yaml
type: custom:dyson-cleaning-planner-card
entity: vacuum.kuche_dyson_spot_scrub
title: Reinigung planen
unsupported_settings: hidden
excluded_rooms:
  - switch.kuche_dyson_spot_scrub_room_schlafzimmer
room_order:
  - switch.kuche_dyson_spot_scrub_room_kuche
  - switch.kuche_dyson_spot_scrub_room_wohnzimmer
room_entities:
  Küche: switch.kuche_dyson_spot_scrub_room_kuche
```

Die Konfiguration wird von Home Assistant mit dem Dashboard gespeichert. Räume werden alle 30 Sekunden neu erkannt; „Räume neu erkennen“ aktualisiert sofort. Ein Raum, der im Register deaktiviert ist, kann durch die Kartenkonfiguration nicht wieder aktiviert werden. Explizite Entity-ID-Zuordnungen und Ausschlüsse nach einer Umbenennung im Editor prüfen.

## Erster Praxistest

1. Prüfen, ob die fünf aktiven Räume erscheinen und WC fehlt.
2. Zwei Räume auswählen, einen aufklappen und Cleaning mode ändern. Die Änderung muss in beiden Ansichten erscheinen; die echten Entitätszustände dürfen beim Bearbeiten unverändert bleiben.
3. „Entwurf verwerfen“ muss die aktuellen HA-Zustände wieder anzeigen.
4. Zunächst einen Raum und `Vacuum` auswählen und bewusst starten. In Home Assistant prüfen: korrekter Modus, nur der gewählte Raumschalter an, anschließend Aufruf des Startbuttons. Den tatsächlichen Roboterablauf beobachten.
5. Erst nach erfolgreichem Einzelraumtest mehrere Räume testen. Der bisherige Ablauf der Integration (einschließlich möglicher Stationsrückkehr zwischen Räumen) bleibt unverändert.
6. Während der Reinigung müssen Raumauswahl und Start verschwinden; die angeforderten Räume und das Kamerabild erscheinen. Den Kamera-Schalter und alle vier Drehungen im Editor prüfen.
7. Stop und Home bewusst getrennt testen und den tatsächlichen Roboterablauf beobachten. Home darf in der Karte keine Raumschalter zurücksetzen. Eine weiterhin abgearbeitete Warteschlange muss in der Integration behoben werden.
8. Eine Reinigung extern starten oder die Karte während einer Reinigung neu laden: Status und Kamera bleiben nutzbar, eine unbekannte Raumauswahl wird nicht erfunden.
9. Akkuwert mit der Battery-Entität vergleichen. Beim Ladezustand `on` muss der Blitz erscheinen, bei `off` verschwinden. Bei 90°-Drehung muss das Kamerabild die Kartenbreite ausfüllen und die Höhe proportional mitwachsen.

## Entwicklung

Node.js 22 oder neuer. Keine Build- oder Laufzeitabhängigkeiten erforderlich:

```sh
node --test tests/core.test.mjs
node scripts/build.mjs
node scripts/preview.mjs
```

Die Vorschau öffnet sich unter `http://127.0.0.1:8766`. Sie arbeitet ausschließlich mit simulierten Daten. `tests/browser.mjs` nutzt optional eine vorhandene Playwright-Installation; mit `BROWSER_CHANNEL=msedge` kann ein installierter Edge verwendet werden. Screenshots entstehen in `artifacts/`.

`src/core.js` enthält Raumerkennung, Planmodell, Statuszuordnung und Aktionsadapter; `src/card.js` die Karte, `src/map.js` den Kamerarahmen mit Bildaktualisierung und `src/editor.js` den visuellen Editor. Der Build fügt die Module zu einer einzigen Datei zusammen. Die GitHub-Prüfung kontrolliert Tests und ob `dist/` zum Quellcode passt. Der Release-Workflow hängt die gebaute Datei an ein veröffentlichtes GitHub-Release an.

Die spätere Integrationsschnittstelle ist in [docs/integration-contract.md](docs/integration-contract.md) beschrieben. Sie ist ein Entwurf, keine bestehende Integrationsfunktion.
