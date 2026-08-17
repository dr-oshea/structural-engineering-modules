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


// ─── Targets: nodes and regions ─────────────────────────────────────────────
//
// A NODE is a point — forces and moments attach to it.
// A REGION is a span between two points ON the structure, with a signed box
// height extending off it. Distributed loads attach to a region, and because
// the region carries an orientation, a UDL on an inclined member draws
// correctly without any extra configuration.
//
// Both are addressed by a single index: nodes come first, then regions, so
// node indices are unchanged and every mechanism (state, popup, Check) works
// for both without special cases.
function idTargets(slide) {
  const nodes   = (slide.nodes   || []).map(n => Object.assign({ kind: "node"   }, n));
  const regions = (slide.regions || []).map(r => Object.assign({ kind: "region" }, r));
  return nodes.concat(regions);
}

// Geometry of a region in canvas pixels.
//   a, b     endpoints on the structure
//   dir      unit vector A → B
//   normal   unit vector the box extends along (sign follows `height`)
//   maxLen   how far the box extends (|height|)
function idRegionGeom(region, w, h) {
  const ax = (region.ax / 100) * w, ay = (region.ay / 100) * h;
  const bx = (region.bx / 100) * w, by = (region.by / 100) * h;
  let vx = bx - ax, vy = by - ay;
  const len = Math.hypot(vx, vy) || 1;
  vx /= len; vy /= len;
  // Rotate A→B by -90° so a left-to-right member's positive normal points up
  let nx = vy, ny = -vx;
  const height = region.height !== undefined ? region.height : 40;
  if (height < 0) { nx = -nx; ny = -ny; }
  return {
    ax, ay, bx, by, len,
    dir: { x: vx, y: vy },
    normal: { x: nx, y: ny },
    maxLen: Math.abs(height)
  };
}

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
      ${idTargets(slide).map((t, i) => t.kind !== "node" ? "" : `
        <button class="idiag-node" id="idiag-node-${i}"
                style="left:${t.x}%; top:${t.y}%;"
                onclick="idOpenNode(${i})"
                aria-label="${t.title || t.label || `Point ${i + 1}`}">
          ${t.label !== undefined ? t.label : i + 1}
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
      ${slide.completeText || "🎉 Diagram complete — every point is correct!"}
    </div>

    ${slide.successFeedback ? `
      <div class="mcq-explanation mcq-explanation-hidden" id="idiag-feedback">
        <span class="explanation-tick">✓</span>
        <span>${slide.successFeedback}</span>
      </div>
    ` : ""}
  `);

  idRefreshNodes();
  idDrawAll();
  if (st.openNode !== null) idOpenNode(st.openNode, true);
  if (completedSlides.has(currentSlide)) idRevealSuccess(false);
}


// ─── Node markers ───────────────────────────────────────────────────────────

