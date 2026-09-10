// Optional module metadata — used by the final slide's save payload
const moduleMeta = {
  id: "module-07-internal-hinges"
};

const moduleData = [

  /*Slide 1*/
  {
    type:       "splash",
    label:      "Home page",
    title:      "Solving Problems with Internal Hinges​",
    subtitle:   "Interactive Revision Modules for structural engineering",
    buttonText: "Start Module"
    // The contents list is generated automatically from the partStart
    // fields below — nothing to maintain here.
  },

  /*MISSING*/
  {
    type:  "context",
    label: "Context/Motivation",
    title: "What to do with internal hinges",
    image: "images/internal_hinge_force_animation.svg",
    text:  `<p>
            When an internal hinge is present, the structure can often be separated into simpler free-body diagrams. This module examines how hinges transmit forces, what information they provide, and how they can be used to solve otherwise difficult equilibrium problems.
            </p>`
  },

  /*PART 1*/
  /*Slide 2*/
  {
    type:      "info",
    partStart: "Review of Static Determinacy​",
    label:     "Static Determinacy​",
    title:     "Review of Static Determinacy​",

    blocks: [
      { type: "text",
        html: `<p>We solve for any unkown internal and external forces acting on our structure using equations of equilibrium. Equilibrium provides us with a finite number of equations that can be used.
        Therefore, it is important to compare the number of unknowns to be solvd with the number of equations available to us</p>
        <p>This is called the <strong>static determinancy</strong> of the structure. </p>
        <p>Whether a structure is unstable (will fall over), statically determinant (stable and solvable using only equilibrium equations) 
        or statically indeterminant (stable but unsolvable using equilibrium equations) depends on the following expressions:​</p>`
      },
      {type: "columns", widths: [50, 50], columns: [
        [{type: "text",
      html: `<p><strong>Beams and frames:</strong></p>
            <p>$D=r+3m-3j-c$</p>
            <p><strong>For Trusses:</strong></p>
            <p>$D=r+m-2j$</p>`
            },],
        [{type: "test",
          html:`<p>Where:</p>
        <p>$D=$ degree of indeterminacy</p>
        <p>$r=$ Number of reactions</p>
        <p>$m=$ Number of members</p>
        <p>$j=$ Number of <u>joints</u></p>
        <p>$c=$ Number of releases introduced from internal hinges</p>`}
        ]
      ]},
      
      {type: "text",
        html:`<p>The value of $D$ provies the determinacy of the structure (relates number of knowns to unknowns)</p>
        <p>$D<0&rarr;$ <strong>Unstable</strong></p>
            <p>$D=0&rarr;$ <strong>Stable, Determinant</strong></p>
            <p>$D>0&rarr;$ <strong>Stable, Indeterminant</strong></p>`
      }
    ]
  },

  /*Slide 3*/
  {
    "type": "steps",
    "label": "Example 1​",
    "title": "Quiz 1 - Static Determinacy​",

    "image": "images/Slide 3.png",
    "imageWidth": "620px",
    "imagePosition": "below",

    "problem": "<p><strong>What is the degree of indeterminacy for the beam shown below?​</strong></p><p>Enter a number for each variable in the beams and frames equation below:</p><p>$D=r+3m-3j-c$</p>",
    "steps": [
      {
        "instruction": "What is the value of $r$ (number of unknown reactions)?​",
        "unit": "",
        "answer": 5,
        "tolerance": 0,
        "explanation": "Correct! There are 5 unknown reactions."
      },
      {
        "instruction": "What is the value of $m$?​ (number of members)",
        "unit": "",
        "answer": 3,
        "tolerance": 0,
        "explanation": "Correct! There are 3 members. The coefficient of 3 in the determinacy equation is because there are three unknown internal actions (axial, shear, bending) for each beam member)"
      },
      {
        "instruction": "What is the value of $j$? (number of joints)​",
        "unit": "",
        "answer": 4,
        "tolerance": 0,
        "explanation": "Correct! There are 4 joints."
      },
      {
        "instruction": "What is the value of $c$?​ (number of hinges)",
        "unit": "",
        "answer": 0,
        "tolerance": 0,
        "explanation": "Correct! There are no internal hinges."
      },
      {
        "instruction": "Therefore, what is the value of $D$?​",
        "unit": "",
        "answer": 2,
        "tolerance": 0,
        "explanation": "Correct! Since $D>0$, the beam is Stable, Indeterminate."
      }
    ]
  },

  /*Slide 4*/
  {
    "type": "steps",
    "label": "Example 2​",
    "title": "Quiz 1 - Static Determinacy​",

    "image": "images/Slide 4.png",
    "imageWidth": "620px",
    "imagePosition": "below",

    "problem": "<p><strong>What if an internal hinge is introduced? What is the degree of indeterminacy?​​</strong></p><p>Enter a number for each variable in the beams and frames equation below:</p><p>$D=r+3m-3j-c$</p>",
    "steps": [
      {
        "instruction": "What is the value of $r$?​",
        "unit": "",
        "answer": 5,
        "tolerance": 0,
        "explanation": "Correct! There are 5 unknown reactions."
      },
      {
        "instruction": "What is the value of $m$?​",
        "unit": "",
        "answer": 3,
        "tolerance": 0,
        "explanation": "Correct! There are 3 members."
      },
      {
        "instruction": "What is the value of $j$?​",
        "unit": "",
        "answer": 4,
        "tolerance": 0,
        "explanation": "Correct! There are 4 joints."
      },
      {
        "instruction": "What is the value of $c$?​",
        "unit": "",
        "answer": 1,
        "tolerance": 0,
        "explanation": "Correct! There is 1 internal hinge."
      },
      {
        "instruction": "Therefore, what is the value of $D$?​",
        "unit": "",
        "answer": 1,
        "tolerance": 0,
        "explanation": "Correct! Since $D>0$, the beam is Stable, Indeterminate."
      }
    ]
  },

  /*Slide 5*/
  {
    "type": "steps",
    "label": "Example 3​",
    "title": "Quiz 1 - Static Determinacy​",

    "image": "images/Slide 5.png",
    "imageWidth": "620px",
    "imagePosition": "above",

    "problem": "<p><strong>What is the degree of indeterminacy of this Warren truss?​​M/strong></p><p>Enter a number for each variable in the truss determinacy equation below:</p><p>$D=r+m-2j$</p>",
    "steps": [
      {
        "instruction": "What is the value of $r$?​",
        "unit": "",
        "answer": 3,
        "tolerance": 0,
        "explanation": "Correct! There are 3 unknown reactions."
      },
      {
        "instruction": "What is the value of $m$?​",
        "unit": "",
        "answer": 11,
        "tolerance": 0,
        "explanation": "Correct! There are 11 members."
      },
      {
        "instruction": "What is the value of $j$?​",
        "unit": "",
        "answer": 7,
        "tolerance": 0,
        "explanation": "Correct! There are 7 joints."
      },
      {
        "instruction": "Therefore, what is the value of $D$?​",
        "unit": "",
        "answer": 0,
        "tolerance": 0,
        "explanation": "Correct! Since $D=0$, the truss is Stable, Determinate."
      }
    ]
  },

  /*Part 2*/

  {
    type: "info",
    partStart: "What is an internal hinge?",
    label: "Internal hinges",
    title: "What is an internal hinge?",

    blocks: [
      {type: "text",
        html:`An internal hinge is a connection between two beam members that allows rotation at the joint. The relative position of the two connecting members is of interest.</p>
        <p>Though the joint itself can move in space, the two members cannot translate horizontally or vertically away from eachother. At the hinge, each member must push/pull the other to remain connected.</p>
        <p>However, the orientation of each member can change relative to the other freely at the hinge. There is no moment preventing this change in orientation</p>`
      },
      {type: "image",
        src: "images/internal_hinge_force_animation.svg",
        width: "450px",
      },
      {type: "text",
        html: `<p>We can 'detach' the structure at the hinge and see the reaction forces each member applies to the other to keep them connected.</p>
        <p>By Newton's 3rd law, these <strong>pairs of forces must be equal in magnitude and opposite in direction</strong>.</p> `
      }
    ]
  },
  /* Part 3 8?
  /*Slide 6*/
  {
    type:      "info",
    partStart: "Reactions of Frames with an Internal Hinge​",
    label:     "Reactions of Frames with an Internal Hinge​",
    title:     "Reactions of Frames with an Internal Hinge​",

    blocks: [
      { type: "text",
        html:`<p>Consider the following frame, the <strong><span style="color: #7030a0;">reactions</span></strong> and their <strong><span style="color: #e97132;">lines of action</span></strong> are shown.</p>
              <p>There is an <strong><span style="color: #4ea72e;">internal hinge</span></strong> at C.​</p>
          ` },
      
      { type: "image",
        src:     "images/Slide 6.png",
        width:   "600px",
        caption: "Fig. 1" },

        { type: "text",
        html: `<p>We can split up this frame into two separate FBD’s based on the <strong><span style="color: #4ea72e;">internal hinge</span></strong>. Notice how the <strong><span style="color: #4ea72e;">internal hinge</span></strong> has <u>equal but opposite</u> reactions between the two FBD’s?​</p>`},

        { type: "image",
        src:     "images/LH-RH.png",
        width:   "600px",
        },
        
        
    ]
  },

  /*Slide 7*/
  /* {
    type:      "info",
    label:     "Reactions of Frames with an Internal Hinge​",
    title:     "Reactions of Frames with an Internal Hinge​",

    blocks: [
      { type: "text",
        html:`<p>There are 4 <strong><span style="color: #7030a0;">reactions</span></strong>. Notice how there is no location to take the moment equilibrium such that only 1 <strong><span style="color: #7030a0;">reaction</span></strong> is isolated (with non-zero lever arm)?​</p>
          ` },
      
      { type: "image",
        src:     "images/Slide 7.png",
        width:   "600px",
        caption: "Fig. 2" },
    ]
  },
 */
  /*Slide 8*/
 

  /*Slide 9-11*/
  {
    type:  "mcq",
    label: "Example: Reactions at Hinge",
    title: "Worked Example – Support Reactions​",

    questions: [
      {
        question: `<p>Focusing on the left-hand side FBD first… Which location should we take the moment equilibrium?​</p>
        <p>We wish to solve the reactions at $C$</p>`,
        image: "images/Slide 9.png",
        imageWidth: "400px",
        options: [
          { text: "$$↻&Sigma;M_A=0$$... to get an expression in $C_x$ and $C_y$", correct: true },
          { text: "$$↻&Sigma;M_C=0$$... to get an expression in $A_x$ and $A_y$" }
        ],
        explanation: `<p>$↻&Sigma;M_A=0=-600(0.75)-C_y(1.5\\cos60)+C_x(1.5\\sin60)$</p>
                      <p>Solve for $C_x$ in terms of $C_y$</p>
                      <p>$C_x=\\frac{450+1.5\\cos60C_y}{1.5\\sin60}$   ----  Eqn. (1)</p>`
      },
      {
        question: `<p>We have one expression relating $C_x$ and $C_y$</p>
        <p>Now, focusing on the right-hand side FBD… Which location should we take the moment equilibrium?​</p>
        <p>We wish to solve the reactions at $C$</p>`,
        image: "images/Slide 10.png",
        imageWidth: "400px",
        options: [
          { text: "$$↻&Sigma;M_B=0$$... to get an expression in $C_x$ and $C_y$", correct: true },
          { text: "$$↻&Sigma;M_C=0$$... to get an expression in $B_x$ and $B_y$" }
        ],
        explanation: `<p>$↻&Sigma;M_B=0=-C_x(1)-C_y(1)+500(1)$</p>
                      <p>Solve for $C_x$ in terms of $C_y$</p>
                      <p>$C_x=-C_y+500$  ----    Eqn. (2)`
      },
      {
        question: `<p>From the LHS and RHS of $C$, we determined the following equation:s​​</p>
                   <p>$C_x=\\frac{450+1.5\\cos60C_y}{1.5\\sin60}, \\qquad C_x=-C_y+500$ </p>
                   <p>These can now be solved for the reactions at the hinge.</p>`,
        image: "images/LH-RH.png",
        imageWidth: "600px",
        options: [
          { text: "$C_y=97.4$ N;$\\\\$ $C_x=402.6$ N", correct: true },
          { text: "$C_y=202.6$ N;$\\\\$ $C_x=107.4$ N" },
          { text: "$C_y=304.7$ N;$\\\\$ $C_x=117.4$ N" }
        ],
        explanation: `Correct!`
      },
    ]
  },

  /*Slide 12*/
  {
    type:  "cloze",
    label: "Example – Reactions at Supports",
    title: "Worked Example – Support Reactions",

    intro: `<p>In the previous page, we solved the unknown reactions at the internal hinge.</p>
            <p>Now the remainder of the reaction are able to be solved:</p>
            <p>Match the correct reactions into the lines of working out:</p>`,

    text: `<p>$\\uparrow+\\Sigma F_y=0=A_y-97.4-600\\sin30$</p>
           <p>$A_y=$[[$397.4$ N]]</p>
           <p>$\\rightarrow+\\Sigma F_x=0=A_x-402.6+600\\cos30$</p>
           <p>$A_x=$[[$-117$ N]]</p>
           <p>$\\uparrow+\\Sigma F_y=0=B_y+97.4$</p>
           <p>$B_y=$[[$-97.4$ N]]</p>
           <p>$\\rightarrow+\\Sigma F_x=0=B_x+402.6-500$</p>
           <p>$B_x=$[[$97.4$ N]]</p>`,

    image:         "images/Slide 12.png",
    imagePosition: "right",           // or "below" to stack it under the text
    imageWidth:    "250px",

    explanation: `Correct!`
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