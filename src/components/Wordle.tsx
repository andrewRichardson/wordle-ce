import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import words from '../data/words.json';
import { GuessRow } from './GuessRow';
import { Evaluation, GameState, MAX_GUESSES, WORD_LENGTH } from './types';
import { Keyboard } from './Keyboard';

const Grid = styled.div`
  display: grid;
  margin: auto 0;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  grid-auto-rows: minmax(1rem, auto);
`;

export const Wordle = () => {
  const [answer, setAnswer] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [keys, setKeys] = useState<Map<string, Evaluation>>(new Map());
  const [evaluations, setEvaluations] = useState<Evaluation[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const BLANK_ROWS = MAX_GUESSES - 1 - guesses.length;
  const BLANK_GUESS_SPACES = WORD_LENGTH - currentGuess.length;

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

    const keyMap = new Map(keys);

    for (let i = 0; i < guess.length; i += 1) {
      keyMap.set(guess.charAt(i), Evaluation.WRONG);
      if (guess.charAt(i) === answerLetters[i]) {
        evaluation[i] = Evaluation.CORRECT;
        answerLetters[i] = '';
        numCorrect += 1;
        keyMap.set(guess.charAt(i), Evaluation.CORRECT);
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
        keyMap.set(guess.charAt(i), Evaluation.VALID_LETTER);
      }
    }
    setKeys(keyMap);

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
          {guesses.map((guess, row) => (
            <GuessRow key={uuidv4()} guess={guess} evaluations={evaluations} row={row} />
          ))}
          {guesses.length < MAX_GUESSES && (
            <GuessRow guess={currentGuess} evaluations={evaluations} row={guesses.length} />
          )}
          {new Array(BLANK_ROWS).fill('').map((_, row) => (
            <GuessRow key={uuidv4()} guess="" row={row + guesses.length + 1} />
          ))}
        </Grid>
        <Keyboard keys={keys} />
      </header>
    </div>
  );
};
