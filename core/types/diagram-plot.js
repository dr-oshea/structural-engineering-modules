/* ============================================================================
   types/diagram-plot.js — draw shear force and bending moment diagrams.

   Students build a diagram SEGMENT by SEGMENT along the structure: click a
   segment, say what shape it is, which side the curve sits, and its values —
   and it is drawn, right or wrong. Check then flags each segment.

   ── WHY THIS ISN'T A GENERAL PLOTTER ──
   Diagrams are drawn as offsets PERPENDICULAR TO A MEMBER, not against a
   fixed x-y axis. That one decision means a beam and a frame use the same
   machinery: a beam is simply the case where every segment lies on one
   horizontal line. Nothing special is needed for frames.

   ── SLIDE FIELDS ──
     title, label            as usual
     image                   background: the structure, its loads and supports
     imageWidth / Height / Scale
     prompt                  HTML instructions
     checkText               Check button label
     successFeedback         optional note shown when everything is correct
     plots                   one or more diagrams (below)

   ── A PLOT ──
     { id: "bmd",
       title: "Bending Moment Diagram",
       unit:  "kNm",
       scale: 2.5,            // PIXELS PER UNIT — you choose it, so the
                              //   drawing is predictable and doesn't rescale
                              //   under the student as they type
       color: "#3f61c4",
       given: false,          // true → drawn FOR the student from the answer
                              //   key, with values labelled. Use it for
                              //   "here is the SFD, now draw the BMD".
       axis:  true,           // draw the datum line along the segments
       segments: [ … ] }

   Several plots may appear on one slide; each is independent. A `given` plot
   needs no work from the student and is never checked.

   ── A SEGMENT ──
     { ax: 10, ay: 70, bx: 35, by: 70,     // ends, as % of the image, ON the
                                           //   datum line for this plot
       label: "AB",
       answers: [[ { shape: "linear",
                     values: { side: "below", vA: 0, vB: 33 } } ]] }

   Segment ends are given in image percentages exactly like regions, so a
   frame's members can run in any direction.

   ── SHAPES (built in — nothing to declare) ──
     constant   value            one magnitude, flat
     linear     vA, vB           straight between two values
     quadratic  vA, vB, plus:
                  turning  "none" | "atA" | "atB" | "inside"
                  peak     (only when turning is "inside") the extreme value
                  bulge    (only when turning is "none") which way it curves

   The turning point is the pedagogically useful field: the BMD's slope equals
   the shear, so the turning point is where the shear crosses zero — the thing
   students are already hunting for. When it lies inside a segment its value
   IS the maximum moment.

   All values are MAGNITUDES; `side` says which side of the member the curve
   is drawn, which is how tension-side sketching is actually taught and is the
   only convention that means anything on a frame.
   ============================================================================ */


// ─── Built-in segment shapes ────────────────────────────────────────────────

const DP_SIDES = [
  { value: "above", label: "Above / left of the member" },
  { value: "below", label: "Below / right of the member" }
];

const DP_SHAPES = {
  constant: {
    label: "Constant",
    fields: [
      { id: "side",  label: "Which side?", type: "select", options: DP_SIDES },
      { id: "value", label: "Value",       type: "number", tolerance: 0.05 }
    ]
  },
  linear: {
    label: "Linear",
    fields: [
      { id: "side", label: "Which side?",  type: "select", options: DP_SIDES },
      { id: "vA",   label: "Value at A",   type: "number", tolerance: 0.05 },
      { id: "vB",   label: "Value at B",   type: "number", tolerance: 0.05 }
    ]
  },
  quadratic: {
    label: "Quadratic",
    fields: [
      { id: "side", label: "Which side?",  type: "select", options: DP_SIDES },
      { id: "vA",   label: "Value at A",   type: "number", tolerance: 0.05 },
      { id: "vB",   label: "Value at B",   type: "number", tolerance: 0.05 },
      { id: "turning", label: "Turning point", type: "select", options: [
          { value: "none",   label: "None in this segment" },
          { value: "atA",    label: "At end A" },
          { value: "atB",    label: "At end B" },
          { value: "inside", label: "Inside the segment" }
      ]},
      { id: "peak", label: "Value at the turning point", type: "number",
        tolerance: 0.05, showWhen: { turning: "inside" } },
      { id: "bulge", label: "Curves", type: "select",
        showWhen: { turning: "none" }, options: [
          { value: "out", label: "Away from the member" },
          { value: "in",  label: "Toward the member" }
      ]}
    ]
  }
};

