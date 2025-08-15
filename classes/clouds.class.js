/**
 * Repräsentiert Wolken, die sich langsam im Hintergrund bewegen
 * Trägt zur Atmosphäre des Spiels bei.
 */
class Cloud extends MovableObject {
    y = 80;                             
    x = 0;                              
    height = 100;
    width = 300;
    speed = 0.1;                        
    world;

    /**
    * Erstellt eine Instanz einer Wolke an einer zufälligen horizontalen Position.
    * @param {number} x - Die initiale Basis-Position auf der x-Achse.
    */
    constructor(x, world) {
        super().loadImage('images/clouds/cloudWhite.png'); 
        this.world = world;
        this.x = x + Math.random() * 600; 
        this.animate();
    }

    /**
    * Startet die kontinuierliche Bewegung der Wolke nach links.
    */
    animate() {
        setInterval(() => {
           if (this.world && this.world.isPaused) {
            } else {
                 this.moveLeft();
            }
        }, 1000 / 60); 
    }

    /**
    * Bewegt die Wolke und setzt sie zurück an den rechten Bildschirmrand,
    * wenn sie links aus dem Bild verschwunden ist.
    */
     moveLeft() {
        this.x -= this.speed;
         if (this.x + this.width < 0) {
             this.x = 1000 + Math.random() * 500; 
         }
    }
}