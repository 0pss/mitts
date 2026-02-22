// State Management
const STATE_KEY = 'lappen_progress';

class GameState {
    constructor() {
        this.load();
    }

    load() {
        const saved = localStorage.getItem(STATE_KEY);
        if (saved) {
            Object.assign(this, JSON.parse(saved));
        } else {
            this.reset();
        }
    }

    save() {
        localStorage.setItem(STATE_KEY, JSON.stringify(this));
    }

    reset() {
        this.currentIndex = 0;
        this.team = null;
        this.quizCompleted = false;
        this.quizScore = 0;
        this.gameHighScore = 0;
        this.rainbowUnlocked = false;
        this.hasScanned = false;
        this.save();
    }
}

const gameState = new GameState();

// Story Data
const story = [
    {
        text: "Hey! Ja genau, DU! Schön, dass du mich endlich mal ordentlich gescannt hast. Ich bin ein Topflappen. Aber nicht irgendein Topflappen...",
        emotion: "neutral",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Ich bin ein AKTIVISTISCHER Topflappen! Und weißt du was? Die Welt geht vor die Hunde. Oder besser gesagt, vor die Würste.",
        emotion: "angry",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Aber bevor wir uns dem revolutionären Kampf widmen, muss ich wissen: Bist du Team Schnitzel oder Team Gemüse?",
        emotion: "neutral",
        bg: "kitchen",
        choices: [
            { text: "Team Schnitzel 🥩", value: "schnitzel", next: 3 },
            { text: "Team Gemüse 🥦", value: "gemüse", next: 5 }
        ]
    },
    // Schnitzel-Path
    {
        text: "Schnitzel, eh? Na toll. Weißt du eigentlich, wie viel Wasser für 1 Kilo Rindfleisch draufgeht? Nein? Dann wird's Zeit für eine kleine Bildungspause!",
        emotion: "shocked",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Aber gut, wir können trotzdem zusammenarbeiten. Auch Fleischesser können die Welt retten. Theoretisch. Bereit für ein Quiz?",
        emotion: "neutral",
        bg: "kitchen",
        action: "quiz",
        nextAfterQuiz: 7
    },
    // Gemüse-Path
    {
        text: "Ah, ein Gemüse-Mensch! Endlich jemand mit Geschmack. Und Gewissen. Aber keine Sorge, ich werde nicht allzu selbstgefällig sein.",
        emotion: "happy",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Trotzdem sollten wir mal testen, ob du wirklich Ahnung hast von Lebensmittelverschwendung und so. Quiz-Time!",
        emotion: "neutral",
        bg: "kitchen",
        action: "quiz",
        nextAfterQuiz: 7
    },
    // Nach dem Quiz
    {
        text: "Okay, okay. Du bist nicht völlig hoffnungslos. Aber jetzt kommt der Ernst des Lebens: Das WIDERSTANDSTRAINING!",
        emotion: "happy",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Du wirst jetzt ein Jump'n'Run spielen. Als Topflappen. Der über Würste und Polizei springt. Ja, ich weiß, klingt absurd. IST es auch.",
        emotion: "neutral",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Wenn du 10 Punkte schaffst, schenke ich dir einen REGENBOGEN-ANIME-SKIN. Weil Kapitalismus halt funktioniert. Los geht's!",
        emotion: "happy",
        bg: "kitchen",
        action: "game",
        nextAfterGame: 10
    },
    // Nach dem Spiel
    {
        text: "Verdammt, du hast es geschafft! Respekt. Hier ist dein Skin. Jetzt siehst du aus wie ein Einhorn, das durch einen Pride-Parade-Filter gegangen ist.",
        emotion: "rainbow",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Aber mal im Ernst: Lebensmittelverschwendung ist echt ein Problem. 11 Millionen Tonnen pro Jahr in Deutschland. Das ist mehr als dein Ex an emotionalem Ballast hatte.",
        emotion: "neutral",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "Und weißt du was? Jeder kann was tun. Meal Prep, richtige Lagerung, kreatives Resteverwerten. Du musst kein Superheld sein.",
        emotion: "happy",
        bg: "kitchen",
        canSwipe: true
    },
    {
        text: "So, genug geredet. Du hast jetzt die Macht, die Welt ein bisschen besser zu machen. Oder zumindest weniger scheiße. Das war's von mir. Bis zum nächsten Scan! ✌️",
        emotion: "rainbow",
        bg: "kitchen",
        canSwipe: true,
        isEnd: true
    }
];

