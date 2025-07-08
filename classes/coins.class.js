/**
 * Repräsentiert eine sammelbare Münze.
 * Erhöht den Punktestand und kann zum Kaufen von Leben verwendet werden.
 */
class Coin extends MovableObject {
    height = 20;
    width = 20;

    /**
     * Erstellt eine Instanz einer Münze.
     * @param {number} x - Die Position auf der x-Achse.
     * @param {number} y - Die Position auf der y-Achse.
     */
    constructor(x, y) {
        super().loadImage('images/objects/coins/coin.png');
        this.x = x;
        this.y = y;
    }
}