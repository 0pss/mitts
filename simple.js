// Simple Story Engine
class StoryEngine {
    constructor() {
        this.scenes = [];
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        this.currentScanCount = parseInt(new URLSearchParams(window.location.search).get('scan')) || 1;
        
        this.init();
    }
    async init() {
        // Load story data
        await this.loadStory();
        
        // Setup event listeners
        this.setupListeners();
        
        // Show first scene
        this.showScene(0);
    }

    async loadStory() {
        try {
            const response = await fetch('story.json');
            this.scenes = await response.json();
            
            // Update total count
            document.getElementById('total').textContent = this.scenes.length;
        } catch (error) {
            console.error('Error loading story:', error);
            this.scenes = [{
                avatar: 'neutral',
                text: 'Fehler beim Laden der Story. Bitte lade die Seite neu.'
            }];
        }
    }

    setupListeners() {
        // Click navigation
        document.addEventListener('click', () => this.next());
        
        // Touch/Swipe navigation
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Keyboard navigation
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

    next() 
    {
        const currentScene = this.scenes[this.currentIndex];
        
        // Checkpoint-Logik: Braucht diese Szene einen höheren Scan-Count als wir haben?
        if (currentScene.unlocksAtScan > this.currentScanCount) {
            this.showLockScreen();
            return;
        }

        if (this.currentIndex < this.scenes.length - 1) {
            this.currentIndex++;
            localStorage.setItem('lappen_progress', this.currentIndex);
            this.showScene(this.currentIndex);
        }
    }

    showLockScreen() {
        const textElement = document.getElementById('story-text');
        textElement.innerHTML = "<span style='color: #ff4757;'>STOPP!</span> Scanne den QR-Code erneut, um fortzufahren!";
        // Hier könnte man auch den Avatar auf 'angry' setzen
        document.getElementById('avatar').src = `assets/angry.svg`;
    }

    showScene(index) {
        const scene = this.scenes[index];
        
        // Automatische Scan-Sperre prüfen beim Laden einer Szene
        if (scene.unlocksAtScan > this.currentScanCount) {
            this.showLockScreen();
            return;
        }

        const avatar = document.getElementById('avatar');
        avatar.src = `assets/${scene.avatar}.svg`;
        this.typeText(scene.text);
        document.getElementById('current').textContent = index + 1;
    }


    previous() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showScene(this.currentIndex);
        }
    }

    typeText(text) {
        const textElement = document.getElementById('story-text');
        textElement.textContent = '';
        
        let i = 0;
        const speed = 30;
        
        const type = () => {
            if (i < text.length) {
                textElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
}

// Start the engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new StoryEngine();
});
