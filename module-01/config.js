const moduleMeta = {
  id: "module-01-free-body-diagrams"
};


const moduleData = [

  /* ── OPENING SLIDE (keep first) ──────────────────────────────────────── */
  {
    type:       "splash",
    label:      "Home page",
    title:      "Drawing Free Body Diagrams",
    subtitle:   "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
  },
  {
    type:  "context",
    label: "Motivation",
    title: "What is a Free Body Diagram (FBD)",
    image: "images/Slide 2.png",
    text:  `<p>A Free Body Diagram (FBD) is a simplified force model of an isolated object or structural member. </p>
    <p> A FBD can then be analysed to discover how the body responds to the loads.</p>`
  },


  /* ══ PART 1 ═══════════════════════════════════════════════════════════*/

  {
    type:      "info",
    partStart: "Free Body Diagrams",
    label:     "What is a FBD?",
    title:     "What is a Free Body Diagram?",

    blocks: [
      { type: "text",
        html: `<p>A free body diagram (FBD) focuses attention on the object of interest. They are useful in identifying the external forces acting on the body` },

      { type: "text",
        html: `<p><strong>The FBD is a drawing of an object, free from its surroundings, and the external forces acting on it.</strong></p>`},

      { type: "text",
        html: `<p>Nothing other than the object of interest is included - the FBD shows the object 'freed' of its surroundings:</p>
        <p>It is important to account for all external force and moments acting on the body in order to later correctly apply equations of equilibrium.</p>` },
        
      { type: "image",
        src: "images/what_is_a_fbd.png",
        width: "600px",
        caption: "Bedford & Fowler (2024), Pearson Education"},

      { type: "text",
        html: `<p><strong>In the image above, we wish to draw a FBD of the car.</strong> </p>
        <p>Therefore, we first isolate the car from its surroundings (ramp, cable) and draw a sketch of it. </p>
        <p> We then ask ourselves: "What forces and moments are acting on the body (car)?"</p>
        <p> In this case, gravity acts downwards through its centre of mass, a normal force acts nromal to the inclined surface, and therope supplies a tension force holding the car in place.</p>
        ` },

      ]
    },

  /* ══ SLIDE 2 ═══════════════════════════════════════════════════════════*/
  {
    type:      "info",
    label:     "Examples of FBDs",
    title:     "Examples of Free Body Diagram (FBD)",

    blocks: [
      { type: "text",
        html: `<p>Below are some examples of FBDs drawn for real-life images</p>` },

      {
    type: "text",
    html: `
      <div style="
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
      ">
        <div style="text-align: center;">
          <img
            src="images/Slide 3 - Cable.png"
            style="width: 100%; max-width: 600px; height: auto;"
          >
          <p>Cable</p>
        </div>

        <div style="text-align: center;">
          <img
            src="images/Slide 3 - Node.png"
            style="width: 100%; max-width: 600px; height: auto;"
          >
          <p>Node</p>
        </div>

        <div style="text-align: center;">
          <img
            src="images/Slide 3 - Truss.png"
            style="width: 100%; max-width: 600px; height: auto;"
          >
          <p>Truss</p>
        </div>
      </div>
    `},
    ]
  },

  /* ══ SLIDE 3 - MCQ ═══════════════════════════════════════════════════════════*/
  {
    type:  "mcq",
    label: "Identify Free Body Diagrams",
    title: "True or False: Identifying Free Body Diagrams",

    questions: [
      {
        question: `<p>Is the image above a free body diagram?</p>
        <p> HINT: A free body diagram should be `,
        
        image: "images/Slide 4 - 1.png",

        options: [
      { text: "True"},
      { text: "False", correct: true },
        ],
        explanation: `Explain why this is the right answer — the student reads
                      this before clicking "Next question".`
      },
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 4 - 2.png",

        options: [
      { text: "True", correct: true },
      { text: "False"},
        ],
        explanation: `Explain why this is the right answer — the student reads
                      this before clicking "Next question".`
      },
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 4 - 3.png",

        options: [
      { text: "True"},
      { text: "False", correct: true },
        ],
        explanation: `Explain why this is the right answer — the student reads
                      this before clicking "Next question".`
      },
      {
        question: `<p>Is the following image a free body diagram?</p>`,
        
        image: "images/Slide 4 - 4.png",

        options: [
      { text: "True", correct: true },
      { text: "False"},
        ],
        explanation: `Explain why this is the right answer — the student reads
                      this before clicking "Next question".`
      }
    ]
  },



  /* ══ PART 2 ═══════════════════════════════════════════════════════════ */

  {type: "info",
    partStart: "Types of Supports",
    title: "What is a support?",
    label: "What is a support?",

    blocks: [
      /* { type: "text",
        html: `<p>In the real-world, bodies can be held in place by supports, or in contact with other bodies</p>
        <p>When isolating a body to draw a FBD, we therefore need to replace these supports with equivalent forces and moments that represent their action.</p>` },
 */
      { type: "text",
        html: `<p><strong>Supports, by definition, prevent movement.</strong></p>
        <p>This can be translational (up, down, left, right, etc), or rotational.</p>
        <p>If a rigid body would displace due to applied loads, and a support is preventing it from doing so, then a force or moment must exist that prevents this motion.</p>` },
        
      { type: "image",
        src: "images/trafficlight_fbd.png",
        width: "400px"},

      { type: "text",
        html: `<p>Known external forces will have their magnitude and true direction indicated on a FBD. For a support reaction, we do not know its magntude or direction until we have solved for it using equations of equilibrium. 
        <strong>When drawing an unknown support reaction on a FBD, we therefore draw a vector/moment in the direction of the motion being supported and label it with an unknown varible</strong>.
        ` },

      ],
  },

  /* {
    type: "cards",
    title: "The Main Types of Supports",
    label: "Main Types of Supports (1)",
    intro: `<p><strong>Click each card</strong> to reveal the information.</p>`,
    cards: [
      {
        front: "Roller Support",
        back: `
        <p>Roller supports have one vertical reaction which is perpendicular to the surface.</p>
        <img src="images/Slide 5 - Roller.png" alt="Roller Support">
      `
      },
      {
        front: "Pin Support",
        back: `
        <p>Pin supports have two reactions. One vertical and one horizontal.</p>
        <img src="images/Slide 5 - Pin.png" alt="Pin Support">
      `
      },
      {
        front: "Fixed Support",
        back: `
        <p>Fixed supports have three reactions. One vertical, one horizontal and one moment.</p>
        <img src="images/Slide 5 - Fixed.png" alt="Fixed Support">
      `
      },
    ]
  }, */

  {type: "info",
    title: "The Main Types of Supports",
    label: "Main Types of Supports (1)",
    
     blocks: [
      { type: "text",
        html: `<p>The three main types of supports are: <strong> roller, pin, and fixed</strong></p>` },

        { type: "text",
        html: `<p>A <strong>fixed support</strong> prevents translation in both directions, and also prevents rotation. </p>
        <p>It is represented with both horiztonal and vertical force reactions, as well as a moment reaction.</p>`},
        
      { type: "image",
        src: "images/Slide 5 - Fixed.png",
        width: "100px"},

        { type: "text",
        html: `<p>A <strong>pin support</strong> prevents movement along both directions, though allows rotations at that point.</p>
        <p>It is represented with both horiztonal and vertical force reactions.</p>`},
        
      { type: "image",
        src: "images/Slide 5 - Pin.png",
        width: "100px"},

      { type: "text",
        html: `<p>A <strong>roller support</strong> prevents movement along one direction, though allows translation in the normal direction and allows rotation at that point.</p>
        <p>It is represented with a single support reaction in the direction being supported.</p>`},
        
      { type: "image",
        src: "images/Slide 5 - Roller.png",
        width: "100px"},

      { type: "text",
        html: `<p>Known external forces will have their magnitude and true direction indicated on a FBD. For a support reaction, we do not know its magntude or direction until we have solved for it using equations of equilibrium. </p>
        <p><strong>When drawing an unknown support reaction on a FBD, we therefore draw a vector/moment in the direction of the motion being supported and label it with an unknown varible</strong>.
        ` },

      ],
  },


  {
  type:  "explore",
  label: "Main Types of Supports (2)",
  title: "The Main Types of Supports",
  intro: `<p>The images below show two beams which have been drawn as free body diagrams.</p>
  <p> Click each marked point to see the reasoning behind it. <strong>See the explanation in the box at the bottom of the page</strong></p>`,
  image: "images/Slide 6.png",
  imageWidth: "720px",
  hotspots: [
    { x: 59, y: 25, marker: "A", title: "Fixed Support",
      content: `
    <p>
      Has three reactions. One vertical, one horizontal and one moment.
    </p>

    <img
      src="images/Slide 5 - Fixed.png"
      style="
        width: 25%;
        max-width: 500px;
        height: auto;
        margin-top: 15px;
      "
    >
  `
},
    { x: 96, y: 25, marker: "B", title: "Pin Support",
      content: `
    <p>
      Has two reactions. One vertical and one horizontal.
    </p>

    <img
      src="images/Slide 5 - Pin.png"
      style="
        width: 25%;
        max-width: 500px;
        height: auto;
        margin-top: 15px;
      "
    >
  `
},
    { x: 59, y: 78, marker: "C", title: "Fixed Support",
      content: `
    <p>
      Has three reactions. One vertical, one horizontal and one moment.
    </p>

    <img
      src="images/Slide 5 - Fixed.png"
      style="
        width: 25%;
        max-width: 500px;
        height: auto;
        margin-top: 15px;
      "
    >
  `
},
    { x: 96, y: 78, marker: "D", title: "Roller Support",
      content: `
    <p>
      Has one reaction which is vertical (perpendicular to surface).
    </p>

    <img
      src="images/Slide 5 - Roller.png"
      style="
        width: 25%;
        max-width: 500px;
        height: auto;
        margin-top: 15px;
      "
    >
  `
},
  ]
  },


  {
    type: "info",
    label: "Support Variations (1)",
    title: "Support Variations",

    blocks: [
      { type: "text",
        html: `<p>There are some other variations of supports, however, they are still derived from the three aforementioned supports.</p>
        <p> Any support type can be represented using unknown forces and moments by asking yourself "what motion is being restricted by this support?"`},
      
      { type: "image",
        src:  "images/Slide 7.png",
        width:  "50%",
        alt:  "Variations of Supports",
      },
  ]
  },


