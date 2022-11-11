/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const GP_FOR_RS = [
  {ecSize: 7, divisor: [87, 229, 146, 149, 238, 102, 21]},
  {ecSize: 10, divisor: [251, 67, 46, 61, 118, 70, 64, 94, 32, 45]},
  {ecSize: 13, divisor: [74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78]},
  {ecSize: 15, divisor: [8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105]},
  {ecSize: 16, divisor: [120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120]},
  {ecSize: 17, divisor: [43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136]},
  {ecSize: 18, divisor: [215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153]},
  {ecSize: 20, divisor: [17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190]},
  {ecSize: 22, divisor: [210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231]},
  {ecSize: 24, divisor: [229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87, 96, 227, 21]},
  {ecSize: 26, divisor: [173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70]},
  {ecSize: 28, divisor: [168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123]},
  {ecSize: 30, divisor: [41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180]},
];

function getRemainder(data, divisor) {
  let remainder = Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ (remainder.shift());
    remainder.push(0);
    divisor.forEach((coef, idx) => remainder[idx] ^= multiply(coef, factor));
  }
  return remainder;
}

function multiply(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

const ReedSolomon = {
  generate: function(block) {
    const gp = GP_FOR_RS.find((p) => p.ecSize === block.ecSize);
    if (gp) {
      block.ecCode = getRemainder(block.data, gp.divisor);
    } else {
      throw Error('Invalid Number of error correction codewords: ' + block.ecSize);
    }
  },
}

export default ReedSolomon;
