class Collisions {
  world;

  constructor(world) {
      this.world = world;
  }

    /**
     * Hauptmethode, die alle Kollisionsprüfungen durchführt.
     */
    checkAllCollisions() {
        this.checkCoinCollisions();
        this.checkStoneCollisions();
        this.checkEnemyCollisions();
        this.checkThrowableObjectCollisions();
        this.checkTreasureChestCollision();
        this.cleanupDestroyedObjects();
    }

    checkCoinCollisions() {
        this.world.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin)) {
                this.world.character.collectCoin();
                this.world.coins.splice(index, 1);
                this.world.updateStatusBars();
                this.world.audioManager.play('coin');
            }
        });
    }

    checkStoneCollisions() {
        this.world.stones.forEach((stone, index) => {
            if (this.world.character.isColliding(stone)) {
                this.world.character.collectStone();
                this.world.stones.splice(index, 1);
                this.world.updateStatusBars();
            }
        });
    }

    checkEnemyCollisions() {
        this.world.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
                // Sprung auf Endboss
                if (enemy instanceof Endboss && this.world.character.isAboveGround() && this.world.character.speedY < 0) {
                    enemy.hit();
                    this.world.character.bounce();
                } // Normaler Treffer durch Gegner
                else if (!this.world.character.isHurt()) {
                    this.world.character.hit();
                    this.world.updateStatusBars();
                }
            }
        });
    }

    checkThrowableObjectCollisions() {
        this.world.throwableObjects.forEach((stone) => {
            this.world.enemies.forEach((enemy) => {
                if (stone && !stone.isDestroyed && enemy && !enemy.isDead() && stone.isColliding(enemy)) {
                    enemy.hit();
                    stone.isDestroyed = true;
                }
            });
        });
    }

    checkTreasureChestCollision() {
        const chest = this.world.treasureChest;
        if (chest && this.world.character.isColliding(chest)) {
            if (this.world.endboss && !this.world.endboss.isDead()) {
                return; // Endboss muss besiegt sein
            } else {
                this.world.handleWin();
            }
        }
    }

    cleanupDestroyedObjects() {
        this.world.throwableObjects = this.world.throwableObjects.filter(stone => !stone.isDestroyed);
        this.world.enemies = this.world.enemies.filter(enemy => !enemy.isDead() || enemy instanceof Endboss);
    }
}

