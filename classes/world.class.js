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
    // Initialization methods
    // ============================================
    /**
     * Creates a new instance of the World class.
     * @param {*} canvas - The canvas element.
     * @param {*} onStopGame - Callback for stopping the game.
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
     * Called in constructor().
     * @memberof World 
     * @returns {void} 
     * @description This method initializes the level and starts the game loop.
     * Initializes or restarts the game.
     */
    initGame() {
        this.level1.initializeLevel();
        this.run();
    }

    /**
     * Called in constructor().
     * @memberof World 
     * @returns {void} 
     * @description This method resizes the canvas to the specified width and height.
     * Adjusts the size of the canvas.
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    // ============================================
    // Game loop
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
        //    if (this.isPaused) {
        //        this.drawing.draw(); 
        //        return;
        //    }
        //    if (this.character.isDead()) {
        //        this.handleGameOver();
        //        return;
        //    }
        //    if (this.gameWon) return;
        //    this.checkKeyboardInput();
        //    this.character.applyGravity();
        //    this.collisionHandler.checkAllCollisions();
        //    this.drawing.draw();
            if (this.handlePause()) return;
            if (this.handleGameOverIfNeeded()) return;
            if (this.handleWinIfNeeded()) return;
            this.processFrame();
        }, 1000 / 60);
    }

    /**
     * called in run() in each frame.
     * @memberof World 
     * Handles the pause state of the game.
     * @returns {boolean} True if the game is paused, otherwise false.
     */
    handlePause() {
        if (this.isPaused) {
            this.drawing.draw();
            return true;
        }
        return false;
    }

    /**
     * Called in run() in each frame.
     * @memberof World 
     * Handles game over if the character is dead.      
     * @returns {boolean} True if the game is over, otherwise false.
     */
    handleGameOverIfNeeded() {
        if (this.character.isDead()) {
            this.handleGameOver();
            return true;
        }
        return false;
    }   

    /**
     * Called in run() in each frame.
     * @memberof World 
     * Handles winning the game if the character reaches the goal.
     * @returns {boolean} True if the game is won, otherwise false.
     */
    handleWinIfNeeded() {
        if (this.gameWon) return true;
        return false;
    }   

    /**
     * Called in run() in each frame.
     * @memberof World 
     * Processes a single frame of the game loop.
     * Handles input, physics, collisions, and drawing.
     */
    processFrame() {
        this.checkKeyboardInput();
        this.character.applyGravity();
        this.collisionHandler.checkAllCollisions();
        this.drawing.draw();
    }

    /**
     * Pauses the game.
     * @memberof World 
     * @returns {void} 
     * @description This method pauses the game by setting isPaused to true.
     * The background music is stopped and the pause/play buttons are updated.
     * If the game is already paused, this method has no effect.
     */
    pauseGame() {
    if (!this.isPaused) {
        this.isPaused = true;
        this.audioManager.stop('background');
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('playButton').style.display = 'inline-block';
    }

    /** 
     * Resumes the game if it is paused.
     * @memberof World
     * @return {void}
     * @description This method resumes the game by setting isPaused to false.
     * The background music is played again and the pause/play buttons are updated.
     * If the game is not paused, this method has no effect.
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
     * Stops the game and calls the onStopGameCallback if defined.
     * @memberof World
     * @return {void}
     * @description This method stops the game by clearing the game loop interval and stopping the background music.
     * If an onStopGameCallback is defined, it is called for additional actions (e.g. UI updates).
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
    // Event handling
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
        if (this.keyboard['b'] || this.keyboard['B'] || this.keyboard['TOUCH_BUY_LIFE']) this.buyLife();
        if (this.keyboard['m'] || this.keyboard['M']) this.stopGame();
        this.camera_x = -this.character.x + 100;
    }

    // ============================================
    // Game status methods
    // ============================================
    /**
     * Handles game over when the character has no lives left.
     */
    handleGameOver() {
        clearInterval(this.gameLoopIntervalId);
        this.gameLoopIntervalId = null;
        this.audioManager.stop('background');
        this.audioManager.play('game_over');
        showGameOverScreen();
    }

    /**
     * Handles winning the game when the character reaches the goal.
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
    // UI updates and interaction methods
    // ============================================  
    /**
    * Called in checkCoinCollisions() in collisions.class.js, throwStone() in character.class.js and buyLife().
    * @memberof World 
    * @returns {void} 
    * @description This method updates the text content of the status bar elements in the HTML.
    * Shows the current values for lives, coins, and stones of the character.
    * The "Buy Life" button is updated: if enough coins are available, the button is enabled and shows the price; otherwise, it is disabled.
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
    * Called when the character has enough coins to buy a life.
    * Triggered by the "Buy Life" button in the HTML.
    * @memberof World
    * @returns {void}
    * @description This method checks if the character has enough coins to buy a life.
    * If yes, 5 coins are deducted and one life is added. The status bars are updated immediately to show the changes.
    */
    buyLife() {
        if (this.character.coins >= 5 && !this.character.isDead()) {
            this.character.coins -= 5;
            this.character.lives += 1;
            this.updateStatusBars();
        }
    }

    /**
    * Adds a throwable object (stone) to the world.
    * This method is called when the character throws a stone.
    * @memberof World 
    * @returns {void} 
    * @description This method adds the given stone object to the array of throwable objects in the world.
    * This integrates the stone into the game world so it can be processed and drawn in the game loop.
    * @param {ThrowableObject} stone - The throwable object (stone) to be added to the world.
    */
    addThrowableObject(stone) {
        this.throwableObjects.push(stone);
    }
}
