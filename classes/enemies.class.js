class Enemy extends MovableObject {
    height = 170;
    width = 80;
    y = 380; // Startet am Boden
    health = 1; // Jeder Gegner hat 1 Lebenspunkt

    IMAGES_WALKING = [
        'images/enemies/enemy/Walk/Walk1.png',
        'images/enemies/enemy/Walk/Walk2.png',
        'images/enemies/enemy/Walk/Walk3.png',
        'images/enemies/enemy/Walk/Walk4.png',
        'images/enemies/enemy/Walk/Walk5.png'
    ];

    IMAGES_DEAD = [
        'images/enemies/enemy/Faint/1.png',
        'images/enemies/enemy/Faint/2.png',
        'images/enemies/enemy/Faint/3.png',
        'images/enemies/enemy/Faint/4.png',
        'images/enemies/enemy/Faint/5.png'
    ];

    movementIntervalId = null;
    animationIntervalId = null;
    world; // Referenz auf die Welt

    /**
     * Erstellt eine neue Instanz eines Gegners.
     * @param {number} startX - Die anfängliche X-Position, um eine zufällige Verteilung zu ermöglichen.
     * @param {World} world - Die Referenz zum World-Objekt.
     */
    constructor(startX, world) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.world = world;
        this.x = startX + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.3;
        this.startAnimation();
    }

    /**
     * Startet die Bewegungs- und Animationsintervalle für den Gegner.
     */
    startAnimation() {
        this.movementIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Bewegt den Gegner nach links, solange er lebt.
     */
    moveLeft() {
        if (!this.isDead()) {
            this.x -= this.speed;
        }
    }

    /**
     * Spielt eine Animationssequenz ab.
     * @param {string[]} images - Das Array der Bilder, die für die Animation verwendet werden sollen.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Verarbeitet einen Treffer auf den Gegner.
     * Reduziert die Lebenspunkte und löst bei 0 HP den Tod aus.
     */
    hit() {
        // Verhindert, dass ein bereits toter Gegner erneut getroffen wird
        if (this.isDead()) return;

        this.health -= 1;
        if (this.isDead()) {
            this.die();
        }
    }

    /**
     * Prüft, ob der Gegner keine Lebenspunkte mehr hat.
     * Dies ist die "Single Source of Truth" für den Todeszustand.
     * @returns {boolean} - True, wenn der Gegner tot ist, sonst false.
     */
    isDead() {
        return this.health <= 0;
    }

    /**
     * Leitet die Todessequenz ein.
     * Stoppt die Bewegung und startet die Todesanimation.
     */
    die() {
        clearInterval(this.movementIntervalId);
        clearInterval(this.animationIntervalId);

        this.currentImage = 0; // Setzt den Animationszähler für die Todesanimation zurück
        const deathAnimation = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);

            // Stoppt die Todesanimation, nachdem sie einmal durchgelaufen ist
            if (this.currentImage >= this.IMAGES_DEAD.length) {
                clearInterval(deathAnimation);
            }
        }, 100);
    }
}