/* ============================================================================
   types/explore.js — annotated diagram: click points to reveal explanations.

   Unlike "hotspot" (which asks the student to find ONE correct region), every
   point here is informative. Built for diagrams like a beam with its SFD and
   BMD beneath, where each critical point carries its own working.

   Clicking a marker shows that point's explanation in a panel below the
   figure. Markers are lettered/numbered so the panel always says which point
   you're reading, and the active marker is highlighted — you get a panel's
   room for equations without losing the link to the diagram.

   SLIDE FIELDS
     title          Heading
     intro          Optional HTML shown above the figure
     image          The diagram (required)
     imageWidth     \
     imageHeight     >  optional sizing — see the steps type for details
     imageScale     /
     prompt         Panel text before anything is clicked
                    (default: "Click a marked point on the diagram…")
     requireAll     true → the student must open EVERY point before the
                    module lets them advance (gates like a quiz slide).
                    Default false (free navigation).
     hotspots       Array of point objects (below)
     label          Sidebar label

   HOTSPOT FIELDS
     x, y           Position as PERCENTAGES of the image (0–100, from the
                    top-left). The marker is centred on this point.
     marker         Optional label inside the marker, e.g. "A" or "1".
                    Defaults to its number in the list (1, 2, 3, …).
     title          Optional heading shown in the panel
     content        HTML explanation. LaTeX works: $…$ inline, \\[ … \\] display.

   EXAMPLE
     { type: "explore",
       label: "Explore the SFD and BMD",
       title: "How the diagrams were determined",
       intro: `<p>Click each marked point to see the working behind it.</p>`,
       image: "images/beam-sfd-bmd.svg",
       imageWidth: "820px",
       hotspots: [
         { x: 10, y: 62, marker: "A", title: "Reaction at A",
           content: `<p>From $\\Sigma M_E = 0$: $R_A = 13.8$ kN.</p>` },
         { x: 34, y: 44, marker: "B", title: "Peak moment",
           content: `<p>Shear passes through zero here, so $M$ is maximum.</p>` }
       ]
     }
   ============================================================================ */

function renderExploreSlide(slide) {
  const st = exploreState();

  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.intro ? `<div class="info-block">${slide.intro}</div>` : ""}

    <div class="explore-stage" style="${imageSizeStyle(slide)}">
      <img src="${slide.image}" class="explore-image" alt="${slide.title}">
      ${slide.hotspots.map((h, i) => `
        <button class="explore-marker"
                id="explore-marker-${i}"
                style="left:${h.x}%; top:${h.y}%;"
                onclick="exploreSelect(${i})"
                aria-label="${h.title || `Point ${i + 1}`}">
          ${h.marker !== undefined ? h.marker : i + 1}
        </button>
      `).join("")}
    </div>

    <div class="explore-panel" id="explore-panel">
      ${explorePanelHTML(slide, st.active)}
    </div>

    <div class="explore-progress" id="explore-progress">
      ${exploreProgressHTML(slide, st)}
    </div>
  `);

  exploreRefreshMarkers(slide, st);
}


// Panel contents for a given hotspot index (null = nothing selected yet).
function explorePanelHTML(slide, index) {
  if (index === null || index === undefined || !slide.hotspots[index]) {
    return `<p class="explore-panel-prompt">${
      slide.prompt || "Click a marked point on the diagram to see how it was determined."
    }</p>`;
  }
  const h     = slide.hotspots[index];
  const badge = h.marker !== undefined ? h.marker : index + 1;
  return `
    <div class="explore-panel-head">
      <span class="explore-panel-badge">${badge}</span>
      <span class="explore-panel-title">${h.title || `Point ${index + 1}`}</span>
    </div>
    <div class="explore-panel-body">${h.content || ""}</div>
  `;
}


// "3 of 6 points explored" — plus a completion note when requireAll is set.
function exploreProgressHTML(slide, st) {
  const total = slide.hotspots.length;
  const seen  = st.visited.length;
  if (!slide.requireAll) {
    return `<span class="explore-progress-label">${seen} of ${total} points explored</span>`;
  }
  return seen >= total
    ? `<span class="explore-progress-label explore-progress-done">
         ✓ All ${total} points explored — you can continue
       </span>`
    : `<span class="explore-progress-label">
         ${seen} of ${total} points explored — open them all to continue
       </span>`;
}


// Per-slide state, persisted so it survives navigating away and back.
function exploreState() {
  if (!slideState[currentSlide] || slideState[currentSlide].type !== "explore") {
    slideState[currentSlide] = { type: "explore", visited: [], active: null };
  }
  return slideState[currentSlide];
}


// Apply visited / active classes to every marker.
function exploreRefreshMarkers(slide, st) {
  slide.hotspots.forEach((h, i) => {
    const btn = document.getElementById(`explore-marker-${i}`);
    if (!btn) return;
    btn.classList.toggle("explore-marker-visited", st.visited.includes(i));
    btn.classList.toggle("explore-marker-active",  st.active === i);
  });
}


// Clicking a marker: update the panel, mark it visited, refresh progress.
function exploreSelect(index) {
  const slide = moduleData[currentSlide];
  const st    = exploreState();

  st.active = index;
  if (!st.visited.includes(index)) st.visited.push(index);

  // Panel — re-typeset so any LaTeX in the explanation renders
  const panel = document.getElementById("explore-panel");
  if (panel) {
    panel.innerHTML = explorePanelHTML(slide, index);
    typesetMath(panel);
  }

  const prog = document.getElementById("explore-progress");
  if (prog) prog.innerHTML = exploreProgressHTML(slide, st);

  exploreRefreshMarkers(slide, st);

  // If this slide gates on seeing everything, unlock once all are visited
  if (slide.requireAll && st.visited.length >= slide.hotspots.length
      && !completedSlides.has(currentSlide)) {
    completedSlides.add(currentSlide);
    updateLockState();
  }
}


registerSlideType("explore", {
  icon: "📖",
  render: renderExploreSlide,
  // Gates only when the author asks every point to be opened first.
  isQuiz: (slide) => slide.requireAll === true
});