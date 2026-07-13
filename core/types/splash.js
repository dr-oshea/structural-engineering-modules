/* ============================================================================
   types/splash.js — full-screen opening page (no sidebar/footer).

   Config fields:
     title        Main heading
     subtitle     Line under the heading
     buttonText   Start button label (default "Start")
     label        Sidebar label (shown but not clickable)
   ============================================================================ */

function renderSplashSlide(slide) {
  app.innerHTML = `
    <div class="splash-container">
      <div class="splash">
        <h1>${slide.title}</h1>
        <p>${slide.subtitle}</p>
        <button onclick="nextSlide()">
          ${slide.buttonText || "Start"}
        </button>
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