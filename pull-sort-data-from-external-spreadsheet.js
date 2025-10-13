function syncFromExternalSheet() {
  const externalSheetId = '1oOjqXsaCAjSOkA1lXrasNtUVtrsxvyxcFcolD8n6YXY';
  const externalSheetName = 'LOC1';
  const externalSource =
    SpreadsheetApp.openById(externalSheetId).getSheetByName(externalSheetName);

  const mySheetId = '1SQi7OMWiVyim7HTO7UhgdDZuzsJZAIXj2imoCiTAqRs';
  const mySheetName = 'Sheet1';
  const mySheet =
    SpreadsheetApp.openById(mySheetId).getSheetByName(mySheetName);

  // Взимам данните от външната таблица — от ред 9, колона 2 (B9), 2 колони (ROC и STOCK)
  const lastRow = externalSource.getLastRow();
  const numRows = lastRow - 8;
  let data = externalSource.getRange(9, 2, numRows, 2).getValues();

  // Извличам заглавията на колконите (който се намират на ред 9)
  const headers = data[0];

  // Останалите редове са реалните данни
  let rows = data.slice(1);

  // Премахвам празни и нечислови редове (описателни, групови и т.н.)
  rows = rows.filter((row) => {
    const rocValue = row[0];
    if (!rocValue) return false;
    const cleanValue = rocValue.toString().trim();
    return /\d/.test(cleanValue); // приема реда само ако съдържа цифра
  });

  // Преобразувам STOCK колоната
  for (let i = 0; i < rows.length; i++) {
    rows[i][1] = replaceStockStatus(rows[i][1]);
  }

  // Сортирам всички ROC номера във възходящ ред (от малки към голями)
  rows.sort(function (firstTableRow, nextTableRow) {
    const rocA =
      parseFloat(firstTableRow[0].toString().replace(/[^\d.]/g, '')) || 0;
    const rocB =
      parseFloat(nextTableRow[0].toString().replace(/[^\d.]/g, '')) || 0;
    return rocA - rocB;
  });

  // Поставям заглавията в първия ред
  mySheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Прехвърлям сортираните данни под тях (от ред 2 надолу в моята таблица)
  if (rows.length > 0) {
    mySheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }

  // Oбработвам STOCK статуса (in stock = 9999, всичко друго = 0)
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

  // Потвърждение за броя прехвърлени редове
  Logger.log(
    `Прехвърлени са ${rows.length} реда (плюс заглавията на колоните) от външната таблица.`
  );
}
