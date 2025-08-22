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
    world = new World(canvas, showIntroScreen);       
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

/**
 * Öffnet die Impressum-Seite.
 * @param {*} url 
 */
function goToImpressum(url) {
  window.location.href = url;
}

/**
 * Definiert, welche Funktion bei einem Klick auf einen bestimmten Button ausgeführt wird.
 * Dies macht den Code erweiterbar und leicht lesbar.
 */
const buttonEventMap = {
    'startButton': initGame,
    'restartButton': restartGame,
    'restartButtonWin': restartGame,
    'backButton': () => window.location.href = 'index.html',
    'impButton': showImpressum, //() => window.location.href = 'impressum.html',
    'buyLifeButton': () => world?.buyLife(),
    'infoButton': showGameInfo,
    'helpButton': showGameControls 
};

/**
 * Zeigt das #game-info Overlay an und füllt es mit dem übergebenen Inhalt.
 * @param {string} contentHTML - Der HTML-Inhalt, der angezeigt werden soll.
 */
function showOverlayWithContent(contentHTML) {
    const gameInfoContainer = document.getElementById("game-info");
    gameInfoContainer.style.display = "flex";
    // Ruft die Rahmen-Vorlage auf und übergibt den spezifischen Inhalt
    gameInfoContainer.innerHTML = getGameInfoFrameHTML(contentHTML);
}

/**
 * Zeigt das Overlay mit den Spiel-Informationen an.
 */
function showGameInfo() {   
    showOverlayWithContent(getStoryContentHTML());
}

/**
 * Zeigt das Overlay mit den Spiel-Steuerungsinformationen an.
 */
function showGameControls() {
    showOverlayWithContent(getControlsContentHTML());
}

/**
 * Zeigt das Overlay mit den Impressum-Informationen an.
 */
function showImpressum() {
    showOverlayWithContent(getImpressumContentHTML());
}

/**
 * Versteckt das Overlay mit den Spiel-Informationen.
 */
function hideGameInfo() {
    const gameInfoContainer = document.getElementById("game-info");
    gameInfoContainer.style.display = "none";
    gameInfoContainer.innerHTML = ""; 
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

/*
* Initialisiert das Spiel und zeigt den Intro-Screen an.
* Prüft, ob der Intro-Screen sichtbar ist, um zu vermeiden,
* dass man das Spiel neustartet, wenn man im Spiel Enter drückt.
*/
window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const introOverlay = document.getElementById('introOverlay');
        if (getComputedStyle(introOverlay).display !== 'none') {
            initGame();
        }
         else if (getComputedStyle(gameOverOverlay).display !== 'none' || getComputedStyle(winOverlay).display !== 'none') {
            restartGame();
        }
    }
});

/**
 * DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', () => {
    setupInitialUI();
    setupEventListeners();
});

/** Zeigt den Game Over-Bildschirm an, wenn das Spiel verloren ist.
 *  Diese Funktion wird aufgerufen, wenn der Spieler keine Leben mehr hat.
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

/**
 * Zeigt den Intro-Bildschirm an und versteckt das Spiel.
 * Wird von der stopGame() Methode in der World-Klasse aufgerufen.
 */
function showIntroScreen() {
    document.getElementById('introOverlay').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOverOverlay').style.display = 'none'; 
    document.getElementById('winOverlay').style.display = 'none';      
}

/**
 * Aktiviert den Vollbildmodus.
 */
function fullscreen () {
    let fullscreen = document.getElementById( 'fullscreenButton');
    enterFullscreen (fullscreen);
}

/**
 * Aktiviert den Vollbildmodus für das angegebene Element.
 * @param {*} element 
 */
function enterFullscreen (element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

/**
 * Deaktiviert den Vollbildmodus.
 */
function exitFullscreen () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
