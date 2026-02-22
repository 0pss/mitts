class StoryEngine {
    constructor() {
        this.scenes = [];
        
        // LocalStorage laden. Startet bei 0, falls nichts gespeichert ist.
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        
        // Liest "?scan=2" etc. aus der URL. Standardwert ist 1, damit die Seite auch ohne Parameter funktioniert.
        const urlParams = new URLSearchParams(window.location.search);
        this.currentScanLevel = parseInt(urlParams.get('scan')) || 1;
        
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isTyping = false; // Verhindert wirres Skippen während des Tippens
        
        this.init();
    }

    async init() {
        await this.loadStory();
        this.setupListeners();
        
        // Failsafe: Falls die JSON-Datei gekürzt wurde
        if (this.currentIndex >= this.scenes.length) {
            this.currentIndex = this.scenes.length - 1;
        }
        
        this.showScene(this.currentIndex);
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
        if (this.isTyping) return; // Warten, bis Text fertig getippt ist

        const nextIndex = this.currentIndex + 1;
        
        if (nextIndex < this.scenes.length) {
            const nextScene = this.scenes[nextIndex];
            const requiredLevel = nextScene.requiredScan || 1;
            
            // Wenn die nächste Szene ein höheres Scan-Level braucht, zeige Warnung an und brich ab
            if (requiredLevel > this.currentScanLevel) {
                this.showLockMessage(requiredLevel);
                return;
            }
            
            // Ansonsten: Weitergehen und Fortschritt speichern
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
            this.showScene(this.currentIndex);
        }
    }

    showLockMessage(requiredLevel) {
        const avatar = document.getElementById('avatar');
        avatar.src = 'assets/angry.svg'; // Der Lappen wird sauer, wenn du schummelst
        avatar.classList.add('pulse');
        setTimeout(() => avatar.classList.remove('pulse'), 500);
        
        const lockText = `HALT! Systemblockade! Du musst den Topflappen erst erneut scannen, um diese geheimen Daten zu sehen. (Benötigt Scan #${requiredLevel})`;
        this.typeText(lockText);
    }

    showScene(index) {
        const scene = this.scenes[index];
        
        // Update Avatar
        const avatar = document.getElementById('avatar');
        avatar.src = `assets/${scene.avatar}.svg`;
        avatar.classList.add('pulse');
        setTimeout(() => avatar.classList.remove('pulse'), 500);
        
        // Update Text
        this.typeText(scene.text);
        
        // Update Counter
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