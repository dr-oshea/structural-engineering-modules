const app = document.getElementById("app");

let currentSlide = 0;
const completedSlides = new Set(); // tracks completed "steps"/"mcq" slides by index
const slideState = {};             // persists answer state per slide index, e.g.
                                   //   slideState[3] = { type:"steps", answers:[4,8,16] }
                                   //   slideState[5] = { type:"mcq",   chosen:1 }

// Internal runtime state for the multi-question "quiz" type.
// Keyed by slide index so each quiz slide remembers its own progress.
//   quizRuntime[i] = { stage:"intro"|"question"|"results", q:0, answers:[...] }
const quizRuntime = {};


// ─── Quiz-slide helpers ───────────────────────────────────────────────────

// A slide is a "quiz" if it requires completion before the student can advance.
// Default: "steps", "mcq", and "hotspot" types are quiz. Override with quiz: true/false.
function isQuizSlide(index) {
  const s = moduleData[index];
  if (s.quiz !== undefined) return s.quiz;
  return s.type === "steps" || s.type === "mcq" || s.type === "hotspot" || s.type === "quiz";
}

// Returns the sidebar icon for a slide based on its type.
function getSlideIcon(s) {
  if (s.type === "splash")  return "🏁";
  if (s.type === "steps")   return "❓";
  if (s.type === "mcq")     return "❓";
  if (s.type === "hotspot") return "❓";
  if (s.type === "embed")   return "▶️";
  if (s.type === "reveal")  return "❓";
  if (s.type === "context") return "🌏";
  if (s.type === "quiz")    return "🧩";
  if (s.type === "final")   return "🏆";
  return "📒"; // info, cards, and any future informational types
}

// Returns the index of the first incomplete quiz slide — the current "gate".
// Slides at indices ≤ this value are accessible; everything beyond is locked.
// Returns moduleData.length (past the end) when all quizzes are complete.
function getFirstLockedIndex() {
  for (let i = 0; i < moduleData.length; i++) {
    if (isQuizSlide(i) && !completedSlides.has(i)) return i;
  }
  return moduleData.length; // no remaining gates — full module accessible
}


function renderLayout(contentHTML) {

  // Page counter excludes splash and final slides (neither is a content page)
  const contentSlides = moduleData.filter(s => s.type !== "splash" && s.type !== "final");
  const contentIndex  = contentSlides.indexOf(moduleData[currentSlide]) + 1;
  const totalContent  = contentSlides.length;
  const progressPct   = Math.round((contentIndex / totalContent) * 100);

  // Compute the current gate: index of the first incomplete quiz slide.
  // Slides ≤ lockedFromIndex are accessible; slides beyond are locked.
  const lockedFromIndex     = getFirstLockedIndex();
  const isCurrentQuizLocked = isQuizSlide(currentSlide) && !completedSlides.has(currentSlide);

  // If the next slide is a "final" slide, the forward button reads "Finish"
  const nextIsFinal  = moduleData[currentSlide + 1] && moduleData[currentSlide + 1].type === "final";
  const nextBtnLabel = nextIsFinal ? "Finish" : "Next →";

  // While a quiz is mid-flow (intro started, not yet at results), lock module
  // navigation so the quiz's internal flow and the module nav don't conflict.
  const quizInProgress = moduleData[currentSlide].type === "quiz"
                         && quizRuntime[currentSlide]
                         && quizRuntime[currentSlide].stage === "question";

  app.innerHTML = `
    <div class="layout">

      <!-- LEFT NAV -->
      <div class="sidebar">
        <h3>Module Contents</h3>
        <ul>
          ${moduleData.map((s, i) => {
            const isSplash    = s.type === "splash";
            const isFinal     = s.type === "final";
            const isNoNav     = isSplash || isFinal;   // neither is sidebar-navigable
            const isLocked    = i > lockedFromIndex;
            const isActive    = i === currentSlide;
            const isQuiz      = isQuizSlide(i);
            const isClickable = !isNoNav && !isActive;

            // Divider logic:
            // - Normal case: show AFTER the gate slide (last accessible), if
            //   there are locked slides beyond it.
            // - Final case: once all quizzes are done (gate past the content),
            //   show the divider just BEFORE the final slide.
            const hasFinal      = moduleData[moduleData.length - 1] &&
                                  moduleData[moduleData.length - 1].type === "final";
            const finalIndex    = hasFinal ? moduleData.length - 1 : -1;
            const gatePastEnd   = lockedFromIndex >= moduleData.length - 1;

            let showDivider = false;
            if (gatePastEnd && hasFinal) {
              // all quizzes complete — divider sits before the final slide
              showDivider = (i === finalIndex - 1);
            } else {
              // divider after the gate, if locked slides follow
              showDivider = (i === lockedFromIndex) && (i < moduleData.length - 1);
            }

            return `
              <li
                data-slide="${i}"
                class="${isActive ? "active" : ""}${isNoNav ? " sidebar-item-no-nav" : ""}${isLocked ? " sidebar-item-locked" : ""}${isQuiz && !isNoNav ? " sidebar-item-quiz" : ""}"
                ${isClickable ? `onclick="navigateToSlide(${i})"` : ""}
              >
                ${getSlideIcon(s)} ${s.label || `Slide ${i}`}
              </li>
              ${showDivider ? `<li class="sidebar-divider" aria-hidden="true"></li>` : ""}
            `;
          }).join("")}
        </ul>
        <div class="sidebar-logo-wrapper">
          <div class="sidebar-logo-box">
            <img src="../core/UNSW_logo.jpg" class="sidebar-logo" alt="UNSW Sydney">
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="main">
        <div class="slide">
          ${contentHTML}
        </div>
      </div>

    </div>

    <!-- GLOBAL FOOTER -->
    <div class="nav-footer">
      <button onclick="prevSlide()" ${currentSlide === 0 || quizInProgress ? "disabled" : ""}>← Back</button>

      <div class="footer-center">
        <span class="footer-page-label">Page ${contentIndex} of ${totalContent}</span>
        <div class="footer-progress-bar">
          <div class="footer-progress-fill" style="width: ${progressPct}%"></div>
        </div>
      </div>

      <button data-nav="next" onclick="handleForward()" ${currentSlide === moduleData.length - 1 || isCurrentQuizLocked ? "disabled" : ""}>${nextBtnLabel}</button>
    </div>
  `;
}


