class StoryEngine {
    constructor() {
        this.scenes = [];
        this.currentIndex = parseInt(localStorage.getItem('lappen_progress')) || 0;
        this.userTeam = localStorage.getItem('lappen_team') || null;
        
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
        this.showScene(this.currentIndex);
    }

    async loadStory() {
        const res = await fetch('story.json');
        this.scenes = await res.json();
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && !this.isTyping) this.next();
        });
    }

    // Berechnet wie viele Szenen bis zum nächsten Scan-Block kommen
    getDynamicTotal() {
        let count = 0;
        for (let i = 0; i < this.scenes.length; i++) {
            if ((this.scenes[i].requiredScan || 1) > this.currentScanLevel) break;
            count++;
        }
        return count;
    }

    next() {
        if (this.isTyping) return;
        const current = this.scenes[this.currentIndex];
        if (current.options || current.quiz) return;

        let nextIdx = current.targetId ? this.scenes.findIndex(s => s.id === current.targetId) : this.currentIndex + 1;

        if (nextIdx !== -1 && nextIdx < this.scenes.length) {
            const nextS = this.scenes[nextIdx];
            if ((nextS.requiredScan || 1) > this.currentScanLevel) {
                this.showLock(nextS.requiredScan);
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
            if (scene.quiz) this.renderButtons(scene.quiz.options, 'quiz', scene.quiz);
        });

        // Fortschrittsanzeige updaten (dynamisch begrenzt)
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

    goToId(id) {
        this.currentIndex = this.scenes.findIndex(s => s.id === id);
        localStorage.setItem('lappen_progress', this.currentIndex);
        this.showScene(this.currentIndex);
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

    showLock(req) {
        this.typeText(`STOPP! Sicherheitsfreigabe erforderlich. Scanne den Lappen erneut für Level ${req}!`);
    }
}
document.addEventListener('DOMContentLoaded', () => new StoryEngine());