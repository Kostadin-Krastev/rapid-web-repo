'use strict';
/*
For the furnishing of the office purchased 3 cabinets. One cabinet cost $n, the second was 20% cheaper than the first, and the third cost 15% more than the other two  combined. 
On the console print the total cost of the three cabinets – a real number. The output must be rounded to the third decimal point. 
 */

const calculateEachCabinetCost = function (inputPrice) {
  let oneCabinetCost = inputPrice;
  const secondCabinetCost = oneCabinetCost * 0.8;
  const thirdCabinetCost = (oneCabinetCost + secondCabinetCost) * 1.15;
  const totalPrice = oneCabinetCost + secondCabinetCost + thirdCabinetCost;

  console.log(`Total price of the tree cabinets is ${totalPrice.toFixed(3)}`);
};

calculateEachCabinetCost(720.5);
