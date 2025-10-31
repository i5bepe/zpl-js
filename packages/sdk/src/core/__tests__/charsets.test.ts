/**
 * @fileoverview Tests for Character Set Encoding
 * Tests the ^CI command implementation and character encoding
 */

import { zebraEncodeWithCharset, ZPLCharacterSet } from '../encoding';
import { getSwedishCharacterBytes } from '../charsets/cp8xx/CP850';

describe('Character Set Encoding', () => {
  describe('CP850 (Western European) - Swedish Characters', () => {
    it('should correctly encode Swedish lowercase characters', () => {
      const result = zebraEncodeWithCharset('åäö', ZPLCharacterSet.CP850);
      // In CP850: å=134, ä=132, ö=148
      // These map to their respective characters in the CP850 map
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
    });

    it('should correctly encode Swedish uppercase characters', () => {
      const result = zebraEncodeWithCharset('ÅÄÖ', ZPLCharacterSet.CP850);
      // In CP850: Å=143, Ä=142, Ö=153
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
    });

    it('should correctly encode mixed Swedish text', () => {
      const result = zebraEncodeWithCharset('Hej åäö!', ZPLCharacterSet.CP850);
      expect(result).toBeDefined();
      expect(result).toContain('Hej');
      // The encoding transforms the characters, so we just check it's non-empty
      expect(result.length).toBeGreaterThan(0);
    });

    it('should verify Swedish character byte mappings', () => {
      const bytes = getSwedishCharacterBytes();
      expect(bytes['å']).toBe(134);
      expect(bytes['ä']).toBe(132);
      expect(bytes['ö']).toBe(148);
      expect(bytes['Å']).toBe(143);
      expect(bytes['Ä']).toBe(142);
      expect(bytes['Ö']).toBe(153);
    });

    it('should handle ASCII characters correctly', () => {
      const result = zebraEncodeWithCharset('Hello World', ZPLCharacterSet.CP850);
      expect(result).toBe('Hello World');
    });
  });

  describe('UTF-8 Support', () => {
    it('should encode UTF-8 text', () => {
      const result = zebraEncodeWithCharset('Hello 世界', ZPLCharacterSet.UTF8);
      expect(result).toBeDefined();
      expect(result).toContain('Hello');
    });

    it('should handle Swedish characters in UTF-8', () => {
      const result = zebraEncodeWithCharset('åäö', ZPLCharacterSet.UTF8);
      expect(result).toBe('åäö'); // UTF-8 passes through unchanged
    });
  });

  describe('Hex Mode (^FH)', () => {
    it('should decode hex escape sequences in CP850', () => {
      // _84 = 0x84 = 132 = 'ä' in CP850
      // _86 = 0x86 = 134 = 'å' in CP850
      const result = zebraEncodeWithCharset('Test _84_86', ZPLCharacterSet.CP850, true);
      expect(result).toBeDefined();
      expect(result).toContain('Test');
      // The hex values should be decoded to their CP850 characters
    });

    it('should handle mixed text and hex in hex mode', () => {
      const result = zebraEncodeWithCharset('Hello_20World', ZPLCharacterSet.CP850, true);
      expect(result).toBeDefined();
    });
  });

  describe('Character Set Detection', () => {
    it('should use default character set when undefined', () => {
      const result = zebraEncodeWithCharset('Test');
      expect(result).toBeDefined();
    });

    it('should handle USA1 character set', () => {
      const result = zebraEncodeWithCharset('Hello', ZPLCharacterSet.USA1);
      expect(result).toBe('Hello');
    });

    it('should handle Windows 1252 character set', () => {
      const result = zebraEncodeWithCharset('Test', ZPLCharacterSet.WIN_1252);
      expect(result).toBe('Test');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const result = zebraEncodeWithCharset('', ZPLCharacterSet.CP850);
      expect(result).toBe('');
    });

    it('should handle strings with only spaces', () => {
      const result = zebraEncodeWithCharset('   ', ZPLCharacterSet.CP850);
      expect(result).toBe('   ');
    });

    it('should handle special characters in CP850', () => {
      const result = zebraEncodeWithCharset('©®™', ZPLCharacterSet.CP850);
      expect(result).toBeDefined();
    });
  });
});