// Fields that apply given the values chosen so far (handles showWhen).
function dpFields(shapeKey, values) {
  const shape = DP_SHAPES[shapeKey];
  if (!shape) return [];
  return shape.fields.filter(f => {
    if (!f.showWhen) return true;
    return Object.keys(f.showWhen).every(k => values[k] === f.showWhen[k]);
  });
}


// ─── The curve: y(t) for t in [0,1], in diagram units ──────────────────────

// Resolves a quadratic y(t) = a(t-t0)^2 + y0 from what the student declared.
// Returns null when the declaration is impossible (e.g. a "turning point"
// whose value lies between the two ends).
function dpResolveQuadratic(vA, vB, turning, peak, bulge) {
  if (turning === "atA") return { a: vB - vA, t0: 0, y0: vA };
  if (turning === "atB") return { a: vA - vB, t0: 1, y0: vB };

  if (turning === "inside") {
    const dA = vA - peak, dB = vB - peak;
    if (dA === 0 && dB === 0) return { a: 0, t0: 0.5, y0: peak };
    if (dA * dB < 0) return null;           // not an extremum — inconsistent
    const r  = Math.sqrt(Math.abs(dA) / (Math.abs(dB) || 1e-9));
    const t0 = r / (1 + r);
    const a  = t0 !== 0 ? dA / (t0 * t0) : dB / ((1 - t0) * (1 - t0));
    return { a, t0, y0: peak };
  }

  // "none" — vertex outside [0,1], so the curve is monotonic. Which side the
  // vertex sits determines the sign of `a`, i.e. which way it bows.
  const wantSign = (bulge === "in") ? -1 : 1;
  const dv = vB - vA;
  const t0 = (Math.sign(dv || 1) === wantSign) ? -0.4 : 1.4;
  const a  = dv / (1 - 2 * t0);
  return { a, t0, y0: vA - a * t0 * t0 };
}

// Value of a segment at parameter t (0 at end A, 1 at end B), in diagram units.
function dpValueAt(item, t) {
  const v = item.values;
  if (item.shape === "constant") return Number(v.value) || 0;
  const vA = Number(v.vA) || 0, vB = Number(v.vB) || 0;
  if (item.shape === "linear") return vA + (vB - vA) * t;

  const q = dpResolveQuadratic(vA, vB, v.turning, Number(v.peak) || 0, v.bulge);
  if (!q) return vA + (vB - vA) * t;        // fall back to a straight line
  return q.a * (t - q.t0) * (t - q.t0) + q.y0;
}


// ─── State ──────────────────────────────────────────────────────────────────
//   items[plotId][segIndex] = { shape, values }
//   status[plotId][segIndex] = "correct" | "wrong"
function dpState() {
  if (!slideState[currentSlide] || slideState[currentSlide].type !== "diagram-plot") {
    slideState[currentSlide] = {
      type: "diagram-plot", items: {}, status: {},
      open: null, addShape: null
    };
  }
  return slideState[currentSlide];
}

function dpItem(plotId, segIndex) {
  const st = dpState();
  if (!st.items[plotId]) st.items[plotId] = {};
  return st.items[plotId][segIndex] || null;
}

// A given plot's drawing comes from its answer key.
function dpEffectiveItem(plot, segIndex) {
  if (plot.given) {
    const ans = plot.segments[segIndex].answers;
    return (ans && ans[0] && ans[0][0]) ? ans[0][0] : null;
  }
  return dpItem(plot.id, segIndex);
}


// ─── Geometry ───────────────────────────────────────────────────────────────

function dpSegGeom(seg, w, h) {
  const ax = (seg.ax / 100) * w, ay = (seg.ay / 100) * h;
  const bx = (seg.bx / 100) * w, by = (seg.by / 100) * h;
  let vx = bx - ax, vy = by - ay;
  const len = Math.hypot(vx, vy) || 1;
  vx /= len; vy /= len;
  return { ax, ay, bx, by, len, dir: { x: vx, y: vy },
           // "above" is the normal obtained by rotating A→B by -90°
           normal: { x: vy, y: -vx } };
}


// ─── Render ─────────────────────────────────────────────────────────────────

