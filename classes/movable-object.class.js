/**
 * Stellt eine Basisklasse für alle beweglichen Objekte im Spiel dar.
 * Sie kümmert sich um Position, Bewegung, Animation, Kollision und Lebensenergie.
 */
class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5; // Simuliert die Schwerkraft
    energy = 100;
    lastHit = 0;

    /**
     * Definiert die Kollisionsbox des Objekts. Die Werte werden von den Rändern
     * nach innen gemessen, um eine präzisere Trefferzone zu schaffen.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
     * Lädt ein einzelnes Bild und setzt es als aktuelles Bild (`this.img`).
     * @param {string} path - Der Pfad zur Bilddatei.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Lädt ein Array von Bildern in den Cache (`this.imageCache`) für flüssige Animationen.
     * @param {string[]} arr - Ein Array von Bildpfaden.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Wendet Gravitation auf das Objekt an, wenn es sich in der Luft befindet.
     * Sorgt dafür, dass Objekte nach einem Sprung wieder fallen.
     */
    applyGravity() {
    //    setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
    //    }, 1000 / 25);
    }

    /**
     * Prüft, ob sich das Objekt über dem Boden befindet.
     * Kann in Unterklassen für fliegende oder andersartige Objekte überschrieben werden.
     * @returns {boolean} - True, wenn das Objekt in der Luft ist.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true; // Wurfobjekte fallen immer weiter nach unten.
        }
        // es wird eine spezifischere Bodenhöhe für den Charakter angenommen.
        // Der Charakter hat y=280, also ist er in der Luft, wenn y kleiner ist.
        // Gegner haben eine andere y-Position (380), daher wird das hier nicht angewendet.
        return this.y < 280; // 380 ist die Bodenhöhe für Gegner, 280 für den Charakter.
    }

    /**
     * Zeichnet das aktuelle Bild des Objekts auf den Canvas.
     * @param {CanvasRenderingContext2D} ctx - Der 2D-Kontext des Canvas.
     */
    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Spielt eine Animationssequenz ab, indem das Bild zyklisch aus einem Bilder-Array gewechselt wird.
     * @param {string[]} images - Das Array der Bilder für die aktuelle Animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Prüft, ob dieses Objekt mit einem anderen Objekt kollidiert.
     * Berücksichtigt dabei die definierten Offsets für eine präzisere Kollisionsbox.
     * @param {MovableObject} obj - Das andere Objekt, mit dem die Kollision geprüft wird.
     * @returns {boolean} - True, wenn eine Kollision stattfindet.
     */
    isColliding(obj) {
        return (this.x + this.width - this.offset.right) > (obj.x + obj.offset.left) &&
            (this.y + this.height - this.offset.bottom) > (obj.y + obj.offset.top) &&
            (this.x + this.offset.left) < (obj.x + obj.width - obj.offset.right) &&
            (this.y + this.offset.top) < (obj.y + obj.height - obj.offset.bottom);
    }

    /**
     * Verarbeitet einen Treffer, reduziert die Energie des Objekts und setzt einen Zeitstempel.
     * @param {number} damage - Die Menge an Schaden, die zugefügt wird.
     */
    hit(damage = 1) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Prüft, ob das Objekt keine Energie mehr hat (d.h. "tot" ist).
     * @returns {boolean} - True, wenn die Energie 0 ist.
     */
    isDead() {
        return this.energy === 0;
    }
    
    /**
     * Prüft, ob das Objekt kürzlich verletzt wurde (für kurzzeitige Unverwundbarkeit).
     * @returns {boolean} - True, wenn der letzte Treffer weniger als 1 Sekunde zurückliegt.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
        timepassed = timepassed / 1000; // Differenz in s
        return timepassed < 1;
    }
}