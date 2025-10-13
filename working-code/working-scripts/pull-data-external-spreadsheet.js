function syncFromExternalSheet() {
  const externalSheetId = '1oOjqXsaCAjSOkA1lXrasNtUVtrsxvyxcFcolD8n6YXY';
  const externalSheetName = 'LOC1';

  const externalSource =
    SpreadsheetApp.openById(externalSheetId).getSheetByName(externalSheetName);

  const mySheetId = '1SQi7OMWiVyim7HTO7UhgdDZuzsJZAIXj2imoCiTAqRs';
  const mySheetName = 'Sheet1';

  const mySheet =
    SpreadsheetApp.openById(mySheetId).getSheetByName(mySheetName);

  const data = externalSource.getRange('B9:C').getValues();

  mySheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}
