class Endboss extends MovableObject {
    constructor() {
        super();
        this.x = 1000;              // Startposition des Endbosses
        this.y = 100;               // Startposition des Endbosses
        this.width = 200;           // Breite des Endbosses
        this.height = 200;          // Höhe des Endbosses
        this.speed = 0.5;           // Geschwindigkeit des Endbosses
        this.health = 1;            // Lebenspunkte des Endbosses
        this.IMAGES_WALKING = [
            'images/enemies/endboss/cobra-snake.png',
            'images/enemies/endboss/cobra-snake.png'
        ];
        this.IMAGES_DEAD = [
            'images/enemies/endboss/cobra-snake.png'
        ];
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }
}