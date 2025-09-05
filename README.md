# Connections Game

A web-based implementation of the New York Times Connections puzzle game built with React and TypeScript.

## Features

- 🎮 Play pre-made puzzles or create your own
- 🎨 Clean, NYT-inspired design
- 📱 Fully responsive
- 🔗 Share results with emoji grids
- 💾 Games encoded in URL for easy sharing
- 🎯 4 difficulty levels (yellow, green, blue, purple)

## Play the Game

Visit the live demo: [https://allouis.github.io/connections](https://allouis.github.io/connections)

To create your own puzzle, add `?admin=true` to the URL.

## URL Optimization

The game uses advanced compression techniques to create compact shareable URLs:
- LZ-string compression reduces URL length by ~60-70%
- Optimized data format stores only essential information
- Backwards compatible with older URL formats

## Development

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/allouis/connections.git
cd connections
npm install
```

### Running Locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to play the game.

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Deployment

This project is set up for easy deployment to GitHub Pages.

### Initial Setup

1. Update the `homepage` field in `package.json` with your GitHub username and repository name:
   ```json
   "homepage": "https://yourusername.github.io/connections-game"
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

3. Go to your repository settings on GitHub
4. Under "Pages", ensure the source is set to the `gh-pages` branch

The game will be available at your GitHub Pages URL after a few minutes.

## Project Structure

```
src/
├── components/          # React UI components
│   ├── Admin/          # Game creation interface
│   ├── Board/          # 4x4 game board
│   ├── Game/           # Main game container
│   ├── GameOver/       # End game screen
│   ├── LivesDisplay/   # Remaining attempts indicator
│   ├── ShareModal/     # Share results modal
│   └── Square/         # Individual game squares
├── game/               # Core game logic (testable, pure functions)
│   ├── gameState.ts    # Game state management
│   ├── types.ts        # TypeScript type definitions
│   ├── urlEncoding.ts  # URL encoding/decoding (legacy)
│   ├── urlEncodingV2.ts # Optimized URL encoding
│   └── validation.ts   # Game configuration validation
├── hooks/              # Custom React hooks
└── utils/              # Utility functions

```

## Creating Custom Puzzles

1. Visit the admin interface by adding `?admin=true` to the URL
2. Fill in category names for each difficulty level
3. Enter 4 items for each category
4. Click "Generate Game Link"
5. Share the generated URL with players

## Technologies Used

- React 19
- TypeScript
- CSS Modules
- LZ-String compression
- GitHub Pages

## License

MIT
