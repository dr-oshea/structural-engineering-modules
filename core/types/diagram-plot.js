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

// Default wording for every field. Override per plot with `labels: { … }` —
// "Value at A" often wants to read "Moment at the left end of BC".
const DP_LABELS = {
  shape:    "What shape is this segment?",
  side:     "Which side of the datum?",
  sideA:    "Side at A",
  sideB:    "Side at B",
  value:    "Value",
  vA:       "Value at A",
  vB:       "Value at B",
  turning:  "Turning point",
  peakAt:   "Position of the turning point",
  peak:     "Value at the turning point",
  peakSide: "Side at the turning point",
  bulge:    "Which way does it curve?",
  pageA:    "End A",
  pageB:    "End B",
  pageTurn: "Turning point"
};

function dpLabel(plot, key) {
  return (plot && plot.labels && plot.labels[key]) || DP_LABELS[key];
}

// The two side choices. Set per SEGMENT (`sides: […]`), falling back to the
// plot, then to the defaults — so one segment can say "tension on top /
// tension underneath" while another says "left / right of the column".
function dpSideOptions(plot, seg) {
  return (seg && seg.sides) || (plot && plot.sides) || DP_SIDES;
}

// How a student expresses which side of the datum a value falls.
//   "signed"   type the number, sign and all      (natural for an SFD)
//   "segment"  magnitudes + ONE side per segment  (tension-side BMD, default)
//   "ends"     a magnitude AND a side per end     (segment changes side)
function dpSideMode(plot) {
  if (plot.signed) return "signed";
  return plot.sideMode || "segment";
}

// What the student is asked about a turning point that lies INSIDE a segment.
//   "both"      (default) position AND value — a quadratic is fitted through
//               the three points, so the two can never contradict each other:
//               inconsistent numbers simply draw a slightly different curve,
//               and Check says which field is off
//   "location"  position only — the value follows and is shown
//   "value"     value only — the position follows
function dpTurningInput(plot) {
  return plot.turningInput || "both";
}

// The problem-unit range a segment covers, or null when it was positioned by
// raw coordinates (a frame member given ax/ay/bx/by directly).
function dpSegUnits(plot, i) {
  const seg = plot.segments[i];
  if (seg.from !== undefined && seg.to !== undefined) return [seg.from, seg.to];
  if (plot.breaks && plot.breaks.length > i + 1) return [plot.breaks[i], plot.breaks[i + 1]];
  return null;
}

// ─── Shapes and their form pages ────────────────────────────────────────────
//
// The form is PAGED rather than one long column: shape, then end A, then end
// B, then the turning point. Each page asks two or three things, so it never
// grows past the window however complex the segment is.

const DP_SHAPES = {
  constant: {
    label: "Constant",
    pages: ["shape", "A"],
    fields: [
      { id: "side",  page: "A", key: "side",  type: "select", modes: ["segment", "ends"] },
      { id: "value", page: "A", key: "value", type: "number", tolerance: 0.05 }
    ]
  },
  linear: {
    label: "Linear",
    pages: ["shape", "A", "B"],
    fields: [
      { id: "side",  page: "A", key: "side",  type: "select", modes: ["segment"] },
      { id: "sideA", page: "A", key: "sideA", type: "select", modes: ["ends"] },
      { id: "vA",    page: "A", key: "vA",    type: "number", tolerance: 0.05 },
      { id: "sideB", page: "B", key: "sideB", type: "select", modes: ["ends"] },
      { id: "vB",    page: "B", key: "vB",    type: "number", tolerance: 0.05 }
    ]
  },
  quadratic: {
    label: "Quadratic",
    pages: ["shape", "A", "B", "turn"],
    fields: [
      { id: "side",  page: "A", key: "side",  type: "select", modes: ["segment"] },
      { id: "sideA", page: "A", key: "sideA", type: "select", modes: ["ends"] },
      { id: "vA",    page: "A", key: "vA",    type: "number", tolerance: 0.05 },
      { id: "sideB", page: "B", key: "sideB", type: "select", modes: ["ends"] },
      { id: "vB",    page: "B", key: "vB",    type: "number", tolerance: 0.05 },

      { id: "turning", page: "turn", key: "turning", type: "select", options: [
          { value: "none",   label: "Not within this segment" },
          { value: "atA",    label: "At end A" },
          { value: "atB",    label: "At end B" },
          { value: "inside", label: "Between A and B" }
      ]},
      { id: "peakAt",   page: "turn", key: "peakAt",   type: "number",
        tolerance: 0.05, showWhen: { turning: "inside" }, turningInputs: ["both", "location"] },
      { id: "peakSide", page: "turn", key: "peakSide", type: "select",
        modes: ["ends"], showWhen: { turning: "inside" }, turningInputs: ["both", "value"] },
      { id: "peak",     page: "turn", key: "peak",     type: "number",
        tolerance: 0.05, showWhen: { turning: "inside" }, turningInputs: ["both", "value"] },
      { id: "bulge",    page: "turn", key: "bulge",    type: "select",
        showWhen: { turning: "none" }, options: [
          { value: "out", label: "Away from the datum" },
          { value: "in",  label: "Toward the datum" }
      ]}
    ]
  }
};

