/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const GP_FOR_RS = [
  { ecSize: 7, divisor: [ 127, 122, 154, 164, 11, 68, 117 ] },
  { ecSize: 10, divisor: [ 216, 194, 159, 111, 199, 94, 95, 113, 157, 193 ] },
  { ecSize: 13, divisor: [ 137, 73, 227, 17, 177, 17, 52, 13, 46, 43, 83, 132, 120 ] },
  { ecSize: 15, divisor: [ 29, 196, 111, 163, 112, 74, 10, 105, 105, 139, 132, 151, 32, 134, 26 ] },
  { ecSize: 16, divisor: [ 59, 13, 104, 189, 68, 209, 30, 8, 163, 65, 41, 229, 98, 50, 36, 59 ] },
  { ecSize: 17, divisor: [ 119, 66, 83, 120, 119, 22, 197, 83, 249, 41, 143, 134, 85, 53, 125, 99, 79 ] },
  { ecSize: 18, divisor: [ 239, 251, 183, 113, 149, 175, 199, 215, 240, 220, 73, 82, 173, 75, 32, 67, 217, 146 ] },
  { ecSize: 20, divisor: [ 152, 185, 240, 5, 111, 99, 6, 220, 112, 150, 69, 36, 187, 22, 228, 198, 121, 121, 165, 174 ] },
  { ecSize: 22, divisor: [ 89, 179, 131, 176, 182, 244, 19, 189, 69, 40, 28, 137, 29, 123, 67, 253, 86, 218, 230, 26, 145, 245 ] },
  { ecSize: 24, divisor: [ 122, 118, 169, 70, 178, 237, 216, 102, 115, 150, 229, 73, 130, 72, 61, 43, 206, 1, 237, 247, 127, 217, 144, 117 ] },
  { ecSize: 26, divisor: [ 246, 51, 183, 4, 136, 98, 199, 152, 77, 56, 206, 24, 145, 40, 209, 117, 233, 42, 135, 68, 70, 144, 146, 77, 43, 94 ] },
  { ecSize: 28, divisor: [ 252, 9, 28, 13, 18, 251, 208, 150, 103, 174, 100, 41, 167, 12, 247, 56, 117, 119, 233, 127, 181, 100, 121, 147, 176, 74, 58, 197 ] },
  { ecSize: 30, divisor: [ 212, 246, 77, 73, 195, 192, 75, 98, 5, 70, 103, 177, 22, 217, 138, 51, 181, 246, 72, 25, 18, 46, 228, 74, 216, 195, 11, 106, 130, 150 ] },
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
