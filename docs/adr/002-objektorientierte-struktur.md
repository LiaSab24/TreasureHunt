# ADR 002: Objektorientierte Struktur mit Klassen
-   **Datum:** 2025-04-27
-   **Status:** Akzeptiert

## Kontext
Das Spiel besteht aus vielen verschiedenen, aber oft ähnlichen Elementen (Spieler, Gegner, Münzen, Wolken). 
Ich benötigte eine Code-Struktur, die wiederverwendbar, wartbar und leicht erweiterbar ist.

## Entscheidung
Ich nutze eine **objektorientierte Architektur in JavaScript mit ES6 Klassen**. 
Eine Basisklasse `MovableObject` wird erstellt, von der spezifischere Klassen wie `Character`, `Enemy` und `Coin` erben.

## Begründung
-   **Wiederverwendbarkeit (DRY-Prinzip):** 
    Gemeinsame Eigenschaften und Methoden (z.B. Position `x`/`y`, `loadImage()`, `draw()`, `isColliding()`) werden in `MovableObject` definiert
    und müssen nicht in jeder Klasse neu geschrieben werden.
-   **Kapselung:** 
    Jede Klasse ist für ihr eigenes Verhalten und ihre eigenen Daten verantwortlich.
    Das macht den Code verständlicher und reduziert Fehler.
-   **Erweiterbarkeit:** 
    Neue Gegnertypen oder Objekte können einfach durch Erstellen einer neuen Klasse,
    die von `MovableObject` oder `Enemy` erbt, hinzugefügt werden, ohne bestehenden Code stark verändern zu müssen.
