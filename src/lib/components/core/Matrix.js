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

const MATRIX_INIT_DATAS = [
  [
    { bytes: 0xfe000000, index: [0, 1032] },
    { bytes: 0x23f80000, index: [5] },
    { bytes: 0x82000000, index: [6, 1026] },
    { bytes: 0x02080000, index: [11] },
    { bytes: 0xba000000, index: [12, 18, 1014, 1020] },
    { bytes: 0x2ae80000, index: [17] },
    { bytes: 0x12e80000, index: [23] },
    { bytes: 0xba0000f8, index: [24, 1008] },
    { bytes: 0x00000f80, index: [25, 49, 145, 169, 313, 337, 481, 505, 649, 673, 817, 841, 985, 1009] },
    { bytes: 0x0000f800, index: [26, 50, 146, 170, 314, 338, 482, 506, 650, 674, 818, 842, 986, 1010] },
    { bytes: 0x000f8000, index: [27, 51, 147, 171, 315, 339, 483, 507, 651, 675, 819, 843, 987, 1011] },
    { bytes: 0x00f80000, index: [28, 52, 148, 172, 316, 340, 484, 508, 652, 676, 820, 844, 988, 1012] },
    { bytes: 0x3ae80000, index: [29] },
    { bytes: 0x82000088, index: [30, 1002] },
    { bytes: 0x00000880, index: [31, 43, 151, 163, 319, 331, 487, 499, 655, 667, 823, 835, 991, 1003] },
    { bytes: 0x00008800, index: [32, 44, 152, 164, 320, 332, 488, 500, 656, 668, 824, 836, 992, 1004] },
    { bytes: 0x00088000, index: [33, 45, 153, 165, 321, 333, 489, 501, 657, 669, 825, 837, 993, 1005] },
    { bytes: 0x00880000, index: [34, 46, 154, 166, 322, 334, 490, 502, 658, 670, 826, 838, 994, 1006] },
    { bytes: 0x0a080000, index: [35] },
    { bytes: 0xfeaaaaaa, index: [36] },
    { bytes: 0xaaaaaaaa, index: [37, 38, 39, 40] },
    { bytes: 0xabf80000, index: [41] },
    { bytes: 0x00000088, index: [42] },
    { bytes: 0x020000f8, index: [48] },
    { bytes: 0x02000000, index: [60, 72, 84, 96, 108, 120, 132, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 348, 360, 372, 384, 396, 408, 420, 432, 444, 456, 468, 516, 528, 540, 552, 564, 576, 588, 600, 612, 624, 636, 684, 696, 708, 720, 732, 744, 756, 768, 780, 792, 804, 852, 864, 876, 888, 900, 912, 924, 936, 948, 960] },
    { bytes: 0x0f8000f8, index: [144, 168, 312, 336, 480, 504, 648, 672, 816, 840] },
    { bytes: 0x0f800000, index: [149, 173, 317, 341, 485, 509, 653, 677, 821, 845, 989, 1013] },
    { bytes: 0x08800088, index: [150, 162, 318, 330, 486, 498, 654, 666, 822, 834] },
    { bytes: 0x08800000, index: [155, 167, 323, 335, 491, 503, 659, 671, 827, 839, 995, 1007] },
    { bytes: 0x0a8000a8, index: [156, 324, 492, 660, 828] },
    { bytes: 0x00000a80, index: [157, 325, 493, 661, 829, 997] },
    { bytes: 0x0000a800, index: [158, 326, 494, 662, 830, 998] },
    { bytes: 0x000a8000, index: [159, 327, 495, 663, 831, 999] },
    { bytes: 0x00a80000, index: [160, 328, 496, 664, 832, 1000] },
    { bytes: 0x0a800000, index: [161, 329, 497, 665, 833, 1001] },
    { bytes: 0xaa000000, index: [972] },
    { bytes: 0x18000000, index: [978] },
    { bytes: 0x2e0000f8, index: [984] },
    { bytes: 0x00800088, index: [990] },
    { bytes: 0xfe0000a8, index: [996] },
  ],
  [
    { bytes: 0xfe000000, index: [0, 1056] },
    { bytes: 0x023f8000, index: [5] },
    { bytes: 0x82000000, index: [6, 1050] },
    { bytes: 0x02a08000, index: [11, 35] },
    { bytes: 0xba000000, index: [12, 18, 1038, 1044] },
    { bytes: 0x022e8000, index: [17] },
    { bytes: 0x01ae8000, index: [23] },
    { bytes: 0xba00000f, index: [24, 1032] },
    { bytes: 0x800000f8, index: [25, 49, 169, 193, 337, 361, 505, 529, 673, 697, 841, 865, 1009, 1033] },
    { bytes: 0x00000f80, index: [26, 50, 170, 194, 338, 362, 506, 530, 674, 698, 842, 866, 1010, 1034] },
    { bytes: 0x0000f800, index: [27, 51, 171, 195, 339, 363, 507, 531, 675, 699, 843, 867, 1011, 1035] },
    { bytes: 0x000f8000, index: [28, 52, 172, 196, 340, 364, 508, 532, 676, 700, 844, 868, 1012, 1036] },
    { bytes: 0x002e8000, index: [29] },
    { bytes: 0x82000008, index: [30, 1026] },
    { bytes: 0x80000088, index: [31, 43, 175, 187, 343, 355, 511, 523, 679, 691, 847, 859, 1015, 1027] },
    { bytes: 0x00000880, index: [32, 44, 176, 188, 344, 356, 512, 524, 680, 692, 848, 860, 1016, 1028] },
    { bytes: 0x00008800, index: [33, 45, 177, 189, 345, 357, 513, 525, 681, 693, 849, 861, 1017, 1029] },
    { bytes: 0x00088000, index: [34, 46, 178, 190, 346, 358, 514, 526, 682, 694, 850, 862, 1018, 1030] },
    { bytes: 0xfeaaaaaa, index: [36] },
    { bytes: 0xaaaaaaaa, index: [37, 38, 39, 40] },
    { bytes: 0xaabf8000, index: [41] },
    { bytes: 0x00000008, index: [42] },
    { bytes: 0x0200000f, index: [48] },
    { bytes: 0x02000000, index: [60, 72, 84, 96, 108, 120, 132, 144, 156, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 372, 384, 396, 408, 420, 432, 444, 456, 468, 480, 492, 540, 552, 564, 576, 588, 600, 612, 624, 636, 648, 660, 708, 720, 732, 744, 756, 768, 780, 792, 804, 816, 828, 876, 888, 900, 912, 924, 936, 948, 960, 972, 984] },
    { bytes: 0x0f80000f, index: [168, 192, 336, 360, 504, 528, 672, 696, 840, 864] },
    { bytes: 0x00f80000, index: [173, 197, 341, 365, 509, 533, 677, 701, 845, 869, 1013, 1037] },
    { bytes: 0x08800008, index: [174, 186, 342, 354, 510, 522, 678, 690, 846, 858] },
    { bytes: 0x00880000, index: [179, 191, 347, 359, 515, 527, 683, 695, 851, 863, 1019, 1031] },
    { bytes: 0x0a80000a, index: [180, 348, 516, 684, 852] },
    { bytes: 0x800000a8, index: [181, 349, 517, 685, 853, 1021] },
    { bytes: 0x00000a80, index: [182, 350, 518, 686, 854, 1022] },
    { bytes: 0x0000a800, index: [183, 351, 519, 687, 855, 1023] },
    { bytes: 0x000a8000, index: [184, 352, 520, 688, 856, 1024] },
    { bytes: 0x00a80000, index: [185, 353, 521, 689, 857, 1025] },
    { bytes: 0xe6000000, index: [996] },
    { bytes: 0x10000000, index: [1002] },
    { bytes: 0x5600000f, index: [1008] },
    { bytes: 0x00800008, index: [1014] },
    { bytes: 0xfe00000a, index: [1020] },
  ]
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

function getNextPos(position, size) {
  if (position.x === 0 && position.y === size - 9) {
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
      if (position.y < size) {
        position.x++;
      } else {
        position.x--;
        position.y = size - 1;
        position.dir = 0;
      }
    }
  }
  if (!isVaildPos(position)) {
    getNextPos(position, size);
  }
}

function placeCordwords(message, matrix) {
  const position = { x: matrix.size - 1, y: matrix.size - 1, dir: 0 };
  for (const codeword of message) {
    for (let i = 7; i >= 0; i--) {
      const bit = (codeword >>> i) & 0x1;
      if (bit) {
        const index = Math.floor(position.x / 32);
        const offset = 31 - (position.x % 32);
        matrix.bits[position.y][index] |= (0x1 << offset);
      }
      getNextPos(position, matrix.size);
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

function setVersion(matrix) {

}

function getScore(masked) {

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
  matrix.bits = Array(matrix.size).fill().map(_ => Array(Math.ceil(matrix.size / 32)).fill(0x00000000));
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
  if (matrix.version >= 7) {
    setVersion(matrix);
  }
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