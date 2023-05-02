import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './Wordle';

test('renders wordle', () => {
  render(<App />);
  const wordleElement = screen.getByText(/Wordle/i);
  expect(wordleElement).toBeInTheDocument();
});
