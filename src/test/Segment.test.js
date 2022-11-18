import Segment from "../lib/components/core/Segment";

test('SegmentTest1', () => {
  let data = 'ABC123';
  let config = {
    version: 1,
    eci: 3,
    eciConv: true,
    errorCorrectionLevel: 1,
    versionRange: [ 1, 1 ],
    fitSizeVersion: 1,
    size: 21
  };
  const segments = Segment.generate(data,config);
  console.log(segments);
  console.log(config);
});
