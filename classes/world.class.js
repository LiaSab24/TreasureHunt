class World {
    /** 
     * Repräsentiert die Spielwelt.
     * Diese Klasse verwaltet den Charakter, Gegner, Wolken, Münzen, Steine,
     * Schatztruhe und die Hintergrundebenen.
     * Sie enthält Methoden zum Initialisieren des Levels, Zeichnen der Objekte,
     * Verarbeiten von Tastatureingaben, Kollisionen und dem Spielablauf.
     * @class World
     * @property {string} worldName - Der Name der Spielwelt.
     * @property {string} worldDescription - Eine kurze Beschreibung der Spielwelt.
     * @property {string} worldAuthor - Der Autor der Spielwelt.
     * @property {Character} character - Der Hauptcharakter des Spiels.
     * @property {Enemy[]} enemies - Array von Gegnern im Spiel.
     * @property {Cloud[]} clouds - Array von Wolken, die sich im Hintergrund bewegen.
     * @property {Coin[]} coins - Array von Münzen, die der Charakter sammeln kann.
     * @property {Stone[]} stones - Array von Steinen, die der Charakter sammeln kann   
    */
    worldName = "Treasure Hunt";
    worldDescription = "2D Run and Jump Game";
    worldAuthor = "LianeSchmuhl";

    character = new Character(); 
    enemies = []; 
    clouds = []; 
    coins = []; 
    stones = [];
    throwableObjects = [];     
    canvas; 
    ctx;    
    keyboard = {}; 
    camera_x = 0;               
    gameLoopIntervalId = null;  
    treasureChest = null;                   
    LEVEL_END = 2500;                       
    gameWon = false;           
    isPaused = false; 
    audioManager = new AudioManager();  
    onStopGameCallback = null;                  

    /**
    * Erstellt eine neue Instanz der Spielwelt.
    * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem das Spiel gezeichnet wird.
    * @param {Function} onStopGame - Eine Callback-Funktion, die aufgerufen wird, wenn das Spiel gestoppt wird.
    * @memberof World
    * @constructor
    * @description Initialisiert die Spielwelt, setzt die Canvas-Größe, erstellt den Kontext,
    * und bindet die Event-Listener für Tastatureingaben und Steuerungsbuttons.
    * Diese Methode startet die Game Loop und initialisiert den Charakter.
    * @returns {void}
    */
    constructor(canvas, onStopGame) { 
        this.canvas = canvas;
        this.canvas.width = 1000; 
        this.canvas.height = 700; 
        this.ctx = canvas.getContext('2d');
        this.onStopGameCallback = onStopGame; 
        this.keyboard = {};
        this.initLevel(); 
        this.draw();
        this.setWorld();
        this.bindKeyboardEvents();
        this.initButtonControls();     
        this.run();
        this.gameWon = false;    
        this.isPaused = false;   
    }
    /**
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * @function initLevel
     * @memberof World
     * @returns {void}
     * @description Setzt den Spielzustand zurück, initialisiert die Hintergrundebenen,
     * erstellt die Spielobjekte (Wolken, Münzen, Steine, Gegner, Endboss) und platziert die Schatztruhe.
     * Diese Methode sorgt dafür, dass das Level frisch und spielbereit ist.    
     */
    initLevel() {
        this.resetGameState();
        this.initBackgroundLayers();
        this.initGameObjects();
        this.initTreasureChest();
        this.resetCharacter();
        this.resetCamera();
    }
    /**
     * Sie wird in der initLevel() aufgerufen.
     * @memberof World
     * @function resetGameState
     * @returns {void}
     * @description Setzt den Spielzustand zurück, einschließlich aller Objekte und des Endbosses.
     * Diese Methode löscht alle Objekte und setzt den Endboss neu.
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
    }

    /** 
     * Sie wird in der initLevel() aufgerufen.
     * @param {number} canvasWidth - Die Breite des Canvas, um die Hintergrundebenen zu positionieren.
     * @memberof World
     * @function initBackgroundLayers
     * @returns {void}
     * @description Erstellt mehrere Hintergrundebenen, die sich mit unterschiedlichen Geschwindigkeiten bewegen,
     * um einen Parallax-Effekt zu erzeugen.
     */
    initBackgroundLayers() {
        const canvasWidth = this.canvas.width;
        const layers = [
            { path: 'images/bg-canvas/bg1.png', parallaxFactor: 0 },
            { path: 'images/bg-canvas/cactus.png', parallaxFactor: 0.4 },
            { path: 'images/bg-canvas/cactus.png', parallaxFactor: 0.6 },
            { path: 'images/bg-canvas/piso1.png', parallaxFactor: 1 }
        ];
        layers.forEach(layerData => {
            this.backgroundObjects.push(new BackgroundObject(layerData.path, 0, 0, layerData.parallaxFactor));
            this.backgroundObjects.push(new BackgroundObject(layerData.path, canvasWidth, 0, layerData.parallaxFactor));
            this.backgroundObjects.push(new BackgroundObject(layerData.path, canvasWidth * 2, 0, layerData.parallaxFactor));
        });
    }
    
    /**
     * wird in der initLevel() aufgerufen.
     * @memberof World
     * @function initGameObjects
     * @returns {void}
     * @description Erstellt und initialisiert alle Spielobjekte
     */
    initGameObjects() {
        this.initClouds();
        this.initCoins();
        this.initStones();
        this.initEnemies();
        this.initEndboss();
    }

    /**
     * wird in der initLevel() aufgerufen
     * @memberof World  
     * @function initClouds
     * @returns {void}
     * @description Erstellt mehrere Wolken, die sich langsam im Hintergrund bewegen.
     * Die Wolken werden an zufälligen horizontalen Positionen generiert,
     * um eine dynamische Atmosphäre zu schaffen.
     * fügt Wolken dem `this.clouds`-Array hinzu.
     * @param {number} x - Die initiale Basis-Position auf der x-Achse.
     * @param {World} world - Die Welt, in der die Wolken erstellt werden.
     */
    initClouds() {
        this.clouds = [
            new Cloud(0, this),
            new Cloud(400, this),
            new Cloud(900, this),
            new Cloud(1300, this),
            new Cloud(1700, this),
            new Cloud(2100, this)
        ];
    }

    /**
     * wird in der initLevel() aufgerufen.
     * @memberof World
     * @function initCoins
     * @returns {void}
     * Diese Methode erstellt mehrere Münzen an vordefinierten Positionen.
     * Sie fügt die Münzen dem `this.coins`-Array hinzu.
     * @param {number} x - Die initiale Basis-Position auf der x-Achse.
     * @param {number} y - Die initiale Basis-Position auf der y-Achse.
     */
    initCoins() {
        this.coins.push(new Coin(300, 520));
        this.coins.push(new Coin(330, 480));
        this.coins.push(new Coin(360, 450));
        this.coins.push(new Coin(600, 470));
        this.coins.push(new Coin(900, 500));
        this.coins.push(new Coin(1300, 530));
        this.coins.push(new Coin(1330, 480));
        this.coins.push(new Coin(1360, 450));
        this.coins.push(new Coin(1600, 470));
        this.coins.push(new Coin(1700, 400));
    }
    /**
     * wird in der initLevel() aufgerufen
     * @memberof World
     * @function initStones
     * @returns {void}
     * @description Erstellt mehrere Steine an vordefinierten Positionen.
     * Sie fügt die Steine dem `this.stones`-Array hinzu.
     * @param {number} x - Die initiale Basis-Position auf der x-Achse.
     * @param {number} y - Die initiale Basis-Position auf der y-Achse.
     */
    initStones() {
        this.stones.push(new Stone(500, 480));
        this.stones.push(new Stone(550, 520));
        this.stones.push(new Stone(700, 480));
        this.stones.push(new Stone(850, 500));
        this.stones.push(new Stone(1000, 530));
        this.stones.push(new Stone(1150, 480));
        this.stones.push(new Stone(1300, 530));
        this.stones.push(new Stone(1350, 530));
        this.stones.push(new Stone(1400, 480));
        this.stones.push(new Stone(1500, 530));
    } 

    /** 
     * wird in der initLevel() aufgerufen.
     * @memberof World
     * @function initEnemies
     * @returns {void}
     * @description Erstellt mehrere Gegner an vordefinierten Positionen.
     * Sie fügt die Gegner dem `this.enemies`-Array hinzu.
     * @param {number} x - Die initiale Basis-Position auf der x-Achse.
     * @param {World} world - Die Welt, in der die Gegner erstellt werden.
     * @param {Enemy} enemy - Die Gegner-Instanz, die erstellt wird.
     * @param {void}
     * 
    */
    initEnemies() {
        this.enemies.push(
            new Enemy1(550, this),
            new Enemy2(700, this),
            new Enemy1(900, this),
            new Enemy2(1050, this),
            new Enemy1(1200, this),
            new Enemy2(1350, this),
        );
    }

    /**
     * wird in der initLevel() aufgerufen.
     * @memberof World
     * @function initEndboss
     * @returns {void}
     * @description Setzt die Position des Endbosses auf LEVEL_END - 100 Pixel
     * und platziert ihn 250 Pixel über dem Boden.
     * Der Endboss erscheint erst, wenn der Charakter nahe genug am Level-Ende ist.
     */
    initEndboss() {
        this.endboss.x = this.LEVEL_END - 100; 
        this.endboss.y = 250;
        this.enemies.push(this.endboss);
    }

    /**
     * wird in der initLevel() aufgerufen.
     * @param {number} x - Die x-Position der Schatztruhe, standardmäßig auf LEVEL_END gesetzt.
     * @memberof World
     * @function initTreasureChest
     * @returns {void}
     * @description Erstellt eine Instanz der treasureChest-Klasse und platziert sie am LEVEL_END-Punkt.
     * Die Truhe wird 320 Pixel über dem Boden platziert.
     */
    initTreasureChest() {
        const groundYForChest = 150;
        this.treasureChest = new TreasureChest(this.LEVEL_END, groundYForChest);
    }

    /**
     * Diese Methode wird in der initLevel() aufgerufen.
     * @param {Character} character - Der Charakter, der in der Welt platziert wird.
     * @memberof World
     * @function resetCharacter
     * @returns {void}
     * @description Erstellt eine neue Instanz des Charakters und bindet ihn an die Welt.
     * Dadurch kann der Charakter auf die Welt zugreifen und mit ihr interagieren.
     */
    resetCharacter() {
        this.character = new Character();
        this.setWorld();
    }

    /**
     * Diese Methode wird in der initLevel() aufgerufen.
     * @memberof World
     * @function resetCamera
     * @returns {void}
     * @description Setzt die Kamera-Position auf 0, um den Charakter am linken Rand des Canvas zu starten.
     * Dadurch wird die Kamera zurückgesetzt und der Charakter erscheint immer am
     */
    resetCamera() {
        this.camera_x = 0;
    }

    /**
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * @memberof World
     * @function setWorld
     * @returns {void}
     * @description Setzt die Welt-Referenz im Charakter-Objekt, damit der Charakter auf die Welt zugreifen kann.
     * Dies ist wichtig für Kollisionen, Bewegungen und andere Interaktionen.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * @memberof World
     * @function bindKeyboardEvents
     * @returns {void}
     * @description Erstellt Event-Listener für Tastatureingaben,
     * um den Zustand der Tasten im `this.keyboard`-Objekt zu speichern.
     * Diese Methode ermöglicht die Steuerung des Charakters über die Tastatur.
     * @param {KeyboardEvent} e - Das KeyboardEvent-Objekt, das die gedrückte Taste enthält.
     */
    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            this.keyboard[e.key] = true; 

            if (e.key === 'Enter') {
            e.preventDefault();                         // Verhindert Standard-Aktionen wie das Neuladen der Seite
            this.stopGame();
            }

            // Speichert den gedrückten Zustand
            if (e.key === 'p' || e.key === 'P') {
              if (this.isPaused) {
                   this.resumeGame();
               } else {
                   this.pauseGame();
               }
            }
            // Leertaste für Pause/Resume des Spiels
            if (e.key === ' ') {                        // ' ' ist die Leertaste
                e.preventDefault();                     // Verhindert Standard-Aktionen wie Scrollen
                if (this.isPaused) {
                this.resumeGame();
                } else {
                    this.pauseGame();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keyboard[e.key] = false;               // Entfernt den gedrückten Zustand
        });
    }

    /**
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * @memberof World
     * @function initButtonControls
     * @returns {void}
     * @description Erstellt Event-Listener für die Steuerungsbuttons,
     * um die entsprechenden Aktionen im `this.keyboard`-Objekt zu setzen.
     * Diese Methode ermöglicht die Steuerung des Charakters über Touch-Buttons.
     * @param {string} buttonId - Die ID des HTML-Button-Elements, das gedrückt wird.
     * @param {string} actionKey - Der Schlüssel, der im `this.keyboard`-Objekt gesetzt wird.
     * @description Diese Methode bindet "Gedrückt halten" und "Loslassen"-Events
     * für Maus und Touch an einen einzelnen UI-Button.
     * Sie wird in der initButtonControls() aufgerufen, um die Steuerung des Charakters zu ermöglichen.
     */
    initButtonControls() {
        const controlButtonMap = {
            'leftButton': 'TOUCH_LEFT',
            'rightButton': 'TOUCH_RIGHT',
            'upButton': 'TOUCH_JUMP',
            'wurfButton': 'TOUCH_THROW'
        };

        // Geht durch die Map und bindet die Events für jeden Button.
        for (const buttonId in controlButtonMap) {
            const actionKey = controlButtonMap[buttonId];
            this.bindPressAndHoldEvents(buttonId, actionKey);
        }

        // Event-Listener für Pause, Play, Stop
        const pauseButton = document.getElementById('pauseButton');
        const playButton = document.getElementById('playButton');
        const stopButton = document.getElementById('stopButton');
        const audioButton = document.getElementById('audioOnOffButton');

        if (pauseButton) {
            pauseButton.addEventListener('click', () => this.pauseGame());
        }
        if (playButton) {
            playButton.addEventListener('click', () => this.resumeGame());
           // playButton.style.display = 'none'; // Play-Button am Anfang ausblenden
        }
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopGame());
        }
        if (audioButton) {
            audioButton.addEventListener('click', () => {
                this.audioManager.toggleMute();
            });
        }
    }

    /**
     * wird in der initButtonControls() aufgerufen.
     * @param {string} buttonId - Die ID des HTML-Button-Elements.
     * @param {string} actionKey - Der Schlüssel, der im `this.keyboard`-Objekt gesetzt wird.
     * @memberof World
     * @function bindPressAndHoldEvents
     * @returns {void}
     * @description Bindet "Gedrückt halten" und "Loslassen"-Events für einen einzelnen UI-Button.
     */
    bindPressAndHoldEvents(buttonId, actionKey) {
        const button = document.getElementById(buttonId);
        if (!button) return;                    // Bricht ab, wenn der Button nicht existiert

        const setActionState = (isPressed) => (event) => {
            event.preventDefault();
            this.keyboard[actionKey] = isPressed;
        };

        // Events für "Button gedrückt"
        button.addEventListener('mousedown', setActionState(true));
        button.addEventListener('touchstart', setActionState(true), { passive: false });

        // Events für "Button losgelassen"
        button.addEventListener('mouseup', setActionState(false));
        button.addEventListener('mouseleave', setActionState(false));
        button.addEventListener('touchend', setActionState(false), { passive: false });
    }

    /**
     * wird in der bindKeyboardEvents() und initButtonControls() aufgerufen
     * @param {void}
     * @memberof World
     * @function pauseGame
     * @returns {void}
     * @description Diese Methode wird aufgerufen, wenn der Pause-Button geklickt wird
     * oder die Taste 'p' gedrückt wird.
     * Sie setzt den Spielzustand auf pausiert, stoppt die Hintergrundmusik,  
     */
    pauseGame() {
        if (!this.isPaused) {                       // Nur pausieren, wenn es läuft
            this.isPaused = true;
            this.audioManager.stop('background');
            console.log("Spiel pausiert.");
            //this.drawPauseOverlay();                // Zeigt den Pause-Screen auf dem Canvas
            // Buttons werden aktualisiert
           // document.getElementById('pauseButton').style.display = 'none';
            document.getElementById('playButton').style.display = 'inline-block';
        }
    }

    /**
     * wird in der bindKeyboardEvents() und initButtonControls() aufgerufen
     * @memberof World
     * @function resumeGame
     * @returns {void}
     * @description Diese Methode prüft, ob das Spiel pausiert ist,
     * setzt das Spiel fort, 
     * startet die Hintergrundmusik
     */
    resumeGame() {
        if (this.isPaused) {                        // Nur fortsetzen, wenn es pausiert ist
            this.isPaused = false;
            this.audioManager.play('background');
            console.log("Spiel fortgesetzt.");
            // Buttons werden aktualisiert
          //  document.getElementById('playButton').style.display = 'none';
            document.getElementById('pauseButton').style.display = 'inline-block';
        }
    }

    /**
     * wird in der bindKeyboardEvents() und initButtonControls() aufgerufen 
     * @memberof World
     * @function stopGame
     * @returns {void}
     * @description Diese Methode wird aufgerufen, wenn der Stop-Button geklickt wird
     * oder die Taste 'Escape' gedrückt wird.
     * Sie stoppt die Game Loop, setzt den Spielzustand zurück und zeigt den Intro-Bildschirm an.
     * Außerdem wird die Hintergrundmusik gestoppt und der Callback aufgerufen
     * um das Spiel zu beenden.
     */
    stopGame() {
        console.log("Spiel gestoppt und beendet.");
        if (this.gameLoopIntervalId) {
            clearInterval(this.gameLoopIntervalId);
            this.gameLoopIntervalId = null;
        }
        this.audioManager.stop('background'); 
        if (typeof this.onStopGameCallback === 'function') {
            this.onStopGameCallback();      // Ruft die gespeicherte Funktion auf
        }
    }

    /**
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * @memberof World
     * @function run
     * @returns {void}
     * @description Diese Methode startet die Game Loop, die alle 16.67ms (60 FPS) läuft.   
     * Sie prüft Tastatureingaben, wendet Schwerkraft an,   
     * prüft Kollisionen und zeichnet die Objekte auf dem Canvas.
     */
    run() {
        if (this.gameLoopIntervalId) {
            clearInterval(this.gameLoopIntervalId);
        }
        this.audioManager.play('background');     // Startet die Hintergrundmusik, sobald das Spiel läuft
        this.gameLoopIntervalId = setInterval(() => {
            if (this.isPaused) {
              this.draw();
              return; 
            }
            if (this.character.isDead()) { 
                 this.handleGameOver();
                 return;
             }
            if (this.gameWon) { 
                clearInterval(this.gameLoopIntervalId);
                this.gameLoopIntervalId = null;
                return;
            }

            this.checkKeyboardInput();      // für Characterbewegung u Kamera-Update        
            this.character.applyGravity();  // Characterbewegugn im Sprung
            this.checkCollisions();         // Kollisionen prüfen
            this.draw();                    // Zeichnen der Objekte 
        }, 1000 / 60);
    }

    /**
     * wird in der run() aufgerufen
     * @memberof World
     * @function handleGameOver
     * @returns {void}
     * @description Diese Methode stoppt die Game Loop,
     * zeigt den Game-Over-Bildschirm an.
     * Sie wird aufgerufen, wenn der Charakter stirbt.
     * Sie setzt die Game Loop ID auf null, um zu verhindern, dass sie erneut gestartet wird.
     * Außerdem wird der Hintergrund gestoppt und der Game-Over-Sound abgespielt.
     */
    handleGameOver() {
        clearInterval(this.gameLoopIntervalId); // Stoppt die Game Loop
        this.gameLoopIntervalId = null;
        this.audioManager.stop('background'); // Stoppt die backgroundMusik 
        this.audioManager.play('game_over');  // spielt den Game-Over-Sound <--> fehlt noch
        showGameOverScreen();
    }

    /**
     * wird in der run() aufgerufen
     * @memberof World
     * @function checkKeyboardInput
     * @returns {void} 
     * @description Diese Methode prüft die Tastatureingaben und löst die entsprechenden Aktionen des Charakters aus.
     * Sie ermöglicht die Bewegung des Charakters nach links und rechts,
     * das Springen und Werfen von Steinen.
     * und die Kamera-Position entsprechend dem Charakter zu aktualisieren.
     * @param {KeyboardEvent} e - Das KeyboardEvent-Objekt, das die gedrückte Taste enthält.
     * @param {string} actionKey - Der Schlüssel, der im `this.keyboard`-Objekt gesetzt wird.
     * @param {void}
     */ 
    checkKeyboardInput() {
        if (this.keyboard['ArrowRight'] || this.keyboard['TOUCH_RIGHT']) { 
            this.character.moveRight();
        }
        if (this.keyboard['ArrowLeft'] || this.keyboard['TOUCH_LEFT']) {
            this.character.moveLeft();
        }
        if (this.keyboard['ArrowUp'] || this.keyboard['TOUCH_JUMP']) {
            this.character.jump();
        }
        if (this.keyboard['d'] || this.keyboard['D']  || this.keyboard['TOUCH_THROW']) { // Taste D für Werfen
            this.character.throwStone();
        }
         this.camera_x = -this.character.x + 100; // 100 Pixel Offset vom linken Rand
    }

    /**
     * @param {Stone} stone - Das Wurfobjekt, das zur Welt hinzugefügt wird.
     * @memberof World  
     * @function addThrowableObject
     * @returns {void}
     * @description Diese Methode fügt ein Wurfobjekt (Stein) zur Welt hinzu.
     * Sie wird aufgerufen, wenn der Charakter einen Stein wirft.
     */
    addThrowableObject(stone) {
        this.throwableObjects.push(stone);
        console.log('Stein zur Welt hinzugefügt. Anzahl:', this.throwableObjects.length); // Debug
    }

    /**
     * wird in der handleWin() aufgerufen
     * @memberof World
     * @function handleWin
     * @returns {void}
     * @description Diese Methode wird aufgerufen, wenn der Charakter die Schatztruhe erreicht.
     * Sie stoppt die Game Loop und spielt den Gewinn-Sound ab.
     * Sie zeigt den Gewinnbildschirm an und setzt den Spielzustand auf gewonnen.
     */
    handleWin() {
        if (!this.gameWon) {                            // Nur einmal ausführen
             this.gameWon = true;
             clearInterval(this.gameLoopIntervalId);    // Stoppt die Game Loop
             this.gameLoopIntervalId = null;
             this.keyboard = {};                        // Tastatureingaben ignorieren
             this.audioManager.stop('background');      // Stoppt die Musik und spielt den Gewinn-Sound
             this.audioManager.play('win');
             showWinScreen();
        }
    }

    /**
     * Diese Methode wird in der run() aufgerufen.
     * @memberof World
     * @function checkCollisions
     * @returns {void}
     * @description Diese Methode prüft Kollisionen zwischen dem Charakter und anderen Objekten in der Welt.
     * Sie überprüft Kollisionen mit Münzen, Steinen, Gegnern und dem Endboss.
     * Sie entfernt gesammelte Münzen und Steine aus den Arrays
     * und aktualisiert die Statusleisten des Charakters.
     * Sie behandelt auch Kollisionen mit der Schatztruhe, um den Gewinnzustand auszulösen.
     * Sie prüft Kollisionen zwischen Steinen und Gegnern, um Schaden zu verursachen.
     * Sie entfernt "tote" Gegner aus dem Array, behält aber den Endboss für die Todesanimation.
     * @param {void}
     */
    checkCollisions() {
        // 1. Kollision Charakter mit Münzen
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();           // Methode in Character aufrufen
                this.coins.splice(index, 1);            // Münze aus dem Array entfernen
                this.updateStatusBars();                // Statusbar sofort aktualisieren
                this.audioManager.play('coin');         // NEU
            }
        });

        // 2. Kollision Charakter mit Steinen
        this.stones.forEach((stone, index) => {
            if (this.character.isColliding(stone)) {
                this.character.collectStone();          // Methode in Character aufrufen
                this.stones.splice(index, 1);           // Stein aus dem Array entfernen
                this.updateStatusBars();                // Statusbar sofort aktualisieren
            }
        });

        // 3. Kollision Charakter mit Gegnern und Endboss
        this.enemies.forEach((enemy) => {
        // Prüft Kollision und ob Gegner noch lebt
        if (this.character.isColliding(enemy) && !enemy.isDead()) {
            // Sprungamgriff auf den Boss
            if (enemy instanceof Endboss && this.character.isAboveGround() && this.character.speedY < 0) { // isAboveGround() prüft, ob er in der Luft ist, speedY < 0 prüft, ob er fällt 
                enemy.hit();                // Gegner nimmt Schaden
                this.character.bounce();    // Charakter springt zurück
                //this.audioManager.play('enemy_death'); // NEU: Sound für Treffer auf Gegner -- fehlt noch
            } 
            // Normale Kollision (von der Seite/unten)
            else if (!this.character.isHurt()) {
                this.character.hit();
                this.updateStatusBars();
                //this.audioManager.play('character_hit'); // NEU -- fehlt noch
            }
        } 
        // Kollision mit normalen Gegnern
        else if (!(enemy instanceof Endboss) && this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isHurt()) {
            this.character.hit();
            this.updateStatusBars();
        }
    });

        // 4. Kollision Steine mit ALLEN Gegnern (inklusive Endboss)
        this.throwableObjects.forEach((stone) => {
            this.enemies.forEach((enemy) => {
                if (stone && !stone.isDestroyed && enemy && !enemy.isDead() && stone.isColliding(enemy)) {
                    enemy.hit(); // Trifft jeden Gegner, auch den Endboss
                    stone.isDestroyed = true; // Markiert den Stein zum Entfernen
                    //this.audioManager.play('enemy_death'); // NEU -- fehlt noch
                }
            });
        });

        // 5. Kollision Charakter mit Schatztruhe NUR wenn Endboss tot ist
        if (this.treasureChest && this.character.isColliding(this.treasureChest)) {
            if (this.endboss && !this.endboss.isDead()) {
                // Truhe ist blockiert, solange Endboss lebt
                return;
            } else {
                this.handleWin(); // Gewinnzustand auslösen
            }
        }

        // --- Aufräumen: Objekte entfernen ---
        this.throwableObjects = this.throwableObjects.filter(stone => !stone.isDestroyed)

        // Entfernt "tote" Gegner (die getroffen wurden)
        // Endboss im Array behalten, auch wenn er tot ist, damit die Todesanimation gezeigt werden kann
        this.enemies = this.enemies.filter(enemy => !enemy.isDead() || enemy instanceof Endboss); 
    }

    /**
     * wird in der run() aufgerufen.
     * @memberof World
     * @function draw
     * @returns {void}
     * @param {void}
     * @description Diese Methode ist der Hauptzeichnungszyklus des Spiels.
     * Sie wird in der Game Loop aufgerufen und führt die folgenden Schritte aus:
     * 1. Löscht den Canvas, um die vorherigen Zeichnungen zu entfernen.
     * 2. Zeichnet den Hintergrund mit Parallax-Effekt, indem es die Hintergrundebenen durchläuft
     *    und sie entsprechend der Kamera-Position anzeigt.
     * 3. Verschiebt die Kamera, um den Charakter im Fokus zu halten.
     * 4. Zeichnet alle Spielobjekte (Wolken, Münzen, Steine, Gegner, Wurfobjekte, Charakter und Schatztruhe).
     * 5. Setzt die Kamera-Translation zurück, um die Position für die nächsten Zeichnungen zu korrigieren.
     * 6. Zeichnet die Statusleiste des Endbosses, wenn der Endboss existiert und in der Nähe ist.
     * 7. Wenn das Spiel pausiert ist, wird ein Pause-Overlay gezeichnet.
     * 8. Aktualisiert die Statusleisten des Charakters (Leben, Münzen, Steine).
     */
    draw() {
        // --- 1. Canvas löschen ---
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // --- 2. Hintergrund mit Parallax zeichnen ---
        this.backgroundObjects.forEach(layer => {
            let effectiveX = layer.x + this.camera_x * layer.parallaxFactor;

            // --- Kachellogik ---
            // Wenn eine Kachel komplett links aus dem Bild ist (unter Berücksichtigung ihrer Geschwindigkeit)
            // Beispiel: Kachelbreite 720. Wenn effectiveX < -720, ist sie links raus.
            // Wir verschieben sie dann um 3 Kachelbreiten nach rechts (da wir 3 Kacheln pro Ebene haben)
            if (effectiveX <= -layer.width) {
                layer.x += layer.width * 3;             // Verschiebe diese Kachel weit nach rechts
            } else if (effectiveX > layer.width * 2) {  // Optional: Falls man auch nach links scrollt
                layer.x -= layer.width * 3;
            }

             // Zeichnet die Kachel an ihrer *aktuellen* Position (layer.x),
             // aber verschoben durch die Kamera-Simulation für den Parallax-Effekt
             this.ctx.drawImage(layer.img, effectiveX, layer.y, layer.width, layer.height);
        });
        // --- 3. Kamera für Spielobjekte verschieben ---
        this.ctx.translate(this.camera_x, 0);

        // --- 4. Zeichnet Elemente ---
        this.drawObjects(this.clouds);
        this.drawObjects(this.coins); 
        this.drawObjects(this.stones);
        this.drawObjects(this.enemies);
        this.drawObjects(this.throwableObjects);
        this.character.draw(this.ctx);
        if (this.treasureChest) {                       // Zeichnet die Truhe, falls sie existiert
            this.treasureChest.draw(this.ctx);
        }
        // --- 5. Kamera-Translation zurücksetzen ---
        this.ctx.translate(-this.camera_x, 0);

        // --- 6. Statusleiste ENDBOSS zeichnen ---
        this.drawEndbossStatusBar();
        if (this.isPaused) {
        this.drawPauseOverlay(); // --- 7. Zeichnet das Pause-Overlay ---
        }
    }

     /**
     * wird in der draw() Methode aufgerufen, --- 4. Zeichnet Elemente ---
     * @memberof World
     * @function drawObjects
     * @description Diese Methode nimmt ein Array von Objekten und zeichnet jedes Objekt auf dem Canvas.
     * Sie wird verwendet, um die Wiederholung des Zeichnens von Objekten zu vermeiden.
     * @param {MovableObject[]} objects - Ein Array von MovableObjects, die gezeichnet werden sollen.
     * @returns {void}
     */
    drawObjects(objects) {
        objects.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    /**
     * wird in der draw() Methode aufgerufen, --- 7. Zeichnet das Pause-Overlay ---
     * @memberof World
     * @function drawPauseOverlay
     * @returns {void}
     * @description Diese Methode zeichnet ein halbtransparentes Overlay über den Canvas,
     * um anzuzeigen, dass das Spiel pausiert ist.
     * Sie zeigt den Text "Pause" und eine Anweisung zum Fortsetzen des Spiels an.
     */
     drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';                          // Halbtransparentes Grau
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);       // Über den ganzen Canvas

        this.ctx.font = "48px 'Arial'";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center"; 
        this.ctx.fillText("Pause", this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = "24px 'Arial'";
        this.ctx.fillText("Drücke 'Play' zum Fortsetzen", this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    /**
     * wird in der draw() Methode aufgerufen, --- 6. Statusleiste ENDBOSS zeichnen ---
     * @memberof World
     * @function drawEndbossStatusBar
     * @returns {void}
     * @description Diese Methode zeichnet die Statusanzeige des Endbosses.
     * Sie zeigt den Gesundheitsbalken des Endbosses an, wenn der Charakter in der Nähe ist.
     * Der Balken wird grün, wenn der Boss mehr als 40% Gesundheit hat,
     * und rot, wenn er weniger als 40% Gesundheit hat.
     * Die Anzeige wird nur angezeigt, wenn der Endboss existiert und nicht tot ist.
     */
    drawEndbossStatusBar() {
        if (!this.endboss) return;              // Nur ausführen, wenn es einen Endboss gibt

        const distance = Math.abs(this.endboss.x - this.character.x); 
        const statusBar = document.getElementById('endbossStatus');
        const healthBar = document.getElementById('endbossHealthBar');

        // Zeigt die Leiste nur an, wenn der Boss in der Nähe und am Leben ist
        if (distance < 800 && !this.endboss.isDead()) {
            statusBar.style.display = 'flex';
            // Berechnet, wie viel Prozent Leben der Boss noch hat
            const healthPercentage = (this.endboss.health / this.endboss.maxHealth) * 100; // 3 ist die maximale Gesundheit
            healthBar.style.width = healthPercentage + '%';

            // Wenn die Leben niedrig sind, färbt sich der Balken rot!
            if (healthPercentage < 40) {
                healthBar.style.backgroundColor = 'red';
            } else {
                healthBar.style.backgroundColor = 'green';
            }

        } else {
            statusBar.style.display = 'none'; // Sonst verstecken
        }
    }

     /**
      * Diese Methode wird in der checkCollisions() und buyLife() aufgerufen.
      * @memberof World 
      * @function updateStatusBars
      * @returns {void} 
      * @description Diese Methode aktualisiert die Textinhalte der Statusleisten-Elemente im HTML.
      * Sie zeigt die aktuellen Werte für Leben, Münzen und Steine des Charakters an.
      * Außerdem wird der "Kaufe Leben"-Button aktualisiert, um anzuzeigen,
      * ob der Charakter genug Münzen hat, um ein Leben zu kaufen.
      * Wenn der Charakter genug Münzen hat, wird der Button aktiviert und zeigt den Preis an.
      * Wenn nicht genug Münzen vorhanden sind, wird der Button deaktiviert und zeigt an,
      * wie viele Münzen fehlen, um ein Leben zu kaufen.
      * Diese Methode wird aufgerufen, wenn der Charakter Münzen oder Steine sammelt,
      * wenn er ein Leben kauft oder wenn sich der Charakterzustand ändert.
      * @param {void}
      */
    updateStatusBars() {
        document.getElementById('livesStatus').innerText = this.character.lives;
        document.getElementById('coinsStatus').innerText = this.character.coins;
        document.getElementById('stonesStatus').innerText = this.character.stones;
        const buyButton = document.getElementById('buyLifeButton');
        if(this.character.coins >= 5) {
           buyButton.style.display = 'inline-block'; 
           buyButton.disabled = false;
           buyButton.innerText = 'Kaufe Leben (5 Münzen)';
        } else {
            buyButton.style.display = 'inline-block';
            buyButton.disabled = true;
            buyButton.innerText = `Kaufe Leben (${5-this.character.coins} Münzen fehlen)`;
        }
    }

    /**
     * Diese Methode wird aufgerufen, wenn der Charakter genug Münzen hat, um ein Leben zu kaufen.
     * Sie wird durch den "Kaufe Leben"-Button im HTML ausgelöst.
     * @memberof World
     * @function buyLife
     * @returns {void}
     * @description Diese Methode prüft, ob der Charakter genug Münzen hat, um ein Leben zu kaufen.
     * Wenn ja, werden 5 Münzen abgezogen und ein Leben hinzugefügt.
     * Die Statusleisten werden sofort aktualisiert, um die Änderungen anzuzeigen.
     */
    buyLife() {
        if (this.character.coins >= 5 && !this.character.isDead()) {
            this.character.coins -= 5;
            this.character.lives += 1;
            this.updateStatusBars();                                        // Anzeige sofort aktualisieren
        }  
    }
}
