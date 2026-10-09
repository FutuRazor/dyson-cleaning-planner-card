# Vorbereitung der zukünftigen Integrationsschnittstelle

Status: Entwurf, nicht implementiert oder mit der Integration vereinbart.

Die Karte hält einen geordneten Plan intern so vor:

```json
{
  "version": 1,
  "rooms": [
    { "entity_id": "switch.example_kitchen", "name": "Küche" },
    { "entity_id": "switch.example_living", "name": "Wohnzimmer" }
  ],
  "mode": "Vacuum"
}
```

Die Arrayposition ist die gewünschte Reihenfolge. Die Entity-ID ist eine Referenz für die derzeitige HA-Anbindung, keine Dyson-Raum-ID. Zukünftig sollte die Integration stabile, kartenbezogene Raum-IDs samt Anzeigenamen veröffentlichen. Dann kann die Karte diese IDs statt Namen übergeben.

## Geplante getrennte Aktionen

- **Einstellungen speichern:** Gerät, Plan und gegebenenfalls Karten-ID validieren; vollständigen Einstellungsblock an den Roboter senden, ohne Reinigung zu starten.
- **Mit Einstellungen starten:** denselben Plan validieren und als zusammengehörigen Auftrag übertragen und starten. Vorheriges Speichern ist nicht nötig.

Namen und Payload dieser HA-Aktionen werden von der Integration vorgegeben. Die Karte soll weder Dyson-MQTT-Daten noch unbekannte Arraypositionen selbst zusammenbauen. Aktuell läuft ausschließlich `startLegacy`.

## Fähigkeiten

Empfohlen ist eine versionierte Fähigkeitsbeschreibung am Gerät/vacuum, zum Beispiel mit Angaben zu `save_settings`, `ordered_room_cleaning`, `per_room_mode`, `water_level`, `cleaning_strategy`, `mop_passes` und deren zulässigen Werten. Feldnamen sind noch offen. Bloßes Vorhandensein einer Aktion oder eine Versionsnummer bestätigt keine Semantik.

Die Integration ist die Quelle für Fähigkeiten, die Kartenkonfiguration entscheidet über ausgegraute oder ausgeblendete Felder. Ohne bestätigte Unterstützung bleibt Speichern deaktiviert und die Reihenfolge ausdrücklich als nicht übertragbar markiert.

## Anforderungen an den zukünftigen Start

- Eindeutige Zielgeräteauswahl; niemals versehentlich alle Roboter adressieren.
- Gesamten Plan einschließlich leerer/ungültiger/doppelter Räume vor dem Senden prüfen.
- Raum-IDs zur aktiven Karte auflösen; unbekannte Parameter im Originalblock erhalten.
- Gewünschte Reihenfolge für aktivierte Räume übertragen; nicht gewählte Räume ausschließen.
- Keine gestartete Reinigung beim bloßen Speichern.
- Fehler an den Aufrufer zurückgeben; idealerweise Auftragskennung, Status und Schutz vor doppelten Starts anbieten.
- Keine Ablaufsteuerung im Browser: Auftrag läuft nach erfolgreicher Übergabe weiter, wenn die Karte geschlossen wird.

## Bekannte Grenzen des Prototyps

Die bisherigen HA-Entitätsänderungen und der anschließende Button-Aufruf sind nicht atomar. Die Karte prüft Bereitschaft und bestätigte Zustände vor dem Start und verhindert parallele Startvorbereitung derselben Entität innerhalb dieses Browsermoduls. Änderungen aus anderen Browsern oder der Dyson-App können nicht vollständig ausgeschlossen werden. Die endgültige Transaktions- und Duplikatbehandlung gehört in die Integration.
