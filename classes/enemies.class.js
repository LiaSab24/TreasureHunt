/**
 * Repräsentiert einen Standard-Gegner im Spiel.
 * Erbt von MovableObject und definiert spezifisches Aussehen und Verhalten.
 */
class Enemy extends MovableObject {
    height = 170;
    width = 80;
    y = 380;
    energy = 1; // Standardgegner haben 1 Lebenspunkt.

    IMAGES_WALKING = [
        'images/enemies/enemy/Walk/Walk1.png',
        'images/enemies/enemy/Walk/Walk2.png',
        'images/enemies/enemy/Walk/Walk3.png',
        'images/enemies/enemy/Walk/Walk4.png',
        'images/enemies/enemy/Walk/Walk5.png'
    ];
    IMAGES_DEAD = [
        'images/enemies/enemy/Faint/5.png' // Zeigt nur das letzte "tot"-Bild an.
    ];

    /**
     * Erstellt eine neue Instanz eines Gegners an einer zufälligen Startposition.
     * @param {number} startX - Die Basis-X-Position, zu der ein Zufallswert addiert wird.
     */
    constructor(startX) {
        super().loadImage(this.IMAGES_WALKING[0]); // Ruft den Konstruktor der Elternklasse auf.
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = startX + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.3;

        this.startAnimation();
    }

    /**
     * Startet die permanenten Intervalle für Bewegung und Animation des Gegners.
     */
    startAnimation() {
        // Intervall für die Bewegung
        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        // Intervall für die visuelle Animation
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
    
    /**
     * Bewegt den Gegner konstant nach links.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Verarbeitet einen Treffer auf den Gegner. Ruft die `hit`-Methode
     * der Elternklasse mit einem festen Schaden von 1 auf.
     */
    hit() {
        super.hit(1); // Nutzt die Logik der Elternklasse.
    }
}