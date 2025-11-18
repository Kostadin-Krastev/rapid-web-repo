function syncFromExternalSheet() {
  const externalSheetId = '1oOjqXsaCAjSOkA1lXrasNtUVtrsxvyxcFcolD8n6YXY';
  const externalSheetName = 'LOC1';
  const externalSource =
    SpreadsheetApp.openById(externalSheetId).getSheetByName(externalSheetName);

  const mySheetId = '1SQi7OMWiVyim7HTO7UhgdDZuzsJZAIXj2imoCiTAqRs';
  const mySheetName = 'Sheet1';
  const mySheet =
    SpreadsheetApp.openById(mySheetId).getSheetByName(mySheetName);

  // Вземаме данните от външната таблица — от ред 9, колона 2 (B9), 2 колони (ROC и STOCK)
  const lastRow = externalSource.getLastRow();
  const numRows = lastRow - 8;
  let data = externalSource.getRange(9, 2, numRows, 2).getValues();

  // Премахваме празни редове (описателни, групови и т.н.)
  data = data.filter((row) => {
    const rocValue = row[0];
    if (!rocValue) return false;

    // Почистваме текста и проверяваме дали има поне една цифра
    const cleanValue = rocValue.toString().trim();
    return /\d/.test(cleanValue); // приема реда само ако съдържа цифра
  });

  // Преобразуваме STOCK колоната
  for (let i = 0; i < data.length; i++) {
    data[i][1] = replaceStockStatus(data[i][1]);
  }

  // Сортираме всички ROC номера във възходящ ред (от най-малък към най-голям)
  data.sort(function (firstTableRow, nextTableRow) {
    // Вадим само числата от текста (ако има и букви)
    const rocA =
      parseFloat(firstTableRow[0].toString().replace(/[^\d.]/g, '')) || 0;
    const rocB =
      parseFloat(nextTableRow[0].toString().replace(/[^\d.]/g, '')) || 0;
    return rocA - rocB;
  });

  // Прехвърляме сортираните данни без празни и текстови редове
  if (data.length > 0) {
    mySheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }

  // Oбработваме STOCK статуса (in stock = 9999, всичко друго = 0)
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

  Logger.log(`Прехвърлени са ${data.length} реда от шита на външната таблица.`);
}
