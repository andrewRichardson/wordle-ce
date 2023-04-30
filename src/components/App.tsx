import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import words from '../data/words';

enum Evaluation {
  CORRECT = 'correct',
  PRESENT = 'present',
  VALID_LETTER = 'valid',
  WRONG = 'wrong',
}

enum GameState {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

const Grid = styled.div`
  display: grid;
  margin-top: 15rem;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  grid-auto-rows: minmax(1rem, auto);
`;

const LetterSquare = styled.div<{ row: number; col: number; eval?: Evaluation }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: transparent;
  border: 2px solid #3a3a3c;
  grid-column: ${(props) => props.col + 1};
  grid-row: ${(props) => props.row + 1};
  font-weight: bold;

  ${(props) =>
    props.eval === Evaluation.CORRECT &&
    `
    background: #538d4e;
    border: none;
  `}
  ${(props) =>
    props.eval === Evaluation.PRESENT &&
    `
    border: 2px solid #565758;
  `}
  ${(props) =>
    props.eval === Evaluation.VALID_LETTER &&
    `
    background: #b59f3b;
    border: none;
  `}
  ${(props) =>
    props.eval === Evaluation.WRONG &&
    `
    background: #3a3a3c;
    border: none;
  `}
`;

const App = () => {
  const [answer, setAnswer] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);

  const WORD_LENGTH = 5;
  const MAX_GUESSES = 6;
  const BLANK_ROWS = MAX_GUESSES - 1 - guesses.length;
  const BLANK_GUESS_SPACES = WORD_LENGTH - currentGuess.length;

  const BLANK_GUESS_SPACES_PLACEHOLDER = BLANK_GUESS_SPACES > 0 ? new Array(BLANK_GUESS_SPACES).fill('') : [];
  const BLANK_ROWS_PLACEHOLDER = BLANK_ROWS > 0 ? new Array(BLANK_ROWS).fill('') : [];
  const BLANK_WORD_SPACES_PLACEHOLDER = new Array(WORD_LENGTH).fill('');

  const evaluateGuess = (guess: string) => {
    if (!words.includes(guess)) {
      // eslint-disable-next-line no-alert
      window.alert(`${guess} is not a word recognized by Wordle.`);
      return;
    }

    setGuesses([...guesses, currentGuess]);
    setCurrentGuess('');
    const evaluation = new Array(WORD_LENGTH).fill(Evaluation.WRONG);
    const answerLetters = answer.split('');
    let numCorrect = 0;

    for (let i = 0; i < guess.length; i += 1) {
      if (guess.charAt(i) === answerLetters[i]) {
        evaluation[i] = Evaluation.CORRECT;
        answerLetters[i] = '';
        numCorrect += 1;
      }
    }

    if (numCorrect === WORD_LENGTH) {
      setGameState(GameState.WON);
      setEvaluations([...evaluations, evaluation]);
      return;
    }

    for (let i = 0; i < guess.length; i += 1) {
      const index = answerLetters.indexOf(guess.charAt(i));

      if (index !== -1) {
        evaluation[i] = Evaluation.VALID_LETTER;
        answerLetters[index] = '';
      }
    }

    if (guesses.length === MAX_GUESSES - 1) {
      setGameState(GameState.LOST);
    }
    setEvaluations([...evaluations, evaluation]);
  };

  const handleInput = (e: KeyboardEvent) => {
    if (gameState !== GameState.PLAYING || e.ctrlKey) return;

    if (e.key === 'Backspace') {
      setCurrentGuess(currentGuess.substring(0, currentGuess.length - 1));
    }
    if (e.key.length === 1 && /[a-z]/i.test(e.key.toLowerCase())) {
      if (BLANK_GUESS_SPACES > 0) {
        setCurrentGuess(currentGuess + e.key.toUpperCase());
      }
    }
    if (e.key === 'Enter' && currentGuess.length === WORD_LENGTH) {
      evaluateGuess(currentGuess);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleInput);

    return function cleanup() {
      document.removeEventListener('keydown', handleInput);
    };
  });

  useEffect(() => {
    if (answer === '') {
      const random = Math.floor(Math.random() * words.length - 1);
      setAnswer(words[random]);
    }
  }, [setAnswer, answer]);

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-start text-white text-3xl">
        <h1 className="mb-5 font-serif font-bold p-4 w-screen border-b-2 border-gray-700">
          Wordle <i className="text-base">(custom edition)</i>
        </h1>
        <Grid>
          {guesses.map((guess, row) =>
            guess.split('').map((letter, col) => (
              <LetterSquare key={uuidv4()} row={row} col={col} eval={evaluations[row][col]}>
                {letter}
              </LetterSquare>
            ))
          )}
          {guesses.length < MAX_GUESSES && (
            <>
              {currentGuess.split('').map((letter, col) => (
                <LetterSquare key={uuidv4()} row={guesses.length} col={col} eval={Evaluation.PRESENT}>
                  {letter}
                </LetterSquare>
              ))}
              {BLANK_GUESS_SPACES_PLACEHOLDER.map((_, col) => (
                <LetterSquare key={uuidv4()} row={guesses.length} col={col + currentGuess.length} />
              ))}
            </>
          )}
          {BLANK_ROWS_PLACEHOLDER.map((_, row) =>
            BLANK_WORD_SPACES_PLACEHOLDER.map((__, col) => (
              <LetterSquare key={uuidv4()} row={row + guesses.length + 1} col={col} />
            ))
          )}
        </Grid>
      </header>
    </div>
  );
};

export default App;
