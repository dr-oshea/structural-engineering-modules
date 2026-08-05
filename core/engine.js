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
  if (s.quiz !== undefined) return s.quiz;      // explicit config override wins
  const def = typeDef(s);
  // isQuiz may be a boolean, or a function of the slide for types whose
  // gating depends on their config (e.g. explore + requireAll).
  return typeof def.isQuiz === "function"
    ? Boolean(def.isQuiz(s))
    : Boolean(def.isQuiz);
}

function getSlideIcon(s) {
  return typeDef(s).icon || "📖";
}

// ─── Gating on/off (development aid) ───────────────────────────────────────
//
// Quiz gating can be switched off so you can jump straight to any slide while
// building a module. Two ways, checked in this order:
//
//   1. URL parameter — add ?dev=1 to the module's address:
//        …/module-01/index.html?dev=1
//      Nothing to edit, nothing to remember to undo, and it can never ship
//      by accident. This is the recommended way to develop.
//
//   2. Config override — in config.js, set:
//        const moduleMeta = { id: "…", gating: false };
//      Use this only if a module should genuinely never gate for students.
//
// When gating is off a "DEV MODE" badge appears, so it's obvious at a glance.
let _gatingCache = null;   // computed once, on first use

function gatingEnabled() {
  if (_gatingCache === null) {
    const params  = new URLSearchParams(window.location.search);
    const devMode = params.get("dev") === "1" || params.has("nogate");
    const cfgOff  = (typeof moduleMeta !== "undefined" && moduleMeta.gating === false);
    _gatingCache  = !(devMode || cfgOff);
    if (!_gatingCache) {
      console.log("[engine] Gating DISABLED — all slides are freely navigable.");
    }
  }
  return _gatingCache;
}

// Returns the index of the first incomplete quiz slide — the current "gate".
// Slides at indices ≤ this value are accessible; everything beyond is locked.
// Returns moduleData.length (past the end) when all quizzes are complete,
// or immediately when gating is switched off.
function getFirstLockedIndex() {
  if (!gatingEnabled()) return moduleData.length;   // nothing is locked
  for (let i = 0; i < moduleData.length; i++) {
    if (isQuizSlide(i) && !completedSlides.has(i)) return i;
  }
  return moduleData.length;
}

// ─── Module "parts" ────────────────────────────────────────────────────────
//
// A module is normally broken into 3–5 parts, each a run of teaching slides
// followed by an activity. The slide that BEGINS a part declares it:
//
//     { type: "info", partStart: "What is a Bending Moment", … }
//
// Everything downstream — the sidebar dividers and "Part X" labels, and the
// contents list on the splash page — derives from this one declaration, so
// they can never disagree. Reordering slides reorders the parts automatically.

// Returns [{ number, title, index }] for each part, in slide order.
function getModuleParts() {
  const parts = [];
  moduleData.forEach((s, i) => {
    if (s.partStart) {
      parts.push({ number: parts.length + 1, title: s.partStart, index: i });
    }
  });
  return parts;
}

