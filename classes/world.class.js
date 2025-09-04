class World {
    // ---- Game Properties ----
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
    
    // ---- State ----
    canvas;
    ctx;
    keyboard = {};
    camera_x = 0;
    gameLoopIntervalId = null;
    gameWon = false;
    isPaused = false;

    // ---- Modules/Helpers ----
    audioManager = new AudioManager();
    level1;
    collisionHandler;
    inputHandler;
    drawing;
    onStopGameCallback = null;


    // ============================================
    // Initialisierungsmethoden 
    // ============================================
    /**
     * Erstellt eine neue Instanz der World-Klasse.
     * @param {*} canvas 
     * @param {*} onStopGame 
     */
    constructor(canvas, onStopGame) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize(1000, 700); 
        this.onStopGameCallback = onStopGame;

    // Delegates tasks to specialized classes
        this.level1 = new Level1(this);
        this.collisionHandler = new Collisions(this);
        this.inputHandler = new InputHandler(this);
        this.drawing = new Drawing(this);
        this.initGame();
    }

    /**
     * Initializes or restarts the game.
     */
    initGame() {
        this.level1.initializeLevel();
        this.run();
    }

    /**
     * Adjusts the size of the canvas.
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    // ============================================
    // Game-Loop
    // ============================================
    /**
     * Starts the main game loop.
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
     * Pausiert das Spiel.
     * @memberof World 
     * @returns {void} 
     * @description Diese Methode pausiert das Spiel, indem sie den isPaused-Zustand auf true setzt.
     * Die Hintergrundmusik wird gestoppt und die Anzeige der Pause- und Play-Buttons wird entsprechend angepasst.
     * Wenn das Spiel bereits pausiert ist, hat diese Methode keine Wirkung.
     * @param {void}
     */
    pauseGame() {
    if (!this.isPaused) {
        this.isPaused = true;
        this.audioManager.stop('background');
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('playButton').style.display = 'inline-block';
    }

    /** 
     * Setzt das Spiel fort, wenn es pausiert ist.
     * @memberof World
     * @return {void}
     * @description Diese Methode setzt das Spiel fort, indem sie den isPaused-Zustand auf false setzt.
     * Die Hintergrundmusik wird wieder abgespielt und die Anzeige der Pause- und Play-Buttons wird entsprechend angepasst.
     * Wenn das Spiel nicht pausiert ist, hat diese Methode keine Wirkung.
     * @param {void}
    */
    }
    resumeGame() {
        if (this.isPaused) {
            this.isPaused = false;
            this.audioManager.play('background');
            document.getElementById('playButton').style.display = 'none';
            document.getElementById('pauseButton').style.display = 'inline-block';
        }
    }
    
    /** 
     * Stoppt das Spiel und ruft den onStopGameCallback auf, falls definiert.
     * @memberof World
     * @return {void}
     * @description Diese Methode stoppt das Spiel, indem sie den Game-Loop-Intervall löscht und die Hintergrundmusik stoppt.
     * Wenn ein onStopGameCallback definiert ist, wird dieser aufgerufen, um zusätzliche Aktionen auszuführen (z.B. UI-Updates).
     * @param {void}
    */
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

    // ============================================
    // Event-Handling
    // ============================================
    /**
     * Processes keyboard input in each frame.
     */
    checkKeyboardInput() {
        if (this.keyboard['ArrowRight'] || this.keyboard['TOUCH_RIGHT']) this.character.moveRight();
        if (this.keyboard['ArrowLeft'] || this.keyboard['TOUCH_LEFT']) this.character.moveLeft();
        if (this.keyboard['ArrowUp'] || this.keyboard['TOUCH_JUMP']) this.character.jump();
        if (this.keyboard['Enter']) this.initGame();
        if (this.keyboard['d'] || this.keyboard['D'] || this.keyboard['TOUCH_THROW']) this.character.throwStone();
        if (this.keyboard['k'] || this.keyboard['K'] || this.keyboard['TOUCH_BUY_LIFE']) this.buyLife();
        if (this.keyboard['s'] || this.keyboard['S']) this.stopGame();
        this.camera_x = -this.character.x + 100;
    }

    // ============================================
    // Spiel-Status-Methoden
    // ============================================
    /**
     * Behandelt das Spielende, wenn der Charakter keine Leben mehr hat.
     */
    handleGameOver() {
        clearInterval(this.gameLoopIntervalId);
        this.gameLoopIntervalId = null;
        this.audioManager.stop('background');
        this.audioManager.play('game_over');
        showGameOverScreen();
    }

    /**
     * Behandelt den Gewinn des Spiels, wenn der Charakter das Ziel erreicht.
     */
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

    // ============================================
    // UI-Updates und Interaktionsmethoden
    // ============================================  
    /**
    * Called in checkCoinCollisions() in collisions.class.js, throwStone() in character.class.js and buyLife().
    * @memberof World 
    * @returns {void} 
    * @description This method updates the text content of the status bar elements in the HTML.
    * Shows the current values for lives, coins, and stones of the character.
    * The "Buy Life" button is updated.
    * If enough coins are available, the button is enabled and shows the price.
    * If not enough coins are available, the button is disabled.
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
    * This method is called when the character has enough coins to buy a life.
    * It is triggered by the "Buy Life" button in the HTML.
    * @memberof World
    * @returns {void}
    * @description This method checks if the character has enough coins to buy a life.
    * If yes, 5 coins are deducted and one life is added.
    * The status bars are updated immediately to show the changes.
    */
    buyLife() {
        if (this.character.coins >= 5 && !this.character.isDead()) {
            this.character.coins -= 5;
            this.character.lives += 1;
            this.updateStatusBars();
        }
    }

    /**
    * Fügt ein werfbares Objekt (Stein) zur Welt hinzu.
    * Diese Methode wird aufgerufen, wenn der Charakter einen Stein wirft.
    * @memberof World 
    * @returns {void} 
    * @description Diese Methode fügt das übergebene Stein-Objekt dem Array der werfbaren Objekte in der Welt hinzu.
    * Dadurch wird der Stein in die Spielwelt integriert und kann im Game-Loop verarbeitet und gezeichnet werden.
    * @param {ThrowableObject} stone - Das werfbare Objekt (Stein), das zur Welt hinzugefügt werden soll.
    */
    addThrowableObject(stone) {
        this.throwableObjects.push(stone);
    }
}
