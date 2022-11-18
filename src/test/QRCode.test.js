import QRCode from "../lib/components/core/QRCode";

test('QRCode Test 1', () => {
  let data = 'ABC123';
  let config = {};
  QRCode.generate(data,config);
});
