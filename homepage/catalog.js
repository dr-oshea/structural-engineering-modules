
/* ============================================================================
   homepage/catalog.js — THE SINGLE SOURCE OF TRUTH for modules & categories.

   Every module ever created is listed here ONCE, with its category, its
   position within that category, its display title, and its folder.
   courses.js entries reference modules by ID only — titles, categories, and
   ordering always come from here, so they can never drift or disagree.

   ── NOT READY YET? ──
   A module can be listed before it's finished, so students can see what's
   coming. Either:

       status: "coming-soon"           held back until you remove this line
       availableFrom: "2026-09-22"     releases itself on that date

   Either way it appears on the homepage greyed out and unclickable, labelled
   "Coming soon" (or "Available from 22 Sep"). `availableFrom` is usually the
   better choice: set the whole term's release schedule once, up front, and
   nothing needs editing mid-term.

   Readiness lives HERE, not in courses.js, because it's a property of the
   module itself — releasing it releases it in every course at once.

   ── To add a new module ──
   1. Build the module folder as usual (config.js with a unique moduleMeta.id).
   2. Add ONE entry to CATALOG.modules below with the same id.
   It then automatically appears in the setup tool and in the default suite
   of every course downstream of its category.

   ── To add a new category ──
   Add it to CATALOG.categories with the next `order` number, and reference
   it from the course that teaches it in prerequisites.js.
   ============================================================================ */

const CATALOG = {

  // Skill areas, in progression order (drives homepage section ordering).
  // Named by SUBJECT AREA, not course code — codes change, areas don't.
  categories: [
    { id: "statics",  name: "Statics",             order: 1 },   // ENGG1300
    { id: "solids",   name: "Solid Mechanics",     order: 2 },   // ENGG2400
    { id: "analysis", name: "Structural Analysis", order: 3 },   // CVEN2303
    { id: "steel",    name: "Steel Structures",    order: 4 },   // CVEN3303
    { id: "concrete", name: "Concrete Structures", order: 5 }    // CVEN3304
    // Add e.g. { id: "computations", ... } if CVEN2002-related modules appear.
  ],

  // Every module. `id` MUST equal the module's moduleMeta.id in its config.js.
  // `order` positions the module within its category (progression of skills).
  modules: [

    // ── Statics (ENGG1300) ──
    { id: "module-01-free-body", folder: "module-01",
      title: "Drawing Free Body Diagrams",     category: "statics", order: 1,
    status: "coming-soon" },
    
    { id: "module-02-equilibrium", folder: "module-02",
      title: "Using Equations of Equilibrium",     category: "statics", order: 2,
    status: "coming-soon" },
      
    { id: "module-03-reactions", folder: "module-03",
      title: "Calculating Reactions",     category: "statics", order: 3,
    status: "coming-soon" },

    { id: "module-04-bending-moments", folder: "module-04",
      title: "Drawing Bending Moment Diagrams",     category: "statics", order: 4 },

    { id: "module-05-trusses", folder: "module-05",
      title: "Solving Trusses",     category: "statics", order: 5,
      status: "coming-soon"},

    { id: "module-06-distributed-loads", folder: "module-05",
      title: "Handling Distributed Loads",     category: "statics", order: 6,
    status: "coming-soon"},

    { id: "module-07-internal-hinges", folder: "module-05",
      title: "Handling Internal Hinges",     category: "statics", order: 7,
    status: "coming-soon"},     

    { id: "module-10-cross-section",   folder: "module-10",
      title: "Cross Section Properties", category: "solids", order: 1,
      status: "coming-soon" },
    
      // { id: "module-05-equilibrium",  folder: "module-05",
    //   title: "Equilibrium & Reactions",          category: "statics", order: 1 },

    // ── Solid Mechanics (ENGG2400) ──
    // { id: "module-02-shear-force",  folder: "module-02",
    //   title: "Shear Force Diagrams",              category: "solids", order: 2 },

    // ── Structural Analysis (CVEN2303) ──
    // { id: "module-07-trusses",      folder: "module-07",
    //   title: "Truss Analysis",                    category: "analysis", order: 1 },

    // ── Steel Structures (CVEN3303) ──

    // ── Concrete Structures (CVEN3304) ──

  ]
};


/* ── Lookup helpers (used by the homepage and the setup tool) ─────────────── */

// Is this module released to students yet?
//   status: "coming-soon"        → no, until the line is removed
//   availableFrom: "YYYY-MM-DD"  → no, until that date (from 00:00 local time)
// Anything else (including no fields at all) → yes.
function catalogModuleAvailable(m) {
  if (!m) return false;
  if (m.status === "coming-soon") return false;
  if (m.availableFrom) {
    const from = new Date(m.availableFrom + "T00:00:00");
    if (!isNaN(from.getTime()) && Date.now() < from.getTime()) return false;
  }
  return true;
}

// What to show on a card that isn't available yet.
function catalogComingSoonLabel(m) {
  if (m && m.status !== "coming-soon" && m.availableFrom) {
    const d = new Date(m.availableFrom + "T00:00:00");
    if (!isNaN(d.getTime())) {
      const months = ["Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"];
      return `Available from ${d.getDate()} ${months[d.getMonth()]}`;
    }
  }
  return "Coming soon";
}

function catalogModule(id) {
  return CATALOG.modules.find(m => m.id === id) || null;
}

function catalogCategory(id) {
  return CATALOG.categories.find(c => c.id === id) || null;
}

// Sort module IDs into catalog order: by category order, then module order.
// Unknown IDs are kept (at the end) and flagged in the console.
function sortModuleIds(ids) {
  return ids.slice().sort((a, b) => {
    const ma = catalogModule(a), mb = catalogModule(b);
    if (!ma || !mb) {
      if (!ma) console.warn("[catalog] Unknown module id:", a);
      if (!mb) console.warn("[catalog] Unknown module id:", b);
      return ma ? -1 : (mb ? 1 : 0);
    }
    const ca = catalogCategory(ma.category), cb = catalogCategory(mb.category);
    const co = (ca ? ca.order : 999) - (cb ? cb.order : 999);
    return co !== 0 ? co : (ma.order - mb.order);
  });
}