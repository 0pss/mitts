class StoryEngine {
    constructor() {
        this.scenes = [];
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        
        // Scan-Logik
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
        await this.loadStory();
        this.setupListeners();
        
        // Prüfung direkt beim Start: Darf der User überhaupt hier sein?
        const scene = this.scenes[this.currentIndex];
        if (scene && (scene.requiredScan || 1) > this.currentScanLevel) {
            this.showLock(scene.requiredScan);
        } else {
            this.showScene(this.currentIndex);
        }
    }

    async loadStory() {
        const res = await fetch('story.json');
        this.scenes = await res.json();
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            // Ignoriere Klicks, wenn gerade getippt wird oder Buttons da sind
            if (this.isTyping || document.getElementById('option-container')) return;
            this.next();
        });
    }

    getDynamicTotal() {
        let count = 0;
        // Wir zählen ab der aktuellen Position, wie viele Szenen im aktuellen Pfad liegen
        // Dies ist eine Vereinfachung; in komplexen RPGs würde man den Pfad simulieren.
        for (let i = 0; i < this.scenes.length; i++) {
            if ((this.scenes[i].requiredScan || 1) > this.currentScanLevel) break;
            count++;
        }
        return count;
    }

    next() {
        const current = this.scenes[this.currentIndex];
        
        // 1. Check: Sind wir am Ende?
        let nextIdx;
        if (current.targetId) {
            nextIdx = this.scenes.findIndex(s => s.id === current.targetId);
        } else {
            nextIdx = this.currentIndex + 1;
        }

        if (nextIdx !== -1 && nextIdx < this.scenes.length) {
            const nextS = this.scenes[nextIdx];
            
            // 2. KRITISCHER CHECK: Braucht die nächste Szene einen Scan?
            if ((nextS.requiredScan || 1) > this.currentScanLevel) {
                this.showLock(nextS.requiredScan);
                return; // Abbruch! Index wird nicht erhöht.
            }

            this.currentIndex = nextIdx;
            localStorage.setItem('lappen_progress', this.currentIndex);
            this.showScene(this.currentIndex);
        }
    }

    showScene(idx) {
        const scene = this.scenes[idx];
        const avatar = document.getElementById('avatar');
        avatar.src = `assets/${scene.avatar}.svg`;
        avatar.classList.add('pulse');
        setTimeout(() => avatar.classList.remove('pulse'), 500);
        
        this.typeText(scene.text, () => {
            if (scene.options) this.renderButtons(scene.options, 'choice');
            else if (scene.quiz) this.renderButtons(scene.quiz.options, 'quiz', scene.quiz);
            
            // Wenn es die absolut letzte Szene im JSON ist, zeige Reset-Button
            if (idx === this.scenes.length - 1 || scene.isEnd) {
                this.showResetButton();
            }
        });

        const total = this.getDynamicTotal();
        document.getElementById('current').textContent = Math.min(idx + 1, total);
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
        btn.textContent = "🔄 Nochmal spielen";
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
            // Auch hier: Erst Scan-Check!
            if ((this.scenes[idx].requiredScan || 1) > this.currentScanLevel) {
                this.showLock(this.scenes[idx].requiredScan);
                return;
            }
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
        const speed = 25;
        const t = setInterval(() => {
            if (i < text.length) { el.textContent += text[i++]; }
            else { clearInterval(t); this.isTyping = false; if (cb) cb(); }
        }, speed);
    }

    showLock(req) {
        const avatar = document.getElementById('avatar');
        avatar.src = 'assets/angry.svg';
        this.typeText(`HALT! Sicherheitsfreigabe erforderlich. Du hast Scan-Level ${this.currentScanLevel}, brauchst aber Level ${req}. Scanne den Lappen erneut!`);
        // Wir verstecken den Fortschrittsbalken bei Blockade
        document.getElementById('progress').style.opacity = '0.3';
    }
}

document.addEventListener('DOMContentLoaded', () => new StoryEngine());