import QRCode from "../lib/components/core/QRCode";

test('QR1', () => {
  let data = '01234567';
  let config = {
    version: 1,
    eci: 3,
    eciConv: false,
    errorCorrectionLevel: 0,
    // mask: 2,
  };
  const matrix = QRCode.generate(data,config);
  console.log(matrix);
  console.log(config);
});


test('QR2', () => {
  let data = '01234567';
  let config = {
    version: 2,
    errorCorrectionLevel: 0,
    mask: 0,
  };
  const matrix = QRCode.generate(data,config);
  console.log(matrix);
  console.log(config);
});
