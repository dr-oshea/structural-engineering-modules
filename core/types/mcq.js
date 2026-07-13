/* ============================================================================
   types/mcq.js — single multiple-choice question slide.

   Retry-until-correct: a wrong answer buzzes and is disabled; the student
   keeps trying. Answering correctly unlocks module navigation (quiz-gating).

   Config fields:
     title        Heading
     image        Optional figure above the question (imageWidth to size it)
     question     HTML question (teal-accent box)
     options      Array of { text?, image?, correct? } — exactly one correct:true
                  (options can be text, image, or both)
     explanation  Optional HTML revealed on the correct answer
     label        Sidebar label
   ============================================================================ */

function renderMCQSlide(slide) {
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


// Replays a previously-chosen correct MCQ answer on re-visit.
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

registerSlideType("mcq", {
  icon: "❓",
  render: renderMCQSlide,
  isQuiz: true
});