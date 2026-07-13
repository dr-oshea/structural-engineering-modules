/* ============================================================================
   engine.js — the module framework.

   Responsibilities:
     • Global state (current slide, completion, saved answers)
     • The slide-TYPE REGISTRY — content types register themselves here
     • Layout chrome: sidebar, footer, page counter, block divider
     • Navigation and quiz-gating logic
     • Shared utilities used by several types (triggerBuzz, shuffleArray)

   The engine knows NOTHING about specific content types. Each type lives in
   core/types/<name>.js and calls registerSlideType() to plug itself in.

   Load order in a module's index.html:
     1. engine.js          (this file — defines registerSlideType)
     2. types/*.js         (each registers a type)
     3. config.js          (defines moduleData for this module)
   Rendering starts automatically on DOMContentLoaded.
   ============================================================================ */


const app = document.getElementById("app");

// ─── Global state ───────────────────────────────────────────────────────────

let currentSlide = 0;
const completedSlides = new Set(); // indices of completed quiz-gating slides
const slideState = {};             // persisted answer state per slide index, e.g.
                                   //   slideState[3] = { type:"steps", answers:[4,8,16] }
                                   //   slideState[5] = { type:"mcq",   chosen:1 }


// ─── Slide-type registry ────────────────────────────────────────────────────
//
// Each type file calls registerSlideType(name, definition). Definition fields:
//   render(slide)        REQUIRED — draws the slide (usually via renderLayout)
//   icon                 sidebar icon string (default "📖")
//   isQuiz               true → slide gates navigation until completed
//   noNav                true → sidebar entry is visible but not clickable
//   excludeFromCount     true → omitted from the "Page X of Y" counter
//   isEnd                true → this is the module's completion slide
//                               (triggers the Finish → Confirm button flow)
//   navLocked(slide, i)  optional — return true to lock module navigation
//                               while the slide is mid-interaction (used by quiz)

const slideTypes = {};

function registerSlideType(name, def) {
  slideTypes[name] = def;
}

// Safe lookup of a slide's type definition ({} if unknown).
function typeDef(slide) {
  return (slide && slideTypes[slide.type]) || {};
}


// ─── Gating helpers ────────────────────────────────────────────────────────

// A slide is a "quiz" if it requires completion before the student can advance.
// A slide's own  quiz: true/false  in config overrides its type's default.
function isQuizSlide(index) {
  const s = moduleData[index];
  if (s.quiz !== undefined) return s.quiz;
  return Boolean(typeDef(s).isQuiz);
}

function getSlideIcon(s) {
  return typeDef(s).icon || "📖";
}

// Returns the index of the first incomplete quiz slide — the current "gate".
// Slides at indices ≤ this value are accessible; everything beyond is locked.
// Returns moduleData.length (past the end) when all quizzes are complete.
function getFirstLockedIndex() {
  for (let i = 0; i < moduleData.length; i++) {
    if (isQuizSlide(i) && !completedSlides.has(i)) return i;
  }
  return moduleData.length;
}

// True when the module ends with a completion slide (isEnd type, e.g. "final").
function moduleHasEndSlide() {
  const last = moduleData[moduleData.length - 1];
  return Boolean(typeDef(last).isEnd);
}


// ─── Layout: sidebar + content + footer ────────────────────────────────────

