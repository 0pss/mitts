class StoryEngine {
    constructor() {
        this.scenes = [];
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        
        // Scan-Logik bleibt für die Bedingungsprüfung erhalten
        let scans = parseInt(localStorage.getItem('lappen_scans')) || 0;
        if (!sessionStorage.getItem('scanned_session')) {
            scans++;
            localStorage.setItem('lappen_scans', scans);
            sessionStorage.setItem('scanned_session', 'true');
        }
        this.currentScanLevel = scans;
        this.isTyping = false;
        this.init();
    }

    async init() {
        const res = await fetch('story.json');
        this.scenes = await res.json();
        this.setupListeners();
        this.showScene(this.currentIndex);
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            if (this.isTyping || document.getElementById('option-container')) return;
            this.next();
        });
    }

    // Zeigt nur die Anzahl der verfügbaren Szenen im aktuellen Scan-Level
    getDynamicTotal() {
        return this.scenes.filter(s => (s.requiredScan || 1) <= this.currentScanLevel).length;
    }

    next() {
        const current = this.scenes[this.currentIndex];
        let nextIdx = current.targetId ? this.scenes.findIndex(s => s.id === current.targetId) : this.currentIndex + 1;

        if (nextIdx !== -1 && nextIdx < this.scenes.length) {
            const nextS = this.scenes[nextIdx];
            
            // Wenn der Scan-Level nicht reicht, passiert einfach nichts.
            // Der User bleibt auf der aktuellen Szene (deinem Custom Lockscreen) stehen.
            if ((nextS.requiredScan || 1) > this.currentScanLevel) {
                console.log("Scan erforderlich für nächste Szene");
                return; 
            }

            this.currentIndex = nextIdx;
            localStorage.setItem('lappen_progress', this.currentIndex);
            this.showScene(this.currentIndex);
        }
    }

    showScene(idx) {
        const scene = this.scenes[idx];
        document.getElementById('avatar').src = `assets/${scene.avatar}.svg`;
        
        this.typeText(scene.text, () => {
            if (scene.options) this.renderButtons(scene.options, 'choice');
            else if (scene.quiz) this.renderButtons(scene.quiz.options, 'quiz', scene.quiz);
            
            if (scene.isEnd) this.showResetButton();
        });

        const total = this.getDynamicTotal();
        document.getElementById('current').textContent = idx + 1;
        document.getElementById('total').textContent = total;
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
                    if (o.val === quizData.correct) this.goToId(quizData.targetId);
                    else this.typeText(quizData.failText, () => this.renderButtons(opts, type, quizData));
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
        btn.textContent = "🔄 Reset & Scan-History löschen";
        btn.onclick = () => { localStorage.clear(); sessionStorage.clear(); window.location.reload(); };
        container.appendChild(btn);
        document.getElementById('story-text').appendChild(container);
    }

    goToId(id) {
        const idx = this.scenes.findIndex(s => s.id === id);
        if (idx !== -1) {
            // Prüfung auch hier: Wenn Ziel-Szene gesperrt, bewege dich nicht.
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
            if (i < text.length) { el.textContent += text[i++]; }
            else { clearInterval(t); this.isTyping = false; if (cb) cb(); }
        }, 25);
    }
}
document.addEventListener('DOMContentLoaded', () => new StoryEngine());