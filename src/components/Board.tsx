import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { GuessRow } from './GuessRow';
import { Evaluation } from './types';

const GridContainer = styled.div`
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
type BoardProps = {
  board: string[][];
  evaluations: Evaluation[][];
};

export const Board = ({ board, evaluations }: BoardProps) => {
  return (
    <GridContainer>
      <Grid>
        {board.map((word, row) => (
          <GuessRow key={uuidv4()} guess={word.join('')} evaluations={evaluations?.[row]} />
        ))}
      </Grid>
    </GridContainer>
  );
};
