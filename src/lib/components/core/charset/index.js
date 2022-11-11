import { ECI } from '../Const';
import BIG5 from './Big5';
import CP1250 from './CP1250';
import CP1251 from './CP1251';
import CP1252 from './CP1252';
import CP1256 from './CP1256';
import CP437 from './CP437';
import EUCKR from './EUCKR';
import GB18030 from './GB18030';
import ISO8859 from './ISO8859';
import SJIS from './ShiftJIS';
import USASCII from './USASCII';
import UTF16BE from './UTF16BE';
import UTF8 from './UTF8';

const getMappingByte = function(charCode, mappingArray) {
  let len = mappingArray.length;
  if (charCode < mappingArray[0].charCode || charCode > mappingArray[len - 1].charCode) {
    return undefined;
  }
  const mapping = mappingArray.find((x) => x.charCode === charCode);
  return (mapping ? mapping.byte : undefined);
}

const CharSet = {
  convert: function(data, eci) {
    if (eci === ECI.CP437_0 || eci === ECI.CP437_1) {
      return CP437.convert(data, getMappingByte);
    } else if (eci === ECI.ISO_8859_1_0 || eci === ECI.ISO_8859_1_1) {
      return ISO8859.convert(data, 1, getMappingByte);
    } else if (eci >= ECI.ISO_8859_2 && eci <= ECI.ISO_8859_16) {
      return ISO8859.convert(data, eci - 2, getMappingByte);
    } else if (eci === ECI.Shift_JIS) {
      return SJIS.convert(data, getMappingByte);
    } else if (eci === ECI.Windows_1250) {
      return CP1250.convert(data, getMappingByte);
    } else if (eci === ECI.Windows_1251) {
      return CP1251.convert(data, getMappingByte);
    } else if (eci === ECI.Windows_1252) {
      return CP1252.convert(data, getMappingByte);
    } else if (eci === ECI.Windows_1256) {
      return CP1256.convert(data, getMappingByte);
    } else if (eci === ECI.UTF_16BE) {
      return UTF16BE.convert(data);
    } else if (eci === ECI.UTF_8) {
      return UTF8.convert(data);
    } else if (eci === ECI.US_ASCII) {
      return USASCII.convert(data);
    } else if (eci === ECI.Big5) {
      return BIG5.convert(data, getMappingByte);
    } else if (eci === ECI.GB_18030) {
      return GB18030.convert(data);
    } else if (eci === ECI.EUC_KR) {
      return EUCKR.convert(data, getMappingByte);
    } else {
      throw Error('Unknown ECI Assignment Value: ' + eci);
    }
  },
}

export default CharSet;

