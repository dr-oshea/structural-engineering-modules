/* ============================================================================
   types/steps.js — Worked Example: guided multi-step problem.

   Steps appear all at once; only the current step is active (others dimmed).
   A correct answer activates the next step. Completing all steps unlocks
   module navigation (this is a quiz-gating type).

   Config fields:
     title        Heading
     image        Optional figure above the problem (imageWidth to size it)
     problem      HTML problem statement (blue-accent box)
     steps        Array of step objects:
       instruction   HTML question/prompt
       image         Optional per-step hint figure
       unit          Optional unit label beside the input, e.g. "kN"
       answer        Correct numerical value
       tolerance     Accepted margin (default 0.01)
       explanation   Revealed on a correct answer
     label        Sidebar label
   ============================================================================ */

function renderStepsSlide(slide) {
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


// Replays previously-entered correct answers on re-visit, re-creating the
// completed look (filled inputs, ticks, explanations, unlocked steps).
function restoreStepsState() {
  const state = slideState[currentSlide];
  if (!state || state.type !== "steps") return;

  state.answers.forEach((val, i) => {
    if (val === undefined) return;

    const input  = document.getElementById(`input-${i}`);
    const btn    = document.getElementById(`check-btn-${i}`);
    const expl   = document.getElementById(`explanation-${i}`);
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

registerSlideType("steps", {
  icon: "🧮",
  render: renderStepsSlide,
  isQuiz: true
});