// Optional module metadata — used by the final slide's save payload
const moduleMeta = {
  id: "module-01-bending-moments"
};

const moduleData = [
  {
    type: "splash",
    label: "Home page",
    title: "Drawing Bending Moment Diagrams",
    subtitle: "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
  },

  {
    type: "context",
    label: "Context/Motivation",
    title: "Drawing Bending Moment Diagrams",
    image: "images/context-beam-engineer.jpg",
    text: `<p>Drawing bending moment diagrams lets engineers locate and calculate the maximum
          deflections and bending stresses in a member.</p>
          <p> It is a foundational skill crucial to many of your Structural Engineering courses at UNSW. </p>`
  },


  // INFO SLIDE:   What is a bending moment? 
  {
    type: "info",
    label: "What is a bending moment?",
    title: "What is a Bending Moment?",

    content: `
      <p>Beams bend!</p>

      <ul>
        <li>Equilibrium</li>
        <li>Internal forces</li>
        <li>Load paths</li>
      </ul>
    `,

    image: "images/truss.svg"
  },


  // INFO SLIDE:   Relationship between Shear and Bending
  {
    type: "info",
    label: "Relationship V and M",
    title: "Relationship between Shear Force and Bending Moment",

    blocks: [
      {
        type: "text",
        html: `<p>Shear force is the derivative of the bending moment. This means
               the slope of the bending moment diagram at any point equals the
               shear force at that point.</p>`
      },
      {
        type: "equation",
        html: `V(x) = dM(x) / dx`
      },
      {
        type: "text",
        html: `<p>We use this relationship to:</p>
               <ul>
                 <li>Locate maximum bending moments (where V = 0)</li>
                 <li>Sketch one diagram from the other</li>
                 <li>Check the consistency of our results</li>
               </ul>`
      }
    ]
  },

  {
    type:  "steps",
    label: "Worked Example: Beam Reactions",
    title: "Simply Supported Beam — Finding Reactions",

    image: "images/module-01_01.svg",   // beam figure shown above the problem
  
    problem: `
      <p>
        A simply supported beam <strong>AB</strong> has a span of <strong>6 m</strong>.
        A point load of <strong>12 kN</strong> acts vertically downward at a point
        <strong>2 m from A</strong>.
      </p>
      <p>Work through the steps below to find the support reactions and the
      maximum bending moment.</p>
    `,
  
    steps: [
  
      {
        instruction: `Taking moments about <strong>A</strong>, find the vertical
                      reaction at <strong>B</strong>.
                      <br><em>Hint: ΣM<sub>A</sub> = 0</em>`,
        unit:        "kN",
        answer:      4,
        tolerance:   0.05,
        explanation: `ΣM_A = 0 → R_B × 6 = 12 × 2 = 24 → R_B = 24 ÷ 6 = <strong>4 kN</strong>`
      },
  
      {
        instruction: `Using vertical equilibrium, find the reaction at <strong>A</strong>.
                      <br><em>Hint: ΣF<sub>y</sub> = 0</em>`,
        unit:        "kN",
        answer:      8,
        tolerance:   0.05,
        explanation: `ΣF_y = 0 → R_A + R_B = 12 → R_A = 12 − 4 = <strong>8 kN</strong>`
      },
  
      {
        instruction: `Calculate the bending moment at the point load
                      (i.e. at <strong>x = 2 m</strong> from A).
                      <br><em>Hint: consider only the forces to the left of the section.</em>`,
        image:       "images/module-01_step3_cut.svg",  // optional per-step hint figure
        unit:        "kNm",
        answer:      16,
        tolerance:   0.05,
        explanation: `M(x=2) = R_A × 2 = 8 × 2 = <strong>16 kNm</strong>
                      — this is also the peak of the bending moment diagram.`
      }
 
    ]
  },

  
  // CARDS:   Extra Info on Bending Moment
  {
    type: "cards",
    label: "Key Concepts",
    title: "Key Concepts",

    intro: `<p>Here are three foundational concepts that underpin bending moment
            analysis. <strong>Click each card</strong> to reveal its definition.</p>`,

    cards: [
      {
        front: "📐 Equilibrium",
        back: "Sum of forces = 0 and sum of moments = 0"
      },
      {
        front: "🧩 Free Body Diagrams",
        back: "Used to isolate and understand forces in structures"
      },
      {
        front: "🏗️ Load Paths",
        back: "Describes how forces travel through structures"
      }
    ]
  },


  // MCQ SLIDE:   Quiz on max bending moment
  {
    type:  "mcq",
    label: "Quiz: Max Bending Moment",
    title: "Multiple Choice: Bending Moment",

    question: `
      <p>
        A simply supported beam of span <strong>8 m</strong> carries a
        <strong>uniformly distributed load of 10 kN/m</strong> over its entire length.
      </p>
      <p>What is the <strong>maximum bending moment</strong> in the beam?</p>
    `,

    options: [
      { text: "40 kNm"  },
      { text: "80 kNm",  correct: true },
      { text: "160 kNm" },
      { text: "320 kNm" }
    ],

    explanation: `M_max = wL² / 8 = 10 × 8² / 8 = <strong>80 kNm</strong>, occurring at midspan.`
  },


  // ── EXAMPLE: image-based MCQ (uncomment & supply SVGs to use) ──────────────
  // {
  //   type:  "mcq",
  //   label: "Quiz: Identify the BMD",
  //   title: "Which is the correct Bending Moment Diagram?",
  //   image: "images/module-01_bmd_question.svg",   // the beam + loading shown above options
  //   question: `<p>For the beam shown above, select the correct bending moment diagram.</p>`,
  //   options: [
  //     { image: "images/bmd_option_a.svg" },
  //     { image: "images/bmd_option_b.svg", correct: true },
  //     { image: "images/bmd_option_c.svg" },
  //     { image: "images/bmd_option_d.svg" }
  //   ],
  //   explanation: `Option B is correct — the moment peaks under the point load and is zero at both pinned supports.`
  // },

    // EXAMPLE GEOGEBRA
    {
    type:  "embed",
    label: "Interactive: Mohr's Circle",
    title: "Drag the slider to transform the stresses",
  
    intro: `<p>Please wait a moment for the applet to load. Try rotating the element and observing how the values of stress change. When are the normal stresses maximum and minimum?</p>`,
  
    src:         "https://www.geogebra.org/material/iframe/id/xjmmtgqt/width/1203/height/768/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false",
    aspectRatio: "16 / 10",          // optional — default is 16/9
    maxWidth:    "820px",            // optional
    caption:     "GeoGebra applet — interact directly above."
  },

  // EXAMPLE REVEAL
  {
    type:   "reveal",
    label:  "Try it: Reaction at B",
    title:  "Quick Check — Reaction at B",

    // image:     "images/module-01_01.svg",   // optional figure above the prompt
    // imageWidth:"480px",

    prompt: `<p>For the beam from the worked example (6 m span, 12 kN load at 2 m
             from A), have a go at finding the reaction at <strong>B</strong> on
             paper. When you're ready, reveal the worked solution to check your
             method.</p>`,

    buttonText: "Show solution",     // optional (default "Show solution")
    hideText:   "Hide solution",     // optional (default "Hide solution")

    answer: `<p><strong>Taking moments about A (ΣM<sub>A</sub> = 0):</strong></p>
             <p>R<sub>B</sub> × 6 = 12 × 2 = 24</p>
             <p>R<sub>B</sub> = 24 ÷ 6 = <strong>4 kN</strong></p>`
  },

  // EXAMPLE HOTSPOT
  {
    type:  "hotspot",
    label: "Find the Maximum Moment",
    title: "Where is the Bending Moment greatest?",
  
    prompt: `<p>Click the point on the beam where the <strong>bending moment is
            maximum</strong>.</p>`,
  
    image:    "images/module-01_01.svg",
    maxWidth: "700px",               // optional
  
    hotspots: [
      { x: 10, y: 40, w: 12, h: 20 },                 // a wrong region
      { x: 44, y: 35, w: 14, h: 28, correct: true },  // the correct region
      { x: 78, y: 40, w: 12, h: 20 }                  // another wrong region
    ],
  
    explanation: `The maximum bending moment occurs under the point load, where
                  the shear force passes through zero.`
  },

  /* ============================================================================
   QUIZ ("Test Your Knowledge") — a multi-question sub-sequence in one slide.

   Appears ONCE in the sidebar. Internally runs: intro → N questions → results.
   - One attempt per question; advances on answer (right or wrong).
   - Results page shows score, a review table, and a Retry button.
   - Completing it (reaching results) gates the module, regardless of score.

   Each question has a "kind": "mcq" or "input".
     mcq   → options array, one with correct:true (same shape as the mcq slide)
     input → numeric answer + tolerance + optional unit (like a Worked Example step)

   Any question may include an optional image / imageWidth (shown above it).
   ============================================================================ */

  {
    type:  "quiz",
    label: "Test Your Knowledge",
    title: "Test Your Knowledge",

    intro:     "Answer the following questions to complete the module. You have one attempt per question, but you can retry the whole quiz as many times as you like.",
    startText: "Start Quiz",          // optional (default "Start Quiz")

    questions: [

      // ── An MCQ question ──
      {
        kind:     "mcq",
        question: `<p>The maximum bending moment in a simply supported beam under a
                  central point load <strong>P</strong> over span <strong>L</strong> is:</p>`,
        options: [
          { text: "PL / 2" },
          { text: "PL / 4", correct: true },
          { text: "PL / 8" },
          { text: "PL" }
        ]
      },

      // ── An input (numeric) question ──
      {
        kind:      "input",
        question:  `<p>A simply supported beam of span <strong>4 m</strong> carries a
                    UDL of <strong>6 kN/m</strong>. What is the maximum bending
                    moment (in kNm)?</p>
                    <p><em>Recall M<sub>max</sub> = wL²/8</em></p>`,
        answer:    12,
        tolerance: 0.1,
        unit:      "kNm"
      },

      // ── An image-based MCQ question ──
      {
        kind:     "mcq",
        // image:    "images/some-diagram.svg",   // optional figure above the question
        question: `<p>Which support condition provides a reaction moment?</p>`,
        options: [
          { text: "Pin" },
          { text: "Roller" },
          { text: "Fixed", correct: true }
        ]
      }

    ]
  },


  // FINAL SLIDE:   Module completion
  {
    type:         "final",
    label:        "Module Complete",
    title:        "Well done!",
    subtitle:     "You've completed the Bending Moments module.",
    buttonText:   "Save and Close",
    showRating:   true,
    bugReportUrl: "https://forms.office.com/your-bug-report-form"
  }


];