// Maps a slide index → the part number it STARTS (or undefined).
function partNumberByStartIndex() {
  const map = {};
  getModuleParts().forEach(p => { map[p.index] = p.number; });
  return map;
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
  const isCurrentQuizLocked = gatingEnabled()
                              && isQuizSlide(currentSlide)
                              && !completedSlides.has(currentSlide);

  // If the next slide is the module's end slide, the forward button reads "Finish"
  const next         = moduleData[currentSlide + 1];
  const nextIsEnd    = Boolean(next && typeDef(next).isEnd);
  const nextBtnLabel = nextIsEnd ? "Finish" : "Next →";

  // A type may lock module navigation while mid-interaction (e.g. quiz questions)
  const curDef    = typeDef(moduleData[currentSlide]);
  const navLocked = (gatingEnabled() && curDef.navLocked)
                    ? Boolean(curDef.navLocked(moduleData[currentSlide], currentSlide))
                    : false;

  // slide index → part number it starts (for the sidebar part headings)
  const partStarts = partNumberByStartIndex();

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

            // A slide that starts a part gets a yellow divider + "Part X"
            // heading ABOVE it. These are permanent structural markers — they
            // delineate the whole module at a glance, locked parts included.
            const partNo = partStarts[i];
            const partHeader = partNo
              ? `<li class="sidebar-divider" aria-hidden="true"></li>
                 <li class="sidebar-part-label ${isLocked ? "sidebar-part-locked" : ""}" aria-hidden="true">
                   <span class="sidebar-part-number">Part ${partNo}</span>
                   <span class="sidebar-part-title">${s.partStart}</span>
                 </li>`
              : "";

            return `
              ${partHeader}
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

  typesetMath(app);   // render any LaTeX in the freshly-inserted HTML
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
  if (gatingEnabled() && curDef.navLocked
      && curDef.navLocked(moduleData[currentSlide], currentSlide)) return;

  // Block navigation to any slide beyond the current gate
  if (index > getFirstLockedIndex()) return;

  goToSlide(index);
}

// Re-syncs the Next button, sidebar locks, and block divider after a quiz-type
// slide is completed — WITHOUT a full re-render (keeps the student's context).
function updateLockState() {
  const lockedFromIndex     = getFirstLockedIndex();
  const isCurrentQuizLocked = gatingEnabled()
                              && isQuizSlide(currentSlide)
                              && !completedSlides.has(currentSlide);

  const nextBtn = document.querySelector("[data-nav='next']");
  if (nextBtn) {
    nextBtn.disabled = (currentSlide === moduleData.length - 1) || isCurrentQuizLocked;
  }

  document.querySelectorAll(".sidebar li[data-slide]").forEach(li => {
    const i = parseInt(li.dataset.slide);
    li.classList.toggle("sidebar-item-locked", i > lockedFromIndex);
  });

  // Part dividers are permanent structural markers, so nothing to move here.
  // Just refresh which part headings look locked.
  document.querySelectorAll(".sidebar-part-label").forEach(labelEl => {
    const nextItem = labelEl.nextElementSibling;
    if (!nextItem || !nextItem.dataset) return;
    const i = parseInt(nextItem.dataset.slide);
    labelEl.classList.toggle("sidebar-part-locked", i > lockedFromIndex);
  });
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

// Render LaTeX inside `container` using KaTeX, if KaTeX is loaded.
//
// Delimiters supported anywhere in slide content (info blocks, questions,
// step instructions, explanations, quiz questions, …):
//     \[ ... \]  or  $$ ... $$   → display maths (centred, own line)
//     \( ... \)  or   $ ... $    → inline maths (within a sentence)
//
// NOTE on literal dollar signs: because $ … $ is enabled, a pair of real
// dollar signs in one sentence (e.g. "costs $50, or $80 installed") would be
// read as maths. KaTeX's auto-render has no backslash escape for this, so to
// show literal dollars wrap them in class="nomath":
//     <span class="nomath">$50 per m³</span>
// (\( … \) is an alternative delimiter if you'd rather avoid $ entirely.)
//
// If KaTeX isn't loaded (e.g. offline, or the CDN is blocked), this is a
// silent no-op and the raw LaTeX shows as plain text — content stays readable.
function typesetMath(container) {
  if (typeof renderMathInElement !== "function") return;   // KaTeX not present
  try {
    renderMathInElement(container, {
      delimiters: [
        // $$ must be listed before $ so display maths matches first
        { left: "\\[", right: "\\]", display: true  },
        { left: "$$",  right: "$$",  display: true  },
        { left: "\\(", right: "\\)", display: false },
        { left: "$",   right: "$",   display: false }
      ],
      throwOnError: false,      // a bad expression shows in red, never breaks the page
      ignoredTags:    ["script", "noscript", "style", "textarea", "pre", "code"],
      ignoredClasses: ["nomath"]   // opt-out hatch for literal $ signs
    });
  } catch (err) {
    console.warn("[engine] Math typesetting skipped:", err);
  }
}

// Build an inline style string for sizing a figure, from an object that may
// carry any of: imageScale, imageWidth, imageHeight.
//
//   imageScale   0.7      → 70% of the available content width
//   imageWidth   "480px"  → explicit max width (also accepts "70%")
//   imageHeight  "260px"  → explicit max height
//
// Aspect ratio is always preserved (the stylesheet sets height:auto).
// If a width or scale is given without a height, the stylesheet's default
// max-height cap is lifted, so the width you set is the width you get.
// imageWidth takes precedence over imageScale if both are supplied.
function imageSizeStyle(o) {
  if (!o) return "";
  const parts = [];

  if (o.imageScale)  parts.push(`max-width:${Math.round(o.imageScale * 100)}%`);
  if (o.imageWidth)  parts.push(`max-width:${o.imageWidth}`);

  if (o.imageHeight) {
    parts.push(`max-height:${o.imageHeight}`);
  } else if (o.imageScale || o.imageWidth) {
    parts.push("max-height:none");   // let the chosen width govern
  }

  return parts.length ? parts.join(";") + ";" : "";
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


// Shows a small fixed badge whenever gating is switched off, so a dev-mode
// session is never mistaken for broken gating (or demoed by accident).
// Attached to <body>, not #app, so it survives full-screen slide renders.
function showDevBadge() {
  if (gatingEnabled()) return;
  if (document.getElementById("dev-mode-badge")) return;   // already shown
  const badge = document.createElement("div");
  badge.id = "dev-mode-badge";
  badge.textContent = "DEV MODE · gating off";
  badge.title = "Quiz gating is disabled. Remove ?dev=1 from the URL to test the student experience.";
  document.body.appendChild(badge);
}


// ─── Boot ──────────────────────────────────────────────────────────────────
// DOMContentLoaded fires after all synchronous <script> tags have executed,
// so every type is registered and moduleData exists by the time this runs.

document.addEventListener("DOMContentLoaded", () => {
  showDevBadge();
  renderSlide();
});