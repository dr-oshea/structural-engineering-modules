/* ============================================================================
   core/api.js — all communication with the backend.

   TRACKING IS OPTIONAL. With BACKEND_URL empty (or the backend unreachable),
   every function here fails *quietly* and modules keep working perfectly.
   A student never sees an error because tracking is down.
   ============================================================================ */


/* ─── CONFIGURE ME ───────────────────────────────────────────────────────────
   After setting up the Google Apps Script backend (see the roadmap §3),
   paste its Web app URL (ending in /exec) between the quotes.
   Leave empty to run with tracking off.                                       */
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzGi7-qsGVSzFu9hp4JsQkWeM4ZldlZ5OB3TbqU2nmH5MtVEDIXtY5bCGiHVInSjR_s/exec";
/* ──────────────────────────────────────────────────────────────────────────── */


// True only if we have BOTH a backend URL AND a known student/course.
function trackingEnabled() {
  const ctx = getStudentContext();
  return Boolean(BACKEND_URL) && ctx.isTracked;
}


/* ── Record that a student completed a module ────────────────────────────────
   Called by saveAndClose() in types/final.js. Never throws.                  */
async function recordCompletion({ moduleId, rating }) {
  if (!trackingEnabled()) {
    console.log("[api] Tracking off — completion not sent (this is fine).");
    return false;
  }

  const ctx = getStudentContext();
  const payload = {
    action:    "recordCompletion",
    student:   ctx.student,
    course:    ctx.course,
    module:    moduleId,
    rating:    rating || null,
    timestamp: new Date().toISOString()
  };

  try {
    // Plain-text body keeps this a CORS "simple request", which Google Apps
    // Script accepts without extra configuration.
    await fetch(BACKEND_URL, { method: "POST", body: JSON.stringify(payload) });
    console.log("[api] Completion recorded:", payload);
    return true;
  } catch (err) {
    console.warn("[api] Could not record completion (ignored):", err);
    return false;
  }
}


/* ── Fetch this student's completed modules for the current course ───────────
   Called by the homepage. Returns an array of module IDs, e.g.
   ["module-01-bending-moments"]. On any failure returns [] — the homepage
   then simply shows everything as not-yet-completed.                          */
async function fetchProgress() {
  if (!trackingEnabled()) {
    console.log("[api] Tracking off — no progress to fetch (this is fine).");
    return [];
  }

  const ctx = getStudentContext();
  const url = `${BACKEND_URL}?action=getProgress`
            + `&student=${encodeURIComponent(ctx.student)}`
            + `&course=${encodeURIComponent(ctx.course)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return Array.isArray(data.completed) ? data.completed : [];
  } catch (err) {
    console.warn("[api] Could not fetch progress (ignored):", err);
    return [];
  }
}