class Endboss extends MovableObject {
    constructor(world) {            // endboss nimmt jetzt die Welt als Parameter 
        super();
        this.world = world;         // Speichert die Welt, um später darauf zugreifen zu können
        this.x = 2400;              // Startposition des Endbosses
        this.y = 200;               // Startposition des Endbosses
        this.width = 200;           // Breite des Endbosses
        this.height = 200;          // Höhe des Endbosses
        this.speed = 4;             // Geschwindigkeit des Endbosses
        this.health = 5;            // Lebenspunkte des Endbosses
        this.maxHealth = 5;         // Maximale Lebenspunkte des Endbosses
        this.isActuallyDead = false; // Status, ob der Endboss tot ist
        this.isPaused = false;      // Status, ob der Endboss pausiert ist
        this.isStalking = true;     // "Grünes Licht" zum Bewegen
        this.stalkingPause = 1500;  // 1.5 Sekunden Pause ("Rotes Licht")

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
        this.animate();             
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
            if (!this.isDead() && this.isPaused) {    // Nur bewegen, wenn er noch lebt           
                const tolerance = 5;                    // Die neue "Komfort-Zone"
                const distanceX = this.x - this.world.character.x;
            //    const distanceY = this.y - this.world.character.y;
                
                if (distanceX > tolerance) {
                    this.moveLeft();
                } else if (distanceX < -tolerance) {
                    this.moveRight();
                }

            //    if (distanceY > tolerance) {
            //        this.moveUp();
            //    } else if (distanceY < -tolerance) {
            //        this.moveDown();
            //    }
            //    this.isStalking = false;
            //    setTimeout(() => {
            //        this.isStalking = true; // Nach der Pause: Wieder "Grünes Licht"!
            //    }, this.stalkingPause);
            }
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);        // Wenn er besiegt ist, zeige das "tot"-Bild
            } else {
                this.playAnimation(this.IMAGES_WALKING);     // Sonst bewegt er sich
            }
        }, 1000 / 60);                                       // flüssige Bewegung mit 60 FPS
        // --- Gehirn 2: Der Pausen-Wecker (klingelt nur alle paar Sekunden) ---
        setInterval(() => {
            if (!this.isDead()) {
                this.isPaused = true; // Pause starten!
                console.log("Endboss macht eine Pause.");
                setTimeout(() => {
                    this.isPaused = false; // Pause beenden!
                    console.log("Endboss schleicht weiter.");
                }, 1500); // Dauer der Pause: 1.5 Sekunden
            }
        }, 4000); // Alle 4 Sekunden wird eine neue Pause ausgelöst.
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
