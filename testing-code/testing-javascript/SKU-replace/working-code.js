function syncFromExternalSheet() {
  // Свързва се към външната таблица
  const externalSheetId = '1oOjqXsaCAjSOkA1lXrasNtUVtrsxvyxcFcolD8n6YXY';
  const externalSheetName = 'LOC1';
  const externalSource =
    SpreadsheetApp.openById(externalSheetId).getSheetByName(externalSheetName);

  // Свързва се към твоето собствено Sheet
  const mySheetId = '1SQi7OMWiVyim7HTO7UhgdDZuzsJZAIXj2imoCiTAqRs';
  const mySheetName = 'Sheet1';
  const mySheet =
    SpreadsheetApp.openById(mySheetId).getSheetByName(mySheetName);

  // Определя колко редове има в оригиналната таблица
  const lastRow = externalSource.getLastRow();
  const numRows = lastRow - 8; // таблицата има lastRow реда (минус 8, защото данните започват на 9-ти ред)

  // Чете данните от външната таблица
  let data = externalSource.getRange(9, 2, numRows, 2).getValues(); // (започни да чете от ред 9 от колона 2. Взима numRows реда и вземи 2 колони. Запази всичко в масив data)

  // Първият ред е заглавията
  const headers = data[0];
  let rows = data.slice(1);

  // Филтрира празни или невалидни редове (❌Премахва редове без стойност. ❌Премахва редове без цифра вътре. ✔️Оставя само SKU, които изглеждат валидни)
  rows = rows.filter((row) => {
    const rocValue = row[0];
    if (!rocValue) return false;
    const cleanValue = rocValue.toString().trim();
    return /\d/.test(cleanValue);
  });

  // Променя статусите „In stock“ и други
  for (let i = 0; i < rows.length; i++) {
    rows[i][1] = replaceStockStatus(rows[i][1]);
  }

  // 🔤 Сортиране на SKU по азбучен ред (A → Z)
  rows.sort(function (firstTableRow, nextTableRow) {
    const rocA = firstTableRow[0].toString().trim().toLowerCase();
    const rocB = nextTableRow[0].toString().trim().toLowerCase();
    return rocA.localeCompare(rocB);
  });

  // 🔍 Вземаме текущите SKU от моята таблица---------нов код добавя и маха старите SKU, които ги няма-----------------
  const myLastRow = mySheet.getLastRow();
  let myTableData = [];

  if (myLastRow > 1) {
    myTableData = mySheet
      .getRange(2, 1, myLastRow - 1, rows[0].length)
      .getValues();
  }

  const mySKUs = myTableData.map((row) => row[0].toString().trim());

  // Външният SKU списък
  const externalSKUList = rows.map((row) => row[0].toString().trim());

  // Добавяме новите SKU, които ги няма в mySheet
  rows.forEach((row) => {
    const sku = row[0].toString().trim();

    if (!mySKUs.includes(sku)) {
      // ако SKU го няма → добавяме реда към нашите данни
      myTableData.push(row);
    }
  });

  // Премахваме SKU, които вече ги няма в external sheet
  myTableData = myTableData.filter((row) => {
    const sku = row[0].toString().trim();
    return externalSKUList.includes(sku);
  });

  // Сортираме myTableData отново по азбучен ред
  myTableData.sort((a, b) => a[0].toString().localeCompare(b[0].toString()));

  //   // Записва заглавията в моята таблица. Поставя ги на ред 1, колона 1.
  //   mySheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  //   // Записва всички данни под тях
  //   if (rows.length > 0) {
  //     mySheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  //   }

  // Записваме обратно в листа
  mySheet.getRange(2, 1, mySheet.getMaxRows(), columnCount).clearContent();
  const columnCount = rows[0].length;
  mySheet.getRange(1, 1, 1, columnCount).setValues([headers]);
  mySheet
    .getRange(2, 1, myTableData.length, myTableData[0].length)
    .setValues(myTableData);

  // Втората колона (колона B) се променя с помощта на тази функция. празни → null „Inventory Status“ → остава същото. Съдържа „in stock“ → става 9999. Всичко друго → става 0
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
