/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1250.TXT
const CP1250_ARRAY = [
  {charCode: 0x00a0, byte: 0xa0},
  {charCode: 0x00a4, byte: 0xa4},
  {charCode: 0x00a6, byte: 0xa6},
  {charCode: 0x00a7, byte: 0xa7},
  {charCode: 0x00a8, byte: 0xa8},
  {charCode: 0x00a9, byte: 0xa9},
  {charCode: 0x00ab, byte: 0xab},
  {charCode: 0x00ac, byte: 0xac},
  {charCode: 0x00ad, byte: 0xad},
  {charCode: 0x00ae, byte: 0xae},
  {charCode: 0x00b0, byte: 0xb0},
  {charCode: 0x00b1, byte: 0xb1},
  {charCode: 0x00b4, byte: 0xb4},
  {charCode: 0x00b5, byte: 0xb5},
  {charCode: 0x00b6, byte: 0xb6},
  {charCode: 0x00b7, byte: 0xb7},
  {charCode: 0x00b8, byte: 0xb8},
  {charCode: 0x00bb, byte: 0xbb},
  {charCode: 0x00c1, byte: 0xc1},
  {charCode: 0x00c2, byte: 0xc2},
  {charCode: 0x00c4, byte: 0xc4},
  {charCode: 0x00c7, byte: 0xc7},
  {charCode: 0x00c9, byte: 0xc9},
  {charCode: 0x00cb, byte: 0xcb},
  {charCode: 0x00cd, byte: 0xcd},
  {charCode: 0x00ce, byte: 0xce},
  {charCode: 0x00d3, byte: 0xd3},
  {charCode: 0x00d4, byte: 0xd4},
  {charCode: 0x00d6, byte: 0xd6},
  {charCode: 0x00d7, byte: 0xd7},
  {charCode: 0x00da, byte: 0xda},
  {charCode: 0x00dc, byte: 0xdc},
  {charCode: 0x00dd, byte: 0xdd},
  {charCode: 0x00df, byte: 0xdf},
  {charCode: 0x00e1, byte: 0xe1},
  {charCode: 0x00e2, byte: 0xe2},
  {charCode: 0x00e4, byte: 0xe4},
  {charCode: 0x00e7, byte: 0xe7},
  {charCode: 0x00e9, byte: 0xe9},
  {charCode: 0x00eb, byte: 0xeb},
  {charCode: 0x00ed, byte: 0xed},
  {charCode: 0x00ee, byte: 0xee},
  {charCode: 0x00f3, byte: 0xf3},
  {charCode: 0x00f4, byte: 0xf4},
  {charCode: 0x00f6, byte: 0xf6},
  {charCode: 0x00f7, byte: 0xf7},
  {charCode: 0x00fa, byte: 0xfa},
  {charCode: 0x00fc, byte: 0xfc},
  {charCode: 0x00fd, byte: 0xfd},
  {charCode: 0x0102, byte: 0xc3},
  {charCode: 0x0103, byte: 0xe3},
  {charCode: 0x0104, byte: 0xa5},
  {charCode: 0x0105, byte: 0xb9},
  {charCode: 0x0106, byte: 0xc6},
  {charCode: 0x0107, byte: 0xe6},
  {charCode: 0x010c, byte: 0xc8},
  {charCode: 0x010d, byte: 0xe8},
  {charCode: 0x010e, byte: 0xcf},
  {charCode: 0x010f, byte: 0xef},
  {charCode: 0x0110, byte: 0xd0},
  {charCode: 0x0111, byte: 0xf0},
  {charCode: 0x0118, byte: 0xca},
  {charCode: 0x0119, byte: 0xea},
  {charCode: 0x011a, byte: 0xcc},
  {charCode: 0x011b, byte: 0xec},
  {charCode: 0x0139, byte: 0xc5},
  {charCode: 0x013a, byte: 0xe5},
  {charCode: 0x013d, byte: 0xbc},
  {charCode: 0x013e, byte: 0xbe},
  {charCode: 0x0141, byte: 0xa3},
  {charCode: 0x0142, byte: 0xb3},
  {charCode: 0x0143, byte: 0xd1},
  {charCode: 0x0144, byte: 0xf1},
  {charCode: 0x0147, byte: 0xd2},
  {charCode: 0x0148, byte: 0xf2},
  {charCode: 0x0150, byte: 0xd5},
  {charCode: 0x0151, byte: 0xf5},
  {charCode: 0x0154, byte: 0xc0},
  {charCode: 0x0155, byte: 0xe0},
  {charCode: 0x0158, byte: 0xd8},
  {charCode: 0x0159, byte: 0xf8},
  {charCode: 0x015a, byte: 0x8c},
  {charCode: 0x015b, byte: 0x9c},
  {charCode: 0x015e, byte: 0xaa},
  {charCode: 0x015f, byte: 0xba},
  {charCode: 0x0160, byte: 0x8a},
  {charCode: 0x0161, byte: 0x9a},
  {charCode: 0x0162, byte: 0xde},
  {charCode: 0x0163, byte: 0xfe},
  {charCode: 0x0164, byte: 0x8d},
  {charCode: 0x0165, byte: 0x9d},
  {charCode: 0x016e, byte: 0xd9},
  {charCode: 0x016f, byte: 0xf9},
  {charCode: 0x0170, byte: 0xdb},
  {charCode: 0x0171, byte: 0xfb},
  {charCode: 0x0179, byte: 0x8f},
  {charCode: 0x017a, byte: 0x9f},
  {charCode: 0x017b, byte: 0xaf},
  {charCode: 0x017c, byte: 0xbf},
  {charCode: 0x017d, byte: 0x8e},
  {charCode: 0x017e, byte: 0x9e},
  {charCode: 0x02c7, byte: 0xa1},
  {charCode: 0x02d8, byte: 0xa2},
  {charCode: 0x02d9, byte: 0xff},
  {charCode: 0x02db, byte: 0xb2},
  {charCode: 0x02dd, byte: 0xbd},
  {charCode: 0x2013, byte: 0x96},
  {charCode: 0x2014, byte: 0x97},
  {charCode: 0x2018, byte: 0x91},
  {charCode: 0x2019, byte: 0x92},
  {charCode: 0x201a, byte: 0x82},
  {charCode: 0x201c, byte: 0x93},
  {charCode: 0x201d, byte: 0x94},
  {charCode: 0x201e, byte: 0x84},
  {charCode: 0x2020, byte: 0x86},
  {charCode: 0x2021, byte: 0x87},
  {charCode: 0x2022, byte: 0x95},
  {charCode: 0x2026, byte: 0x85},
  {charCode: 0x2030, byte: 0x89},
  {charCode: 0x2039, byte: 0x8b},
  {charCode: 0x203a, byte: 0x9b},
  {charCode: 0x20ac, byte: 0x80},
  {charCode: 0x2122, byte: 0x99},
];

function getByte(charCode) {
  let len = CP1250_ARRAY.length;
  for (let i = 0; i < len; i++) {
    if (charCode === CP1250_ARRAY[i].charCode) {
      return CP1250_ARRAY[i].byte;
    }
  }
  return undefined;
}

const CP1250 = {
  covert: function(data) {
    const bytes = [];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      let charCode = data.charCodeAt(i);
      if (charCode < 0x80) {
        bytes.push(charCode);
      } else {
        let byte = getByte(charCode);
        if (byte) {
          bytes.push(charCode);
        } else {
          throw Error('Invalid character!');
        }
      }
    }
    return bytes;
  }
};

export default CP1250;
