/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { BIG5, CP1250, CP1251, CP1252, CP1256, CP437, EUCKR, GB18030, ISO8859, SJIS, USASCII, UTF16BE, UTF8 } from './charset/index';
import * as Const from './Const';

function getFitSizeVersion(segments, config, size) {
  let bitsCount = 0;
  if (config.eci !== Const.ECI.DEFAULT) {
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
    if (s.mode === Const.Mode.Number) {
      bitsCount += Const.CountIndicatorSize[0][size];
      bitsCount += 10 * Math.floor(s.data.length / 3) + (s.data.length % 3 === 0 ? 0 : (s.data.length % 3 === 1 ? 4 : 7);
    } else if (s.mode === Const.Mode.Alpha) {
      bitsCount += Const.CountIndicatorSize[1][size];
      bitsCount += 11 * Math.floor(s.data.length / 2) +  6 * (s.data.length % 2);
    } else if (s.mode === Const.Mode.Kanji) {
      bitsCount += Const.CountIndicatorSize[2][size];
      bitsCount += 13 * Math.floor(s.data.length / 2);
    } else if (s.mode === Const.Mode.Byte) {
      bitsCount += Const.CountIndicatorSize[3][size];
      bitsCount += 8 * s.data.length / 2;
    }
  });
  for (let v = Const.SizeVersionRange[size][0]; v < Const.SizeVersionRange[size][1]; v++) {
    if (Const.DATE_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= bitsCount)  {
      return v + 1;
    }
  }
  return 0;
}

