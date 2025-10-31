/**
 * @fileoverview IBM Code Page 850 (Multilingual Latin 1) Character Set
 * Used for Western European languages including Swedish, German, French, Spanish, etc.
 */

import { SingleByteCharacterSet } from '../CharacterSet';
import { ZPLCharacterSet } from '../index';

/**
 * IBM Code Page 850 - Multilingual (Latin 1)
 * This is the most commonly used character set for European languages on Zebra printers.
 * Supports: English, Swedish, Norwegian, Danish, German, French, Spanish, Italian, Portuguese, etc.
 */
export class CP850CharacterSet extends SingleByteCharacterSet {
  readonly ciValue = ZPLCharacterSet.CP850;
  readonly name = 'IBM Code Page 850';
  readonly description = 'Multilingual (Latin 1) - Western European languages';

  protected unicodeToByteMap: Map<number, number>;
  protected byteToUnicodeMap: Map<number, string>;

  constructor() {
    super();
    const { unicodeToByteMap, byteToUnicodeMap } = this.createMappings();
    this.unicodeToByteMap = unicodeToByteMap;
    this.byteToUnicodeMap = byteToUnicodeMap;
  }

  /**
   * Creates bidirectional mappings for CP850 character set
   * Includes Zebra-specific control character mappings
   */
  private createMappings(): {
    unicodeToByteMap: Map<number, number>;
    byteToUnicodeMap: Map<number, string>;
  } {
    // Byte to Unicode mapping (what gets rendered)
    const byteToUnicode: Record<number, string> = {
      // Control characters (0-31) - Zebra-specific mappings
      0: '', // NUL
      1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '',
      8: '', 9: '', 10: '', 11: '', 12: '', 13: '', 14: '', 15: '',
      16: '', 17: '', 18: '', 19: '', 20: '', 21: '', 22: '', 23: '',
      24: '', 25: '',
      26: '0',   // SUB (Zebra: "0")
      27: '⅓',   // ESC (Zebra: "⅓")
      28: '⅔',   // FS  (Zebra: "⅔")
      29: 'Ĳ',   // GS  (Zebra: "Ĳ")
      30: 'ĳ',   // RS  (Zebra: "ĳ")
      31: '\\',  // US  (Zebra: "\")

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

      // Extended Characters (128-255) - CP850 specific
      128: 'Ç',  129: 'ü',  130: 'é',  131: 'â',  132: 'ä',  133: 'à',  134: 'å',  135: 'ç',
      136: 'ê',  137: 'ë',  138: 'è',  139: 'ï',  140: 'î',  141: 'ì',  142: 'Ä',  143: 'Å',
      144: 'É',  145: 'æ',  146: 'Æ',  147: 'ô',  148: 'ö',  149: 'ò',  150: 'û',  151: 'ù',
      152: 'ÿ',  153: 'Ö',  154: 'Ü',  155: 'ø',  156: '£',  157: 'Ø',  158: '×',  159: 'ƒ',
      160: 'á',  161: 'í',  162: 'ó',  163: 'ú',  164: 'ñ',  165: 'Ñ',  166: 'ª',  167: 'º',
      168: '¿',  169: '®',  170: '¬',  171: '½',  172: '¼',  173: '¡',  174: '«',  175: '»',
      176: '░',  177: '▒',  178: '▓',  179: '│',  180: '┤',  181: 'Á',  182: 'Â',  183: 'À',
      184: '©',  185: '╣',  186: '║',  187: '╗',  188: '╝',  189: '¢',  190: '¥',  191: '┐',
      192: '└',  193: '┴',  194: '┬',  195: '├',  196: '─',  197: '┼',  198: 'ã',  199: 'Ã',
      200: '╚',  201: '╔',  202: '╩',  203: '╦',  204: '╠',  205: '═',  206: '╬',  207: '¤',
      208: 'ð',  209: 'Ð',  210: 'Ê',  211: 'Ë',  212: 'È',  213: 'i',  214: 'Í',  215: 'Î',
      216: 'Ï',  217: '┘',  218: '┌',  219: '█',  220: '▄',  221: '¦',  222: 'Ì',  223: '▀',
      224: 'Ó',  225: 'ß',  226: 'Ô',  227: 'Ò',  228: 'õ',  229: 'Õ',  230: 'µ',  231: 'þ',
      232: 'Þ',  233: 'Ú',  234: 'Û',  235: 'Ù',  236: 'ý',  237: 'Ý',  238: '¯',  239: '´',
      240: '-',  241: 'Ð',  242: '±',  243: '¾',  244: '¶',  245: '§',  246: '÷',  247: '¸',
      248: '°',  249: '¨',  250: '·',  251: '¹',  252: '³',  253: '²',  254: '■',  255: ' ',
    };

    // Create Unicode to byte mapping (reverse of above)
    // This is the KEY FIX for Swedish characters!
    const unicodeToByteMap = new Map<number, number>();
    const byteToUnicodeMap = new Map<number, string>();

    // Populate both maps
    for (const [byteValue, char] of Object.entries(byteToUnicode)) {
      const byte = parseInt(byteValue, 10);
      byteToUnicodeMap.set(byte, char);

      // For Unicode to byte mapping, use the character's code point
      if (char.length > 0) {
        const codePoint = char.charCodeAt(0);
        // Only map if not already mapped (some control chars may duplicate)
        if (!unicodeToByteMap.has(codePoint)) {
          unicodeToByteMap.set(codePoint, byte);
        }
      }
    }

    return { unicodeToByteMap, byteToUnicodeMap };
  }
}

/**
 * Helper function to get Swedish character byte values in CP850
 * Useful for testing and debugging
 */
export function getSwedishCharacterBytes(): Record<string, number> {
  return {
    'å': 134,  // U+00E5 → byte 134 (0x86)
    'ä': 132,  // U+00E4 → byte 132 (0x84)
    'ö': 148,  // U+00F6 → byte 148 (0x94)
    'Å': 143,  // U+00C5 → byte 143 (0x8F)
    'Ä': 142,  // U+00C4 → byte 142 (0x8E)
    'Ö': 153,  // U+00D6 → byte 153 (0x99)
  };
}
