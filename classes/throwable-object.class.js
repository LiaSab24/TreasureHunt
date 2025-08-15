/**
 * Repräsentiert ein Objekt, das vom Charakter geworfen werden kann, z.B. einen Stein.
 * Erbt von MovableObject und fügt eine Flugbahn-Logik (Gravitation) hinzu.
 */
class ThrowableObject extends MovableObject {
    speedX = 15;                                                
    speedY = 15;                                                
    acceleration = 0.5;                                         
    rotation = 0;                                               
    trajectorIntervalId = null;                                 
    world;   
    isDestroyed = false;                                        

    /**
     * Erstellt eine Instanz eines Wurfobjekts.
     * @param {number} x - Die Startposition auf der x-Achse.
     * @param {number} y - Die Startposition auf der y-Achse.
     * @param {string} direction - Die Wurfrichtung ('left' oder 'right').
     * @param {World} world - Eine Referenz auf die Spielwelt, um den Pausenzustand zu prüfen.
     */
    constructor(x, y, direction, world) {
        super().loadImage('images/objects/stones/stone.PNG'); 
        this.x = x;
        this.y = y;
        this.height = 30;
        this.width = 30;
        this.world = world;                                   
        this.applyGravity();                                  
        this.throw(direction);                                
    }

    /**
     * Setzt die horizontale Wurfrichtung und Geschwindigkeit.
     * @param {string} direction - 'right' oder 'left'
     */
    throw(direction) {
        if (direction === 'left') {
            this.speedX = -this.speedX;                        
        }
    }

     /**
     * Simuliert die Gravitation für das Wurfobjekt, um eine Bogenflugbahn zu erzeugen.
     * Läuft in einem eigenen Intervall, um eine flüssige Bewegung zu gewährleisten.
     */
    applyGravity() {
        this.trajectorIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {  
                if (this.y < 400) {                           
                 this.y -= this.speedY;
                 this.speedY -= this.acceleration;
            }
             this.x += this.speedX;                           
             this.rotation += 15;                             
            }
        }, 25);                                               
    }

     /**
     * Überschreibt die geerbte draw-Methode, um eine Rotationsanimation hinzuzufügen.
     * @param {CanvasRenderingContext2D} ctx - Der 2D-Rendering-Kontext des Canvas.
     */
     draw(ctx) {
        if (this.img) {
            ctx.save();                                                             
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);       
            ctx.rotate(this.rotation * Math.PI / 180);                              
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2)); 
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);       
            ctx.restore();                                                          
        }
    }
    
     /**
     * Stoppt das Bewegungsintervall des Objekts.
     * Wichtig zur Vermeidung von Performance-Problemen, wenn das Objekt zerstört wird.
     */
     destroy() {
        clearInterval(this.trajectorIntervalId);
        this.trajectorIntervalId = null;
        // Weitere Aufräumarbeiten?
    }
}
