import { encodeGameConfig, decodeGameConfig, generateGameURL } from './urlEncoding';
import { GameConfig } from './types';

describe('urlEncoding', () => {
  const testConfig: GameConfig = {
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

  describe('encodeGameConfig and decodeGameConfig', () => {
    it('encodes and decodes config correctly', () => {
      const encoded = encodeGameConfig(testConfig);
      const decoded = decodeGameConfig(encoded);
      
      expect(decoded).toBeTruthy();
      expect(decoded!.groups).toHaveLength(4);
      expect(decoded!.squares).toHaveLength(16);
      
      // Check group connections
      expect(decoded!.groups[0].connection).toBe('Animals');
      expect(decoded!.groups[1].connection).toBe('Colors');
      expect(decoded!.groups[2].connection).toBe('Numbers');
      expect(decoded!.groups[3].connection).toBe('Food');
      
      // Check difficulties
      expect(decoded!.groups[0].difficulty).toBe('yellow');
      expect(decoded!.groups[1].difficulty).toBe('green');
      expect(decoded!.groups[2].difficulty).toBe('blue');
      expect(decoded!.groups[3].difficulty).toBe('purple');
      
      // Check square texts
      expect(decoded!.squares[0].text).toBe('DOG');
      expect(decoded!.squares[4].text).toBe('RED');
      expect(decoded!.squares[8].text).toBe('ONE');
      expect(decoded!.squares[12].text).toBe('PIZZA');
    });

    it('handles special characters in text', () => {
      const configWithSpecialChars: GameConfig = {
        ...testConfig,
        squares: testConfig.squares.map((s, i) => ({
          ...s,
          text: i === 0 ? "Test's & \"quotes\"" : s.text
        }))
      };
      
      const encoded = encodeGameConfig(configWithSpecialChars);
      const decoded = decodeGameConfig(encoded);
      
      expect(decoded).toBeTruthy();
      expect(decoded!.squares[0].text).toBe("Test's & \"quotes\"");
    });

    it('returns null for invalid encoded string', () => {
      expect(decodeGameConfig('invalid-base64')).toBe(null);
      expect(decodeGameConfig('')).toBe(null);
    });

    it('returns null for malformed JSON', () => {
      const malformedBase64 = btoa('not valid json');
      expect(decodeGameConfig(malformedBase64)).toBe(null);
    });

    it('returns null for wrong structure', () => {
      const wrongStructure = btoa(JSON.stringify({ wrong: 'structure' }));
      expect(decodeGameConfig(wrongStructure)).toBe(null);
    });
  });

  describe('generateGameURL', () => {
    beforeEach(() => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://localhost:3000',
          pathname: '/',
          search: ''
        },
        writable: true
      });
    });

    it('generates game URL correctly', () => {
      const url = generateGameURL(testConfig);
      
      expect(url).toContain('http://localhost:3000/');
      expect(url).toContain('?game=');
      
      const params = new URLSearchParams(url.split('?')[1]);
      const encoded = params.get('game');
      
      expect(encoded).toBeTruthy();
      expect(decodeGameConfig(encoded!)).toBeTruthy();
    });

    it('generates admin URL correctly', () => {
      const url = generateGameURL(testConfig, true);
      
      expect(url).toContain('http://localhost:3000/');
      expect(url).toContain('?game=');
      expect(url).toContain('&admin=true');
      
      const params = new URLSearchParams(url.split('?')[1]);
      expect(params.get('admin')).toBe('true');
    });
  });
});