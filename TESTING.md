# Prüfung von v0.1.1

Stand: 9. Oktober 2026.

## Bestanden

- 12 automatisierte Node-Tests: Gerätezuordnung, umbenannte Entity-IDs, Umlaute, deaktivierte Räume, Karten-Ausschlüsse, exakte Raumschalterauswahl, globale Modusübernahme, Startbutton statt vacuum.start, leere Auswahl, unbekannte Optionen, fehlende Zustandsbestätigung, Aktionsfehler, externe Änderungen, aktive Reinigung und konkurrierende Karteninstanzen.
- Browserprüfung in einem isolierten Edge mit simuliertem Home Assistant: fünf Räume, lokale Bearbeitung ohne Aufrufe, Synchronisierung des globalen Modus, deaktiviertes Speichern, Startablauf, Startfreigabe ausschließlich anhand der lokalen Raumauswahl (während laufender Übertragung gesperrt), ignorierte Startbutton-Zustände einschließlich Zeitstempel, Editoroptionen, Raumausschluss und Offline-Prüfung bei Ausführung.
- Desktop und 390-Pixel-Mobilansicht einschließlich Dunkeldarstellung geprüft; kein horizontaler Seitenüberlauf. Screenshots visuell angesehen.
- Einzeldatei gebaut und JavaScript-Syntax geprüft.

## Noch offen

- Installation und Darstellung im echten Home-Assistant-Dashboard.
- Verhalten mit der tatsächlich installierten Integration v1.3.0 und dem Roboter.
- HACS-Installation aus dem späteren öffentlichen Repository sowie Ausführung der vorbereiteten GitHub-Workflows.
- Zukünftige Einstellungen-speichern- und geordnete Startaktion der Integration.

Die Browserprüfung simuliert Home-Assistant-Zustände und Aktionsantworten. Sie belegt nicht, dass der Roboter die Befehle bereits korrekt ausführt.
