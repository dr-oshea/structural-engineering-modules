/* ============================================================================
   types/quiz.js — "Test Your Knowledge": a multi-question sub-sequence
   inside ONE module slide.

   Internal flow: intro → N questions → results.
   • One attempt per question; advances on answer (right or wrong).
   • MCQ options are shuffled each attempt (per-question shuffle:false opts out).
   • Results show score, a review table, and a Retry button.
   • Reaching results marks the module slide complete, regardless of score.
   • While a question is on screen, module navigation is locked (the engine
     calls this type's navLocked hook).

   Config fields:
     title        Heading (shown on every sub-page)
     intro        Intro paragraph (default provided)
     startText    Start button label (default "Start Quiz")
     questions    Array of question objects; each has kind:"mcq" or "input":
       kind:"mcq"    → question (HTML), options [{text?, image?, correct?}],
                       shuffle:false to keep authored order
       kind:"input"  → question (HTML), answer (number),
                       tolerance (default 0.01), unit (optional)
       either kind   → image / imageWidth (optional figure above the question)
     label        Sidebar label
   ============================================================================ */


// Internal runtime state, keyed by slide index so each quiz slide remembers
// its own progress for the session.
//   quizRuntime[i] = { stage:"intro"|"question"|"results", q:0, answers:[], order:{} }
const quizRuntime = {};

// Ensure a runtime state object exists for the current quiz slide.
function getQuizRuntime() {
  if (!quizRuntime[currentSlide]) {
    quizRuntime[currentSlide] = {
      stage: "intro",   // "intro" | "question" | "results"
      q: 0,             // current question index
      answers: []       // answers[i] = { correct: bool, givenText: string }
    };
  }
  return quizRuntime[currentSlide];
}

// Master render — dispatches on the internal stage.
function renderQuiz() {
  const rt = getQuizRuntime();
  if (rt.stage === "intro")    return renderQuizIntro();
  if (rt.stage === "question") return renderQuizQuestion();
  if (rt.stage === "results")  return renderQuizResults();
}


// ── Intro sub-page ──
function renderQuizIntro() {
  const slide = moduleData[currentSlide];
  renderLayout(`
    <h2>${slide.title}</h2>
    <div class="quiz-intro">
      <p>${slide.intro || "Complete the following questions to finish the module."}</p>
      <p class="quiz-intro-meta">${slide.questions.length} question${slide.questions.length === 1 ? "" : "s"} · one attempt each</p>
      <button class="quiz-start-btn" onclick="quizStart()">
        ${slide.startText || "Start Quiz"}
      </button>
    </div>
  `);
}


