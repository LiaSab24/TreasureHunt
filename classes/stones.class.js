/**
 * Represents a collectible stone lying on the ground.
 * Serves as ammunition for the character.
 */
class Stone extends MovableObject {
    height = 30;
    width = 30;

    /**
     * Creates an instance of a collectible stone.
     * @param {number} x - The position on the x-axis.
     * @param {number} y - The position on the y-axis.
     */
     constructor(x, y) {
        super().loadImage('images/objects/stones/stone.PNG');
        this.x = x;
        this.y = y;
    }
}