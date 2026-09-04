/* ============================================================================
   core/context.js — "Who is the student, and which course?"

   THE IDENTITY SEAM. Nothing else in the project reads the URL directly;
   everything calls getStudentContext(). When you later upgrade to LTI, you
   rewrite ONLY this function and nothing else changes.

   ── WHERE IDENTITY COMES FROM ──
   1. The URL, as Moodle appends it to a URL *activity*:
          …/homepage/index.html?sid=z1234567&course=CVEN2303_26T3
   2. Failing that, whatever was remembered earlier in this browser tab.

   Step 2 matters. Moodle only substitutes those variables for a URL ACTIVITY;
   it does NOT substitute them inside HTML you paste into a Text-and-media
   area. So a module reached from a hand-written link — the "Before you begin"
   panel, a link in an announcement, a student's own bookmark — would arrive
   with no identity and silently record nothing.

   Remembering the pair for the session fixes that: once a student has opened
   ANY properly-linked page (normally the homepage, via a URL activity), every
   later link works for the rest of the session, however they got there.

   sessionStorage, not localStorage: it clears when the browser closes, which
   is the right lifetime for "who is using this tab" and avoids a shared or lab
   computer attributing one student's work to the next.
   ============================================================================ */

const CONTEXT_KEY = "srm-identity";

function getStudentContext() {
  const params = new URLSearchParams(window.location.search);

  let student = params.get("sid")    || null;
  let course  = params.get("course") || null;

  // Seen in the URL → remember it for the rest of the session
  if (student || course) {
    rememberContext(student, course);
  } else {
    const saved = recallContext();
    if (saved) { student = saved.student; course = saved.course; }
  }

  return {
    student,                              // e.g. "z1234567" (or null)
    course,                               // e.g. "CVEN2303_26T3" (or null)
    isTracked: Boolean(student && course) // enough info to track at all?
  };
}

// Storage can throw (private browsing, blocked cookies), and identity is a
// convenience rather than a requirement — so every failure is swallowed and
// the module simply carries on untracked.
function rememberContext(student, course) {
  try {
    if (!student && !course) return;
    const prev = recallContext() || {};
    sessionStorage.setItem(CONTEXT_KEY, JSON.stringify({
      student: student || prev.student || null,
      course:  course  || prev.course  || null
    }));
  } catch (e) { /* no storage available — fine */ }
}

function recallContext() {
  try {
    const raw = sessionStorage.getItem(CONTEXT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return (v && (v.student || v.course)) ? v : null;
  } catch (e) {
    return null;
  }
}

// Clears the remembered identity. Useful on a shared machine, and for testing.
function forgetContext() {
  try { sessionStorage.removeItem(CONTEXT_KEY); } catch (e) {}
}