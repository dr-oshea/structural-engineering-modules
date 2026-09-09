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
          <li>Find support reactions using equations of equilibrium for overall structure.
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
  {
    type:  "mcq",
    label: "Quiz 1",
    title: "Quiz 1 – Find internal axial forces in all members​",

    questions: [
      /*Slide 9*/
      { multi: true,
        question:`<p>1. Identify and ignore any zero-force members.​</p>
                  <p><u>Select any zero-force member(s):</u>​</p>`,
        options: [
          { text: "AB" },
          { text: "AD" },
          { text: "BC" },
          { text: "BD", correct: true },
          { text: "CD" }
        ],
        explanation: `Correct!"`
      },
      /*Slide 10*/
      { multi: true,
        question:`<p>2. Think about path/sequence of analysis (pick a starting joint).​​</p>
                  <p><u>Which node(s) are best to start at?​</u>​</p>`,
        options: [
          { text: "A", correct: true },
          { text: "B" },
          { text: "C", correct: true },
          { text: "D"}
        ],
        explanation: `Correct!"`
      },
      /*Slide 11*/
      { type: "cloze",
        intro:`<p>2. Think about path/sequence of analysis (pick a starting joint).​​</p>
                  <p><u>Which node(s) are best to start at?​</u>​</p>`,
        text: [
          { text: "A", correct: true },
          { text: "B" },
          { text: "C", correct: true },
          { text: "D"}
        ],
        explanation: `Correct!"`
      },

      { type: "cloze",
        intro: `<p>Complete the load path below.</p>`,
        text: `<p>(1) [[roof sheeting]] connects to the</p>
        <p>(2) [[purlins]] which connect to the</p>
        <p>(3) [[truss joints]].</p>`,
        distractors: ["rafters", "bracing"], // fit no blank — more words than gaps
        image: "images/roof-truss.svg",
        imagePosition: "right", // or "below"
        explanation: `Shown once every blank is right.`
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
    ]
  },

  /*Slide 17-21*/
  {
    type:  "mcq",
    label: "Quiz 2",
    title: "Quiz 2 – Find internal axial forces in BC, GC, GF​",

    questions: [
      /*Slide 17*/
      { multi: true,
        question:`<p>1. Identify and ignore any zero-force members.​</p>
                  <p><u>Select any zero-force member(s):</u>​</p>`,
        options: [
          { text: "AB" },
          { text: "AG" },
          { text: "BG", correct: true },
          { text: "BC" },
          { text: "CG" }
        ],
        explanation: `Correct!"`
      },
      /*Slide 18*/
      { 
        question:`<p>2. Think about section cut location and extent​​​</p>
                  <p><u>Which section cut should be taken?​​</u>​</p>`,
        options: [
          { text: "a-a", correct: true },
          { text: "b-b" },
          { text: "c-c" }
        ],
        explanation: `Correct!"`
      },
      /*Slide 19*/
      { 
        question:`<p>2. Think about section cut location and extent​​​</p>
                  <p><u>Which extent should we consider to make analysis simpler?​​</u>​</p>`,
        options: [
          { text: "Left-hand side", correct: true },
          { text: "Right-hand side" }
        ],
        explanation: `Correct!"`
      },

      { type: "cloze",
        intro: `<p>Complete the load path below.</p>`,
        text: `<p>(1) [[roof sheeting]] connects to the</p>
        <p>(2) [[purlins]] which connect to the</p>
        <p>(3) [[truss joints]].</p>`,
        distractors: ["rafters", "bracing"], // fit no blank — more words than gaps
        image: "images/roof-truss.svg",
        imagePosition: "right", // or "below"
        explanation: `Shown once every blank is right.`
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