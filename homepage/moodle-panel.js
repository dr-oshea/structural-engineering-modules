/* ============================================================================
   homepage/moodle-panel.js — "Before You Begin" HTML generator.

   buildMoodlePanel(courseCode, options) returns a self-contained HTML string
   (all styles inline) to paste into a Moodle "Text and media area". It shows:
     1. Prerequisite courses  → each with its linked refresh modules
     2. The current course     → a "start here" bubble
     3. Future courses         → where this course leads (forward edges)

   Everything is derived from COURSE_GRAPH + CATALOG, so it generalises to any
   course. Requires prerequisites.js + catalog.js to be loaded first.

   ── A NOTE ON TRACKING ──
   Moodle substitutes URL variables (?sid=…) only for a URL **activity**, not
   inside HTML pasted into a Text-and-media area. Links written here therefore
   can't carry a student ID of their own.

   Two things make that a non-issue:

   1. `homeUrl` — point the module links at your "Revision Modules" URL
      activity instead of at the modules directly. Moodle then substitutes the
      variables on the way through, and the student lands on the homepage
      properly identified. This is the recommended setup.

   2. core/context.js remembers the student and course for the session, so
      once a student has opened any properly-linked page, direct module links
      work for the rest of that session too.

   options:
     moduleBaseUrl  URL prefix each module links to. A module links to
                    `${moduleBaseUrl}${folder}/index.html`. Default is the
                    GitHub Pages base below — change to your host.
     homeUrl        if set, EVERY module link points here instead (give it the
                    Moodle link to your Revision Modules URL activity, e.g.
                    https://moodle.…/mod/url/view.php?id=123456). Recommended:
                    it's the only way a link in pasted HTML can carry identity.
     courseParam    optional ?course= value appended to module links so that
                    completion records against the right offering.
     resources      optional array of { label, url, note } — course profile,
                    FAQs, topic overview, reading list. They hang off the
                    CURRENT bubble, the same way each prerequisite's refresh
                    modules hang off its own bubble. With none given, the
                    CURRENT bubble is a plain pill as before.
     resourcesTitle heading above them (default "Course resources:")
     resourcesNote  optional HTML shown above the links
     titles         override the three section headings:
                    { needs, learn, leads }
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
  const base_home = options.homeUrl || null;

  // ── module <li> link (or a plain, unlinked item if module not in catalog) ──
  const moduleLink = (id) => {
    const m = catalogModule(id);
    if (!m) return "";

    // A module that isn't released yet is LISTED but not linked — a live link
    // to an unbuilt module is a dead end, and students should still see what
    // is coming.
    if (typeof catalogModuleAvailable === "function" && !catalogModuleAvailable(m)) {
      const note = (typeof catalogComingSoonLabel === "function")
        ? catalogComingSoonLabel(m) : "coming soon";
      return `<li style="margin:4px 0;color:${MP.grey};">`
           + `${m.title} <em style="font-size:0.9em;">(${note})</em></li>`;
    }

    // With `homeUrl` set, every module link goes via the Moodle URL activity
    // so Moodle can substitute the student ID on the way through. Without it,
    // links go straight to the module and rely on the session fallback in
    // context.js for tracking.
    const href = base_home || `${base}${m.folder}/index.html${courseSuffix}`;
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

  // Section headings — overridable, since "where this will take you" reads
  // oddly for a final-year elective that leads nowhere in particular.
  const titles = Object.assign({
    needs: "1. What you need to know",
    learn: "2. What this course covers",
    leads: "3. Where this leads"
  }, options.titles || {});

  // Course resources hang off the CURRENT bubble itself, exactly as the
  // refresh modules hang off each PREREQ bubble — one bubble per course,
  // rather than a second thing competing for attention.
  const resources = options.resources || [];
  const resourcesBody = resources.length ? `
      <div style="margin-top:12px;background:${MP.greyBox};border:1px solid ${MP.border};
        border-left:4px solid ${MP.orange};border-radius:8px;padding:12px 16px;text-align:left;">
        <div style="font-weight:700;color:${MP.orange};margin:0 0 6px;font-size:.9rem;">${
          options.resourcesTitle || "Course resources:"
        }</div>
        ${options.resourcesNote
          ? `<div style="margin:0 0 8px;font-size:.92rem;color:${MP.text};">${options.resourcesNote}</div>`
          : ""}
        <ul style="margin:0;padding-left:18px;line-height:1.6;font-size:.92rem;">
          ${resources.map(r => `
            <li style="margin:4px 0;">
              <a href="${r.url}" target="_blank" rel="noopener noreferrer"
                 style="color:${MP.indigo};text-decoration:none;border-bottom:1px solid ${MP.yellow};">
                ${r.label}</a>${r.note ? ` <span style="color:${MP.grey};">— ${r.note}</span>` : ""}
            </li>`).join("")}
        </ul>
      </div>` : "";

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

    ${sectionH2(titles.needs)}
    <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin-bottom:10px;">
      ${prereqs.length
        ? prereqs.map((c, i) => prereqBubble(c, i === 0)).join("")
        : `<p style="color:${MP.grey};">No formal prerequisites recorded.</p>`}
    </div>

    ${sectionH2(titles.learn)}
    <div style="display:flex;justify-content:center;margin-bottom:6px;">
      ${resourcesBody ? `
      <details style="width:100%;max-width:720px;" open>
        <summary style="list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;
          padding:12px 18px;background:${MP.white};border:1px solid ${MP.border};border-radius:9999px;
          box-shadow:0 4px 10px rgba(0,0,0,.06);font-family:${MP.fontBody};color:${MP.text};font-weight:700;">
          <span style="display:inline-block;background:${MP.orange};color:${MP.white};border-radius:9999px;
            padding:4px 10px;font-size:.72rem;font-weight:700;letter-spacing:.06em;">CURRENT</span>
          <span>${courseCode} – ${course.name}</span>
          <span style="margin-left:auto;color:${MP.grey};font-weight:600;font-size:.85rem;">Expand ▾</span>
        </summary>
        ${resourcesBody}
      </details>` : `
      <div style="display:flex;align-items:center;gap:10px;padding:12px 18px;background:${MP.white};
        border:1px solid ${MP.border};border-radius:9999px;box-shadow:0 4px 10px rgba(0,0,0,.06);
        font-family:${MP.fontBody};color:${MP.text};font-weight:700;min-width:300px;max-width:720px;">
        <span style="display:inline-block;background:${MP.orange};color:${MP.white};border-radius:9999px;
          padding:4px 10px;font-size:.72rem;font-weight:700;letter-spacing:.06em;">CURRENT</span>
        <span>${courseCode} – ${course.name}</span>
      </div>`}
    </div>

    ${futures.length ? `
    ${sectionH2(titles.leads)}
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      ${futures.map(futurePill).join("")}
    </div>` : ""}

  </div>
</div>`.trim();
}