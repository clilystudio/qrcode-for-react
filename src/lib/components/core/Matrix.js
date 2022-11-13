/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import CharSet from './charset/index';
import Codeword from './Codeword';
import { DATA_CODEWORDS } from './Const';
import Segment from './Segment';

const ALIGNMENT_POSITIONS = [
  [22], [24], [26], [28], [30], [32], [34],
  [26, 46], [26, 48], [26, 50], [30, 54], [30, 56], [30, 58], [34, 62],
  [28, 50, 72], [26, 50, 74], [30, 54, 78], [28, 54, 80], [32, 58, 84], [30, 58, 86], [34, 62, 90],
  [26, 50, 74, 98], [30, 54, 78, 102], [26, 52, 78, 104], [30, 56, 82, 108], [34, 60, 86, 112], [30, 58, 86, 114], [34, 62, 90, 118],
  [30, 54, 78, 102, 126], [24, 50, 76, 102, 128], [28, 54, 80, 106, 132], [32, 58, 84, 110, 136], [26, 54, 82, 110, 138], [30, 58, 86, 114, 142],
];

function getVersionRange(dataStr, config) {
  let minBitsCount = 4 + 10 + 10 * Math.floor(dataStr.length / 3) + (dataStr.length % 3 === 0 ? 0 : (dataStr.length % 3 === 1 ? 4 : 7));
  let maxBitsCount = 28 + 4 + 16 + dataStr.length * 8;
  let minVersion = 0;
  for (let v = 0; v < 40; v++) {
    if (DATA_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= minBitsCount) {
      minVersion = v + 1;
      break;
    }
  }
  if (minVersion === 0) {
    throw Error('Data size too large.');
  }
  let maxVersion = 40;
  for (let v = 0; v < 40; v++) {
    if (DATA_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= maxBitsCount) {
      maxVersion = v + 1;
      break;
    }
  }
  return [minVersion, maxVersion];
}

function isVaildPos(position, matrix) {
  if (position.x === 6 || position.y === 6) {
    // timing pattern
    return false;
  }
  if (position.x <= 8) {
    if (position.y <= 8) {
      // find pattern (topleft)
      return false;
    }
    if (position.y <= matrix.size - 8) {
      // find pattern (bottomleft)
      return false;
    }
  }
  if (position.y <= 8 && position.x <= matrix.size - 8) {
    // find pattern (topright)
    return false;
  }
  if (matrix.version >= 7) {
    if (position.x < 6 && position.y >= matrix.size - 11 && position.y <= matrix.size - 9) {
      // version information #1
      return false;
    }
    if (position.y < 6 && position.x >= matrix.size - 11 && position.x <= matrix.size - 9) {
      // version information #2
      return false;
    }
  }
  for (let x of matrix.alignment) {
    for (let y of matrix.alignment) {
      if (Math.abs(matrix.x - x) <= 2 && Math.abs(matrix.y - y) <= 2) {
        return false;
      }
    }
  }
  return true;
}

function getNextPos(position, matrix) {
  if (position.x === 0 && position.y === matrix.size - 9) {
    return;
  }
  if (position.x % 2 === 0) {
    position.x--;
  } else {
    if (position.dir === 0) {
      position.y--;
      if (position.y >= 0) {
        position.x++;
      } else {
        if (position.x === 7) {
          position.x -= 2;
        } else {
          position.x--;
        }
        position.y = 0;
        position.dir = 1;
      }
    } else {
      position.y++;
      if (position.y < matrix.size) {
        position.x++;
      } else {
        position.x--;
        position.y = matrix.size - 1;
        position.dir = 0;
      }
    }
  }
  if (!isVaildPos(position)) {
    getNextPos(position, matrix);
  }
}

function placeCordwords(message, matrix) {
  const position = { x: size - 1, y: size - 1, dir: 0 };
  for (const codeword of message) {
    for (let i = 7; i >= 0; i--) {
      const bit = (codeword >>> i) & 0x1;
      if (bit) {
        const index = Math.floor(position.x / 32);
        const offset = 31 - (position.x % 32);
        matrix.bits[position.y][index] |= (0x1 << offset);
      }
      getNextPos(position, matrix);
    }
  }
}

