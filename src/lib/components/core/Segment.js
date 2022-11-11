/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { ALPHA_LEN, CountIndicatorSize, DATA_CODEWORDS, ECI, KANJI_LEN, Mode, NUMBER_LEN, Size, SizeVersionRange } from './Const';

function getSegment(dataStr, offset) {
  const reNumber = new RegExp(`^.{${offset}}([\x30-\x39]+)`);
  const reAlpha = new RegExp(`^.{${offset}}([\x20\x24\x25\x2a\x2b\x2d-\x3a\x41-\x5a]+)`);
  const reKanji = new RegExp(`^.{${offset}}((\xeb[\x40-\x7e\x80-\xbf]|[\x81-\x9f\xe0-\xea][\x40-\x7e\x80-\xfc])+)`);
  let mn = dataStr.match(reNumber);
  let ma = dataStr.match(reAlpha);
  let mk = dataStr.match(reKanji);
  if (mn) {
    return {mode: Mode.Number, data: mn[1]};
  } else if (ma) {
    return {mode: Mode.Alpha, data: ma[1]};
  } else if (mk) {
    return {mode: Mode.Kanji, data: mk[1]};
  } else {
    return {mode: Mode.Byte, data: dataStr.substr(offset, 1)};
  }
}

function getFitSizeVersion(segments, config, size) {
  let bitsCount = 0;
  if (config.eci !== ECI.DEFAULT) {
    bitsCount += 4;
    if (config.eci < 0x80) {
      bitsCount += 8;
    } else if (config.eci < 0x4000) {
      bitsCount += 16;
    } else {
      bitsCount += 24;
    }
  }
  segments.forEach((s) => {
    bitsCount += 4;
    if (s.mode === Mode.Number) {
      bitsCount += CountIndicatorSize[0][size];
      bitsCount += 10 * Math.floor(s.data.length / 3) + (s.data.length % 3 === 0 ? 0 : (s.data.length % 3 === 1 ? 4 : 7));
    } else if (s.mode === Mode.Alpha) {
      bitsCount += CountIndicatorSize[1][size];
      bitsCount += 11 * Math.floor(s.data.length / 2) +  6 * (s.data.length % 2);
    } else if (s.mode === Mode.Kanji) {
      bitsCount += CountIndicatorSize[2][size];
      bitsCount += 13 * Math.floor(s.data.length / 2);
    } else if (s.mode === Mode.Byte) {
      bitsCount += CountIndicatorSize[3][size];
      bitsCount += 8 * s.data.length
    }
  });
  let minVersion = SizeVersionRange[size][0];
  let maxVersion = SizeVersionRange[size][1];
  if (config.version !== 0) {
    minVersion = config.version;
    maxVersion = config.version;
  }
  for (let v = minVersion; v <= maxVersion; v++) {
    if (DATA_CODEWORDS[(v - 1) * 4 + config.errorCorrectionLevel] * 8 >= bitsCount)  {
      return v;
    }
  }
  return 0;
}

