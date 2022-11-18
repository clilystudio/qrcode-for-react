import QRCode from "../lib/components/core/QRCode";

test('QRCodeTest1', () => {
  let data = 'ABC123';
  let config = {};
  const matrix = QRCode.generate(data,config);
  console.log(matrix);
  console.log(config);
});
