class AudioManager {
    sounds = {};
    isMuted = false;
    localStorageKey = 'isMuted';

    /**
     * Creates a new instance of AudioManager and loads the default sounds.
     * @constructor
     * @description The constructor of the AudioManager class initializes the sounds object and loads the predefined audio files.
     */
    constructor() {
        this.loadSound('jump', 'audio/jump.mp3');
        this.loadSound('throw', 'audio/throwing.m4a');
        this.loadSound('win', 'audio/Gewonnen.m4a');
        this.loadSound('coin', 'audio/coin-collision.mp3');
        this.loadSound('game_over', 'audio/game_over.wav'); 
        this.loadSound('background', 'audio/background_music.mp3', true, 0.2);
        this.loadMuteStatus();  
    }

    /**
     * Loads an audio file and stores it in the "sounds" object.
     * @param {string} name - The short name for the sound (e.g. 'jump')
     * @param {string} path - The path to the audio file
     * @param {boolean} loop - Should the sound loop (for music)
     * @param {number} volume - The volume (0.0 to 1.0)
     * @return {void}
     * @description This method loads an audio file from the given path and stores it in the sounds object under the given name.
     * Optionally, loop mode and volume can be set.
     */
    loadSound(name, path, loop = false, volume = 1.0) {
        const audio = new Audio(path);
        audio.loop = loop;
        audio.volume = volume;
        this.sounds[name] = audio;
    }

    /**
     * Plays a sound by its name.
     * Only plays if NOT muted.
     * Resets the sound to the beginning so it can be played again quickly.
     * @param {string} name 
     * @return {void}
     * @description This method plays the specified sound if the AudioManager is not muted.
     * If the sound exists, its playback time is reset to the beginning and the sound is played.
     * If the sound cannot be played (e.g. due to missing user interaction), a warning is logged to the console.
     */
    play(name) {
        if (!this.isMuted && this.sounds[name]) {
            //this.sounds[name].currentTime = 0;
            if (name !== 'background') {
                this.sounds[name].currentTime = 0;
            }
            this.sounds[name].play().catch(e => {
                console.warn(`Audio '${name}' konnte nicht abgespielt werden. Warte auf User-Interaktion.`);
            });
        }
    }

    /**
     * Stops a sound and resets it.
     * @param {string} name 
     * @return {void}
     * @description This method stops playback of the specified sound and resets its playback time to the beginning.
     * If the sound does not exist, this method has no effect.
     */
    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }

    /**
     * Loads the mute status from local storage.
     * If no status is saved, defaults to "not muted".
     * @param {void}
     * @returns {void}
     * @description This method reads the mute status (isMuted) from local storage under the key defined in localStorageKey.
     * If a saved value is found, it is used to set the current mute status.
     * If no saved value is present, the mute status is set to false (not muted).
     */
    loadMuteStatus() {
        const storedMuteStatus = localStorage.getItem(this.localStorageKey);
        if (storedMuteStatus !== null) {
            this.setMuteStatus(JSON.parse(storedMuteStatus));
        } else {
            this.setMuteStatus(false);
        }
    }

    /**
    * Saves the mute status to local storage.
    * @param {void}
    * @returns {void}
    * @description This method saves the current mute status (isMuted) to local storage under the key defined in localStorageKey.
    */
    saveMuteStatus() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.isMuted));
    }

    /**
    * Sets the mute status and updates the UI and sound playback.
    * @param {boolean} muted - true to mute, false otherwise.
    * @return {void}
    * @description This method sets the mute status (isMuted) based on the passed parameter.
    * If the status is set to muted, all currently playing sounds are paused and the speaker icon in the UI is updated.
    * If the status is set to not muted, the background music is started (if available) and the speaker icon in the UI is updated accordingly.
    */
    setMuteStatus(muted) {
        this.isMuted = muted;
        const audioIcon = document.getElementById('audioIcon'); 

        if (this.isMuted) {
            // --- TON AUS ---
            for (const key in this.sounds) {
                this.sounds[key].pause(); 
            }
            if (audioIcon) {
                audioIcon.src = 'images/button/speakerOff.PNG'; 
            }
        } else {
            // --- TON AN --- gestartet
            if (this.sounds['background']) {
                this.play('background');
            }
            if (audioIcon) {
                audioIcon.src = 'images/button/speakerOn.PNG'; 
            }
        }
        this.saveMuteStatus();
    }


    /**
     * Calls setMuteStatus with the opposite value.
     * Called by a button.
     * @return {void}
     * @description This method toggles the mute status of the AudioManager.
     */
    toggleMute() {  
        this.setMuteStatus(!this.isMuted);
    }
}