
// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Scroll progress bar
const scrollbar = document.getElementById('scrollbar');
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: self => {
    scrollbar.style.width = (self.progress * 100) + "%";
  }
});

// Cursor blob effect
const blob = document.getElementById('blob');
if (blob) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(blob, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: "power2.out"
    });
  });
}

// Parallax images
gsap.utils.toArray('[data-parallax]').forEach(img => {
  gsap.fromTo(img, {
    y: -50
  }, {
    y: 50,
    ease: "none",
    scrollTrigger: {
      trigger: img,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

// Reveal animations
gsap.utils.toArray('[data-reveal]').forEach(el => {
  gsap.fromTo(el, {
    y: 60,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 80%"
    }
  });
});

// Timeline items
gsap.utils.toArray('[data-tl]').forEach((el, i) => {
  gsap.fromTo(el, {
    x: i % 2 === 0 ? -100 : 100,
    opacity: 0
  }, {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 75%"
    }
  });
});

// GLightbox
const lightbox = GLightbox({
  touchNavigation: true,
  loop: true,
  autoplayVideos: true
});

// Quiz functionality
const shortQs = [
  { q: 'Matoli is mainly decorated during which festival?', opts: ['Ganesh Chaturthi', 'Diwali', 'Holi', 'Navratri'], a: 0 },
  { q: 'Which fruit is believed to ward off negativity?', opts: ['Banana', 'Lemon', 'Pomegranate', 'Mango'], a: 1 },
  { q: 'What does Coconut symbolize in Matoli?', opts: ['Purity & auspiciousness', 'Sweetness', 'Strength', 'Fun'], a: 0 },
  { q: 'Which fruit is linked to Goddess Lakshmi?', opts: ['Mango', 'Banana', 'Coconut', 'Pomegranate'], a: 3 },
  { q: 'Why are lemons hung in Matoli?', opts: ['For color', 'Wards off evil eye', 'Decoration', 'Offer to guests'], a: 1 }
];

const fullQs = [
  { q: 'Why are fruits hung in a Matoli?', opts: ['Decoration', 'Symbol of prosperity', 'Fun activity', 'Food storage'], a: 1 },
  { q: 'Which fruit is linked to Goddess Lakshmi?', opts: ['Banana', 'Mango', 'Coconut', 'Pomegranate'], a: 3 },
  { q: 'What does Coconut symbolize in Matoli?', opts: ['Purity & auspiciousness', 'Strength', 'Sweetness', 'Fertility'], a: 0 },
  { q: 'Which fruit keeps away evil eye?', opts: ['Banana', 'Lemon', 'Orange', 'Apple'], a: 1 },
  { q: 'Bananas in Matoli represent?', opts: ['Fertility & prosperity', 'Purity', 'Sweetness', 'Strength'], a: 0 },
  { q: 'What does Mango symbolize?', opts: ['Joy & love', 'Victory', 'Health', 'Strength'], a: 0 },
  { q: 'Why is sugarcane used in Matoli?', opts: ['Symbol of sweetness & growth', 'Decoration only', 'Hardness', 'To feed animals'], a: 0 },
  { q: 'Which item is offered as a mark of hospitality?', opts: ['Pomegranate', 'Coconut water', 'Banana', 'Mango'], a: 2 },
  { q: 'Which element of Matoli represents abundance?', opts: ['Multiple fruits & grains', 'Lights', 'Cloth', 'Flowers'], a: 0 },
  { q: 'What does Pomegranate symbolize?', opts: ['Health & prosperity', 'Purity', 'Strength', 'Fun'], a: 0 }
];

// Quiz DOM elements
const startBtn = document.getElementById('quizStart');
const qBox = document.getElementById('quizBox');
const qQ = document.getElementById('quizQ');
const qOpts = document.getElementById('quizOpts');
const qMsg = document.getElementById('quizMsg');
const shortBtn = document.getElementById('shortMode');
const fullBtn = document.getElementById('fullMode');
const restartBox = document.getElementById('restartBox');
const restartBtn = document.getElementById('restartBtn');
const progressBar = document.getElementById('progressBar');
const scoreTracker = document.getElementById('scoreTracker');

let quizData = shortQs;
let qIdx = 0, score = 0;

// Mode toggle
shortBtn.addEventListener('click', () => {
  quizData = shortQs;
  toggleMode(shortBtn, fullBtn);
});

fullBtn.addEventListener('click', () => {
  quizData = fullQs;
  toggleMode(fullBtn, shortBtn);
});

function toggleMode(active, inactive) {
  active.classList.add("bg-saffron-500", "text-white");
  active.classList.remove("bg-neutral-300", "text-black");
  inactive.classList.add("bg-neutral-300", "text-black");
  inactive.classList.remove("bg-saffron-500", "text-white");
}

// Paint question
function paintQ() {
  const item = quizData[qIdx];
  qQ.textContent = `Q${qIdx + 1}. ${item.q}`;
  qOpts.innerHTML = '';
  item.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'w-full text-left rounded-xl border border-neutral-300 px-4 py-3 hover:bg-saffron-50 active:scale-95 transition';
    btn.textContent = opt;
    btn.onclick = () => handleAns(i, item.a);
    qOpts.appendChild(btn);
  });

  progressBar.style.width = `${((qIdx) / quizData.length) * 100}%`;
  scoreTracker.textContent = `Score: ${score} / ${quizData.length}`;
}

// Handle answer
function handleAns(i, correct) {
  if (i === correct) {
    score++;
    qMsg.textContent = '✅ Correct!';
    qMsg.className = 'mt-6 text-center font-bold text-green-600';
  } else {
    qMsg.textContent = '❌ Wrong!';
    qMsg.className = 'mt-6 text-center font-bold text-red-600';
  }
  
  setTimeout(() => {
    qIdx++;
    if (qIdx < quizData.length) {
      qMsg.textContent = '';
      paintQ();
    } else {
      qQ.textContent = `🎉 Quiz Over! Final Score: ${score}/${quizData.length}`;
      qOpts.innerHTML = '';
      qMsg.textContent = score === quizData.length ? '🏆 Perfect score!' : 'Good try! Keep learning ✨';
      qMsg.className = 'mt-6 text-center font-bold text-saffron-600';
      progressBar.style.width = '100%';
      scoreTracker.textContent = `Final: ${score}/${quizData.length}`;
      restartBox.classList.remove("hidden");
    }
  }, 600);
}

// Start quiz
startBtn.addEventListener('click', () => {
  qIdx = 0;
  score = 0;
  qBox.classList.remove('hidden');
  restartBox.classList.add("hidden");
  qMsg.textContent = '';
  paintQ();
  qBox.scrollIntoView({ behavior: 'smooth' });
});

// Restart quiz
restartBtn.addEventListener('click', () => {
  qIdx = 0;
  score = 0;
  restartBox.classList.add("hidden");
  qMsg.textContent = '';
  paintQ();
});
