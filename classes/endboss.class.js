class Endboss extends MovableObject {
    constructor() {
        super();
        this.x = 2400;              // Startposition des Endbosses
        this.y = 200;               // Startposition des Endbosses
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
        this.loadImage(this.IMAGES_WALKING[0]); 
        this.animate();             // Starte die Animations-Loop
    }

    /**
     * Startet ein Intervall, um die Animation des Endbosses zu steuern.
     * @memberof Endboss
     */
    animate() {
        setInterval(() => {
            // hier soll LOGIK für weitere Zustände rein
            // (z.B. kriechen, angreifen, sterben)
            
            this.playAnimation(this.IMAGES_WALKING);

        }, 200); // Wechselt das Bild alle 200ms
    }

    /**
     * Spielt eine Animation ab, indem sie durch ein Array von Bildpfaden iteriert.
     * @param {string[]} images - Das Array der Bilder, die animiert werden sollen.
     * @memberof MovableObject
     */
    playAnimation(images) {
        // Modulo (%) sorgt dafür, dass der Index immer im gültigen Bereich des Arrays bleibt
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path]; // Setzt das zu zeichnende Bild aus dem Cache
        this.currentImage++;
    }
}
