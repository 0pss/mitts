class StoryEngine {
    constructor() {
        this.scenes = [];
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        
        // Scan-Logik
        let scans = parseInt(localStorage.getItem('lappen_scans')) || 0;
        this.justScanned = false;

        // Prüfen ob neue Session (QR Scan simuliert)
        if (!sessionStorage.getItem('scanned_session')) {
            scans++;
            localStorage.setItem('lappen_scans', scans);
            sessionStorage.setItem('scanned_session', 'true');
            this.justScanned = true; 
        }
        this.currentScanLevel = scans;
        this.isTyping = false;
        
        this.init();
    }

    async init() {
        // Hier lag der Fehler: Wir rufen loadStory auf, um this.scenes zu füllen
        await this.loadStory();
        
        this.setupListeners();

        // AUTO-ADVANCE: Wenn wir gerade neu gescannt haben
        if (this.justScanned) {
            const currentScene = this.scenes[this.currentIndex];
            if (currentScene) {
                let nextIdx = currentScene.targetId ? 
                    this.scenes.findIndex(s => s.id === currentScene.targetId) : 
                    this.currentIndex + 1;
                
                if (nextIdx !== -1 && nextIdx < this.scenes.length) {
                    // Wenn die NÄCHSTE Szene jetzt freigeschaltet ist, springe sofort dorthin
                    if ((this.scenes[nextIdx].requiredScan || 1) <= this.currentScanLevel) {
                        this.currentIndex = nextIdx;
                        localStorage.setItem('lappen_progress', this.currentIndex);
                    }
                }
            }
        }

        this.showScene(this.currentIndex);
    }

    async loadStory() {
        try {
            const res = await fetch('story.json');
            this.scenes = await res.json();
        } catch (e) {
            console.error("Story konnte nicht geladen werden", e);
        }
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            // Nur weiter wenn kein Tippen und keine Buttons da sind
            if (this.isTyping || document.getElementById('option-container')) return;
            this.next();
        });
    }

    // Zählt nur Szenen, die zum aktuellen Scan-Level gehören (bis zum nächsten Lock)
    getDynamicTotal() {
        let count = 0;
        for (let i = 0; i < this.scenes.length; i++) {
            if ((this.scenes[i].requiredScan || 1) <= this.currentScanLevel) {
                count++;
            } else {
                break; // Stoppe beim ersten Lock
            }
        }
        return count;
    }

    next() {
        if (this.isTyping) return;
        
        const current = this.scenes[this.currentIndex];
        let nextIdx = current.targetId ? 
            this.scenes.findIndex(s => s.id === current.targetId) : 
            this.currentIndex + 1;

        if (nextIdx !== -1 && nextIdx < this.scenes.length) {
            const nextS = this.scenes[nextIdx];
            
            // Harter Check: Wenn die nächste Szene ein höheres Level braucht, stopp.
            if ((nextS.requiredScan || 1) > this.currentScanLevel) {
                return; 
            }

            this.currentIndex = nextIdx;
            localStorage.setItem('lappen_progress', this.currentIndex);
            this.showScene(this.currentIndex);
        }
    }

    showScene(idx) {
        const scene = this.scenes[idx];
        if (!scene) return;

        const avatar = document.getElementById('avatar');
        avatar.src = `assets/${scene.avatar}.svg`;
        avatar.classList.add('pulse');
        setTimeout(() => avatar.classList.remove('pulse'), 500);
        
        this.typeText(scene.text, () => {
            if (scene.options) this.renderButtons(scene.options, 'choice');
            else if (scene.quiz) this.renderButtons(scene.quiz.options, 'quiz', scene.quiz);
            
            if (scene.isEnd) this.showResetButton();
        });

        // Fortschrittsanzeige: Zeige absolute Position vs. aktuell sichtbares Total
        const totalVisible = this.getDynamicTotal();
        document.getElementById('current').textContent = idx + 1;
        document.getElementById('total').textContent = totalVisible;
    }

    renderButtons(opts, type, quizData = null) {
        const container = document.createElement('div');
        container.id = "option-container";
        opts.forEach(o => {
            const b = document.createElement('button');
            b.className = "choice-btn";
            b.textContent = o.text;
            b.onclick = (e) => {
                e.stopPropagation();
                if (type === 'choice') {
                    localStorage.setItem('lappen_team', o.choice);
                    this.goToId(o.targetId);
                } else {
                    if (o.val === quizData.correct) {
                        this.goToId(quizData.targetId);
                    } else {
                        this.typeText(quizData.failText, () => this.renderButtons(opts, type, quizData));
                    }
                }
            };
            container.appendChild(b);
        });
        document.getElementById('story-text').appendChild(container);
    }

    showResetButton() {
        const container = document.createElement('div');
        container.id = "option-container";
        const btn = document.createElement('button');
        btn.className = "choice-btn reset-btn";
        btn.textContent = "🔄 Nochmal von vorn";
        btn.onclick = () => { 
            localStorage.clear(); 
            sessionStorage.clear(); 
            window.location.reload(); 
        };
        container.appendChild(btn);
        document.getElementById('story-text').appendChild(container);
    }

    goToId(id) {
        const idx = this.scenes.findIndex(s => s.id === id);
        if (idx !== -1) {
            if ((this.scenes[idx].requiredScan || 1) > this.currentScanLevel) return;
            this.currentIndex = idx;
            localStorage.setItem('lappen_progress', this.currentIndex);
            this.showScene(this.currentIndex);
        }
    }

    typeText(text, cb) {
        this.isTyping = true;
        const el = document.getElementById('story-text');
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            if (i < text.length) { 
                el.textContent += text[i++]; 
            } else { 
                clearInterval(t); 
                this.isTyping = false; 
                if (cb) cb(); 
            }
        }, 25);
    }
}

document.addEventListener('DOMContentLoaded', () => new StoryEngine());