import { validateGameConfig, createEmptyGameConfig } from './validation';
import { GameConfig } from './types';

describe('validation', () => {
  describe('validateGameConfig', () => {
    const validConfig: GameConfig = {
      groups: [
        { id: 'g1', difficulty: 'yellow', connection: 'Animals', squares: ['s1', 's2', 's3', 's4'] },
        { id: 'g2', difficulty: 'green', connection: 'Colors', squares: ['s5', 's6', 's7', 's8'] },
        { id: 'g3', difficulty: 'blue', connection: 'Numbers', squares: ['s9', 's10', 's11', 's12'] },
        { id: 'g4', difficulty: 'purple', connection: 'Food', squares: ['s13', 's14', 's15', 's16'] }
      ],
      squares: Array.from({ length: 16 }, (_, i) => ({
        id: `s${i + 1}`,
        text: `Text${i + 1}`,
        groupId: `g${Math.floor(i / 4) + 1}`,
        difficulty: ['yellow', 'yellow', 'yellow', 'yellow', 'green', 'green', 'green', 'green', 'blue', 'blue', 'blue', 'blue', 'purple', 'purple', 'purple', 'purple'][i] as any
      }))
    };

    it('accepts valid game config', () => {
      expect(validateGameConfig(validConfig)).toBe(null);
    });

    it('rejects config with wrong number of groups', () => {
      const invalidConfig = {
        ...validConfig,
        groups: validConfig.groups.slice(0, 3)
      };
      
      expect(validateGameConfig(invalidConfig)).toBe('Game must have exactly 4 groups');
    });

    it('rejects config with wrong number of squares in group', () => {
      const invalidConfig = {
        ...validConfig,
        groups: [
          ...validConfig.groups.slice(0, 3),
          { ...validConfig.groups[3], squares: ['s13', 's14', 's15'] }
        ]
      };
      
      expect(validateGameConfig(invalidConfig)).toContain('must have exactly 4 squares');
    });

    it('rejects config with wrong total number of squares', () => {
      const invalidConfig = {
        ...validConfig,
        squares: validConfig.squares.slice(0, 15)
      };
      
      expect(validateGameConfig(invalidConfig)).toBe('Game must have exactly 16 squares');
    });

    it('rejects config with duplicate difficulties', () => {
      const invalidConfig = {
        ...validConfig,
        groups: validConfig.groups.map((g, i) => ({
          ...g,
          difficulty: i < 2 ? 'yellow' : g.difficulty
        }))
      };
      
      expect(validateGameConfig(invalidConfig)).toBe('Each difficulty level must be used exactly once');
    });

    it('rejects config with unassigned squares', () => {
      const invalidConfig = {
        ...validConfig,
        groups: validConfig.groups.map(g => ({
          ...g,
          squares: g.squares.slice(0, 3).concat(['extra-id'])
        }))
      };
      
      const result = validateGameConfig(invalidConfig);
      expect(result).toContain('is not assigned to any group');
    });
  });

  describe('createEmptyGameConfig', () => {
    it('creates config with correct structure', () => {
      const config = createEmptyGameConfig();
      
      expect(config.groups).toHaveLength(4);
      expect(config.squares).toHaveLength(16);
    });

    it('assigns correct difficulties to groups', () => {
      const config = createEmptyGameConfig();
      
      expect(config.groups[0].difficulty).toBe('yellow');
      expect(config.groups[1].difficulty).toBe('green');
      expect(config.groups[2].difficulty).toBe('blue');
      expect(config.groups[3].difficulty).toBe('purple');
    });

    it('creates unique square IDs', () => {
      const config = createEmptyGameConfig();
      const squareIds = new Set(config.squares.map(s => s.id));
      
      expect(squareIds.size).toBe(16);
    });

    it('assigns squares to groups correctly', () => {
      const config = createEmptyGameConfig();
      
      config.groups.forEach(group => {
        expect(group.squares).toHaveLength(4);
        
        group.squares.forEach(squareId => {
          const square = config.squares.find(s => s.id === squareId);
          expect(square).toBeDefined();
          expect(square!.groupId).toBe(group.id);
          expect(square!.difficulty).toBe(group.difficulty);
        });
      });
    });
  });
});