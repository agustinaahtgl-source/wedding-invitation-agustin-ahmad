const SHEET_NAME = "RSVP Undangan";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    const data = JSON.parse(e.postData.contents);

    const name = data.name || "";
    const attendance = data.attendance || "";
    const message = data.message || "";

    sheet.appendRow([
      new Date(),
      name,
      attendance,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "RSVP berhasil disimpan"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const wishes = data.slice(1)
      .filter(row => row[1] && row[3])
      .map(row => ({
        name: row[1],
        message: row[3],
        timestamp: row[0]
      }));

    return ContentService
      .createTextOutput(JSON.stringify(wishes))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testRSVP() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Test Wedding",
        attendance: "Hadir",
        message: "Ini adalah test RSVP."
      })
    }
  };

  doPost(mockEvent);
}