// Every field that applies, with its wording and options resolved.
function dpFields(shapeKey, values, plot, seg) {
  const shape = DP_SHAPES[shapeKey];
  if (!shape) return [];
  const mode = dpSideMode(plot || {});
  const ti   = dpTurningInput(plot || {});

  return shape.fields.filter(f => {
    if (f.modes && f.modes.indexOf(mode) === -1) return false;
    if (f.turningInputs && f.turningInputs.indexOf(ti) === -1) return false;
    if (!f.showWhen) return true;
    return Object.keys(f.showWhen).every(k => values[k] === f.showWhen[k]);
  }).map(f => Object.assign({}, f, {
    label:   dpLabel(plot, f.key),
    options: f.options || dpSideOptions(plot, seg),
    unit:    (f.id === "peakAt") ? (plot && plot.positionUnit) || "m"
                                 : (plot && plot.unit)
  }));
}

// Which pages this shape actually needs, given the side-mode and turning input.
function dpPagesFor(shapeKey, values, plot, seg) {
  const shape = DP_SHAPES[shapeKey];
  if (!shape) return ["shape"];
  return shape.pages.filter(p =>
    p === "shape" || dpFields(shapeKey, values, plot, seg).some(f => f.page === p));
}

// Is this plot locked behind another one being right?
function dpPlotLocked(slide, plot) {
  if (!plot.requires) return false;
  const req = slide.plots.find(p => p.id === plot.requires);
  if (!req || req.given) return false;
  const st = dpState();
  return !req.segments.every((s, i) => ((st.status[req.id] || {})[i]) === "correct");
}

// Every input method reduces to one convention: positive = ABOVE the datum.
function dpSignedValues(plot, item) {
  const mode = dpSideMode(plot);
  const v = item.values;
  const sgn = (s) => (s === "below" ? -1 : 1);

  if (mode === "signed") {
    const ps = (plot.positiveSide === "below") ? -1 : 1;
    return { vA: (Number(v.vA) || 0) * ps, vB: (Number(v.vB) || 0) * ps,
             value: (Number(v.value) || 0) * ps, peak: (Number(v.peak) || 0) * ps };
  }

  // Magnitudes: the SIDE alone decides direction, so a stray minus can't flip it
  const mag = (n) => Math.abs(Number(n) || 0);

  if (mode === "ends") {
    return {
      vA:    mag(v.vA)    * sgn(v.sideA),
      vB:    mag(v.vB)    * sgn(v.sideB),
      value: mag(v.value) * sgn(v.side),
      peak:  mag(v.peak)  * sgn(v.peakSide || v.sideA)
    };
  }
  const s = sgn(v.side);
  return { vA: mag(v.vA) * s, vB: mag(v.vB) * s,
           value: mag(v.value) * s, peak: mag(v.peak) * s };
}


