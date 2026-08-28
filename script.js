/* =================================================================
   CUSTOM CONFIGURATION: QUESTIONS & BIRTHDAY MESSAGE
   ================================================================= */

const SECRET_PASSKEY = "goblin";
const PASSKEY_HINT = "⚠️ ACCESS DENIED: What little creature are you? 👹";

const quizData = [
  // --- EASY (Stitch Tropical Blue Theme: 1-4) ---
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    mascot: "🌺 Stitch 💙",
    themeLabel: "STITCH VIBES 🌴",
    question: "1. When is our official anniversary date?",
    options: ["July 28, 2023", "June 28, 2023", "August 28, 2023", "July 18, 2023"],
    correctIndex: 0,
    hint: "Think back to the best day in July 2023! ❤️"
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    mascot: "🌺 Stitch 💙",
    themeLabel: "STITCH VIBES 🌴",
    question: "2. What is the name of our child on TikTok?",
    options: ["Siomai", "Paotsin", "Dimsum", "Kwek-kwek"],
    correctIndex: 1,
    hint: "It sounds like a legendary food stall! 🥟"
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    mascot: "🌺 Stitch 💙",
    themeLabel: "STITCH VIBES 🌴",
    question: "3. What was the very first nickname I ever gave you?",
    options: ["Baby", "Koy", "Goblin", "Love"],
    correctIndex: 1,
    hint: "Just 3 letters, super classic! 😉"
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    mascot: "🌺 Stitch 💙",
    themeLabel: "STITCH VIBES 🌴",
    question: "4. What's the best song that can describe us?",
    options: ["I Like Me Better", "Lover", "Until I Found You", "Die With A Smile"],
    correctIndex: 0,
    hint: "'I like me better when I'm with you...' 🎵✨"
  },

  // --- MEDIUM (Goblin Clash of Clans Gold/Green Theme: 5-7) ---
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    mascot: "🪙 Goblin ⚔️",
    themeLabel: "CLASH GOBLIN 💚",
    question: "5. Where did it all begin?",
    options: ["Palmera Park", "Discord Call", "Greenbelt Mall", "Coffee Project"],
    correctIndex: 0,
    hint: "Starts with letter P and has lots of trees! 🌳"
  },
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    mascot: "🪙 Goblin ⚔️",
    themeLabel: "CLASH GOBLIN 💚",
    question: "6. What was our very first couple item?",
    options: ["Matching Hoodies", "Rubber bands", "Promise Rings", "Keychain plushies"],
    correctIndex: 1,
    hint: "Simple, stretchy, and holds everything together! 🪢"
  },
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    mascot: "🪙 Goblin ⚔️",
    themeLabel: "CLASH GOBLIN 💚",
    question: "7. Who is my absolute main champion in League of Legends?",
    options: ["Yasuo", "Aphelios", "Jhin", "Ezreal"],
    correctIndex: 2,
    hint: "ONE, TWO, THREE, FOUR! 🎭"
  },

  // --- HARD (Cinnamoroll Pastel Theme: 8-10) ---
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    mascot: "☁️ Cinnamoroll 🎀",
    themeLabel: "CINNAMOROLL ☁️",
    question: "8. Identification: What is the most memorable place we've ever been together?",
    options: [],
    correctAnswer: "livingroom",
    hint: "Inside joke: It's cozy, has a couch, and you don't even need to leave the house! 🛋️"
  },
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    mascot: "☁️ Cinnamoroll 🎀",
    themeLabel: "CINNAMOROLL ☁️",
    question: "9. Identification: Name all 4 of our children!",
    options: [],
    // Handled in custom verification logic to check for all 4 names
    correctAnswer: "zilla wagyu paotsin stitch",
    hint: "Our 4 babies: Z____, W____, P______, and S____! (Separate with spaces or commas) 🐾"
  },
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    mascot: "☁️ Cinnamoroll 🎀",
    themeLabel: "CINNAMOROLL ☁️",
    question: "10. Final Identification: What is my absolute favorite phrase to hear from you?",
    options: [],
    correctAnswer: "iloveyou",
    hint: "3 magic words! ❤️"
  }
];

