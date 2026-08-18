/* ============================================================================
   types/mcq.js — multiple-choice question(s).

   Retry-until-correct: a wrong option buzzes and is disabled; the student
   keeps trying until they get it right. Completing the slide unlocks it.

   ── ONE QUESTION (unchanged behaviour) ──
     { type: "mcq",
       label: "Quiz: Max Bending Moment",
       title: "Multiple Choice: Bending Moment",
       image: "images/beam.svg",          // optional figure above the question
       question: `<p>…</p>`,
       options: [
         { text: "40 kNm" },
         { text: "80 kNm", correct: true },   // exactly ONE correct
         { text: "160 kNm" }
       ],
       explanation: `Shown once answered correctly.`
     }

   ── SEVERAL QUESTIONS (one sidebar entry, asked in sequence) ──
   Supply a `questions` array instead. Each entry takes the same fields as a
   single question (question, options, explanation, image, imageWidth…).

     { type: "mcq",
       label: "Check Your Understanding",
       title: "Check Your Understanding",
       questions: [
         { question: `<p>First question…</p>`,
           options: [ { text: "A" }, { text: "B", correct: true } ],
           explanation: `Why B is right.` },
         { question: `<p>Second question…</p>`,
           options: [ { text: "C", correct: true }, { text: "D" } ],
           explanation: `Why C is right.` }
       ]
     }

   With more than one question the slide shows "Question X of N" and a
   progress bar, and a **Next question** button appears once the answer is
   correct — so the student reads the explanation before moving on. There is
   no going back. The slide completes when the LAST question is answered
   correctly.

   Progress is remembered if the student navigates away and returns.

   ── SELECT-ALL-THAT-APPLY ──
   Add `multi: true` to a question and it becomes a multi-select: the student
   ticks any number of options and presses Submit. Mark every correct option
   with `correct: true`.

     { multi: true,
       question: `<p>Which assumptions are required?</p>`,
       options: [
         { text: "All connections pinned",       correct: true },
         { text: "Loads applied only at joints", correct: true },
         { text: "Members of equal length" }
       ],
       showCount: true,        // optional: tell them HOW MANY to pick
       explanation: `…` }

   Single-answer questions keep their IMMEDIATE feedback — a wrong option
   buzzes and greys out, a right one turns green. A multi-select can't do that
   (a half-finished selection isn't wrong yet), so it waits for Submit, and a
   wrong combination is simply "not quite, try again" with nothing marked. The
   answer is the SET: it's right or wrong, never partly right.

   Other fields: label (sidebar), title (heading)
   ============================================================================ */


// Normalises either shape into an array of question objects.
function mcqQuestions(slide) {
  if (Array.isArray(slide.questions) && slide.questions.length) return slide.questions;
  return [{
    question:    slide.question,
    options:     slide.options,
    explanation: slide.explanation,
    image:       slide.image,
    imageWidth:  slide.imageWidth,
    imageHeight: slide.imageHeight,
    imageScale:  slide.imageScale
  }];
}

// Per-slide progress: which question we're on, and which are already answered.
function mcqState() {
  if (!slideState[currentSlide] || slideState[currentSlide].type !== "mcq") {
    slideState[currentSlide] = { type: "mcq", q: 0, chosen: {} };
  }
  const st = slideState[currentSlide];
  // Migrate the older single-question shape ({ type:"mcq", chosen: 2 })
  if (typeof st.chosen === "number") {
    st.chosen = { 0: st.chosen };
    st.q = 0;
  }
  if (st.q === undefined) st.q = 0;
  if (!st.chosen) st.chosen = {};
  return st;
}


