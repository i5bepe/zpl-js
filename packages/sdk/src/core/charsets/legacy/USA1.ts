/**
 * @fileoverview USA1 Character Set (Default ZPL Character Set)
 * Based on Code Page 437 with Zebra-specific modifications
 */

import { SingleByteCharacterSet } from '../CharacterSet';
import { ZPLCharacterSet } from '../index';

/**
 * USA1 - Default ZPL Character Set
 * Based on IBM Code Page 437 (DOS Latin US)
 * This is the default character set used when no ^CI command is specified
 */
export class USA1CharacterSet extends SingleByteCharacterSet {
  readonly ciValue = ZPLCharacterSet.USA1;
  readonly name = 'USA1';
  readonly description = 'USA character set (Code Page 437 variant) - Default';

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
      // Control characters (0-31) - Zebra-specific
      0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '',
      8: '', 9: '', 10: '', 11: '', 12: '', 13: '', 14: '', 15: '',
      16: '', 17: '', 18: '', 19: '', 20: '', 21: '', 22: '', 23: '',
      24: '', 25: '',
      26: '0', 27: '⅓', 28: '⅔', 29: 'Ĳ', 30: 'ĳ', 31: '\\',

      // Printable ASCII (32-127)
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

      // Extended Characters (128-255) - USA1 specific (NOT the same as CP850!)
      // Swedish characters åäöÅÄÖ are NOT available in USA1 - use ^CI13 or ^CI5 instead
      128: '�', 129: '�', 130: '�', 131: '�', 132: '�', 133: '�', 134: '�', 135: '�',
      136: '�', 137: '�', 138: '�', 139: '�', 140: '�', 141: '�', 142: '�', 143: '�',
      144: '�', 145: '�', 146: '�', 147: '�', 148: '�', 149: '�', 150: '�', 151: '�',
      152: '�', 153: '�', 154: '�', 155: '�', 156: '�', 157: '�', 158: '�', 159: '�',
      160: 'á', 161: 'í', 162: 'ó', 163: 'ú', 164: 'ñ', 165: 'Ñ', 166: 'ª', 167: 'º',
      168: '¿', 169: '⌐', 170: '¬', 171: '½', 172: '¼', 173: '¡', 174: '«', 175: '»',
      176: '░', 177: '▒', 178: '▓', 179: '│', 180: '┤', 181: '╡', 182: '╢', 183: '╖',
      184: '╕', 185: '╣', 186: '║', 187: '╗', 188: '╝', 189: '╜', 190: '╛', 191: '┐',
      192: '└', 193: '┴', 194: '┬', 195: '├', 196: '─', 197: '┼', 198: '╞', 199: '╟',
      200: '╚', 201: '╔', 202: '╩', 203: '╦', 204: '╠', 205: '═', 206: '╬', 207: '╧',
      208: '╨', 209: '╤', 210: '╥', 211: '╙', 212: '╘', 213: '╒', 214: '╓', 215: '╫',
      216: '╪', 217: '┘', 218: '┌', 219: '█', 220: '▄', 221: '▌', 222: '▐', 223: '▀',
      224: 'α', 225: 'ß', 226: 'Γ', 227: 'π', 228: 'Σ', 229: 'σ', 230: 'µ', 231: 'τ',
      232: 'Φ', 233: 'Θ', 234: 'Ω', 235: 'δ', 236: '∞', 237: 'φ', 238: 'ε', 239: '∩',
      240: '≡', 241: '±', 242: '≥', 243: '≤', 244: '⌠', 245: '⌡', 246: '÷', 247: '≈',
      248: '°', 249: '∙', 250: '·', 251: '√', 252: 'ⁿ', 253: '²', 254: '■', 255: ' ',
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
