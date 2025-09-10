/**
 * Represents a collectible coin.
 * Increases the score and can be used to buy lives.
 */
class Coin extends MovableObject {
    height = 20;
    width = 20;

    /**
     * Creates an instance of a coin.
     * @param {number} x - The position on the x-axis.
     * @param {number} y - The position on the y-axis.
     */
    constructor(x, y) {
        super().loadImage('images/objects/coins/coin.png');
        this.x = x;
        this.y = y;
    }
}