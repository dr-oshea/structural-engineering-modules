/* ============================================================================
   types/info.js — informational content slide.

   Two supported formats:

   NEW (styled blocks):
     blocks: [
       { type: "text",     html: `<p>...</p>` },          // blue-accent box
       { type: "equation", html: `V(x) = dM/dx` },        // teal, centred
       { type: "image",    src: "images/x.svg", width: "400px", alt: "..." }
     ]

   LEGACY (still works):
     content: `<p>...</p>`        // wrapped in a single styled text block
     image:   "images/x.svg"      // optional figure below the content
     imageWidth: "480px"          // optional

   Other fields: title, label
   ============================================================================ */

function renderInfoSlide(slide) {

  let bodyHTML = "";

  if (Array.isArray(slide.blocks)) {
    bodyHTML = slide.blocks.map(block => {
      if (block.type === "image") {
        return `<img src="${block.src}" class="info-block-image"
                     style="${block.width ? `max-width:${block.width};` : ""}"
                     alt="${block.alt || ""}">`;
      }
      if (block.type === "equation") {
        return `<div class="info-block info-block-equation">${block.html}</div>`;
      }
      // default: text block (question-style box)
      return `<div class="info-block">${block.html}</div>`;
    }).join("");
  } else {
    // Legacy single content string — wrap it in one styled block
    bodyHTML = `<div class="info-block">${slide.content || ""}</div>`;
  }

  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="info-body">
      ${bodyHTML}
    </div>

    ${
      slide.image
        ? `<img src="${slide.image}" class="slide-image"
                style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}">`
        : ""
    }
  `);
}

registerSlideType("info", {
  icon: "📖",
  render: renderInfoSlide
});