import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Wordle from './components/Wordle';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Wordle />
  </React.StrictMode>,
);
