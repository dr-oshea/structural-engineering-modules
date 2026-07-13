/* ============================================================================
   types/cards.js — flip-card concept slide.

   Config fields:
     title      Heading
     intro      Optional HTML intro block (question-box styling)
     cards      Array of { front, back } — front/back accept HTML/emoji
     label      Sidebar label
   ============================================================================ */

function renderCardsSlide(slide) {
  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.intro ? `<div class="cards-intro">${slide.intro}</div>` : ""}

    <div class="card-container">
      ${slide.cards.map(card => `
        <div class="card" onclick="this.classList.toggle('flipped')">
          <div class="card-inner">
            <div class="card-front">
              ${card.front}
            </div>
            <div class="card-back">
              ${card.back}
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `);
}

registerSlideType("cards", {
  icon: "📖",
  render: renderCardsSlide
});