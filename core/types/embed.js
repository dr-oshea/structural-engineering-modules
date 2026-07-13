/* ============================================================================
   types/embed.js — iframe-embedded interactive (GeoGebra, Desmos, video, ...).

   For GeoGebra: use Share ▸ Embed and copy the URL inside src="..."; the
   applet-only URL looks like
     https://www.geogebra.org/material/iframe/id/XXXXX[/params...]
   (Use the iframe option, NOT the script/Math Apps option.)

   Config fields:
     title        Heading
     intro        Optional HTML intro block
     src          The embed URL (required)
     aspectRatio  Optional, e.g. "16 / 10" (default 16/9)
     maxWidth     Optional, e.g. "820px"
     caption      Optional caption under the frame
     label        Sidebar label
   ============================================================================ */

function renderEmbedSlide(slide) {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.intro ? `<div class="info-block">${slide.intro}</div>` : ""}

    <div class="embed-frame-wrapper" style="${slide.aspectRatio ? `aspect-ratio:${slide.aspectRatio};` : ""}${slide.maxWidth ? `max-width:${slide.maxWidth};` : ""}">
      <iframe
        class="embed-frame"
        src="${slide.src}"
        title="${slide.title}"
        loading="lazy"
        allow="fullscreen; autoplay"
        allowfullscreen
      ></iframe>
    </div>

    ${slide.caption ? `<p class="embed-caption">${slide.caption}</p>` : ""}
  `);
}

registerSlideType("embed", {
  icon: "🎚️",
  render: renderEmbedSlide
});