/* ============================================================================
   types/interactive-diagram.js — construct a diagram by adding items at nodes.

   The student clicks a marked node, chooses WHAT to add (a force, a moment, …),
   fills in its details, and presses Enter. Whatever they entered is DRAWN on
   the diagram — right or wrong — so the picture they build is their own answer.
   Pressing Check flags each node correct or incorrect; they fix and re-check
   until everything is right, which completes the slide.

   Built for free-body diagrams, but the vocabulary is general.

   ── HOW IT FITS TOGETHER ──
     itemTypes   what can be added (force, moment, udl, support …). Each has
                 its own FIELDS and its own DRAWING.
     nodes       where things can be added, and what the right answer is.
                 A node holds a LIST of items — a pin support might need both
                 a horizontal and a vertical force — and each can be deleted
                 or edited independently.

   ── SLIDE FIELDS ──
     title, label            as usual
     image                   the diagram (required)
     imageWidth / Height / Scale   optional sizing
     prompt                  HTML instructions above the figure
     itemTypes               object of item-type definitions (below)
     nodes                   array of node definitions (below)
     checkText               Check button label (default "Check answers")

   ── ITEM TYPE ──
     itemTypes: {
       force: {
         label: "Force",                       // shown in the "add" menu
         draw:  { shape: "arrow", color: "#c62828", length: 70 },
         labelTemplate: "{mag} kN",            // optional caption on the drawing
         fields: [
           { id: "dir", label: "Direction", type: "select", options: [
               { value: "up",   label: "Upward ↑",   draw: { angle: 270 } },
               { value: "down", label: "Downward ↓", draw: { angle:  90 } }
           ]},
           { id: "mag", label: "Magnitude", type: "number",
             unit: "kN", tolerance: 0.05 }
         ]
       }
     }

     Each option may carry a `draw` object; these are merged over the item
     type's `draw` in field order, so the selection shapes the drawing.

     FIELD TYPES
       select  options: [{ value, label, draw? }]
       number  unit (optional), tolerance (default 0.01)
       text    compared case-insensitively, trimmed

   ── DRAWING VOCABULARY (the `shape` in a draw object) ──
     arrow        angle (deg; 0 = right, 90 = down), length, color,
                  anchor: "head" (default — arrowhead sits on the node)
                  or "tail" (arrow starts at the node and points away)
     moment       sense: "cw" | "ccw", radius, color
     distributed  angle, length, width, count, color  (a run of arrows)
     pin          color        (a triangle under the node)
     roller       color        (a triangle on wheels)

   ── NODE ──
     nodes: [
       { x: 12, y: 64,            // % of the image, from the top-left
         label: "A",              // shown in the marker and popup heading
         title: "Support A",      // optional longer name for the popup
         answers: [               // a LIST of acceptable answer SETS
           [ { itemType: "force", values: { dir: "up", mag: 13.8 } } ]
         ]
       }
     ]

     Order within a set does not matter. Numbers use their field's tolerance.
     For a node that should be left EMPTY, use `answers: [ [] ]`.
     `answer: [...]` is accepted as shorthand for a single acceptable set.
   ============================================================================ */


// ─── State ──────────────────────────────────────────────────────────────────
//   items:   { nodeIndex: [ { itemType, values } … ] }   what the student built
//   status:  { nodeIndex: "correct" | "wrong" }          set by Check
//   openNode: index of the node whose popup is open (null = none)
//   editing:  index within that node's items being edited (null = adding new)
function idState() {
  if (!slideState[currentSlide] || slideState[currentSlide].type !== "interactive-diagram") {
    slideState[currentSlide] = {
      type: "interactive-diagram",
      items: {}, status: {}, openNode: null, editing: null, addType: null
    };
  }
  return slideState[currentSlide];
}

function idNodeItems(nodeIndex) {
  const st = idState();
  if (!st.items[nodeIndex]) st.items[nodeIndex] = [];
  return st.items[nodeIndex];
}


// ─── Render ─────────────────────────────────────────────────────────────────