function renderMCQSlide(slide) {
  const qs    = mcqQuestions(slide);
  const st    = mcqState();
  const multi = qs.length > 1;
  const idx   = Math.min(st.q, qs.length - 1);
  const q     = qs[idx];

  renderLayout(`
    <h2>${slide.title}</h2>

    ${multi ? `
      <div class="quiz-progress">
        <span class="quiz-progress-label">Question ${idx + 1} of ${qs.length}</span>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" id="mcq-progress-fill"
               style="width:${Math.round(idx / qs.length * 100)}%"></div>
        </div>
      </div>
    ` : ""}

    ${q.image ? `<img src="${q.image}" class="problem-image" style="${imageSizeStyle(q)}" alt="${slide.title}">` : ""}

    <div class="mcq-question">
      ${q.question}
    </div>

    ${q.multi ? `
      <p class="mcq-multi-instruction">
        Select all that apply${q.showCount
          ? ` — <strong>${q.options.filter(o => o.correct).length}</strong> are correct`
          : ""}.
      </p>` : ""}

    <div class="mcq-options mcq-cols-${q.options.length === 3 ? 3 : 2}" id="mcq-options">
      ${q.options.map((opt, i) => `
        <button class="mcq-option${q.multi ? " mcq-option-check" : ""}"
                id="mcq-opt-${i}"
                onclick="${q.multi ? `mcqToggleOption(${i})` : `checkMCQAnswer(${i})`}">
          ${q.multi ? `<span class="mcq-tick" aria-hidden="true"></span>` : ""}
          ${opt.image ? `<img src="${opt.image}" class="mcq-option-img" alt="Option ${i + 1}">` : ""}
          ${opt.text  ? `<span>${opt.text}</span>` : ""}
        </button>
      `).join("")}
    </div>

    ${q.multi ? `
      <button class="mcq-submit-btn" id="mcq-submit" onclick="mcqSubmitMulti()" disabled>
        Submit
      </button>
      <p class="mcq-retry-note mcq-retry-hidden" id="mcq-retry-note">
        Not quite — adjust your selection and submit again.
      </p>` : ""}

    ${q.explanation ? `
      <div class="mcq-explanation mcq-explanation-hidden" id="mcq-explanation">
        <span class="explanation-tick">✓</span>
        <span>${q.explanation}</span>
      </div>
    ` : ""}

    ${multi && idx < qs.length - 1 ? `
      <button class="mcq-next-btn mcq-next-hidden" id="mcq-next-btn" onclick="mcqNextQuestion()">
        Next question →
      </button>
    ` : ""}

    <div class="steps-complete steps-complete-hidden" id="mcq-complete">
      ${multi ? "🎉 All questions answered — well done!" : "🎉 Correct — well done!"}
    </div>
  `);

  restoreMCQState();   // replay an answer already given for this question
}


// ─── Multi-select ───────────────────────────────────────────────────────────

// Tick or untick an option. Nothing is judged until Submit — a partly-made
// selection isn't wrong yet, so marking it would be misleading.
function mcqToggleOption(i) {
  const btn = document.getElementById(`mcq-opt-${i}`);
  if (!btn || btn.disabled) return;
  btn.classList.toggle("mcq-option-ticked");

  // Submit needs at least one tick. ("None of the above" belongs in the
  // options if it's a valid answer, rather than being an empty selection.)
  const any = document.querySelectorAll(".mcq-option-ticked").length > 0;
  const sub = document.getElementById("mcq-submit");
  if (sub) sub.disabled = !any;

  const note = document.getElementById("mcq-retry-note");
  if (note) note.classList.add("mcq-retry-hidden");
}

function mcqTickedIndices() {
  const out = [];
  document.querySelectorAll(".mcq-option").forEach((b, i) => {
    if (b.classList.contains("mcq-option-ticked")) out.push(i);
  });
  return out;
}

