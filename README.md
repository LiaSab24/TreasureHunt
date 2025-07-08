# Treasure Hunt - 2D Run & Jump Game

Ein klassisches 2D-Jump'n'Run-Spiel, entwickelt mit objektorientiertem JavaScript, HTML und CSS als reine Webanwendung. 
Begleitet den Helden auf seiner Schatzsuche. Folgt den Münzen und sammelt Steine zu seiner Verteidigung. Denn Achtung! Unser Held ist nicht allein auf der Suche nach der verborgene Schatztruhe!🏴‍☠️

**Live-Demo:** [![Treasure Hunt Vorschau](https://raw.githubusercontent.com/LiaSab24/TreasureHunt/main/images/screenshot.png)](https://liasab24.github.io/TreasureHunt/)


## Features
-   Ein steuerbarer Charakter mit Lauf- und Sprunganimationen.
-   Verschiedene Gegnertypen, die die Welt bevölkern.
-   Sammelbare Objekte wie Münzen und Steine.
-   Wurfmechanik: Nutze gesammelte Steine, um Gegner auszuschalten.
-   Ein klares Endziel: Erreiche die Schatztruhe, um das Spiel zu gewinnen.
-   Hintergrundmusik und Soundeffekte für ein immersives Erlebnis.
-   Steuerung über Tastatur, Maus-Klick und Touch-Events für mobile Geräte.

## Technologien
-   **Logik:** Objektorientiertes JavaScript (ES6+ Klassen)
-   **Darstellung:** HTML5 `<canvas>` für eine performante Grafik-Engine.
-   **Struktur & Stil:** Klassisches HTML5 und CSS3.

## Installation & Setup
Da es sich um eine reine Webanwendung handelt, ist keine komplexe Installation nötig.
Zur Erstellung wurde Visual Studio Code genutzt und mit GitHub verknüpft.

## Projektstruktur
Das Projekt ist modular aufgebaut, um eine klare Trennung der Verantwortlichkeiten zu gewährleisten:

-   **/classes:** Enthält alle JavaScript-Klassen, die die Spielelemente definieren.
    -   `movable-object.class.js`: Die Basisklasse für alle beweglichen Objekte mit gemeinsamer Logik (Position, Bilder laden, Kollision).
    -   `character.class.js`: Steuert den Spieler, seine Animationen, Aktionen (Springen, Werfen) und Lebenspunkte.
    -   `enemies.class.js`: Definiert das Verhalten und die Animation der Gegner.
    -   `endboss.class.js`: Definiert das Verhalten und die Animation des Endgegners.
    -   `throwable-object.class.js`: Logik für geworfene Objekte (Steine), inklusive Flugbahn und Rotation.
    -   `coins.class.js`, `stones.class.js`: Klassen für die sammelbaren Objekte im Spiel.
    -   `treasureChest.class.js`: Definiert das Endziel des Spiels, die Schatztruhe.
    -   `clouds.class.js`: Steuert die sich bewegenden Wolken im Hintergrund.
    -   `background.class.js`: Definiert die einzelnen Ebenen des Parallax-Hintergrunds.
    -   `world.class.js`: Die "Haupt-Engine" des Spiels. Sie verwaltet alle Objekte, die Game-Loop, Kollisionen und die Kamera.
-   **/js:** Beinhaltet die globale Spiellogik und die Initialisierung (`game.js`).
-   **/images:** Speichert alle grafischen Assets wie Sprites, Hintergründe und Icons.
-   **/audio:** Enthält alle Soundeffekte und Musikdateien.
-   **/styles:** Beherbergt die CSS-Dateien für das Styling der UI.
-   **`index.html`:** Der Haupteinstiegspunkt des Spiels.

## Gameplay-Steuerung Keyboard
-   **Laufen:** `⬅️` / `➡️` Pfeiltasten
-   **Springen:** `⬆️` Pfeiltaste
-   **Stein werfen:** `D`https://raw.githubusercontent.com/LiaSab24/TreasureHunt/main/images/D.png-Taste

## Gameplay-Steuerung Mouse
-   **Laufen:** Buttons: ` nach Links ` , `nach Rechts`
-   **Springen:** Button: `Springen`
-   **Stein werfen:** Button: `Werfen`

## Gameplay-Steuerung Mobile/Touch
-   **Laufen:** Buttons: ` nach Links ` , `nach Rechts`
-   **Springen:** Button: `Springen`
-   **Stein werfen:** Button: `Werfen`

## Dokumentation
Weitere Details zur Entwicklung und Architektur finden sich hier:
- [**Architecture Decision Records (ADRs)**](./docs/adr/) - Wichtige technische Entscheidungen.
- [**Changelog**](./docs/CHANGELOG.md) - Eine Übersicht aller Änderungen pro Version.
