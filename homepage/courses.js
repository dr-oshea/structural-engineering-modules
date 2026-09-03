/* ============================================================================
   homepage/courses.js — which modules belong to which course.

   A lookup table YOU maintain. Each course lists its modules with:
     id      MUST match the module's moduleMeta.id in its config.js
             (this is what completion is recorded against)
     folder  the module's directory name (what the homepage card links to)
     title   shown on the homepage card

   The same module may appear in several courses. Completion is tracked per
   (student, course, module), so finishing it in one course does NOT mark it
   complete in another — by design.
   ============================================================================ */

const COURSES = {

  // Testing sandpit page
  "CVEN2303_Summer_SP": {
    courseName: "Structural Analysis and Modelling",
    modules: [
      "module-01-free-body",
      "module-02-reactions",
      "module-03-bending-moments"
    ]
  },

  // T3 2026
  "CVEN2303-CVEN2303-5269_00716": {
    courseName: "Structural Analysis and Modelling (T3 2026)",

    intro: `<p>Welcome to the revision modules for this course! These modules are designed for you to interactively 
            get up to pace on the assumed knowledge for this course!
            You can work through them in any order.</p>
            <p>If you fully complete a module, your progress will be saved.</p>`,

    modules: [
      "module-01-free-body",
      "module-02-equilibrium",
      "module-03-reactions",
      "module-04-bending-moments",
      "module-05-trusses",
      "module-06-distributed-loads",
      "module-07-internal-hinges",
      "module-10-cross-section"
    ]
  },


};