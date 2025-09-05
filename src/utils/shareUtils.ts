import { GameState, Difficulty } from '../game/types';
import { INITIAL_LIVES } from '../game/gameState';

const DIFFICULTY_EMOJIS: Record<Difficulty, string> = {
  yellow: '🟨',
  green: '🟩',
  blue: '🟦',
  purple: '🟪'
};

export function generateShareText(gameState: GameState): string {
  const { solvedGroups, mistakeDetails, config } = gameState;
  
  // Generate header
  const header = 'Connections';
  
  // Build emoji grid
  const emojiLines: string[] = [];
  
  // Add solved groups
  solvedGroups.forEach(groupId => {
    const group = config.groups.find(g => g.id === groupId);
    if (group) {
      emojiLines.push(DIFFICULTY_EMOJIS[group.difficulty].repeat(4));
    }
  });
  
  // Add mistakes with difficulty breakdowns
  mistakeDetails.forEach(mistake => {
    const mistakeLine = mistake.difficulties
      .map(difficulty => DIFFICULTY_EMOJIS[difficulty])
      .join('');
    emojiLines.push(mistakeLine);
  });
  
  // Generate result text
  const mistakesText = mistakeDetails.length > 0 ? `Mistakes: ${mistakeDetails.length}/${INITIAL_LIVES}` : 'Perfect!';
  
  return `${header}
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