function renderDiagramPlot(slide) {
  const st = dpState();

  renderLayout(`
    <h2>${slide.title}</h2>

    ${slide.prompt ? `<div class="info-block">${slide.prompt}</div>` : ""}

    <div class="idiag-stage dp-stage" id="idiag-stage" style="${imageSizeStyle(slide)}">
      <img src="${slide.image}" class="idiag-image" alt="${slide.title}"
           onload="dpDrawAll()">
      <svg class="idiag-canvas" id="dp-canvas" aria-hidden="true"></svg>
      <div class="idiag-popup idiag-popup-hidden" id="dp-popup"></div>
    </div>

    <div class="dp-legend">
      ${slide.plots.map(p => `
        <span class="dp-legend-item">
          <span class="dp-legend-swatch" style="background:${p.color || "#3f61c4"}"></span>
          ${p.title || p.id}${p.given ? ` <em>(given)</em>` : ""}
        </span>
      `).join("")}
    </div>

    <div class="idiag-actions">
      <button class="idiag-check-btn" onclick="dpCheck()">
        ${slide.checkText || "Check answers"}
      </button>
      <span class="idiag-status" id="dp-status"></span>
    </div>

    <div class="dp-messages" id="dp-messages"></div>

    <div class="steps-complete steps-complete-hidden" id="dp-complete">
      ${slide.completeText || "🎉 Diagram complete — every segment is correct!"}
    </div>

    ${slide.successFeedback ? `
      <div class="mcq-explanation mcq-explanation-hidden" id="dp-feedback">
        <span class="explanation-tick">✓</span>
        <span>${slide.successFeedback}</span>
      </div>
    ` : ""}
  `);

  dpDrawAll();
  if (completedSlides.has(currentSlide)) dpRevealSuccess(false);
}


// ─── Drawing ────────────────────────────────────────────────────────────────

function dpDrawAll() {
  const slide = moduleData[currentSlide];
  if (!slide || slide.type !== "diagram-plot") return;
  const stage  = document.getElementById("idiag-stage");
  const canvas = document.getElementById("dp-canvas");
  if (!stage || !canvas) return;

  const w = stage.clientWidth  || 800;
  const h = stage.clientHeight || 450;
  canvas.setAttribute("viewBox", `0 0 ${w} ${h}`);
  idCanvasW = w; idCanvasH = h; idPlacedLabels = [];

  const st = dpState();
  let body = `
    <defs>
      <marker id="dp-head" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"></path>
      </marker>
    </defs>`;

  slide.plots.forEach(plot => {
    const color = plot.color || "#3f61c4";
    plot.segments.forEach((seg, i) => {
      const g = dpSegGeom(seg, w, h);

      // Datum line
      if (plot.axis !== false) {
        body += `<line x1="${g.ax}" y1="${g.ay}" x2="${g.bx}" y2="${g.by}"
                       stroke="#94a3b8" stroke-width="1.5"></line>`;
      }

      const item = dpEffectiveItem(plot, i);
      const status = (st.status[plot.id] || {})[i];
      const open = st.open && st.open.plot === plot.id && st.open.seg === i;

      // Clickable strip (not for given plots)
      if (!plot.given) {
        const band = 26;
        const nx = g.normal.x * band, ny = g.normal.y * band;
        const pts = `${g.ax - nx},${g.ay - ny} ${g.bx - nx},${g.by - ny} `
                  + `${g.bx + nx},${g.by + ny} ${g.ax + nx},${g.ay + ny}`;
        const stroke = status === "correct" ? "#12a06a"
                     : status === "wrong"   ? "#ff635d"
                     : open                 ? "#ffdc00" : "#b9c6d4";
        body += `<polygon class="dp-seg" points="${pts}"
                          fill="${open ? "rgba(255,220,0,0.12)" : "rgba(63,97,196,0.04)"}"
                          stroke="${stroke}" stroke-width="1" stroke-dasharray="3 3"
                          onclick="dpOpenSegment('${plot.id}',${i})"></polygon>`;
      }

      // The curve itself
      if (item) body += dpDrawCurve(plot, seg, item, g, color);

      // Segment label at the midpoint of the datum
      if (seg.label) {
        const mx = (g.ax + g.bx) / 2, my = (g.ay + g.by) / 2;
        body += `<text x="${mx}" y="${my + 14}" class="dp-seg-label"
                       fill="#64748b" font-size="10" text-anchor="middle">${seg.label}</text>`;
      }
    });
  });

  canvas.innerHTML = body;
}

