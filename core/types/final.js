/* ============================================================================
   types/final.js — full-screen module-completion page (no sidebar/footer).

   Reached only via the Finish → Confirm button flow (the engine shows that
   flow automatically because this type registers isEnd: true).

   Config fields:
     title         Heading (default "Well done!")
     subtitle      Line under heading
     buttonText    Save button label (default "Save and Close")
     showRating    false to hide the 5-star rating (default shown)
     bugReportUrl  If set, shows a "report a bug" link to this URL
     label         Sidebar label (shown but not clickable)
   ============================================================================ */

function renderFinalSlide(slide) {
  app.innerHTML = `
    <div class="splash-container">
      <div class="splash final-card">
        <div class="final-trophy">🏆</div>
        <h1>${slide.title || "Well done!"}</h1>
        <p>${slide.subtitle || "You've completed this module."}</p>

        ${slide.showRating !== false ? `
          <div class="final-rating">
            <span class="final-rating-label">How useful was this module?</span>
            <div class="final-stars" id="final-stars">
              ${[1,2,3,4,5].map(n => `
                <span class="final-star"
                      data-value="${n}"
                      onmouseover="hoverRating(${n})"
                      onmouseout="hoverRating(0)"
                      onclick="setRating(${n})">★</span>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <button class="final-save-btn" onclick="saveAndClose()">
          ${slide.buttonText || "Save and Close"}
        </button>

        ${slide.bugReportUrl ? `
          <a class="final-bug-link" href="${slide.bugReportUrl}" target="_blank" rel="noopener">
            🐞 Report a bug or give feedback
          </a>
        ` : ""}
      </div>
    </div>
  `;
}


// ─── Star rating ────────────────────────────────────────────────────────────

let selectedRating = 0; // 0 = not yet rated

// Visually fill stars up to `n` (used for both hover preview and locked-in rating)
function paintStars(n) {
  document.querySelectorAll(".final-star").forEach(star => {
    const v = parseInt(star.dataset.value);
    star.classList.toggle("final-star-filled", v <= n);
  });
}

function hoverRating(n) {
  // On mouse-out (n === 0), fall back to the locked-in selection
  paintStars(n === 0 ? selectedRating : n);
}

function setRating(n) {
  selectedRating = n;
  paintStars(n);
}


// ─── Save ───────────────────────────────────────────────────────────────────

// Saves completion via the backend (core/api.js). Tracking is OPTIONAL — if
// api.js isn't loaded, or no backend is configured, this still updates the
// button and the student is unaffected.
async function saveAndClose() {
  const moduleId = (typeof moduleMeta !== "undefined" && moduleMeta.id)
                   ? moduleMeta.id : "unknown";

  const btn = document.querySelector(".final-save-btn");
  if (btn) {
    btn.textContent = "Saving…";
    btn.disabled = true;
  }

  let sent = false;
  if (typeof recordCompletion === "function") {
    sent = await recordCompletion({ moduleId, rating: selectedRating || null });
  } else {
    console.log("[module] api.js not loaded — completion not tracked (this is fine).");
  }

  if (btn) {
    btn.textContent = sent ? "✓ Saved" : "✓ Done";
  }

  // OPTIONAL: to auto-return to the homepage later, do it here, e.g.
  //   window.location.href = "../homepage/index.html?...";
}

registerSlideType("final", {
  icon: "🏆",
  render: renderFinalSlide,
  noNav: true,              // sidebar entry visible, never clickable
  excludeFromCount: true,   // not counted in "Page X of Y"
  isEnd: true               // triggers the Finish → Confirm button flow
});