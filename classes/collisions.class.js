class Collisions {
  world;

    /**
     * Creates a new Collisions handler for the game world.
     * @param {World} world - The reference to the game world.
     */
  constructor(world) {
      this.world = world;
  }

    /**
     * Main method that performs all collision checks  
     */
    checkAllCollisions() {
        this.checkCoinCollisions();
        this.checkStoneCollisions();
        this.checkEnemyCollisions();
        this.checkThrowableObjectCollisions();
        this.checkTreasureChestCollision();
        this.cleanupDestroyedObjects();
    }

    /**
     * Checks for collisions between the character and coins.
     * If a collision occurs, the coin is collected and removed.
     */
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

    /**
     * Checks for collisions between the character and stones.
     * If a collision occurs, the stone is collected and removed.
     */
    checkStoneCollisions() {
        this.world.stones.forEach((stone, index) => {
            if (this.world.character.isColliding(stone)) {
                this.world.character.collectStone();
                this.world.stones.splice(index, 1);
                this.world.updateStatusBars();
            }
        });
    }

    /**
     * Checks for collisions between the character and enemies.
     * Handles jump on endboss and normal enemy hit.
     */
    checkEnemyCollisions() {
        this.world.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
                if (this.world.character.isAboveGround() && this.world.character.speedY < 0) {
                    if (enemy instanceof Endboss) {
                        enemy.hit();
                        this.world.character.bounce();
                    } 
                    else  {
                        enemy.hit();
                        this.world.character.bounce();
                    } 
                }
                else if (!this.world.character.isHurt()) {
                    this.world.character.hit();
                    this.world.updateStatusBars();
                }
            }
        });
    }

    /**
     * Checks for collisions between throwable objects (stones) and enemies.
     * If a collision occurs, the enemy is hit and the stone is destroyed.
     */
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

    /**
     * Checks for collision between the character and the treasure chest.
     * The endboss must be defeated before the chest can be opened and the game won.
     */
    checkTreasureChestCollision() {
        const chest = this.world.treasureChest;
        if (chest && this.world.character.isColliding(chest)) {
            if (this.world.endboss && !this.world.endboss.isDead()) {
                return; 
            } else {
                this.world.handleWin();
            }
        }
    }

    /**
     * Removes destroyed throwable objects and dead enemies from the world.
     * The endboss remains in the world even if dead.
     */
    cleanupDestroyedObjects() {
        this.world.throwableObjects = this.world.throwableObjects.filter(stone => !stone.isDestroyed);
        this.world.enemies = this.world.enemies.filter(enemy => !enemy.isDead() || enemy instanceof Endboss);
    }
}

