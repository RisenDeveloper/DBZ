/* ============================================
   DRAGON BALL SUPER - SCRIPT INTERATIVO
   ============================================ */

// ===== STARS BACKGROUND =====
const starsCanvas = document.getElementById('stars-canvas');
const ctx = starsCanvas.getContext('2d');
let stars = [];

function initStars() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;

    stars = [];
    const numStars = Math.floor((starsCanvas.width * starsCanvas.height) / 3000);
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * starsCanvas.width,
            y: Math.random() * starsCanvas.height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            alphaSpeed: Math.random() * 0.02 + 0.005,
            alphaDir: Math.random() > 0.5 ? 1 : -1
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

    stars.forEach(star => {
        star.alpha += star.alphaSpeed * star.alphaDir;
        if (star.alpha >= 1) { star.alpha = 1; star.alphaDir = -1; }
        if (star.alpha <= 0.2) { star.alpha = 0.2; star.alphaDir = 1; }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        // Occasional glow
        if (star.radius > 1.2) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 200, 255, ${star.alpha * 0.15})`;
            ctx.fill();
        }
    });

    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', initStars);
initStars();
drawStars();

// ===== KI PARTICLES =====
const kiContainer = document.getElementById('ki-particles');
const kiColors = [
    'rgba(255, 215, 0, 0.6)',
    'rgba(255, 140, 0, 0.5)',
    'rgba(0, 191, 255, 0.5)',
    'rgba(255, 234, 0, 0.4)',
    'rgba(0, 229, 255, 0.4)'
];

function spawnKiParticle() {
    const particle = document.createElement('div');
    particle.classList.add('ki-particle');

    const size = Math.random() * 6 + 2;
    const color = kiColors[Math.floor(Math.random() * kiColors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 3;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    kiContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Spawn particles periodically
setInterval(spawnKiParticle, 300);

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId, delay = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const screen = document.getElementById(screenId);
            screen.classList.add('active');
            resolve();
        }, delay);
    });
}

// ===== INTRO → SHENLONG =====
const btnSummon = document.getElementById('btn-summon');
btnSummon.addEventListener('click', async () => {
    // Screen shake effect
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);

    // Flash + transition to Shenlong
    const flash = document.querySelector('.lightning-flash');
    await showScreen('shenlong-screen', 300);
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 600);

    // After dramatic pause, go to question
    setTimeout(async () => {
        const flash2 = document.querySelector('.lightning-flash');
        flash2.classList.add('active');
        setTimeout(() => flash2.classList.remove('active'), 600);
        await showScreen('question-screen', 200);
    }, 4000);
});

// ===== GOKU BLOCKER SYSTEM =====
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const hintText = document.getElementById('hint-text');
const gokuBlocker = document.getElementById('goku-blocker');
const gokuItFlash = document.getElementById('goku-it-flash');
const gokuSpeech = document.getElementById('goku-speech');
const gokuSpeechText = document.getElementById('goku-speech-text');
const gokuKamehameha = document.getElementById('goku-kamehameha');
const noBtnWrapper = document.getElementById('no-btn-wrapper');

const gokuPhrases = [
    "EI! Eu não vou deixar! 🖐️",
    "Teletransporte! Bloqueado! ⚡",
    "Nem tenta, eu sou mais rápido! 💨",
    "KAMEHAMEHAAA nesse botão! 🔵",
    "O Vegeta me mandou proteger! 💪",
    "Ultra Instinto ativado! 🔮",
    "Esse botão não funciona comigo aqui! ✋",
    "Eu treinei 100x a gravidade pra isso! 🏋️",
    "Aperta o SIM, vai ser legal! 😄",
    "Shenlong não vai aceitar esse desejo! 🐉",
    "Nem o Jiren passa por mim! 👊",
    "Tô sentindo teu Ki... aperta SIM! 💛",
];

let gokuPhraseIndex = 0;
let gokuActive = false;
let gokuHideTimeout = null;
let noAttempts = 0;

function showGoku() {
    if (gokuActive) {
        // Already showing, just update phrase
        updateGokuPhrase();
        fireKamehameha();
        return;
    }

    gokuActive = true;
    noAttempts++;

    // Instant Transmission flash
    gokuItFlash.classList.remove('flash');
    void gokuItFlash.offsetWidth; // force reflow
    gokuItFlash.classList.add('flash');

    // Show Goku with entrance animation
    gokuBlocker.classList.add('active', 'entering');
    setTimeout(() => gokuBlocker.classList.remove('entering'), 400);

    // Block the No button
    btnNo.classList.add('blocked');

    // Show speech bubble with delay
    setTimeout(() => {
        updateGokuPhrase();
        gokuSpeech.classList.add('visible');
    }, 300);

    // Screen shake!
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);

    // Make yes button grow
    const yesScale = 1 + (noAttempts * 0.12);
    btnYes.style.transform = `scale(${Math.min(yesScale, 2)})`;
    btnYes.style.transition = 'transform 0.4s ease';

    // Show hint
    hintText.textContent = "⬆️ O Goku tá dizendo pra apertar SIM! ⬆️";

    // After some time, Goku stays forever after 3+ attempts
    clearTimeout(gokuHideTimeout);
    if (noAttempts < 3) {
        gokuHideTimeout = setTimeout(hideGoku, 3500);
    }
    // After 3 attempts, Goku never leaves!
}

function hideGoku() {
    gokuActive = false;
    gokuBlocker.classList.remove('active');
    gokuSpeech.classList.remove('visible');
    btnNo.classList.remove('blocked');
}

function updateGokuPhrase() {
    gokuSpeechText.textContent = gokuPhrases[gokuPhraseIndex % gokuPhrases.length];
    gokuPhraseIndex++;

    // Re-trigger the pop animation
    gokuSpeech.classList.remove('visible');
    void gokuSpeech.offsetWidth;
    gokuSpeech.classList.add('visible');
}

function fireKamehameha() {
    gokuKamehameha.classList.remove('active');
    void gokuKamehameha.offsetWidth;
    gokuKamehameha.classList.add('active');
    setTimeout(() => gokuKamehameha.classList.remove('active'), 600);

    // Extra screen shake for Kamehameha
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);
}

// Goku appears when hovering over No button
noBtnWrapper.addEventListener('mouseenter', () => {
    showGoku();
});

// Goku appears on click attempt too
btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showGoku();
});

// On touch devices, trigger on touchstart
noBtnWrapper.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showGoku();
}, { passive: false });

// Rotate Goku's phrases while he's visible
setInterval(() => {
    if (gokuActive) {
        updateGokuPhrase();
    }
}, 3000);

// ===== YES BUTTON → CELEBRATION =====
btnYes.addEventListener('click', async () => {
    // Epic power up flash
    const flash = document.createElement('div');
    flash.classList.add('power-up-flash');
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    // Screen shake
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);

    // Confetti burst
    createConfetti();

    // Show celebration screen
    await showScreen('celebration-screen', 600);

    // Start hearts rain
    startHeartsRain();

    // Start fireworks
    startFireworks();
});

// ===== CONFETTI =====
function createConfetti() {
    const colors = ['#FFD700', '#FF8C00', '#00BFFF', '#FF69B4', '#00E676', '#FF3B3F', '#9C27B0', '#FFEA00'];

    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');

        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const size = Math.random() * 8 + 4;
        const duration = Math.random() * 2 + 1.5;
        const delay = Math.random() * 0.5;
        const shape = Math.random() > 0.5 ? '50%' : '0';

        confetti.style.left = `${left}%`;
        confetti.style.top = `-10px`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size * (Math.random() * 0.5 + 0.5)}px`;
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = shape;
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.animationDelay = `${delay}s`;

        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }
}

