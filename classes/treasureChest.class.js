/**
 * Repräsentiert die Schatztruhe, das Endziel des Spiels.
 * Wenn der Charakter dieses Objekt berührt, ist das Spiel gewonnen.
 */
class TreasureChest extends MovableObject {
  height = 100;
  width = 100;

  /**
   * Erstellt eine Instanz der Schatztruhe an einer bestimmten Position.
   * @param {number} x - Die Position auf der x-Achse.
   * @param {number} y - Die Position auf der y-Achse.
   */
  constructor(x, y) {
    super().loadImage('images/objects/treasure/bag.png');
    this.x = x;
    this.y = y; 
  }
}