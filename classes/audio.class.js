class AudioManager {
    sounds = {};
    isMuted = false;

    constructor() {
        this.loadSound('jump', 'audio/jump.mp3');
        this.loadSound('throw', 'audio/throwing.m4a');
        this.loadSound('win', 'audio/Gewonnen.m4a');
        this.loadSound('coin', 'audio/coin-collision.mp3');
        this.loadSound('game_over', 'audio/game_over.wav'); 
        this.loadSound('background', 'audio/background_music.mp3', true, 0.2);  
    }

    /**
     * Lädt eine Audiodatei und speichert sie im "sounds"-Objekt
     * @param {string} name - Der Kurzname für den Sound (z.B. 'jump')
     * @param {string} path - Der Pfad zur Audiodatei
     * @param {boolean} loop - Sound soll in einer Schleife laufen (für Musik)
     * @param {number} volume - Die Lautstärke (0.0 bis 1.0)
     */
    loadSound(name, path, loop = false, volume = 1.0) {
        const audio = new Audio(path);
        audio.loop = loop;
        audio.volume = volume;
        this.sounds[name] = audio;
    }

    /**
     * spielt einen Sound anhand seines Namens ab
     * wird nur abgespielt, wenn NICHT stummgeschaltet
     * setzt den Sound vorher auf den Anfang zurück, damit er bei schnellem Aufruf erneut abgespielt werden kann
     * @param {string} name 
     */
    play(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(e => {
                console.warn(`Audio '${name}' konnte nicht abgespielt werden. Warte auf User-Interaktion.`);
            });
        }
    }

    /**
     * Stoppt einen Sound und setzt ihn zurück
     * @param {string} name 
     */
    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }

    /**
     * Schaltet alle Sounds on/off
     * aktualisiert das audioIcon
     * Stoppt die Hintergrundmusik beim Stummschalten und startet sie wieder,
     * um Browser-Probleme mit .muted zu umgehen
     */
    toggleMute() {
        this.isMuted = !this.isMuted;  
        const audioIcon = document.getElementById('audioIcon'); 
        
        if (this.isMuted) {
            // --- TON AUS ---
            for (const key in this.sounds) {
                this.sounds[key].pause(); 
            }
            if (audioIcon) {
                audioIcon.src = 'images/button/speakerOff.PNG'; 
            }
             console.log("Audio stummgeschaltet");
        } else {
            // --- TON AN ---
            for (const key in this.sounds) {
              this.play('background');
            }
            if (audioIcon) {
                audioIcon.src = 'images/button/speakerOn.PNG'; 
            }
            console.log("Audio eingeschaltet");
        }
    }
}