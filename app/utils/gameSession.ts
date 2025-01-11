import { texts } from '../data/texts';

export interface GameSession {
  id: string;
  textIds: number[];
  originalScore?: number;
  originalPlayer?: string;
  timestamp: number;
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function createGameSession(textIds: number[], playerName?: string, score?: number): GameSession {
  return {
    id: generateSessionId(),
    textIds,
    originalScore: score,
    originalPlayer: playerName,
    timestamp: Date.now(),
  };
}

export function encodeGameSession(session: GameSession): string {
  const encoded = btoa(JSON.stringify(session));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeGameSession(encoded: string): GameSession | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const decoded = atob(padded);
    const session = JSON.parse(decoded) as GameSession;
    
    // Validate session data
    if (!session.id || !Array.isArray(session.textIds) || !session.timestamp) {
      return null;
    }
    
    // Validate text IDs exist in our database
    if (!session.textIds.every(id => texts.some(text => text.id === id))) {
      return null;
    }
    
    return session;
  } catch (e) {
    console.error('Failed to decode game session:', e);
    return null;
  }
}

export function getTextsForSession(session: GameSession) {
  return session.textIds.map(id => texts.find(text => text.id === id)!);
} 