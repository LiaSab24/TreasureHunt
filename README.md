# Treasure Hunt - 2D Run & Jump Game

Ein klassisches 2D-Jump'n'Run-Spiel, entwickelt mit objektorientiertem JavaScript, HTML und CSS. 
Begleite den Helden auf seiner Schatzsuche, sammle Münzen, weiche Gegnern aus und finde die verborgene Schatztruhe!

**Live-Demo:** [Hier klicken, um das Spiel zu spielen!]((https://liasab24.github.io/TreasureHunt/ ))

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

1.  **Klone das Repository:**
    ```bash
    git clone https://github.com/LiaSab24/JumpRunGame.git
    ```
2.  **Öffne die `index.html`:**
    Navigiere in den Projektordner und öffne die `index.html`-Datei in einem modernen Webbrowser (z.B. Chrome, Firefox, Safari).

    > **Tipp:** Für die beste Erfahrung und um potenzielle Probleme mit dem Laden von lokalen Dateien zu vermeiden
    > , wird empfohlen,einen lokalen Webserver zu verwenden.
    > Eine einfache Möglichkeit ist die [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) Erweiterung für Visual Studio Code.

## Projektstruktur
Das Projekt ist modular aufgebaut, um eine klare Trennung der Verantwortlichkeiten zu gewährleisten:

-   **/classes:** Enthält alle JavaScript-Klassen, die die Spielelemente definieren.
    -   `movable-object.class.js`: Die Basisklasse für alle beweglichen Objekte mit gemeinsamer Logik (Position, Bilder laden, Kollision).
    -   `character.class.js`: Steuert den Spieler, seine Animationen, Aktionen (Springen, Werfen) und Lebenspunkte.
    -   `enemies.class.js`: Definiert das Verhalten und die Animation der Gegner.
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

## Gameplay-Steuerung
-   **Laufen:** `⬅️` / `➡️` Pfeiltasten
-   **Springen:** `⬆️` Pfeiltaste
-   **Stein werfen:** `D`-Taste

## Dokumentation
Weitere Details zur Entwicklung und Architektur finden sich hier:
- [**Architecture Decision Records (ADRs)**](./docs/adr/) - Wichtige technische Entscheidungen.
- [**Changelog**](./docs/CHANGELOG.md) - Eine Übersicht aller Änderungen pro Version.
