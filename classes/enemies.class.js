class Enemy extends MovableObject {
    height = 170;
    width = 80;
    y = 380;                // Startet am Boden
    currentImage = 0;       // Aktuelles Bild für Animation
    isActuallyDead = false; // Eigenschaft, um den Tod zu speichern
    health = 1;             // Jeder Gegner hat 1 Lebenspunkt


    IMAGES_WALKING = [
         'images/enemies/enemy/Walk/Walk1.png',
         'images/enemies/enemy/Walk/Walk2.png',
         'images/enemies/enemy/Walk/Walk3.png',
         'images/enemies/enemy/Walk/Walk4.png',
         'images/enemies/enemy/Walk/Walk5.png'
    ];

    IMAGES_DEAD = [
        'images/enemies/enemy/Faint/1.png',
        'images/enemies/enemy/Faint/2.png',
        'images/enemies/enemy/Faint/3.png',
        'images/enemies/enemy/Faint/4.png',
        'images/enemies/enemy/Faint/5.png'
    ];

    isDead = false;                                     // Flag, ob der Gegner getroffen wurde/tot ist
    //otherDirection = true;                            // Flag, ob der Gegner in die andere Richtung schaut
    facingDirection = 'left';  
    animationIntervalId = null;
    movementIntervalId = null;
    world;                                              // Referenz auf die Welt, in der sich der Gegner befindet

    constructor(startX, world) {
        super().loadImage(this.IMAGES_WALKING[0]); 
        this.loadImages(this.IMAGES_WALKING); 
        this.loadImages(this.IMAGES_DEAD);             // Lade die Bilder für den "tot"-Zustand
        this.world = world;                            // Setze die Welt-Referenz
        this.x = startX + Math.random() * 500; 
        this.speed = 0.15 + Math.random() * 0.3; 
        this.animate();

    }

    /**
     * prüft, ob der Gegner tot ist.
     * @returns {boolean}
     */
    isDead() {
        return this.isActuallyDead;
    }

    /**
     * wird aufgerufen, wenn der Gegner getroffen wird
     */
    hit() {
        this.health -= 1;
        if (this.health <= 0) {
            this.isActuallyDead = true;
        }
    }

    moveLeft() {
       if(!this.isDead) {                               // Nur bewegen, wenn nicht tot
            this.x -= this.speed;
            //this.currentImage = (this.currentImage + 1) % this.IMAGES_WALKING.length; // Nächste Animation
            this.otherDirection = true; // Setze die Richtung auf "links"
            //this.img = this.imageCache[this.IMAGES_WALKING[this.currentImage]]; // Setze das Bild
            //this.checkCollision(); // Überprüfe Kollisionen
        }
    }

    animate() {
        clearInterval(this.movementIntervalId);
        clearInterval(this.animationIntervalId);
        this.movementIntervalId = null;
        this.animationIntervalId = null;

        if (!this.isDead) {                                                    // Nur animieren, wenn nicht tot
            this.movementIntervalId = setInterval(() => {
                if (this.world && !this.world.isPaused && !this.isDead) {
                this.moveLeft();
                }
            }, 1000 / 60);
            this.animationIntervalId = setInterval(() => {
                if(this.world && !this.world.isPaused && !this.isDead) {        // Sicherstellen, dass nicht währenddessen gestorben
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }, 200);
        }
    }

     /**
     * Wählt das nächste Bild aus dem gegebenen Array aus und setzt this.img.
     * @param {string[]} images - Array von Bildpfaden für die aktuelle Animation.
     */
     playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

     /**
     * Wird aufgerufen, wenn der Gegner von einem Stein getroffen wird.
     */
    hit() {
        if (!this.isDead) {
            this.isDead = true;                                     // Markiere Gegner als tot
            clearInterval(this.movementIntervalId);                 // Stoppe die Bewegung
            clearInterval(this.animationIntervalId);                // Stoppe die Animation
            this.movementIntervalId = null;                         // IDs zurücksetzen
            this.animationIntervalId = null;

            // Optional: Ändere das Bild zu einem "toten" Bild
            // this.loadImage('images/enemies/boy1/Faint/2.png');
            this.img = this.imageCache[this.IMAGES_DEAD[0]]; // Setze das Bild auf das erste "tot"-Bild

        }
    }

     // Überschreiben der Draw-Methode, um tote Gegner evtl. anders darzustellen
    draw(ctx) {
        //if (this.facingDirection === 'left') {
        //    // Bild spiegeln
        //    ctx.translate(this.x + this.width, this.y);             // Gehe zum rechten Rand des Bildes
        //    ctx.scale(-1, 1);                                       // Spiegele horizontal
        //    ctx.drawImage(this.img, 0, 0, this.width, this.height); // Zeichne an gespiegelter Position
        //} 
       if (this.isDead) {
           // Zeichne tote Version oder nichts mehr (da sie gefiltert werden)
           // Optional: Kurzzeitig ein Todesbild zeichnen
           this.loadImage('images/enemies/enemy/Faint/2.png');
           // super.draw(ctx); // Zeichnet das letzte Bild (evtl. 'dead.png')
       } else {
           super.draw(ctx); // Normal zeichnen
       }
       // --- DEBUG: Kollisionsbox ---
    //   ctx.strokeStyle = 'green';
    //   ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
