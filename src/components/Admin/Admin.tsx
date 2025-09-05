import React, { useState } from 'react';
import { AdminSquare } from './AdminSquare';
import { GameConfig } from '../../game/types';
import { createEmptyGameConfig, validateGameConfig, DIFFICULTY_COLORS } from '../../game/validation';
import { generateGameURLV2 } from '../../game/urlEncodingV2';
import './Admin.css';

export const Admin: React.FC = () => {
  const [config, setConfig] = useState<GameConfig>(createEmptyGameConfig());
  const [gameUrl, setGameUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const handleSquareTextChange = (squareId: string, text: string) => {
    setConfig(prev => ({
      ...prev,
      squares: prev.squares.map(s => 
        s.id === squareId ? { ...s, text } : s
      )
    }));
  };
  
  const handleConnectionChange = (groupId: string, connection: string) => {
    setConfig(prev => ({
      ...prev,
      groups: prev.groups.map(g => 
        g.id === groupId ? { ...g, connection } : g
      )
    }));
  };
  
  const generateLink = () => {
    const validationError = validateGameConfig(config);
    if (validationError) {
      setError(validationError);
      setGameUrl('');
      return;
    }
    
    const url = generateGameURLV2(config, false);
    setGameUrl(url);
    setError('');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameUrl);
  };
  
  return (
    <div className="admin">
      <h1>Create Connections Game</h1>
      
      <div className="admin-grid">
        {config.groups.map((group) => (
          <div key={group.id} className="admin-group">
            <input
              type="text"
              value={group.connection}
              onChange={(e) => handleConnectionChange(group.id, e.target.value)}
              className="connection-input"
              placeholder="Enter category name..."
              style={{
                borderColor: DIFFICULTY_COLORS[group.difficulty]
              }}
            />
            <div className="admin-group-squares">
              {group.squares.map(squareId => {
                const square = config.squares.find(s => s.id === squareId)!;
                return (
                  <AdminSquare
                    key={square.id}
                    square={square}
                    onTextChange={(text) => handleSquareTextChange(square.id, text)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <button onClick={generateLink} className="generate-button">
        Generate Game Link
      </button>
      
      {gameUrl && (
        <div className="url-section">
          <input
            type="text"
            value={gameUrl}
            readOnly
            className="url-input"
          />
          <button onClick={copyToClipboard} className="copy-button">
            Copy
          </button>
          <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="preview-link">
            Preview Game
          </a>
        </div>
      )}
    </div>
  );
};