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
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwN8fDdrGFwSwAt3CS6kDA29OIUKSRCdWF1S6AaqXov7EBrWfM24bz5FwcwhDcqWjXG/exec";
/* ──────────────────────────────────────────────────────────────────────────── */


// True only if we have BOTH a backend URL AND a known student/course.
function trackingEnabled() {
  const ctx = getStudentContext();
  return Boolean(BACKEND_URL) && ctx.isTracked;
}


/* ── Record that a student completed a module ────────────────────────────────
   Called by saveAndClose() in types/final.js. Never throws.                  */
async function recordCompletion({ moduleId, rating, comment }) {
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
    comment:   comment || "",
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
// How long to wait for the progress lookup before giving up. Apps Script
// spends 1–3 s cold-starting a container on the first request of a session,
// almost regardless of how much data the sheet holds, so this is generous.
const PROGRESS_TIMEOUT_MS = 8000;

async function fetchProgress() {
  if (!trackingEnabled()) {
    console.log("[api] Tracking off — no progress to fetch (this is fine).");
    const empty = [];
    empty.dates = {};
    return empty;
  }

  const ctx = getStudentContext();
  const url = `${BACKEND_URL}?action=getProgress`
            + `&student=${encodeURIComponent(ctx.student)}`
            + `&course=${encodeURIComponent(ctx.course)}`;

  try {
    // Give up after a while rather than leaving the page waiting. Apps Script
    // occasionally stalls under load, and a homepage that never settles is
    // worse than one showing no ticks — the tiles are all still usable.
    const controller = (typeof AbortController !== "undefined")
      ? new AbortController() : null;
    const timer = controller
      ? setTimeout(() => controller.abort(), PROGRESS_TIMEOUT_MS) : null;

    const response = await fetch(url, controller ? { signal: controller.signal } : {});
    if (timer) clearTimeout(timer);

    const data = await response.json();
    // Return the completed IDs as an array (so existing .includes() still works),
    // with the per-module completion dates attached as a .dates property.
    const completed = Array.isArray(data.completed) ? data.completed : [];
    completed.dates = (data.dates && typeof data.dates === "object") ? data.dates : {};
    return completed;
  } catch (err) {
    console.warn("[api] Could not fetch progress (ignored):", err);
    const empty = [];
    empty.dates = {};
    return empty;
  }
}