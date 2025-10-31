/**
 * @fileoverview IBM Code Page 852 (Latin 2 - Central European) Character Set
 * Used for Central and Eastern European languages
 */

import { SingleByteCharacterSet } from '../CharacterSet';
import { ZPLCharacterSet } from '../index';

/**
 * IBM Code Page 852 - Latin 2 (Central European)
 * Supports: Polish, Czech, Slovak, Hungarian, Slovenian, Croatian, Romanian, etc.
 */
export class CP852CharacterSet extends SingleByteCharacterSet {
  readonly ciValue = ZPLCharacterSet.CP852;
  readonly name = 'IBM Code Page 852';
  readonly description = 'Latin 2 - Central and Eastern European languages';

  protected unicodeToByteMap: Map<number, number>;
  protected byteToUnicodeMap: Map<number, string>;

  constructor() {
    super();
    const { unicodeToByteMap, byteToUnicodeMap } = this.createMappings();
    this.unicodeToByteMap = unicodeToByteMap;
    this.byteToUnicodeMap = byteToUnicodeMap;
  }

  private createMappings(): {
    unicodeToByteMap: Map<number, number>;
    byteToUnicodeMap: Map<number, string>;
  } {
    const byteToUnicode: Record<number, string> = {
      // Control characters (0-31) - Same as CP850
      0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '',
      8: '', 9: '', 10: '', 11: '', 12: '', 13: '', 14: '', 15: '',
      16: '', 17: '', 18: '', 19: '', 20: '', 21: '', 22: '', 23: '',
      24: '', 25: '',
      26: '0', 27: '⅓', 28: '⅔', 29: 'Ĳ', 30: 'ĳ', 31: '\\',

      // Printable ASCII (32-127) - Standard ASCII
      32: ' ', 33: '!', 34: '"', 35: '#', 36: '$', 37: '%', 38: '&', 39: "'",
      40: '(', 41: ')', 42: '*', 43: '+', 44: ',', 45: '-', 46: '.', 47: '/',
      48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7',
      56: '8', 57: '9', 58: ':', 59: ';', 60: '<', 61: '=', 62: '>', 63: '?',
      64: '@', 65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E', 70: 'F', 71: 'G',
      72: 'H', 73: 'I', 74: 'J', 75: 'K', 76: 'L', 77: 'M', 78: 'N', 79: 'O',
      80: 'P', 81: 'Q', 82: 'R', 83: 'S', 84: 'T', 85: 'U', 86: 'V', 87: 'W',
      88: 'X', 89: 'Y', 90: 'Z', 91: '[', 92: '\\', 93: ']', 94: '^', 95: '_',
      96: '`', 97: 'a', 98: 'b', 99: 'c', 100: 'd', 101: 'e', 102: 'f', 103: 'g',
      104: 'h', 105: 'i', 106: 'j', 107: 'k', 108: 'l', 109: 'm', 110: 'n', 111: 'o',
      112: 'p', 113: 'q', 114: 'r', 115: 's', 116: 't', 117: 'u', 118: 'v', 119: 'w',
      120: 'x', 121: 'y', 122: 'z', 123: '{', 124: '|', 125: '}', 126: '~', 127: '⌂',

      // Extended Characters (128-255) - CP852 specific for Central European
      128: 'Ç', 129: 'ü', 130: 'é', 131: 'â', 132: 'ä', 133: 'ů', 134: 'ć', 135: 'ç',
      136: 'ł', 137: 'ë', 138: 'Ő', 139: 'ő', 140: 'î', 141: 'Ź', 142: 'Ä', 143: 'Ć',
      144: 'É', 145: 'Ĺ', 146: 'ĺ', 147: 'ô', 148: 'ö', 149: 'Ľ', 150: 'ľ', 151: 'Ś',
      152: 'ś', 153: 'Ö', 154: 'Ü', 155: 'Ť', 156: 'ť', 157: 'Ł', 158: '×', 159: 'č',
      160: 'á', 161: 'í', 162: 'ó', 163: 'ú', 164: 'Ą', 165: 'ą', 166: 'Ž', 167: 'ž',
      168: 'Ę', 169: 'ę', 170: '¬', 171: 'ź', 172: 'Č', 173: 'ş', 174: '«', 175: '»',
      176: '░', 177: '▒', 178: '▓', 179: '│', 180: '┤', 181: 'Á', 182: 'Â', 183: 'Ě',
      184: 'Ş', 185: '╣', 186: '║', 187: '╗', 188: '╝', 189: 'Ż', 190: 'ż', 191: '┐',
      192: '└', 193: '┴', 194: '┬', 195: '├', 196: '─', 197: '┼', 198: 'Ă', 199: 'ă',
      200: '╚', 201: '╔', 202: '╩', 203: '╦', 204: '╠', 205: '═', 206: '╬', 207: '¤',
      208: 'đ', 209: 'Đ', 210: 'Ď', 211: 'Ë', 212: 'ď', 213: 'Ň', 214: 'Í', 215: 'Î',
      216: 'ě', 217: '┘', 218: '┌', 219: '█', 220: '▄', 221: 'Ţ', 222: 'Ů', 223: '▀',
      224: 'Ó', 225: 'ß', 226: 'Ô', 227: 'Ń', 228: 'ń', 229: 'ň', 230: 'Š', 231: 'š',
      232: 'Ŕ', 233: 'Ú', 234: 'ŕ', 235: 'Ű', 236: 'ý', 237: 'Ý', 238: 'ţ', 239: '´',
      240: '­', 241: '˝', 242: '˛', 243: 'ˇ', 244: '˘', 245: '§', 246: '÷', 247: '¸',
      248: '°', 249: '¨', 250: '˙', 251: 'ű', 252: 'Ř', 253: 'ř', 254: '■', 255: ' ',
    };

    const unicodeToByteMap = new Map<number, number>();
    const byteToUnicodeMap = new Map<number, string>();

    for (const [byteValue, char] of Object.entries(byteToUnicode)) {
      const byte = parseInt(byteValue, 10);
      byteToUnicodeMap.set(byte, char);
      if (char.length > 0) {
        const codePoint = char.charCodeAt(0);
        if (!unicodeToByteMap.has(codePoint)) {
          unicodeToByteMap.set(codePoint, byte);
        }
      }
    }

    return { unicodeToByteMap, byteToUnicodeMap };
  }
}
