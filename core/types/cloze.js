/* ============================================================================
   types/cloze.js — fill in the blanks from a word bank.

   Students click a word in the bank, then click a blank to place it. Clicking
   a placed word sends it back to the bank. Check marks every blank at once;
   wrong ones are flagged and can be redone until all are right.

   Click-to-place rather than drag-and-drop: HTML5 dragging doesn't work on
   touch devices, and these modules are opened on phones from Moodle. Clicking
   works with a mouse, a finger and a keyboard alike.

   ── AUTHORING ──
   Write the passage and wrap each answer in [[double brackets]]. The word bank
   is built from those answers plus any distractors, shuffled:

     { type: "cloze",
       label: "Truss Members",
       title: "Truss Members",
       intro: `<p>Complete the sentences below.</p>`,
       text: `<p>(1) [[roof sheeting]] connects to the</p>
              <p>(2) [[purlins]] which connect to the</p>
              <p>(3) [[truss joints]].</p>`,
       distractors: ["rafters", "bracing"],      // never fit anywhere
       explanation: `Shown once every blank is right.` }

   Nothing has to be kept in sync — the answer key IS the passage.

   ── FIELDS ──
     title, label       as usual
     intro              optional HTML above the passage
     text               the passage, with [[answers]] marked (required)
     distractors        extra words for the bank that fit no blank
     image / imageWidth optional figure beside or under the passage
     imagePosition      "right" (default) or "below"
     checkText          Check button label
     explanation        revealed when everything is correct
     hint / hintCollapsed   optional help, as elsewhere

   Words are used ONCE: placing a word removes it from the bank, and there may
   be more words than blanks.
   ============================================================================ */


// Splits the passage into literal HTML and blanks.
// Returns [{ html }, { blank: 0, answer: "roof sheeting" }, { html }, …]
function clozeParse(text) {
  const parts = [];
  const re = /\[\[(.+?)\]\]/g;
  let last = 0, m, n = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ html: text.slice(last, m.index) });
    parts.push({ blank: n++, answer: m[1].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ html: text.slice(last) });
  return parts;
}

function clozeAnswers(slide) {
  return clozeParse(slide.text || "").filter(p => p.blank !== undefined);
}


// ─── State ──────────────────────────────────────────────────────────────────
//   bank     [{ id, text }]  the shuffled word bank, fixed for the session
//   placed   { blankIndex: bankId }
//   selected the bank id currently picked up, or null
//   status   { blankIndex: "correct" | "wrong" } after a Check
function clozeState() {
  const st = slideState[currentSlide];
  if (st && st.type === "cloze") return st;

  const slide = moduleData[currentSlide];
  const words = clozeAnswers(slide).map(a => a.answer)
                  .concat(slide.distractors || []);
  const bank = shuffleArray(words.map((w, i) => i))
                 .map(i => ({ id: i, text: words[i] }));

  slideState[currentSlide] = {
    type: "cloze", bank, placed: {}, selected: null, status: {}
  };
  return slideState[currentSlide];
}

// Which bank ids are still unplaced?
function clozeAvailable(st) {
  const used = new Set(Object.values(st.placed));
  return st.bank.filter(w => !used.has(w.id));
}

function clozeWordById(st, id) {
  return st.bank.find(w => w.id === id);
}


// ─── Render ─────────────────────────────────────────────────────────────────

