class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;                                // Variable für das Bild-Objekt
    imageCache = {};                    // Cache für geladene Bilder
    currentImage = 0;                   // Index für Animationen

    // Lädt ein Bild
    loadImage(path) {
        this.img = new Image();         // Standard JS Image Objekt
        this.img.onload = () => {       // Bild erfolgreich geladen
        };
        this.img.onerror = () => {
            // Fehler beim Laden des Bildes
            console.error(`FEHLER: Bild konnte nicht geladen werden: ${path}. Bitte Pfad und Datei überprüfen!`);
            // Optional: Setze ein Platzhalterbild oder markiere das Objekt als "defekt"
            // this.img = new Image(); // Erstelle ein leeres Bild, um weitere Fehler zu vermeiden
            // this.img.src = 'img/placeholder_error.png'; // Pfad zu einem Fehler-Platzhalterbild
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
                // console.log(`Animationsbild erfolgreich geladen: ${path}`); // Optional
            };
            img.onerror = () => {
                console.error(`FEHLER: Animationsbild konnte nicht geladen werden: ${path}.`);
            };
            img.src = path;
            this.imageCache[path] = img; // Speichert Bild im Cache unter seinem Pfad
        });
    }


    // Methode zum Zeichnen (wird von World aufgerufen)
    // Muss in Unterklassen oft überschrieben werden
    draw(ctx) {
        if (this.img) {
             ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: Zeichne ein einfaches Rechteck, wenn kein Bild geladen ist
             ctx.fillStyle = 'grey';
             ctx.fillRect(this.x, this.y, this.width, this.height);
             console.warn('Kein Bild zum Zeichnen für Objekt an x:', this.x, 'y:', this.y);
        }
    }

     // Einfache Bewegungsfunktionen (Beispiele)
     moveRight() {
        console.log('Moving right'); // Für Debugging
        // Wird später durch Spiel-Logik (z.B. world.character.x += world.character.speed) gesteuert
     }

     moveLeft() {
        console.log('Moving left'); // Für Debugging
        // Wird später durch Spiel-Logik gesteuert
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
