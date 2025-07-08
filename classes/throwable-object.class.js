/**
 * Repräsentiert ein Objekt, das vom Charakter geworfen werden kann, z.B. einen Stein.
 * Erbt von MovableObject und fügt eine Flugbahn-Logik (Gravitation) hinzu.
 */
class ThrowableObject extends MovableObject {
    speedX = 15;                                                // Horizontale Geschwindigkeit des Wurfs
    speedY = 15;                                                // Anfängliche vertikale Geschwindigkeit (für den Bogen)
    acceleration = 0.5;                                         // Gravitation für den Stein
    rotation = 0;                                               // Für eine kleine Dreh-Animation (optional)
    trajectorIntervalId = null;                                 // Intervall-ID für die Flugbahn-Animation
    world;   
    isDestroyed = false;                                        // Referenz auf die Welt, in der sich das Objekt befindet

    /**
     * Erstellt eine Instanz eines Wurfobjekts.
     * @param {number} x - Die Startposition auf der x-Achse.
     * @param {number} y - Die Startposition auf der y-Achse.
     * @param {string} direction - Die Wurfrichtung ('left' oder 'right').
     * @param {World} world - Eine Referenz auf die Spielwelt, um den Pausenzustand zu prüfen.
     */
    constructor(x, y, direction, world) {
        super().loadImage('images/objects/stones/stone1.png'); 
        this.x = x;
        this.y = y;
        this.height = 30;
        this.width = 30;
        this.world = world;                                     // Setze die Welt-Referenz
        this.applyGravity();                                    // Starte den "Fall" (Bogen) sofort
        this.throw(direction);                                  // Setze die horizontale Richtung
    }

    /**
     * Setzt die horizontale Wurfrichtung und Geschwindigkeit.
     * @param {string} direction - 'right' oder 'left'
     */
    throw(direction) {
        if (direction === 'left') {
            this.speedX = -this.speedX;                         // Negative Geschwindigkeit für Wurf nach links
        }
        // Die initiale speedY sorgt für den Bogen nach oben
    }

     /**
     * Simuliert die Gravitation für das Wurfobjekt, um eine Bogenflugbahn zu erzeugen.
     * Läuft in einem eigenen Intervall, um eine flüssige Bewegung zu gewährleisten.
     */
    applyGravity() {
        this.trajectorIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {  
                if (this.y < 400) {                                 // Nur solange es nicht "auf dem Boden" ist (vereinfacht)
                 this.y -= this.speedY;
                 this.speedY -= this.acceleration;
            }
             this.x += this.speedX;                             // Horizontale Bewegung
             this.rotation += 15;                               // Lässt den Stein rotieren (optional)
            }
        }, 25);                                                 // Aktualisierungsrate für Flugbahn und Rotation
    }

     /**
     * Überschreibt die geerbte draw-Methode, um eine Rotationsanimation hinzuzufügen.
     * @param {CanvasRenderingContext2D} ctx - Der 2D-Rendering-Kontext des Canvas.
     */
     draw(ctx) {
        if (this.img) {
            ctx.save();                                                             // Speichere aktuellen Zustand des Canvas (wichtig für Rotation)
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);       // Verschiebe Ursprung zur Mitte des Steins
            ctx.rotate(this.rotation * Math.PI / 180);                              // Rotiere den Kontext
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2)); // Verschiebe Ursprung zurück
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);       // Zeichne das Bild an der aktuellen Position
            ctx.restore();                                                          // Stelle vorherigen Zustand des Canvas wieder her
        }
         // --- DEBUG: Kollisionsbox ---
         //ctx.strokeStyle = 'red';
         //ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
     /**
     * Stoppt das Bewegungsintervall des Objekts.
     * Wichtig zur Vermeidung von Performance-Problemen, wenn das Objekt zerstört wird.
     */
     destroy() {
        clearInterval(this.trajectorIntervalId);
        this.trajectorIntervalId = null;
        // Weitere Aufräumarbeiten?
    }
}
