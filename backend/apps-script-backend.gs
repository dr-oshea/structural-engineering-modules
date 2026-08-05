/* ============================================================================
   backend/apps-script-backend.gs

   Paste this ENTIRE file into the Google Apps Script editor
   (Extensions ▸ Apps Script from your "Module Completions" Google Sheet),
   then deploy as a Web app per the roadmap §3.

   It does exactly two things:
     doPost  — receives a completion and appends one row to the sheet
     doGet   — returns which modules a given student+course has completed

   You do not need to understand this code to use it.
   ============================================================================ */


// Runs when a module SENDS a completion (the "Save and Close" button).
function doPost(e) {
  try {
    var data  = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Append one row matching the header order:
    // timestamp | student | course | module | rating | completed | comment
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.student   || "",
      data.course    || "",
      data.module    || "",
      data.rating    || "",
      true,
      data.comment   || ""
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}


// Runs when the homepage ASKS which modules are complete.
// Called like:  …/exec?action=getProgress&student=z1234567&course=CVEN2301
function doGet(e) {
  try {
    var action = e.parameter.action;

    if (action === "getProgress") {
      var student = e.parameter.student;
      var course  = e.parameter.course;

      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var rows  = sheet.getDataRange().getValues(); // includes header row

      var completed = [];   // module IDs (kept for backward compatibility)
      var dates     = {};   // module ID -> most recent completion date (YYYY-MM-DD)

      for (var i = 1; i < rows.length; i++) {   // start at 1: skip header
        var rowTime    = rows[i][0];  // column A (timestamp)
        var rowStudent = rows[i][1];  // column B
        var rowCourse  = rows[i][2];  // column C
        var rowModule  = rows[i][3];  // column D

        if (rowStudent == student && rowCourse == course) {
          if (completed.indexOf(rowModule) === -1) {
            completed.push(rowModule);
          }
          // Track the LATEST date for this module
          var dOnly = toDateString(rowTime);
          if (dOnly && (!dates[rowModule] || dOnly > dates[rowModule])) {
            dates[rowModule] = dOnly;
          }
        }
      }

      return jsonResponse({ completed: completed, dates: dates });
    }

    return jsonResponse({ ok: true, message: "Backend is running." });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}


// Normalise a timestamp cell (Date object or ISO string) to "YYYY-MM-DD".
function toDateString(val) {
  try {
    if (val instanceof Date) {
      return Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }
    var s = String(val);
    return s ? s.slice(0, 10) : "";   // ISO strings start with YYYY-MM-DD
  } catch (e) {
    return "";
  }
}


// Helper: send a JavaScript object back as JSON.
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}