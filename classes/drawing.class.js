// js/classes/renderer.class.js

class Renderer {
    world;
    ctx;
    canvas;

    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
        this.canvas = world.canvas;
    }

    /**
     * Haupt-Zeichenmethode, wird in der Game Loop aufgerufen.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        
        this.ctx.translate(this.world.camera_x, 0);
        this.drawGameObjects();
        this.ctx.translate(-this.world.camera_x, 0);

        this.drawUI();
    }
    
    drawBackground() {
        this.world.backgroundObjects.forEach(layer => {
            let effectiveX = layer.x + this.world.camera_x * layer.parallaxFactor;
            if (effectiveX <= -layer.width) {
                layer.x += layer.width * 3;
            } else if (effectiveX > layer.width * 2) {
                layer.x -= layer.width * 3;
            }
            this.ctx.drawImage(layer.img, effectiveX, layer.y, layer.width, layer.height);
        });
    }

    drawGameObjects() {
        this.drawObjects(this.world.clouds);
        this.drawObjects(this.world.coins);
        this.drawObjects(this.world.stones);
        this.drawObjects(this.world.enemies);
        this.drawObjects(this.world.throwableObjects);
        this.world.character.draw(this.ctx);
        if (this.world.treasureChest) {
            this.world.treasureChest.draw(this.ctx);
        }
    }

    drawUI() {
        this.drawEndbossStatusBar();
        if (this.world.isPaused) {
            this.drawPauseOverlay();
        }
    }

    drawObjects(objects) {
        objects.forEach(obj => obj.draw(this.ctx));
    }

    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = "48px 'Arial'";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Pause", this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = "24px 'Arial'";
        this.ctx.fillText("Drücke 'Play' zum Fortsetzen", this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    drawEndbossStatusBar() {
        if (!this.world.endboss) return;

        const distance = Math.abs(this.world.endboss.x - this.world.character.x);
        const statusBar = document.getElementById('endbossStatus');
        const healthBar = document.getElementById('endbossHealthBar');

        if (distance < 800 && !this.world.endboss.isDead()) {
            statusBar.style.display = 'flex';
            const healthPercentage = (this.world.endboss.health / this.world.endboss.maxHealth) * 100;
            healthBar.style.width = healthPercentage + '%';
            healthBar.style.backgroundColor = healthPercentage < 40 ? 'red' : 'green';
        } else {
            statusBar.style.display = 'none';
        }
    }
}