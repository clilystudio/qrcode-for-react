/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// UTF-16BE to Code Page 1256 Char Code Mapping
// http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1256.TXT
const MAPPING_ARRAY = [
  {charCode: 0x00d7, byte: 0xd7},
  {charCode: 0x00e0, byte: 0xe0},
  {charCode: 0x00e2, byte: 0xe2},
  {charCode: 0x00e7, byte: 0xe7},
  {charCode: 0x00e8, byte: 0xe8},
  {charCode: 0x00e9, byte: 0xe9},
  {charCode: 0x00ea, byte: 0xea},
  {charCode: 0x00eb, byte: 0xeb},
  {charCode: 0x00ee, byte: 0xee},
  {charCode: 0x00ef, byte: 0xef},
  {charCode: 0x00f4, byte: 0xf4},
  {charCode: 0x00f7, byte: 0xf7},
  {charCode: 0x00f9, byte: 0xf9},
  {charCode: 0x00fb, byte: 0xfb},
  {charCode: 0x00fc, byte: 0xfc},
  {charCode: 0x0152, byte: 0x8c},
  {charCode: 0x0153, byte: 0x9c},
  {charCode: 0x0192, byte: 0x83},
  {charCode: 0x02c6, byte: 0x88},
  {charCode: 0x060c, byte: 0xa1},
  {charCode: 0x061b, byte: 0xba},
  {charCode: 0x061f, byte: 0xbf},
  {charCode: 0x0621, byte: 0xc1},
  {charCode: 0x0622, byte: 0xc2},
  {charCode: 0x0623, byte: 0xc3},
  {charCode: 0x0624, byte: 0xc4},
  {charCode: 0x0625, byte: 0xc5},
  {charCode: 0x0626, byte: 0xc6},
  {charCode: 0x0627, byte: 0xc7},
  {charCode: 0x0628, byte: 0xc8},
  {charCode: 0x0629, byte: 0xc9},
  {charCode: 0x062a, byte: 0xca},
  {charCode: 0x062b, byte: 0xcb},
  {charCode: 0x062c, byte: 0xcc},
  {charCode: 0x062d, byte: 0xcd},
  {charCode: 0x062e, byte: 0xce},
  {charCode: 0x062f, byte: 0xcf},
  {charCode: 0x0630, byte: 0xd0},
  {charCode: 0x0631, byte: 0xd1},
  {charCode: 0x0632, byte: 0xd2},
  {charCode: 0x0633, byte: 0xd3},
  {charCode: 0x0634, byte: 0xd4},
  {charCode: 0x0635, byte: 0xd5},
  {charCode: 0x0636, byte: 0xd6},
  {charCode: 0x0637, byte: 0xd8},
  {charCode: 0x0638, byte: 0xd9},
  {charCode: 0x0639, byte: 0xda},
  {charCode: 0x063a, byte: 0xdb},
  {charCode: 0x0640, byte: 0xdc},
  {charCode: 0x0641, byte: 0xdd},
  {charCode: 0x0642, byte: 0xde},
  {charCode: 0x0643, byte: 0xdf},
  {charCode: 0x0644, byte: 0xe1},
  {charCode: 0x0645, byte: 0xe3},
  {charCode: 0x0646, byte: 0xe4},
  {charCode: 0x0647, byte: 0xe5},
  {charCode: 0x0648, byte: 0xe6},
  {charCode: 0x0649, byte: 0xec},
  {charCode: 0x064a, byte: 0xed},
  {charCode: 0x064b, byte: 0xf0},
  {charCode: 0x064c, byte: 0xf1},
  {charCode: 0x064d, byte: 0xf2},
  {charCode: 0x064e, byte: 0xf3},
  {charCode: 0x064f, byte: 0xf5},
  {charCode: 0x0650, byte: 0xf6},
  {charCode: 0x0651, byte: 0xf8},
  {charCode: 0x0652, byte: 0xfa},
  {charCode: 0x0679, byte: 0x8a},
  {charCode: 0x067e, byte: 0x81},
  {charCode: 0x0686, byte: 0x8d},
  {charCode: 0x0688, byte: 0x8f},
  {charCode: 0x0691, byte: 0x9a},
  {charCode: 0x0698, byte: 0x8e},
  {charCode: 0x06a9, byte: 0x98},
  {charCode: 0x06af, byte: 0x90},
  {charCode: 0x06ba, byte: 0x9f},
  {charCode: 0x06be, byte: 0xaa},
  {charCode: 0x06c1, byte: 0xc0},
  {charCode: 0x06d2, byte: 0xff},
  {charCode: 0x200c, byte: 0x9d},
  {charCode: 0x200d, byte: 0x9e},
  {charCode: 0x200e, byte: 0xfd},
  {charCode: 0x200f, byte: 0xfe},
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

/**
 * Convert String to Code Page 1256
 */
const CP1256 = {
  convert: function(data, getMappingByte) {
    const bytes = [];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      let charCode = data.charCodeAt(i);
      if (charCode < 0x80) {
        bytes.push(charCode);
      } else if (charCode >= 0xa0 && charCode <= 0xbe && charCode !== 0xa1 && charCode !== 0xaa && charCode !== 0xba) {
        bytes.push(charCode);
      } else {
        let byte = getMappingByte(charCode, MAPPING_ARRAY);
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

export default CP1256;