/*SLIDE 8*/
/*   {
    type:  "interactive-diagram",
    label: "Support Variations (2)",
    title: "Construct the Free Body Diagram",

    image:      "images/beam_fbd_1.png",
    imageWidth: "760px",
    prompt: `<p>Construct a FBD for the beam below. The beam is <strong>2m</strong> long, the hanging mass is <strong>5 kg</strong>, and the crate has a width of <strong>0.6 m</strong> and overall mass of <strong>10 kg</strong>. </p>
            <p>The beam is connected to a steel column on the left hand side, and this bolted connection prevents the beam from rotating at the support. The beam sits freely on another beam on the right-hand side.</p>
            <p> Click each marked location and select the appropriate load type, then press <strong>Check answers</strong>.</p>`,

    // WHAT can be added. Each type has its own fields and its own drawing.
    itemTypes: {
      reaction_force: {
        label: "Reaction Force",
        draw:  { shape: "arrow", color: "#3f61c4", length: 70 },
        labelTemplate: "{name}",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "up",    label: "Vertical ↑",    draw: { angle: 270 } },
              { value: "right",  label: "Horizontal →",  draw: { angle: 0 } },
          ]},
          { id: "name", label: "Variable name", type: "text"}
        ]
      },
      reaction_moment: {
        label: "Reaction Moment",
        draw:  { shape: "moment", color: "#3f61c4", radius: 26 },
        labelTemplate: "{name}",
        fields: [
          { id: "sense", label: "Sense", type: "select", options: [
              { value: "ccw", label: "Moment ↺", draw: { sense: "ccw" } }
          ]},
          { id: "name", label: "Label", type: "text"}
        ]
      },
      applied_force: {
        label: "Applied Force",
        draw:  { shape: "arrow", color: "#c62828", length: 70 },
        labelTemplate: "{mag} N",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "up",    label: "Upward ↑",    draw: { angle: 270 } },
              { value: "down",  label: "Downward ↓",  draw: { angle:  90 } },
              { value: "left",  label: "Leftward ←",  draw: { angle: 180 } },
              { value: "right", label: "Rightward →", draw: { angle:   0 } }
          ]},
          { id: "mag", label: "Magnitude", type: "number",
            unit: "N", tolerance: 0.05 }
        ]
      },
      applied_moment: {
        label: "Applied Moment",
        draw:  { shape: "moment", color: "#c62828", radius: 26 },
        labelTemplate: "{mag} Nm",
        fields: [
          { id: "sense", label: "Sense", type: "select", options: [
              { value: "cw",  label: "Clockwise ↻",     draw: { sense: "cw"  } },
              { value: "ccw", label: "Anticlockwise ↺", draw: { sense: "ccw" } }
          ]},
          { id: "mag", label: "Magnitude", type: "number",
            unit: "Nm", tolerance: 0.1 }
        ]
      },

      // ── Distributed loads attach to a REGION, not a node ──
      udl: {
        label: "Applied UDL",
        draw:  { shape: "spanLoad", color: "#c62828", mag: "w" },
        labelTemplate: "{w} N/m",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "down", label: "Vertically down",        draw: { loadDir: "down" } },
              { value: "up",   label: "Vertically up",          draw: { loadDir: "up"   } },
              { value: "perp", label: "Perpendicular to member", draw: { loadDir: "perp" } }
          ]},
          { id: "w", label: "Magnitude", type: "number",
            unit: "N/m", tolerance: 0.05 }
        ]
      },
      ldl: {
        label: "Varying load",
        // Two magnitude fields → a trapezoidal/triangular load
        draw:  { shape: "spanLoad", color: "#c62828", magStart: "wA", magEnd: "wB" },
        labelTemplate: "{v} N/m",          // {v} is each end's own value
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "down", label: "Vertically down",         draw: { loadDir: "down" } },
              { value: "perp", label: "Perpendicular to member",  draw: { loadDir: "perp" } }
          ]},
          { id: "wA", label: "Magnitude at A", type: "number", unit: "N/m", tolerance: 0.05 },
          { id: "wB", label: "Magnitude at B", type: "number", unit: "N/m", tolerance: 0.05 }
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
        ax: 55, ay: 44, bx: 81, by: 44,     // a horizontal member
        height: 120,                          // box extends ABOVE the member
        label: "BC",
        title: "Crate",
        answers: [[
          { itemType: "udl", values: { dir: "down", w: 166.67 } }
        ]]
      }
    ],

    // WHERE point items can be added.
    // x, y are percentages of the image, measured from the top-left.
    nodes: [
      {
        x: 12, y: 50, label: "A", title: "Support A (Fixed)",
        // A pin needs TWO forces — order doesn't matter
        answers: [[
          { itemType: "reaction_force", values: { dir: "up" } },
          { itemType: "reaction_force", values: { dir: "right" } },
          { itemType: "reaction_moment", values: { dir: "sense" } }
        ]]
      },
      {
        x: 92, y: 50, label: "B", title: "Support B (roller)",
        answers: [
          [ { itemType: "reaction_force", values: { dir: "up" } } ]
        ]
      },
      {
        x: 37, y: 50, label: "C", title: "Hanging mass",
        // Nothing acts here — an empty set is the right answer
        answers: [[
          {itemType: "applied_force", values: {dir: "down", mag: 50}}
        ]]
      }
    ]
  },
 */