function renderLayout(contentHTML) {

  // Page counter excludes non-content slides (splash, final)
  const contentSlides = moduleData.filter(s => !typeDef(s).excludeFromCount);
  const contentIndex  = contentSlides.indexOf(moduleData[currentSlide]) + 1;
  const totalContent  = contentSlides.length;
  const progressPct   = Math.round((contentIndex / totalContent) * 100);

  // The gate: first incomplete quiz slide. Slides ≤ gate are accessible.
  const lockedFromIndex     = getFirstLockedIndex();
  const isCurrentQuizLocked = isQuizSlide(currentSlide) && !completedSlides.has(currentSlide);

  // If the next slide is the module's end slide, the forward button reads "Finish"
  const next         = moduleData[currentSlide + 1];
  const nextIsEnd    = Boolean(next && typeDef(next).isEnd);
  const nextBtnLabel = nextIsEnd ? "Finish" : "Next →";

  // A type may lock module navigation while mid-interaction (e.g. quiz questions)
  const curDef    = typeDef(moduleData[currentSlide]);
  const navLocked = curDef.navLocked
                    ? Boolean(curDef.navLocked(moduleData[currentSlide], currentSlide))
                    : false;

  app.innerHTML = `
    <div class="layout">

      <!-- LEFT NAV -->
      <div class="sidebar">
        <h3>Module Contents</h3>
        <ul>
          ${moduleData.map((s, i) => {
            const isNoNav     = Boolean(typeDef(s).noNav);
            const isLocked    = i > lockedFromIndex;
            const isActive    = i === currentSlide;
            const isQuiz      = isQuizSlide(i);
            const isClickable = !isNoNav && !isActive;

            // Divider logic:
            // - Normal case: show AFTER the gate slide (last accessible), if
            //   there are locked slides beyond it.
            // - Final case: once all quizzes are done (gate past the content),
            //   show the divider just BEFORE the end slide.
            const hasEnd      = moduleHasEndSlide();
            const endIndex    = hasEnd ? moduleData.length - 1 : -1;
            const gatePastEnd = lockedFromIndex >= moduleData.length - 1;

            let showDivider = false;
            if (gatePastEnd && hasEnd) {
              showDivider = (i === endIndex - 1);
            } else {
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
      <button onclick="prevSlide()" ${currentSlide === 0 || navLocked ? "disabled" : ""}>← Back</button>

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


// ─── Slide dispatch ────────────────────────────────────────────────────────

function renderSlide() {
  const slide = moduleData[currentSlide];
  const def   = slideTypes[slide.type];

  if (!def || typeof def.render !== "function") {
    console.error(`[engine] Unknown slide type "${slide.type}" at index ${currentSlide}. ` +
                  `Check that core/types/${slide.type}.js is loaded in index.html.`);
    app.innerHTML = `<div style="color:white; padding:40px; font-family:sans-serif;">
      Unknown slide type: <strong>${slide.type}</strong> — see console.</div>`;
    return;
  }

  def.render(slide);
}


// ─── Navigation ────────────────────────────────────────────────────────────

// All sidebar items call this instead of goToSlide directly.
function navigateToSlide(index) {
  // Non-navigable targets (splash, final)
  if (typeDef(moduleData[index]).noNav) return;

  // Don't allow leaving a slide whose type has locked navigation (quiz mid-flow)
  const curDef = typeDef(moduleData[currentSlide]);
  if (curDef.navLocked && curDef.navLocked(moduleData[currentSlide], currentSlide)) return;

  // Block navigation to any slide beyond the current gate
  if (index > getFirstLockedIndex()) return;

  goToSlide(index);
}

// Re-syncs the Next button, sidebar locks, and block divider after a quiz-type
// slide is completed — WITHOUT a full re-render (keeps the student's context).
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

  // Move the block divider (mirrors the placement logic in renderLayout)
  const existingDivider = document.querySelector(".sidebar-divider");
  if (existingDivider) existingDivider.remove();

  const hasEnd      = moduleHasEndSlide();
  const gatePastEnd = lockedFromIndex >= moduleData.length - 1;

  let dividerAfterIndex = -1;
  if (gatePastEnd && hasEnd) {
    dividerAfterIndex = moduleData.length - 2;   // before the end slide
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
// when the next slide is the module's end slide; otherwise advances normally.
let awaitingFinishConfirm = false;

function handleForward() {
  const next      = moduleData[currentSlide + 1];
  const nextIsEnd = Boolean(next && typeDef(next).isEnd);

  if (nextIsEnd) {
    const btn = document.querySelector("[data-nav='next']");
    if (!awaitingFinishConfirm) {
      awaitingFinishConfirm = true;
      if (btn) {
        btn.textContent = "Confirm?";
        btn.classList.add("nav-confirm");
      }
      return;
    }
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
    awaitingFinishConfirm = false;
    currentSlide--;
    renderSlide();
  }
}

function goToSlide(index) {
  awaitingFinishConfirm = false;
  currentSlide = index;
  renderSlide();
}


// ─── Shared utilities (used by several types) ──────────────────────────────

// Shake an element and flash it red — the universal "wrong answer" cue.
function triggerBuzz(element) {
  element.classList.remove("buzz");  // reset if mid-animation
  void element.offsetWidth;          // force reflow so animation restarts
  element.classList.add("buzz");
}

// Fisher-Yates shuffle; returns a new array (doesn't mutate the input).
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// ─── Boot ──────────────────────────────────────────────────────────────────
// DOMContentLoaded fires after all synchronous <script> tags have executed,
// so every type is registered and moduleData exists by the time this runs.

document.addEventListener("DOMContentLoaded", renderSlide);