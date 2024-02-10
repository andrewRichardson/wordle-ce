import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEY } from '../components/types';

type Stats = {
  played: number;
  wins: number;
  streak: number;
  longest: number;
  guesses: number[];
};

const defaultStats: Stats = {
  played: 0,
  wins: 0,
  streak: 0,
  longest: 0,
  guesses: [0, 0, 0, 0, 0, 0],
};

type StatsProps = {
  addGame: (won: boolean, guesses: number) => void;
  showStats: () => void;
};

const defaultStatsContext: StatsProps = {
  addGame: () => {},
  showStats: () => {},
};

const StatsContext = createContext(defaultStatsContext);

export const useStats = () => useContext(StatsContext);

type StatsProviderProps = {
  children: ReactNode | ReactNode[];
};

const getDistributionBars = (guesses: number[], width: number, wins: number) =>
  guesses.map(
    (num, index) => `${index + 1} |${new Array(Math.ceil((wins !== 0 ? num / wins : 0) * width)).fill('█').join('')}`,
  );

export const StatsProvider = ({ children }: StatsProviderProps) => {
  const [stats, setStats] = useState<Stats>();

  const addGame = (won: boolean, guesses: number) => {
    if (!stats) return;

    stats.played = stats.played + 1;
    if (won) {
      stats.wins = stats.wins + 1;
      stats.guesses[guesses - 1] = stats.guesses[guesses - 1] + 1;
      stats.streak = stats.streak + 1;
    } else {
      stats.streak = 0;
    }
    if (stats.streak > stats.longest) stats.longest = stats.streak;

    setStats({ ...stats });

    if (window) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

    showStats();
  };

  useEffect(() => {
    if (!stats) {
      let newStats = defaultStats;
      if (window) {
        try {
          const rawStats = window?.localStorage?.getItem(STORAGE_KEY);
          if (rawStats) newStats = JSON.parse(rawStats);
        } catch {
          console.error('Error: Could not parse stats.');
        }
      }
      setStats(newStats);
    }
  }, []);

  const showStats = () => {
    if (!stats) return;

    const { played, wins, streak, longest, guesses } = stats;
    const message = `Games played: ${played} (Win Percentage: ${played !== 0 ? Math.ceil(100 * (wins / played)) : 0}%)\nStreak: ${streak} (Longest: ${longest})\nGuesses:\n${getDistributionBars(guesses, 8, wins).join('\n')}`;
    // eslint-disable-next-line no-alert
    window.alert(message);
  };

  return <StatsContext.Provider value={{ addGame, showStats }}>{children}</StatsContext.Provider>;
};
