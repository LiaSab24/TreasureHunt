class Character extends MovableObject {
    // ... (deine Eigenschaften bleiben alle gleich) ...

    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]); // Lade das erste Idle-Bild
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_THROW);
        this.applyGravity();
        this.animate(); // << Starte die überarbeitete Animation
    }

    /**
     * Steuert die Zustands- und Animationslogik des Charakters in einem festen Intervall.
     */
    animate() {
        // Intervall für die Bewegung (bleibt wie es war, falls du es brauchst)
        setInterval(() => {
            // Hier könnte Logik für die Bewegung stehen, aber die wird schon von world.class gesteuert
        }, 1000 / 60);

        // Intervall für die Animation (langsamer!)
        setInterval(() => {
            // 1. Entscheide, welche Animation abgespielt werden soll
            let imagesToPlay;
            if (this.isDead()) {
                imagesToPlay = this.IMAGES_DEAD;
            } else if (this.isHurt()) {
                imagesToPlay = this.IMAGES_HURT;
            } else if (!this.isOnGround) {
                imagesToPlay = this.IMAGES_JUMPING;
            } else if (this.world && (this.world.keyboard['ArrowRight'] || this.world.keyboard['ArrowLeft'])) {
                imagesToPlay = this.IMAGES_WALKING;
            } else {
                imagesToPlay = this.IMAGES_IDLE;
            }
            
            // 2. Spiele die ausgewählte Animation ab
            this.playAnimation(imagesToPlay);

        }, 120); // <-- HIER STELLST DU DIE ANIMATIONSGESCHWINDIGKEIT EIN
                 // 120ms bedeutet ca. 8 Bilder pro Sekunde. Experimentiere mit Werten zwischen 80 und 150.
    }

    // ... (Methoden wie collectCoin, hit, isHurt, isDead, moveRight, moveLeft, jump, etc. bleiben unverändert) ...

    /**
     * Zeichnet den Charakter auf den Canvas.
     * Die Logik zur Auswahl der Animation wurde in die animate()-Methode verschoben.
     * @param {CanvasRenderingContext2D} ctx - Der 2D-Kontext des Canvas.
     */
    draw(ctx) {
        // Die Logik zur Auswahl der Animation ist jetzt in animate().
        // Die draw() Methode zeichnet nur noch das aktuelle Bild (this.img), das von playAnimation() gesetzt wird.

        ctx.save(); // Zustand speichern
        if (this.facingDirection === 'left') {
            // Bild spiegeln
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, this.width, this.height);
        } else {
            // Normal zeichnen
            super.draw(ctx);
        }
        ctx.restore(); // Zustand wiederherstellen
    }

    /**
     * Wählt das nächste Bild aus dem gegebenen Array aus und setzt this.img.
     * (Diese Methode bleibt unverändert)
     * @param {string[]} images - Array von Bildpfaden für die aktuelle Animation.
     */
    playAnimation(images) {
        // Todesanimation nur einmal abspielen
        if (this.isDead() && this.currentImage >= images.length) {
            this.img = this.imageCache[images[images.length - 1]]; // Letztes Bild halten
            return;
        }

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}