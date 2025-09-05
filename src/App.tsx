import React, { useEffect, useState } from 'react';
import { Game } from './components/Game/Game';
import { Admin } from './components/Admin/Admin';
import { GameConfig } from './game/types';
import { getGameFromURLV2 } from './game/urlEncodingV2';
import { getBaseUrl, createAdminUrl } from './utils/urlUtils';
import './App.css';

const DEFAULT_GAME: GameConfig = {
  groups: [
    {
      id: 'group-0',
      difficulty: 'yellow',
      connection: 'TYPES OF FISH',
      squares: ['square-0', 'square-1', 'square-2', 'square-3']
    },
    {
      id: 'group-1',
      difficulty: 'green',
      connection: 'FAMOUS PAINTERS',
      squares: ['square-4', 'square-5', 'square-6', 'square-7']
    },
    {
      id: 'group-2',
      difficulty: 'blue',
      connection: 'PROGRAMMING LANGUAGES',
      squares: ['square-8', 'square-9', 'square-10', 'square-11']
    },
    {
      id: 'group-3',
      difficulty: 'purple',
      connection: 'THINGS THAT FLY',
      squares: ['square-12', 'square-13', 'square-14', 'square-15']
    }
  ],
  squares: [
    { id: 'square-0', text: 'BASS', groupId: 'group-0', difficulty: 'yellow' },
    { id: 'square-1', text: 'FLOUNDER', groupId: 'group-0', difficulty: 'yellow' },
    { id: 'square-2', text: 'SALMON', groupId: 'group-0', difficulty: 'yellow' },
    { id: 'square-3', text: 'TROUT', groupId: 'group-0', difficulty: 'yellow' },
    { id: 'square-4', text: 'MONET', groupId: 'group-1', difficulty: 'green' },
    { id: 'square-5', text: 'PICASSO', groupId: 'group-1', difficulty: 'green' },
    { id: 'square-6', text: 'DALI', groupId: 'group-1', difficulty: 'green' },
    { id: 'square-7', text: 'WARHOL', groupId: 'group-1', difficulty: 'green' },
    { id: 'square-8', text: 'PYTHON', groupId: 'group-2', difficulty: 'blue' },
    { id: 'square-9', text: 'JAVA', groupId: 'group-2', difficulty: 'blue' },
    { id: 'square-10', text: 'RUST', groupId: 'group-2', difficulty: 'blue' },
    { id: 'square-11', text: 'GO', groupId: 'group-2', difficulty: 'blue' },
    { id: 'square-12', text: 'TIME', groupId: 'group-3', difficulty: 'purple' },
    { id: 'square-13', text: 'KITE', groupId: 'group-3', difficulty: 'purple' },
    { id: 'square-14', text: 'PILOT', groupId: 'group-3', difficulty: 'purple' },
    { id: 'square-15', text: 'CROW', groupId: 'group-3', difficulty: 'purple' }
  ]
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
    
    const gameFromUrl = getGameFromURLV2();
    if (gameFromUrl) {
      setGameConfig(gameFromUrl);
    } else if (!params.get('admin')) {
      setGameConfig(DEFAULT_GAME);
    }
  }, []);
  
  if (isAdmin) {
    return (
      <>
        <a href={getBaseUrl()} className="home-link">← Back to Game</a>
        <Admin />
      </>
    );
  }
  
  if (!gameConfig) {
    return (
      <div className="no-game">
        <h1>No Game Found</h1>
        <p>Please provide a game URL or <a href={createAdminUrl()}>create a new game</a>.</p>
      </div>
    );
  }
  
  return (
    <>
      <a href={createAdminUrl()} className="admin-link">Create Puzzle</a>
      <Game config={gameConfig} />
    </>
  );
}

export default App;
