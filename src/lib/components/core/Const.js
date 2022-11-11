/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const ErrorCorrectionLevel = {
  L: 0b01,
  M: 0b00,
  Q: 0b11,
  H: 0b10,
};

const ECI = {
  CP437_0: 0,
  CP437_1: 2,
  ISO_8859_1_0: 1,
  ISO_8859_1_1: 3,
  DEFAULT: 3,
  ISO_8859_2: 4,
  ISO_8859_3: 5,
  ISO_8859_4: 6,
  ISO_8859_5: 7,
  ISO_8859_6: 8,
  ISO_8859_7: 9,
  ISO_8859_8: 10,
  ISO_8859_9: 11,
  ISO_8859_10: 12,
  ISO_8859_11: 13,
  ISO_8859_13: 15,
  ISO_8859_14: 16,
  ISO_8859_15: 17,
  ISO_8859_16: 18,
  Shift_JIS: 20,
  Windows_1250: 21,
  Windows_1251: 22,
  Windows_1252: 23,
  Windows_1256: 24,
  UTF_16BE: 25,
  UTF_8: 26,
  US_ASCII: 27,
  Big5: 28,
  GB_18030: 29,
  EUC_KR: 30,
}

const Size = {
  Small: 0,
  Middle: 1,
  Large: 2,
}

const SizeVersionRange = [
  [1, 9],
  [10, 26],
  [27, 40],
]

const CountIndicatorSize = [
  [10, 12, 14],
  [9, 11, 13],
  [8, 10, 12],
  [8, 16, 16],
];

const Mode = {
  Number: 0b0001,
  Alpha: 0b0010,
  Byte: 0b0100,
  Kanji: 0b1000,
  ECI: 0b0111,
  Struct: 0b0011,
};

const KANJI_LEN = [
  [10, 10, 12],
  [18, 24, 26],
];

const ALPHA_LEN = [
  [6, 8, 8],
  [11, 15, 16],
];

const NUMBER_LEN = [
  [4, 4, 5],
  [7, 9, 9],
  [6, 8, 9],
  [6, 8, 8],
  [13, 15, 17],
];

const DATA_CODEWORDS = [
  16,19,9,13,
  28,34,16,22,
  44,55,26,34,
  64,80,36,48,
  86,108,46,62,
  108,136,60,76,
  124,156,66,88,
  154,194,86,110,
  182,232,100,132,
  216,274,122,154,
  254,324,140,180,
  290,370,158,206,
  334,428,180,244,
  365,461,197,261,
  415,523,223,295,
  453,589,253,325,
  507,647,283,367,
  563,721,313,397,
  627,795,341,445,
  669,861,385,485,
  714,932,406,512,
  782,1006,442,568,
  860,1094,464,614,
  914,1174,514,664,
  1000,1276,538,718,
  1062,1370,596,754,
  1128,1468,628,808,
  1193,1531,661,871,
  1267,1631,701,911,
  1373,1735,745,985,
  1455,1843,793,1033,
  1541,1955,845,1115,
  1631,2071,901,1171,
  1725,2191,961,1231,
  1812,2306,986,1286,
  1914,2434,1054,1354,
  1992,2566,1096,1426,
  2102,2702,1142,1502,
  2216,2812,1222,1582,
  2334,2956,1276,1666,
];

export { ErrorCorrectionLevel, ECI, Size, SizeVersionRange, CountIndicatorSize, Mode, KANJI_LEN, ALPHA_LEN, NUMBER_LEN, DATA_CODEWORDS };
