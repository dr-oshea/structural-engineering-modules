// Optional module metadata — used by the final slide's save payload
const moduleMeta = {
  id: "module-05-trusses"
};

const moduleData = [

  /*Slide 1*/
  {
    type:       "splash",
    label:      "Home page",
    title:      "Solving Trusses",
    subtitle:   "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
    // The contents list is generated automatically from the partStart
    // fields below — nothing to maintain here.
  },

  /*Slide 2*/
  {
    type:  "context",
    label: "Context/Motivation",
    title: "Truss Structures",
    image: "images/Slide 2.png",
    text:  `<p>
            A truss is a system of members that carries load into the supports. Plane trusses are 2D truss structures commonly used in roofs and bridges as shown.
            </p>`
  },

  /*PART 1*/
  /*Slide 3*/
  {
    type:      "info",
    partStart: "What is a Truss",
    label:     "Truss Members",
    title:     "What are Truss Members",

    blocks: [
      { type: "text",
        html: `<ul>
              <li>A truss structure is a system of members that carries load into the supports. </li>
              <li>They are designed to be efficient in terms of amount of material used.</li>
              <li>Individual truss members are therefore <strong>designed to only take axial loading</strong>, and exist in one of three forms:
                <ul>
                  <li>Tension (T),
                  <li>Compression (C), or
                  <li>Zero-force.
                </ul>
              </ul>` },

      { type: "image",
        src:     "images/Slide 3.png",
        width:   "600px",
        caption: "Fig. 1" },

    ]
  },

  /*Slide 4*/
  {
  type:  "cloze",
  label: "Truss Structures",
  title: "Truss Members",
  intro: `<p>For members to only experience axial forces (and not shear or bend), engineers must design trusses such that:</p>
          <ol>
            <li>All connections to be pinned (negligible rotational stiffness), and
            <li>External forces are only applied at joints.
          </ol>`,

  text: `<p><strong>Example:</strong> For the roof truss shown, the:</p>
          <ol>
            <li>[[roof sheeting]] connects to the
            <li>[[purlins]] which connect to
            <li>[[truss joints]].
          </ol>`,
  image: "images/Slide 4.png",
  imageWidth: "720px",
  explanation: `Now the truss can be analysed as a 2D planar truss, and the axial force of each member found`
  },

  /*Slide 5*/
  {
    type:      "info",
    partStart: "Zero-force Members",
    label:     "Zero-force Members",
    title:     "Zero-force Members",

    blocks: [
      { type: "text",
        html: `<p>Our objective is to determine the internal axial force in all members of a truss. 
        Before any detailed calculations are performed, it is often best to <strong>identify any zero-force members</strong></p>`},

        {type: "text",
        html:`<p>Zero-force members can be identified using two simple rules:​</p>
        
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        ">
          <div>
            <p><strong>Rule 1: Two perpendicular members meeting at a joint with no external load</strong></p>
            <p>
              $&rarr;$ both are <span style="color: red;">zero-force.</span>
            </p>
            <img
            src="images/Slide 5 - 1.png"
            style="
              width: 25%;
              max-width: 500px;
              height: auto;
              margin-top: 15px;
            "
            >
          </div>

          <div>
            <p><strong>Rule 2: Three members meeting at a joint with no external load and two are parallel</strong></p>
            <p>
              $&rarr;$ the perpendicular member is <span style="color: red;">zero-force.</span>
            </p>
            <img
            src="images/Slide 5 - 2.png"
            style="
              width: 35%;
              max-width: 500px;
              height: auto;
              margin-top: 15px;
            "
            >
          </div>
        </div>        
        ` },

    ]
  },

  /*Slide 6*/
  {
    type:  "mcq",
    label: "Zero-force Members",
    title: "Try it yourself",

    questions: [
      {
        question:`<p>The following truss contains zero-force members.</p>
                  <img 
                    src="images/Slide 6.png" 
                    alt="Truss diagram"
                    style="display: block; max-width: 700px; width: 60%; margin: 20px auto;"
                  >
                  <p>For the <strong>member CD</strong>, which rule explains why it is a zero-force member?</p>`,
        options: [
          { text: "<strong>Rule 1:</strong> Two members meeting at a joint with no external load $&rarr;$ both are <span style=\"color: red;\">zero-force.</span>​" },
          { text: "<strong>Rule 2:</strong> Three members meeting at a joint with no external load and two are parallel $&rarr;$ the non-parallel member is <span style=\"color: red;\">zero-force.</span>​", correct: true },
        ],
        explanation: `Correct! Consider equilibrium of horizontal forces at C.`
      },
      {
        question:`<p>The following truss contains zero-force members.</p>
                  <img 
                    src="images/Slide 6.png" 
                    alt="Truss diagram"
                    style="display: block; max-width: 700px; width: 60%; margin: 20px auto;"
                  >
                  <p>For the <strong>member GH</strong>, which rule explains why it is a zero-force member?</p>`,
        options: [
          { text: "<strong>Rule 1:</strong> Two members meeting at a joint with no external load $&rarr;$ both are <span style=\"color: red;\">zero-force.</span>​", correct: true },
          { text: "<strong>Rule 2:</strong> Three members meeting at a joint with no external load and two are parallel $&rarr;$ the non-parallel member is <span style=\"color: red;\">zero-force.</span>​"},
        ],
        explanation: `Correct! Consider equilibrium of horizontal or vertical forces at G.`
      },
      {
        question:`<p>The following truss contains zero-force members.</p>
                  <img 
                    src="images/Slide 6.png" 
                    alt="Truss diagram"
                    style="display: block; max-width: 700px; width: 60%; margin: 20px auto;"
                  >
                  <p>For the <strong>member GE</strong>, which rule explains why it is a zero-force member?</p>`,
        options: [
          { text: "<strong>Rule 1:</strong> Two members meeting at a joint with no external load $&rarr;$ both are <span style=\"color: red;\">zero-force.</span>​", correct: true },
          { text: "<strong>Rule 2:</strong> Three members meeting at a joint with no external load and two are parallel $&rarr;$ the non-parallel member is <span style=\"color: red;\">zero-force.</span>​"},
        ],
        explanation: `Correct! Consider equilibrium of horizontal or vertical forces at G.`
      },
      {
        question:`<p>The following truss contains zero-force members.</p>
                  <img 
                    src="images/Slide 6.png" 
                    alt="Truss diagram"
                    style="display: block; max-width: 700px; width: 60%; margin: 20px auto;"
                  >
                  <p>For the <strong>member IJ</strong>, which rule explains why it is a zero-force member?</p>`,
        options: [
          { text: "<strong>Rule 1:</strong> Two members meeting at a joint with no external load $&rarr;$ both are <span style=\"color: red;\">zero-force.</span>​" },
          { text: "<strong>Rule 2:</strong> Three members meeting at a joint with no external load and two are parallel $&rarr;$ the non-parallel member is <span style=\"color: red;\">zero-force.</span>​", correct: true },
        ],
        explanation: `Correct! Consider equilibrium of vertical forces at I.`
      },
    ]
  },

  /*Slide 7*/
  {
    type:      "info",
    partStart: "Method of Joints",
    label:     "Particle Equilibrium",
    title:     "Particle Equilibrium of Joints",

    blocks: [
      { type: "text",
        html: `<p>A joint in a truss connects 2 or more members. If we isolate the joint, we essentially have the model of a particle with the line of action of all forces acting through its centre.</p>
        <p>Therefore, no moment is generated.​​</p>
        
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        ">
          <div>
            <img
              src="images/Slide 7.png" 
              style="width: 100%;"
              alt="Figure 1"
            />
          </div>

          <div>
            <p>This is <strong>particle equilibrium</strong>, and so:</p>

            <ul>
              <li>Force equilibrium equations apply:
              <ul>
                <li>$&uarr;&Sigma;F_y=0$
                <li>$&rarr;&Sigma;F_x=0$
              </ul>
            </ul>

            <ul>
              <li>Though moment equilibrium does not provide any useful information:
            </ul>

            <p>Therefore, at <strong>each joint we have two (2) equations of equilibrium</strong>, and can solve at most two unknowns meeting at a joint.</p>
          </div>
        </div>        
        ` },

    ]
  },

  /*Slide 8*/
  {
    type:      "info",
    label:     "Step-by-step Process",
    title:     "Method of Joints",

    blocks: [
      {type: "text",
        html: `<p>The <strong>method of joints</strong> approach to solving the internal axial force of truss members uses particle equilibrium at each joint in the truss.</p>`
      },
      { type: "text",
        html: `<p>The step-by-step process follows:</p>
        <ol><strong>
          <li>Identify and ignore any zero-force members.
          <li>Think about path/sequence of analysis (pick a starting joint with at most two unknowns attached to it).
          <li>IF NECESSARY, find support reactions using equations of equilibrium for overall structure.
            <ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
              <li>$↺ &Sigma; M = 0$
            </ul>
          <li>Pick a starting joint and apply particle equilibrium, repeat this at appropriate joints until all relevant member forces are found.
            <ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
            </ul>
        </strong></ol>
          ` },
    ]
  },

  /*Slide 9-15*/
  {type: "mcq",
    label: "Step 1",
    title: "Step 1 - Method of Joints",

     questions: [
      /*Slide 9*/
      { multi: true,
        question:`<p><strong>1. Identify and ignore any zero-force members.​</strong></p>
                  <p>Select any zero-force member(s):​</p>`,
        image: "images/joints-prob.jpg",
        imageWidth: "300px",
        options: [
          { text: "AB" },
          { text: "AD" },
          { text: "BC" },
          { text: "BD", correct: true },
          { text: "CD" },
          { text: "None"}
        ],
        showCount: true,
        explanation: `Correct!"`
      },
    ]
  },

  {type: "mcq",
    requires: true,
    label: "Step 2",
    title: "Step 2 - Method of Joints",

    questions: [
      /*Slide 9*/
      { 
        question:`<p><strong>2. Think about path/sequence of analysis (pick a starting joint).​​</strong></p>
                  <p>Which node is best to start at?​</p>`,
        image: "images/step2-joints.png",
        imageWidth: "300px",
        options: [
          { text: "A" },
          { text: "B" },
          { text: "C" },
          { text: "D", correct: true }
        ],
        hint: `<p>After removing zero-force members, which node has only two unknowns passing through it? Remember, support reactions and internal forces are all currently unknown...</p>`,
        hintCollapsed: true,
        showCount: true,
        explanation: `<p>Correct! </p>
        <p>Joint A has three unknowns ($A_y, F_{AD}, F_{AB}$) and Joint C has four unknowns ($C_x, C_y, F_{BC}, F_{CD}$). Joint B has two unknowns ($F_{AB}, F_{BC}$) though they are collinear so cannot be resolved.</p>
        <p>Note you could also begin by solving the three reactions using equilibrium equations on the structure as a whole. The method considered here, demonstrates how this work can be avoided since the target is the internal axial forces rather than the reactions.</p>`
      },
    ]
  },

  { type: "steps",
    requires: true,
    label: "Step 3",
    title: "Step 3 - Method of Joints",

    image: "images/step3-joints.png",
    imageWidth: "600px",

    problem: `<p><strong>4. Pick a starting joint and apply particle equilibrium, repeat this at appropriate joints until all relevant member forces are found.</strong></p>
    <p> We have selected Joint $D$, and we know $F_{BD} = 0$. We can solve $F_{AD}$ and $F_{CD}$.`,

    steps: [
      {
        instruction: `Find axial force $F_{AD}$. Use positive for tension, negative for compression`,
        hint: `<p>From equilibrium of vertical forces, $F_{AD} = -F_{CD}$. Equilibrium of horizontal forces gives: $\\rightarrow \\Sigma F_x = -45 + F_{CD} \\cos(45\\deg) - F_{AD}\\cos(45\\deg) = 0</p>`,
        hintCollapsed: true,
        unit: "kN",
        answer: -3.182,
        tolerance: 0.01,
        explanation: `Correct! This is in compression`
      },
      {
        instruction: `Find axial force $F_{CD}$. Use positive for tension, negative for compression`,
        unit: "kN",
        answer: 3.182,
        tolerance: 0.01,
        explanation: `Correct! This is in tension`
      },
    ]
  },

  {type: "mcq",
    requires: true,
    label: "Step 4a",
    title: "Step 4 - Method of Joints",

    

    questions: [
      /*Slide 9*/
      { 
        question:`<p><strong>4. Pick a starting joint and apply particle equilibrium, repeat this at appropriate joints until all relevant member forces are found.​​</strong></p>
                  <p>Which node is best to consider next? Which only has 2 unknowns remaining​</p>`,
        options: [
          { text: "A", correct: true },
          { text: "B" },
          { text: "C" },
        ],
        image: "images/step5-joints.png",
        imageWidth: "300px",
        hint: `<p>Point C has three unknowns ($C_y, C_x, F_{BC}$), Point B has two unknowns, though they are collinear so cannot be determined.</p>`,
        hintCollapsed: true,
        showCount: true,
        explanation: `Correct! `
      },
    ]
  },

  { type: "steps",
    requires: true,
    label: "Step 4b",
    title: "Step 4 - Method of Joints",

    image: "images/step4-joints.png",
    imageWidth: "600px",

    problem: `<p><strong>4. Pick a starting joint and apply particle equilibrium, repeat this at appropriate joints until all relevant member forces are found.</strong></p>
    <p> We have selected Joint $A$, and we know $F_{AD} = 31.82\\ \\text{kN}$. We can solve $F_{AB}$ (and $A_{y}$ if desired).`,

    steps: [
      {
        instruction: `Find axial force $F_{AB}$. Use positive for tension, negative for compression`,
        hint: `<p>Use equilibrium of horizontal forces to isolate the unknown you want to solve.</p>`,
        hintCollapsed: true,
        unit: "kN",
        answer: -2.25,
        tolerance: 0.01,
        explanation: `Correct!`
      },
      {
        instruction: `<p>Now, consider joint $B$.</p> <p>Find axial force $F_{BC}$ to compelte the problem. Use positive for tension, negative for compression</p>`,
        unit: "kN",
        answer: 2.25,
        tolerance: 0.01,
        explanation: `Correct!`
      },
    ]
  },

  /*PART 2*/
  /*Slide 16*/
    {
    type:      "info",
    partStart: "Method of Sections",
    label:     "Step-by-step Process",
    title:     "Method of Sections",

    blocks: [
      {type: "text",
        html: `<p>The <strong>method of sections</strong> approach to solving the internal axial force of truss members uses equilibrium of sections.</p>`
      },
      { type: "text",
        html: `<p>Step-by-step process:</p>
        <ol>
          <li>Identify and ignore any zero-force members.
          <li>Think about section cut location and extent. Cut through at most three members with unknown axial force.
          <li><strong>IF NEEDED,</strong> Find support reactions using equations of equilibrium for overall structure.
            <ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
              <li>$↺ &Sigma; M = 0$
            </ul>
          <li>Use equations of equilibrium, to determine internal axial force of relevant members.
            <ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
              <li>$↺ &Sigma; M = 0$
            </ul>
        </ol>
          ` },
          {type: "text",
            html: `<p><strong>The next series of slides steps you through this process for an example truss</strong></p>`
          }
    ]
  },

  /*Slide 17-21*/
  {
    type:  "mcq",
    label: "Step 1",
    title: "Step 1 – Method of Sections",

    questions: [
      /*Slide 17*/
      { multi: true,
        question:`<p>1. Identify and ignore any zero-force members.​</p>
                  <p><u>Select any zero-force member(s):</u>​</p>`,
        image: "images/Slide 18.png",
        imagePosition: "below",
        options: [
          { text: "AB" },
          { text: "AG" },
          { text: "BG" },
          { text: "BC" },
          { text: "CG" },
          { text: "DE" , correct: true}
        ],
        showCount: true,
        explanation: `Correct! Equilibrium of vertical forces at E shows that DE is zero force."`
      },
    ],
  },

  {
    type:  "mcq",
    label: "Step 2",
    requires: true,
    title: "Step 2 – Method of Sections",

    questions: [
      /*Slide 18*/
      {
        question:`<p><strong>2. Think about section cut location and extent​​​</strong></p>
                  <p>The objective is to find axial force in members $BC,\\ GC,\\ GF$. </p>
                  <p><strong>Which section cut should be taken?​​</strong></p>`,
        image: "images/Slide 18.png",
        imagePosition: "below",
        options: [
          { text: "a-a", correct: true },
          { text: "b-b" },
          { text: "c-c" }
        ],
        explanation: `Correct! This section cuts through all three members we wish to solve and so is most efficient."`
      },
    ],
  },

  {
    type:  "mcq",
    label: "Step 3",
    requires: true,
    title: "Step 3 – Method of Sections",

    questions: [
      /*Slide 18*/
      { multi: true,
        question:`<p><strong>3. IF NEEDED, find all support reactions</strong></p>
                  <p>Which extent (left or right of the section) should we consider to make analysis simpler?​​</p>`,
        image: "images/Slide 19.png",
        imagePosition: "below",
        options: [
          { text: "Left-hand side", correct: true },
          { text: "Right-hand side" }
        ],
        explanation: `Correct! Using the RHS will also work, though we would first need to find the support reactions considering equlibrium of the <strong>structure as a whole</strong> so that there are not too many unknowns."`
      },
    ],
  },

  {type: "steps",
    requires: true,
    label: "Step 4",
    title: "Step 4 - Method of Sections",

    image: "images/Slide 20.png",
    imageWidth: "600px",

    problem: `<p><strong>4. Use equilibrium of sections to solve the required axial forces</strong></p>
    <p>We wish to solve axial force in members $BC, GC, GF$`,

    steps: [
      {
        instruction: `Find axial force $F_{BC}$`,
        hint: `<p>Take moments about $G$ such that there is only one unknown to solve</p>`,
        hintCollapsed: true,
        unit: "N",
        answer: 1000,
        tolerance: 0,
        explanation: `Correct!`
      },
      {
        instruction: `Find axial force $F_{GF}$`,
        hint: `<p>The line of action of $F_{BC}, F_{GC}$ pass through $C$. Take moments about $C$ such that there is only one unknown to solve</p>`,
        hintCollapsed: true,
        unit: "N",
        answer: 1000,
        tolerance: 0,
        explanation: `Correct!`
      },
      {
        instruction: `Find axial force $F_{GC}$`,
        hint: `<p>You could use equilibrium of horizontal or vertical forces here.</p>`,
        hintCollapsed: true,
        unit: "N",
        answer: 1412,
        tolerance: 10,
        explanation: `Correct!`
      },
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