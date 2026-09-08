const moduleMeta = {
  id: "module-02-equilibrium"
};

const moduleData = [

  /*Slide 1*/
  {
    type:       "splash",
    label:      "Home page",
    title:      "Using Equations of Equilibrium​",
    subtitle:   "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
    // The contents list is generated automatically from the partStart
    // fields below — nothing to maintain here.
  },

  {
    type:  "context",
    label: "Context/Motivation",
    title: "Why do we use Equilibrium?​",
    text:  `<p>Every bridge, building, and machine component must be able to resist applied loads without moving or collapsing. 
    The equations of equilibrium allow engineers to relate external loads to support reactions and internal forces, 
    making them one of the most important tools in structural analysis.</p>`,
    image: "images/context-harbour-bridge.jpg"
  },

  /*PART 1*/
  /*Slide 2*/
  {
    type:      "info",
    partStart: "Equations of Equilibrium",
    label:     "Introduction",
    title:     "Newton’s Laws of Motion​",

    blocks: [
      { type: "text",
        html: `<p>
            Isaac Newton’s laws of motion provide the basis of modern physics and engineering. The laws are stated as follows:​
            <ol>
              <li>An object at rest remains at rest, and an object in motion remains in motion at constant speed and in a straight line unless acted on by an unbalanced force.​
              <li>The acceleration of an object depends on the mass of the object and the amount of force applied.​
              <li> Whenever one object exerts a force on another object, the second object exerts an equal and opposite on the first.
            </ol>
            <p>...These can be simplified for the purposes of practical application in structural engineering.​
            </p>
        ` },
        {type: "image",
          src: "images/isaac_newton.jpg",
          width: "300px",
          caption: "Britannica Online (2026)"
        },

    ]
  },

  /*Slide 3*/
  {
    type:      "info",
    label:     "Newton's 2nd Law",
    title:     "Newton’s Second Law of Motion​",

    blocks: [
      { type: "text",
        html: `<p> It is easiest to first understand <strong>Newton’s 2nd Law,</strong> the law of force and acceleration.</p>
        <p> Consider a box of mass $m$ that is <strong>moving</strong>. If it is accelerating horizontally at acceleration $a$, the net force associated with this motion is $F$.</p>
            <p>You can think of an object’s mass $m$ as its resistance to acceleration (change of velocity) when a net force is applied.</p>
        ` },
        {type: "equation",
          latex: String.raw`\rightarrow \Sigma\ F_x=ma`

        },
      
      { type: "image",
        src:     "images/Slide 3.png",
        width:   "800px",
        caption: "Fig. 1 - Block on a flat plane" },

        {type: "text",
          html: `<p>In general, the acceleration of a body can be represented by vector $\\mathbf{a}$, which has both magnitude and direction. 
          The magnitude and direction of this acceleration is related to the resultant force vector $\\mathbf{F}$ acting on the body</p>
          <p>$\\Sigma \\mathbf{F} = m \\mathbf{a}$</p>
          <p>In 2D, it is easiest to define a coordinate system (typically Cartesian) and split this equilibrium condition into individual equations in the $x$ and $y$ directions.`
        },

    ]
  },

  /*Slide 4*/
  {
    type:      "info",
    label:     "Newton's 3rd Law of Motion",
    title:     "Newton’s Laws of Motion​",

    blocks: [
      { type: "text",
        html: `<p> Next, consider the vertical forces. The weight force of the box, $W = m g$, is directed downwards. We know the box doesn’t sink into the ground. This is because the ground pushes back with a (normal force) reaction of $N$ upward. This is due to <strong>Newton’s 3rd Law</strong>, the law of action and reaction.</p>
            <p>Since the object is at rest, $a_y = 0$, it is said to be a <strong>static system</strong>. It is in static <strong>equilibrium</strong>.</p>
             
        ` },
        

      { type: "image",
        src:     "images/Slide 4.png",
        width:   "600px",
        caption: "Fig. 2" },

        {type: "text",
          html:`<p>By Newton's 2nd Law, <strong>therefore the resultant force must also be zero </strong>, and this <strong>equilibrium equation</strong> can be used to find the magnitude of the normal force $N$:</p>`
        },
        {type: "equation",
          latex: String.raw`\uparrow \Sigma F_y=0`
        },

    ]
  },

  /*Slide 5*/
  {
    type:      "info",
    label:     "Equations of Equilibrium",
    title:     "Equations of Equilibrium",

    blocks: [
      { type: "text",
        html: `<p>In structural engineering, we desire structures that are in static equilibrium. Therefore, there is <strong>no resultant force or moment acting on the structure</strong>:</p>`
      },
      {type: "equation",
      latex: String.raw`\Sigma \mathbf{F} = \mathbf{0}, \qquad\qquad \Sigma \mathbf{M} = \mathbf{0}`},
      {type: "text",
        html: `<p>In 2D, this gives us the <strong>three equations of equilibrium</strong>:</p>`
      },
      {type: "equation",
      latex: String.raw`\Sigma {F}_x = 0, \qquad\qquad \Sigma {F}_y = 0 \qquad\qquad \Sigma M_z = 0`},
       
    ]
  },

  /*Slide 6*/
  {
    type:  "cloze",
    label: "Equilibrium: Sliding​",
    title: "Equilibrium: Sliding​",

    intro: `<p>
            The box below has a weight of $W = 100\\ \\mathrm{N}$ and sits on a flat
            surface. The coefficient of static friction between the box and the surface is
            $&mu;_s=0.3\\ \\mathrm{N}$.</p> 
            <p>In the diagram below, $N$ represents the normal force, $F_{fr}$ is the friction force.
            </p>
            <p>
            <strong>We can use equations of equilibrium to find the magnitude of force
            $P$ required to cause sliding (overcome friction)</strong>.
            </p>
            <p>Select the correct equations of equilibrium to use in each step below, in order to find $P$.</p>`,

    text: `<p>If a box weighs $W=100$ N:</p>
           <p>(1) We can use [[$&uarr;&Sigma;F_y=0$]] ...to find <strong>N</strong></p>
           <p>Then, we can use $F_{fr}=&mu;_SN$</p>
           <p>(2) Then, we can use [[$&rarr;&Sigma;F_x=0$]] ...to find $P$</p>`,

    // Extra words that fit nowhere — students must discriminate
    distractors: ["$↺&Sigma;M=0$"],

    image:         "images/Slide 6.png",
    imagePosition: "right",           // or "below" to stack it under the text
    imageWidth:    "200px",

    explanation: `Correct!`
  },


  /*Slide 7*/
  {
    type:      "info",
    partStart: "Equilibrium of Bending Moments​",
    label:     "Bending Moments",
    title:     "Bending Moment: Line of Action & Lever Arm​",

    blocks: [
      { type: "text",
        html: `<p>Solving moment equilibrium always requires selecting a reference point. This point can be anywhere on (or off) the structure. 
        This is the point <strong>we take moments 'about'</strong>.</p>
        <p>For example, in the figure below, consider <strong>point $A$​</strong> as our reference point. The equation of equilibrium is then:</p>
        ` },

      {type: "equation",
        latex: String.raw`↺ \Sigma M_A=0`
      },

      { type: "image",
        src:     "images/Slide 7.png",
        width:   "800px",
        caption: "Fig. 3" },

        { type: "text",
        html: `<p>There is a fixed support at $A$, which can be represented by a moment reaction $M_A$, vertical force reaction $A_y$, and horizontal force reaction $A_x$, as shown below.</p>
        ` },

        { type: "image",
        src:     "images/Slide 8.png",
        width:   "600px",
        caption: "Fig. 4" },

    ]
  },

  /*Slide 9*/
  {
    type:      "info",
    label:     "Line of Action & Lever Arm​",
    title:     "Bending Moment: Line of Action & Lever Arm​",

    blocks: [
      { type: "text",
        html: `<p>All forces have a <strong><span style="color: #e97132;">line of action</span></strong>. The line of action of a is an infinite line extending along the direction of the vector.​</p>
               <p>The <strong>perpendicular distance from the reference point to the line of action of a force</strong> is called the <strong><span style="color: #196b24;">lever arm</span></strong>.</p>
               <p>The moment generated about the reference point is the magnitude of the force multiplied by its lever arm distance</p>
        ` },

      {type: "equation",
        latex: String.raw`M = P \times d`
      },

      {type: "text",
        html: `<p>In the figure below, the lines of actions for forces $A_x$ and $A_y$ pass through the reference point $A$. Therefore their lever arms are zero. 
        The lever arm for the applied force $P$ is $2\\ \\mathrm{m}$.</p>`
      },
      { type: "image",
        src:     "images/Slide 9.png",
        width:   "600px",
        caption: "Fig. 5" },


    ]
  },

  /*Slide 10*/
  {
    "type": "steps",
    "label": "Solve the Moment Reaction",
    "title": "Bending Moment Equilibrium",

    "image": "images/Slide 10.png",
    "imageWidth": "620px",
    "imagePosition": "below",

    "problem": "<p>For the beam from the previous slide, find the moment reaction at $A$ using equations of equilibrium.​</p><p>Thus:​</p><p>$↺&Sigma;M_A=0=M_A-(\\mathrm{Force} &times;\\text{lever arm})$</p>",
    "steps": [
      {
        "instruction": "In the above equation, what is the value that replaces $\\text{Force}$?",
        "unit": "Newtons",
        "answer": 1200,
        "tolerance": 0,
        "explanation": "Correct!"
      },
      {
        "instruction": "In the above equation, what is the value that replaces $\\text{lever arm}$?​",
        "unit": "metres",
        "answer": 2,
        "tolerance": 0,
        "explanation": "Correct!"
      },
      {
        "instruction": "Therefore, what is the value of the moment reaction $M_A$?​",
        "unit": "Newton metres",
        "answer": 2400,
        "tolerance": 0,
        "explanation": "Correct!"
      }
    ]
  },

  /*Slide 11*/
  {
    type:      "info",
    partStart: "Static Equilibrium - Overturning",
    label:     "Equilibrium: Overturning​",
    title:     "Equilibrium: Overturning​",

    blocks: [
      { type: "text",
        html: `<p>The ladder shown in the figure has a weight of $W$ acting through its centre of mass as shown. It is at rest when placed against contact points A and B. Then, a force $P$ is applied to disturb the ladder.</p>
               <p>Bending moments caused by these forces $W$ and $P$ can be categorised based on how they either <strong>cause or prevent </strong>overturning in the static system:</p>
               <p> A <strong>disturbing moment</strong> causes the object (the ladder) to potentially move, and a <strong>resisting moment</strong> would stop the system from moving by holding it in place.</p>
        ` },

      { type: "image",
        src:     "images/Slide 11.png",
        width:   "600px",
        caption: "Fig. 6" },

    ]
  },

  /*Slide 12*/
  {
    type:  "cloze",
    label: "Equilibrium: Overturning​",
    title: "Equilibrium: Overturning​",

    intro: `<p>
            This ladder has a self-weight $W$ that, when placed aginst contact points A and B, prevents it from moving. The force $P$ is disturbing it, potentially causing it to rotate about point A.</p>
            <p>Select the resultants below that would define the <strong>disturbing moment</strong> and the <strong>resisting moment</strong>.
            </p>`,

    text: `<p>(1) We can use [[$↻&Sigma;M_A$]] ...to find <strong>the disturbing moment.</strong></p>
           <p>(2) We can use [[$↺&Sigma;M_A$]] ...to find <strong>the resisting moment.</strong></p>\
           <p>If <strong>disturbing moment $=$ resisting moment</strong>, then system is in equilibrium.</p>
           <p>If <strong>disturbing moment $>$ resisting moment</strong>, then overturning will occur.</p>`,

    // Extra words that fit nowhere — students must discriminate
    distractors: ["$&uarr;&Sigma;F_y$" , "$&rarr;&Sigma;F_x$"],

    image:         "images/Slide 12.png",
    imagePosition: "right",           // or "below" to stack it under the text
    imageWidth:    "200px",

    explanation: `With point A as the reference, clockwise moments about this point disturb the ladder, rotating it away from contact with B.`
  },


  /*Slide 13*/
  {type:      "info",
    partStart: "Internal vs External Forces​",
    label:     "Sections of a Body​",
    title:     "Internal vs External Forces​",

    blocks: [
    { type: "text",
      html: `<p><strong>If a structure is in equilibrium, then any section of that structure is also in equilibrium</strong></p>`},
    {type: "text",
        html:`<p>When drawing a FBD, we could choose to isolate the entire body, which would show all external forces acting on it.<p>
      <p>However, we could also draw a FBD that considers <strong>only sections of some bodies</strong>. This sub-structure must also be in equilibrium. Therefore, at the <strong>sections (cuts)</strong>
      internal forces must exist that balance the system.</p>`
    },
    {type: "image",
      src:""
    },
    {type: "text",
      html: `<p>These internal actions have a physical meaning. They represent that ability of the material itself to resist applied loads. this could be resisting tension/compression, resisting shearing, resisting bending, or resisting torsion.</p>
      <p>When the rope in the above image is pulled, the material does not simply fall away from itself - the material possesses a resistance to the applied load, and this resistance increases as the load is increased. 
      Using <strong>equilibrium of sections</strong> allows us to measure these internal actions!</p>`
    }
    ],
  },
  {type: "info",
    label: "Types of Internal Actions",
    title: "Types of Internal Actions",

    blocks: [
      {type: "text",
        html: `<p>In 2D, consider a section which separates two parts of a body. The internal actions exposed reveal the ability of those two faces at the section to resist deforming relative to eachother.</p>
        <p>Loads could try to: pull/push these faces away/toward eachother, shear them relative to eachother, rotate them relative to eachother, or twist them relative to eachother.</p>`
      },

      {type: "image",
        src: "images/deformations.gif",
        width: "350px",
      },

      {type: "text",
        html: `<p>Resistance to each of these modes is described by a unique internal action. These are:</p>
        <ol><li>Axial Force, $N$</li>
        <li>Shear Force, $V$</li>
        <li>Bending Moment, $M$</li>
        <li>Torsion, $T$</li></ol>`
      },

      {type: "image",
        src: "images/internal-actions.png",
        width: "650px",
        caption: "RC Hibbeler, Mechanics of Materials (2017)"
      },

    ],
  },
  {type: "info",
    label: "Sign Convention",
    title: "Sign Convetion of Internal Actions",

    blocks: [
       {type: "columns",
        widths: [50, 50],
        columns: [
          [{type: "text",
          html: `<p>By Newton's 3rd law, at either side of a section the internal actions must be <strong>equal in magnitude</strong> and <strong>opposite in direction</strong>.</p>
          <ul><li>We assume a positive <strong>axial force</strong> $N$ is in tension, i.e. pointing away from the face</li>
          <li>We assume a positive <strong>shear force</strong> $V$ causes a segment to rotate clockwise</li>
          <li>We assume a positive <strong>bending moment</strong> $M$ causes a segment to bend concave up</li></ul>`},
        ],
          [{ type: "image",
        src:     "images/sign-convention.jpg",
        width:   "400px",
        caption: "Hibbeler, Pearson Education (2017)" },
      {type: "text",
          html: `<p>We can then solve for these using equations of equilibrium. The algebraic sign of their solution will determine the correct final direction.</p>`
        }],
        ]
      }
    ]
  },
  /* {
    type:      "info",
    label:     "Internal vs External Forces​",
    title:     "Internal vs External Forces​",

    blocks: [
    { type: "text",
      html: `<p>Consider a simple beam as shown below.​</p>
            
              <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  width: 100%;
                  text-align: left;
              ">
            
              <div>
                <img
                  src="images/Slide 13.png"
                  style="
                    width: 60%;
                    display: block;
                    margin: 0 auto;
                  "
                  alt="Slide 13"
                />

                <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  width: 100%;
                  text-align: center;
                ">
                  <div>
                    <p><strong><u>Net upwards force:</strong></u></p>
                    <p>$3$ kN $+$ $3$ kN $=6$ kN</p>
                  </div>
                  <div>
                    <p><strong><u>Net downwards force:</strong></u></p>
                    <p>$2$ kN/m $&times;$ $3$ m $=6$ kN</p>
                  </div>
                </div>
              </div>

            
            <div>
              <p>
                <ul>
                  <li>There is a total of $2$ kN/m $&times;$ $3$ m $= 6$ kN of downwards <strong><u>external force</u></strong>.
                  <li>There are two vertical support reactions at either end, thus they share this load equally and exert an upwards <strong><u>external force</u></strong> back as a <strong><u>reaction</u></strong>.
                </ul>
              </p>
            </div>
      ` },

    ]
  },

  /*Slide 14
  {
    type:      "info",
    label:     "Internal vs External Forces​",
    title:     "Internal vs External Forces​",

    blocks: [
    { type: "text",
      html: `<p>If a structure is in equilibrium, then all sections of that structure is also in equilibrium. So, what happens if we cut a section of the beam?​​</p>
            
              <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  width: 100%;
                  text-align: left;
              ">
            
              <div>
                <img
                  src="images/Slide 14.png"
                  style="
                    width: 45%;
                    display: block;
                    margin: 0 auto;
                  "
                  alt="Slide 14"
                />

                <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  width: 100%;
                  text-align: center;
                ">
                <div>
                  <p><strong><u>Net upwards force:</strong></u></p>
                  <p>$3$ kN $=$ $3$ kN</p>
                </div>
                <div>
                  <p><strong><u>Net downwards force:</strong></u></p>
                  <p>$2$ kN/m $&times;$ $x$ $=2x$ kN</p>
                </div>
                </div>
              </div>

            
            <div>
              <p>
                <ul>
                  <li>Now there is more upwards force then downwards force. However, both the left-hand side and the right-hand side of this section must individually also be in equilibrium​
                  <li>For this system to remain in equilibrium (not move)…​
                </ul>
              </p>
            </div>
      ` },

    ]
  },

  /*Slide 15
  {
    type:      "info",
    label:     "Internal vs External Forces​",
    title:     "Internal vs External Forces​",

    blocks: [
    { type: "text",
      html: `<p>If a structure is in equilibrium, then all sections of that structure is also in equilibrium. So, what happens if we cut a section of the beam?​​</p>
            
              <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  width: 100%;
                  text-align: left;
              ">
            
              <div>
                <img
                  src="images/Slide 15.png"
                  style="
                    width: 60%;
                    display: block;
                    margin: 0 auto;
                  "
                  alt="Slide 15"
                />

                <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  width: 100%;
                  text-align: center;
                ">
                  <div>
                    <p><strong><u>Net upwards force:</strong></u></p>
                    <p>$3$ kN $=$ $3$ kN</p>
                  </div>
                  <div>
                    <p><strong><u>Net downwards force:</strong></u></p>
                    <p>$2$ kN/m $&times;$ $x$ $=2x$ kN</p>
                  </div>
                </div>
              </div>

            
            <div>
              <p>
                <ul>
                  <li>Now there is more upwards force then downwards force. However, both the left-hand side and the right-hand side of this section must individually also be in equilibrium​
                  <li>For this system to remain in equilibrium (not move)…​ There needs to be <strong><u>internal forces</strong></u> from the beam.
                  <li>In this case there's <strong><u>internal shear</strong></u> $V_{(x)}$ and <strong><u>internal moment</strong></u> $M_{(x)}$.
                </ul>
              </p>
            </div>
      ` },

    ]
  },
 */

  /*Slide 16*/
  /* {
    type:      "info",
    label:     "Internal vs External Forces​",
    title:     "Internal vs External Forces​",

    blocks: [
    { type: "text",
      html: `<p>Now, consider a simple hanger rod.​​​</p>
            
            <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  width: 100%;
                  text-align: left;
            ">

            <div>
            <img
              src="images/Slide 16.png"
              style="
                width: 35%;
                display: block;
                margin: 0 auto;
              "
              alt="Slide 16"
            />
            </div>

            <div>
            <p>
              <ul>
                <li>There is a total of <span style="color: red;"><strong>$5$ kN</strong></span> downwards <strong><u>external force</strong></u>.
                <li>At the fixed end, there is an upwards <strong><u>external force</strong></u> back as a <strong><u>reaction</strong></u>.
              </ul>
            </p>
            </div>
      ` },

    ]
  }, */

  /*Slide 17*/
  {
    type:  "mcq",
    label: "Internal vs External Forces​",
    title: "Internal vs External Forces​",

    questions: [
      {
        question: `<p>Consider we have a rod hanging from the ceiling, and a $5\\ \\mathrm{kN}$ load is applied at the tip. The reaction force is therefore $5\\ \\mathrm{kN}$ acting upwards.</p>
        <p>What happens if we cut a section of the hanger?​​</p>
                  <p>Now we've exposed the <strong><u>internal axial force</strong></u> $N_{(x)}$.</p>
                  <p>If we ignore self-weight, the internal force at any location $x$ along the rod is constant $5$ kN of:`,
        
        image: "images/mcq-rod.png",

        options: [
      { text: "Tension", correct: true},
      { text: "Compression"},
        ],
        explanation: `Correct!`
      },
    ]
  },

  /*Slide 18*/
  /* {
    type:      "info",
    label:     "Summary of Internal Forces​",
    title:     "Internal Forces (Summary)​",

    blocks: [
    { type: "text",
      html: `<p>As could be seen in the previous two examples, <strong><u>internal forces</strong></u> are
            actions that arise to resist load that prevent a material from being
            pulled apart, from shearing, or from resisting bending, see <strong>Figure 7.</strong>
            They follow a sign convention as shown in <strong>Figure 8.</strong>​​​​</p>
      ` },

    { type: "image",
        src:     "images/Slide 18 - 1.png",
        width:   "600px",
        caption: "Fig. 7" },

    { type: "image",
        src:     "images/Slide 18 - 2.png",
        width:   "900px",
        caption: "Fig. 8" },

    ]
  },
 */
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