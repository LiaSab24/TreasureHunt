/**
 * Globale Variable, die die Instanz der Hauptspielwelt enthält.
 * @type {world}
 */
let world;
/**
 * Globale Variable für das HTML-Canvas-Element.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Initialisiert das Spiel. Versteckt das Start-Overlay, zeigt den Spiel-Container an
 * und erstellt eine neue Instanz der World-Klasse.
 */
function initGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
    document.getElementById('introOverlay').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('winOverlay').style.display = 'none';
}

/**
 * Lädt die Seite neu, um das Spiel von vorne zu beginnen.
 */
function restartGame() {
    window.location.reload();
}

function goToImpressum(url) {
  window.location.href = url;
}

// ============================================================================
// A. Konfiguration Button-IDs
// ============================================================================

/**
 * Definiert, welche Funktion bei einem Klick auf einen bestimmten Button ausgeführt wird.
 * Dies macht den Code erweiterbar und leicht lesbar.
 */
const buttonEventMap = {
    'startButton': initGame,
    'restartButton': restartGame,
    'restartButtonWin': restartGame,
    'backButton': () => window.location.href = 'index.html',
    'impButton': () => window.location.href = 'impressum.html',
    'pauseButton': () => world?.togglePause(), 
    'buyLifeButton': () => world?.buyLife(),
    'helpButton': toggleHelpText
};

// ============================================================================
// B. Ausgelagerte Aktionen (Helper-Funktionen)
// ============================================================================

/**
 * Zeigt den Hilfe-Text an oder versteckt ihn.
 */
function toggleHelpText() {
    const helpText = document.getElementById('helpText');
    if (helpText) {
        // Toggle zwischen "block" und "none"
        helpText.style.display = (helpText.style.display === 'none' || helpText.style.display === '') ? 'block' : 'none';
    }
}

/**
 * Richtet alle Event-Listener basierend auf der buttonEventMap ein
 */
function setupEventListeners() {
    for (const id in buttonEventMap) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', buttonEventMap[id]);
        }
    }
}

/**
 * Richtet die anfänglichen UI-Animationen und Zustände ein.
 */
function setupInitialUI() {
    const infoBox = document.querySelector('.game-info');
    if (infoBox) {
        setTimeout(() => infoBox.classList.add('visible'), 2000);
    }
    const buyLifeButton = document.getElementById('buyLifeButton');
    if (buyLifeButton) {
        buyLifeButton.style.display = 'none';
    }
}

// ============================================================================
// C. Haupt-Initialisierung 
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    setupInitialUI();
    setupEventListeners();
});

/** * Zeigt den Game Over-Bildschirm an, wenn das Spiel verloren ist.
 * Diese Funktion wird aufgerufen, wenn der Spieler keine Leben mehr hat.
 */
function showGameOverScreen() {
     const gameOverOverlay = document.getElementById('gameOverOverlay');
     if(gameOverOverlay) {
        gameOverOverlay.style.display = 'flex';
     }
}

/**
 * Zeigt den Gewinn-Bildschirm an, wenn das Spiel gewonnen ist.
 * Diese Funktion wird aufgerufen, wenn der Spieler das Ziel erreicht hat.
 */
function showWinScreen() {
    const winOverlay = document.getElementById('winOverlay');
    if(winOverlay) {
       winOverlay.style.display = 'flex';
    }
}
