function syncFromExternalSheet() {
  const externalSheetId = '1oOjqXsaCAjSOkA1lXrasNtUVtrsxvyxcFcolD8n6YXY';
  const externalSheetName = 'LOC1';

  const externalSource =
    SpreadsheetApp.openById(externalSheetId).getSheetByName(externalSheetName);

  const mySheetId = '1SQi7OMWiVyim7HTO7UhgdDZuzsJZAIXj2imoCiTAqRs';
  const mySheetName = 'Sheet1';

  const mySheet =
    SpreadsheetApp.openById(mySheetId).getSheetByName(mySheetName);

  const lastRow = externalSource.getLastRow();
  const numRows = lastRow - 8;
  const data = externalSource.getRange(9, 2, numRows, 2).getValues();

  for (let i = 0; i < data.length; i++) {
    data[i][1] = replaceStockStatus(data[i][1]);
  }

  mySheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  function replaceStockStatus(value) {
    if (!value) {
      return null;
    } else if (value === 'Inventory Status') {
      return value;
    } else if (value.toLowerCase().includes('in stock')) {
      return 9999;
    } else {
      return 0;
    }
  }
}
