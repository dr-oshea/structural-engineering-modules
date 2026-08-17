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


  /* ── DRAW THE SFD AND BMD (optional) ───────────────────────────────────
     WORKED EXAMPLE — simply supported beam, span 8 m, carrying a UDL of
     6 kN/m over the LEFT HALF only (A at x=0, C at midspan x=4, B at x=8).

        R_A = 18 kN,  R_B = 6 kN
        Shear:  +18 at A, falling to 0 at x = 3 m, then −6 from x = 4 to 8
        Moment: 0 at A, PEAK 27 kNm at x = 3 m, 24 kNm at C, 0 at B

     Note where the segments break. The SFD is split at x = 3 m because the
     shear CHANGES SIDE there — each segment sits on one side of the datum.
     The BMD is NOT split there: it's a single parabola whose turning point
     lies inside the segment, which is exactly what `turning: "inside"` is for.

     Positions are % of the image, with the beam running 10% → 90%:
        x = 0 m → 10%     x = 3 m → 40%     x = 4 m → 50%     x = 8 m → 90%  */
  {
    type:  "diagram-plot",
    label: "Draw the SFD and BMD",
    title: "Draw the Shear Force and Bending Moment Diagrams",

    image:      "images/beam-udl-half.svg",   // beam, supports and the UDL
    imageWidth: "820px",
    prompt: `<p>The beam carries a UDL of <strong>6 kN/m</strong> over its left
             half. The reactions are $R_A = 18$ kN and $R_B = 6$ kN.</p>
             <p>Click each segment and describe it, then press
             <strong>Check answers</strong>.</p>`,
    successFeedback: `<p>The bending moment peaks where the shear passes
             through zero — here at $x = 3$ m, giving $M_{max} = 27$ kNm.</p>`,

    plots: [

      /* ── SHEAR FORCE DIAGRAM ──
         Set  given: true  to hand students the SFD instead (values are then
         labelled for them) so they only have to draw the BMD.            */
      {
        id:    "sfd",
        title: "Shear Force Diagram",
        unit:  "kN",
        scale: 2,                 // px per kN → 18 kN draws 36 px tall
        color: "#007882",
        // given: true,
        segments: [
          {
            ax: 10, ay: 34, bx: 40, by: 34, label: "A→(V=0)",
            // 18 kN at A falling to zero at x = 3 m
            answers: [[ { shape: "linear",
                          values: { side: "above", vA: 18, vB: 0 } } ]]
          },
          {
            ax: 40, ay: 34, bx: 50, by: 34, label: "(V=0)→C",
            // crosses the datum, so this piece sits BELOW it
            answers: [[ { shape: "linear",
                          values: { side: "below", vA: 0, vB: 6 } } ]]
          },
          {
            ax: 50, ay: 34, bx: 90, by: 34, label: "C→B",
            // no load beyond midspan → constant −6 kN
            answers: [[ { shape: "constant",
                          values: { side: "below", value: 6 } } ]]
          }
        ]
      },

      /* ── BENDING MOMENT DIAGRAM ──
         Sagging, so tension is on the underside: drawn BELOW the beam.   */
      {
        id:    "bmd",
        title: "Bending Moment Diagram",
        unit:  "kNm",
        scale: 1.5,               // px per kNm → 27 kNm draws ~40 px
        color: "#3f61c4",
        segments: [
          {
            ax: 10, ay: 72, bx: 50, by: 72, label: "AC",

            // A hint that spells out the method for this segment
            hint: `<p>The change in moment between two points equals the
                   <strong>area under the SFD</strong> between them:</p>
                   \\[ \\Delta M = \\int V\\,dx \\]
                   <p>The shear is linear here, so the moment is
                   <strong>quadratic</strong>. Its turning point is where the
                   shear crosses zero — at $x = 3$ m.</p>`,

            // Parabolic under the UDL. NOT split at x = 3 — the turning
            // point sits inside, and its value IS the maximum moment.
            answers: [[ { shape: "quadratic",
                          values: { side: "below", vA: 0, vB: 24,
                                    turning: "inside", peak: 27 } } ]]
          },
          {
            ax: 50, ay: 72, bx: 90, by: 72, label: "CB",

            // Folded away, so students can try unaided first
            hint: `<p>Beyond midspan the shear is constant, so the moment
                   changes at a constant rate — a straight line back to zero
                   at the roller.</p>`,
            hintCollapsed: true,

            // No load beyond C, so the moment runs straight back to zero
            answers: [[ { shape: "linear",
                          values: { side: "below", vA: 24, vB: 0 } } ]]
          }
        ]
      }

    ]
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

      // Multiple choice
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