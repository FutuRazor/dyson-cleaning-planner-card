# Prüfung von v0.2.1

Stand: 10. Oktober 2026.

## Bestanden

- 20 automatisierte Node-Tests: bestehender Legacy-Start einschließlich Umlauten, umbenannten Entitäten, deaktivierten/nicht verfügbaren Räumen und konkurrierenden Starts; zusätzlich Statusansicht, Stop/Home ohne Schalteränderungen, Aktionsverfügbarkeit, optionale Kameraerkennung, Konfiguration und Bildanpassung über die volle Breite bei allen Drehungen.
- Akku: automatische Gerätezuordnung auch nach Umbenennung, keine Übernahme fremder oder deaktivierter Sensoren, 0–100 %, Farbstufen, ungültige/fehlende Werte, wiederhergestellte Zustände und fehlende Verbindung. Der Blitz erscheint ausschließlich bei bestätigtem Laden. Sensoränderungen erstellen das Kamerabild nicht neu und erhalten die angeforderten Räume.
- Browserprüfung in einem isolierten Edge mit simuliertem Home Assistant: bisherige Planungsfunktionen und Editoroptionen, Start mit unbeteiligtem unerreichbarem Raum, Wechsel zur Statusansicht, kein erneuter Start während einer Sitzung, angeforderte Räume nur aus der eigenen Startanforderung und wartende Startbestätigung.
- Stop/Home senden jeweils genau eine Aktion an die gewählte vacuum-Entität. Keine zusätzlichen Raumschalteränderungen. Fehler bleiben sichtbar, fehlende Fähigkeiten sperren die betreffende Aktion.
- Kamera: Bildabruf, letzter Bildstand bei HTTP-Fehler, stabile Karteninstanz über Statusänderungen, alle vier Drehungen mit proportionaler Höhe bis an beide Kartenränder, keine weiteren Abfragen nach Abschalten, Rückkehr zur Planung oder Entfernen der Karte.
- Browserbreiten 900, 390 und 320 Pixel: Bildkanten und Seitenverhältnis geprüft; kein horizontaler Seitenüberlauf, keine Überlappung von Akkustand und Kartentitel. Screenshots der Planungs- und Statusansicht einschließlich Dunkeldarstellung visuell angesehen.
- Einzeldatei gebaut und JavaScript-Syntax geprüft.

## Rückmeldungen aus dem Praxistest von v0.2.0

- Nutzer bestätigt funktionierendes Auto-detect in allen bisher beteiligten Einstellungen, einschließlich der Vacuum-Vorauswahl.
- Die seitlichen Leerflächen bei 90°-Drehung führten zur proportionalen Darstellung in v0.2.1.

## Noch offen

- Akkuanzeige und geänderte Bildskalierung von v0.2.1 im echten Home-Assistant-Dashboard.
- Stop-Bedeutung und Mehrraumverhalten nach Home mit der tatsächlich installierten Integration und dem Roboter.
- HACS-Installation aus dem späteren öffentlichen Repository sowie Ausführung der vorbereiteten GitHub-Workflows.
- Zukünftige Einstellungen-speichern-, geordnete Start-, Pause/Fortsetzen- und Warteschlange-löschen-Funktionen der Integration.

Die Browserprüfung simuliert Home-Assistant-Zustände und Aktionsantworten. Sie belegt nicht, dass der Roboter die Befehle bereits korrekt ausführt.
