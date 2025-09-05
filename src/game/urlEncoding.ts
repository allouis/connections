import { GameConfig, Square, GameGroup } from './types';

interface EncodedGame {
  g: Array<{
    c: string; // connection
    d: number; // difficulty index
  }>;
  s: string[]; // square texts
}

const DIFFICULTY_MAP = {
  yellow: 0,
  green: 1,
  blue: 2,
  purple: 3
} as const;

const REVERSE_DIFFICULTY_MAP = ['yellow', 'green', 'blue', 'purple'] as const;

export function encodeGameConfig(config: GameConfig): string {
  const encoded: EncodedGame = {
    g: config.groups.map(group => ({
      c: group.connection,
      d: DIFFICULTY_MAP[group.difficulty]
    })),
    s: config.squares.map(s => s.text)
  };
  
  const jsonString = JSON.stringify(encoded);
  return btoa(jsonString);
}

export function decodeGameConfig(encodedString: string): GameConfig | null {
  try {
    const jsonString = atob(encodedString);
    const decoded: EncodedGame = JSON.parse(jsonString);
    
    if (!isValidEncodedGame(decoded)) {
      return null;
    }
    
    const groups: GameGroup[] = [];
    const squares: Square[] = [];
    let squareIndex = 0;
    
    for (let i = 0; i < 4; i++) {
      const group: GameGroup = {
        id: `group-${i}`,
        connection: decoded.g[i].c,
        difficulty: REVERSE_DIFFICULTY_MAP[decoded.g[i].d],
        squares: []
      };
      
      for (let j = 0; j < 4; j++) {
        const square: Square = {
          id: `square-${squareIndex}`,
          text: decoded.s[squareIndex],
          groupId: group.id,
          difficulty: group.difficulty
        };
        squares.push(square);
        group.squares.push(square.id);
        squareIndex++;
      }
      
      groups.push(group);
    }
    
    return { groups, squares };
  } catch (error) {
    console.error('Failed to decode game config:', error);
    return null;
  }
}

function isValidEncodedGame(obj: any): obj is EncodedGame {
  if (!obj || typeof obj !== 'object') return false;
  if (!Array.isArray(obj.g) || obj.g.length !== 4) return false;
  if (!Array.isArray(obj.s) || obj.s.length !== 16) return false;
  
  for (const group of obj.g) {
    if (typeof group.c !== 'string') return false;
    if (typeof group.d !== 'number' || group.d < 0 || group.d > 3) return false;
  }
  
  for (const text of obj.s) {
    if (typeof text !== 'string') return false;
  }
  
  return true;
}

export function getGameFromURL(): GameConfig | null {
  const params = new URLSearchParams(window.location.search);
  const gameParam = params.get('game');
  
  if (!gameParam) return null;
  
  return decodeGameConfig(gameParam);
}

export function generateGameURL(config: GameConfig, isAdmin: boolean = false): string {
  const encoded = encodeGameConfig(config);
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  params.set('game', encoded);
  if (isAdmin) {
    params.set('admin', 'true');
  }
  
  return `${baseUrl}?${params.toString()}`;
}