// Judge the whole SET. It matches or it doesn't — there's no partial credit,
// because the answer is the combination.
function mcqSubmitMulti() {
  const slide  = moduleData[currentSlide];
  const qs     = mcqQuestions(slide);
  const st     = mcqState();
  const idx    = Math.min(st.q, qs.length - 1);
  const q      = qs[idx];
  const isLast = idx === qs.length - 1;

  const picked  = mcqTickedIndices();
  const correct = q.options.map((o, i) => (o.correct ? i : -1)).filter(i => i >= 0);
  const ok = picked.length === correct.length
             && correct.every(i => picked.indexOf(i) !== -1);

  if (!ok) {
    // Say nothing about WHICH are wrong — that would give the set away
    const note = document.getElementById("mcq-retry-note");
    if (note) {
      note.classList.remove("mcq-retry-hidden");
      triggerBuzz(note);
    }
    return;
  }

  // Correct: lock it in
  document.querySelectorAll(".mcq-option").forEach((b, i) => {
    b.disabled = true;
    if (picked.indexOf(i) !== -1) b.classList.add("mcq-option-correct");
    else b.classList.add("mcq-option-done");
  });
  const sub = document.getElementById("mcq-submit");
  if (sub) sub.disabled = true;

  const expl = document.getElementById("mcq-explanation");
  if (expl) expl.classList.remove("mcq-explanation-hidden");

  st.chosen[idx] = picked.slice();

  const fill = document.getElementById("mcq-progress-fill");
  if (fill) fill.style.width = `${Math.round((idx + 1) / qs.length * 100)}%`;

  setTimeout(() => {
    if (isLast) {
      completedSlides.add(currentSlide);
      updateLockState();
      const done = document.getElementById("mcq-complete");
      if (done) {
        done.classList.remove("steps-complete-hidden");
        done.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } else {
      const next = document.getElementById("mcq-next-btn");
      if (next) {
        next.classList.remove("mcq-next-hidden");
        next.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, 500);
}


function checkMCQAnswer(optionIndex) {
  const slide  = moduleData[currentSlide];
  const qs     = mcqQuestions(slide);
  const st     = mcqState();
  const idx    = Math.min(st.q, qs.length - 1);
  const multi  = qs.length > 1;
  const isLast = idx === qs.length - 1;
  const option = qs[idx].options[optionIndex];
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

    // Show the explanation for THIS question
    const expl = document.getElementById("mcq-explanation");
    if (expl) expl.classList.remove("mcq-explanation-hidden");

    // Remember the answer so it survives navigation
    st.chosen[idx] = optionIndex;

    // Advance the progress bar to include the question just answered — so the
    // final question fills the bar completely rather than stopping short.
    const fill = document.getElementById("mcq-progress-fill");
    if (fill) fill.style.width = `${Math.round((idx + 1) / qs.length * 100)}%`;

    setTimeout(() => {
      if (isLast) {
        // Final (or only) question — the slide is complete
        completedSlides.add(currentSlide);
        updateLockState();
        const done = document.getElementById("mcq-complete");
        if (done) {
          done.classList.remove("steps-complete-hidden");
          done.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      } else {
        // More to come — reveal the Next button so the student reads the
        // explanation before advancing (no auto-advance here, by design).
        const next = document.getElementById("mcq-next-btn");
        if (next) {
          next.classList.remove("mcq-next-hidden");
          next.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }, multi ? 500 : 700);

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


// Advance to the next question (multi-question slides only).
function mcqNextQuestion() {
  const st = mcqState();
  st.q += 1;
  renderSlide();
}


// Replays the answer already given for the CURRENT question, if any.
function restoreMCQState() {
  const slide = moduleData[currentSlide];
  const qs    = mcqQuestions(slide);
  const st    = mcqState();
  const idx   = Math.min(st.q, qs.length - 1);

  const chosen = st.chosen[idx];
  if (chosen === undefined) return;   // this question not yet answered

  // A multi-select stores an ARRAY of indices; a single answer stores one
  const picked = Array.isArray(chosen) ? chosen : [chosen];
  picked.forEach(i => {
    const b = document.getElementById(`mcq-opt-${i}`);
    if (b) b.classList.add("mcq-option-correct");
  });

  document.querySelectorAll(".mcq-option").forEach(b => {
    b.disabled = true;
    if (!b.classList.contains("mcq-option-correct")) {
      b.classList.add("mcq-option-done");
    }
  });
  const sub = document.getElementById("mcq-submit");
  if (sub) sub.disabled = true;

  const expl = document.getElementById("mcq-explanation");
  if (expl) expl.classList.remove("mcq-explanation-hidden");

  // This question is already answered, so the bar includes it
  const fill = document.getElementById("mcq-progress-fill");
  if (fill) fill.style.width = `${Math.round((idx + 1) / qs.length * 100)}%`;

  // Re-show whichever control follows
  if (idx === qs.length - 1) {
    const done = document.getElementById("mcq-complete");
    if (done) done.classList.remove("steps-complete-hidden");
  } else {
    const next = document.getElementById("mcq-next-btn");
    if (next) next.classList.remove("mcq-next-hidden");
  }
}

registerSlideType("mcq", {
  icon: "📝",
  render: renderMCQSlide,
  isQuiz: true
});