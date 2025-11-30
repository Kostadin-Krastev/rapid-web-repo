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
  let data = externalSource.getRange(9, 2, numRows, 2).getValues();

  const headers = data[0];
  let rows = data.slice(1);

  rows = rows.filter((row) => {
    const rocValue = row[0];
    if (!rocValue) return false;
    const cleanValue = rocValue.toString().trim();
    return /\d/.test(cleanValue);
  });

  for (let i = 0; i < rows.length; i++) {
    rows[i][1] = replaceStockStatus(rows[i][1]);
  }

  // 🔤 Сортиране по азбучен ред (A → Z)
  rows.sort(function (firstTableRow, nextTableRow) {
    const rocA = firstTableRow[0].toString().trim().toLowerCase();
    const rocB = nextTableRow[0].toString().trim().toLowerCase();
    return rocA.localeCompare(rocB);
  });

  mySheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  if (rows.length > 0) {
    mySheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }

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

  Logger.log(
    `Прехвърлени са ${rows.length} реда (плюс заглавията на колоните) от външната таблица.`
  );
}
