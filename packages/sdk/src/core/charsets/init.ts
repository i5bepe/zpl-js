/**
 * @fileoverview Character Set Initialization
 * Registers all available character set implementations with the global registry
 */

import { characterSetRegistry, ZPLCharacterSet } from './index';

// Import all implemented character sets
import { CP850CharacterSet } from './cp8xx/CP850';
import { CP852CharacterSet } from './cp8xx/CP852';
import { USA1CharacterSet } from './legacy/USA1';
import { UTF8CharacterSet } from './unicode/UTF8';
import { Win1252CharacterSet } from './windows/Win1252';

/**
 * Initializes the character set registry with all available character sets.
 * This function should be called once during module initialization.
 */
export function initializeCharacterSets(): void {
  // Register legacy character sets
  characterSetRegistry.register(new USA1CharacterSet());

  // Register IBM Code Pages
  characterSetRegistry.register(new CP850CharacterSet());
  characterSetRegistry.register(new CP852CharacterSet());

  // Register Unicode
  characterSetRegistry.register(new UTF8CharacterSet());

  // Register Windows Code Pages
  characterSetRegistry.register(new Win1252CharacterSet());

  // Set USA1 as the default per ZPL specification
  // Users must explicitly use ^CI13 for CP850 (Western European) character support
  characterSetRegistry.setDefault(ZPLCharacterSet.USA1);
}

/**
 * Gets a list of all implemented character sets
 */
export function getImplementedCharacterSets(): Array<{
  ciValue: number;
  name: string;
  description: string;
}> {
  return characterSetRegistry.listCharsets();
}

/**
 * Gets a list of character sets that are defined but not yet implemented
 */
export function getUnimplementedCharacterSets(): Array<{
  ciValue: number;
  name: string;
}> {
  const implemented = new Set(characterSetRegistry.getAvailableCharsets());
  const allDefined = Object.values(ZPLCharacterSet).filter(v => typeof v === 'number') as number[];

  const charsetNames: Record<number, string> = {
    [ZPLCharacterSet.USA1]: 'USA1',
    [ZPLCharacterSet.USA2]: 'USA2',
    [ZPLCharacterSet.UK]: 'UK',
    [ZPLCharacterSet.HOLLAND]: 'Holland',
    [ZPLCharacterSet.DENMARK_NORWAY]: 'Denmark/Norway',
    [ZPLCharacterSet.SWEDEN_FINLAND]: 'Sweden/Finland',
    [ZPLCharacterSet.GERMANY]: 'Germany',
    [ZPLCharacterSet.FRANCE1]: 'France 1',
    [ZPLCharacterSet.FRANCE2]: 'France 2',
    [ZPLCharacterSet.ITALY]: 'Italy',
    [ZPLCharacterSet.SPAIN]: 'Spain',
    [ZPLCharacterSet.MISCELLANEOUS]: 'Miscellaneous',
    [ZPLCharacterSet.JAPAN]: 'Japan',
    [ZPLCharacterSet.CP850]: 'CP850',
    [ZPLCharacterSet.CP852]: 'CP852',
    [ZPLCharacterSet.CP860]: 'CP860',
    [ZPLCharacterSet.CP863]: 'CP863',
    [ZPLCharacterSet.CP865]: 'CP865',
    [ZPLCharacterSet.CP857]: 'CP857',
    [ZPLCharacterSet.CP861]: 'CP861',
    [ZPLCharacterSet.CP862]: 'CP862',
    [ZPLCharacterSet.CP855]: 'CP855',
    [ZPLCharacterSet.CP866]: 'CP866',
    [ZPLCharacterSet.CP737]: 'CP737',
    [ZPLCharacterSet.ISO_8859_1]: 'ISO 8859-1',
    [ZPLCharacterSet.ISO_8859_2]: 'ISO 8859-2',
    [ZPLCharacterSet.ISO_8859_3]: 'ISO 8859-3',
    [ZPLCharacterSet.ISO_8859_4]: 'ISO 8859-4',
    [ZPLCharacterSet.UTF8]: 'UTF-8',
    [ZPLCharacterSet.UTF16_BE]: 'UTF-16 BE',
    [ZPLCharacterSet.UTF16_LE]: 'UTF-16 LE',
    [ZPLCharacterSet.WIN_1250]: 'Windows 1250',
    [ZPLCharacterSet.WIN_1251]: 'Windows 1251',
    [ZPLCharacterSet.WIN_1252]: 'Windows 1252',
    [ZPLCharacterSet.WIN_1253]: 'Windows 1253',
    [ZPLCharacterSet.WIN_1254]: 'Windows 1254',
    [ZPLCharacterSet.WIN_1255]: 'Windows 1255',
  };

  return allDefined
    .filter(ciValue => !implemented.has(ciValue))
    .map(ciValue => ({
      ciValue,
      name: charsetNames[ciValue] || `Unknown (^CI${ciValue})`,
    }))
    .sort((a, b) => a.ciValue - b.ciValue);
}

// Auto-initialize on module load
initializeCharacterSets();
