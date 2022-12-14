/*
  Copyright 2022 Clily Studio

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import CharSet from './charset/index';
import Codeword from './Codeword';
import { DATA_CODEWORDS } from './Const';
import ErrorCorrection from './ErrorCorrection';
import Segment from './Segment';

const ALIGNMENT_POSITIONS = [
  [22], [24], [26], [28], [30], [32], [34],
  [26, 46], [26, 48], [26, 50], [30, 54], [30, 56], [30, 58], [34, 62],
  [28, 50, 72], [26, 50, 74], [30, 54, 78], [28, 54, 80], [32, 58, 84], [30, 58, 86], [34, 62, 90],
  [26, 50, 74, 98], [30, 54, 78, 102], [26, 52, 78, 104], [30, 56, 82, 108], [34, 60, 86, 112], [30, 58, 86, 114], [34, 62, 90, 118],
  [30, 54, 78, 102, 126], [24, 50, 76, 102, 128], [28, 54, 80, 106, 132], [32, 58, 84, 110, 136], [26, 54, 82, 110, 138], [30, 58, 86, 114, 142],
];

const MATRIX_BITS_ARRAY = [
  [
    { bytes: 0xfe03f800, indexes: [0] },
    { bytes: 0x82020800, indexes: [1, 5] },
    { bytes: 0xba02e800, indexes: [2, 3, 4] },
    { bytes: 0xfeabf800, indexes: [6] },
    { bytes: 0x02000000, indexes: [8, 10, 12] },
    { bytes: 0x00800000, indexes: [13] },
    { bytes: 0xfe000000, indexes: [14, 20] },
    { bytes: 0x82000000, indexes: [15, 19] },
    { bytes: 0xba000000, indexes: [16, 17, 18] },
  ],
  [
    { bytes: 0xfe003f80, indexes: [0] },
    { bytes: 0x82002080, indexes: [1, 5] },
    { bytes: 0xba002e80, indexes: [2, 3, 4] },
    { bytes: 0xfeaabf80, indexes: [6] },
    { bytes: 0x02000000, indexes: [8, 10, 12, 14] },
    { bytes: 0x0200f800, indexes: [16] },
    { bytes: 0x00808800, indexes: [17] },
    { bytes: 0xfe00a800, indexes: [18] },
    { bytes: 0x82008800, indexes: [19] },
    { bytes: 0xba00f800, indexes: [20] },
    { bytes: 0xba000000, indexes: [21, 22] },
    { bytes: 0x82000000, indexes: [23] },
    { bytes: 0xfe000000, indexes: [24] },
  ],
  [
    { bytes: 0xfe0003f8, indexes: [0] },
    { bytes: 0x82000208, indexes: [1, 5] },
    { bytes: 0xba0002e8, indexes: [2, 3, 4] },
    { bytes: 0xfeaaabf8, indexes: [6] },
    { bytes: 0x02000000, indexes: [8, 10, 12, 14, 16, 18] },
    { bytes: 0x02000f80, indexes: [20] },
    { bytes: 0x00800880, indexes: [21] },
    { bytes: 0xfe000a80, indexes: [22] },
    { bytes: 0x82000880, indexes: [23] },
    { bytes: 0xba000f80, indexes: [24] },
    { bytes: 0xba000000, indexes: [25, 26] },
    { bytes: 0x82000000, indexes: [27] },
    { bytes: 0xfe000000, indexes: [28] },
  ],
  [
    { bytes: 0xfe00003f, indexes: [0] },
    { bytes: 0x80000000, indexes: [1, 3, 5, 7, 9, 11, 13] },
    { bytes: 0x82000020, indexes: [2, 10] },
    { bytes: 0xba00002e, indexes: [4, 6, 8] },
    { bytes: 0xfeaaaabf, indexes: [12] },
    { bytes: 0x02000000, indexes: [16, 20, 24, 28, 32, 36, 40, 44] },
    { bytes: 0x020000f8, indexes: [48] },
    { bytes: 0x00800088, indexes: [50] },
    { bytes: 0xfe0000a8, indexes: [52] },
    { bytes: 0x82000088, indexes: [54] },
    { bytes: 0xba0000f8, indexes: [56] },
    { bytes: 0xba000000, indexes: [58, 60] },
    { bytes: 0x82000000, indexes: [62] },
    { bytes: 0xfe000000, indexes: [64] },
  ],
  [
    { bytes: 0xfe000003, indexes: [0] },
    { bytes: 0xf8000000, indexes: [1, 13] },
    { bytes: 0x82000002, indexes: [2, 10] },
    { bytes: 0x08000000, indexes: [3, 11] },
    { bytes: 0xba000002, indexes: [4, 6, 8] },
    { bytes: 0xe8000000, indexes: [5, 7, 9] },
    { bytes: 0xfeaaaaab, indexes: [12] },
    { bytes: 0x02000000, indexes: [16, 20, 24, 28, 32, 36, 40, 44, 48, 52] },
    { bytes: 0x0200000f, indexes: [56] },
    { bytes: 0x80000000, indexes: [57, 59, 61, 63, 65] },
    { bytes: 0x00800008, indexes: [58] },
    { bytes: 0xfe00000a, indexes: [60] },
    { bytes: 0x82000008, indexes: [62] },
    { bytes: 0xba00000f, indexes: [64] },
    { bytes: 0xba000000, indexes: [66, 68] },
    { bytes: 0x82000000, indexes: [70] },
    { bytes: 0xfe000000, indexes: [72] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 68, 80] },
    { bytes: 0x3f800000, indexes: [1] },
    { bytes: 0x82000000, indexes: [2, 10, 70, 78] },
    { bytes: 0x20800000, indexes: [3, 11] },
    { bytes: 0xba000000, indexes: [4, 6, 8, 72, 74, 76] },
    { bytes: 0x2e800000, indexes: [5, 7, 9] },
    { bytes: 0xfeaaaaaa, indexes: [12] },
    { bytes: 0xbf800000, indexes: [13] },
    { bytes: 0x02000000, indexes: [16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64] },
    { bytes: 0xf8000000, indexes: [65, 73] },
    { bytes: 0x00800000, indexes: [66] },
    { bytes: 0x88000000, indexes: [67, 71] },
    { bytes: 0xa8000000, indexes: [69] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 88] },
    { bytes: 0x0bf80000, indexes: [1] },
    { bytes: 0x82000000, indexes: [2, 86] },
    { bytes: 0x12080000, indexes: [3] },
    { bytes: 0xba000000, indexes: [4, 6, 82, 84] },
    { bytes: 0x12e80000, indexes: [5] },
    { bytes: 0x1ae80000, indexes: [7] },
    { bytes: 0xba000f80, indexes: [8, 80] },
    { bytes: 0x3ae80000, indexes: [9] },
    { bytes: 0x82000880, indexes: [10, 78] },
    { bytes: 0x02080000, indexes: [11] },
    { bytes: 0xfeaaaaaa, indexes: [12] },
    { bytes: 0xabf80000, indexes: [13] },
    { bytes: 0x00000880, indexes: [14] },
    { bytes: 0x02000f80, indexes: [16] },
    { bytes: 0x02000000, indexes: [20, 24, 28, 32, 36, 52, 56, 60, 64] },
    { bytes: 0x0f800f80, indexes: [40, 48] },
    { bytes: 0x0f800000, indexes: [41, 49, 73, 81] },
    { bytes: 0x08800880, indexes: [42, 46] },
    { bytes: 0x08800000, indexes: [43, 47, 75, 79] },
    { bytes: 0x0a800a80, indexes: [44] },
    { bytes: 0x0a800000, indexes: [45, 77] },
    { bytes: 0x0a000000, indexes: [68] },
    { bytes: 0x78000000, indexes: [70] },
    { bytes: 0x9a000f80, indexes: [72] },
    { bytes: 0x00800880, indexes: [74] },
    { bytes: 0xfe000a80, indexes: [76] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 96] },
    { bytes: 0x00bf8000, indexes: [1] },
    { bytes: 0x82000000, indexes: [2, 94] },
    { bytes: 0x03a08000, indexes: [3] },
    { bytes: 0xba000000, indexes: [4, 6, 90, 92] },
    { bytes: 0x01ae8000, indexes: [5] },
    { bytes: 0x012e8000, indexes: [7] },
    { bytes: 0xba0003e0, indexes: [8, 88] },
    { bytes: 0x002e8000, indexes: [9] },
    { bytes: 0x82000220, indexes: [10, 86] },
    { bytes: 0x02208000, indexes: [11] },
    { bytes: 0xfeaaaaaa, indexes: [12] },
    { bytes: 0xaabf8000, indexes: [13] },
    { bytes: 0x00000220, indexes: [14] },
    { bytes: 0x020003e0, indexes: [16] },
    { bytes: 0x02000000, indexes: [20, 24, 28, 32, 36, 40, 56, 60, 64, 68, 72] },
    { bytes: 0x0f8003e0, indexes: [44, 52] },
    { bytes: 0x00f80000, indexes: [45, 53, 81, 89] },
    { bytes: 0x08800220, indexes: [46, 50] },
    { bytes: 0x00880000, indexes: [47, 51, 83, 87] },
    { bytes: 0x0a8002a0, indexes: [48] },
    { bytes: 0x00a80000, indexes: [49, 85] },
    { bytes: 0x46000000, indexes: [76] },
    { bytes: 0x70000000, indexes: [78] },
    { bytes: 0xe20003e0, indexes: [80] },
    { bytes: 0x00800220, indexes: [82] },
    { bytes: 0xfe0002a0, indexes: [84] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 104] },
    { bytes: 0x0023f800, indexes: [1] },
    { bytes: 0x82000000, indexes: [2, 102] },
    { bytes: 0x00320800, indexes: [3] },
    { bytes: 0xba000000, indexes: [4, 6, 98, 100] },
    { bytes: 0x0012e800, indexes: [5] },
    { bytes: 0x002ae800, indexes: [7] },
    { bytes: 0xba0000f8, indexes: [8, 96] },
    { bytes: 0x0022e800, indexes: [9] },
    { bytes: 0x82000088, indexes: [10, 94] },
    { bytes: 0x00220800, indexes: [11] },
    { bytes: 0xfeaaaaaa, indexes: [12] },
    { bytes: 0xaaabf800, indexes: [13] },
    { bytes: 0x00000088, indexes: [14] },
    { bytes: 0x020000f8, indexes: [16] },
    { bytes: 0x02000000, indexes: [20, 24, 28, 32, 36, 40, 44, 60, 64, 68, 72, 76, 80] },
    { bytes: 0x0f8000f8, indexes: [48, 56] },
    { bytes: 0x000f8000, indexes: [49, 57, 89, 97] },
    { bytes: 0x08800088, indexes: [50, 54] },
    { bytes: 0x00088000, indexes: [51, 55, 91, 95] },
    { bytes: 0x0a8000a8, indexes: [52] },
    { bytes: 0x000a8000, indexes: [53, 93] },
    { bytes: 0xde000000, indexes: [84] },
    { bytes: 0x60000000, indexes: [86] },
    { bytes: 0x120000f8, indexes: [88] },
    { bytes: 0x00800088, indexes: [90] },
    { bytes: 0xfe0000a8, indexes: [92] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 112] },
    { bytes: 0x00033f80, indexes: [1] },
    { bytes: 0x82000000, indexes: [2, 110] },
    { bytes: 0x00012080, indexes: [3] },
    { bytes: 0xba000000, indexes: [4, 6, 106, 108] },
    { bytes: 0x00032e80, indexes: [5] },
    { bytes: 0x00012e80, indexes: [7, 9] },
    { bytes: 0xba00003e, indexes: [8, 104] },
    { bytes: 0x82000022, indexes: [10, 102] },
    { bytes: 0x00022080, indexes: [11] },
    { bytes: 0xfeaaaaaa, indexes: [12] },
    { bytes: 0xaaaabf80, indexes: [13] },
    { bytes: 0x00000022, indexes: [14] },
    { bytes: 0x0200003e, indexes: [16, 96] },
    { bytes: 0x02000000, indexes: [20, 24, 28, 32, 36, 40, 44, 48, 64, 68, 72, 76, 80, 84, 88] },
    { bytes: 0x0f80003e, indexes: [52, 60] },
    { bytes: 0x0000f800, indexes: [53, 61, 97, 105] },
    { bytes: 0x08800022, indexes: [54, 58] },
    { bytes: 0x00008800, indexes: [55, 59, 99, 103] },
    { bytes: 0x0a80002a, indexes: [56] },
    { bytes: 0x0000a800, indexes: [57, 101] },
    { bytes: 0xa6000000, indexes: [92] },
    { bytes: 0xf8000000, indexes: [94] },
    { bytes: 0x00800022, indexes: [98] },
    { bytes: 0xfe00002a, indexes: [100] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 120] },
    { bytes: 0x00001bf8, indexes: [1] },
    { bytes: 0x82000000, indexes: [2, 118] },
    { bytes: 0x00001a08, indexes: [3] },
    { bytes: 0xba000000, indexes: [4, 6, 114, 116] },
    { bytes: 0x00003ae8, indexes: [5] },
    { bytes: 0x00002ae8, indexes: [7] },
    { bytes: 0xba00000f, indexes: [8, 112] },
    { bytes: 0x800032e8, indexes: [9] },
    { bytes: 0x82000008, indexes: [10, 110] },
    { bytes: 0x80002208, indexes: [11] },
    { bytes: 0xfeaaaaaa, indexes: [12] },
    { bytes: 0xaaaaabf8, indexes: [13] },
    { bytes: 0x00000008, indexes: [14] },
    { bytes: 0x80000000, indexes: [15, 17] },
    { bytes: 0x0200000f, indexes: [16] },
    { bytes: 0x02000000, indexes: [20, 24, 28, 32, 36, 40, 44, 48, 52, 68, 72, 76, 80, 84, 88, 92, 96] },
    { bytes: 0x0f80000f, indexes: [56, 64] },
    { bytes: 0x80000f80, indexes: [57, 65, 105, 113] },
    { bytes: 0x08800008, indexes: [58, 62] },
    { bytes: 0x80000880, indexes: [59, 63, 107, 111] },
    { bytes: 0x0a80000a, indexes: [60] },
    { bytes: 0x80000a80, indexes: [61, 109] },
    { bytes: 0x3e000000, indexes: [100] },
    { bytes: 0xe8000000, indexes: [102] },
    { bytes: 0xf200000f, indexes: [104] },
    { bytes: 0x00800008, indexes: [106] },
    { bytes: 0xfe00000a, indexes: [108] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 192] },
    { bytes: 0x0000013f, indexes: [1] },
    { bytes: 0x80000000, indexes: [2, 5, 8, 11, 14, 17, 20] },
    { bytes: 0x82000000, indexes: [3, 189] },
    { bytes: 0x000000a0, indexes: [4] },
    { bytes: 0xba000000, indexes: [6, 9, 183, 186] },
    { bytes: 0x000002ae, indexes: [7] },
    { bytes: 0x0000032e, indexes: [10] },
    { bytes: 0xba000003, indexes: [12, 180] },
    { bytes: 0xe00000ae, indexes: [13] },
    { bytes: 0x82000002, indexes: [15, 177] },
    { bytes: 0x20000220, indexes: [16] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaabf, indexes: [19] },
    { bytes: 0x00000002, indexes: [21] },
    { bytes: 0x20000000, indexes: [22] },
    { bytes: 0x02000003, indexes: [24] },
    { bytes: 0xe0000000, indexes: [25] },
    { bytes: 0x02000000, indexes: [30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 108, 114, 120, 126, 132, 138, 144, 150, 156] },
    { bytes: 0x0f800003, indexes: [90, 102] },
    { bytes: 0xe00000f8, indexes: [91, 103, 169, 181] },
    { bytes: 0x08800002, indexes: [93, 99] },
    { bytes: 0x20000088, indexes: [94, 100, 172, 178] },
    { bytes: 0x0a800002, indexes: [96] },
    { bytes: 0xa00000a8, indexes: [97, 175] },
    { bytes: 0x36000000, indexes: [162] },
    { bytes: 0x90000000, indexes: [165] },
    { bytes: 0x6a000003, indexes: [168] },
    { bytes: 0x00800002, indexes: [171] },
    { bytes: 0xfe000002, indexes: [174] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 186, 204] },
    { bytes: 0x0000003b, indexes: [1] },
    { bytes: 0xf8000000, indexes: [2, 20, 25] },
    { bytes: 0x82000000, indexes: [3, 15, 189, 201] },
    { bytes: 0x00000002, indexes: [4] },
    { bytes: 0x08000000, indexes: [5, 17] },
    { bytes: 0xba000000, indexes: [6, 9, 12, 192, 195, 198] },
    { bytes: 0x00000022, indexes: [7] },
    { bytes: 0xe8000000, indexes: [8, 11, 14] },
    { bytes: 0x0000000a, indexes: [10] },
    { bytes: 0xf800002a, indexes: [13] },
    { bytes: 0x88000022, indexes: [16] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaaab, indexes: [19] },
    { bytes: 0x88000000, indexes: [22] },
    { bytes: 0x02000000, indexes: [24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168] },
    { bytes: 0x0f800000, indexes: [96, 108] },
    { bytes: 0xf800000f, indexes: [97, 109, 181, 193] },
    { bytes: 0x80000000, indexes: [98, 101, 104, 107, 110, 177, 182, 185, 188, 191, 194] },
    { bytes: 0x08800000, indexes: [99, 105] },
    { bytes: 0x88000008, indexes: [100, 106, 184, 190] },
    { bytes: 0x0a800000, indexes: [102] },
    { bytes: 0xa800000a, indexes: [103, 187] },
    { bytes: 0xae000000, indexes: [174] },
    { bytes: 0x9a000000, indexes: [180] },
    { bytes: 0x00800000, indexes: [183] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 216] },
    { bytes: 0x00000002, indexes: [1, 4] },
    { bytes: 0xbf800000, indexes: [2, 20] },
    { bytes: 0x82000000, indexes: [3, 213] },
    { bytes: 0x20800000, indexes: [5, 17] },
    { bytes: 0xba000000, indexes: [6, 9, 207, 210] },
    { bytes: 0x2e800000, indexes: [8, 11] },
    { bytes: 0x00000003, indexes: [10] },
    { bytes: 0xba0000f8, indexes: [12, 204] },
    { bytes: 0x000f8001, indexes: [13] },
    { bytes: 0xae800000, indexes: [14] },
    { bytes: 0x82000088, indexes: [15, 201] },
    { bytes: 0x00088002, indexes: [16] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaaaa, indexes: [19] },
    { bytes: 0x00000088, indexes: [21] },
    { bytes: 0x00088000, indexes: [22, 76, 82, 136, 142, 196, 202] },
    { bytes: 0x020000f8, indexes: [24] },
    { bytes: 0x000f8000, indexes: [25, 73, 85, 133, 145, 193, 205] },
    { bytes: 0x02000000, indexes: [30, 36, 42, 48, 54, 60, 66, 90, 96, 102, 108, 114, 120, 126, 150, 156, 162, 168, 174, 180] },
    { bytes: 0x0f8000f8, indexes: [72, 84, 132, 144] },
    { bytes: 0xf8000000, indexes: [74, 86, 134, 146, 194, 206] },
    { bytes: 0x08800088, indexes: [75, 81, 135, 141] },
    { bytes: 0x88000000, indexes: [77, 83, 137, 143, 197, 203] },
    { bytes: 0x0a8000a8, indexes: [78, 138] },
    { bytes: 0x000a8000, indexes: [79, 139, 199] },
    { bytes: 0xa8000000, indexes: [80, 140, 200] },
    { bytes: 0xd6000000, indexes: [186] },
    { bytes: 0x18000000, indexes: [189] },
    { bytes: 0x8a0000f8, indexes: [192] },
    { bytes: 0x00800088, indexes: [195] },
    { bytes: 0xfe0000a8, indexes: [198] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 228] },
    { bytes: 0x03f80000, indexes: [2] },
    { bytes: 0x82000000, indexes: [3, 225] },
    { bytes: 0x2a080000, indexes: [5] },
    { bytes: 0xba000000, indexes: [6, 9, 219, 222] },
    { bytes: 0x0ae80000, indexes: [8, 11] },
    { bytes: 0xba0000f8, indexes: [12, 216] },
    { bytes: 0x0003e000, indexes: [13, 25, 73, 85, 139, 151, 205, 217] },
    { bytes: 0x3ae80000, indexes: [14] },
    { bytes: 0x82000088, indexes: [15, 213] },
    { bytes: 0x00022000, indexes: [16, 22, 76, 82, 142, 148, 208, 214] },
    { bytes: 0x22080000, indexes: [17] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaaaa, indexes: [19] },
    { bytes: 0xabf80000, indexes: [20] },
    { bytes: 0x00000088, indexes: [21] },
    { bytes: 0x020000f8, indexes: [24] },
    { bytes: 0x02000000, indexes: [30, 36, 42, 48, 54, 60, 66, 90, 96, 102, 108, 114, 120, 126, 132, 156, 162, 168, 174, 180, 186, 192] },
    { bytes: 0x0f8000f8, indexes: [72, 84, 138, 150] },
    { bytes: 0x0f800000, indexes: [74, 86, 140, 152, 206, 218] },
    { bytes: 0x08800088, indexes: [75, 81, 141, 147] },
    { bytes: 0x08800000, indexes: [77, 83, 143, 149, 209, 215] },
    { bytes: 0x0a8000a8, indexes: [78, 144] },
    { bytes: 0x0002a000, indexes: [79, 145, 211] },
    { bytes: 0x0a800000, indexes: [80, 146, 212] },
    { bytes: 0x4e000000, indexes: [198] },
    { bytes: 0x08000000, indexes: [201] },
    { bytes: 0x7a0000f8, indexes: [204] },
    { bytes: 0x00800088, indexes: [207] },
    { bytes: 0xfe0000a8, indexes: [210] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 240] },
    { bytes: 0x003f8000, indexes: [2] },
    { bytes: 0x82000000, indexes: [3, 237] },
    { bytes: 0x03a08000, indexes: [5] },
    { bytes: 0xba000000, indexes: [6, 9, 231, 234] },
    { bytes: 0x02ae8000, indexes: [8, 11] },
    { bytes: 0xba0000f8, indexes: [12, 228] },
    { bytes: 0x0000f800, indexes: [13, 25, 73, 85, 145, 157, 217, 229] },
    { bytes: 0x002e8000, indexes: [14] },
    { bytes: 0x82000088, indexes: [15, 225] },
    { bytes: 0x00008800, indexes: [16, 22, 76, 82, 148, 154, 220, 226] },
    { bytes: 0x01208000, indexes: [17] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaaaa, indexes: [19] },
    { bytes: 0xaabf8000, indexes: [20] },
    { bytes: 0x00000088, indexes: [21] },
    { bytes: 0x020000f8, indexes: [24] },
    { bytes: 0x02000000, indexes: [30, 36, 42, 48, 54, 60, 66, 90, 96, 102, 108, 114, 120, 126, 132, 138, 162, 168, 174, 180, 186, 192, 198, 204] },
    { bytes: 0x0f8000f8, indexes: [72, 84, 144, 156] },
    { bytes: 0x00f80000, indexes: [74, 86, 146, 158, 218, 230] },
    { bytes: 0x08800088, indexes: [75, 81, 147, 153] },
    { bytes: 0x00880000, indexes: [77, 83, 149, 155, 221, 227] },
    { bytes: 0x0a8000a8, indexes: [78, 150] },
    { bytes: 0x0000a800, indexes: [79, 151, 223] },
    { bytes: 0x00a80000, indexes: [80, 152, 224] },
    { bytes: 0x72000000, indexes: [210] },
    { bytes: 0x44000000, indexes: [213] },
    { bytes: 0x720000f8, indexes: [216] },
    { bytes: 0x00800088, indexes: [219] },
    { bytes: 0xfe0000a8, indexes: [222] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 252] },
    { bytes: 0x002bf800, indexes: [2] },
    { bytes: 0x82000000, indexes: [3, 249] },
    { bytes: 0x00320800, indexes: [5] },
    { bytes: 0xba000000, indexes: [6, 9, 243, 246] },
    { bytes: 0x0022e800, indexes: [8, 14] },
    { bytes: 0x0012e800, indexes: [11] },
    { bytes: 0xba00000f, indexes: [12, 240] },
    { bytes: 0x80000f80, indexes: [13, 25, 85, 97, 157, 169, 229, 241] },
    { bytes: 0x82000008, indexes: [15, 237] },
    { bytes: 0x80000880, indexes: [16, 22, 88, 94, 160, 166, 232, 238] },
    { bytes: 0x00120800, indexes: [17] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaaaa, indexes: [19] },
    { bytes: 0xaaabf800, indexes: [20] },
    { bytes: 0x00000008, indexes: [21] },
    { bytes: 0x0200000f, indexes: [24] },
    { bytes: 0x02000000, indexes: [30, 36, 42, 48, 54, 60, 66, 72, 78, 102, 108, 114, 120, 126, 132, 138, 144, 150, 174, 180, 186, 192, 198, 204, 210, 216] },
    { bytes: 0x0f80000f, indexes: [84, 96, 156, 168] },
    { bytes: 0x000f8000, indexes: [86, 98, 158, 170, 230, 242] },
    { bytes: 0x08800008, indexes: [87, 93, 159, 165] },
    { bytes: 0x00088000, indexes: [89, 95, 161, 167, 233, 239] },
    { bytes: 0x0a80000a, indexes: [90, 162] },
    { bytes: 0x80000a80, indexes: [91, 163, 235] },
    { bytes: 0x000a8000, indexes: [92, 164, 236] },
    { bytes: 0xea000000, indexes: [222] },
    { bytes: 0x54000000, indexes: [225] },
    { bytes: 0x8200000f, indexes: [228] },
    { bytes: 0x00800008, indexes: [231] },
    { bytes: 0xfe00000a, indexes: [234] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 264] },
    { bytes: 0x0003bf80, indexes: [2] },
    { bytes: 0x82000000, indexes: [3, 261] },
    { bytes: 0x00012080, indexes: [5, 17] },
    { bytes: 0xba000000, indexes: [6, 9, 255, 258] },
    { bytes: 0x00002e80, indexes: [8] },
    { bytes: 0x0002ae80, indexes: [11] },
    { bytes: 0xba00000f, indexes: [12, 252] },
    { bytes: 0x800003e0, indexes: [13, 25, 85, 97, 163, 175, 241, 253] },
    { bytes: 0x00012e80, indexes: [14] },
    { bytes: 0x82000008, indexes: [15, 249] },
    { bytes: 0x80000220, indexes: [16, 22, 88, 94, 166, 172, 244, 250] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaaaa, indexes: [19] },
    { bytes: 0xaaaabf80, indexes: [20] },
    { bytes: 0x00000008, indexes: [21] },
    { bytes: 0x0200000f, indexes: [24] },
    { bytes: 0x02000000, indexes: [30, 36, 42, 48, 54, 60, 66, 72, 78, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 180, 186, 192, 198, 204, 210, 216, 222, 228] },
    { bytes: 0x0f80000f, indexes: [84, 96, 162, 174] },
    { bytes: 0x0000f800, indexes: [86, 98, 164, 176, 242, 254] },
    { bytes: 0x08800008, indexes: [87, 93, 165, 171] },
    { bytes: 0x00008800, indexes: [89, 95, 167, 173, 245, 251] },
    { bytes: 0x0a80000a, indexes: [90, 168] },
    { bytes: 0x800002a0, indexes: [91, 169, 247] },
    { bytes: 0x0000a800, indexes: [92, 170, 248] },
    { bytes: 0x92000000, indexes: [234] },
    { bytes: 0xcc000000, indexes: [237] },
    { bytes: 0x9200000f, indexes: [240] },
    { bytes: 0x00800008, indexes: [243] },
    { bytes: 0xfe00000a, indexes: [246] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 276] },
    { bytes: 0x000013f8, indexes: [2] },
    { bytes: 0x82000000, indexes: [3, 273] },
    { bytes: 0x00001a08, indexes: [5] },
    { bytes: 0xba000000, indexes: [6, 9, 267, 270] },
    { bytes: 0x00000ae8, indexes: [8] },
    { bytes: 0x000012e8, indexes: [11] },
    { bytes: 0xba00000f, indexes: [12, 264] },
    { bytes: 0x800000f8, indexes: [13, 25, 85, 97, 169, 181, 253, 265] },
    { bytes: 0x000032e8, indexes: [14] },
    { bytes: 0x82000008, indexes: [15, 261] },
    { bytes: 0x80000088, indexes: [16, 22, 88, 94, 172, 178, 256, 262] },
    { bytes: 0x00001208, indexes: [17] },
    { bytes: 0xfeaaaaaa, indexes: [18] },
    { bytes: 0xaaaaaaaa, indexes: [19] },
    { bytes: 0xaaaaabf8, indexes: [20] },
    { bytes: 0x00000008, indexes: [21] },
    { bytes: 0x0200000f, indexes: [24] },
    { bytes: 0x02000000, indexes: [30, 36, 42, 48, 54, 60, 66, 72, 78, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240] },
    { bytes: 0x0f80000f, indexes: [84, 96, 168, 180] },
    { bytes: 0x00000f80, indexes: [86, 98, 170, 182, 254, 266] },
    { bytes: 0x08800008, indexes: [87, 93, 171, 177] },
    { bytes: 0x00000880, indexes: [89, 95, 173, 179, 257, 263] },
    { bytes: 0x0a80000a, indexes: [90, 174] },
    { bytes: 0x800000a8, indexes: [91, 175, 259] },
    { bytes: 0x00000a80, indexes: [92, 176, 260] },
    { bytes: 0x0a000000, indexes: [246] },
    { bytes: 0xdc000000, indexes: [249] },
    { bytes: 0x6200000f, indexes: [252] },
    { bytes: 0x00800008, indexes: [255] },
    { bytes: 0xfe00000a, indexes: [258] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 360, 384] },
    { bytes: 0x000001bf, indexes: [2] },
    { bytes: 0x80000000, indexes: [3, 7, 11, 15, 19, 23, 27, 30, 34] },
    { bytes: 0x82000000, indexes: [4, 20, 364, 380] },
    { bytes: 0x000000a0, indexes: [6] },
    { bytes: 0xba000000, indexes: [8, 12, 16, 368, 372, 376] },
    { bytes: 0x000001ae, indexes: [10] },
    { bytes: 0x000000ae, indexes: [14] },
    { bytes: 0xf800000f, indexes: [17, 33, 129, 145, 241, 257, 353, 369] },
    { bytes: 0x800000ae, indexes: [18] },
    { bytes: 0x88000008, indexes: [21, 29, 133, 141, 245, 253, 357, 365] },
    { bytes: 0x80000120, indexes: [22] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25] },
    { bytes: 0xaaaaaabf, indexes: [26] },
    { bytes: 0x02000000, indexes: [32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 152, 160, 168, 176, 184, 192, 200, 208, 216, 224, 232, 264, 272, 280, 288, 296, 304, 312, 320, 328, 336, 344] },
    { bytes: 0x0f800000, indexes: [128, 144, 240, 256] },
    { bytes: 0x800000f8, indexes: [130, 146, 242, 258, 354, 370] },
    { bytes: 0x08800000, indexes: [132, 140, 244, 252] },
    { bytes: 0x80000088, indexes: [134, 142, 246, 254, 358, 366] },
    { bytes: 0x0a800000, indexes: [136, 248] },
    { bytes: 0xa800000a, indexes: [137, 249, 361] },
    { bytes: 0x800000a8, indexes: [138, 250, 362] },
    { bytes: 0xa4000000, indexes: [348] },
    { bytes: 0xfa000000, indexes: [352] },
    { bytes: 0x00800000, indexes: [356] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 400] },
    { bytes: 0x00000033, indexes: [2] },
    { bytes: 0xf8000000, indexes: [3, 27] },
    { bytes: 0x82000000, indexes: [4, 396] },
    { bytes: 0x00000002, indexes: [6] },
    { bytes: 0x08000000, indexes: [7, 23] },
    { bytes: 0xba000000, indexes: [8, 12, 388, 392] },
    { bytes: 0x00000012, indexes: [10] },
    { bytes: 0xe8000000, indexes: [11, 15, 19] },
    { bytes: 0x00000032, indexes: [14] },
    { bytes: 0xba00003e, indexes: [16, 384] },
    { bytes: 0x0000f800, indexes: [17, 33, 105, 121, 193, 209, 281, 297, 369, 385] },
    { bytes: 0x03e0002a, indexes: [18] },
    { bytes: 0x82000022, indexes: [20, 380] },
    { bytes: 0x00008800, indexes: [21, 29, 109, 117, 197, 205, 285, 293, 373, 381] },
    { bytes: 0x02200012, indexes: [22] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25] },
    { bytes: 0xaaaaaaab, indexes: [26] },
    { bytes: 0x00000022, indexes: [28] },
    { bytes: 0x02200000, indexes: [30] },
    { bytes: 0x0200003e, indexes: [32] },
    { bytes: 0x03e00000, indexes: [34] },
    { bytes: 0x02000000, indexes: [40, 48, 56, 64, 72, 80, 88, 96, 128, 136, 144, 152, 160, 168, 176, 184, 216, 224, 232, 240, 248, 256, 264, 272, 304, 312, 320, 328, 336, 344, 352] },
    { bytes: 0x0f80003e, indexes: [104, 120, 192, 208, 280, 296] },
    { bytes: 0x03e0000f, indexes: [106, 122, 194, 210, 282, 298, 370, 386] },
    { bytes: 0x80000000, indexes: [107, 111, 115, 119, 123, 195, 199, 203, 207, 211, 283, 287, 291, 295, 299, 371, 375, 379, 383, 387] },
    { bytes: 0x08800022, indexes: [108, 116, 196, 204, 284, 292] },
    { bytes: 0x02200008, indexes: [110, 118, 198, 206, 286, 294, 374, 382] },
    { bytes: 0x0a80002a, indexes: [112, 200, 288] },
    { bytes: 0x0000a800, indexes: [113, 201, 289, 377] },
    { bytes: 0x02a0000a, indexes: [114, 202, 290, 378] },
    { bytes: 0x9a000000, indexes: [360] },
    { bytes: 0xb4000000, indexes: [364] },
    { bytes: 0x0a00003e, indexes: [368] },
    { bytes: 0x00800022, indexes: [372] },
    { bytes: 0xfe00002a, indexes: [376] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 416] },
    { bytes: 0x00000002, indexes: [2, 6] },
    { bytes: 0x3f800000, indexes: [3] },
    { bytes: 0x82000000, indexes: [4, 412] },
    { bytes: 0x20800000, indexes: [7, 23] },
    { bytes: 0xba000000, indexes: [8, 12, 404, 408] },
    { bytes: 0x00000003, indexes: [10] },
    { bytes: 0x2e800000, indexes: [11] },
    { bytes: 0xae800000, indexes: [15, 19] },
    { bytes: 0xba0000f8, indexes: [16, 400] },
    { bytes: 0x0000f800, indexes: [17, 33, 97, 113, 201, 217, 289, 305, 385, 401] },
    { bytes: 0x00f80001, indexes: [18] },
    { bytes: 0x82000088, indexes: [20, 396] },
    { bytes: 0x00008800, indexes: [21, 29, 101, 109, 205, 213, 293, 301, 389, 397] },
    { bytes: 0x00880001, indexes: [22] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25, 26] },
    { bytes: 0xbf800000, indexes: [27] },
    { bytes: 0x00000088, indexes: [28] },
    { bytes: 0x00880000, indexes: [30, 102, 110, 206, 214, 294, 302, 390, 398] },
    { bytes: 0x020000f8, indexes: [32] },
    { bytes: 0x00f80000, indexes: [34, 98, 114, 202, 218, 290, 306, 386, 402] },
    { bytes: 0x02000000, indexes: [40, 48, 56, 64, 72, 80, 88, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192, 224, 232, 240, 248, 256, 264, 272, 280, 312, 320, 328, 336, 344, 352, 360, 368] },
    { bytes: 0x0f8000f8, indexes: [96, 112, 200, 216, 288, 304] },
    { bytes: 0xf8000000, indexes: [99, 115, 203, 219, 291, 307, 387, 403] },
    { bytes: 0x08800088, indexes: [100, 108, 204, 212, 292, 300] },
    { bytes: 0x88000000, indexes: [103, 111, 207, 215, 295, 303, 391, 399] },
    { bytes: 0x0a8000a8, indexes: [104, 208, 296] },
    { bytes: 0x0000a800, indexes: [105, 209, 297, 393] },
    { bytes: 0x00a80000, indexes: [106, 210, 298, 394] },
    { bytes: 0xa8000000, indexes: [107, 211, 299, 395] },
    { bytes: 0xe2000000, indexes: [376] },
    { bytes: 0x2c000000, indexes: [380] },
    { bytes: 0x1a0000f8, indexes: [384] },
    { bytes: 0x00800088, indexes: [388] },
    { bytes: 0xfe0000a8, indexes: [392] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 432] },
    { bytes: 0x0bf80000, indexes: [3] },
    { bytes: 0x82000000, indexes: [4, 428] },
    { bytes: 0x2a080000, indexes: [7] },
    { bytes: 0xba000000, indexes: [8, 12, 420, 424] },
    { bytes: 0x3ae80000, indexes: [11, 19] },
    { bytes: 0x32e80000, indexes: [15] },
    { bytes: 0xba00000f, indexes: [16, 416] },
    { bytes: 0x80000f80, indexes: [17, 33, 113, 129, 217, 233, 305, 321, 401, 417] },
    { bytes: 0x000f8000, indexes: [18, 34, 114, 130, 218, 234, 306, 322, 402, 418] },
    { bytes: 0x82000008, indexes: [20, 412] },
    { bytes: 0x80000880, indexes: [21, 29, 117, 125, 221, 229, 309, 317, 405, 413] },
    { bytes: 0x00088000, indexes: [22, 30, 118, 126, 222, 230, 310, 318, 406, 414] },
    { bytes: 0x12080000, indexes: [23] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25, 26] },
    { bytes: 0xabf80000, indexes: [27] },
    { bytes: 0x00000008, indexes: [28] },
    { bytes: 0x0200000f, indexes: [32] },
    { bytes: 0x02000000, indexes: [40, 48, 56, 64, 72, 80, 88, 96, 104, 136, 144, 152, 160, 168, 176, 184, 192, 200, 208, 240, 248, 256, 264, 272, 280, 288, 296, 328, 336, 344, 352, 360, 368, 376, 384] },
    { bytes: 0x0f80000f, indexes: [112, 128, 216, 232, 304, 320] },
    { bytes: 0x0f800000, indexes: [115, 131, 219, 235, 307, 323, 403, 419] },
    { bytes: 0x08800008, indexes: [116, 124, 220, 228, 308, 316] },
    { bytes: 0x08800000, indexes: [119, 127, 223, 231, 311, 319, 407, 415] },
    { bytes: 0x0a80000a, indexes: [120, 224, 312] },
    { bytes: 0x80000a80, indexes: [121, 225, 313, 409] },
    { bytes: 0x000a8000, indexes: [122, 226, 314, 410] },
    { bytes: 0x0a800000, indexes: [123, 227, 315, 411] },
    { bytes: 0x7a000000, indexes: [392] },
    { bytes: 0x3c000000, indexes: [396] },
    { bytes: 0xea00000f, indexes: [400] },
    { bytes: 0x00800008, indexes: [404] },
    { bytes: 0xfe00000a, indexes: [408] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 448] },
    { bytes: 0x00bf8000, indexes: [3] },
    { bytes: 0x82000000, indexes: [4, 444] },
    { bytes: 0x00208000, indexes: [7] },
    { bytes: 0xba000000, indexes: [8, 12, 436, 440] },
    { bytes: 0x032e8000, indexes: [11] },
    { bytes: 0x03ae8000, indexes: [15] },
    { bytes: 0xba00003e, indexes: [16, 432] },
    { bytes: 0x00000f80, indexes: [17, 33, 105, 121, 209, 225, 313, 329, 417, 433] },
    { bytes: 0x0003e000, indexes: [18, 34, 106, 122, 210, 226, 314, 330, 418, 434] },
    { bytes: 0x002e8000, indexes: [19] },
    { bytes: 0x82000022, indexes: [20, 428] },
    { bytes: 0x00000880, indexes: [21, 29, 109, 117, 213, 221, 317, 325, 421, 429] },
    { bytes: 0x00022000, indexes: [22, 30, 110, 118, 214, 222, 318, 326, 422, 430] },
    { bytes: 0x03208000, indexes: [23] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25, 26] },
    { bytes: 0xaabf8000, indexes: [27] },
    { bytes: 0x00000022, indexes: [28] },
    { bytes: 0x0200003e, indexes: [32] },
    { bytes: 0x02000000, indexes: [40, 48, 56, 64, 72, 80, 88, 96, 128, 136, 144, 152, 160, 168, 176, 184, 192, 200, 232, 240, 248, 256, 264, 272, 280, 288, 296, 304, 336, 344, 352, 360, 368, 376, 384, 392, 400] },
    { bytes: 0x0f80003e, indexes: [104, 120, 208, 224, 312, 328] },
    { bytes: 0x00f80000, indexes: [107, 123, 211, 227, 315, 331, 419, 435] },
    { bytes: 0x08800022, indexes: [108, 116, 212, 220, 316, 324] },
    { bytes: 0x00880000, indexes: [111, 119, 215, 223, 319, 327, 423, 431] },
    { bytes: 0x0a80002a, indexes: [112, 216, 320] },
    { bytes: 0x00000a80, indexes: [113, 217, 321, 425] },
    { bytes: 0x0002a000, indexes: [114, 218, 322, 426] },
    { bytes: 0x00a80000, indexes: [115, 219, 323, 427] },
    { bytes: 0x36000000, indexes: [408] },
    { bytes: 0x34000000, indexes: [412] },
    { bytes: 0x9200003e, indexes: [416] },
    { bytes: 0x00800022, indexes: [420] },
    { bytes: 0xfe00002a, indexes: [424] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 464] },
    { bytes: 0x0023f800, indexes: [3] },
    { bytes: 0x82000000, indexes: [4, 460] },
    { bytes: 0x000a0800, indexes: [7] },
    { bytes: 0xba000000, indexes: [8, 12, 452, 456] },
    { bytes: 0x003ae800, indexes: [11] },
    { bytes: 0x0002e800, indexes: [15] },
    { bytes: 0xba000003, indexes: [16, 448] },
    { bytes: 0xe00000f8, indexes: [17, 33, 121, 137, 225, 241, 329, 345, 433, 449] },
    { bytes: 0x00003e00, indexes: [18, 34, 122, 138, 226, 242, 330, 346, 434, 450] },
    { bytes: 0x0022e800, indexes: [19] },
    { bytes: 0x82000002, indexes: [20, 444] },
    { bytes: 0x20000088, indexes: [21, 29, 125, 133, 229, 237, 333, 341, 437, 445] },
    { bytes: 0x00002200, indexes: [22, 30, 126, 134, 230, 238, 334, 342, 438, 446] },
    { bytes: 0x00320800, indexes: [23] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25, 26] },
    { bytes: 0xaaabf800, indexes: [27] },
    { bytes: 0x00000002, indexes: [28] },
    { bytes: 0x02000003, indexes: [32] },
    { bytes: 0x02000000, indexes: [40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 144, 152, 160, 168, 176, 184, 192, 200, 208, 216, 248, 256, 264, 272, 280, 288, 296, 304, 312, 320, 352, 360, 368, 376, 384, 392, 400, 408, 416] },
    { bytes: 0x0f800003, indexes: [120, 136, 224, 240, 328, 344] },
    { bytes: 0x000f8000, indexes: [123, 139, 227, 243, 331, 347, 435, 451] },
    { bytes: 0x08800002, indexes: [124, 132, 228, 236, 332, 340] },
    { bytes: 0x00088000, indexes: [127, 135, 231, 239, 335, 343, 439, 447] },
    { bytes: 0x0a800002, indexes: [128, 232, 336] },
    { bytes: 0xa00000a8, indexes: [129, 233, 337, 441] },
    { bytes: 0x00002a00, indexes: [130, 234, 338, 442] },
    { bytes: 0x000a8000, indexes: [131, 235, 339, 443] },
    { bytes: 0xae000000, indexes: [424] },
    { bytes: 0x24000000, indexes: [428] },
    { bytes: 0x62000003, indexes: [432] },
    { bytes: 0x00800002, indexes: [436] },
    { bytes: 0xfe000002, indexes: [440] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 480] },
    { bytes: 0x00033f80, indexes: [3] },
    { bytes: 0x82000000, indexes: [4, 476] },
    { bytes: 0x0002a080, indexes: [7] },
    { bytes: 0xba000000, indexes: [8, 12, 468, 472] },
    { bytes: 0x0001ae80, indexes: [11] },
    { bytes: 0x0003ae80, indexes: [15] },
    { bytes: 0xba00000f, indexes: [16, 464] },
    { bytes: 0x800000f8, indexes: [17, 33, 113, 129, 225, 241, 337, 353, 449, 465] },
    { bytes: 0x00000f80, indexes: [18, 34, 114, 130, 226, 242, 338, 354, 450, 466] },
    { bytes: 0x00012e80, indexes: [19] },
    { bytes: 0x82000008, indexes: [20, 460] },
    { bytes: 0x80000088, indexes: [21, 29, 117, 125, 229, 237, 341, 349, 453, 461] },
    { bytes: 0x00000880, indexes: [22, 30, 118, 126, 230, 238, 342, 350, 454, 462] },
    { bytes: 0x00032080, indexes: [23] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25, 26] },
    { bytes: 0xaaaabf80, indexes: [27] },
    { bytes: 0x00000008, indexes: [28] },
    { bytes: 0x0200000f, indexes: [32] },
    { bytes: 0x02000000, indexes: [40, 48, 56, 64, 72, 80, 88, 96, 104, 136, 144, 152, 160, 168, 176, 184, 192, 200, 208, 216, 248, 256, 264, 272, 280, 288, 296, 304, 312, 320, 328, 360, 368, 376, 384, 392, 400, 408, 416, 424, 432] },
    { bytes: 0x0f80000f, indexes: [112, 128, 224, 240, 336, 352] },
    { bytes: 0x0000f800, indexes: [115, 131, 227, 243, 339, 355, 451, 467] },
    { bytes: 0x08800008, indexes: [116, 124, 228, 236, 340, 348] },
    { bytes: 0x00008800, indexes: [119, 127, 231, 239, 343, 351, 455, 463] },
    { bytes: 0x0a80000a, indexes: [120, 232, 344] },
    { bytes: 0x800000a8, indexes: [121, 233, 345, 457] },
    { bytes: 0x00000a80, indexes: [122, 234, 346, 458] },
    { bytes: 0x0000a800, indexes: [123, 235, 347, 459] },
    { bytes: 0xd6000000, indexes: [440] },
    { bytes: 0xbc000000, indexes: [444] },
    { bytes: 0x7200000f, indexes: [448] },
    { bytes: 0x00800008, indexes: [452] },
    { bytes: 0xfe00000a, indexes: [456] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 472, 496] },
    { bytes: 0x00001bf8, indexes: [3] },
    { bytes: 0x82000000, indexes: [4, 20, 464, 476, 492] },
    { bytes: 0x00002208, indexes: [7] },
    { bytes: 0xba000000, indexes: [8, 12, 16, 480, 484, 488] },
    { bytes: 0x000012e8, indexes: [11] },
    { bytes: 0x000002e8, indexes: [15] },
    { bytes: 0xf800000f, indexes: [17, 33, 129, 145, 241, 257, 353, 369, 465, 481] },
    { bytes: 0x800000f8, indexes: [18, 34, 130, 146, 242, 258, 354, 370, 466, 482] },
    { bytes: 0x000032e8, indexes: [19] },
    { bytes: 0x88000008, indexes: [21, 29, 133, 141, 245, 253, 357, 365, 469, 477] },
    { bytes: 0x80000088, indexes: [22, 30, 134, 142, 246, 254, 358, 366, 470, 478] },
    { bytes: 0x00003208, indexes: [23] },
    { bytes: 0xfeaaaaaa, indexes: [24] },
    { bytes: 0xaaaaaaaa, indexes: [25, 26] },
    { bytes: 0xaaaaabf8, indexes: [27] },
    { bytes: 0x02000000, indexes: [32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 152, 160, 168, 176, 184, 192, 200, 208, 216, 224, 232, 264, 272, 280, 288, 296, 304, 312, 320, 328, 336, 344, 376, 384, 392, 400, 408, 416, 424, 432, 440, 448] },
    { bytes: 0x0f800000, indexes: [128, 144, 240, 256, 352, 368] },
    { bytes: 0x00000f80, indexes: [131, 147, 243, 259, 355, 371, 467, 483] },
    { bytes: 0x08800000, indexes: [132, 140, 244, 252, 356, 364] },
    { bytes: 0x00000880, indexes: [135, 143, 247, 255, 359, 367, 471, 479] },
    { bytes: 0x0a800000, indexes: [136, 248, 360] },
    { bytes: 0xa800000a, indexes: [137, 249, 361, 473] },
    { bytes: 0x800000a8, indexes: [138, 250, 362, 474] },
    { bytes: 0x00000a80, indexes: [139, 251, 363, 475] },
    { bytes: 0x4e000000, indexes: [456] },
    { bytes: 0xac000000, indexes: [460] },
    { bytes: 0x00800000, indexes: [468] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 640] },
    { bytes: 0x0000013f, indexes: [3] },
    { bytes: 0x80000000, indexes: [4, 9, 14, 19, 24, 29, 34] },
    { bytes: 0x82000000, indexes: [5, 635] },
    { bytes: 0x00000320, indexes: [8] },
    { bytes: 0xba000000, indexes: [10, 15, 625, 630] },
    { bytes: 0x0000002e, indexes: [13] },
    { bytes: 0x000001ae, indexes: [18] },
    { bytes: 0xba0000f8, indexes: [20, 620] },
    { bytes: 0x0000f800, indexes: [21, 41, 121, 141, 241, 261, 361, 381, 481, 501, 601, 621] },
    { bytes: 0x00f80000, indexes: [22, 42, 122, 142, 242, 262, 362, 382, 482, 502, 602, 622] },
    { bytes: 0xf80000ae, indexes: [23] },
    { bytes: 0x82000088, indexes: [25, 615] },
    { bytes: 0x00008800, indexes: [26, 36, 126, 136, 246, 256, 366, 376, 486, 496, 606, 616] },
    { bytes: 0x00880000, indexes: [27, 37, 127, 137, 247, 257, 367, 377, 487, 497, 607, 617] },
    { bytes: 0x88000320, indexes: [28] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32] },
    { bytes: 0xaaaaaabf, indexes: [33] },
    { bytes: 0x00000088, indexes: [35] },
    { bytes: 0x88000000, indexes: [38] },
    { bytes: 0x020000f8, indexes: [40] },
    { bytes: 0xf8000000, indexes: [43] },
    { bytes: 0x02000000, indexes: [50, 60, 70, 80, 90, 100, 110, 150, 160, 170, 180, 190, 200, 210, 220, 230, 270, 280, 290, 300, 310, 320, 330, 340, 350, 390, 400, 410, 420, 430, 440, 450, 460, 470, 510, 520, 530, 540, 550, 560, 570, 580] },
    { bytes: 0x0f8000f8, indexes: [120, 140, 240, 260, 360, 380, 480, 500] },
    { bytes: 0xf80000f8, indexes: [123, 143, 243, 263, 363, 383, 483, 503, 603, 623] },
    { bytes: 0x08800088, indexes: [125, 135, 245, 255, 365, 375, 485, 495] },
    { bytes: 0x88000088, indexes: [128, 138, 248, 258, 368, 378, 488, 498, 608, 618] },
    { bytes: 0x0a8000a8, indexes: [130, 250, 370, 490] },
    { bytes: 0x0000a800, indexes: [131, 251, 371, 491, 611] },
    { bytes: 0x00a80000, indexes: [132, 252, 372, 492, 612] },
    { bytes: 0xa80000a8, indexes: [133, 253, 373, 493, 613] },
    { bytes: 0x46000000, indexes: [590] },
    { bytes: 0xd4000000, indexes: [595] },
    { bytes: 0x1a0000f8, indexes: [600] },
    { bytes: 0x00800088, indexes: [605] },
    { bytes: 0xfe0000a8, indexes: [610] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 660] },
    { bytes: 0x0000003b, indexes: [3] },
    { bytes: 0xf8000000, indexes: [4, 34] },
    { bytes: 0x82000000, indexes: [5, 655] },
    { bytes: 0x0000003a, indexes: [8] },
    { bytes: 0x08000000, indexes: [9, 29] },
    { bytes: 0xba000000, indexes: [10, 15, 645, 650] },
    { bytes: 0x0000000a, indexes: [13] },
    { bytes: 0xe8000000, indexes: [14, 19, 24] },
    { bytes: 0x00000022, indexes: [18] },
    { bytes: 0xba00000f, indexes: [20, 640] },
    { bytes: 0x80000f80, indexes: [21, 41, 141, 161, 261, 281, 381, 401, 501, 521, 621, 641] },
    { bytes: 0x000f8000, indexes: [22, 42, 142, 162, 262, 282, 382, 402, 502, 522, 622, 642] },
    { bytes: 0x0f80002a, indexes: [23] },
    { bytes: 0x82000008, indexes: [25, 635] },
    { bytes: 0x80000880, indexes: [26, 36, 146, 156, 266, 276, 386, 396, 506, 516, 626, 636] },
    { bytes: 0x00088000, indexes: [27, 37, 147, 157, 267, 277, 387, 397, 507, 517, 627, 637] },
    { bytes: 0x08800032, indexes: [28] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32] },
    { bytes: 0xaaaaaaab, indexes: [33] },
    { bytes: 0x00000008, indexes: [35] },
    { bytes: 0x08800000, indexes: [38] },
    { bytes: 0x0200000f, indexes: [40] },
    { bytes: 0x0f800000, indexes: [43] },
    { bytes: 0x02000000, indexes: [50, 60, 70, 80, 90, 100, 110, 120, 130, 170, 180, 190, 200, 210, 220, 230, 240, 250, 290, 300, 310, 320, 330, 340, 350, 360, 370, 410, 420, 430, 440, 450, 460, 470, 480, 490, 530, 540, 550, 560, 570, 580, 590, 600] },
    { bytes: 0x0f80000f, indexes: [140, 143, 160, 163, 260, 263, 280, 283, 380, 383, 400, 403, 500, 503, 520, 523, 623, 643] },
    { bytes: 0x80000000, indexes: [144, 149, 154, 159, 164, 264, 269, 274, 279, 284, 384, 389, 394, 399, 404, 504, 509, 514, 519, 524, 624, 629, 634, 639, 644] },
    { bytes: 0x08800008, indexes: [145, 148, 155, 158, 265, 268, 275, 278, 385, 388, 395, 398, 505, 508, 515, 518, 628, 638] },
    { bytes: 0x0a80000a, indexes: [150, 153, 270, 273, 390, 393, 510, 513, 633] },
    { bytes: 0x80000a80, indexes: [151, 271, 391, 511, 631] },
    { bytes: 0x000a8000, indexes: [152, 272, 392, 512, 632] },
    { bytes: 0xde000000, indexes: [610] },
    { bytes: 0xc4000000, indexes: [615] },
    { bytes: 0xea00000f, indexes: [620] },
    { bytes: 0x00800008, indexes: [625] },
    { bytes: 0xfe00000a, indexes: [630] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 680] },
    { bytes: 0x00000002, indexes: [3, 13] },
    { bytes: 0xbf800000, indexes: [4, 34] },
    { bytes: 0x82000000, indexes: [5, 675] },
    { bytes: 0x00000001, indexes: [8, 18] },
    { bytes: 0xa0800000, indexes: [9] },
    { bytes: 0xba000000, indexes: [10, 15, 665, 670] },
    { bytes: 0xae800000, indexes: [14, 19, 24] },
    { bytes: 0xba0000f8, indexes: [20, 660] },
    { bytes: 0x00003e00, indexes: [21, 41, 121, 141, 251, 271, 381, 401, 511, 531, 641, 661] },
    { bytes: 0x000f8000, indexes: [22, 42, 122, 142, 252, 272, 382, 402, 512, 532, 642, 662] },
    { bytes: 0x03e00001, indexes: [23] },
    { bytes: 0x82000088, indexes: [25, 655] },
    { bytes: 0x00002200, indexes: [26, 36, 126, 136, 256, 266, 386, 396, 516, 526, 646, 656] },
    { bytes: 0x00088000, indexes: [27, 37, 127, 137, 257, 267, 387, 397, 517, 527, 647, 657] },
    { bytes: 0x02200003, indexes: [28] },
    { bytes: 0x20800000, indexes: [29] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32, 33] },
    { bytes: 0x00000088, indexes: [35] },
    { bytes: 0x02200000, indexes: [38, 128, 138, 258, 268, 388, 398, 518, 528, 648, 658] },
    { bytes: 0x020000f8, indexes: [40] },
    { bytes: 0x03e00000, indexes: [43, 123, 143, 253, 273, 383, 403, 513, 533, 643, 663] },
    { bytes: 0x02000000, indexes: [50, 60, 70, 80, 90, 100, 110, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 540, 550, 560, 570, 580, 590, 600, 610, 620] },
    { bytes: 0x0f8000f8, indexes: [120, 140, 250, 270, 380, 400, 510, 530] },
    { bytes: 0xf8000000, indexes: [124, 144, 254, 274, 384, 404, 514, 534, 644, 664] },
    { bytes: 0x08800088, indexes: [125, 135, 255, 265, 385, 395, 515, 525] },
    { bytes: 0x88000000, indexes: [129, 139, 259, 269, 389, 399, 519, 529, 649, 659] },
    { bytes: 0x0a8000a8, indexes: [130, 260, 390, 520] },
    { bytes: 0x00002a00, indexes: [131, 261, 391, 521, 651] },
    { bytes: 0x000a8000, indexes: [132, 262, 392, 522, 652] },
    { bytes: 0x02a00000, indexes: [133, 263, 393, 523, 653] },
    { bytes: 0xa8000000, indexes: [134, 264, 394, 524, 654] },
    { bytes: 0xa6000000, indexes: [630] },
    { bytes: 0x5c000000, indexes: [635] },
    { bytes: 0xfa0000f8, indexes: [640] },
    { bytes: 0x00800088, indexes: [645] },
    { bytes: 0xfe0000a8, indexes: [650] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 700] },
    { bytes: 0x03f80000, indexes: [4] },
    { bytes: 0x82000000, indexes: [5, 695] },
    { bytes: 0x12080000, indexes: [9] },
    { bytes: 0xba000000, indexes: [10, 15, 685, 690] },
    { bytes: 0x22e80000, indexes: [14, 19] },
    { bytes: 0xba00000f, indexes: [20, 680] },
    { bytes: 0x800003e0, indexes: [21, 41, 141, 161, 271, 291, 401, 421, 531, 551, 661, 681] },
    { bytes: 0x0000f800, indexes: [22, 42, 142, 162, 272, 292, 402, 422, 532, 552, 662, 682] },
    { bytes: 0x003e0000, indexes: [23, 43, 143, 163, 273, 293, 403, 423, 533, 553, 663, 683] },
    { bytes: 0x3ae80000, indexes: [24] },
    { bytes: 0x82000008, indexes: [25, 675] },
    { bytes: 0x80000220, indexes: [26, 36, 146, 156, 276, 286, 406, 416, 536, 546, 666, 676] },
    { bytes: 0x00008800, indexes: [27, 37, 147, 157, 277, 287, 407, 417, 537, 547, 667, 677] },
    { bytes: 0x00220000, indexes: [28, 38, 148, 158, 278, 288, 408, 418, 538, 548, 668, 678] },
    { bytes: 0x32080000, indexes: [29] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32, 33] },
    { bytes: 0xabf80000, indexes: [34] },
    { bytes: 0x00000008, indexes: [35] },
    { bytes: 0x0200000f, indexes: [40] },
    { bytes: 0x02000000, indexes: [50, 60, 70, 80, 90, 100, 110, 120, 130, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 560, 570, 580, 590, 600, 610, 620, 630, 640] },
    { bytes: 0x0f80000f, indexes: [140, 160, 270, 290, 400, 420, 530, 550] },
    { bytes: 0x0f800000, indexes: [144, 164, 274, 294, 404, 424, 534, 554, 664, 684] },
    { bytes: 0x08800008, indexes: [145, 155, 275, 285, 405, 415, 535, 545] },
    { bytes: 0x08800000, indexes: [149, 159, 279, 289, 409, 419, 539, 549, 669, 679] },
    { bytes: 0x0a80000a, indexes: [150, 280, 410, 540] },
    { bytes: 0x800002a0, indexes: [151, 281, 411, 541, 671] },
    { bytes: 0x0000a800, indexes: [152, 282, 412, 542, 672] },
    { bytes: 0x002a0000, indexes: [153, 283, 413, 543, 673] },
    { bytes: 0x0a800000, indexes: [154, 284, 414, 544, 674] },
    { bytes: 0x3e000000, indexes: [650] },
    { bytes: 0x4c000000, indexes: [655] },
    { bytes: 0x0a00000f, indexes: [660] },
    { bytes: 0x00800008, indexes: [665] },
    { bytes: 0xfe00000a, indexes: [670] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 690, 720] },
    { bytes: 0x02bf8000, indexes: [4] },
    { bytes: 0x82000000, indexes: [5, 25, 695, 715] },
    { bytes: 0x01208000, indexes: [9] },
    { bytes: 0xba000000, indexes: [10, 15, 20, 700, 705, 710] },
    { bytes: 0x03ae8000, indexes: [14] },
    { bytes: 0x00ae8000, indexes: [19] },
    { bytes: 0xf800003e, indexes: [21, 41, 161, 181, 291, 311, 421, 441, 551, 571, 681, 701] },
    { bytes: 0x00000f80, indexes: [22, 42, 162, 182, 292, 312, 422, 442, 552, 572, 682, 702] },
    { bytes: 0x0003e000, indexes: [23, 43, 163, 183, 293, 313, 423, 443, 553, 573, 683, 703] },
    { bytes: 0x002e8000, indexes: [24] },
    { bytes: 0x88000022, indexes: [26, 36, 166, 176, 296, 306, 426, 436, 556, 566, 686, 696] },
    { bytes: 0x00000880, indexes: [27, 37, 167, 177, 297, 307, 427, 437, 557, 567, 687, 697] },
    { bytes: 0x00022000, indexes: [28, 38, 168, 178, 298, 308, 428, 438, 558, 568, 688, 698] },
    { bytes: 0x00a08000, indexes: [29] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32, 33] },
    { bytes: 0xaabf8000, indexes: [34] },
    { bytes: 0x02000000, indexes: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 580, 590, 600, 610, 620, 630, 640, 650, 660] },
    { bytes: 0x0f800000, indexes: [160, 180, 290, 310, 420, 440, 550, 570] },
    { bytes: 0x00f80000, indexes: [164, 184, 294, 314, 424, 444, 554, 574, 684, 704] },
    { bytes: 0x08800000, indexes: [165, 175, 295, 305, 425, 435, 555, 565] },
    { bytes: 0x00880000, indexes: [169, 179, 299, 309, 429, 439, 559, 569, 689, 699] },
    { bytes: 0x0a800000, indexes: [170, 300, 430, 560] },
    { bytes: 0xa800002a, indexes: [171, 301, 431, 561, 691] },
    { bytes: 0x00000a80, indexes: [172, 302, 432, 562, 692] },
    { bytes: 0x0002a000, indexes: [173, 303, 433, 563, 693] },
    { bytes: 0x00a80000, indexes: [174, 304, 434, 564, 694] },
    { bytes: 0xa2000000, indexes: [670] },
    { bytes: 0x60000000, indexes: [675] },
    { bytes: 0xb6000000, indexes: [680] },
    { bytes: 0x00800000, indexes: [685] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 740] },
    { bytes: 0x0003f800, indexes: [4] },
    { bytes: 0x82000000, indexes: [5, 735] },
    { bytes: 0x001a0800, indexes: [9] },
    { bytes: 0xba000000, indexes: [10, 15, 725, 730] },
    { bytes: 0x0032e800, indexes: [14, 19] },
    { bytes: 0xba00000f, indexes: [20, 720] },
    { bytes: 0x800000f8, indexes: [21, 41, 141, 161, 281, 301, 421, 441, 561, 581, 701, 721] },
    { bytes: 0x00000f80, indexes: [22, 42, 142, 162, 282, 302, 422, 442, 562, 582, 702, 722] },
    { bytes: 0x0000f800, indexes: [23, 43, 143, 163, 283, 303, 423, 443, 563, 583, 703, 723] },
    { bytes: 0x0022e800, indexes: [24] },
    { bytes: 0x82000008, indexes: [25, 715] },
    { bytes: 0x80000088, indexes: [26, 36, 146, 156, 286, 296, 426, 436, 566, 576, 706, 716] },
    { bytes: 0x00000880, indexes: [27, 37, 147, 157, 287, 297, 427, 437, 567, 577, 707, 717] },
    { bytes: 0x00008800, indexes: [28, 38, 148, 158, 288, 298, 428, 438, 568, 578, 708, 718] },
    { bytes: 0x000a0800, indexes: [29] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32, 33] },
    { bytes: 0xaaabf800, indexes: [34] },
    { bytes: 0x00000008, indexes: [35] },
    { bytes: 0x0200000f, indexes: [40] },
    { bytes: 0x02000000, indexes: [50, 60, 70, 80, 90, 100, 110, 120, 130, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680] },
    { bytes: 0x0f80000f, indexes: [140, 160, 280, 300, 420, 440, 560, 580] },
    { bytes: 0x000f8000, indexes: [144, 164, 284, 304, 424, 444, 564, 584, 704, 724] },
    { bytes: 0x08800008, indexes: [145, 155, 285, 295, 425, 435, 565, 575] },
    { bytes: 0x00088000, indexes: [149, 159, 289, 299, 429, 439, 569, 579, 709, 719] },
    { bytes: 0x0a80000a, indexes: [150, 290, 430, 570] },
    { bytes: 0x800000a8, indexes: [151, 291, 431, 571, 711] },
    { bytes: 0x00000a80, indexes: [152, 292, 432, 572, 712] },
    { bytes: 0x0000a800, indexes: [153, 293, 433, 573, 713] },
    { bytes: 0x000a8000, indexes: [154, 294, 434, 574, 714] },
    { bytes: 0x3a000000, indexes: [690] },
    { bytes: 0x70000000, indexes: [695] },
    { bytes: 0x4600000f, indexes: [700] },
    { bytes: 0x00800008, indexes: [705] },
    { bytes: 0xfe00000a, indexes: [710] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 730, 760] },
    { bytes: 0x00013f80, indexes: [4] },
    { bytes: 0x82000000, indexes: [5, 25, 735, 755] },
    { bytes: 0x0003a080, indexes: [9] },
    { bytes: 0xba000000, indexes: [10, 15, 20, 740, 745, 750] },
    { bytes: 0x00012e80, indexes: [14, 24] },
    { bytes: 0x0000ae80, indexes: [19] },
    { bytes: 0xf800000f, indexes: [21, 41, 161, 181, 301, 321, 441, 461, 581, 601, 721, 741] },
    { bytes: 0x800000f8, indexes: [22, 42, 162, 182, 302, 322, 442, 462, 582, 602, 722, 742] },
    { bytes: 0x00000f80, indexes: [23, 43, 163, 183, 303, 323, 443, 463, 583, 603, 723, 743] },
    { bytes: 0x88000008, indexes: [26, 36, 166, 176, 306, 316, 446, 456, 586, 596, 726, 736] },
    { bytes: 0x80000088, indexes: [27, 37, 167, 177, 307, 317, 447, 457, 587, 597, 727, 737] },
    { bytes: 0x00000880, indexes: [28, 38, 168, 178, 308, 318, 448, 458, 588, 598, 728, 738] },
    { bytes: 0x0000a080, indexes: [29] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32, 33] },
    { bytes: 0xaaaabf80, indexes: [34] },
    { bytes: 0x02000000, indexes: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700] },
    { bytes: 0x0f800000, indexes: [160, 180, 300, 320, 440, 460, 580, 600] },
    { bytes: 0x0000f800, indexes: [164, 184, 304, 324, 444, 464, 584, 604, 724, 744] },
    { bytes: 0x08800000, indexes: [165, 175, 305, 315, 445, 455, 585, 595] },
    { bytes: 0x00008800, indexes: [169, 179, 309, 319, 449, 459, 589, 599, 729, 739] },
    { bytes: 0x0a800000, indexes: [170, 310, 450, 590] },
    { bytes: 0xa800000a, indexes: [171, 311, 451, 591, 731] },
    { bytes: 0x800000a8, indexes: [172, 312, 452, 592, 732] },
    { bytes: 0x00000a80, indexes: [173, 313, 453, 593, 733] },
    { bytes: 0x0000a800, indexes: [174, 314, 454, 594, 734] },
    { bytes: 0x42000000, indexes: [710] },
    { bytes: 0xe8000000, indexes: [715] },
    { bytes: 0x56000000, indexes: [720] },
    { bytes: 0x00800000, indexes: [725] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 780] },
    { bytes: 0x00003bf8, indexes: [4] },
    { bytes: 0x82000000, indexes: [5, 775] },
    { bytes: 0x00003208, indexes: [9] },
    { bytes: 0xba000000, indexes: [10, 15, 765, 770] },
    { bytes: 0x00001ae8, indexes: [14] },
    { bytes: 0x000032e8, indexes: [19] },
    { bytes: 0xba00000f, indexes: [20, 760] },
    { bytes: 0x80000f80, indexes: [21, 41, 141, 144, 161, 164, 261, 264, 281, 284, 381, 384, 401, 404, 501, 504, 521, 524, 621, 624, 641, 644, 741, 744, 761, 764] },
    { bytes: 0x000f8000, indexes: [22, 42, 142, 162, 262, 282, 382, 402, 502, 522, 622, 642, 742, 762] },
    { bytes: 0x0f80000f, indexes: [23, 43, 140, 143, 160, 163, 260, 263, 280, 283, 380, 383, 400, 403, 500, 503, 520, 523, 620, 623, 640, 643, 743, 763] },
    { bytes: 0x800032e8, indexes: [24] },
    { bytes: 0x82000008, indexes: [25, 755] },
    { bytes: 0x80000880, indexes: [26, 36, 146, 149, 156, 159, 266, 269, 276, 279, 386, 389, 396, 399, 506, 509, 516, 519, 626, 629, 636, 639, 746, 749, 756, 759] },
    { bytes: 0x00088000, indexes: [27, 37, 147, 157, 267, 277, 387, 397, 507, 517, 627, 637, 747, 757] },
    { bytes: 0x08800008, indexes: [28, 38, 145, 148, 155, 158, 265, 268, 275, 278, 385, 388, 395, 398, 505, 508, 515, 518, 625, 628, 635, 638, 748, 758] },
    { bytes: 0x80000a08, indexes: [29] },
    { bytes: 0xfeaaaaaa, indexes: [30] },
    { bytes: 0xaaaaaaaa, indexes: [31, 32, 33] },
    { bytes: 0xaaaaabf8, indexes: [34] },
    { bytes: 0x00000008, indexes: [35] },
    { bytes: 0x80000000, indexes: [39, 44] },
    { bytes: 0x0200000f, indexes: [40] },
    { bytes: 0x02000000, indexes: [50, 60, 70, 80, 90, 100, 110, 120, 130, 170, 180, 190, 200, 210, 220, 230, 240, 250, 290, 300, 310, 320, 330, 340, 350, 360, 370, 410, 420, 430, 440, 450, 460, 470, 480, 490, 530, 540, 550, 560, 570, 580, 590, 600, 610, 650, 660, 670, 680, 690, 700, 710, 720] },
    { bytes: 0x0a80000a, indexes: [150, 153, 270, 273, 390, 393, 510, 513, 630, 633, 753] },
    { bytes: 0x80000a80, indexes: [151, 154, 271, 274, 391, 394, 511, 514, 631, 634, 751, 754] },
    { bytes: 0x000a8000, indexes: [152, 272, 392, 512, 632, 752] },
    { bytes: 0xda000000, indexes: [730] },
    { bytes: 0xf8000000, indexes: [735] },
    { bytes: 0xa600000f, indexes: [740] },
    { bytes: 0x00800008, indexes: [745] },
    { bytes: 0xfe00000a, indexes: [750] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 960] },
    { bytes: 0x0000033f, indexes: [4] },
    { bytes: 0x80000000, indexes: [5, 11, 17, 23, 29, 35, 41, 906] },
    { bytes: 0x82000000, indexes: [6, 954] },
    { bytes: 0x00000220, indexes: [10, 42] },
    { bytes: 0xba000000, indexes: [12, 18, 942, 948] },
    { bytes: 0x000000ae, indexes: [16] },
    { bytes: 0x000002ae, indexes: [22] },
    { bytes: 0xba0003e0, indexes: [24, 936] },
    { bytes: 0x0000f800, indexes: [25, 49, 133, 157, 289, 313, 445, 469, 601, 625, 757, 781, 913, 937] },
    { bytes: 0x003e0000, indexes: [26, 50, 134, 158, 290, 314, 446, 470, 602, 626, 758, 782, 914, 938] },
    { bytes: 0x0f800003, indexes: [27, 51, 135, 159, 291, 315, 447, 471, 603, 627, 759, 783, 915, 939] },
    { bytes: 0xe00000ae, indexes: [28] },
    { bytes: 0x82000220, indexes: [30, 930] },
    { bytes: 0x00008800, indexes: [31, 43, 139, 151, 295, 307, 451, 463, 607, 619, 763, 775, 919, 931] },
    { bytes: 0x00220000, indexes: [32, 44, 140, 152, 296, 308, 452, 464, 608, 620, 764, 776, 920, 932] },
    { bytes: 0x08800002, indexes: [33, 45, 141, 153, 297, 309, 453, 465, 609, 621, 765, 777, 921, 933] },
    { bytes: 0x200000a0, indexes: [34] },
    { bytes: 0xfeaaaaaa, indexes: [36] },
    { bytes: 0xaaaaaaaa, indexes: [37, 38, 39] },
    { bytes: 0xaaaaaabf, indexes: [40] },
    { bytes: 0x20000000, indexes: [46] },
    { bytes: 0x020003e0, indexes: [48] },
    { bytes: 0xe0000000, indexes: [52] },
    { bytes: 0x02000000, indexes: [60, 72, 84, 96, 108, 120, 168, 180, 192, 204, 216, 228, 240, 252, 264, 276, 324, 336, 348, 360, 372, 384, 396, 408, 420, 432, 480, 492, 504, 516, 528, 540, 552, 564, 576, 588, 636, 648, 660, 672, 684, 696, 708, 720, 732, 744, 792, 804, 816, 828, 840, 852, 864, 876, 888] },
    { bytes: 0x0f8003e0, indexes: [132, 156, 288, 312, 444, 468, 600, 624, 756, 780] },
    { bytes: 0xe00000f8, indexes: [136, 160, 292, 316, 448, 472, 604, 628, 760, 784, 916, 940] },
    { bytes: 0x08800220, indexes: [138, 150, 294, 306, 450, 462, 606, 618, 762, 774] },
    { bytes: 0x20000088, indexes: [142, 154, 298, 310, 454, 466, 610, 622, 766, 778, 922, 934] },
    { bytes: 0x0a8002a0, indexes: [144, 300, 456, 612, 768] },
    { bytes: 0x0000a800, indexes: [145, 301, 457, 613, 769, 925] },
    { bytes: 0x002a0000, indexes: [146, 302, 458, 614, 770, 926] },
    { bytes: 0x0a800002, indexes: [147, 303, 459, 615, 771, 927] },
    { bytes: 0xa00000a8, indexes: [148, 304, 460, 616, 772, 928] },
    { bytes: 0xd2000000, indexes: [900] },
    { bytes: 0x3e0003e0, indexes: [912] },
    { bytes: 0x00800220, indexes: [918] },
    { bytes: 0xfe0002a0, indexes: [924] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 984] },
    { bytes: 0x0000001b, indexes: [4] },
    { bytes: 0xf8000000, indexes: [5, 41] },
    { bytes: 0x82000000, indexes: [6, 978] },
    { bytes: 0x0000002a, indexes: [10] },
    { bytes: 0x08000000, indexes: [11, 35] },
    { bytes: 0xba000000, indexes: [12, 18, 966, 972] },
    { bytes: 0x00000002, indexes: [16] },
    { bytes: 0xe8000000, indexes: [17, 23, 29] },
    { bytes: 0x00000012, indexes: [22] },
    { bytes: 0xba00003e, indexes: [24, 960] },
    { bytes: 0x00000f80, indexes: [25, 49, 157, 181, 313, 337, 469, 493, 625, 649, 781, 805, 937, 961] },
    { bytes: 0x0003e000, indexes: [26, 50, 158, 182, 314, 338, 470, 494, 626, 650, 782, 806, 938, 962] },
    { bytes: 0x00f80000, indexes: [27, 51, 159, 183, 315, 339, 471, 495, 627, 651, 783, 807, 939, 963] },
    { bytes: 0x3e00002a, indexes: [28] },
    { bytes: 0x82000022, indexes: [30, 954] },
    { bytes: 0x00000880, indexes: [31, 43, 163, 175, 319, 331, 475, 487, 631, 643, 787, 799, 943, 955] },
    { bytes: 0x00022000, indexes: [32, 44, 164, 176, 320, 332, 476, 488, 632, 644, 788, 800, 944, 956] },
    { bytes: 0x00880000, indexes: [33, 45, 165, 177, 321, 333, 477, 489, 633, 645, 789, 801, 945, 957] },
    { bytes: 0x2200000a, indexes: [34] },
    { bytes: 0xfeaaaaaa, indexes: [36] },
    { bytes: 0xaaaaaaaa, indexes: [37, 38, 39] },
    { bytes: 0xaaaaaaab, indexes: [40] },
    { bytes: 0x00000022, indexes: [42] },
    { bytes: 0x22000000, indexes: [46] },
    { bytes: 0x0200003e, indexes: [48] },
    { bytes: 0x3e000000, indexes: [52] },
    { bytes: 0x02000000, indexes: [60, 72, 84, 96, 108, 120, 132, 144, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 348, 360, 372, 384, 396, 408, 420, 432, 444, 456, 504, 516, 528, 540, 552, 564, 576, 588, 600, 612, 660, 672, 684, 696, 708, 720, 732, 744, 756, 768, 816, 828, 840, 852, 864, 876, 888, 900, 912] },
    { bytes: 0x0f80003e, indexes: [156, 180, 312, 336, 468, 492, 624, 648, 780, 804] },
    { bytes: 0x3e00000f, indexes: [160, 184, 316, 340, 472, 496, 628, 652, 784, 808, 940, 964] },
    { bytes: 0x80000000, indexes: [161, 167, 173, 179, 185, 317, 323, 329, 335, 341, 473, 479, 485, 491, 497, 629, 635, 641, 647, 653, 785, 791, 797, 803, 809, 941, 947, 953, 959, 965] },
    { bytes: 0x08800022, indexes: [162, 174, 318, 330, 474, 486, 630, 642, 786, 798] },
    { bytes: 0x22000008, indexes: [166, 178, 322, 334, 478, 490, 634, 646, 790, 802, 946, 958] },
    { bytes: 0x0a80002a, indexes: [168, 324, 480, 636, 792] },
    { bytes: 0x00000a80, indexes: [169, 325, 481, 637, 793, 949] },
    { bytes: 0x0002a000, indexes: [170, 326, 482, 638, 794, 950] },
    { bytes: 0x00a80000, indexes: [171, 327, 483, 639, 795, 951] },
    { bytes: 0x2a00000a, indexes: [172, 328, 484, 640, 796, 952] },
    { bytes: 0x4a000000, indexes: [924] },
    { bytes: 0x90000000, indexes: [930] },
    { bytes: 0xce00003e, indexes: [936] },
    { bytes: 0x00800022, indexes: [942] },
    { bytes: 0xfe00002a, indexes: [948] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 1008] },
    { bytes: 0xbf800000, indexes: [5, 41] },
    { bytes: 0x82000000, indexes: [6, 1002] },
    { bytes: 0xa0800000, indexes: [11, 35] },
    { bytes: 0xba000000, indexes: [12, 18, 990, 996] },
    { bytes: 0x00000002, indexes: [16, 22, 42] },
    { bytes: 0x2e800000, indexes: [17] },
    { bytes: 0xae800000, indexes: [23, 29] },
    { bytes: 0xba000003, indexes: [24, 984] },
    { bytes: 0xe00000f8, indexes: [25, 49, 181, 205, 337, 361, 493, 517, 649, 673, 805, 829, 961, 985] },
    { bytes: 0x00003e00, indexes: [26, 50, 182, 206, 338, 362, 494, 518, 650, 674, 806, 830, 962, 986] },
    { bytes: 0x000f8000, indexes: [27, 51, 183, 207, 339, 363, 495, 519, 651, 675, 807, 831, 963, 987] },
    { bytes: 0x03e00001, indexes: [28] },
    { bytes: 0x82000002, indexes: [30, 978] },
    { bytes: 0x20000088, indexes: [31, 43, 187, 199, 343, 355, 499, 511, 655, 667, 811, 823, 967, 979] },
    { bytes: 0x00002200, indexes: [32, 44, 188, 200, 344, 356, 500, 512, 656, 668, 812, 824, 968, 980] },
    { bytes: 0x00088000, indexes: [33, 45, 189, 201, 345, 357, 501, 513, 657, 669, 813, 825, 969, 981] },
    { bytes: 0x02200000, indexes: [34, 46, 190, 202, 346, 358, 502, 514, 658, 670, 814, 826, 970, 982] },
    { bytes: 0xfeaaaaaa, indexes: [36] },
    { bytes: 0xaaaaaaaa, indexes: [37, 38, 39, 40] },
    { bytes: 0x02000003, indexes: [48] },
    { bytes: 0x03e00000, indexes: [52, 184, 208, 340, 364, 496, 520, 652, 676, 808, 832, 964, 988] },
    { bytes: 0x02000000, indexes: [60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 372, 384, 396, 408, 420, 432, 444, 456, 468, 480, 528, 540, 552, 564, 576, 588, 600, 612, 624, 636, 684, 696, 708, 720, 732, 744, 756, 768, 780, 792, 840, 852, 864, 876, 888, 900, 912, 924, 936] },
    { bytes: 0x0f800003, indexes: [180, 204, 336, 360, 492, 516, 648, 672, 804, 828] },
    { bytes: 0xf8000000, indexes: [185, 209, 341, 365, 497, 521, 653, 677, 809, 833, 965, 989] },
    { bytes: 0x08800002, indexes: [186, 198, 342, 354, 498, 510, 654, 666, 810, 822] },
    { bytes: 0x88000000, indexes: [191, 203, 347, 359, 503, 515, 659, 671, 815, 827, 971, 983] },
    { bytes: 0x0a800002, indexes: [192, 348, 504, 660, 816] },
    { bytes: 0xa00000a8, indexes: [193, 349, 505, 661, 817, 973] },
    { bytes: 0x00002a00, indexes: [194, 350, 506, 662, 818, 974] },
    { bytes: 0x000a8000, indexes: [195, 351, 507, 663, 819, 975] },
    { bytes: 0x02a00000, indexes: [196, 352, 508, 664, 820, 976] },
    { bytes: 0xa8000000, indexes: [197, 353, 509, 665, 821, 977] },
    { bytes: 0x32000000, indexes: [948] },
    { bytes: 0x08000000, indexes: [954] },
    { bytes: 0xde000003, indexes: [960] },
    { bytes: 0x00800002, indexes: [966] },
    { bytes: 0xfe000002, indexes: [972] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 1032] },
    { bytes: 0x23f80000, indexes: [5] },
    { bytes: 0x82000000, indexes: [6, 1026] },
    { bytes: 0x02080000, indexes: [11] },
    { bytes: 0xba000000, indexes: [12, 18, 1014, 1020] },
    { bytes: 0x2ae80000, indexes: [17] },
    { bytes: 0x12e80000, indexes: [23] },
    { bytes: 0xba0000f8, indexes: [24, 1008] },
    { bytes: 0x00000f80, indexes: [25, 49, 145, 169, 313, 337, 481, 505, 649, 673, 817, 841, 985, 1009] },
    { bytes: 0x0000f800, indexes: [26, 50, 146, 170, 314, 338, 482, 506, 650, 674, 818, 842, 986, 1010] },
    { bytes: 0x000f8000, indexes: [27, 51, 147, 171, 315, 339, 483, 507, 651, 675, 819, 843, 987, 1011] },
    { bytes: 0x00f80000, indexes: [28, 52, 148, 172, 316, 340, 484, 508, 652, 676, 820, 844, 988, 1012] },
    { bytes: 0x3ae80000, indexes: [29] },
    { bytes: 0x82000088, indexes: [30, 1002] },
    { bytes: 0x00000880, indexes: [31, 43, 151, 163, 319, 331, 487, 499, 655, 667, 823, 835, 991, 1003] },
    { bytes: 0x00008800, indexes: [32, 44, 152, 164, 320, 332, 488, 500, 656, 668, 824, 836, 992, 1004] },
    { bytes: 0x00088000, indexes: [33, 45, 153, 165, 321, 333, 489, 501, 657, 669, 825, 837, 993, 1005] },
    { bytes: 0x00880000, indexes: [34, 46, 154, 166, 322, 334, 490, 502, 658, 670, 826, 838, 994, 1006] },
    { bytes: 0x0a080000, indexes: [35] },
    { bytes: 0xfeaaaaaa, indexes: [36] },
    { bytes: 0xaaaaaaaa, indexes: [37, 38, 39, 40] },
    { bytes: 0xabf80000, indexes: [41] },
    { bytes: 0x00000088, indexes: [42] },
    { bytes: 0x020000f8, indexes: [48] },
    { bytes: 0x02000000, indexes: [60, 72, 84, 96, 108, 120, 132, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 348, 360, 372, 384, 396, 408, 420, 432, 444, 456, 468, 516, 528, 540, 552, 564, 576, 588, 600, 612, 624, 636, 684, 696, 708, 720, 732, 744, 756, 768, 780, 792, 804, 852, 864, 876, 888, 900, 912, 924, 936, 948, 960] },
    { bytes: 0x0f8000f8, indexes: [144, 168, 312, 336, 480, 504, 648, 672, 816, 840] },
    { bytes: 0x0f800000, indexes: [149, 173, 317, 341, 485, 509, 653, 677, 821, 845, 989, 1013] },
    { bytes: 0x08800088, indexes: [150, 162, 318, 330, 486, 498, 654, 666, 822, 834] },
    { bytes: 0x08800000, indexes: [155, 167, 323, 335, 491, 503, 659, 671, 827, 839, 995, 1007] },
    { bytes: 0x0a8000a8, indexes: [156, 324, 492, 660, 828] },
    { bytes: 0x00000a80, indexes: [157, 325, 493, 661, 829, 997] },
    { bytes: 0x0000a800, indexes: [158, 326, 494, 662, 830, 998] },
    { bytes: 0x000a8000, indexes: [159, 327, 495, 663, 831, 999] },
    { bytes: 0x00a80000, indexes: [160, 328, 496, 664, 832, 1000] },
    { bytes: 0x0a800000, indexes: [161, 329, 497, 665, 833, 1001] },
    { bytes: 0xaa000000, indexes: [972] },
    { bytes: 0x18000000, indexes: [978] },
    { bytes: 0x2e0000f8, indexes: [984] },
    { bytes: 0x00800088, indexes: [990] },
    { bytes: 0xfe0000a8, indexes: [996] },
  ],
  [
    { bytes: 0xfe000000, indexes: [0, 1056] },
    { bytes: 0x023f8000, indexes: [5] },
    { bytes: 0x82000000, indexes: [6, 1050] },
    { bytes: 0x02a08000, indexes: [11, 35] },
    { bytes: 0xba000000, indexes: [12, 18, 1038, 1044] },
    { bytes: 0x022e8000, indexes: [17] },
    { bytes: 0x01ae8000, indexes: [23] },
    { bytes: 0xba00000f, indexes: [24, 1032] },
    { bytes: 0x800000f8, indexes: [25, 49, 169, 193, 337, 361, 505, 529, 673, 697, 841, 865, 1009, 1033] },
    { bytes: 0x00000f80, indexes: [26, 50, 170, 194, 338, 362, 506, 530, 674, 698, 842, 866, 1010, 1034] },
    { bytes: 0x0000f800, indexes: [27, 51, 171, 195, 339, 363, 507, 531, 675, 699, 843, 867, 1011, 1035] },
    { bytes: 0x000f8000, indexes: [28, 52, 172, 196, 340, 364, 508, 532, 676, 700, 844, 868, 1012, 1036] },
    { bytes: 0x002e8000, indexes: [29] },
    { bytes: 0x82000008, indexes: [30, 1026] },
    { bytes: 0x80000088, indexes: [31, 43, 175, 187, 343, 355, 511, 523, 679, 691, 847, 859, 1015, 1027] },
    { bytes: 0x00000880, indexes: [32, 44, 176, 188, 344, 356, 512, 524, 680, 692, 848, 860, 1016, 1028] },
    { bytes: 0x00008800, indexes: [33, 45, 177, 189, 345, 357, 513, 525, 681, 693, 849, 861, 1017, 1029] },
    { bytes: 0x00088000, indexes: [34, 46, 178, 190, 346, 358, 514, 526, 682, 694, 850, 862, 1018, 1030] },
    { bytes: 0xfeaaaaaa, indexes: [36] },
    { bytes: 0xaaaaaaaa, indexes: [37, 38, 39, 40] },
    { bytes: 0xaabf8000, indexes: [41] },
    { bytes: 0x00000008, indexes: [42] },
    { bytes: 0x0200000f, indexes: [48] },
    { bytes: 0x02000000, indexes: [60, 72, 84, 96, 108, 120, 132, 144, 156, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 372, 384, 396, 408, 420, 432, 444, 456, 468, 480, 492, 540, 552, 564, 576, 588, 600, 612, 624, 636, 648, 660, 708, 720, 732, 744, 756, 768, 780, 792, 804, 816, 828, 876, 888, 900, 912, 924, 936, 948, 960, 972, 984] },
    { bytes: 0x0f80000f, indexes: [168, 192, 336, 360, 504, 528, 672, 696, 840, 864] },
    { bytes: 0x00f80000, indexes: [173, 197, 341, 365, 509, 533, 677, 701, 845, 869, 1013, 1037] },
    { bytes: 0x08800008, indexes: [174, 186, 342, 354, 510, 522, 678, 690, 846, 858] },
    { bytes: 0x00880000, indexes: [179, 191, 347, 359, 515, 527, 683, 695, 851, 863, 1019, 1031] },
    { bytes: 0x0a80000a, indexes: [180, 348, 516, 684, 852] },
    { bytes: 0x800000a8, indexes: [181, 349, 517, 685, 853, 1021] },
    { bytes: 0x00000a80, indexes: [182, 350, 518, 686, 854, 1022] },
    { bytes: 0x0000a800, indexes: [183, 351, 519, 687, 855, 1023] },
    { bytes: 0x000a8000, indexes: [184, 352, 520, 688, 856, 1024] },
    { bytes: 0x00a80000, indexes: [185, 353, 521, 689, 857, 1025] },
    { bytes: 0xe6000000, indexes: [996] },
    { bytes: 0x10000000, indexes: [1002] },
    { bytes: 0x5600000f, indexes: [1008] },
    { bytes: 0x00800008, indexes: [1014] },
    { bytes: 0xfe00000a, indexes: [1020] },
  ],
];

const FORMAT_INFO_BITS = [
  0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
  0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
  0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b,
  0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
];

function getVersionRange(dataStr, config) {
  let minBitsCount = 4 + 10 + 10 * Math.floor(dataStr.length / 3) + (dataStr.length % 3 === 0 ? 0 : (dataStr.length % 3 === 1 ? 4 : 7));
  let maxBitsCount = 28 + 4 + 16 + dataStr.length * 8;
  let minVersion = 0;
  for (let v = 0; v < 40; v++) {
    if (DATA_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= minBitsCount) {
      minVersion = v + 1;
      break;
    }
  }
  if (minVersion === 0) {
    throw Error('Data size too large.');
  }
  let maxVersion = 40;
  for (let v = 0; v < 40; v++) {
    if (DATA_CODEWORDS[v * 4 + config.errorCorrectionLevel] * 8 >= maxBitsCount) {
      maxVersion = v + 1;
      break;
    }
  }
  return [minVersion, maxVersion];
}

function creatMessageSequece(codeBlocks) {
  const messageSequece = [];
  let isExist = true;
  while (isExist) {
    isExist = false;
    for (const block of codeBlocks) {
      if (block.data.length > 0) {
        isExist = true;
        messageSequece.push(block.data.shift());
      }
    }
  }
  isExist = true;
  while (isExist) {
    isExist = false;
    for (const block of codeBlocks) {
      if (block.ecCode.length > 0) {
        isExist = true;
        messageSequece.push(block.ecCode.shift());
      }
    }
  }
  return messageSequece;
}

function setBit(x, y, bits) {
  const index = Math.floor(x / 32);
  const offset = 31 - (x % 32);
  bits[y][index] |= (0x1 << offset);
}

function getBit(x, y, bits) {
  const index = Math.floor(x / 32);
  const offset = 31 - (x % 32);
  return (bits[y][index] & (0x1 << offset)) ? 1 : 0;
}

function isEncodeRegion(x, y, size, alignments) {
  if (x === 6 || y === 6) {
    // timing pattern
    return false;
  }
  if (x <= 8) {
    if (y <= 8) {
      // find pattern (topleft) and format information
      return false;
    }
    if (y >= size - 8) {
      // find pattern (bottomleft) and format information
      return false;
    }
  }
  if (y <= 8 && x >= size - 8) {
    // find pattern (topright) and format information
    return false;
  }
  if (size >= 45) {
    if (x < 6 && y >= size - 11 && y <= size - 9) {
      // version information #1
      return false;
    }
    if (y < 6 && x >= size - 11 && x <= size - 9) {
      // version information #2
      return false;
    }
  }
  const len = alignments.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if ((i === 0 && j ===0) || (i === 0 && j === len - 1) || (i === len - 1 && j === 0)) {
        // top-left, top-right, left-bottom no alignment
      } else {
        if (Math.abs(x - alignments[i]) <= 2 && Math.abs(y - alignments[j]) <= 2) {
          // alignment pattern
          return false;
        }
      }
    }
  }
  return true;
}

function getNextPos(position, config) {
  if ((position.x > 6 && position.x % 2 === 0) || (position.x < 6 && position.x % 2 === 1)) {
    position.x--;
  } else {
    if (position.dir === 0) {
      position.y--;
      if (position.y >= 0) {
        position.x++;
      } else {
        if (position.x === 7) {
          position.x -= 2;
        } else {
          position.x--;
        }
        position.y = 0;
        position.dir = 1;
      }
    } else {
      position.y++;
      if (position.y < config.size) {
        position.x++;
      } else {
        position.x--;
        position.y = config.size - 1;
        position.dir = 0;
      }
    }
  }
  if (!isEncodeRegion(position.x, position.y, config.size, config.alignments)) {
    getNextPos(position, config);
  }
}

function placeCordwords(message, config) {
  const position = { x: config.size - 1, y: config.size - 1, dir: 0 };
  for (const codeword of message) {
    for (let i = 7; i >= 0; i--) {
      const bit = (codeword >>> i) & 0x1;
      if (bit) {
        setBit(position.x, position.y, config.bits);
      }
      getNextPos(position, config);
    }
  }
}

function getScore(masked) {
  const len = masked.length;
  let score = 0;
  let prevBit = -1;
  let sameCount = 0;
  let darkCount = 0;
  // Calculate N1 on Row
  for (let y = 0; y < len; y++) {
    let patternBits = 0;
    let patternCount = 0;
    for (let x = 0; x < len; x++) {
      let currBit = getBit(x, y, masked);
      darkCount += currBit;
      patternBits = ((patternBits << 1) | currBit) & 0x7ff;
      patternCount++;
      if (patternCount >=11 && (patternBits === 0x5d || patternBits === 0x5d0)) {
        // Calculate N3
        score += 40;
      }
      if (currBit === prevBit) {
        sameCount++;
      } else {
        score += (sameCount >= 5 ? sameCount - 2 : 0);
        sameCount = 1;
        prevBit = (prevBit + 1) % 2;
      }
    }
    score += (sameCount >= 5 ? sameCount - 2 : 0);
    prevBit = -1;
    sameCount = 0;
  }
  // Calculate N4
  const total = len * len;
  score += Math.floor(10 * Math.abs(2 * darkCount - total) / total) * 10;
  // Calculate N1 on Column
  for (let x = 0; x < len; x++) {
    let patternBits = 0;
    let patternCount = 0;
    for (let y = 0; y < len; y++) {
      let currBit = getBit(x, y, masked);
      patternBits = ((patternBits << 1) | currBit) & 0x7ff;
      patternCount++;
      if (patternCount >=11 && (patternBits === 0x5d || patternBits === 0x5d0)) {
        // Calculate N3
        score += 40;
      }
      if (currBit === prevBit) {
        sameCount++;
      } else {
        score += (sameCount >= 5 ? sameCount - 2 : 0);
        sameCount = 1;
        prevBit = (prevBit + 1) % 2;
      }
    }
    score += (sameCount >= 5 ? sameCount - 2 : 0);
    prevBit = -1;
    sameCount = 0;
  }
  // Calculate N2
  for (let x = 0; x < len - 1; x++) {
    for (let y = 0; y < len - 1; y++) {
      let currBit = getBit(x, y, masked);
      if (currBit === getBit(x + 1, y, masked) && currBit === getBit(x, y + 1, masked) && currBit === getBit(x + 1, y + 1, masked)) {
        score += 3;
      }
    }
  }
  return score;
}

function setFormatInfo(masked, errorCorrectionLevel, mask) {
  const formatInfo = FORMAT_INFO_BITS[(errorCorrectionLevel << 3) | mask];

  masked[8][0] |= (((formatInfo >>> 9) & 0x3f) << 26) | (((formatInfo >>> 7) & 0x3) << 23);

  const len = masked.length;
  let bitMask = 1;
  for (let offset = 0; offset <= 5; offset++) {
    if (formatInfo & bitMask) {
      setBit(8, offset, masked);
      setBit(len - 1 - offset, 8, masked);
    }
    bitMask = bitMask << 1;
  }
  for (let offset = 6; offset <= 7; offset++) {
    if (formatInfo & bitMask) {
      setBit(8, offset + 1, masked);
      setBit(len - 1 - offset, 8, masked);
    }
    bitMask = bitMask << 1;
  }

  if (formatInfo & bitMask) {
    setBit(7, 8, masked);
    setBit(8, len - 7, masked);
  }
  bitMask = bitMask << 1;

  for (let offset = 9; offset <= 14; offset++) {
    if (formatInfo & bitMask) {
      setBit(14 - offset, 8, masked);
      setBit(8, len - 15 + offset, masked);
    }
    bitMask = bitMask << 1;
  }
}

function shouldMask(x, y, mask) {
  return (mask === 0 && (x + y) % 2 === 0)
    || (mask === 1 && y % 2 === 0)
    || (mask === 2 && x % 3 === 0)
    || (mask === 3 && (x + y) % 3 === 0)
    || (mask === 4 && (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0)
    || (mask === 5 && (x * y) % 2 + (x * y) % 3 === 0)
    || (mask === 6 && (x * y + (x * y) % 3) % 2 === 0)
    || (mask === 7 && (x + x + (x * y) % 3) % 2 === 0);
}

function getSymbol(mask, config) {
  const len = Math.ceil(config.size / 32);
  const masked = Array(config.size).fill().map(_ => new Uint32Array(len));
  for (let x = 0; x < config.size; x++) {
    for (let y = 0; y < config.size; y++) {
      if (shouldMask(x, y, mask) && isEncodeRegion(x, y, config.size, config.alignments)) {
        setBit(x, y, masked);
      }
    }
  }
  for (let x = 0; x < len; x++) {
    for (let y = 0; y < config.size; y++) {
      masked[y][x] ^= config.bits[y][x];
    }
  }
  setFormatInfo(masked, config.errorCorrectionLevel, mask);
  return masked;
}

function getBestSymbol(matrix, config) {
  let score = Number.MAX_VALUE;
  for (let mask = 0; mask < 8; mask++) {
    const masked = getSymbol(mask, config);
    let maskScore = getScore(masked);
    if (maskScore < score) {
      score = maskScore;
      matrix.symbol = masked;
      matrix.mask = mask;
    }
  }
}

function init(config) {
  const matrix = {};
  matrix.version = config.fitSizeVersion;
  config.size = config.fitSizeVersion * 4 + 17;
  matrix.mask = config.mask;
  matrix.errorCorrectionLevel = config.errorCorrectionLevel;
  if (matrix.version < 2) {
    config.alignments = [];
  } else if (matrix.version < 7) {
    config.alignments = [6, config.size - 7];
  } else {
    config.alignments = [6, ...ALIGNMENT_POSITIONS[matrix.version - 7], config.size - 7];
  }
  const len = Math.ceil(config.size / 32);
  config.bits = Array(config.size).fill().map(_ => new Uint32Array(len));
  const bitsArray = MATRIX_BITS_ARRAY[matrix.version - 1];
  for (const initBits of bitsArray) {
    for (const index of initBits.indexes) {
      const x = index % len;
      const y = Math.floor(index / len);
      config.bits[y][x] = initBits.bytes;
    }
  }
  return matrix;
}

const Matrix = {
  generate: function (data, config) {
    let dataStr = data;
    if (config.eciConv) {
      const byteArray = CharSet.convert(data, config.eci);
      dataStr = String.fromCharCode(...byteArray);
    }
    if (config.version === 0) {
      config.versionRange = getVersionRange(dataStr, config);
    } else {
      config.versionRange = [config.version, config.version];
    }
    const segments = Segment.generate(dataStr, config);
    const codewords = Codeword.generate(segments, config);
    const codeBlocks = ErrorCorrection.generate(codewords, config);
    const message = creatMessageSequece(codeBlocks);
    const matrix = init(config);
    placeCordwords(message, config);
    if (matrix.mask === undefined) {
      getBestSymbol(matrix, config);
    } else {
      matrix.symbol = getSymbol(matrix.mask, config);
    }
    matrix.getBit = function(x, y) {
      return getBit(x, y, this.symbol);
    };
    return matrix;
  },
};

export default Matrix;