// ─── The curve ──────────────────────────────────────────────────────────────
//
// Every shape reduces to y(t) = a t² + b t + c on t ∈ [0,1], with t = 0 at end
// A and t = 1 at end B, and y positive ABOVE the datum.
//
// The quadratic is pinned differently depending on what the student was asked:
//
//   turning "atA" / "atB"   vertex at that end — two end values are enough
//   turning "none"          vertex outside the segment; `bulge` says which way
//   turning "inside", and then:
//       "both"       fitted through THREE points (A, the turning point, B).
//                    Always well defined, so position and value can never
//                    contradict each other — inconsistent numbers just draw a
//                    slightly different curve, and Check names the field.
//       "location"   vertex forced to the stated position; the value follows
//       "value"      vertex value stated; the position follows
function dpQuadCoeffs(vA, vB, values, plot, unitRange) {
  const turning = values.turning;

  if (turning === "atA") return { a: vB - vA, b: 0, c: vA };
  if (turning === "atB") return { a: vA - vB, b: 2 * (vB - vA), c: vA };

  if (turning === "inside") {
    const ti = dpTurningInput(plot);

    // Stated position, as a fraction of the segment
    let t0 = null;
    if (values.peakAt !== undefined && values.peakAt !== "") {
      if (unitRange) {
        const [u0, u1] = unitRange;
        t0 = (Number(values.peakAt) - u0) / ((u1 - u0) || 1);
      } else {
        t0 = Number(values.peakAt);          // already a fraction
      }
    }
    const peak = dpSignedValues(plot, { values }).peak;

    if (ti === "location" && t0 !== null) {
      const den = 1 - 2 * t0;                // vertex at t0 → b = −2 a t0
      const a = Math.abs(den) < 1e-9 ? 0 : (vB - vA) / den;
      return { a, b: -2 * a * t0, c: vA };
    }

    if (ti === "both" && t0 !== null && t0 > 1e-6 && t0 < 1 - 1e-6) {
      const a = (peak - vA - (vB - vA) * t0) / (t0 * t0 - t0);   // 3-point fit
      return { a, b: (vB - vA) - a, c: vA };
    }

    // "value" (or no position given): derive the vertex from the values
    const dA = vA - peak, dB = vB - peak;
    if (dA * dB >= 0 && !(dA === 0 && dB === 0)) {
      const r  = Math.sqrt(Math.abs(dA) / (Math.abs(dB) || 1e-9));
      const tv = r / (1 + r);
      const a  = tv !== 0 ? dA / (tv * tv) : dB / ((1 - tv) * (1 - tv));
      return { a, b: -2 * a * tv, c: vA };
    }
    return { a: 0, b: vB - vA, c: vA };       // inconsistent → straight line
  }

  // "none" — vertex outside [0,1], so the curve is monotonic; `bulge` decides
  // which side of the segment it sits and therefore which way the curve bows.
  const wantSign = (values.bulge === "in") ? -1 : 1;
  const dv = vB - vA;
  const t0 = (Math.sign(dv || 1) === wantSign) ? -0.4 : 1.4;
  const a  = dv / (1 - 2 * t0);
  return { a, b: -2 * a * t0, c: vA };
}

// Value of a segment at parameter t, SIGNED (positive = above the datum).
function dpValueAt(item, t, plot, unitRange) {
  const s = dpSignedValues(plot || {}, item);
  if (item.shape === "constant") return s.value;
  if (item.shape === "linear")   return s.vA + (s.vB - s.vA) * t;
  const q = dpQuadCoeffs(s.vA, s.vB, item.values, plot || {}, unitRange);
  return q.a * t * t + q.b * t + q.c;
}