// ── A single question sub-page (mcq or input) ──
function renderQuizQuestion() {
  const slide = moduleData[currentSlide];
  const rt    = getQuizRuntime();
  const q     = slide.questions[rt.q];
  const num   = rt.q + 1;
  const total = slide.questions.length;

  let answerAreaHTML = "";

  if (q.kind === "mcq") {
    // Build (once per visit) a shuffled display order for this question's
    // options, unless the question opts out with shuffle:false.
    if (!rt.order) rt.order = {};
    if (!rt.order[rt.q]) {
      const indices = q.options.map((_, i) => i);
      rt.order[rt.q] = (q.shuffle === false) ? indices : shuffleArray(indices);
    }
    const order = rt.order[rt.q];

    answerAreaHTML = `
      <div class="mcq-options mcq-cols-${q.options.length === 3 ? 3 : 2}" id="quiz-options">
        ${order.map((origIndex, displayPos) => {
          const opt = q.options[origIndex];
          return `
            <button class="mcq-option" id="quiz-opt-${displayPos}" onclick="quizAnswerMCQ(${origIndex})">
              ${opt.image ? `<img src="${opt.image}" class="mcq-option-img" alt="Option ${displayPos + 1}">` : ""}
              ${opt.text ? `<span>${opt.text}</span>` : ""}
            </button>
          `;
        }).join("")}
      </div>
    `;
  } else { // "input"
    answerAreaHTML = `
      <div class="step-input-row quiz-input-row">
        <input type="number" step="any" class="step-input" id="quiz-input"
               placeholder="?" onkeydown="if(event.key==='Enter') quizAnswerInput()">
        ${q.unit ? `<span class="step-unit">${q.unit}</span>` : ""}
        <button class="check-btn" onclick="quizAnswerInput()">Submit</button>
      </div>
    `;
  }

  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="quiz-progress">
      <span class="quiz-progress-label">Question ${num} of ${total}</span>
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${Math.round((num - 1) / total * 100)}%"></div>
      </div>
    </div>

    ${q.image ? `<img src="${q.image}" class="problem-image" style="${q.imageWidth ? `max-width:${q.imageWidth};` : ""}" alt="Question ${num}">` : ""}

    <div class="mcq-question">
      ${q.question}
    </div>

    ${answerAreaHTML}
  `);
}


// ── Results sub-page ──
function renderQuizResults() {
  const slide = moduleData[currentSlide];
  const rt    = getQuizRuntime();
  const total = slide.questions.length;
  const score = rt.answers.filter(a => a && a.correct).length;

  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="quiz-results">
      <div class="quiz-score-ring">
        <span class="quiz-score-num">${score}<span class="quiz-score-den">/${total}</span></span>
      </div>
      <p class="quiz-score-msg">${quizScoreMessage(score, total)}</p>

      <div class="quiz-results-actions">
        <button class="quiz-review-btn" onclick="quizToggleReview()">Review answers</button>
        <button class="quiz-retry-btn" onclick="quizRetry()">Retry quiz</button>
      </div>

      <div class="quiz-review quiz-review-hidden" id="quiz-review">
        <table class="quiz-review-table">
          <thead>
            <tr><th>#</th><th>Your answer</th><th>Correct answer</th></tr>
          </thead>
          <tbody>
            ${slide.questions.map((q, i) => {
              const a = rt.answers[i] || {};
              const correctText = quizCorrectAnswerText(q);
              return `
                <tr class="${a.correct ? "quiz-row-correct" : "quiz-row-wrong"}">
                  <td>${i + 1}</td>
                  <td>${a.givenText !== undefined ? a.givenText : "—"}</td>
                  <td>${correctText}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <p class="quiz-finish-hint">${quizFinishHint()}</p>
    </div>
  `);
}

// Instruction under the results — adapts to whether the end slide follows.
function quizFinishHint() {
  const next = moduleData[currentSlide + 1];
  if (next && typeDef(next).isEnd) {
    return `Click <strong>Finish</strong> below to complete the module.`;
  }
  return `Click <strong>Next</strong> below to continue.`;
}


// ── Quiz control functions ──

function quizStart() {
  const rt = getQuizRuntime();
  rt.stage = "question";
  rt.q = 0;
  rt.answers = [];
  renderQuiz();
}

// Record an MCQ answer, show correct/wrong briefly, then advance.
// Receives the ORIGINAL option index; maps to display position for highlighting.
function quizAnswerMCQ(origIndex) {
  const slide = moduleData[currentSlide];
  const rt    = getQuizRuntime();
  const q     = slide.questions[rt.q];
  const chosen = q.options[origIndex];
  const isCorrect = Boolean(chosen.correct);

  const order = rt.order[rt.q];                       // display order → original index
  const displayPos = order.indexOf(origIndex);        // where the clicked option sits

  // Lock all options
  document.querySelectorAll(".mcq-option").forEach(b => b.disabled = true);

  const btn = document.getElementById(`quiz-opt-${displayPos}`);
  if (isCorrect) {
    if (btn) btn.classList.add("mcq-option-correct");
  } else {
    if (btn) btn.classList.add("mcq-option-wrong-final");
    // Highlight the correct option (find its display position) for clear feedback
    const correctOrig = q.options.findIndex(o => o.correct);
    const correctPos  = order.indexOf(correctOrig);
    const correctBtn  = document.getElementById(`quiz-opt-${correctPos}`);
    if (correctBtn) correctBtn.classList.add("mcq-option-correct");
  }

  rt.answers[rt.q] = {
    correct:   isCorrect,
    givenText: chosen.text || `Option ${displayPos + 1}`
  };

  setTimeout(quizAdvance, 850);
}

// Record an input answer, show correct/wrong briefly, then advance.
function quizAnswerInput() {
  const slide = moduleData[currentSlide];
  const rt    = getQuizRuntime();
  const q     = slide.questions[rt.q];
  const input = document.getElementById("quiz-input");
  const val   = parseFloat(input.value);
  const tol   = q.tolerance !== undefined ? q.tolerance : 0.01;

  if (input.value.trim() === "" || isNaN(val)) {
    triggerBuzz(input);
    return; // don't consume the attempt on an empty/invalid submit
  }

  const isCorrect = Math.abs(val - q.answer) <= tol;

  input.disabled = true;
  document.querySelectorAll(".quiz-input-row .check-btn").forEach(b => b.disabled = true);
  input.classList.add(isCorrect ? "step-correct" : "step-incorrect-final");

  rt.answers[rt.q] = {
    correct:   isCorrect,
    givenText: String(val)
  };

  setTimeout(quizAdvance, 850);
}

// Move to the next question, or to results if finished.
function quizAdvance() {
  const slide = moduleData[currentSlide];
  const rt    = getQuizRuntime();

  if (rt.q < slide.questions.length - 1) {
    rt.q++;
    renderQuiz();
  } else {
    // Finished — go to results and mark the module slide complete
    rt.stage = "results";
    completedSlides.add(currentSlide);
    slideState[currentSlide] = { type: "quiz", answers: rt.answers.slice() };
    renderQuiz();
    // Re-sync footer/sidebar so the module Next unlocks
    updateLockState();
  }
}

function quizToggleReview() {
  const review = document.getElementById("quiz-review");
  if (review) review.classList.toggle("quiz-review-hidden");
}

function quizRetry() {
  const rt = quizRuntime[currentSlide];
  if (rt) {
    rt.stage = "intro";
    rt.q = 0;
    rt.answers = [];
    rt.order = {};        // clear shuffle so options re-randomise on the new attempt
  }
  renderQuiz();
}

// Helper: readable correct-answer text for the review table.
function quizCorrectAnswerText(q) {
  if (q.kind === "mcq") {
    const correct = q.options.find(o => o.correct);
    return correct ? (correct.text || "(image option)") : "—";
  }
  return `${q.answer}${q.unit ? " " + q.unit : ""}`;
}

// Helper: encouraging message based on score.
function quizScoreMessage(score, total) {
  const pct = score / total;
  if (pct === 1)    return "Perfect score — excellent work!";
  if (pct >= 0.7)   return "Well done — a strong result.";
  if (pct >= 0.4)   return "Good effort — review the answers to strengthen the tricky ones.";
  return "Keep going — review the answers and try again to build your confidence.";
}


registerSlideType("quiz", {
  icon: "📝",
  render: renderQuiz,
  isQuiz: true,

  // Lock module navigation (Back/Next/sidebar) while a question is on screen,
  // so the quiz's internal flow and the module nav can't conflict.
  navLocked: function (slide, index) {
    return Boolean(quizRuntime[index] && quizRuntime[index].stage === "question");
  }
});