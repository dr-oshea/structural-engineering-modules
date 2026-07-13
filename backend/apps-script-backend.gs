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
    // timestamp | student | course | module | rating | completed
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.student   || "",
      data.course    || "",
      data.module    || "",
      data.rating    || "",
      true
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

      var completed = [];
      for (var i = 1; i < rows.length; i++) {   // start at 1: skip header
        var rowStudent = rows[i][1];  // column B
        var rowCourse  = rows[i][2];  // column C
        var rowModule  = rows[i][3];  // column D

        if (rowStudent == student && rowCourse == course) {
          if (completed.indexOf(rowModule) === -1) {
            completed.push(rowModule);
          }
        }
      }

      return jsonResponse({ completed: completed });
    }

    return jsonResponse({ ok: true, message: "Backend is running." });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}


// Helper: send a JavaScript object back as JSON.
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}