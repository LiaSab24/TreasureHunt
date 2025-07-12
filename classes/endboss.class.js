class Endboss extends MovableObject {
    constructor(world) {            // endboss nimmt jetzt die Welt als Parameter 
        super();
        this.world = world;    // Speichert die Welt, um später darauf zugreifen zu können
        this.x = 2400;              // Startposition des Endbosses
        this.y = 200;               // Startposition des Endbosses
        this.width = 200;           // Breite des Endbosses
        this.height = 200;          // Höhe des Endbosses
        this.speed = 0.5;           // Geschwindigkeit des Endbosses
        this.health = 3;            // Lebenspunkte des Endbosses
        this.isActuallyDead = false; // Status, ob der Endboss tot ist
        this.IMAGES_WALKING = [
            'images/enemies/endboss/cobra-snake.png',
            'images/enemies/endboss/cobra-snake-move1.png',
            'images/enemies/endboss/cobra-snake-move2.png'
        ];
        this.IMAGES_DEAD = [
            'images/enemies/endboss/cobra-snake-dead.png'
        ];
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImage(this.IMAGES_WALKING[0]); 
        this.animate();             // Starte die Animations-Loop
    }

    /**
     * Prüft, ob der Endboss keine Lebenspunkte mehr hat.
     */
    isDead() {
        return this.isActuallyDead;
    }

    /**
     * Wird aufgerufen, wenn der Endboss getroffen wird.
     */
    hit() {
        this.health -= 1;               // Ein Leben abziehen
        console.log('Endboss getroffen! Leben:', this.health);

        if (this.health <= 0) {
            this.isActuallyDead = true; // Er ist jetzt besiegt!
        }
    }


    /**
     * Startet ein Intervall, um die Animation des Endbosses zu steuern.
     * @memberof Endboss
     */
    animate() {
        setInterval(() => {
            if (!this.isDead()) { // Nur bewegen, wenn er noch lebt
                if (this.world.character.x < this.x) {  // Frage 1: Wo ist der Charakter?
                    this.moveLeft();                    // Antwort: Der Charakter ist links von mir!
                } else {                                // Frage 2: Wo ist der Charakter?
                    this.moveRight();                   // Antwort: Der Charakter ist rechts von mir!
                }
                // NEUE Frage 2: Wo ist der Charakter oben oder unten?
                if (this.world.character.y < this.y) {
                    // Antwort: Der Charakter ist über mir! Jetpack an!
                    this.moveUp();
                } else {
                    // Antwort: Der Charakter ist unter mir! Jetpack aus!
                    this.moveDown();
                }
            }
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);        // Wenn er besiegt ist, zeige das "tot"-Bild
            } else {
                this.playAnimation(this.IMAGES_WALKING);     // Sonst bewegt er sich
            }
        }, 200);                                             // Wechselt das Bild alle 200ms
    }

    moveUp() {
    this.y -= this.speed;
    }

    moveDown() {
        this.y += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    /**
     * Spielt eine Animation ab, indem sie durch ein Array von Bildpfaden iteriert.
     * @param {string[]} images - Das Array der Bilder, die animiert werden sollen.
     * @memberof MovableObject
     */
    playAnimation(images) {
        // Modulo (%) sorgt dafür, dass der Index immer im gültigen Bereich des Arrays bleibt
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path]; // Setzt das zu zeichnende Bild aus dem Cache
        this.currentImage++;
    }
}
