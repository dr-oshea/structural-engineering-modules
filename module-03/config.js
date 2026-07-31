// Optional module metadata — used by the final slide's save payload
const moduleMeta = {
  id: "module-03-bending-moments"
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
          deflections and bending stresses in a member. It is a foundational skill crucial to many of your Structural Engineering courses at UNSW. </p>`
  },


  // INFO SLIDE:   What is a bending moment? 
  {
    type: "info",
    label: "What is a bending moment?",
    title: "What is a Bending Moment?",

    blocks: [
      { type: "text",
        html: `<p>Transverse loadings on a member cause bending. An internal bending moment measures the <strong>resistance of a material to changes in curvature</strong>, at a given location in the structure.</p>`},
      
      { type: "image",
        src:  "images/bm-01.svg",
        width:  "980px",
        alt:  "Taking bending moments",
        caption:  "(A) A structure with transverse loads, (B) Sectioning the structure at X-X, (C) Bending moment diagram"},

      { type: "text",
        html: `<p>To find the internal bending moment at a given point $X$, take a section at that location, and use equilibrium on the entire structure on one side of this section (or the other).</p>`},
      
      { type: "text",
        html: `<p>A <strong>bending moment diagram (BMD)</strong> shows the magnitude of internal bending moment at all locations in a structure.</p>`}
  ]
  },

  // MCQ SLIDE:   Quiz on calculating bending moment
  {
    type:  "mcq",
    label: "Quiz: Find Bending Moment",
    title: "Multiple Choice: Calculating Bending Moment",

    image: "images/mcq-01.svg",
    imageScale: 0.8,

    question: `
      <p>
        A simply supported beam of span <strong>10 m</strong> carries a point load and a uniformly distributed load as shown. The reactions are solved and shown on the figure. </p>
        <p><strong>What is the magnitude of bending moment at Point D?</strong></p>
    `,

    options: [
      { text: "20 kNm"  },
      { text: "17 kNm",  correct: true },
      { text: "14 kNm" },
      { text: "34 kNm" }
    ],

    explanation: `<p>Take a cut at point D, and use equilibrium on either the left section or right section.</p>
    <p> On the left:</p>
    <p> $\\Sigma M_{cut} = 0 = M_D + (2 \\times 3 \\times 3/2) + (15 \\times 6) - 14.5 \\times 8, \\qquad \\therefore M_D = 17\\ \\mathrm{kNm}$</p>
    <p> On the right:</p>
    <p> $\\Sigma M_{cut} = 0 = M_D + (2 \\times 2 \\times 2/2) - (10.5 \\times 2), \\qquad \\therefore M_D = 17\\ \\mathrm{kNm}$</p>`
  },


  // INFO SLIDE:   Relationship between Shear and Bending
  {
    type: "info",
    label: "Relationship V and M",
    title: "Relationship between Shear Force and Bending Moment",

    blocks: [
      {
        type: "text",
        html: `<p>Note that Shear Force is the derivative of the bending moment. This means
               the <strong>slope of the bending moment diagram at any point equals the
               shear force at that point</strong>.</p>`
      },
      {
        type: "equation",
        latex: String.raw`V(x) = \frac{dM(x)}{dx}`
      },
      {
        type: "text",
        html: `<p>The change in Bending Moment between two points A and B can be found using the <strong>area beneath the SFD</strong></p>`
      },
      {
        type: "equation",
        latex: String.raw`M_B = M_A + \int_{x_A}^{x_B} V(x){dx}`
      },
      {
        type: "text",
        html: `<p>We can use these relationships to:</p>
               <ul>
                 <li>Locate maximum bending moments (where V = 0)</li>
                 <li>Sketch the BMD diagram from the SFD</li>
                 <li>Check the consistency of our results</li>
               </ul>`
      }
    ]
  },


  // HOTSPOT: Location of maximum moment
  {
    type:  "hotspot",
    label: "Find the Location of Maximum Moment",
    title: "Where is the Bending Moment greatest?",
  
    prompt: `<p>The SFD for the beam is shown below. Click the point on the beam where the <strong>bending moment is
            maximum value</strong> between A and B.</p>`,
  
    image:    "images/hotspot-01.svg",
    maxWidth: "700px",               // optional
  
    hotspots: [
      { x: 8, y: 20, w: 2, h: 2 },                 // a wrong region
      { x: 48.5, y: 20, w: 2, h: 2, correct: true },  // the correct region
      { x: 74, y: 20, w: 2, h: 2 },                  // another wrong region
      { x: 97, y: 20, w: 2, h: 2 }                  // another wrong region
    ],
  
    explanation: `<p><strong> Using $M = dV / dx$, the maximum bending moment occurs where
                  the shear force diagram passes through zero. </strong></p>
                  <p><strong>Using V(x) = 0, we can then solve for the location of this maximum moment.</strong></p>`
  },
  

  // INFO SLIDE:   Bending moment on the tension side
  {
    type: "info",
    label: "BMD on Tension Side",
    title: "Drawing the Bending Moment Diagram on the Tension Side",

    blocks: [
      {
        type: "text",
        html: `<p>It is conventional for structural engineers to sketch the BMD on the <strong>tension side</strong> of a structure.</p>
        <p>When a beam bends, one side is in tension, the other in compression. Drawing the BMD with positive values on the tension side gives allows engineers a quick visual tool to understanding regions of tension and compression.</p>`
      },
      {
        type: "image",
        src:  "images/tension-01.svg",
        width:  "1000px",
        alt:  "Tension side.",
        caption:  "Fig. 1 - Direction of internal bending moment governs which side of the member is in tension vs compression."
      },
      {
        type: "text",
        html: `<p>To draw BMD on the tension side:</p>
        <ol>
        <li> First, assume a direction of the unknown internal bending moment.</li>
        <li> By equilibrium, the magnitude and (actual) direction of the internal bending moment is found.</li>
        <li> The direction of the bending moment can be replaced with an equivalent force couple (as in Fig. 1)</li>
        <li> The value of bending moment is therefore plotted on the side related to the tensile force.</li></p>`
      },
      {
        type: "text",
        html: `<p>For a horizontal (beam) member, this means <strong>plotting positive bending moments downwards, when assuming positive bending moments cause elements to bend concave up</strong></p>
        <p> Extra thought is required determining the tension side of a frame.</p>`
      },
      {
        type: "image",
        src:  "images/convention-01.png",
        width:  "300px",
        alt:  "BM convention.",
        caption:  "Fig. 2 - Typically positive sign convention for internal bending moment."
      },
    ]
  },

  //  EXAMPLE: image-based MCQ (uncomment & supply SVGs to use) ──────────────
  {
    type:  "mcq",
    label: "Quiz: Identify the BMD",
    title: "Bending moment on the tension side",
    image: "images/simply-supported-udl.svg",   // the beam + loading shown above options
    imageScale: 0.5,
    question: `<p>For the beam shown above, Which is the correct BMD, <strong>drawn on the tension side</strong>?</p>`,
    options: [
      { image: "images/tension-A.svg" },
      { image: "images/tension-B.svg", correct: true },
      { image: "images/tension-C.svg" },
      { image: "images/tension-D.svg" }
    ],
    explanation: `Option B is correct — the underside of the beam will be in tension, so the peak moment is plotted downwards.`
  },

  
  // INFO SLIDE:   Drawing BMS: Method 1
  {
    type: "info",
    label: "Method 1: Algebraic",
    title: "Drawing the BMD using BM Functions",

    blocks: [
      {
        type: "text",
        html: `<p>There are two main ways to draw a BMD. The first is to determine the bending moment function $M(x)$ for ranges of $x$ that divide different members or where loading type changes. These functions can then be plotted to form the BMD.</p>
        <p> For the beam below, we would need to find bending moment functions for the ranges</p>
        <ul>
        <li> A to B </li>
        <li> B to C (function changes after B since point load is introduced)</li>
        <li> C to D (function changes after C since UDL is introduced)</li>
        <li> C to E (function changes after D since UDL finishes)</li>`
      },
      
      {
        type: "image",
        src: "images/example-01.svg",
        scale:  2,
        alt:  "Beam with UDL and point load",
        caption:  "Fig. 1 - An example beam with UDL and point load",
      },

      {
        type: "text",
        html: `<p><strong>Note:</strong> For each region, we can define $x$ as left-to-right, or right-to-left, it does not matter, so long as we use a consistent definition of positive internal bending moment, and take care when plotting all functions on a single BMD</p>`
      },
      
    ]
  },

  // Worked example (simple)
  {
    type:  "steps",
    label: "Worked Example: Using Method 1",
    title: "Drawing the BMD using Method 1",

    image: "images/example-01.svg",   // beam figure shown above the problem
    imageScale: 0.6,
    imagePosition: "below",
  
    problem: `
      <p>
        A simply supported beam <strong>AB</strong> has a span of <strong>10 m</strong>.
        A point load of <strong>12 kN</strong> acts vertically downward at a point B
        and a unifromly distributed load with intensity <strong> 4 kN/m </strong> acts downwards between C and D.
      </p>
      <p>Work through the steps below to draw the bending moment diagram.</p>
    `,
  
    steps: [
  
      {
        instruction: `Taking moments about <strong>A</strong>, find the vertical
                      reaction at <strong>E</strong>.
                      <br><em>Hint: ΣM<sub>A</sub> = 0</em>`,
        unit:        "kN",
        answer:      10.2,
        tolerance:   0.05,
        explanation: `$\\Sigma\ M_A = 0,\\qquad \\therefore \ \ R_E \\times 10 = 12 \\times 2 + 4 \\times 3 \\times (5 + 3/2),\\qquad  \\therefore \ \ R_B = 10.2$ kN`
      },
  
      {
        instruction: `Using vertical equilibrium, find the vertical reaction at <strong>A</strong>.
                      <br><em>Hint: ΣF<sub>y</sub> = 0</em>`,
        unit:        "kN",
        answer:      13.8,
        tolerance:   0.05,
        explanation: `$\\Sigma\ F_y = 0, \\qquad \\therefore \ \ R_A + R_B = 12 + 4 \\times 3, \\qquad \\therefore \ \  R_A = 13.8$ kN`
      },
  
      {
        instruction: `Taking a cut between A and B, we can determine the function $M(x)$. Find this function, then calculate the bending moment at the end point B`,
        image:       "images/example-AB.svg",  // optional per-step hint figure
        imageScale:   0.3,
        unit:        "kNm",
        answer:      27.6,
        tolerance:   0.05,
        explanation: `$M(x=2) = R_A \\times 2 = 27.6$ kNm.`
      },

      {
        instruction: `Taking a cut between B and C, we can determine the function $M(x)$. Find this function, then calculate the bending moment at the end point C`,
        image:       "images/example-BC.svg",  // optional per-step hint figure
        imageScale: 0.5,
        unit:        "kNm",
        answer:      33,
        tolerance:   0.05,
        explanation: `$M(x=5) = R_A \\times 2 - P \\times (5 - 2) = 33$ kNm.`
      },

      {
        instruction: `Taking a cut between C and D, we can determine the function $M(x)$. Find this function, then calculate the bending moment at the end point D`,
        image:       "images/example-CD.svg",  // optional per-step hint figure
        imageScale: 0.7,
        unit:        "kNm",
        answer:      20.4,
        tolerance:   0.05,
        explanation: `$M(x=8) = R_A \\times 2  - P \\times (8 - 2) - 3 \\times (8 - 5)^2 / 2 = 20.4$ kNm`
      },

      {
        instruction: `Taking a cut between D and E, we can determine the function $M(x)$. Find this function, then calculate the bending moment at the end point E`,
        image:       "images/example-DE.svg",  // optional per-step hint figure
        imageScale: 0.8,
        unit:        "kNm",
        answer:      0,
        tolerance:   0,
        explanation: `$M(x=10) = R_A \\times 2  - P \\times (10 - 2) - 3 \\times 4 \\times (10 - 9 + 3/2) = 0 $ kNm — this is expected at an external roller support.`
      }
 
    ]
  },

  
  // INFO: Drawing BMD: Method 2

  {
    type: "info",
    label: "Method 2: Geometric",
    title: "Drawing the BMD direct from SFD",

    blocks: [
      {
        type: "text",
        html: `<p>Alternatively, we can use the relationship between the SFD and BMD to draw the BMD without requiring algebraic functions to be determined. The following 4 relationships are used, where for common shapes seen in Structural engineering problems (i.e. rectangles, triangles), the integrals are simple to evaluate<\p>`
      },
      {
        type: "equation",
        latex: String.raw`V(x) = \frac{d w(x)}{d x}, \qquad V_B = V_A + \int_{x_A}^{x_B} w(x){dx}`
      },
      {
        type: "equation",
        latex: String.raw`M(x) = \frac{d V(x)}{d x}, \qquad M_B = M_A + \int_{x_A}^{x_B} w(x){dx}`
      },     
      {
        type: "image",
        src: "images/sfd-bmd-01.svg",
        width:  "1200px",
        alt:  "Beam, SFD, BMD",
        caption:  "Fig. 1 - An example beam, SFD and BMD",
      },
      {
        type: "text",
        html: `<p>First, draw the axes for the SFD and BMD. Then commencing at $V = 0$ at an external point of the structure, follow the current rules:<\p>
        <ol>
        <li>Progress along a member, where at a point $x$ the slope is equal to the value of any distributed load at same $x$</li>
        <li>At a point force, 'Jump' in the direction of the point force on the SFD.</li>
        <li>Point moments have no effect on the SFD.</li>
        <li>The difference in value between any two points on the SFD is equal to the area beneath the distrubted load spanning those points.</li>
        </ol>`
      },
      
      {
        type: "text",
        html: `<p>Next, commencing at $M = 0$ at an external point of the structure, follow the current rules:<\p>
        <ol>
        <li>Progress along a member, where at a point $x$ the slope is equal to the value of any SFD at same $x$</li>
        <li>At a point moment, 'Jump' on the BMD hat magnitude.</li>
        <li>Point forces have no effect on the BMD.</li>
        <li>The difference in value between any two points on the BMD is equal to the area beneath the SFD spanning those points.</li>
        </ol>`
      },
      
      
    ]
  },


  // Worked example (simple and same as before, though different steps)

  {
  type:  "explore",
  label: "Explore the SFD and BMD",
  title: "How the diagrams were determined",
  intro: `<p>The beam below follows the previous worked example. The reactions are shown for you.</p>
  <p> Click each marked point to see the reasoning behind it. <strong>See the explanaiton in the box at the bottom of the page</strong></p>`,
  image: "images/explore-02.svg",
  imageWidth: "720px",
  hotspots: [
    { x: 15, y: 42, marker: "A", title: "Shear Force",
      content: `<p>Discontinuity in SFD equal to magnitude of point force (reaction at A)</p>` },
    { x: 32, y: 38, marker: "B", title: "Shear Force",
      content: `<p>Shear force remains constant until point B, since distributed load is zero.</p>` },
    { x: 30, y: 50, marker: "C", title: "Shear Force",
      content: `<p>Discontinuity in SFD equal to magnitude of point force $P$</p>` },
    { x: 48, y: 50, marker: "D", title: "Shear Force",
      content: `<p>Shear force remains constant B to C, since distributed load is zero.</p>` },
    { x: 66, y: 56, marker: "E", title: "Shear Force",
      content: `<p>Shear force decreases linearly C to D, since distributed load is <strong>constant and negative</strong>.</p>
      <p>The value is determined by: </p>
      <p> $V_D = V_C + \\int_{x_C}^{x_D} w(x) dx = 1.8 -$ [Area beneath UDL] $= 1.8 - (4 \\times 3) = -10.2$ <strong> kN</strong>` },
    { x: 90, y: 58, marker: "F", title: "Shear Force",
      content: `<p>Shear force remains constant E to F, since distributed load is zero.</p>
      <p>The SFD has a discontinnuous jump equal to the magnitude of the point force at E (reaction), returning to zero as expected.</p>` },

    { x: 15, y: 80, marker: "G", title: "Bending Moment",
      content: `<p>The BMD starts at zero, and is njot affected by the point force at A.</p>` },  
    { x: 30, y: 85, marker: "H", title: "Bending Moment",
      content: `<p>The BMD increases linearly (notice downwards is positive) between A and B since SFD is <strong>constant and positive</strong>.</p>
      <p>The value at B is determined by: </p>
      <p> $M_B = M_A + \\int_{x_A}^{x_B} V(x) dx = 0 + $ [Area beneath SFD] $= 0 + (13.8 \\times 2) = 27.6$ <strong> kNm</strong>` },  
    { x: 48, y: 88, marker: "I", title: "Bending Moment",
      content: `<p>The BMD increases linearly (notice downwards is positive) between B and C since SFD is <strong>constant and positive, though smaller than it was between A and B</strong>.</p>
      <p>The value at C is determined by: </p>
      <p> $M_C = M_B + \\int_{x_B}^{x_C} V(x) dx = 27.6 + $ [Area beneath SFD] $= 27.6 + (1.8 \\times 3) = 33$ <strong> kNm</strong>` },
    { x: 68, y: 85, marker: "J", title: "Bending Moment",
      content: `<p>The BMD is quadratic between C and D with slope initally positive, then gradually getting more and more negative, due to the linear SFD.</p>
      <p>The value at D is determined by: </p>
      <p> $M_D = M_C + \\int_{x_C}^{x_D} V(x) dx = 33 + $ [Area beneath SFD] $= 27.6 + (1/2 \\times (1.8-10.2) \\times 3) = 20.4$ <strong> kNm</strong>` },
    { x: 90, y: 80, marker: "K", title: "Bending Moment",
      content: `<p>The BMD is linear decreasing between D and E, since the SFD is constant and negative.</p>
      <p>The value at E is determined by: </p>
      <p> $M_E = M_D + \\int_{x_D}^{x_E} V(x) dx = 20.4 + $ [Area beneath SFD] $= 20.4 + (-10.2 \\times 2) = 0$ <strong> kNm</strong></p>
      <p>... returning to zero as expected.</p>` },
  ]
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