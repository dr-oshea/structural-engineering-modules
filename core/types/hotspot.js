/* ============================================================================
   types/hotspot.js — click the correct region on a diagram.

   Quiz-gating by default (add quiz:false in config to make it informational).
   Regions are percentage coordinates over the image (0–100, from top-left).

   Config fields:
     title        Heading
     prompt       HTML instruction
     image        The diagram (path relative to module folder)
     maxWidth     Optional stage width override, e.g. "700px"
     showMarkers  false to hide the pulsing red location dots (default shown)
     hotspots     Array of { x, y, w, h, correct? } — one with correct:true
     explanation  Optional HTML revealed on the correct click
     label        Sidebar label
   ============================================================================ */

function renderHotspotSlide(slide) {
  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="${isQuizSlide(currentSlide) ? "mcq-question" : "info-block"}">
      ${slide.prompt}
    </div>

    <div class="hotspot-stage" id="hotspot-stage" style="${slide.maxWidth ? `max-width:${slide.maxWidth};` : ""}">
      <img src="${slide.image}" class="hotspot-image" alt="${slide.title}">
      ${slide.hotspots.map((h, i) => `
        <button
          class="hotspot-region${slide.showMarkers === false ? "" : " hotspot-region-marked"}"
          id="hotspot-${i}"
          style="left:${h.x}%; top:${h.y}%; width:${h.w}%; height:${h.h}%;"
          onclick="checkHotspot(${i})"
          title="">
          ${slide.showMarkers === false ? "" : `<span class="hotspot-marker"></span>`}
        </button>
      `).join("")}
    </div>

    ${slide.explanation ? `
      <div class="mcq-explanation mcq-explanation-hidden" id="hotspot-explanation">
        <span class="explanation-tick">✓</span>
        <span>${slide.explanation}</span>
      </div>
    ` : ""}

    <div class="steps-complete steps-complete-hidden" id="hotspot-complete">
      🎉 Correct — well done!
    </div>
  `);

  restoreHotspotState();
}


function checkHotspot(index) {
  const slide   = moduleData[currentSlide];
  const hotspot = slide.hotspots[index];
  const btn     = document.getElementById(`hotspot-${index}`);

  if (hotspot.correct) {

    // ── CORRECT ──
    btn.classList.add("hotspot-correct");
    // Lock all regions
    document.querySelectorAll(".hotspot-region").forEach(b => b.disabled = true);

    const expl = document.getElementById("hotspot-explanation");
    if (expl) expl.classList.remove("mcq-explanation-hidden");

    // Persist (only meaningful if this slide is a quiz)
    slideState[currentSlide] = { type: "hotspot", chosen: index };

    setTimeout(() => {
      if (isQuizSlide(currentSlide)) {
        completedSlides.add(currentSlide);
        updateLockState();
      }
      const done = document.getElementById("hotspot-complete");
      if (done) {
        done.classList.remove("steps-complete-hidden");
        done.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 600);

  } else {

    // ── INCORRECT ──
    triggerBuzz(btn);
    btn.classList.add("hotspot-wrong");
    setTimeout(() => btn.classList.remove("hotspot-wrong"), 600);

  }
}


// Replays a previously-clicked correct region on re-visit.
function restoreHotspotState() {
  const state = slideState[currentSlide];
  if (!state || state.type !== "hotspot") return;

  const btn = document.getElementById(`hotspot-${state.chosen}`);
  if (btn) btn.classList.add("hotspot-correct");
  document.querySelectorAll(".hotspot-region").forEach(b => b.disabled = true);

  const expl = document.getElementById("hotspot-explanation");
  if (expl) expl.classList.remove("mcq-explanation-hidden");

  const done = document.getElementById("hotspot-complete");
  if (done) done.classList.remove("steps-complete-hidden");
}

registerSlideType("hotspot", {
  icon: "🎯",
  render: renderHotspotSlide,
  isQuiz: true
});