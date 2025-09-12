/**
 * Class for handling input (keyboard and touch).
 */
class InputHandler {
    world;

    /**
     * Initializes the InputHandler with the world.
     * @param {*} world 
     */
    constructor(world) {
        this.world = world;
        this.bindEvents();
    }

    /**
     * Called in the constructor.
     * Binds all necessary events.
     */
    bindEvents() {
        this.bindKeyboardEvents();
        this.initButtonControls();
    }

    /**
     * Binds keyboard events for game control.
     * Called in bindEvents().
     */
    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            this.world.keyboard[e.key] = true;
            this.bindKeyboardEventSpace(e);
            this.bindKeyboardEventEnter(e);
            this.bindKeyboardEventEscape(e);
        });

        window.addEventListener('keyup', (e) => {
            this.world.keyboard[e.key] = false;
        });
    }

    /**
     * Called in bindKeyboardEvents().
     * Binds the spacebar for pause control.
     * @param {*} e
     */
    bindKeyboardEventSpace(e) {
        if (e.key === ' ') e.preventDefault();
        if (e.key === ' ') {
            this.world.isPaused ? this.world.resumeGame() : this.world.pauseGame();
        }
    }

    /**
     * Called in bindKeyboardEvents().
     * Binds the Enter key to start the game from the intro overlay.
     * @param {*} e
     */
    bindKeyboardEventEnter(e) {
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === 'Enter') {
            const introOverlay = document.getElementById('introOverlay');
            if (introOverlay && introOverlay.style.display !== 'none') {   
                initGame();
            }
        }
    }

    /**
     * Called in bindKeyboardEvents().
     * Binds the Escape key to stop the game.
     * @param {*} e 
     */
    bindKeyboardEventEscape(e) {
        if (e.key === 'Escape') {
            this.world.stopGame();
        }
    }

    /**
     * Called in bindEvents().
     * Initializes button controls for touch devices.
     * Binds buttons to the corresponding actions.
     */ 
    initButtonControls() {
        const controlButtonMap = {
            'leftButton': 'TOUCH_LEFT',
            'rightButton': 'TOUCH_RIGHT',
            'upButton': 'TOUCH_JUMP',
            'wurfButton': 'TOUCH_THROW',
            'buyButton': 'TOUCH_BUY'
        };
        Object.entries(controlButtonMap).forEach(([buttonId, actionKey]) => {
            this.bindPressAndHoldEvents(buttonId, actionKey);
        });

        this.bindButtonClick('pauseButton', () => this.world.pauseGame());
        this.bindButtonClick('playButton', () => this.world.resumeGame());
        this.bindButtonClick('stopButton', () => this.world.stopGame());
        this.bindButtonClick('audioOnOffButton', () => this.world.audioManager.toggleMute());
    }

    /**
     * Called in initButtonControls().
     * Binds a click event listener to a button.
     * @param {*} buttonId 
     * @param {*} handler 
     */
    bindButtonClick(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (button) button.addEventListener('click', handler);
    }

    /**
     * Called in initButtonControls().
     * Binds press-and-hold events for a button.
     * @param {*} buttonId 
     * @param {*} actionKey 
     */
    bindPressAndHoldEvents(buttonId, actionKey) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const setActionState = (isPressed) => (event) => {
            event.preventDefault();
            this.world.keyboard[actionKey] = isPressed;
        };

        button.addEventListener('mousedown', setActionState(true));
        button.addEventListener('touchstart', setActionState(true), { passive: false });
        button.addEventListener('mouseup', setActionState(false));
        button.addEventListener('mouseleave', setActionState(false));
        button.addEventListener('touchend', setActionState(false), { passive: false });
    }
}