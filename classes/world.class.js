class World {
    worldName = "Treasure Hunt";
    worldDescription = "2D Run and Jump Game";
    worldAuthor = "LianeSchmuhl";

    character = new Character(); 
    enemies = [new Enemy(400), new Enemy(800), new Enemy(1200)]; 
 //   endboss = new Endboss();
    clouds = [new Cloud(0),new Cloud(400),new Cloud(900)]; 
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

    initLevel() {
        this.resetGameState();
        this.initBackgroundLayers();
        this.initGameObjects();
        this.initTreasureChest();
        this.resetCharacter();
        this.resetCamera();
    }

    resetGameState() {
        this.isPaused = false;
        this.gameWon = false;
        this.backgroundObjects = [];
        this.coins = [];
        this.stones = [];
        this.enemies = [];
//        this.endboss = [];
        this.throwableObjects = [];
    }

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

    initGameObjects() {
        this.initCoins();
        this.initStones();
        this.initEnemies();
//        this.initEndboss();
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
        this.coins.push(new Coin(1900, 400));
    }
    initStones() {
        this.stones.push(new Stone(500, 480));
        this.stones.push(new Stone(550, 520));
        this.stones.push(new Stone(700, 480));
        this.stones.push(new Stone(850, 500));
        this.stones.push(new Stone(1000, 530));
        this.stones.push(new Stone(1250, 480));
        this.stones.push(new Stone(1500, 530));
    }   
    initEnemies() {
        this.enemies.push(
            new Enemy(400, this),
            new Enemy(700, this),
            new Enemy(900, this),
            new Enemy(950, this),
            new Enemy(1200, this),
            new Enemy(1800, this),
            new Enemy(2300, this),
        );
    }
//    initEndboss() {
//        this.endboss = new Endboss();
//        this.endboss.x = this.LEVEL_END - 200;  // Setzt den Endboss 200 Pixel vor dem Level-Ende
//        this.endboss.y = 100;                   // Setzt die Y-Position des Endbosses
//        this.enemies.push(this.endboss);        // Fügt den Endboss zu den Gegnern hinzu
//    }

    initTreasureChest() {
        const groundYForChest = 320;
        this.treasureChest = new TreasureChest(this.LEVEL_END, groundYForChest);
    }

    resetCharacter() {
        this.character = new Character();
        this.setWorld();
    }

    resetCamera() {
        this.camera_x = 0;
    }

    setWorld() {
        this.character.world = this;
    }

    /**
     * Bindet die Event Listener für Tastatureingaben.
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
     */
    initButtonControls() {
        // Konfiguration: Map mit Button-IDs zu ihren Steuerungs-Aktionen.
        const controlButtonMap = {
            'leftButton': 'TOUCH_LEFT',
            'rightButton': 'TOUCH_RIGHT',
            'upButton': 'TOUCH_JUMP',
            'wurfButton': 'TOUCH_THROW'
        };

        // B. Registrierung: Geht durch die Map und bindet die Events für jeden Button.
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
            // Hintergrundmusik pausieren (kommt bei Soundeffekten)
        } else {
            console.log("Spiel fortgesetzt.");
            // Hintergrundmusik fortsetzen
        }
    }

    // Startet die Haupt-Game-Loop
    run() {
        if (this.gameLoopIntervalId) {
            clearInterval(this.gameLoopIntervalId);
        }
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
            this.character.applyGravity();  // Muss VOR Kollisionscheck sein, damit y-Pos aktuell ist
            this.checkCollisions();         // Kollisionen prüfen
            this.draw();                    // Zeichnen der Objekte 
        }, 1000 / 60);
    }

    handleGameOver() {
        clearInterval(this.gameLoopIntervalId); // Stoppt die Game Loop
        this.gameLoopIntervalId = null;
        // Ruft die globale Funktion aus game.js auf, um das Overlay anzuzeigen
        showGameOverScreen();
    }

    // Überprüft Tastatureingaben und löst Charakteraktionen aus
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
             this.keyboard = {}; // Tastatureingaben ignorieren
             // Rufe die globale Funktion aus game.js auf, um das Overlay anzuzeigen
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

        // 3. Kollision Charakter mit Gegnern
        this.enemies.forEach((enemy) => {
           // Prüfen, ob Kollision stattfindet UND der Charakter nicht gerade unverwundbar ist
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();                  // Charakter nimmt Schaden
                this.updateStatusBars();               // Statusbar sofort aktualisieren
                // ?! Gegner könnte auch Schaden nehmen oder zurückgestoßen werden
            }
        });

        // 4. Kollision Steine mit Gegnern
        this.throwableObjects.forEach((stone) => {
            this.enemies.forEach((enemy) => {
              if (stone && enemy && !enemy.isDead && stone.isColliding(enemy)) {
                    enemy.hit();
                    stone.isDestroyed = true; // Markiere den Stein zum Entfernen
                }
            });
        });
    
        // 5. Kollision Charakter mit Schatztruhe << NEU
        if (this.treasureChest && this.character.isColliding(this.treasureChest)) {
            this.handleWin(); // Gewinnzustand auslösen
        }

        // --- Aufräumen: Objekte entfernen ---
        // Entferne Steine, die aus dem Bild geflogen sind (Performance)
        this.throwableObjects = this.throwableObjects.filter(stone => 
           !stone.isDestroyed)

        // Entferne "tote" Gegner (die getroffen wurden)
        this.enemies = this.enemies.filter(enemy => !enemy.isDead); // Behalte nur lebende Gegner
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

             // Zeichne die Kachel an ihrer *aktuellen* Position (layer.x),
             // aber verschoben durch die Kamera-Simulation für den Parallax-Effekt
             this.ctx.drawImage(layer.img, effectiveX, layer.y, layer.width, layer.height);
        });
        // --- 2. Kamera für Spielobjekte verschieben ---
        this.ctx.translate(this.camera_x, 0);
         // --- Pause-Overlay zeichnen, WENN pausiert ---
         if (this.isPaused) {
            this.drawPauseOverlay();
        }

        // --- 3. Zeichne Elemente ---
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

     // << NEU: Methode zum Zeichnen des Pause-Overlays >>
     drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';                          // Halbtransparentes Grau
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);     // Über den ganzen Canvas

        this.ctx.font = "48px 'Arial'";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center"; // Text zentrieren
        this.ctx.fillText("Pause", this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = "24px 'Arial'";
        this.ctx.fillText("Drücke 'P' zum Fortsetzen", this.canvas.width / 2, this.canvas.height / 2 + 50);
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
        // Man könnte ihn auch ganz ausblenden:
        // if(this.character.coins < 5) buyButton.style.display = 'none';
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
