/* ============================================================================
   MODULE TEMPLATE — config.js

   This is the ONLY file you need to edit to build a module (plus adding your
   figures to images/). See AUTHORING_GUIDE.pdf for the full reference.

   BEFORE YOU START
     1. You should have COPIED module-template/ and renamed the copy,
        e.g. module-12-shear-flow. Don't edit the template itself.
     2. Change the <title> in index.html to your module's name.
     3. Set a unique id in moduleMeta below.

   THE LOOP
     Edit this file → save → refresh the browser (Ctrl+Shift+R).
     Add ?dev=1 to the address to unlock all slides while building.

   IF THE PAGE IS BLANK
     Press F12 and read the console error. It is almost always a missing
     comma between slides, an unclosed backtick, or a missing ] or }.
   ============================================================================ */


/* Unique identifier for this module — used to record completion.
   Convention: module-XX-short-name (must match the catalog entry). */
const moduleMeta = {
  id: "module-XX-short-name"
};


const moduleData = [

  /* ── OPENING SLIDE (keep first) ──────────────────────────────────────── */
  {
    type:       "splash",
    label:      "Home page",
    title:      "Your Module Title",
    subtitle:   "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
    // The contents list is generated automatically from the partStart
    // fields below — nothing to maintain here.
  },


  /* ── WHY THIS MATTERS (optional but recommended) ─────────────────────── */
  {
    type:  "context",
    label: "Context/Motivation",
    title: "Your Module Title",
    image: "images/your-motivating-image.jpg",
    text:  `<p>One or two sentences on why this topic matters in real
            engineering practice.</p>`
  },


  /* ══ PART 1 ═══════════════════════════════════════════════════════════
     A module is normally 3–5 parts. Each part = teaching slide(s) followed
     by an activity. The FIRST slide of a part carries `partStart`, which
     drives the sidebar heading AND the splash contents list.            */

  {
    type:      "info",
    partStart: "First Part Title",        // ← starts Part 1
    label:     "Short sidebar label",
    title:     "Slide heading",

    blocks: [
      { type: "text",
        html: `<p>Explain the concept here. Inline maths works: $M(x)$.</p>` },

      { type: "image",
        src:     "images/figure-01.svg",
        width:   "600px",                 // optional — figures fill the column
        caption: "Fig. 1 — Caption" },    // optional

      { type: "equation",
        latex: String.raw`M_{max} = \frac{wL^2}{8}` }
      // Use String.raw`…` so backslashes survive.
    ]
  },

  {
    // The activity that closes Part 1. Students must complete it to continue.
    type:     "mcq",
    label:    "Quiz: Short label",
    title:    "Question heading",
    question: `<p>Your question, with maths if useful: $\\Sigma M_A = 0$.</p>`,
    options: [
      { text: "Wrong answer" },
      { text: "Right answer", correct: true },   // exactly ONE correct
      { text: "Wrong answer" }
    ],
    explanation: `Shown once the student answers correctly.`
  },


  /* ── SEVERAL MCQs IN ONE SLIDE (optional) ──────────────────────────────
     Give `questions` instead of a single question and the slide asks them in
     sequence under ONE sidebar entry. Each question must be answered
     correctly before "Next question" appears — so students read the
     explanation before moving on. Completing the last one completes the
     slide. With only one question the slide behaves exactly as above.     */
  {
    type:  "mcq",
    label: "Check Your Understanding",
    title: "Check Your Understanding",

    questions: [
      {
        question: `<p>First question. Maths works inline: $M_{max}$?</p>`,
        options: [
          { text: "Wrong answer" },
          { text: "Right answer", correct: true },
          { text: "Wrong answer" }
        ],
        explanation: `Explain why this is the right answer — the student reads
                      this before clicking "Next question".`
      },
      {
        // Each question can carry its own figure
        // image: "images/question-2.svg",
        // imageWidth: "520px",
        question: `<p>Second question.</p>`,
        options: [
          { text: "Right answer", correct: true },
          { text: "Wrong answer" }
        ],
        explanation: `Explanation for the second question.`
      },
      {
        question: `<p>Third question.</p>`,
        options: [
          { text: "Wrong answer" },
          { text: "Wrong answer" },
          { text: "Right answer", correct: true }
        ],
        explanation: `Explanation for the third question.`
      },

      // A SELECT-ALL question can sit alongside single-answer ones.
      // Single-answer questions keep their immediate feedback on click; a
      // multi-select waits for Submit, because a half-made selection isn't
      // wrong yet. A wrong set says "not quite" WITHOUT marking anything,
      // so students adjust and resubmit until the whole set is right.
      {
        multi: true,
        question: `<p>Which of these are true? (Select all that apply.)</p>`,
        options: [
          { text: "A true statement",       correct: true },
          { text: "Another true statement", correct: true },
          { text: "A false statement" },
          { text: "Another false statement" }
        ],
        explanation: `Explain why those two, and not the others.`
      }
    ]
  },


  /* ══ PART 2 ═══════════════════════════════════════════════════════════ */

  {
    type:      "info",
    partStart: "Second Part Title",       // ← starts Part 2
    label:     "Short sidebar label",
    title:     "Slide heading",
    blocks: [
      { type: "text", html: `<p>…</p>` }
    ]
  },

  {
    // A guided worked example — students enter numeric answers step by step.
    type:    "steps",
    label:   "Worked Example: Short label",
    title:   "Worked example heading",
    image:   "images/problem-figure.svg",   // optional
    problem: `<p>A simply supported beam <strong>AB</strong> spans 6 m and
              carries a 12 kN point load 2 m from A.</p>`,
    steps: [
      {
        instruction: `Taking moments about <strong>A</strong>, find the
                      vertical reaction at <strong>B</strong>.`,

        // COLLAPSED hint — the student can try first, then open it if stuck.
        // HTML and LaTeX both work, including display equations.
        hint: `<p>Moments about A must balance:</p>
               \\[ \\Sigma M_A = 0 \\]
               <p>The 12 kN load acts 2 m from A, and $R_B$ acts at the far
               end, 6 m from A.</p>`,
        hintCollapsed: true,

        unit:        "kN",
        answer:      4,
        tolerance:   0.05,
        explanation: `$R_B \\times 6 = 12 \\times 2$, so $R_B = 4$ kN.`
      },
      {
        instruction: `Now use vertical equilibrium to find the reaction at
                      <strong>A</strong>.`,

        // ALWAYS-VISIBLE hint — omit `hintCollapsed` to show it straight away
        hint: `<p>Every vertical force must sum to zero:
               $\\Sigma F_y = 0$.</p>`,

        unit:        "kN",
        answer:      8,
        tolerance:   0.05,
        explanation: `$R_A = 12 - 4 = 8$ kN.`
      },
      {
        // A step with NO hint at all — nothing extra is shown
        instruction: `Calculate the bending moment directly under the load
                      (at $x = 2$ m from A).`,
        unit:        "kNm",
        answer:      16,
        tolerance:   0.05,
        explanation: `$M = R_A \\times 2 = 8 \\times 2 = 16$ kNm — the peak
                      of the bending moment diagram.`
      }
    ]
  },


  /* ── INTERACTIVE DIAGRAM (optional) ────────────────────────────────────
     Students BUILD a diagram: click a node, choose what to add, fill in the
     details, press Enter — and it's drawn on the figure, right or wrong.
     "Check" then flags each node green or red. See AUTHORING_GUIDE.pdf §5.
     A node holds a LIST of items, so a pin support can take two forces.   */
  {
    type:  "interactive-diagram",
    label: "Draw the Free Body Diagram",
    title: "Construct the Free Body Diagram",

    image:      "images/fbd-beam.svg",
    imageWidth: "760px",
    prompt: `<p>Click each marked point and add every force and moment acting
             there, then press <strong>Check answers</strong>.</p>`,
    successFeedback: `<p>Any variable name works, but engineers conventionally
              use $A_x$ and $A_y$ for reactions at support A.</p>`,

    // WHAT can be added. Each type has its own fields and its own drawing.
    itemTypes: {
      force: {
        label: "Force",
        draw:  { shape: "arrow", color: "#c62828", length: 70 },
        labelTemplate: "{mag} kN",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "up",    label: "Upward ↑",    draw: { angle: 270 } },
              { value: "down",  label: "Downward ↓",  draw: { angle:  90 } },
              { value: "left",  label: "Leftward ←",  draw: { angle: 180 } },
              { value: "right", label: "Rightward →", draw: { angle:   0 } }
          ]},
          { id: "mag", label: "Magnitude", type: "number",
            unit: "kN", tolerance: 0.05 }
        ]
      },
      moment: {
        label: "Moment",
        draw:  { shape: "moment", color: "#3f61c4", radius: 26 },
        labelTemplate: "{mag} kNm",
        fields: [
          { id: "sense", label: "Sense", type: "select", options: [
              { value: "cw",  label: "Clockwise ↻",     draw: { sense: "cw"  } },
              { value: "ccw", label: "Anticlockwise ↺", draw: { sense: "ccw" } }
          ]},
          { id: "mag", label: "Magnitude", type: "number",
            unit: "kNm", tolerance: 0.1 }
        ]
      },

      // ── Distributed loads attach to a REGION, not a node ──
      udl: {
        label: "Uniform load",
        draw:  { shape: "spanLoad", color: "#c62828", mag: "w" },
        labelTemplate: "{w} kN/m",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "down", label: "Vertically down",        draw: { loadDir: "down" } },
              { value: "up",   label: "Vertically up",          draw: { loadDir: "up"   } },
              { value: "perp", label: "Perpendicular to member", draw: { loadDir: "perp" } }
          ]},
          { id: "w", label: "Magnitude", type: "number",
            unit: "kN/m", tolerance: 0.05 }
        ]
      },
      varyingLoad: {
        label: "Varying load",
        // Two magnitude fields → a trapezoidal/triangular load
        draw:  { shape: "spanLoad", color: "#c62828", magStart: "wA", magEnd: "wB" },
        labelTemplate: "{v} kN/m",          // {v} is each end's own value
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "down", label: "Vertically down",         draw: { loadDir: "down" } },
              { value: "perp", label: "Perpendicular to member",  draw: { loadDir: "perp" } }
          ]},
          { id: "wA", label: "Magnitude at A", type: "number", unit: "kN/m", tolerance: 0.05 },
          { id: "wB", label: "Magnitude at B", type: "number", unit: "kN/m", tolerance: 0.05 }
        ]
      }
    },

    // SPANS where distributed loads can be added.
    // ax,ay → bx,by are the ends ON the structure (percentages of the image);
    // `height` is how far the clickable box extends off the member, and its
    // SIGN chooses which side. The box rotates with the member, so an inclined
    // member works without any extra configuration.
    regions: [
      {
        ax: 25, ay: 55, bx: 65, by: 55,     // a horizontal member
        height: 45,                          // box extends ABOVE the member
        label: "BC",
        answers: [[
          { itemType: "udl", values: { dir: "down", w: 4 } }
        ]]
      },
      {
        ax: 65, ay: 55, bx: 88, by: 32,     // an INCLINED member
        height: 40,
        label: "CD",
        answers: [[
          { itemType: "udl", values: { dir: "perp", w: 3 } }
        ]]
      }
    ],

    // WHERE point items can be added.
    // x, y are percentages of the image, measured from the top-left.
    nodes: [
      {
        x: 12, y: 62, label: "A", title: "Support A (pin)",

        // OPTIONAL hint, shown at the top of this node's form. These are
        // revision exercises, so walking the student through the method is
        // often exactly right. HTML and LaTeX both work.
        // Add  hintCollapsed: true  to fold it behind a "Show hint" toggle.
        hint: `<p>A pin resists movement in <em>two</em> directions, so it
               needs two force components.</p>
               <p>Find the vertical one from $\\Sigma M_E = 0$.</p>`,

        // A pin needs TWO forces — order doesn't matter
        answers: [[
          { itemType: "force", values: { dir: "up",    mag: 13.8 } },
          { itemType: "force", values: { dir: "right", mag: 5.0  } }
        ]]
      },
      {
        x: 88, y: 62, label: "E", title: "Support E (roller)",
        answers: [
          [ { itemType: "force", values: { dir: "up", mag: 10.2 } } ]
        ]
      },
      {
        x: 50, y: 30, label: "C", title: "Midspan",
        // Nothing acts here — an empty set is the right answer
        answers: [[]]
      }
    ]
  },


  /* ══════════════════════════════════════════════════════════════════════
     DRAWING SHEAR FORCE AND BENDING MOMENT DIAGRAMS  ("diagram-plot")

     Students click a segment and describe it through a SHORT PAGED FORM —
     shape, then end A, then end B, then the turning point — using ‹ › to
     move between pages and Enter on the last. Whatever they describe is
     drawn, right or wrong; Check then names the segment and the field.

     THE BACKGROUND IMAGE only needs the structure, its supports and loads,
     with BLANK SPACE BELOW for the diagrams. Don't draw axes — the engine
     draws each plot's datum for you.

     GEOMETRY IS DERIVED: give each plot an `axis` (the datum as image
     percentages), a `span` in problem units, and the `breaks` between
     segments. Nothing is eyeballed, and two plots on the same structure
     can't drift out of line.

     Three examples follow, one per way of stating WHICH SIDE of the datum
     a value falls.
     ══════════════════════════════════════════════════════════════════════ */


  /* ── EXAMPLE 1 — "signed" (for an SFD) and "segment" (for a BMD) ────────
     Simply supported beam, 8 m span, UDL of 6 kN/m over the LEFT HALF.
        R_A = 18 kN,  R_B = 6 kN
        Shear:  +18 at A falling to −6 at midspan, then constant −6
        Moment: 0 at A, PEAK 27 kNm at x = 3 m, 24 kNm at C, 0 at B        */
  {
    type:  "diagram-plot",
    label: "Draw the SFD and BMD",
    title: "Draw the Shear Force and Bending Moment Diagrams",

    image:      "images/beam-udl-half.svg",
    imageWidth: "820px",
    prompt: `<p>The beam carries a UDL of <strong>6 kN/m</strong> over its left
             half. The reactions are $R_A = 18$ kN and $R_B = 6$ kN.</p>
             <p>Draw the shear force diagram first, then the bending moment
             diagram.</p>`,
    successFeedback: `<p>The moment peaks where the shear passes through zero —
             here at $x = 3$ m, giving $M_{max} = 27$ kNm.</p>`,

    plots: [

      {
        id:    "sfd",
        title: "Shear Force Diagram",
        unit:  "kN",
        scale: 2,                      // px per kN
        color: "#007882",

        // SIDE MODE 1 — "signed": the student types the number WITH its sign,
        // so segment AC runs +18 straight through to −6 as one line and the
        // zero crossing falls out of it. No "which side?" question is asked.
        sideMode: "signed",
        positiveSide: "above",         // what a POSITIVE number means

        // The datum is the click target, invisible until hovered.
        // Drop these two for the default dashed box.
        hitStyle: "line",
        hitBand:  14,

        // Wording, per plot
        labels: {
          shape: "What shape is the shear over this length?",
          vA:    "Shear at the left end",
          vB:    "Shear at the right end",
          value: "Shear (constant along this length)"
        },

        axis:   { ax: 10, ay: 46, bx: 90, by: 46 },
        span:   [0, 8],                // the beam runs 0 → 8 m along that axis
        breaks: [0, 4, 8],             // segment boundaries, in metres

        segments: [
          {
            label: "A → C",
            hint: `<p>Start at $R_A$ and subtract the UDL as you move right:</p>
                   \\[ V(x) = R_A - wx \\]`,
            hintCollapsed: true,
            answers: [[ { shape: "linear", values: { vA: 18, vB: -6 } } ]]
          },
          {
            label: "C → B",
            // No load beyond midspan, so the shear holds constant
            answers: [[ { shape: "constant", values: { value: -6 } } ]]
          }
        ]
      },

      {
        id:    "bmd",
        title: "Bending Moment Diagram",
        unit:  "kNm",
        scale: 1.5,
        color: "#3f61c4",

        requires: "sfd",               // locked until the SFD is right

        // SIDE MODE 2 — "segment" (the default): magnitudes plus ONE side for
        // the whole segment. This is the classic tension-side BMD.
        sideMode: "segment",

        // TURNING POINT — "both" asks WHERE it is and WHAT it is. A parabola
        // is fitted through the three points, so the two can never contradict
        // each other. Use "location" to ask only where, or "value" only what.
        turningInput: "both",

        labels: {
          shape:   "What shape is the moment over this length?",
          side:    "Which face is in tension?",
          vA:      "Moment at the left end",
          vB:      "Moment at the right end",
          turning: "Is there a turning point?",
          peakAt:  "Where does the shear cross zero? (m from A)",
          peak:    "Maximum moment there"
        },

        axis:   { ax: 10, ay: 82, bx: 90, by: 82 },
        span:   [0, 8],
        breaks: [0, 4, 8],

        segments: [
          {
            label: "A → C",
            // Side wording can be set per SEGMENT, so it can speak the
            // language of this particular member
            sides: [
              { value: "below", label: "Tension underneath (sagging)" },
              { value: "above", label: "Tension on top (hogging)" }
            ],
            hint: `<p>The change in moment is the <strong>area under the
                   SFD</strong>:</p>
                   \\[ \\Delta M = \\int V\\,dx \\]
                   <p>Linear shear means a <strong>quadratic</strong> moment,
                   turning where the shear crosses zero.</p>`,
            hintCollapsed: true,
            answers: [[ { shape: "quadratic",
                          values: { side: "below", vA: 0, vB: 24,
                                    turning: "inside", peakAt: 3, peak: 27 } } ]]
          },
          {
            label: "C → B",
            sides: [
              { value: "below", label: "Tension underneath (sagging)" },
              { value: "above", label: "Tension on top (hogging)" }
            ],
            answers: [[ { shape: "linear",
                          values: { side: "below", vA: 24, vB: 0 } } ]]
          }
        ]
      }

    ]
  },


  /* ── EXAMPLE 2 — "ends": a segment that CHANGES SIDE ────────────────────
     Overhanging beam: 8 m span with a UDL of 3 kN/m, plus a 2 m overhang
     carrying 12 kN at its tip.    R_A = 9 kN,  R_B = 27 kN

        M = 0 at A, peaks SAGGING at +13.5 kNm (x = 3 m),
        crosses zero at x = 6 m, and reaches HOGGING −24 kNm at B

     One side for that whole segment would be misleading, so this plot asks
     for a side at EACH end.                                                */
  {
    type:  "diagram-plot",
    label: "BMD: overhanging beam",
    title: "Bending Moment Diagram — Overhanging Beam",

    image:      "images/beam-overhang.svg",
    imageWidth: "820px",
    prompt: `<p>An 8 m span carries a UDL of <strong>3 kN/m</strong>; a 2 m
             overhang carries <strong>12 kN</strong> at its tip.
             $R_A = 9$ kN and $R_B = 27$ kN.</p>`,

    plots: [
      {
        id:    "bmd",
        title: "Bending Moment Diagram",
        unit:  "kNm",
        scale: 1.6,
        color: "#3f61c4",

        // SIDE MODE 3 — "ends": a magnitude AND a side for each end
        sideMode: "ends",

        // Only the POSITION of the turning point is asked here; the value
        // follows from it. (Use "both" to ask for the value as well.)
        turningInput: "location",

        labels: {
          shape:   "What shape is the moment over this length?",
          sideA:   "Tension face at the left end",
          sideB:   "Tension face at the right end",
          vA:      "Moment at the left end",
          vB:      "Moment at the right end",
          turning: "Is there a turning point?",
          peakAt:  "Where is it? (m from A)"
        },

        axis:   { ax: 8, ay: 70, bx: 92, by: 70 },
        span:   [0, 10],               // 8 m span + 2 m overhang
        breaks: [0, 8, 10],

        segments: [
          {
            label: "A → B (span)",
            sides: [
              { value: "below", label: "Tension underneath (sagging)" },
              { value: "above", label: "Tension on top (hogging)" }
            ],
            hint: `<p>Sagging near midspan but hogging at the support, so the
                   curve <strong>changes side</strong> within this segment —
                   give each end its own tension face.</p>
                   <p>It turns where the shear is zero.</p>`,
            hintCollapsed: true,
            answers: [[ { shape: "quadratic",
                          values: { sideA: "below", vA: 0,     // zero at the pin
                                    sideB: "above", vB: 24,    // hogging at B
                                    turning: "inside", peakAt: 3 } } ]]
          },
          {
            label: "B → C (overhang)",
            sides: [
              { value: "below", label: "Tension underneath (sagging)" },
              { value: "above", label: "Tension on top (hogging)" }
            ],
            // Hogging throughout, running back to zero at the free end
            answers: [[ { shape: "linear",
                          values: { sideA: "above", vA: 24,
                                    sideB: "above", vB: 0 } } ]]
          }
        ]
      }
    ]
  },


  /* ── EXAMPLE 3 — A FRAME: several members in one plot ───────────────────
     L-frame: 4 m column AB, 8 m beam BC, pin at A, vertical roller at C,
     with a 10 kN horizontal load at the joint B.

        A_x = 10 kN opposing the load,  A_y = 5 kN down,  C_y = 5 kN up
        Column AB: 0 at the pin, rising linearly to 40 kNm at B
        Beam BC:   40 kNm at B, falling linearly to 0 at the roller

     Name an AXIS PER MEMBER and point each segment at the one it belongs
     to. Each member keeps its own local coordinate, so `from` and `to`
     read exactly as they do in the problem.                               */
  {
    type:  "diagram-plot",
    label: "BMD: portal frame",
    title: "Bending Moment Diagram — L-Frame",

    image:      "images/frame-L.svg",
    imageWidth: "760px",
    prompt: `<p>The frame carries a <strong>10 kN</strong> horizontal load at
             the joint. Draw the bending moment diagram on each member.</p>`,
    successFeedback: `<p>The tension face runs continuously around the corner —
             the inside of the column meets the inside of the beam.</p>`,

    plots: [
      {
        id:    "bmd",
        title: "Bending Moment Diagram",
        unit:  "kNm",
        scale: 1.2,
        color: "#3f61c4",
        sideMode: "segment",

        labels: {
          shape: "What shape is the moment along this member?",
          side:  "Which face of the member is in tension?",
          vA:    "Moment at the start of the member",
          vB:    "Moment at the end of the member"
        },

        // One named axis per member, each with its own span in metres
        axes: {
          col: { ax: 20, ay: 88, bx: 20, by: 34, span: [0, 4] },  // A → B, up
          bm:  { ax: 20, ay: 34, bx: 86, by: 34, span: [0, 8] }   // B → C
        },

        segments: [
          {
            axis: "col", from: 0, to: 4, label: "AB (column)",
            // On a member running UPWARDS, "above" is its left-hand face
            sides: [
              { value: "below", label: "Inside face of the frame" },
              { value: "above", label: "Outside face of the frame" }
            ],
            hint: `<p>A pin carries no moment, so the diagram starts at zero
                   at A and grows to the joint value at B.</p>`,
            hintCollapsed: true,
            answers: [[ { shape: "linear",
                          values: { side: "below", vA: 0, vB: 40 } } ]]
          },
          {
            axis: "bm", from: 0, to: 8, label: "BC (beam)",
            // On a member running LEFT TO RIGHT, "below" is its underside
            sides: [
              { value: "below", label: "Underside (inside the frame)" },
              { value: "above", label: "Top face (outside the frame)" }
            ],
            hint: `<p>No load along the beam, so the moment runs straight from
                   the joint value back to zero at the roller.</p>`,
            hintCollapsed: true,
            answers: [[ { shape: "linear",
                          values: { side: "below", vA: 40, vB: 0 } } ]]
          }
        ]
      }
    ]
  },


  /* ── FILL IN THE BLANKS (optional) ─────────────────────────────────────
     Students click a word in the bank, then click a blank to place it.
     Clicking a placed word sends it back. Check marks everything at once and
     flags the wrong ones; they fix and re-check until all are right.

     THE PASSAGE IS THE ANSWER KEY — wrap each answer in [[double brackets]]
     and the word bank builds itself. `distractors` adds words that fit no
     blank, so there are more options than gaps.

     Click-to-place, not drag-and-drop: HTML5 dragging doesn't work on touch
     devices, and students open these on phones from Moodle.               */
  {
    type:  "cloze",
    label: "Truss Members",
    title: "Truss Members",

    intro: `<p>To carry only axial forces, a truss needs pinned connections
            and loads applied only at its joints. Complete the load path
            below.</p>`,

    text: `<p>For this roof truss, the:</p>
           <p>(1) [[roof sheeting]] connects to the</p>
           <p>(2) [[purlins]] which connect to the</p>
           <p>(3) [[truss joints]].</p>`,

    // Extra words that fit nowhere — students must discriminate
    distractors: ["rafters", "bracing"],

    image:         "images/roof-truss.svg",
    imagePosition: "right",           // or "below" to stack it under the text
    imageWidth:    "420px",

    hint: `<p>Follow the load downwards: what does the wind or snow land on
           first, and what carries it from there?</p>`,
    hintCollapsed: true,

    explanation: `Loads travel from the sheeting, through the purlins, into
                  the truss joints — which is why external forces arrive at
                  the joints and the members carry only axial force.`
  },


  /* ══ ADD MORE PARTS HERE ══════════════════════════════════════════════
     Other content types available (see AUTHORING_GUIDE.pdf §5):
       cards     flip cards for key concepts
       hotspot   click the ONE correct region on a diagram
       explore   click many points to reveal explanations
       reveal    "show solution" toggle, no input required
       embed     GeoGebra / Desmos / video
       pptslide  a slide designed in PowerPoint, exported as PNG       */


  /* ══ FINAL PART: TEST YOUR KNOWLEDGE ══════════════════════════════════
     One sidebar entry containing its own intro → questions → results.
     One attempt per question; it advances whether right or wrong, then
     shows a score, a review table, and a Retry button. Reaching the
     results page completes the module regardless of score.
     MCQ options are shuffled on every attempt.                         */
  {
    type:      "quiz",
    partStart: "Test Your Knowledge",     // ← its own part in the contents
    label:     "Test Your Knowledge",
    title:     "Test Your Knowledge",

    intro:     "Answer the following questions to complete the module. You have "
             + "one attempt per question, but you can retry the whole quiz as "
             + "many times as you like.",
    startText: "Start Quiz",              // optional

    questions: [

      // SELECT ALL THAT APPLY — add multi:true and mark every correct option.
      // One attempt in a quiz: Submit reveals the right answer and advances.
      {
        kind:  "mcq",
        multi: true,
        question: `<p>Which assumptions are needed for a truss to carry only
                   axial forces?</p>`,
        options: [
          { text: "All connections are pinned",       correct: true },
          { text: "Loads are applied only at joints", correct: true },
          { text: "All members are the same length" },
          { text: "Both supports must be fixed" }
        ]
        // showCount: true    // optional: tell them HOW MANY are correct
      },

      // Multiple choice (single answer)
      {
        kind:     "mcq",
        question: `<p>Your question here. Maths works: $M_{max} = \\frac{PL}{4}$.</p>`,
        options: [
          { text: "Wrong answer" },
          { text: "Right answer", correct: true },   // exactly ONE correct
          { text: "Wrong answer" },
          { text: "Wrong answer" }
        ]
        // Add  shuffle: false  to keep this question's options in order
        // (useful for "all of the above").
      },

      // Numeric answer
      {
        kind:      "input",
        question:  `<p>A simply supported beam of span <strong>4 m</strong>
                    carries a UDL of <strong>6 kN/m</strong>. What is the
                    maximum bending moment?</p>
                    <p><em>Recall $M_{max} = wL^2/8$</em></p>`,
        answer:    12,
        tolerance: 0.1,
        unit:      "kNm"
      },

      // A question with a figure
      {
        kind:     "mcq",
        // image:      "images/question-figure.svg",   // optional
        // imageWidth: "500px",
        question: `<p>Another question.</p>`,
        options: [
          { text: "Option A" },
          { text: "Option B", correct: true },
          { text: "Option C" }
        ]
      }

    ]
  },


  /* ── CLOSING SLIDE (keep last) ───────────────────────────────────────── */
  {
    type:         "final",
    label:        "Module Complete",
    title:        "Well done!",
    subtitle:     "You've completed this module.",
    buttonText:   "Save and Close",
    showRating:   true,
    showFeedback: true,
    bugReportUrl: "https://forms.office.com/your-bug-report-form"
  }

];