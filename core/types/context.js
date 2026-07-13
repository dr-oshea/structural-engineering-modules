/* ============================================================================
   types/context.js — "why this matters" motivation slide.
   Large image + a short real-world framing sentence. Ideal as the first
   content slide after the splash.

   Config fields:
     title        Heading
     image        Large motivating image (path relative to module folder)
     imageWidth   Optional max-width override, e.g. "560px"
     text         HTML — one or two short sentences of motivation
     label        Sidebar label
   ============================================================================ */

function renderContextSlide(slide) {
  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="context-block">
      ${slide.image ? `<img src="${slide.image}" class="context-image" style="${slide.imageWidth ? `max-width:${slide.imageWidth};` : ""}" alt="${slide.title}">` : ""}
      <div class="context-text">
        ${slide.text || ""}
      </div>
    </div>
  `);
}

registerSlideType("context", {
  icon: "🌏",
  render: renderContextSlide
});