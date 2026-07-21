/* ============================================================================
   homepage/prerequisites.js — the course network + default-suite logic.

   COURSE_GRAPH encodes the Structural Engineering flowchart (Jan 2026):
     requires — direct prerequisite course codes (the arrows)
     teaches  — which catalog categories the course itself teaches

   MATH / PHYS / MATS courses are kept for structural completeness but teach
   no module categories yet (teaches: []). Give them categories later if
   modules are ever made for them — nothing else needs to change.

   THE RULE (getDefaultModuleIds): a course's default revision suite is every
   module in every category taught by any course PRIOR to it (all ancestors
   in the graph, transitively) — NOT the course's own categories. So a course
   after CVEN2303 includes CVEN2303's "analysis" modules, but CVEN2303 itself
   defaults to statics + solids.
   ============================================================================ */

const COURSE_GRAPH = {

  // ── Level 1 ──
  "MATH1131": { name: "Mathematics 1A",
                requires: [],                       teaches: [] },
  "PHYS1121": { name: "Physics 1A",
                requires: [],                       teaches: [] },
  "MATH1231": { name: "Mathematics 1B",
                requires: ["MATH1131"],             teaches: [] },
  "ENGG1300": { name: "Engineering Mechanics",
                requires: ["PHYS1121"],             teaches: ["statics"] },
  "MATS1101": { name: "Engineering Materials and Chemistry",
                requires: [],                       teaches: [] },

  // ── Level 2 ──
  "CVEN2002": { name: "Engineering Computations",
                requires: ["MATH1231"],             teaches: [] },
  "MATH2018": { name: "Engineering Mathematics 2D",
                requires: ["MATH1231"],             teaches: [] },
  "ENGG2400": { name: "Mechanics of Solids 1",
                requires: ["ENGG1300", "MATS1101"], teaches: ["solids"] },
  "CVEN2303": { name: "Structural Analysis and Modelling",
                requires: ["ENGG1300", "ENGG2400"], teaches: ["analysis"] },

  // ── Level 3 ──
  "CVEN3303": { name: "Steel Structures",
                requires: ["CVEN2303"],             teaches: ["steel"] },
  "CVEN3304": { name: "Concrete Structures",
                requires: ["CVEN2303"],             teaches: ["concrete"] },

  // ── Level 4 ──
  "CVEN4300": { name: "Structures Practicum",
                requires: ["CVEN3304", "CVEN2303", "CVEN3303"], teaches: [] },
  "CVEN4301": { name: "Advanced Concrete Structures",
                requires: ["CVEN2303", "CVEN3304"],             teaches: [] },
  "CVEN4309": { name: "Timber Engineering",
                requires: ["CVEN2303"],             teaches: [] },
  "CVEN4308": { name: "Structural Dynamics",
                requires: ["CVEN2002", "CVEN2303"],             teaches: [] },

  // ── Level 9                
  "CVEN9822": { name: "Steel and Composite Structures",
                requires: ["CVEN2303", "CVEN3304", "CVEN3303"], teaches: [] },
  "CVEN9809": { name: "Reinforced Concrete Design",
                requires: ["CVEN3304"], teaches: [] },
  "CVEN9806": { name: "Prestressed Concrete Design",
                requires: ["CVEN3304"], teaches: [] },
  "CVEN9818": { name: "Bridge Engineering",
                requires: ["CVEN2303", "CVEN3304", "CVEN3303"], teaches: [] },
  "CVEN9820": { name: "Computational Structural Mechanics",
                requires: ["CVEN2303", "CVEN2002"], teaches: [] },
  "CVEN9840": { name: "Structural Health Monitoring Fundamentals and Practices",
                requires: ["CVEN2303", "CVEN2002"], teaches: [] },
  "CVEN9824": { name: "Advanced Materials Technology",
                requires: ["MATS1101", "ENGG2400"], teaches: [] },
  "CVEN9826": { name: "Advanced Mechanics of Structures and Materials ",
                requires: ["MATH2018, ENGG2400"], teaches: [] },              

};


/* ── All ancestor courses of `courseCode` (transitive closure of requires) ── */
function getAncestorCourses(courseCode) {
  const seen = new Set();
  const stack = [...((COURSE_GRAPH[courseCode] || {}).requires || [])];
  while (stack.length) {
    const c = stack.pop();
    if (seen.has(c)) continue;
    seen.add(c);
    const node = COURSE_GRAPH[c];
    if (node) stack.push(...node.requires);
  }
  return [...seen];
}

/* ── The categories a course's students should REVISE (ancestors' teaches) ── */
function getPrerequisiteCategories(courseCode) {
  const cats = new Set();
  getAncestorCourses(courseCode).forEach(c => {
    (COURSE_GRAPH[c].teaches || []).forEach(cat => cats.add(cat));
  });
  return [...cats];
}

/* ── The default module suite for a course, in catalog order ──────────────
   Every catalog module whose category is taught by any prior course.        */
function getDefaultModuleIds(courseCode) {
  const cats = new Set(getPrerequisiteCategories(courseCode));
  const ids  = CATALOG.modules.filter(m => cats.has(m.category)).map(m => m.id);
  return sortModuleIds(ids);
}