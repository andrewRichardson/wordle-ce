import styled from 'styled-components';
import { Evaluation, WORD_LENGTH } from './types';
import { v4 as uuidv4 } from 'uuid';

const GuessRowContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
    box-sizing: border-box;
`;

const GuessSquare = styled.div<{ $eval?: Evaluation }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: transparent;
    border: 2px solid #3a3a3c;
    font-weight: bold;
    height: fit-content;
    box-sizing: border-box;

    &::before {
        content: '';
        display: inline-block;
        padding-bottom: 100%;
    }

    ${(props) =>
        props.$eval === Evaluation.CORRECT &&
        `
    background: #538d4e;
    border: none;
  `}
    ${(props) =>
        props.$eval === Evaluation.PRESENT &&
        `
    border: 2px solid #565758;
  `}
  ${(props) =>
        props.$eval === Evaluation.VALID_LETTER &&
        `
    background: #b59f3b;
    border: none;
  `}
  ${(props) =>
        props.$eval === Evaluation.WRONG &&
        `
    background: #3a3a3c;
    border: none;
  `}
`;

type GuessRowProps = {
    guess: string;
    evaluations?: Evaluation[];
};

export const GuessRow = ({ guess, evaluations }: GuessRowProps) => {
    const guessLetters = guess.split('').map((letter, col) => (
        <GuessSquare key={uuidv4()} $eval={evaluations?.[col] ?? Evaluation.PRESENT}>
            {letter}
        </GuessSquare>
    ));
    const filler = new Array(WORD_LENGTH - guess.length)
        .fill(' ')
        .map((val) => <GuessSquare key={uuidv4()}>{val}</GuessSquare>);

    return (
        <GuessRowContainer>
            {guessLetters}
            {filler}
        </GuessRowContainer>
    );
};
