import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import words from '../data/words.json';
import { GuessRow } from './GuessRow';
import { Evaluation, GameState, MAX_GUESSES, WORD_LENGTH } from './types';
import { Keyboard } from './Keyboard';
import { useStats } from '../hooks/useStats';
import { Header } from './Header';

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

const Board = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Grid = styled.div`
  width: 350px;
  height: 420px;
  max-height: 100%;
  margin: 1.25rem 0;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 5px;
  padding: 10px;
  box-sizing: border-box;

  @media (max-height: 1000px) {
    margin: 0;
    width: 330px;
    height: 400px;
  }
  @media (max-height: 768px) {
    width: 300px;
    height: 360px;
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

    if (!words.includes(guess)) {
      // eslint-disable-next-line no-alert
      window.alert(`${guess} is not a word recognized by Wordle.`);
      return;
    }

    setRow(row + 1);
    setCol(0);
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

    if (row === MAX_GUESSES - 1) {
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
    if (gameState !== GameState.PLAYING || (typeof e !== 'string' && e.ctrlKey)) return;

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
      const random = Math.floor(Math.random() * words.length - 1);
      setAnswer(words[random]);
    }
  }, [setAnswer, answer]);

  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
      const newStats = addGame(gameState === GameState.WON, row);
      console.log(newStats);
    }
  }, [gameState]);

  return (
    <GameContainer>
      <Header resetGame={resetGame} />
      <BoardContainer>
        <Board>
          <Grid>
            {board.map((word, row) => (
              <GuessRow key={uuidv4()} guess={word.join('')} evaluations={evaluations?.[row]} />
            ))}
          </Grid>
        </Board>
        <Keyboard keys={keys} onPress={(key) => handleInput(key)} />
      </BoardContainer>
    </GameContainer>
  );
};
