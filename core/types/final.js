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

  // ── Return to the homepage, carrying the student & course forward ──
  // Works when context.js is loaded and a student/course are known. Falls back
  // to an on-screen "you may close this window" message otherwise.
  const slide = moduleData[currentSlide];
  let homeUrl = null;

  if (slide.homeUrl) {
    homeUrl = slide.homeUrl;                 // author-provided override
  } else if (typeof getStudentContext === "function") {
    const ctx = getStudentContext();
    if (ctx.student || ctx.course) {
      const params = new URLSearchParams();
      if (ctx.student) params.set("sid", ctx.student);
      if (ctx.course)  params.set("course", ctx.course);
      homeUrl = `../homepage/index.html?${params.toString()}`;
    }
  }

  showSaveConfirmation(homeUrl);
}

// Shows a brief confirmation, then redirects to the homepage if we have a URL;
// otherwise leaves a clear "you may close this window" message on screen.
function showSaveConfirmation(homeUrl) {
  const card = document.querySelector(".final-card");
  if (card) {
    card.innerHTML = `
      <div class="final-trophy">✅</div>
      <h1>Completion saved</h1>
      <p>${homeUrl
            ? "Returning you to your module homepage…"
            : "Your completion has been saved. You may now close this window."}</p>
    `;
  }

  if (homeUrl) {
    // Brief pause so the student sees the confirmation, then redirect.
    setTimeout(() => { window.location.href = homeUrl; }, 1400);
  }
}

registerSlideType("final", {
  icon: "🏆",
  render: renderFinalSlide,
  noNav: true,              // sidebar entry visible, never clickable
  excludeFromCount: true,   // not counted in "Page X of Y"
  isEnd: true               // triggers the Finish → Confirm button flow
});