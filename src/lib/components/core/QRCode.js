/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { ECI, ErrorCorrectionLevel, Mode } from './Const';
import Matrix from './Matrix';

function checkConfig(config) {
  if (config.version < 0 || config.version > 40) {
    throw Error('Invalid version: ' + config.version);
  }
  if (config.errorCorrectionLevel < ErrorCorrectionLevel.M || config.errorCorrectionLevel > ErrorCorrectionLevel.Q) {
    throw Error('Invalid error correction level: ' + config.errorCorrectionLevel);
  }
}

const QRCode = {
  generate: function (data, config) {
    config.version = config.version || 0;
    config.eci = config.eci === undefined ? ECI.DEFAULT : config.eci;
    config.eciConv = config.eciConv === undefined ? true : config.eciConv;
    config.mode = config.mode === undefined ? Mode.AutoDetect : config.mode;
    config.errorCorrectionLevel = config.errorCorrectionLevel === undefined ? ErrorCorrectionLevel.M : config.errorCorrectionLevel;
    checkConfig(config);
    return Matrix.generate(data, config);
  },
};

export default QRCode;