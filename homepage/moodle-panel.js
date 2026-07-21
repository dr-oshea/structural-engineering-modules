/* ============================================================================
   homepage/moodle-panel.js — "Before You Begin" HTML generator.

   buildMoodlePanel(courseCode, options) returns a self-contained HTML string
   (all styles inline) to paste into a Moodle "Text and media area". It shows:
     1. Prerequisite courses  → each with its linked refresh modules
     2. The current course     → a "start here" bubble
     3. Future courses         → where this course leads (forward edges)

   Everything is derived from COURSE_GRAPH + CATALOG, so it generalises to any
   course. Requires prerequisites.js + catalog.js to be loaded first.

   options:
     moduleBaseUrl  URL prefix each module links to. A module links to
                    `${moduleBaseUrl}${folder}/index.html`. Default is the
                    GitHub Pages base below — change to your host.
     courseParam    optional ?course= value appended to module links so that
                    completion records against the right offering.
     studentParam   usually left blank here (Moodle can't know it at paste
                    time); the homepage handles per-student links instead.
   ============================================================================ */

const DEFAULT_MODULE_BASE =
  "https://dr-oshea.github.io/structural-engineering-modules/";

// UNSW palette (mirrors the module theme; inline because Moodle strips <style>)
const MP = {
  yellow: "#ffdc00", black: "#000000", white: "#ffffff",
  indigo: "#3f61c4", teal: "#007882", orange: "#ff8200",
  green:  "#1ac987", grey:  "#666666", greyBox: "#f2f2f2",
  border: "#e6e6e6", text: "#1a1a1a",
  fontHeading: "'Clancy','Roboto',Arial,sans-serif",
  fontBody:    "'Roboto',Arial,sans-serif",
  fontMono:    "'Roboto Mono','Courier New',monospace"
};

