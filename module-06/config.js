// Optional module metadata — used by the final slide's save payload
const moduleMeta = {
  id: "module-06-distributed-loads"
};

const moduleData = [

  /*Slide 1*/
  {
    type:       "splash",
    label:      "Home page",
    title:      "Handling Distributed Loads​",
    subtitle:   "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
    // The contents list is generated automatically from the partStart
    // fields below — nothing to maintain here.
  },

  /*Slide 2*/
  { type: "context",
    label: "Context/Motivation",
    title: "Why do we have distributed loads?",
    image: "images/context.jpg",
    text:`Loads such as self-weight, floor loads, and soil pressures are often distributed across a structure. This module shows how these loads can be represented by equivalent point loads, making support reaction calculations and subsequent analysis more straightforward.`
  },

 /*  {
    type:  "context",
    label: "Context/Motivation",
    title: "Why do we have distributed loads?​",
    image: "images/Slide 2 - 1.png",
    text:  `<p>
            <ul>
              <li>A load applied <strong>continuously</strong> over a length or area
              <li>Typical unit: kN/m for line loads
              <li>Examples: self-weight, floor loads, wind pressure, water pressure.
            </ul>
            `
  }, */

  /*PART 1*/
  
  /*Slide 4*/
  {
    type:      "info",
    partStart: "Distributed loads",
    label:     "What are Distributed Loads?​",
    title:     "What are Distributed Loads?​",

    blocks: [
      {type: "text",
        html: `<p>A point load acts through a geometric point in space. <strong>A distributed load is applied continuously over a length (or area)</strong>.</p>
        <p>They have units of <strong>force per unit length/area</strong>, for example: $\\text{kN/m},\\ \\text{N/mm}$, etc.</p>
        <p>Examples include:
            <ul>
              <li>self-weight,</li>
              <li>floor loads,</li>
              <li>wind pressure,</li>
              <li> water pressure.</li>
            </ul></p>`
      },
      
      { type: "image",
        src:     "images/Slide 2 - 1.png",
        width:   "600px",
        caption: "Fig. 1" },
      
    ]
  },

  { type: "info",
    label: "Statically Equivalent Structures",
    title: "Statically Equivalent Structures",

    blocks: [
      { type: "text",
        html: `<p>Our equations of equilibrium look at resultant point forces and moments.</p>
        <p>In reality, most loads don’t tend to act through a single point, but rather are distributed over a certain length or area.</p>
        <p>In order to use our <strong>equations of equilibrium</strong> we convert our structure with distributed loads into a 
        <strongstatically equivalent</strong> one that posseses only point forces and moments.</p>`
      },
      { type: "image",
        src:     "images/Slide 4.png",
        width:   "600px",
        caption: "Fig. 1" },
       {type: "text",
        html: `Statically equivalent structures are <strong>different arrangements of the loads that produce the same external reactions</strong>.</p>
        <p>A point load on a structure possesses:</p>
        <ol><li>Magnitude</li>
        <li>Direction of action</li>
        <li>Location</li></ol>
        <p>For a given distributed load, we seek a means of <strong> determining the magnitude, direction and location of the equivalent point load that produces the same external effects as the original distributed load</strong>.`
       }
    ]
  },
  /* 
  {
    type:  "mcq",
    label: "Quiz: Are these Distributed Loads?",
    title: "True or False: Are these Distributed Loads?",

    questions: [
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 3 - 1.png",

        options: [
      { text: "True"},
      { text: "False", correct: true },
        ],
        explanation: `Correct!".`
      },
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 3 - 2.png",

        options: [
      { text: "True", correct: true },
      { text: "False"},
        ],
        explanation: `Correct!".`
      },
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 3 - 3.png",

        options: [
      { text: "True"},
      { text: "False", correct: true },
        ],
        explanation: `Correct!".`
      },
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 3 - 4.png",

        options: [
      { text: "True", correct: true },
      { text: "False"},
        ],
        explanation: `Correct!".`
      },
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 3 - 5.png",

        options: [
      { text: "True", correct: true },
      { text: "False"},
        ],
        explanation: `Correct!".`
      }
    ]
  }, */

  /*Slide 5*/
  {
    type:      "info",
    label:     "Equivalent Point Force​​",
    title:     "Equivalent Point Force​​",

    blocks: [
      { type: "text",
        html: `<p>When converting a distributed load to a point load there are three things to consider: <strong>magnitude, direction and location</strong>. The direction of action will match that of the distributed load (i.e. if the distributed load acts downwards, the equivalent point load will act downwards.</p>
        <p>This leaves two items to be determined: 1. Its magnitude and 2. its location.</p>
        <p>These are given by:</p>
        <ul><li><span style="color: red;">Magnitude = the area under the load diagram</span></li>
      <li><span style="color:blue;">Location = through the centroid of the load diagram​</span></li></ul>`
      },

      {type: "text",
      html: `<p>Consider that the distributed load is described by some function $w(x)$ acting between $0 < x < L$.</p>. The equivalent point load has a magnitude $P$ and location $x_P$, given by`},
      
      {type: "equation",
       latex: String.raw`P = \int_0^L w(x)\ \mathrm{d}x,\qquad x_P = \frac{\int_0^L x w(x) \ \mathrm{d}x}{\int_0^L w(x)\ \mathrm{d}x}`
      },
      { type: "image",
        src:     "images/Slide 5.png",
        width:   "600px",
        caption: "Fig. 2" },

      {type: "text",
        html: `<p>In practice, most distributed loads have simple shapes (e.g. triangular, rectangular), and therefore there are simple formulas to determine their areas and centroids.</p>`
      }
    ]
  },

  /*Slide 6*/
  {
    type:      "info",
    partStart: "Types of Distributed Loads",
    label:     "Common Distributed Loads​",
    title:     "Common Types of Distributed Loads​​",

    blocks: [
      { type: "text",
        html: `<p>Some of most common distribution load including:​
              <ul>
                <li>Uniformly Distributed Load — UDL​
                <li>Triangular load
                <li>Trapezoidal load
                <li>Parabolic distributed load
              </ul>
              </p>`
      },
      { type: "image",
        src:     "images/Slide 6.png",
        width:   "600px",
        caption: "Fig. 3" },
        {type: "text",
        html: `The next few slides will provide simple formulas for finding equivalent point loads in these common cases.`
        }
    ]
  },

  /*Slide 7*/
  {
    type:      "info",
    label:     "Uniform Load",
    title:     "Uniformly Distributed Load — UDL",

    blocks: [
      { type: "text",
        html: `<p>A uniformly distributed load is <strong>constant</strong> over a length, and therefore forms a rectangular region.</p>
        <p>Therefore:​</p>
        <ul><li><span style="color: red;">Magnitude = the area under the load diagram</span></li>
      <li><span style="color:blue;">Location = through the centroid of the load diagram​</span></li></ul>`},
      
      { type: "equation",
        latex: String.raw`\text{Magnitude} = w L`},

      { type: "equation",
        latex: String.raw`\text{Location} = L/2`},

      { type: "image",
        src:     "images/Slide 7.png",
        width:   "600px",
        caption: "Fig. 4" },
    ]
  },

  {
    type:      "info",
    label:     "Linear Load",
    title:     "Linearly Distributed Load — LDL",

    blocks: [
      { type: "text",
        html: `<p>A linearly distributed load is <strong>linear</strong> over a length, and therefore forms a right-angled triangle region.</p>
        <p>Therefore:​</p>
        <ul><li><span style="color: red;">Magnitude = the area under the load diagram</span></li>
      <li><span style="color:blue;">Location = through the centroid of the load diagram​</span></li></ul>`},
      
      { type: "equation",
        latex: String.raw`\text{Magnitude} = \tfrac{1}{2} w L`},

      { type: "equation",
        latex: String.raw`\text{Location} = \tfrac{1}{3}L, \ \ \ \text{(measured from location of the right angle)}`},

      { type: "image",
        src:     "images/Slide 8.png",
        width:   "600px",
        caption: "Fig. 5" },
    ]
  },

  {
    type:      "info",
    label:     "Trapezoidal Load",
    title:     "Linearly Distributed Load — Trapezoidal",

    blocks: [
      { type: "text",
        html: `<p>If a linearly distributed load does not start at zero from one end, it forms a <strong>trapezoidal</strong> region.</p>
        <p>Therefore:​</p>
        <ul><li><span style="color: red;">Magnitude = the area under the load diagram</span></li>
      <li><span style="color:blue;">Location = through the centroid of the load diagram​</span></li></ul>`},
      
      { type: "equation",
        latex: String.raw`\text{Magnitude} = \frac{w_1+w_2}{2L}`},

      { type: "equation",
        latex: String.raw`\text{Location} = \frac{w_1+2w_2}{3(w_1+w_2)}L, \ \ \ \text{measured from location of } w_1`},

      { type: "image",
        src:     "images/Slide 9.png",
        width:   "600px",
        caption: "Fig. 5" },
    ]
  },

  /*Slide 10*/
  {
    type:      "info",
    partStart: "Other Cases",
    label:     "Composite approach",
    title:     "Trapezoidal Load - Composite approach",

    blocks: [
      { type: "text",
        html: `<p>Formula too hard to remember?  Instead, you can treat the trapezoid as the superposition of a UDL (rectangule) and LDL (triangle), replacing each with its own equivalent point load.​
              </p>`
      },
      { type: "image",
        src:     "images/Slide 10.png",
        width:   "600px",
        caption: "Fig. 7" },
        { type: "text",
        html: `<p>The structures shown above are statically equivalent.​
              </p>`
      },
    ]
  },

  /*Slide 11-15*/
  {
    type: "steps",
    label: "Try it Yourself",
    title: "Try it Yourself - Trapezoidal Load",

    image: "images/Slide 11.png",
    imageWidth: "620px",
    imagePosition: "below",

    problem: `<p>Find the reaction forces for the beam shown.</p>
    <p>First, replace the trapezoidal shaped distributed load with equivalent point loads. To do so, split it into triangular and rectangular parts as shown.</p>`,
    steps: [
      {
        instruction: "What is the magnitude of the rectangular load?",
        unit: "kN",
        answer: 50,
        tolerance: 0,
        explanation: "Correct!",
        hint:`The intensity is 10 kN/m`,
        hintCollapsed: true,
      },
      
      {
        instruction: "Where is the centroid of the rectangular load?​ (measured from the left)",
        unit: "m",
        answer: 2.5,
        tolerance: 0,
        explanation: "Correct! The centroid of a rectangle is halfway along its length"
      },

      {
        instruction: "What is the magnitude of the triangular load?​",
        unit: "kN",
        answer: 75,
        tolerance: 0,
        explanation: "Correct!",
        hint: "what is the area of the triangle?",
        hintCollapsed: true
      },
      {
        instruction: "Where is the centroid of the triangular load? (measured from the left end)",
        unit: "m",
        answer: 1.667,
        tolerance: 0.01,
        explanation: "Correct! we could now solve the Reactions for this structure using equilibrium."
      },/* 
      {
        instruction: "Now use the statically equivalent structure with point loads to determine the the reaction forces. Find $H_A$.",
        unit: "kN",
        answer: 0,
        tolerance: 0,
        explanation: "Correct!"
      },
      {
        instruction: "Use equilibrium of moments about point B to find $V_A$.",
        unit: "kN",
        answer: 0,
        tolerance: 0,
        explanation: "Correct!"
      },
      {
        instruction: "Use equilibrium of vertical forces to find $V_B$.",
        unit: "kN",
        answer: 0,
        tolerance: 0,
        explanation: "Correct!"
      }, */
    ]
  },

  /*Slide 16*/
  {
    type:      "info",
    label:     "Parabolic Load",
    title:     "Parabolic Load",

    blocks: [
      { type: "text",
        html: `<p>Though not very common, if the distributed is quadratic, it forms what is known as a <strong>parabolic spandrel</strong> over its length.</p>
        <p>Therefore, consider the two cases:</p>`},

      {type: "text",
        html: `<p><strong>Case 1: concave up</strong></p>`
      },
      {type: "equation", latex: String.raw`R = \frac{1}{3}L, \quad x = \frac{3}{4}L`},

      { type: "image",
        src:     "images/Slide 16.png",
        width:   "600px",
        caption: "Fig. 7" },

        {type: "text",
        html: `<p><strong>Case 2: concave down</strong></p>`
      },
      {type: "equation", latex: String.raw`R = \frac{2}{3}L, \quad x = \frac{5}{8}L`},

      
    ]
  },

  /*Slide 17*/
/*   {
  type: "interactive-diagram",
  label: "Test Yourself",
  title: "Test Yourself",
  image: "images/Slide 17 - 1.png",
  imageWidth: "760px",
  prompt: `<p>Locate and calculate all the resultant forces from distribution loads. ​</p>`,
  
  itemTypes: {
      force: {
        label: "Force",
        draw: { shape: "arrow", color: "#c62828", length: 70 },
        labelTemplate: "{mag} kN", // caption drawn beside the arrow
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
            { value: "up", label: "Upward ↑", draw: { angle: 270 } },
            { value: "down", label: "Downward ↓", draw: { angle: 90 } }
          ]},
          { id: "mag", label: "Magnitude", type: "number", unit: "kN",
            tolerance: 0.05 }
        ]
      }
    },

    nodes: [
      { x: 12, y: 62, label: "A", title: "Support A (pin)",
        answers: [[ // a list of acceptable SETS
          { itemType: "force", values: { dir: "up", mag: 13.8 } },
          { itemType: "force", values: { dir: "right", mag: 5.0 } }
        ]]
      },
      { x: 50, y: 30, label: "C", answers: [[]] } // nothing acts here
    ]
  }, */

  /*CLOSING SLIDE (22)*/
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