import { 
  createInitialGameState, 
  toggleSquareSelection,
  submitGuess,
  isOneAwayFromGroup,
  INITIAL_LIVES
} from './gameState';
import { GameConfig } from './types';

const mockGameConfig: GameConfig = {
  groups: [
    { id: 'g1', difficulty: 'yellow', connection: 'Animals', squares: ['s1', 's2', 's3', 's4'] },
    { id: 'g2', difficulty: 'green', connection: 'Colors', squares: ['s5', 's6', 's7', 's8'] },
    { id: 'g3', difficulty: 'blue', connection: 'Numbers', squares: ['s9', 's10', 's11', 's12'] },
    { id: 'g4', difficulty: 'purple', connection: 'Food', squares: ['s13', 's14', 's15', 's16'] }
  ],
  squares: [
    { id: 's1', text: 'DOG', groupId: 'g1', difficulty: 'yellow' },
    { id: 's2', text: 'CAT', groupId: 'g1', difficulty: 'yellow' },
    { id: 's3', text: 'BIRD', groupId: 'g1', difficulty: 'yellow' },
    { id: 's4', text: 'FISH', groupId: 'g1', difficulty: 'yellow' },
    { id: 's5', text: 'RED', groupId: 'g2', difficulty: 'green' },
    { id: 's6', text: 'BLUE', groupId: 'g2', difficulty: 'green' },
    { id: 's7', text: 'GREEN', groupId: 'g2', difficulty: 'green' },
    { id: 's8', text: 'YELLOW', groupId: 'g2', difficulty: 'green' },
    { id: 's9', text: 'ONE', groupId: 'g3', difficulty: 'blue' },
    { id: 's10', text: 'TWO', groupId: 'g3', difficulty: 'blue' },
    { id: 's11', text: 'THREE', groupId: 'g3', difficulty: 'blue' },
    { id: 's12', text: 'FOUR', groupId: 'g3', difficulty: 'blue' },
    { id: 's13', text: 'PIZZA', groupId: 'g4', difficulty: 'purple' },
    { id: 's14', text: 'BURGER', groupId: 'g4', difficulty: 'purple' },
    { id: 's15', text: 'PASTA', groupId: 'g4', difficulty: 'purple' },
    { id: 's16', text: 'SALAD', groupId: 'g4', difficulty: 'purple' }
  ]
};

describe('gameState', () => {
  describe('createInitialGameState', () => {
    it('creates initial game state with shuffled squares', () => {
      const state = createInitialGameState(mockGameConfig);
      
      expect(state.config).toEqual(mockGameConfig);
      expect(state.displaySquares).toHaveLength(16);
      expect(state.selectedSquares.size).toBe(0);
      expect(state.solvedGroups).toEqual([]);
      expect(state.remainingLives).toBe(INITIAL_LIVES);
      expect(state.gameStatus).toBe('playing');
      expect(state.mistakes).toEqual([]);
    });
  });

  describe('toggleSquareSelection', () => {
    it('adds square to selection', () => {
      const initialState = createInitialGameState(mockGameConfig);
      const newState = toggleSquareSelection(initialState, 's1');
      
      expect(newState.selectedSquares.has('s1')).toBe(true);
      expect(newState.selectedSquares.size).toBe(1);
    });

    it('removes square from selection when already selected', () => {
      const initialState = createInitialGameState(mockGameConfig);
      initialState.selectedSquares.add('s1');
      
      const newState = toggleSquareSelection(initialState, 's1');
      
      expect(newState.selectedSquares.has('s1')).toBe(false);
      expect(newState.selectedSquares.size).toBe(0);
    });

    it('prevents selecting more than 4 squares', () => {
      const initialState = createInitialGameState(mockGameConfig);
      initialState.selectedSquares = new Set(['s1', 's2', 's3', 's4']);
      
      const newState = toggleSquareSelection(initialState, 's5');
      
      expect(newState.selectedSquares.size).toBe(4);
      expect(newState.selectedSquares.has('s5')).toBe(false);
    });
  });

  describe('submitGuess', () => {
    it('correctly identifies a valid group', () => {
      const initialState = createInitialGameState(mockGameConfig);
      initialState.selectedSquares = new Set(['s1', 's2', 's3', 's4']);
      
      const newState = submitGuess(initialState);
      
      expect(newState.solvedGroups).toContain('g1');
      expect(newState.selectedSquares.size).toBe(0);
      expect(newState.remainingLives).toBe(INITIAL_LIVES);
    });

    it('decrements lives on incorrect guess', () => {
      const initialState = createInitialGameState(mockGameConfig);
      initialState.selectedSquares = new Set(['s1', 's5', 's9', 's13']);
      
      const newState = submitGuess(initialState);
      
      expect(newState.remainingLives).toBe(INITIAL_LIVES - 1);
      expect(newState.selectedSquares.size).toBe(0);
      expect(newState.mistakes).toHaveLength(1);
    });

    it('sets game status to won when all groups solved', () => {
      const initialState = createInitialGameState(mockGameConfig);
      initialState.solvedGroups = ['g1', 'g2', 'g3'];
      initialState.selectedSquares = new Set(['s13', 's14', 's15', 's16']);
      
      const newState = submitGuess(initialState);
      
      expect(newState.gameStatus).toBe('won');
      expect(newState.solvedGroups).toHaveLength(4);
    });

    it('sets game status to lost when lives reach 0', () => {
      const initialState = createInitialGameState(mockGameConfig);
      initialState.remainingLives = 1;
      initialState.selectedSquares = new Set(['s1', 's5', 's9', 's13']);
      
      const newState = submitGuess(initialState);
      
      expect(newState.gameStatus).toBe('lost');
      expect(newState.remainingLives).toBe(0);
    });
  });

  describe('isOneAwayFromGroup', () => {
    it('returns true when 3 squares are from same group', () => {
      const state = createInitialGameState(mockGameConfig);
      state.selectedSquares = new Set(['s1', 's2', 's3', 's5']);
      
      expect(isOneAwayFromGroup(state)).toBe(true);
    });

    it('returns false when no group has 3 squares', () => {
      const state = createInitialGameState(mockGameConfig);
      state.selectedSquares = new Set(['s1', 's5', 's9', 's13']);
      
      expect(isOneAwayFromGroup(state)).toBe(false);
    });

    it('returns false when less than 4 squares selected', () => {
      const state = createInitialGameState(mockGameConfig);
      state.selectedSquares = new Set(['s1', 's2', 's3']);
      
      expect(isOneAwayFromGroup(state)).toBe(false);
    });
  });
});