// Your custom birthday message
const longLetterText = `NYHAHAHAHAHAHAHA happy birthday you goblin looking human! 🎂👹

I hope you enjoy your day without me cuz u stinky! NYAHAHHAH 🤪💨

And please be kind to others since u are an old hag now! 👵✨

I love you so much! That's all bleeeeepppp 😛❤️`;

/* =================================================================
   STATE & LOGIC CONTROLLER
   ================================================================= */
let isUnlocked = false;
let currentQ = 0;
let isTransitioning = false;
let typeWriterInterval = null;

// Tab Lock Protocol
window.addEventListener('beforeunload', (e) => {
  if (!isUnlocked) {
    e.preventDefault();
    e.returnValue = "SYSTEM LOCKED: Unauthorized tab termination blocked. Please authenticate.";
    return e.returnValue;
  }
});

const passwordForm = document.getElementById('password-form');
const passkeyInput = document.getElementById('passkey-input');
const authFeedback = document.getElementById('auth-feedback');
const fakeSafetyBtn = document.getElementById('fake-safety-btn');

const identForm = document.getElementById('ident-form');
const identInput = document.getElementById('ident-input');
const hintToggleBtn = document.getElementById('hint-toggle-btn');
const hintBox = document.getElementById('hint-box');

const copyBtn = document.getElementById('copy-btn');
const restartBtn = document.getElementById('restart-btn');

document.addEventListener('DOMContentLoaded', () => {
  passwordForm.addEventListener('submit', handleAuth);
  fakeSafetyBtn.addEventListener('click', () => {
    authFeedback.style.color = '#fff';
    authFeedback.textContent = "⚠️ There is no going back. Enter the password to escape.";
  });

  identForm.addEventListener('submit', handleIdentSubmit);
  hintToggleBtn.addEventListener('click', toggleHint);
  copyBtn.addEventListener('click', copyLetter);
  restartBtn.addEventListener('click', restartQuest);
});

function cleanStr(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

// Authentication Transition
function handleAuth(e) {
  e.preventDefault();
  const val = cleanStr(passkeyInput.value);

  if (val === cleanStr(SECRET_PASSKEY)) {
    isUnlocked = true;
    authFeedback.style.color = '#a7f3d0';
    authFeedback.textContent = 'Quarantine Lifted. Unlocking Birthday Quest... ✨';
    
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      document.body.classList.remove('warning-mode');
      document.body.classList.add('quest-mode');
      document.title = "Happy Birthday! 🎂❤️";

      document.getElementById('screen-warning').style.display = 'none';
      document.getElementById('quest-container').style.display = 'block';

      renderQuestion();
    }, 1000);
  } else {
    passkeyInput.classList.add('input-error');
    authFeedback.style.color = '#fff';
    authFeedback.textContent = PASSKEY_HINT;
    setTimeout(() => passkeyInput.classList.remove('input-error'), 400);
  }
}

