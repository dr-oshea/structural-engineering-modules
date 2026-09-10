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
    title: "MISSING",
    image: "images/your-motivating-image.jpg",
    text:  `<p>
            A truss is a system of members that carries load into the supports. Plane trusses are 2D truss structures commonly used in roofs and bridges as shown below:
            </p>`
  },

  /*PART 1*/
  /*Slide 2*/
  {
    type:      "info",
    partStart: "Review of Static Determinacy​",
    label:     "Review of Static Determinacy​",
    title:     "Review of Static Determinacy​",

    blocks: [
      { type: "text",
        html: `<p>Whether a structure is unstable (will fall over), statically determinant (stable and solvable using only equilibrium equations) or statically indeterminant (stable but unsolvable using equilibrium equations) depends on the following expressions:​</p>
        
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        ">
          <div>
            <p><strong><u>Beams and frames:</u></strong></p>
            <p>$D=r+3m-3j-c$</p>
            <p><strong><u>For Trusses:</u></strong></p>
            <p>$D=r+m-2j$</p>
          </div>

          <div>
            <p>$D<0&rarr;$ Unstable</p>
            <p>$D=0&rarr;$ Stable, Determinant</p>
            <p>$D>0&rarr;$ Stable, Indeterminant</p>
          </div>
        </div>

        <p><u>Where:</u></p>
        <p>$D=$ degree of indeterminacy</p>
        <p>$r=$ Number of reactions</p>
        <p>$m=$ Number of members</p>
        <p>$j=$ Number of <u>joints</u></p>
        <p>$c=$ Number of releases introduced from internal hinges</p>
      `},
    ]
  },

  /*Slide 3*/
  {
    "type": "steps",
    "label": "Review of Static Determinacy​",
    "title": "Quiz 1 - Static Determinacy​",

    "image": "images/Slide 3.png",
    "imageWidth": "620px",
    "imagePosition": "above",

    "problem": "<p>What is the degree of indeterminacy for this beam?​</p><p>Enter a number for each variable in the beams and frames equation below:</p><p>$D=r+3m-3j-c$</p>",
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
    "label": "Review of Static Determinacy​",
    "title": "Quiz 1 - Static Determinacy​",

    "image": "images/Slide 4.png",
    "imageWidth": "620px",
    "imagePosition": "above",

    "problem": "<p>What if an internal hinge is introduced? What is the degree of indeterminacy?​​</p><p>Enter a number for each variable in the beams and frames equation below:</p><p>$D=r+3m-3j-c$</p>",
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
    "label": "Review of Static Determinacy​",
    "title": "Quiz 1 - Static Determinacy​",

    "image": "images/Slide 5.png",
    "imageWidth": "620px",
    "imagePosition": "above",

    "problem": "<p>What is the degree of indeterminacy of this Warren truss?​​</p><p>Enter a number for each variable in the truss equation below:</p><p>$D=r+m-2j$</p>",
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
  /*Slide 6*/
  {
    type:      "info",
    partStart: "Reactions of Frames with an Internal Hinge​",
    label:     "Reactions of Frames with an Internal Hinge​",
    title:     "Reactions of Frames with an Internal Hinge​",

    blocks: [
      { type: "text",
        html:`<p>Consider the following frame, the <strong><span style="color: #7030a0;">reactions</span></strong> and their <strong><span style="color: #e97132;">lines of action</span></strong> are overlayed.</p>
              <p>There is an <strong><span style="color: #4ea72e;">internal hinge</span></strong> at C.​</p>
          ` },
      
      { type: "image",
        src:     "images/Slide 6.png",
        width:   "600px",
        caption: "Fig. 1" },
    ]
  },

  /*Slide 7*/
  {
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

  /*Slide 8*/
  {
    type:      "info",
    label:     "Reactions of Frames with an Internal Hinge​",
    title:     "Reactions of Frames with an Internal Hinge​",

    blocks: [
      { type: "text",
        html: `<p>We can split up this frame into two separate FBD’s based on the <strong><span style="color: #4ea72e;">internal hinge</span></strong>. Notice how the <strong><span style="color: #4ea72e;">internal hinge</span></strong> has <u>equal but opposite</u> reactions between the two FBD’s?​</p>
        
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        ">
          <div>
            <img
              src="images/Slide 8 - 1.png" 
              style="width: 80%;"
              alt="Left-hand side"
            />
          </div>

          <div>
            <img
              src="images/Slide 8 - 2.png" 
              style="width: 100%;"
              alt="Right-hand side"
            />
          </div>

        </div>
        
        ` },
    ]
  },

  /*Slide 9-11*/
  {
    type:  "mcq",
    label: "Quiz 2 – Support Reactions​",
    title: "Quiz 2 – Support Reactions​",

    questions: [
      {
        question: `<p>Focusing on the left-hand side FBD first… Which location should we take the moment equilibrium?​</p>`,
        image: "images/Slide 9.png",
        imageWidth: "400px",
        options: [
          { text: "$$+↻&Sigma;M_A=0$$... to get an expression for $C_x$ and $C_y$", correct: true },
          { text: "$$+↻&Sigma;M_C=0$$... to get an expression for $A_x$ and $A_y$" }
        ],
        explanation: `$+↻&Sigma;M_A=0=-600(0.75)-C_y(1.5\\cos60)+C_x(1.5\\sin60)\\\\$
                      Solve for $C_x:\\\\$
                      $C_x=\\frac{450+1.5\\cos60C_y}{1.5\\sin60}$ Eqn. (1)`
      },
      {
        question: `<p>Now, focusing on the right-hand side FBD…​ Which location should we take the moment equilibrium?​</p>`,
        image: "images/Slide 10.png",
        imageWidth: "400px",
        options: [
          { text: "$$+↻&Sigma;M_B=0$$... to get an expression for $C_x$ and $C_y$", correct: true },
          { text: "$$+↻&Sigma;M_C=0$$... to get an expression for $B_x$ and $B_y$" }
        ],
        explanation: `$+↻&Sigma;M_B=0=-C_x(1)-C_y(1)+500(1)\\\\$
                      Solve for $C_x:\\\\$
                      $C_x=-C_y+500$ Eqn. (2)`
      },
      {
        question: `<p>From the LHS of C, we determined the following equation:​​</p>
                   <p>$C_x=\\frac{450+1.5\\cos60C_y}{1.5\\sin60}$ Eqn. (1)</p>
                   <p>From the RHS of C, we determined the following equation:</p>
                   <p>$C_x=-C_y+500$ Eqn. (2)</p>
                   <p>By equating Eqn. (1) and (2) we can solve for $C_x$ and $C_y$</p>
                   <p>What are the values of these hinge equations?</p>`,
        image: "images/Slide 11.png",
        imageWidth: "400px",
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
    label: "Quiz 2 – Support Reactions",
    title: "Quiz 2 – Support Reactions",

    intro: `<p>In the previous step, we solved the unknown reactions at the internal hinge.</p>
            <p>Now the remainder of the reaction can be solved:</p>
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
    imageWidth:    "200px",

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