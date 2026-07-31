/* ============================================================================
   types/pptslide.js — drop in a slide designed offline (PowerPoint, Keynote,
   Illustrator, a scanned figure…) and have it scaled to fit the window.

   Accepts an IMAGE or a PDF; the type works out which from the file extension.

     { type: "pptslide",
       label: "Overview",                  // sidebar label
       title: "Bending Moment Overview",   // OPTIONAL — omit for a clean,
                                           //   full-bleed slide with no heading
       src:   "images/slide-01.png",       // image … or "images/deck.pdf"
       page:  2,                           // OPTIONAL — PDF only: which page
       ratio: "16 / 9",                    // OPTIONAL — PDF only (default 16/9)
       maxWidth: "1000px",                 // OPTIONAL — default 1000px
       caption: "Adapted from Lecture 4"   // OPTIONAL
     }

   ── WHICH FORMAT? ──
   IMAGES ARE RECOMMENDED. In PowerPoint use File ▸ Export (or Save As) and
   choose PNG/JPEG — you can export every slide at once, and they render
   identically in every browser with no viewer chrome.
     • PNG  — best for slides with text, diagrams, line art (crisp edges)
     • JPEG — smaller files when the slide is mostly photographic
   Export at 1920px wide (or "high quality") so text stays sharp on large
   screens.

   PDFs work too and are convenient if you already have one, but the browser's
   built-in PDF viewer adds its own toolbar and scrollbars, and behaviour
   varies between browsers and on mobile. Prefer images where you can.

   Informational type — free navigation, no gating.
   ============================================================================ */

function renderPptSlide(slide) {
  const src = slide.src || "";
  const isPDF = /\.pdf(\?|#|$)/i.test(src);

  // Any max-width override applies to the frame/image wrapper
  const widthStyle = `max-width:${slide.maxWidth || "1000px"};`;

  let bodyHTML;

  if (isPDF) {
    // #page=N jumps to a page; toolbar=0 hides the viewer chrome where supported
    const frag = `#page=${slide.page || 1}&toolbar=0&navpanes=0&view=FitH`;
    bodyHTML = `
      <div class="pptslide-frame" style="${widthStyle}${slide.ratio ? `aspect-ratio:${slide.ratio};` : ""}">
        <iframe class="pptslide-pdf"
                src="${src}${frag}"
                title="${slide.title || slide.label || "Slide"}"
                loading="lazy"></iframe>
      </div>`;
  } else {
    bodyHTML = `
      <img class="pptslide-image"
           src="${src}"
           style="${widthStyle}"
           alt="${slide.alt || slide.title || slide.label || "Slide"}">`;
  }

  renderLayout(`
    ${slide.title ? `<h2>${slide.title}</h2>` : ""}

    <div class="pptslide-stage">
      ${bodyHTML}
      ${slide.caption ? `<p class="pptslide-caption">${slide.caption}</p>` : ""}
    </div>
  `);
}

registerSlideType("pptslide", {
  icon: "🖼️",
  render: renderPptSlide
});