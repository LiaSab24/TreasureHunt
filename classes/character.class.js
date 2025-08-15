class Character extends MovableObject {
    height = 170; 
    width = 80;
    y = 380;     
    speed = 1.5;                               
    speedY = 0; 
    speedX = 0;                                
    acceleration = 1.5; 
    isOnGround = true;                         
    world;                                     
    lives = 5;
    coins = 0;
    stones = 0;
    world;
    lastHitTime = 0;                           
    invincibilityDuration = 1000;              
    lastThrowTime = 0;                         
    throwCooldown = 500;                       
    GROUND_Y = 380;                            
    facingDirection = 'right';                 
    isThrowing = false;                        

    IMAGES_IDLE = [
        'images/character_neu/Idle/1.png',
        'images/character_neu/Idle/2.png',
        'images/character_neu/Idle/3.png',
        'images/character_neu/Idle/4.png'
    ];
    IMAGES_WALKING = [
        'images/character_neu/Walk/1.png',
        'images/character_neu/Walk/2.png',
        'images/character_neu/Walk/3.png',
        'images/character_neu/Walk/4.png',
        'images/character_neu/Walk/5.png',
        'images/character_neu/Walk/6.png'
    ];
    IMAGES_JUMPING = [ 
        'images/character_neu/Jump/1.png',
        'images/character_neu/Jump/2.png',
        'images/character_neu/Jump/3.png',
        'images/character_neu/Jump/4.png',
        'images/character_neu/Jump/5.png',
        'images/character_neu/Jump/6.png'
    ];
    IMAGES_HURT = [
        'images/character_neu/Hurt/1.png',
        'images/character_neu/Hurt/2.png'
    ];
    IMAGES_DEAD = [
        'images/character_neu/Faint/1.png', 
        'images/character_neu/Faint/2.png',
        'images/character_neu/Faint/3.png',
        'images/character_neu/Faint/4.png'
    ];
    IMAGES_THROW = [
        'images/character_neu/Throw/1.png',
        'images/character_neu/Throw/2.png',
        'images/character_neu/Throw/3.png'
    ];

    // Zeitstempel für Idle-Animation
    lastIdleTime = 0;
    idleDelay = 3000; 
    idleCounter = 0;
    
    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);        
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_THROW);
        this.applyGravity();
        this.animate();                             
        this.lastIdleTime = new Date().getTime();   
    }

    /**
     * wird im constructor aufgerufen
     * Animiert den Charakter basierend auf seinem Zustand.
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isPaused) { return; }
            let imagesToPlay;
            if (this.isDead()) {
                imagesToPlay = this.IMAGES_DEAD;
            } else if (this.isHurt()) {
                imagesToPlay = this.IMAGES_HURT;
            } else if (this.isThrowing) {  
                imagesToPlay = this.IMAGES_THROW;
            }else if (!this.isOnGround) {
                imagesToPlay = this.IMAGES_JUMPING;
                this.lastIdleTime = new Date().getTime(); 
            } else if (this.world && (this.world.keyboard['ArrowRight'] || this.world.keyboard['ArrowLeft'] || this.world.keyboard['TOUCH_RIGHT'] || this.world.keyboard['TOUCH_LEFT'])) {
                imagesToPlay = this.IMAGES_WALKING;
                this.lastIdleTime = new Date().getTime(); 
            } else {
                if (new Date().getTime() - this.lastIdleTime > this.idleDelay) {
                    imagesToPlay = this.IMAGES_IDLE; 
                } else {
                    imagesToPlay = [this.IMAGES_IDLE[0]]; 
                }
            }
            this.playAnimation(imagesToPlay);

        }, 120); 
    }

    /**
     * wird im constructor aufgerufen
     * Aktualisiert den Timer für die Idle-Animation.
     */
    updateIdleTimer() {
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
        if (!this.isHurt()) {                               
            this.lives -= 1;
            this.lastHitTime = new Date().getTime();    

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
        const timePassed = new Date().getTime() - this.lastHitTime; 
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
        if(!this.isDead()){                         
            this.x += this.speed;
            this.facingDirection = 'right';         
        }
    }

    moveLeft() {
        // Verhindere Bewegung über den linken Rand hinaus
        if (!this.isDead() && this.x > 0) {
           this.x -= this.speed;
           this.facingDirection = 'left';          
        }
    }

    /**
    * Initiates the character's jump.
    * * This method checks if the character is able to jump (i.e., is on the ground and not dead).
    * If the conditions are met, it applies an initial vertical and horizontal speed
    * to propel the character upwards and forwards, and updates the character's state to be airborne.
    * * @returns {void} This function does not return a value.
    */
    jump() {         
        if (this.isOnGround && !this.isDead()) {            
            this.speedY = 20;                               
          /*  this.speedX = 10;    */                       
            this.isOnGround = false;
            if (this.world && this.world.audioManager) {    
                this.world.audioManager.play('jump');
            }
        }
    }

    /**
     * Prüft, ob der Charakter sich in der Luft befindet (d.h. nicht auf dem Boden steht).
     * Dies ist die Grundlage für die Sprunganimation und für Sprung-Angriffe.
     * @returns {boolean} - true, wenn der Charakter in der Luft ist, sonst false.
     */
    isAboveGround() {
        return this.y < 380; 
    }

    /**
     * Lässt den Charakter nach einem erfolgreichen Sprung auf einen Gegner abprallen.
     */
    bounce() {
        this.speedY = 15; 
    }

   /**
     * Wendet Gravitation auf den Charakter an, wenn er sich in der Luft befindet.
     * Aktualisiert die vertikale Geschwindigkeit und Position.
     */ 
    applyGravity() {
        if (this.isDead()) return;                  
        if (!this.isOnGround || this.speedY > 0) {
            this.y -= this.speedY;                  
            this.speedY -= this.acceleration;       
            //Lanndung
            if (this.y >= this.GROUND_Y) {
                this.y = this.GROUND_Y;             
                this.speedY = 0;                    
                this.isOnGround = true;
            }
        }
    }

     /**
     * Löst den Wurf eines Steins aus, wenn die Bedingungen erfüllt sind.
     * Verbraucht einen Stein, startet einen Cooldown und spielt den Wurf-Sound.
     */
    throwStone() {
        const now = new Date().getTime();
        // Prüfen: Genug Steine? Nicht tot? Cooldown abgelaufen?
        if (this.stones > 0 && !this.isDead()  && now - this.lastThrowTime > this.throwCooldown) {
            this.stones--;                              // Einen Stein verbrauchen
            this.lastThrowTime = now;                   // Zeit des Wurfs speichern
            this.isThrowing = true;                     // Wurfanimation starten
            this.currentImage = 0;                      // Wurf-Animation von vorne starten
            setTimeout(() => {
                this.isThrowing = false;
            }, 350); // 350ms reichen für eine kurze Wurf-Animation

            // NEU: Spielt den Wurf-Sound direkt hier ab
            if (this.world && this.world.audioManager) {
                this.world.audioManager.play('throw');
            }

            // Startposition des Steins (z.B. Mitte des Charakters)
            let startX = this.x + (this.facingDirection === 'right' ? this.width - 30 : 0); // Etwas vor dem Charakter starten
            let startY = this.y + this.height / 3;      // Etwas höher als die Füße

            // Neues Wurfobjekt erstellen
            let stone = new ThrowableObject(startX, startY, this.facingDirection, this.world); 
            // Wurfobjekt zur Welt hinzufügen (Methode muss in World existieren)
            this.world.addThrowableObject(stone)
            this.world.updateStatusBars(); // Sicherstellen, dass Steinabzug angezeigt wird

        } 
    }

    draw(ctx) {
        ctx.save();                             // Wir speichern die aktuelle Einstellung vom Stift
        if (this.facingDirection === 'left') {
            // Wenn der Charakter nach links schaut, wrid das Bild gespiegelt
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, this.width, this.height);
        } else {
            super.draw(ctx);
        }
        ctx.restore(); 
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