/* ============================================================================
   homepage/homepage.js — the per-student, per-course dashboard.

   1. Identify the student + course      (getStudentContext, core/context.js)
   2. Look up that course's module list  (COURSES, courses.js)
   3. Ask the backend what's complete    (fetchProgress, core/api.js)
   4. Render a card per module, ticked if complete, linking into the module
      WITH the sid & course carried forward.
   ============================================================================ */

const homepageApp = document.getElementById("homepage-app");

async function renderHomepage() {
  const ctx = getStudentContext();

  // No/unknown course — can't show a tailored list
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

  // Loading state while we ask the backend
  homepageApp.innerHTML = `
    <div class="hp-header">
      <h1>${course.courseName}</h1>
      <p>Revision Modules${ctx.student ? ` · ${ctx.student}` : ""}</p>
    </div>
    <div class="hp-grid" id="hp-grid">
      <p class="hp-loading">Loading your progress…</p>
    </div>
  `;

  // Which module IDs has this (student, course) completed?
  // Returns [] when tracking is off — everything shows as not-complete.
  const completed = await fetchProgress();

  const grid = document.getElementById("hp-grid");
  grid.innerHTML = course.modules.map(m => {
    const isDone = completed.includes(m.id);

    // Carry the student + course INTO the module link so the module records
    // completion against the right (student, course) pair.
    const params = new URLSearchParams();
    if (ctx.student) params.set("sid", ctx.student);
    if (ctx.course)  params.set("course", ctx.course);
    const moduleUrl = `../${m.folder}/index.html?${params.toString()}`;

    return `
      <a class="hp-card ${isDone ? "hp-card-done" : ""}" href="${moduleUrl}">
        <div class="hp-card-status">${isDone ? "✓" : ""}</div>
        <div class="hp-card-title">${m.title}</div>
        <div class="hp-card-foot">${isDone ? "Completed" : "Not yet completed"}</div>
      </a>
    `;
  }).join("");
}

renderHomepage();