/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { BIG5, CP1250, CP1251, CP1252, CP1256, CP437, EUCKR, GB18030, ISO8859, SJIS, USASCII, UTF16BE, UTF8 } from './charset/index';
import CodePoint from './CodePoint';
import * as Const from './Const';

function getDataSize(data, config) {
  let bitCount = 0;
  if (config.eci !== Const.ECI.DEFAULT) {
    bitCount += 4;
    if (config.eci <= 127) {
      bitCount += 8;
    } else if (config.eci <= 16383) {
      bitCount += 16;
    } else {
      bitCount += 24;
    }
  }
  const len = data.length;
  let offset = 0;

  while (offset < len) {
      const codePoint = data.codePointAt(offset);

  }

  if (bitCount % 8 === 0) {
      return bitCount / 8;
  } else {
      return Math.floor(bitCount / 8) + 1;
  }
}

function getInitMode(codePoints, config) {
    const len = codePoints.length;

    if (len >= 2) {
        if (CodePoint.isKanji(codePoints[0], codePoints[1])) {
            let verifyEnd = 14;
            if (config.version < 27) {
                verifyEnd = 12;
            }
            verifyEnd = Math.min(len, verifyEnd);
            for (let i = 2; i < verifyEnd; i++) {
                if (CodePoint.isByte(codePoints[i])) {
                    return Const.Mode.Byte;
                }
            }
            return Const.Mode.Kanji;
        } else if (CodePoint.isKanji(codePoints[0], codePoints[1])) {

        }
    } else {
        return Const.Mode.Byte;
    }
}

function getBitRange(codePoints, config) {
    const len = codePoints.length;
    let bits = 4;
    if (config.eci !== Const.ECI.DEFAULT) {
        bits += 4;
        if (config.eci < 128) {
            bits += 8;
        } else if (config.eci < 16384) {
            bits += 16;
        } else {
            bits += 24;
        }
    }
    let minBits = bits + 10;
    let maxBits = bits + 16;
    minBits = maxBits + 10 * Math.floor(len / 3);
    if (len % 3 === 1) {
        minBits += 4;
    } else if (len % 3 === 2) {
        minBits += 7;
    }
    maxBits = maxBits + len * 8;
    return [minBits, maxBits];
}

function getVersionRange(codePoints, config) {
    const bitRange = getBitRange(codePoints, config);
    let minVersion = 0;
    let maxVersion = 0;
    for (let v = 0; v < 40; v++) {
        if (Const.DATE_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= bitRange[0]) {
            minVersion = v + 1;
            break;
        }
    }
    for (let v = 0; v < 40; v++) {
        if (Const.DATE_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= bitRange[1]) {
            maxVersion = v + 1;
            break;
        }
    }
    return [minVersion, maxVersion];
}

function analyzeData(data, config) {
    const codePoints = CodePoint.getCodePoints(data, config.encoding);
    if (config.version !== 0) {
        const versionRagne = getVersionRange(codePoints, config);
        config.minVersion = versionRagne[0];
        config.maxVersion = versionRagne[1];
        if (config.version < config.minVersion) {
            console.error('QR Code Version too small');
        }
    }
    let mode = getInitMode(codePoints, config);
}

function getByteArray(data) {
  const byteArray = [];
  const len = data.length;
  for (let i = 0; i < len; i++) {
    let charCode = data.charCodeAt(i);
    if (charCode <= 0xff) {
      byteArray.push(charCode);
    } else {
      byteArray.push(charCode >>> 8);
      byteArray.push(charCode & 0xff);
    }
  }
  return byteArray;
}

function getSegments(dataStr) {
  const segments = [];
  const len = dataStr.length;
  let offset = 0;
  while (offset < len) {
    const reNumber = new RegExp(`^.{${offset}}([\x30-\x39]+)`);
    const reAlpha = new RegExp(`^.{${offset}}([\x20\x24\x25\x2a\x2b\x2d-\x3a\x41-\x5a]+)`);
    const reKanji = new RegExp(`^.{${offset}}((\xeb[\x40-\x7e\x80-\xbf]|[\x81-\x9f\xe0-\xea][\x40-\x7e\x80-\xfc])+)`);
    const reByte = new RegExp(`^.{${offset}}([\x00-\x1f\x21-\x23\x26-\x29\x2c\x3b-\x40\x5b-\x7f\xa0-\xdf]+)`);
    let m = dataStr.match(reByte);
    if (m) {
      segments.push({mode: Const.Mode.Byte, data: m[1]});
      offset += m[1].length;
    } else {
      m = dataStr.match(reKanji);
      if (m) {
        segments.push({mode: Const.Mode.Kanji, data: m[1]});
        offset += m[1].length;
      } else {
        m = dataStr.match(reAlpha);
        if (m) {
          segments.push({mode: Const.Mode.Alpha, data: m[1]});
          offset += m[1].length;
        } else {
          m = dataStr.match(reNumber);
          if (m) {
            segments.push({mode: Const.Mode.Number, data: m[1]});
            offset += m[1].length;
          } else {
            if (segments[segments.length - 1].mode === Const.Mode.Byte) {
              segments[segments.length - 1].data = segments[segments.length - 1].data + dataStr.substr(offset, 1);
            } else {
              segments.push({mode: Const.Mode.Byte, data: dataStr.substr(offset, 1)});
            }
            offset += 1;
          }
        }
      }
    }
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
}

let QRCode = {
  config: {},
  generate: function(data, config) {
    this.config = {...config};
    this.config.version = this.config.version || 0;
    this.config.eci = this.config.eci || Const.ECI.DEFAULT;
    this.config.errorCorrectionLevel = this.config.errorCorrectionLevel || Const.ErrorCorrectionLevel.M;
    checkConfig(this.config);
    this.byteArray = getByteArray(data);
    return getMatrix(data, this.config);
  },
}

export default QRCode;