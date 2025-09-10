class Enemy extends MovableObject {
    height = 170;
    width = 80;
    y = 380;
    health = 1;
    movementIntervalId = null;
    animationIntervalId = null;
    world; 

    /**
     * Creates a new instance of an enemy.
     * Moves a random enemy 30 pixels up.
     * @param {number} startX - The initial X position to allow random distribution.
     * @param {World} world - The reference to the World object.
     */
    constructor(startX, world) {
        super();
        this.world = world;
        this.x = startX + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.3;
        if (Math.random() < 0.5) {
            this.y -= 30; 
        }
        //this.y += (Math.random() * 20) - 30;
        this.startAnimation();
    }

    /**
     * Starts the movement and animation intervals for the enemy.
     */
    startAnimation() {
        this.movementIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Moves the enemy to the left as long as it is alive.
     */
    moveLeft() {
        if (!this.isDead()) {
            this.x -= this.speed;
        }
    }

    /**
     * Plays an animation sequence.
     * @param {string[]} images - The array of images to use for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Processes a hit on the enemy.
     * Prevents a dead enemy from being hit again.
     * Reduces health points and triggers death at 0 HP.
     */
    hit() {
        if (this.isDead()) return;

        this.health -= 1;
        if (this.isDead()) {
            this.die();
        }
    }

    /**
     * Checks if the enemy has no health points left.
     * This is the single source of truth for the death state.
     * @returns {boolean} - True if the enemy is dead, otherwise false.
     */
    isDead() {
        return this.health <= 0;
    }

    /**
     * Initiates the death sequence.
     * Stops the movement and animation intervals.
     */
    die() {
        clearInterval(this.movementIntervalId);
        clearInterval(this.animationIntervalId);

        this.currentImage = 0; 
        const deathAnimation = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);

            if (this.currentImage >= this.IMAGES_DEAD.length) {
                clearInterval(deathAnimation);
            }
        }, 100);
    }
}