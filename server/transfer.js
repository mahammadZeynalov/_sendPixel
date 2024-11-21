const costInGas = 21000;

const pricesInGasForStoring = [];

for (let w = 0; w < 1000; w++) {
  const price = {
    width: w,
    height: w,
    price: w * w * costInGas,
  };

  console.log(price, ",");
}
