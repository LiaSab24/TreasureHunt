/**
 * Represents clouds that slowly move in the background.
 * Contributes to the atmosphere of the game.
 */
class Cloud extends MovableObject {
    y = 80;                             
    x = 0;                              
    height = 100;
    width = 300;
    speed = 0.1;                        
    world;

    /**
    * Creates an instance of a cloud at a random horizontal position.
    * @param {number} x - The initial base position on the x-axis.
    */
    constructor(x, world) {
        super().loadImage('images/clouds/cloudWhite.png'); 
        this.world = world;
        this.x = x + Math.random() * 600; 
        this.animate();
    }

    /**
    * Starts the continuous movement of the cloud to the left.
    */
    animate() {
        setInterval(() => {
           if (this.world && this.world.isPaused) {
            } else {
                 this.moveLeft();
            }
        }, 1000 / 60); 
    }

    /**
    * Moves the cloud and resets it to the right edge of the screen
    * when it has disappeared off the left side.
    */
     moveLeft() {
        this.x -= this.speed;
         if (this.x + this.width < 0) {
             this.x = 1000 + Math.random() * 500; 
         }
    }
}