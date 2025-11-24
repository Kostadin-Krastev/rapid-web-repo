let yellowPaintLiters = 10;
yellowPaintLiters = 17;
yellowPaintLiters = 42;

const paintCalculater = function (yellowPaintLiters) {
  const redPaintLiters = yellowPaintLiters / 4;
  const whitePaintLiters = yellowPaintLiters * 2;

  const sumTotalPaintLiters =
    redPaintLiters + whitePaintLiters + yellowPaintLiters;

  console.log(
    `Red: ${redPaintLiters}, Yellow: ${yellowPaintLiters}, White: ${whitePaintLiters} Total: ${sumTotalPaintLiters}`
  );
};

paintCalculater(yellowPaintLiters);
