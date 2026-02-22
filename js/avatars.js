// SVG Avatar Generator
const AvatarSVG = {
    neutral: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <!-- Rainbow stripes background -->
        <rect width="200" height="28.57" fill="#e91e63" y="0"/>
        <rect width="200" height="28.57" fill="#ff5722" y="28.57"/>
        <rect width="200" height="28.57" fill="#ff9800" y="57.14"/>
        <rect width="200" height="28.57" fill="#ffeb3b" y="85.71"/>
        <rect width="200" height="28.57" fill="#8bc34a" y="114.28"/>
        <rect width="200" height="28.57" fill="#2196f3" y="142.85"/>
        <rect width="200" height="28.57" fill="#9c27b0" y="171.42"/>
        
        <!-- Border -->
        <rect width="200" height="200" fill="none" stroke="#6b4c9a" stroke-width="8"/>
        
        <!-- Eyes -->
        <rect x="60" y="80" width="20" height="20" fill="#000"/>
        <rect x="65" y="85" width="8" height="8" fill="#fff"/>
        
        <rect x="120" y="80" width="20" height="20" fill="#000"/>
        <rect x="125" y="85" width="8" height="8" fill="#fff"/>
        
        <!-- Smile -->
        <rect x="70" y="130" width="60" height="10" fill="#000"/>
        <rect x="75" y="135" width="10" height="10" fill="#000"/>
        <rect x="115" y="135" width="10" height="10" fill="#000"/>
    </svg>`,
    
    happy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <!-- Rainbow stripes background -->
        <rect width="200" height="28.57" fill="#e91e63" y="0"/>
        <rect width="200" height="28.57" fill="#ff5722" y="28.57"/>
        <rect width="200" height="28.57" fill="#ff9800" y="57.14"/>
        <rect width="200" height="28.57" fill="#ffeb3b" y="85.71"/>
        <rect width="200" height="28.57" fill="#8bc34a" y="114.28"/>
        <rect width="200" height="28.57" fill="#2196f3" y="142.85"/>
        <rect width="200" height="28.57" fill="#9c27b0" y="171.42"/>
        
        <!-- Border -->
        <rect width="200" height="200" fill="none" stroke="#6b4c9a" stroke-width="8"/>
        
        <!-- Happy eyes (closed) -->
        <path d="M 60 90 L 80 85 L 60 80" fill="none" stroke="#000" stroke-width="4"/>
        <path d="M 120 90 L 140 85 L 120 80" fill="none" stroke="#000" stroke-width="4"/>
        
        <!-- Big smile -->
        <rect x="60" y="130" width="80" height="12" fill="#000"/>
        <rect x="65" y="136" width="12" height="12" fill="#000"/>
        <rect x="123" y="136" width="12" height="12" fill="#000"/>
        <rect x="70" y="142" width="60" height="8" fill="#ff6b9d"/>
    </svg>`,
    
    angry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <!-- Rainbow stripes background -->
        <rect width="200" height="28.57" fill="#e91e63" y="0"/>
        <rect width="200" height="28.57" fill="#ff5722" y="28.57"/>
        <rect width="200" height="28.57" fill="#ff9800" y="57.14"/>
        <rect width="200" height="28.57" fill="#ffeb3b" y="85.71"/>
        <rect width="200" height="28.57" fill="#8bc34a" y="114.28"/>
        <rect width="200" height="28.57" fill="#2196f3" y="142.85"/>
        <rect width="200" height="28.57" fill="#9c27b0" y="171.42"/>
        
        <!-- Border -->
        <rect width="200" height="200" fill="none" stroke="#6b4c9a" stroke-width="8"/>
        
        <!-- Angry eyebrows -->
        <rect x="50" y="65" width="35" height="8" fill="#000" transform="rotate(-20 67.5 69)"/>
        <rect x="115" y="65" width="35" height="8" fill="#000" transform="rotate(20 132.5 69)"/>
        
        <!-- Angry eyes -->
        <rect x="60" y="85" width="20" height="20" fill="#000"/>
        <rect x="62" y="87" width="8" height="8" fill="#ef4444"/>
        
        <rect x="120" y="85" width="20" height="20" fill="#000"/>
        <rect x="122" y="87" width="8" height="8" fill="#ef4444"/>
        
        <!-- Frown -->
        <rect x="70" y="145" width="60" height="10" fill="#000"/>
        <rect x="65" y="135" width="10" height="10" fill="#000"/>
        <rect x="125" y="135" width="10" height="10" fill="#000"/>
    </svg>`,
    
    shocked: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <!-- Rainbow stripes background -->
        <rect width="200" height="28.57" fill="#e91e63" y="0"/>
        <rect width="200" height="28.57" fill="#ff5722" y="28.57"/>
        <rect width="200" height="28.57" fill="#ff9800" y="57.14"/>
        <rect width="200" height="28.57" fill="#ffeb3b" y="85.71"/>
        <rect width="200" height="28.57" fill="#8bc34a" y="114.28"/>
        <rect width="200" height="28.57" fill="#2196f3" y="142.85"/>
        <rect width="200" height="28.57" fill="#9c27b0" y="171.42"/>
        
        <!-- Border -->
        <rect width="200" height="200" fill="none" stroke="#6b4c9a" stroke-width="8"/>
        
        <!-- Wide eyes -->
        <circle cx="70" cy="85" r="18" fill="#000"/>
        <circle cx="70" cy="85" r="12" fill="#fff"/>
        <circle cx="68" cy="83" r="6" fill="#000"/>
        
        <circle cx="130" cy="85" r="18" fill="#000"/>
        <circle cx="130" cy="85" r="12" fill="#fff"/>
        <circle cx="128" cy="83" r="6" fill="#000"/>
        
        <!-- O mouth -->
        <circle cx="100" cy="135" r="20" fill="#000"/>
        <circle cx="100" cy="135" r="15" fill="#ff6b9d"/>
    </svg>`,
    
    rainbow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <!-- Animated rainbow stripes -->
        <rect width="200" height="28.57" fill="#e91e63" y="0">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect width="200" height="28.57" fill="#ff5722" y="28.57">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect width="200" height="28.57" fill="#ff9800" y="57.14">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect width="200" height="28.57" fill="#ffeb3b" y="85.71">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect width="200" height="28.57" fill="#8bc34a" y="114.28">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect width="200" height="28.57" fill="#2196f3" y="142.85">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect width="200" height="28.57" fill="#9c27b0" y="171.42">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        
        <!-- Sparkles -->
        <circle cx="40" cy="40" r="3" fill="#fff">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="160" cy="60" r="4" fill="#fff">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="50" cy="150" r="3" fill="#fff">
            <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Border -->
        <rect width="200" height="200" fill="none" stroke="#ffd700" stroke-width="8">
            <animate attributeName="stroke" values="#ffd700;#ff69b4;#00ffff;#ffd700" dur="3s" repeatCount="indefinite"/>
        </rect>
        
        <!-- Star eyes -->
        <path d="M 70 75 L 73 85 L 83 85 L 75 91 L 78 101 L 70 95 L 62 101 L 65 91 L 57 85 L 67 85 Z" fill="#ffd700"/>
        <path d="M 130 75 L 133 85 L 143 85 L 135 91 L 138 101 L 130 95 L 122 101 L 125 91 L 117 85 L 127 85 Z" fill="#ffd700"/>
        
        <!-- Big smile with sparkle -->
        <rect x="60" y="130" width="80" height="12" fill="#000"/>
        <rect x="65" y="136" width="12" height="12" fill="#000"/>
        <rect x="123" y="136" width="12" height="12" fill="#000"/>
        <circle cx="100" cy="136" r="3" fill="#ffd700">
            <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite"/>
        </circle>
    </svg>`
};