// One segment's curve, plus its end-value captions.
function dpDrawCurve(plot, seg, item, g, color) {
  const scale = plot.scale || 2;
  const side  = item.values.side === "above" ? 1 : -1;
  const n     = { x: g.normal.x * side, y: g.normal.y * side };

  const N = item.shape === "quadratic" ? 24 : 1;
  const pts = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    const v = dpValueAt(item, t);
    const px = g.ax + (g.bx - g.ax) * t + n.x * v * scale;
    const py = g.ay + (g.by - g.ay) * t + n.y * v * scale;
    pts.push([px, py]);
  }

  // Closed shape back to the datum, lightly filled — how BMDs are usually shown
  const poly = `${g.ax},${g.ay} ${pts.map(p => p.join(",")).join(" ")} ${g.bx},${g.by}`;
  let out = `<polygon points="${poly}" fill="${color}" fill-opacity="0.10"></polygon>
             <polyline points="${pts.map(p => p.join(",")).join(" ")}"
                       fill="none" stroke="${color}" stroke-width="2.5"></polyline>`;

  // Ordinates at the ends
  out += `<line x1="${g.ax}" y1="${g.ay}" x2="${pts[0][0]}" y2="${pts[0][1]}"
                stroke="${color}" stroke-width="1.5"></line>
          <line x1="${g.bx}" y1="${g.by}" x2="${pts[N][0]}" y2="${pts[N][1]}"
                stroke="${color}" stroke-width="1.5"></line>`;

  // Captions: end values, plus the turning-point value when it's inside
  const unit = plot.unit ? ` ${plot.unit}` : "";
  const vA = dpValueAt(item, 0), vB = dpValueAt(item, 1);
  const cap = (p, v) => `<text ${idLabelPlacement(p[0], p[1], -n.x, -n.y,
                                 `${dpFmt(v)}${unit}`)} fill="${color}"
                         >${dpFmt(v)}${unit}</text>`;
  out += cap(pts[0], vA);
  if (Math.abs(vB - vA) > 1e-9 || item.shape === "constant") out += cap(pts[N], vB);

  if (item.shape === "quadratic" && item.values.turning === "inside") {
    const q = dpResolveQuadratic(Number(item.values.vA) || 0, Number(item.values.vB) || 0,
                                 "inside", Number(item.values.peak) || 0, null);
    if (q && q.t0 > 0 && q.t0 < 1) {
      const k = Math.round(q.t0 * N);
      out += cap(pts[k], dpValueAt(item, q.t0));
    }
  }
  return out;
}

function dpFmt(v) {
  const r = Math.round(v * 100) / 100;
  return String(r);
}


// ─── Popup ──────────────────────────────────────────────────────────────────

function dpOpenSegment(plotId, segIndex, keepForm) {
  const slide = moduleData[currentSlide];
  const plot  = slide.plots.find(p => p.id === plotId);
  if (!plot || plot.given) return;

  const st = dpState();
  st.open = { plot: plotId, seg: segIndex };
  if (!keepForm) st.addShape = null;

  const existing = dpItem(plotId, segIndex);
  const shapeKey = st.addShape || (existing && existing.shape) || null;
  const values   = (existing && existing.shape === shapeKey) ? existing.values : {};
  const seg      = plot.segments[segIndex];

  const popup = document.getElementById("dp-popup");
  if (!popup) return;

  popup.innerHTML = `
    <div class="idiag-popup-head">
      <span class="idiag-popup-title">${plot.title || plot.id} · ${seg.label || `Segment ${segIndex + 1}`}</span>
      <button class="idiag-popup-close" onclick="dpClosePopup()" aria-label="Close">×</button>
    </div>

    ${existing ? `
      <div class="idiag-item">
        <span class="idiag-item-text">${dpItemSummary(plot, existing)}</span>
        <button class="idiag-item-del" onclick="dpClearSegment()" title="Clear">×</button>
      </div>` : ""}

    ${shapeKey === null ? `
      <div class="idiag-add">
        <span class="idiag-add-label">Shape:</span>
        ${Object.keys(DP_SHAPES).map(k => `
          <button class="idiag-add-btn" onclick="dpChooseShape('${k}')">${DP_SHAPES[k].label}</button>
        `).join("")}
      </div>` : `
      <form class="idiag-form" onsubmit="return false;">
        <div class="idiag-form-type">${DP_SHAPES[shapeKey].label}</div>
        ${dpFields(shapeKey, dpReadForm(shapeKey, values)).map(f =>
            idFieldHTML(f, values[f.id])).join("")}
        <div class="idiag-form-actions">
          <button class="idiag-enter-btn"  onclick="dpSubmit()">Enter</button>
          <button class="idiag-cancel-btn" onclick="dpCancel()">Cancel</button>
        </div>
      </form>`}
  `;

  popup.classList.remove("idiag-popup-hidden");
  dpPositionPopup(plot, segIndex);
  dpDrawAll();
  typesetMath(popup);
}

