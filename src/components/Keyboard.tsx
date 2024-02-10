import styled from 'styled-components';
import { Evaluation } from './types';
import { Backspace } from '../assets/Backspace';
import { v4 as uuidv4 } from 'uuid';

const KeyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 8px;
  padding: 0 0.5rem;

  @media (max-height: 768px) {
    display: none;
  }
`;

const KeyRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const BaseKey = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  height: 58px;
  margin-right: 6px;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  color: white;
  fill: white;
`;

const KeyButton = styled(BaseKey)<{ $eval?: Evaluation }>`
  background: #818384;
  font-size: 1.25rem;

  ${(props) =>
    props.$eval === Evaluation.CORRECT &&
    `
    background: #538d4e;
  `}
  ${(props) =>
    props.$eval === Evaluation.VALID_LETTER &&
    `
    background: #b59f3b;
  `}
  ${(props) =>
    props.$eval === Evaluation.WRONG &&
    `
    background: #3a3a3c;
  `}
`;

const ActionButton = styled(BaseKey)`
  flex: 1.5;
  background: #818384;
  font-size: 0.75rem;
`;

const Spacer = styled.div`
  content: '';
  display: flex;
  height: 58px;
  flex: 0.5;
`;

type KeyboardProps = {
  keys: Map<string, Evaluation>;
  onPress: (key: string) => void;
};

const KeyTopRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const KeyMiddleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const KeyBottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

export const Keyboard = ({ keys, onPress }: KeyboardProps) => {
  return (
    <KeyContainer>
      <KeyRow>
        {KeyTopRow.map((key) => (
          <KeyButton key={uuidv4()} onClick={() => onPress(key)} $eval={keys.get(key)}>
            {key}
          </KeyButton>
        ))}
      </KeyRow>
      <KeyRow>
        <Spacer />
        {KeyMiddleRow.map((key) => (
          <KeyButton key={uuidv4()} onClick={() => onPress(key)} $eval={keys.get(key)}>
            {key}
          </KeyButton>
        ))}
        <Spacer />
      </KeyRow>
      <KeyRow>
        <ActionButton onClick={() => onPress('Enter')}>ENTER</ActionButton>
        {KeyBottomRow.map((key) => (
          <KeyButton key={uuidv4()} onClick={() => onPress(key)} $eval={keys.get(key)}>
            {key}
          </KeyButton>
        ))}
        <ActionButton key={uuidv4()} onClick={() => onPress('Backspace')}>
          <Backspace />
        </ActionButton>
      </KeyRow>
    </KeyContainer>
  );
};
