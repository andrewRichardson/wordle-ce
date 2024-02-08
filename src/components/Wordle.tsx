import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import words from '../data/words.json';
import { GuessRow } from './GuessRow';
import { Evaluation, GameState, MAX_GUESSES, WORD_LENGTH } from './types';
import { Keyboard } from './Keyboard';
import { Refresh } from '../assets/Refresh';

const GameContainer = styled.main`
  text-align: center;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  color: white;
  font-size: 1.875rem;
  line-height: 2.25rem;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  font-family: serif;
  font-weight: bold;
  width: 100%;
  border-bottom: 2px solid rgb(63 63 70);

  h1 {
    flex-grow: 1;
  }

  div {
    cursor: pointer;
    position: absolute;
  }
`;

const BoardContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: 100%;
  padding-bottom: 14rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;

const Board = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
`;

const Grid = styled.div`
  width: 350px;
  height: 420px;
  margin: 1.25rem 0;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 5px;
  padding: 10px;
`;

export const Wordle = () => {
  const [answer, setAnswer] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [keys, setKeys] = useState<Map<string, Evaluation>>(new Map());
  const [evaluations, setEvaluations] = useState<Evaluation[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);

  const blankRows = MAX_GUESSES - 1 - guesses.length;
  const blankGuessSpaces = WORD_LENGTH - currentGuess.length;

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

    evaluation.forEach((evaluation: Evaluation, index: number) => {
      const key = guess[index];
      const currentEval = keys.get(key) ?? 0;
      if (currentEval === undefined || currentEval > evaluation) return;

      keys.set(key, evaluation);
    });

    setKeys(new Map(keys));
  };

  const updateGuess = (key: string) => {
    if (key === 'Backspace') {
      setCurrentGuess(currentGuess.substring(0, currentGuess.length - 1));
    }
    if (key.length === 1 && /[a-z]/i.test(key.toLowerCase())) {
      if (blankGuessSpaces > 0) {
        setCurrentGuess(currentGuess + key.toUpperCase());
      }
    }
    if (key === 'Enter' && currentGuess.length === WORD_LENGTH) {
      evaluateGuess(currentGuess);
    }
  };

  const handleInput = (e: KeyboardEvent | string) => {
    if (gameState !== GameState.PLAYING || (typeof e !== 'string' && e.ctrlKey)) return;

    updateGuess(typeof e === 'string' ? e : e.key);
  };

  const resetGame = () => {
    setAnswer('');
    setGuesses([]);
    setKeys(new Map());
    setEvaluations([]);
    setCurrentGuess('');
    setGameState(GameState.PLAYING);
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
    <GameContainer>
      <Header>
        <h1>
          Wordle <i className="text-base">(custom edition)</i>
        </h1>
        {gameState !== GameState.PLAYING && (
          <div onClick={resetGame}>
            <Refresh color="white" />
          </div>
        )}
      </Header>
      <BoardContainer>
        <Board>
          <Grid>
            {guesses.map((guess, row) => (
              <GuessRow key={uuidv4()} guess={guess} evaluations={evaluations[row]} />
            ))}
            {guesses.length < MAX_GUESSES && (
              <GuessRow guess={currentGuess} evaluations={evaluations?.[evaluations.length]} />
            )}
            {new Array(blankRows).fill('').map(() => (
              <GuessRow key={uuidv4()} guess="" />
            ))}
          </Grid>
        </Board>
        <Keyboard keys={keys} onPress={(key) => handleInput(key)} />
      </BoardContainer>
    </GameContainer>
  );
};
