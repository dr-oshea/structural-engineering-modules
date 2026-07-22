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
    <div id="hp-sections">
      <p class="hp-loading">Loading your progress…</p>
    </div>
  `;

  const completed = await fetchProgress();   // [] when tracking is off

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
  const sections = document.getElementById("hp-sections");
  sections.innerHTML = groups.map(g => `
    <section class="hp-section">
      <h2 class="hp-section-title">${g.category ? g.category.name : "Other"}</h2>
      <div class="hp-grid">
        ${g.modules.map(m => {
          const isDone = completed.includes(m.id);
          const doneDate = (completed.dates && completed.dates[m.id]) || null;
          const params = new URLSearchParams();
          if (ctx.student) params.set("sid", ctx.student);
          if (ctx.course)  params.set("course", ctx.course);
          const moduleUrl = `../${m.folder}/index.html?${params.toString()}`;
          const footText = isDone
            ? (doneDate ? `Completed ${formatDoneDate(doneDate)}` : "Completed")
            : "Not yet completed";
          return `
            <a class="hp-card ${isDone ? "hp-card-done" : ""}" href="${moduleUrl}">
              <div class="hp-card-status">${isDone ? "✓" : ""}</div>
              <div class="hp-card-title">${m.title}</div>
              <div class="hp-card-foot">${footText}</div>
            </a>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
}

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