function renderInteractiveDiagram(slide) {
  const st = idState();

  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.prompt ? `<div class="info-block">${slide.prompt}</div>` : ""}

    <div class="idiag-stage" id="idiag-stage" style="${imageSizeStyle(slide)}">
      <img src="${slide.image}" class="idiag-image" alt="${slide.title}"
           onload="idDrawAll()">
      <svg class="idiag-canvas" id="idiag-canvas" aria-hidden="true"></svg>
      ${slide.nodes.map((n, i) => `
        <button class="idiag-node" id="idiag-node-${i}"
                style="left:${n.x}%; top:${n.y}%;"
                onclick="idOpenNode(${i})"
                aria-label="${n.title || n.label || `Point ${i + 1}`}">
          ${n.label !== undefined ? n.label : i + 1}
        </button>
      `).join("")}
      <div class="idiag-popup idiag-popup-hidden" id="idiag-popup"></div>
    </div>

    <div class="idiag-actions">
      <button class="idiag-check-btn" onclick="idCheck()">
        ${slide.checkText || "Check answers"}
      </button>
      <span class="idiag-status" id="idiag-status"></span>
    </div>

    <div class="steps-complete steps-complete-hidden" id="idiag-complete">
      🎉 Diagram complete — every point is correct!
    </div>
  `);

  idRefreshNodes();
  idDrawAll();
  if (st.openNode !== null) idOpenNode(st.openNode, true);
  if (completedSlides.has(currentSlide)) {
    const done = document.getElementById("idiag-complete");
    if (done) done.classList.remove("steps-complete-hidden");
  }
}


// ─── Node markers ───────────────────────────────────────────────────────────

function idRefreshNodes() {
  const slide = moduleData[currentSlide];
  const st    = idState();
  slide.nodes.forEach((n, i) => {
    const el = document.getElementById(`idiag-node-${i}`);
    if (!el) return;
    const count = (st.items[i] || []).length;
    el.classList.toggle("idiag-node-filled",  count > 0);
    el.classList.toggle("idiag-node-correct", st.status[i] === "correct");
    el.classList.toggle("idiag-node-wrong",   st.status[i] === "wrong");
    el.classList.toggle("idiag-node-open",    st.openNode === i);
  });
}


// ─── Popup ──────────────────────────────────────────────────────────────────

function idOpenNode(nodeIndex, keepPosition) {
  const slide = moduleData[currentSlide];
  const st    = idState();
  const node  = slide.nodes[nodeIndex];

  st.openNode = nodeIndex;
  if (!keepPosition) { st.editing = null; st.addType = null; }

  const popup = document.getElementById("idiag-popup");
  if (!popup) return;

  const items     = idNodeItems(nodeIndex);
  const typeKeys  = Object.keys(slide.itemTypes || {});
  const addType   = st.addType || (st.editing !== null ? items[st.editing].itemType : null);
  const editing   = st.editing;
  const editValues = editing !== null ? items[editing].values : {};

  popup.innerHTML = `
    <div class="idiag-popup-head">
      <span class="idiag-popup-title">${node.title || `Point ${node.label !== undefined ? node.label : nodeIndex + 1}`}</span>
      <button class="idiag-popup-aside" onclick="idToggleAside()" title="Move this panel aside">⇱</button>
      <button class="idiag-popup-close" onclick="idClosePopup()" aria-label="Close">×</button>
    </div>

    ${items.length ? `
      <div class="idiag-items">
        ${items.map((it, k) => `
          <div class="idiag-item ${editing === k ? "idiag-item-editing" : ""}">
            <span class="idiag-item-text">${idItemSummary(slide, it)}</span>
            <button class="idiag-item-edit" onclick="idEditItem(${k})" title="Edit">✎</button>
            <button class="idiag-item-del"  onclick="idDeleteItem(${k})" title="Delete">×</button>
          </div>
        `).join("")}
      </div>
    ` : `<p class="idiag-empty">Nothing added here yet.</p>`}

    ${addType === null ? `
      <div class="idiag-add">
        <span class="idiag-add-label">Add:</span>
        ${typeKeys.map(k => `
          <button class="idiag-add-btn" onclick="idChooseType('${k}')">
            ${slide.itemTypes[k].label || k}
          </button>
        `).join("")}
      </div>
    ` : `
      <form class="idiag-form" onsubmit="return false;">
        <div class="idiag-form-type">${slide.itemTypes[addType].label || addType}</div>
        ${(slide.itemTypes[addType].fields || []).map(f => idFieldHTML(f, editValues[f.id])).join("")}
        <div class="idiag-form-actions">
          <button class="idiag-enter-btn"  onclick="idSubmitItem()">
            ${editing !== null ? "Update" : "Enter"}
          </button>
          <button class="idiag-cancel-btn" onclick="idCancelForm()">Cancel</button>
        </div>
      </form>
    `}
  `;

  popup.classList.remove("idiag-popup-hidden");
  if (!keepPosition) idPositionPopup(nodeIndex);
  idRefreshNodes();
  typesetMath(popup);
}

// One form field
function idFieldHTML(f, value) {
  if (f.type === "select") {
    return `
      <label class="idiag-field">
        <span class="idiag-field-label">${f.label || f.id}</span>
        <select class="idiag-field-input" id="idiag-f-${f.id}">
          <option value="">— choose —</option>
          ${(f.options || []).map(o => `
            <option value="${o.value}" ${value === o.value ? "selected" : ""}>${o.label || o.value}</option>
          `).join("")}
        </select>
      </label>`;
  }
  if (f.type === "number") {
    return `
      <label class="idiag-field">
        <span class="idiag-field-label">${f.label || f.id}</span>
        <span class="idiag-field-row">
          <input class="idiag-field-input" id="idiag-f-${f.id}" type="number" step="any"
                 value="${value !== undefined ? value : ""}" placeholder="?">
          ${f.unit ? `<span class="idiag-field-unit">${f.unit}</span>` : ""}
        </span>
      </label>`;
  }
  return `
    <label class="idiag-field">
      <span class="idiag-field-label">${f.label || f.id}</span>
      <input class="idiag-field-input" id="idiag-f-${f.id}" type="text"
             value="${value !== undefined ? value : ""}">
    </label>`;
}

// Places the popup on whichever side of the node has more room.
function idPositionPopup(nodeIndex) {
  const slide = moduleData[currentSlide];
  const popup = document.getElementById("idiag-popup");
  const node  = slide.nodes[nodeIndex];
  if (!popup || !node) return;

  popup.classList.remove("idiag-popup-aside");
  const onLeft = node.x > 50;      // node on the right → popup to its left
  const onTop  = node.y > 55;      // node low down    → popup above it

  popup.style.left   = onLeft ? "auto" : `calc(${node.x}% + 26px)`;
  popup.style.right  = onLeft ? `calc(${100 - node.x}% + 26px)` : "auto";
  popup.style.top    = onTop  ? "auto" : `calc(${node.y}% + 18px)`;
  popup.style.bottom = onTop  ? `calc(${100 - node.y}% + 18px)` : "auto";
}

// "Move aside" — parks the popup in a corner so it never covers the diagram.
function idToggleAside() {
  const popup = document.getElementById("idiag-popup");
  if (!popup) return;
  const aside = popup.classList.toggle("idiag-popup-aside");
  if (aside) {
    popup.style.left = popup.style.right = popup.style.top = popup.style.bottom = "";
  } else {
    const st = idState();
    if (st.openNode !== null) idPositionPopup(st.openNode);
  }
}

function idClosePopup() {
  const st = idState();
  st.openNode = null; st.editing = null; st.addType = null;
  const popup = document.getElementById("idiag-popup");
  if (popup) popup.classList.add("idiag-popup-hidden");
  idRefreshNodes();
}

function idChooseType(key) {
  const st = idState();
  st.addType = key;
  idOpenNode(st.openNode, true);
}

function idCancelForm() {
  const st = idState();
  st.addType = null; st.editing = null;
  idOpenNode(st.openNode, true);
}

function idEditItem(k) {
  const st = idState();
  st.editing = k;
  st.addType = idNodeItems(st.openNode)[k].itemType;
  idOpenNode(st.openNode, true);
}

function idDeleteItem(k) {
  const st = idState();
  const items = idNodeItems(st.openNode);
  items.splice(k, 1);
  st.editing = null; st.addType = null;
  delete st.status[st.openNode];       // answer changed — clear its verdict
  idOpenNode(st.openNode, true);
  idDrawAll();
}

// Reads the form, stores the item, redraws.
function idSubmitItem() {
  const slide = moduleData[currentSlide];
  const st    = idState();
  const type  = slide.itemTypes[st.addType];
  const values = {};

  for (const f of (type.fields || [])) {
    const el = document.getElementById(`idiag-f-${f.id}`);
    if (!el) continue;
    const raw = el.value;
    if (raw === "" || raw === null) { triggerBuzz(el); return; }   // all fields required
    values[f.id] = (f.type === "number") ? parseFloat(raw) : raw;
    if (f.type === "number" && isNaN(values[f.id])) { triggerBuzz(el); return; }
  }

  const items = idNodeItems(st.openNode);
  const item  = { itemType: st.addType, values };
  if (st.editing !== null) items[st.editing] = item; else items.push(item);

  delete st.status[st.openNode];       // answer changed — clear its verdict
  st.editing = null; st.addType = null;
  idOpenNode(st.openNode, true);
  idDrawAll();
}

// Human-readable one-liner for an item in the popup list.
function idItemSummary(slide, item) {
  const type = slide.itemTypes[item.itemType] || {};
  const parts = (type.fields || []).map(f => {
    const v = item.values[f.id];
    if (f.type === "select") {
      const o = (f.options || []).find(o => o.value === v);
      return o ? (o.label || o.value) : v;
    }
    return f.unit ? `${v} ${f.unit}` : v;
  });
  return `<strong>${type.label || item.itemType}</strong> · ${parts.join(" · ")}`;
}


// ─── Drawing ────────────────────────────────────────────────────────────────

// Merge the item type's draw spec with any draw fragments on chosen options.
function idDrawSpec(slide, item) {
  const type = slide.itemTypes[item.itemType] || {};
  let spec = Object.assign({}, type.draw || {});
  for (const f of (type.fields || [])) {
    if (f.type !== "select") continue;
    const o = (f.options || []).find(o => o.value === item.values[f.id]);
    if (o && o.draw) spec = Object.assign(spec, o.draw);
  }
  return spec;
}

// Caption from labelTemplate, e.g. "{mag} kN" → "13.8 kN"
function idItemLabel(slide, item) {
  const type = slide.itemTypes[item.itemType] || {};
  if (!type.labelTemplate) return "";
  return type.labelTemplate.replace(/\{(\w+)\}/g, (_, k) =>
    item.values[k] !== undefined ? item.values[k] : "");
}

// Redraws every item on the SVG overlay, sized to the image as displayed.
function idDrawAll() {
  const slide  = moduleData[currentSlide];
  if (!slide || slide.type !== "interactive-diagram") return;
  const stage  = document.getElementById("idiag-stage");
  const canvas = document.getElementById("idiag-canvas");
  if (!stage || !canvas) return;

  const w = stage.clientWidth || 800;
  const h = stage.clientHeight || 450;
  canvas.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const st = idState();
  let defs = `
    <defs>
      <marker id="idiag-head" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"></path>
      </marker>
    </defs>`;
  let body = "";

  slide.nodes.forEach((n, i) => {
    const px = (n.x / 100) * w;
    const py = (n.y / 100) * h;
    (st.items[i] || []).forEach(item => {
      body += idDrawItem(slide, item, px, py);
    });
  });

  canvas.innerHTML = defs + body;
}

// One item → SVG string.
function idDrawItem(slide, item, px, py) {
  const s     = idDrawSpec(slide, item);
  const color = s.color || "#c62828";
  const label = idItemLabel(slide, item);
  const shape = s.shape || "arrow";

  if (shape === "moment") {
    const r    = s.radius || 26;
    const cw   = (s.sense || "cw") === "cw";
    const sweep = cw ? 1 : 0;
    // Three-quarter arc around the node
    const a0 = cw ? -140 : -40, a1 = cw ? 140 : -220;
    const p0 = [px + r * Math.cos(a0 * Math.PI / 180), py + r * Math.sin(a0 * Math.PI / 180)];
    const p1 = [px + r * Math.cos(a1 * Math.PI / 180), py + r * Math.sin(a1 * Math.PI / 180)];
    return `
      <path d="M ${p0[0]} ${p0[1]} A ${r} ${r} 0 1 ${sweep} ${p1[0]} ${p1[1]}"
            fill="none" stroke="${color}" stroke-width="2.5"
            marker-end="url(#idiag-head)"></path>
      ${label ? `<text x="${px}" y="${py - r - 8}" fill="${color}"
                       font-size="13" text-anchor="middle">${label}</text>` : ""}`;
  }

  if (shape === "pin" || shape === "roller") {
    const sz = s.size || 18;
    const wheels = shape === "roller"
      ? `<circle cx="${px - sz * 0.4}" cy="${py + sz + 4}" r="3.5" fill="${color}"></circle>
         <circle cx="${px + sz * 0.4}" cy="${py + sz + 4}" r="3.5" fill="${color}"></circle>` : "";
    return `
      <polygon points="${px},${py} ${px - sz},${py + sz} ${px + sz},${py + sz}"
               fill="none" stroke="${color}" stroke-width="2.5"></polygon>
      ${wheels}`;
  }

  if (shape === "distributed") {
    const angle = (s.angle !== undefined ? s.angle : 90) * Math.PI / 180;
    const len   = s.length || 40;
    const width = s.width  || 90;
    const count = s.count  || 5;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    // Arrows spread perpendicular to their direction
    const ox = -dy, oy = dx;
    let out = "";
    for (let k = 0; k < count; k++) {
      const t  = (k / (count - 1) - 0.5) * width;
      const bx = px + ox * t - dx * len, by = py + oy * t - dy * len;
      const hx = px + ox * t,            hy = py + oy * t;
      out += `<line x1="${bx}" y1="${by}" x2="${hx}" y2="${hy}"
                    stroke="${color}" stroke-width="2"
                    marker-end="url(#idiag-head)"></line>`;
    }
    out += `<line x1="${px + ox * (-width / 2) - dx * len}" y1="${py + oy * (-width / 2) - dy * len}"
                  x2="${px + ox * ( width / 2) - dx * len}" y2="${py + oy * ( width / 2) - dy * len}"
                  stroke="${color}" stroke-width="2"></line>`;
    if (label) out += `<text x="${px - dx * (len + 14)}" y="${py - dy * (len + 14)}"
                             fill="${color}" font-size="13" text-anchor="middle">${label}</text>`;
    return out;
  }

  // Default: arrow
  const angle = (s.angle !== undefined ? s.angle : 270) * Math.PI / 180;
  const len   = s.length || 70;
  const dx = Math.cos(angle), dy = Math.sin(angle);
  let x1, y1, x2, y2;
  if (s.anchor === "tail") {           // starts at the node, points away
    x1 = px; y1 = py; x2 = px + dx * len; y2 = py + dy * len;
  } else {                              // default: head lands on the node
    x1 = px - dx * len; y1 = py - dy * len; x2 = px; y2 = py;
  }
  const lx = x1 - dx * 10, ly = y1 - dy * 10;
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="${color}" stroke-width="2.5"
          marker-end="url(#idiag-head)"></line>
    ${label ? `<text x="${lx}" y="${ly}" fill="${color}" font-size="13"
                     text-anchor="middle" dominant-baseline="middle">${label}</text>` : ""}`;
}


