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

  "CVEN2301": {
    courseName: "Mechanics of Solids",
    modules: [
      { id: "module-01-bending-moments", folder: "module-01",
        title: "Drawing Bending Moment Diagrams" },
      // { id: "module-02-shear-force",  folder: "module-02",
      //   title: "Shear Force Diagrams" },
    ]
  },

  // "CVEN3304": {
  //   courseName: "Structural Analysis & Design",
  //   modules: [
  //     { id: "module-01-bending-moments", folder: "module-01",
  //       title: "Drawing Bending Moment Diagrams" },   // same module, other course
  //   ]
  // },

};