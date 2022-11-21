import Segment from "../lib/components/core/Segment";

test('SegmentTest1', () => {
  let data = 'QR Code Symbol';
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
  const segments = Segment.generate(data,config);
  console.log(segments);
  console.log(config);
});
