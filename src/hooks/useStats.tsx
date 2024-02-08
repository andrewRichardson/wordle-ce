import { ReactNode, createContext, useContext, useState } from 'react';

type StatsProps = {
  played: number;
  wins: number;
  streak: number;
  longest: number;
  guesses: number[];
};

const defaultStats: StatsProps = {
  played: 0,
  wins: 0,
  streak: 0,
  longest: 0,
  guesses: [0, 0, 0, 0, 0, 0],
};

const StatsContext = createContext(defaultStats);

export const useStats = useContext<StatsProps>(StatsContext);

type StatsProviderProps = {
  children: ReactNode | ReactNode[];
};

export const StatsProvider = ({ children }: StatsProviderProps) => {
  const [stats, setStats] = useState(defaultStats);

  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>;
};
