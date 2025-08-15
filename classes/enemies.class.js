class Enemy extends MovableObject {
    height = 170;
    width = 80;
    y = 380;
    health = 1;
    movementIntervalId = null;
    animationIntervalId = null;
    world; 

    /**
     * Erstellt eine neue Instanz eines Gegners.
     * Verschiebt einen zufälligen Gegner um 30 Pixel nach oben
     * @param {number} startX - Die anfängliche X-Position, um eine zufällige Verteilung zu ermöglichen.
     * @param {World} world - Die Referenz zum World-Objekt.
     */
    constructor(startX, world) {
        super();
        this.world = world;
        this.x = startX + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.3;
        if (Math.random() < 0.5) {
            this.y -= 30; 
        }
        //this.y += (Math.random() * 20) - 30;
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
     * Verhindert, dass ein bereits toter Gegner erneut getroffen wird
     * Reduziert die Lebenspunkte und löst bei 0 HP den Tod aus.
     */
    hit() {
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
     * Stoppt die Bewegungs- und Animationsintervalle,
     */
    die() {
        clearInterval(this.movementIntervalId);
        clearInterval(this.animationIntervalId);

        this.currentImage = 0; 
        const deathAnimation = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);

            if (this.currentImage >= this.IMAGES_DEAD.length) {
                clearInterval(deathAnimation);
            }
        }, 100);
    }
}