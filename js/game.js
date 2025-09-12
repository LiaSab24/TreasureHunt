// Ensure all scripts and DOM are loaded before initializing input handling
// ===============================
// 1. Global Variables & Config
// ===============================
/**
 * Global variable for the game world instance.
 * @type {World}
 */
let world;
/**
 * Global variable for the HTML canvas element.
 * @type {HTMLCanvasElement}
 */
let canvas;

const buttonEventMap = {
    'startButton': initGame,
    'restartButton': initGame,
    'restartButtonWin': initGame,
    'backButton': () => window.location.href = 'index.html',
    'impButton': showImpressum, 
    'buyLifeButton': () => world?.buyLife(),
    'infoButton': showGameInfo,
    'helpButton': showGameControls 
};

// ===============================
// 2. Initialization & Main Entry
// ===============================
/**
 * Initializes the game. Hides the start overlay, shows the game container,
 * and creates a new instance of the World class.
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
 * Sets up initial UI animations and states.
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

// ===============================
// 3. UI & Overlay Functions
// ===============================
/**
 * Shows the #game-info overlay and fills it with the provided content.
 * @param {string} contentHTML - The HTML content to be displayed.
 */
function showOverlayWithContent(contentHTML) {
    const gameInfoContainer = document.getElementById("game-info");
    gameInfoContainer.style.display = "flex";
    gameInfoContainer.innerHTML = getGameInfoFrameHTML(contentHTML);
}

/**
 * Shows the overlay with game information.
 */
function showGameInfo() {
    showOverlayWithContent(getStoryContentHTML());
}

/**
 * Shows the overlay with game controls information.
 */
function showGameControls() {
    showOverlayWithContent(getControlsContentHTML());
}

/**
 * Shows the overlay with imprint information.
 */
function showImpressum() {
    showOverlayWithContent(getImpressumContentHTML());
}

/**
 * Hides the overlay with game information.
 */
function hideGameInfo() {
    const gameInfoContainer = document.getElementById("game-info");
    gameInfoContainer.style.display = "none";
    gameInfoContainer.innerHTML = "";
}

// ===============================
// 4. Game State Functions
// ===============================
/**
 * Shows the Game Over screen when the game is lost.
 * This function is called when the player has no lives left.
 */
function showGameOverScreen() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    if (gameOverOverlay) {
        gameOverOverlay.style.display = 'flex';
    }
}

/**
 * Shows the win screen when the game is won.
 * This function is called when the player reaches the goal.
 */
function showWinScreen() {
    const winOverlay = document.getElementById('winOverlay');
    if (winOverlay) {
        winOverlay.style.display = 'flex';
    }
}

/**
 * Shows the intro screen and hides the game.
 * Called by the stopGame() method in the World class.
 */
function showIntroScreen() {
    document.getElementById('introOverlay').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('winOverlay').style.display = 'none';
}

// ===============================
// 5. Event Listener Setup
// ===============================
/**
 * Sets up all event listeners based on the buttonEventMap.
 */
function setupEventListeners() {
    for (const id in buttonEventMap) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', buttonEventMap[id]);
        }
    }
}

// ===============================
// 6. Fullscreen Handling
// ===============================
/**
 * Handles changes to fullscreen status: adjusts canvas size and updates button.
 * Adapts canvas to screen size, restores original size, redraws game for new resolution.
 */
function handleFullscreenChange(canvas, button, originalWidth, originalHeight, world) {
    updateFullscreenButton(button);
    if (!world) {
        console.error("World object is not available to handle resize!");
        return;
    }

    if (document.fullscreenElement || document.webkitFullscreenElement) {
        world.resize(window.screen.width, window.screen.height);
    } else {
        world.resize(originalWidth, originalHeight);
    }

    if (typeof world !== 'undefined' && world && typeof world.draw === 'function') {
        world.draw();
    }
}

/**
 * Toggles fullscreen mode for the canvas element.
 */
function toggleFullscreen(elementToFullscreen) {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        enterFullscreen(elementToFullscreen);
    } else {
        exitFullscreen();
    }
}

/**
 * Updates the icon of the fullscreen button based on the current status.
 */
function updateFullscreenButton(buttonElement) {
    if (!buttonElement) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        buttonElement.src = 'images/bg/button/exitFullscreen.png';
        buttonElement.alt = 'Exit Fullscreen';
    } else {
        buttonElement.src = 'images/bg/button/fullscreen.png';
        buttonElement.alt = 'Fullscreen';
    }
}

/**
 * Enables fullscreen mode for an element (cross-browser).
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {  // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {  // Chrome, Safari & Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {  // IE/Edge
        element.msRequestFullscreen();
    }
}

/**
 * Disables fullscreen mode (cross-browser).
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// ===============================
// 7. Utility & Debug Functions
// ===============================
/**
 * Key press event listener for debugging purposes.
 */
window.addEventListener('keydown', (event) => {
    const keyName = event.key;
    const keyCode = event.keyCode;
    const code = event.code;
    console.log(`Key: ${keyName}, keyCode: ${keyCode}, Code: ${code}`);
});

// ===============================
// DOMContentLoaded Event
// ===============================
window.addEventListener('DOMContentLoaded', () => {
    setupInitialUI();
    setupEventListeners();

    const gameContainer = document.getElementById('gameContainer');
    const canvas = document.getElementById('canvas');
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (!canvas) return;
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    // Initialisiere World und InputHandler
    window.world = new World(canvas, showIntroScreen);
    window.inputHandler = new InputHandler(window.world);

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', () => toggleFullscreen(gameContainer));
    }

    const onFullscreenChange = () => handleFullscreenChange(canvas, fullscreenButton, originalWidth, originalHeight, world);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange); // For Chrome, Safari, Opera
});