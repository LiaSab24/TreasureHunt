class Character extends MovableObject {
    height = 170; 
    width = 80;
    y = 380;     
    speed = 1.5;                                // Bewegungsgeschwindigkeit des Charakters
    speedY = 0; 
    speedX = 0;                                 // Horizontale Geschwindigkeit (für Wurfobjekte)
    acceleration = 1.5; 
    isOnGround = true;                          // Ist der Charakter am Boden?
    world;                                      // Referenz zur Welt (wird von world.class.js gesetzt)
    lives = 5;
    coins = 0;
    stones = 0;
    world;
    lastHitTime = 0;                            // Zeitpunkt des letzten Treffers
    invincibilityDuration = 1000;               // Dauer der Unverwundbarkeit in ms (1 Sekunde)
    lastThrowTime = 0;                          // Zeitpunkt des letzten Wurfs
    throwCooldown = 500;                        // Cooldown in ms (0.5 Sekunden)
    GROUND_Y = 380;                             // Y-Position des Bodens für diesen Charakter (abhängig von Höhe)
    facingDirection = 'right';                  // Blickrichtung des Charakters (initial nach rechts)

    IMAGES_IDLE = [
        'images/character/Idle/1.png',
        'images/character/Idle/2.png',
        'images/character/Idle/3.png',
        'images/character/Idle/4.png'
    ];
    IMAGES_WALKING = [
        'images/character/Walk/1.png',
        'images/character/Walk/2.png',
        'images/character/Walk/3.png',
        'images/character/Walk/4.png',
        'images/character/Walk/5.png',
        'images/character/Walk/6.png'
    ];
    IMAGES_JUMPING = [ 
        'images/character/Jump/1.png',
        'images/character/Jump/2.png',
        'images/character/Jump/3.png',
        'images/character/Jump/4.png',
        'images/character/Jump/5.png',
        'images/character/Jump/6.png'
    ];
    IMAGES_HURT = [
        'images/character/Hurt/1.png',
        'images/character/Hurt/2.png'
    ];
    IMAGES_DEAD = [
        'images/character/Faint/1.png', 
        'images/character/Faint/2.png',
        'images/character/Faint/3.png',
        'images/character/Faint/4.png'
    ];
    IMAGES_THROW = [
        'images/character/Throw/1.png',
        'images/character/Throw/2.png',
        'images/character/Throw/3.png'
    ];

    // Zeitstempel für Idle-Animation
    lastIdleTime = 0;
    idleDelay = 3000; // Wartezeit in ms bevor Idle-Animation startet
    idleCounter = 0;
    
    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);        // Ladet das erste Idle-Bild
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_THROW);
        this.applyGravity();
        this.animate();                             // Startet die Animation
        this.lastIdleTime = new Date().getTime();   // Setzt die Zeit für die Idle-Animation
    }

    animate() {

         setInterval(() => {
            this.updateIdleTimer();
        }, 120);
    }

    updateIdleTimer() {
        // Wenn der Charakter sich bewegt oder springt, setze den Timer zurück
         if (this.world && (this.world.keyboard['ArrowRight'] || this.world.keyboard['ArrowLeft']) || !this.isOnGround) {
            this.lastIdleTime = new Date().getTime();
         }
     }

 // --- Sammelmethoden ---
    collectCoin() {
        this.coins += 1;
    }

    collectStone() {
        this.stones += 1;
    }

    // --- Lebensmanagement ---
    /**
     * Wird aufgerufen, wenn der Charakter getroffen wird.
     * Reduziert die Lebenspunkte des Charakters und setzt einen Unverwundbarkeits-Timer.
     */
    hit() {
        if (!this.isHurt()) {                           // Nur treffen, wenn nicht gerade unverwundbar      
            this.lives -= 1;
            this.lastHitTime = new Date().getTime();    // Zeit des Treffers speichern

            if (this.isDead()) {
                // Hier kann die Todesanimation gestartet werden
            } else {
                 // Soundeffekt für Treffer
                 // Kurzer Rückstoß
                 // this.x -= 10; // Beispiel für Rückstoß nach links
            }
        }
    }

    /**
     * Prüft, ob der Charakter gerade erst verletzt wurde (unverwundbar ist).
     * @returns {boolean} True, wenn der Charakter unverwundbar ist, sonst false.
     */
    isHurt() {
        const timePassed = new Date().getTime() - this.lastHitTime; // Zeit seit letztem Treffer
        return timePassed < this.invincibilityDuration;
    }

    /**
     * Prüft, ob der Charakter keine Leben mehr hat.
     * @returns {boolean} True, wenn Leben <= 0, sonst false.
     */
    isDead() {
        return this.lives <= 0;
    }

    moveRight() {
        if(!this.isDead()){                         // Nur bewegen wenn nicht tot
            this.x += this.speed;
            this.facingDirection = 'right';         // Blickrichtung aktualisieren
        }
    }

    moveLeft() {
        // Verhindere Bewegung über den linken Rand hinaus
        if (!this.isDead() && this.x > 0) {
           this.x -= this.speed;
           this.facingDirection = 'left';          // Blickrichtung aktualisieren
        }
    }

    /**
    * Initiates the character's jump.
    * * This method checks if the character is able to jump (i.e., is on the ground and not dead).
    * If the conditions are met, it applies an initial vertical and horizontal speed
    * to propel the character upwards and forwards, and updates the character's state to be airborne.
    * * @returns {void} This function does not return a value.
    */
   /**
     * Löst einen Sprung aus, wenn der Charakter am Boden ist.
     * Setzt die vertikale Geschwindigkeit, um den Charakter nach oben zu bewegen.
     */
    jump() {         
        if (this.isOnGround && !this.isDead()) {        // Springen nur erlauben, wenn der Charakter am Boden ist und nicht tot
            this.speedY = 20;                           // Positive Geschwindigkeit nach oben 
          /*  this.speedX = 10;    */                   // Horizontale Geschwindigkeit zurücksetzen 
            this.isOnGround = false;
        }
    }

   /**
     * Wendet Gravitation auf den Charakter an, wenn er sich in der Luft befindet.
     * Aktualisiert die vertikale Geschwindigkeit und Position.
     */ 
    applyGravity() {
        if (this.isDead()) return;                  // Keine Gravitation wenn tot (oder Fallanimation)
        if (!this.isOnGround || this.speedY > 0) {
            this.y += this.speedY;                  // Y-Position basierend auf vertikaler Gesch
            this.speedY += this.acceleration;       // Geschwindigkeit durch Gravitation erhöhen
            //Lanndung
            if (this.y >= this.GROUND_Y) {
                this.y = this.GROUND_Y;             // Genau auf den Boden setzen
                this.speedY = 0;                    // Vertikale Geschwindigkeit stoppen
                this.isOnGround = true;
            }
        }
    }

    throwStone() {
        const now = new Date().getTime();
        // Prüfen: Genug Steine? Nicht tot? Cooldown abgelaufen?
        if (this.stones > 0 && !this.isDead()  && now - this.lastThrowTime > this.throwCooldown) {
            this.stones--;                              // Einen Stein verbrauchen
            this.lastThrowTime = now;                   // Zeit des Wurfs speichern

            // Startposition des Steins (z.B. Mitte des Charakters)
            let startX = this.x + (this.facingDirection === 'right' ? this.width - 30 : 0); // Etwas vor dem Charakter starten
            let startY = this.y + this.height / 3;      // Etwas höher als die Füße

            // Neues Wurfobjekt erstellen
            let stone = new ThrowableObject(startX, startY, this.facingDirection, this.world); 
            // Wurfobjekt zur Welt hinzufügen (Methode muss in World existieren)
            this.world.addThrowableObject(stone);

            // Statusleiste aktualisieren (wird jetzt von World.checkCollisions gemacht,
            // aber hier könnten wir es auch direkt machen)
             this.world.updateStatusBars(); // Sicherstellen, dass Steinabzug angezeigt wird

        } 
    }

    draw(ctx) {
        // 1. Zustand ermitteln (Priorität: Tod > Verletzt > Springen/Fallen > Gehen > Idle)
        let imagesToPlay = this.IMAGES_IDLE; // Standard: Idle

        if (this.isDead()) {
            imagesToPlay = this.IMAGES_DEAD;
             // Optional: Animation nur einmal abspielen oder letzten Frame halten
            if (this.currentImage >= this.IMAGES_DEAD.length -1) {
                this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length -1]];
                super.draw(ctx);                                        // Letzten Frame zeichnen
                return;                                                 // Keine weitere Animation
            }
        } else if (this.isHurt()) {
            imagesToPlay = this.IMAGES_HURT;
        } else if (!this.isOnGround) {                                  // Springen oder Fallen
            imagesToPlay = this.IMAGES_JUMPING;
             this.lastIdleTime = new Date().getTime();                  // Idle Timer zurücksetzen
        } else if (this.world && (this.world.keyboard['ArrowRight'] || this.world.keyboard['ArrowLeft'])) {     // Gehen
            imagesToPlay = this.IMAGES_WALKING;
             this.lastIdleTime = new Date().getTime();                  // Idle Timer zurücksetzen
        } else {                                                        // Idle-Zustand
             // Prüfen, ob lange genug idle für spezielle Animation
             if (new Date().getTime() - this.lastIdleTime > this.idleDelay) {
                 // Hier könnte eine längere, spezielle Idle-Animation kommen
                 // imagesToPlay = this.IMAGES_LONG_IDLE; // Falls vorhanden
                 imagesToPlay = this.IMAGES_IDLE; // Fürs Erste normale Idle-Loop
             } else {
                  imagesToPlay = [this.IMAGES_IDLE[0]]; // Nur erstes Idle-Bild zeigen, wenn nicht lange idle
             }
        }

        // 2. Animation abspielen
        this.playAnimation(imagesToPlay);

        // 3. Bild zeichnen (ggf. gespiegelt)
        ctx.save(); // Zustand speichern
        if (this.facingDirection === 'left') {
            // Bild spiegeln
            ctx.translate(this.x + this.width, this.y);             // Gehe zum rechten Rand des Bildes
            ctx.scale(-1, 1);                                       // Spiegele horizontal
            ctx.drawImage(this.img, 0, 0, this.width, this.height); // Zeichne an gespiegelter Position
        } else {
            // Normal zeichnen
            super.draw(ctx);                                        // Nutzt die geerbte draw-Methode mit this.img
        }
        ctx.restore(); // Zustand wiederherstellen

        // --- DEBUG: Kollisionsbox ---
    //    ctx.strokeStyle = 'blue';
    //    ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Wählt das nächste Bild aus dem gegebenen Array aus und setzt this.img.
     * @param {string[]} images - Array von Bildpfaden für die aktuelle Animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;                  // Index im Array berechnen
        let path = images[i];
        this.img = this.imageCache[path];                           // Bild aus dem Cache holen und setzen
        this.currentImage++;
    }
}
