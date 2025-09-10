/**
 * Represents enemy type 2 with walking and dead animations.
 */
class Enemy2 extends Enemy {
    height = 170;
    width = 100;

    IMAGES_WALKING = [
      'images/enemies/enemy/enemy2/Walk2/walk1.png',
      'images/enemies/enemy/enemy2/Walk2/walk2.png',
      'images/enemies/enemy/enemy2/Walk2/walk3.png',
      'images/enemies/enemy/enemy2/Walk2/walk4.png',
      'images/enemies/enemy/enemy2/Walk2/walk5.png',
      'images/enemies/enemy/enemy2/Walk2/walk6.png'
    ];

    IMAGES_DEAD = [
      'images/enemies/enemy/enemy2/Faint2/faint1.png',
      'images/enemies/enemy/enemy2/Faint2/faint2.png',
      'images/enemies/enemy/enemy2/Faint2/faint3.png',
      'images/enemies/enemy/enemy2/Faint2/faint4.png'
    ];

    /**
     * Creates an instance of Enemy2 and loads its images.
     * @param {number} startX - The initial X position.
     * @param {World} world - The reference to the game world.
     */
    constructor(startX, world) {
      super(startX, world);
      this.loadImage(this.IMAGES_WALKING[0]);
      this.loadImages(this.IMAGES_WALKING);
      this.loadImages(this.IMAGES_DEAD);
    }
}