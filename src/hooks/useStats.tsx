import { ReactNode, createContext, useContext, useState } from 'react';

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
  stats: Stats;
  addGame: (won: boolean, guesses: number) => Stats;
};

const defaultStatsContext: StatsProps = {
  stats: defaultStats,
  addGame: () => defaultStats,
};

const StatsContext = createContext(defaultStatsContext);

export const useStats = () => useContext(StatsContext);

type StatsProviderProps = {
  children: ReactNode | ReactNode[];
};

const MS_IN_DAY = 8.64e7;

export const StatsProvider = ({ children }: StatsProviderProps) => {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [lastPlayed, setLastPlayed] = useState<Date>(new Date(Date.now()));

  const addGame = (won: boolean, guesses: number) => {
    stats.played = stats.played + 1;
    if (won) {
      stats.wins = stats.wins + 1;
      stats.guesses[guesses - 1] = stats.guesses[guesses - 1] + 1;
    }
    if (Date.now() - lastPlayed.valueOf() < MS_IN_DAY) stats.streak = stats.streak + 1;
    if (stats.streak > stats.longest) stats.longest = stats.streak;

    setStats({ ...stats });
    setLastPlayed(new Date(Date.now()));

    return stats;
  };

  return <StatsContext.Provider value={{ stats, addGame }}>{children}</StatsContext.Provider>;
};
