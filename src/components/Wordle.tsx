import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import words from '../data/words.json';
import answers from '../data/answers.json';
import { Evaluation, GAMEOVER_DELAY, GameState, MAX_GUESSES, WORD_LENGTH } from './types';
import { Keyboard } from './Keyboard';
import { useStats } from '../hooks/useStats';
import { Header } from './Header';
import { Board } from './Board';

const GameContainer = styled.main`
  text-align: center;
  height: calc(100% - 200px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  color: white;
  font-size: 1.875rem;
  line-height: 2.25rem;

  @media (max-height: 1000px) {
    height: 100%;
    overflow: unset;
  }
`;

const BoardContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  flex-grow: 1;

  @media (max-height: 1000px) {
    height: calc(100% - 40px);
    overflow: unset;
  }
`;

const emptyBoard = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

export const Wordle = () => {
  const [answer, setAnswer] = useState<string>('');
  const [keys, setKeys] = useState<Map<string, Evaluation>>(new Map());
  const [evaluations, setEvaluations] = useState<Evaluation[][]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const { addGame } = useStats();

  const [board, setBoard] = useState<string[][]>(emptyBoard.map((row) => row.map((col) => col)));
  const [row, setRow] = useState<number>(0);
  const [col, setCol] = useState<number>(0);

  const evaluateGuess = () => {
    const guess = board[row].join('');

    if (!words.includes(guess) && !answers.includes(guess)) {
      // eslint-disable-next-line no-alert
      window.alert(`${guess} is not a word recognized by Wordle.`);
      return;
    }

    setRow(row + 1);
    setCol(0);
    const evaluation = new Array(WORD_LENGTH).fill(Evaluation.WRONG);
    const answerLetterMap = new Map();
    const answerLetters = answer.split('');
    answerLetters.forEach((letter) => answerLetterMap.set(letter, (answerLetterMap.get(letter) ?? 0) + 1));

    let numCorrect = 0;

    for (let i = 0; i < guess.length; i += 1) {
      const letter = guess.charAt(i);
      if (letter === answerLetters[i]) {
        const lettersLeft = answerLetterMap.get(letter);
        if (lettersLeft && lettersLeft > 0) answerLetterMap.set(letter, lettersLeft - 1);
        else answerLetterMap.delete(letter);

        evaluation[i] = Evaluation.CORRECT;
        numCorrect += 1;
      }
    }

    if (numCorrect === WORD_LENGTH) {
      setEvaluations([...evaluations, evaluation]);
      setGameState(GameState.WON);
      return;
    }

    for (let i = 0; i < guess.length; i += 1) {
      const letter = guess.charAt(i);

      const lettersLeft = answerLetterMap.get(letter);
      if (lettersLeft && lettersLeft > 0 && evaluation[i] === Evaluation.WRONG) {
        answerLetterMap.set(letter, lettersLeft - 1);
        evaluation[i] = Evaluation.VALID_LETTER;
      } else answerLetterMap.delete(letter);
    }
    setEvaluations([...evaluations, evaluation]);

    evaluation.forEach((evaluation: Evaluation, index: number) => {
      const key = guess[index];
      const currentEval = keys.get(key) ?? 0;
      if (currentEval === undefined || currentEval > evaluation) return;

      keys.set(key, evaluation);
    });

    setKeys(new Map(keys));

    if (row === MAX_GUESSES - 1) {
      setGameState(GameState.LOST);
    }
  };

  const updateGuess = (key: string) => {
    if (key === 'Backspace') {
      board[row][col] = '';
      if (board[row]?.[col - 1]) board[row][col - 1] = '';

      setBoard([...board]);
      setCol(Math.max(col - 1, 0));
    }
    if (key.length === 1 && /[a-z]/i.test(key.toLowerCase())) {
      if (col < WORD_LENGTH) {
        board[row][col] = key.toUpperCase();
        setBoard([...board]);
        setCol(col + 1);
      }
    }
    if (key === 'Enter' && col === WORD_LENGTH) {
      evaluateGuess();
    }
  };

  const handleInput = (e: KeyboardEvent | string) => {
    if (typeof e !== 'string' && e.ctrlKey) return;
    if (gameState !== GameState.PLAYING) {
      if (typeof e !== 'string' && e.key === 'Enter') resetGame();
      return;
    }

    updateGuess(typeof e === 'string' ? e : e.key);
  };

  const resetGame = () => {
    setAnswer('');
    setKeys(new Map());
    setEvaluations([]);
    setBoard(emptyBoard.map((row) => row.map((col) => col)));
    setRow(0);
    setCol(0);
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
      const random = Math.floor(Math.random() * answers.length - 1);
      setAnswer(answers[random]);
    }
  }, [setAnswer, answer]);

  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
      setTimeout(() => addGame(gameState === GameState.WON, row), GAMEOVER_DELAY);
    }
  }, [gameState]);

  return (
    <GameContainer>
      <Header resetGame={resetGame} />
      <BoardContainer>
        <Board board={board} evaluations={evaluations} />
        <Keyboard keys={keys} onPress={(key) => handleInput(key)} />
      </BoardContainer>
    </GameContainer>
  );
};
