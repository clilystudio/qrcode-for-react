import Codeword from "../lib/components/core/Codeword";

test('CW1', () => {
  let segments = [ { mode: 1, data: '01234567' } ];
  let config = {
    version: 1,
    eci: 3,
    eciConv: false,
    errorCorrectionLevel: 0,
    versionRange: [ 1, 1 ],
    fitSizeVersion: 1,
    size: 21,
    mask: 2,
  };
  const codewords = Codeword.generate(segments, config);
  console.log(codewords);
  console.log(config);
});

test('CW2', () => {
  let segments = [ { mode: 1, data: '012' } ];
  let config = {
    version: 1,
    eci: 3,
    eciConv: false,
    errorCorrectionLevel: 0,
    versionRange: [ 1, 1 ],
    fitSizeVersion: 1,
    size: 21,
    mask: 0,
  };
  const codewords = Codeword.generate(segments, config);
  console.log(codewords);
  console.log(config);
});
