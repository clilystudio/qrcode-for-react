import Codeword from "../lib/components/core/Codeword";

test('CodewordTest1', () => {
  let segments = [ { mode: 4, data: 'QR Code Symbol' } ];
  let config = {
    version: 1,
    eci: 3,
    eciConv: false,
    errorCorrectionLevel: 0,
    versionRange: [ 1, 1 ],
    fitSizeVersion: 1,
    size: 21,
    mask: 5,
  };
  const codewords = Codeword.generate(segments, config);
  console.log(codewords);
  console.log(config);
});