// Quiz Data
const quizQuestions = [
    {
        question: "Was wird in Deutschland mehr weggeworfen: Lebensmittel oder Textilien?",
        options: [
            { text: "Lebensmittel (ca. 11 Mio. Tonnen/Jahr)", correct: true },
            { text: "Textilien (ca. 1,3 Mio. Tonnen/Jahr)", correct: false }
        ],
        correctResponse: "Richtig! 11 Millionen Tonnen Lebensmittel landen jährlich im Müll. Das ist so viel, dass man damit ganz Berlin unter Kartoffelbrei begraben könnte.",
        wrongResponse: "FALSCH! Es sind die Lebensmittel. 11 Millionen Tonnen pro Jahr. Das ist ungefähr so, als würde man jeden Tag einen ganzen Supermarkt in die Tonne treten."
    },
    {
        question: "Was verbraucht mehr Wasser in der Produktion?",
        options: [
            { text: "1 Tonne Rindfleisch (~15.000 Liter)", correct: true },
            { text: "1 Jeans (~8.000 Liter)", correct: false }
        ],
        correctResponse: "Korrekt! Rindfleisch ist ein absoluter Wasserfresser. Aber hey, wenigstens schmeckt es besser als Jeans. Vermutlich.",
        wrongResponse: "Nope! Das Rindfleisch gewinnt den Wasserverbrauchs-Contest. Mit 15.000 Litern pro Tonne lässt es die Jeans alt aussehen. Und nass."
    }
];

