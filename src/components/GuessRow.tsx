import styled from 'styled-components';
import { Evaluation, WORD_LENGTH } from './types';
import { v4 as uuidv4 } from 'uuid';

export const GuessSquare = styled.div<{ row: number; col: number; eval?: Evaluation }>`
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

type GuessRowProps = {
  guess: string;
  row: number;
  evaluations?: Evaluation[][];
};

export const GuessRow = ({ guess, row, evaluations }: GuessRowProps) => {
  const guessLetters = guess.split('').map((letter, col) => (
    <GuessSquare key={uuidv4()} row={row} col={col} eval={evaluations?.[row]?.[col]}>
      {letter}
    </GuessSquare>
  ));
  const filler = new Array(WORD_LENGTH - guess.length).fill(' ');

  return [
    ...guessLetters,
    ...filler.map((val, col) => (
      <GuessSquare key={uuidv4()} row={row} col={col + guess.length}>
        {val}
      </GuessSquare>
    )),
  ];
};
