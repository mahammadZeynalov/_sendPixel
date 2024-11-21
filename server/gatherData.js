const costInGas = 20000;
const bytesForSlot = 32;
const bytesForRGB = 3;

for (let w = 0; w < 1000; w++) {
  const price = {
    width: w,
    height: w,
    price: ((w * w * bytesForRGB) / bytesForSlot) * costInGas,
  };

  console.log(price, ",");
}
