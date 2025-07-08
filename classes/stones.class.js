/**
 * Repräsentiert einen sammelbaren Stein, der auf dem Boden liegt.
 * Dient als Munition für den Charakter.
 */
class Stone extends MovableObject {
    height = 30;
    width = 30;

    /**
     * Erstellt eine Instanz eines sammelbaren Steins.
     * @param {number} x - Die Position auf der x-Achse.
     * @param {number} y - Die Position auf der y-Achse.
     */
     constructor(x, y) {
        super().loadImage('images/objects/stones/stone.PNG');
        this.x = x;
        this.y = y;
    }
}