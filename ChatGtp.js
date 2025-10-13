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
  const numRows = lastRow - 8; // Започваме от ред 9
  const data = externalSource.getRange(9, 2, numRows, 2).getValues(); // Взимаме колони B и C (ROC и STOCK)

  // Заместваме стойностите за STOCK според правилата
  for (let i = 0; i < data.length; i++) {
    data[i][1] = replaceStockStatus(data[i][1]);
  }

  // Сортираме по ROC номер (първата колона)
  data.sort(function (a, b) {
    const rocA = parseFloat(a[0]) || 0;
    const rocB = parseFloat(b[0]) || 0;
    return rocA - rocB; // възходящ ред
  });

  // Изчистваме предишните данни от моя sheet
  mySheet.getRange(1, 1, mySheet.getLastRow(), 2).clearContent();

  // Прехвърляме сортираните данни
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
