/**
 * Represents a flying Desert Spirit enemy.
 * It moves in a wave-like pattern from right to left.
 */
class DesertSpirit1 extends Enemy {
    height = 100;
    width = 300;
    health = 1;

    // --- Properties for the hovering movement ---
    initialY;               // The original Y position around which it floats
    amplitude = 15;         // How far it swings up and down (in pixels), alt: 50
    angle = 0.5;            // The current angle for the sine calculation, alt: 0
    verticalSpeed = 0.1;    // How fast it floats up and down, alt: 0.05

    IMAGES_FLYING = [
      'images/enemies/desert_spirit/desert_spirit_cloud/desert_spirit_cloud-01.png',
      'images/enemies/desert_spirit/desert_spirit_cloud/desert_spirit_cloud-02.png',
      'images/enemies/desert_spirit/desert_spirit_cloud/desert_spirit_cloud-03.png',
      'images/enemies/desert_spirit/desert_spirit_cloud/desert_spirit_cloud-04.png'
    ];

    IMAGES_DEAD = [
      'images/enemies/desert_spirit/desert_spirit1/dead/desert_spirit1_dead-01.png',
      'images/enemies/desert_spirit/desert_spirit1/dead/desert_spirit1_dead-02.png',
      'images/enemies/desert_spirit/desert_spirit1/dead/desert_spirit1_dead-03.png'
    ];

    /**
     * Creates an instance of a DesertSpirit1.
     * @param {number} startX - The initial X position.
     * @param {World} world - The reference to the game world.
     * @extends Enemy
     * @description Initializes the DesertSpirit1 with its starting position and loads images.
     * Overwrites the Y position so that it starts in the air
     * Also sets a random starting height within a specified range.
     */
    constructor(startX, world) {
      super(startX, world); 
      this.y = 350 + Math.random() * 150;     
      this.initialY = this.y;                 
      this.loadImage(this.IMAGES_FLYING[0]);
      this.loadImages(this.IMAGES_FLYING);
      this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * OVERRIDE: Replaces the startAnimation() of the parent class.
     * Instead of just running to the left, it now moves in a wave-like pattern.
     * Vertical floating motion
     * Animations-Update (changes the image)
     */
    startAnimation() {
        this.movementIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {
                this.moveLeft(); 
                this.float();    
            }
        }, 1000 / 160);
            this.animationIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {
                this.playAnimation(this.IMAGES_FLYING);
            }
        }, 150);
    }

    /**
     * Handles the floating (up and down) movement using a sine wave.
     * This creates a smooth wave-like motion.
     */
    float() {
        this.angle += this.verticalSpeed;
        this.y = this.initialY + Math.sin(this.angle) * this.amplitude;
    }
    
    /**
     * Overwriting the die()-Methode
     * to ensure that the correct death images are used
     * makes the opponent invisible ‘this.height = 0’; after the animation is finished
     */
    die() {
        clearInterval(this.movementIntervalId);
        clearInterval(this.animationIntervalId);

        this.currentImage = 0;
        const deathAnimation = setInterval(() => {
            if (this.currentImage < this.IMAGES_DEAD.length) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.height = 0; 
                clearInterval(deathAnimation);
            }
        }, 100);
    }
}