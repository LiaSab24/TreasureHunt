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

    // Timestamp for idle animation
    lastIdleTime = 0;
    idleDelay = 3000; 
    idleCounter = 0;
    
    /**
     * creates an instance of Character.
    * Initializes properties, loads images, applies gravity, and starts animation.
    * @constructor
     */
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
     * Called in the constructor
     * Animates the character based on its state.
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
     * Called in the constructor
     * Updates the timer for the idle animation.
     */
    updateIdleTimer() {
        if (this.world && (this.world.keyboard['ArrowRight'] || this.world.keyboard['ArrowLeft']) || !this.isOnGround) {
           this.lastIdleTime = new Date().getTime();
        }
    }

    // --- Collect methods ---
    /**
     * Increases the number of collected coins.
     */
    collectCoin() {
        this.coins += 1;
    }

    /**
     * Increases the number of collected stones.
     */
    collectStone() {
        this.stones += 1;
    }

    // --- Life management ---
    /**
     * Called when the character is hit.
     * Reduces the character's health points and sets an invincibility timer.
     */
    hit() {
        if (!this.isHurt()) {
            this.lives -= 1;
            this.lastHitTime = new Date().getTime();

            if (this.isDead()) {
                this.currentImage = 0;
                if (this.world && this.world.audioManager) {
                    this.world.audioManager.play('game_over');
                }
            } else {
                if (this.world && this.world.audioManager) {
                    this.world.audioManager.play('hurt');
                }
                this.x -= 10; 
            }
        }
    }

    /**
     * Checks if the character was recently hurt (is invincible).
     * @returns {boolean} True if the character is invincible, otherwise false.
     */
    isHurt() {
        const timePassed = new Date().getTime() - this.lastHitTime; 
        return timePassed < this.invincibilityDuration;
    }

    /**
     * Checks if the character has no lives left.
     * @returns {boolean} True if lives <= 0, otherwise false.
     */
    isDead() {
        return this.lives <= 0;
    }

    /**
     * Moves the character to the right.
     */
    moveRight() {
        if(!this.isDead()){                         
            this.x += this.speed;
            this.facingDirection = 'right';         
        }
    }

    /**
     * Moves the character to the left.
     */
    moveLeft() {
        if (!this.isDead() && this.x > 0) {
           this.x -= this.speed;
           this.facingDirection = 'left';          
        }
    }

    /**
    * Initiates the character's jump.
    * This method checks if the character is able to jump (i.e., is on the ground and not dead).
    * If the conditions are met, it applies an initial vertical and horizontal speed
    * to propel the character upwards and forwards, and updates the character's state to be airborne.
    * @returns {void} This function does not return a value.
    */
    jump() {         
        if (this.isOnGround && !this.isDead()) {            
            this.speedY = 20;                                                    
            this.isOnGround = false;
            if (this.world && this.world.audioManager) {    
                this.world.audioManager.play('jump');
            }
        }
    }

    /**
     * Checks if the character is in the air (i.e., not standing on the ground).
     * This is the basis for the jump animation and for jump attacks.
     * @returns {boolean} - true if the character is in the air, otherwise false.
     */
    isAboveGround() {
        return this.y < 380; 
    }

    /**
     * Makes the character bounce after a successful jump on an enemy.
     */
    bounce() {
        this.speedY = 15; 
    }

     /**
         * Applies gravity to the character when it is in the air.
         * Updates the vertical speed and position.
         */ 
    applyGravity() {
        if (this.isDead()) return;                  
        if (!this.isOnGround || this.speedY > 0) {
            this.y -= this.speedY;                  
            this.speedY -= this.acceleration;       
            if (this.y >= this.GROUND_Y) {
                this.y = this.GROUND_Y;             
                this.speedY = 0;                    
                this.isOnGround = true;
            }
        }
    }

    /**
    * Triggers the throw of a stone if the conditions are met.
    * The starting position of the stone is the center of the character.
    * Consumes a stone, starts a cooldown and plays the throw sound.
    */
    throwStone() {
        const now = new Date().getTime();
        if (this.stones > 0 && !this.isDead()  && now - this.lastThrowTime > this.throwCooldown) {
            this.stones--;                              
            this.lastThrowTime = now;                   
            this.isThrowing = true;                     
            this.currentImage = 0;                      
            setTimeout(() => {
                this.isThrowing = false;
            }, 350); 

            if (this.world && this.world.audioManager) {
                this.world.audioManager.play('throw');
            }

            let startX = this.x + (this.facingDirection === 'right' ? this.width - 30 : 0); 
            let startY = this.y + this.height / 3;    
            let stone = new ThrowableObject(startX, startY, this.facingDirection, this.world); 
            this.world.addThrowableObject(stone)
            this.world.updateStatusBars(); 

        } 
    }

    /**
     * Draws the character object on the given canvas context.
     * @param {*} ctx - The canvas context to draw on.
     */
    draw(ctx) {
        ctx.save();                             
        if (this.facingDirection === 'left') {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, this.width, this.height);
        } else {
            super.draw(ctx);
        }
        ctx.restore(); 
    }

    /**
     * Selects the next image from the given array and sets this.img.
     * @param {string[]} images - Array of image paths for the current animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;                  
        let path = images[i];
        this.img = this.imageCache[path];                           
        this.currentImage++;
    }
}