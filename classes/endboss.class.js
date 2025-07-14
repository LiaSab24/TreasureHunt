class Endboss extends MovableObject {
    constructor(world) {            // endboss nimmt jetzt die Welt als Parameter 
        super();
        this.world = world;         // Speichert die Welt, um später darauf zugreifen zu können
        this.x = 2400;              // Startposition des Endbosses
        this.y = 200;               // Startposition des Endbosses
        this.width = 200;           // Breite des Endbosses
        this.height = 200;          // Höhe des Endbosses
        this.speed = 2;             // Geschwindigkeit des Endbosses
        this.health = 5;            // Lebenspunkte des Endbosses
        this.maxHealth = 5;         // Maximale Lebenspunkte des Endbosses
        this.isActuallyDead = false; // Status, ob der Endboss tot ist
        this.canMove = false;      // Status, ob der Endboss pausiert ist
       // this.isStalking = true;     // "Grünes Licht" zum Bewegen
       // this.stalkingPause = 1500;  // 1.5 Sekunden Pause ("Rotes Licht")

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
        // --- TEIL 1: BEWEGUNG & ANIMATION (läuft 60 Mal pro Sekunde für flüssige Bilder) ---
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD); // Zeige das "tot"-Bild
                return; // Wenn tot, mache nichts anderes mehr
            }

            // Prüfe, ob der Boss sich bewegen darf UND ob der Charakter in der Nähe ist.
            const distanceToChar = this.x - this.world.character.x;
            const isCharNear = Math.abs(distanceToChar) < 800; // Boss "erwacht", wenn du in die Nähe kommst

            if (this.canMove && isCharNear) {
                // Wenn der Schalter auf "true" steht, bewege den Boss ein kleines Stück.
                if (distanceToChar > 5) { // Die 5 ist eine kleine Komfortzone, damit er nicht zittert
                    this.moveLeft();
                } else if (distanceToChar < -5) {
                    this.moveRight();
                }
            }
            
            // Die Lauf-Animation wird immer abgespielt, wenn er nicht tot ist.
            this.playAnimation(this.IMAGES_WALKING);

        }, 1000 / 60);

        // --- TEIL 2: DER "ROTES LICHT, GRÜNES LICHT"-TIMER ---
        // Dieser Teil schaltet nur den "canMove"-Schalter an und aus.
        setInterval(() => {
            if (!this.isDead()) {
                console.log("Endboss startet seinen Angriff!");
                this.canMove = true; // Grünes Licht: Los geht's!

                // Wir setzen einen Wecker, um ihn nach kurzer Zeit wieder zu stoppen.
                setTimeout(() => {
                    console.log("Endboss macht eine Pause.");
                    this.canMove = false; // Rotes Licht: Stopp!
                }, 1500); // So lange dauert der Angriff: 1,5 Sekunden
            }
        }, 4000); // Der ganze Zyklus (Angriff + Pause) wiederholt sich alle 4 Sekunden.
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