// ─── Checking ───────────────────────────────────────────────────────────────

// Acceptable answer sets for a node (supports `answer` shorthand).
function idNodeAnswers(node) {
  if (Array.isArray(node.answers)) return node.answers;
  if (Array.isArray(node.answer))  return [node.answer];
  return [[]];
}

// Does one entered item match one expected item?
function idItemMatches(slide, entered, expected) {
  if (entered.itemType !== expected.itemType) return false;
  const type = slide.itemTypes[expected.itemType] || {};
  for (const f of (type.fields || [])) {
    const ev = entered.values[f.id];
    const xv = expected.values[f.id];
    if (xv === undefined) continue;               // author didn't constrain it
    if (f.type === "number") {
      const tol = f.tolerance !== undefined ? f.tolerance : 0.01;
      if (isNaN(ev) || Math.abs(ev - xv) > tol) return false;
    } else if (f.type === "text") {
      if (String(ev).trim().toLowerCase() !== String(xv).trim().toLowerCase()) return false;
    } else if (ev !== xv) {
      return false;
    }
  }
  return true;
}

// Order-independent set comparison.
function idSetMatches(slide, entered, expectedSet) {
  if (entered.length !== expectedSet.length) return false;
  const pool = entered.slice();
  for (const exp of expectedSet) {
    const k = pool.findIndex(e => idItemMatches(slide, e, exp));
    if (k === -1) return false;
    pool.splice(k, 1);
  }
  return true;
}

