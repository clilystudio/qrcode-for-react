/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// UTF-16BE to Code Page 1251 Char Code Mapping
// http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1251.TXT
const MAPPING_ARRAY = [
  {charCode: 0x00a0, byte: 0xa0},
  {charCode: 0x00a4, byte: 0xa4},
  {charCode: 0x00a6, byte: 0xa6},
  {charCode: 0x00a7, byte: 0xa7},
  {charCode: 0x00a9, byte: 0xa9},
  {charCode: 0x00ab, byte: 0xab},
  {charCode: 0x00ac, byte: 0xac},
  {charCode: 0x00ad, byte: 0xad},
  {charCode: 0x00ae, byte: 0xae},
  {charCode: 0x00b0, byte: 0xb0},
  {charCode: 0x00b1, byte: 0xb1},
  {charCode: 0x00b5, byte: 0xb5},
  {charCode: 0x00b6, byte: 0xb6},
  {charCode: 0x00b7, byte: 0xb7},
  {charCode: 0x00bb, byte: 0xbb},
  {charCode: 0x0401, byte: 0xa8},
  {charCode: 0x0402, byte: 0x80},
  {charCode: 0x0403, byte: 0x81},
  {charCode: 0x0404, byte: 0xaa},
  {charCode: 0x0405, byte: 0xbd},
  {charCode: 0x0406, byte: 0xb2},
  {charCode: 0x0407, byte: 0xaf},
  {charCode: 0x0408, byte: 0xa3},
  {charCode: 0x0409, byte: 0x8a},
  {charCode: 0x040a, byte: 0x8c},
  {charCode: 0x040b, byte: 0x8e},
  {charCode: 0x040c, byte: 0x8d},
  {charCode: 0x040e, byte: 0xa1},
  {charCode: 0x040f, byte: 0x8f},
  {charCode: 0x0451, byte: 0xb8},
  {charCode: 0x0452, byte: 0x90},
  {charCode: 0x0453, byte: 0x83},
  {charCode: 0x0454, byte: 0xba},
  {charCode: 0x0455, byte: 0xbe},
  {charCode: 0x0456, byte: 0xb3},
  {charCode: 0x0457, byte: 0xbf},
  {charCode: 0x0458, byte: 0xbc},
  {charCode: 0x0459, byte: 0x9a},
  {charCode: 0x045a, byte: 0x9c},
  {charCode: 0x045b, byte: 0x9e},
  {charCode: 0x045c, byte: 0x9d},
  {charCode: 0x045e, byte: 0xa2},
  {charCode: 0x045f, byte: 0x9f},
  {charCode: 0x0490, byte: 0xa5},
  {charCode: 0x0491, byte: 0xb4},
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
  {charCode: 0x20ac, byte: 0x88},
  {charCode: 0x2116, byte: 0xb9},
  {charCode: 0x2122, byte: 0x99},
];

function getByte(charCode) {
  let len = MAPPING_ARRAY.length;
  if (charCode < MAPPING_ARRAY[0].charCode || charCode > MAPPING_ARRAY[len - 1].charCode) {
    return undefined;
  }
  for (let i = 0; i < len; i++) {
    if (charCode === MAPPING_ARRAY[i].charCode) {
      return MAPPING_ARRAY[i].byte;
    }
  }
  return undefined;
}

/**
 * Convert String to Code Page 1251
 */
const CP1251 = {
  covert: function(data) {
    const bytes = [];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      let charCode = data.charCodeAt(i);
      if (charCode < 0x80) {
        bytes.push(charCode);
      } else if (charCode >= 0x0410 && charCode <= 0x044f) {
        bytes.push(charCode - 0x350);
      } else {
        let byte = getByte(charCode);
        if (byte) {
          bytes.push(charCode);
        } else {
          throw Error('Invalid character! Char Code: ' + charCode.toString(16));
        }
      }
    }
    return bytes;
  }
};

export default CP1251;