function renderClozeSlide(slide) {
  const st    = clozeState();
  const parts = clozeParse(slide.text || "");

  const passage = parts.map(p => {
    if (p.html !== undefined) return p.html;
    const placedId = st.placed[p.blank];
    const word     = placedId !== undefined ? clozeWordById(st, placedId) : null;
    const status   = st.status[p.blank];
    return `<button class="cloze-blank${word ? " cloze-blank-filled" : ""}`
         + `${status === "correct" ? " cloze-blank-correct" : ""}`
         + `${status === "wrong"   ? " cloze-blank-wrong"   : ""}`
         + `${!word && st.selected !== null ? " cloze-blank-open" : ""}"`
         + ` id="cloze-blank-${p.blank}" onclick="clozeBlankClick(${p.blank})"`
         + ` title="${word ? "Click to return this word to the bank"
                           : "Click a word above, then click here"}">`
         + `${word ? word.text : "&nbsp;".repeat(8)}</button>`;
  }).join("");

  const figure = slide.image
    ? `<img src="${slide.image}" class="cloze-image" style="${imageSizeStyle(slide)}"
            alt="${slide.title || ""}">`
    : "";
  const twoCol = figure && slide.imagePosition !== "below";

  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.intro ? `<div class="info-block">${slide.intro}</div>` : ""}
    ${hintHTML(slide)}

    <div class="cloze-bank" id="cloze-bank">
      <span class="cloze-bank-label">Word bank</span>
      <div class="cloze-bank-words" id="cloze-bank-words">
        ${clozeBankHTML(st)}
      </div>
    </div>

    <div class="${twoCol ? "cloze-cols" : ""}">
      <div class="cloze-passage">${passage}</div>
      ${figure ? `<div class="cloze-figure">${figure}</div>` : ""}
    </div>

    <div class="idiag-actions">
      <button class="idiag-check-btn" onclick="clozeCheck()">
        ${slide.checkText || "Check answers"}
      </button>
      <span class="idiag-status" id="cloze-status"></span>
    </div>

    ${slide.explanation ? `
      <div class="mcq-explanation mcq-explanation-hidden" id="cloze-explanation">
        <span class="explanation-tick">✓</span>
        <span>${slide.explanation}</span>
      </div>` : ""}

    <div class="steps-complete steps-complete-hidden" id="cloze-complete">
      🎉 All blanks filled correctly — well done!
    </div>
  `);

  if (completedSlides.has(currentSlide)) clozeRevealSuccess(false);
}

function clozeBankHTML(st) {
  const avail = clozeAvailable(st);
  if (!avail.length) return `<span class="cloze-bank-empty">All words placed.</span>`;
  return avail.map(w => `
    <button class="cloze-word${st.selected === w.id ? " cloze-word-selected" : ""}"
            onclick="clozeSelectWord(${w.id})">${w.text}</button>
  `).join("");
}


// ─── Interaction ────────────────────────────────────────────────────────────

// Pick a word up (or put it down again).
function clozeSelectWord(id) {
  const st = clozeState();
  st.selected = (st.selected === id) ? null : id;
  renderSlide();
}

// Click a blank: place the picked-up word, or return the word already there.
function clozeBlankClick(blank) {
  const st = clozeState();

  if (st.placed[blank] !== undefined) {
    delete st.placed[blank];          // send it back to the bank
    delete st.status[blank];          // its verdict no longer applies
    st.selected = null;
    renderSlide();
    return;
  }

  if (st.selected === null) return;   // nothing picked up yet
  st.placed[blank] = st.selected;
  delete st.status[blank];
  st.selected = null;
  renderSlide();
}


// ─── Checking ───────────────────────────────────────────────────────────────

function clozeCheck() {
  const slide = moduleData[currentSlide];
  const st    = clozeState();
  const answers = clozeAnswers(slide);
  let wrong = 0, empty = 0;

  answers.forEach(a => {
    const id = st.placed[a.blank];
    if (id === undefined) { empty++; delete st.status[a.blank]; return; }
    const word = clozeWordById(st, id);
    const ok = word && word.text.trim().toLowerCase() === a.answer.toLowerCase();
    st.status[a.blank] = ok ? "correct" : "wrong";
    if (!ok) wrong++;
  });

  renderSlide();

  const statusEl = document.getElementById("cloze-status");
  if (statusEl) {
    if (empty) {
      statusEl.className = "idiag-status idiag-status-wrong";
      statusEl.textContent = `${empty} blank${empty === 1 ? " is" : "s are"} still empty.`;
    } else if (wrong) {
      statusEl.className = "idiag-status idiag-status-wrong";
      statusEl.textContent = `${wrong} ${wrong === 1 ? "answer isn't" : "answers aren't"} right — `
                           + `click a red word to return it to the bank.`;
    } else {
      statusEl.className = "idiag-status idiag-status-ok";
      statusEl.textContent = "All correct!";
    }
  }

  if (!empty && !wrong) {
    completedSlides.add(currentSlide);
    updateLockState();
    clozeRevealSuccess(true);
  }
}

function clozeRevealSuccess(scroll) {
  const done = document.getElementById("cloze-complete");
  if (done) done.classList.remove("steps-complete-hidden");
  const ex = document.getElementById("cloze-explanation");
  if (ex) { ex.classList.remove("mcq-explanation-hidden"); typesetMath(ex); }
  const target = ex || done;
  if (scroll && target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


registerSlideType("cloze", {
  icon: "📝",
  render: renderClozeSlide,
  isQuiz: true
});