function renderSlide() {
  const slide = moduleData[currentSlide];

  // SPLASH (full screen, no sidebar)

  if (slide.type === "splash") {
    app.innerHTML = `
      <div class="splash-container">
        <div class="splash">
          <h1>${slide.title}</h1>
          <p>${slide.subtitle}</p>
          <button onclick="nextSlide()">
            ${slide.buttonText || "Start"}
          </button>
        </div>
      </div>
    `;
    return;
  }

  // FINAL (COMPLETION) SLIDE — full screen, splash-style, no sidebar/footer

  if (slide.type === "final") {
    app.innerHTML = `
      <div class="splash-container">
        <div class="splash final-card">
          <div class="final-trophy">🏆</div>
          <h1>${slide.title || "Well done!"}</h1>
          <p>${slide.subtitle || "You've completed this module."}</p>

          ${slide.showRating !== false ? `
            <div class="final-rating">
              <span class="final-rating-label">How useful was this module?</span>
              <div class="final-stars" id="final-stars">
                ${[1,2,3,4,5].map(n => `
                  <span class="final-star"
                        data-value="${n}"
                        onmouseover="hoverRating(${n})"
                        onmouseout="hoverRating(0)"
                        onclick="setRating(${n})">★</span>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <button class="final-save-btn" onclick="saveAndClose()">
            ${slide.buttonText || "Save and Close"}
          </button>

          ${slide.bugReportUrl ? `
            <a class="final-bug-link" href="${slide.bugReportUrl}" target="_blank" rel="noopener">
              🐞 Report a bug or give feedback
            </a>
          ` : ""}
        </div>
      </div>
    `;
    return;
  }


  // CONTEXT / MOTIVATION SLIDE — large image + short real-world framing

  if (slide.type === "context") {
  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="context-block">
      ${slide.image ? `<img src="${slide.image}" class="context-image" style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}" alt="${slide.title}">` : ""}
      <div class="context-text">
        ${slide.text || ""}
      </div>
    </div>
  `);
  }

  // INFO SLIDE

  if (slide.type === "info") {

    // Two supported formats:
    //   slide.blocks = [ {type:"text"|"image"|"equation", ...}, ... ]   (new, styled)
    //   slide.content = "<html>"                                        (legacy, still works)
    let bodyHTML = "";

    if (Array.isArray(slide.blocks)) {
      bodyHTML = slide.blocks.map(block => {
        if (block.type === "image") {
          return `<img src="${block.src}" class="info-block-image"
                       style="${block.width ? `max-width:${block.width};` : ""}"
                       alt="${block.alt || ""}">`;
        }
        if (block.type === "equation") {
          return `<div class="info-block info-block-equation">${block.html}</div>`;
        }
        // default: text block (question-style box)
        return `<div class="info-block">${block.html}</div>`;
      }).join("");
    } else {
      // Legacy single content string — wrap it in one styled block
      bodyHTML = `<div class="info-block">${slide.content || ""}</div>`;
    }

  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="info-body">
      ${bodyHTML}
    </div>

    ${
      slide.image
        ? `<img src="${slide.image}" class="slide-image"
                style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}">`
        : ""
    }
  `);
  }

  if (slide.type === "cards") {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.intro ? `<div class="cards-intro">${slide.intro}</div>` : ""}

    <div class="card-container">
      ${slide.cards.map(card => `
        <div class="card" onclick="this.classList.toggle('flipped')">
          <div class="card-inner">
            <div class="card-front">
              ${card.front}
            </div>
            <div class="card-back">
              ${card.back}
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `);
  }

  // STEPS (WORKED EXAMPLE) SLIDE

  if (slide.type === "steps") {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.image ? `<img src="${slide.image}" class="problem-image" style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}" alt="${slide.title}">` : ""}

    <div class="problem-statement">
      ${slide.problem}
    </div>

    <div class="steps-container" id="steps-container">
      ${slide.steps.map((step, i) => `
        <div class="step ${i > 0 ? "step-inactive" : ""}" id="step-${i}">
          <span class="step-badge">Step ${i + 1} of ${slide.steps.length}</span>
          <p class="step-instruction">${step.instruction}</p>
          ${step.image ? `<img src="${step.image}" class="step-image" alt="Step ${i + 1} figure">` : ""}
          <div class="step-input-row">
            <input
              type="number"
              step="any"
              class="step-input"
              id="input-${i}"
              placeholder="?"
              onkeydown="if(event.key==='Enter') checkStepAnswer(${i})"
            >
            ${step.unit ? `<span class="step-unit">${step.unit}</span>` : ""}
            <button class="check-btn" id="check-btn-${i}" onclick="checkStepAnswer(${i})">
              Check
            </button>
          </div>
          <div class="step-explanation step-explanation-hidden" id="explanation-${i}">
            <span class="explanation-tick">✓</span>
            <span>${step.explanation}</span>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="steps-complete steps-complete-hidden" id="steps-complete">
      🎉 Excellent work — you've completed this worked example!
    </div>
  `);

  restoreStepsState();   // replay any previously-entered correct answers
  }

  // MULTIPLE CHOICE (MCQ) SLIDE

  if (slide.type === "mcq") {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.image ? `<img src="${slide.image}" class="problem-image" style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}" alt="${slide.title}">` : ""}

    <div class="mcq-question">
      ${slide.question}
    </div>

    <div class="mcq-options mcq-cols-${slide.options.length === 3 ? 3 : 2}" id="mcq-options">
      ${slide.options.map((opt, i) => `
        <button class="mcq-option" id="mcq-opt-${i}" onclick="checkMCQAnswer(${i})">
          ${opt.image ? `<img src="${opt.image}" class="mcq-option-img" alt="Option ${i + 1}">` : ""}
          ${opt.text  ? `<span>${opt.text}</span>` : ""}
        </button>
      `).join("")}
    </div>

    ${slide.explanation ? `
      <div class="mcq-explanation mcq-explanation-hidden" id="mcq-explanation">
        <span class="explanation-tick">✓</span>
        <span>${slide.explanation}</span>
      </div>
    ` : ""}

    <div class="steps-complete steps-complete-hidden" id="mcq-complete">
      🎉 Correct — well done!
    </div>
  `);

  restoreMCQState();   // replay a previously-chosen correct answer
  }

  // EMBED SLIDE — GeoGebra / Desmos / video / any iframe-able interactive

  if (slide.type === "embed") {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.intro ? `<div class="info-block">${slide.intro}</div>` : ""}

    <div class="embed-frame-wrapper" style="${slide.aspectRatio ? `aspect-ratio:${slide.aspectRatio};` : ""}${slide.maxWidth ? `max-width:${slide.maxWidth};` : ""}">
      <iframe
        class="embed-frame"
        src="${slide.src}"
        title="${slide.title}"
        loading="lazy"
        allow="fullscreen; autoplay"
        allowfullscreen
      ></iframe>
    </div>

    ${slide.caption ? `<p class="embed-caption">${slide.caption}</p>` : ""}
  `);
  }

  // REVEAL SLIDE — a prompt with a "Show solution" toggle (no input required)

  if (slide.type === "reveal") {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.image ? `<img src="${slide.image}" class="problem-image" style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}" alt="${slide.title}">` : ""}

    <div class="problem-statement">
      ${slide.prompt}
    </div>

    <button class="reveal-btn" id="reveal-btn" onclick="toggleReveal()">
      ${slide.buttonText || "Show solution"}
    </button>

    <div class="reveal-answer reveal-answer-hidden" id="reveal-answer">
      ${slide.answer}
    </div>
  `);
  }

  // HOTSPOT SLIDE — click the correct region(s) on a diagram

  if (slide.type === "hotspot") {
  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="${isQuizSlide(currentSlide) ? "mcq-question" : "info-block"}">
      ${slide.prompt}
    </div>

    <div class="hotspot-stage" id="hotspot-stage" style="${slide.maxWidth ? `max-width:${slide.maxWidth};` : ""}">
      <img src="${slide.image}" class="hotspot-image" alt="${slide.title}">
      ${slide.hotspots.map((h, i) => `
        <button
          class="hotspot-region${slide.showMarkers === false ? "" : " hotspot-region-marked"}"
          id="hotspot-${i}"
          style="left:${h.x}%; top:${h.y}%; width:${h.w}%; height:${h.h}%;"
          onclick="checkHotspot(${i})"
          title="">
          ${slide.showMarkers === false ? "" : `<span class="hotspot-marker"></span>`}
        </button>
      `).join("")}
    </div>

    ${slide.explanation ? `
      <div class="mcq-explanation mcq-explanation-hidden" id="hotspot-explanation">
        <span class="explanation-tick">✓</span>
        <span>${slide.explanation}</span>
      </div>
    ` : ""}

    <div class="steps-complete steps-complete-hidden" id="hotspot-complete">
      🎉 Correct — well done!
    </div>
  `);

  restoreHotspotState();
  }

  // QUIZ (TEST YOUR KNOWLEDGE) — a multi-question sub-sequence in one slide

  if (slide.type === "quiz") {
    renderQuiz();
  }

}


