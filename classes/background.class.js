/**
 * Repräsentiert eine Ebene des Parallax-Hintergrunds.
 * Die Bewegung dieser Objekte wird von der World-Klasse basierend auf dem
 * `parallaxFactor` und der Kameraposition gesteuert.
 */
class BackgroundObject extends MovableObject {
    width = 1000;                       // Volle Breite des Canvas
    height = 700;                       // Volle Höhe des Canvas
    parallaxFactor = 1;                 // Standard: Bewegt sich mit dem Vordergrund


    /**
    * Erstellt eine Instanz einer Hintergrundebene.
    * @param {string} imagePath - Der Pfad zur Bilddatei für diese Ebene.
    * @param {number} x - Die Startposition auf der x-Achse.
    * @param {number} [y=0] - Die Startposition auf der y-Achse (Standard ist 0).
    */
    constructor(imagePath, x, y = 0) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y; 
        this.parallaxFactor;            // Setze den spezifischen Faktor
    }
}