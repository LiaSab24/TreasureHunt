// js/classes/level-initializer.class.js

class level1 {
    world;

    constructor(world) {
        this.world = world;
    }

    /**
     * Hauptmethode zum Initialisieren des gesamten Levels.
     */
    initializeLevel() {
        this.resetGameState();
        this.initBackgroundLayers();
        this.initGameObjects();
        this.initTreasureChest();
        this.resetCharacter();
        this.resetCamera();
    }

    resetGameState() {
        this.world.isPaused = false;
        this.world.gameWon = false;
        this.world.backgroundObjects = [];
        this.world.coins = [];
        this.world.stones = [];
        this.world.enemies = [];
        this.world.endboss = new Endboss(this.world);
        this.world.throwableObjects = [];
    }

    initBackgroundLayers() {
        const canvasWidth = this.world.canvas.width;
        const layers = [
            { path: 'images/bg-canvas/bg1.png', parallaxFactor: 0 },
            { path: 'images/bg-canvas/cactus.png', parallaxFactor: 0.4 },
            { path: 'images/bg-canvas/piso1.png', parallaxFactor: 1 }
        ];
        layers.forEach(layerData => {
            for (let i = 0; i < 3; i++) {
                this.world.backgroundObjects.push(new BackgroundObject(layerData.path, canvasWidth * i, 0, layerData.parallaxFactor));
            }
        });
    }

    initGameObjects() {
        this.initClouds();
        this.initCoins();
        this.initStones();
        this.initEnemies();
        this.initEndboss();
    }

    initClouds() {
        this.world.clouds = [
            new Cloud(0, this.world), new Cloud(400, this.world), new Cloud(900, this.world),
            new Cloud(1300, this.world), new Cloud(1700, this.world), new Cloud(2100, this.world)
        ];
    }

    initCoins() {
        this.world.coins.push(
            new Coin(300, 520), new Coin(330, 480), new Coin(360, 450),
            new Coin(600, 470), new Coin(900, 500), new Coin(1300, 530),
            new Coin(1330, 480), new Coin(1360, 450), new Coin(1600, 470),
            new Coin(1700, 400)
        );
    }

    initStones() {
        this.world.stones.push(
            new Stone(500, 480), new Stone(550, 520), new Stone(700, 480),
            new Stone(850, 500), new Stone(1000, 530), new Stone(1150, 480),
            new Stone(1300, 530), new Stone(1350, 530), new Stone(1400, 480),
            new Stone(1500, 530)
        );
    }

    initEnemies() {
        this.world.enemies.push(
            new Enemy1(550, this.world), new Enemy2(700, this.world), new Enemy1(900, this.world),
            new Enemy2(1050, this.world), new Enemy1(1200, this.world), new Enemy2(1350, this.world)
        );
    }

    initEndboss() {
        this.world.endboss.x = this.world.LEVEL_END - 100;
        this.world.endboss.y = 250;
        this.world.enemies.push(this.world.endboss);
    }

    initTreasureChest() {
        this.world.treasureChest = new TreasureChest(this.world.LEVEL_END, 150);
    }

    resetCharacter() {
        this.world.character = new Character();
        this.world.character.world = this.world;
    }

    resetCamera() {
        this.world.camera_x = 0;
    }
}