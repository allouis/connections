import { GameState, Difficulty } from '../game/types';
import { INITIAL_LIVES } from '../game/gameState';

const DIFFICULTY_EMOJIS: Record<Difficulty, string> = {
  yellow: '🟨',
  green: '🟩',
  blue: '🟦',
  purple: '🟪'
};

export function generateShareText(gameState: GameState): string {
  const { solvedGroups, mistakes, gameStatus, config } = gameState;
  
  // Generate header
  const header = 'Connections';
  const puzzleDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // Build emoji grid
  const emojiLines: string[] = [];
  
  // Add solved groups
  solvedGroups.forEach(groupId => {
    const group = config.groups.find(g => g.id === groupId);
    if (group) {
      emojiLines.push(DIFFICULTY_EMOJIS[group.difficulty].repeat(4));
    }
  });
  
  // Add mistakes (if any)
  if (mistakes.length > 0 && gameStatus === 'lost') {
    // Show remaining unsolved squares as gray
    const remainingGroups = config.groups.filter(g => !solvedGroups.includes(g.id));
    remainingGroups.forEach(() => {
      emojiLines.push('⬜⬜⬜⬜');
    });
  }
  
  // Generate result text
  const mistakesText = mistakes.length > 0 ? `Mistakes: ${mistakes.length}/${INITIAL_LIVES}` : 'Perfect!';
  
  return `${header}
${puzzleDate}
${mistakesText}

${emojiLines.join('\n')}`;
}

export function generateShareTextWithLink(gameState: GameState): string {
  const shareText = generateShareText(gameState);
  const gameUrl = window.location.href;
  
  return `${shareText}

${gameUrl}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}