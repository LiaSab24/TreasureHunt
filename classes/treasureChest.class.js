/**
 * Represents the treasure chest, the final goal of the game.
 * If the character touches this object, the game is won.
 */
class TreasureChest extends MovableObject {
  height = 300; //100;
  width = 520;//100;

  /**
   * Creates an instance of the treasure chest at a specific position.
   * @param {number} x - The position on the x-axis.
   * @param {number} y - The position on the y-axis.
   */
  constructor(x, y) {
    super();
    this.loadImage('images/objects/treasure/treasure.png');
    this.x = x;
    this.y = y; 
  }
}