# 🚀 Setup-Guide: Die Lappen-Chroniken

## Quick Start (5 Minuten)

### 1. Dateien vorbereiten

Alle Dateien sind bereit. Du brauchst nur noch:
- Einen Webserver (lokal oder online)
- Optional: Eigene SVG-Avatars für verschiedene Emotionen

### 2. Lokaler Test

**Option A: VS Code Live Server** (empfohlen)
```
1. Öffne den Projektordner in VS Code
2. Installiere die Extension "Live Server"
3. Rechtsklick auf demo.html → "Open with Live Server"
4. Browser öffnet sich automatisch
```

**Option B: Python SimpleHTTPServer**
```bash
cd die-lappen-chroniken
python3 -m http.server 8000
# Öffne: http://localhost:8000/demo.html
```

**Option C: Node.js http-server**
```bash
npx http-server -p 8000
# Öffne: http://localhost:8000/demo.html
```

### 3. QR-Code erstellen

1. Gehe zu einem QR-Generator (z.B. qr-code-generator.com)
2. Gib deine finale URL ein: `https://deine-domain.de/index.html?scan=true`
3. Lade den QR-Code herunter
4. Drucke ihn auf deinen Topflappen!

## 📦 Deployment

### GitHub Pages (Kostenlos)

```bash
# 1. Repository erstellen
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/dein-username/lappen-chroniken.git
git push -u origin main

# 2. GitHub Pages aktivieren
# Gehe zu: Settings → Pages → Source: main branch
# Deine URL: https://dein-username.github.io/lappen-chroniken/
```

### Netlify (Kostenlos + einfach)

```bash
# 1. Auf netlify.com registrieren
# 2. "New site from Git" oder Drag & Drop Ordner
# 3. Deploy-Settings übernehmen
# 4. Fertig! Du bekommst eine URL wie: https://lappen-chroniken.netlify.app
```

### Vercel (Kostenlos + schnell)

```bash
npm i -g vercel
cd die-lappen-chroniken
vercel
# Folge den Anweisungen
```

### Eigener Server (SFTP/FTP)

```
1. Verbinde dich via FTP zu deinem Webspace
2. Lade alle Dateien in den public_html Ordner
3. Stelle sicher, dass index.html im Root liegt
4. Fertig!
```

## 🎨 Anpassungen

### Avatar-Bilder hinzufügen

Aktuell nutzt die App ein Bild für alle Emotionen. So fügst du eigene hinzu:

1. **Erstelle SVGs oder PNGs** für:
   - `lappen_neutral.svg` (Standard)
   - `lappen_happy.svg` (Fröhlich)
   - `lappen_angry.svg` (Wütend)
   - `lappen_shocked.svg` (Schockiert)
   - `lappen_rainbow.svg` (Regenbogen-Skin)

2. **Erstelle einen `assets` Ordner**:
```
/die-lappen-chroniken
  /assets
    lappen_neutral.svg
    lappen_happy.svg
    ...
```

3. **Update `js/main.js`**:
```javascript
getAvatarSrc(emotion) {
    const avatarMap = {
        neutral: 'assets/lappen_neutral.svg',
        happy: 'assets/lappen_happy.svg',
        angry: 'assets/lappen_angry.svg',
        shocked: 'assets/lappen_shocked.svg',
        rainbow: 'assets/lappen_rainbow.svg'
    };
    return avatarMap[emotion] || avatarMap.neutral;
}
```

### Hintergrund-Bilder hinzufügen

1. **Erstelle SVG-Hintergründe**:
   - `background_kitchen.svg`
   - `background_street.svg`
   - etc.

2. **Update `js/main.js`**:
```javascript
setBackground(bgName) {
    const bg = document.getElementById('background');
    bg.style.backgroundImage = `url('assets/background_${bgName}.svg')`;
}
```

3. **In der Story verwenden**:
```javascript
{
    text: "...",
    emotion: "neutral",
    bg: "kitchen",  // Lädt background_kitchen.svg
    canSwipe: true
}
```

### Story erweitern

Füge neue Szenen im `story`-Array hinzu:

