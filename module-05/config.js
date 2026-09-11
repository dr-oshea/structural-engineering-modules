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
  title: "Truss Structures",
  intro: `<p>For members to only experience axial forces (and not shear or bend), engineers must design trusses such that:</p>
          <ol>
            <li>All connections to be pinned (negligible rotational stiffness), and
            <li>External forces are only applied at joints.
          </ol>`,

  text: `<p><strong>Example:</strong> For the roof truss shown, loads acting on the roof travel:</p>
          <ol>
            <li>From the [[roof sheeting]], which connects to the
            <li>[[purlins]], which connect to
            <li>[[truss joints]].
          </ol>`,
  image: "images/Slide 4.png",
  imageWidth: "720px",
  explanation: `Now the truss can be analysed as a 2D planar truss, and the axial force of each member found`
  },

  {type: "info",
    label: "Solving a Truss Structure",
    title: "Solving a Truss Structure",

    blocks: [
      {type: "text",
        html: `<p>The objective when solving a truss structure is to determine the internal axial force of each member.<p>
        <p> Each member's axial force is either in <strong>tension</strong> or <strong>compression</strong>, with some magnitude. Certain members may be zero-force.</p>`
      },
      {type: "text",
        html: `<p>There are two main approaches to solving the axial forces in a truss:</p><ol>
        <li>Method of Joints</li>
        <li>Method of Sections</li>
        <p><strong>The remainder of this module will work through how to use these two approaches.</strong></p>`
      },
      {type: "image",
        src: "images/solving-structure.jpg",
        width: "600px",
      caption: "A bridge truss with loads. The objective is to find the tensile or compressive force in each member"},
    ]
  },

  /*Slide 5*/
  {
    type:      "info",
    partStart: "Zero-force Members",
    label:     "Zero-force Members",
    title:     "Zero-force Members",

    blocks: [
      { type: "text",
        html: `<p>The objective is to determine the internal axial force in all members of a truss. 
        Before any detailed calculations are performed, it is often best to <strong>identify any zero-force members</strong></p>`},

        {type: "text",
        html:`<p>Zero-force members can be identified using two simple rules:​</p>
        
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        ">
          <div>
            <p><strong>Rule 1: Two members meeting at a joint with no external load</strong></p>
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
              $&rarr;$ the non-parallel member is <span style="color: red;">zero-force.</span>
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
        {type: "image"},
        {type: "text",
          html:`The next activity will find zero force members in this truss.`
        },
        {type: "image",
          src: "images/zero-force-example-base.png",
          width: "400px"
        }

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
                    src="images/zero-force-example-CD.png" 
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
                    src="images/zero-force-example-GH.png" 
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
                    src="images/zero-force-example-GE.png" 
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
                    src="images/zero-force-example-IJ.png" 
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
              src="images/particle-equi.jpg" 
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
        {type: "text",
          html: `The <strong>method of joints</strong> progressively applied particle equilibrium at each joint of the truss. Each joint has two equations, though could have several unknowns (including support reactions or internal axial forces).`
        }

    ]
  },

  /*Slide 8*/
  {
    type:      "info",
    label:     "Step-by-step Process",
    title:     "Method of Joints",

    blocks: [
      { type: "text",
        html: `<p>The step-by-step process for method of joints follows:</p>
        <p><strong>OBJECTIVE: Find internal axial forces in some or all truss members</strong><p>`},
      {type: "image",
        src: `images/joints-prob.jpg`,
        width: "300px"
      },
      
       {type: "text",
        html: `<p><strong>STEP ONE:&emsp; Identify any zero force members </strong> </p>
        <p>Use the two rules provided from the previous slides.</p>`
       },
       {type: "text",
        html: `<p><strong>STEP TWO:&emsp; Solve unknown reactions for the truss</strong></p>
        <p>Use the three equations of equilibrium on the strucure as a whole.</p><ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
              <li>$\\curvearrowleft&Sigma;M = 0$
            </ul>`
       },
       {type: "text",
        html: `<p><strong>STEP THREE:&emsp; Identify a solution 'path' from node to node </strong></p>
        <p>Each node can be analysed with particle equilibrium. Therefore there are two equations of equilibrium at a given node. Identify a sequence of the nodes that means that there is only ever two unknowns at a node at any time, and therefore they can be solved.</p>`
       },
       {type: "text",
        html: `<p><strong>STEP FOUR:&emsp; Apply particle equilibirum at each joint to solve the internal forces. </strong></p>
        <p>Following your chosen node sequence, and apply at each node:</p>
        <ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
            </ul>
            <p>Assume unknown forces act in tension. If the final answer is positive, that member is in tension, if negative, that member is in compression.</p>`
       },
        
    ]
  },

  /*Slide 9-15*/
  {type: "mcq",
    label: "Step 1",
    title: "Step 1 - Method of Joints",

     questions: [
      /*Slide 9*/
      { multi: true,
        question:`<p><strong>STEP ONE:&emsp; Identify any zero force members </strong></p>
                  <p>Select any zero-force member(s) in the truss using the rules learnt:​</p>`,
        image: "images/joints-prob.jpg",
        imageWidth: "350px",
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
        question:`<p><strong>STEP TWO:&emsp; Solve unknown reactions for the truss</strong></p>
                  <p>If we have solved $A_y = 2.25 \\text{ kN}$ upwards​ and $C_x = 4.5 \\text{ kN}$ rightwards, what is the reactions $C_y$ ?</p>`,
        image: "images/step2-joints.png",
        imageWidth: "400px",
        options: [
          { text: "2.25 kN upwards" },
          { text: "2.25 kN downwards", correct: true },
          { text: "4.5 kN upwards" },
          { text: "4.5 kN downwards"}
        ],
        explanation: `<p>Correct! </p>
        <p>This can be found using euilibirum of vertical forces for the truss structure as a whole.</p>`
      },
    ]
  },

  {type: "mcq",
    requires: true,
    label: "Step 3",
    title: "Step 3 - Method of Joints",

    questions: [
      /*Slide 9*/
      { multi: true,
        question:`<p><strong>STEP THREE:&emsp; Identify a solution 'path' from node to node </strong></p>
                  <p>Which of the following are appropriate solution path for this truss. Recall that member BD is zero force.</p>`,
        image: "images/step2-joints.png",
        imageWidth: "450px",
        options: [
          { text: "A $\\rightarrow$ C", correct: true },
          { text: "B $\\rightarrow$ A $\\rightarrow$ C" },
          { text: "C $\\rightarrow$ A", correct: true },
          { text: "C $\\rightarrow$ A $\\rightarrow$ B"},
        ],
        hint: `<p>Starting at B is not helpful as the two unknowns are collinear and so cannot be distinguished. Start elsewhere.</p>`,
        hintCollapsed: true,
        showCount: true,
        explanation: `<p>Correct! </p>
        <p>Since BD is zero force, all of the joints have only two unknowns. </p>
        <p>For the two equations ($\\Sigma F_x = 0, \\Sigma F_y = 0$) to be useful, we need the two unknowns to not be collinear. Therefore, this removes B as a useful starting point.</p>
        <p>The most efficient way is to use A then C, or C then A, meaning only two joints are analysed. The final option above does not need to use B, since all unknowns entering it are already known by that stage.
        <p><strong>Ultimately, the solution path is up to you, and all paths reach the same final result.</strong></p>`
      },
    ]
  },

  { type: "steps",
    requires: true,
    label: "Step 4a",
    title: "Step 4 - Method of Joints",

    image: "images/step4-joints.png",
    imageWidth: "600px",

    problem: `<p><strong>STEP FOUR:&emsp; Apply particle equilibirum at each joint to solve the internal forces. </strong></p>
    <p> Assume we chose to start at Joint A. Solve the unknowns at this location.`,

    steps: [
      {
        instruction: `Find axial force $F_{AD}$. Use positive for tension, negative for compression. Use 2 or more decimal places`,
        hint: `The angle between AB and AD is 45 degrees.`,
        hintCollapsed: true,
        unit: "kN",
        answer: -3.182,
        tolerance: 0.01,
        explanation: `Correct! This is in compression`
      },
      {
        instruction: `Find axial force $F_{AB}$. Use positive for tension, negative for compression. Use 2 or more decimal places`,
        unit: "kN",
        answer: 2.25,
        tolerance: 0.01,
        explanation: `Correct! This is in tension`
      },
    ]
  },

  { type: "steps",
    requires: true,
    label: "Step 4b",
    title: "Step 4 - Method of Joints",

    image: "images/step4b-joints-01.png",
    imageWidth: "600px",

    problem: `<p><strong>STEP FOUR:&emsp; Apply particle equilibirum at each joint to solve the internal forces. </strong></p>
    <p> Now all forces are known except $F_{BC}$ and $F_{CD}$. The most efficient choice is to next look at Joint C.</p>`,

    steps: [
      {
        instruction: `Find axial force $F_{CD}$. Use positive for tension, negative for compression. Use 2 or more decimal places`,
        hint: `$\\Sigma F_y = 0 = F_{BC} \\cos 45 \\deg - 2.25`,
        hintCollapsed: true,
        unit: "kN",
        answer: 3.182,
        tolerance: 0.01,
        explanation: `Correct! This is in tension`
      },
      {
        instruction: `Find axial force $F_{BC}$. Use positive for tension, negative for compression. Use 2 or more decimal places`,
        unit: "kN",
        answer: 2.25,
        tolerance: 0.01,
        explanation: `Correct! This is in tension`
      },
    ]
  },

  
  /*PART 2*/

  {
    type:      "info",
    partStart: "Method of Sections",
    label:     "Step-by-step Process",
    title:     "Method of Joints",

    blocks: [
      {type: "text",
        html: `<p> The <strong>method of sections</strong> uses equilibrium of <strong>sections</strong> of the truss rather than equilibrium at each joint</p>
        <p>For a section of the truss, we have all <strong>3 equations of equilibrium</strong> at our disposal.</p><p>The step-by-step process for method of sections follows:</p>`},
      {type: "image",
        src: `images/sections-example.png`,
        width: "350px"
      },
      
       {type: "text",
        html: `<p><strong>STEP ONE:&emsp; Identify any zero force members </strong> </p>
        <p>Use the two rules provided from earlier in the module.</p>`
       },
       {type: "text",
        html: `<p><strong>STEP TWO:&emsp; Solve unknown reactions for the truss</strong></p>
        <p>Use the three equations of equilibrium on the strucure as a whole.</p><ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
              <li>$\\curvearrowleft&Sigma;M = 0$
            </ul>`
       },
       {type: "text",
        html: `<p><strong>STEP THREE:&emsp; Identify a suitable location to 'cut' the truss</strong></p>
        <p>A section of the truss will cut through one or more members, and any member cut through will expose its internal axial force. Determine the location of the cut based off:</p>
        <ul><li>Which members do we want to find internal axial forces for?</li>
        <li>How many members will this sction cut through? (We have three equations of equilibrium, so we can cut through at most three members with unknown axial force)</li></ul>`
       },
       {type: "text",
        html: `<p><strong>STEP FOUR:&emsp; Apply equilibirum of section to solve the internal forces. </strong></p>
        <p>you may use either the section left of the cut, or right of the cut, both will give the same answer:</p>
        <ul>
              <li>$&uarr;&Sigma;F_y=0$
              <li>$&rarr;&Sigma;F_x=0$
              <li>$\\curvearrowleft&Sigma;M = 0$
        </ul>
            <p>Assume unknown forces act in tension. If the final answer is positive, that member is in tension, if negative, that member is in compression.</p>`
       },
        
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
        question:`<p>For the truss shown, find he internal axial force in members $EF, CF, BC$</p>
        <p><strong>STEP ONE:&emsp; Identify any zero force members </strong>​</p>
                  <p><u>Select any zero-force member(s), or none:</u>​</p>`,
        image: "images/sections-example.png",
        imageWidth: "450px",
        imagePosition: "below",
        options: [
          { text: "EF" },
          { text: "AB" },
          { text: "CE" },
          { text: "DE" },
          { text: "BC" },
          { text: "None" , correct: true}
        ],
        explanation: `Correct! There are no zero-force members to identify here.`
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
        question:`<p>For the truss shown, find he internal axial force in members $EF, CF, BC$</p>
              <p><strong>STEP TWO:&emsp; Solve unknown reactions for the truss</strong></p>
                  <p>There is a pin at A and pin at G, how many unknown reactions are there total?</p>`,
        image: "images/sections-example.png",
        imagePosition: "below",
        options: [
          { text: "2" },
          { text: "3" },
          { text: "4",correct: true  }
        ],
        explanation: `Correct! There are 4 unknown reactions, and so they cannot be solved. In the next part we can see how we can still reach our objective anyway."`
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
        question:`<p>For the truss shown, find he internal axial force in members $EF, CF, BC$</p>,
            <p><strong>STEP THREE:&emsp; Identify a suitable location to 'cut' the truss</strong></p>
            <p>Which indicated cut is best for us to use?</p>`,
        image: "images/sections-example-step3.png",
        imagePosition: "below",
        options: [
          { text: "a-a"},
          { text: "b-b", correct: true  },
          {text: "c-c"}
        ],
        explanation: `<p>Correct! Remember which axial forces we have been asked to solve. </p><p?Also, "c-c" cuts through 4 members, and we only have three equations to use on a section.</p>`
      },
    ],
  },

  {type: "steps",
    requires: true,
    label: "Step 4",
    title: "Step 4 - Method of Sections",

    image: "images/sections-example-step4-01.png",
    imageWidth: "600px",

    problem: `<p>For the truss shown, find he internal axial force in members $EF, CF, BC$</p>
    <p><strong>STEP FOUR:&emsp; Apply equilibirum of section to solve the internal forces. </strong></p>
    <p>We can use the LHS of the cut or the RHS. In this case, the RHS avoids support reactions and so is the better choice.`,

    steps: [
      {
        instruction: `For the section RHS of the cut, find axial force $F_{EF}$, using equilibrium of moments about point C$`,
        hint: `<p>Take moments about $C$ such that there is only one unknown to solve</p>`,
        hintCollapsed: true,
        unit: "kN",
        answer: 40,
        tolerance: 0,
        explanation: `Correct!`
      },
      {
        instruction: `For the section RHS of the cut, find axial force $F_{CF}$, using equilibrium of vertical forces$. Round to nearest kN.`,
        unit: "kN",
        answer: 99,
        tolerance: 0.1,
        explanation: `Correct!`
      },
      {
        instruction: `For the section RHS of the cut, find axial force $F_{BC}$, using equilibrium of horizontal forces`,
        hint: `<p>You could also use equilibrium of moments about point F here.</p>`,
        hintCollapsed: true,
        unit: "kN",
        answer: -40,
        tolerance: 0,
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