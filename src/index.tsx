import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Wordle } from './components/Wordle';
import { StatsProvider } from './hooks/useStats';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <StatsProvider>
      <Wordle />
    </StatsProvider>
  </React.StrictMode>,
);