function buildMoodlePanel(courseCode, options) {
  options = options || {};
  const base    = options.moduleBaseUrl || DEFAULT_MODULE_BASE;
  const course  = COURSE_GRAPH[courseCode];
  if (!course) return `<!-- Unknown course: ${courseCode} -->`;

  const courseSuffix = options.courseParam
    ? `?course=${encodeURIComponent(options.courseParam)}` : "";

  // ── module <li> link (or a plain, unlinked item if module not in catalog) ──
  const moduleLink = (id) => {
    const m = catalogModule(id);
    if (!m) return "";
    const href = `${base}${m.folder}/index.html${courseSuffix}`;
    return `<li style="margin:4px 0;">`
         + `<a href="${href}" target="_blank" rel="noopener noreferrer" `
         + `style="color:${MP.indigo};text-decoration:none;border-bottom:1px solid ${MP.yellow};">`
         + `${m.title}</a></li>`;
  };

  // ── one prerequisite bubble (expandable) with its refresh modules ──
  const prereqBubble = (code, openFirst) => {
    const node = COURSE_GRAPH[code];
    if (!node) return "";
    const modIds = getModuleIdsTaughtBy(code);
    const items  = modIds.map(moduleLink).join("") ||
      `<li style="color:${MP.grey};list-style:none;margin-left:-18px;">`
      + `Modules coming soon.</li>`;

    return `
    <details style="flex:1 1 320px;min-width:300px;max-width:520px;"${openFirst ? " open" : ""}>
      <summary style="list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;
        padding:12px 16px;background:${MP.white};border:1px solid ${MP.border};border-radius:9999px;
        box-shadow:0 4px 10px rgba(0,0,0,.06);font-family:${MP.fontBody};color:${MP.text};font-weight:700;">
        <span style="display:inline-block;background:${MP.teal};color:${MP.white};border-radius:9999px;
          padding:4px 10px;font-size:.72rem;font-weight:700;letter-spacing:.06em;">PREREQ</span>
        <span>${code} – ${node.name}</span>
        <span style="margin-left:auto;color:${MP.grey};font-weight:600;font-size:.85rem;">Expand ▾</span>
      </summary>
      <div style="margin-top:12px;background:${MP.greyBox};border:1px solid ${MP.border};
        border-left:4px solid ${MP.teal};border-radius:8px;padding:12px 16px;">
        <div style="font-weight:700;color:${MP.teal};margin:0 0 6px;font-size:.9rem;">Refresh modules:</div>
        <ul style="margin:0;padding-left:18px;line-height:1.5;font-size:.92rem;">${items}</ul>
      </div>
    </details>`;
  };

  // ── future course pill (no expander — just a signpost) ──
  const futurePill = (code) => {
    const node = COURSE_GRAPH[code];
    if (!node) return "";
    return `
    <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:${MP.white};
      border:1px solid ${MP.border};border-radius:9999px;box-shadow:0 3px 8px rgba(0,0,0,.05);
      font-family:${MP.fontBody};color:${MP.grey};font-weight:600;font-size:.92rem;">
      <span style="display:inline-block;background:${MP.grey};color:${MP.white};border-radius:9999px;
        padding:3px 10px;font-size:.68rem;font-weight:700;letter-spacing:.06em;">NEXT</span>
      ${code} – ${node.name}
    </div>`;
  };

  const prereqs   = (course.requires || []);
  const futures   = getDirectDescendants(courseCode);
  const sectionH2 = (txt) => `
    <h3 style="font-family:${MP.fontHeading};text-align:center;color:${MP.indigo};
      margin:28px 0 16px;font-size:1.35rem;letter-spacing:.2px;font-weight:600;">${txt}</h3>`;

  // ── assemble ──
  return `
<div style="background:${MP.greyBox};padding:40px 24px;">
  <div style="font-family:${MP.fontBody};color:${MP.text};line-height:1.6;max-width:980px;margin:0 auto;">

    <!-- Hero -->
    <div style="background:${MP.white};border:1px solid ${MP.border};border-radius:10px;
      box-shadow:0 4px 20px rgba(0,0,0,.06);overflow:hidden;">
      <div style="position:relative;padding:34px 40px 28px;background:${MP.white};
        border-left:6px solid ${MP.yellow};overflow:hidden;">
        <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;
          background:${MP.yellow};transform:rotate(20deg);opacity:.9;"></div>
        <p style="margin:0 0 8px;font-family:${MP.fontMono};font-size:.72rem;font-weight:500;
          letter-spacing:.16em;text-transform:uppercase;color:${MP.indigo};position:relative;">
          UNSW School of Civil and Environmental Engineering</p>
        <h2 style="margin:0;font-family:${MP.fontHeading};font-size:2.2rem;font-weight:600;
          letter-spacing:-.02em;color:${MP.black};line-height:1.1;position:relative;">
          Welcome to ${courseCode}</h2>
        <p style="margin:8px 0 0;font-size:.9rem;letter-spacing:.05em;color:${MP.grey};
          text-transform:uppercase;position:relative;">${course.name}</p>
      </div>
      <div style="padding:22px 40px 26px;">
        <p style="font-size:1.02rem;color:${MP.text};margin:0;">
          This course builds on core structural mechanics and analysis. Use the scaffold
          below to refresh assumed knowledge, see what this course covers, and understand
          where it leads next.</p>
      </div>
    </div>

    ${sectionH2("1. What you need to know")}
    <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin-bottom:10px;">
      ${prereqs.length
        ? prereqs.map((c, i) => prereqBubble(c, i === 0)).join("")
        : `<p style="color:${MP.grey};">No formal prerequisites recorded.</p>`}
    </div>

    ${sectionH2("2. What you will learn")}
    <div style="display:flex;justify-content:center;margin-bottom:6px;">
      <div style="display:flex;align-items:center;gap:10px;padding:12px 18px;background:${MP.white};
        border:1px solid ${MP.border};border-radius:9999px;box-shadow:0 4px 10px rgba(0,0,0,.06);
        font-family:${MP.fontBody};color:${MP.text};font-weight:700;min-width:300px;max-width:720px;">
        <span style="display:inline-block;background:${MP.orange};color:${MP.white};border-radius:9999px;
          padding:4px 10px;font-size:.72rem;font-weight:700;letter-spacing:.06em;">CURRENT</span>
        <span>${courseCode} – ${course.name}</span>
      </div>
    </div>

    ${futures.length ? `
    ${sectionH2("3. Where this will take you")}
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      ${futures.map(futurePill).join("")}
    </div>` : ""}

  </div>
</div>`.trim();
}