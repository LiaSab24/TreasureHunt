/**
 * Represents an object that can be thrown by the character, e.g. a stone.
 * Inherits from MovableObject and adds trajectory logic (gravity).
 */
class ThrowableObject extends MovableObject {
    speedX = 15;                                                
    speedY = 15;                                                
    acceleration = 0.5;                                         
    rotation = 0;                                               
    trajectorIntervalId = null;                                 
    world;   
    isDestroyed = false;                                        

    /**
     * Creates an instance of a throwable object.
     * @param {number} x - The starting position on the x-axis.
     * @param {number} y - The starting position on the y-axis.
     * @param {string} direction - The throw direction ('left' or 'right').
     * @param {World} world - A reference to the game world to check pause state.
     */
    constructor(x, y, direction, world) {
        super().loadImage('images/objects/stones/stone.PNG'); 
        this.x = x;
        this.y = y;
        this.height = 30;
        this.width = 30;
        this.world = world;                                   
        this.applyGravity();                                  
        this.throw(direction);                                
    }

    /**
     * Sets the horizontal throw direction and speed.
     * @param {string} direction - 'right' or 'left'
     */
    throw(direction) {
        if (direction === 'left') {
            this.speedX = -this.speedX;                        
        }
    }

    /**
    * Simulates gravity for the throwable object to create a curved trajectory.
    * Runs in its own interval for smooth movement.
    */
    applyGravity() {
        this.trajectorIntervalId = setInterval(() => {
            if (this.world && !this.world.isPaused) {  
                if (this.y < 400) {                           
                 this.y -= this.speedY;
                 this.speedY -= this.acceleration;
            }
             this.x += this.speedX;                           
             this.rotation += 15;                             
            }
        }, 25);                                               
    }

    /**
    * Overrides the inherited draw method to add a rotation animation.
    * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
    */
     draw(ctx) {
        if (this.img) {
            ctx.save();                                                             
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);       
            ctx.rotate(this.rotation * Math.PI / 180);                              
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2)); 
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);       
            ctx.restore();                                                          
        }
    }
    
    /**
    * Stops the movement interval of the object.
    * Important to avoid performance issues when the object is destroyed.
    */
     destroy() {
        clearInterval(this.trajectorIntervalId);
        this.trajectorIntervalId = null;
    }
}
