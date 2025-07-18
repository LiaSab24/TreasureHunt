/**
 * Die Hauptklasse, die die gesamte Spielwelt verwaltet.
 * Sie steuert die Game Loop, initialisiert Objekte, prüft Kollisionen und zeichnet alles.
 */
class World {
    // --- EIGENSCHAFTEN ---
    character = new Character();
    enemies = [];
    clouds = [new Cloud(0), new Cloud(400), new Cloud(900)];
    backgroundObjects = [];
    coins = [];
    stones = [];
    throwableObjects = [];
    endboss = null;
    treasureChest = null;
    
    canvas;
    ctx;
    keyboard = {};
    camera_x = 0;
    
    LEVEL_END = 2500;
    gameWon = false;
    isPaused = false;
    gameLoopIntervalId = null;

    /**
    * Erstellt eine neue Instanz der Spielwelt.
    * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem das Spiel gezeichnet wird.
    */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = {};

        this.initLevel();
        this.bindEvents();
        this.run();
    }

    // --- HAUPTSCHLEIFE (GAME LOOP) ---

    /**
     * Startet die Haupt-Game-Loop, die sich ca. 60 Mal pro Sekunde wiederholt.
     */
    run() {
        this.gameLoopIntervalId = setInterval(() => {
            if (this.isPaused) {
                this.draw();
                return;
            }
            if (this.gameWon) {
                this.handleWin();
                return;
            }
            if (this.character.isDead()) {
                this.handleGameOver();
                return;
            }
            
            this.update(); // Alle Logik-Updates durchführen
            this.draw();   // Die Welt neu zeichnen
        }, 1000 / 60);
    }

    /**
     * Führt alle Logik-Updates pro Frame aus: Eingaben, Kollisionen, Aufräumen.
     */
    update() {
        this.checkKeyboardInput();
        this.runCollisionChecks();
        this.cleanupObjects();
        this.camera_x = -this.character.x + 100;
    }

    /**
     * Zeichnet die gesamte Spielwelt auf den Canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.translate(this.camera_x, 0);
        
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.stones);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        if (this.treasureChest) this.addToMap(this.treasureChest);
        
        this.ctx.translate(-this.camera_x, 0);

        this.drawEndbossStatusBar();
        if (this.isPaused) {
            this.drawPauseOverlay();
        }
    }

    // --- KOLLISIONEN & AUFRÄUMEN ---

    /**
     * Ruft alle spezifischen Kollisionsprüfungen der Reihe nach auf.
     */
    runCollisionChecks() {
        this.checkCollection(this.character, this.coins, 'collectCoin');
        this.checkCollection(this.character, this.stones, 'collectStone');
        this.checkCharacterEnemyCollisions();
        this.checkThrowableObjectCollisions();
        this.checkTreasureChestCollision();
    }
    
    /**
     * Prüft Kollisionen zwischen dem Charakter und allen Gegnern.
     */
    checkCharacterEnemyCollisions() {
        this.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isHurt()) {
                this.character.hit(1);
                this.updateStatusBars();
            }
        });
    }

    /**
     * Prüft Kollisionen zwischen Wurfobjekten und allen Gegnern.
     */
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach(stone => {
            this.enemies.forEach(enemy => {
                if (stone && !stone.isDestroyed && enemy && !enemy.isDead() && stone.isColliding(enemy)) {
                    enemy.hit();
                    stone.isDestroyed = true; 
                }
            });
        });
    }
    
    /**
     * Prüft die Kollision des Charakters mit der Schatztruhe und löst den Sieg aus.
     */
    checkTreasureChestCollision() {
        if (this.treasureChest && this.character.isColliding(this.treasureChest)) {
            if (this.endboss && this.endboss.isDead()) {
                this.gameWon = true;
            }
        }
    }

    /**
     * Entfernt "tote" oder "zerstörte" Objekte aus den Arrays, um die Performance zu verbessern.
     */
    cleanupObjects() {
        this.throwableObjects = this.throwableObjects.filter(stone => !stone.isDestroyed);
        this.enemies = this.enemies.filter(enemy => !enemy.isDead() || enemy instanceof Endboss);
    }
    
    // --- INITIALISIERUNG & LEVEL-SETUP ---

    /**
     * Initialisiert oder setzt das gesamte Level zurück in den Anfangszustand.
     */
    initLevel() {
        this.resetGameState();
        this.initBackgroundLayers();
        this.initGameObjects();
        this.initTreasureChest();
        this.resetCharacter();
        this.setWorld();
        this.updateStatusBars();
    }

    /**
     * Setzt alle spielrelevanten Zustände und Objekt-Arrays zurück.
     */
    resetGameState() {
        this.isPaused = false;
        this.gameWon = false;
        this.backgroundObjects = [];
        this.coins = [];
        this.stones = [];
        this.enemies = [];
        this.endboss = new Endboss(this);
        this.throwableObjects = [];
        this.resetCamera();
    }
    
    /**
     * Ruft alle Methoden auf, die Spielobjekte wie Münzen, Gegner etc. erstellen.
     */
    initGameObjects() {
        this.initCoins();
        this.initStones();
        this.initEnemies();
        this.initEndboss();
    }
    
    /**
     * Erstellt die sich wiederholenden Hintergrundebenen für den Parallax-Effekt.
     */
    initBackgroundLayers() {
        const canvasWidth = 1000;
        const layers = [
            { path: 'images/bg-canvas/bg1.png', parallaxFactor: 0 },
            { path: 'images/bg-canvas/cactus.png', parallaxFactor: 0.4 },
            { path: 'images/bg-canvas/piso1.png', parallaxFactor: 1 }
        ];
        layers.forEach(layerData => {
            for (let i = 0; i < 3; i++) {
                this.backgroundObjects.push(new BackgroundObject(layerData.path, canvasWidth * i, 0, layerData.parallaxFactor));
            }
        });
    }

    /**
     * Platziert die Münzen im Level.
     */
    initCoins() {
        this.coins.push(new Coin(300, 520), new Coin(330, 480), new Coin(360, 450), new Coin(600, 470), new Coin(900, 500), new Coin(1300, 530), new Coin(1330, 480), new Coin(1360, 450), new Coin(1600, 470), new Coin(1900, 400));
    }

    /**
     * Platziert die aufsammelbaren Steine im Level.
     */
    initStones() {
        this.stones.push(new Stone(500, 480), new Stone(550, 520), new Stone(700, 480), new Stone(850, 500), new Stone(1000, 530), new Stone(1250, 480), new Stone(1500, 530));
    }

    /**
     * Platziert die Standard-Gegner im Level.
     */
    initEnemies() {
        this.enemies.push(new Enemy(400), new Enemy(700), new Enemy(900), new Enemy(950), new Enemy(1200), new Enemy(1800), new Enemy(2300));
    }

    /**
     * Platziert den Endboss am Ende des Levels und fügt ihn der Gegner-Liste hinzu.
     */
    initEndboss() {
        this.endboss.x = this.LEVEL_END - 200;
        this.enemies.push(this.endboss);
    }

    /**
     * Platziert die Schatztruhe am Level-Ende.
     */
    initTreasureChest() { 
        this.treasureChest = new TreasureChest(this.LEVEL_END, 320); 
    }

    /**
     * Erstellt eine neue Charakter-Instanz.
     */
    resetCharacter() { 
        this.character = new Character(); 
    }

    /**
     * Setzt die Kamera-Position auf den Anfang zurück.
     */
    resetCamera() { 
        this.camera_x = 0; 
    }

    /**
     * Übergibt dem Charakter eine Referenz auf die Welt, damit er mit ihr interagieren kann.
     */
    setWorld() { 
        this.character.world = this; 
    }

    // --- EVENT HANDLING & STEUERUNG ---

    /**
     * Bündelt die Initialisierung aller Event-Listener.
     */
    bindEvents() {
        this.bindKeyboardEvents();
        this.initButtonControls();
    }

    /**
     * Registriert die Event-Listener für Tastatur-Eingaben (Drücken und Loslassen).
     */
    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            this.keyboard[e.key] = true;
            if (e.key.toLowerCase() === 'p') {
               this.togglePause();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keyboard[e.key] = false;
        });
    }

    /**
     * Initialisiert die Event-Listener für die UI-Buttons (für Touch-Geräte).
     */
    initButtonControls() {
        const controlButtonMap = {
            'leftButton': 'TOUCH_LEFT', 'rightButton': 'TOUCH_RIGHT',
            'upButton': 'TOUCH_JUMP', 'wurfButton': 'TOUCH_THROW'
        };
        for (const buttonId in controlButtonMap) {
            this.bindPressAndHoldEvents(buttonId, controlButtonMap[buttonId]);
        }
    }

    /**
     * Bindet Maus- und Touch-Events an einen UI-Button, um Gedrückthalten zu simulieren.
     * @param {string} buttonId - Die ID des HTML-Elements.
     * @param {string} actionKey - Der Schlüssel, der im `keyboard`-Objekt gesetzt wird.
     */
    bindPressAndHoldEvents(buttonId, actionKey) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        const setActionState = (isPressed) => (event) => {
            event.preventDefault();
            this.keyboard[actionKey] = isPressed;
        };
        button.addEventListener('mousedown', setActionState(true));
        button.addEventListener('touchstart', setActionState(true), { passive: false });
        button.addEventListener('mouseup', setActionState(false));
        button.addEventListener('mouseleave', setActionState(false));
        button.addEventListener('touchend', setActionState(false), { passive: false });
    }

    /**
     * Prüft in jedem Frame, welche Tasten gedrückt sind und löst Charakter-Aktionen aus.
     */
    checkKeyboardInput() {
        if (this.keyboard['ArrowRight'] || this.keyboard['TOUCH_RIGHT']) this.character.moveRight();
        if (this.keyboard['ArrowLeft'] || this.keyboard['TOUCH_LEFT']) this.character.moveLeft();
        if (this.keyboard['ArrowUp'] || this.keyboard['TOUCH_JUMP']) this.character.jump();
        if (this.keyboard['d'] || this.keyboard['D'] || this.keyboard['TOUCH_THROW']) this.character.throwStone();
    }

    /**
     * Fügt ein neues Wurfobjekt (Stein) zur Welt hinzu. Wird vom Charakter aufgerufen.
     * @param {ThrowableObject} stone - Die Instanz des geworfenen Steins.
     */
    addThrowableObject(stone) {
        this.throwableObjects.push(stone);
    }

    // --- SPIELZUSTAND & UI ---

    /**
     * Behandelt den "Game Over"-Zustand, stoppt die Loop und zeigt den Endbildschirm.
     */
    handleGameOver() {
        clearInterval(this.gameLoopIntervalId);
        showGameOverScreen();
    }

    /**
     * Behandelt den "Gewinn"-Zustand, stoppt die Loop und zeigt den Siegesbildschirm.
     */
    handleWin() {
        clearInterval(this.gameLoopIntervalId);
        showWinScreen();
    }

    /**
     * Schaltet den Pause-Zustand des Spiels um.
     */
    togglePause() {
        this.isPaused = !this.isPaused;
    }

    /**
     * Zeichnet ein halbtransparentes Overlay mit Text, wenn das Spiel pausiert ist.
     */
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "48px 'Arial'";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Pause", this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * Zeichnet die Lebensleiste des Endbosses, aber nur, wenn der Spieler in der Nähe ist.
     */
    drawEndbossStatusBar() {
        if (!this.endboss) return;
        const distance = this.endboss.x - this.character.x;
        const statusBar = document.getElementById('endbossStatus');
        const healthBar = document.getElementById('endbossHealthBar');
        if (distance < 800 && !this.endboss.isDead()) {
            statusBar.style.display = 'flex';
            const healthPercentage = (this.endboss.energy / this.endboss.maxEnergy) * 100;
            healthBar.style.width = healthPercentage + '%';
            healthBar.style.backgroundColor = healthPercentage < 40 ? 'red' : 'green';
        } else {
            statusBar.style.display = 'none';
        }
    }

    /**
     * Aktualisiert die Text- und Statusanzeigen im HTML (Leben, Münzen, etc.).
     */
    updateStatusBars() {
        document.getElementById('livesStatus').innerText = this.character.lives;
        document.getElementById('coinsStatus').innerText = this.character.coins;
        document.getElementById('stonesStatus').innerText = this.character.stones;
        const buyButton = document.getElementById('buyLifeButton');
        if (this.character.coins >= 5) {
            buyButton.disabled = false;
            buyButton.innerText = 'Kaufe Leben (5 Münzen)';
        } else {
            buyButton.disabled = true;
            buyButton.innerText = `Kaufe Leben (${5 - this.character.coins} Münzen fehlen)`;
        }
    }

    /**
     * Logik für den Kauf eines Lebens mit Münzen.
     */
    buyLife() {
        if (this.character.coins >= 5 && !this.character.isDead()) {
            this.character.coins -= 5;
            this.character.lives += 1;
            this.updateStatusBars();
        }
    }
    
    // --- HELFERMETHODEN ---

    /**
     * Eine Hilfsmethode, um ein einzelnes Objekt zu zeichnen.
     * @param {MovableObject} obj - Das zu zeichnende Objekt.
     */
    addToMap(obj) {
        obj.draw(this.ctx);
    }

    /**
     * Eine Hilfsmethode, um alle Objekte in einem Array zu zeichnen.
     * @param {MovableObject[]} objects - Das Array von Objekten.
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    /**
     * Eine generische Methode, um das Aufsammeln von Items zu prüfen.
     * @param {Character} collector - Der Charakter, der sammelt.
     * @param {MovableObject[]} items - Das Array der sammelbaren Items.
     * @param {string} collectionMethod - Die Methode im Charakter, die aufgerufen wird (z.B. 'collectCoin').
     */
    checkCollection(collector, items, collectionMethod) {
        items.forEach((item, index) => {
            if (collector.isColliding(item)) {
                collector[collectionMethod]();
                items.splice(index, 1);
                this.updateStatusBars();
            }
        });
    }
}