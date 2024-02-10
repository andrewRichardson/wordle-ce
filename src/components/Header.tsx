import styled from 'styled-components';
import { Refresh } from '../assets/Refresh';
import { Stats } from '../assets/Stats';
import { useStats } from '../hooks/useStats';

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  font-family: serif;
  font-weight: bold;
  height: 70px;
  width: 100%;
  border-bottom: 2px solid rgb(63 63 70);

  @media (max-height: 1000px) {
    height: 40px;
    border-bottom: 1px solid rgb(63 63 70);
  }

  @media (min-width: 768px) {
    padding: 1rem 0;
    justify-content: center;
  }
`;

const SubHeader = styled.i`
  font-size: 1rem;
  line-height: 1.5rem;
  align-self: center;
`;

const HeaderButtonContainer = styled.div`
  @media (min-width: 768px) {
    position: absolute;
    right: 3rem;
    gap: 2rem;
  }

  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

type HeaderProps = {
  resetGame: () => void;
};

export const Header = ({ resetGame }: HeaderProps) => {
  const { stats } = useStats();
  return (
    <HeaderContainer>
      <h1>
        Wordle <SubHeader>(custom edition)</SubHeader>
      </h1>
      <HeaderButtonContainer>
        <div onClick={resetGame}>
          <Refresh color="white" />
        </div>
        <div onClick={() => console.log(stats)}>
          <Stats color="white" />
        </div>
      </HeaderButtonContainer>
    </HeaderContainer>
  );
};
