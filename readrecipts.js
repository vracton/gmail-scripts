function getDrafts() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Drafts")
  sheet.getDataRange().clear().clearDataValidations()
  var drafts = GmailApp.getDrafts()
  var sheetText = [["subject", "recipient", "id", "confirm send"]]
  for (var i = 0; i < drafts.length; i++) {
    const draft = drafts[i]
    sheetText.push([draft.getMessage().getSubject(), draft.getMessage().getTo(), draft.getId(), false])
  }
  sheet.getRange(1, 1, draftsOutput.length, draftsOutput[0].length).setValues(draftsOutput)
  sheet.getRange(2, draftsOutput[0].length, draftsOutput.length).setDataValidation(SpreadsheetApp.newDataValidation()
    .setAllowInvalid(true)
    .requireCheckbox()
    .build());

}

function getTrackingGIF(email, subject) {
  const imgURL = "deployment URL" + "?esubject=" + encodeURIComponent(subject.replace(/'/g, "")) + "&eto=" + encodeURIComponent(email);
  return "<img src='" + imgURL + "' width='1' height='1'/>";
}

function sendMail(draftId) {
  const draft = GmailApp.getDraft(draftId)
  const message = draft.getMessage()
  const body = message.getBody();

  body += getTrackingGIF(message.getTo(), message.getSubject());
  draft.update(message.getTo(), message.getSubject(), body, {
    htmlBody: body,
    cc: message.getCc(),
    bcc: message.getBcc(),
    attachments: message.getAttachments()
  })
  draft.send()
  getDrafts()
}

function sendButton() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Drafts")
  const draftRange = sheet.getDataRange().getValues()
  for (var i = 0; i < draftRange.length; i++) {
    if (draftRange[i][3] == true) sendMail(draftRange[i][2])
  }
  sheet.getRange(2, 4, draftRange.length - 1).clearContent()
}

function doGet(e) {
  const sheet = SpreadsheetApp.openById("spreadsheet id").getSheetByName("Logs")
  var lastRow = sheet.getLastRow() + 1
  sheet.getRange(lastRow, 1, 1, 3).setValues([[new Date(), e.parameters.esubject, e.parameters.eto]])
  return ContentService.createTextOutput(JSON.stringify(e))
}
