import styled from 'styled-components';
import { Evaluation } from './types';
import { Backspace } from '../assets/Backspace';

const KeyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;

  color: white;
  fill: white;
  margin-bottom: 0.5rem;
`;

const KeyRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.45rem;
  justify-content: center;
  align-items: center;
`;

const KeyButton = styled.div<{ eval?: Evaluation }>`
  background: #818384;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 4rem;
  border-radius: 0.35rem;
  font-size: 1.25rem;
  font-weight: bold;

  ${(props) =>
    props.eval === Evaluation.CORRECT &&
    `
    background: #538d4e;
  `}
  ${(props) =>
    props.eval === Evaluation.VALID_LETTER &&
    `
    background: #b59f3b;
  `}
  ${(props) =>
    props.eval === Evaluation.WRONG &&
    `
    background: #3a3a3c;
  `}
`;

const ActionButton = styled.div`
  background: #818384;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 4rem;
  border-radius: 0.35rem;
  font-size: 1rem;
  font-weight: bold;
`;

type KeyboardProps = {
  keys: Map<string, Evaluation>;
};

const KeyTopRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const KeyMiddleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const KeyBottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

export const Keyboard = ({ keys }: KeyboardProps) => {
  console.log(keys);
  return (
    <KeyContainer>
      <KeyRow>
        {KeyTopRow.map((key) => (
          <KeyButton eval={keys.get(key)}>{key}</KeyButton>
        ))}
      </KeyRow>
      <KeyRow>
        {KeyMiddleRow.map((key) => (
          <KeyButton eval={keys.get(key)}>{key}</KeyButton>
        ))}
      </KeyRow>
      <KeyRow>
        <ActionButton>ENTER</ActionButton>
        {KeyBottomRow.map((key) => (
          <KeyButton eval={keys.get(key)}>{key}</KeyButton>
        ))}
        <ActionButton>
          <Backspace />
        </ActionButton>
      </KeyRow>
    </KeyContainer>
  );
};
