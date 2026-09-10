/* ============================================================================
   homepage/homepage.js — the per-student, per-course dashboard.

   1. Identify student + course           (getStudentContext, core/context.js)
   2. Look up the course's module IDs     (COURSES, courses.js)
   3. Join IDs against the catalog        (catalog.js — titles/categories/order)
   4. Ask the backend what's complete     (fetchProgress, core/api.js)
   5. Render modules GROUPED BY CATEGORY in progression order, each card
      linking into its module with sid & course carried forward.
   ============================================================================ */

const homepageApp = document.getElementById("homepage-app");

async function renderHomepage() {
  const ctx = getStudentContext();

  if (!ctx.course || !COURSES[ctx.course]) {
    homepageApp.innerHTML = `
      <div class="hp-message">
        <h1>Structural Engineering Revision Modules</h1>
        <p>No course was specified, so a personalised module list can't be shown.</p>
        <p>Please access this page through your course's Moodle page.</p>
      </div>
    `;
    return;
  }

  const course = COURSES[ctx.course];

  homepageApp.innerHTML = `
    <div class="hp-header">
      <h1>${course.courseName}</h1>
      <p>Revision Modules${ctx.student ? ` · ${ctx.student}` : ""}</p>
    </div>

    ${course.intro ? `<div class="hp-intro">${course.intro}</div>` : ""}

    <div id="hp-sections">
      <p class="hp-loading">Loading your progress…</p>
    </div>
  `;

  // ── Draw the tiles IMMEDIATELY, then fill in progress when it arrives ──
  //
  // The module list comes from local config, so it needs no network at all.
  // Waiting on the backend before drawing anything turned Apps Script's
  // cold-start (1–3 s, regardless of how much data there is) into that many
  // seconds of blank page.
  //
  // Instead: paint the tiles now using the last-known progress from this
  // session, then re-paint when the real answer comes back. On a repeat visit
  // the ticks are correct instantly; on a first visit they appear a moment
  // later.
  const cached = recallProgress();
  let completed = cached || Object.assign([], { dates: {} });

  // Do we actually KNOW a module's status yet? On a first visit we don't —
  // and saying "Not yet completed" before the backend answers would state
  // something false to a student who has in fact finished it. So until the
  // answer lands, the status line says "checking…" rather than asserting.
  // A cached answer counts as known: it's this student's own result from
  // moments ago, and the real answer overwrites it within seconds.
  let progressKnown  = Boolean(cached) || !getStudentContext().isTracked;
  let progressFailed = false;

  fetchProgress().then(fresh => {
    if (fresh === null) {
      // The lookup FAILED — which is not the same as "nothing completed".
      // Saying "Not yet completed" here would tell a student who has finished
      // modules that they haven't. Say we couldn't check, and offer a retry.
      progressFailed = true;
      progressKnown  = true;
      paintSections();
      return;
    }
    rememberProgress(fresh);
    completed = fresh;
    progressKnown = true;
    paintSections();                       // re-draw with the real answer
  }).catch(() => {
    progressFailed = true;
    progressKnown  = true;
    paintSections();
  });

  // ── Join: course IDs → catalog entries, grouped by category ──
  const sorted = sortModuleIds(course.modules);
  const groups = [];                         // [{ category, modules:[…] }] in order
  sorted.forEach(id => {
    const m = catalogModule(id);
    if (!m) return;                          // unknown id already warned by sortModuleIds
    const cat = catalogCategory(m.category);
    let g = groups.find(g => g.category && cat && g.category.id === cat.id);
    if (!g) { g = { category: cat, modules: [] }; groups.push(g); }
    g.modules.push(m);
  });

  // ── Render one section per category ──
  // A named function, because it runs twice: once immediately, and again when
  // the progress fetch returns.
  const sections = document.getElementById("hp-sections");
  function paintSections() {
  sections.innerHTML = (progressFailed ? `
    <div class="hp-progress-warning">
      Couldn't load your completed modules just now — everything still works,
      and your progress is safe.
      <button class="hp-retry-btn" onclick="retryProgress()">Try again</button>
    </div>` : "") + groups.map(g => `
    <section class="hp-section">
      <h2 class="hp-section-title">${g.category ? g.category.name : "Other"}</h2>
      <div class="hp-grid">
        ${g.modules.map(m => {
          // A module can be listed before it's finished, so students can see
          // what's coming. It renders as a plain, unclickable card.
          const ready = catalogModuleAvailable(m);
          const timeLabel = catalogTimeLabel(m);
          const timeHTML = timeLabel
            ? `<div class="hp-card-time"><span aria-hidden="true">🕐</span> ${timeLabel}</div>`
            : "";

          if (!ready) {
            return `
              <div class="hp-card hp-card-soon" aria-disabled="true">
                <div class="hp-card-status">🔒</div>
                <div class="hp-card-title">${m.title}</div>
                ${timeHTML}
                <div class="hp-card-foot">${catalogComingSoonLabel(m)}</div>
              </div>
            `;
          }

          const isDone = completed.includes(m.id);
          const doneDate = (completed.dates && completed.dates[m.id]) || null;
          const params = new URLSearchParams();
          if (ctx.student) params.set("sid", ctx.student);
          if (ctx.course)  params.set("course", ctx.course);
          const moduleUrl = `../${m.folder}/index.html?${params.toString()}`;
          const footText = !progressKnown
            ? `<span class="hp-card-checking">checking…</span>`
            : (progressFailed && !isDone)
              ? `<span class="hp-card-checking">completion unavailable</span>`
              : isDone
                ? (doneDate ? `Completed ${formatDoneDate(doneDate)}` : "Completed")
                : "Not yet completed";
          return `
            <a class="hp-card ${isDone ? "hp-card-done" : ""}" href="${moduleUrl}">
              <div class="hp-card-status">${isDone ? "✓" : ""}</div>
              <div class="hp-card-title">${m.title}</div>
              ${timeHTML}
              <div class="hp-card-foot">${footText}</div>
            </a>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
  }

  // Let the warning banner's button have another go
  retryProgress = () => {
    progressFailed = false;
    progressKnown  = false;
    paintSections();
    fetchProgress().then(fresh => {
      if (fresh === null) { progressFailed = true; }
      else { rememberProgress(fresh); completed = fresh; }
      progressKnown = true;
      paintSections();
    }).catch(() => { progressFailed = true; progressKnown = true; paintSections(); });
  };

  paintSections();          // draw now; the fetch above re-draws when it lands
}


// ─── Remembering progress between visits ────────────────────────────────────
//
// The backend answer is cached for the browser session, so a student returning
// to the homepage sees their ticks instantly rather than waiting on a fresh
// round-trip. It's only ever a display shortcut — the real answer replaces it
// a moment later, and it's scoped per student+course so switching courses (or
// sharing a machine) can't show the wrong ticks.
function progressKey() {
  const ctx = getStudentContext();
  return `srm-progress:${ctx.student || "?"}:${ctx.course || "?"}`;
}

function rememberProgress(list) {
  try {
    sessionStorage.setItem(progressKey(), JSON.stringify({
      completed: Array.from(list),
      dates: list.dates || {}
    }));
  } catch (e) { /* storage unavailable — no cache, no problem */ }
}

function recallProgress() {
  try {
    const raw = sessionStorage.getItem(progressKey());
    if (!raw) return null;
    const v = JSON.parse(raw);
    const out = Array.isArray(v.completed) ? v.completed.slice() : [];
    out.dates = v.dates || {};
    return out;
  } catch (e) {
    return null;
  }
}


// Exposed for the "Try again" button on the warning banner.
let retryProgress = () => {};

renderHomepage();

// Format a "YYYY-MM-DD" string as e.g. "14 Mar 2026" (falls back to raw string).
function formatDoneDate(iso) {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    const months = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"];
    if (!y || !m || !d) return iso;
    return `${d} ${months[m - 1]} ${y}`;
  } catch (e) {
    return iso;
  }
}