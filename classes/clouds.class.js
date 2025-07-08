/**
 * Repräsentiert eine Wolke, die sich langsam im Hintergrund bewegt.
 * Trägt zur Atmosphäre des Spiels bei.
 */
class Cloud extends MovableObject {
    y = 80;                             // Startposition weit oben
    x = 0;                              // Startposition links
    height = 100;
    width = 300;
    speed = 0.1;                        // Wolken bewegen sich langsam

    /**
    * Erstellt eine Instanz einer Wolke an einer zufälligen horizontalen Position.
    * @param {number} x - Die initiale Basis-Position auf der x-Achse.
    */
    constructor(x) {
        super().loadImage('images/clouds/cloudWhite.png'); 
        this.x = x + Math.random() * 600; 
        this.animate();
    }

    /**
    * Startet die kontinuierliche Bewegung der Wolke nach links.
    */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60); 
    }

    /**
    * Bewegt die Wolke und setzt sie zurück an den rechten Bildschirmrand,
    * wenn sie links aus dem Bild verschwunden ist.
    */
     moveLeft() {
        this.x -= this.speed;
         if (this.x + this.width < 0) {
             this.x = 1000 + Math.random() * 500; // Canvasbreite + Zufall
         }
    }
}