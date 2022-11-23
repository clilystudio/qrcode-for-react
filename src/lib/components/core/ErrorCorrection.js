/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import ReedSolomon from './ReedSolomon';

const EC_GROUPS = [
  [[1, 16, 10]],
  [[1, 19, 7]],
  [[1, 9, 17]],
  [[1, 13, 13]],
  [[1, 28, 16]],
  [[1, 34, 10]],
  [[1, 16, 28]],
  [[1, 22, 22]],
  [[1, 44, 26]],
  [[1, 55, 15]],
  [[2, 13, 22]],
  [[2, 17, 18]],
  [[2, 32, 18]],
  [[1, 80, 20]],
  [[4, 9, 16]],
  [[2, 24, 26]],
  [[2, 43, 24]],
  [[1, 108, 26]],
  [[2, 11, 22], [2, 12, 22]],
  [[2, 15, 18], [2, 16, 18]],
  [[4, 27, 16]],
  [[2, 68, 18]],
  [[4, 15, 28]],
  [[4, 19, 24]],
  [[4, 31, 18]],
  [[2, 78, 20]],
  [[4, 13, 26], [1, 14, 26]],
  [[2, 14, 18], [4, 15, 18]],
  [[2, 38, 22], [2, 39, 22]],
  [[2, 97, 24]],
  [[4, 14, 26], [2, 15, 26]],
  [[4, 18, 22], [2, 19, 22]],
  [[3, 36, 22], [2, 37, 22]],
  [[2, 116, 30]],
  [[4, 12, 24], [4, 13, 24]],
  [[4, 16, 20], [4, 17, 20]],
  [[4, 43, 26], [1, 44, 26]],
  [[2, 68, 18], [2, 69, 18]],
  [[6, 15, 28], [2, 16, 28]],
  [[6, 19, 24], [2, 20, 24]],
  [[1, 50, 30], [4, 51, 30]],
  [[4, 81, 20]],
  [[3, 12, 24], [8, 13, 24]],
  [[4, 22, 28], [4, 23, 28]],
  [[6, 36, 22], [2, 37, 22]],
  [[2, 92, 24], [2, 93, 24]],
  [[7, 14, 28], [4, 15, 28]],
  [[4, 20, 26], [6, 21, 26]],
  [[8, 37, 22], [1, 38, 22]],
  [[4, 107, 26]],
  [[12, 11, 22], [4, 12, 22]],
  [[8, 20, 24], [4, 21, 24]],
  [[4, 40, 24], [5, 41, 24]],
  [[3, 115, 30], [1, 116, 30]],
  [[11, 12, 24], [5, 13, 24]],
  [[11, 16, 20], [5, 17, 20]],
  [[5, 41, 24], [5, 42, 24]],
  [[5, 87, 22], [1, 88, 22]],
  [[11, 12, 24], [7, 13, 24]],
  [[5, 24, 30], [7, 25, 30]],
  [[7, 45, 28], [3, 46, 28]],
  [[5, 98, 24], [1, 99, 24]],
  [[3, 15, 30], [13, 16, 30]],
  [[15, 19, 24], [2, 20, 24]],
  [[10, 46, 28], [1, 47, 28]],
  [[1, 107, 28], [5, 108, 28]],
  [[2, 14, 28], [17, 15, 28]],
  [[1, 22, 28], [15, 23, 28]],
  [[9, 43, 26], [4, 44, 26]],
  [[5, 120, 30], [1, 121, 30]],
  [[2, 14, 28], [19, 15, 28]],
  [[17, 22, 28], [1, 23, 28]],
  [[3, 44, 26], [11, 45, 26]],
  [[3, 113, 28], [4, 114, 28]],
  [[9, 13, 26], [16, 14, 26]],
  [[17, 21, 26], [4, 22, 26]],
  [[3, 41, 26], [13, 42, 26]],
  [[3, 107, 28], [5, 108, 28]],
  [[15, 15, 28], [10, 16, 28]],
  [[15, 24, 30], [5, 25, 30]],
  [[17, 42, 26]],
  [[4, 116, 28], [4, 117, 28]],
  [[19, 16, 30], [6, 17, 30]],
  [[17, 22, 28], [6, 23, 28]],
  [[17, 46, 28]],
  [[2, 111, 28], [7, 112, 28]],
  [[34, 13, 24]],
  [[7, 24, 30], [16, 25, 30]],
  [[4, 47, 28], [14, 48, 28]],
  [[4, 121, 30], [5, 122, 30]],
  [[16, 15, 30], [14, 16, 30]],
  [[11, 24, 30], [14, 25, 30]],
  [[6, 45, 28], [14, 46, 28]],
  [[6, 117, 30], [4, 118, 30]],
  [[30, 16, 30], [2, 17, 30]],
  [[11, 24, 30], [16, 25, 30]],
  [[8, 47, 28], [13, 48, 28]],
  [[8, 106, 26], [4, 107, 26]],
  [[22, 15, 30], [13, 16, 30]],
  [[7, 24, 30], [22, 25, 30]],
  [[19, 46, 28], [4, 47, 28]],
  [[10, 114, 28], [2, 115, 28]],
  [[33, 16, 30], [4, 17, 30]],
  [[28, 22, 28], [6, 23, 28]],
  [[22, 45, 28], [3, 46, 28]],
  [[8, 122, 30], [4, 123, 30]],
  [[12, 15, 30], [28, 16, 30]],
  [[8, 23, 30], [26, 24, 30]],
  [[3, 45, 28], [23, 46, 28]],
  [[3, 117, 30], [10, 118, 30]],
  [[11, 15, 30], [31, 16, 30]],
  [[4, 24, 30], [31, 25, 30]],
  [[21, 45, 28], [7, 46, 28]],
  [[7, 116, 30], [7, 117, 30]],
  [[19, 15, 30], [26, 16, 30]],
  [[1, 23, 30], [37, 24, 30]],
  [[19, 47, 28], [10, 48, 28]],
  [[5, 115, 30], [10, 116, 30]],
  [[23, 15, 30], [25, 16, 30]],
  [[15, 24, 30], [25, 25, 30]],
  [[2, 46, 28], [29, 47, 28]],
  [[13, 115, 30], [3, 116, 30]],
  [[23, 15, 30], [28, 16, 30]],
  [[42, 24, 30], [1, 25, 30]],
  [[10, 46, 28], [23, 47, 28]],
  [[17, 115, 30]],
  [[19, 15, 30], [35, 16, 30]],
  [[10, 24, 30], [35, 25, 30]],
  [[14, 46, 28], [21, 47, 28]],
  [[17, 115, 30], [1, 116, 30]],
  [[11, 15, 30], [46, 16, 30]],
  [[29, 24, 30], [19, 25, 30]],
  [[14, 46, 28], [23, 47, 28]],
  [[13, 115, 30], [6, 116, 30]],
  [[59, 16, 30], [1, 17, 30]],
  [[44, 24, 30], [7, 25, 30]],
  [[12, 47, 28], [26, 48, 28]],
  [[12, 121, 30], [7, 122, 30]],
  [[22, 15, 30], [41, 16, 30]],
  [[39, 24, 30], [14, 25, 30]],
  [[6, 47, 28], [34, 48, 28]],
  [[6, 121, 30], [14, 122, 30]],
  [[2, 15, 30], [64, 16, 30]],
  [[46, 24, 30], [10, 25, 30]],
  [[29, 46, 28], [14, 47, 28]],
  [[17, 122, 30], [4, 123, 30]],
  [[24, 15, 30], [46, 16, 30]],
  [[49, 24, 30], [10, 25, 30]],
  [[13, 46, 28], [32, 47, 28]],
  [[4, 122, 30], [18, 123, 30]],
  [[42, 15, 30], [32, 16, 30]],
  [[48, 24, 30], [14, 25, 30]],
  [[40, 47, 28], [7, 48, 28]],
  [[20, 117, 30], [4, 118, 30]],
  [[10, 15, 30], [67, 16, 30]],
  [[43, 24, 30], [22, 25, 30]],
  [[18, 47, 28], [31, 48, 28]],
  [[19, 118, 30], [6, 119, 30]],
  [[20, 15, 30], [61, 16, 30]],
  [[34, 24, 30], [34, 25, 30]],
];

const ErrorCorrection = {
  generate: function (codewords, config) {
    const codeBlocks = [];
    let start = 0;
    EC_GROUPS[(config.fitSizeVersion - 1) * 4 + config.errorCorrectionLevel].forEach((ecg) => {
      for (let g = 0; g < ecg[0]; g++) {
        const block = { data: codewords.words.slice(start, start + ecg[1]), ecSize: ecg[2] };
        ReedSolomon.generate(block);
        codeBlocks.push(block);
        start += ecg[1];
      }
    });
    return codeBlocks;
  },
};

export default ErrorCorrection;