// ═══════════════════════════════════════════════════════════════════════════
//  QUIZ TYPE  —  intro → N questions → results, all within one module slide
// ═══════════════════════════════════════════════════════════════════════════

// Ensure a runtime state object exists for the current quiz slide.
function getQuizRuntime() {
  if (!quizRuntime[currentSlide]) {
    quizRuntime[currentSlide] = {
      stage: "intro",   // "intro" | "question" | "results"
      q: 0,             // current question index
      answers: []       // answers[i] = { given, correct: true/false }
    };
  }
  return quizRuntime[currentSlide];
}

// Master render for the quiz slide — dispatches based on internal stage.
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

  // Body differs by question kind
  let answerAreaHTML = "";

  if (q.kind === "mcq") {
    // Build (once per visit) a shuffled display order for this question's options,
    // unless the question opts out with shuffle:false.
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

// Instruction under the results — adapts to whether a final slide follows.
function quizFinishHint() {
  const next = moduleData[currentSlide + 1];
  if (next && next.type === "final") {
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
    // Re-render footer/sidebar so the module Next unlocks
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

// Helper: Fisher-Yates shuffle, returns a new array (doesn't mutate input).
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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


// ─── Reveal: toggle the solution ──────────────────────────────────────────

function toggleReveal() {
  const answer = document.getElementById("reveal-answer");
  const btn    = document.getElementById("reveal-btn");
  const slide  = moduleData[currentSlide];

  const isHidden = answer.classList.contains("reveal-answer-hidden");
  answer.classList.toggle("reveal-answer-hidden");
  btn.textContent = isHidden
    ? (slide.hideText || "Hide solution")
    : (slide.buttonText || "Show solution");
  if (isHidden) {
    answer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ─── Hotspot: check a clicked region ──────────────────────────────────────

function checkHotspot(index) {
  const slide   = moduleData[currentSlide];
  const hotspot = slide.hotspots[index];
  const btn     = document.getElementById(`hotspot-${index}`);

  if (hotspot.correct) {

    // ── CORRECT ──
    btn.classList.add("hotspot-correct");
    // Lock all regions
    document.querySelectorAll(".hotspot-region").forEach(b => b.disabled = true);

    const expl = document.getElementById("hotspot-explanation");
    if (expl) expl.classList.remove("mcq-explanation-hidden");

    // Persist (only meaningful if this slide is a quiz)
    slideState[currentSlide] = { type: "hotspot", chosen: index };

    setTimeout(() => {
      if (isQuizSlide(currentSlide)) {
        completedSlides.add(currentSlide);
        updateLockState();
      }
      const done = document.getElementById("hotspot-complete");
      if (done) {
        done.classList.remove("steps-complete-hidden");
        done.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 600);

  } else {

    // ── INCORRECT ──
    triggerBuzz(btn);
    btn.classList.add("hotspot-wrong");
    setTimeout(() => btn.classList.remove("hotspot-wrong"), 600);

  }
}

function restoreHotspotState() {
  const state = slideState[currentSlide];
  if (!state || state.type !== "hotspot") return;

  const btn = document.getElementById(`hotspot-${state.chosen}`);
  if (btn) btn.classList.add("hotspot-correct");
  document.querySelectorAll(".hotspot-region").forEach(b => b.disabled = true);

  const expl = document.getElementById("hotspot-explanation");
  if (expl) expl.classList.remove("mcq-explanation-hidden");

  const done = document.getElementById("hotspot-complete");
  if (done) done.classList.remove("steps-complete-hidden");
}

// ─── MCQ: check answer ────────────────────────────────────────────────────

function checkMCQAnswer(optionIndex) {
  const slide  = moduleData[currentSlide];
  const option = slide.options[optionIndex];
  const btn    = document.getElementById(`mcq-opt-${optionIndex}`);

  if (option.correct) {

    // ── CORRECT ──────────────────────────────────────────────────────────
    btn.classList.add("mcq-option-correct");

    // Disable all options; dim every one except the correct answer
    document.querySelectorAll(".mcq-option").forEach(b => {
      b.disabled = true;
      if (!b.classList.contains("mcq-option-correct")) {
        b.classList.add("mcq-option-done");
      }
    });

    // Show explanation if the slide defines one
    const expl = document.getElementById("mcq-explanation");
    if (expl) expl.classList.remove("mcq-explanation-hidden");

    // Persist the chosen correct answer so it survives navigation
    slideState[currentSlide] = { type: "mcq", chosen: optionIndex };

    // Unlock navigation after a short pause
    setTimeout(() => {
      completedSlides.add(currentSlide);
      updateLockState();
      const done = document.getElementById("mcq-complete");
      done.classList.remove("steps-complete-hidden");
      done.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 700);

  } else {

    // ── INCORRECT ────────────────────────────────────────────────────────
    triggerBuzz(btn);
    // Disable this option after the buzz so the student can't re-try it
    setTimeout(() => {
      btn.disabled = true;
      btn.classList.add("mcq-option-wrong");
    }, 450);

  }
}



function checkStepAnswer(stepIndex) {
  const slide     = moduleData[currentSlide];
  const step      = slide.steps[stepIndex];
  const input     = document.getElementById(`input-${stepIndex}`);
  const val       = parseFloat(input.value);
  const tolerance = step.tolerance !== undefined ? step.tolerance : 0.01;

  // Empty or non-numeric entry
  if (input.value.trim() === "" || isNaN(val)) {
    triggerBuzz(input);
    return;
  }

  if (Math.abs(val - step.answer) <= tolerance) {

    // ── CORRECT ──────────────────────────────────────────────────────────
    input.classList.add("step-correct");
    input.disabled = true;

    const btn = document.getElementById(`check-btn-${stepIndex}`);
    btn.textContent = "✓ Correct";
    btn.disabled = true;

    // Reveal explanation
    document.getElementById(`explanation-${stepIndex}`)
            .classList.remove("step-explanation-hidden");

    // Persist this correct answer so it survives navigation
    if (!slideState[currentSlide]) {
      slideState[currentSlide] = { type: "steps", answers: [] };
    }
    slideState[currentSlide].answers[stepIndex] = val;

    // After a short pause, activate the next step (or show completion)
    setTimeout(() => {
      const nextStepEl = document.getElementById(`step-${stepIndex + 1}`);
      if (nextStepEl) {
        // Activate next step — CSS transition handles the smooth fade-in
        nextStepEl.classList.remove("step-inactive");
        nextStepEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const nextInput = document.getElementById(`input-${stepIndex + 1}`);
        if (nextInput) nextInput.focus();
      } else {
        // All steps complete — unlock navigation
        completedSlides.add(currentSlide);
        updateLockState();
        const done = document.getElementById("steps-complete");
        done.classList.remove("steps-complete-hidden");
        done.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 700);

  } else {

    // ── INCORRECT ────────────────────────────────────────────────────────
    triggerBuzz(input);

  }
}

function triggerBuzz(element) {
  element.classList.remove("buzz");  // reset if mid-animation
  void element.offsetWidth;          // force reflow so animation restarts
  element.classList.add("buzz");
}


// ─── Restore saved quiz state on re-visit ─────────────────────────────────

// Replays previously-entered correct answers for the current steps slide,
// re-creating the completed look (filled inputs, ticks, explanations, unlocked steps).
function restoreStepsState() {
  const state = slideState[currentSlide];
  if (!state || state.type !== "steps") return;

  const slide = moduleData[currentSlide];

  state.answers.forEach((val, i) => {
    if (val === undefined) return;

    const input = document.getElementById(`input-${i}`);
    const btn   = document.getElementById(`check-btn-${i}`);
    const expl  = document.getElementById(`explanation-${i}`);
    const stepEl = document.getElementById(`step-${i}`);

    if (input) {
      input.value = val;
      input.classList.add("step-correct");
      input.disabled = true;
    }
    if (btn) {
      btn.textContent = "✓ Correct";
      btn.disabled = true;
    }
    if (expl) expl.classList.remove("step-explanation-hidden");
    if (stepEl) stepEl.classList.remove("step-inactive");

    // Activate the following step (so the next unanswered one is interactive)
    const nextStep = document.getElementById(`step-${i + 1}`);
    if (nextStep) nextStep.classList.remove("step-inactive");
  });

  // If every step was answered, show the completion banner
  if (completedSlides.has(currentSlide)) {
    const done = document.getElementById("steps-complete");
    if (done) done.classList.remove("steps-complete-hidden");
  }
}

// Replays a previously-chosen correct MCQ answer.
function restoreMCQState() {
  const state = slideState[currentSlide];
  if (!state || state.type !== "mcq") return;

  const btn = document.getElementById(`mcq-opt-${state.chosen}`);
  if (btn) btn.classList.add("mcq-option-correct");

  // Disable and dim all options
  document.querySelectorAll(".mcq-option").forEach(b => {
    b.disabled = true;
    if (!b.classList.contains("mcq-option-correct")) {
      b.classList.add("mcq-option-done");
    }
  });

  const expl = document.getElementById("mcq-explanation");
  if (expl) expl.classList.remove("mcq-explanation-hidden");

  const done = document.getElementById("mcq-complete");
  if (done) done.classList.remove("steps-complete-hidden");
}


// ─── Final slide: star rating + save ──────────────────────────────────────

let selectedRating = 0; // 0 = not yet rated

// Visually fill stars up to `n` (used for both hover preview and locked-in rating)
function paintStars(n) {
  document.querySelectorAll(".final-star").forEach(star => {
    const v = parseInt(star.dataset.value);
    star.classList.toggle("final-star-filled", v <= n);
  });
}

function hoverRating(n) {
  // On mouse-out (n === 0), fall back to the locked-in selection
  paintStars(n === 0 ? selectedRating : n);
}

function setRating(n) {
  selectedRating = n;
  paintStars(n);
}

// Saves completion via the backend (api.js). Tracking is OPTIONAL — if api.js
// isn't loaded, or no backend is configured, this still updates the button and
// the student is unaffected.
async function saveAndClose() {
  const moduleId = (typeof moduleMeta !== "undefined" && moduleMeta.id)
                   ? moduleMeta.id : "unknown";

  const btn = document.querySelector(".final-save-btn");
  if (btn) {
    btn.textContent = "Saving…";
    btn.disabled = true;
  }

  // recordCompletion lives in core/api.js. It returns true if it actually sent.
  // If api.js isn't present (modules used standalone), fall back gracefully.
  let sent = false;
  if (typeof recordCompletion === "function") {
    sent = await recordCompletion({ moduleId, rating: selectedRating || null });
  } else {
    console.log("[module] api.js not loaded — completion not tracked (this is fine).");
  }

  if (btn) {
    btn.textContent = sent ? "✓ Saved" : "✓ Done";
  }

  // OPTIONAL: if you later want to auto-close or return to the homepage, you
  // could do it here, e.g. window.location.href = "../homepage/index.html?...".
}





// ─── Navigation gating ────────────────────────────────────────────────────

// All sidebar items call this instead of goToSlide directly.
// It silently blocks splash navigation and forward jumps past incomplete steps.
function navigateToSlide(index) {
  if (moduleData[index].type === "splash") return;
  if (moduleData[index].type === "final")  return;

  // Don't allow leaving a quiz that's mid-flow (would lose progress / desync nav)
  const cur = moduleData[currentSlide];
  if (cur.type === "quiz"
      && quizRuntime[currentSlide]
      && quizRuntime[currentSlide].stage === "question") {
    return;
  }

  // Block navigation to any slide beyond the current gate
  if (index > getFirstLockedIndex()) return;

  goToSlide(index);
}

// Called after a steps slide is completed to re-enable the Next button
// and remove the locked visual state from sidebar items, without re-rendering.
function updateLockState() {
  const lockedFromIndex     = getFirstLockedIndex();
  const isCurrentQuizLocked = isQuizSlide(currentSlide) && !completedSlides.has(currentSlide);

  const nextBtn = document.querySelector("[data-nav='next']");
  if (nextBtn) {
    nextBtn.disabled = (currentSlide === moduleData.length - 1) || isCurrentQuizLocked;
  }

  document.querySelectorAll(".sidebar li[data-slide]").forEach(li => {
    const i = parseInt(li.dataset.slide);
    li.classList.toggle("sidebar-item-locked", i > lockedFromIndex);
  });

  // Move the block divider to sit after the new gate slide (or before Final
  // once all quizzes are complete). Mirrors the logic in renderLayout.
  const existingDivider = document.querySelector(".sidebar-divider");
  if (existingDivider) existingDivider.remove();

  const hasFinal    = moduleData[moduleData.length - 1] &&
                      moduleData[moduleData.length - 1].type === "final";
  const gatePastEnd = lockedFromIndex >= moduleData.length - 1;

  let dividerAfterIndex = -1;
  if (gatePastEnd && hasFinal) {
    dividerAfterIndex = moduleData.length - 2;   // before the final slide
  } else if (lockedFromIndex < moduleData.length - 1) {
    dividerAfterIndex = lockedFromIndex;         // after the gate slide
  }

  if (dividerAfterIndex >= 0) {
    const gateLi = document.querySelector(`.sidebar li[data-slide="${dividerAfterIndex}"]`);
    if (gateLi) {
      const divider = document.createElement("li");
      divider.className = "sidebar-divider";
      divider.setAttribute("aria-hidden", "true");
      gateLi.insertAdjacentElement("afterend", divider);
    }
  }
}


// Forward button handler — implements the two-click "Finish → Confirm" flow
// when the next slide is a final slide; otherwise just advances normally.
let awaitingFinishConfirm = false;

function handleForward() {
  const nextIsFinal = moduleData[currentSlide + 1]
                      && moduleData[currentSlide + 1].type === "final";

  if (nextIsFinal) {
    const btn = document.querySelector("[data-nav='next']");
    if (!awaitingFinishConfirm) {
      // First click — ask for confirmation
      awaitingFinishConfirm = true;
      if (btn) {
        btn.textContent = "Confirm?";
        btn.classList.add("nav-confirm");
      }
      return;
    }
    // Second click — proceed to the final slide
    awaitingFinishConfirm = false;
  }

  nextSlide();
}

function nextSlide() {
  if (currentSlide < moduleData.length - 1) {
    currentSlide++;
    renderSlide();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    awaitingFinishConfirm = false;   // reset finish-confirm when going back
    currentSlide--;
    renderSlide();
  }
}


function goToSlide(index) {
  awaitingFinishConfirm = false;   // reset finish-confirm if navigating elsewhere
  currentSlide = index;
  renderSlide();
}


renderSlide();