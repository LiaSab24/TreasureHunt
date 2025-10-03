class SandParticle extends MovableObject {
    speedX = 0;
    speedY = 0;
    alpha = 1; // Transparenz
    size = 2; // Größe des Partikels
    depth = 1;

    constructor(x, y, speedX, speedY, size, alpha, depth) {
        super();
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.size = size;
        this.alpha = alpha;
        this.depth = depth;
        this.color = 'rgba(124, 69, 14, 0.8)'; 
        let colorValue = 100 + (depth * 50); // Erzeugt Werte zwischen 100 (dunkel) und 150 (heller)
        this.color = `rgba(${colorValue}, ${colorValue - 20}, ${colorValue - 40}, `; // Ergibt einen Braunton
    }

    // Update-Logik für Partikel
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.004; // Partikel verblassen langsam
        return this.alpha > 0; // Gibt true zurück, solange sichtbar
    }

    // Zeichenlogik für Partikel
    //draw(ctx) {
    //    ctx.save();
    //    ctx.fillStyle = this.color + this.alpha + ')';
    //    ctx.fillRect(this.x, this.y, this.size, this.size);
    //    ctx.restore();
    //}

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color + this.alpha + ')';       //`rgba(139, 115, 85, ${this.alpha})`; // Benutzt die dunklere Farbe direk
        ctx.beginPath();                                     // Startet den Zeichenpfad
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  // x, y, Radius, Startwinkel, Endwinkel
        ctx.fill();                                          // Füllt den Kreis mit der Farbe
        ctx.restore();
    }

}