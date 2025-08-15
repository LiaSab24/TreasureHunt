class Enemy1 extends Enemy {
    height = 170;
    width = 80;

    IMAGES_WALKING = [
      'images/enemies/enemy/enemy1/Walk/Walk1.png',
      'images/enemies/enemy/enemy1/Walk/Walk2.png',
      'images/enemies/enemy/enemy1/Walk/Walk3.png',
      'images/enemies/enemy/enemy1/Walk/Walk4.png',
      'images/enemies/enemy/enemy1/Walk/Walk5.png'
    ];

    IMAGES_DEAD = [
      'images/enemies/enemy/enemy1/Faint/1.png',
      'images/enemies/enemy/enemy1/Faint/2.png',
      'images/enemies/enemy/enemy1/Faint/3.png',
      'images/enemies/enemy/enemy1/Faint/4.png',
      'images/enemies/enemy/enemy1/Faint/5.png'
    ];

    constructor(startX, world) {
      super(startX, world);
      this.loadImage(this.IMAGES_WALKING[0]);
      this.loadImages(this.IMAGES_WALKING);
      this.loadImages(this.IMAGES_DEAD);
    }
}