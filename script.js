/* =================================================================
   CUSTOM CONFIGURATION
   ================================================================= */

const SECRET_PASSKEY = "goblin";
const PASSKEY_HINT = "ACCESS DENIED: What little creature are you?";

const quizData = [
  // --- EASY (Stitch Theme: 1-4) ---
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    question: "1. When is our official anniversary date?",
    options: ["July 28, 2023", "June 28, 2023", "August 28, 2023", "July 18, 2023"],
    correctIndex: 0,
    hint: "Think back to the best day in July 2023."
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    question: "2. What is the name of our child on TikTok?",
    options: ["Siomai", "Paotsin", "Dimsum", "Kwek-kwek"],
    correctIndex: 1,
    hint: "It sounds like a popular food stall."
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    question: "3. What was the very first nickname I ever gave you?",
    options: ["Baby", "Koy", "Goblin", "Love"],
    correctIndex: 1,
    hint: "Just 3 letters, super classic."
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    question: "4. What's the best song that can describe us?",
    options: ["I Like Me Better", "Lover", "Until I Found You", "Die With A Smile"],
    correctIndex: 0,
    hint: "I like me better when I'm with you."
  },

  // --- MEDIUM (Goblin Theme: 5-7) ---
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    question: "5. Where did it all begin?",
    options: ["Palmera Park", "Discord Call", "Greenbelt Mall", "Coffee Project"],
    correctIndex: 0,
    hint: "Starts with the letter P."
  },
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    question: "6. What was our very first couple item?",
    options: ["Matching Hoodies", "Rubber bands", "Promise Rings", "Keychain plushies"],
    correctIndex: 1,
    hint: "Simple, stretchy, and holds things together."
  },
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    question: "7. Who is my absolute main champion in League of Legends?",
    options: ["Yasuo", "Aphelios", "Jhin", "Ezreal"],
    correctIndex: 2,
    hint: "ONE, TWO, THREE, FOUR."
  },

  // --- HARD (Cinnamoroll Theme: 8-10) ---
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    question: "8. Identification: What is the most memorable place we've ever been together?",
    options: [],
    correctAnswer: "livingroom",
    hint: "Inside joke: Cozy, has a couch, and you don't even need to leave the house."
  },
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    question: "9. Identification: Name all 4 of our children!",
    options: [],
    correctAnswer: "zilla wagyu paotsin stitch",
    hint: "Our 4 babies: Z____, W____, P______, and S____! (Separate with spaces or commas)"
  },
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    question: "10. Final Identification: What is my absolute favorite phrase to hear from you?",
    options: [],
    correctAnswer: "iloveyou",
    hint: "3 magic words."
  }
];

const longLetterText = `NYHAHAHAHAHAHAHA happy birthday you goblin looking human!

I hope you enjoy your day without me cuz u stinky! NYAHAHHAH

And please be kind to others since u are an old hag now!

I love you so much! That's all bleeeeepppp`;

/* =================================================================
   STATE & LOGIC CONTROLLER
   ================================================================= */
let isUnlocked = false;
let currentQ = 0;
let isTransitioning = false;
let typeWriterInterval = null;

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
const stitchVideo = document.getElementById('stitch-video-bg');

document.addEventListener('DOMContentLoaded', () => {
  passwordForm.addEventListener('submit', handleAuth);
  fakeSafetyBtn.addEventListener('click', () => {
    authFeedback.style.color = '#fff';
    authFeedback.textContent = "There is no going back. Enter the password to escape.";
  });

  identForm.addEventListener('submit', handleIdentSubmit);
  hintToggleBtn.addEventListener('click', toggleHint);
  copyBtn.addEventListener('click', copyLetter);
  restartBtn.addEventListener('click', restartQuest);
});

function cleanStr(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

function handleAuth(e) {
  e.preventDefault();
  const val = cleanStr(passkeyInput.value);

  if (val === cleanStr(SECRET_PASSKEY)) {
    isUnlocked = true;
    authFeedback.style.color = '#a7f3d0';
    authFeedback.textContent = 'Quarantine Lifted. Unlocking Birthday Quest...';
    
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      document.body.classList.remove('warning-mode');
      document.body.classList.add('quest-mode');
      document.title = "Happy Birthday!";

      document.getElementById('screen-warning').style.display = 'none';
      document.getElementById('quest-container').style.display = 'grid';

      if (stitchVideo) {
        stitchVideo.play().catch(() => {});
      }

      renderQuestion();
    }, 1000);
  } else {
    passkeyInput.classList.add('input-error');
    authFeedback.style.color = '#fff';
    authFeedback.textContent = PASSKEY_HINT;
    setTimeout(() => passkeyInput.classList.remove('input-error'), 400);
  }
}

function renderQuestion() {
  isTransitioning = false;
  const q = quizData[currentQ];
  
  document.body.className = `quest-mode ${q.theme}`;

  if (q.theme === 'theme-stitch' && stitchVideo) {
    stitchVideo.play().catch(() => {});
  }

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
      btn.textContent = opt;
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
    feedback.textContent = q.hint || "Incorrect, try another option.";
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
    feedback.textContent = q.hint || "Incorrect. Check your spelling or click the hint.";
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
  feedback.textContent = "Correct! Decrypting next token...";
  
  confetti({ particleCount: 20, spread: 55, origin: { y: 0.7 } });

  setTimeout(() => {
    currentQ++;
    if (currentQ < quizData.length) {
      renderQuestion();
    } else {
      showGrandPrize();
    }
  }, 900);
}

function showGrandPrize() {
  document.body.className = "quest-mode theme-cinnamoroll";
  document.getElementById('progress-bar').style.width = '100%';
  
  document.getElementById('tab-status-title').textContent = "birthday_letter.txt • [DECRYPTED 🔓]";
  document.getElementById('waiting-placeholder').style.display = 'none';
  document.getElementById('letter-stream').style.display = 'block';
  document.getElementById('prize-actions').style.display = 'flex';

  const duration = 4 * 1000;
  const end = Date.now() + duration;
  const colors = ['#f43f5e', '#38bdf8', '#fde047', '#ffffff', '#c084fc'];

  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  startTypewriter(longLetterText, 'typed-message', 25);
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
      const container = document.querySelector('.letter-terminal-content');
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
    feedback.textContent = 'Letter copied to clipboard!';
    setTimeout(() => feedback.textContent = '', 3000);
  });
}

function restartQuest() {
  if (typeWriterInterval) clearInterval(typeWriterInterval);
  const cursor = document.getElementById('cursor');
  if (cursor) cursor.style.display = 'inline-block';
  currentQ = 0;

  document.getElementById('tab-status-title').textContent = "birthday_letter.txt • [LOCKED]";
  document.getElementById('waiting-placeholder').style.display = 'block';
  document.getElementById('letter-stream').style.display = 'none';
  document.getElementById('prize-actions').style.display = 'none';
  document.getElementById('typed-message').textContent = '';

  document.getElementById('quest-container').style.display = 'none';
  document.body.className = "warning-mode";
  document.title = "Security Warning: Critical Risk Detected";
  
  document.getElementById('screen-warning').style.display = 'flex';
  passkeyInput.value = '';
  authFeedback.textContent = '';
  isUnlocked = false;
}