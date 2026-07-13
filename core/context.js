/* ============================================================================
   core/context.js — "Who is the student, and which course?"

   THE IDENTITY SEAM. Nothing else in the project reads the URL directly;
   everything calls getStudentContext(). When you later upgrade to LTI, you
   rewrite ONLY this function and nothing else changes.

   Current behaviour: reads parameters Moodle appends to the page URL, e.g.
       …/module-01/index.html?sid=z1234567&course=CVEN2301
   ============================================================================ */

function getStudentContext() {
  const params = new URLSearchParams(window.location.search);

  const student = params.get("sid")    || null;
  const course  = params.get("course") || null;

  return {
    student,                              // e.g. "z1234567" (or null)
    course,                               // e.g. "CVEN2301" (or null)
    isTracked: Boolean(student && course) // enough info to track at all?
  };
}