```javascript
// In js/main.js
const story = [
    // ... bestehende Szenen
    {
        text: "Noch eine weitere absurde Szene!",
        emotion: "happy",
        bg: "kitchen",
        canSwipe: true
    },
    // Szene mit Choices
    {
        text: "Was willst du tun?",
        emotion: "neutral",
        bg: "kitchen",
        choices: [
            { text: "Option A", value: "a", next: 15 },
            { text: "Option B", value: "b", next: 16 }
        ]
    }
];
```

### Quiz anpassen

Füge Fragen zum `quizQuestions`-Array hinzu:

```javascript
// In js/main.js
const quizQuestions = [
    {
        question: "Deine neue Frage?",
        options: [
            { text: "Antwort A", correct: true },
            { text: "Antwort B", correct: false }
        ],
        correctResponse: "Richtig! Weil...",
        wrongResponse: "Falsch! Eigentlich ist..."
    }
];
```

### Spielschwierigkeit anpassen

Ändere Game-Parameter in `js/game.js`:

```javascript
// Einfacher
const obstacleSpeed = 3;         // Langsamer (Standard: 5)
const obstacleSpawnRate = 120;   // Seltener (Standard: 100)
player.jumpPower = -15;          // Höher springen (Standard: -12)

// Schwieriger
const obstacleSpeed = 7;
const obstacleSpawnRate = 80;
player.jumpPower = -10;
```

### Farben anpassen

In `style.css`:

```css
:root {
    --primary-bg: #2a1a4a;      /* Haupt-Hintergrund */
    --dialog-bg: #1a0f2e;       /* Dialog-Box */
    --dialog-border: #6b4c9a;   /* Rahmen */
    --accent-color: #ff6b9d;    /* Akzent-Farbe */
}
```

## 🔧 Erweiterte Features

### Google Analytics hinzufügen

In `index.html` vor `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### PWA (Progressive Web App) machen

1. **Erstelle `manifest.json`**:
```json
{
  "name": "Die Lappen-Chroniken",
  "short_name": "Lappen",
  "start_url": "/index.html?scan=true",
  "display": "standalone",
  "background_color": "#2a1a4a",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Link in `index.html`**:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#667eea">
```

### Sound Effects hinzufügen

```javascript
// In js/main.js
const sounds = {
    swipe: new Audio('assets/sounds/swipe.mp3'),
    correct: new Audio('assets/sounds/correct.mp3'),
    wrong: new Audio('assets/sounds/wrong.mp3'),
    jump: new Audio('assets/sounds/jump.mp3')
};

// Beim Swipe
sounds.swipe.play();
```

## 🐛 Debugging

### Browser Console öffnen

- **Chrome/Edge**: F12 oder Ctrl+Shift+I
- **Firefox**: F12
- **Safari**: Cmd+Option+I (Developer Menu aktivieren)

### Häufige Probleme

**Problem**: "Scann mich erst mal ordentlich!"
- **Lösung**: Füge `?scan=true` zur URL hinzu

**Problem**: Swipes funktionieren nicht
- **Lösung**: Warte bis der Text fertig getippt ist

**Problem**: Bilder laden nicht
- **Lösung**: Prüfe die Pfade in den DevTools → Network Tab

**Problem**: Game startet nicht
- **Lösung**: Prüfe Browser Console auf Fehler

### LocalStorage zurücksetzen

```javascript
// In Browser Console
localStorage.removeItem('lappen_progress');
location.reload();
```

## 📱 Testing

### Verschiedene Geräte testen

- **Chrome DevTools**: F12 → Device Toolbar (Ctrl+Shift+M)
- **Firefox**: F12 → Responsive Design Mode
- **BrowserStack**: Online-Testing auf echten Geräten

### Performance checken

```javascript
// In Browser Console
performance.now(); // Zeigt Ladezeit
```

## 🎉 Fertig!

Du hast jetzt eine vollständig funktionierende Web-App! 

**Next Steps:**
1. Teste auf verschiedenen Geräten
2. Sammle Feedback
3. Iteriere und verbessere
4. Teile dein Projekt!

Bei Fragen: Schau in die README.md oder experimentiere einfach drauflos! 🚀