// ===== HEARTS RAIN =====
function startHeartsRain() {
    const heartsContainer = document.getElementById('hearts-rain');
    const hearts = ['💖', '❤️', '💛', '🧡', '💜', '💗', '✨', '⭐', '🌟', '💫'];

    function spawnHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const left = Math.random() * 100;
        const size = Math.random() * 20 + 14;
        const duration = Math.random() * 4 + 3;
        const delay = Math.random() * 2;

        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;

        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), (duration + delay) * 1000);
    }

    // Initial burst
    for (let i = 0; i < 20; i++) {
        spawnHeart();
    }

    // Continuous rain
    setInterval(spawnHeart, 400);
}

// ===== FIREWORKS =====
function startFireworks() {
    const fireworksContainer = document.getElementById('fireworks');

    function createFirework() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.5);
        const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FF8C00', '#00E676', '#C0C0FF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const numParticles = 20;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('firework');

            const angle = (i / numParticles) * Math.PI * 2;
            const velocity = Math.random() * 80 + 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 6px ${color}`;
            particle.style.transform = `translate(${tx}px, ${ty}px)`;

            fireworksContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Initial burst
    for (let i = 0; i < 5; i++) {
        setTimeout(createFirework, i * 200);
    }

    // Continuous fireworks
    setInterval(createFirework, 1500);
}

// ===== POWER COUNTER ANIMATION =====
const powerCounter = document.getElementById('power-counter');
const powerTexts = ['OVER 9000!!!', 'É IMPOSSÍVEL!!!', 'ULTRAPASSOU O LIMITE!!!', 'PODER INFINITO!!!'];
let powerIndex = 0;

setInterval(() => {
    powerIndex = (powerIndex + 1) % powerTexts.length;
    powerCounter.style.opacity = '0';
    setTimeout(() => {
        powerCounter.textContent = powerTexts[powerIndex];
        powerCounter.style.opacity = '1';
    }, 300);
}, 3000);

// ===== INITIAL SCREEN =====
showScreen('intro-screen');
