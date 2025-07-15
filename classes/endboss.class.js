class Endboss extends MovableObject {
    constructor(world) {
        super();
        this.world = world;
        this.x = 2400;
        this.y = 200;
        this.width = 200;
        this.height = 200;
        
        // verschiedene Geschwindigkeiten für verschiedene Aktionen
        this.stalkingSpeed = 0.75; // Langsames Schleichen
        this.lungeSpeed = 9;      // Blitzschneller Angriff

        this.health = 5;
        this.maxHealth = 5;
        this.isActuallyDead = false;

        // der Zustands-Schalter, der das Verhalten steuert
        this.state = 'stalking'; // endBoss beginnt im Schleich-Modus
        this.lungeDirection = 'left'; // Richtung des Angriffs

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

    isDead() {
        return this.isActuallyDead;
    }

    hit() {
        if (this.isDead() || this.world.isPaused) {
            return; // Wenn Endboss tot ist oder Spiel pausiert, passiert nichts
        }
        
        this.health -= 1;                   // Reduziert Leben des Endbosses um 1
        if(this.state === 'pausing') {      // Beim ersten Treffer aus dem Lauer-Modus erwachen lassen
            this.state = 'lunging';
        }

        if (this.health <= 0) {
            this.isActuallyDead = true;
            this.state = 'dead';            // Zustand auf 'tot' setzen
        }
    }
    
    /**
     * neuer Ansatz für animate() LOGIK mit unterschiedlichen Angriffsphasen
     * 
     * steuert die Bewegungen und Animationen des Endbosses
     * prüft den Zustand des Endbosses und wendet die passende Geschwindigkeit an
     * Zustand des Endbosses wird regelmäßig aktualisiert, um das Verhalten zu steuern
     * 
     * @returns {void}
     */
    animate() {
        // --- Die BEWEGUNG (60x pro Sekunde) ---
        // Bewegungslogik wird nur ausgeführt, wenn der Boss NICHT tot ist
        setInterval(() => {
            if (!this.isDead() && !this.world.isPaused) {
                const distanceToChar = this.x - this.world.character.x;
                if (Math.abs(distanceToChar) < 800) {
                    
                    if (this.state === 'stalking') {
                        this.speed = this.stalkingSpeed;
                        this.moveTowardsCharacter();
                    } else if (this.state === 'lunging') {
                        // KORREKTUR "Zittern": Bewegt sich nur noch in die einmal festgelegte Richtung.
                        this.speed = this.lungeSpeed;
                        if (this.lungeDirection === 'left') {
                            this.moveLeft();
                        } else {
                            this.moveRight();
                        }
                    }
                }
            }
            
            this.playAnimation(this.isDead() ? this.IMAGES_DEAD : this.IMAGES_WALKING);

        }, 1000 / 60);

        // --- ZUSTANDS-MANAGER (das Taktgefühl) ---
        // steuert den Rhythmus der Schlange, indem sie nach bestimmten Zeiten den Zustand ändert
        this.updateBrain();
    }

    /**
     * HELFER-FUNKTION Bewegt den endBoss in Richtung des Charakters
     */
    moveTowardsCharacter() {
        const distanceToChar = this.x - this.world.character.x;
        if (distanceToChar > 5) {   // "Komfortzone", um das Zittern beim Schleichen zu minimieren
            this.moveLeft();
        } else if (distanceToChar < -5) {
            this.moveRight();
        }
    }
    
     // HIER IST DIE FEHLENDE FUNKTION:
    /**
     * Spielt eine Animation ab, indem sie durch ein Array von Bildpfaden iteriert.
     * @param {string[]} images - Das Array der Bilder, die animiert werden sollen.
     */
    playAnimation(images) {
        // Modulo (%) sorgt dafür, dass der Index immer im gültigen Bereich des Arrays bleibt
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path]; // Setzt das zu zeichnende Bild aus dem Cache
        this.currentImage++;
    }

    /**
     * steuert den Ablauf der Angriffs-Phasen
     */
    updateBrain() {
        if (this.isDead() || this.world.isPaused) {
            // Wenn das Spiel pausiert, wird es in 1 Sekunde erneut versucht, das Gehirn zu aktualisieren
            setTimeout(() => this.updateBrain(), 1000);
            return;
        }

        if (this.state === 'stalking') {
            // endBoss schleicht für 3 Sekunden, dann...
            setTimeout(() => {
                this.state = 'pausing'; // ...geh/ er in den Lauer-Modus
                this.updateBrain();     // starte den nächsten Gehirn-Zyklus
            }, 3000);

        } else if (this.state === 'pausing') {
            // Lauert für 1.5 Sekunden, dann...
            setTimeout(() => {
                this.lungeDirection = (this.x > this.world.character.x) ? 'left' : 'right'; // Legt die Angriffsrichtung fest, BEVOR der Angriff startet
                this.state = 'lunging'; // ...schnappe zu!
                this.updateBrain();
            }, 1500);

        } else if (this.state === 'lunging') {
            // Schnappt für eine halbe Sekunde (0.5s) zu, dann...
            setTimeout(() => {
                this.state = 'stalking'; // ...beginne wieder mit dem Schleichen!
                this.updateBrain();
            }, 500);
        }
    }
}