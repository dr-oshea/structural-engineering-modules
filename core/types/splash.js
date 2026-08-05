/* ============================================================================
   types/splash.js — full-screen opening page (no sidebar/footer).

   Shows the module title, a subtitle, and — automatically — a contents list
   of the module's parts, so students can see what they're getting into before
   they start.

   The contents list is derived from the `partStart` fields on the module's
   slides (see engine.js → getModuleParts), so it always matches the sidebar.
   Nothing to maintain separately. If a module declares no parts, the list is
   omitted and the splash falls back to a simple centred layout.

   Config fields:
     title         Main heading
     subtitle      Line under the heading
     buttonText    Start button label (default "Start")
     contentsTitle Heading above the parts list (default "In this module")
     showContents  false to suppress the list even when parts exist
     label         Sidebar label (shown but not clickable)
   ============================================================================ */

function renderSplashSlide(slide) {
  const parts = (slide.showContents === false) ? [] : getModuleParts();

  const contentsHTML = parts.length ? `
    <div class="splash-contents">
      <h2 class="splash-contents-title">${slide.contentsTitle || "In this module"}</h2>
      <ol class="splash-contents-list">
        ${parts.map(p => `
          <li class="splash-contents-item">
            <span class="splash-contents-num">${p.number}</span>
            <span class="splash-contents-text">${p.title}</span>
          </li>
        `).join("")}
      </ol>
    </div>` : "";

  app.innerHTML = `
    <div class="splash-container">
      <div class="splash ${parts.length ? "splash-with-contents" : ""}">

        <div class="splash-head">
          <h1>${slide.title}</h1>
          <p>${slide.subtitle}</p>
        </div>

        <div class="splash-body">
          ${contentsHTML}
          <div class="splash-action">
            <button onclick="nextSlide()">
              ${slide.buttonText || "Start"}
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

registerSlideType("splash", {
  icon: "🏁",
  render: renderSplashSlide,
  noNav: true,             // visible in sidebar, never clickable
  excludeFromCount: true   // not counted in "Page X of Y"
});