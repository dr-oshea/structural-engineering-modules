// Optional module metadata — used by the final slide's save payload
const moduleMeta = {
  id: "module-03-reactions"
};

const moduleData = [

  /*Slide 1*/
  {
    type:       "splash",
    label:      "Home page",
    title:      "Calculating Reactions​",
    subtitle:   "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
    // The contents list is generated automatically from the partStart
    // fields below — nothing to maintain here.
  },

  /*Slide 3*/
  {
    type:  "context",
    label: "Context/Motivation",
    title: "What is a Reaction?",
    image: "images/context.jpg",
    text:  `<p>
            Supports prevent structures from moving by providing reaction forces and moments that resist applied loads. Determining these support reactions is often the first step in structural analysis and is essential for assessing how loads are distributed throughout a structure.​
            </p>`
  },

  /*Slide 2*/
  {
    type:      "cards",
    partStart: "Types of Supports",
    label:     "Three main types",
    title:     "Recap – The Three main reaction Types",
    intro: `<p>There are three main types of supports used in structural analysis. Each can be replaced by a set of reaction forces and moment, depending on the motions which they restrict​.</p>
    <p><strong>Reaction forces prevent translational displacements</strong> from occurring at a point.</p> 
    <p><strong>Moment reactions prevent rotational displacements</strong> from occurring at a point.</p>`,

    cards: [
    { front: "Roller Support", back: "One reaction​ force (Perpendicular to surface)​" },
    { front: "Pin Support", back: "Two reactions. One vertical force, one horizontal force." },
    { front: "Fixed Support", back: "Three reactions. One vertical force, one horizontal force and one moment." }
  ]
  },

  /*Slide 4*/
  {
    type:  "mcq",
    label: "Identify the Reaction",
    title: "Identifying Support Reactions",

    questions: [
      {multi: true,
        question: `<p>The problem above shows a person standing on a ladder, in contact with the ground and wall. The FBD shows all external forces acting on the ladder. </p>
        <p><strong>Which forces are reaction forces?</strong> (Select all that apply)</p>`,
        
        image: "images/mcq-ladder.png",

        options: [
          { text: "$F_{N1}$", correct: true},
          { text: "$F_m$"},
          { text: "$F_g$"},
          { text: "$F_f$", correct: true},
          { text: "$F_{N2}$", correct: true},
          { text: "None."}
        ],
        explanation: `The weight of the person and ladder are imposing an action on the ladder. To prevent the ladder from moving, forces normal to the wall and floor <strong>react</strong> to the load, as well as the friction of the floor.`,
      }]
  },

  /*Slide 5*/
  {
    type:      "info",
    partStart: "Calculating Reactions?",
    label:     "Why Calculate Reactions",
    title:     "Why Calculate Reactions",

    blocks: [
      { type: "text",
        html:`<p>Support reactions allow engineers to determine how external loads are transferred from a structure to its supports.</p>
        <p>different structural members can be supported by others, forming a <strong>load path</strong>, as seen below.</p>
          ` },
      
      { type: "image",
        src:     "images/Slide 5.png",
        width:   "600px",
        caption: "Fig. 1" },

        {type: "text",
          html: `<p>Unknowns in a system include support reactions and internal actions. <strong>Solving for the support reactions first, then enables us to later determine
          internal effects</strong> such as axial forces, shear forces, and bending moments - crucial for design.</p>`
        }
    ]
  },

  /*Slide 7*/
  {
    type:      "info",
    label:     "How to Calculate Reactions",
    title:     "How to Calculate Reactions",

    blocks: [
      { type: "text",
        html:`The process for calculating reactions of a structure are as follows:<ol>
                <li><strong>Determine if the structure is determinate. </strong>
                  <ul><li>In 2D, we have 3 equations of equilibrium, therefore we can solve at most 3 unknown reactions.</li></ul>
                <li><strong>Draw the Free Body Diagram of the entire structure:</strong>
                  <ul>
                    <li>Include all the members
                    <li>Include all applied loads
                    <li>Replace all supports with equivalent reaction forces and/or moment
                  </ul>
                <li><strong>Use Equations of Equilibrium</strong>
                  <ul>
                    <li>$\\rightarrow &Sigma;F_x=0$
                    <li>$\\uparrow &Sigma;F_y=0$
                    <li>$\\curvearrowleft&Sigma;M=0$
                  </ul>
                <li><strong>Solve these equations simultaneously for the unknown reactions</strong>
              </ol>
          ` },
      
      { type: "image",
        src:     "images/Slide 7.png",
        width:   "800px" },
    ]
  },

  /*Slide 8*/
  {
    type:      "steps",
    label:     "Worked Example",
    title:     "How to Calculate Reactions - Worked Example",

    image: "images/Slide 8.png",
    imageScale: 1.5,

    problem: `<p>Consider the frame shown. At $A$, there is a pin support, and at $B$ there is a roller support. Work through the steps below to solve the unknown reactions</p>`,

    steps: [
      { instruction: `Use equilibrium of horizontal forces to find $H_a$. Use negative if it acts in the opposite direction as shown.`,
        unit: "kN",
        answer: 3,
        tolerance: 0,
        explanation: `$\\rightarrow \\Sigma F_x = H_a - 3 = 0$`
      },
      { instruction: `Use equilibrium of moments to find $V_b$. Use negative if it acts in the opposite direction as shown.`,
        hint:`When selecting a reference point to take moments about, consider a location where the force $V_a$ does not contribute, therefore leaving only one unknown.`,
        hintCollapsed: true,
        unit: "kN",
        answer: -1.8,
        tolerance: 0,
        explanation: `$\\curvearrowleft \\Sigma M_A = 5\\mathrm{m} \\times V_a + 3 \\mathrm{kN} \times 3 \mathrm{m} = 0$`
      },
      { instruction: `Finally, use equilibrium of vertical forces to find $V_a$. Use negative if it acts in the opposite direction as shown.`,
        unit: "kN",
        answer: 1.8,
        tolerance: 0,
        explanation: `$\\uparrow \\Sigma F_y = V_a + V_b = V_a - 1.8 = 0$`
      },
    ]
  },

  /*Slide 9*/
  {
    type: "interactive-diagram",
    label: "Draw the Reactions",
    title: "Your Turn Now - Find all reactions",
    image: "images/Slide 9.jpg",
    imageWidth: "500px",

    prompt: "<p>Click each point below and draw the required reaction forces. Click <strong>Check</strong> to check your responses.",

    itemTypes: {
      force: {
        label: "Force",
        draw: {
          shape: "arrow",
          color: "#c62828",
          length: 70
        },
        labelTemplate: "{mag} kN",

        fields: [
          {
            id: "dir",
            label: "Direction",
            type: "select",
            options: [
              {value: "up", label: "upward ↑", draw: {angle: 270}},
              {value: "down", label: "downward ↓", draw: {angle: 90}},
              {value: "left", label: "leftward ←", draw: {angle: 180}},
              {value: "right", label: "rightward →", draw: {angle: 0}},
            ],
          },
          {
            id: "mag",
            label: "Magnitude",
            type: "number",
            unit: "kN",
            tolerance: 0.01
          }
        ]
      }
    },

    "nodes": [
      {
        x: 12,
        y: 20,
        label: "A",
        title: "Support A (pin)",
        answers: [
          [
            {
              itemType: "force",
              values: {
                dir: "left",
                mag: 80
              }
            },
            {
              itemType: "force",
              values: {
                dir: "up",
                mag: 60
              }
            },
          ]
        ]
      },
      {
        x: 12,
        y: 85,
        label: "B",
        hint: `<p>Take moments about A. Then the lever arms are simple to determine, and the reaction at B solved.</p>`,
        title: "Support B (roller)",
        answers: [
          [
            {
              itemType: "force",
              values: {
                dir: "right",
                mag: 80
              }
            }
          ]
        ],
      }
    ]
  },

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