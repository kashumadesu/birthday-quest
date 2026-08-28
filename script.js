/* =================================================================
   CUSTOM CONFIGURATION
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
    question: "1. Let's start easy: Where did we have our very first official date?",
    options: ["That cozy cafe down the street", "At the cinema eating popcorn", "Over a 6-hour Discord study call", "A fast-food drive-thru run"],
    correctIndex: 0,
    hint: "It smelled like freshly brewed espresso and warm pastries!"
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    mascot: "🌺 Stitch 💙",
    themeLabel: "STITCH VIBES 🌴",
    question: "2. Who is more likely to fall asleep first on late-night calls?",
    options: ["You, without even saying goodbye", "Me, while promising I'm wide awake", "We both stay awake like owls", "Discord crashes before anyone sleeps"],
    correctIndex: 1,
    hint: "I always say 'I'm just resting my eyes' right before passing out."
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    mascot: "🌺 Stitch 💙",
    themeLabel: "STITCH VIBES 🌴",
    question: "3. What is our ultimate comfort food order when we can't decide?",
    options: ["Korean Fried Chicken & Fries", "Matcha Milk Tea (100% sugar)", "Pizza with stuffed crust", "A massive burger meal"],
    correctIndex: 0,
    hint: "Crispy, savory, and usually comes with sweet radish!"
  },
  {
    difficulty: "Easy",
    theme: "theme-stitch",
    mascot: "🌺 Stitch 💙",
    themeLabel: "STITCH VIBES 🌴",
    question: "4. What is my favorite thing to do whenever we hang out?",
    options: ["Watch you talk passionately about your hobbies", "Just sit in comfortable silence with you", "Steal your food right after you order", "All of the above ❤️"],
    correctIndex: 3,
    hint: "There is no wrong way to love spending time with you."
  },

  // --- MEDIUM (Goblin Clash of Clans Gold/Green Theme: 5-7) ---
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    mascot: "🪙 Goblin ⚔️",
    themeLabel: "CLASH GOBLIN 💚",
    question: "5. In our IT coding sprints, what is our most frequent 'debugging technique'?",
    options: ["Reading the official docs meticulously", "Console.log('why is this not working???')", "Deleting the repository entirely", "Asking ChatGPT to rewrite our lives"],
    correctIndex: 1,
    hint: "We have hundreds of print statements filling our consoles."
  },
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    mascot: "🪙 Goblin ⚔️",
    themeLabel: "CLASH GOBLIN 💚",
    question: "6. Which inside joke always makes us burst out laughing immediately?",
    options: ["The accidental mic unmute incident", "The recursive loop meme we sent at 3 AM", "That time we tried to follow GPS blindly", "The dramatic typo during serious texting"],
    correctIndex: 0,
    hint: "Remember when someone didn't realize their audio was live?"
  },
  {
    difficulty: "Medium",
    theme: "theme-goblin",
    mascot: "🪙 Goblin ⚔️",
    themeLabel: "CLASH GOBLIN 💚",
    question: "7. What was the exact vibe of our very first conversation?",
    options: ["Super awkward and overly formal", "Instant connection like we knew each other for years", "A debate about JavaScript vs. Python", "Just sharing study notes"],
    correctIndex: 1,
    hint: "Time flew by so fast that night!"
  },

  // --- HARD (Cinnamoroll Pastel Theme: 8-10) ---
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    mascot: "☁️ Cinnamoroll 🎀",
    themeLabel: "CINNAMOROLL ☁️",
    question: "8. Identification: What is the title of 'our' favorite song or playlist theme?",
    options: [],
    correctAnswer: "lover",
    hint: "Think about the track that always plays on repeat during long study sessions."
  },
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    mascot: "☁️ Cinnamoroll 🎀",
    themeLabel: "CINNAMOROLL ☁️",
    question: "9. Identification: What is the specific pet name or nickname I call you the most?",
    options: [],
    correctAnswer: "baby",
    hint: "Starts with 'B' and comes out naturally every single day."
  },
  {
    difficulty: "Hard",
    theme: "theme-cinnamoroll",
    mascot: "☁️ Cinnamoroll 🎀",
    themeLabel: "CINNAMOROLL ☁️",
    question: "10. Final Verification: Who holds the master root key to my heart?",
    options: [],
    correctAnswer: "you",
    hint: "Type 'you' (because it's the absolute truth)!"
  }
];

const longLetterText = `Dearest Birthday Girl,

Happy Birthday to my favorite human, my most reliable teammate, and the prettiest distraction in my life! 🎉❤️

Being with you makes even the most stressful semester feel manageable and every quiet moment meaningful. Whether we're grinding through code, laughing over ridiculous memes at 2:00 AM, or planning out all the places we'll explore next, having you by my side is my favorite part of every single day.

Thank you for your warmth, your boundless patience, your cute quirks, and the genuine comfort you bring into my life. You inspire me to be better, to work harder, and to appreciate all the little moments in between.

I hope this new year brings you high GPAs, zero runtime errors, genuine happiness, and all the success you rightfully deserve. 

I love you more than words, syntax, or code can compile.

Forever your player two,
With all my love ❤️`;

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
    authFeedback.textContent = 'Quarantine Lifted. Unlocking Cute Mode... ✨';
    
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
  const answer = cleanStr(identInput.value);
  const target = cleanStr(q.correctAnswer);

  const isCorrect = (currentQ === 9) 
    ? (answer === 'you' || answer === 'me' || answer.length > 1) 
    : (answer === target);

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
      const container = document.querySelector('.terminal-box');
      container.scrollTop = container.scrollHeight;
    } else {
      clearInterval(typeWriterInterval);
      document.getElementById('cursor').style.display = 'none';
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
  document.getElementById('cursor').style.display = 'inline-block';
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