function idRefreshNodes() {
  const slide = moduleData[currentSlide];
  const st    = idState();
  idTargets(slide).forEach((n, i) => {
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



// `keepForm` keeps the current form state (used when re-rendering the panel
// after choosing a type, editing, or submitting). Positioning is always
// recomputed — see the note further down.
function idOpenNode(nodeIndex, keepForm) {
  const slide = moduleData[currentSlide];
  const st    = idState();
  const node  = idTargets(slide)[nodeIndex];

  st.openNode = nodeIndex;
  if (!keepForm) { st.editing = null; st.addType = null; }

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
      <button class="idiag-popup-close" onclick="idClosePopup()" aria-label="Close">×</button>
    </div>

    ${hintHTML(node, "idRepositionOpenPopup()")}

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

  // ALWAYS reposition. The panel's height changes every time its contents do
  // — the Add menu is short, an item form is tall — and a position computed
  // for the old height is exactly what pushes the form under the footer.
  // The preferred side is derived from the target, so this doesn't make the
  // panel jump about; it just re-clamps to the new size.
  idPositionPopup(nodeIndex);
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

// Places the popup beside its target, then MEASURES it and pulls it back so
// the whole panel stays inside the diagram area. Positioning by percentages
// alone can't do this — the panel's own size isn't known until it's rendered,
// so it could slide under the sidebar or off the top. We therefore set a
// provisional position, measure, and correct.
function idPositionPopup(nodeIndex) {
  const slide = moduleData[currentSlide];
  const popup = document.getElementById("idiag-popup");
  const stage = document.getElementById("idiag-stage");
  const node  = idTargets(slide)[nodeIndex];
  if (!popup || !stage || !node) return;

  // Work in pixels relative to the stage; clear any earlier anchoring
  popup.style.right  = "auto";
  popup.style.bottom = "auto";
  popup.style.left   = "0px";
  popup.style.top    = "0px";

  const sw = stage.clientWidth  || 800;
  const sh = stage.clientHeight || 450;

  // ── How much of the window is actually usable? ──
  // The nav footer is FIXED, so it paints over the slide: anything the popup
  // puts underneath it is invisible and unreachable. Subtract its height (and
  // leave a margin) before deciding how tall the panel may be or where it sits.
  const footer   = document.querySelector(".nav-footer");
  const footerH  = footer ? footer.offsetHeight : 0;
  const viewH    = (typeof window !== "undefined" && window.innerHeight) || 800;
  const edge     = 10;
  const topLimit    = edge;                       // viewport coords
  const bottomLimit = viewH - footerH - edge;     // viewport coords

  // Cap the panel so it can never be taller than the usable strip; a long
  // form then scrolls inside itself instead of running under the footer.
  popup.style.maxHeight = `${Math.max(160, bottomLimit - topLimit)}px`;

  // Regions anchor from their midpoint
  const cxPct = node.kind === "region" ? (node.ax + node.bx) / 2 : node.x;
  const cyPct = node.kind === "region" ? (node.ay + node.by) / 2 : node.y;
  const cx = (cxPct / 100) * sw;
  const cy = (cyPct / 100) * sh;

  // Now that it's rendered and capped we can measure it
  const pw = popup.offsetWidth  || 280;
  const ph = popup.offsetHeight || 220;

  const gap = 24, margin = 6;

  // Prefer whichever side of the target has more room
  let left = (cx > sw / 2) ? cx - gap - pw : cx + gap;
  let top  = (cy > sh / 2) ? cy - gap - ph : cy + gap * 0.7;

  // Keep the whole panel inside the stage horizontally
  left = Math.max(margin, Math.min(left, sw - pw - margin));
  top  = Math.max(margin, Math.min(top,  sh - ph - margin));

  // ── Then correct vertically against the WINDOW, not just the stage ──
  // Convert to viewport coordinates, push the panel up off the footer, and
  // make sure that didn't drive it off the top.
  const stageTop = stage.getBoundingClientRect
                   ? stage.getBoundingClientRect().top : 0;
  const overshoot = (stageTop + top + ph) - bottomLimit;
  if (overshoot > 0) top -= overshoot;
  const shortfall = topLimit - (stageTop + top);
  if (shortfall > 0) top += shortfall;

  popup.style.left = `${left}px`;
  popup.style.top  = `${top}px`;
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

  // Close the panel so the student can see what they just drew. To add
  // another item at the same point, they click the node again.
  idClosePopup();
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

// Node markers are 30px across, so drawings start ~18px out from the centre.
// This stops arrowheads disappearing underneath the marker.
const IDIAG_NODE_GAP = 18;

// Canvas size for the current draw pass — label placement needs it to stay
// inside the diagram (drawings are clipped, so a label that strays is lost).
let idCanvasW = 0, idCanvasH = 0;

// Captions placed so far in this draw pass, so a new one can avoid landing on
// an existing one. Reset at the start of every idDrawAll().
let idPlacedLabels = [];

// Places a caption near a drawing, keeping it inside the canvas AND clear of
// captions already drawn.
//
//   x, y     the preferred anchor point (already computed by the caller)
//   dx, dy   the drawing's direction, used to push the label away from it
//   text     the caption, for width estimation
//   opts     { exact: true } to use x,y as given rather than offsetting along
//            the direction — used by moments, whose caller already knows where
//            it wants the label.
//
// Returns the attributes for an SVG <text>.
function idLabelPlacement(x, y, dx, dy, text, opts) {
  opts = opts || {};
  const fontSize = 13;
  const pad      = 4;
  const halfW    = (String(text).length * fontSize * 0.52) / 2;
  const lineH    = fontSize + 5;

  let lx, ly;
  if (opts.exact) {
    lx = x; ly = y;
  } else {
    // Just beyond the tail, then pushed clear of the line itself:
    //   horizontal arrows  → lift the label above the shaft
    //   vertical arrows    → shift it to the side of the shaft
    // (Sitting a caption on its own arrow makes both hard to read.)
    const horizontal = Math.abs(dx) > Math.abs(dy);
    lx = x - dx * 12;
    ly = y - dy * 12;
    if (horizontal) {
      ly -= 10;
    } else {
      // Move to whichever side has more room
      const toRight = x < idCanvasW / 2;
      lx += (toRight ? 1 : -1) * (halfW + 10);
      ly += 4;                       // optically centre against the shaft
    }
  }

  const clamp = () => {
    let anchor = "middle";
    if (lx - halfW < pad) {
      lx = pad; anchor = "start";
    } else if (lx + halfW > idCanvasW - pad) {
      lx = idCanvasW - pad; anchor = "end";
    }
    const topLimit = pad + fontSize;
    if (ly < topLimit)             ly = topLimit;
    else if (ly > idCanvasH - pad) ly = idCanvasH - pad;
    return anchor;
  };

  let anchor = clamp();

  // Box for the position we'd like
  const boxOf = () => {
    const left = anchor === "start" ? lx : anchor === "end" ? lx - 2 * halfW : lx - halfW;
    return { left, right: left + 2 * halfW, top: ly - fontSize, bottom: ly + 3 };
  };
  const hits = (a, b) => !(a.right < b.left || a.left > b.right ||
                           a.bottom < b.top || a.top > b.bottom);

  // If it lands on an existing caption, step it away — alternating up and
  // down, growing each time — then re-clamp and re-test.
  const baseY = ly;
  for (let attempt = 1; attempt <= 6; attempt++) {
    if (!idPlacedLabels.some(b => hits(boxOf(), b))) break;
    const step = Math.ceil(attempt / 2) * lineH;
    ly = baseY + (attempt % 2 === 1 ? -step : step);
    anchor = clamp();
  }

  idPlacedLabels.push(boxOf());
  return `x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="${fontSize}"`;
}

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
  idCanvasW = w; idCanvasH = h;   // label placement needs these

  // Seed the collision list with the node markers, so captions step around
  // them just as they step around each other.
  idPlacedLabels = idTargets(slide)
    .filter(n => n.kind === "node")
    .map(n => {
      const cx = (n.x / 100) * w, cy = (n.y / 100) * h;
      const rad = IDIAG_NODE_GAP;
      return { left: cx - rad, right: cx + rad, top: cy - rad, bottom: cy + rad };
    });

  const st = idState();
  let defs = `
    <defs>
      <marker id="idiag-head" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"></path>
      </marker>
    </defs>`;
  let body = "";

  const targets = idTargets(slide);

  // Region outlines first, so items draw on top of them
  targets.forEach((t, i) => {
    if (t.kind !== "region") return;
    body += idDrawRegionOutline(t, i, idRegionGeom(t, w, h), st);
  });

  targets.forEach((t, i) => {
    const items = st.items[i] || [];
    if (t.kind === "region") {
      const g = idRegionGeom(t, w, h);
      items.forEach(item => { body += idDrawSpanItem(slide, item, g); });
    } else {
      const px = (t.x / 100) * w, py = (t.y / 100) * h;
      items.forEach(item => { body += idDrawItem(slide, item, px, py); });
    }
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
    const r    = Math.max(s.radius || 26, IDIAG_NODE_GAP + 6);   // clear the marker
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
      ${label ? `<text ${idLabelPlacement(px, py - r - 10, 0, -1, label, { exact: true })}
                       fill="${color}">${label}</text>` : ""}`;
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
    const gap = s.gap !== undefined ? s.gap : IDIAG_NODE_GAP;
    for (let k = 0; k < count; k++) {
      const t  = (k / (count - 1) - 0.5) * width;
      const hx = px + ox * t - dx * gap, hy = py + oy * t - dy * gap;
      const bx = hx - dx * len,          by = hy - dy * len;
      out += `<line x1="${bx}" y1="${by}" x2="${hx}" y2="${hy}"
                    stroke="${color}" stroke-width="2"
                    marker-end="url(#idiag-head)"></line>`;
    }
    const spanOff = len + gap;
    out += `<line x1="${px + ox * (-width / 2) - dx * spanOff}" y1="${py + oy * (-width / 2) - dy * spanOff}"
                  x2="${px + ox * ( width / 2) - dx * spanOff}" y2="${py + oy * ( width / 2) - dy * spanOff}"
                  stroke="${color}" stroke-width="2"></line>`;
    if (label) out += `<text ${idLabelPlacement(px - dx * spanOff, py - dy * spanOff, dx, dy, label)}
                             fill="${color}">${label}</text>`;
    return out;
  }

  // Default: arrow
  const angle = (s.angle !== undefined ? s.angle : 270) * Math.PI / 180;
  const len   = s.length || 70;
  // Keep clear of the node marker so the arrowhead isn't hidden beneath it
  const gap = s.gap !== undefined ? s.gap : IDIAG_NODE_GAP;
  const dx = Math.cos(angle), dy = Math.sin(angle);
  let x1, y1, x2, y2;
  if (s.anchor === "tail") {           // starts beside the node, points away
    x1 = px + dx * gap; y1 = py + dy * gap;
    x2 = x1 + dx * len; y2 = y1 + dy * len;
  } else {                              // default: head stops just short of it
    x2 = px - dx * gap; y2 = py - dy * gap;
    x1 = x2 - dx * len; y1 = y2 - dy * len;
  }
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="${color}" stroke-width="2.5"
          marker-end="url(#idiag-head)"></line>
    ${label ? `<text ${idLabelPlacement(x1, y1, dx, dy, label)}
                     fill="${color}">${label}</text>` : ""}`;
}


// Dashed box marking a clickable region, rotated to the member's orientation,
// with small A / B markers so the student knows which end is which when they
// enter start and end magnitudes.
function idDrawRegionOutline(region, index, g, st) {
  const status = st.status[index];
  const open   = st.openNode === index;
  const filled = (st.items[index] || []).length > 0;

  const stroke = status === "correct" ? "#12a06a"
               : status === "wrong"   ? "#ff635d"
               : open                 ? "#ffdc00"
               : filled               ? "#4a5568" : "#8aa0b8";
  const fill   = status === "correct" ? "rgba(26,201,135,0.08)"
               : status === "wrong"   ? "rgba(255,99,93,0.08)"
               : open                 ? "rgba(255,220,0,0.14)"
                                      : "rgba(63,97,196,0.05)";

  const { ax, ay, bx, by, normal, maxLen } = g;
  const ox = normal.x * maxLen, oy = normal.y * maxLen;
  const pts = `${ax},${ay} ${bx},${by} ${bx + ox},${by + oy} ${ax + ox},${ay + oy}`;

  // A / B markers sit just outside each end, along the member line
  const ex = g.dir.x * 12, ey = g.dir.y * 12;
  const mx = normal.x * (maxLen * 0.5), my = normal.y * (maxLen * 0.5);

  return `
    <polygon class="idiag-region" points="${pts}"
             fill="${fill}" stroke="${stroke}" stroke-width="1"
             stroke-dasharray="3 3" rx="6"
             onclick="idOpenNode(${index})"></polygon>
    <text x="${ax - ex + mx}" y="${ay - ey + my}" class="idiag-region-end"
          fill="${stroke}" font-size="11" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">A</text>
    <text x="${bx + ex + mx}" y="${by + ey + my}" class="idiag-region-end"
          fill="${stroke}" font-size="11" font-weight="700"
          text-anchor="middle" dominant-baseline="middle">B</text>`;
}


// Draws a distributed load across a region.
//
// The draw spec names which value fields hold the magnitudes:
//     draw: { shape: "spanLoad", mag: "w" }                 uniform
//     draw: { shape: "spanLoad", magStart: "wA", magEnd: "wB" }   varying
//
// Arrow lengths are proportional to the magnitudes (the larger end fills the
// region box), so a triangular load tapers correctly and a zero end draws as
// zero. A uniform load gets ONE centred caption; a varying load is labelled at
// both ends.
function idDrawSpanItem(slide, item, g) {
  const s     = idDrawSpec(slide, item);
  const color = s.color || "#c62828";
  const type  = slide.itemTypes[item.itemType] || {};

  // Magnitudes at each end
  let wA, wB;
  if (s.mag !== undefined) {
    wA = wB = Number(item.values[s.mag]);
  } else {
    wA = Number(item.values[s.magStart]);
    wB = Number(item.values[s.magEnd]);
  }
  if (isNaN(wA)) wA = 0;
  if (isNaN(wB)) wB = 0;

  // Which way do the arrows point?
  //   "perp"  → back toward the member from the box side (the default)
  //   "down"/"up"/"left"/"right" → absolute, for inclined members
  const ABS = { down: {x:0,y:1}, up: {x:0,y:-1}, left: {x:-1,y:0}, right: {x:1,y:0} };
  const u = ABS[s.loadDir] || { x: -g.normal.x, y: -g.normal.y };

  const wRef = Math.max(Math.abs(wA), Math.abs(wB)) || 1;
  const count = Math.max(3, Math.min(9, Math.round(g.len / 45) + 2));

  let out = "";
  const tails = [];
  for (let k = 0; k < count; k++) {
    const t  = count === 1 ? 0 : k / (count - 1);
    const px = g.ax + (g.bx - g.ax) * t;
    const py = g.ay + (g.by - g.ay) * t;
    const w  = wA + (wB - wA) * t;
    const L  = g.maxLen * (Math.abs(w) / wRef);
    const tx = px - u.x * L, ty = py - u.y * L;
    tails.push([tx, ty]);
    if (L > 2) {
      out += `<line x1="${tx}" y1="${ty}" x2="${px}" y2="${py}"
                    stroke="${color}" stroke-width="2"
                    marker-end="url(#idiag-head)"></line>`;
    }
  }

  // Line joining the arrow tails — the load's profile
  out += `<polyline points="${tails.map(p => p.join(",")).join(" ")}"
                    fill="none" stroke="${color}" stroke-width="2"></polyline>`;

  // Captions: one in the middle when uniform, one per end when varying
  const fmt = (v) => (type.labelTemplate || "{v}")
                       .replace(/\{(\w+)\}/g, (_, k) =>
                          k === "v" ? v : (item.values[k] !== undefined ? item.values[k] : v));
  if (wA === wB) {
    const mid = tails[Math.floor(tails.length / 2)];
    out += `<text ${idLabelPlacement(mid[0] - u.x * 12, mid[1] - u.y * 12,
                                     u.x, u.y, fmt(wA))} fill="${color}">${fmt(wA)}</text>`;
  } else {
    const a = tails[0], b = tails[tails.length - 1];
    out += `<text ${idLabelPlacement(a[0] - u.x * 10, a[1] - u.y * 10, u.x, u.y, fmt(wA))}
                  fill="${color}">${fmt(wA)}</text>`;
    out += `<text ${idLabelPlacement(b[0] - u.x * 10, b[1] - u.y * 10, u.x, u.y, fmt(wB))}
                  fill="${color}">${fmt(wB)}</text>`;
  }

  return out;
}


// ─── Checking ───────────────────────────────────────────────────────────────

// Acceptable answer sets for a node (supports `answer` shorthand).
function idNodeAnswers(node) {
  if (Array.isArray(node.answers)) return node.answers;
  if (Array.isArray(node.answer))  return [node.answer];
  return [[]];
}

// Does one entered item match one expected item?
// How strictly is each field checked?
//
//   OMIT the field from `values`   → accept ANYTHING the student enters.
//     This is the supported way to leave a field free — the form still
//     requires it to be filled in, it just isn't marked against. Use it for
//     things like a reaction's variable name, where any label is valid.
//
//   Give an ARRAY                  → accept any ONE of those values.
//     e.g.  values: { dir: ["up", "down"] }   — either sense will do.
//
//   Give a single value            → must match (numbers within `tolerance`,
//                                    text trimmed and case-insensitive).
function idFieldMatches(f, ev, xv) {
  if (xv === undefined) return true;              // unconstrained — anything goes
  if (Array.isArray(xv)) return xv.some(v => idFieldMatches(f, ev, v));

  if (f.type === "number") {
    const tol = f.tolerance !== undefined ? f.tolerance : 0.01;
    return !isNaN(ev) && Math.abs(ev - xv) <= tol;
  }
  if (f.type === "text") {
    return String(ev).trim().toLowerCase() === String(xv).trim().toLowerCase();
  }
  return ev === xv;
}

function idItemMatches(slide, entered, expected) {
  if (entered.itemType !== expected.itemType) return false;
  const type = slide.itemTypes[expected.itemType] || {};
  for (const f of (type.fields || [])) {
    if (!idFieldMatches(f, entered.values[f.id], expected.values[f.id])) return false;
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
  return idNodeAnswers(idTargets(slide)[nodeIndex])
           .some(set => idSetMatches(slide, entered, set));
}

function idCheck() {
  const slide = moduleData[currentSlide];
  const st    = idState();
  let wrong = 0;

  idTargets(slide).forEach((n, i) => {
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
    idRevealSuccess(true);
  }
}


// Shows the completion banner and, if the author supplied one, the extra
// feedback note beneath it.
function idRevealSuccess(scroll) {
  const done = document.getElementById("idiag-complete");
  if (done) done.classList.remove("steps-complete-hidden");

  const fb = document.getElementById("idiag-feedback");
  if (fb) {
    fb.classList.remove("mcq-explanation-hidden");
    typesetMath(fb);              // the note may contain LaTeX
  }

  const target = fb || done;
  if (scroll && target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
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