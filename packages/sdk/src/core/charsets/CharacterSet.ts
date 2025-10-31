/**
 * @fileoverview Character Set Interface for ZPL Encoding
 * Defines the interface for all character set implementations used in ZPL encoding.
 */

/**
 * Represents a character set encoding used by Zebra printers.
 * Each character set provides a mapping from Unicode code points to printer-specific byte values.
 */
export interface CharacterSet {
  /**
   * The ^CI command value for this character set (e.g., 0 for USA1, 13 for CP850, 28 for UTF-8)
   */
  readonly ciValue: number;

  /**
   * Human-readable name of the character set
   */
  readonly name: string;

  /**
   * Description of the character set and its use cases
   */
  readonly description: string;

  /**
   * Encodes a string using this character set.
   * Converts Unicode characters to the appropriate byte sequence for this encoding.
   * Unsupported characters are replaced with '?' to prevent errors.
   *
   * @param text - The input text to encode
   * @param isHexMode - Whether ^FH (Field Hexadecimal) mode is active
   * @returns The encoded string suitable for ZPL output
   */
  encode(text: string, isHexMode?: boolean): string;

  /**
   * Checks if a character is supported by this character set.
   *
   * @param char - The character to check (single character string or code point)
   * @returns true if the character can be encoded, false otherwise
   */
  supportsCharacter(char: string | number): boolean;

  /**
   * Gets the byte value(s) for a Unicode character in this character set.
   * Returns byte value for '?' (63) if the character is not supported.
   *
   * @param codePoint - Unicode code point of the character
   * @returns Byte value(s) as a number (for single-byte encodings) or Uint8Array (for multi-byte)
   */
  getByteValue(codePoint: number): number | Uint8Array;
}

/**
 * Base class for single-byte character set implementations (Code Pages, ISO 8859, etc.)
 * Provides common functionality for character sets where each character maps to a single byte.
 */
export abstract class SingleByteCharacterSet implements CharacterSet {
  abstract readonly ciValue: number;
  abstract readonly name: string;
  abstract readonly description: string;

  /**
   * Mapping from Unicode code point to byte value (0-255)
   */
  protected abstract unicodeToByteMap: Map<number, number>;

  /**
   * Mapping from byte value (0-255) to Unicode character
   */
  protected abstract byteToUnicodeMap: Map<number, string>;

  encode(text: string, isHexMode = false): string {
    if (isHexMode) {
      return this.encodeHexMode(text);
    }
    return this.encodeNormal(text);
  }

  supportsCharacter(char: string | number): boolean {
    const codePoint = typeof char === 'string' ? char.charCodeAt(0) : char;
    return this.unicodeToByteMap.has(codePoint);
  }

  getByteValue(codePoint: number): number {
    const byteValue = this.unicodeToByteMap.get(codePoint);
    if (byteValue === undefined) {
      // Return byte value for '?' (63) as fallback for unsupported characters
      // This prevents errors and shows a visible placeholder instead
      return 63; // ASCII '?'
    }
    return byteValue;
  }

  /**
   * Encodes text in normal mode (direct character-to-byte mapping)
   */
  protected encodeNormal(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const codePoint = text.charCodeAt(i);
      const byteValue = this.getByteValue(codePoint);
      const character = this.byteToUnicodeMap.get(byteValue);
      if (character === undefined) {
        // Fallback to '?' if byte mapping is missing (shouldn't happen with correct maps)
        result += '?';
      } else {
        result += character;
      }
    }
    return result;
  }

  /**
   * Encodes text in hex mode (^FH), processing _XX hex escape sequences
   */
  protected encodeHexMode(text: string): string {
    const hexPattern = /_([0-9a-fA-F]{2})/g;
    let result = '';
    let lastIndex = 0;
    let match;

    while ((match = hexPattern.exec(text)) !== null) {
      // Encode the text between hex values
      const normalText = text.slice(lastIndex, match.index);
      result += this.encodeNormal(normalText);

      // Parse and encode the hex value
      const hexValue = parseInt(match[1], 16);
      const character = this.byteToUnicodeMap.get(hexValue);
      if (character === undefined) {
        // Fallback to '?' if hex value has no mapping
        result += '?';
      } else {
        result += character;
      }

      lastIndex = match.index + match[0].length;
    }

    // Handle any remaining text after the last hex value
    const remainingText = text.slice(lastIndex);
    result += this.encodeNormal(remainingText);

    return result;
  }
}

/**
 * Error thrown when a character cannot be encoded in a specific character set
 */
export class CharacterSetEncodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CharacterSetEncodeError';
  }
}
