class StoryEngine {
    constructor() {
        this.scenes = [];
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        this.userTeam = localStorage.getItem('lappen_team') || null;
        
        // Scan-Logik
        let totalScans = parseInt(localStorage.getItem('lappen_scans')) || 0;
        if (!sessionStorage.getItem('scanned_in_this_session')) {
            totalScans++;
            localStorage.setItem('lappen_scans', totalScans);
            sessionStorage.setItem('scanned_in_this_session', 'true');
        }
        this.currentScanLevel = totalScans;
        
        this.isTyping = false;
        this.init();
    }

    async init() {
        await this.loadStory();
        this.setupListeners();
        this.showScene(this.currentIndex);
    }

    async loadStory() {
        const response = await fetch('story.json');
        this.scenes = await response.json();
        document.getElementById('total').textContent = this.scenes.length;
    }

    setupListeners() {
        // Klick auf den Screen geht nur weiter, wenn KEINE Optionen da sind
        document.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') this.next();
        });
    }

    next() {
        if (this.isTyping) return;
        const currentScene = this.scenes[this.currentIndex];

        // Wenn Optionen da sind, MUSS eine gewählt werden
        if (currentScene.options) return;

        let nextIndex;
        if (currentScene.nextSceneTag) {
            // Springe zur Szene mit der entsprechenden ID
            nextIndex = this.scenes.findIndex(s => s.id === currentScene.nextSceneTag);
        } else {
            nextIndex = this.currentIndex + 1;
        }

        if (nextIndex !== -1 && nextIndex < this.scenes.length) {
            const nextScene = this.scenes[nextIndex];
            if ((nextScene.requiredScan || 1) > this.currentScanLevel) {
                this.showLockMessage(nextScene.requiredScan);
                return;
            }
            this.currentIndex = nextIndex;
            localStorage.setItem('lappen_progress', this.currentIndex);
            this.showScene(this.currentIndex);
        }
    }

    makeChoice(choice, nextTag) {
        localStorage.setItem('lappen_team', choice);
        this.userTeam = choice;
        
        // Finde die nächste Szene basierend auf dem Tag der Wahl
        this.currentIndex = this.scenes.findIndex(s => s.id === nextTag);
        localStorage.setItem('lappen_progress', this.currentIndex);
        this.showScene(this.currentIndex);
    }

    showScene(index) {
        const scene = this.scenes[index];
        const avatar = document.getElementById('avatar');
        avatar.src = `assets/${scene.avatar}.svg`;
        
        this.typeText(scene.text, () => {
            // Wenn der Text fertig ist, zeige Optionen falls vorhanden
            if (scene.options) {
                this.showOptions(scene.options);
            }
        });
        
        document.getElementById('current').textContent = index + 1;
    }

    showOptions(options) {
        const textElement = document.getElementById('story-text');
        const optContainer = document.createElement('div');
        optContainer.id = "option-container";
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "choice-btn";
            btn.textContent = opt.text;
            btn.onclick = (e) => {
                e.stopPropagation();
                this.makeChoice(opt.choice, opt.nextSceneTag);
            };
            optContainer.appendChild(btn);
        });
        textElement.appendChild(optContainer);
    }

    typeText(text, callback) {
        this.isTyping = true;
        const textElement = document.getElementById('story-text');
        textElement.textContent = '';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                textElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, 25);
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };
        type();
    }

    showLockMessage(req) {
        this.typeText(`STOPP! Du hast erst ${this.currentScanLevel} Scans. Scanne den Lappen erneut für Level ${req}!`);
    }
}

document.addEventListener('DOMContentLoaded', () => new StoryEngine());