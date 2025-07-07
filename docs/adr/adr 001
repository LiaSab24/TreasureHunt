# ADR 001: Wahl der Rendering Engine

-   **Datum:** 2025-06-27
-   **Status:** Akzeptiert

## Kontext
Für ein 2D-Spiel müssen viele grafische Elemente (Charakter, Gegner, Objekte, Hintergründe) effizient auf dem Bildschirm gezeichnet und animiert werden. 
Ich benötige eine Technologie, die eine hohe Performance auch bei vielen bewegten Objekten sicherstellt.

## Entscheidung
Ich verwende das **HTML5 `<canvas>`-Element** als primäre Rendering-Engine. Die gesamte Spiellogik zeichnet ihre Objekte Frame für Frame auf diesen einen Canvas.

## Begründung
-   **Performance:** 
    Canvas ist für schnelle, pixelbasierte Grafikoperationen optimiert und deutlich performanter als die Manipulation von hunderten einzelnen DOM-Elementen (`<div>`s), 
    was zu Rucklern führen würde.
-   **Kontrolle:**
    Es gibt somit die volle Kontrolle über den Zeichenprozess, inklusive der Reihenfolge (Z-Index), Spiegelung von Sprites und der Implementierung einer Kamera.
-   **Nachteile (akzeptiert):** 
    Event-Handling (z.B. Klicks auf einen Gegner) und Kollisionserkennung müssen manuell in JavaScript implementiert werden, 
    da ich nicht auf die eingebauten Mechanismen des DOM zurückgreifen kann.
