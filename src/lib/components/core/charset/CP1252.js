/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// UTF-16BE to Code Page 1252 Char Code Mapping
// http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1252.TXT
const MAPPING_ARRAY = [
  { charCode: 0x0152, byte: 0x8c },
  { charCode: 0x0153, byte: 0x9c },
  { charCode: 0x0160, byte: 0x8a },
  { charCode: 0x0161, byte: 0x9a },
  { charCode: 0x0178, byte: 0x9f },
  { charCode: 0x017d, byte: 0x8e },
  { charCode: 0x017e, byte: 0x9e },
  { charCode: 0x0192, byte: 0x83 },
  { charCode: 0x02c6, byte: 0x88 },
  { charCode: 0x02dc, byte: 0x98 },
  { charCode: 0x2013, byte: 0x96 },
  { charCode: 0x2014, byte: 0x97 },
  { charCode: 0x2018, byte: 0x91 },
  { charCode: 0x2019, byte: 0x92 },
  { charCode: 0x201a, byte: 0x82 },
  { charCode: 0x201c, byte: 0x93 },
  { charCode: 0x201d, byte: 0x94 },
  { charCode: 0x201e, byte: 0x84 },
  { charCode: 0x2020, byte: 0x86 },
  { charCode: 0x2021, byte: 0x87 },
  { charCode: 0x2022, byte: 0x95 },
  { charCode: 0x2026, byte: 0x85 },
  { charCode: 0x2030, byte: 0x89 },
  { charCode: 0x2039, byte: 0x8b },
  { charCode: 0x203a, byte: 0x9b },
  { charCode: 0x20ac, byte: 0x80 },
  { charCode: 0x2122, byte: 0x99 },
];

/**
 * Convert String to Code Page 1252
 */
const CP1252 = {
  convert: function (data, getMappingByte) {
    const bytes = [];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      let charCode = data.charCodeAt(i);
      if (charCode < 0x80) {
        bytes.push(charCode);
      } else if (charCode >= 0xa0 && charCode <= 0xff) {
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

export default CP1252;
