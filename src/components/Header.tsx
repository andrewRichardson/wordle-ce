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
    font-weight: bold;
    height: 70px;
    width: 100%;
    border-bottom: 2px solid rgb(63 63 70);
    box-sizing: border-box;

    @media (max-height: 1000px) {
        height: 40px;
        border-bottom: 1px solid rgb(63 63 70);
    }

    @media (min-width: 768px) {
        padding: 1rem 0;
        justify-content: center;
    }
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

const Button = styled.div`
    color: white;
    fill: white;

    &:hover {
        color: lightgray;
        fill: lightgray;
    }

    &:active {
        color: gray;
        fill: gray;
    }
`;

type HeaderProps = {
    resetGame: () => void;
};

export const Header = ({ resetGame }: HeaderProps) => {
    const { showStats } = useStats();
    return (
        <HeaderContainer>
            <h1>WORDLE (ce)</h1>
            <HeaderButtonContainer>
                <Button onClick={resetGame}>
                    <Refresh />
                </Button>
                <Button onClick={showStats}>
                    <Stats />
                </Button>
            </HeaderButtonContainer>
        </HeaderContainer>
    );
};
