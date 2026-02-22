class StoryEngine {
    constructor() {
        this.scenes = [];
        
        // 1. DIALOG-STATE: Wo in der Geschichte sind wir?
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        
        // 2. SCAN-STATE: Wie oft wurde der QR-Code (die Seite) aufgerufen?
        let totalScans = parseInt(localStorage.getItem('lappen_scans')) || 0;
        
        // Wir zählen diesen Aufruf als neuen Scan.
        // Der sessionStorage Trick verhindert, dass ein versehentlicher Reload 
        // direkt als neuer Scan zählt (man muss den Tab schließen/neu scannen).
        if (!sessionStorage.getItem('scanned_in_this_session')) {
            totalScans++;
            localStorage.setItem('lappen_scans', totalScans);
            sessionStorage.setItem('scanned_in_this_session', 'true');
        }
        this.currentScanLevel = totalScans;
        
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isTyping = false;
        
        this.init();
    }

    async init() {
        await this.loadStory();
        this.setupListeners();
        
        // Failsafe: Falls die JSON-Datei mal gekürzt wird
        if (this.currentIndex >= this.scenes.length) {
            this.currentIndex = this.scenes.length - 1;
        }
        
        // Beim Laden prüfen, ob wir die aktuelle Szene überhaupt sehen dürfen
        const currentScene = this.scenes[this.currentIndex];
        const requiredLevel = currentScene.requiredScan || 1;
        
        if (requiredLevel > this.currentScanLevel) {
            this.showLockMessage(requiredLevel);
        } else {
            this.showScene(this.currentIndex);
        }
    }

    async loadStory() {
        try {
            const response = await fetch('story.json');
            this.scenes = await response.json();
            document.getElementById('total').textContent = this.scenes.length;
        } catch (error) {
            console.error('Error loading story:', error);
            this.scenes = [{
                avatar: 'neutral',
                text: 'Fehler beim Laden der Story. Bitte lade die Seite neu.',
                requiredScan: 1
            }];
        }
    }

    setupListeners() {
        document.addEventListener('click', () => this.next());
        
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                this.next();
            } else if (e.key === 'ArrowLeft') {
                this.previous();
            }
        });
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const minSwipeDistance = 50;
        
        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                this.next();
            } else {
                this.previous();
            }
        }
    }

    next() {
        if (this.isTyping) return; // Warten, bis Text fertig ist

        const nextIndex = this.currentIndex + 1;
        
        if (nextIndex < this.scenes.length) {
            const nextScene = this.scenes[nextIndex];
            const requiredLevel = nextScene.requiredScan || 1;
            
            // Wenn die nächste Szene mehr Scans braucht, als wir haben:
            if (requiredLevel > this.currentScanLevel) {
                this.showLockMessage(requiredLevel);
                // WICHTIG: currentIndex wird NICHT erhöht! Man bleibt stecken.
                return;
            }
            
            // Alles okay, wir dürfen weiter
            this.currentIndex = nextIndex;
            localStorage.setItem('lappen_progress', this.currentIndex);
            this.showScene(this.currentIndex);
        }
    }

    previous() {
        if (this.isTyping) return;

        if (this.currentIndex > 0) {
            this.currentIndex--;
            localStorage.setItem('lappen_progress', this.currentIndex);
            
            // Wenn man zurückgeht, ignorieren wir den Lockscreen, weil
            // man vergangene Szenen logischerweise schon freigeschaltet hat.
            this.showScene(this.currentIndex);
        }
    }

    showLockMessage(requiredLevel) {
        const avatar = document.getElementById('avatar');
        avatar.src = 'assets/angry.svg'; 
        avatar.classList.add('pulse');
        setTimeout(() => avatar.classList.remove('pulse'), 500);
        
        const lockText = `HALT! Systemblockade! Du musst den Topflappen erst erneut scannen, um fortzufahren. (Benötigt Scan #${requiredLevel} / Du hast ${this.currentScanLevel})`;
        
        // Wir zeigen den Lock-Text, aber überschreiben nicht den currentIndex
        this.typeText(lockText);
    }

    showScene(index) {
        const scene = this.scenes[index];
        
        const avatar = document.getElementById('avatar');
        avatar.src = `assets/${scene.avatar}.svg`;
        avatar.classList.add('pulse');
        setTimeout(() => avatar.classList.remove('pulse'), 500);
        
        this.typeText(scene.text);
        
        document.getElementById('current').textContent = index + 1;
    }

    typeText(text) {
        this.isTyping = true;
        const textElement = document.getElementById('story-text');
        textElement.textContent = '';
        
        let i = 0;
        const speed = 30;
        
        const type = () => {
            if (i < text.length) {
                textElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                this.isTyping = false;
            }
        };
        
        type();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StoryEngine();
});