export enum Evaluation {
  CORRECT = 3,
  PRESENT = 2,
  VALID_LETTER = 1,
  WRONG = 0,
}

export enum GameState {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
