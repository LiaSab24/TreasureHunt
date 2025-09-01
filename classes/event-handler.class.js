/**
 * Klasse zur Verarbeitung von Eingaben (Tastatur und Touch).
 */
class InputHandler {
    world;

    constructor(world) {
        this.world = world;
        this.bindEvents();
    }

    /**
     * Bindet alle notwendigen Events.
     */
    bindEvents() {
        this.bindKeyboardEvents();
        this.initButtonControls();
    }

    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            this.world.keyboard[e.key] = true;
            if (e.key === 'Enter') e.preventDefault();
            if (e.key === ' ') e.preventDefault();

            if (e.key.toLowerCase() === 'p' || e.key === ' ') {
                this.world.isPaused ? this.world.resumeGame() : this.world.pauseGame();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.world.keyboard[e.key] = false;
        });
    }

    initButtonControls() {
        const controlButtonMap = {
            'leftButton': 'TOUCH_LEFT',
            'rightButton': 'TOUCH_RIGHT',
            'upButton': 'TOUCH_JUMP',
            'wurfButton': 'TOUCH_THROW'
        };
        Object.entries(controlButtonMap).forEach(([buttonId, actionKey]) => {
            this.bindPressAndHoldEvents(buttonId, actionKey);
        });

        this.bindButtonClick('pauseButton', () => this.world.pauseGame());
        this.bindButtonClick('playButton', () => this.world.resumeGame());
        this.bindButtonClick('stopButton', () => this.world.stopGame());
        this.bindButtonClick('audioOnOffButton', () => this.world.audioManager.toggleMute());
    }

    bindButtonClick(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (button) button.addEventListener('click', handler);
    }

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