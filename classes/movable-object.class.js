class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;                               
    imageCache = {};                    
    currentImage = 0;                   

    loadImage(path) {
        this.img = new Image();         
        this.img.onload = () => {       
        };
        this.img.src = path;
    }

     /**
     * Lädt mehrere Bilder in den imageCache.
     * @param {string[]} arr - Ein Array von Bildpfaden (z.B. für Animationen)
     */
     loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.onload = () => {
            };
            img.onerror = () => {
                console.error(`FEHLER: Animationsbild konnte nicht geladen werden: ${path}.`);
            };
            img.src = path;
            this.imageCache[path] = img; 
        });
    }


    // Methode zum Zeichnen (wird von World aufgerufen)
    // Muss in Unterklassen oft überschrieben werden
    draw(ctx) {
        if (this.img) {
             ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
             ctx.fillStyle = 'grey';
             ctx.fillRect(this.x, this.y, this.width, this.height);
             console.warn('Kein Bild zum Zeichnen für Objekt an x:', this.x, 'y:', this.y);
        }
    }

     moveRight() {
     }

     moveLeft() {
     }

     // Grundlegende Kollisionserkennung (Rechteck-Kollision)
     // obj: Das andere MovableObject, mit dem die Kollision geprüft wird
     isColliding(obj) {
        return this.x + this.width > obj.x &&
               this.y + this.height > obj.y &&
               this.x < obj.x + obj.width &&
               this.y < obj.y + obj.height;
     }
}
