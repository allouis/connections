import React, { useState, useEffect } from 'react';
import { GameState } from '../../game/types';
import { generateShareTextWithLink } from '../../utils/shareUtils';
import './ShareModal.css';

interface ShareModalProps {
  gameState: GameState;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ gameState, onClose }) => {
  const [shareText] = useState(() => generateShareTextWithLink(gameState));
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Share Your Results</h3>
        <pre className="share-text">{shareText}</pre>
        <div className="share-modal-buttons">
          <button className="copy-button" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};