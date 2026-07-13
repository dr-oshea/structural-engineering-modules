/* ============================================================================
   types/reveal.js — a prompt with a "Show solution" toggle (no input needed).
   Good for "have a go on paper, then check the method".

   Config fields:
     title        Heading
     image        Optional figure above the prompt (imageWidth to size it)
     prompt       HTML prompt (blue-accent box)
     buttonText   Show button label (default "Show solution")
     hideText     Hide button label (default "Hide solution")
     answer       HTML worked solution, revealed on click
     label        Sidebar label
   ============================================================================ */

function renderRevealSlide(slide) {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.image ? `<img src="${slide.image}" class="problem-image" style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}" alt="${slide.title}">` : ""}

    <div class="problem-statement">
      ${slide.prompt}
    </div>

    <button class="reveal-btn" id="reveal-btn" onclick="toggleReveal()">
      ${slide.buttonText || "Show solution"}
    </button>

    <div class="reveal-answer reveal-answer-hidden" id="reveal-answer">
      ${slide.answer}
    </div>
  `);
}


function toggleReveal() {
  const answer = document.getElementById("reveal-answer");
  const btn    = document.getElementById("reveal-btn");
  const slide  = moduleData[currentSlide];

  const isHidden = answer.classList.contains("reveal-answer-hidden");
  answer.classList.toggle("reveal-answer-hidden");
  btn.textContent = isHidden
    ? (slide.hideText || "Hide solution")
    : (slide.buttonText || "Show solution");
  if (isHidden) {
    answer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

registerSlideType("reveal", {
  icon: "💡",
  render: renderRevealSlide
});