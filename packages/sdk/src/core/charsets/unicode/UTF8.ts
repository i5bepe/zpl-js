/**
 * @fileoverview UTF-8 Unicode Character Set
 * Supports all Unicode characters
 */

import { CharacterSet } from '../CharacterSet';
import { ZPLCharacterSet } from '../index';

/**
 * UTF-8 Unicode Character Set
 * Supports all Unicode characters (full Unicode range)
 * Variable-length encoding: 1-4 bytes per character
 */
export class UTF8CharacterSet implements CharacterSet {
  readonly ciValue = ZPLCharacterSet.UTF8;
  readonly name = 'UTF-8';
  readonly description = 'Unicode (UTF-8) - Supports all languages and symbols';

  encode(text: string, isHexMode = false): string {
    if (isHexMode) {
      return this.encodeHexMode(text);
    }
    // UTF-8 encoding: Just return the text as-is since JavaScript strings are already Unicode
    // The printer will handle the UTF-8 byte conversion
    return text;
  }

  supportsCharacter(_char: string | number): boolean {
    // UTF-8 supports all Unicode characters
    return true;
  }

  getByteValue(codePoint: number): Uint8Array {
    // Convert Unicode code point to UTF-8 bytes
    const char = String.fromCodePoint(codePoint);
    const encoder = new TextEncoder();
    return encoder.encode(char);
  }

  /**
   * Encodes text in hex mode (^FH), processing _XX hex escape sequences
   */
  private encodeHexMode(text: string): string {
    const hexPattern = /_([0-9a-fA-F]{2})/g;
    let result = '';
    let lastIndex = 0;
    let match;

    while ((match = hexPattern.exec(text)) !== null) {
      // Add the text between hex values
      result += text.slice(lastIndex, match.index);

      // Parse the hex value and convert to character
      const hexValue = parseInt(match[1], 16);
      result += String.fromCodePoint(hexValue);

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    result += text.slice(lastIndex);
    return result;
  }
}
