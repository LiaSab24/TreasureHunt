class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;                               
    imageCache = {};                    
    currentImage = 0;                   

        /**
         * Loads a single image and sets it as the object's image.
         * @param {string} path - The path to the image file.
         */
    loadImage(path) {
        this.img = new Image();         
        this.img.onload = () => {       
        };
        this.img.src = path;
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - An array of image paths (e.g. for animations)
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


    /**
     * Draws the object on the given canvas context.
     * Called by World. Should often be overridden in subclasses.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
     */
    draw(ctx) {
        if (this.img) {
             ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
             ctx.fillStyle = 'grey';
             ctx.fillRect(this.x, this.y, this.width, this.height);
             console.warn('Kein Bild zum Zeichnen für Objekt an x:', this.x, 'y:', this.y);
        }
    }

    /**
     * Moves the object to the right. Should be implemented in subclasses.
     */
     moveRight() {
     }

    /**
     * Moves the object to the left. Should be implemented in subclasses.
     */
     moveLeft() {
     }

    /**
     * Basic rectangle collision detection.
     * @param {MovableObject} obj - The other MovableObject to check collision with.
     * @returns {boolean} True if colliding, otherwise false.
     */
     isColliding(obj) {
        return this.x + this.width > obj.x &&
               this.y + this.height > obj.y &&
               this.x < obj.x + obj.width &&
               this.y < obj.y + obj.height;
     }
}
