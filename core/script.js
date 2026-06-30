const app = document.getElementById("app");

let currentSlide = 0;
const completedSlides = new Set(); // tracks completed "steps"/"mcq" slides by index
const slideState = {};             // persists answer state per slide index, e.g.
                                   //   slideState[3] = { type:"steps", answers:[4,8,16] }
                                   //   slideState[5] = { type:"mcq",   chosen:1 }


// ─── Quiz-slide helpers ───────────────────────────────────────────────────

// A slide is a "quiz" if it requires completion before the student can advance.
// Default: "steps" and "mcq" types are quiz. Override explicitly with quiz: true/false in config.
function isQuizSlide(index) {
  const s = moduleData[index];
  if (s.quiz !== undefined) return s.quiz;
  return s.type === "steps" || s.type === "mcq";
}

// Returns the sidebar icon for a slide based on its type.
function getSlideIcon(s) {
  if (s.type === "splash") return "🏁";
  if (s.type === "steps")  return "🧮";
  if (s.type === "mcq")    return "❓";
  if (s.type === "final")  return "🏆";
  return "📖"; // info, cards, and any future informational types
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
            return `
              <li
                data-slide="${i}"
                class="${isActive ? "active" : ""}${isNoNav ? " sidebar-item-no-nav" : ""}${isLocked ? " sidebar-item-locked" : ""}${isQuiz && !isNoNav ? " sidebar-item-quiz" : ""}"
                ${isClickable ? `onclick="navigateToSlide(${i})"` : ""}
              >
                ${getSlideIcon(s)} ${s.label || `Slide ${i}`}
              </li>
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
      <button onclick="prevSlide()" ${currentSlide === 0 ? "disabled" : ""}>← Back</button>

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

// Stub for future database integration.
// The payload below is everything you'd POST to your backend later.
function saveAndClose() {
  const payload = {
    module:    (typeof moduleMeta !== "undefined" && moduleMeta.id) ? moduleMeta.id : "unknown",
    completed: true,
    rating:    selectedRating || null,
    timestamp: new Date().toISOString()
  };

  // TODO: replace this with a real fetch() to your completion-tracking endpoint, e.g.
  //   fetch("/api/module-completion", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload)
  //   });
  console.log("Module completion payload (stub):", payload);

  // Simple confirmation for now
  const btn = document.querySelector(".final-save-btn");
  if (btn) {
    btn.textContent = "✓ Saved";
    btn.disabled = true;
  }
}




// ─── Navigation gating ────────────────────────────────────────────────────

// All sidebar items call this instead of goToSlide directly.
// It silently blocks splash navigation and forward jumps past incomplete steps.
function navigateToSlide(index) {
  if (moduleData[index].type === "splash") return;
  if (moduleData[index].type === "final")  return;

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