/*   {
    type: "info",
    label: "Simplification of Supports",
    title: "About the Simplification of Supports",

    blocks: [
      { type: "text",
        html: `<p>Note that the FBD is a simplified model of reality. In the real-world, there is no perfect roller, pin or fixed support. We make assumptions when producing simplified models from the real world</p>`},
      
      { type: "image",
        src:  "images/Slide 9.png",
        width:  "50%",
        alt:  "Simplification of Supports",
      },
      
      { type: "text",
        html: `<p>For example, these two connections/supports, which both have horizontal/vertical/moment resistance. Since support A is connected to a flange, it does not transfer a moment and should therefore be labelled as a pin. Support B is fixed as the welds transfer moments.</p>`},
  ]
  },
 */

  {
    type:  "mcq",
    label: "Identify the Supports",
    title: "Identify the Supports",

    questions: [
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 1.png",

        options: [
      { text: "Roller Support"},
      { text: "Pin Support", correct: true },
      { text: "Fixed Support"},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 2.png",

        options: [
      { text: "Roller Support"},
      { text: "Pin Support", correct: true },
      { text: "Fixed Support"},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 3.png",

        options: [
      { text: "Roller Support"},
      { text: "Pin Support"},
      { text: "Fixed Support", correct: true},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 4.png",

        options: [
      { text: "Roller Support"},
      { text: "Pin Support", correct: true },
      { text: "Fixed Support"},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 5.png",

        options: [
      { text: "Roller Support", correct: true},
      { text: "Pin Support"},
      { text: "Fixed Support"},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 6.png",

        options: [
      { text: "Roller Support"},
      { text: "Pin Support", correct: true },
      { text: "Fixed Support"},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 7.png",

        options: [
      { text: "Roller Support"},
      { text: "Pin Support"},
      { text: "Fixed Support", correct: true},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 8.png",

        options: [
      { text: "Roller Support", correct: true},
      { text: "Pin Support"},
      { text: "Fixed Support"},
        ],
        explanation: `Well done`
      },
      {
        question: `<p>It is important to correctly select the support type for your FBD. What kind of support is the following image showing?</p>`,
        
        image: "images/Slide 10 - 9.png",

        options: [
      { text: "Roller Support", correct: true},
      { text: "Pin Support"},
      { text: "Fixed Support"},
        ],
        explanation: `Well done`
      },
    ]
  },

/*   {
    type:  "mcq",
    label: "Direction of Reaction",
    title: "Direction of Reaction",

    questions: [
      {
        question: `<p>We now understand the reactions present in each of the supports. Above, a fixed support is shown. Which direction to we have to draw them?</p>`,
        
        image: "images/Slide 11.png",

        options: [
      { image: "images/Slide 11 - A.png", correct: true},
      { image: "images/Slide 11 - B.png", correct: true},
      { image: "images/Slide 11 - C.png", correct: true},
      { image: "images/Slide 11 - D.png", correct: true},
        ],
        explanation: `All options are actually correct. There is no right or wrong direction as the forces are unknown so before we calculate them, their direction remains unknown. In this case, we need to make an assumption of direction. If we assume right is positive and the final value is positive, the direction is correct. If the final value is negative, then we need to flip the direction of the arrow.`
      },
    ]
  },
 */
  {
    type: "info",
    partStart: "How to draw a FBD",
    label: "How to draw an FBD",
    title: "How to draw an FBD",

    blocks: [
      {type: "text",
        html: `<p> Below are the major steps in drawing a Free Body Diagram:</p>`
      },

      { type: "text",
        html: `<ol><li>Clearly decide on the system, i.e the <strong>(Free Body).</li>
        <li>Identify all external forces and moments</li>
        <li>Mark the magnitude, direction and position of <strong>known external forces and moments</strong></li>
        <li>Mark any unknown support reactions with a variable name, and assume a direction</li>
        </ol>`},
      
      { type: "image",
        src:  "images/Slide 12.png",
        width:  "85%",
        alt:  "Free body diagram",
      },
  ]
  },

  {
    type:  "mcq",
    label: "Try yourself: Draw FBD (1)",
    title: "Drawing a FBD",

    questions: [
      {
        question: `<p>Considering self weight of the block and friction, what would the FBD look like?</p>`,
        
        image: "images/Slide 13.png",

        options: [
      { image: "images/Slide 13 - A.png", correct: true},
      { image: "images/Slide 13 - B.png"},
      { image: "images/Slide 13 - C.png"},
      { image: "images/Slide 13 - D.png"},
        ],
        explanation: `Well done`
      },
    ]
  },

/*SLIDE 14*/
  {
    type:  "interactive-diagram",
    label: "Try yourself: Draw FBD (2)",
    title: "Construct the Free Body Diagram",

    image:      "images/beam_fbd_1.png",
    imageWidth: "760px",
    prompt: `<p>Construct a FBD for the beam below. The beam is <strong>2m</strong> long, the hanging mass is <strong>5 kg</strong>, and the crate has a width of <strong>0.6 m</strong> and overall mass of <strong>10 kg</strong>. </p>
            <p>The beam is connected to a steel column on the left hand side, and this bolted connection prevents the beam from rotating at the support. The beam sits freely on another beam on the right-hand side.</p>
            <p> Click each marked location and select the appropriate load type, then press <strong>Check answers</strong>.</p>`,

    // WHAT can be added. Each type has its own fields and its own drawing.
    itemTypes: {
      reaction_force: {
        label: "Reaction Force",
        draw:  { shape: "arrow", color: "#3f61c4", length: 70 },
        labelTemplate: "{name}",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "up",    label: "Vertical ↑",    draw: { angle: 270 } },
              { value: "right",  label: "Horizontal →",  draw: { angle: 0 } },
          ]},
          { id: "name", label: "Variable name", type: "text"}
        ]
      },
      reaction_moment: {
        label: "Reaction Moment",
        draw:  { shape: "moment", color: "#3f61c4", radius: 26 },
        labelTemplate: "{name}",
        fields: [
          { id: "sense", label: "Sense", type: "select", options: [
              { value: "ccw", label: "Moment ↺", draw: { sense: "ccw" } }
          ]},
          { id: "name", label: "Label", type: "text"}
        ]
      },
      applied_force: {
        label: "Applied Force",
        draw:  { shape: "arrow", color: "#c62828", length: 70 },
        labelTemplate: "{mag} N",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "up",    label: "Upward ↑",    draw: { angle: 270 } },
              { value: "down",  label: "Downward ↓",  draw: { angle:  90 } },
              { value: "left",  label: "Leftward ←",  draw: { angle: 180 } },
              { value: "right", label: "Rightward →", draw: { angle:   0 } }
          ]},
          { id: "mag", label: "Magnitude", type: "number",
            unit: "N", tolerance: 0.05 }
        ]
      },
      applied_moment: {
        label: "Applied Moment",
        draw:  { shape: "moment", color: "#c62828", radius: 26 },
        labelTemplate: "{mag} Nm",
        fields: [
          { id: "sense", label: "Sense", type: "select", options: [
              { value: "cw",  label: "Clockwise ↻",     draw: { sense: "cw"  } },
              { value: "ccw", label: "Anticlockwise ↺", draw: { sense: "ccw" } }
          ]},
          { id: "mag", label: "Magnitude", type: "number",
            unit: "Nm", tolerance: 0.1 }
        ]
      },

      // ── Distributed loads attach to a REGION, not a node ──
      udl: {
        label: "Applied UDL",
        draw:  { shape: "spanLoad", color: "#c62828", mag: "w" },
        labelTemplate: "{w} N/m",
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "down", label: "Vertically down",        draw: { loadDir: "down" } },
              { value: "up",   label: "Vertically up",          draw: { loadDir: "up"   } },
              { value: "perp", label: "Perpendicular to member", draw: { loadDir: "perp" } }
          ]},
          { id: "w", label: "Magnitude", type: "number",
            unit: "N/m", tolerance: 0.05 }
        ]
      },
      ldl: {
        label: "Varying load",
        // Two magnitude fields → a trapezoidal/triangular load
        draw:  { shape: "spanLoad", color: "#c62828", magStart: "wA", magEnd: "wB" },
        labelTemplate: "{v} N/m",          // {v} is each end's own value
        fields: [
          { id: "dir", label: "Direction", type: "select", options: [
              { value: "down", label: "Vertically down",         draw: { loadDir: "down" } },
              { value: "perp", label: "Perpendicular to member",  draw: { loadDir: "perp" } }
          ]},
          { id: "wA", label: "Magnitude at A", type: "number", unit: "N/m", tolerance: 0.05 },
          { id: "wB", label: "Magnitude at B", type: "number", unit: "N/m", tolerance: 0.05 }
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
        ax: 55, ay: 44, bx: 81, by: 44,     // a horizontal member
        height: 120,                          // box extends ABOVE the member
        label: "BC",
        title: "Crate",
        answers: [[
          { itemType: "udl", values: { dir: "down", w: 166.67 } }
        ]]
      }
    ],

    // WHERE point items can be added.
    // x, y are percentages of the image, measured from the top-left.
    nodes: [
      {
        x: 12, y: 50, label: "A", title: "Support A (Fixed)",
        // A pin needs TWO forces — order doesn't matter
        answers: [[
          { itemType: "reaction_force", values: { dir: "up" } },
          { itemType: "reaction_force", values: { dir: "right" } },
          { itemType: "reaction_moment", values: { dir: "sense" } }
        ]]
      },
      {
        x: 92, y: 50, label: "B", title: "Support B (roller)",
        answers: [
          [ { itemType: "reaction_force", values: { dir: "up" } } ]
        ]
      },
      {
        x: 37, y: 50, label: "C", title: "Hanging mass",
        // Nothing acts here — an empty set is the right answer
        answers: [[
          {itemType: "applied_force", values: {dir: "down", mag: 50}}
        ]]
      }
    ]
  },

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