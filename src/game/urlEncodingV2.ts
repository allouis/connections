import LZString from 'lz-string';
import { GameConfig, Square, GameGroup, Difficulty } from './types';

// More compact encoding - store essential data including connections
interface CompactGame {
  t: string[]; // texts (16 items)
  g: string;   // group assignments as string of digits "0123012301230123"
  c: string[]; // connections (4 items)
}

const DIFFICULTY_ORDER: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];

export function encodeGameConfigV2(config: GameConfig): string {
  // Create a mapping of groupId to index
  const groupIdToIndex = new Map<string, number>();
  config.groups.forEach((group, index) => {
    groupIdToIndex.set(group.id, index);
  });
  
  // Build group assignment string
  const groupAssignments = config.squares
    .map(square => groupIdToIndex.get(square.groupId) ?? 0)
    .join('');
  
  const compact: CompactGame = {
    t: config.squares.map(s => s.text),
    g: groupAssignments,
    c: config.groups.map(g => g.connection)
  };
  
  // Compress using LZ-string
  const jsonString = JSON.stringify(compact);
  const compressed = LZString.compressToEncodedURIComponent(jsonString);
  
  return compressed;
}

export function decodeGameConfigV2(compressed: string): GameConfig | null {
  try {
    // Decompress
    const jsonString = LZString.decompressFromEncodedURIComponent(compressed);
    if (!jsonString) return null;
    
    const compact: CompactGame = JSON.parse(jsonString);
    
    if (!isValidCompactGame(compact)) return null;
    
    // Reconstruct groups and squares
    const groups: GameGroup[] = DIFFICULTY_ORDER.map((difficulty, index) => ({
      id: `group-${index}`,
      difficulty,
      connection: compact.c?.[index] || '', // Use connection from URL or empty string
      squares: []
    }));
    
    const squares: Square[] = compact.t.map((text, index) => {
      const groupIndex = parseInt(compact.g[index]);
      const group = groups[groupIndex];
      const square: Square = {
        id: `square-${index}`,
        text,
        groupId: group.id,
        difficulty: group.difficulty
      };
      group.squares.push(square.id);
      return square;
    });
    
    return { groups, squares };
  } catch (error) {
    console.error('Failed to decode game config v2:', error);
    return null;
  }
}

function isValidCompactGame(obj: any): obj is CompactGame {
  if (!obj || typeof obj !== 'object') return false;
  if (!Array.isArray(obj.t) || obj.t.length !== 16) return false;
  if (typeof obj.g !== 'string' || obj.g.length !== 16) return false;
  // Connection array is optional for backwards compatibility
  if (obj.c && (!Array.isArray(obj.c) || obj.c.length !== 4)) return false;
  
  // Check all texts are strings
  for (const text of obj.t) {
    if (typeof text !== 'string') return false;
  }
  
  // Check all connections are strings (if present)
  if (obj.c) {
    for (const connection of obj.c) {
      if (typeof connection !== 'string') return false;
    }
  }
  
  // Check all group assignments are valid digits 0-3
  for (const char of obj.g) {
    const num = parseInt(char);
    if (isNaN(num) || num < 0 || num > 3) return false;
  }
  
  return true;
}

export function getGameFromURLV2(): GameConfig | null {
  const params = new URLSearchParams(window.location.search);
  
  // Try new format first
  let gameParam = params.get('g');
  if (gameParam) {
    return decodeGameConfigV2(gameParam);
  }
  
  // Fall back to old format
  gameParam = params.get('game');
  if (gameParam) {
    // Import old decoder dynamically to avoid circular dependency
    const { decodeGameConfig } = require('./urlEncoding');
    return decodeGameConfig(gameParam);
  }
  
  return null;
}

export function generateGameURLV2(config: GameConfig, isAdmin: boolean = false): string {
  const compressed = encodeGameConfigV2(config);
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
  const params = new URLSearchParams();
  
  params.set('g', compressed);
  if (isAdmin) {
    params.set('admin', 'true');
  }
  
  return `${baseUrl}?${params.toString()}`;
}