function setFinderPattern(matrix) {
  matrix.bits[0][0] = 0xfe000000;
  matrix.bits[6][0] = 0xfe000000;
  matrix.bits[matrix.size - 7][0] = 0xfe000000;
  matrix.bits[matrix.size - 1][0] = 0xfe000000;
  matrix.bits[1][0] = 0x82000000;
  matrix.bits[5][0] = 0x82000000;
  matrix.bits[matrix.size - 6][0] = 0x82000000;
  matrix.bits[matrix.size - 2][0] = 0x82000000;
  for (let y = 2; y <= 4; y++) {
    matrix.bits[y][0] = 0xba000000;
    matrix.bits[matrix.size - 1 - y][0] = 0xba000000;
  }

  for (let x of [matrix.size - 1, matrix.size - 7]) {
    const index = Math.floor(x / 32);
    const offset = 31 - (x % 32);
    const value = 0x1 << offset;
    for (let y = 0; y <= 6; y++) {
      matrix.bits[y][index] |= value;
    }
  }

  for (let x = matrix.size - 6; x <= matrix.size - 2; x++) {
    const index = Math.floor(x / 32);
    const offset = 31 - (x % 32);
    matrix.bits[0][index] |= (0x1 << offset);
    matrix.bits[6][index] |= (0x1 << offset);
  }

  for (let x = matrix.size - 5; x <= matrix.size - 3; x++) {
    const index = Math.floor(x / 32);
    const offset = 31 - (x % 32);
    const value = 0x1 << offset;
    for (let y = 2; y <= 4; y++) {
      matrix.bits[y][index] |= value;
    }
  }
}

function setTimingPattern(matrix) {
  for (let x = 8; x < matrix.size - 8; x += 2) {
    const index = Math.floor(x / 32);
    const offset = 31 - (x % 32);
    matrix.bits[6][index] |= (0x1 << offset);
  }
  for (let y = 8; y < matrix.size - 8; y += 2) {
    matrix.bits[y][0] = 0x02000000;
  }
}

function setAlignment(matrix) {
  for (let x of matrix.alignment) {
    for (let y of matrix.alignment) {
      if ((x === 6 && y === 6) || (x === 6 && y === matrix.size - 7) || (x === matrix.size - 7 && y === 6)) {
        // Finder Pattern
      } else {
        const index = Math.floor(x / 32);
        const offset = 31 - (x % 32);
        const value = 0x1 << offset;
        matrix.bits[y - 2][index] |= value;
        matrix.bits[y][index] |= value;
        matrix.bits[y + 2][index] |= value;
        for (let xt of [x - 2, x + 2]) {
          const index = Math.floor(xt / 32);
          const offset = 31 - (xt % 32);
          const value = 0x1 << offset;
          for (let yt = y - 2; yt <= y + 2; yt++) {
            matrix.bits[yt][index] |= value;
          }
        }
        for (let xt of [x - 1, x + 1]) {
          const index = Math.floor(xt / 32);
          const offset = 31 - (xt % 32);
          const value = 0x1 << offset;
          for (let yt of [y - 2, y + 2]) {
            matrix.bits[yt][index] |= value;
          }
        }
      }
    }
  }
}

function getMasked(matrix, mask) {
  for (let x = 0; x < matrix.size; x++) {
    for (let y = 0; x < matrix.size; x++) {
    }
  }
}

function getBestMasked(matrix) {
  let score = Number.MAX_VALUE;
  for (let mask = 0; mask < 8; mask++) {
    const masked = getMasked(matrix, matrix.mask);
    let maskScore = getScore(masked);
    if (maskScore < score) {
      score = maskScore;
      matrix.masked = masked;
    }
  }
}

function init(config) {
  const matrix = {};
  matrix.version = config.fitVersion;
  matrix.size = config.fitVersion * 4 + 17;
  matrix.mask = config.mask;
  matrix.bits = Array(size).fill().map(_ => Array(Math.ceil(matrix.size / 32)).fill(0x00000000));
  if (matrix.version < 2) {
    matrix.alignment = [];
  } else if (matrix.version < 7) {
    matrix.alignment = [6, matrix.size - 7];
  } else {
    matrix.alignment = [6, ...ALIGNMENT_POSITIONS[matrix.version - 7], matrix.size - 7];
  }
  setFinderPattern(matrix);
  setTimingPattern(matrix);
  setAlignment(matrix);
}

const Matrix = {
  generate: function (data, config) {
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
    const segments = Segment.generate(dataStr, config);
    const message = Codeword.generate(segments, config);
    const matrix = init(config);
    placeCordwords(message, matrix);
    if (matrix.mask === undefined) {
      getBestMasked(matrix);
    } else {
      matrix.masked = getMasked(matrix, matrix.mask);
    }
    return matrix;
  },
};

export default Matrix;