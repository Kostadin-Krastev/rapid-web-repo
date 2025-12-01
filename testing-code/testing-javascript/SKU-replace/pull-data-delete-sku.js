// Pull data from external spreadsheet
function syncFromExternalSheet() {
  const externalSheetId = '1oOjqXsaCAjSOkA1lXrasNtUVtrsxvyxcFcolD8n6YXY';
  const externalSheetName = 'LOC1';
  const externalSource =
    SpreadsheetApp.openById(externalSheetId).getSheetByName(externalSheetName);

  const mySheetId = '1SQi7OMWiVyim7HTO7UhgdDZuzsJZAIXj2imoCiTAqRs';
  const mySheetName = 'Sheet1';
  const mySheet =
    SpreadsheetApp.openById(mySheetId).getSheetByName(mySheetName);

  // Managing how many rows does have the external spreadsheet
  const lastRow = externalSource.getLastRow();
  const numRows = lastRow - 8;

  // Reading the data from the external spreadsheet
  let data = externalSource.getRange(9, 2, numRows, 2).getValues();

  // First row is for the Titles
  const headers = data[0];
  let rows = data.slice(1);

  // Filtering empty or invalid rows
  rows = rows.filter((row) => {
    const rocValue = row[0];
    if (!rocValue) return false;
    const cleanValue = rocValue.toString().trim();
    return /\d/.test(cleanValue);
  });

  // Changing stock status
  for (let i = 0; i < rows.length; i++) {
    rows[i][1] = replaceStockStatus(rows[i][1]);
  }

  // Sorting SKU from lowest to highest number
  rows.sort(function (firstTableRow, nextTableRow) {
    const rocA = firstTableRow[0].toString().trim().toLowerCase();
    const rocB = nextTableRow[0].toString().trim().toLowerCase();
    return rocA.localeCompare(rocB);
  });

  // Taking the SKU from my spreadsheet table
  const myLastRow = mySheet.getLastRow();
  let myTableData = [];

  if (myLastRow > 1) {
    myTableData = mySheet
      .getRange(2, 1, myLastRow - 1, rows[0].length)
      .getValues();
  }

  const mySKUs = myTableData.map((row) => row[0].toString().trim());

  // SKU list from the external spreadsheet
  const externalSKUList = rows.map((row) => row[0].toString().trim());

  // Add the new SKU that are not in mySheet
  rows.forEach((row) => {
    const sku = row[0].toString().trim();

    if (!mySKUs.includes(sku)) {
      myTableData.push(row); // add a row to my sheet if the SKU does not exist
    }
  });

  // Remove SKU that are no longer in external sheet
  myTableData = myTableData.filter((row) => {
    const sku = row[0].toString().trim();
    return externalSKUList.includes(sku);
  });

  // Sorting myTableData in alphabetical order
  myTableData.sort((a, b) => a[0].toString().localeCompare(b[0].toString()));

  // Add data into my sheet
  const columnCount = rows[0].length;
  mySheet.getRange(2, 1, mySheet.getMaxRows(), columnCount).clearContent();
  mySheet.getRange(1, 1, 1, columnCount).setValues([headers]);
  mySheet
    .getRange(2, 1, myTableData.length, myTableData[0].length)
    .setValues(myTableData);

  // If contains „in stock“ make it 9999. Everting else is 0
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
