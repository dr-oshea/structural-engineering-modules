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

  /*MISSING*/
  {
    type:  "context",
    label: "Context/Motivation",
    title: "Why do we use Equilibrium?​",
    text:  `<p>
            Isaac Newton’s laws of motion provide the basis of modern physics and engineering. The laws are stated as follows:​
            <ol>
              <li>An object at rest remains at rest, and an object in motion remains in motion at constant speed and in a straight line unless acted on by an unbalanced force.​
              <li>The acceleration of an object depends on the mass of the object and the amount of force applied.​
              <li> Whenever one object exerts a force on another object, the second object exerts an equal and opposite on the first.
            </ol>
            <p>…But they can be simplified for the purposes of practical application (next slide).​
            </p>`,
  },

  /*PART 1*/
  /*Slide 2*/
  {
    type:      "info",
    partStart: "Newton’s Laws of Motion​",
    label:     "Introduction to Newton's Laws of Motion",
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
            <p>…But they can be simplified for the purposes of practical application (next slide).​
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
    label:     "Newton's Second Law of Motion",
    title:     "Newton’s Laws of Motion​",

    blocks: [
      { type: "text",
        html: `<p> It is easiest to first understand <strong><u>Newton’s 2nd Law,</strong></u> the law of force and acceleration. Imagine a box of mass $m$ that is <strong><u>moving.</strong></u> If it is accelerating horizontally at acceleration $a$, the net force associated with this motion is $F$.</p>
            <p>You can think of $m$ as an object’s resistance to acceleration (change of velocity) when a net force is applied.</p>
            <p>$$+&rarr;&Sigma;F_x=ma$$</p>
        ` },
      
      { type: "image",
        src:     "images/Slide 3.png",
        width:   "600px",
        caption: "Fig. 1" },

    ]
  },

  /*Slide 4*/
  {
    type:      "info",
    label:     "Newton's Third Law of Motion",
    title:     "Newton’s Laws of Motion​",

    blocks: [
      { type: "text",
        html: `<p> Next, let’s consider the vertical forces. The weight force of the box, $W=mg$, is directed downwards. We know the box doesn’t sink into the ground. This is because the ground pushes back with a (normal force) reaction of $N$ upward. This is due to <strong><u>Newton’s 3rd Law</strong></u>, the law of action and reaction.</p>
            <p>Since the system’s vertical forces are balanced such that it is not moving - it is said to be a <strong><u>static system</strong></u>, in other words, it is in <strong><u>equilibrium</strong></u>. This is the basis of <strong><u>Newton’s 2nd Law</strong></u>, the law of inertia.</p>
            <p>$$+&uarr;&Sigma;F_y=0$$</p>
        ` },

      { type: "image",
        src:     "images/Slide 4.png",
        width:   "600px",
        caption: "Fig. 2" },

    ]
  },

  /*Slide 5*/
  {
    type:      "info",
    label:     "Summary of Newton’s Laws of Motion​",
    title:     "Newton’s Laws of Motion​",

    blocks: [
      { type: "text",
        html: `<p>As a quick summary, the three laws are…</p>
            <p>
              <ol>
                <li>Law of Inertia (Equations of Equilibrium)​

                <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  width: 100%;
                  margin-top: 10px;
                  margin-bottom: 10px;
                  text-align: center;
                ">
                <div>
                  <p>$+&uarr;&Sigma;F_y=0$</p>
                </div>
                <div>
                  <p>$+&rarr;&Sigma;F_x=0$</p>
                </div>
                <div>
                  <p>$+↺&Sigma;M=0$</p>
                </div>

                <li>Law of Force & Acceleration (Equations of Motion)​

                <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  width: 100%;
                  margin-top: 10px;
                  margin-bottom: 10px;
                  text-align: center;
                ">
                <div>
                  <p>$+&uarr;&Sigma;F_y=ma$</p>
                </div>
                <div>
                  <p>$+&rarr;&Sigma;F_x=ma$</p>
                </div>
                <div>
                  <p>$+↺&Sigma;M=I&alpha;$</p>
                </div>

                <li>Law of Action & Reaction &rarr; Support Reactions​
              </ol>
            </p>
            <p>$$+&uarr;&Sigma;F_y=0$$</p>
        ` },

    ]
  },

  /*Slide 6*/
  {
    type:  "cloze",
    partStart: "Static Equilibrium - Sliding",
    label: "Equilibrium: Sliding​",
    title: "Equilibrium: Sliding​",

    intro: `<p>
            The box below has a weight of $W = 100$ N and sits on a flat
            surface. The coefficient of static friction between the box and the surface is
            $&mu;_s=0.3$ N. $N$ represents the
            normal force, $F_{fr}$ is the friction force.
            </p>
            <p>
            We can use equations of equilibrium to find the magnitude of force
            $P$ to cause sliding.
            </p>`,

    text: `<p>If a box weighs $W=100$ N:</p>
           <p>(1) We can use [[$+&uarr;&Sigma;F_y=0$]] ...to find <strong>N</strong></p>
           <p>Then, we can use $F_{fr}=&mu;_SN$</p>
           <p>(2) Then, we can use [[$+&rarr;&Sigma;F_x=0$]] ...to find $P$</p>`,

    // Extra words that fit nowhere — students must discriminate
    distractors: ["$+↺&Sigma;M=0$"],

    image:         "images/Slide 6.png",
    imagePosition: "right",           // or "below" to stack it under the text
    imageWidth:    "200px",

    explanation: `Correct!`
  },


  /*Slide 7*/
  {
    type:      "info",
    partStart: "Bending Moment: Line of Action & Lever Arm​",
    label:     "Bending Moment: Line of Action & Lever Arm​",
    title:     "Bending Moment: Line of Action & Lever Arm​",

    blocks: [
      { type: "text",
        html: `<p>Moment equilibrium always requires a reference point. For example, <strong>point A​</strong></p>
               <p>$$+↺&Sigma;M_A=0$$</p>
        ` },

      { type: "image",
        src:     "images/Slide 7.png",
        width:   "800px",
        caption: "Fig. 3" },

    ]
  },

  /*Slide 8*/
  {
    type:      "info",
    label:     "Bending Moment: Line of Action & Lever Arm​",
    title:     "Bending Moment: Line of Action & Lever Arm​",

    blocks: [
      { type: "text",
        html: `<p>From here, we consider the forces and moments in the system…​</p>
               <p>$$+↺&Sigma;M_A=0$$</p>
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
    label:     "Bending Moment: Line of Action & Lever Arm​",
    title:     "Bending Moment: Line of Action & Lever Arm​",

    blocks: [
      { type: "text",
        html: `<p>The <strong><span style="color: #e97132;">line of action</span></strong> of a force is a line extending infinitely along the direction of the vector.​</p>
               <p>Now consider the perpendicular distance from point A to each <strong><span style="color: #e97132;">lines of action</span></strong>,​ these are the <strong><span style="color: #196b24;">“lever arms”</span></strong>. Here, there’s only one non-zero lever arm.</p>
               <p>$$+↺&Sigma;M_A=0$$</p>
        ` },

      { type: "image",
        src:     "images/Slide 9.png",
        width:   "600px",
        caption: "Fig. 5" },

    ]
  },

  /*Slide 10*/
  {
    "type": "steps",
    "label": "Bending Moment: Line of Action & Lever Arm​",
    "title": "Bending Moment: Line of Action & Lever Arm​",

    "image": "images/Slide 10.png",
    "imageWidth": "620px",
    "imagePosition": "below",

    "problem": "<p>Let’s hide the support reaction forces with zero lever arm distance.​</p><p>Thus:​</p><p>$+↺&Sigma;M_A=0=M_A-X&times;Y$</p><p>$M_A=$ $?$</p>",
    "steps": [
      {
        "instruction": "What is the value best replaces $X$?",
        "unit": "Newtons",
        "answer": 1200,
        "tolerance": 0,
        "explanation": "Correct!"
      },
      {
        "instruction": "What is the value best replaces $Y$?​",
        "unit": "metres",
        "answer": 2,
        "tolerance": 0,
        "explanation": "Correct!"
      },
      {
        "instruction": "What is $M_A$?​",
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
        html: `<p>The ladder shown in the figure has a weight of <span style="color: red;"><strong>$W$</strong></span> acting through its centre of mass as shown. It is at rest when placed against contact points A and B. Then, a force $P$ is applied to disturb the ladder.</p>
               <p>Bending moments caused by these forces can be defined based on how they cause or prevent overturning in the static system.</p>
               <p> A <strong><u>disturbing moment</u></strong> causes the object (the ladder) to potentially move, and a <strong><u>resisting moment</u></strong> would stop the system from moving by holding it in place.</p>
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
            This ladder has a self-weight $W$ stopping it from moving and force $P$ is disturbing it.
            </p>`,

    text: `<p>(1) We can use [[$↻&Sigma;M_A$]] ...to find <strong><u>the disturbing moment.</strong></u></p>
           <p>(1) We can use [[$↺&Sigma;M_A$]] ...to find <strong><u>the resisting moment.</strong></u></p>\
           <p>If <strong><u>disturbing moment $=$ resisting moment</strong></u> are equal, the system is in equilibrium.</p>`,

    // Extra words that fit nowhere — students must discriminate
    distractors: ["$+&uarr;&Sigma;F_y=0$" , "$+&rarr;&Sigma;F_x=0$"],

    image:         "images/Slide 12.png",
    imagePosition: "right",           // or "below" to stack it under the text
    imageWidth:    "200px",

    explanation: `Loads travel from the sheeting, through the purlins, into
                  the truss joints — which is why external forces arrive at
                  the joints and the members carry only axial force.`
  },

  /*Slide 13*/
  {
    type:      "info",
    partStart: "Internal vs External Forces​",
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

  /*Slide 14*/
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

  /*Slide 15*/
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

  /*Slide 16*/
  {
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
  },

  /*Slide 17*/
  {
    type:  "mcq",
    label: "Internal vs External Forces​",
    title: "Internal vs External Forces​",

    questions: [
      {
        question: `<p>What happens if we cut a section of the hanger?​​</p>
                  <p>Now we've exposed the <strong><u>internal axial force</strong></u> $N_{(x)}$.</p>
                  <p>If we ignore self-weight, there is a constant $5$ kN of:`,
        
        image: "images/Slide 17.png",

        options: [
      { text: "Tension", correct: true},
      { text: "Compression"},
        ],
        explanation: `Correct!`
      },
    ]
  },

  /*Slide 18*/
  {
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