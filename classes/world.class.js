// js/classes/world.class.js

class World {
    // ---- Spiel-Eigenschaften ----
    character = new Character();
    enemies = [];
    clouds = [];
    coins = [];
    stones = [];
    throwableObjects = [];
    backgroundObjects = [];
    treasureChest = null;
    endboss = null;
    LEVEL_END = 2500;
    
    // ---- Zustand ----
    canvas;
    ctx;
    keyboard = {};
    camera_x = 0;
    gameLoopIntervalId = null;
    gameWon = false;
    isPaused = false;

    // ---- Module/Helfer ----
    audioManager = new AudioManager();
    level1;
    collisionHandler;
    inputHandler;
    drawing;
    onStopGameCallback = null;

    constructor(canvas, onStopGame) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize(1000, 700); 
        this.onStopGameCallback = onStopGame;

        // Delegiere Aufgaben an spezialisierte Klassen
        this.level1 = new level1(this);
        this.collisionHandler = new Collisions(this);
        this.inputHandler = new InputHandler(this);
        this.drawing = new Drawing(this);
        this.initGame();
    }

    /**
     * Initialisiert oder startet das Spiel neu.
     */
    initGame() {
        this.level1.initializeLevel();
        this.run();
    }

    /**
     * Passt die Größe des Canvas an.
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Startet die Haupt-Game-Loop.
     */
    run() {
        if (this.gameLoopIntervalId) {
            clearInterval(this.gameLoopIntervalId);
        }
        this.audioManager.play('background');

        this.gameLoopIntervalId = setInterval(() => {
            if (this.isPaused) {
                this.drawing.draw(); 
                return;
            }
            if (this.character.isDead()) {
                this.handleGameOver();
                return;
            }
            if (this.gameWon) return;

            this.checkKeyboardInput();
            this.character.applyGravity();
            this.collisionHandler.checkAllCollisions();
            this.drawing.draw();
        }, 1000 / 60);
    }

    /**
     * Verarbeitet die Tastatureingaben in jedem Frame.
     */
    checkKeyboardInput() {
        if (this.keyboard['ArrowRight'] || this.keyboard['TOUCH_RIGHT']) this.character.moveRight();
        if (this.keyboard['ArrowLeft'] || this.keyboard['TOUCH_LEFT']) this.character.moveLeft();
        if (this.keyboard['ArrowUp'] || this.keyboard['TOUCH_JUMP']) this.character.jump();
        if (this.keyboard['d'] || this.keyboard['D'] || this.keyboard['TOUCH_THROW']) this.character.throwStone();
        
        this.camera_x = -this.character.x + 100;
    }

    pauseGame() {
        if (!this.isPaused) {
            this.isPaused = true;
            this.audioManager.stop('background');
            document.getElementById('playButton').style.display = 'inline-block';
        }
    }

    resumeGame() {
        if (this.isPaused) {
            this.isPaused = false;
            this.audioManager.play('background');
            document.getElementById('pauseButton').style.display = 'inline-block';
        }
    }

    stopGame() {
        if (this.gameLoopIntervalId) {
            clearInterval(this.gameLoopIntervalId);
            this.gameLoopIntervalId = null;
        }
        this.audioManager.stop('background');
        if (typeof this.onStopGameCallback === 'function') {
            this.onStopGameCallback();
        }
    }

    handleGameOver() {
        clearInterval(this.gameLoopIntervalId);
        this.gameLoopIntervalId = null;
        this.audioManager.stop('background');
        this.audioManager.play('game_over');
        showGameOverScreen();
    }

    handleWin() {
        if (!this.gameWon) {
            this.gameWon = true;
            clearInterval(this.gameLoopIntervalId);
            this.gameLoopIntervalId = null;
            this.keyboard = {};
            this.audioManager.stop('background');
            this.audioManager.play('win');
            showWinScreen();
        }
    }

    addThrowableObject(stone) {
        this.throwableObjects.push(stone);
    }
    
    /**
    * wird in der checkCoinCollisions() in collisions.class.js und buyLife() aufgerufen.
    * @memberof World 
    * @returns {void} 
    * @description Diese Methode aktualisiert die Textinhalte der Statusleisten-Elemente im HTML.
    * zeigt die aktuellen Werte für Leben, Münzen und Steine des Charakters an.
    * der "Kaufe Leben"-Button wird aktualisiert
    * Wenn genug Münzen vorhanden sind, wird der Button aktiviert und zeigt den Preis an.
    * Wenn nicht genug Münzen vorhanden sind, wird der Button deaktiviert 
    * @param {void}
    */
    updateStatusBars() {
        document.getElementById('livesStatus').innerText = this.character.lives;
        document.getElementById('coinsStatus').innerText = this.character.coins;
        document.getElementById('stonesStatus').innerText = this.character.stones;
        const buyButton = document.getElementById('buyLifeButton');
        if (this.character.coins >= 5) {
            buyButton.disabled = false;
            buyButton.innerText = 'Kaufe 1 Leben mit 5 Münzen';
        } else {
            buyButton.disabled = true;
            buyButton.innerText = `Kaufe Leben (${5 - this.character.coins} Münzen fehlen)`;
        }
    }

    /**
    * Diese Methode wird aufgerufen, wenn der Charakter genug Münzen hat, um ein Leben zu kaufen.
    * Sie wird durch den "Kaufe Leben"-Button im HTML ausgelöst.
    * @memberof World
    * @returns {void}
    * @description Diese Methode prüft, ob der Charakter genug Münzen hat, um ein Leben zu kaufen.
    * Wenn ja, werden 5 Münzen abgezogen und ein Leben hinzugefügt.
    * Die Statusleisten werden sofort aktualisiert, um die Änderungen anzuzeigen.
    */
    buyLife() {
        if (this.character.coins >= 5 && !this.character.isDead()) {
            this.character.coins -= 5;
            this.character.lives += 1;
            this.updateStatusBars();
        }
    }
}