// App Controller
class LappenApp {
    constructor() {
        this.currentIndex = gameState.currentIndex || 0;
        this.isTyping = false;
        this.currentText = '';
        this.typewriterSpeed = 30;
        
        // Touch handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }

    init() {
        // Check QR scan
        const urlParams = new URLSearchParams(window.location.search);
        const hasScanned = urlParams.get('scan') === 'true';
        
        if (!hasScanned && !gameState.hasScanned) {
            this.showQRWarning();
            return;
        }
        
        gameState.hasScanned = true;
        gameState.save();
        
        this.setupTouchHandlers();
        this.loadScene(this.currentIndex);
    }

    showQRWarning() {
        const warning = document.getElementById('qr-warning');
        const angryImg = document.getElementById('angry-lappen');
        
        // Use angry emotion avatar
        angryImg.src = this.getAvatarSrc('angry');
        warning.classList.remove('hidden');
    }

    setupTouchHandlers() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            if (this.isTyping) return;
            
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const currentScene = story[this.currentIndex];
        if (!currentScene.canSwipe) return;
        
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > this.minSwipeDistance) {
            if (diff > 0) {
                // Swipe left - next
                this.nextScene();
            } else {
                // Swipe right - previous
                this.prevScene();
            }
        }
    }

    nextScene() {
        if (this.currentIndex < story.length - 1) {
            this.currentIndex++;
            gameState.currentIndex = this.currentIndex;
            gameState.save();
            this.loadScene(this.currentIndex);
        }
    }

    prevScene() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            gameState.currentIndex = this.currentIndex;
            gameState.save();
            this.loadScene(this.currentIndex);
        }
    }

    loadScene(index) {
        const scene = story[index];
        
        // Update background
        this.setBackground(scene.bg);
        
        // Update avatar
        const emotion = gameState.rainbowUnlocked && scene.emotion === 'rainbow' 
            ? 'rainbow' 
            : scene.emotion;
        this.setAvatar(emotion);
        
        // Handle special actions
        if (scene.action === 'quiz' && !gameState.quizCompleted) {
            this.showQuiz(scene.nextAfterQuiz);
            return;
        }
        
        if (scene.action === 'game' && !gameState.rainbowUnlocked) {
            this.startGame(scene.nextAfterGame);
            return;
        }
        
        // Type text
        if (scene.choices) {
            this.typeText(scene.text, () => {
                this.showChoices(scene.choices);
            });
        } else {
            this.typeText(scene.text);
        }
    }

    setBackground(bgName) {
        const bg = document.getElementById('background');
        // Simple gradient background for now
        const bgColors = {
            kitchen: 'linear-gradient(180deg, #8b4513 0%, #d2691e 50%, #f4a460 100%)'
        };
        bg.style.background = bgColors[bgName] || bgColors.kitchen;
    }

    getAvatarSrc(emotion) {
        // Using the uploaded image for different emotions
        // In production, you'd have different images for each emotion
        const avatarMap = {
            neutral: '/mnt/user-data/uploads/Gemini_Generated_Image_a18dqoa18dqoa18d.png',
            happy: '/mnt/user-data/uploads/Gemini_Generated_Image_a18dqoa18dqoa18d.png',
            angry: '/mnt/user-data/uploads/Gemini_Generated_Image_a18dqoa18dqoa18d.png',
            shocked: '/mnt/user-data/uploads/Gemini_Generated_Image_a18dqoa18dqoa18d.png',
            rainbow: '/mnt/user-data/uploads/Gemini_Generated_Image_a18dqoa18dqoa18d.png'
        };
        return avatarMap[emotion] || avatarMap.neutral;
    }

    setAvatar(emotion) {
        const avatar = document.getElementById('avatar');
        avatar.src = this.getAvatarSrc(emotion);
        avatar.classList.add('bounce');
        setTimeout(() => avatar.classList.remove('bounce'), 500);
    }

    typeText(text, callback) {
        this.isTyping = true;
        const textElement = document.getElementById('dialog-text');
        textElement.textContent = '';
        this.currentText = '';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                this.currentText += text.charAt(i);
                textElement.textContent = this.currentText;
                i++;
                setTimeout(type, this.typewriterSpeed);
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };
        
        type();
    }

    showChoices(choices) {
        const container = document.getElementById('choices-container');
        container.innerHTML = '';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => {
                gameState.team = choice.value;
                gameState.save();
                this.currentIndex = choice.next;
                gameState.currentIndex = this.currentIndex;
                gameState.save();
                container.innerHTML = '';
                this.loadScene(this.currentIndex);
            };
            container.appendChild(btn);
        });
    }

    showQuiz(nextIndex) {
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.classList.remove('hidden');
        
        let currentQuestion = 0;
        
        const showQuestion = () => {
            if (currentQuestion >= quizQuestions.length) {
                gameState.quizCompleted = true;
                gameState.save();
                quizContainer.classList.add('hidden');
                this.currentIndex = nextIndex;
                gameState.currentIndex = this.currentIndex;
                gameState.save();
                this.loadScene(nextIndex);
                return;
            }
            
            const q = quizQuestions[currentQuestion];
            document.getElementById('quiz-question').textContent = q.question;
            
            const optionsContainer = document.getElementById('quiz-options');
            optionsContainer.innerHTML = '';
            
            q.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = option.text;
                btn.onclick = () => {
                    if (option.correct) {
                        btn.classList.add('correct');
                        gameState.quizScore++;
                        gameState.save();
                        alert(q.correctResponse);
                    } else {
                        btn.classList.add('wrong');
                        alert(q.wrongResponse);
                    }
                    
                    setTimeout(() => {
                        currentQuestion++;
                        showQuestion();
                    }, 2000);
                };
                optionsContainer.appendChild(btn);
            });
        };
        
        showQuestion();
    }

    startGame(nextIndex) {
        document.getElementById('game-canvas').classList.remove('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        
        if (window.JumpGame) {
            window.JumpGame.start((score) => {
                // Game completed callback
                if (score >= 10) {
                    gameState.rainbowUnlocked = true;
                    gameState.gameHighScore = Math.max(gameState.gameHighScore, score);
                    gameState.save();
                }
                
                document.getElementById('game-canvas').classList.add('hidden');
                document.getElementById('game-ui').classList.add('hidden');
                
                this.currentIndex = nextIndex;
                gameState.currentIndex = this.currentIndex;
                gameState.save();
                this.loadScene(nextIndex);
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LappenApp();
});
