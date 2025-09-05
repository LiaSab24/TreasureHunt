class Endboss extends MovableObject {
    constructor(world) {
        super();
        this.world = world;
        this.x = 2400;
        this.y = 200;
        this.width = 200;
        this.height = 200;   
        this.Speed = 1.5; 
        this.health = 5;    
        this.maxHealth = 5; 
        this.isActuallyDead = false;
        this.actionColldown = false; 
        this.hasDescended = false; 

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
     * Checks if the final boss is dead.
     * @returns {boolean} - True if dead, false otherwise.
     */
    isDead() {
        return this.isActuallyDead;
    }

    /**
     * Handles the hit logic for the final boss.
     */
    hit() {
        if (this.isActuallyDead || this.world.isPaused) {
            return; 
        }
        
        this.health -= 1;                                               
        if (this.health <= 0) {
            this.health = 0;                                            
            this.isActuallyDead = true;
        }
    }

    /**
     * Moves the final boss to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the final boss to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Moves the final boss downwards.
     */
    moveDown() {
        this.y += this.speed;
    }
    /**
     * Controls the movements and animations of the final boss
     * Checks the status of the final boss and applies the appropriate speed
     * The state of the final boss is updated regularly to control its behavior
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }
            this.playAnimation(this.IMAGES_WALKING)
            if (!this.actionCooldown) {
                this.decideNextAction();
            }
        }, 200);  
    }
    
    /**
     * The snake's clock.
     * Decides what the next action is and executes it.
     */
    decideNextAction() {
        this.actionCooldown = true;
        const distanceToChar = Math.abs(this.x - this.world.character.x);
        if (distanceToChar < 850) {
            if (!this.hasDescended) {
                this.descendToGround();
                this.hasDescended = true;
            }
            if (Math.random() > 0.3) {
                this.speed = 4; 
                this.moveTowardsCharacterForDuration(400);                
                setTimeout(() => { this.actionCooldown = false; }, 1500); 
            } else {
                setTimeout(() => { this.actionCooldown = false; }, 2000); 
            }
        } else {
            setTimeout(() => { this.actionCooldown = false; }, 500);
        }
    }

    /**
     * HELPER FUNCTION: Moves the snake for a specific duration.
     * @param {number} duration - The duration of the movement in milliseconds.
     */
    moveTowardsCharacterForDuration(duration) {
        const direction = (this.x > this.world.character.x) ? 'left' : 'right';        
        const moveInterval = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            if (direction === 'left') {
                this.moveLeft();
            } else {
                this.moveRight();
            }
        }, 1000 / 60);

        setTimeout(() => {
            clearInterval(moveInterval);
        }, duration);
    }

    /**
     * Lets the snake sink to the ground to start the animation.
     * The snake slowly sinks to a specific Y position.
     */
    descendToGround() {
        const targetY = 380;                            
        const descendInterval = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            if (this.y < targetY) {
                this.y += 0.5;                          
            } else {
                this.y = targetY;
                clearInterval(descendInterval);
            }
        }, 1000 / 60);
    }
    
    /**
     * Plays an animation by iterating through an array of image paths.
     * @param {string[]} images - The array of images to animate.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path]; 
        this.currentImage++;
    }
}