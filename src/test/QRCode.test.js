import QRCode from "../lib/components/core/QRCode";

test('QRCodeTest1', () => {
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