function optimizeInSize(segments, config, size) {
  const optSegs = [];
  const len = segments.length;
  if (len === 0) {
    config.fitSizeVersion = 1;
    optSegs.push({mode: Mode.Byte, data: ''});
    return optSegs;
  } else if (len === 1) {
    optSegs.push(segments[0]);
  } else {
    let indexCurr = 1;
    if (segments[0].mode === Mode.Byte) {
      optSegs.push(segments[0]);
    } else if (segments[0].mode === Mode.Kanji) {
      if (segments[1].mode === Mode.Byte && segments[0].data.length < KANJI_LEN[0][size]) {
        optSegs.push({mode: Mode.Byte, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else {
        optSegs.push(segments[0]);
      }
    } else if (segments[0].mode === Mode.Alpha) {
      if (segments[1].mode === Mode.Byte && segments[0].data.length < ALPHA_LEN[0][size]) {
        optSegs.push({mode: Mode.Byte, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else {
        optSegs.push(segments[0]);
      }
    } else if (segments[0].mode === Mode.Number) {
      if (segments[1].mode === Mode.Byte && segments[0].data.length < NUMBER_LEN[0][size]) {
        optSegs.push({mode: Mode.Byte, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else if (segments[1].mode === Mode.Alpha && segments[0].data.length < NUMBER_LEN[1][size]) {
        optSegs.push({mode: Mode.Alpha, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else {
        optSegs.push(segments[0]);
      }
    }
    while (indexCurr < len) {
      if (optSegs[optSegs.length - 1].mode === Mode.Byte) {
        let indexNextByte = indexCurr;
        let countBeforeByte = 0;
        while (indexNextByte < len && optSegs[indexNextByte].mode !== Mode.Byte) {
          countBeforeByte += optSegs[indexNextByte].data.length;
          indexNextByte++;
        }
        if (segments[indexCurr].mode === Mode.Kanji && (indexNextByte === len || countBeforeByte >= KANJI_LEN[1][size])) {
          optSegs.push(segments[indexCurr]);
        } else if (segments[indexCurr].mode === Mode.Alpha && (indexNextByte === len || countBeforeByte >= ALPHA_LEN[1][size])) {
          optSegs.push(segments[indexCurr]);
        } else if (segments[indexCurr].mode === Mode.Number) {
          if (indexNextByte === len || countBeforeByte >= NUMBER_LEN[2][size]) {
            optSegs.push(segments[indexCurr]);
          } else {
            let indexNextAlpha = indexCurr;
            let countBeforeAlpha = 0;
            while (indexNextAlpha < indexNextByte && optSegs[indexNextAlpha].mode !== Mode.Alpha) {
              countBeforeAlpha += optSegs[indexNextAlpha].data.length;
              indexNextAlpha++;
            }
            if (indexNextAlpha === len || countBeforeAlpha >= NUMBER_LEN[3][size]) {
              optSegs.push(segments[indexCurr]);
            } else {
              optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
            }
          }
        } else {
          optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
        }
      } else if (optSegs[optSegs.length - 1].mode === Mode.Alpha) {
        if (segments[indexCurr].mode === Mode.Kanji || segments[indexCurr].mode === Mode.Byte) {
          optSegs.push(segments[indexCurr]);
        } else if (segments[indexCurr].mode === Mode.Number) {
          let indexNextAlpha = indexCurr;
          let countBeforeAlpha = 0;
          while (indexNextAlpha < len && optSegs[indexNextAlpha].mode !== Mode.Alpha) {
            countBeforeAlpha += optSegs[indexNextAlpha].data.length;
            indexNextAlpha++;
          }
          if (indexNextAlpha === len || countBeforeAlpha >= NUMBER_LEN[4][size]) {
            optSegs.push(segments[indexCurr]);
          } else {
            optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
          }
        } else {
          optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
        }
      } else if (optSegs[optSegs.length - 1].mode === Mode.Number) {
        if (segments[indexCurr].mode !== Mode.Number) {
          optSegs.push(segments[indexCurr]);
        } else {
          optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
        }
      } else if (optSegs[optSegs.length - 1].mode === Mode.Kanji) {
        if (segments[indexCurr].mode !== Mode.Kanji) {
          optSegs.push(segments[indexCurr]);
        } else {
          optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
        }
      } else {
        throw Error('Invalid Segment Mode: ' + optSegs[optSegs.length - 1].mode);
      }
      indexCurr++;
    }
  }
  config.fitSizeVersion = getFitSizeVersion(optSegs, config, size);
  return optSegs;
}

function optimizeSegments(segments, config) {
  if (config.versionRange[0] < 10) {
    let optSegs = optimizeInSize(segments, config, Size.Small);
    if (config.fitSizeVersion) {
      return optSegs;
    } else if (config.versionRange[1] >= 10) {
      return optimizeInSize(segments, config, Size.Middle);
    }
  } else if (config.versionRange[0] < 26) {
    let optSegs = optimizeInSize(segments, config, Size.Middle);
    if (config.fitSizeVersion) {
      return optSegs;
    } else if (config.versionRange[1] >= 26) {
      return optimizeInSize(segments, config, Size.Large);
    }
  } else {
    let optSegs = optimizeInSize(segments, config, Size.Large);
    if (config.fitSizeVersion) {
      return optSegs;
    } else {
      throw Error('Data size too large.');
    }
  }
}

const Segment = {
  create: function(dataStr, config) {
    const segments = [];
    const len = dataStr.length;
    let offset = 0;
    while (offset < len) {
      const segment = getSegment(dataStr, offset);
      if (segments.length > 0 && segment.mode === segments[segments.length - 1].mode) {
        segments[segments.length - 1].data = segments[segments.length - 1].data + segment.data;
      } else {
        segments.push(segment);
      }
      offset += segment.data.length;
    }
    return optimizeSegments(segments, config);
  },
};

export default Segment;
