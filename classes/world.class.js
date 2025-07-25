class World {
    worldName = "Treasure Hunt";
    worldDescription = "2D Run and Jump Game";
    worldAuthor = "LianeSchmuhl";

    character = new Character(); 
    enemies = [new Enemy(400), new Enemy(800), new Enemy(1200)]; 
    clouds = [new Cloud(0),new Cloud(400),new Cloud(900), new Cloud(1300), new Cloud(1700), new Cloud(2100)]; 
    coins = []; 
    stones = [];
    throwableObjects = [];     
    canvas; 
    ctx;    
    keyboard = {}; 
    camera_x = 0;               
    gameLoopIntervalId = null;  
    treasureChest = null;       
    LEVEL_END = 2500;           // Level-Ende (soll dynamisch gesetzt werden)
    gameWon = false;           
    isPaused = false; 
    audioManager = new AudioManager(); // Instanz der Audio-Klasse         

    /**
    * Erstellt eine neue Instanz der Spielwelt.
    * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem das Spiel gezeichnet wird.
    */
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = 1000; 
        this.canvas.height = 700; 
        this.ctx = canvas.getContext('2d');
        this.keyboard = {};
        this.initLevel(); 
        this.draw();
        this.setWorld();
        this.bindKeyboardEvents();
        this.initButtonControls(); 
        this.togglePause();      
        this.run();
        this.gameWon = false;    
        this.isPaused = false;   
    }
    /**
     * Initialisiert das Level, setzt den Spielzustand zurück und initialisiert alle Objekte
     * wie Hintergrund, Münzen, Steine, Gegner und den Endboss.
     * Diese Methode wird aufgerufen, wenn das Spiel neu gestartet wird.
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * @function initLevel
     * @memberof World
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
     * Setzt den Spielzustand zurück, einschließlich aller Objekte und des Endbosses.
     * Diese Methode wird aufgerufen, wenn das Spiel neu gestartet wird.  
     * Diese Methode löscht alle Objekte und setzt den Endboss neu.
     * Sie wird in der initLevel() aufgerufen.
     * @memberof World
     */
    resetGameState() {
        this.isPaused = false;
        this.gameWon = false;
        this.backgroundObjects = [];
        this.coins = [];
        this.stones = [];
        this.enemies = [];
        this.endboss = new Endboss(this); // Endboss wird hier initialisiert
        this.throwableObjects = [];
    }

    /** 
     * Zeichnet den Hintergrund auf dem Canvas.
     * Sie wird in der initLevel() aufgerufen.
     */
    initBackgroundLayers() {
        const canvasWidth = this.canvas.width;
        const layers = [
            { path: 'images/bg-canvas/bg1.png', parallaxFactor: 0 },
 //           { path: 'images/bg-canvas/bg1.png', parallaxFactor: 0.2 },
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
     * Initialisiert alle Spielobjekte wie Münzen, Steine, Gegner und den Endboss.
     * Diese Methode wird in der initLevel() aufgerufen.
     */
    initGameObjects() {
        this.initCoins();
        this.initStones();
        this.initEnemies();
        this.initEndboss();
    }

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
    initEnemies() {
        this.enemies.push(
            new Enemy(550, this),
            new Enemy(700, this),
            new Enemy(900, this),
            new Enemy(1050, this),
            new Enemy(1200, this),
            new Enemy(1350, this),
        );
    }

    /**
     * Initialisiert den Endboss und platziert ihn kurz vor der Schatztruhe.
     * Der Endboss erscheint erst, wenn der Charakter nahe genug am Level-Ende ist.
     */
    initEndboss() {
        this.endboss.x = this.LEVEL_END - 100; 
        this.endboss.y = 250;
        this.enemies.push(this.endboss);
    }

    /**
     * Initialisiert die Schatztruhe
     * am LEVEL_END-Punkt, 320 Pixel über dem Boden
     * Diese Methode wird in der initLevel() aufgerufen.
     */
    initTreasureChest() {
        const groundYForChest = 320;
        this.treasureChest = new TreasureChest(this.LEVEL_END, groundYForChest);
    }

    /**
     * Setzt den Charakter zurück und bindet ihn an die Welt.
     * Diese Methode wird aufgerufen, wenn das Spiel neu gestartet wird.
     * Diese Methode wird in der initLevel() aufgerufen.
     * @param {Character} character - Der Charakter, der in der Welt platziert wird.
     * @memberof World
     */
    resetCharacter() {
        this.character = new Character();
        this.setWorld();
    }

    /**
     * Diese Methode wird aufgerufen, wenn das Spiel neu gestartet wird.
     * Diese Methode wird in der initLevel() aufgerufen.
     * Sie setzt die Kamera-Position auf 0, sodass der Charakter immer am linken Rand des Canvas beginnt.
     * @memberof World
     */
    resetCamera() {
        this.camera_x = 0;
    }

    /**
     * Setzt die Welt-Referenz im Charakter-Objekt.
     * Diese Methode wird aufgerufen, um die Referenz zur Welt zu setzen,
     * damit der Charakter auf die Welt zugreifen kann.
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Bindet die Event Listener für Tastatureingaben.
     * Diese Methode registriert 'keydown' und 'keyup' Events,
     * um den Zustand der Tasten im `this.keyboard`-Objekt zu speichern.
     * Außerdem wird die Pause-Funktionalität an die Taste 'p' gebunden.
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * @memberof World
     */
    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            this.keyboard[e.key] = true;                // Speichert den gedrückten Zustand
            if (e.key === 'p' || e.key === 'P') {
               this.togglePause();
            }

        });

        window.addEventListener('keyup', (e) => {
            this.keyboard[e.key] = false;               // Entfernt den gedrückten Zustand
        });
    }

    /**
     * Initialisiert die Event-Listener für die In-Game-Steuerungsbuttons.
     * Nutzt eine Konfigurations-Map, um den Code sauber und erweiterbar zu halten.
     * Mit ButtonID-Konfiguration zu den SteuerungsAktionen.
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
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
    }

    /**
     * BINDET HELFER-METHODE: Bindet "Gedrückt halten" und "Loslassen"-Events
     * für Maus und Touch an einen einzelnen UI-Button.
     * @param {string} buttonId - Die ID des HTML-Button-Elements.
     * @param {string} actionKey - Der Schlüssel, der im `this.keyboard`-Objekt gesetzt wird.
     * wird in der initButtonControls() aufgerufen.
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

    // --- Methode zum Umschalten des Pause-Zustands ---
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            console.log("Spiel pausiert.");
            this.audioManager.stop('background'); 
        } else {
            console.log("Spiel fortgesetzt.");
            this.audioManager.play('background'); 
        }
    }

    /**
     * Startet die Game Loop, die alle 16.67ms (60 FPS) läuft.
     * Diese Methode wird in der Konstruktor-Methode aufgerufen.
     * Die Game Loop prüft Tastatureingaben, wendet Schwerkraft an,
     * prüft Kollisionen und zeichnet die Objekte auf dem Canvas.
     * @memberof World
     * @function run
     * @returns {void}
     */
    run() {
        if (this.gameLoopIntervalId) {
            clearInterval(this.gameLoopIntervalId);
        }
        this.audioManager.play('background');     // Startet die Hintergrundmusik, sobald das Spiel läuft
        // Startet die Game Loop, die alle 16.67ms (60 FPS) läuft
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

            this.checkKeyboardInput();               
            this.character.applyGravity();  
            this.checkCollisions();         // Kollisionen prüfen
            this.draw();                    // Zeichnen der Objekte 
        }, 1000 / 60);
    }

    /**
     * Stoppt die Game Loop und zeigt den Game-Over-Bildschirm an.
     * Diese Methode wird aufgerufen, wenn der Charakter stirbt.
     * Sie setzt die Game Loop ID auf null, um zu verhindern, dass sie erneut gestartet wird.
     * Außerdem wird der Hintergrund gestoppt und der Game-Over-Sound abgespielt.
     * Diese Methode wird in der run() aufgerufen, wenn der Charakter tot ist.
     */
    handleGameOver() {
        clearInterval(this.gameLoopIntervalId); // Stoppt die Game Loop
        this.gameLoopIntervalId = null;
        this.audioManager.stop('background'); // Stoppt die backgroundMusik 
       //this.audioManager.play('game_over');  // spielt den Game-Over-Sound <--> fehlt noch
        showGameOverScreen();
    }

    /**
     * Überprüft Tastatureingaben und löst Charakteraktionen aus
     * je nach gedrückten Tasten.
     * Diese Methode wird in der run() aufgerufen, um die Eingaben zu verarbeiten
     * und die Kamera-Position entsprechend dem Charakter zu aktualisieren.
     * @memberof World
     * @function checkKeyboardInput
     * @returns {void} 
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

    // Methode zum Hinzufügen von Wurfobjekten ---
    addThrowableObject(stone) {
        this.throwableObjects.push(stone);
        console.log('Stein zur Welt hinzugefügt. Anzahl:', this.throwableObjects.length); // Debug
    }

    // Methode für den Gewinnfall ---
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // --- 1. Hintergrund mit Parallax zeichnen ---
        this.backgroundObjects.forEach(layer => {
            let effectiveX = layer.x + this.camera_x * layer.parallaxFactor;

            // --- Kachellogik ---
            // Wenn eine Kachel komplett links aus dem Bild ist (unter Berücksichtigung ihrer Geschwindigkeit)
            // Beispiel: Kachelbreite 720. Wenn effectiveX < -720, ist sie links raus.
            // Wir verschieben sie dann um 3 Kachelbreiten nach rechts (da wir 3 Kacheln pro Ebene haben)
            if (effectiveX <= -layer.width) {
                layer.x += layer.width * 3; // Verschiebe diese Kachel weit nach rechts
            } else if (effectiveX > layer.width * 2) { // Optional: Falls man auch nach links scrollen könnte
                layer.x -= layer.width * 3;
            }

             // Zeichnet die Kachel an ihrer *aktuellen* Position (layer.x),
             // aber verschoben durch die Kamera-Simulation für den Parallax-Effekt
             this.ctx.drawImage(layer.img, effectiveX, layer.y, layer.width, layer.height);
        });
        // --- 2. Kamera für Spielobjekte verschieben ---
        this.ctx.translate(this.camera_x, 0);
         // --- Pause-Overlay zeichnen, WENN pausiert ---
         if (this.isPaused) {
            this.drawPauseOverlay();
        }

        // --- 3. Zeichnet Elemente ---
        this.drawObjects(this.clouds);
        this.drawObjects(this.coins); 
        this.drawObjects(this.stones);
        this.drawObjects(this.enemies);
        this.drawObjects(this.throwableObjects);
        this.character.draw(this.ctx);
        if (this.treasureChest) {                       // Zeichnet die Truhe, falls sie existiert
            this.treasureChest.draw(this.ctx);
        }
        // --- 4. Kamera-Translation zurücksetzen ---
        this.ctx.translate(-this.camera_x, 0);

        // --- 5. Statusleiste ENDBOSS zeichnen ---
        this.drawEndbossStatusBar();
    }

     /**
     * Hilfsfunktion zum Zeichnen eines Arrays von MovableObjects
     * @param {MovableObject[]} objects - Das Array der zu zeichnenden Objekte
     */
    drawObjects(objects) {
        objects.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

     // Methode zum Zeichnen des Pause-Overlays 
     drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';                          // Halbtransparentes Grau
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);       // Über den ganzen Canvas

        this.ctx.font = "48px 'Arial'";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center"; 
        this.ctx.fillText("Pause", this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = "24px 'Arial'";
        this.ctx.fillText("Drücke den button 'Play' zum Fortsetzen", this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    /**
     * Zeichnet und aktualisiert die Statusanzeige des Endbosses.
     * Wird nur angezeigt, wenn der Charakter in der Nähe ist.
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
      * Aktualisiert die Textinhalte der Statusbar-Elemente im HTML
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

      // Platzhalter für die Kauf-Logik
    buyLife() {
        if (this.character.coins >= 5 && !this.character.isDead()) {
            this.character.coins -= 5;
            this.character.lives += 1;
            this.updateStatusBars();                                        // Anzeige sofort aktualisieren
        }  
    }
}
