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
        this.health -= 1;
        // Beim ersten Treffer aus dem Lauer-Modus erwachen lassen
        if(this.state === 'pausing') {
            this.state = 'lunging';
        }
        console.log('Endboss getroffen! Leben:', this.health);

        if (this.health <= 0) {
            this.isActuallyDead = true;
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
        // prüfen in welchem Zustand die Schlange ist und die passende Geschwindigkeit anwenden
        setInterval(() => {
            if (this.isDead() || this.world.isPaused) {
                return; // Bei Tod oder Spiel-Pause nichts tun
            }
            
            // Nur bewegen, wenn der Charakter in der Nähe ist
            const distanceToChar = this.x - this.world.character.x;
            if (Math.abs(distanceToChar) < 800) {
                
                if (this.state === 'stalking') {
                    this.speed = this.stalkingSpeed;
                    this.moveTowardsCharacter();
                } else if (this.state === 'lunging') {
                    this.speed = this.lungeSpeed;
                    this.moveTowardsCharacter();
                }
                // Wenn state 'pausing' ist, passiert hier nichts -> die Schlange steht still.
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
        if (distanceToChar > 5) {
            this.moveLeft();
        } else if (distanceToChar < -5) {
            this.moveRight();
        }
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