// Where the drawn curve actually turns, as a fraction (null if outside).
function dpTurningT(item, plot, unitRange) {
  const s = dpSignedValues(plot || {}, item);
  if (item.shape !== "quadratic") return null;
  const q = dpQuadCoeffs(s.vA, s.vB, item.values, plot || {}, unitRange);
  if (Math.abs(q.a) < 1e-9) return null;
  const t = -q.b / (2 * q.a);
  return (t > 0.02 && t < 0.98) ? t : null;
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

// Where does segment `i` of this plot start and end, as image percentages?
//
// Either state them on the segment (ax, ay, bx, by), OR — much easier — give
// the plot an `axis` (the datum line), a `span` in problem units, and the
// `breaks` between segments. The engine then positions every segment along
// the axis for you, so nothing has to be eyeballed and the segments can never
// drift out of line with each other.
//
//   axis:   { ax: 10, ay: 46, bx: 90, by: 46 }
//   span:   [0, 8]            // the beam runs 0 → 8 m across that axis
//   breaks: [0, 4, 8]         // segment boundaries, in metres
function dpSegEnds(plot, i) {
  const seg = plot.segments[i];
  if (seg.ax !== undefined) return seg;          // stated explicitly

  // ── A FRAME: several named axes, one per member ──
  // Declare them once and point each segment at the member it belongs to:
  //
  //   axes: {
  //     col: { ax: 15, ay: 80, bx: 15, by: 30, span: [0, 5] },   // a column
  //     bm:  { ax: 15, ay: 30, bx: 85, by: 30, span: [0, 7] }    // the beam
  //   },
  //   segments: [
  //     { axis: "col", from: 0, to: 5, label: "AB", … },
  //     { axis: "bm",  from: 0, to: 4, label: "BC", … }
  //   ]
  //
  // Each member keeps its own local coordinate, so a column measured from its
  // base and a beam measured from its left end both read naturally.
  if (seg.axis && plot.axes && plot.axes[seg.axis]) {
    const ax = plot.axes[seg.axis];
    const sp = ax.span || plot.span || [0, 1];
    const f  = (u) => (u - sp[0]) / ((sp[1] - sp[0]) || 1);
    const at = (t) => ({ x: ax.ax + (ax.bx - ax.ax) * t,
                         y: ax.ay + (ax.by - ax.ay) * t });
    const p0 = at(f(seg.from)), p1 = at(f(seg.to));
    return { ax: p0.x, ay: p0.y, bx: p1.x, by: p1.y };
  }

  // ── A BEAM: one axis, with breakpoints along it ──
  const ax = plot.axis, sp = plot.span, br = plot.breaks;
  if (!ax || !sp || !br) return { ax: 0, ay: 0, bx: 0, by: 0 };

  const f = (u) => (u - sp[0]) / ((sp[1] - sp[0]) || 1);   // unit → 0..1
  const at = (t) => ({ x: ax.ax + (ax.bx - ax.ax) * t,
                       y: ax.ay + (ax.by - ax.ay) * t });
  const p0 = at(f(br[i])), p1 = at(f(br[i + 1]));
  return { ax: p0.x, ay: p0.y, bx: p1.x, by: p1.y };
}

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
    const locked = dpPlotLocked(slide, plot);
    plot.segments.forEach((seg, i) => {
      const g = dpSegGeom(dpSegEnds(plot, i), w, h);

      // Datum line
      if (plot.axis !== false) {
        body += `<line x1="${g.ax}" y1="${g.ay}" x2="${g.bx}" y2="${g.by}"
                       stroke="#94a3b8" stroke-width="1.5"></line>`;
      }

      const item  = dpEffectiveItem(plot, i);
      const units = dpSegUnits(plot, i);
      const status = (st.status[plot.id] || {})[i];
      const open = st.open && st.open.plot === plot.id && st.open.seg === i;

      // Clickable strip (not for given plots, not while locked).
      //
      //   hitStyle: "box"  (default) a dashed box `hitBand` px either side
      //   hitStyle: "line"          just the datum, thickened invisibly so
      //                             it's still easy to click
      //   hitBand:  half-thickness in px (default 26)
      if (!plot.given && !locked) {
        const band   = plot.hitBand !== undefined ? plot.hitBand : 26;
        const stroke = status === "correct" ? "#12a06a"
                     : status === "wrong"   ? "#ff635d"
                     : open                 ? "#ffdc00" : "#b9c6d4";

        if (plot.hitStyle === "line" || band === 0) {
          const hit = Math.max(band, 12);      // generous click target
          body += `<line class="dp-seg dp-seg-line"
                         x1="${g.ax}" y1="${g.ay}" x2="${g.bx}" y2="${g.by}"
                         stroke="${status || open ? stroke : "transparent"}"
                         stroke-opacity="${status || open ? 0.9 : 1}"
                         stroke-width="${hit}" stroke-linecap="round"
                         onclick="dpOpenSegment('${plot.id}',${i})"></line>`;
        } else {
          const nx = g.normal.x * band, ny = g.normal.y * band;
          const pts = `${g.ax - nx},${g.ay - ny} ${g.bx - nx},${g.by - ny} `
                    + `${g.bx + nx},${g.by + ny} ${g.ax + nx},${g.ay + ny}`;
          body += `<polygon class="dp-seg" points="${pts}"
                            fill="${open ? "rgba(255,220,0,0.12)" : "rgba(63,97,196,0.04)"}"
                            stroke="${stroke}" stroke-width="1" stroke-dasharray="3 3"
                            onclick="dpOpenSegment('${plot.id}',${i})"></polygon>`;
        }
      }

      // The curve itself
      if (item) body += dpDrawCurve(plot, seg, item, g, color, units);

      // Locked note, once, at the middle of the first segment
      if (locked && i === 0) {
        const mx = (g.ax + g.bx) / 2, my = (g.ay + g.by) / 2;
        const req = slide.plots.find(p => p.id === plot.requires);
        body += `<text x="${mx}" y="${my - 10}" fill="#94a3b8" font-size="11"
                       text-anchor="middle">🔒 Complete the ${
                         (req && (req.title || req.id)) || "previous diagram"
                       } first</text>`;
      }

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
function dpDrawCurve(plot, seg, item, g, color, units) {
  const scale = plot.scale || 2;
  // SIGNED plot: values carry their own sign, so one segment can cross the
  // datum — a shear line running +18 to −6 draws as a single straight line
  // with the zero crossing falling out of the geometry, exactly as it should.
  // SIDE plot: values are magnitudes and the student states the side, which
  // is how tension-side sketching is taught.
  // Values arrive in one convention (positive = above the datum), so the
  // normal is used as-is. `positiveSide` was already applied where it belongs,
  // inside dpSignedValues, and only for signed plots.
  const n = { x: g.normal.x, y: g.normal.y };

  const N = item.shape === "quadratic" ? 24 : 1;
  const pts = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    const v = dpValueAt(item, t, plot, units);
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
  const vA = dpValueAt(item, 0, plot, units), vB = dpValueAt(item, 1, plot, units);
  const cap = (p, v) => `<text ${idLabelPlacement(p[0], p[1], -n.x, -n.y,
                                 `${dpFmt(v)}${unit}`)} fill="${color}"
                         >${dpFmt(v)}${unit}</text>`;
  out += cap(pts[0], vA);
  if (Math.abs(vB - vA) > 1e-9 || item.shape === "constant") out += cap(pts[N], vB);

  // Caption the turning point wherever the drawn curve actually turns
  const tT = dpTurningT(item, plot, units);
  if (tT !== null) {
    const k = Math.round(tT * N);
    out += cap(pts[k], dpValueAt(item, tT, plot, units));
  }
  return out;
}

// Captions show the MAGNITUDE — which side of the datum the curve sits
// already conveys the sign, and "−6 kN" drawn below the axis reads as a
// double negative.
function dpFmt(v) {
  return String(Math.round(Math.abs(v) * 100) / 100);
}


// ─── Popup: a PAGED form ────────────────────────────────────────────────────
//
// One question at a time — shape, then end A, then end B, then the turning
// point — with ‹ › to move between them and Enter on the last. A long form
// therefore never grows past the window, which is what made the old
// single-column version unusable once a turning point was added.

function dpOpenSegment(plotId, segIndex, keepForm) {
  const slide = moduleData[currentSlide];
  const plot  = slide.plots.find(p => p.id === plotId);
  if (!plot || plot.given) return;
  if (dpPlotLocked(slide, plot)) return;

  const st = dpState();
  const changedTarget = !st.open || st.open.plot !== plotId || st.open.seg !== segIndex;
  st.open = { plot: plotId, seg: segIndex };
  if (!keepForm || changedTarget) {
    st.addShape = null;
    st.page = 0;
    st.draft = null;
  }

  const existing = dpItem(plotId, segIndex);
  const shapeKey = st.addShape || (existing && existing.shape) || null;
  if (!st.draft) {
    st.draft = (existing && existing.shape === shapeKey)
      ? Object.assign({}, existing.values) : {};
  }

  const seg   = plot.segments[segIndex];
  const popup = document.getElementById("dp-popup");
  if (!popup) return;

  const pages = shapeKey ? dpPagesFor(shapeKey, st.draft, plot, seg) : ["shape"];
  if (st.page >= pages.length) st.page = pages.length - 1;
  const page  = pages[st.page];
  const last  = st.page === pages.length - 1;

  const pageTitle = page === "shape" ? dpLabel(plot, "shape")
                  : page === "A"     ? dpLabel(plot, "pageA")
                  : page === "B"     ? dpLabel(plot, "pageB")
                                     : dpLabel(plot, "pageTurn");

  let bodyHTML;
  if (page === "shape") {
    bodyHTML = `
      <div class="idiag-add dp-shape-choice">
        ${Object.keys(DP_SHAPES).map(k => `
          <button class="idiag-add-btn ${shapeKey === k ? "dp-shape-on" : ""}"
                  onclick="dpChooseShape('${k}')">${DP_SHAPES[k].label}</button>
        `).join("")}
      </div>`;
  } else {
    const fields = dpFields(shapeKey, st.draft, plot, seg).filter(f => f.page === page);
    bodyHTML = `<form class="idiag-form" onsubmit="return false;">
                  ${fields.map(f => idFieldHTML(f, st.draft[f.id])).join("")}
                </form>`;
  }

  popup.innerHTML = `
    <div class="idiag-popup-head">
      <span class="idiag-popup-title">${plot.title || plot.id} · ${seg.label || `Segment ${segIndex + 1}`}</span>
      <button class="idiag-popup-close" onclick="dpClosePopup()" aria-label="Close">×</button>
    </div>

    ${hintHTML(seg, "idRepositionOpenPopup()")}

    ${existing && page === "shape" ? `
      <div class="idiag-item">
        <span class="idiag-item-text">${dpItemSummary(plot, existing)}</span>
        <button class="idiag-item-del" onclick="dpClearSegment()" title="Clear">×</button>
      </div>` : ""}

    <div class="dp-page-head">
      <span class="dp-page-title">${pageTitle}</span>
      ${shapeKey ? `<span class="dp-page-count">${st.page + 1} of ${pages.length}</span>` : ""}
    </div>

    ${bodyHTML}

    <div class="dp-form-note" id="dp-form-note"></div>

    <div class="dp-nav">
      <button class="dp-nav-btn" onclick="dpPagePrev()"
              ${st.page === 0 ? "disabled" : ""} title="Back">‹</button>
      ${last
        ? `<button class="idiag-enter-btn dp-nav-enter" onclick="dpSubmit()"
                   ${shapeKey ? "" : "disabled"}>Enter</button>`
        : `<button class="idiag-enter-btn dp-nav-enter" onclick="dpPageNext()">Next ›</button>`}
      <button class="idiag-cancel-btn dp-nav-cancel" onclick="dpCancel()">Cancel</button>
    </div>
  `;

  popup.classList.remove("idiag-popup-hidden");
  dpPositionPopup(plot, segIndex);
  dpDrawAll();
  typesetMath(popup);
}

// Reads the fields currently on screen into the draft.
function dpCapturePage() {
  const st = dpState();
  const slide = moduleData[currentSlide];
  const plot  = slide.plots.find(p => p.id === st.open.plot);
  const seg   = plot.segments[st.open.seg];
  const shapeKey = st.addShape || (dpItem(st.open.plot, st.open.seg) || {}).shape;
  if (!shapeKey) return;

  dpFields(shapeKey, st.draft, plot, seg).forEach(f => {
    const el = document.getElementById(`idiag-f-${f.id}`);
    if (el && el.value !== "") {
      st.draft[f.id] = (f.type === "number") ? parseFloat(el.value) : el.value;
    }
  });
}

// Validates the page on screen; returns an error message, or null if it's fine.
function dpValidatePage() {
  const st = dpState();
  const slide = moduleData[currentSlide];
  const plot  = slide.plots.find(p => p.id === st.open.plot);
  const seg   = plot.segments[st.open.seg];
  const shapeKey = st.addShape || (dpItem(st.open.plot, st.open.seg) || {}).shape;
  if (!shapeKey) return null;

  const pages = dpPagesFor(shapeKey, st.draft, plot, seg);
  const page  = pages[st.page];
  if (page === "shape") return null;

  const fields = dpFields(shapeKey, st.draft, plot, seg).filter(f => f.page === page);
  const units  = dpSegUnits(plot, st.open.seg);

  for (const f of fields) {
    const el = document.getElementById(`idiag-f-${f.id}`);
    if (!el) continue;
    if (el.value === "") { triggerBuzz(el); return "Please complete this page."; }

    if (f.type === "number") {
      const n = parseFloat(el.value);
      if (isNaN(n)) { triggerBuzz(el); return "That isn't a number."; }

      // Magnitudes are positive; the side field says which way it goes
      if (f.id !== "peakAt" && dpSideMode(plot) !== "signed" && n < 0) {
        triggerBuzz(el);
        return "Enter a magnitude — the side is chosen separately.";
      }
      // A turning point must lie inside its own segment
      if (f.id === "peakAt" && units) {
        const lo = Math.min(units[0], units[1]), hi = Math.max(units[0], units[1]);
        if (n < lo || n > hi) {
          triggerBuzz(el);
          return `The turning point must lie between ${lo} and ${hi}.`;
        }
      }
    }
  }
  return null;
}

function dpPageNext() {
  const err = dpValidatePage();
  if (err) { dpFormNote(err); return; }
  dpCapturePage();
  const st = dpState();
  st.page += 1;
  dpOpenSegment(st.open.plot, st.open.seg, true);
}

function dpPagePrev() {
  dpCapturePage();
  const st = dpState();
  if (st.page > 0) st.page -= 1;
  dpOpenSegment(st.open.plot, st.open.seg, true);
}

// A short message inside the form (validation, not marking).
function dpFormNote(msg) {
  const el = document.getElementById("dp-form-note");
  if (el) el.textContent = msg || "";
}

function dpChooseShape(key) {
  const st = dpState();
  if (st.addShape !== key) st.draft = {};      // different shape, fresh answers
  st.addShape = key;
  st.page = 1;                                  // straight on to end A
  dpOpenSegment(st.open.plot, st.open.seg, true);
}

function dpItemSummary(plot, item) {
  const unit = plot.unit ? ` ${plot.unit}` : "";
  const v = item.values;
  const sideTxt = (s) => (s === "above" ? "above" : "below");
  if (item.shape === "constant")
    return `<strong>Constant</strong> · ${sideTxt(v.side)} · ${v.value}${unit}`;
  let s = `<strong>${DP_SHAPES[item.shape].label}</strong> · `
        + `${v.vA}${unit} (${sideTxt(v.sideA || v.side)}) → `
        + `${v.vB}${unit} (${sideTxt(v.sideB || v.side)})`;
  if (item.shape === "quadratic" && v.turning === "inside") {
    if (v.peakAt !== undefined) s += ` · turns at ${v.peakAt}`;
    if (v.peak   !== undefined) s += ` · ${v.peak}${unit}`;
  }
  return s;
}

function dpPositionPopup(plot, segIndex) {
  const popup = document.getElementById("dp-popup");
  const stage = document.getElementById("idiag-stage");
  if (!popup || !stage) return;

  popup.style.right = "auto"; popup.style.bottom = "auto";
  popup.style.left = "0px";   popup.style.top = "0px";

  const ends = dpSegEnds(plot, segIndex);
  const sw = stage.clientWidth || 800, sh = stage.clientHeight || 450;
  const cx = ((ends.ax + ends.bx) / 2 / 100) * sw;
  const cy = ((ends.ay + ends.by) / 2 / 100) * sh;

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

function dpCancel() {
  const st = dpState();
  st.addShape = null; st.draft = null; st.page = 0;
  dpClosePopup();
}

function dpClosePopup() {
  const st = dpState();
  st.open = null; st.addShape = null; st.draft = null; st.page = 0;
  const popup = document.getElementById("dp-popup");
  if (popup) popup.classList.add("idiag-popup-hidden");
  dpDrawAll();
}

function dpClearSegment() {
  const st = dpState();
  const { plot, seg } = st.open;
  if (st.items[plot]) delete st.items[plot][seg];
  if (st.status[plot]) delete st.status[plot][seg];
  st.addShape = null; st.draft = {}; st.page = 0;
  dpOpenSegment(plot, seg, true);
}

function dpSubmit() {
  const err = dpValidatePage();
  if (err) { dpFormNote(err); return; }
  dpCapturePage();

  const st = dpState();
  const { plot: plotId, seg } = st.open;
  const shapeKey = st.addShape || (dpItem(plotId, seg) || {}).shape;
  if (!shapeKey) return;

  if (!st.items[plotId]) st.items[plotId] = {};
  st.items[plotId][seg] = { shape: shapeKey, values: Object.assign({}, st.draft) };
  if (st.status[plotId]) delete st.status[plotId][seg];

  dpClosePopup();     // close so the student can see what they drew
}


// ─── Checking ───────────────────────────────────────────────────────────────

// Which fields of a segment differ from the expected answer?
// Returns [] when it matches, or a list of field labels that don't.
function dpFieldsWrong(shapeKey, entered, expected, plot, seg) {
  const wrong = [];
  for (const f of dpFields(shapeKey, expected, plot, seg)) {
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
    const wrong = dpFieldsWrong(entered.shape, entered.values, exp.values, plot, seg);
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

  // Which plots were available BEFORE this check? A plot that unlocks as a
  // result of this very check shouldn't be marked wrong for being empty.
  const wasOpen = {};
  slide.plots.forEach(p => { wasOpen[p.id] = !p.given && !dpPlotLocked(slide, p); });

  slide.plots.forEach(plot => {
    if (plot.given) return;                       // nothing to mark
    if (!wasOpen[plot.id]) return;                // wasn't open to them yet
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

  // A plot that was locked when Check ran hasn't been marked, so it isn't
  // "wrong" — but the slide certainly isn't finished either. Only complete
  // when every non-given segment has actually been marked correct.
  const allDone = slide.plots.every(plot =>
    plot.given || plot.segments.every((s, i) =>
      ((st.status[plot.id] || {})[i]) === "correct"));

  if (!wrong && allDone) {
    dpClosePopup();
    completedSlides.add(currentSlide);
    updateLockState();
    dpRevealSuccess(true);
  } else if (!wrong && !allDone) {
    // The gating plot just passed — the next one is now open
    if (statusEl) {
      statusEl.className = "idiag-status idiag-status-ok";
      statusEl.textContent = "Correct — the next diagram is now unlocked.";
    }
    dpDrawAll();
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