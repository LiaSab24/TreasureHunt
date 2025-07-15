class Endboss extends MovableObject {
    constructor(world) {
        super();
        this.world = world;
        this.x = 2400;
        this.y = 200;
        this.width = 200;
        this.height = 200;
        
        this.Speed = 1.5; // Grundgeschwindigkeit

        this.health = 5;
        this.maxHealth = 5;
        this.isActuallyDead = false;
        this.actionColldown = false; 
        this.hasDescended = false; // Flag, ob sich die Schlange schon 'abwärts' zum character bewegt hat

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
        if (this.health <= 0) {
            this.isActuallyDead = true;
        }
    }
    
     // HINZUGEFÜGT: Stellt sicher, dass die Bewegung funktioniert.
    moveRight() {
        this.x += this.speed;
    }

    // HINZUGEFÜGT: Stellt sicher, dass die Bewegung funktioniert.
    moveLeft() {
        this.x -= this.speed;
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
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }

            // Die normale Lauf-Animation läuft immer.
            this.playAnimation(this.IMAGES_WALKING);

            // Nur wenn der Cooldown vorbei ist, darf eine neue Aktion gestartet werden.
            if (!this.actionCooldown) {
                this.decideNextAction();
            }
        }, 200);  
    }
    
    /**
     * VÖLLIG NEUE LOGIK: Der Taktgeber der Schlange.
     * Entscheidet, was die nächste Aktion ist und führt sie aus.
     */
    decideNextAction() {
        // 1. Cooldown setzen: Verhindert, dass diese Funktion 60x pro Sekunde aufgerufen wird.
        this.actionCooldown = true;

        const distanceToChar = Math.abs(this.x - this.world.character.x);

        // Nur aktiv werden, wenn der Charakter in der Nähe ist.
        if (distanceToChar < 850) {
            // Y-Achsen-Bewegung beim ersten Mal
            if (!this.hasDescended) {
                this.descendToGround();
                this.hasDescended = true;
            }

            // ZUFALL: Zu 70% greift sie an, zu 30% pausiert sie. Das macht sie unberechenbar.
            if (Math.random() > 0.3) {
                // ANGRIFFS-AKTION
                console.log("Schlange greift an!");
                this.speed = 4; // Schneller für den Angriff
                this.moveTowardsCharacterForDuration(400); // Bewegt sich für 0.4 Sekunden
                
                // Setzt den Cooldown für die nächste Aktion.
                setTimeout(() => { this.actionCooldown = false; }, 1500); // 1.5s Pause nach dem Angriff

            } else {
                // PAUSEN-AKTION
                console.log("Schlange pausiert und lauert...");
                // Setzt den Cooldown für die nächste Aktion.
                setTimeout(() => { this.actionCooldown = false; }, 2000); // 2s reine Pause
            }
        } else {
            // Wenn der Charakter weit weg ist, warte einfach.
            setTimeout(() => { this.actionCooldown = false; }, 500);
        }
    }

    /**
     * HELFER-FUNKTION: Bewegt die Schlange für eine bestimmte Dauer.
     * @param {number} duration - Die Dauer der Bewegung in Millisekunden.
     */
    moveTowardsCharacterForDuration(duration) {
        const direction = (this.x > this.world.character.x) ? 'left' : 'right';
        
        const moveInterval = setInterval(() => {
            if (direction === 'left') {
                this.moveLeft();
            } else {
                this.moveRight();
            }
        }, 1000 / 60);

        // Stoppt die Bewegung nach der angegebenen Dauer.
        setTimeout(() => {
            clearInterval(moveInterval);
        }, duration);
    }

    // Bewegt die Schlange langsam nach unten
    descendToGround() {
        const targetY = 220; // Die Zielhöhe
        const descendInterval = setInterval(() => {
            if (this.y < targetY) {
                this.y += 0.5; // Geschwindigkeit des Heruntergleitens
            } else {
                this.y = targetY;
                clearInterval(descendInterval);
            }
        }, 1000 / 60);
    }
    
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
}