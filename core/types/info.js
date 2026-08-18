/* ============================================================================
   types/info.js — informational content slide.

   Build a slide from any number of BLOCKS, in any order. Mix freely, e.g.
   text → image → text → image → image → equation.

     blocks: [
       { type: "text",     html: `<p>…</p>` },
       { type: "image",    src: "images/beam.svg", width: "420px",
                           alt: "Simply supported beam", caption: "Figure 1" },
       { type: "equation", latex: String.raw`M_{max} = \frac{wL^2}{8}` },
       { type: "text",     html: `<p>More explanation…</p>` }
     ]

   BLOCK TYPES
     text      html      HTML string (paragraphs, lists, <strong>, …)
                         Inline maths allowed: \( … \) or $ … $
     image     src       path relative to the module folder, e.g. "images/x.svg"
               width     optional max width, e.g. "420px" or "80%"
               height    optional max height, e.g. "260px"
               scale     optional fraction of the column width, e.g. 0.6
               alt       optional alt text (accessibility)
               caption   optional caption shown under the image
               Figures FILL the column by default; set width/scale to shrink.
               Aspect ratio is always preserved.
     equation  latex     LaTeX, rendered centred as display maths (preferred)
               html      legacy: plain HTML instead of LaTeX (still supported)
     columns   columns   an ARRAY OF ARRAYS — each inner array is a column
                         holding its own blocks, so anything that works on a
                         slide works inside a column
               widths    optional relative widths, e.g. [55, 45]
                         (columns stack vertically on a narrow screen)

   WRITING LATEX IN config.js
     Use String.raw`…` so backslashes survive:
         { type: "equation", latex: String.raw`\frac{wL^2}{8}` }
     With a normal template literal you must double every backslash
     (`\\frac`), because \f, \n, \t etc. are JavaScript escape characters.

   LEGACY FORMAT (still works, no need to convert existing slides):
     content:    `<p>…</p>`      single HTML string, wrapped in one text block
     image:      "images/x.svg"  optional figure below the content
     imageWidth: "480px"

   Other fields: title, label
   ============================================================================ */

// One block → HTML. Pulled out of the render so a `columns` block can lay
// out its own children under exactly the same rules.
function infoBlockHTML(block) {

      // ── Columns: content side by side ──
      if (block.type === "columns") {
        const cols = block.columns || [];
        const w    = block.widths || [];
        return `<div class="info-columns">
          ${cols.map((col, i) => `
            <div class="info-column" style="flex:${w[i] || 1} 1 0;">
              ${(col || []).map(infoBlockHTML).join("")}
            </div>`).join("")}
        </div>`;
      }

      // ── Image block ──
      // Sizing reuses the engine's shared helper, so width/height/scale behave
      // exactly as they do in steps, mcq, reveal and quiz figures.
      if (block.type === "image") {
        const style = imageSizeStyle({
          imageWidth:  block.width,
          imageHeight: block.height,
          imageScale:  block.scale
        });
        const img = `<img src="${block.src}" class="info-block-image"
                          style="${style}"
                          alt="${block.alt || ""}">`;
        return block.caption
          ? `<figure class="info-block-figure">${img}
               <figcaption class="info-block-caption">${block.caption}</figcaption>
             </figure>`
          : img;
      }

      // ── Equation block ──
      // `latex` is wrapped in \[ … \] so the engine's typesetMath() renders it
      // as centred display maths. `html` remains supported for legacy slides.
      if (block.type === "equation") {
        const body = block.latex !== undefined
          ? `\\[${block.latex}\\]`
          : (block.html || "");
        return `<div class="info-block info-block-equation">${body}</div>`;
      }

      // ── Text block (default) ──
      return `<div class="info-block">${block.html || ""}</div>`;
}

function renderInfoSlide(slide) {

  let bodyHTML = "";

  if (Array.isArray(slide.blocks)) {
    bodyHTML = slide.blocks.map(infoBlockHTML).join("");

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