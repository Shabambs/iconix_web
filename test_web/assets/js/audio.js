/* ==========================================================================
   AUDIO PLAYER MODULE
   Clean background audio player with instant pause, volume slider & visualizer
   ========================================================================== */

class MusicController {
    constructor() {
        this.audio = document.getElementById('bg-music');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.playIcon = document.getElementById('play-icon');
        this.muteBtn = document.getElementById('mute-btn');
        this.volumeIcon = document.getElementById('volume-icon');
        this.volumeSlider = document.getElementById('volume-slider');
        this.trackDisplay = document.getElementById('track-title-display');
        this.visualizerBars = document.querySelectorAll('.audio-visualizer-mini .bar');
        
        this.isPlaying = false;
        this.init();
    }

    init() {
        if (!this.audio) return;

        // Set soft initial volume (20% for pleasant background sound)
        this.audio.volume = 0.2;
        if (this.volumeSlider) this.volumeSlider.value = 0.2;

        // Event Listeners
        this.playPauseBtn?.addEventListener('click', () => this.togglePlay());
        this.muteBtn?.addEventListener('click', () => this.toggleMute());
        this.volumeSlider?.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Audio state listeners
        this.audio.addEventListener('play', () => this.updateUIState(true));
        this.audio.addEventListener('pause', () => this.updateUIState(false));
    }

    startPlayback() {
        if (!this.audio) return;

        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateUIState(true);
            }).catch(err => {
                console.warn('Audio playback prevented by browser or broken URL:', err);
                this.updateUIState(false);
            });
        }
    }

    pausePlayback() {
        if (!this.audio) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updateUIState(false);
    }

    togglePlay() {
        if (!this.audio) return;

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.updateUIState(false);
        } else {
            this.startPlayback();
        }
    }

    toggleMute() {
        if (!this.audio) return;

        if (this.audio.muted) {
            this.audio.muted = false;
            this.volumeIcon.className = 'fa-solid fa-volume-high';
            this.volumeSlider.value = this.audio.volume || 0.2;
        } else {
            this.audio.muted = true;
            this.volumeIcon.className = 'fa-solid fa-volume-xmark';
            this.volumeSlider.value = 0;
        }
    }

    setVolume(val) {
        if (!this.audio) return;

        this.audio.volume = parseFloat(val);
        this.audio.muted = (val == 0);

        if (val == 0) {
            this.volumeIcon.className = 'fa-solid fa-volume-xmark';
        } else if (val < 0.5) {
            this.volumeIcon.className = 'fa-solid fa-volume-low';
        } else {
            this.volumeIcon.className = 'fa-solid fa-volume-high';
        }
    }

    changeSource(url, trackName = "Custom Track") {
        if (!url || !this.audio) return;

        // Stop current audio immediately
        this.audio.pause();
        this.isPlaying = false;

        this.audio.src = url;
        this.audio.load();
        if (this.trackDisplay) this.trackDisplay.textContent = trackName;
        
        this.startPlayback();
    }

    updateUIState(playing) {
        this.isPlaying = playing;
        if (this.playIcon) {
            this.playIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
        // Also sync the modal play/pause icon if it exists
        const modalPlayIcon = document.getElementById('modal-play-icon');
        if (modalPlayIcon) {
            modalPlayIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
        this.visualizerBars.forEach(bar => {
            bar.style.animationPlayState = playing ? 'running' : 'paused';
        });
    }
}

