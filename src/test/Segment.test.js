import Segment from "../lib/components/core/Segment";

test('Seg1', () => {
  let data = '01234567';
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
  const segments = Segment.generate(data,config);
  console.log(segments);
  console.log(config);
});

test('Seg2', () => {
  let data = '01234567';
  let config = {
    version: 2,
    eci: 3,
    eciConv: false,
    errorCorrectionLevel: 0,
    versionRange: [ 2, 2 ],
    fitSizeVersion: 2,
    size: 21,
    mask: 0,
  };
  const segments = Segment.generate(data,config);
  console.log(segments);
  console.log(config);
});