function idNodeIsCorrect(slide, nodeIndex) {
  const entered = idState().items[nodeIndex] || [];
  return idNodeAnswers(slide.nodes[nodeIndex])
           .some(set => idSetMatches(slide, entered, set));
}

function idCheck() {
  const slide = moduleData[currentSlide];
  const st    = idState();
  let wrong = 0;

  slide.nodes.forEach((n, i) => {
    const ok = idNodeIsCorrect(slide, i);
    st.status[i] = ok ? "correct" : "wrong";
    if (!ok) wrong++;
  });

  idRefreshNodes();

  const statusEl = document.getElementById("idiag-status");
  if (statusEl) {
    statusEl.className = "idiag-status " + (wrong ? "idiag-status-wrong" : "idiag-status-ok");
    statusEl.textContent = wrong
      ? `${wrong} point${wrong === 1 ? "" : "s"} need${wrong === 1 ? "s" : ""} attention — click a red point to revise it.`
      : "All points correct!";
  }

  if (!wrong) {
    idClosePopup();
    completedSlides.add(currentSlide);
    updateLockState();
    const done = document.getElementById("idiag-complete");
    if (done) {
      done.classList.remove("steps-complete-hidden");
      done.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}


// Keep the drawing aligned if the window is resized.
if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("resize", () => {
    const slide = (typeof moduleData !== "undefined") ? moduleData[currentSlide] : null;
    if (slide && slide.type === "interactive-diagram") idDrawAll();
  });
}


registerSlideType("interactive-diagram", {
  icon: "📝",
  render: renderInteractiveDiagram,
  isQuiz: true
});