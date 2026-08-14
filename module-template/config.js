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
    problem: `<p>State the problem here.</p>`,
    steps: [
      {
        instruction: `First thing to calculate.
                      <br><em>Hint: $\\Sigma M_A = 0$</em>`,
        unit:        "kN",
        answer:      4,
        tolerance:   0.05,
        explanation: `$R_B = 24 \\div 6 = 4$ kN`
      }
      // …more steps
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
              { value: "right", label: "Rightward →", draw: { angle:   0 } },
              { value: "angled", label: "Angled ", draw: { angle:   315 } }
          ]},
          { id: "mag", label: "Magnitude", type: "number",
            unit: "kN", tolerance: 0.05 }
        ]
      },
    forcereaction: {
        label: "Reaction Force",
        draw:  { shape: "arrow", color: "#1c8b3b", length: 70 },
        labelTemplate: "{name}",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "up",    label: "Upward ↑",    draw: { angle: 270 } },
              { value: "down",  label: "Downward ↓",  draw: { angle:  90 } },
              { value: "left",  label: "Leftward ←",  draw: { angle: 180 } },
              { value: "right", label: "Rightward →", draw: { angle:   0 } },
              { value: "angled", label: "Angled ", draw: { angle:   315 } }
          ]},
          { id: "name", label: "Name", type: "text"}
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
      }
    },

    // WHERE things can be added, and what's correct there.
    // x, y are percentages of the image, measured from the top-left.
    nodes: [
      {
        x: 12, y: 62, label: "A", title: "Support A (pin)",
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