// Render dynamic theme per difficulty level
function renderQuestion() {
  isTransitioning = false;
  const q = quizData[currentQ];
  
  // Set Body Theme
  document.body.className = `quest-mode ${q.theme}`;

  // Mascot & Header Tags
  document.getElementById('mascot-emoji').textContent = q.mascot;
  document.getElementById('theme-tag').textContent = q.themeLabel;
  document.getElementById('quiz-level-badge').textContent = `LEVEL ${currentQ + 1} OF ${quizData.length}`;
  document.getElementById('progress-bar').style.width = `${((currentQ) / quizData.length) * 100}%`;

  document.getElementById('question-text').textContent = q.question;
  document.getElementById('quiz-feedback').textContent = '';
  
  const optContainer = document.getElementById('options-container');
  const identContainer = document.getElementById('ident-container');
  
  hintBox.style.display = 'none';
  hintBox.textContent = q.hint || '';

  if (q.difficulty === 'Hard') {
    optContainer.style.display = 'none';
    identContainer.style.display = 'block';
    identInput.value = '';
    identInput.focus();
  } else {
    identContainer.style.display = 'none';
    optContainer.style.display = 'flex';
    optContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span>${opt}</span><span>✨</span>`;
      btn.onclick = () => handleChoice(btn, idx);
      optContainer.appendChild(btn);
    });
  }
}

function handleChoice(btn, idx) {
  if (isTransitioning) return;
  const q = quizData[currentQ];
  const feedback = document.getElementById('quiz-feedback');

  if (idx === q.correctIndex) {
    advanceNext(btn);
  } else {
    btn.classList.add('wrong');
    feedback.textContent = q.hint || "Oopsie! Try another one! 💡";
    setTimeout(() => btn.classList.remove('wrong'), 500);
  }
}

function handleIdentSubmit(e) {
  e.preventDefault();
  if (isTransitioning) return;
  
  const feedback = document.getElementById('quiz-feedback');
  const q = quizData[currentQ];
  const rawInput = identInput.value.toLowerCase();
  const cleaned = cleanStr(identInput.value);

  let isCorrect = false;

  // Custom check for Question 9 (children: Zilla, Wagyu, Paotsin, Stitch in any order)
  if (currentQ === 8) {
    const hasZilla = rawInput.includes("zilla");
    const hasWagyu = rawInput.includes("wagyu");
    const hasPaotsin = rawInput.includes("paotsin");
    const hasStitch = rawInput.includes("stitch");
    if (hasZilla && hasWagyu && hasPaotsin && hasStitch) {
      isCorrect = true;
    }
  } else {
    isCorrect = (cleaned === cleanStr(q.correctAnswer));
  }

  if (isCorrect) {
    advanceNext(identInput);
  } else {
    identInput.classList.add('input-error');
    feedback.textContent = q.hint || "Almost there! Click the hint if you need help!";
    setTimeout(() => identInput.classList.remove('input-error'), 400);
  }
}

function toggleHint() {
  hintBox.style.display = (hintBox.style.display === 'block') ? 'none' : 'block';
}

function advanceNext(targetElement) {
  isTransitioning = true;
  if (targetElement.classList) targetElement.classList.add('correct');
  
  const feedback = document.getElementById('quiz-feedback');
  feedback.textContent = "Yay! Correct! 🌟 Next level loading...";
  
  confetti({ particleCount: 25, spread: 60, origin: { y: 0.7 } });

  setTimeout(() => {
    currentQ++;
    if (currentQ < quizData.length) {
      renderQuestion();
    } else {
      showGrandPrize();
    }
  }, 1000);
}

function showGrandPrize() {
  document.body.className = "quest-mode theme-cinnamoroll";
  document.getElementById('progress-bar').style.width = '100%';
  
  document.getElementById('screen-quiz').style.display = 'none';
  document.getElementById('screen-prize').style.display = 'block';

  // Confetti Explosion
  const duration = 4 * 1000;
  const end = Date.now() + duration;
  const colors = ['#f472b6', '#38bdf8', '#fde047', '#ffffff', '#c084fc'];

  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  startTypewriter(longLetterText, 'typed-message', 30);
}

function startTypewriter(text, elId, speed) {
  let i = 0;
  const el = document.getElementById(elId);
  el.textContent = '';
  if (typeWriterInterval) clearInterval(typeWriterInterval);

  typeWriterInterval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      const container = document.querySelector('.letter-card');
      if (container) container.scrollTop = container.scrollHeight;
    } else {
      clearInterval(typeWriterInterval);
      const cursor = document.getElementById('cursor');
      if (cursor) cursor.style.display = 'none';
    }
  }, speed);
}

function copyLetter() {
  navigator.clipboard.writeText(longLetterText).then(() => {
    const feedback = document.getElementById('prize-feedback');
    feedback.textContent = 'Letter copied to clipboard! 📋🎀';
    setTimeout(() => feedback.textContent = '', 3000);
  });
}

function restartQuest() {
  if (typeWriterInterval) clearInterval(typeWriterInterval);
  const cursor = document.getElementById('cursor');
  if (cursor) cursor.style.display = 'inline-block';
  currentQ = 0;

  document.getElementById('screen-prize').style.display = 'none';
  document.getElementById('quest-container').style.display = 'none';
  
  document.body.className = "warning-mode";
  document.title = "Security Warning: Critical Risk Detected";
  
  document.getElementById('screen-warning').style.display = 'flex';
  document.getElementById('screen-quiz').style.display = 'block';
  passkeyInput.value = '';
  authFeedback.textContent = '';
  isUnlocked = false;
}