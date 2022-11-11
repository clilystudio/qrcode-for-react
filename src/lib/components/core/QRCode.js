/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import CharSet from './charset/index';
import Codeword from './Codeword';
import { DATA_CODEWORDS, ECI, ErrorCorrectionLevel } from './Const';
import Segment from './Segment';

function getVersionRange(dataStr, config) {
  let minBitsCount = 4 + 10 + 10 * Math.floor(dataStr.length / 3) + (dataStr.length % 3 === 0 ? 0 : (dataStr.length % 3 === 1 ? 4 : 7));
  let maxBitsCount = 28 + 4 + 16 + dataStr.length * 8
  let minVersion = 0;
  for (let v = 0; v < 40; v++) {
    if (DATA_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= minBitsCount)  {
      minVersion = v + 1;
      break;
    }
  }
  if (minVersion === 0) {
    throw Error('Data size too large.');
  }
  let maxVersion = 40;
  for (let v = 0; v < 40; v++) {
    if (DATA_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= maxBitsCount)  {
      maxVersion = v + 1;
      break;
    }
  }
  return [minVersion, maxVersion];
}

function checkConfig(config) {
  if (config.version < 0 || config.version > 40) {
    throw Error('Invalid version: ' + config.version);
  }
  if (config.errorCorrectionLevel < ErrorCorrectionLevel.M || config.errorCorrectionLevel > ErrorCorrectionLevel.Q) {
    throw Error('Invalid error correction level: ' + config.errorCorrectionLevel);
  }
}

function getMatrix(data, config) {
  let dataStr = data;
  if (config.eciConv) {
    const byteArray = CharSet.convert(data, config.eci);
    dataStr = String.fromCharCode(byteArray);
  }
  if (config.version === 0) {
    config.versionRange = getVersionRange(dataStr, config);
  } else {
    config.versionRange = [config.version, config.version];
  }
  const segments = Segment.create(dataStr, config);
  Codeword.create(segments, config);
}

const QRCode = {
  generate: function(data, config) {
    config.version = config.version || 0;
    config.eci = config.eci === undefined ? ECI.DEFAULT : config.eci;
    config.eciConv = config.eciConv === undefined ? true : config.eciConv;
    config.errorCorrectionLevel = config.errorCorrectionLevel === undefined ? ErrorCorrectionLevel.L : config.errorCorrectionLevel;
    checkConfig(config);
    return getMatrix(data, config);
  },
}

export default QRCode;