// Reads whatever is currently in the form, falling back to stored values —
// needed so conditional fields (showWhen) appear as soon as a choice is made.
function dpReadForm(shapeKey, fallback) {
  const out = Object.assign({}, fallback);
  (DP_SHAPES[shapeKey].fields || []).forEach(f => {
    const el = document.getElementById(`idiag-f-${f.id}`);
    if (el && el.value !== "") out[f.id] = el.value;
  });
  return out;
}

function dpItemSummary(plot, item) {
  const unit = plot.unit ? ` ${plot.unit}` : "";
  const v = item.values;
  const sideTxt = v.side === "above" ? "above" : "below";
  if (item.shape === "constant") return `<strong>Constant</strong> · ${sideTxt} · ${v.value}${unit}`;
  let s = `<strong>${DP_SHAPES[item.shape].label}</strong> · ${sideTxt} · ${v.vA}${unit} → ${v.vB}${unit}`;
  if (item.shape === "quadratic" && v.turning === "inside") s += ` · peak ${v.peak}${unit}`;
  return s;
}

function dpPositionPopup(plot, segIndex) {
  const popup = document.getElementById("dp-popup");
  const stage = document.getElementById("idiag-stage");
  const seg   = plot.segments[segIndex];
  if (!popup || !stage) return;

  popup.style.right = "auto"; popup.style.bottom = "auto";
  popup.style.left = "0px";   popup.style.top = "0px";

  const sw = stage.clientWidth || 800, sh = stage.clientHeight || 450;
  const cx = ((seg.ax + seg.bx) / 2 / 100) * sw;
  const cy = ((seg.ay + seg.by) / 2 / 100) * sh;

  const footer  = document.querySelector(".nav-footer");
  const footerH = footer ? footer.offsetHeight : 0;
  const viewH   = (typeof window !== "undefined" && window.innerHeight) || 800;
  const edge = 10, bottomLimit = viewH - footerH - edge;
  popup.style.maxHeight = `${Math.max(160, bottomLimit - edge)}px`;

  const pw = popup.offsetWidth || 280, ph = popup.offsetHeight || 240;
  const gap = 24, margin = 6;
  let left = (cx > sw / 2) ? cx - gap - pw : cx + gap;
  let top  = (cy > sh / 2) ? cy - gap - ph : cy + gap * 0.7;
  left = Math.max(margin, Math.min(left, sw - pw - margin));
  top  = Math.max(margin, Math.min(top,  sh - ph - margin));

  const stageTop = stage.getBoundingClientRect ? stage.getBoundingClientRect().top : 0;
  const over = (stageTop + top + ph) - bottomLimit;
  if (over > 0) top -= over;
  const under = edge - (stageTop + top);
  if (under > 0) top += under;

  popup.style.left = `${left}px`;
  popup.style.top  = `${top}px`;
}

function dpChooseShape(key) {
  const st = dpState();
  st.addShape = key;
  dpOpenSegment(st.open.plot, st.open.seg, true);
}

function dpCancel() {
  const st = dpState();
  st.addShape = null;
  dpOpenSegment(st.open.plot, st.open.seg, false);
}

function dpClosePopup() {
  const st = dpState();
  st.open = null; st.addShape = null;
  const popup = document.getElementById("dp-popup");
  if (popup) popup.classList.add("idiag-popup-hidden");
  dpDrawAll();
}

function dpClearSegment() {
  const st = dpState();
  const { plot, seg } = st.open;
  if (st.items[plot]) delete st.items[plot][seg];
  if (st.status[plot]) delete st.status[plot][seg];
  st.addShape = null;
  dpOpenSegment(plot, seg, false);
}

function dpSubmit() {
  const st = dpState();
  const { plot: plotId, seg } = st.open;
  const slide = moduleData[currentSlide];
  const plot  = slide.plots.find(p => p.id === plotId);
  const existing = dpItem(plotId, seg);
  const shapeKey = st.addShape || (existing && existing.shape);

  // Read the visible fields only, so a hidden conditional isn't demanded
  const partial = dpReadForm(shapeKey, {});
  const values = {};
  for (const f of dpFields(shapeKey, partial)) {
    const el = document.getElementById(`idiag-f-${f.id}`);
    if (!el) continue;
    if (el.value === "") { triggerBuzz(el); return; }
    values[f.id] = (f.type === "number") ? parseFloat(el.value) : el.value;
    if (f.type === "number" && isNaN(values[f.id])) { triggerBuzz(el); return; }
  }

  if (!st.items[plotId]) st.items[plotId] = {};
  st.items[plotId][seg] = { shape: shapeKey, values };
  if (st.status[plotId]) delete st.status[plotId][seg];

  st.addShape = null;
  dpOpenSegment(plotId, seg, false);
}


