/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// UTF-16BE to Code Page 437 Char Code Mapping
// https://www.ibm.com/docs/en/db2/11.5?topic=tables-code-page-437-generic-system-437
const MAPPING_ARRAY = [
  {charCode: 0x00a0, byte: 0xff},
  {charCode: 0x00a1, byte: 0xad},
  {charCode: 0x00a2, byte: 0x9b},
  {charCode: 0x00a3, byte: 0x9c},
  {charCode: 0x00a5, byte: 0x9d},
  {charCode: 0x00aa, byte: 0xa6},
  {charCode: 0x00ab, byte: 0xae},
  {charCode: 0x00ac, byte: 0xaa},
  {charCode: 0x00b0, byte: 0xf8},
  {charCode: 0x00b1, byte: 0xf1},
  {charCode: 0x00b2, byte: 0xfd},
  {charCode: 0x00b7, byte: 0xfa},
  {charCode: 0x00ba, byte: 0xa7},
  {charCode: 0x00bb, byte: 0xaf},
  {charCode: 0x00bc, byte: 0xac},
  {charCode: 0x00bd, byte: 0xab},
  {charCode: 0x00bf, byte: 0xa8},
  {charCode: 0x00c4, byte: 0x8e},
  {charCode: 0x00c5, byte: 0x8f},
  {charCode: 0x00c6, byte: 0x92},
  {charCode: 0x00c7, byte: 0x80},
  {charCode: 0x00c9, byte: 0x90},
  {charCode: 0x00d1, byte: 0xa5},
  {charCode: 0x00d6, byte: 0x99},
  {charCode: 0x00dc, byte: 0x9a},
  {charCode: 0x00df, byte: 0xe1},
  {charCode: 0x00e0, byte: 0x85},
  {charCode: 0x00e1, byte: 0xa0},
  {charCode: 0x00e2, byte: 0x83},
  {charCode: 0x00e4, byte: 0x84},
  {charCode: 0x00e5, byte: 0x86},
  {charCode: 0x00e6, byte: 0x91},
  {charCode: 0x00e7, byte: 0x87},
  {charCode: 0x00e8, byte: 0x8a},
  {charCode: 0x00e9, byte: 0x82},
  {charCode: 0x00ea, byte: 0x88},
  {charCode: 0x00eb, byte: 0x89},
  {charCode: 0x00ec, byte: 0x8d},
  {charCode: 0x00ed, byte: 0xa1},
  {charCode: 0x00ee, byte: 0x8c},
  {charCode: 0x00ef, byte: 0x8b},
  {charCode: 0x00f1, byte: 0xa4},
  {charCode: 0x00f2, byte: 0x95},
  {charCode: 0x00f3, byte: 0xa2},
  {charCode: 0x00f4, byte: 0x93},
  {charCode: 0x00f6, byte: 0x94},
  {charCode: 0x00f7, byte: 0xf6},
  {charCode: 0x00f9, byte: 0x97},
  {charCode: 0x00fa, byte: 0xa3},
  {charCode: 0x00fb, byte: 0x96},
  {charCode: 0x00fc, byte: 0x81},
  {charCode: 0x00ff, byte: 0x98},
  {charCode: 0x0192, byte: 0x9f},
  {charCode: 0x0393, byte: 0xe2},
  {charCode: 0x0398, byte: 0xe9},
  {charCode: 0x03a3, byte: 0xe4},
  {charCode: 0x03a6, byte: 0xe8},
  {charCode: 0x03a9, byte: 0xea},
  {charCode: 0x03b1, byte: 0xe0},
  {charCode: 0x03b4, byte: 0xeb},
  {charCode: 0x03b5, byte: 0xee},
  {charCode: 0x03bc, byte: 0xe6},
  {charCode: 0x03c0, byte: 0xe3},
  {charCode: 0x03c3, byte: 0xe5},
  {charCode: 0x03c4, byte: 0xe7},
  {charCode: 0x03c6, byte: 0xed},
  {charCode: 0x207f, byte: 0xfc},
  {charCode: 0x20a7, byte: 0x9e},
  {charCode: 0x2219, byte: 0xf9},
  {charCode: 0x221a, byte: 0xfb},
  {charCode: 0x221e, byte: 0xec},
  {charCode: 0x2229, byte: 0xef},
  {charCode: 0x2248, byte: 0xf7},
  {charCode: 0x2261, byte: 0xf0},
  {charCode: 0x2264, byte: 0xf3},
  {charCode: 0x2265, byte: 0xf2},
  {charCode: 0x2310, byte: 0xa9},
  {charCode: 0x2320, byte: 0xf4},
  {charCode: 0x2321, byte: 0xf5},
  {charCode: 0x2500, byte: 0xc4},
  {charCode: 0x2502, byte: 0xb3},
  {charCode: 0x250c, byte: 0xda},
  {charCode: 0x2510, byte: 0xbf},
  {charCode: 0x2514, byte: 0xc0},
  {charCode: 0x2518, byte: 0xd9},
  {charCode: 0x251c, byte: 0xc3},
  {charCode: 0x2524, byte: 0xb4},
  {charCode: 0x252c, byte: 0xc2},
  {charCode: 0x2534, byte: 0xc1},
  {charCode: 0x253c, byte: 0xc5},
  {charCode: 0x2550, byte: 0xcd},
  {charCode: 0x2551, byte: 0xba},
  {charCode: 0x2552, byte: 0xd5},
  {charCode: 0x2553, byte: 0xd6},
  {charCode: 0x2554, byte: 0xc9},
  {charCode: 0x2555, byte: 0xb8},
  {charCode: 0x2556, byte: 0xb7},
  {charCode: 0x2557, byte: 0xbb},
  {charCode: 0x2558, byte: 0xd4},
  {charCode: 0x2559, byte: 0xd3},
  {charCode: 0x255a, byte: 0xc8},
  {charCode: 0x255b, byte: 0xbe},
  {charCode: 0x255c, byte: 0xbd},
  {charCode: 0x255d, byte: 0xbc},
  {charCode: 0x255e, byte: 0xc6},
  {charCode: 0x255f, byte: 0xc7},
  {charCode: 0x2560, byte: 0xcc},
  {charCode: 0x2561, byte: 0xb5},
  {charCode: 0x2562, byte: 0xb6},
  {charCode: 0x2563, byte: 0xb9},
  {charCode: 0x2564, byte: 0xd1},
  {charCode: 0x2565, byte: 0xd2},
  {charCode: 0x2566, byte: 0xcb},
  {charCode: 0x2567, byte: 0xcf},
  {charCode: 0x2568, byte: 0xd0},
  {charCode: 0x2569, byte: 0xca},
  {charCode: 0x256a, byte: 0xd8},
  {charCode: 0x256b, byte: 0xd7},
  {charCode: 0x256c, byte: 0xce},
  {charCode: 0x2580, byte: 0xdf},
  {charCode: 0x2584, byte: 0xdc},
  {charCode: 0x2588, byte: 0xdb},
  {charCode: 0x258c, byte: 0xdd},
  {charCode: 0x2590, byte: 0xde},
  {charCode: 0x2591, byte: 0xb0},
  {charCode: 0x2592, byte: 0xb1},
  {charCode: 0x2593, byte: 0xb2},
  {charCode: 0x25a0, byte: 0xfe},
];

function getByte(charCode) {
  let len = MAPPING_ARRAY.length;
  if (charCode < MAPPING_ARRAY[0].charCode || charCode > MAPPING_ARRAY[len - 1].charCode) {
    return undefined;
  }
  const index = MAPPING_ARRAY.findIndex((x) => x.charCode === charCode);
  return (index >= 0 ? MAPPING_ARRAY[index].byte : undefined);
}

/**
 * Convert String to Code Page 437
 */
const CP437 = {
  covert: function(data) {
    const bytes = [];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      let charCode = data.charCodeAt(i);
      if (charCode === 0x1a) {
        bytes.push(0x7f);
      } else if (charCode === 0x1c) {
        bytes.push(0x1a);
      } else if (charCode === 0x7f) {
        bytes.push(0x1c);
      } else if (charCode < 0x7f) {
        bytes.push(charCode);
      } else {
        let byte = getByte(charCode);
        if (byte) {
          bytes.push(byte);
        } else {
          throw Error('Invalid character! Char Code: ' + charCode.toString(16));
        }
      }
    }
    return bytes;
  }
};

export default CP437;
