/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { CountIndicatorSize, DATA_CODEWORDS, ECI, Mode, Size, SizeVersionRange } from './Const';
import ErrorCorrection from './ErrorCorrection';

const ALPHA_VALUE = [37, 38, 0, 0, 0, 0, 39, 40, 0, 41, 42, 43];

function appendBits(codewords, bits, bitsLen) {
  const paddingLen = 8 - codewords.offset;
  if (paddingLen >= bitsLen) {
    codewords.words[codewords.words.length - 1] = codewords.words[codewords.words.length - 1] | (bits << (paddingLen - bitsLen));
    codewords.offset = codewords.offset + bitsLen;
  } else {
    codewords.words[codewords.words.length - 1] = codewords.words[codewords.words.length - 1] | (bits >>> (bitsLen - paddingLen));
    let offset = paddingLen + 8;
    while (offset < bitsLen) {
      const codeword = (bits >>> (bitsLen - offset)) & 0xff;
      codewords.words.push(codeword);
      offset += 8;
    }
    if (offset - bitsLen > 0) {
      codewords.offset = 8 - offset + bitsLen;
      const codeword = (bits & ((1 << codewords.offset) - 1)) << (8 - codewords.offset);
      codewords.words.push(codeword);
    } else {
      codewords.offset = 0;
      codewords.words.push(bits & 0xff);
    }
  }
}

function appendECI(codewords, eci) {
  if (eci !== ECI.DEFAULT) {
    appendBits(codewords, Mode.ECI, 4);
    if (eci < 0x80) {
      appendBits(codewords, eci, 8);
    } else if (eci < 0x4000) {
      appendBits(codewords, eci | 0x8000, 16);
    } else {
      appendBits(codewords, eci | 0xc00000, 24);
    }
  }
}

function appendNumber(codewords, segments, size) {
  let count = segments.data.length;
  appendBits(codewords, count, CountIndicatorSize[0][size]);
  for (let offset = 0; offset <= count - 3; offset += 3) {
    appendBits(codewords, parseInt(segments.data.substr(offset, 3), 10), 10);
  }
  if (count % 3 === 1) {
    appendBits(codewords, parseInt(segments.data.substr(-1), 10), 4);
  } else if (count % 3 === 2) {
    appendBits(codewords, parseInt(segments.data.substr(-2), 10), 7);
  }
}

function getAlphaValue(alpha) {
  if (alpha >= 48 && alpha <= 57) {
    return alpha - 48;
  }
  if (alpha === 0x58) {
    return 44;
  }
  if (alpha >= 65 && alpha <= 90) {
    return alpha - 55;
  }
  return ALPHA_VALUE[alpha - 36];
}

function appendAlpha(codewords, segments, size) {
  let count = segments.data.length;
  appendBits(codewords, count, CountIndicatorSize[1][size]);
  for (let offset = 0; offset <= count - 2; offset += 2) {
    const value = getAlphaValue(segments.data.charCodeAt(offset)) * 45 + getAlphaValue(segments.data.charCodeAt(offset + 1));
    appendBits(codewords, value, 11);
    offset += 2;
  }
  if (count % 2 === 1) {
    appendBits(codewords, getAlphaValue(segments.data.charCodeAt(count - 1)), 6);
  }
}

function appendByte(codewords, segments, size) {
  let count = segments.data.length;
  appendBits(codewords, count, CountIndicatorSize[2][size]);
  for (let offset = 0; offset < count; offset++) {
    appendBits(codewords, segments.data.charCodeAt(offset), 8);
  }
}

function appendKnaji(codewords, segments, size) {
  let count = segments.data.length;
  appendBits(codewords, count, CountIndicatorSize[3][size]);
  for (let offset = 0; offset <= count - 2; offset += 2) {
    let byte = (segments.data.charCodeAt(offset) << 8) | segments.data.charCodeAt(offset + 1);
    if (byte >= 0x8140 && byte <= 0x9ffc) {
      byte = (byte - 0x8140);
    } else {
      byte = (byte - 0xC140);
    }
    byte = (byte >>> 8) * 0xc0 + (byte & 0xff);
    appendBits(codewords, byte, 13);
  }
}

function creatMessageSequece(codeBlocks) {
  const messageSequece = [];
  let isExist = true;
  while (isExist) {
    isExist = false;
    for (const block of codeBlocks) {
      if (block.data.legnth > 0) {
        isExist = true;
        messageSequece.push(block.data.shift());
      }
    }
  }
  isExist = true;
  while (isExist) {
    isExist = false;
    for (const block of codeBlocks) {
      if (block.ecCode.legnth > 0) {
        isExist = true;
        messageSequece.push(block.ecCode.shift());
      }
    }
  }
  return messageSequece;
}

const Codeword = {
  generate: function (segments, config) {
    const codewords = { words: [0x00], offset: 0 };
    appendECI(codewords, config.ECI);

    let size = Size.Large;
    if (config.fitVersion < SizeVersionRange[Size.Small][1]) {
      size = Size.Small;
    } else if (config.fitVersion < SizeVersionRange[Size.Small][1]) {
      size = Size.Middle;
    }

    segments.forEach((s) => {
      appendBits(codewords, s.mode, 4);
      if (s.mode === Mode.Number) {
        appendNumber(codewords, segments, size);
      } else if (s.mode === Mode.Alpha) {
        appendAlpha(codewords, segments, size);
      } else if (s.mode === Mode.Byte) {
        appendByte(codewords, segments, size);
      } else if (s.mode === Mode.Kanji) {
        appendKnaji(codewords, segments, size);
      } else {
        throw Error('Wrong Segment Mode: ' + s.mode);
      }
    });

    const capacity = DATA_CODEWORDS[(config.fitVersion - 1) * 4 + config.errorCorrectionLevel];
    const paddingWords = Array(capacity - codewords.words.length).fill().map((_, idx) => idx % 2 === 0 ? 0b11101100 : 0b00010001);
    codewords.words = codewords.words.concat(paddingWords);

    const codeBlocks = ErrorCorrection.generate(codewords, config);
    return creatMessageSequece(codeBlocks);
  },
};

export default Codeword;