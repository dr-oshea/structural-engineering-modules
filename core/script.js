const app = document.getElementById("app");

let currentSlide = 0;

function renderLayout(contentHTML) {
  app.innerHTML = `
    <div class="layout">

      <!-- LEFT NAV -->
      <div class="sidebar">
        <h3>Module</h3>
        <ul>
          ${moduleData.map((s, i) => `
            <li class="${i === currentSlide ? "active" : ""}">
              Slide ${i}
            </li>
          `).join("")}
        </ul>
      </div>

      <!-- MAIN CONTENT -->
      <div class="main">
        <div class="slide">
          ${contentHTML}
        </div>

        <!-- FOOTER NAV -->
        <div class="nav-buttons">
          <button onclick="prevSlide()" ${currentSlide === 0 ? "disabled": ""}>Back</button>
          <button onclick="nextSlide()" ${currentSlide === moduleData.length - 1 ? "disabled": ""}>Next</button>
        </div>
      </div>

    </div>
  `;
}

function renderSlide() {
  const slide = moduleData[currentSlide];

  // SPLASH (full screen, no sidebar)

  if (slide.type === "splash") {
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
    return;
  }



  // INFO SLIDE
  
  if (slide.type === "info") {
  renderLayout(`
    <h2>${slide.title}</h2>

    <div class="content">
      ${slide.content || ""}
    </div>

    ${
      slide.image
        ? `<img src="${slide.image}" class="slide-image">`
        : ""
    }
  `);
  }


}

function nextSlide() {
  if (currentSlide < moduleData.length - 1) {
    currentSlide++;
    renderSlide();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    renderSlide();
  }
}

renderSlide();