// ─── Checking ───────────────────────────────────────────────────────────────

// Which fields of a segment differ from the expected answer?
// Returns [] when it matches, or a list of field labels that don't.
function dpFieldsWrong(shapeKey, entered, expected) {
  const wrong = [];
  for (const f of dpFields(shapeKey, expected)) {
    const xv = expected[f.id];
    if (xv === undefined) continue;
    const ev = entered[f.id];
    let ok;
    if (f.type === "number") {
      const tol = f.tolerance !== undefined ? f.tolerance : 0.01;
      ok = !isNaN(ev) && Math.abs(ev - xv) <= tol;
    } else {
      ok = ev === xv;
    }
    if (!ok) wrong.push(f.label || f.id);
  }
  return wrong;
}

// Best (fewest mismatches) comparison against any acceptable answer.
function dpSegmentVerdict(plot, segIndex) {
  const seg = plot.segments[segIndex];
  const entered = dpItem(plot.id, segIndex);
  const sets = seg.answers || [];

  if (!entered) return { ok: false, reason: "nothing drawn yet" };

  let best = null;
  for (const set of sets) {
    const exp = set[0];
    if (!exp) continue;
    if (entered.shape !== exp.shape) {
      if (!best) best = { ok: false, reason: "the shape isn't right" };
      continue;
    }
    const wrong = dpFieldsWrong(entered.shape, entered.values, exp.values);
    if (!wrong.length) return { ok: true };
    if (!best || best.fields === undefined || wrong.length < best.fields.length) {
      best = { ok: false, fields: wrong,
               reason: wrong.length === 1 ? `${wrong[0]} is incorrect`
                                          : `${wrong.join(" and ")} are incorrect` };
    }
  }
  return best || { ok: false, reason: "the shape isn't right" };
}

function dpCheck() {
  const slide = moduleData[currentSlide];
  const st    = dpState();
  const notes = [];
  let wrong = 0;

  slide.plots.forEach(plot => {
    if (plot.given) return;                       // nothing to mark
    if (!st.status[plot.id]) st.status[plot.id] = {};
    plot.segments.forEach((seg, i) => {
      const v = dpSegmentVerdict(plot, i);
      st.status[plot.id][i] = v.ok ? "correct" : "wrong";
      if (!v.ok) {
        wrong++;
        notes.push(`<li><strong>${plot.title || plot.id} · ${seg.label || `segment ${i + 1}`}</strong> — ${v.reason}.</li>`);
      }
    });
  });

  dpDrawAll();

  const statusEl = document.getElementById("dp-status");
  if (statusEl) {
    statusEl.className = "idiag-status " + (wrong ? "idiag-status-wrong" : "idiag-status-ok");
    statusEl.textContent = wrong
      ? `${wrong} segment${wrong === 1 ? "" : "s"} need${wrong === 1 ? "s" : ""} attention.`
      : "All segments correct!";
  }

  // Say WHICH segment and WHICH field — without giving the value away
  const msgs = document.getElementById("dp-messages");
  if (msgs) {
    msgs.innerHTML = wrong ? `<ul class="dp-message-list">${notes.join("")}</ul>` : "";
  }

  if (!wrong) {
    dpClosePopup();
    completedSlides.add(currentSlide);
    updateLockState();
    dpRevealSuccess(true);
  }
}

function dpRevealSuccess(scroll) {
  const done = document.getElementById("dp-complete");
  if (done) done.classList.remove("steps-complete-hidden");
  const fb = document.getElementById("dp-feedback");
  if (fb) { fb.classList.remove("mcq-explanation-hidden"); typesetMath(fb); }
  const target = fb || done;
  if (scroll && target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("resize", () => {
    const slide = (typeof moduleData !== "undefined") ? moduleData[currentSlide] : null;
    if (slide && slide.type === "diagram-plot") dpDrawAll();
  });
}


registerSlideType("diagram-plot", {
  icon: "📝",
  render: renderDiagramPlot,
  isQuiz: true
});