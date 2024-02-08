export enum Evaluation {
  CORRECT = 'correct',
  PRESENT = 'present',
  VALID_LETTER = 'valid',
  WRONG = 'wrong',
}

export enum GameState {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
