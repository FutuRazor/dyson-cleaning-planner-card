# Dyson Cleaning Planner Card

Eine native Home-Assistant-Lovelace-Karte für [Dyson Spot+Scrub AI](https://github.com/UNsync3D/ha-dyson-spot-scrub), angelehnt an das [Cleaning-Planner-Mockup](https://github.com/FutuRazor/dyson-cleaning-planner).

**Version 0.1.1 – Prototyp.** Oberfläche und Befehlsablauf sind mit simulierten Home-Assistant-Entitäten getestet. Der praktische Test mit der installierten Integration v1.3.0 und dem Roboter steht noch aus. Es wurden keine Befehle an einen echten Roboter gesendet.

## Funktionsumfang

- Automatische Raumerkennung aus `vacuum.attributes.rooms` und dem Entitätsregister desselben Dyson-Geräts.
- Umbenannte Entity-IDs werden über die internen Kennungen zugeordnet; keine Ableitung von Entity-IDs aus Anzeigenamen.
- In Home Assistant deaktivierte Räume werden ausgeschlossen. Nicht erreichbare Räume bleiben sichtbar, aber gesperrt.
- Visueller Karteneditor: Gerät, Titel, Räume anzeigen/ausblenden, Standardsortierung, nicht unterstützte Felder ausgrauen/ausblenden, Modus- und Startbutton-Zuordnung.
- Cleaning mode verwendet genau die Optionen der vorhandenen Select-Entität. Alle Raumansichten teilen denselben globalen Entwurfswert.
- Cleaning strategy, Water level und Mop passes: „Noch nicht verfügbar“, ohne erfundene Werte.
- Auswahlreihenfolge und Pfeile bereiten einen geordneten Reinigungsplan vor. **Diese Reihenfolge wird im Prototyp nicht übertragen.** Der aktuelle Startbutton bestimmt den tatsächlichen Ablauf.
- Hell-/Dunkeldarstellung über Home-Assistant-Themen, schmale/mobile Ansichten, getrennte Entwürfe pro Karteninstanz.

## Bedienung

**Bearbeiten** ändert nur den lokalen Entwurf. Es werden keine Aktionen aufgerufen. Globale Einstellungen erscheinen synchron in allen Raumansichten. Der Entwurf wird nicht dauerhaft gespeichert und geht beim Neuladen verloren.

**Speichern** ist deaktiviert. Geplant ist die Speicherung der Einstellungen am Roboter ohne Reinigungsstart. Eine passende Integrationsaktion existiert noch nicht.

**Reinigung starten** setzt bei Bedarf `select.select_option`, gleicht alle erkannten Raumschalter dieses Geräts über `switch.turn_on` / `switch.turn_off` ab und wartet jeweils auf die Zustandsbestätigung. Erst danach wird `button.press` für den vorhandenen „Vacuum Start“-Button aufgerufen. **`vacuum.start` wird nicht verwendet.** Ausgeblendete, noch eingeschaltete Räume werden dabei ausgeschaltet. Ohne Raumauswahl wird kein Start angeboten, da die Integration sonst eine Gesamtreinigung beginnen könnte.

Die Startschaltfläche wird allein durch mindestens einen ausgewählten Raum im lokalen Entwurf freigegeben; während einer laufenden Übertragung bleibt sie gegen Doppelklicks gesperrt. Der Zustand der `button.*`-Startentität wird niemals geprüft. Erst bei Ausführung prüft die Karte die übrigen Voraussetzungen, darunter den vacuum-Zustand `docked` oder `idle`. Bei Fehlern erfolgt kein automatischer Wiederholungsversuch. Bereits übernommene Einstellungen können bestehen bleiben; es gibt im aktuellen Integrationsadapter keine atomare Transaktion und keinen Rollback. Andere Browser, Automationen oder die Dyson-App können gleichzeitig Einstellungen ändern. Nach „Start angefordert“ bestätigt erst der tatsächliche Roboterstatus, dass die Reinigung läuft.

## Installation zum ersten Test

1. `dist/dyson-cleaning-planner-card.js` nach `/config/www/dyson-cleaning-planner-card.js` kopieren. Falls `www` neu angelegt wurde, Home Assistant neu starten.
2. Unter **Einstellungen → Dashboards → Ressourcen** folgende Ressource hinzufügen (gegebenenfalls erweiterten Benutzermodus einschalten):
   - URL: `/local/dyson-cleaning-planner-card.js?v=0.1.1`
   - Typ: **JavaScript-Modul**
3. Dashboard neu laden und eine Karte hinzufügen. Im Kartenkatalog nach **Dyson Cleaning Planner** suchen oder die folgende manuelle Konfiguration verwenden.

### Deine erste Kartenkonfiguration

```yaml
type: custom:dyson-cleaning-planner-card
entity: vacuum.kuche_dyson_spot_scrub
mode_entity: select.kuche_dyson_spot_scrub_vacuum_mode
start_entity: button.kuche_dyson_spot_scrub_vacuum_start
unsupported_settings: disabled
```

Normalerweise genügt `entity`; die beiden weiteren Entitäten werden automatisch erkannt. Die explizite Zuordnung macht den ersten Test leichter nachvollziehbar. Es sind keine Dyson-Zugangsdaten erforderlich. Der angemeldete Benutzer benötigt Zugriff auf das Entitätsregister und die verwendeten Home-Assistant-Aktionen.

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

## Entwicklung

Node.js 22 oder neuer. Keine Build- oder Laufzeitabhängigkeiten erforderlich:

```sh
node --test tests/core.test.mjs
node scripts/build.mjs
node scripts/preview.mjs
```

Die Vorschau öffnet sich unter `http://127.0.0.1:8766`. Sie arbeitet ausschließlich mit simulierten Daten. `tests/browser.mjs` nutzt optional eine vorhandene Playwright-Installation; mit `BROWSER_CHANNEL=msedge` kann ein installierter Edge verwendet werden. Screenshots entstehen in `artifacts/`.

`src/core.js` enthält Raumerkennung, Planmodell und den aktuellen Startadapter; `src/card.js` die Karte und `src/editor.js` den visuellen Editor. Der Build fügt die Module zu einer einzigen Datei zusammen. Die GitHub-Prüfung kontrolliert Tests und ob `dist/` zum Quellcode passt. Der Release-Workflow hängt die gebaute Datei an ein veröffentlichtes GitHub-Release an.

Die spätere Integrationsschnittstelle ist in [docs/integration-contract.md](docs/integration-contract.md) beschrieben. Sie ist ein Entwurf, keine bestehende Integrationsfunktion.
