import QRCode from "../lib/components/core/QRCode";

test('QRCode Test 1', () => {
  let data = 'ABC123';
  let config = {};
  const matrix = QRCode.generate(data,config);
  console.log(matrix);
  console.log(config);
});
