/**
 * @fileoverview Character Set Registry for ZPL Encoding
 * Manages all available character sets and provides lookup by ^CI command value.
 */

import type { CharacterSet } from './CharacterSet';
import { CharacterSetEncodeError } from './CharacterSet';

/**
 * ZPL Character Set ^CI command values
 */
export enum ZPLCharacterSet {
  USA1 = 0,
  USA2 = 1,
  UK = 2,
  HOLLAND = 3,
  DENMARK_NORWAY = 4,
  SWEDEN_FINLAND = 5,
  GERMANY = 6,
  FRANCE1 = 7,
  FRANCE2 = 8,
  ITALY = 9,
  SPAIN = 10,
  MISCELLANEOUS = 11,
  JAPAN = 12,
  CP850 = 13,  // Most commonly used for Western European
  CP852 = 14,
  CP860 = 15,
  CP863 = 16,
  CP865 = 17,
  CP857 = 18,
  CP861 = 19,
  CP862 = 20,
  CP855 = 21,
  CP866 = 22,
  CP737 = 23,
  ISO_8859_1 = 24,
  ISO_8859_2 = 25,
  ISO_8859_3 = 26,
  ISO_8859_4 = 27,
  UTF8 = 28,
  UTF16_BE = 29,
  UTF16_LE = 30,
  WIN_1250 = 31,
  WIN_1251 = 32,
  WIN_1252 = 33,
  WIN_1253 = 34,
  WIN_1254 = 35,
  WIN_1255 = 36,
}

/**
 * Global registry of character sets, indexed by ^CI command value
 */
class CharacterSetRegistry {
  private charsets = new Map<number, CharacterSet>();
  private defaultCharset: number = ZPLCharacterSet.USA1;
  private warnings: string[] = [];

  /**
   * Registers a character set implementation
   */
  register(charset: CharacterSet): void {
    this.charsets.set(charset.ciValue, charset);
  }

  /**
   * Clear all warnings
   */
  clearWarnings(): void {
    this.warnings = [];
  }

  /**
   * Get all warnings
   */
  getWarnings(): string[] {
    return [...this.warnings];
  }

  /**
   * Add a warning
   */
  private addWarning(message: string): void {
    this.warnings.push(message);
  }

  /**
   * Gets a character set by its ^CI command value
   * @throws {CharacterSetEncodeError} if the character set is not registered
   */
  get(ciValue: number): CharacterSet {
    const charset = this.charsets.get(ciValue);
    if (!charset) {
      // Fall back to default if not found
      const defaultCs = this.charsets.get(this.defaultCharset);
      if (!defaultCs) {
        throw new CharacterSetEncodeError(
          `Character set ^CI${ciValue} is not registered, and default character set ^CI${this.defaultCharset} is also not available`
        );
      }
      this.addWarning(
        `Character set ^CI${ciValue} is not implemented. Using ^CI${this.defaultCharset} (${defaultCs.name}) instead.`
      );
      return defaultCs;
    }
    return charset;
  }

  /**
   * Sets the default character set (used when ^CI is not specified or unsupported)
   */
  setDefault(ciValue: number): void {
    if (!this.charsets.has(ciValue)) {
      throw new CharacterSetEncodeError(
        `Cannot set default to ^CI${ciValue}: character set not registered`
      );
    }
    this.defaultCharset = ciValue;
  }

  /**
   * Gets the default character set
   */
  getDefault(): CharacterSet {
    return this.get(this.defaultCharset);
  }

  /**
   * Checks if a character set is registered
   */
  has(ciValue: number): boolean {
    return this.charsets.has(ciValue);
  }

  /**
   * Gets all registered character set values
   */
  getAvailableCharsets(): number[] {
    return Array.from(this.charsets.keys()).sort((a, b) => a - b);
  }

  /**
   * Gets information about all registered character sets
   */
  listCharsets(): Array<{ ciValue: number; name: string; description: string }> {
    return Array.from(this.charsets.values())
      .map(cs => ({
        ciValue: cs.ciValue,
        name: cs.name,
        description: cs.description,
      }))
      .sort((a, b) => a.ciValue - b.ciValue);
  }
}

/**
 * Global singleton registry instance
 */
export const characterSetRegistry = new CharacterSetRegistry();

/**
 * Convenience function to encode text using a specific character set
 * @param text - Text to encode
 * @param ciValue - ^CI command value (defaults to current default)
 * @param isHexMode - Whether ^FH mode is active
 */
export function encode(text: string, ciValue?: number, isHexMode = false): string {
  const charset = ciValue !== undefined
    ? characterSetRegistry.get(ciValue)
    : characterSetRegistry.getDefault();
  return charset.encode(text, isHexMode);
}

// Re-export types and classes
export type { CharacterSet } from './CharacterSet';
export { CharacterSetEncodeError, SingleByteCharacterSet } from './CharacterSet';
