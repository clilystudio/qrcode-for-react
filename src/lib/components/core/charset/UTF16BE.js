/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Convert String to UTF-16BE
 */
const UTF16BE = {
  convert: function(data) {
    const bytes = [];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      let charCode = data.charCodeAt(i);
      if (charCode <= 0xff) {
        bytes.push(0x00);
        bytes.push(charCode);
      } else {
        bytes.push(charCode >>> 8);
        bytes.push(charCode & 0xff);
      }
    }
    return bytes;
  },
};

export default UTF16BE;
