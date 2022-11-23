/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Convert String to US ASCII
 */
const USASCII = {
  convert: function (data) {
    const bytes = [];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      let charCode = data.charCodeAt(i);
      if (charCode < 0x80) {
        bytes.push(charCode);
      } else {
        throw Error('Invalid character! Char Code: ' + charCode.toString(16));
      }
    }
    return bytes;
  }
};

export default USASCII;
