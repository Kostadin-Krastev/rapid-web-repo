/*Write a function to convert euro (EUR) to Bulgarian leva (BGN).
Format the result to 2 decimal places. toFixed(2)
Use a fixed rate between the euro and lev: 1 EUR = 1.95583 BGN. Sample input: */

let euro = 1;

const calculateEuroToLev = function (euro) {
  let oneLevValue = 1.95583;
  const convertEuroToLev = euro * oneLevValue;

  console.log(convertEuroToLev.toFixed(2));
};

calculateEuroToLev(euro);