function optimizeInSize(segments, config, size) {
  const optSegs = [];
  const len = segments.length;
  if (len === 0) {
    config.fitSizeVersion = 1;
    optSegs.push({mode: Const.Mode.Byte, data: ''});
    return optSegs;
  } else if (len === 1) {
    optSegs.push(segments[0]);
  } else {
    let indexCurr = 1;
    if (segments[0].mode === Const.Mode.Byte) {
      optSegs.push(segments[0]);
    } else if (segments[0].mode === Const.Mode.Kanji) {
      if (segments[1].mode === Const.Mode.Byte && segments[0].data.length < Const.KANJI_LEN[0][size]) {
        optSegs.push({mode: Const.Mode.Byte, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else {
        optSegs.push(segments[0]);
      }
    } else if (segments[0].mode === Const.Mode.Alpha) {
      if (segments[1].mode === Const.Mode.Byte && segments[0].data.length < Const.ALPHA_LEN[0][size]) {
        optSegs.push({mode: Const.Mode.Byte, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else {
        optSegs.push(segments[0]);
      }
    } else if (segments[0].mode === Const.Mode.Number) {
      if (segments[1].mode === Const.Mode.Byte && segments[0].data.length < Const.NUMBER_LEN[0][size]) {
        optSegs.push({mode: Const.Mode.Byte, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else if (segments[1].mode === Const.Mode.Alpha && segments[0].data.length < Const.NUMBER_LEN[1][size]) {
        optSegs.push({mode: Const.Mode.Alpha, data: segments[0].data + segments[1].data})
        indexCurr = 2;
      } else {
        optSegs.push(segments[0]);
      }
    }
    while (indexCurr < len) {
      if (optSegs[optSegs.length - 1].mode === Const.Mode.Byte) {
        let indexNextByte = indexCurr;
        let countBeforeByte = 0;
        while (indexNextByte < len && optSegs[indexNextByte].mode !== Const.Mode.Byte) {
          countBeforeByte += optSegs[indexNextByte].data.length;
          indexNextByte++;
        }
        if (segments[indexCurr].mode === Const.Mode.Kanji && (indexNextByte === len || countBeforeByte >= Const.KANJI_LEN[1][size])) {
          optSegs.push(segments[indexCurr]);
        } else if (segments[indexCurr].mode === Const.Mode.Alpha && (indexNextByte === len || countBeforeByte >= Const.ALPHA_LEN[1][size])) {
          optSegs.push(segments[indexCurr]);
        } else if (segments[indexCurr].mode === Const.Mode.Number) {
          if (indexNextByte === len || countBeforeByte >= Const.NUMBER_LEN[2][size]) {
            optSegs.push(segments[indexCurr]);
          } else {
            let indexNextAlpha = indexCurr;
            let countBeforeAlpha = 0;
            while (indexNextAlpha < indexNextByte && optSegs[indexNextAlpha].mode !== Const.Mode.Alpha) {
              countBeforeAlpha += optSegs[indexNextAlpha].data.length;
              indexNextAlpha++;
            }
            if (indexNextAlpha === len || countBeforeAlpha >= Const.NUMBER_LEN[3][size]) {
              optSegs.push(segments[indexCurr]);
            } else {
              optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
            }
          }
        } else {
          optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
        }
      } else if (optSegs[optSegs.length - 1].mode === Const.Mode.Alpha) {
        if (segments[indexCurr].mode === Const.Mode.Kanji || segments[indexCurr].mode === Const.Mode.Byte) {
          optSegs.push(segments[indexCurr]);
        } else if (segments[indexCurr].mode === Const.Mode.Number) {
          let indexNextAlpha = indexCurr;
          let countBeforeAlpha = 0;
          while (indexNextAlpha < len && optSegs[indexNextAlpha].mode !== Const.Mode.Alpha) {
            countBeforeAlpha += optSegs[indexNextAlpha].data.length;
            indexNextAlpha++;
          }
          if (indexNextAlpha === len || countBeforeAlpha >= Const.NUMBER_LEN[4][size]) {
            optSegs.push(segments[indexCurr]);
          } else {
            optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
          }
        } else {
          optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
        }
      } else if (optSegs[optSegs.length - 1].mode === Const.Mode.Number) {
        if (segments[indexCurr].mode !== Const.Mode.Number) {
          optSegs.push(segments[indexCurr]);
        } else {
          optSegs[optSegs.length - 1].data = optSegs[optSegs.length - 1].date + segments[indexCurr].data;
        }
      } else if (optSegs[optSegs.length - 1].mode === Const.Mode.Kanji) {
        if (segments[indexCurr].mode !== Const.Mode.Kanji) {
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
    let optSegs = optimizeInSize(segments, config, Const.Size.Small);
    if (config.fitSizeVersion) {
      return optSegs;
    } else if (config.versionRange[1] >= 10) {
      return optimizeInSize(segments, config, Const.Size.Middle);
    }
  } else if (config.versionRange[0] < 26) {
    let optSegs = optimizeInSize(segments, config, Const.Size.Middle);
    if (config.fitSizeVersion) {
      return optSegs;
    } else if (config.versionRange[1] >= 26) {
      return optimizeInSize(segments, config, Const.Size.Large);
    }
  } else {
    let optSegs = optimizeInSize(segments, config, Const.Size.Large);
    if (config.fitSizeVersion) {
      return optSegs;
    } else {
      throw Error('Data size too large.');
    }
  }
}

function getVersionRange(dataStr, config) {
  let bitsCount = 0;
  if (config.eci !== Const.ECI.DEFAULT) {
    bitsCount += 4;
    if (config.eci < 0x80) {
      bitsCount += 8;
    } else if (config.eci < 0x4000) {
      bitsCount += 16;
    } else {
      bitsCount += 24;
    }
  }
  bitsCount += 4;
  let minBitsCount = bitsCount + 10 + 10 * Math.floor(dataStr.length / 3) + (dataStr.length % 3 === 0 ? 0 : (dataStr.length % 3 === 1 ? 4 : 7));
  let maxBitsCount = bitsCount + 16 + dataStr.length * 8
  let minVersion = 0;
  for (let v = 0; v < 40; v++) {
    if (Const.DATE_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= minBitsCount)  {
      minVersion = v + 1;
      break;
    }
  }
  if (minVersion === 0) {
    throw Error('Data size too large.');
  }
  let maxVersion = 40;
  for (let v = 0; v < 40; v++) {
    if (Const.DATE_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= maxBitsCount)  {
      maxVersion = v + 1;
      break;
    }
  }
  return [minVersion, maxVersion];
}

function getSegment(dataStr, offset) {
  const reNumber = new RegExp(`^.{${offset}}([\x30-\x39]+)`);
  const reAlpha = new RegExp(`^.{${offset}}([\x20\x24\x25\x2a\x2b\x2d-\x3a\x41-\x5a]+)`);
  const reKanji = new RegExp(`^.{${offset}}((\xeb[\x40-\x7e\x80-\xbf]|[\x81-\x9f\xe0-\xea][\x40-\x7e\x80-\xfc])+)`);
  let mn = dataStr.match(reNumber);
  let ma = dataStr.match(reAlpha);
  let mk = dataStr.match(reKanji);
  if (mn) {
    return {mode: Const.Mode.Number, data: mn[1]};
  } else if (ma) {
    return {mode: Const.Mode.Alpha, data: ma[1]};
  } else if (mk) {
    return {mode: Const.Mode.Kanji, data: mk[1]};
  } else {
    return {mode: Const.Mode.Byte, data: dataStr.substr(offset, 1)};
  }
}

function getSegments(dataStr) {
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
  return segments;
}

function getBytes(data, eci) {
  if (eci === Const.ECI.CP437_0 || eci === Const.ECI.CP437_1) {
    return CP437.convert(data);
  } else if (eci === Const.ECI.ISO_8859_1_0 || eci === Const.ECI.ISO_8859_1_1) {
    return ISO8859.covert(data, 1);
  } else if (eci >= Const.ECI.ISO_8859_2 &&  eci <= Const.ECI.ISO_8859_16) {
    return ISO8859.covert(data, eci - 2);
  } else if (eci === Const.ECI.Shift_JIS) {
    return SJIS.covert(data);
  } else if (eci === Const.ECI.Windows_1250) {
    return CP1250.covert(data);
  } else if (eci === Const.ECI.Windows_1251) {
    return CP1251.covert(data);
  } else if (eci === Const.ECI.Windows_1252) {
    return CP1252.covert(data);
  } else if (eci === Const.ECI.Windows_1256) {
    return CP1256.covert(data);
  } else if (eci === Const.ECI.UTF_16BE) {
    return UTF16BE.covert(data);
  } else if (eci === Const.ECI.UTF_8) {
    return UTF8.covert(data);
  } else if (eci === Const.ECI.US_ASCII) {
    return USASCII.covert(data);
  } else if (eci === Const.ECI.Big5) {
    return BIG5.covert(data);
  } else if (eci === Const.ECI.GB_18030) {
    return GB18030.covert(data);
  } else if (eci === Const.ECI.EUC_KR) {
    return EUCKR.covert(data);
  } else {
    throw Error('Unknown ECI Assignment Value: ' + eci);
  }
}

function checkConfig(config) {
  if (config.version < 0 || config.version > 40) {
    throw Error('Invalid version: ' + config.version);
  }
  if (config.errorCorrectionLevel < Const.ErrorCorrectionLevel.M || config.errorCorrectionLevel > Const.ErrorCorrectionLevel.Q) {
    throw Error('Invalid error correction level: ' + config.errorCorrectionLevel);
  }
}

function getMatrix(data, config) {
  checkConfig(config);
  const byteArray = getBytes(data, config.eci);
  const dataStr = String.fromCharCode(byteArray);
  const segments = getSegments(dataStr);
  if (config.version === 0) {
    config.versionRange = getVersionRange(dataStr, config);
  } else {
    config.versionRange = [config.version, config.version];
  }
  const optSegs = optimizeSegments(segments, config);
}

let QRCode = {
  config: {},
  generate: function(data, config) {
    this.config = {...config};
    this.config.version = this.config.version || 0;
    this.config.eci = this.config.eci || Const.ECI.DEFAULT;
    this.config.errorCorrectionLevel = this.config.errorCorrectionLevel || Const.ErrorCorrectionLevel.L;
    checkConfig(this.config);
    return getMatrix(data, this.config);
  },
}

export default QRCode;