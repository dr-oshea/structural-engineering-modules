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
    courseName: "CVEN2303 Structural Analysis (Testing Page)",
    modules: [
      { id: "module-01-bending-moments", folder: "module-01",
        title: "Drawing Bending Moment Diagrams" },
      // { id: "module-02-shear-force",  folder: "module-02",
      //   title: "Shear Force Diagrams" },
    ]
  },

  // T3 2026
  "CVEN2303-CVEN2303-5269_00716": {
    courseName: "CVEN2303 Structural Analysis (T3 2026)",
    modules: [
      { id: "module-01-bending-moments", folder: "module-01",
        title: "Drawing Bending Moment Diagrams" },
      // { id: "module-02-shear-force",  folder: "module-02",
      //   title: "Shear Force Diagrams" },
    ]
  },

};